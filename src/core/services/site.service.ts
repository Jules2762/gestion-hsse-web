import type { SiteFilterType, SiteFormType } from "../../@types/Site.type";
import siteApi from "../api/site.api";

export default {
    async index(params?: any) {
        return await siteApi.index(params);
    },
    async all() {
        return await siteApi.all();
    },
    async getFilters() {
        return await siteApi.getFilters();
    },
    async show(id: string | number) {
        return await siteApi.show(id);
    },
    async store(data: SiteFormType) {
        return await siteApi.store(data);
    },
    async update(id: string | number, data: Partial<SiteFormType>) {
        return await siteApi.update(id, data);
    },
    async destroy(id: string | number) {
        return await siteApi.destroy(id);
    },
    async export(params?: any) {
        return await siteApi.export(params);
    }
};
