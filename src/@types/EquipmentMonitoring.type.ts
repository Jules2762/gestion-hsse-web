import type { SiteNameType } from "./SiteName..type" 

export type EquipmentItemAttachmentType = {
    id: number
    file_path: string
    file_name?: string
    file_type?: string
    file_size?: number
}

export type EquipmentItemType = {
    id: number
    type: string
    name: string
    conformity: boolean
    initial_conformity?: boolean
    value_type: 'number' | 'boolean' | 'text'
    value: any
    location?: string
    comment?: string
    attachments?: EquipmentItemAttachmentType[]
}

export type EquipmentMonitoringType = {
    id?: string | number
    user_id?: string | number

    site_name: string | SiteNameType
    
    p50: number
    p9: number
    p6: number
    co2: number

    bas_met: number
    bas_plast: number
    pelles: number
    poubelles_120l: number
    poubelles_240l: number
    caf: number
    detecteur_de_fumee: number
    plots: number
    chainettes: number
    date: string
    picto_ext: number
    picto_caf: number
    picto_defense_de_fumer: number
    point_de_rasso: number
    contact_d_urgence: number
    canne_d_enfutage: number
    panneau_depotage_en_cours: number

    picto_danger_tgbt: boolean
    panneau_event: boolean
    livret_fiche_reflexe: boolean
    politique: boolean
    bac_de_retention: number

    status?: string
    conformity_rate?: number
    initial_conformity_rate?: number
    original_conformity_rate?: number
    is_resolved?: boolean
    observations?: string
    non_conforming_items_count?: number
    total_items_count?: number
    items?: EquipmentItemType[]
    user?: any

    site_location?: {
        locality?: string;
        province?: string;
        latitude?: number;
        longitude?: number;
    } | null
    site?: {
        id?: number;
        name?: string;
        locality?: string;
        province?: string;
        latitude?: number;
        longitude?: number;
    } | null
    latitude?: number | null
    longitude?: number | null
    locality?: string | null
    province?: string | null

    created_at?: string
}

export type EquipmentMonitoringFormType = {
    site_name: string | null
    user_id?: string | number | null
    p50: number
    p9: number
    p6: number
    co2: number
    date: string
    bas_met: number
    bas_plast: number
    pelles: number
    poubelles_120l: number
    poubelles_240l: number
    caf: number
    detecteur_de_fumee: number
    plots: number
    chainettes: number

    picto_ext: number
    picto_caf: number
    picto_defense_de_fumer: number
    point_de_rasso: number
    contact_d_urgence: number
    canne_d_enfutage: number
    panneau_depotage_en_cours: number
    bac_de_retention: number
    picto_danger_tgbt: boolean
    panneau_event: boolean
    livret_fiche_reflexe: boolean
    politique: boolean

    status?: string
    conformity_rate?: number
    initial_conformity_rate?: number
    original_conformity_rate?: number
    observations?: string
    items?: Partial<EquipmentItemType>[]
}

export type EquipmentMonitoringFilterType = {
    page?: number
    per_page?: number
    date?: {
        from?: string
        to?: string
    }
    site?: string[]
    status?: string[]
    conformity?: string
    inspector?: string[]
    search?: string
}