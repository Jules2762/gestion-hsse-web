import api from "."

export default {
    index(id?:string|number){
        return api.get('/home/documents/folders/'+id)
    }
}