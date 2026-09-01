import type { SiteNameType } from "./SiteName..type";

type EquipmentMonitoringType={
    id?:string|number,
    user_id?:string|number,
    site_name_id?:string|number,
    site_name:SiteNameType,
    p50:number,
    p9:number,
    p6:number,
    co2:number,
    bas_met:number,
    bas_plast:number,
    pelles:number,
    poubelles_120l:number,
    poubelle_240l:number,
    caf:number,
    picto_ext:number,
    picto_caf:number,
    picto_defense_de_fumer:number,
    point_de_rasso:number,
    contact_d_urgence:number,
    canne_d_enfutage:number,
    panneau_depotage_en_cours:number,
    picto_danger_tgbt:boolean,
    panneau_event:boolean,
    livret_fiche_reflexe:boolean,
    politique:boolean,
    detecteur_de_fumee:number,
    plots:number,
    chainettes:number,
    created_at:string
}
export type {
    EquipmentMonitoringType
}