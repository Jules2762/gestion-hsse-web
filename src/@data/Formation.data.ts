import type { FormationType, FormationTypeType, VoletType } from "../@types/Formation.type"

const VoletData: VoletType[] = ["Environnement", "Santé", "Sécurité", "Sûreté"]
const FormationTypeData: FormationTypeType[] = ["Atelier", "Exercice d'urgence", "Formation", "Induction", "Sensibilisation"]

const FormationData: FormationType[] = [
    {
        id: 1,
        title: "Formation Sécurité Incendie",
        date: "2026-08-15",
        type: "Formation",
        volet: "Sécurité",
        trainer: "Jules ARIMANANA",
        duration: 4,
        target: "Personnel station-service",
        participant: 25,
        target_type: "Employés"
    },

    {
        id: 2,
        title: "Sensibilisation Port des EPI",
        date: "2026-08-18",
        type: "Sensibilisation",
        volet: "Sécurité",
        trainer: "Maxwell ANDRIANANTOANINA",
        duration: 2,
        target: "Opérateurs terrain",
        participant: 18,
        target_type: "Employés"
    },

    {
        id: 3,
        title: "Induction Nouveaux Collaborateurs",
        date: "2026-08-20",
        type: "Induction",
        volet: "Santé",
        trainer: "Jules ARIMANANA",
        duration: 3,
        target: "Nouvelles recrues",
        participant: 12,
        target_type: "Nouveaux employés"
    },

    {
        id: 4,
        title: "Atelier Gestion des Déversements",
        date: "2026-08-22",
        type: "Atelier",
        volet: "Environnement",
        trainer: "Hery Rakotomalala",
        duration: 6,
        target: "Chefs de dépôt",
        participant: 15,
        target_type: "Managers"
    },

    {
        id: 5,
        title: "Exercice d'Évacuation d'Urgence",
        date: "2026-08-25",
        type: "Exercice d'urgence",
        volet: "Sécurité",
        trainer: "Jules ARIMANANA",
        duration: 2,
        target: "Personnel du siège",
        participant: 45,
        target_type: "Tous employés"
    },

    {
        id: 6,
        title: "Sensibilisation Gestion des Déchets",
        date: "2026-08-26",
        type: "Sensibilisation",
        volet: "Environnement",
        trainer: "Mamy Randrianarisoa",
        duration: 3,
        target: "Personnel de maintenance",
        participant: 20,
        target_type: "Employés"
    },

    {
        id: 7,
        title: "Formation Premiers Secours",
        date: "2026-09-02",
        type: "Formation",
        volet: "Santé",
        trainer: "Dr. Rakoto",
        duration: 8,
        target: "Équipe HSSE",
        participant: 10,
        target_type: "Équipe spécialisée"
    },

    {
        id: 8,
        title: "Atelier Analyse des Risques",
        date: "2026-09-05",
        type: "Atelier",
        volet: "Sûreté",
        trainer: "Maxwell ANDRIANANTOANINA",
        duration: 5,
        target: "Superviseurs",
        participant: 16,
        target_type: "Cadres"
    },

    {
        id: 9,
        title: "Induction Sous-traitants",
        date: "2026-09-08",
        type: "Induction",
        volet: "Sûreté",
        trainer: "Jules ARIMANANA",
        duration: 2,
        target: "Sous-traitants",
        participant: 30,
        target_type: "Prestataires"
    },

    {
        id: 10,
        title: "Exercice Gestion de Crise",
        date: "2026-09-12",
        type: "Exercice d'urgence",
        volet: "Sûreté",
        trainer: "Hery Rakotomalala",
        duration: 4,
        target: "Comité de direction",
        participant: 12,
        target_type: "Direction"
    },
    {
        id: 11,
        title: "Induction Sous-traitants",
        date: "2026-09-08",
        type: "Induction",
        volet: "Sûreté",
        trainer: "Jules ARIMANANA",
        duration: 2,
        target: "Sous-traitants",
        participant: 30,
        target_type: "Prestataires"
    },

    {
        id: 12,
        title: "Exercice Gestion de Crise",
        date: "2026-09-12",
        type: "Exercice d'urgence",
        volet: "Sûreté",
        trainer: "Hery Rakotomalala",
        duration: 4,
        target: "Comité de direction",
        participant: 12,
        target_type: "Direction"
    }
]
const FormationTypeJsonData: {
    label: string,
    value: FormationTypeType
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
    FormationData,
    FormationTypeJsonData,
    VoletJsonData
}