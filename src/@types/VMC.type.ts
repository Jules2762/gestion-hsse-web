import type { ChecklistStatusType } from "./Checklist.type"
import type { UserDataType } from "./User.type"

type VMCType = "Station-Service" | "Inspection camion" | "Visite Magasins & Agences" 
type VMCFormType = {
    type: VMCType,
    date: string,
    site?: string,
    inspector?: string,
    accompanying_person?: string,
}
type VMCDataType = {
    id: string | number,
    type: VMCType,
    date: string,
    site?: string,
    inspector?: string,
    accompanying_person?: string,
    status: ChecklistStatusType,
    title: string,
    assigned_to?: UserDataType,
    created_by?: UserDataType,
    recommendation?: string,

}
type VMCFilterType={
    date:{
        from:string,
        to:string
    },
    site:string[],
    type:string[],
    inspector:string[],
}
export type {
    VMCType,
    VMCFormType,
    VMCDataType,
    VMCFilterType
}