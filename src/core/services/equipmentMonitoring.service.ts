import { defineStore } from "pinia"
import type { EquipmentMonitoringFilterType, EquipmentMonitoringFormType } from "../../@types/EquipmentMonitoring.type"
import equipmentMonitoringApi from "../api/equipmentMonitoring.api"

export const useEquipmentMonitoringService=defineStore("equipment-monitoring",{
    actions:{
        async index(params?:EquipmentMonitoringFilterType){
            return await equipmentMonitoringApi.index(params)
        },
        async export(params?:EquipmentMonitoringFilterType){
            return await equipmentMonitoringApi.export(params)
        },
        async getFilters(){
            return await equipmentMonitoringApi.getFIlters()
        },
        async getSiteNames(){
            return await equipmentMonitoringApi.getSiteNames()
        },
        async store(data:EquipmentMonitoringFormType){
            return await equipmentMonitoringApi.store(data);
        },
        async storeBatch(data: {
            "equipments": EquipmentMonitoringFormType[]
        }) {
            return await equipmentMonitoringApi.storeBatch(data)
        },
        async delete(id:string|number){
            return await equipmentMonitoringApi.delete(id)
        }
    }
})