import type { ActionStatusJsonType, ActionStatusType, ActionType } from "../@types/Action.type"

const ActionStatusData = ["PENDING", "IN_PROGRESS", "FINISHED"] as ActionStatusType[]
const ActionStatusDataJson = [
    {
        label: "En attente",
        value: "PENDING"
    },
    {
        label: "En cours",
        value: "IN_PROGRESS"
    },
    {
        label: "Terminée",
        value: "FINISHED"
    },
] as ActionStatusJsonType
const ActionData: ActionType[] = [
    {
        id: 1,
        description: "Remplacer les extincteurs arrivés à expiration dans la zone de stockage.",
        status: "PENDING",
        assigned_to: 3,
        checklist_item_id: 12,
        created_at: "2026-08-20T08:30:00",
    },
    {
        id: 2,
        description: "Installer une signalisation de sécurité à l'entrée de la zone de production.",
        status: "IN_PROGRESS",
        assigned_to: 5,
        checklist_item_id: 15,
        created_at: "2026-08-20T09:15:00",
    },
    {
        id: 3,
        description: "Vérifier et sécuriser les câbles électriques exposés.",
        status: "FINISHED",
        assigned_to: 2,
        checklist_item_id: 18,
        created_at: "2026-08-19T14:20:00",
    },
    {
        id: 4,
        description: "Mettre à disposition des équipements de protection individuelle pour les nouveaux employés.",
        status: "PENDING",
        assigned_to: 4,
        checklist_item_id: 21,
        created_at: "2026-08-21T08:45:00",
    },
    {
        id: 5,
        description: "Réparer la fuite d'eau détectée dans les sanitaires.",
        status: "IN_PROGRESS",
        assigned_to: 6,
        checklist_item_id: 24,
        created_at: "2026-08-21T10:10:00",
    },
    {
        id: 6,
        description: "Effectuer la maintenance préventive du système de ventilation.",
        status: "FINISHED",
        assigned_to: 3,
        checklist_item_id: 27,
        created_at: "2026-08-18T11:30:00",
    },
    {
        id: 7,
        description: "Nettoyer et dégager les issues de secours obstruées.",
        status: "PENDING",
        assigned_to: 2,
        checklist_item_id: 30,
        created_at: "2026-08-22T07:50:00",
    },
    {
        id: 8,
        description: "Mettre à jour le registre de contrôle des équipements de sécurité.",
        status: "IN_PROGRESS",
        assigned_to: 5,
        checklist_item_id: 33,
        created_at: "2026-08-22T13:40:00",
    },
    {
        id: 9,
        description: "Organiser une sensibilisation du personnel sur le port obligatoire des EPI.",
        status: "FINISHED",
        assigned_to: 4,
        checklist_item_id: 36,
        created_at: "2026-08-17T09:00:00",
    },
    {
        id: 10,
        description: "Contrôler les conditions de stockage des produits chimiques.",
        status: "PENDING",
        assigned_to: 6,
        checklist_item_id: 39,
        created_at: "2026-08-23T08:20:00",
    },
    {
        id: 11,
        description: "Remplacer les panneaux de sécurité endommagés dans la zone de production.",
        status: "IN_PROGRESS",
        assigned_to: 3,
        checklist_item_id: 42,
        created_at: "2026-08-23T10:35:00",
    },
    {
        id: 12,
        description: "Effectuer un contrôle de conformité des trousses de premiers secours.",
        status: "FINISHED",
        assigned_to: 2,
        checklist_item_id: 45,
        created_at: "2026-08-16T15:10:00",
    },
];
export {
    ActionStatusData,
    ActionStatusDataJson,ActionData
}