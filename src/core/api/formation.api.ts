import api from ".";
import type { FormationFilterType, FormationFormType } from "../../@types/Formation.type";
export default {
    index(params?: FormationFilterType){
        return api.get("/home/formations", { params });
    },
    store(data:FormationFormType){
        return api.post("/home/formations", data);
    },
    storeBatch(formations:FormationFormType[]){
        return api.post("/home/formations/import",{formations})
    },
    getFilters(){
        return api.get("/home/formations/filters")
    },
    getAllData(params?:FormationFilterType){
        return api.get("/home/formations/all",{params})
    },
    delete(id: string | number) {
        return api.delete(`/home/formations/${id}`)
    }
    
    
}