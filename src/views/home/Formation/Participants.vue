<template>
    <div class="flex flex-row" @click="context_menu.is_open = false">
        <div class="flex flex-col w-full">
            <Header title="Participants" :thumbnails="[
                {
                    'label': 'thumbnails.home',
                    'name': 'DASHBOARD'
                }, {
                    'label': 'thumbnails.training',
                    'name': 'FORMATION'
                },


                {
                    'label': 'Participants',
                    'name': 'PARTICIPANT'
                },

            ]" />

            <!-- ===================================
        =========== FILTER SECTION =============
        ==================================== -->

            <div class="bg-white p-4 flex flex-col gap-y-2 border-b border-gray-200">
                <div class="flex flex-row justify-between items-center">
                    <div class="flex flex-row gap-x-2">
                        <ButtonFilter is-primary :text="t('formation.actions.add')" :icon="show_add ? X : SquarePlusIcon"
                            @click="show_add = !show_add" />
                        <form @submit.prevent="addParticipant()"
                            :class="show_add ? 'w-78 min-w-78  ' : 'w-0 max-w-0 overflow-hidden'"
                            class="h-full   transition-all flex flex-row ">
                            <InputFilter class=" max-w-60 min-w-60" v-model="form_add" full-width :lists="personnels?.map(item => ({
                                label: `${item.first_name} ${item.last_name}`,
                                value: item.id as string,
                                description: item.fonction
                            }))" :icon="UserPlus" />
                            <ButtonFilter is-primary text="Ajouter" type="submit" :loading="loading_add_participant" />
                        </form>
                        <ButtonFilter :text="t('formation.actions.import')"
                            @click="router.push({ name: 'FORMATION_IMPORT' })" :icon="CloudDownloadIcon" />
                        <ButtonFilter :text="t('formation.actions.export')" :icon="DownloadIcon" :badge="'150'" />
                        <div class="w-px h-8 bg-gray-300 mx-2" />

                    </div>
                    <InputFilter :icon="Search" />
                </div>
                <ChipFilter :filterable-keys="filterableKeys" :column-labels="columnLabels"
                    :column-options="columnOptions" :filters="filters" :show-date-filter="false"></ChipFilter>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>REF</th>
                        <th>NOM</th>
                        <th>E-MAIL</th>
                        <th>FONCTION</th>
                        <th>DIRECTION</th>
                        <th>ENTITé</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in data" :key="item.id" @contextmenu.prevent="openContextMenu($event, item)"
                        @click="selected_personnel = item" :class="selected_personnel?.id == item.id ? 'bg-gray-100' : ''">
                        <td>{{ item.id }}</td>
                        <td>{{ item.first_name + ' ' + item.last_name }}</td>
                        <td>{{ item.email }}</td>
                        <td>{{ item.fonction }}</td>
                        <td>{{ item.direction }}</td>
                        <td>{{ item.entity }}</td>
                    </tr>
                </tbody>

            </table>
        </div>

        <ContextMenuUI :model-value="context_menu.is_open"
            @close="context_menu.is_open = false; context_menu.participant = undefined"
            :context-menu="context_menu.context_menu" :bottom_actions="context_menu.bottom_actions" />
    </div>
