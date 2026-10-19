import type { ChecklistStatusType } from "./Checklist.type"
import type { UserDataType } from "./User.type"

type VMCType = 
    | "Station-Service" 
    | "Inspection camion" 
    | "Visite Magasins & Agences" 
    | "STATION SERVICE" 
    | "INSPECTION CAMION" 
    | "VISITE MAGASINS & AGENCES" 
    | "INSPECTION" 
    | "SAFETY REPORT" 
    | "SAFETY MOMENT" 
    | "SAFETY AWARENESS"
    | string

type VMCFormType = {
    type: string,
    date: string,
    title?: string,
    site?: string,
    inspector?: string,
    assigned_to?: number | string,
    accompanying_person?: string,
    recommendation?: string,
}

type VMCDataType = {
    id: string | number,
    type: string,
    master_type?: string,
    date: string,
    site?: string,
    inspector?: string,
    accompanying_person?: string,
    status: ChecklistStatusType,
    title: string,
    assigned_to?: UserDataType,
    created_by?: UserDataType,
    recommendation?: string,
    inspection?: any,
    safety_report_form?: any,
    safety_moment?: any,
    safety_awareness_items?: any[],
    site_location?: {
        locality?: string;
        province?: string;
        latitude?: number;
        longitude?: number;
    } | null,
    created_at?: string,
    updated_at?: string,
}

type VMCFilterType = {
    date?: {
        from: string,
        to: string
    },
    site?: string[],
    type?: string[],
    inspector?: string[],
    status?: string[],
    search?: string,
    page?: number,
    per_page?: number,
}

export type {
    VMCType,
    VMCFormType,
    VMCDataType,
    VMCFilterType
}