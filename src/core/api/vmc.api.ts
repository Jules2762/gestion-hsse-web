import api from "."
import type { VMCFilterType, VMCFormType } from "../../@types/VMC.type"

export default {
    index(params?:VMCFilterType){
        return api.get('/home/vmcs',{params})
    },
    getFilters(){
        return api.get('/home/vmcs/filters')
    },
    store(data:VMCFormType){
        return api.post('/home/vmcs',data)
    }
}