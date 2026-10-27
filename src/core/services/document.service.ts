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
    async uploadDocument(
        file: File,
        folderId?: string | number,
        onProgress?: (percent: number) => void,
    ) {
        const CHUNK_SIZE = 3 * 1024 * 1024; // 3 Mo par fragment pour une vitesse et réactivité optimales

        // Pour les petits fichiers (<= 3 Mo), téléversement direct classique
        if (file.size <= CHUNK_SIZE) {
            const formData = new FormData()
            formData.append('file', file)
            if (folderId !== undefined && folderId !== '') {
                formData.append('folder_id', String(folderId))
            }

            return api.post('/home/documents/files', formData, {
                timeout: 120000,
                headers: { 'Content-Type': 'multipart/form-data' },
                onUploadProgress: e => {
                    if (e.total && onProgress) {
                        onProgress(Math.round((e.loaded * 100) / e.total))
                    }
                },
            })
        }

        // Pour les fichiers volumineux (vidéos, etc.), téléversement par fragments (chunked)
        const totalChunks = Math.ceil(file.size / CHUNK_SIZE)
        const uploadId = `${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
        let lastResponse: any = null

        for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
            const start = chunkIndex * CHUNK_SIZE
            const end = Math.min(start + CHUNK_SIZE, file.size)
            const chunkBlob = file.slice(start, end)
            const chunkFile = new File([chunkBlob], `${file.name}.part_${chunkIndex}`, {
                type: file.type || 'application/octet-stream'
            })

            const formData = new FormData()
            formData.append('file', chunkFile)
            formData.append('upload_id', uploadId)
            formData.append('chunk_index', String(chunkIndex))
            formData.append('total_chunks', String(totalChunks))
            formData.append('filename', file.name)
            if (folderId !== undefined && folderId !== '') {
                formData.append('folder_id', String(folderId))
            }

            lastResponse = await api.post('/home/documents/files/chunk', formData, {
                timeout: 120000, // 2 minutes par fragment de 3 Mo
                headers: { 'Content-Type': 'multipart/form-data' },
                onUploadProgress: e => {
                    if (onProgress && e.total) {
                        const chunkProgress = e.loaded / e.total
                        const overall = Math.round(((chunkIndex + chunkProgress) / totalChunks) * 100)
                        onProgress(Math.min(overall, 99))
                    }
                }
            })

            if (onProgress) {
                onProgress(Math.round(((chunkIndex + 1) / totalChunks) * 100))
            }
        }

        return lastResponse
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