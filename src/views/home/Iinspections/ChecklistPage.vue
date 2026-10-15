<template>
    <div class="flex flex-row w-full">
        <div class="flex flex-col w-full transition-all" :class="selected_checklist ? 'w-[calc(100%-400px)]' : 'w-full'">
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

            <!-- ======================= RIBBON TOOLBAR ======================= -->
            <div class="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div class="h-16 px-6 flex flex-row items-center justify-between gap-4">
                    <div class="flex flex-row items-center gap-1.5">
                        <ButtonFilter text="Ajouter" :icon="Plus" is-primary @click="router.push({
                            name: 'CHECKLIST_NEW'
                        })" />
                        <ButtonFilter text="Importer" :icon="UploadCloud" />
                        <ButtonFilter text="Export" :icon="Download" :badge="String(pagination.total)" :loading="loading_export" @click="handleExport" />
                        <ButtonFilter text="Templates" :icon="LayoutTemplateIcon" @click="router.push({
                            name: 'TEMPLATE'
                        })" />
                    </div>
                    <div class="flex flex-row items-center gap-2">
                        <InputFilter :icon="Search" placeholder="Rechercher une checklist..." v-model="search" />
                    </div>
                </div>
                <ChipFilter :filterable-keys="filterableKeys" :column-labels="columnLabels" :filters="filters"
                    :column-options="columnOptions" :results-count="pagination.to" :results-total="pagination.total"
                    @clear-all="clearFilters()" />
            </div>

            <!-- CONTENU PRINCIPAL -->
            <div class="flex flex-col flex-1 min-w-0">
                <!-- INDICATEUR DE CHARGEMENT -->
                <div v-if="loading" class="p-16 flex flex-col items-center justify-center gap-3 text-gray-500">
                    <Loader2 :size="32" class="animate-spin text-primary" />
                    <span class="text-sm">Chargement des checklists...</span>
                </div>

                <!-- AUCUN RÉSULTAT -->
                <div v-else-if="!data || data.length === 0" class="p-16 flex flex-col items-center justify-center text-center">
                    <div class="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mb-4">
                        <ClipboardList :size="28" />
                    </div>
                    <h5 class="text-gray-700 font-semibold mb-1">Aucune checklist enregistrée</h5>
                    <p class="text-sm text-gray-500 max-w-sm">
                        Aucune inspection ne correspond aux critères de filtre sélectionnés.
                    </p>
                    <div class="flex gap-2 mt-4">
                        <button
                            v-if="search || filters.type.length || filters.status.length || filters.inspector.length || dateRange.from || dateRange.to"
                            @click="clearFilters"
                            class="px-4 py-2 text-xs font-medium text-primary bg-primary/10 rounded-lg hover:bg-primary/20 transition">
                            Réinitialiser les filtres
                        </button>
                        <button
                            @click="router.push({ name: 'CHECKLIST_NEW' })"
                            class="px-4 py-2 text-xs font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition">
                            Créer une checklist
                        </button>
                    </div>
                </div>

                <!-- TABLEAU -->
                <div v-else class="transition-all w-full">
                    <table>
                        <thead>
                            <tr>
                                <th class="w-16 text-center">REF</th>
                                <th>TITRE</th>
                                <th>SITE</th>
                                <th>LIEU</th>
                                <th>STATUT</th>
                                <th>DATE</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item, index) in data" :key="index" @click="selected_checklist = item"
                                @contextmenu.prevent="contextMenu.contextMenu = $event; contextMenu.isOpen = true; contextMenu.checklist = item"
                                :class="selected_checklist?.id == item.id ? 'bg-primary/10 font-medium' : ''"
                                class="cursor-pointer">
                                <td class="font-mono text-xs text-gray-400 text-center">#{{ item.id }}</td>
                                <td class="font-medium text-gray-900">{{ item.title }}</td>
                                <td class="truncate max-w-70 text-gray-700">{{ item.site }}</td>
                                <td class="text-gray-500">{{ item.location ? item.location : '-' }}</td>
                                <td>
                                    <ChecklistStatus :name="item.status" />
                                </td>
                                <td class="text-gray-500 font-mono text-xs">{{ item.date + ' ' + item.time }}</td>
                            </tr>
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colspan="6" class="w-full p-4 border-t border-gray-200">
                                    <div class="flex flex-row items-center justify-between text-sm">
                                        <span class="text-xs text-gray-500 font-medium">
                                            Affichage de {{ pagination.to }} sur {{ pagination.total }} checklists
                                        </span>
                                        <vue-awesome-paginate @click="(page: number) => { pagination.current_page = page }"
                                            :hide-prev-next-when-ends="true" :total-items="pagination.total" :items-per-page="15"
                                            :max-pages-shown="4" v-model="pagination.current_page"></vue-awesome-paginate>
                                    </div>
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>

            <ContextMenuUI v-model="contextMenu.isOpen" :context-menu="contextMenu.contextMenu"
                :actions="context_menu_actions" />
        </div>

        <!-- ======================= DRAWER LATÉRAL ======================= -->
        <aside v-if="selected_checklist" aria-label="Aperçu de la checklist"
            class="bg-white border-l border-gray-200 overflow-y-auto overflow-x-hidden h-screen sticky top-0 scrollbar-hide transition-all shadow-xl z-20 shrink-0 w-[400px] min-w-[400px] max-w-[400px] p-5">
            <!-- HEADER DU VOLET -->
            <div class="pb-4 border-b border-gray-200">
                <div class="flex items-start justify-between gap-3">
                    <div class="min-w-0 flex-1">
                        <p class="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                            Checklist n° {{ selected_checklist?.id }}
                        </p>
                        <h4 class="mt-1 font-bold text-gray-900 truncate">
                            {{ selected_checklist?.title }}
                        </h4>
                        <div class="mt-2.5">
                            <ChecklistStatus :name="selected_checklist.status" />
                        </div>
                    </div>

                    <button
                        type="button"
                        aria-label="Fermer l'aperçu"
                        class="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
                        @click="selected_checklist = undefined">
                        <XIcon :size="18" />
                    </button>
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

                    <Button variant="outline" class="w-full" @click="router.push({ name: 'ACTION' })">
                        Voir les actions
                    </Button>
                </div>
            </div>
        </aside>

        <CenterModal
            :is-open="modal_delete"
            title="Supprimer la checklist ?"
            confirm-variant="danger"
            :confirm-loading="loading_delete"
            @close="modal_delete = false"
            @confirm="deleteChecklist"
        >
            <p class="text-sm text-gray-600">
                Êtes-vous sûr de vouloir supprimer définitivement l'inspection
                <strong>« {{ item_to_delete?.title || ('#' + item_to_delete?.id) }} »</strong> ?
                Cette action supprimera également tous les contrôles et actions associés.
            </p>
        </CenterModal>
    </div>
