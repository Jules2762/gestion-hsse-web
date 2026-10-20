<template>
    <div class="flex flex-col gap-y-4 p-4">
        <!-- GRAPH EVOLUTION DES INSPECTIONS -->
        <div class="bg-white rounded-xl border border-gray-200 p-5 shadow-xs flex flex-col">
            <div class="mb-2">
                <h3 class="font-bold text-gray-800 text-base">Évolution des inspections</h3>
                <p class="text-xs text-gray-500">Comparatif des inspections programmées vs réalisées par mois</p>
            </div>
            <DashboardSkeleton v-if="loading" type="chart" :height="320" />
            <apexchart v-else type="area" height="320" :options="options" :series="series"></apexchart>
        </div>

        <!-- KPI CARDS -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <Card
                title="Inspections réalisées"
                theme="green"
                :value="String(kpis.completed)"
                :icon="ClipboardCheck"
                :loading="loading"
            />
            <Card
                title="Inspections en retard"
                theme="blue"
                :value="String(kpis.delayed)"
                :icon="ClockAlert"
                :loading="loading"
            />
            <Card
                title="Taux de conformité moyen"
                theme="red"
                :value="kpis.avg_conformity + '%'"
                :icon="ShieldCheck"
                :loading="loading"
            />
            <Card
                title="Non-conformités détectées"
                theme="cyan"
                :value="String(kpis.non_conformities)"
                :icon="TriangleAlert"
                :loading="loading"
            />
        </div>

        <!-- CONFORMITÉ PAR CATÉGORIE -->
        <div class="bg-white rounded-xl border border-gray-200 p-5 shadow-xs">
            <div class="mb-2">
                <h3 class="font-bold text-gray-800 text-sm">Conformité par catégorie</h3>
                <p class="text-xs text-gray-500">Pourcentage de critères conformes relevés lors des contrôles</p>
            </div>
            <DashboardSkeleton v-if="loading" type="chart" :height="280" />
            <apexchart v-else type="bar" height="280" :options="optionsConf" :series="seriesConf"></apexchart>
        </div>

        <!-- CARTOGRAPHIE DES INSPECTIONS & CHECKLISTS -->
        <Map />
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import Map from '../map/Map.vue';
import Card from '../Card.vue';
import DashboardSkeleton from '../DashboardSkeleton.vue';
import { ClipboardCheck, ClockAlert, ShieldCheck, TriangleAlert } from '@lucide/vue';
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
        bar: {
            borderRadius: 6,
            columnWidth: '42%',
            distributed: true
        }
    },
    colors: ['#0F9D58', '#3B82F6', '#F59E0B', '#6366F1', '#EC4899', '#06B6D4', '#8B5CF6'],
    legend: { show: false },
    dataLabels: {
        enabled: true,
        formatter: (val: number) => `${val}%`,
        style: {
            fontSize: '12px',
            fontWeight: 'bold',
            colors: ['#FFFFFF']
        }
    },
    xaxis: {
        categories: ['Sécurité', 'Santé', 'Environnement', 'Qualité'],
        labels: {
            show: true,
            rotate: 0,
            rotateAlways: false,
            hideOverlappingLabels: false,
            trim: false,
            style: {
                fontSize: '11px',
                fontWeight: 600,
                colors: ['#475569', '#475569', '#475569', '#475569', '#475569', '#475569']
            }
        },
        axisBorder: { show: false },
        axisTicks: { show: false }
    },
    yaxis: {
        max: 100,
        labels: {
            formatter: (val: number) => `${val}%`,
            style: {
                fontSize: '11px',
                colors: ['#94A3B8']
            }
        }
    },
    tooltip: {
        y: {
            formatter: (val: number) => `${val}% de conformité`,
        }
    },
    grid: { borderColor: '#f1f5f9' },
});

function formatCategoryLabel(label: string): string | string[] {
    const map: Record<string, string[]> = {
        'CHECKLIST HSSE SURETE': ['Checklist HSSE', 'Sûreté'],
        'Checklist HSSE Sûreté': ['Checklist HSSE', 'Sûreté'],
        "FICHE D'INSPECTION DE CAMION CITERNE": ['Inspection', 'Camion Citerne'],
        "Inspection Camion Citerne": ['Inspection', 'Camion Citerne'],
        'INSPECTION DES VEHICULES': ['Inspection', 'Véhicules'],
        'Inspection Véhicules': ['Inspection', 'Véhicules'],
        'CHECKLIST EVALUATION RESEAU STATION SERVICE': ['Évaluation Réseau', 'Station-Service'],
        'Évaluation Réseau Stations': ['Évaluation Réseau', 'Station-Service'],
        'CHECKLIST EVALUATION DES AGENCES ET MAGASIN': ['Évaluation', 'Agences & Magasins'],
        'Évaluation Agences & Magasins': ['Évaluation', 'Agences & Magasins'],
        'CHECKLIST EVALUATION CONSO': ['Évaluation', 'Conso'],
        'Évaluation Conso': ['Évaluation', 'Conso'],
    };

    if (map[label]) return map[label];

    if (label.length > 18) {
        const words = label.split(' ');
        const mid = Math.ceil(words.length / 2);
        return [words.slice(0, mid).join(' '), words.slice(mid).join(' ')];
    }
    return label;
}

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
                const formattedCats = (res.data.categories_compliance.categories || []).map((c: string) => formatCategoryLabel(c));
                optionsConf.value = {
                    ...optionsConf.value,
                    xaxis: {
                        ...optionsConf.value.xaxis,
                        categories: formattedCats
                    }
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