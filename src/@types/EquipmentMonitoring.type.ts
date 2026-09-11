import type { SiteNameType } from "./SiteName..type" 

export type EquipmentMonitoringType = {
    id?: string | number
    user_id?: string | number

    site_name: SiteNameType
    
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
    date: string,
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

    created_at?: string
}


export type EquipmentMonitoringFormType = {
    site_name: string | null
    p50: number
    p9: number
    p6: number
    co2: number
    date: string,
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

    picto_danger_tgbt: boolean
    panneau_event: boolean
    livret_fiche_reflexe: boolean
    politique: boolean
}
export type EquipmentMonitoringFilterType={
    page?: number,
    per_page?: number,
    date?: {
        from?: string,
        to?: string
    },
    site?:string[],
    search?:string
}