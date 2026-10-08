
import type { PersonnelFormType } from "../../@types/Personnel.type"
import personnelApi from "../api/personnel.api"

export default {
    async index(){
        return await personnelApi.index()
    },
    async indexAll(){
        return await personnelApi.indexAll()
    },
    async getFilters(){
        return await personnelApi.getFilters()
    },
    async store(data:PersonnelFormType){
        return await personnelApi.store(data)
    }
   
}