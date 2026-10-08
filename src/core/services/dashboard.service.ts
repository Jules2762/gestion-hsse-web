import dashboardApi from "../api/dashboard.api"

export default {
    async getTrainingPlanKPIs(){
        return await dashboardApi.getTrainingPlanKPIs()
    },
    async getTrainingPlanSessions(){
        return await dashboardApi.getTrainingPlanSessions()
    },
    async getTrainingPlanDirections(){
        return await dashboardApi.getTrainingPlanDirections()
    },
    async getTrainingPlanChartDirections(){
        return await dashboardApi.getTrainingPlanChartDirections()
    },
    async getMonthlyChart(params?: { year: number | string }){
        return await dashboardApi.getMonthlyChart(params)
    }
}