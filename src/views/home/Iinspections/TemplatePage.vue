<template>
    <div class="flex flex-row">
        <div class="flex flex-col transition-all" :class="right_sidebar.isOpen && right_sidebar.template ? 'w-[calc(100%-400px)]' : 'w-full'">
            <Header title="inspections.templates.title" :thumbnails="[
                {
                    label: 'thumbnails.home',
                    name: 'DASHBOARD'
                },
                {
                    label: 'thumbnails.inspections',
                    name: 'INSPECTION'
                },
                {
                    label: 'thumbnails.checklists',
                    name: 'CHECKLIST'
                },
                {
                    label: 'thumbnails.templates',
                    name: 'TEMPLATE'
                },
            ]" />
            <div class="p-4 bg-white border-b border-gray-200">
                <ChipFilter :show-date-filter="false" :filterable-keys="filterableKeys" :column-labels="columnLabels"
                    :filters="filters" :column-options="columnOptions" @clear-all="clearFilters()" />
            </div>

            <div class="w-full">
                <table>
                    <thead>
                        <tr>
                            <th class="w-16 text-center">REF</th>
                            <th>{{ locale === 'en' ? 'TEMPLATE TITLE' : 'TITRE DU MODÈLE' }}</th>
                            <th>SITE</th>
                            <th>SECTIONS</th>
                            <th>{{ locale === 'en' ? 'CRITERIA' : 'CRITÈRES' }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in data"
                            @contextmenu.prevent="context_menu.isOpen = true; context_menu.context_menu = $event; context_menu.template = item"
                            :key="index" @click="right_sidebar.isOpen = true; right_sidebar.template = item"
                            class="cursor-pointer"
                            :class="right_sidebar.isOpen && right_sidebar.template?.id === item.id ? 'bg-primary/10 font-medium' : ''">
                            <td class="font-mono text-xs text-gray-400 text-center">#{{ item.id }}</td>
                            <td class="font-medium text-gray-900">{{ item.title }}</td>
                            <td class="truncate max-w-70 text-gray-500">{{ item.site || '-' }}</td>
                            <td>
                                <span class="px-2 py-0.5 rounded text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                                    {{ item.sections?.length || 0 }} {{ locale === 'en' ? 'sections' : 'sections' }}
                                </span>
                            </td>
                            <td>
                                <span class="px-2 py-0.5 rounded text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                    {{ item.sections ? item.sections.reduce((total, section) => total + (section.items?.length || 0), 0) : 0 }} {{ locale === 'en' ? 'criteria' : 'critères' }}
                                </span>
                            </td>
                        </tr>
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colspan="5" class="w-full p-4 border-t border-gray-200">
                                <div class="flex flex-row items-center justify-between text-sm">
                                    <span class="text-xs text-gray-500 font-medium">
                                        {{ locale === 'en' ? `Showing ${pagination.total} available templates` : `Affichage de ${pagination.total} modèles disponibles` }}
                                    </span>
                                    <vue-awesome-paginate @click="(page: number) => {pagination.current_page=page; fetchData({ page } as any)}"
                                        :hide-prev-next-when-ends="true" :total-items="pagination.total" :items-per-page="15"
                                        :max-pages-shown="4" v-model="pagination.current_page"></vue-awesome-paginate>
                                </div>
                            </td>
                        </tr>
                    </tfoot>
                </table>
                <ContextMenuUI v-model="context_menu.isOpen" :context-menu="context_menu.context_menu" :actions="[
                        {
                            'icon': Eye,
                            label: locale === 'en' ? 'Template details' : 'Détails du modèle',
                            onClick: () => {
                                right_sidebar.isOpen = true;
                                right_sidebar.template = context_menu.template;
                            }
                        },
                        {
                            'icon': Plus,
                            label: locale === 'en' ? 'Create an inspection' : 'Créer une inspection',
                            onClick: () => {
                                router.push({ name: 'CHECKLIST_NEW' })
                            }
                        },
                    ]"></ContextMenuUI>
            </div>

        </div>

        <!-- VOLET LATÉRAL DE DÉTAIL DU MODÈLE -->
        <aside v-if="right_sidebar.isOpen && right_sidebar.template"
            aria-label="Détails du modèle"
            class="w-[400px] min-w-[400px] max-w-[400px] bg-white border-l border-gray-200 p-5 sticky top-0 h-screen overflow-y-auto z-20 shrink-0 shadow-xl scrollbar-hide flex flex-col justify-between">
            <div>
                <!-- EN-TÊTE DU VOLET -->
                <div class="flex items-start justify-between pb-4 border-b border-gray-200 mb-5">
                    <div class="min-w-0 flex-1">
                        <p class="text-[11px] font-bold uppercase tracking-wider text-gray-400">{{ locale === 'en' ? 'Template #' : 'Modèle n°' }} {{ right_sidebar.template.id }}</p>
                        <h4 class="mt-1 font-bold text-gray-900 truncate">{{ right_sidebar.template.title }}</h4>
                    </div>
                    <button
                        @click="right_sidebar.isOpen = false"
                        type="button"
                        aria-label="Fermer l'aperçu"
                        class="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                        <X :size="18" />
                    </button>
                </div>

                <div class="p-3 bg-slate-50 rounded-xl mb-4">
                    <h3 class="font-bold text-gray-900 text-base mb-1">{{ right_sidebar.template.title }}</h3>
                    <p class="text-xs text-gray-500 mb-2">{{ locale === 'en' ? 'Associated site :' : 'Site associé :' }} <span class="font-medium text-gray-700">{{ right_sidebar.template.site || (locale === 'en' ? 'All sites' : 'Tous les sites') }}</span></p>
                    <div class="flex items-center gap-2 text-xs">
                        <span class="px-2 py-0.5 rounded bg-white border border-gray-200 font-semibold text-gray-700">
                            {{ right_sidebar.template.sections?.length || 0 }} sections
                        </span>
                        <span class="px-2 py-0.5 rounded bg-white border border-gray-200 font-semibold text-gray-700">
                            {{ right_sidebar.template.sections ? right_sidebar.template.sections.reduce((t, s) => t + (s.items?.length || 0), 0) : 0 }} critères
                        </span>
                    </div>
                </div>

                <!-- LISTE DES SECTIONS ET QUESTIONS -->
                <div class="space-y-3">
                    <h5 class="text-xs font-bold text-gray-500 uppercase tracking-wider">{{ locale === 'en' ? 'Sections and verification criteria' : 'Sections et critères de vérification' }}</h5>
                    <div v-for="(sec, sIdx) in right_sidebar.template.sections" :key="(sec as any).order ?? sIdx" class="border border-gray-200 rounded-lg overflow-hidden">
                        <div class="bg-gray-50 px-3 py-2 font-semibold text-xs text-gray-800 flex items-center justify-between border-b border-gray-200">
                            <span>{{ sIdx + 1 }}. {{ sec.title }}</span>
                            <span class="text-[10px] text-gray-500 font-normal">{{ sec.items?.length || 0 }} points</span>
                        </div>
                        <ul class="divide-y divide-gray-100 text-xs text-gray-600">
                            <li v-for="(q, qIdx) in sec.items" :key="(q as any).order ?? qIdx" class="px-3 py-2 flex items-start gap-2 hover:bg-slate-50">
                                <span class="text-primary font-bold shrink-0">{{ sIdx + 1 }}.{{ qIdx + 1 }}</span>
                                <span>{{ q.question }}</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <div class="pt-4 border-t border-gray-200 mt-6">
                <Button class="w-full" :left-icon="Plus" @click="router.push({ name: 'CHECKLIST_NEW' })">
                    {{ locale === 'en' ? 'Create an inspection with this template' : 'Créer une inspection avec ce modèle' }}
                </Button>
            </div>
        </aside>
    </div>
