<template>
    <div class="h-screen sticky top-0 left-0 w-65 min-w-65 bg-white px-3 py-5 flex flex-col gap-y-3 border-r border-gray-200">
        <div class="flex flex-row gap-x-2 items-center justify-center">
            <img src="/logo/logo-galana.webp" class="w-16" />
            <h4>Gestion HSSE</h4>
        </div>
        <div>

            <div v-for="(item, index) in sidebar_routes" :key="index" class=" flex flex-col   w-full  ">
                <div class="flex flex-row gap-x-3 rounded px-2 justify-between items-center h-10" @click="item.children.length ? item.isOpen = !item.isOpen : router.push({
                    name: item.name
                })" :class="item.children.length > 0
                            ? item.children.some(
                                child =>
                                    child.name === router.currentRoute.value.name
                            )
                                ? 'bg-primary text-white'
                                : ''
                            : router.currentRoute.value.name === item.name
                                ? 'bg-primary text-white'
                                : ''
                            ">
                    <div class=" flex flex-row gap-x-3">
                        <component :is="item.icon" />
                        <span>{{ item.label }}</span>
                    </div>
                    <template v-if="item.children.length > 0">
                        <button>
                            <ChevronDown v-if="item.isOpen == false" />
                            <ChevronUp v-if="item.isOpen == true" />
                        </button>
                    </template>
                </div>
                <transition name="child">
                    <template v-if="item.children && item.isOpen">
                        <div class=" w-full " :class="'bg-gray-200/5 '">
                            <div v-for="(itemChild, indexChild) in item?.children" :key="indexChild" @click="router.push({
                                name: itemChild.name
                            })" class="h-10 p-2 flex flex-row items-center"
                                :class="router.currentRoute.value.name == itemChild.name ? 'bg-primary/10 border-l-4 border-primary' : ''">
                                <span class="pl-5">{{ itemChild.label }}</span>
                            </div>
                        </div>
                    </template>
                </transition>
            </div>

        </div>
    </div>
</template>
<script setup lang="ts">
import { useRoute } from 'vue-router';
import { sidebar_routes as route_data } from '../../@data/sidebar.data';
import { ChevronDown, ChevronUp } from '@lucide/vue';
import { ref } from 'vue';

import { router } from '../../router';
const route = useRoute()
const sidebar_routes = ref([...route_data])
</script>
<style scoped>
.child-enter-from,
.child-leave-to {
    height: 0;
    opacity: 0;
    /* transform: translateY(-45px); */
}

.child-enter-active,
.child-leave-active {
    height: fit-content;
    transition: all 0.3s ease-in-out;
}
</style>