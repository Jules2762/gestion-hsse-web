import api from "."
import type { PersonnelFormType } from "../../@types/Personnel.type"

export default {
    index(){
        return api.get('/home/personnels')
    },
    indexAll(){
        return api.get('/home/personnels/all')
    },
    getFilters(){
        return api.get('/home/personnels/filters')
    },
    store(data:PersonnelFormType){
        return api.post('/home/personnels',data)
    }
   
}