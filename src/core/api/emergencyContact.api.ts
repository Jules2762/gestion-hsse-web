import api from ".";
import type {
    EmergencyContactFilterType,
    EmergencyContactFormType
} from "../../@types/EmergencyContact.type";

export default {
    index(params?: EmergencyContactFilterType) {
        return api.get("/home/emergency-contacts", { params });
    },
    getMapData() {
        return api.get("/home/emergency-contacts/map-data");
    },
    show(id: string | number) {
        return api.get(`/home/emergency-contacts/${id}`);
    },
    store(data: EmergencyContactFormType) {
        return api.post("/home/emergency-contacts", data);
    },
    update(id: string | number, data: EmergencyContactFormType) {
        return api.put(`/home/emergency-contacts/${id}`, data);
    },
    delete(id: string | number) {
        return api.delete(`/home/emergency-contacts/${id}`);
    },
    getSiteNames() {
        return api.get("/home/equipments-monitoring/site-names");
    }
};
