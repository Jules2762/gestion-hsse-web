import type { DocumentType, FolderType } from "../@types/DocumentLibrary.type"

const DocumentData: DocumentType[] = [
    {
        id: 1,
        folder_id: 4,

        name: 'Fiche Présence Formation Incendie',

        original_name:
            'FICHE_DE_PRESENCE_2026.pdf',

        path:
            '/documents/formations/2026/fiche_presence_incendie.pdf',

        mime_type:
            'application/pdf',

        size: '1.4 MB',

        version: 'v1.0',

        uploaded_by: 1,

        created_at: '2026-08-18',
    },

    {
        id: 2,
        folder_id: 4,

        name:
            'Fiche Présence Formation HSE',

        original_name:
            'presence_hse_aout.pdf',

        path:
            '/documents/formations/2026/presence_hse_aout.pdf',

        mime_type:
            'application/pdf',

        size: '2.1 MB',

        version: 'v1.1',

        uploaded_by: 1,

        created_at: '2026-08-20',
    },

    {
        id: 3,
        folder_id: 6,

        name:
            'Inspection Station Talatamaty',

        original_name:
            'inspection_ss_talatamaty.pdf',

        path:
            '/documents/inspections/stations/talatamaty.pdf',

        mime_type:
            'application/pdf',

        size: '5.6 MB',

        version: 'v2.0',

        uploaded_by: 2,

        created_at: '2026-08-10',
    },

    {
        id: 4,
        folder_id: 6,

        name:
            'Inspection Station Ivato',

        original_name:
            'inspection_ivato.pdf',

        path:
            '/documents/inspections/stations/ivato.pdf',

        mime_type:
            'application/pdf',

        size: '4.2 MB',

        version: 'v1.0',

        uploaded_by: 3,

        created_at: '2026-08-11',
    },

    {
        id: 5,
        folder_id: 7,

        name:
            'Inspection Dépôt Toamasina',

        original_name:
            'depot_toamasina_2026.pdf',

        path:
            '/documents/inspections/depots/toamasina.pdf',

        mime_type:
            'application/pdf',

        size: '8.1 MB',

        version: 'v1.3',

        uploaded_by: 2,

        created_at: '2026-08-14',
    },

    {
        id: 6,
        folder_id: 8,

        name:
            'Rapport HSSE Août 2026',

        original_name:
            'rapport_hsse_aout.pdf',

        path:
            '/documents/rapports/hsse_aout_2026.pdf',

        mime_type:
            'application/pdf',

        size: '6.8 MB',

        version: 'v1.0',

        uploaded_by: 1,

        created_at: '2026-08-22',
    },

    {
        id: 7,
        folder_id: 9,

        name:
            'Procédure Gestion Déversement',

        original_name:
            'procedure_deversement.pdf',

        path:
            '/documents/procedures/deversement.pdf',

        mime_type:
            'application/pdf',

        size: '850 KB',

        version: 'v3.2',

        uploaded_by: 1,

        created_at: '2026-08-12',
    },

    {
        id: 8,
        folder_id: 9,

        name:
            'Procédure Port des EPI',

        original_name:
            'epi_procedure.pdf',

        path:
            '/documents/procedures/epi.pdf',

        mime_type:
            'application/pdf',

        size: '950 KB',

        version: 'v2.1',

        uploaded_by: 1,

        created_at: '2026-08-13',
    },

    {
        id: 9,
        folder_id: 10,

        name:
            'Audit HSSE Externe',

        original_name:
            'audit_2026_final.pdf',

        path:
            '/documents/audits/audit_2026_final.pdf',

        mime_type:
            'application/pdf',

        size: '11.3 MB',

        version: 'v1.0',

        uploaded_by: 4,

        created_at: '2026-08-16',
    },
]


const FolderData: FolderType[] = [
    {
        id: 1,
        name: 'Documentation HSSE',
        description:
            'Documentation principale HSSE',
        created_by: 1,
        created_at: '2026-08-01',
    },

    {
        id: 2,
        name: 'Formations',
        parent_id: 1,
        description:
            'Documents liés aux formations',
        created_by: 1,
        created_at: '2026-08-02',
    },

    {
        id: 3,
        name: '2026',
        parent_id: 2,
        description:
            'Formations réalisées en 2026',
        created_by: 1,
        created_at: '2026-08-02',
    },

    {
        id: 4,
        name: 'Fiches de présence',
        parent_id: 3,
        description:
            'Fiches signées de présence',
        created_by: 1,
        created_at: '2026-08-03',
    },
    {
        id: 5,
        name: 'Inspections',
        parent_id: 1,
        description:
            'Rapports et contrôles terrain',
        created_by: 1,
        created_at: '2026-08-05',
    },

    {
        id: 6,
        name: 'Stations-Service',
        parent_id: 5,
        description:
            'Inspections des stations-service',
        created_by: 1,
        created_at: '2026-08-06',
    },

    {
        id: 7,
        name: 'Dépôts',
        parent_id: 5,
        description:
            'Inspections des dépôts',
        created_by: 1,
        created_at: '2026-08-06',
    },

    {
        id: 8,
        name: 'Rapports',
        parent_id: 1,
        description:
            'Rapports consolidés',
        created_by: 1,
        created_at: '2026-08-08',
    },

    {
        id: 9,
        name: 'Procédures',
        parent_id: 1,
        description:
            'Procédures opérationnelles',
        created_by: 1,
        created_at: '2026-08-09',
    },

    {
        id: 10,
        name: 'Audits',
        parent_id: 1,
        description:
            'Documents d’audits HSSE',
        created_by: 1,
        created_at: '2026-08-10',
    },
]

export {
    DocumentData,
    FolderData
}