</template>
<script setup lang="ts">
    import { ClipboardList, Download, Edit, Eye, LayoutTemplateIcon, Loader2, Plus, Search, Send, Trash2, UploadCloud, X as XIcon } from '@lucide/vue';
    import Header from '../../../components/shared/Header.vue';
    import Button from '../../../components/ui/Button.vue';
    import { computed, onMounted, ref, watch, type ComputedRef } from 'vue';

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
    import CenterModal from '../../../components/ui/centerModal.vue';
    import { exportUtils } from '../../../core/utils/export.utils.ts';
    import { toast } from 'vue3-toastify';

    const data = ref<Checklistype[]>()
    const loading = ref(false)
    const loading_export = ref(false)
    const modal_delete = ref(false)
    const loading_delete = ref(false)
    const item_to_delete = ref<Checklistype | null>(null)

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
    }>({
        isOpen: false,
    })

    const context_menu_actions: ComputedRef<ContextMenuActionType[]> = computed(() => [
        {
            label: "Détails & Rapport",
            icon: Eye,
            onClick: () => {
                if (contextMenu.value.checklist?.id) {
                    router.push({
                        name: 'CHECKLIST_DETAILS',
                        params: { id: contextMenu.value.checklist.id }
                    })
                }
            }
        },
        {
            label: "Télécharger rapport (PDF)",
            icon: Download,
            onClick: () => {
                if (contextMenu.value.checklist?.id) {
                    router.push({
                        name: 'CHECKLIST_DETAILS',
                        params: { id: contextMenu.value.checklist.id }
                    })
                }
            }
        },
        {
            label: "Envoyer e-mail",
            icon: Send,
            onClick: () => {
                const chk = contextMenu.value.checklist;
                const subject = encodeURIComponent(`Rapport Inspection HSSE - ${chk?.title || 'Checklist'}`);
                const body = encodeURIComponent(`Bonjour,\n\nVeuillez trouver le compte-rendu de l'inspection #${chk?.id} - ${chk?.title}.\nSite : ${chk?.site || '-'}\nStatut : ${chk?.status}\n\nCordialement,\nService HSSE Galana`);
                window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
            }
        },
        {
            label: "Modifier",
            variant: 'WARNING',
            icon: Edit,
            onClick: () => {
                if (contextMenu.value.checklist?.id) {
                    router.push({
                        name: 'CHECKLIST_DETAILS',
                        params: { id: contextMenu.value.checklist.id }
                    })
                }
            }
        },
        {
            label: "Supprimer",
            variant: 'DANGER',
            icon: Trash2,
            onClick: () => {
                if (contextMenu.value.checklist) {
                    item_to_delete.value = contextMenu.value.checklist;
                    modal_delete.value = true;
                }
            }
        }
    ])
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
        loading.value = true
        checklistService.index(params)
            .then(res => {
                pagination.value.total = res.data.meta.total
                pagination.value.to = res.data.meta.to
                data.value = res.data.data
            })
            .catch(err => { console.error(err) })
            .finally(() => {
                loading.value = false
            })
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
    function clearFilters() {
        filters.value.type = []
        filters.value.status = []
        filters.value.inspector = []
        search.value = ''
        dateRange.value.from = ''
        dateRange.value.to = ''
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
            status: filters.value.status.map(item => ChecklistStatusJsonData.find(i => i.label == item)?.value) as string[],
            type: filters.value.type,
            inspector: filters.value.inspector,
            date: dateRange.value
        })
    }, {
        immediate: false
    })

    async function handleExport() {
        loading_export.value = true
        try {
            const params: any = {
                search: search.value,
                status: filters.value.status.map(item => ChecklistStatusJsonData.find(i => i.label == item)?.value) as string[],
                type: filters.value.type,
                inspector: filters.value.inspector,
            }
            const res = await checklistService.export(params)
            const items = res.data?.data || []
            if (items.length === 0) {
                toast.info("Aucune donnée à exporter")
                return
            }

            const exportFields = [
                { key: 'Ref', excelName: 'Référence' },
                { key: 'Date', excelName: 'Date' },
                { key: 'Titre', excelName: 'Titre de l\'inspection' },
                { key: 'Type', excelName: 'Type' },
                { key: 'Site', excelName: 'Site' },
                { key: 'Lieu', excelName: 'Lieu' },
                { key: 'Inspecteur', excelName: 'Inspecteur' },
                { key: 'Statut', excelName: 'Statut' },
                { key: 'Conformite', excelName: 'Taux de conformité' },
            ]

            exportUtils(
                items,
                exportFields,
                () => toast.success("Export des checklists réussi"),
                () => toast.error("Erreur lors de l'export"),
                "checklists_hsse"
            )
        } catch (e) {
            console.error("Erreur export checklist:", e)
            toast.error("Impossible d'exporter les checklists")
        } finally {
            loading_export.value = false
        }
    }

    async function deleteChecklist() {
        if (!item_to_delete.value?.id) return
        loading_delete.value = true
        try {
            await checklistService.destroy(item_to_delete.value.id)
            toast.success("Inspection supprimée avec succès")
            modal_delete.value = false
            item_to_delete.value = null
            fetchData()
        } catch (e) {
            console.error("Erreur suppression checklist:", e)
            toast.error("Impossible de supprimer la checklist")
        } finally {
            loading_delete.value = false
        }
    }

</script>
