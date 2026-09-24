import type { ActionType } from "./Action.type"
import type { AnswerType } from "./Answer.type"

type ChecklistStatusType = "DRAFT" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED"
type ChecklistStatusJsonType = {
    label: string,
    value: ChecklistStatusType
}[]
type Checklistype = {
    id?: string | number,
    site?: string,
    type?: string,
    title: string,
    description?: string,
    location?: string,
    date?: string,
    time?: string,
    inspector?: string,
    accompanying_person?: string,
    comment?: string,
    status: ChecklistStatusType,
    started_at?: string,
    completed_at?: string,
    contact: string,
    manager: string,
    added_by?:string
    sections:ChecklistSectionType[]
}
type CheckllistFormType={
    type?:ChecklistType,
    site?:SiteType,
    date?:string,
    time?:string
}
type ChecklistSectionType={
    id?:string|number,
    title:string,
    checklist_id?:string|number,
    items:ChecklistItemType[]
}
type ChecklistItemType={
    id?:string|number,
    checklist_section_id?:string|number,
    question:string,
    answer?:AnswerType,
    action?:ActionType
    
}
type ChecklistFilterType={
    date?:{
        from?:string,
        to?:string
    },
    type?:string[],
    status?:string[],
    inspector?:string[],
    search?:string,
    page?:string|number

}
type ChecklistType = "CHECKLIST HSSE SURETE" | "FICHE D'INSPECTION DE CAMION CITERNE" | "INSPECTION DES VEHICULES" | "CHECKLIST EVALUATION RESEAU" | "CHECKLIST EVALUATION DES AGENCES ET MAGASIN" | "CHECKLIST EVALUATION CONSO"
type ChecklistTypeJson = {
    label: string,
    value: ChecklistType
}[]
type SiteType = "STATION SERVICE" | "MAGASIN" | "VEHICULE" | "AGENCE" | "CAMION CITERNE" | "B2B"
type SiteTypeJson = {
    label: string,
    value: SiteType
}[]
export type {
    ChecklistStatusType,
    ChecklistStatusJsonType,
    Checklistype,
    ChecklistType,
    ChecklistTypeJson,
    SiteType, SiteTypeJson,
    CheckllistFormType,
    ChecklistFilterType
}