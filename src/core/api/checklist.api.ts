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
    },
    show(id: string | number) {
        return api.get(`/home/checklists/checklists/${id}`)
    },
    update(id: string | number, data: any) {
        return api.put(`/home/checklists/checklists/${id}`, data)
    },
    destroy(id: string | number) {
        return api.delete(`/home/checklists/checklists/${id}`)
    },
    export(params?: any) {
        return api.get('/home/checklists/export', { params })
    }
}