import api from "."
import type { CreateFolderFormType } from "../../@types/DocumentLibrary.type"

export default {
    getFolders(){
        return api.get('/home/documents/folders')
    },
    getFolderContents(id:number|string|undefined){
        return api.get('/home/documents/folders/'+id)
    },
    renameFolder(id:string|number,name:string|undefined){
        return api.put('/home/documents/folders/rename/'+id,{
            'name':name
        })
    },
    deleteFolder(id:number|string){
        return api.delete('/home/documents/folders/'+id)
    },
    createFolder(data:CreateFolderFormType){
        return api.post('/home/documents/folders',data)
    },
    downloadDocument(id: string | number) {
        return api.get(`/home/documents/files/${id}/download`, {
            responseType: 'blob',
        })
    },

    renameDocument(id: string | number, name: string) {
        return api.put(`/home/documents/files/rename/${id}`, { name })
    },

    deleteDocument(id: string | number) {
        return api.delete(`/home/documents/files/${id}`)
    },
}