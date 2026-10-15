import api from ".";
import type { LoginType } from "../../@types/Auth.type";

export default {
    login(data:LoginType){
        return api.post("/auth/login",data);
    },
    logout(){
        return api.post("/auth/logout");
    },
    forgotPassword(email: string){
        return api.post("/auth/forgot-password", { email });
    },
    resetPassword(data: { email: string; password: string; password_confirmation: string }){
        return api.post("/auth/reset-password", data);
    }
}