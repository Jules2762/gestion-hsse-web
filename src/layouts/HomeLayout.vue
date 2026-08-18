<template>
    <div class="flex flex-row  bg-primary/2 ">

       <Sidebar v-model="search"/>
        <div class="w-full "><router-view/></div>
    </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import Sidebar from '../components/shared/Sidebar.vue';
const search=ref("")
</script>