</template>
<script setup lang="ts">
    import { useI18n } from 'vue-i18n';
    import ButtonFilter from '../../../components/ui/ButtonFilter.vue';
    import { CloudDownloadIcon, DownloadIcon, Search, SquarePlusIcon, Trash2Icon, UserPlus, Users, X } from '@lucide/vue';
    import { router } from '../../../router/index.ts';
    import Header from '../../../components/shared/Header.vue';
    import { useRoute } from 'vue-router';
    import { computed, onMounted, ref, type ComputedRef } from 'vue';
    import InputFilter from '../../../components/ui/InputFilter.vue';
    import type { PersonnelDataType } from '../../../@types/Personnel.type.ts';
    import ChipFilter from '../../../components/ui/ChipFilter.vue';
    import personnelService from '../../../core/services/personnel.service.ts';
    import { useFormationService } from '../../../core/services/formation.service.ts';
    import { toast } from 'vue3-toastify';
    import ContextMenuUI from '../../../components/ui/ContextMenuUI.vue';
    import type { ContextMenuActionType, contextMenuType } from '../../../@types/ContextMenu.type.ts';
    const { t } = useI18n()
    const route = useRoute()
    const selected_personnel = ref<PersonnelDataType>()
    const data = ref<PersonnelDataType[]>()
    const show_add = ref<boolean>(false)
    const add_data = ref<PersonnelDataType[]>()
    const filterableKeys: string[] = ['fonction', 'department', 'direction']
    const loading_add_participant = ref<boolean>(false)
    const columnLabels = ref<Record<string, string>>({
        'fonction': 'Fonction',
        'department': 'Departement',
        'direction': 'Direction'
    })
    const filters = ref<Record<string, string[]>>({
        'fonction': [],
        'department': [],
        'direction': [],
    })
    const columnOptions = ref<Record<string, string[]>>({
        'fonction': [],
        'department': [],
        'direction': [],
    })
    const formation = useFormationService()
    const form_add = ref<string | number>()
    const context_menu = ref<{
        context_menu: contextMenuType,
        is_open: boolean,
        participant?: PersonnelDataType,
        actions?: ContextMenuActionType[],
        bottom_actions?: ContextMenuActionType[]

    }>({
        is_open: false,
        context_menu: {
            'clientX': undefined,
            'clientY': undefined,
        },
        bottom_actions: [
            {
                label: "Supprimer",
                variant: "DANGER",
                icon: Trash2Icon,
                onClick: () => deleteParticipant()
            }
        ], actions: [
            {
                label: "Détails",
                icon: Users,
                onClick: () => {
                    selected_personnel.value = context_menu.value.participant
                    context_menu.value.is_open = false
                }
            }
        ]
        ,
        participant: undefined,
    })
    const personnels: ComputedRef<PersonnelDataType[] | undefined> = computed(() => {
        return add_data.value?.filter(item => !data.value?.some(participant => participant.id === item.id));
    });
    function openContextMenu(event: MouseEvent, participant: PersonnelDataType) {
        context_menu.value.context_menu.clientX = event.clientX
        context_menu.value.context_menu.clientY = event.clientY
        context_menu.value.is_open = true
        context_menu.value.participant = participant
    }
    function fetchDataPersonnel() {
        personnelService.indexAll()
            .then(res => {
                add_data.value = res.data.data
                console.log(res.data.data)
            })
            .catch(err => {
                console.error(err)
            })
    }
    function addParticipant() {
        loading_add_participant.value = true
        console.log(route.params.id as string, form_add.value)
        formation.addParticipant({
            'formation_id': route.params.id as string,
            'personnel_id': form_add.value as string

        })
            .then(res => {
                console.log(res.data)
                toast.success('participant.add')
                form_add.value = undefined
                fetchData()
            })
            .catch(err => {
                if (err.status == '422') {
                    toast.error(err.response.data.message)
                }
            })
            .finally(() => {
                loading_add_participant.value = false
            })
    }
    function fetchData() {
        formation.getParticipants(route.params.id as string)
            .then(res => {
                console.log(res.data.data)
                data.value = res.data.data
            })
            .catch(err => {
                console.error(err)
            })
    }
    function deleteParticipant() {
        formation.deleteParticipant(route.params.id as string, context_menu.value.participant?.id as string)
            .then(res => {
                console.log(res.data)
                toast.success('participant.delete')
                // fetchData()
                data.value = data.value?.filter(item => item.id != context_menu.value.participant?.id)
                context_menu.value.is_open = false
                context_menu.value.participant = undefined
            })
            .catch(err => {
                console.error(err)
            })
    }
    onMounted(() => {
        fetchDataPersonnel()
        fetchData()

    })

</script>