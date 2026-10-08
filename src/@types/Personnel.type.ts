import type { UserDataType } from "./User.type"

type PersonnelDataType={
    id:string|number,
    first_name:string,
    last_name?:string,
    email:string,
    fonction:string,
    direction:string,
    entity:string,
    added_by:UserDataType

}
type PersonnelFormType={
    first_name:string,
    last_name?:string,
    email:string,
    fonction:string,
    direction:string,
    entity:string,
}
type PersonnelFilterType={
    direction?:string,
    fonction?:string,
    entity?:string,
    page?:number
}

export type {
    PersonnelDataType,
    PersonnelFilterType,
    PersonnelFormType
   
}