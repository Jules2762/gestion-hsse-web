import type { UserDataType } from "./User.type";

type LogTypeType =
    | "LOGIN"
    | "LOGOUT"
    | "USER_CREATED"
    | "USER_UPDATED"
    | "USER_DELETED"
    | "USER_ENABLED"
    | "USER_DISABLED"
    | "USER_ROLE_UPDATED"
    | "USER_PERMISSION_UPDATED"
    | "PERSONNEL_CREATED"
    | "FORMATION_CREATED"
    | "FORMATION_UPDATED"
    | "FORMATION_DELETED"
    | "FORMATION_CANCELLED"
    | "FORMATION_RESCHEDULED"
    | "FORMATION_IMPORTED"
    | "PARTICIPANT_ADDED"
    | "PARTICIPANT_DELETED"
    | "EQUIPMENT_CREATED"
    | "EQUIPMENT_UPDATED"
    | "EQUIPMENT_DELETED"
    | "EQUIPMENT_IMPORTED"
    | "CHECKLIST_CREATED"
    | "CHECKLIST_UPDATED"
    | "CHECKLIST_DELETED"
    | "CHECKLIST_FINISHED"
    | "CHECKLIST_TEMPLATE_CREATED"
    | "CHECKLIST_TEMPLATE_UPDATED"
    | "CHECKLIST_TEMPLATE_DELETED"
    | "FOLDER_CREATED"
    | "FOLDER_RENAMED"
    | "FOLDER_DELETED"
    | "DOCUMENT_UPLOADED"
    | "DOCUMENT_DELETED"
    | "DOCUMENT_DOWNLOADED"
    | "VMC_CREATED"
    | string;

type LogType = {
    id: string | number,
    type: LogTypeType,
    title: string,
    description?: string,
    properties?: Record<string, any> | null,
    user_id: string | number,
    created_at: string,
    user?: (UserDataType & {
        full_name?: string
    }) | null
}

type LogFilterType = {
    page?: number,
    per_page?: number,
    search?: string,
    type?: string | string[],
    user_id?: string | number,
    date_from?: string,
    date_to?: string
}

export type {
    LogTypeType,
    LogType,
    LogFilterType
}