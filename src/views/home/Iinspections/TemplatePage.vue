<template>
    <div class="flex flex-row">
        <div class="flex flex-col w-full">
            <Header title="Templates"  :thumbnails="[
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
                {
                    label: 'Template',
                    name: 'TEMPLATE'
                },

            ]" />
            <div class="p-4 bg-white border-b border-gray-200">
                <ChipFilter :show-date-filter="false" :filterable-keys="filterableKeys" :column-labels="columnLabels"
                    :filters="filters" :column-options="columnOptions" @clear-all="clearFilters()" />
            </div>

            <div class="">
                <table class="">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Titre</th>
                            <th>Description</th>
                            <th>Section</th>
                            <th>Question</th>

                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in data"
                            @contextmenu.prevent="context_menu.isOpen = true; context_menu.context_menu = $event; context_menu.template = item"
                            :key="index" @click="right_sidebar.isOpen = true; right_sidebar.template = item">
                            <td>{{ item.id }}</td>
                            <td>{{ item.title }}</td>
                            <td class="truncate max-w-70">{{ item.description }}</td>
                            <td>{{ item.sections.length }}</td>
                            <td>{{item.sections.reduce((total, section) => total + section.items.length, 0)}}</td>

                        </tr>
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colspan="5">
                                <div class="bg-white flex flex-row items-center justify-end py-4 pr-6">
                                    <vue-awesome-paginate @click="(page: number) => {pagination.current_page=page }"
                                        :hide-prev-next-when-ends="true" :total-items="pagination.total" :items-per-page="3"
                                        :max-pages-shown="4" v-model="pagination.current_page"></vue-awesome-paginate>
                                </div>
                            </td>
                        </tr>
                    </tfoot>
                </table>
                <ContextMenuUI v-model="context_menu.isOpen" :context-menu="context_menu.context_menu" :actions="[
                        {
                            'icon': Eye,
                            'label': 'Details',
                        },
                        {
                            'icon': Edit,
                            'label': 'Modifier',
                            'variant':'WARNING'
                        },
                    ]"></ContextMenuUI>
            </div>

        </div>
      
    </div>
</template>
<script setup lang="ts">
    import { onMounted, ref, watch } from 'vue';
    import Header from '../../../components/shared/Header.vue';


    import { VueAwesomePaginate } from 'vue-awesome-paginate';

    import type { ChecklistTemplateFilterType, ChecklistTemplateType } from '../../../@types/ChecklistTemplate.type.ts';
    import { useTemplateService } from '../../../core/services/template.service.ts';
    import ChipFilter from '../../../components/ui/ChipFilter.vue';
    import type { contextMenuType } from '../../../@types/ContextMenu.type.ts';
    import ContextMenuUI from '../../../components/ui/ContextMenuUI.vue';
    import { Edit, Eye } from '@lucide/vue';
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