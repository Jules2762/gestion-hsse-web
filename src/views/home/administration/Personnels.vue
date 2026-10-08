<template>
    <div class="flex flex-row">
        <div class="flex flex-col w-full">
            <Header title="Personnel" :thumbnails="[
                {
                    'label': 'thumbnails.home',
                    'name': 'DASHBOARD'
                }, {
                    'label': 'thumbnails.administration',
                    'name': 'ADMINISTRATION'
                },


                {
                    'label': 'thumbnails.personnels',
                    'name': 'PERSONNEL'
                },
                

            ]" />

            <!-- ===================================
        =========== FILTER SECTION =============
        ==================================== -->

            <div class="bg-white p-4 flex flex-col gap-y-2 sticky top-0">
                <div class="flex flex-row justify-between items-center">
                    <div class="flex flex-row gap-x-2">
                        <ButtonFilter is-primary :text="t('formation.actions.add')" :icon="SquarePlusIcon"
                            @click="router.push({ name: 'PERSONNEL_ADD' })" />
                        <ButtonFilter :text="t('formation.actions.import')"
                            @click="router.push({ name: 'FORMATION_IMPORT' })" :icon="CloudDownloadIcon" />
                        <ButtonFilter :text="t('formation.actions.export')" :icon="DownloadIcon" :badge="'150'" />
                        <div class="w-px h-8 bg-gray-300 mx-2" />

                    </div>
                    <InputFilter :icon="Search" />
                </div>
                <ChipFilter :filterable-keys="filterableKeys" :column-labels="columnLabels"
                    :column-options="columnOptions" :filters="filters" :show-date-filter="false"
                    :results-count="pagination.from" :results-total="pagination.to" />
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
                    <tr v-for="item in data" :key="item.id">
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
        <div class="  scrollbar-hide
            bg-white
            border-l
            border-gray-200
            p-5
            h-screen
            sticky top-0 bottom-0
            overflow-y-auto" :class="selected_personnel && data ? 'w-100 min-w-100' : 'w-0 hidden'"></div>
    </div>
</template>

<script setup lang="ts">
    import { useI18n } from 'vue-i18n';
    import ButtonFilter from '../../../components/ui/ButtonFilter.vue';
    import { CloudDownloadIcon, DownloadIcon, Search, SquarePlusIcon } from '@lucide/vue';
    import { router } from '../../../router/index.ts';
    import Header from '../../../components/shared/Header.vue';
    import { onMounted, ref } from 'vue';
    import InputFilter from '../../../components/ui/InputFilter.vue';
    import type { PersonnelDataType } from '../../../@types/Personnel.type.ts';
    import personnelService from '../../../core/services/personnel.service.ts';
    import ChipFilter from '../../../components/ui/ChipFilter.vue';
    const { t } = useI18n()

    const selected_personnel = ref<PersonnelDataType>()
    const data = ref<PersonnelDataType[]>()
    const pagination = ref<{
        current_page: number,
        from: number,
        to: number
    }>({
        current_page: 1,
        from: 0,
        to: 0
    })
    type FilterKeyType = 'fonction' | 'direction' | 'entity'
    const filterableKeys: FilterKeyType[] = ['fonction', 'direction', 'entity']
    const columnLabels: Record<FilterKeyType, string> = {
        'direction': 'Direction',
        'entity': 'Entité',
        'fonction': 'Fonction'
    }
    const filters = ref<Record<FilterKeyType, string[]>>({
        'direction': [],
        'entity': [],
        'fonction': []
    })
    const columnOptions = ref<Record<FilterKeyType, string[]>>({
        'direction': [],
        'entity': [],
        'fonction': []
    })

    function fetchData() {
        personnelService.index()
            .then(res => {
                const meta = res.data.meta
                pagination.value.from = meta.from
                pagination.value.to = meta.to
                data.value = res.data.data
            })
            .catch(err => {
                console.error(err)
            })
    }

    function fetchFilters() {
        personnelService.getFilters()
            .then(res => {
                columnOptions.value = res.data
            })
            .catch(err => {
                console.error(err)
            })
    }


    onMounted(() => {
        fetchFilters()
        fetchData()
    })

</script>