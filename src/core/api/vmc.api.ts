import api from "."
import type { VMCFilterType, VMCFormType } from "../../@types/VMC.type"

export default {
    index(params?: VMCFilterType) {
        return api.get('/home/vmcs', { params })
    },
    getFilters() {
        return api.get('/home/vmcs/filters')
    },
    show(id: string | number) {
        return api.get(`/home/vmcs/${id}`)
    },
    store(data: VMCFormType) {
        return api.post('/home/vmcs', data)
    },
    update(id: string | number, data: Partial<VMCFormType>) {
        return api.put(`/home/vmcs/${id}`, data)
    },
    updateStatus(id: string | number, status: string) {
        return api.patch(`/home/vmcs/${id}/status`, { status })
    },
    delete(id: string | number) {
        return api.delete(`/home/vmcs/${id}`)
    },
    export(params?: any) {
        return api.get('/home/vmcs/export', {
            params,
            responseType: 'blob'
        })
    }
}