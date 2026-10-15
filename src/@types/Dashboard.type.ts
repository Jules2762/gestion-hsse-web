type DashboardTrainingPlanKPIs = {
    sessionsCount: number,
    totalTrainingHours: number,
    trainingPlanCompletionRate: number,
    totalParticipants: number,
    overallParticipationRate: number,
    uniqueTrainedPeople: number,
    trainingParticipationRate: number
}

type DashboardTrainingPlanChartSessionType = {
    name: string,
    count: number
}

type DashboardTrainingPlanTableDirectionType = {
    direction: string,
    direction_personnel_count: number,
    trained_per_direction: number,
    rate_trained_per_direction: number,
}

type DashboardTrainingPlanChartDirectionType = {
    name: string,
    trained: number
}

type DashboardVmcKPIs = {
    totalVmc: number,
    completedVmc: number,
    completionRate: number,
    inProgressVmc: number,
    draftVmc: number,
    visitesSS: number,
    visitesCamion: number,
    visitesMagasinAgence: number,
    visitesMagasin: number,
    visitesAgence: number,
    totalRemontees: number,
    totalActions: number,
    closedActions: number,
    conformityRate: number,
}

type DashboardVmcMonthlyType = {
    categories: string[],
    series: {
        name: string,
        data: number[]
    }[]
}

type DashboardVmcTypesType = {
    labels: string[],
    series: number[]
}

type DashboardVmcStatusType = {
    labels: string[],
    series: number[]
}

type DashboardVmcSiteType = {
    site: string,
    total: number,
    completed: number,
    in_progress: number,
    rate: number,
}

type DashboardVmcDirectionType = {
    direction: string,
    total: number,
    completed: number,
    in_progress: number,
    rate: number,
}

type DashboardVmcPersonType = {
    id: number,
    name: string,
    direction: string,
    fonction: string,
    total: number,
    completed: number,
    in_progress: number,
    rate: number,
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
    DashboardVmcKPIs,
    DashboardVmcMonthlyType,
    DashboardVmcTypesType,
    DashboardVmcStatusType,
    DashboardVmcSiteType,
    DashboardVmcDirectionType,
    DashboardVmcPersonType,
    ColorType
}