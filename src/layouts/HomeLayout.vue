<template>
    <div class="flex flex-row  bg-primary/2 ">

       <Sidebar v-model="search" class="max-md:hidden"/>
        <div class="w-full overflow-x-hidden "><router-view/></div>
    </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import Sidebar from '../components/shared/Sidebar.vue';
const search=ref("")
</script>