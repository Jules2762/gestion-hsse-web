import type { UserDataType } from "./User.type"

type FolderType={
    id:string|number,
    name:string,
    parent_id?:string|number,
    description?:string,
    created_by:string|number,
    created_at:string,
    creator?:UserDataType,
    children?:FolderType[],
    documents?: DocumentType[]
    
}
type DocumentType={
    id:string|number,
    folder_id:string|number,
    name:string,
    original_name:string,
    path:string,
    mime_type:string,
    size:string,
    version:string,
    uploaded_by:string|number,
    created_at:string
}
type FolderContentType={
    folders?:FolderType[],
    documents?:DocumentType[]
}
type CreateFolderFormType={
    parent_id?:string|number,
    name:string
}
export type{
    DocumentType,FolderType,FolderContentType,CreateFolderFormType
}