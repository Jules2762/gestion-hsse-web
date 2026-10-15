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
    import { ref } from 'vue'
    import Header from '../../components/shared/Header.vue'
    import TabUI from '../../components/ui/TabUI.vue'
    import GeneralSection from '../../components/features/dashboard/général/GeneralSection.vue'
    import PlanFormationSection from '../../components/features/dashboard/plan-de-formation/PlanFormationSection.vue'
    import InspectionSection from '../../components/features/dashboard/inspection/InspectionSection.vue'
    import EquipmentSection from '../../components/features/dashboard/equipment/EquipmentSection.vue'
    import VmcSection from '../../components/features/dashboard/vmc/VmcSection.vue'

    const search = ref('')
    const tab_index = ref(0)

    /* Un seul tableau pour les libellés et les composants : même ordre, une seule source de vérité */
    const tabs = [
        { label: 'dashboard.tabs.general', component: GeneralSection },
        { label: 'dashboard.tabs.training plan', component: PlanFormationSection },
        { label: 'Suivi matériels', component: EquipmentSection },
        { label: 'Checklist', component: InspectionSection },
        { label: 'VMC', component: VmcSection },
    ]

    const tab_data = tabs.map((tab) => tab.label)
    const sections = tabs.map((tab) => tab.component)
</script>