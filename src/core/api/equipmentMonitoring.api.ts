import api from ".";
import type { EquipmentMonitoringFilterType, EquipmentMonitoringFormType } from "../../@types/EquipmentMonitoring.type";

export default {
    index(params?: EquipmentMonitoringFilterType) {
        return api.get("/home/equipments-monitoring/equipments", { params });
    },
    show(id: string | number) {
        return api.get('/home/equipments-monitoring/equipments/' + id);
    },
    getItems(id: string | number) {
        return api.get('/home/equipments-monitoring/equipments/' + id + '/items');
    },
    updateItem(itemId: number, data: { conformity?: boolean; value?: any; comment?: string; location?: string }) {
        return api.put('/home/equipments-monitoring/equipments/items/' + itemId, data);
    },
    uploadItemPhoto(itemId: number | string, photo: File) {
        const formData = new FormData();
        formData.append('photo', photo);
        return api.post('/home/equipments-monitoring/equipments/items/' + itemId + '/photo', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },
    deleteItemPhoto(photoId: number | string) {
        return api.delete('/home/equipments-monitoring/equipments/items/photo/' + photoId);
    },
    export(params?: EquipmentMonitoringFilterType) {
        return api.get("/home/equipments-monitoring/export", { params });
    },
    getFIlters() {
        return api.get("/home/equipments-monitoring/filters");
    },
    getSiteNames() {
        return api.get("/home/equipments-monitoring/site-names");
    },
    store(data: EquipmentMonitoringFormType) {
        return api.post("/home/equipments-monitoring/equipments", data);
    },
    update(id: string | number, data: EquipmentMonitoringFormType) {
        return api.put("/home/equipments-monitoring/equipments/" + id, data);
    },
    storeBatch(data: {
        "equipments": EquipmentMonitoringFormType[]
    }) {
        return api.post("/home/equipments-monitoring/import", data);
    },
    delete(id?: string | number) {
        return api.delete("/home/equipments-monitoring/equipments/" + id);
    }
}