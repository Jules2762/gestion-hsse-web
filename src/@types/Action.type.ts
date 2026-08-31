type ActionStatusType="PENDING"|"IN_PROGRESS"|"FINISHED"
type ActionStatusJsonType={
    label: string,
    value: ActionStatusType
}[]
type ActionType={
    id?:string|number,
    description?:string,
    status:ActionStatusType,
    assigned_to:string|number,
    checklist_item_id:string|number,
    created_at:string,
}
export type {
    ActionStatusType,
    ActionStatusJsonType,
    ActionType
}
