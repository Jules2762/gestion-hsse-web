import { defineStore } from "pinia";
import type { UserDataType, UserRoleType } from "../../@types/User.type";
import type { LoginType } from "../../@types/Auth.type";
import authApi from "../api/auth.api";

export const useAuthService=defineStore("auth-service",{
    state:()=>({
        role:"USER" as UserRoleType,
        token:sessionStorage.getItem("gestion-hsse-token"),
        user:{} as UserDataType
    }),
    getters:{
        getRole:(state)=>state.role,
        isAuthentificated:(state)=>!!state.token,
        getUser:(state)=>state.user
    },
    actions:{
        async login(data:LoginType){
            const response=await authApi.login(data)
            this.$state.user=response.data.user
            sessionStorage.setItem("gestion-hsse-token",response.data.token)
            return response
        },
        async logout(){
            try {
                await authApi.logout()
            } catch (err) {
                console.error("Erreur déconnexion:", err)
            } finally {
                this.$state.user = {} as UserDataType
                this.$state.token = null
                sessionStorage.removeItem("gestion-hsse-token")
            }
        },
        async forgotPassword(email: string){
            return await authApi.forgotPassword(email)
        },
        async resetPassword(data: { email: string; password: string; password_confirmation: string }){
            return await authApi.resetPassword(data)
        }
    }
})