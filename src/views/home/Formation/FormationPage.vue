<template>
    <div class="flex flex-row transition-all">
        <div class="w-full ">
           <Header title="formation.title" :thumbnails="[
                {
                    'label': 'thumbnails.home',
                    'name': 'DASHBOARD'
                }, {
                    'label': 'thumbnails.training',
                    'name': 'FORMATION'
                }
            ]" />

            <!-- ======================= RIBBON TOOLBAR ======================= -->
            <div class="bg-white border-b border-gray-200">
                <div class="h-16 px-4 flex flex-row items-center justify-between">
                    <div class="flex flex-row items-center gap-1">
                        <button class="ribbon-btn ribbon-btn-primary" @click="router.push({ name: 'FORMATION_NEW' })">
                            <SquarePlusIcon :size="18" />
                            <span>{{ t('formation.actions.add') }}</span>
                        </button>
                        <button class="ribbon-btn" @click="router.push({ name: 'FORMATION_IMPORT' })">
                            <CloudDownloadIcon :size="18" />
                            <span>{{ t('formation.actions.import') }}</span>
                        </button>

                        <button class="ribbon-btn" :disabled="loading_export"
                            :class="{ 'ribbon-btn-disabled': pagination.total === 0 || loading_export }"
                            @click="exportData()">
                            <DownloadIcon :size="18" v-if="loading_export == false" />
                            <Loader v-else class="animate-spin" />
                            <span>{{ t('formation.actions.export') }}</span>
                            <span v-if="pagination.total" class="ribbon-btn-count">{{ pagination.total
                                }}</span>
                        </button>


                        <div class="w-px h-8 bg-gray-300 mx-2" />


                    </div>

                    <div class="flex flex-row items-center gap-2">
                        <div class="relative">
                            <SearchIcon :size="15" class="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input v-model="searchQuery" type="text" :placeholder="t('formation.filters.input')"
                                class="h-9 w-64 rounded-lg border border-gray-300 bg-white pl-8 pr-3 text-sm text-gray-700 placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
                            <button v-if="searchQuery" @click="searchQuery = ''"
                                class="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                <XIcon :size="14" />
                            </button>
                        </div>
                    </div>
                </div>

                <!-- ======================= FILTER STRIP ======================= -->
                <ChipFilter :filterable-keys="filterableKeys" :column-labels="columnLabels" :filters="filters"
                    :column-options="columnOptions as Record<string, string[]>" :date-range="dateRange"
                    :results-count="pagination.to" :results-total="pagination.total" @clear-all="clearAllFilters" />
            </div>

            <div class="flex flex-row transition-all">
                <table class="transition-all" >
                    <thead>
                        <tr>
                            <th v-for="(item, index) in headers" :key="index" class="relative z-50">
                                <div class="flex items-center gap-1 select-none"
                                    :class="sortableKeys[index] ? 'cursor-pointer' : ''"
                                    @click="sortableKeys[index] && toggleSort(sortableKeys[index]!)">
                                    <span>{{ item }}</span>
                                    <component v-if="sortableKeys[index]" :is="sortIcon(sortableKeys[index])" :size="12"
                                        class="text-gray-400" />
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <template v-if="loading_data == false && data.length > 0">
                            <tr v-for="(item, index) in data" :key="index" @click="selectedFormation = item"
                                @contextmenu.prevent="contextMenu.contextMenu = $event; contextMenu.isOpen = true; contextMenu.formation = item as FormationDataType"
                                :class="selectedFormation?.id == item.id ? 'bg-primary/10' : ''">
                                <td>{{ item.id }}</td>
                                <td>{{ item.date }}</td>
                                <td>{{ item.title }}</td>
                                <td>{{ item.type }}</td>
                                <td>{{ item.volet }}</td>
                                <td>{{ item.trainer }}</td>
                                <td>{{ item.duration }}</td>
                                <td>{{ item.target }}</td>

                            </tr>
                            <tr>
                                <td colspan="8" class="w-full">
                                    <div class="flex flex-row items-center text-sm justify-end ">
                                        <vue-awesome-paginate :hide-prev-next-when-ends="true"
                                            :total-items="pagination.total" :items-per-page="15" :max-pages-shown="4"
                                            v-model="pagination.current_page"
                                            @click="(page: number) => { pagination.current_page = page }" />
                                    </div>
                                </td>
                            </tr>
                        </template>
                        <tr v-else-if="loading_data == false && data.length > 0">
                            <td colspan="8" class="py-10 text-center text-gray-500">
                                <div class="flex flex-col items-center gap-2">
                                    <span>Aucun résultat pour ces filtres</span>
                                    <button class="text-xs font-medium text-primary hover:underline"
                                        @click="clearAllFilters">
                                        Réinitialiser les filtres
                                    </button>
                                </div>
                            </td>
                        </tr>
                        <tr v-else-if="data.length === 0 && loading_data == false">
                            <td colspan="8" class="py-10 text-center text-gray-500">
                                Aucune formation trouvée
                            </td>
                        </tr>
                        <tr v-else>
                            <td colspan="8" class="py-10">
                                <div class="flex flex-col items-center justify-center gap-3">
                                    <Loader :size="30" class="animate-spin text-primary" />

                                    <span class="text-sm text-gray-500">
                                        Chargement des formations...
                                    </span>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>

              
            </div>
        </div>
        <div :class="selectedFormation && data.length > 0 ? 'w-120' : 'w-0'"
            v-if="selectedFormation && data.length > 0" class="
            scrollbar-hide
            bg-white
            border-l
            border-gray-200
            
            p-5
            h-fit
            sticky top-0 bottom-0
            overflow-y-auto
        ">
            <template v-if="selectedFormation || data.length > 0">

                <!-- HEADER -->

                <div class="
                    pb-5
                    border-b
                    border-gray-200
                ">
                    <div class="
                        flex
                        items-start
                        justify-between
                    ">
                        <div>
                            <p class="
                                text-xs
                                uppercase
                                tracking-widest
                                text-gray-500
                            ">
                                Formation
                            </p>

                            <h4 class="mt-1">
                                {{
                                    selectedFormation.title
                                }}
                            </h4>
                        </div>

                        <button class="
                            rounded-lg
                            p-2
                            hover:bg-slate-100
                        " @click="
                            selectedFormation = null
                            ">
                            <XIcon :size="18" />
                        </button>
                    </div>

                    <!-- BADGES -->

                    <div class="
                        mt-4
                        flex
                        flex-wrap
                        gap-2
                    ">
                        <span class="
                            rounded-full
                            bg-primary/10
                            px-3
                            py-1
                            text-xs
                            font-medium
                            text-primary
                        ">
                            {{
                                selectedFormation.type
                            }}
                        </span>

                        <span class="
                            rounded-full
                            bg-blue-100
                            px-3
                            py-1
                            text-xs
                            font-medium
                            text-blue-700
                        ">
                            {{
                                selectedFormation.volet
                            }}
                        </span>
                    </div>
                </div>

                <!-- KPI -->

                <div class="
                    mt-5
                    grid
                    grid-cols-3
                    gap-3
                ">
                    <div class="
                        rounded-xl
                        bg-slate-50
                        p-3
                        text-center
                    ">
                        <p class="
                            text-xs
                            text-gray-500
                        ">
                            Participants
                        </p>

                        <h5>
                            {{
                                selectedFormation.participant
                            }}
                        </h5>
                    </div>

                    <div class="
                        rounded-xl
                        bg-slate-50
                        p-3
                        text-center
                    ">
                        <p class="
                            text-xs
                            text-gray-500
                        ">
                            Durée
                        </p>

                        <h5>
                            {{
                                selectedFormation.duration
                            }}h
                        </h5>
                    </div>

                    <div class="
                        rounded-xl
                        bg-slate-50
                        p-3
                        text-center
                    ">
                        <p class="
                            text-xs
                            text-gray-500
                        ">
                            Public
                        </p>

                        <h5 class="
                            text-sm
                        ">
                            {{
                                selectedFormation.target_type
                            }}
                        </h5>
                    </div>
                </div>

                <!-- INFORMATIONS -->

                <div class="
                    mt-6
                    border-t
                    border-gray-200
                    pt-5
                ">
                    <h6 class="
                        mb-4
                        text-gray-500
                    ">
                        Informations générales
                    </h6>

                    <div class="
                        grid
                        grid-cols-2
                        gap-4
                    ">
                        <div>
                            <p class="
                                text-xs
                                text-gray-500
                            ">
                                Date
                            </p>

                            <p>
                                {{
                                    selectedFormation.date
                                }}
                            </p>
                        </div>

                        <div>
                            <p class="
                                text-xs
                                text-gray-500
                            ">
                                Formateur
                            </p>

                            <p>
                                {{
                                    selectedFormation.trainer
                                }}
                            </p>
                        </div>

                        <div>
                            <p class="
                                text-xs
                                text-gray-500
                            ">
                                Type
                            </p>

                            <p>
                                {{
                                    selectedFormation.type
                                }}
                            </p>
                        </div>

                        <div>
                            <p class="
                                text-xs
                                text-gray-500
                            ">
                                Volet
                            </p>

                            <p>
                                {{
                                    selectedFormation.volet
                                }}
                            </p>
                        </div>
                    </div>
                </div>

                <!-- PUBLIC CIBLE -->

                <div class="
                    mt-6
                    border-t
                    border-gray-200
                    pt-5
                ">
                    <h6 class="mb-3">
                        Public concerné
                    </h6>

                    <p>
                        {{
                            selectedFormation.target
                        }}
                    </p>

                    <p class="
                        mt-2
                        text-sm
                        text-gray-500
                    ">
                        {{
                            selectedFormation.target_type
                        }}
                    </p>
                </div>

                <!-- PARTICIPATION -->

                <div class="
                    mt-6
                    border-t
                    border-gray-200
                    pt-5
                ">
                    <h6 class="mb-3">
                        Participation
                    </h6>

                    <div class="
                        rounded-xl
                        bg-green-50
                        border
                        border-green-200
                        p-4
                    ">
                        <div class="
                            flex
                            items-center
                            justify-between
                        ">
                            <span>
                                Participants
                            </span>

                            <span class="
                                text-lg
                                font-semibold
                                text-green-700
                            ">
                                {{
                                    selectedFormation.participant
                                }}
                            </span>
                        </div>
                    </div>
                </div>

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
                        <Button class="w-full" variant="danger"
                            @click="contextMenu.formation = selectedFormation; modal_delete = true">
                            Supprimer
                        </Button>
                        <Button class="w-full" variant="outline">
                            Modifier
                        </Button>


                    </div>
                </div>

            </template>
        </div>
        <ContextMenuUI v-model="contextMenu.isOpen" :context-menu="contextMenu.contextMenu"
            :actions="contextMenu.actions" :bottom_actions="contextMenu.bottom_actions" />
    </div>
    <CenterModal :confirm-loading="loading_delete" title-variant="danger" :is-open="modal_delete" @close="modal_delete=false" @confirm="deleteFormation(contextMenu?.formation?.id as string | number)" :title="t('formation.notification.delete.confirmation.title')" confirm-variant="danger">
        <p>{{ t('formation.notification.delete.confirmation.message') }}</p>
    </CenterModal>
