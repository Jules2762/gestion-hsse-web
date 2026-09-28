import documentApi from "../api/document.api"

export default {
    async getFolders(){
        return await documentApi.getFolders()
    },
    async getFolderContents(id:string|number|undefined){
        return await documentApi.getFolderContents(id)
    },
    async renameFolder(id:string|number,name:string|undefined){
        return await documentApi.renameFolder(id,name)
    },
    async deleteFolder(id:string|number){
        return await documentApi.deleteFolder(id)
    }
}