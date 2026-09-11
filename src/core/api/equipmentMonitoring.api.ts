import api from ".";
import type { EquipmentMonitoringFilterType, EquipmentMonitoringFormType } from "../../@types/EquipmentMonitoring.type";

export default {
    index(params?: EquipmentMonitoringFilterType) {
        return api.get("/home/equipments-monitoring/equipments", { params })
    },
    getFIlters() {
        return api.get("/home/equipments-monitoring/filters")
    },
    getSiteNames(){
        return api.get("/home/equipments-monitoring/site-names");
    },
    store(data:EquipmentMonitoringFormType){
        return api.post("/home/equipments-monitoring/equipments",data)
    },
    storeBatch(data: {
        "equipments": EquipmentMonitoringFormType[]
    }) {
        return api.post("/home/equipments-monitoring/import", data)
    }
}