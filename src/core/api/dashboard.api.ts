import api from "."

export default {
    getTrainingPlanKPIs() {
        return api.get("/home/dashboard/training-plan/kpis")
    },
    getTrainingPlanSessions() {
        return api.get("/home/dashboard/training-plan/sessions")
    },
    getTrainingPlanDirections() {
        return api.get("/home/dashboard/training-plan/directions")
    },
    getTrainingPlanChartDirections() {
        return api.get("/home/dashboard/training-plan/chart-directions")
    },
    getMonthlyChart(params?: { year: number | string }) {
        if (!params || !params.year) {
            params = { ...params, year: new Date().getFullYear() }
        }
        return api.get(`/home/dashboard/training-plan/monthly`, { params })
    },

    // VMC Dashboard
    getVmcKPIs() {
        return api.get("/home/dashboard/vmc/kpis")
    },
    getVmcMonthly(params?: { year?: number | string }) {
        return api.get("/home/dashboard/vmc/monthly", { params })
    },
    getVmcTypes() {
        return api.get("/home/dashboard/vmc/types")
    },
    getVmcStatus() {
        return api.get("/home/dashboard/vmc/status")
    },
    getVmcSites() {
        return api.get("/home/dashboard/vmc/sites")
    },
    getVmcDirections() {
        return api.get("/home/dashboard/vmc/directions")
    },
    getVmcPeople() {
        return api.get("/home/dashboard/vmc/people")
    },

    // General Dashboard
    getGeneralKPIs() {
        return api.get("/home/dashboard/general/kpis")
    },
    getGeneralPerformance(params?: { year?: number | string }) {
        return api.get("/home/dashboard/general/performance", { params })
    },
    getGeneralLatestInspections() {
        return api.get("/home/dashboard/general/latest-inspections")
    },
    getGeneralLatestActions() {
        return api.get("/home/dashboard/general/latest-actions")
    },

    // Inspection & Checklist Dashboard
    getInspectionKPIs(params?: { year?: number | string }) {
        return api.get("/home/dashboard/inspection/kpis", { params })
    },
    getInspectionMapData(params?: { year?: number | string }) {
        return api.get("/home/dashboard/inspection/map", { params })
    },

    // VMC Map
    getVmcMapData(params?: { year?: number | string }) {
        return api.get("/home/dashboard/vmc/map", { params })
    },

    // Equipment Dashboard
    getEquipmentKPIs(params?: { year?: number | string }) {
        return api.get("/home/dashboard/equipment/kpis", { params })
    },
    getEquipmentMapData(params?: { year?: number | string }) {
        return api.get("/home/dashboard/equipment/map", { params })
    },

    // Admin Dashboard
    getAdminKPIs() {
        return api.get("/home/dashboard/admin/kpis")
    },
    getAdminActivityChart(params?: { days?: number }) {
        return api.get("/home/dashboard/admin/activity-chart", { params })
    },
    getAdminDirectionsStats() {
        return api.get("/home/dashboard/admin/directions-stats")
    },
    getAdminRecentActivities() {
        return api.get("/home/dashboard/admin/recent-activities")
    }
}