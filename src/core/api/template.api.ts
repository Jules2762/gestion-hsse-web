import api from "."
import type { ChecklistTemplateFilterType } from "../../@types/ChecklistTemplate.type"

export default {
    index(params?:ChecklistTemplateFilterType){
        return api.get('/home/checklist-templates/templates',{params})
    },
    getFilters(){
        return api.get('/home/checklist-templates/filters')
    }
}