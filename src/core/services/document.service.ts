import type { CreateFolderFormType } from "../../@types/DocumentLibrary.type"
import api from "../api"
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
    },
    async createFolder(data:CreateFolderFormType){
        return await documentApi.createFolder(data)
    },
    uploadDocument(
        file: File,
        folderId?: string | number,
        onProgress?: (percent: number) => void,
    ) {
        const formData = new FormData()
        formData.append('file', file)
        if (folderId !== undefined && folderId !== '') {
            formData.append('folder_id', String(folderId))
        }

        return api.post('/home/documents/files', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
            onUploadProgress: e => {
                if (e.total && onProgress) {
                    onProgress(Math.round((e.loaded * 100) / e.total))
                }
            },
        })
    },
    downloadDocument(id: string | number) {
        return documentApi.downloadDocument(id)
    },

    renameDocument(id: string | number, name: string) {
        return documentApi.renameDocument(id,name)
    },

    deleteDocument(id: string | number) {
        return documentApi.deleteDocument(id)
    },
}