</template>

<script setup lang="ts">
    import {  onMounted, reactive, ref, watch } from 'vue';
    import Header from '../../../components/shared/Header.vue';
    import {
        ArrowDownIcon,
        ArrowUpDownIcon,
        ArrowUpIcon,
        CloudDownloadIcon,
       
        DownloadIcon,
        Edit,
        Eye,
        Loader,
      
        SearchIcon,
        SquarePlusIcon,
        Trash2,
        XIcon,
    } from '@lucide/vue';

    import ChipFilter from '../../../components/ui/ChipFilter.vue';
    import { router } from '../../../router/index.ts';
    import type { ContextMenuActionType, contextMenuType } from '../../../@types/ContextMenu.type.ts';
    import type { FormationDataType, FormationFilterType, FormationType, VoletType } from '../../../@types/Formation.type.ts';
    import ContextMenuUI from '../../../components/ui/ContextMenuUI.vue';
    import { useFormationService } from '../../../core/services/formation.service.ts';
    import { useI18n } from 'vue-i18n';
    import { toast } from 'vue3-toastify';
import CenterModal from '../../../components/ui/centerModal.vue';
import Button from '../../../components/ui/Button.vue';
import { exportUtils } from '../../../core/utils/export.utils.ts';
    const headers = ["#", "DATE", "INTITULE", "TYPE", "VOLET", "FORMATEUR", "Durée (h)", "cible"]
    const data = ref<FormationDataType[]>([])
  
    const selectedFormation = ref<FormationDataType|null>()
    const modal_delete=ref(false)
    const contextMenu = ref<
        {
            isOpen: boolean, contextMenu?: contextMenuType, formation?: FormationDataType, actions?: ContextMenuActionType[], bottom_actions: ContextMenuActionType[]
        }>(
            {
                isOpen: false,
                formation: undefined,
                actions: [
                    {
                        label: "Détails",
                        icon: Eye,
                        onClick:()=>selectedFormation.value=contextMenu.value.formation
                    },
                    {
                        label: "Modifier",
                        icon: Edit,
                        variant:'WARNING'
                    },


                ],
                bottom_actions: [
                    {
                        label: "Suprimer",
                        icon: Trash2,
                        variant: "DANGER",
                        onClick: () => modal_delete.value=true
                    },
                ]
            }
        )
    const { t } = useI18n()
    const formation = useFormationService()
    type FilterKey = 'type' | 'volet' | 'trainer' | 'target'
    const filterableKeys: FilterKey[] = ['type', 'volet', 'trainer', 'target']
    const columnLabels: Record<FilterKey, string> = {
        type: 'Type',
        volet: 'Volet',
        trainer: 'Formateur',
        target: 'Cible',
    }

    // index-aligned with `headers`, null = not filterable/sortable
    const sortableKeys: (string | null)[] = [null, 'date', 'type', 'volet', 'trainer', 'duration', 'target']

    const filters = reactive<Record<FilterKey, string[]>>({
        type: [],
        volet: [],
        trainer: [],
        target: [],
    })

    const dateRange = reactive({ from: '', to: '' })
    const searchQuery = ref('')

    // Unique available values per filterable column, computed from the raw dataset.
    // Passed to ChipFilter so it stays decoupled from where the data comes from.
    const columnOptions = ref<Record<string, string[]>>()
    const loading_data = ref<boolean>(false)
    const loading_export = ref<boolean>(false)
        const loading_delete=ref<boolean>(false)
    function clearAllFilters() {
        for (const key of filterableKeys) filters[key] = []
        dateRange.from = ''
        dateRange.to = ''
        searchQuery.value = ''
    }
    const sortKey = ref<string | null>(null)
    const sortDir = ref<'asc' | 'desc'>('asc')
    const pagination = ref({
        current_page: 1,
        to: 0,
        total: 0,
    })

    const exportFields: { key: string; excelName: string }[] = [
        { key: 'title', excelName: 'Titre' },
        { key: 'date', excelName: 'Date' },
        { key: 'type', excelName: 'Type de formation' },
        { key: 'volet', excelName: 'Volet' },
        { key: 'trainer', excelName: 'Formateur' },
        { key: 'duration', excelName: 'Durée' },
        { key: 'target', excelName: 'Cible' },
        { key: 'participant', excelName: 'Participants' },
        { key: 'target_type', excelName: 'Type cibles' },
    ]
    function toggleSort(key: string) {
        if (sortKey.value === key) {
            sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc'
        } else {
            sortKey.value = key
            sortDir.value = 'asc'
        }
    }

    function sortIcon(key: string | null) {
        if (!key || sortKey.value !== key) return ArrowUpDownIcon
        return sortDir.value === 'asc' ? ArrowUpIcon : ArrowDownIcon
    }



  
    function fetchData(params?: FormationFilterType) {
        loading_data.value = true
        formation.fetchData(params).then((res) => {
            // console.log(res.data)
            const meta = res.data.meta
            data.value = res.data.data
            pagination.value.to = meta.to
            pagination.value.total = meta.total

        }).catch((err) => {

            if (err?.response.status == "422") {
                console.error(err?.response.data.errors, err.status)
                Object.keys(err?.response.data.errors).forEach((key) => {
                    console.log(key)

                })
                toast.error(t("formation.notification.list.date.to.after_or_equal"))
            }
        })
            .finally(() => {
                loading_data.value = false
            })
    }
    function fetchDataFilters() {
        formation.getFilters()
            .then((res) => {
                columnOptions.value = res.data
            })
    }
    function onSuccessExported(){
        toast.success(t('formation.notification.export.success'))
    }
    function onErrorExported(){
        toast.error(t('formation.notification.export.error'))
    }
    function exportData() {
        loading_export.value = true
        formation.getAllData({
            type: filters.type as FormationType[],
            section: filters.volet as VoletType[],
            date: dateRange,
            trainer: filters.trainer,
            target: filters.target,
            search: searchQuery.value
        })
            .then(res => {
                exportUtils(res.data.data as FormationDataType[], exportFields,onSuccessExported,onErrorExported,'export_training')
            })
            .catch(err => {
                console.error(err)
                toast.error(t("formation.notification.export.error"))
                if (err?.response.status == "422") {

                    Object.keys(err?.response.data.errors).forEach((key) => {
                        toast.error(t('formation.notification.list.' + err?.response.data.errors[key][0]))

                    })
                }
            })
            .finally(() => {
                loading_export.value = false
            })
    }
    function deleteFormation(id: string | number) {
        loading_delete.value=true
        formation.delete(id)
            .then(res => {

                toast.success(
                    t("formation.notification.delete.success")
                )

                fetchData({
                    page:pagination.value.current_page,
                    type: filters.type as FormationType[],
                    section: filters.volet as VoletType[],
                    date: dateRange,
                    trainer: filters.trainer,
                    target: filters.target,
                    search: searchQuery.value
                })
                modal_delete.value=false
                selectedFormation.value=null
            })
            .catch(
                err => {
                    console.error(err)
                    if (err?.response?.status === 404) {
                        toast.error(t("formation.notification.delete.not_found"))
                    } else {
                        toast.error(t("formation.notification.delete.error"))
                    }
                }
            )
            .finally(()=>{
                loading_delete.value = false
            })
    }
    watch([filters, dateRange, searchQuery], () => {
        pagination.value.current_page = 1
        console.log(filters, dateRange, searchQuery.value)
        fetchData({
            page: 1,
            type: filters.type as FormationType[],
            section: filters.volet as VoletType[],
            date: dateRange,
            trainer: filters.trainer,
            target: filters.target,
            search: searchQuery.value
        })
    }, {
        immediate: false
    })
    watch(() => pagination.value.current_page, () => {

        fetchData({
            page: pagination.value.current_page,
            type: filters.type as FormationType[],
            section: filters.volet as VoletType[],
            date: dateRange,
            trainer: filters.trainer,
            target: filters.target,
            search: searchQuery.value
        })
    }, {
        immediate: false
    })
    watch(()=>modal_delete.value,()=>{
        if(modal_delete.value==true){
           
                selectedFormation.value = contextMenu.value.formation
            
            contextMenu.value.isOpen=false
        }
    })
    onMounted(() => {
        fetchDataFilters()
        fetchData()
    })

</script>


<style scoped>
.preview-enter-from,
.preview-leave-to {
    transform: translateX(200px);
    opacity: 0;
}

.preview-enter-active,
.preview-leave-active {
    transition:
        all 0.25s ease-in-out;
}

</style>