import api from "."
import type { ChecklistFilterType, CheckllistFormType } from "../../@types/Checklist.type"

export default {
    index(params?:ChecklistFilterType){
        return api.get('/home/checklists/checklists',{params})
    },
    store(data:CheckllistFormType){
        return api.post("/home/checklists/checklists",data)
    },
    getFilters(){
        return api.get('/home/checklists/filters')
    }
}