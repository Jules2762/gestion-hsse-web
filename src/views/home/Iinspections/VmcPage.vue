<template>
    <div class="flex w-full flex-row" @click="contextMenu.isOpen = false">

        <div class="flex min-w-0 flex-1 flex-col transition-all">

            <Header title="Visible Management Commitment" :thumbnails="[
                { label: 'Accueil', name: 'DASHBOARD' },
                { label: 'Inspection', name: 'INSPECTION' },
                { label: 'VMC', name: 'VMC' }
            ]" />

            <div class="border-b border-gray-200 bg-white p-4">
                <div class="flex flex-row items-center justify-between">
                    <div class="flex flex-row items-center gap-x-2">
                        <ButtonFilter text="Ajout" :icon="PlusSquare" is-primary @click="router.push({
                            name:'VMC_NEW'
                        })" />
                        <ButtonFilter text="Export" :icon="Download" :badge="'123'" />
                    </div>
                    <InputFilter :icon="Search" />
                </div>
                <ChipFilter :filterable-keys="filterableKeys" :column-labels="columnLabels"
                    :column-options="columnOptions" :filters="filters" :results-total="pagination.total"
                    :results-count="pagination.to" :date-range="dataRange"/>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>Ref</th>
                        <th>Date</th>
                        <th>Type</th>
                        <th>Site</th>
                        <th>Inspecteur</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in data" :key="item.id" class="cursor-pointer"
                        :class="{ 'bg-primary-light/40': isSelected(item) }" @click="openPreview(item)"
                        @contextmenu.prevent="openContextMenu($event, item)" >
                        <td>{{ item.id }}</td>
                        <td>{{ item.date ? new Date(item.date).toLocaleDateString() : '-' }}</td>
                        <td>{{ item.type }}</td>
                        <td>{{ item.site ? item.site : '-' }}</td>
                        <td>{{ item.inspector ? item.inspector : '-' }}</td>
                        <td>
                            <ChecklistStatus :name="item.status" />
                        </td>
                    </tr>
                </tbody>
                <tfoot>
                    <tr>
                        <td colspan="6" class="px-4 py-3">
                            <div class="flex w-full items-center justify-end">
                                <vue-awesome-paginate v-model="pagination.current_page" :total-items="pagination.total"
                                    :items-per-page="15" :max-pages-shown="4" :hide-prev-next-when-ends="true" />
                            </div>
                        </td>
                    </tr>
                </tfoot>
            </table>

        </div>


        <!-- ========================================================= -->
        <!-- APERÇU DE L'INSPECTION SÉLECTIONNÉE -->
        <!-- ========================================================= -->

        <aside v-if="right_sidebar.isOpen && selected" aria-label="Aperçu de l'inspection"
            class="sticky top-0 flex h-screen w-100 min-w-100 shrink-0 flex-col border-l border-border bg-surface">

            <!-- En-tête -->
            <header class="flex items-start justify-between gap-3 border-b border-border p-4">

                <div class="flex min-w-0 flex-col gap-2">
                    <p class="text-xs font-medium text-text-muted">VMC n° {{ selected.id }}</p>
                    <h4 class="wrap-break-word">{{ selected.title || selected.type || "Sans titre" }}</h4>
                    <div>
                        <ChecklistStatus :name="selected.status" />
                    </div>
                </div>

                <button type="button" aria-label="Fermer l'aperçu"
                    class="rounded-lg p-1.5 text-text-muted transition-colors hover:bg-background hover:text-text-primary"
                    @click="closePreview">
                    <XIcon :size="20" />
                </button>

            </header>

            <!-- Contenu -->
            <div class="flex flex-1 flex-col gap-6 overflow-y-auto p-4">

                <section class="flex flex-col gap-3">

                    <h6 class="text-xs font-semibold uppercase tracking-wide text-text-muted">Informations</h6>

                    <dl class="flex flex-col divide-y divide-border rounded-xl border border-border">
                        <div v-for="row in infoRows" :key="row.label" class="flex items-center gap-3 px-3.5 py-3">
                            <div
                                class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-light text-primary">
                                <component :is="row.icon" class="h-4 w-4" />
                            </div>
                            <div class="min-w-0">
                                <dt class="text-xs text-text-muted">{{ row.label }}</dt>
                                <dd class="truncate text-sm font-medium"
                                    :class="row.value ? 'text-text-primary' : 'text-text-muted'">
                                    {{ row.value || "-" }}
                                </dd>
                            </div>
                        </div>
                    </dl>

                </section>

                <section class="flex flex-col gap-3">

                    <h6 class="text-xs font-semibold uppercase tracking-wide text-text-muted">Responsables</h6>

                    <ul class="flex flex-col gap-2">
                        <li v-for="person in people" :key="person.label"
                            class="flex items-center gap-3 rounded-xl border border-border p-3">
                            <div
                                class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-light text-xs font-semibold text-primary">
                                <span v-if="person.initials">{{ person.initials }}</span>
                                <UserRound v-else class="h-4 w-4" />
                            </div>
                            <div class="min-w-0">
                                <p class="text-xs text-text-muted">{{ person.label }}</p>
                                <p class="truncate text-sm font-medium"
                                    :class="person.name ? 'text-text-primary' : 'text-text-muted'">
                                    {{ person.name || "Non renseigné" }}
                                </p>
                                <p v-if="person.email" class="truncate text-xs text-text-muted">{{ person.email }}</p>
                            </div>
                        </li>
                    </ul>

                </section>

                <section class="flex flex-col gap-3">

                    <h6 class="text-xs font-semibold uppercase tracking-wide text-text-muted">Recommandation</h6>

                    <p v-if="selected.recommendation?.trim()"
                        class="whitespace-pre-line rounded-xl bg-background p-3.5 text-sm leading-relaxed text-text-primary">
                        {{ selected.recommendation }}
                    </p>
                    <p v-else class="rounded-xl border border-dashed border-border p-3.5 text-sm text-text-muted">
                        Aucune recommandation pour cette inspection.
                    </p>

                </section>

            </div>

            <!-- Actions -->
            <footer class="flex items-center justify-end gap-3 border-t border-border p-4">
                <Button variant="outline" type="button" @click="closePreview">Fermer</Button>
                <Button type="button" :left-icon="ExternalLink" @click="openDetails">Ouvrir la fiche</Button>
            </footer>

        </aside>

        <ContextMenuUI v-model="contextMenu.isOpen" :context-menu="contextMenu.contextMenu"
            :actions="contextMenuActions" :bottom_actions="contextMenuBottomActions"/>

    </div>
