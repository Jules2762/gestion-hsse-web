type ActionStatusType="PENDING"|"IN_PROGRESS"|"FINISHED"
type ActionStatusJsonType={
    label: string,
    value: ActionStatusType
}[]
export type {
    ActionStatusType,
    ActionStatusJsonType
}
