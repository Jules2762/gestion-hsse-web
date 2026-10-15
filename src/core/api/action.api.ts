import api from "."
import type { ActionFilterParams, ActionStatusType } from "../../@types/Action.type"

export default {
    index(params?: ActionFilterParams) {
        return api.get('/home/actions', { params })
    },
    updateStatus(origin: string, id: string | number, status: ActionStatusType) {
        return api.patch(`/home/actions/${origin}/${id}/status`, { status })
    },
    notify(origin: string, id: string | number) {
        return api.post(`/home/actions/${origin}/${id}/notify`)
    },
    storeChecklistAction(data: {
        checklist_item_id: string | number
        description: string
        assigned_to?: string | number | null
        status?: ActionStatusType
    }) {
        return api.post('/home/actions/checklist', data)
    },
    storeVmcAction(data: {
        vmc_inspection_item_id: string | number
        description: string
        person_in_charge?: string | number | null
        status?: ActionStatusType
    }) {
        return api.post('/home/actions/vmc', data)
    },
}
