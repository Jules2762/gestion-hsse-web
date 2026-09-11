import api from "."
import type { UserFilterType, UserFormType } from "../../@types/User.type"

export default {
    getFilters(){
        return api.get("/home/users/filters")
    },
    index(params?:UserFilterType){
        return api.get("/home/users/users",{params})
    },
    store(data?:UserFormType){
        return api.post("/home/users/users",data)
    }
    
}