import type { FormationType, VoletType, FormationStatusType, FormationStatusJsonType } from "../@types/Formation.type"

const VoletData: VoletType[] = ["Environnement", "Santé", "Sécurité", "Sûreté"]
const FormationTypeData: FormationType[] = ["Atelier", "Exercice d'urgence", "Formation", "Induction", "Réunion", "Sensibilisation"]
const FormationStatusData:FormationStatusType[]=["SCHEDULED","COMPLETED","CANCELLED","POSTPONED"]
const FormationStatusJsonData: FormationStatusJsonType[] = [
    {
        label: 'Planifiée',
        value: 'SCHEDULED'
    },
    {
        label: 'Terminée',
        value: 'COMPLETED'
    },
    {
        label: 'Annulée',
        value: 'CANCELLED'
    },
    {
        label: 'Reportée',
        value: 'POSTPONED'
    }
]

const FormationTypeJsonData: {
    label: string,
    value: FormationType
}[] = FormationTypeData.map(item => ({
    label: item,
    value: item
}))
const VoletJsonData: {
    label: string,
    value: VoletType
}[] = VoletData.map(item => ({
    label: item,
    value: item
}))
export {
    VoletData,
    FormationTypeData,
    FormationTypeJsonData,
    VoletJsonData,
    FormationStatusData,
    FormationStatusJsonData
}