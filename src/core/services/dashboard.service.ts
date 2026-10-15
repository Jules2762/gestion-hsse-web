import dashboardApi from "../api/dashboard.api"

export default {
    async getTrainingPlanKPIs() {
        return await dashboardApi.getTrainingPlanKPIs()
    },
    async getTrainingPlanSessions() {
        return await dashboardApi.getTrainingPlanSessions()
    },
    async getTrainingPlanDirections() {
        return await dashboardApi.getTrainingPlanDirections()
    },
    async getTrainingPlanChartDirections() {
        return await dashboardApi.getTrainingPlanChartDirections()
    },
    async getMonthlyChart(params?: { year: number | string }) {
        return await dashboardApi.getMonthlyChart(params)
    },

    // VMC Dashboard
    async getVmcKPIs() {
        return await dashboardApi.getVmcKPIs()
    },
    async getVmcMonthly(params?: { year?: number | string }) {
        return await dashboardApi.getVmcMonthly(params)
    },
    async getVmcTypes() {
        return await dashboardApi.getVmcTypes()
    },
    async getVmcStatus() {
        return await dashboardApi.getVmcStatus()
    },
    async getVmcSites() {
        return await dashboardApi.getVmcSites()
    },
    async getVmcDirections() {
        return await dashboardApi.getVmcDirections()
    },
    async getVmcPeople() {
        return await dashboardApi.getVmcPeople()
    },

    // General Dashboard
    async getGeneralKPIs() {
        return await dashboardApi.getGeneralKPIs()
    },
    async getGeneralPerformance(params?: { year?: number | string }) {
        return await dashboardApi.getGeneralPerformance(params)
    },
    async getGeneralLatestInspections() {
        return await dashboardApi.getGeneralLatestInspections()
    },
    async getGeneralLatestActions() {
        return await dashboardApi.getGeneralLatestActions()
    },

    // Inspection & Checklist Dashboard
    async getInspectionKPIs(params?: { year?: number | string }) {
        return await dashboardApi.getInspectionKPIs(params)
    },

    // Equipment Dashboard
    async getEquipmentKPIs() {
        return await dashboardApi.getEquipmentKPIs()
    }
}