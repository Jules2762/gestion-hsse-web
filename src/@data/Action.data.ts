import type { ActionStatusJsonType, ActionStatusType } from "../@types/Action.type"

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
export {
    ActionStatusData,
    ActionStatusDataJson
}