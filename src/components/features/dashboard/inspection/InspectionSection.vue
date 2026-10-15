<template>
    <div class="flex flex-col gap-y-4 p-4">
        <!-- GRAPH EVOLUTION DES INSPECTIONS -->
        <div class="bg-white rounded-xl border border-gray-200 p-5 shadow-xs flex flex-col">
            <div class="flex items-center justify-between mb-2">
                <div>
                    <h3 class="font-bold text-gray-800 text-base">Évolution des inspections</h3>
                    <p class="text-xs text-gray-500">Comparatif des inspections programmées vs réalisées par mois</p>
                </div>
                <div v-if="loading" class="flex items-center text-xs text-primary gap-1">
                    <Loader2 class="animate-spin" :size="14" />
                    Chargement...
                </div>
            </div>
            <apexchart type="area" height="320" :options="options" :series="series"></apexchart>
        </div>

        <!-- KPI CARDS -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <Card
                title="Inspections réalisées"
                theme="green"
                :value="String(kpis.completed)"
                :icon="ClipboardCheck"
            />
            <Card
                title="Inspections en retard"
                theme="blue"
                :value="String(kpis.delayed)"
                :icon="ClockAlert"
            />
            <Card
                title="Taux de conformité moyen"
                theme="red"
                :value="kpis.avg_conformity + '%'"
                :icon="ShieldCheck"
            />
            <Card
                title="Non-conformités détectées"
                theme="cyan"
                :value="String(kpis.non_conformities)"
                :icon="TriangleAlert"
            />
        </div>

        <!-- CONFORMITÉ PAR CATÉGORIE & CARTE -->
        <div class="grid grid-cols-1 lg:grid-cols-6 gap-4">
            <div class="lg:col-span-4 bg-white rounded-xl border border-gray-200 p-5 shadow-xs h-fit">
                <div class="mb-2">
                    <h3 class="font-bold text-gray-800 text-sm">Conformité par catégorie</h3>
                    <p class="text-xs text-gray-500">Pourcentage de critères conformes relevés lors des contrôles</p>
                </div>
                <apexchart type="bar" height="280" :options="optionsConf" :series="seriesConf"></apexchart>
            </div>
            <div class="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-5 shadow-xs flex flex-col justify-between">
                <div>
                    <h3 class="font-bold text-gray-800 text-sm mb-1">Localisation des inspections</h3>
                    <p class="text-xs text-gray-500 mb-3">Couverture géographique des sites audités</p>
                    <Map />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import Map from '../map/Map.vue';
import Card from '../Card.vue';
import { ClipboardCheck, ClockAlert, ShieldCheck, TriangleAlert, Loader2 } from '@lucide/vue';
import dashboardService from '../../../../core/services/dashboard.service';

const loading = ref(true);

const kpis = ref({
    total: 0,
    completed: 0,
    delayed: 0,
    avg_conformity: 0,
    non_conformities: 0,
});

const series = ref<any[]>([
    { name: 'Inspections prévues', data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
    { name: 'Inspections réalisées', data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
]);

const options = ref({
    chart: { type: 'area', toolbar: { show: false }, fontFamily: 'inherit' },
    stroke: { curve: 'smooth', width: 2 },
    xaxis: { categories: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sept', 'Oct', 'Nov', 'Déc'] },
    colors: ['#64748B', '#10B981'],
    dataLabels: { enabled: false },
    grid: { borderColor: '#f1f5f9' },
});

const seriesConf = ref<any[]>([
    { name: 'Conformité par catégorie (%)', data: [85, 92, 78, 88] },
]);

const optionsConf = ref({
    chart: { type: 'bar', toolbar: { show: false }, fontFamily: 'inherit' },
    plotOptions: {
        bar: { borderRadius: 6, columnWidth: '40%', distributed: true }
    },
    colors: ['#0F9D58', '#3B82F6', '#F59E0B', '#6366F1', '#EC4899'],
    legend: { show: false },
    xaxis: { categories: ['Sécurité', 'Santé', 'Environnement', 'Qualité'] },
    yaxis: { max: 100 },
    grid: { borderColor: '#f1f5f9' },
});

async function loadData() {
    loading.value = true;
    try {
        const res = await dashboardService.getInspectionKPIs();
        if (res?.data) {
            if (res.data.kpis) kpis.value = res.data.kpis;
            if (res.data.evolution) {
                series.value = res.data.evolution.series;
                options.value = {
                    ...options.value,
                    xaxis: { categories: res.data.evolution.categories }
                };
            }
            if (res.data.categories_compliance) {
                seriesConf.value = res.data.categories_compliance.series;
                optionsConf.value = {
                    ...optionsConf.value,
                    xaxis: { categories: res.data.categories_compliance.categories }
                };
            }
        }
    } catch (e) {
        console.error('Erreur chargement dashboard inspection:', e);
    } finally {
        loading.value = false;
    }
}

onMounted(() => {
    loadData();
});
</script>