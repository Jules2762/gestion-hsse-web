<template>
    <div>
        <Header title="Gestion des actions correctives" show-search :thumbnails="[
            {
                label: 'Accueil',
                name: 'DASHBOARD'
            }, {
                label: 'Inspection',
                name: 'INSPECTION'
            }, {
                label: 'Actions',
                name: 'ACTION'
            }
        ]" />
        <div class="bg-white  border-b border-gray-200 h-18 flex flex-row items-center justify-between">
            <!-- <ShowMode v-model="show_mode"/> -->
            <div></div>
            <div class="flex flex-row gap-x-3 items-center">
                <Select :icon="Type" class="min-w-80" />
                <Input :icon="Calendar1Icon" class="min-w-80" />
            </div>
        </div>
        <div class="flex flex-row ">
            <template v-if="show_mode == 0">
                <div class="transition-all" :class="selected_action ? 'w-9/12' : 'w-12/12'">
                    <table>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Date</th>
                                <th>Description</th>
                                <th>Responsable</th>
                                <th>Checklist</th>

                                <th>status</th>
                                <th>e-mail</th>

                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item, index) in data" :key="index"
                                @contextmenu.prevent="contextMenu.contextMenu = $event; contextMenu.isOpen = true; contextMenu.action = item"
                                @click="selected_action = item"
                                :class="selected_action?.id == item.id ? 'bg-primary/10' : ''">
                                <td>{{ index + 1 }}</td>
                                <td>{{ item.created_at }}</td>
                                <td>{{ item.description }}</td>
                                <td>{{ item.assigned_to?.first_name + " " + item.assigned_to?.last_name }}</td>

                                <td>{{ item.checklist_item_id }}</td>
                                <td>
                                    <ActionStatus :name="item.status" />
                                </td>
                                <td>
                                    <ActionEmailStatus :status="item.email_status" />
                                </td>

                            </tr>
                        </tbody>
                    </table>
                </div>
            </template>
            <template v-else>
                <div class="grid grid-cols-4 gap-3">

                </div>
            </template>
            <div v-if="selected_action" class=" w-3/12 bg-white border-l border-gray-200 p-5 overflow-y-auto sticky top-0 h-fit
    ">
                <!-- HEADER -->

                <div class="
            border-b
            border-gray-200
            pb-4
        ">
                    <div class="flex flex-row items-center justify-between">
                        <h5>
                            Action corrective
                        </h5>
                        <button @click="selected_action = undefined">
                            <XIcon />
                        </button>
                    </div>
                    <p class="
                text-sm
                text-gray-500
            ">
                        Détails de l'action
                    </p>
                </div>

                <!-- STATUS -->

                <div class="
            mt-5
            rounded-xl
            border
            border-primary/20
            bg-primary/5
            p-4
        ">
                    <ActionStatus :name="selected_action.status
                        " />

                    <p class="
                mt-3
                font-medium
            ">
                        {{
                            selected_action.description
                        }}
                    </p>
                </div>

                <!-- INFORMATIONS -->

                <div class="mt-6">
                    <span class="
                text-xs
                uppercase
                tracking-wide
                text-gray-500
            ">
                        Date de création
                    </span>

                    <p class="mt-1">
                        {{
                            selected_action.created_at
                        }}
                    </p>
                </div>

                <div class="mt-5">
                    <span class="
                text-xs
                uppercase
                tracking-wide
                text-gray-500
            ">
                        Checklist
                    </span>

                    <p class="mt-1">
                        #{{
                            selected_action.checklist_item_id
                        }}
                    </p>
                </div>

                <!-- RESPONSABLE -->

                <template v-if="selectedUser">
                    <div class="
                mt-6
                border-t
                border-gray-200
                pt-5
            ">
                        <h6 class="mb-4">
                            Responsable
                        </h6>

                        <div class="
                    flex
                    items-center
                    gap-3
                ">
                            <div class="
                        flex
                        h-12
                        w-12
                        items-center
                        justify-center
                        rounded-full
                        bg-primary/10
                        font-bold
                        text-primary
                    ">
                                {{
                                    selectedUser.first_name?.charAt(
                                        0,
                                    )
                                }}
                            </div>

                            <div>
                                <p class="
                            font-medium
                        ">
                                    {{
                                        selectedUser.first_name
                                    }}
                                    {{
                                        selectedUser.last_name
                                    }}
                                </p>

                                <p class="
                            text-sm
                            text-gray-500
                        ">
                                    {{
                                        selectedUser.email
                                    }}
                                </p>
                            </div>
                        </div>
                    </div>

                    <!-- ORGANISATION -->

                    <div class="
                mt-6
                border-t
                border-gray-200
                pt-5
            ">
                        <h6 class="mb-4">
                            Organisation
                        </h6>

                        <div class="
                    flex
                    flex-col
                    gap-4
                ">
                            <div>
                                <span class="
                            text-xs
                            text-gray-500
                        ">
                                    Département
                                </span>

                                <p>
                                    {{
                                        selectedUser.department ??
                                        '-'
                                    }}
                                </p>
                            </div>

                            <div>
                                <span class="
                            text-xs
                            text-gray-500
                        ">
                                    Fonction
                                </span>

                                <p>
                                    {{
                                        selectedUser.job ??
                                        '-'
                                    }}
                                </p>
                            </div>

                            <div>
                                <span class="
                            text-xs
                            text-gray-500
                        ">
                                    Téléphone
                                </span>

                                <p>
                                    {{
                                        selectedUser.phone_number ??
                                        '-'
                                    }}
                                </p>
                            </div>
                        </div>
                    </div>
                </template>

                <!-- ACTIONS -->

                <div class="
            mt-6
            border-t
            border-gray-200
            pt-5
        ">
                    <div class="
                flex
                flex-col
                gap-2
            ">
                        <Button class="w-full" @click="
                            router.push({
                                name:
                                    'CHECKLIST_DETAILS',
                                params: {
                                    id:
                                        selected_action.checklist_item_id,
                                },
                            })
                            ">
                            Voir la checklist
                        </Button>

                        <Button variant="outline" class="w-full">
                            Voir le responsable
                        </Button>
                    </div>
                </div>
            </div>
        </div>
        <ContextMenuUI v-model="contextMenu.isOpen" :context-menu="contextMenu.contextMenu" :actions="[
            {
                label: 'Voir Inspecteur',
                icon: User
            },
            {
                label: 'Voir Responsable',
                icon: User
            },
            {
                label: 'Voir Checklist',
                icon: ListCheck
            },
            {
                label: contextMenu.action?.email_status == 'NOT_SENT' ? 'Envoyer e-mail' : 'Réenvoyer e-mail',
                icon: Mail,
                onClick: () => notifyResponsible()
            },
            {
                label: textContextMenuStatus(contextMenu.action?.status).text,
                icon: textContextMenuStatus(contextMenu.action?.status).icon,
                variant: textContextMenuStatus(contextMenu.action?.status).theme,
                // onClick: () => notifyResponsible()
            },
        ]" />
    </div>
