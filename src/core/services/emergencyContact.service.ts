import emergencyContactApi from "../api/emergencyContact.api";
import type {
    EmergencyContactFilterType,
    EmergencyContactFormType,
    EmergencyContactType,
    EmergencyMapDataType
} from "../../@types/EmergencyContact.type";

export default {
    async getContacts(params?: EmergencyContactFilterType) {
        const response = await emergencyContactApi.index(params);
        return response.data;
    },

    async getMapData(): Promise<EmergencyMapDataType> {
        const response = await emergencyContactApi.getMapData();
        return response.data;
    },

    async getContactById(id: string | number): Promise<EmergencyContactType> {
        const response = await emergencyContactApi.show(id);
        return response.data.data;
    },

    async createContact(data: EmergencyContactFormType) {
        const response = await emergencyContactApi.store(data);
        return response.data;
    },

    async updateContact(id: string | number, data: EmergencyContactFormType) {
        const response = await emergencyContactApi.update(id, data);
        return response.data;
    },

    async deleteContact(id: string | number) {
        const response = await emergencyContactApi.delete(id);
        return response.data;
    },

    async getAvailableSites() {
        const response = await emergencyContactApi.getSiteNames();
        return response.data;
    }
};
