import api from ".";
import type { SiteFilterType, SiteFormType } from "../../@types/Site.type";

export default {
    index(params?: any) {
        return api.get('/home/sites', { params });
    },
    all() {
        return api.get('/home/sites/all');
    },
    getFilters() {
        return api.get('/home/sites/filters');
    },
    show(id: string | number) {
        return api.get(`/home/sites/${id}`);
    },
    store(data: SiteFormType) {
        return api.post('/home/sites', data);
    },
    update(id: string | number, data: Partial<SiteFormType>) {
        return api.put(`/home/sites/${id}`, data);
    },
    destroy(id: string | number) {
        return api.delete(`/home/sites/${id}`);
    },
    export(params?: any) {
        return api.get('/home/sites/export', { params });
    }
};
