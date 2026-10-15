<template>
    <div class="flex flex-row w-full">
        <div class="flex flex-col transition-all" :class="right_sidebar.isOpen ? 'w-[calc(100%-400px)]' : 'w-full'">
            <Header title="Suivi du matériel" :thumbnails="[
                { label: 'Accueil', name: 'DASHBOARD' },
                { label: 'Inspections', name: 'INSPECTION' },
                { label: 'Suivi du matériel', name: 'EQUIPMENT_MONITORING' },
            ]" />
            <!-- ======================= RIBBON TOOLBAR ======================= -->
            <div class="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div class="h-16 px-6 flex flex-row items-center justify-between gap-4">
                    <div class="flex flex-row items-center gap-1.5">
                        <ButtonFilter is-primary text="Ajout" :icon="SquarePlusIcon" @click="router.push({
                            name: 'EQUIPMENT_MONITORING_NEW'
                        })" />
                        <ButtonFilter text="Importer" :icon="CloudDownloadIcon" @click="router.push({
                            name: 'EQUIPMENT_MONITORING_IMPORT'
                        })" />
                        <ButtonFilter text="Exporter" :icon="DownloadIcon" :loading="loading_export"
                            :badge="pagination.total.toString()" @click="exportData()" />
                    </div>

                    <div class="flex flex-row items-center gap-2">
                        <InputFilter :icon="SearchIcon" placeholder="Rechercher un équipement..." v-model="searchQuery" />
                    </div>
                </div>
                <ChipFilter :filterable-keys="filterableKeys" :column-labels="columnLables" :date-range="dateRange"
                    :filters="filters" :column-options="columnOptions as Record<filtersKeyType, string[]>"
                    @clear-all="clearAllFilters()" />
            </div>

            <div class="flex flex-row transition-all overflow-x-auto scrollbar-hide"
                @click.self="right_sidebar.isOpen = false">
                <div class="min-h-fit " @click.self="right_sidebar.isOpen = false">
                    <table class="min-w-max ">
                        <thead>
                            <tr class="">
                                <th v-for="header in headers" :key="header">
                                    {{ header }}
                                </th>
                            </tr>
                        </thead>
                        <tbody class="h-fit">
                            <template v-if="data?.length && loading_data == false">
                                <tr @contextmenu.prevent="context_menu.context_menu = $event; context_menu.equipment = item; context_menu.isOpen = true"
                                    v-for="(item, index) in data" :key="index" class="cursor-pointer" @click="
                                        right_sidebar = {
                                            isOpen: true,
                                            equipment: item,
                                        }
                                        " :class="right_sidebar.equipment?.id == item.id ? 'bg-primary/10' : ''">
                                    <td>
                                        {{ item.id }}
                                    </td>
                                    <td>
                                        {{ item.date }}
                                    </td>

                                    <td>
                                        {{ item.site_name }}
                                    </td>

                                    <td>
                                        {{ item.p50 }}
                                    </td>

                                    <td>
                                        {{ item.p9 }}
                                    </td>

                                    <td>
                                        {{ item.p6 }}
                                    </td>

                                    <td>
                                        {{ item.co2 }}
                                    </td>

                                    <td>
                                        {{ item.bas_met }}
                                    </td>

                                    <td>
                                        {{ item.bas_plast }}
                                    </td>
                                    <td>
                                        {{ item.bac_de_retention }}
                                    </td>

                                    <td>
                                        {{ item.pelles }}
                                    </td>

                                    <td>
                                        {{ item.poubelles_120l }}
                                    </td>

                                    <td>
                                        {{ item.poubelles_240l }}
                                    </td>

                                    <td>
                                        {{ item.caf }}
                                    </td>

                                    <td>
                                        {{ item.picto_ext }}
                                    </td>

                                    <td>
                                        {{ item.picto_caf }}
                                    </td>

                                    <td>
                                        {{ item.picto_defense_de_fumer }}
                                    </td>

                                    <td>
                                        {{ item.point_de_rasso }}
                                    </td>

                                    <td>
                                        {{ item.contact_d_urgence }}
                                    </td>

                                    <td>
                                        {{ item.canne_d_enfutage }}
                                    </td>

                                    <td>
                                        {{ item.panneau_depotage_en_cours }}
                                    </td>

                                    <td>
                                        <span :class="item.picto_danger_tgbt
                                            ? 'text-green-600'
                                            : 'text-red-600'
                                            ">
                                            {{
                                                item.picto_danger_tgbt
                                                    ? 'Oui'
                                                    : 'Non'
                                            }}
                                        </span>
                                    </td>

                                    <td>
                                        <span :class="item.panneau_event
                                            ? 'text-green-600'
                                            : 'text-red-600'
                                            ">
                                            {{
                                                item.panneau_event
                                                    ? 'Oui'
                                                    : 'Non'
                                            }}
                                        </span>
                                    </td>

                                    <td>
                                        <span :class="item.livret_fiche_reflexe
                                            ? 'text-green-600'
                                            : 'text-red-600'
                                            ">
                                            {{
                                                item.livret_fiche_reflexe
                                                    ? 'Oui'
                                                    : 'Non'
                                            }}
                                        </span>
                                    </td>
                                    <td>
                                        <span :class="item.politique
                                            ? 'text-green-600'
                                            : 'text-red-600'
                                            ">
                                            {{
                                                item.livret_fiche_reflexe
                                                    ? 'Oui'
                                                    : 'Non'
                                            }}
                                        </span>
                                    </td>

                                  


                                </tr>
                            </template>

                        </tbody>

                    </table>


                    <ContextMenuUI v-model="context_menu.isOpen" :context-menu="context_menu.context_menu" :actions="context_actions" :bottom_actions="[
                    {
                        label: 'Supprimer',
                        icon: Trash2,
                        variant: 'DANGER',
                        onClick() {
                            right_sidebar.isOpen = true; right_sidebar.equipment = context_menu.equipment; modal_delete = true; context_menu.isOpen = false
                        },
                    }
                ]" />
                </div>

            </div>
            <div class="py-4 px-6 bg-white w-full border-t border-gray-200 flex flex-row items-center justify-between text-sm">
                <span class="text-xs text-gray-500 font-medium">
                    Affichage de {{ pagination.to }} sur {{ pagination.total }} équipements
                </span>
                <vue-awesome-paginate :hide-prev-next-when-ends="true" :total-items="pagination.total"
                    :items-per-page="15" :max-pages-shown="4" v-model="pagination.current_page"
                    @click="(page: number) => pagination.current_page = page" />
            </div>

            <CenterModal class="w-30" title="Supprimer le suivi d’équipement ?" :is-open="modal_delete"
                @close="modal_delete = false" @confirm="deleteEquipments" confirm-title="Supprimer"
                :confirm-variant="'danger'" :confirm-loading="loading_delete">
                <p>Êtes-vous sûr de vouloir supprimer ce suivi d’équipement ? Cette action est irréversible.</p>
            </CenterModal>
        </div>

        <!-- ======================= DRAWER LATÉRAL ======================= -->
        <aside class="h-screen border-l border-gray-200 scrollbar-hide bg-white p-5 sticky top-0 overflow-y-auto shrink-0 shadow-xl z-20 w-[400px] min-w-[400px] max-w-[400px]" v-if="right_sidebar.isOpen">
            <!-- HEADER -->
            <div class="flex items-start justify-between border-b border-gray-200 pb-4">
                <div class="min-w-0 flex-1">
                    <p class="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                        Équipement n° {{ right_sidebar.equipment?.id }}
                    </p>
                    <h4 class="mt-1 font-bold text-gray-900 truncate">
                        {{ right_sidebar.equipment?.site_name?.name || right_sidebar.equipment?.site_name || 'Détails du matériel' }}
                    </h4>
                </div>

                <button type="button" aria-label="Fermer l'aperçu"
                    class="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
                    @click="right_sidebar.isOpen = false">
                    <XIcon :size="18" />
                </button>
            </div>

            <!-- KPI -->

            <div class="
            mt-5
            grid
            grid-cols-2
            gap-3
        ">
                <div class="
                rounded-xl
                bg-slate-50
                p-4
            ">
                    <p class="
                    text-xs
                    text-gray-500
                ">
                        P50
                    </p>

                    <h4>
                        {{
                            right_sidebar.equipment?.p50
                        }}
                    </h4>
                </div>

                <div class="
                rounded-xl
                bg-slate-50
                p-4
            ">
                    <p class="
                    text-xs
                    text-gray-500
                ">
                        CO₂
                    </p>

                    <h4>
                        {{
                            right_sidebar.equipment?.co2
                        }}
                    </h4>
                </div>
            </div>

            <!-- EXTINCTEURS -->

            <div class="
            mt-6
            border-t
            border-gray-200
            pt-5
        ">
                <h6 class="mb-4">
                    Extincteurs
                </h6>

                <div class="
                grid
                grid-cols-2
                gap-3
            ">
                    <div>
                        <span class="
                        text-xs
                        text-gray-500
                    ">
                            P50
                        </span>

                        <p>
                            {{
                                right_sidebar.equipment?.p50
                            }}
                        </p>
                    </div>

                    <div>
                        <span class="
                        text-xs
                        text-gray-500
                    ">
                            P9
                        </span>

                        <p>
                            {{
                                right_sidebar.equipment?.p9
                            }}
                        </p>
                    </div>

                    <div>
                        <span class="
                        text-xs
                        text-gray-500
                    ">
                            P6
                        </span>

                        <p>
                            {{
                                right_sidebar.equipment?.p6
                            }}
                        </p>
                    </div>

                    <div>
                        <span class="
                        text-xs
                        text-gray-500
                    ">
                            CO₂
                        </span>

                        <p>
                            {{
                                right_sidebar.equipment?.co2
                            }}
                        </p>
                    </div>
                </div>
            </div>

            <!-- MATERIEL -->

            <div class="
            mt-6
            border-t
            border-gray-200
            pt-5
        ">
                <h6 class="mb-4">
                    Matériel
                </h6>

                <div class="
                flex
                flex-col
                gap-4
            ">
                    <div class="
                    flex
                    justify-between
                ">
                        <span>Pelles</span>

                        <strong>
                            {{
                                right_sidebar.equipment?.pelles
                            }}
                        </strong>
                    </div>

                    <div class="
                    flex
                    justify-between
                ">
                        <span>
                            Bac métal
                        </span>

                        <strong>
                            {{
                                right_sidebar.equipment?.bas_met
                            }}
                        </strong>
                    </div>

                    <div class="
                    flex
                    justify-between
                ">
                        <span>
                            Bac plastique
                        </span>

                        <strong>
                            {{
                                right_sidebar.equipment?.bas_plast
                            }}
                        </strong>
                    </div>

                    <div class="
                    flex
                    justify-between
                ">
                        <span>
                            Poubelle 120L
                        </span>

                        <strong>
                            {{
                                right_sidebar.equipment
                                    ?.poubelles_120l
                            }}
                        </strong>
                    </div>

                    <div class="
                    flex
                    justify-between
                ">
                        <span>
                            Poubelle 240L
                        </span>

                        <strong>
                            {{
                                right_sidebar.equipment
                                    ?.poubelles_240l
                            }}
                        </strong>
                    </div>
                </div>
            </div>

            <!-- SIGNALISATION -->

            <div class="
            mt-6
            border-t
            border-gray-200
            pt-5
        ">
                <h6 class="mb-4">
                    Signalisation
                </h6>

                <div class="
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
                ">
                        Ext :
                        {{
                            right_sidebar.equipment?.picto_ext
                        }}
                    </span>

                    <span class="
                    rounded-full
                    bg-primary/10
                    px-3
                    py-1
                    text-xs
                ">
                        CAF :
                        {{
                            right_sidebar.equipment?.picto_caf
                        }}
                    </span>

                    <span class="
                    rounded-full
                    bg-primary/10
                    px-3
                    py-1
                    text-xs
                ">
                        Défense fumer :
                        {{
                            right_sidebar.equipment
                                ?.picto_defense_de_fumer
                        }}
                    </span>
                </div>
            </div>

            <!-- CONTROLES -->

            <div class="
            mt-6
            border-t
            border-gray-200
            pt-5
        ">
                <h6 class="mb-4">
                    Contrôles
                </h6>

                <div class="
                flex
                flex-col
                gap-4
            ">
                    <div class="
                    flex
                    justify-between
                ">
                        <span>
                            Danger TGBT
                        </span>

                        <span :class="right_sidebar.equipment?.picto_danger_tgbt
                            ? 'text-green-600'
                            : 'text-red-600'
                            ">
                            {{
                                right_sidebar.equipment?.picto_danger_tgbt
                                    ? "Oui"
                                    : "Non"
                            }}
                        </span>
                    </div>

                    <div class="
                    flex
                    justify-between
                ">
                        <span>
                            Panneau Event
                        </span>

                        <span :class="right_sidebar.equipment?.panneau_event
                            ? 'text-green-600'
                            : 'text-red-600'
                            ">
                            {{
                                right_sidebar.equipment?.panneau_event
                                    ? "Oui"
                                    : "Non"
                            }}
                        </span>
                    </div>

                    <div class="
                    flex
                    justify-between
                ">
                        <span>
                            Livret réflexe
                        </span>

                        <span :class="right_sidebar.equipment?.livret_fiche_reflexe
                            ? 'text-green-600'
                            : 'text-red-600'
                            ">
                            {{
                                right_sidebar.equipment?.livret_fiche_reflexe
                                    ? "Oui"
                                    : "Non"
                            }}
                        </span>
                    </div>

                    <div class="
                    flex
                    justify-between
                ">
                        <span>
                            Politique HSSE
                        </span>

                        <span :class="right_sidebar.equipment?.politique
                            ? 'text-green-600'
                            : 'text-red-600'
                            ">
                            {{
                                right_sidebar.equipment?.politique
                                    ? "Oui"
                                    : "Non"
                            }}
                        </span>
                    </div>
                </div>
            </div>

            <!-- DATE -->

            <div class="
            mt-6
            border-t
            border-gray-200
            pt-5
        ">
                <span class="
                text-xs
                text-gray-500
            ">
                    Dernier relevé
                </span>

                <p class="mt-1">
                    {{
                        right_sidebar.equipment?.created_at
                    }}
                </p>
            </div>
        </aside>
    </div>
