<template>
    <div class="flex flex-col gap-y-4 p-4">
        <!-- KPI CARDS -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <Card
                title="Fiches d'inspection"
                theme="green"
                :value="String(kpis.total_records)"
                :icon="ClipboardCheck"
            />
            <Card
                title="Total extincteurs"
                theme="red"
                :value="String(kpis.total_extincteurs)"
                :icon="Flame"
            />
            <Card
                title="Bacs de rétention"
                theme="cyan"
                :value="String(kpis.total_bacs)"
                :icon="ShieldCheck"
            />
            <Card
                title="Sites contrôlés"
                theme="orange"
                :value="String(kpis.unique_sites)"
                :icon="Building2"
            />
        </div>

        <!-- GRAPHIQUE & DÉTAILS DU PARC MATÉRIEL -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <!-- GRAPHIQUE RÉPARTITION EXTINCTEURS -->
            <div class="lg:col-span-7 bg-white rounded-xl border border-gray-200 p-5 shadow-xs">
                <div class="flex items-center justify-between mb-4">
                    <div>
                        <h3 class="font-bold text-gray-800 text-sm">Inventaire du parc extincteurs</h3>
                        <p class="text-xs text-gray-500">Répartition par calibre et type de protection incendie</p>
                    </div>
                    <div v-if="loading" class="flex items-center text-xs text-primary gap-1">
                        <Loader2 class="animate-spin" :size="14" />
                        Chargement...
                    </div>
                </div>
                <apexchart type="bar" height="280" :options="chartOptions" :series="chartSeries"></apexchart>
            </div>

            <!-- TABLEAU RÉCAPITULATIF MATÉRIELS -->
            <div class="lg:col-span-5 bg-white rounded-xl border border-gray-200 p-5 shadow-xs flex flex-col justify-between">
                <div>
                    <div class="flex items-center justify-between pb-3 border-b border-gray-100 mb-3">
                        <div>
                            <h3 class="font-bold text-gray-800 text-sm">Synthèse des équipements</h3>
                            <p class="text-xs text-gray-500">Volumes cumulés sur le réseau</p>
                        </div>
                        <button
                            @click="router.push({ name: 'EQUIPMENT_MONITORING' })"
                            class="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                        >
                            Gérer le parc <ArrowUpRight :size="13" />
                        </button>
                    </div>

                    <div class="space-y-2.5 text-xs">
                        <div class="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                            <span class="font-medium text-gray-700">Poudre 50 kg (P50)</span>
                            <span class="font-bold text-gray-900 bg-white px-2 py-0.5 rounded border border-gray-200">{{ details.p50 || 0 }}</span>
                        </div>
                        <div class="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                            <span class="font-medium text-gray-700">Poudre 9 kg (P9)</span>
                            <span class="font-bold text-gray-900 bg-white px-2 py-0.5 rounded border border-gray-200">{{ details.p9 || 0 }}</span>
                        </div>
                        <div class="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                            <span class="font-medium text-gray-700">Poudre 6 kg (P6)</span>
                            <span class="font-bold text-gray-900 bg-white px-2 py-0.5 rounded border border-gray-200">{{ details.p6 || 0 }}</span>
                        </div>
                        <div class="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                            <span class="font-medium text-gray-700">Dioxyde de carbone (CO2)</span>
                            <span class="font-bold text-gray-900 bg-white px-2 py-0.5 rounded border border-gray-200">{{ details.co2 || 0 }}</span>
                        </div>
                        <div class="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                            <span class="font-medium text-gray-700">Bacs métalliques & égouttures</span>
                            <span class="font-bold text-gray-900 bg-white px-2 py-0.5 rounded border border-gray-200">{{ details.bas_met || 0 }}</span>
                        </div>
                        <div class="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                            <span class="font-medium text-gray-700">Bacs plastiques & rétentions</span>
                            <span class="font-bold text-gray-900 bg-white px-2 py-0.5 rounded border border-gray-200">{{ (details.bas_plast || 0) + (details.bac_retention || 0) }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import Card from '../Card.vue';
import { ClipboardCheck, Flame, ShieldCheck, Building2, Loader2, ArrowUpRight } from '@lucide/vue';
import dashboardService from '../../../../core/services/dashboard.service';

const router = useRouter();
const loading = ref(true);

const kpis = ref({
    total_records: 0,
    total_extincteurs: 0,
    total_bacs: 0,
    unique_sites: 0,
});

const details = ref<Record<string, number>>({});

const chartSeries = ref<any[]>([
    { name: 'Unités sous surveillance', data: [0, 0, 0, 0] }
]);

const chartOptions = ref({
    chart: { type: 'bar', toolbar: { show: false }, fontFamily: 'inherit' },
    plotOptions: {
        bar: { borderRadius: 6, columnWidth: '45%', distributed: true }
    },
    colors: ['#EF4444', '#F97316', '#F59E0B', '#3B82F6'],
    legend: { show: false },
    xaxis: { categories: ['P50 (50kg)', 'P9 (9kg)', 'P6 (6kg)', 'CO2 (Carbone)'] },
    grid: { borderColor: '#f1f5f9' },
});

async function loadData() {
    loading.value = true;
    try {
        const res = await dashboardService.getEquipmentKPIs();
        if (res?.data?.kpis) {
            kpis.value = res.data.kpis;
            if (res.data.kpis.details) {
                details.value = res.data.kpis.details;
                chartSeries.value = [
                    {
                        name: 'Unités sous surveillance',
                        data: [
                            details.value.p50 || 0,
                            details.value.p9 || 0,
                            details.value.p6 || 0,
                            details.value.co2 || 0,
                        ]
                    }
                ];
            }
        }
    } catch (e) {
        console.error('Erreur chargement dashboard matériel:', e);
    } finally {
        loading.value = false;
    }
}

onMounted(() => {
    loadData();
});
</script>
