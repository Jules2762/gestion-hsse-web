import api from "."
import type { LogFilterType } from "../../@types/Logs.type"

export default {
    index(params?: LogFilterType) {
        return api.get("/home/logs", { params })
    },
    getFilters() {
        return api.get("/home/logs/filters")
    },
    show(id: string | number) {
        return api.get("/home/logs/" + id)
    },
    export(params?: LogFilterType) {
        return api.get("/home/logs/export", { params })
    },
    destroy(id: string | number) {
        return api.delete("/home/logs/" + id)
    }
}
