import { defineStore } from "pinia";
import userApi from "../api/user.api";
import type { UserFilterType, UserFormType } from "../../@types/User.type";

export const useUserService=defineStore('user-service',{
    actions:{
        async getFilters(){
            return await userApi.getFilters()
        },
        async index(params?:UserFilterType){
            return await userApi.index(params)
        },
        async store(data?:UserFormType){
            return await userApi.store(data)
        }
    }
})