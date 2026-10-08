type DashboardTrainingPlanKPIs = {
    sessionsCount: number,
    totalTrainingHours: number,
    trainingPlanCompletionRate: number,
    totalParticipants: number,
    overallParticipationRate: number,
    uniqueTrainedPeople:number,
    trainingParticipationRate:number
}
 type DashboardTrainingPlanChartSessionType={
    name:string,
    count:number
 }
 type DashboardTrainingPlanTableDirectionType={
    direction:string,
    direction_personnel_count:number,
    trained_per_direction:number,
    rate_trained_per_direction:number,
 }
 type DashboardTrainingPlanChartDirectionType={
    name:string,
    trained:number
 }
 
type ColorType =
    | 'red'
    | 'green'
    | 'orange'
    | 'blue'
    | 'purple'
    | 'pink'
    | 'yellow'
    | 'indigo'
    | 'teal'
    | 'cyan'
    | 'gray'
    | 'slate'

export type {
    DashboardTrainingPlanKPIs,
    DashboardTrainingPlanChartSessionType,
    DashboardTrainingPlanTableDirectionType,
    DashboardTrainingPlanChartDirectionType,
    ColorType
}