</template>
<script setup lang="ts">
    import { computed, onMounted, ref, watch, type ComputedRef } from 'vue';
    import Header from '../../../components/shared/Header.vue';
    import type { EquipmentMonitoringFilterType, EquipmentMonitoringFormType, EquipmentMonitoringType } from '../../../@types/EquipmentMonitoring.type.ts';
    import { EquipmentMonitoringFormData } from '../../../@data/EquipementMonitoring.data.ts';
    import type { ContextMenuActionType, contextMenuType } from '../../../@types/ContextMenu.type.ts';
    import ContextMenuUI from '../../../components/ui/ContextMenuUI.vue';
    import { CloudDownloadIcon, DownloadIcon, Edit, Eye, Loader, SearchIcon, SquarePlusIcon, Trash2, XIcon } from '@lucide/vue';
    import { router } from '../../../router/index.ts';
    import type { PaginationType } from '../../../@types/Pagination.type.ts';
    import ChipFilter from '../../../components/ui/ChipFilter.vue';
    import InputFilter from '../../../components/ui/InputFilter.vue';
    import { useEquipmentMonitoringService } from '../../../core/services/equipmentMonitoring.service.ts';
    import { exportUtils } from '../../../core/utils/export.utils.ts';
    import CenterModal from '../../../components/ui/centerModal.vue';
    import ButtonFilter from '../../../components/ui/ButtonFilter.vue';

    const searchQuery = ref<string>("")
    const right_sidebar = ref<{
        isOpen?: boolean,
        equipment?: EquipmentMonitoringType
    }>(
        {
            isOpen: false,
            equipment: undefined
        }
    )
    const context_actions:ComputedRef<ContextMenuActionType[]>=computed( 
         ()=>{return [
            {
                label: 'Details',
                icon: Eye,
                onClick: () => { right_sidebar.value.isOpen = true; right_sidebar.value.equipment = context_menu.value.equipment }
            },
            {
                label: 'Modifier',
                icon: Edit,
                variant: 'WARNING',
                onClick: () => {
                    router.push(
                        {
                            name: 'EQUIPMENT_MONITORING_UPDATE',
                            params: {
                                id: context_menu.value.equipment?.id
                            }
                        }

                    )
                }
            },
        ]}
    )
    const context_menu = ref<{
        isOpen?: boolean,
        equipment?: EquipmentMonitoringType,
        context_menu?: contextMenuType

    }>({
        context_menu: undefined,
        isOpen: false, equipment: undefined
    })
    const headers = [
        "#",
        "Date",
        "Site",
        "P50",
        "P9",
        "P6",
        "CO₂",
        "Bac Métal",
        "Bac Plastique",
        "Bac de retention",
        "Pelles",
        "Poubelles 120L",
        "Poubelles 240L",
        "CAF",
        "Picto Extincteur",
        "Picto CAF",
        "Picto Défense de Fumer",
        "Point de Rassemblement",
        "Contact d'Urgence",
        "Canne d'Enfutage",
        "Panneau Dépotage",
        "Picto Danger TGBT",
        "Panneau Event",
        "Livret / Fiche Réflexe",
        "Politique",
        


    ]
    const data = ref<EquipmentMonitoringType[]>()
    type filtersKeyType = "site"
    const filterableKeys: filtersKeyType[] = ["site"]
    const columnLables: Record<filtersKeyType, string> = {
        site: 'Site',

    }
    const filters = ref<Record<filtersKeyType, string[]>>(
        {

            "site": []
        }
    )
    const columnOptions = ref<Record<filtersKeyType, string[]>>()
    const dateRange = ref<{
        from: string,
        to: string
    }>(
        {
            from: '',
            to: ''
        }
    )
    const equipments = useEquipmentMonitoringService()
    const modal_delete = ref<boolean>(false)
    const showDateFilter = ref<boolean>(false)
    const pagination = ref<PaginationType>({
        'current_page': 1,
        'to': 0,
        'total': 0
    })
    const loading_data = ref<boolean>(false)
    const loading_export = ref<boolean>(false)
    const loading_delete = ref<boolean>(false)


    function fetchData(params?: EquipmentMonitoringFilterType) {
        loading_data.value = true
        equipments.index(params)
            .then(res => {
                console.log(res.data)
                data.value = res.data.data as EquipmentMonitoringType[]
                pagination.value.to = res.data.meta.to
                pagination.value.total = res.data.meta.total
            })
            .catch(err => {
                console.error(err)
            }).finally(() => {
                loading_data.value = false
            })

    }
    function fetchFilters() {
        equipments.getFilters()
            .then(res => {
                console.log(res)
                columnOptions.value = res.data as Record<filtersKeyType, string[]>
            })
            .catch(err => {
                console.error(err)
            })
    }
    function clearAllFilters() {
        filters.value.site = []
        dateRange.value.from = '',
            dateRange.value.to = '',
            searchQuery.value = ""
    }

    const exportFields: {
        key: keyof EquipmentMonitoringFormType, excelName: string
    }[] = Object.keys(EquipmentMonitoringFormData).map(item => ({
        key: item as keyof EquipmentMonitoringFormType,
        excelName: item.replace("d_", "d'").replace("site_name", 'ss').replace("poubelles", 'poubelle').toUpperCase().replaceAll('_', ' ')
    }))
    function exportData() {
        loading_export.value = true
        equipments.export({
            site: filters.value.site,
            date: dateRange.value,
            search: searchQuery.value
        })
            .then(res => {
                // console.log(res.data.data)
                const equipmentsData: EquipmentMonitoringType[] = res.data.data
                console.log(equipmentsData)
                const convertedData = equipmentsData.map(item => {

                    return Object.fromEntries(
                        Object.entries(item).map(([key, value]) => {
                            // console.log(key,value,typeof value)
                            if (typeof value === 'boolean') {
                                return [key, value ? 'Oui' : 'Non']
                            }
                            return [key, value]
                        })
                    )
                })
                exportUtils(convertedData, exportFields, undefined, undefined, 'export_equipment_monitoring')
            })
            .catch(err => {
                console.error(err)
            })
            .finally(() => {
                loading_export.value = false
            })
    }
    function deleteEquipments() {
        loading_delete.value = true
        equipments.delete(right_sidebar.value.equipment?.id as string | number)
            .then(res => {
                console.log(res.data)
                fetchData({
                    page: pagination.value.current_page,
                    site: filters.value.site,
                    date: dateRange.value,
                    search: searchQuery.value
                })
                modal_delete.value = false
            })
            .catch(err => {
                console.error(err)
            })
            .finally(() => {
                loading_delete.value = false
            })
    }

    watch([filters.value, dateRange.value, () => searchQuery.value], () => {
        console.log(searchQuery.value)
        fetchData({
            page: 1,
            site: filters.value.site,
            date: dateRange.value,
            search: searchQuery.value
        })
    }, {
        immediate: false
    })
    watch(pagination.value, () => {
        fetchData({
            page: pagination.value.current_page,
            site: filters.value.site,
            date: dateRange.value,
            search: searchQuery.value
        })
    }, {
        immediate: false
    })


    onMounted(() => {
        fetchFilters()
        fetchData()
    })
</script>