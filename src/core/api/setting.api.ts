import api from "."

export default {
    getAll() {
        return api.get('/home/settings')
    },
    getByGroup(group: string) {
        return api.get(`/home/settings/${group}`)
    },
    update(settings: Record<string, any>) {
        return api.put('/home/settings', { settings })
    },
    reset(group?: string) {
        return api.post('/home/settings/reset', { group })
    },
    getPublic() {
        return api.get('/public/settings')
    }
}
