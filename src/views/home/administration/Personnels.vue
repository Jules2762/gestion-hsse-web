<script setup lang="ts">
    import { useI18n } from 'vue-i18n';
    import ButtonFilter from '../../../components/ui/ButtonFilter.vue';
    import { CloudDownloadIcon, DownloadIcon, Search, SquarePlusIcon, Users } from '@lucide/vue';
    import { router } from '../../../router/index.ts';
    import Header from '../../../components/shared/Header.vue';
    import { useRoute } from 'vue-router';
    import { onMounted, ref } from 'vue';
    import InputFilter from '../../../components/ui/InputFilter.vue';
    import type { PersonnelDataType } from '../../../@types/Personnel.type.ts';
    const { t } = useI18n()
    const route = useRoute()
    const selected_personnel = ref<PersonnelDataType>()
    const data = ref<PersonnelDataType[]>()
    const prev = ref()
    onMounted(() => {
        prev.value = window.history.state
        console.log(prev.value)
    })
</script>

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

            <div class="bg-white p-4 flex flex-col gap-y-2">
                <div class="flex flex-row justify-between items-center">
                    <div class="flex flex-row gap-x-2">
                        <ButtonFilter is-primary :text="t('formation.actions.add')" :icon="SquarePlusIcon"
                            @click="router.push({ name: 'FORMATION_NEW' })" />
                        <ButtonFilter :text="t('formation.actions.import')"
                            @click="router.push({ name: 'FORMATION_IMPORT' })" :icon="CloudDownloadIcon" />
                        <ButtonFilter :text="t('formation.actions.export')" :icon="DownloadIcon" :badge="'150'" />
                        <div class="w-px h-8 bg-gray-300 mx-2" />

                    </div>
                    <InputFilter :icon="Search" />
                </div>
            </div>
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