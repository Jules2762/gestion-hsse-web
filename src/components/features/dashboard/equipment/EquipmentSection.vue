<template>
    <div class="flex flex-col gap-y-4 p-4">
        <!-- CARTES KPI DYNAMIQUES -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <Card
                title="Fiches d'inspection"
                theme="green"
                :value="String(kpis.total_records)"
                :icon="ClipboardCheck"
                :loading="loading"
            />
            <Card
                title="Total extincteurs"
                theme="red"
                :value="String(kpis.total_extincteurs)"
                :icon="Flame"
                :loading="loading"
            />
            <Card
                title="Bacs de rétention"
                theme="cyan"
                :value="String(kpis.total_bacs)"
                :icon="ShieldCheck"
                :loading="loading"
            />
            <Card
                title="Sites contrôlés"
                theme="orange"
                :value="String(kpis.unique_sites)"
                :icon="Building2"
                :loading="loading"
            />
        </div>

        <!-- GRAPHIQUE PERFORMANCE & INVENTAIRE MATÉRIEL -->
        <div class="bg-white rounded-xl border border-gray-200 p-5 shadow-xs">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div>
                    <h3 class="font-bold text-gray-800 text-base">Performance & Suivi du parc matériel</h3>
                    <p class="text-xs text-gray-500">
                        {{ chartMode === 'monthly' ? "Évolution mensuelle des contrôles et conformité sur l'année" : "Inventaire détaillé par calibre et type de protection incendie" }}
                    </p>
                </div>

                <div class="flex flex-wrap items-center gap-2 shrink-0">
                    <!-- Sélecteur de vue (Évolution mensuelle / Inventaire) -->
                    <div class="inline-flex rounded-lg border border-gray-200 bg-gray-50 p-0.5 text-xs">
                        <button
                            type="button"
                            @click="chartMode = 'monthly'"
                            class="flex items-center gap-1 px-2.5 py-1 rounded-md font-medium transition cursor-pointer select-none"
                            :class="chartMode === 'monthly' ? 'bg-white text-gray-800 shadow-2xs font-semibold' : 'text-gray-500 hover:text-gray-800'"
                        >
                            <TrendingUp :size="13" />
                            <span>Évolution</span>
                        </button>
                        <button
                            type="button"
                            @click="chartMode = 'inventory'"
                            class="flex items-center gap-1 px-2.5 py-1 rounded-md font-medium transition cursor-pointer select-none"
                            :class="chartMode === 'inventory' ? 'bg-white text-gray-800 shadow-2xs font-semibold' : 'text-gray-500 hover:text-gray-800'"
                        >
                            <BarChart3 :size="13" />
                            <span>Calibres</span>
                        </button>
                    </div>

                    <!-- Sélecteur d'année identique au dashboard général -->
                    <div ref="yearDropdownRef" class="relative inline-flex items-center justify-center">
                        <button
                            type="button"
                            @click="toggleYearDropdown"
                            class="inline-flex items-center justify-center gap-1.5 bg-gray-50 hover:bg-gray-100 active:bg-gray-200/70 border border-gray-200 rounded-lg px-2.5 py-1 text-xs text-gray-700 shadow-2xs transition-all cursor-pointer select-none"
                            :class="{ 'ring-2 ring-primary/20 border-primary': isYearDropdownOpen }"
                            title="Sélectionner l'année"
                        >
                            <Calendar :size="14" class="text-gray-400 shrink-0" />
                            <span class="text-xs font-medium text-gray-500">Année :</span>
                            <span class="text-xs font-bold text-gray-800">{{ selectedYear }}</span>
                            <ChevronDown
                                :size="13"
                                class="text-gray-500 transition-transform duration-200 shrink-0"
                                :class="{ 'rotate-180': isYearDropdownOpen }"
                            />
                        </button>

                        <!-- Menu déroulant centré avec liste des années -->
                        <div
                            v-if="isYearDropdownOpen"
                            class="absolute right-0 sm:left-1/2 sm:-translate-x-1/2 top-full mt-1.5 z-30 min-w-[120px] bg-white border border-gray-200 rounded-xl shadow-lg py-1 overflow-hidden"
                        >
                            <button
                                v-for="y in years"
                                :key="y"
                                type="button"
                                @click="selectYear(y)"
                                class="w-full px-3 py-1.5 text-xs font-semibold text-center transition flex items-center justify-center gap-2 hover:bg-emerald-50 hover:text-emerald-700 cursor-pointer"
                                :class="selectedYear === y ? 'bg-emerald-50 text-emerald-700 font-bold' : 'text-gray-700'"
                            >
                                <span>{{ y }}</span>
                                <Check v-if="selectedYear === y" :size="13" class="text-emerald-600 shrink-0" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <DashboardSkeleton v-if="loading" type="chart" :height="320" />
            <div v-else>
                <!-- VUE 1 : GRAPHIQUE ÉVOLUTION MENSUELLE TYPE DASHBOARD GÉNÉRAL -->
                <apexchart
                    v-if="chartMode === 'monthly'"
                    type="area"
                    height="320"
                    :options="monthlyOptions"
                    :series="monthlySeries"
                />

                <!-- VUE 2 : GRAPHIQUE CALIBRES EXTINCTEURS -->
                <apexchart
                    v-else
                    type="bar"
                    height="320"
                    :options="barOptions"
                    :series="barSeries"
                />
            </div>
        </div>

        <!-- SYNTHÈSE DES ÉQUIPEMENTS & RÉSEAU -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <!-- TABLEAU RÉCAPITULATIF MATÉRIELS -->
            <div class="lg:col-span-7 bg-white rounded-xl border border-gray-200 p-5 shadow-xs flex flex-col justify-between">
                <div>
                    <div class="flex items-center justify-between pb-3 border-b border-gray-100 mb-3">
                        <div>
                            <h3 class="font-bold text-gray-800 text-sm">Synthèse des équipements en parc</h3>
                            <p class="text-xs text-gray-500">Volumes cumulés sur le réseau pour l'année {{ selectedYear }}</p>
                        </div>
                        <button
                            @click="router.push({ name: 'EQUIPMENT_MONITORING' })"
                            class="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline cursor-pointer"
                        >
                            Gérer le parc <ArrowUpRight :size="13" />
                        </button>
                    </div>

                    <DashboardSkeleton v-if="loading" type="table" :rows="6" />
                    <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <div class="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                            <span class="font-medium text-gray-700">Poudre 50 kg (P50)</span>
                            <span class="font-bold text-gray-900 bg-white px-2 py-0.5 rounded border border-gray-200">{{ details.p50 || 0 }}</span>
                        </div>
                        <div class="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                            <span class="font-medium text-gray-700">Poudre 9 kg (P9)</span>
                            <span class="font-bold text-gray-900 bg-white px-2 py-0.5 rounded border border-gray-200">{{ details.p9 || 0 }}</span>
                        </div>
                        <div class="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                            <span class="font-medium text-gray-700">Poudre 6 kg (P6)</span>
                            <span class="font-bold text-gray-900 bg-white px-2 py-0.5 rounded border border-gray-200">{{ details.p6 || 0 }}</span>
                        </div>
                        <div class="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                            <span class="font-medium text-gray-700">Dioxyde de carbone (CO2)</span>
                            <span class="font-bold text-gray-900 bg-white px-2 py-0.5 rounded border border-gray-200">{{ details.co2 || 0 }}</span>
                        </div>
                        <div class="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                            <span class="font-medium text-gray-700">Bacs métalliques</span>
                            <span class="font-bold text-gray-900 bg-white px-2 py-0.5 rounded border border-gray-200">{{ details.bas_met || 0 }}</span>
                        </div>
                        <div class="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                            <span class="font-medium text-gray-700">Bacs plastiques & rétentions</span>
                            <span class="font-bold text-gray-900 bg-white px-2 py-0.5 rounded border border-gray-200">{{ (details.bas_plast || 0) + (details.bac_retention || 0) }}</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- CARTE RÉCAPITULATIVE RAPIDE -->
            <div class="lg:col-span-5 bg-white rounded-xl border border-gray-200 p-5 shadow-xs flex flex-col justify-between">
                <div>
                    <h3 class="font-bold text-gray-800 text-sm mb-1">Indicateurs de couverture</h3>
                    <p class="text-xs text-gray-500 mb-3">Taux de couverture et conformité annuelle</p>

                    <div class="space-y-3 text-xs">
                        <div class="p-3 rounded-lg bg-emerald-50 border border-emerald-100">
                            <div class="flex items-center justify-between">
                                <span class="font-semibold text-emerald-800">Taux moyen de conformité</span>
                                <span class="font-bold text-sm text-emerald-700">{{ avgConformity }}%</span>
                            </div>
                            <div class="mt-2 w-full bg-emerald-200/50 rounded-full h-2 overflow-hidden">
                                <div class="bg-emerald-600 h-2 rounded-full transition-all duration-500" :style="{ width: `${avgConformity}%` }"></div>
                            </div>
                        </div>

                        <div class="p-3 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
                            <div>
                                <p class="font-semibold text-gray-800">Stations audités en {{ selectedYear }}</p>
                                <p class="text-[11px] text-gray-500">{{ kpis.unique_sites }} stations contrôlées</p>
                            </div>
                            <span class="font-bold text-lg text-primary">{{ kpis.unique_sites }}</span>
                        </div>

                        <div class="p-3 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
                            <div>
                                <p class="font-semibold text-gray-800">Contrôles enregistrés</p>
                                <p class="text-[11px] text-gray-500">Total des fiches sur l'année</p>
                            </div>
                            <span class="font-bold text-lg text-gray-900">{{ kpis.total_records }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- CARTOGRAPHIE DES ÉQUIPEMENTS PAR STATION (ZONE GPS) -->
        <EquipmentMap :year="selectedYear" />
    </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import Card from '../Card.vue';
import DashboardSkeleton from '../DashboardSkeleton.vue';
import EquipmentMap from './EquipmentMap.vue';
import {
    ClipboardCheck,
    Flame,
    ShieldCheck,
    Building2,
    ArrowUpRight,
    Calendar,
    ChevronDown,
    Check,
    TrendingUp,
    BarChart3
} from '@lucide/vue';
import dashboardService from '../../../../core/services/dashboard.service';

const router = useRouter();
const loading = ref(true);

const selectedYear = ref(new Date().getFullYear());
const chartMode = ref<'monthly' | 'inventory'>('monthly');

const years = computed(() => {
    const current = new Date().getFullYear();
    return Array.from({ length: 6 }, (_, i) => current - i);
});

const isYearDropdownOpen = ref(false);
const yearDropdownRef = ref<HTMLElement | null>(null);

function toggleYearDropdown() {
    isYearDropdownOpen.value = !isYearDropdownOpen.value;
}

function selectYear(y: number) {
    selectedYear.value = y;
    isYearDropdownOpen.value = false;
}

function handleYearClickOutside(event: MouseEvent) {
    if (yearDropdownRef.value && !yearDropdownRef.value.contains(event.target as Node)) {
        isYearDropdownOpen.value = false;
    }
}

const kpis = ref({
    total_records: 0,
    total_extincteurs: 0,
    total_bacs: 0,
    unique_sites: 0,
});

const details = ref<Record<string, number>>({});

const monthlySeries = ref<any[]>([
    { name: 'Contrôles réalisés', data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
    { name: 'Taux de conformité moyen (%)', data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] }
]);

const monthlyOptions = ref({
    chart: { type: 'area', toolbar: { show: false }, fontFamily: 'inherit' },
    stroke: { curve: 'smooth', width: 2 },
    xaxis: { categories: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sept', 'Oct', 'Nov', 'Déc'] },
    colors: ['#3B82F6', '#10B981'],
    dataLabels: { enabled: false },
    grid: { borderColor: '#f1f5f9' },
});

const barSeries = ref<any[]>([
    { name: 'Unités sous surveillance', data: [0, 0, 0, 0] }
]);

const barOptions = ref({
    chart: { type: 'bar', toolbar: { show: false }, fontFamily: 'inherit' },
    plotOptions: {
        bar: { borderRadius: 6, columnWidth: '45%', distributed: true }
    },
    colors: ['#EF4444', '#F97316', '#F59E0B', '#3B82F6'],
    legend: { show: false },
    xaxis: { categories: ['P50 (50kg)', 'P9 (9kg)', 'P6 (6kg)', 'CO2 (Carbone)'] },
    grid: { borderColor: '#f1f5f9' },
});

const avgConformity = computed(() => {
    const confData = monthlySeries.value.find(s => s.name?.includes('conformité'))?.data || [];
    const valid = confData.filter((v: number) => v > 0);
    if (!valid.length) return 100;
    const sum = valid.reduce((acc: number, cur: number) => acc + cur, 0);
    return Math.round(sum / valid.length);
});

async function loadData(year: number) {
    loading.value = true;
    try {
        const res = await dashboardService.getEquipmentKPIs({ year });
        if (res?.data?.kpis) {
            kpis.value = res.data.kpis;
            if (res.data.kpis.details) {
                details.value = res.data.kpis.details;
                barSeries.value = [
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
        if (res?.data?.monthly) {
            monthlySeries.value = res.data.monthly.series;
            if (res.data.monthly.categories) {
                monthlyOptions.value = {
                    ...monthlyOptions.value,
                    xaxis: { categories: res.data.monthly.categories }
                };
            }
        }
    } catch (e) {
        console.error('Erreur chargement dashboard matériel:', e);
    } finally {
        loading.value = false;
    }
}

watch(selectedYear, (newYear) => {
    loadData(newYear);
});

onMounted(() => {
    loadData(selectedYear.value);
    document.addEventListener('mousedown', handleYearClickOutside);
});

onBeforeUnmount(() => {
    document.removeEventListener('mousedown', handleYearClickOutside);
});
</script>
