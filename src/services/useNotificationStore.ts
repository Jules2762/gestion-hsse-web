import { defineStore } from "pinia";
import type { notificationType } from "../@types/notification.type";
import notificationApi from "../core/api/notification.api";

let pollTimer: number | null = null;
let hasFocusListener = false;

const useNotificationStore = defineStore("notifications", {
    state: () => ({
        data: [] as notificationType[],
        unreadCount: 0,
        isLoading: false,
    }),
    getters: {
        getData: (state) => state.data,
        getUnreadCount: (state) => {
            return state.data.filter((n) => !n.viewed).length || state.unreadCount;
        },
    },
    actions: {
        add(value: notificationType): void {
            this.data.unshift(value);
            if (!value.viewed) {
                this.unreadCount++;
            }
        },

        async fetchNotifications() {
            try {
                this.isLoading = true;
                const res = await notificationApi.index();
                if (res?.data) {
                    this.data = res.data.data || [];
                    this.unreadCount = res.data.unread_count ?? this.data.filter((n) => !n.viewed).length;
                }
            } catch (err) {
                // Handled globally by api interceptor for 401/403
            } finally {
                this.isLoading = false;
            }
        },

        async viewed() {
            // Optimistic update
            this.data.forEach((item) => {
                item.viewed = true;
            });
            this.unreadCount = 0;

            try {
                await notificationApi.markAllRead();
            } catch (err) {
                // Ignore error
            }
        },

        async markAllRead() {
            await this.viewed();
        },

        async markOneRead(id: string) {
            const item = this.data.find((n) => n.id === id);
            if (item && !item.viewed) {
                item.viewed = true;
                this.unreadCount = Math.max(0, this.unreadCount - 1);
            }

            try {
                await notificationApi.markAsRead(id);
            } catch (err) {
                // Ignore error
            }
        },

        async deleteOne(target: number | string) {
            let id = "";
            let idx = -1;

            if (typeof target === "number") {
                idx = target;
                id = this.data[idx]?.id || "";
            } else {
                id = target;
                idx = this.data.findIndex((n) => n.id === id);
            }

            if (idx >= 0 && idx < this.data.length) {
                const wasUnread = !this.data[idx].viewed;
                this.data.splice(idx, 1);
                if (wasUnread) {
                    this.unreadCount = Math.max(0, this.unreadCount - 1);
                }
            }

            if (id) {
                try {
                    await notificationApi.destroy(id);
                } catch (err) {
                    // Ignore error
                }
            }
        },

        async clearAll() {
            this.data = [];
            this.unreadCount = 0;
            try {
                await notificationApi.clearAll();
            } catch (err) {
                // Ignore error
            }
        },

        startRealtime(intervalMs = 15000) {
            this.fetchNotifications();

            if (!pollTimer && typeof window !== "undefined") {
                pollTimer = window.setInterval(() => {
                    this.fetchNotifications();
                }, intervalMs);
            }

            if (!hasFocusListener && typeof window !== "undefined") {
                window.addEventListener("focus", () => {
                    this.fetchNotifications();
                });
                hasFocusListener = true;
            }
        },

        stopRealtime() {
            if (pollTimer && typeof window !== "undefined") {
                window.clearInterval(pollTimer);
                pollTimer = null;
            }
        },
    },
});

export { useNotificationStore };
