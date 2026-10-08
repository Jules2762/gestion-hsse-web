type VoletType="Environnement"|"Santé"|"Sécurité"|"Sûreté"
type FormationType="Atelier"|"Exercice d'urgence"|"Formation"|"Induction"|"Sensibilisation"
type FormationStatusType="SCHEDULED"|"COMPLETED"|"CANCELLED"|"POSTPONED"
type FormationStatusJsonType={
    label:string,
    value: FormationStatusType
}
type FormationFilterType={
    page?:number,
    per_page?:number,
    date?:{
        from?:string,
        to?:string
    },
    type?:FormationType[],
    section?:VoletType[],
    trainer?:string[],
    target?:string[],
    search?:string
}
type FormationFormType={
    title:string,
    date:string,
    type:FormationType,
    volet:VoletType,
    trainer:string,
    duration:string,
    target:string,
    participant:number,
    target_type:string,
    status?:FormationStatusType
}
type FormationDataType={
    id:number|string,
    title:string,
    date:string,
    type:FormationType,
    volet:VoletType,
    trainer:string,
    duration:string,
    target:string,
    participant:number,
    participant_count?:number,
    target_type:string,
    status:FormationStatusType,
    creator:{
        id:string|number,
        first_name:string,
        last_name?:string,
        email:string
    },
    created_at:string,
    updated_at:string
}
type ParticipantStoreFormType = {
    formation_id: string | number,
    personnel_id: string | number
}
export type {
    VoletType,
    FormationFormType,
    FormationType,
    FormationDataType,
    FormationFilterType,
    FormationStatusJsonType,
    FormationStatusType,
    ParticipantStoreFormType
}