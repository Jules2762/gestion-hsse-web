import api from ".";
import type { EquipmentMonitoringFilterType, EquipmentMonitoringFormType } from "../../@types/EquipmentMonitoring.type";

export default {
    index(params?: EquipmentMonitoringFilterType) {
        return api.get("/home/equipments-monitoring/equipments", { params })
    },
    show(id:string|number){
        return api.get('/home/equipments-monitoring/equipments/'+id)
    },
    export(params?: EquipmentMonitoringFilterType) {
        return api.get("/home/equipments-monitoring/export", { params })
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
    update(id:string|number,data:EquipmentMonitoringFormType){
        return api.put("/home/equipments-monitoring/equipments/"+id,data)
    },
    storeBatch(data: {
        "equipments": EquipmentMonitoringFormType[]
    }) {
        return api.post("/home/equipments-monitoring/import", data)
    },
    delete(id?:string|number){
        return api.delete("/home/equipments-monitoring/equipments/"+id)
    }
}