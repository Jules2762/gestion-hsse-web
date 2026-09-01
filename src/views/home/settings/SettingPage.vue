<script setup lang="ts">
import { computed, ref } from 'vue';

import Header from '../../../components/shared/Header.vue';
import TabUI from '../../../components/ui/TabUI.vue';
import EmailSection from './sections/EmailSection.vue';
const tab=ref({
    index:0,
    data:["Générale","Préférences","E-mail"],

})
</script>

<template>
    <div class="">
        <Header title="Parametre" show-search />
        <div class="flex flex-row">
            <TabUI mode="V" v-model="tab.index" :tab-data="tab.data" />
            <div class="bg-white p-5 w-full border-l border-gray-200">
                <EmailSection v-if="tab.index == 2"/>
                   
               
            </div>
        </div>
    </div>
</template>

