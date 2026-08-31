type LogTypeType = "USER_CREATED" | "USER_UPDATED" | "USER_DELETED" | "CHECKLIST_CREATED" | "CHECKLIST_UPDATED" | "CHECKLIST_DELETED" | "CHECKLIST_FINISHED"
type LogType = {
    id?: string | number,
    type: LogTypeType,
    title: string,
    description?: string,
    user_id: string | number,
    created_at: string
}
export type {
    LogTypeType,
    LogType
}