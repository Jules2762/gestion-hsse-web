import { defineStore } from "pinia";
import formationApi from "../api/formation.api"
import type { FormationFilterType, FormationFormType } from "../../@types/Formation.type";

export const useFormationService=defineStore('formation-service',{
    actions:{
        async fetchData(params?:FormationFilterType){
            const response = await formationApi.index(params)
            return response        },
        async store(data:FormationFormType){
            const response=await formationApi.store(data)
            return response
        },
        async update(id:string|number,data:FormationFormType){
            const response=await formationApi.update(id,data)
            return response
        },
        async show(id:string|number){
            const response=await formationApi.show(id)
            return response
        },
        async storeBatch(data:FormationFormType[]){
            const response=await formationApi.storeBatch(data)
            return response
        },
        async getFilters(){
            return await formationApi.getFilters()
        },
        async getAllData(params?:FormationFilterType){
            return await formationApi.getAllData(params)
        },
        async delete(id: string | number) {
            return await formationApi.delete(id)
        },
        async cancel(id: string | number) {
            return await formationApi.cancel(id)
        }

    }
})