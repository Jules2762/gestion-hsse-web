import type { FormationType, VoletType } from "../@types/Formation.type"

const VoletData: VoletType[] = ["Environnement", "Santé", "Sécurité", "Sûreté"]
const FormationTypeData: FormationType[] = ["Atelier", "Exercice d urgence", "Formation", "Induction", "Sensibilisation"]


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
    VoletJsonData
}