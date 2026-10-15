import api from "."
import type { PersonnelFormType } from "../../@types/Personnel.type"

export default {
    index(params?: any) {
        return api.get('/home/personnels', { params })
    },
    indexAll() {
        return api.get('/home/personnels/all')
    },
    getFilters() {
        return api.get('/home/personnels/filters')
    },
    show(id: string | number) {
        return api.get(`/home/personnels/${id}`)
    },
    store(data: PersonnelFormType) {
        return api.post('/home/personnels', data)
    },
    update(id: string | number, data: Partial<PersonnelFormType>) {
        return api.put(`/home/personnels/${id}`, data)
    },
    destroy(id: string | number) {
        return api.delete(`/home/personnels/${id}`)
    },
    export(params?: any) {
        return api.get('/home/personnels/export', { params })
    }
}