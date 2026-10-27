<template>
    <div class="flex flex-col gap-y-4 p-4">
        <!-- GRAPH EVOLUTION DES INSPECTIONS -->
        <div class="bg-white rounded-xl border border-gray-200 p-5 shadow-xs flex flex-col">
            <div class="mb-2">
                <h3 class="font-bold text-gray-800 text-base">
                    {{ locale === 'en' ? 'Evolution of inspections' : 'Évolution des inspections' }}
                </h3>
                <p class="text-xs text-gray-500">
                    {{ locale === 'en' ? 'Comparison of scheduled vs completed inspections by month' : 'Comparatif des inspections programmées vs réalisées par mois' }}
                </p>
            </div>
            <DashboardSkeleton v-if="loading" type="chart" :height="320" />
            <apexchart v-else type="area" height="320" :options="chartOptions" :series="chartSeries"></apexchart>
        </div>

        <!-- KPI CARDS -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <Card
                :title="locale === 'en' ? 'Completed Inspections' : 'Inspections réalisées'"
                theme="green"
                :value="String(kpis.completed)"
                :icon="ClipboardCheck"
                :loading="loading"
            />
            <Card
                :title="locale === 'en' ? 'Delayed Inspections' : 'Inspections en retard'"
                theme="blue"
                :value="String(kpis.delayed)"
                :icon="ClockAlert"
                :loading="loading"
            />
            <Card
                :title="locale === 'en' ? 'Average Compliance Rate' : 'Taux de conformité moyen'"
                theme="red"
                :value="kpis.avg_conformity + '%'"
                :icon="ShieldCheck"
                :loading="loading"
            />
            <Card
                :title="locale === 'en' ? 'Detected Non-conformities' : 'Non-conformités détectées'"
                theme="cyan"
                :value="String(kpis.non_conformities)"
                :icon="TriangleAlert"
                :loading="loading"
            />
        </div>

        <!-- CONFORMITÉ PAR CATÉGORIE -->
        <div class="bg-white rounded-xl border border-gray-200 p-5 shadow-xs">
            <div class="mb-2">
                <h3 class="font-bold text-gray-800 text-sm">
                    {{ locale === 'en' ? 'Compliance by category' : 'Conformité par catégorie' }}
                </h3>
                <p class="text-xs text-gray-500">
                    {{ locale === 'en' ? 'Percentage of compliant criteria identified during audits' : 'Pourcentage de critères conformes relevés lors des contrôles' }}
                </p>
            </div>
            <DashboardSkeleton v-if="loading" type="chart" :height="280" />
            <apexchart v-else type="bar" height="280" :options="chartOptionsConf" :series="chartSeriesConf"></apexchart>
        </div>

        <!-- CARTOGRAPHIE DES INSPECTIONS & CHECKLISTS -->
        <Map />
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import Map from '../map/Map.vue';
import Card from '../Card.vue';
import DashboardSkeleton from '../DashboardSkeleton.vue';
import { ClipboardCheck, ClockAlert, ShieldCheck, TriangleAlert } from '@lucide/vue';
import dashboardService from '../../../../core/services/dashboard.service';

const { locale } = useI18n();

const loading = ref(true);

const kpis = ref({
    total: 0,
    completed: 0,
    delayed: 0,
    avg_conformity: 0,
    non_conformities: 0,
});

