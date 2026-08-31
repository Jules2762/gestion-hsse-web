type FolderType={
    id:string|number,
    name:string,
    parent_id?:string|number,
    description?:string,
    created_by:string|number,
    created_at:string,
    
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
export type{
    DocumentType,FolderType
}