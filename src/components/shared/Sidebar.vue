<template>
    <aside @mouseenter.self="sidebar.toggle(true)" @mouseleave.self="hide"
        class="h-screen fixed top-0 left-0 z-9999 bg-white flex flex-col overflow-y-auto overflow-x-hidden scrollbar-hide border-r border-gray-200 shadow-sm transition-[width,min-width,box-shadow] duration-300 ease-out"
        :class="sidebar.isShow ? 'w-65 min-w-65 shadow-xl' : 'w-16 min-w-16'">

        <!-- Logo -->
        <div class="flex items-center gap-x-2 h-16 px-3 shrink-0 cursor-pointer border-b border-gray-100"
            @click="router.push({ name: 'DASHBOARD' })">
            <img src="/logo/logo-galana.webp" alt="Galana" class="w-10 min-w-10 object-contain" />
            <h4 class="text-nowrap font-semibold text-gray-800 transition-opacity duration-200"
                :class="sidebar.isShow ? 'opacity-100' : 'opacity-0'">
                {{ t('sidebar.hsse management') }}
            </h4>
        </div>

        <!-- Navigation -->
        <nav class="flex flex-col gap-y-1 flex-1 px-3 py-4">
            <div v-for="(item, index) in sidebar_routes" :key="index" class="flex flex-col w-full select-none">

                <!-- Item principal -->
                <button type="button" :title="!sidebar.isShow ? t('sidebar.' + item.label) : undefined"
                    @click="toggleMenu(item); sidebar.setLastIndex(index)"
                    class="group relative flex items-center justify-between w-full h-10 px-2.5 rounded-lg text-sm font-medium transition-colors duration-150"
                    :class="isActive(item)
                        ? 'bg-primary text-white shadow-sm shadow-primary/30'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'">
                    <div class="flex items-center gap-x-3 min-w-0">
                        <component :is="item.icon" :size="20" class="shrink-0" />
                        <span class="text-nowrap truncate">{{ t('sidebar.' + item.label) }}</span>
                    </div>

                    <div class="flex items-center gap-x-2">
                        <!-- Badge notification -->
                        <span v-if="showItemBadge(item)"
                            class="flex items-center justify-center rounded-full bg-orange-600 text-white text-[10px] font-semibold leading-none ring-2 ring-white"
                            :class="sidebar.isShow
                                ? 'min-w-5 h-5 px-1'
                                : 'absolute top-0.5 right-0.5 min-w-4 h-4 px-1'">
                            {{ itemCount(item) }}
                        </span>

                        <ChevronDown v-if="item.children.length > 0 && sidebar.isShow" :size="16"
                            class="shrink-0 transition-transform duration-300"
                            :class="item.isOpen ? 'rotate-180' : ''" />
                    </div>
                </button>

                <!-- Sous-menu (animation fluide via grid-rows) -->
                <div v-if="item.children.length > 0" class="grid transition-[grid-template-rows] duration-300 ease-out"
                    :class="item.isOpen && sidebar.isShow ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'">
                    <div class="overflow-hidden">
                        <div class="ml-5 mt-1 mb-1 pl-3 border-l border-gray-200 flex flex-col gap-y-0.5">
                            <button v-for="(itemChild, indexChild) in item.children" :key="indexChild" type="button"
                                @click="router.push({ name: itemChild.name })"
                                class="flex items-center justify-between h-9 px-3 rounded-md text-sm transition-colors duration-150"
                                :class="isChildActive(itemChild)
                                    ? 'bg-primary/10 text-primary font-medium'
                                    : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'">
                                <span class="text-nowrap truncate">{{ t('sidebar.' + itemChild.label) }}</span>
                                <span v-if="childCount(itemChild) > 0"
                                    class="flex items-center justify-center min-w-5 h-5 px-1 rounded-full bg-orange-600 text-white text-[10px] font-semibold leading-none">
                                    {{ childCount(itemChild) }}
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </nav>

        <!-- Footer -->
        <div class="flex flex-col gap-y-2 px-3 py-4 border-t border-gray-100 shrink-0">
            <button type="button" :title="!sidebar.isShow ? t('help center') : undefined"
                class="w-full h-10 flex items-center gap-x-3 px-2.5 rounded-lg text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors">
                <HelpCircleIcon :size="20" class="shrink-0" />
                <span class="text-nowrap" v-if="sidebar.isShow">{{ t('help center') }}</span>
            </button>
            <button type="button" @click="logout_modal = true" :title="!sidebar.isShow ? t('logout') : undefined"
                class="w-full h-10 flex items-center gap-x-3 px-2.5 rounded-lg text-sm font-medium text-orange-600 bg-orange-600/10 hover:bg-orange-600 hover:text-white transition-colors">
                <LogOutIcon :size="20" class="shrink-0" />
                <span class="text-nowrap" v-if="sidebar.isShow">{{ t('logout') }}</span>
            </button>
        </div>

        <CenterModal :is-open="logout_modal" :title="t('confirm logout')" @close="logout_modal = false">
            <p class="w-100">
                {{ t('logout message') }}
                <br><br>
                {{ t('logout warning') }}
            </p>
        </CenterModal>
    </aside>
</template>

<script setup lang="ts">
    import { ref } from 'vue';
    import { useI18n } from 'vue-i18n';
    import { ChevronDown, HelpCircleIcon, LogOutIcon } from '@lucide/vue';

    import { sidebar_routes as route_data } from '../../@data/sidebar.data';
    import { router } from '../../router';
    import { useSidebarStore } from '../../services/useSidebarStore.';
    import { useSidebarNotification, type SidebarCountsType } from '../../services/useSidebarNotification';
    import CenterModal from '../ui/centerModal.vue';

    const { t } = useI18n()

    const sidebar_routes = ref([...route_data])
    const sidebar = useSidebarStore()
    const sidebar_notification = useSidebarNotification()
    const logout_modal = ref(false)

    const currentName = () => router.currentRoute.value.name

    const isChildActive = (child: any) => currentName() === child.name

    const isActive = (item: any) =>
        item.children.length > 0
            ? item.children.some((child: any) => child.name === currentName())
            : currentName() === item.name

    const childCount = (child: any): number =>
        sidebar_notification.getCount(child.name as keyof SidebarCountsType)

    const itemCount = (item: any): number =>
        item.children.length > 0
            ? item.children.reduce((total: number, child: any) => total + childCount(child), 0)
            : childCount(item)

    const showItemBadge = (item: any) =>
        item.children.length > 0
            ? (!item.isOpen || !sidebar.isShow) && itemCount(item) > 0
            : itemCount(item) > 0

    function toggleMenu(item: any) {
        if (item.children.length) {
            item.isOpen = !item.isOpen
        } else {
            router.push({ name: item.name })
        }
    }

    function hide() {
        sidebar.toggle(false)
        sidebar_routes.value
            .filter((item, index) => item.children.length > 0 && index != sidebar.getLastIndex)
            .forEach((item) => item.isOpen = false)
    }
</script>