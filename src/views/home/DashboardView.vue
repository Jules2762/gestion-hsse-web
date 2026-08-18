<template>
    <div class="w-full flex flex-col ">
        <Header title="Hello" show-search v-model="search"/>
        <div class="bg-white p-4 flex flex-row gap-x-4 border-b border-gray-200">
            <button v-for="(value,index) in tab_data" :key="index" :class="index==tab_index?'border-b-3 border-primary text-primary font-semibold':''" @click="tab_index=index" class="flex  flex-row items-center gap-x-2">
                <span>{{value}}</span>
                <span v-if="tab_index!=index" class="flex flex-row items-center justify-center text-xs w-4 text-white h-4 rounded-full bg-red-400">1</span>
            </button>
            
           
        </div>
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

const search=ref("")
const tab_data=[
    "Général",
    "Plan de formation",
    "Inspections",
]
const tab_index=ref(0)
</script>