const rawSeries = ref<any[]>([
    { name: 'Inspections prévues', data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
    { name: 'Inspections réalisées', data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
]);

const serverEvolutionCategories = ref<string[]>([]);
const serverComplianceCategories = ref<string[]>([]);

const defaultMonths = computed(() =>
    locale.value === 'en'
        ? ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        : ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sept', 'Oct', 'Nov', 'Déc']
);

const chartSeries = computed(() => {
    return rawSeries.value.map(s => {
        let name = s.name;
        if (s.name === 'Inspections prévues') {
            name = locale.value === 'en' ? 'Scheduled inspections' : 'Inspections prévues';
        } else if (s.name === 'Inspections réalisées') {
            name = locale.value === 'en' ? 'Completed inspections' : 'Inspections réalisées';
        }
        return { ...s, name };
    });
});

const chartOptions = computed(() => ({
    chart: { type: 'area', toolbar: { show: false }, fontFamily: 'inherit' },
    stroke: { curve: 'smooth', width: 2 },
    xaxis: { categories: serverEvolutionCategories.value.length ? serverEvolutionCategories.value : defaultMonths.value },
    colors: ['#64748B', '#10B981'],
    dataLabels: { enabled: false },
    grid: { borderColor: '#f1f5f9' },
}));

const rawSeriesConf = ref<any[]>([
    { name: 'Conformité par catégorie (%)', data: [85, 92, 78, 88] },
]);

const chartSeriesConf = computed(() => {
    return rawSeriesConf.value.map(s => ({
        ...s,
        name: locale.value === 'en' ? 'Compliance by category (%)' : 'Conformité par catégorie (%)'
    }));
});

function formatCategoryLabel(label: string): string | string[] {
    const isEn = locale.value === 'en';
    const map: Record<string, string[]> = {
        'CHECKLIST HSSE SURETE': isEn ? ['HSSE Checklist', 'Security'] : ['Checklist HSSE', 'Sûreté'],
        'Checklist HSSE Sûreté': isEn ? ['HSSE Checklist', 'Security'] : ['Checklist HSSE', 'Sûreté'],
        "FICHE D'INSPECTION DE CAMION CITERNE": isEn ? ['Inspection', 'Tanker Truck'] : ['Inspection', 'Camion Citerne'],
        "Inspection Camion Citerne": isEn ? ['Inspection', 'Tanker Truck'] : ['Inspection', 'Camion Citerne'],
        'INSPECTION DES VEHICULES': isEn ? ['Inspection', 'Vehicles'] : ['Inspection', 'Véhicules'],
        'Inspection Véhicules': isEn ? ['Inspection', 'Vehicles'] : ['Inspection', 'Véhicules'],
        'CHECKLIST EVALUATION RESEAU STATION SERVICE': isEn ? ['Network Eval', 'Service Stations'] : ['Évaluation Réseau', 'Station-Service'],
        'Évaluation Réseau Stations': isEn ? ['Network Eval', 'Service Stations'] : ['Évaluation Réseau', 'Station-Service'],
        'CHECKLIST EVALUATION DES AGENCES ET MAGASIN': isEn ? ['Evaluation', 'Branches & Stores'] : ['Évaluation', 'Agences & Magasins'],
        'Évaluation Agences & Magasins': isEn ? ['Evaluation', 'Branches & Stores'] : ['Évaluation', 'Agences & Magasins'],
        'CHECKLIST EVALUATION CONSO': isEn ? ['Evaluation', 'Commercial'] : ['Évaluation', 'Conso'],
        'Évaluation Conso': isEn ? ['Evaluation', 'Commercial'] : ['Évaluation', 'Conso'],
    };

    if (map[label]) return map[label];

    if (label.length > 18) {
        const words = label.split(' ');
        const mid = Math.ceil(words.length / 2);
        return [words.slice(0, mid).join(' '), words.slice(mid).join(' ')];
    }
    return label;
}

const chartOptionsConf = computed(() => {
    const categories = serverComplianceCategories.value.length
        ? serverComplianceCategories.value.map(c => formatCategoryLabel(c))
        : (locale.value === 'en' ? ['Safety', 'Health', 'Environment', 'Quality'] : ['Sécurité', 'Santé', 'Environnement', 'Qualité']);

    return {
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
            categories,
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
                formatter: (val: number) => `${val}% ${locale.value === 'en' ? 'compliance' : 'de conformité'}`,
            }
        },
        grid: { borderColor: '#f1f5f9' },
    };
});

async function loadData() {
    loading.value = true;
    try {
        const res = await dashboardService.getInspectionKPIs();
        if (res?.data) {
            if (res.data.kpis) kpis.value = res.data.kpis;
            if (res.data.evolution) {
                rawSeries.value = res.data.evolution.series || [];
                serverEvolutionCategories.value = res.data.evolution.categories || [];
            }
            if (res.data.categories_compliance) {
                rawSeriesConf.value = res.data.categories_compliance.series || [];
                serverComplianceCategories.value = res.data.categories_compliance.categories || [];
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