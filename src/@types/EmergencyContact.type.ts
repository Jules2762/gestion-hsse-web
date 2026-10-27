export type EmergencyType = 'POMPIER' | 'HOPITAL' | 'AMBULANCE' | 'POLICE' | 'GENDARMERIE';

export interface EmergencySiteType {
    id: number;
    name: string;
    code?: string;
    type?: string;
    locality?: string;
    province?: string;
    latitude?: number;
    longitude?: number;
    emergency_contacts?: Array<{
        id: number;
        type: EmergencyType;
        name: string;
        phone?: string;
    }>;
}

export interface EmergencyContactType {
    id: number;
    type: EmergencyType;
    name: string;
    locality?: string;
    province?: string;
    latitude?: number;
    longitude?: number;
    contact_1: string;
    contact_2?: string;
    contact_3?: string;
    phone?: string;
    email?: string;
    address?: string;
    notes?: string;
    location_id?: number;
    location?: {
        id: number;
        label: string;
        locality: string;
        province: string;
        latitude?: number;
        longitude?: number;
    };
    sites?: EmergencySiteType[];
    distance_km?: number;
    created_at?: string;
    updated_at?: string;
}

export interface EmergencyContactFormType {
    type: EmergencyType;
    name: string;
    locality?: string;
    latitude?: number | null;
    longitude?: number | null;
    contact_1: string;
    contact_2?: string;
    contact_3?: string;
    email?: string;
    address?: string;
    notes?: string;
    location_id?: number | null;
    site_ids?: number[];
}

export interface EmergencyContactFilterType {
    search?: string;
    type?: string;
    locality?: string;
    province?: string;
    site_id?: number | string;
    sort_by?: string;
    sort_dir?: 'asc' | 'desc';
    page?: number;
    per_page?: number;
    all?: boolean;
}

export interface EmergencyMapDataType {
    contacts: EmergencyContactType[];
    sites: EmergencySiteType[];
    localities: string[];
    provinces: string[];
    stats: {
        total_contacts: number;
        total_sites: number;
        pompier: number;
        hopital: number;
        ambulance: number;
        police: number;
        gendarmerie: number;
    };
}
