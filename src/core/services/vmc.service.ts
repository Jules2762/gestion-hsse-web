import type { VMCFilterType, VMCFormType } from "../../@types/VMC.type"
import vmcApi from "../api/vmc.api"

export default {
    async index(params?:VMCFilterType){
        return await vmcApi.index(params)
    },
    async getFilters(){
        return await vmcApi.getFilters()
    },
    async store(data:VMCFormType){
        return await vmcApi.store(data)
    }
}