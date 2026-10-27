import type { LogType, LogTypeType } from "../@types/Logs.type";
const LogTypeData:LogTypeType[] =[ "USER_CREATED" , "USER_UPDATED" , "USER_DELETED" , "CHECKLIST_CREATED" , "CHECKLIST_UPDATED" , "CHECKLIST_DELETED" , "CHECKLIST_FINISHED"]
const LogData: LogType[] = [
    {
        id: 1,
        type: "USER_CREATED",
        title: "Utilisateur créé",
        description: "L'utilisateur Jean Dupont a été créé avec succès.",
        user_id: 1,
        created_at: "2026-08-27T08:15:00",
    },
    {
        id: 2,
        type: "USER_UPDATED",
        title: "Utilisateur modifié",
        description: "Les informations de l'utilisateur Marie Rakoto ont été modifiées.",
        user_id: 1,
        created_at: "2026-08-27T08:32:00",
    },
    {
        id: 3,
        type: "USER_DELETED",
        title: "Utilisateur supprimé",
        description: "L'utilisateur Paul Martin a été supprimé du système.",
        user_id: 1,
        created_at: "2026-08-27T09:05:00",
    },
    {
        id: 4,
        type: "CHECKLIST_CREATED",
        title: "Checklist créée",
        description: "La checklist « Inspection sécurité des équipements » a été créée.",
        user_id: 2,
        created_at: "2026-08-27T09:20:00",
    },
    {
        id: 5,
        type: "CHECKLIST_UPDATED",
        title: "Checklist modifiée",
        description: "La checklist « Inspection sécurité des équipements » a été mise à jour.",
        user_id: 2,
        created_at: "2026-08-27T10:10:00",
    },
    {
        id: 6,
        type: "CHECKLIST_FINISHED",
        title: "Checklist terminée",
        description: "La checklist « Inspection sécurité des équipements » a été terminée.",
        user_id: 3,
        created_at: "2026-08-27T10:45:00",
    },
    {
        id: 7,
        type: "CHECKLIST_CREATED",
        title: "Checklist créée",
        description: "La checklist « Contrôle des équipements de protection individuelle » a été créée.",
        user_id: 2,
        created_at: "2026-08-27T11:15:00",
    },
    {
        id: 8,
        type: "CHECKLIST_UPDATED",
        title: "Checklist modifiée",
        description: "Les critères de contrôle de la checklist ont été modifiés.",
        user_id: 3,
        created_at: "2026-08-27T11:40:00",
    },
    {
        id: 9,
        type: "CHECKLIST_DELETED",
        title: "Checklist supprimée",
        description: "La checklist « Contrôle quotidien des véhicules » a été supprimée.",
        user_id: 1,
        created_at: "2026-08-27T13:05:00",
    },
    {
        id: 10,
        type: "CHECKLIST_FINISHED",
        title: "Checklist terminée",
        description: "La checklist « Contrôle des équipements de protection individuelle » a été terminée.",
        user_id: 3,
        created_at: "2026-08-27T14:20:00",
    },
]
export {
    LogData,LogTypeData
}