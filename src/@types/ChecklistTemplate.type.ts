import type { UserDataType } from "./User.type"

type ChecklistTemplateType={
    id:number|string,
    added_by?:UserDataType,
    title:string,
    description?:string,
    site:string,
    type:string,
    targetDepartment?:string[],
    sections: ChecklistTemplateSectionType[]
}
type ChecklistTemplateFilterType={
    site:string[],
    type:string[],
    creator:string[]
}
type ChecklistTemplateSectionType ={
    order:string|number,
    title:string,
    items: ChecklistTemplateItemType[]
}
type ChecklistTemplateItemType ={
    order?:number|string,
    question?:string
}
export type {
    ChecklistTemplateType, ChecklistTemplateSectionType, ChecklistTemplateItemType,
    ChecklistTemplateFilterType
}