<template>
    <div class="flex w-full flex-col">
        <Header title="dashboard" v-model="search" />
        <TabUI v-model="tab_index" :tab-data="tab_data" />

        <!-- Pas de KeepAlive : ApexCharts mesure son conteneur au montage, un graphique
         réactivé après avoir été masqué reste vide. On remonte la section à chaque onglet. -->
        <component :is="sections[tab_index]" :key="tab_index" />
    </div>
</template>

<script setup lang="ts">
    import { ref, onMounted, watch } from 'vue'
    import { useRoute } from 'vue-router'
    import Header from '../../components/shared/Header.vue'
    import TabUI from '../../components/ui/TabUI.vue'
    import GeneralSection from '../../components/features/dashboard/général/GeneralSection.vue'
    import PlanFormationSection from '../../components/features/dashboard/plan-de-formation/PlanFormationSection.vue'
    import InspectionSection from '../../components/features/dashboard/inspection/InspectionSection.vue'
    import EquipmentSection from '../../components/features/dashboard/equipment/EquipmentSection.vue'
    import VmcSection from '../../components/features/dashboard/vmc/VmcSection.vue'
    import AdminSection from '../../components/features/dashboard/administration/AdminSection.vue'

    const route = useRoute()
    const search = ref('')
    const tab_index = ref(0)

    /* Un seul tableau pour les libellés et les composants : même ordre, une seule source de vérité */
    const tabs = [
        { key: 'general', label: 'dashboard.tabs.general', component: GeneralSection },
        { key: 'admin', label: 'dashboard.tabs.administration', component: AdminSection },
        { key: 'training-plan', label: 'dashboard.tabs.training plan', component: PlanFormationSection },
        { key: 'equipment', label: 'Suivi matériels', component: EquipmentSection },
        { key: 'checklist', label: 'Checklist', component: InspectionSection },
        { key: 'vmc', label: 'VMC', component: VmcSection },
    ]

    const tab_data = tabs.map((tab) => tab.label)
    const sections = tabs.map((tab) => tab.component)

    function syncTabFromQuery() {
        const queryTab = route.query.tab as string
        if (queryTab) {
            const foundIndex = tabs.findIndex(t => t.key === queryTab)
            if (foundIndex !== -1) {
                tab_index.value = foundIndex
            }
        }
    }

    onMounted(syncTabFromQuery)
    watch(() => route.query.tab, syncTabFromQuery)
</script>