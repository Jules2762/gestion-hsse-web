import { defineStore } from "pinia";
import templateApi from "../api/template.api";
import type { ChecklistTemplateFilterType } from "../../@types/ChecklistTemplate.type";

export const useTemplateService = defineStore('checklist-template-service', {
    actions: {
        async index(params?:ChecklistTemplateFilterType){
            return await templateApi.index(params)
        },
        async getFIlters(){
            return await templateApi.getFilters()
        }
    }
})