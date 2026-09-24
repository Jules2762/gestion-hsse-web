import documentApi from "../api/document.api"

export default {
    async index(id?:string|number){
        return await documentApi.index(id)
    }
}