import { defineStore } from "pinia";
import type { ChecklistFilterType, CheckllistFormType } from "../../@types/Checklist.type";
import checklistApi from "../api/checklist.api";

export const useChecklistService=defineStore('checklist-service',{
    actions:{
        async index(params?: ChecklistFilterType){
            return await checklistApi.index(params)
        },
        async store(data:CheckllistFormType){
            return await checklistApi.store(data)
        },
        async getFilters(){
            return await checklistApi.getFilters()
        },
        async show(id: string | number){
            return await checklistApi.show(id)
        },
        async update(id: string | number, data: any){
            return await checklistApi.update(id, data)
        },
        async destroy(id: string | number){
            return await checklistApi.destroy(id)
        },
        async export(params?: any){
            return await checklistApi.export(params)
        }
    }
})