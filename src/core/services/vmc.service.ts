import type { VMCFilterType, VMCFormType } from "../../@types/VMC.type"
import vmcApi from "../api/vmc.api"

export default {
    async index(params?: VMCFilterType) {
        return await vmcApi.index(params)
    },
    async getFilters() {
        return await vmcApi.getFilters()
    },
    async show(id: string | number) {
        return await vmcApi.show(id)
    },
    async store(data: VMCFormType) {
        return await vmcApi.store(data)
    },
    async update(id: string | number, data: Partial<VMCFormType>) {
        return await vmcApi.update(id, data)
    },
    async updateStatus(id: string | number, status: string) {
        return await vmcApi.updateStatus(id, status)
    },
    async delete(id: string | number) {
        return await vmcApi.delete(id)
    },
    async export(params?: any) {
        return await vmcApi.export(params)
    }
}