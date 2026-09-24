import { defineStore } from "pinia";
import userApi from "../api/user.api";
import type { UserFilterType, UserFormType, UserProfileUpdateFormType, UserRoleType } from "../../@types/User.type";

export const useUserService=defineStore('user-service',{
    actions:{
        //======================================
        //============== USERS =================
        //======================================
        async getFilters(){
            return await userApi.getFilters()
        },
        async me() {
            return await userApi.me()
        },
        async index(params?:UserFilterType){
            return await userApi.index(params)
        },
        async show(id:string|number){
            return await userApi.show(id)
        },
        async getProfile(id?:string|number){
            return await userApi.getProfile(id)
        },
        async updateProfile(id:string|number,data:UserProfileUpdateFormType){
            return await userApi.updateProfile(id,data)
        },
        async store(data?:UserFormType){
            return await userApi.store(data)
        },
        async update(id: string | number, data: Partial<UserFormType>){
            return await userApi.update(id,data)
        },
        async export(params?:UserFilterType){
            return await userApi.export(params)
        },
        async createUser(data:UserFormType){
            return await userApi.store(data)
        },
        async enable(id:string|number){
            return await userApi.enable(id)
        },
        async disable(id:string|number){
            return await userApi.disable(id)
        },

        //======================================
        //============== ROLE =================
        //======================================
        async updateRole(id:string|number,role:UserRoleType){
            return await userApi.updateRole(id,role)
        },

        //======================================
        //============ PERMISSION ==============
        //======================================
        async getPermissions(id:string|number){
            return await userApi.getPermissions(id)
        },
        async getAllPermissions(){
            return await userApi.getAllPermissions()
        },
        async updatePermissions(id:string|number,data:string[]){
            return await userApi.updatePermissions(id,data)
        },
       
    }
})