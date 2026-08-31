type VoletType="Environnement"|"Santé"|"Sécurité"|"Sûreté"
type FormationTypeType="Atelier"|"Exercice d'urgence"|"Formation"|"Induction"|"Sensibilisation"
type FormationType={
    id:string|number,
    title:string,
    date:string,
    type:FormationTypeType,
    volet:VoletType,
    trainer:string,
    duration:number,
    target:string,
    participant:number,
    target_type:string
}
export type {
    VoletType,
    FormationType,
    FormationTypeType
}