</template>
<script setup lang="ts">
    import {
        Ban,
        CalendarDays,
        ClipboardList,
        Download,
        Edit,
        ExternalLink,
        Eye,
        MapPin,
        PlusSquare,
        Search,
        Trash2,
        UserCheck,
        UserRound,
        Users,
        XIcon,
    } from '@lucide/vue';
    import Header from '../../../components/shared/Header.vue';
    import ButtonFilter from '../../../components/ui/ButtonFilter.vue';
    import InputFilter from '../../../components/ui/InputFilter.vue';
    import ChipFilter from '../../../components/ui/ChipFilter.vue';
    import Button from '../../../components/ui/Button.vue';
    import ChecklistStatus from '../../../components/features/checklist/ChecklistStatus.vue';
    import ContextMenuUI from '../../../components/ui/ContextMenuUI.vue';
    import { computed, onMounted, onUnmounted, ref, watch, type ComputedRef } from 'vue';
    import type { VMCDataType, VMCFilterType } from '../../../@types/VMC.type.ts';
    import type { UserDataType } from '../../../@types/User.type.ts';
    import type { ContextMenuActionType, contextMenuType } from '../../../@types/ContextMenu.type.ts';
    import vmcService from '../../../core/services/vmc.service.ts';
    import { router } from '../../../router/index.ts';

    const filterableKeys: string[] = ['type', 'site', 'inspector']
    const columnLabels: Record<string, string> = {
        'type': 'Type',
        'site': 'Site',
        'inspector': 'Inspecteur'
    }
    const filters = ref<Record<string, string[]>>({
        'type': [],
        'site': [],
        'inspector': []
    })
    const columnOptions = ref<Record<string, string[]>>({
        'type': [],
        'site': [],
        'inspector': []
    })
    const right_sidebar = ref<{
        isOpen: boolean,
        selected_vmc?: VMCDataType
    }>({
        isOpen: false,
        selected_vmc: undefined
    })
    const data = ref<VMCDataType[]>([])
    const pagination = ref<{
        current_page: number,
        
        to: number,
        total:number
    }>({
        current_page: 1,
       
        to: 0,
        total:0
    })
    const contextMenu = ref<{
        isOpen: boolean,
        contextMenu: contextMenuType,
        vmc?: VMCDataType
    }>({
        isOpen: false,
        contextMenu: {
            clientX: undefined,
            clientY: undefined
        },
        vmc: undefined
    })
    const contextMenuActions: ComputedRef<ContextMenuActionType[]> = computed(() => [
        {
            label: 'Détails',
            icon: Eye,
            onClick(){
                right_sidebar.value.isOpen=true
                right_sidebar.value.selected_vmc=contextMenu.value.vmc
                contextMenu.value.isOpen=false
            }
        },...(contextMenu.value.vmc?.status=="COMPLETED"?[
            {
                'label':'Télécharger fiche',
                'icon':Download
            }
        ] as ContextMenuActionType[]:[])
        , ...(contextMenu.value.vmc?.status == "DRAFT" ? [
            {
                'label': 'Modifier',
                'icon': Edit,
                'variant':'WARNING'
            }
        ] as ContextMenuActionType[] : [])
        , ...(contextMenu.value.vmc?.status == "DRAFT" ? [
            {
                'label': 'Annuler',
                'icon': Ban,
                'variant':'DANGER'
            }
        ] as ContextMenuActionType[] : [])
    ])
    const contextMenuBottomActions: ComputedRef<ContextMenuActionType[]> = computed(() => [
        {
            label: 'Supprimer',
            icon: Trash2,
            'variant':'DANGER'
           
        }])
        const dataRange=ref<{
            from:string,
            to:string
        }>({
            from:'',
            to:''
        })

    /*
    |--------------------------------------------------------------------------
    | APERÇU
    |--------------------------------------------------------------------------
    */

    const selected = computed(() => right_sidebar.value.selected_vmc)

    const isSelected = (item: VMCDataType) =>
        right_sidebar.value.isOpen && selected.value?.id === item.id

    function openPreview(item: VMCDataType) {
        right_sidebar.value.selected_vmc = item
        right_sidebar.value.isOpen = true
    }

    function closePreview() {
        right_sidebar.value.isOpen = false
    }

    function openDetails() {
        if (!selected.value) return
        // TODO : remplacer par le vrai nom de la route de détail
        router.push({ name: 'VMC_DETAIL', params: { id: selected.value.id } })
    }

    function openContextMenu(event: MouseEvent, item: VMCDataType) {
        contextMenu.value.contextMenu = event
        contextMenu.value.vmc = item
        contextMenu.value.isOpen = true
    }

    function formatDate(value?: string) {
        if (!value) return ''
        const date = new Date(value)
        if (Number.isNaN(date.getTime())) return value
        return new Intl.DateTimeFormat('fr-FR', { dateStyle: 'long' }).format(date)
    }

    const infoRows = computed(() => [
        { label: 'Date', value: formatDate(selected.value?.date), icon: CalendarDays },
        { label: 'Type', value: selected.value?.type, icon: ClipboardList },
        { label: 'Site', value: selected.value?.site, icon: MapPin },
        { label: 'Inspecteur', value: selected.value?.inspector, icon: UserCheck },
        { label: 'Personne accompagnante', value: selected.value?.accompanying_person, icon: Users },
    ])

    // NOTE : hypothèse sur UserDataType (first_name, last_name, email).
    // À adapter si vos champs portent d'autres noms.
    function describeUser(label: string, user?: UserDataType) {
        const first = user?.first_name?.trim() ?? ''
        const last = user?.last_name?.trim() ?? ''
        return {
            label,
            name: `${first} ${last}`.trim(),
            email: user?.email ?? '',
            initials: ((first[0] ?? '') + (last[0] ?? first[1] ?? '')).toUpperCase(),
        }
    }

    const people = computed(() => [
        describeUser('Assignée à', selected.value?.assigned_to),
        describeUser('Créée par', selected.value?.created_by),
    ])

    // Échap ferme l'aperçu
    function onKeydown(event: KeyboardEvent) {
        if (event.key === 'Escape') closePreview()
    }


    /*
    |--------------------------------------------------------------------------
    | DONNÉES
    |--------------------------------------------------------------------------
    */

    function fetchData(params?:VMCFilterType) {
        vmcService.index(params)
            .then(res => {
                data.value = res.data.data
                
                pagination.value.to = res.data.meta.to
                pagination.value.total=res.data.meta.total
                console.log('res')
            })
            .catch(err => {
                console.error(err)
            })
    }
    function fetchFilters(){
        vmcService.getFilters()
        .then(res=>{
            // console.log(res.data)
            columnOptions.value.type=res.data.type
            columnOptions.value.site=res.data.site
            columnOptions.value.inspector=res.data.inspector
        })
        .catch(err=>{
            console.error(err)
        })
    }

    onMounted(() => {
        fetchData()
        fetchFilters()
        window.addEventListener('keydown', onKeydown)
    })

    onUnmounted(() => {
        window.removeEventListener('keydown', onKeydown)
    })
    watch([filters.value,dataRange.value],()=>{
        console.log(filters.value)
        fetchData({
            date:dataRange.value,
            type:filters.value.type,
            site:filters.value.site,
            inspector:filters.value.inspector,
        })
    },{
        immediate:false
    })
</script>