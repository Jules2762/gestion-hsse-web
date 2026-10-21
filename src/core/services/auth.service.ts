import { defineStore } from "pinia";
import type { UserDataType, UserRoleType } from "../../@types/User.type";
import type { LoginType } from "../../@types/Auth.type";
import authApi from "../api/auth.api";

function getStoredUser(): UserDataType {
    try {
        const item = sessionStorage.getItem("gestion-hsse-user") || localStorage.getItem("gestion-hsse-user");
        if (item) {
            return JSON.parse(item);
        }
    } catch {
        // ignore JSON parse error
    }
    return {} as UserDataType;
}

export const useAuthService = defineStore("auth-service", {
    state: () => ({
        role: "USER" as UserRoleType,
        token: sessionStorage.getItem("gestion-hsse-token") || localStorage.getItem("gestion-hsse-token"),
        user: getStoredUser()
    }),
    getters: {
        getRole: (state) => state.role,
        isAuthentificated: (state) => !!state.token,
        getUser: (state) => state.user
    },
    actions: {
        setUser(userData: Partial<UserDataType> | any) {
            if (!userData) return;
            this.user = { ...(this.user || {}), ...userData };
            if (userData.role) {
                this.role = userData.role;
            }
            try {
                sessionStorage.setItem("gestion-hsse-user", JSON.stringify(this.user));
                localStorage.setItem("gestion-hsse-user", JSON.stringify(this.user));
            } catch {
                // ignore storage error
            }
        },
        async login(data: LoginType) {
            const response = await authApi.login(data);
            const rawUser = response.data?.user?.data || response.data?.user || response.data?.data || {};
            this.setUser(rawUser);
            this.token = response.data.token;
            if (response.data.token) {
                sessionStorage.setItem("gestion-hsse-token", response.data.token);
                localStorage.setItem("gestion-hsse-token", response.data.token);
            }
            return response;
        },
        async logout() {
            try {
                await authApi.logout();
            } catch (err) {
                console.error("Erreur déconnexion:", err);
            } finally {
                this.user = {} as UserDataType;
                this.token = null;
                sessionStorage.removeItem("gestion-hsse-token");
                localStorage.removeItem("gestion-hsse-token");
                sessionStorage.removeItem("gestion-hsse-user");
                localStorage.removeItem("gestion-hsse-user");
            }
        },
        async forgotPassword(email: string) {
            return await authApi.forgotPassword(email);
        },
        async resetPassword(data: { email: string; password: string; password_confirmation: string }) {
            return await authApi.resetPassword(data);
        }
    }
});
