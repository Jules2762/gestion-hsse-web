<template>

    <div class="flex min-h-screen w-full bg-primary/2">

        <!-- SIDEBAR SPACER -->
        <!-- Sidebar itself is position:fixed (see Sidebar.vue), so it doesn't take up flex space. -->
        <!-- This spacer reserves room for it so <main> content doesn't render underneath it. -->
        <div class="w-16 min-w-16 shrink-0 max-md:hidden" aria-hidden="true"></div>

        <Sidebar v-model="search" class="max-md:hidden" />
        <transition name="sidebar">
            <div class="fixed top-0 left-0 z-40 w-screen h-screen bg-black/10" v-if="sidebar.isShow"></div>
        </transition>
        <!-- CONTENT -->
        <main class="
                flex-1
                min-w-0
                min-h-screen
                transition-all
                duration-300
            ">
            <router-view />
        </main>

    </div>

</template>


<script lang="ts" setup>

    import { ref } from "vue"

    import Sidebar from "../components/shared/Sidebar.vue"
    import { useSidebarStore } from "../services/useSidebarStore..ts"

    const search = ref("")

    const sidebar = useSidebarStore()

</script>
<style scoped>
.sidebar-enter-from,.sidebar-leave-to {
    opacity: 0;
}
.sidebar-enter-active,.sidebar-leave-active {
    transition: all 0.3s ease-in-out;
}
</style>