import type { PersonnelFormType } from "../../@types/Personnel.type"
import personnelApi from "../api/personnel.api"

export default {
    async index(params?: any) {
        return await personnelApi.index(params)
    },
    async indexAll() {
        return await personnelApi.indexAll()
    },
    async getFilters() {
        return await personnelApi.getFilters()
    },
    async show(id: string | number) {
        return await personnelApi.show(id)
    },
    async store(data: PersonnelFormType) {
        return await personnelApi.store(data)
    },
    async update(id: string | number, data: Partial<PersonnelFormType>) {
        return await personnelApi.update(id, data)
    },
    async destroy(id: string | number) {
        return await personnelApi.destroy(id)
    },
    async export(params?: any) {
        return await personnelApi.export(params)
    }
}