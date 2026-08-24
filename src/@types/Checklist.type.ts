type ChecklistStatusType="DRAFT"|"IN_PROGRESS"|"COMPLETED"|"CANCELLED"
type ChecklistStatusJsonType={
    label:string,
    value:ChecklistStatusType
}[]
type Checklistype={
    id?:string|number,
    site?:string,
    type?:string,
    title:string,
    description?:string,
    location?:string,
    date?:string,
    time?:string,
    inspector?:string,
    accompanying_person?:string,
    comment?:string,
    status:ChecklistStatusType,
    started_at?:string,
    completed_at?:string,
    contact:string,
    manager:string
}
export type {
    ChecklistStatusType,
    ChecklistStatusJsonType,
    Checklistype
}