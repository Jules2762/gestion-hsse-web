<template>
    <div class="flex flex-row w-full">
        <div class="flex flex-col w-full">
            <Header title="Checklist" :thumbnails="[
                {
                    label: 'Accueil',
                    name: 'DASHBOARD'
                },
                {
                    label: 'Inspections',
                    name: 'INSPECTION'
                },
                {
                    label: 'Checklist',
                    name: 'CHECKLIST'
                },
            ]"></Header>
            <div class="bg-white border-b border-gray-200 p-2 flex flex-col gap-1">
                <div class="flex flex-row items-center justify-between">
                    <div class="flex flex-row gap-1">
                        <ButtonFilter text="Ajouter" :icon="Plus" is-primary @click="router.push({
                            name: 'CHECKLIST_NEW'
                        })" />

                        <ButtonFilter text="Importer" :icon="UploadCloud" />
                        <ButtonFilter text="Export" :icon="Download" />
                        <ButtonFilter text="Templates" :icon="LayoutTemplateIcon" @click="router.push({
                            name: 'TEMPLATE'
                        })" />

                    </div>
                    <InputFilter :icon="Search" v-model="search" />
                </div>
                <ChipFilter :filterable-keys="filterableKeys" :column-labels="columnLabels" :filters="filters"
                    :column-options="columnOptions" :results-count="pagination.to" :results-total="pagination.total" @clear-all="clearFilters()"/>
            </div>
            <div class="  flex flex-row ">
                <div class="transition-all w-full">
                    <table class="">
                        <thead>
                            <tr>
                                <th>Ref</th>
                                <th>Titre</th>
                                <th>Site</th>
                                <th>Lieu</th>
                                <th>Status</th>
                                <th>Date</th>
                                <!-- <th>Action</th> -->
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item, index) in data" :key="index" @click="selected_checklist = item"
                                @contextmenu.prevent="contextMenu.contextMenu = $event; contextMenu.isOpen = true; contextMenu.checklist = item"
                                :class="selected_checklist?.id == item.id ? 'bg-primary/20' : ''">
                                <td>{{ item.id }}</td>
                                <td>{{ item.title }}</td>
                                <td class="truncate max-w-70">{{ item.site }}</td>
                                <td>{{ item.location ? item.location : '-' }}</td>
                                <td>
                                    <ChecklistStatus :name="item.status" />
                                </td>
                                <td>{{ item.date + ' - ' + item.time }}</td>
                                <!-- <td>
                                    <ActionTable show-details show-edit show-delete @click-details="router.push({
                                        name: 'CHECKLIST_DETAILS', params: {
                                            id: 1
                                        }
                                    })" />
                                </td> -->
                            </tr>
                        </tbody>

                    </table>
                    <div class="bg-white flex flex-row items-center justify-end py-4 pr-6">
                        <vue-awesome-paginate @click="(page: number) => { pagination.current_page = page }"
                            :hide-prev-next-when-ends="true" :total-items="pagination.total" :items-per-page="15"
                            :max-pages-shown="4" v-model="pagination.current_page"></vue-awesome-paginate>
                    </div>
                </div>


            </div>
            <ContextMenuUI v-model="contextMenu.isOpen" :context-menu="contextMenu.contextMenu"
                :actions="contextMenu.actions" />
        </div>

        <div v-if="selected_checklist" class="
            
            bg-white
            border-l
            border-gray-200
            
            overflow-y-auto
            overflow-x-hidden
            h-screen
            sticky top-0
            scrollbar-hide
            transition-all
        " :class="selected_checklist ? 'w-120 p-5' : 'w-0 p-0 '">
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
                            Checklist
                        </p>

                        <h4 class="mt-1">
                            {{
                                selected_checklist?.title
                            }}
                        </h4>
                    </div>

                    <button class="
                        p-2
                        rounded-lg
                        hover:bg-slate-100
                    " @click="
                        selected_checklist =
                        undefined
                        ">
                        ✕
                    </button>
                </div>

                <div class="mt-3" v-if="selected_checklist">
                    <ChecklistStatus :name="selected_checklist.status
                        " />
                </div>
            </div>

            <!-- DESCRIPTION -->

            <div class="
                mt-5
                rounded-xl
                border
                border-primary/20
                bg-primary/5
                p-4
            ">
                <p class="
                    text-sm
                    text-gray-700
                ">
                    {{
                        selected_checklist?.description ||
                        'Aucune description disponible.'
                    }}
                </p>
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
                        Sections
                    </p>

                    <h5>
                        {{
                            selected_checklist?.sections
                                ?.length
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
                        Questions
                    </p>

                    <h5>
                        {{
                            selected_checklist?.sections?.reduce(
                                (total, section) => total + (section.items?.length ?? 0),
                                0
                            ) ?? 0
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
                        Actions
                    </p>

                    <h5>
                        {{
                            selected_checklist?.sections ? selected_checklist?.sections
                                ?.flatMap(
                                    section =>
                                        section ? section.items : [],
                                )
                                .filter(
                                    item =>
                                        item ? item.action : undefined,
                                ).length : 0
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
                    flex
                    flex-col
                    gap-4
                ">
                    <div>
                        <p class="
                            text-xs
                            text-gray-500
                        ">
                            Type
                        </p>

                        <p>
                            {{
                                selected_checklist?.type
                            }}
                        </p>
                    </div>

                    <div>
                        <p class="
                            text-xs
                            text-gray-500
                        ">
                            Site
                        </p>

                        <p>
                            {{
                                selected_checklist?.site
                            }}
                        </p>
                    </div>

                    <div>
                        <p class="
                            text-xs
                            text-gray-500
                        ">
                            Lieu
                        </p>

                        <p>
                            {{
                                selected_checklist?.location
                            }}
                        </p>
                    </div>

                    <div>
                        <p class="
                            text-xs
                            text-gray-500
                        ">
                            Date
                        </p>

                        <p>
                            {{
                                selected_checklist?.date
                            }}
                        </p>
                    </div>

                    <div>
                        <p class="
                            text-xs
                            text-gray-500
                        ">
                            Heure
                        </p>

                        <p>
                            {{
                                selected_checklist?.time
                            }}
                        </p>
                    </div>
                </div>
            </div>

            <!-- RESPONSABLES -->

            <div class="
                mt-6
                border-t
                border-gray-200
                pt-5
            ">
                <h6 class="mb-4">
                    Intervenants
                </h6>

                <div class="
                    flex
                    flex-col
                    gap-4
                ">
                    <div>
                        <p class="
                            text-xs
                            text-gray-500
                        ">
                            Inspecteur
                        </p>

                        <p>
                            {{
                                selected_checklist?.inspector
                            }}
                        </p>
                    </div>

                    <div>
                        <p class="
                            text-xs
                            text-gray-500
                        ">
                            Accompagnateur
                        </p>

                        <p>
                            {{
                                selected_checklist?.accompanying_person ||
                                "-"
                            }}
                        </p>
                    </div>

                    <div>
                        <p class="
                            text-xs
                            text-gray-500
                        ">
                            Responsable
                        </p>

                        <p>
                            {{
                                selected_checklist?.manager
                            }}
                        </p>
                    </div>

                    <div>
                        <p class="
                            text-xs
                            text-gray-500
                        ">
                            Contact
                        </p>

                        <p>
                            {{
                                selected_checklist?.contact
                            }}
                        </p>
                    </div>
                </div>
            </div>

            <!-- COMMENTAIRE -->

            <div v-if="
                selected_checklist?.comment
            " class="
                mt-6
                border-t
                border-gray-200
                pt-5
            ">
                <h6 class="mb-3">
                    Commentaire
                </h6>

                <div class="
                    rounded-xl
                    bg-slate-50
                    p-4
                ">
                    {{
                        selected_checklist.comment
                    }}
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
                    <Button class="w-full" @click="
                        router.push({
                            name: 'CHECKLIST_DETAILS',
                            params: {
                                id: selected_checklist?.id,
                            },
                        })
                        ">
                        Voir la checklist
                    </Button>

                    <Button variant="outline" class="w-full">
                        Voir les actions
                    </Button>
                </div>
            </div>
        </div>

    </div>
</template>
<script setup lang="ts">
    import { Download, Edit, Eye, LayoutTemplateIcon, Plus, Search, Send, Trash2, UploadCloud } from '@lucide/vue';
    import Header from '../../../components/shared/Header.vue';
    import Button from '../../../components/ui/Button.vue';
    import { onMounted, ref, watch } from 'vue';

    import { ChecklistsData, ChecklistStatusJsonData } from '../../../@data/Checklist.data.ts';
    import ChecklistStatus from '../../../components/features/checklist/ChecklistStatus.vue';
    import { router } from '../../../router/index.ts';
    import type { ChecklistFilterType, Checklistype } from '../../../@types/Checklist.type.ts';
    import type { ContextMenuActionType, contextMenuType } from '../../../@types/ContextMenu.type.ts';
    import ContextMenuUI from '../../../components/ui/ContextMenuUI.vue';
    import ButtonFilter from '../../../components/ui/ButtonFilter.vue';
    import InputFilter from '../../../components/ui/InputFilter.vue';
    import ChipFilter from '../../../components/ui/ChipFilter.vue';
    import { useChecklistService } from '../../../core/services/checklist.service.ts';
    const data = ref<Checklistype[]>()
    const pagination = ref({
        current_page: 1,
        total: 0,
        to: 0
    })
    const selected_checklist = ref<Checklistype>()
    const contextMenu = ref<{
        isOpen: boolean,
        contextMenu?: contextMenuType,
        checklist?: Checklistype,
        actions?: ContextMenuActionType[]
    }>({
        isOpen: false,
        actions: [
            {
                label: "Détails",
                icon: Eye,
                onClick: () => router.push({
                    name: 'CHECKLIST_DETAILS', params: {
                        id: 1
                    }
                })
            },
            {
                label: "Télécharger rapport",
                icon: Download
            },
            {
                label: "Envoyer e-mail",
                icon: Send
            },
            {
                label: "Modifier",
                variant: 'WARNING',
                icon: Edit
            },
            {
                label: "Supprimer",
                variant: 'DANGER',
                icon: Trash2
            },

        ]
    })
    const filterableKeys: string[] = ['type', 'status', 'inspector']
    const columnLabels: Record<string, string> = {
        'type': 'Type',
        'status': 'Status',
        'inspector': 'Inspecteur',
    }
    const dateRange = ref<Record<string, string>>({
        from: '',
        to: ''
    })
    const search = ref<string>()
    const filters = ref<Record<string, string[]>>({
        'type': [],
        'status': [],
        'inspector': [],

    })
    const columnOptions = ref<Record<string, string[]>>({
        'type': [],
        'status': ChecklistStatusJsonData.map(item => item.label),
        'inspector': []
    })
    const checklistService = useChecklistService()
    function fetchData(params?: ChecklistFilterType) {
        checklistService.index(params)
            .then(res => {
                console.log(res.data.data)
                pagination.value.total = res.data.meta.total
                pagination.value.to = res.data.meta.to
                data.value = res.data.data
            })
            .catch(err => { console.error(err) })
    }
    function fetchFilters() {
        checklistService.getFilters()
            .then(res => {
                // console.log(res.data)
                columnOptions.value.type = res.data.type
                columnOptions.value.inspector = res.data.inspector
            })
            .catch(err => {
                console.error(err)
            })
    }
    function clearFilters(){
        filters.value.type=[]
        filters.value.status=[]
        filters.value.inspector=[]
        search.value=''
        dateRange.value.from=''
        dateRange.value.to=''
    }
    onMounted(() => {
        fetchFilters()
        fetchData()
    })
    watch([
        filters.value, () => search.value, dateRange.value
    ], () => {
      

       
        fetchData({
            page: 1,
            search: search.value,
            status: filters.value.status.map(item=>ChecklistStatusJsonData.find(i=>i.label==item)?.value) as string[],
            type: filters.value.type,
            inspector: filters.value.inspector,
            date: dateRange.value
        })
    },{
        immediate:false
    })
   
</script>
