import type { UserDataType } from "./User.type"

export type ActionStatusType = "PENDING" | "IN_PROGRESS" | "FINISHED"
export type ActionEmailStatusType = "NOT_SENT" | "SENT"
export type ActionOriginType = "CHECKLIST" | "VMC"

export type ActionStatusJsonType = {
    label: string
    value: ActionStatusType
}[]

export type ActionResponsibleType = {
    id?: string | number
    raw_id?: number
    first_name?: string
    last_name?: string
    name?: string
    email?: string
    phone_number?: string | null
    department?: string
    job?: string
    type?: 'USER' | 'PERSONNEL'
}

export type ActionAttachmentType = {
    id: number | string
    file_name: string
    file_path: string
    file_type?: string | null
    file_size?: number | null
    url: string
    source: 'ACTION' | 'INSPECTION'
}

export type ActionType = {
    id?: string | number
    raw_id?: number
    origin?: ActionOriginType
    origin_label?: string
    description?: string
    status?: ActionStatusType
    email_status?: ActionEmailStatusType
    created_at?: string
    created_at_date?: string
    parent_id?: string | number | null
    parent_title?: string
    parent_site?: string
    parent_type?: string
    item_id?: string | number | null
    item_title?: string
    item_answer?: string
    item_observation?: string
    checklist_item_id?: string | number
    site_location?: {
        site_name?: string
        locality?: string
        province?: string
        latitude?: number | null
        longitude?: number | null
    } | null
    attachments?: ActionAttachmentType[]
    assigned_to?: ActionResponsibleType | UserDataType | any
}

export type ActionFilterParams = {
    origin?: 'ALL' | 'CHECKLIST' | 'VMC'
    status?: ActionStatusType | ''
    search?: string
    date?: string
}

export type ActionMetaType = {
    total: number
    pending: number
    in_progress: number
    finished: number
    checklist_count: number
    vmc_count: number
    current_count?: number
}
