import { defineStore } from "pinia";
import api from "../core/api";

type SidebarCountsType = {
    DASHBOARD?: number;
    USERS?: number;
    ACTIVITY?: number;
    SITES?: number;
    TEMPLATE?: number;
    CHECKLIST?: number;
    ACTION?: number;
    EQUIPMENT_MONITORING?: number;
    FORMATION?: number;
    VMC?: number;
};

let pollTimer: number | null = null;
let hasFocusListener = false;

const useSidebarNotification = defineStore("sidebar-notification", {
    state: () => ({
        counts: {
            DASHBOARD: 0,
            USERS: 0,
            ACTIVITY: 0,
            SITES: 0,
            TEMPLATE: 0,
            CHECKLIST: 0,
            ACTION: 0,
            EQUIPMENT_MONITORING: 0,
            FORMATION: 0,
            VMC: 0,
        } as Record<string, number>,
        isLoading: false,
    }),
    getters: {
        getCount: (state) => {
            return (name: string): number => state.counts[name] ?? 0;
        },
    },
    actions: {
        setCount(name: string, value: number) {
            this.counts[name] = Math.max(0, value);
        },
        async fetchCounts() {
            try {
                const lastSeen = typeof window !== "undefined" ? localStorage.getItem("hsse_last_viewed_activity_at") : null;
                const res = await api.get("/home/sidebar-counts", {
                    params: lastSeen ? { last_activity_seen_at: lastSeen } : {}
                });
                if (res?.data) {
                    this.counts = {
                        ...this.counts,
                        ...res.data,
                    };
                }
            } catch (err) {
                // Handled globally by api interceptor for 401/403
            }
        },
        startRealtime(intervalMs = 15000) {
            this.fetchCounts();

            if (!pollTimer && typeof window !== "undefined") {
                pollTimer = window.setInterval(() => {
                    this.fetchCounts();
                }, intervalMs);
            }

            if (!hasFocusListener && typeof window !== "undefined") {
                window.addEventListener("focus", () => {
                    this.fetchCounts();
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

export { useSidebarNotification, type SidebarCountsType };
