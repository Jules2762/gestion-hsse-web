import api from ".";
import type { LoginType } from "../../@types/Auth.type";

export default {
    login(data:LoginType){
        return api.post("/auth/login",data);
    },
    logout(){
        return api.post("/auth/logout");
    }
}