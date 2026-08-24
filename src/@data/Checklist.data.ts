import type { ChecklistStatusJsonType, ChecklistStatusType, Checklistype } from "../@types/Checklist.type";

const ChecklistStatusData = ["DRAFT", "IN_PROGRESS", "COMPLETED", "CANCELLED"] as ChecklistStatusType[]
const ChecklistStatusJsonData = [
    {
        label: 'Planifiée',
        value: 'DRAFT',
    },

    {
        label: 'En cours',
        value: 'IN_PROGRESS',
    },

    {
        label: 'Clôturée',
        value: 'COMPLETED',
    },

    {
        label: 'Annulée',
        value: 'CANCELLED',
    },
] as ChecklistStatusJsonType
const ChecklistsData: Checklistype[] = [
    {
        id: 1,
        site: 'Dépôt Antananarivo',
        type: 'Sécurité',
        title: 'Inspection des équipements incendie',
        description:
            'Vérification des extincteurs, RIA et systèmes de détection incendie.',
        location: 'Antananarivo',
        date: '2026-08-15',
        time: '08:30',
        inspector: 'Jules ARIMANANA',
        accompanying_person: 'Maxwell Rakoto',
        contact: '+261 34 12 345 67',
        manager: 'Responsable HSSE',
        comment:
            'Quelques extincteurs nécessitent une recharge.',
        status: 'COMPLETED',
        started_at: '2026-08-15 08:30:00',
        completed_at: '2026-08-15 10:15:00',
    },

    {
        id: 2,
        site: 'Dépôt Toamasina',
        type: 'Environnement',
        title: 'Inspection environnementale',
        description:
            'Contrôle de la gestion des déchets et des zones sensibles.',
        location: 'Toamasina',
        date: '2026-08-18',
        time: '09:00',
        inspector: 'Sarah Andriamihaja',
        accompanying_person: 'David Randria',
        contact: '+261 34 22 345 67',
        manager: 'Chef de dépôt',
        status: 'IN_PROGRESS',
        started_at: '2026-08-18 09:00:00',
    },

    {
        id: 3,
        site: 'Dépôt Mahajanga',
        type: 'Santé',
        title: 'Inspection des installations sanitaires',
        description:
            'Évaluation des équipements sanitaires et des points de premiers secours.',
        location: 'Mahajanga',
        date: '2026-08-20',
        time: '14:00',
        inspector: 'Miora Razafindraibe',
        accompanying_person: 'Eric Rabemananjara',
        contact: '+261 34 33 345 67',
        manager: 'Responsable HSE',
        status: 'DRAFT',
    },

    {
        id: 4,
        site: 'Dépôt Antsirabe',
        type: 'Sécurité',
        title: 'Inspection des EPI',
        description:
            'Contrôle du port et de la disponibilité des équipements de protection individuelle.',
        location: 'Antsirabe',
        date: '2026-08-10',
        time: '07:45',
        inspector: 'Jean Rakoto',
        accompanying_person: 'Christian Andrianjafy',
        contact: '+261 34 44 345 67',
        manager: 'Superviseur opérationnel',
        comment:
            'Absence constatée de certains gants de protection.',
        status: 'COMPLETED',
        started_at: '2026-08-10 07:45:00',
        completed_at: '2026-08-10 09:10:00',
    },

    {
        id: 5,
        site: 'Dépôt Antananarivo',
        type: 'Qualité',
        title: 'Inspection des procédures opérationnelles',
        description:
            'Vérification de l’application des procédures en vigueur.',
        location: 'Antananarivo',
        date: '2026-08-22',
        time: '10:00',
        inspector: 'Jules ARIMANANA',
        accompanying_person: 'Patrick Rasoanaivo',
        contact: '+261 34 55 345 67',
        manager: 'Responsable Exploitation',
        status: 'DRAFT',
    },

    {
        id: 6,
        site: 'Station Galana Ivato',
        type: 'Sécurité',
        title: 'Inspection générale de site',
        description:
            'Inspection globale du site, des accès, signalétiques et équipements.',
        location: 'Ivato',
        date: '2026-08-12',
        time: '13:30',
        inspector: 'Maxwell Rakoto',
        accompanying_person: 'Nirina Ravelomanana',
        contact: '+261 34 66 345 67',
        manager: 'Directeur de site',
        comment:
            'Signalisation à renouveler dans la zone de stockage.',
        status: 'COMPLETED',
        started_at: '2026-08-12 13:30:00',
        completed_at: '2026-08-12 16:00:00',
    },

    {
        id: 7,
        site: 'Dépôt Toamasina',
        type: 'Sécurité',
        title: 'Inspection des accès et circulation',
        description:
            'Contrôle des voies de circulation et accès d’urgence.',
        location: 'Toamasina',
        date: '2026-08-25',
        time: '08:00',
        inspector: 'Sarah Andriamihaja',
        accompanying_person: 'Fabrice Rakotomalala',
        contact: '+261 34 77 345 67',
        manager: 'Chef de dépôt',
        status: 'DRAFT',
    },

    {
        id: 8,
        site: 'Dépôt Mahajanga',
        type: 'Environnement',
        title: 'Inspection gestion des hydrocarbures',
        description:
            'Vérification des zones de stockage et risques de pollution.',
        location: 'Mahajanga',
        date: '2026-08-14',
        time: '11:00',
        inspector: 'Miora Razafindraibe',
        accompanying_person: 'Hery Rakotondrazaka',
        contact: '+261 34 88 345 67',
        manager: 'Responsable Environnement',
        status: 'CANCELLED',
        comment:
            'Inspection reportée suite à des contraintes opérationnelles.',
    },
]
export {
    ChecklistStatusData,
    ChecklistStatusJsonData,
    ChecklistsData
}