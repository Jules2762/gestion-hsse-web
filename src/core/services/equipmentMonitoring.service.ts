import { defineStore } from "pinia"
import type { EquipmentMonitoringFilterType, EquipmentMonitoringFormType } from "../../@types/EquipmentMonitoring.type"
import equipmentMonitoringApi from "../api/equipmentMonitoring.api"

export const useEquipmentMonitoringService = defineStore("equipment-monitoring", {
    actions: {
        async index(params?: EquipmentMonitoringFilterType) {
            return await equipmentMonitoringApi.index(params)
        },
        async show(id: string | number) {
            return await equipmentMonitoringApi.show(id)
        },
        async getItems(id: string | number) {
            return await equipmentMonitoringApi.getItems(id)
        },
        async updateItem(itemId: number, data: { conformity?: boolean; value?: any; comment?: string; location?: string }) {
            return await equipmentMonitoringApi.updateItem(itemId, data)
        },
        async uploadItemPhoto(itemId: number, photo: File) {
            return await equipmentMonitoringApi.uploadItemPhoto(itemId, photo)
        },
        async export(params?: EquipmentMonitoringFilterType) {
            return await equipmentMonitoringApi.export(params)
        },
        async getFilters() {
            return await equipmentMonitoringApi.getFIlters()
        },
        async getSiteNames() {
            return await equipmentMonitoringApi.getSiteNames()
        },
        async store(data: EquipmentMonitoringFormType) {
            return await equipmentMonitoringApi.store(data);
        },
        async update(id: string | number, data: EquipmentMonitoringFormType) {
            return await equipmentMonitoringApi.update(id, data);
        },
        async storeBatch(data: {
            "equipments": EquipmentMonitoringFormType[]
        }) {
            return await equipmentMonitoringApi.storeBatch(data)
        },
        async delete(id: string | number) {
            return await equipmentMonitoringApi.delete(id)
        }
    }
})