</template>
<script setup lang="ts">
    import { onMounted, ref, watch } from 'vue';
    import Header from '../../../components/shared/Header.vue';
    import { useI18n } from 'vue-i18n';


    import { VueAwesomePaginate } from 'vue-awesome-paginate';

    import type { ChecklistTemplateFilterType, ChecklistTemplateType } from '../../../@types/ChecklistTemplate.type.ts';
    import { useTemplateService } from '../../../core/services/template.service.ts';
    import ChipFilter from '../../../components/ui/ChipFilter.vue';
    import type { contextMenuType } from '../../../@types/ContextMenu.type.ts';
    import ContextMenuUI from '../../../components/ui/ContextMenuUI.vue';
    import { Edit, Eye, Plus, LayoutTemplate, X } from '@lucide/vue';
    import Button from '../../../components/ui/Button.vue';
    import { router } from '../../../router/index.ts';
    import type { PaginationType } from '../../../@types/Pagination.type.ts';
    const data = ref<ChecklistTemplateType[]>()
    const right_sidebar = ref<{
        isOpen: boolean,
        template?: ChecklistTemplateType
    }>({
        isOpen: false,
        template: undefined
    })
    const context_menu = ref<{
        context_menu?: contextMenuType, isOpen: boolean, template?: ChecklistTemplateType
    }>({
        context_menu: undefined,
        isOpen: false,
        template: undefined
    })
    const pagination=ref<PaginationType>({
        current_page:1,
        to:0,
        total:0
    })
    const current_page = ref(1)
    const { t, locale } = useI18n()
    const templatesService = useTemplateService()
    const filterableKeys: string[] = ['site', 'type', 'creator']
    const columnLabels: Record<string, string> = {
        'site': 'Site',
        'type': 'Type',
        'creator': 'Createur'
    }
    const filters = ref<Record<string, string[]>>({
        'site': [],
        'type': [],
        'creator': []
    })
    const columnOptions = ref<Record<string, string[]>>({
        'site': [],
        'type': [],
        'creator': [],
    })

    function fetchData(params?: ChecklistTemplateFilterType) {
        templatesService.index(params)
            .then(res => {
                console.log(res.data)
                data.value = res.data.data
                pagination.value.to=res.data.meta.to
                pagination.value.total=res.data.meta.total
            })
            .catch(err => {
                console.error(err)
            })
    }
    function getFIlters() {
        templatesService.getFIlters()
            .then(res => {
                // console.log(res.data)
                columnOptions.value = res.data
            })
            .catch(err => {
                console.error(err)
            })
    }
    function clearFilters() {
        Object.keys(filters.value).forEach((key) => {
            filters.value[key] = []
        })
    }
    watch(filters.value, () => {
        fetchData(filters.value as ChecklistTemplateFilterType)
    }, {
        immediate: false
    })

    onMounted(() => {
        fetchData()
        getFIlters()

    })
</script>