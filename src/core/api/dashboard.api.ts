import api from "."

export default {
    getTrainingPlanKPIs(){
        return api.get("/home/dashboard/training-plan/kpis")
    },
    getTrainingPlanSessions(){
        return api.get("/home/dashboard/training-plan/sessions")
    },
    getTrainingPlanDirections(){
        return api.get("/home/dashboard/training-plan/directions")
    },
    getTrainingPlanChartDirections(){
        return api.get("/home/dashboard/training-plan/chart-directions")
    },
    getMonthlyChart(params?: { year: number | string }){
        if(!params || !params.year) {
            params = { ...params, year: new Date().getFullYear() }
        }
        return api.get(`/home/dashboard/training-plan/monthly`, { params })
    }

}