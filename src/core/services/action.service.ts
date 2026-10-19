import { defineStore } from "pinia"
import type { ActionFilterParams, ActionStatusType } from "../../@types/Action.type"
import actionApi from "../api/action.api"
import { useSidebarNotification } from "../../services/useSidebarNotification"
import { useNotificationStore } from "../../services/useNotificationStore"

export const useActionService = defineStore('action-service', {
    actions: {
        async index(params?: ActionFilterParams) {
            return await actionApi.index(params)
        },
        async updateStatus(origin: string, id: string | number, status: ActionStatusType) {
            const res = await actionApi.updateStatus(origin, id, status)
            useSidebarNotification().fetchCounts()
            useNotificationStore().fetchNotifications()
            return res
        },
        async notify(origin: string, id: string | number) {
            return await actionApi.notify(origin, id)
        },
        async storeChecklistAction(data: {
            checklist_item_id: string | number
            description: string
            assigned_to?: string | number | null
            status?: ActionStatusType
        }) {
            const res = await actionApi.storeChecklistAction(data)
            useSidebarNotification().fetchCounts()
            useNotificationStore().fetchNotifications()
            return res
        },
        async storeVmcAction(data: {
            vmc_inspection_item_id: string | number
            description: string
            person_in_charge?: string | number | null
            status?: ActionStatusType
        }) {
            const res = await actionApi.storeVmcAction(data)
            useSidebarNotification().fetchCounts()
            useNotificationStore().fetchNotifications()
            return res
        },
        async uploadAttachment(origin: string, id: string | number, file: File) {
            return await actionApi.uploadAttachment(origin, id, file)
        },
        async deleteAttachment(attachmentId: string | number) {
            return await actionApi.deleteAttachment(attachmentId)
        },
    },
})