</template>
<script setup lang="ts">
import { ref, type Component } from 'vue';
import { UserData } from '../../../@data/User.data.ts';
import Header from '../../../components/shared/Header.vue';
import { router } from '../../../router/index.ts';

import ActionStatus from '../../../components/features/action/ActionStatus.vue';

import Input from '../../../components/ui/Input.vue';
import { Calendar1Icon, CheckCircle2, Eye, ListCheck, Mail, PlayCircle, RotateCcw, Type, User, XIcon } from '@lucide/vue';
import Select from '../../../components/ui/Select.vue';
import type { ActionStatusType, ActionType } from '../../../@types/Action.type.ts';
import { ActionData } from '../../../@data/Action.data.ts';
const show_mode = ref(0)
const data = ref<ActionType[]>([...ActionData])
const selected_action = ref<ActionType>()
import { computed } from 'vue'
import type { contextMenuType, ContextMenuVariantType } from '../../../@types/ContextMenu.type.ts';
import ContextMenuUI from '../../../components/ui/ContextMenuUI.vue';
import ActionEmailStatus from '../../../components/features/action/ActionEmailStatus.vue';

const selectedUser = computed(() =>
    UserData.find(
        user =>
            user.id ===
            selected_action.value?.assigned_to,
    ),
)
const contextMenu = ref<{
    isOpen: boolean,
    contextMenu?: contextMenuType,
    action?: ActionType,

}>({
    isOpen: false,

})
function notifyResponsible(

): void {
    const email = contextMenu.value.action?.assigned_to?.email
    const action = contextMenu.value.action as ActionType
    const subject =
        encodeURIComponent(
            `Action corrective #${action.id} "${action.description}"`,
        )

    const body =
        encodeURIComponent(`
Bonjour,

Une action corrective vous a été attribuée.

Merci de consulter la plateforme GALANA HSSE pour plus de détails.

Cordialement.
        `)

    window.location.href =
        `mailto:${email}?subject=${subject}&body=${body}`
}
function textContextMenuStatus(status?: ActionStatusType): {
    text: string,
    icon: Component,
    theme?: ContextMenuVariantType
} {
    switch (status) {
        case "PENDING":
            return { text: "Prendre en charge", icon: PlayCircle, "theme": "INFO" }

        case "IN_PROGRESS":
            return { text: "Clôturer l'action", icon: CheckCircle2, theme: "SUCCESS" }

        default:
            return { text: "Réouvrir", icon: RotateCcw, theme: "WARNING" }


    }
}
</script>
