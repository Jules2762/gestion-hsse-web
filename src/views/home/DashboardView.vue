<template>
    <div class="flex w-full flex-col">
        <Header title="dashboard.title" v-model="search" />
        <TabUI v-model="tab_index" :tabs="tabs" />

        <!-- Pas de KeepAlive : ApexCharts mesure son conteneur au montage, un graphique
         réactivé après avoir été masqué reste vide. On remonte la section à chaque onglet. -->
        <component :is="sections[tab_index]" :key="tab_index" />
    </div>
</template>

<script setup lang="ts">
    import { ref, onMounted, watch, computed } from 'vue'
    import { useRoute } from 'vue-router'
    import Header from '../../components/shared/Header.vue'
    import TabUI, { type TabItem } from '../../components/ui/TabUI.vue'
    import GeneralSection from '../../components/features/dashboard/général/GeneralSection.vue'
    import PlanFormationSection from '../../components/features/dashboard/plan-de-formation/PlanFormationSection.vue'
    import InspectionSection from '../../components/features/dashboard/inspection/InspectionSection.vue'
    import EquipmentSection from '../../components/features/dashboard/equipment/EquipmentSection.vue'
    import VmcSection from '../../components/features/dashboard/vmc/VmcSection.vue'
    import AdminSection from '../../components/features/dashboard/administration/AdminSection.vue'
    import {
        LayoutDashboard,
        ShieldCheck,
        GraduationCap,
        Flame,
        ClipboardCheck,
        FileCheck2
    } from '@lucide/vue'
    import { useSidebarNotification } from '../../services/useSidebarNotification'

    const route = useRoute()
    const search = ref('')
    const tab_index = ref(0)
    const sidebarStore = useSidebarNotification()

    /* Configuration des onglets avec libellés, icônes, badges réactifs et composants associés */
    const tabs = computed<TabItem[]>(() => [
        {
            key: 'general',
            label: 'dashboard.tabs.general',
            icon: LayoutDashboard,
            component: GeneralSection
        },
        {
            key: 'admin',
            label: 'dashboard.tabs.administration',
            icon: ShieldCheck,
            badge: (sidebarStore.counts.USERS || 0) + (sidebarStore.counts.ACTIVITY || 0) > 0
                ? (sidebarStore.counts.USERS || 0) + (sidebarStore.counts.ACTIVITY || 0)
                : undefined,
            component: AdminSection
        },
        {
            key: 'training-plan',
            label: 'dashboard.tabs.training plan',
            icon: GraduationCap,
            badge: (sidebarStore.counts.FORMATION || 0) > 0 ? sidebarStore.counts.FORMATION : undefined,
            component: PlanFormationSection
        },
        {
            key: 'equipment',
            label: 'dashboard.tabs.equipment',
            icon: Flame,
            badge: (sidebarStore.counts.EQUIPMENT_MONITORING || 0) > 0 ? sidebarStore.counts.EQUIPMENT_MONITORING : undefined,
            component: EquipmentSection
        },
        {
            key: 'checklist',
            label: 'dashboard.tabs.checklist',
            icon: ClipboardCheck,
            badge: (sidebarStore.counts.CHECKLIST || 0) > 0 ? sidebarStore.counts.CHECKLIST : undefined,
            component: InspectionSection
        },
        {
            key: 'vmc',
            label: 'dashboard.tabs.vmc',
            icon: FileCheck2,
            badge: (sidebarStore.counts.VMC || 0) > 0 ? sidebarStore.counts.VMC : undefined,
            component: VmcSection
        },
    ])

    const sections = computed(() => tabs.value.map((tab) => tab.component))

    function syncTabFromQuery() {
        const queryTab = route.query.tab as string
        if (queryTab) {
            const foundIndex = tabs.value.findIndex(t => t.key === queryTab)
            if (foundIndex !== -1) {
                tab_index.value = foundIndex
            }
        }
    }

    onMounted(() => {
        syncTabFromQuery()
        sidebarStore.fetchCounts()
    })
    watch(() => route.query.tab, syncTabFromQuery)
</script>
