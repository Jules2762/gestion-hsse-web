import type { UserDataType } from "./User.type"

type ActionStatusType="PENDING"|"IN_PROGRESS"|"FINISHED"
type ActionEmailStatusType="NOT_SENT"|"SENT"
type ActionStatusJsonType={
    label: string,
    value: ActionStatusType
}[]
type ActionType={
    id?:string|number,
    description?:string,
    status:ActionStatusType,
    assigned_to?:UserDataType,
    checklist_item_id:string|number,
    created_at:string,
    email_status:ActionEmailStatusType
}
export type {
    ActionStatusType,
    ActionStatusJsonType,
    ActionType,ActionEmailStatusType
}
