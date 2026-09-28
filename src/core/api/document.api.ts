import api from "."

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
    }
}