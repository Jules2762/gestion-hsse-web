<template>
    <div class="w-full flex flex-col ">
        <Header title="dashboard"  v-model="search" />
        <TabUI v-model="tab_index" :tab-data="tab_data"/>
        <template v-if="tab_index==1">
            <PlanFormationSection/>
        </template>      
        <template v-if="tab_index==0">
            <GeneralSection/>
        </template>                              
        <template v-if="tab_index==2">
            <InspectionSection/>
        </template>                              
    </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import Header from '../../components/shared/Header.vue';

import PlanFormationSection from '../../components/features/dashboard/plan-de-formation/PlanFormationSection.vue';
import GeneralSection from '../../components/features/dashboard/général/GeneralSection.vue';
import InspectionSection from '../../components/features/dashboard/inspection/InspectionSection.vue';
import TabUI from '../../components/ui/TabUI.vue';
import { useI18n } from 'vue-i18n';

const {t}=useI18n()
const search=ref("")
const tab_data=[
    "dashboard.tabs.general",
    "dashboard.tabs.training plan",
    "dashboard.tabs.inspection",
]
const tab_index=ref(0)
</script>