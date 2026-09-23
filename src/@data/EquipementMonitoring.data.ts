import type { EquipmentMonitoringFormType, EquipmentMonitoringType } from '../@types/EquipmentMonitoring.type'
export const EquipmentMonitoringFormData: EquipmentMonitoringFormType = {
    date: '',
    site_name: '',
    p50: 0,
    p9: 0,
    p6: 0,
    co2: 0,
    bas_met: 0,
    bas_plast: 0,
    pelles: 0,
    poubelles_120l: 0,
    poubelles_240l: 0,
    caf: 0,
    detecteur_de_fumee: 0,
    plots: 0,
    chainettes: 0,

    picto_ext: 0,
    picto_caf: 0,
    picto_defense_de_fumer: 0,
    point_de_rasso: 0,
    contact_d_urgence: 0,
    canne_d_enfutage: 0,
    panneau_depotage_en_cours:0,

    picto_danger_tgbt: false,
    panneau_event: false,
    livret_fiche_reflexe: false,
    politique: false
}
export const EquipmentMonitoringData: EquipmentMonitoringType[] = [
    {
        id: 1,

        user_id: 1,

        date: "2001-12-12",
        site_name: {
            id: 1,
            name: 'SS TALATAMATY',
        },

        p50: 2,
        p9: 4,
        p6: 1,
        co2: 3,

        bas_met: 2,
        bas_plast: 2,

        pelles: 3,

        poubelles_120l: 2,
        poubelles_240l: 1,

        caf: 1,

        picto_ext: 3,
        picto_caf: 2,
        picto_defense_de_fumer: 4,

        point_de_rasso: 1,

        contact_d_urgence: 1,

        canne_d_enfutage: 2,

        panneau_depotage_en_cours: 1,

        picto_danger_tgbt: true,

        panneau_event: true,

        livret_fiche_reflexe: true,

        politique: true,

        detecteur_de_fumee: 4,

        plots: 12,

        chainettes: 8,

        created_at: '2026-08-01',
    },

    {
        id: 2,

        user_id: 2,

        date: "2001-12-12",

        site_name: {
            id: 2,
            name: 'SS IAVOLOHA',
        },

        p50: 3,
        p9: 5,
        p6: 2,
        co2: 4,

        bas_met: 3,
        bas_plast: 2,

        pelles: 2,

        poubelles_120l: 3,
        poubelles_240l: 2,

        caf: 1,

        picto_ext: 4,
        picto_caf: 4,
        picto_defense_de_fumer: 3,

        point_de_rasso: 1,

        contact_d_urgence: 1,

        canne_d_enfutage: 1,

        panneau_depotage_en_cours: 1,

        picto_danger_tgbt: true,

        panneau_event: false,

        livret_fiche_reflexe: true,

        politique: true,

        detecteur_de_fumee: 5,

        plots: 10,

        chainettes: 6,

        created_at: '2026-08-03',
    },

    {
        id: 3,

        user_id: 3,

        date: "2001-12-12",

        site_name: {
            id: 3,
            name: 'SS SOANIADANANA',
        },

        p50: 1,
        p9: 2,
        p6: 1,
        co2: 2,

        bas_met: 1,
        bas_plast: 1,

        pelles: 1,

        poubelles_120l: 2,
        poubelles_240l: 1,

        caf: 1,

        picto_ext: 2,
        picto_caf: 1,
        picto_defense_de_fumer: 2,

        point_de_rasso: 1,

        contact_d_urgence: 0,

        canne_d_enfutage: 1,

        panneau_depotage_en_cours: 0,

        picto_danger_tgbt: false,

        panneau_event: false,

        livret_fiche_reflexe: true,

        politique: false,

        detecteur_de_fumee: 2,

        plots: 6,

        chainettes: 4,

        created_at: '2026-08-06',
    },

    {
        id: 4,

        user_id: 4,

        date: "2001-12-12",

        site_name: {
            id: 4,
            name: 'SS AMBANJA',
        },

        p50: 4,
        p9: 6,
        p6: 2,
        co2: 4,

        bas_met: 4,
        bas_plast: 3,

        pelles: 4,

        poubelles_120l: 4,
        poubelles_240l: 2,

        caf: 2,

        picto_ext: 5,
        picto_caf: 5,
        picto_defense_de_fumer: 5,

        point_de_rasso: 2,

        contact_d_urgence: 1,

        canne_d_enfutage: 2,

        panneau_depotage_en_cours: 1,

        picto_danger_tgbt: true,

        panneau_event: true,

        livret_fiche_reflexe: true,

        politique: true,

        detecteur_de_fumee: 5,

        plots: 15,

        chainettes: 10,

        created_at: '2026-08-10',
    },

    {
        id: 5,

        user_id: 5,

        date: "2001-12-12",

        site_name: {
            id: 5,
            name: 'SS ANKORONDRANO',
        },

        p50: 3,
        p9: 4,
        p6: 2,
        co2: 3,

        bas_met: 3,
        bas_plast: 2,

        pelles: 2,

        poubelles_120l: 2,
        poubelles_240l: 2,

        caf: 1,

        picto_ext: 4,
        picto_caf: 4,
        picto_defense_de_fumer: 4,

        point_de_rasso: 1,

        contact_d_urgence: 1,

        canne_d_enfutage: 1,

        panneau_depotage_en_cours: 1,

        picto_danger_tgbt: true,

        panneau_event: true,

        livret_fiche_reflexe: true,

        politique: true,

        detecteur_de_fumee: 4,

        plots: 8,

        chainettes: 8,

        created_at: '2026-08-15',
    },
]