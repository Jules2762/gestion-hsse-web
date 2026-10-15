import settingApi from "../api/setting.api"

export default {
    async getAll() {
        return await settingApi.getAll()
    },
    async getByGroup(group: string) {
        return await settingApi.getByGroup(group)
    },
    async update(settings: Record<string, any>) {
        return await settingApi.update(settings)
    },
    async reset(group?: string) {
        return await settingApi.reset(group)
    },
    async getPublic() {
        return await settingApi.getPublic()
    }
}
