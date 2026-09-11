<template>
    <div @mouseenter.self="sidebar.toggle(true)" @mouseleave.self="hide"
        class="h-screen fixed top-0 left-0 z-9999   scrollbar-hide overflow-y-auto bg-white overflow-x-hidden transition-all duration-200 px-3 py-5 flex flex-col gap-y-3 border-r border-gray-200"
        :class="sidebar.isShow ? 'w-65 min-w-65 ' : 'w-16 min-w-16'">
        <div class="flex flex-row gap-x-2 items-center justify-start mb-5 cursor-pointer" @click="router.push({
            name: 'DASHBOARD'
        })">
            <img src="/logo/logo-galana.webp" class="w-13 min-w-13 -translate-x-2" />
            <h4 class="text-nowrap">{{ t('sidebar.hsse management') }}</h4>
        </div>
        <div class="flex  flex-col gap-y-3 flex-1 ">
            <div v-for="(item, index) in sidebar_routes" :key="index"
                class=" flex flex-col   w-full transition-all select-none overflow-x-hidden ">
                <div class="flex flex-row gap-x-3 rounded px-2 justify-between items-center h-10 relative "
                    @click="toggleMenu(item); sidebar.setLastIndex(index)" :class="[item.children.length > 0
                        ? item.children.some(
                            child =>
                                child.name === router.currentRoute.value.name
                        )
                            ? 'bg-primary text-white'
                            : ''
                        : router.currentRoute.value.name === item.name
                            ? 'bg-primary text-white'
                            : '', (item.children.length > 0 && sidebar.isShow == true) ? 'rounded-bl-none' : 'rounded-bl'
                    ]">
                    <div class="flex flex-row items-center w-full justify-between transition-all">
                        <div class=" flex flex-row gap-x-3">
                            <component :is="item.icon" />
                            <span class="text-nowrap">{{ t("sidebar."+item.label) }}</span>
                        </div>
                        <span v-if="showSidebarNotification(item)"
                            class="bg-orange-600 rounded-full text-xs absolute top-0 left-6 flex flex-row items-center justify-center text-white w-4 h-4">
                            {{
                                item.children.length ?
                                    item.children.reduce(
                                        (total, itemChild) =>
                                            total + sidebar_notification.getCount(
                                                itemChild.name as keyof SidebarCountsType
                                            )
                                        , 0
                                    ) > 0 ? item.children.reduce(
                                        (total, itemChild) =>
                                            total + sidebar_notification.getCount(
                                                itemChild.name as keyof SidebarCountsType
                                            )
                                        , 0
                                    ) : "" :
                                    sidebar_notification.getCount(
                                        item.name as keyof SidebarCountsType
                                    )
                            }}</span>
                    </div>

                    <template v-if="item.children.length > 0 && sidebar.isShow">
                        <button>
                            <ChevronDown v-if="item.isOpen == false" />
                            <ChevronUp v-if="item.isOpen == true" />
                        </button>
                    </template>
                </div>
                <transition name="child">
                    <template v-if="item.children && item.isOpen && sidebar.isShow">
                        <div class=" w-full  " :class="'bg-gray-200/5 '">
                            <div v-for="(itemChild, indexChild) in item?.children" :key="indexChild" @click="router.push({
                                name: itemChild.name
                            })" class="h-10 p-2 flex flex-row items-center justify-between"
                                :class="router.currentRoute.value.name == itemChild.name ? 'bg-primary/10 border-l-4 border-primary' : ''">
                                <span class="pl-5 text-nowrap">{{ t("sidebar."+itemChild.label) }}</span>
                                <span
                                    v-if="sidebar_notification.getCount(itemChild.name as keyof SidebarCountsType) > 0"
                                    class="bg-orange-600 rounded-full text-xs flex flex-row items-center justify-center text-white w-4 h-4">{{
                                        sidebar_notification.getCount(itemChild.name as keyof SidebarCountsType) }}</span>
                            </div>
                        </div>
                    </template>
                </transition>
            </div>

        </div>
        <div class="   flex flex-col items-center justify-center gap-y-4">

            <button class="w-full flex flex-row items-center  rounded  gap-x-4 p-2 ">
                <HelpCircleIcon :size="25" class="min-w-6.25" />
                <span class="text-nowrap ">{{ t('help center') }}</span>
            </button>
            <button @click="logout_modal = true"
                class="w-full flex flex-row items-center  rounded border border-orange-600 gap-x-4 p-2  bg-orange-600/10 text-orange-600">
                <LogOutIcon :size="25" class="min-w-6.25" />
                <span class="text-nowrap ">{{ t('logout') }}</span>
            </button>
        </div>
        <CenterModal :is-open="logout_modal" :title="t('confirm logout')" @close="logout_modal = false">
            <p class="w-100">
                {{ t('logout message') }}
                <br><br>
                {{ t('logout warning') }}
            </p>
        </CenterModal>
    </div>
</template>
<script setup lang="ts">
    import { sidebar_routes as route_data } from '../../@data/sidebar.data';
    import { ChevronDown, ChevronUp, HelpCircleIcon, LogOutIcon } from '@lucide/vue';
    import { ref } from 'vue';

    import { router } from '../../router';
    import { useSidebarStore } from '../../services/useSidebarStore.';
    import { useSidebarNotification, type SidebarCountsType } from '../../services/useSidebarNotification';
    const { t } = useI18n()
    import CenterModal from '../ui/centerModal.vue';
    import { useI18n } from 'vue-i18n';

    const sidebar_routes = ref([...route_data])
    const sidebar = useSidebarStore()
    const sidebar_notification = useSidebarNotification()
    const logout_modal = ref(false)

    function toggleMenu(item: any) {
        if (item.children.length) {
            item.isOpen = !item.isOpen

        } else {
            router.push({
                name: item.name
            })
        }
    }
    function hide() {
        sidebar.toggle(false)
        sidebar_routes.value.filter((itemFilter, indexFilter) => itemFilter.children.length > 0 && indexFilter != sidebar.getLastIndex).forEach((itemEach) => itemEach.isOpen = false)

    }
    function showSidebarNotification(item: any) {
        return item.children.length && (item.isOpen == false || sidebar.isShow == false) ?
            item.children.reduce(
                (total: number, itemChild: any) =>
                    total + sidebar_notification.getCount(
                        itemChild.name as keyof SidebarCountsType
                    )
                , 0
            ) > 0 :
            sidebar_notification.getCount(
                item.name as keyof SidebarCountsType
            ) > 0
    }
</script>
<style scoped>
.child-enter-active,
.child-leave-active {
    overflow: hidden;
    transition:
        max-height 0.3s ease,
        opacity 0.3s ease;
}

.child-enter-from,
.child-leave-to {
    max-height: 0;
    opacity: 0;
}

.child-enter-to,
.child-leave-from {
    max-height: 500px;
    opacity: 1;
}
</style>