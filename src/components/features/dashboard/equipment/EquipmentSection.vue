<template>
    <div class="flex flex-col gap-y-4 p-4">
        <!-- 1. CARTES KPI DYNAMIQUES (5 INDICATEURS CLÉS) -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            <Card
                title="Fiches d'inspection"
                theme="green"
                :value="String(kpis.total_records)"
                :icon="ClipboardCheck"
                :loading="loading"
            />
            <Card
                title="Taux moyen de conformité"
                theme="blue"
                :value="(kpis.avg_conformity ?? 100) + '%'"
                :icon="ShieldCheck"
                :loading="loading"
            />
            <Card
                title="Extincteurs en parc"
                theme="red"
                :value="String(kpis.total_extincteurs)"
                :icon="Flame"
                :loading="loading"
            />
            <Card
                title="Bacs & Rétention"
                theme="cyan"
                :value="String(kpis.total_bacs)"
                :icon="ShieldCheck"
                :loading="loading"
            />
            <Card
                title="Anomalies actives"
                :theme="kpis.total_anomalies > 0 ? 'orange' : 'green'"
                :value="String(kpis.total_anomalies || 0)"
                :icon="AlertTriangle"
                :loading="loading"
            />
        </div>

        <!-- 2. GRAPHIQUE PERFORMANCE & INVENTAIRE MATÉRIEL -->
        <div class="bg-white rounded-xl border border-gray-200 p-5 shadow-xs">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div>
                    <h3 class="font-bold text-gray-800 text-base">Performance & Suivi du parc matériel</h3>
                    <p class="text-xs text-gray-500">
                        {{ chartMode === 'monthly' ? "Évolution mensuelle des contrôles et taux de conformité sur l'année" : "Inventaire détaillé par calibre et type de protection incendie" }}
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

                    <!-- Sélecteur d'année -->
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
                <apexchart
                    v-if="chartMode === 'monthly'"
                    type="area"
                    height="320"
                    :options="monthlyOptions"
                    :series="monthlySeries"
                />
                <apexchart
                    v-else
                    type="bar"
                    height="320"
                    :options="barOptions"
                    :series="barSeries"
                />
            </div>
        </div>

        <!-- 3. SECTION : ÉTAT DE SANTÉ DU PARC & DÉFAILLANCES MATÉRIELLES -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <!-- REPARTITION DE CONFORMITE (DONUT) -->
            <div class="lg:col-span-5 bg-white rounded-xl border border-gray-200 p-5 shadow-xs flex flex-col justify-between">
                <div>
                    <div class="flex items-center justify-between pb-3 border-b border-gray-100 mb-3">
                        <div>
                            <h3 class="font-bold text-gray-800 text-sm">Santé globale du parc</h3>
                            <p class="text-xs text-gray-500">Statut de conformité sur les {{ statusDistribution.total_sites || kpis.unique_sites }} stations contrôlées</p>
                        </div>
                        <span class="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                            {{ selectedYear }}
                        </span>
                    </div>

                    <DashboardSkeleton v-if="loading" type="chart" :height="220" />
                    <div v-else class="flex flex-col items-center">
                        <apexchart
                            type="donut"
                            height="220"
                            class="w-full"
                            :options="donutOptions"
                            :series="donutSeries"
                        />

                        <!-- LÉGENDE RÉCAPITULATIVE AVEC PASTILLES -->
                        <div class="grid grid-cols-3 gap-2 w-full mt-3 text-center text-xs">
                            <div class="p-2 rounded-lg bg-emerald-50 border border-emerald-100">
                                <p class="text-[11px] font-semibold text-emerald-800">Conformes</p>
                                <p class="text-base font-bold text-emerald-700 mt-0.5">{{ statusDistribution.conforme || 0 }}</p>
                                <p class="text-[10px] text-emerald-600">≥ 90%</p>
                            </div>
                            <div class="p-2 rounded-lg bg-amber-50 border border-amber-100">
                                <p class="text-[11px] font-semibold text-amber-800">Contrôle req.</p>
                                <p class="text-base font-bold text-amber-700 mt-0.5">{{ statusDistribution.warning || 0 }}</p>
                                <p class="text-[10px] text-amber-600">70 - 89%</p>
                            </div>
                            <div class="p-2 rounded-lg bg-red-50 border border-red-100">
                                <p class="text-[11px] font-semibold text-red-800">Anomalies</p>
                                <p class="text-base font-bold text-red-700 mt-0.5">{{ statusDistribution.danger || 0 }}</p>
                                <p class="text-[10px] text-red-600">&lt; 70%</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- ANOMALIES & DÉFAILLANCES RÉCENTES SUR ÉQUIPEMENTS -->
            <div class="lg:col-span-7 bg-white rounded-xl border border-gray-200 p-5 shadow-xs flex flex-col justify-between">
                <div>
                    <div class="flex items-center justify-between pb-3 border-b border-gray-100 mb-3">
                        <div class="flex items-center gap-2">
                            <h3 class="font-bold text-gray-800 text-sm">Équipements nécessitant intervention</h3>
                            <span
                                v-if="recentAnomalies.length"
                                class="px-2 py-0.5 text-[10px] font-bold rounded-full bg-red-100 text-red-700 animate-pulse"
                            >
                                {{ recentAnomalies.length }} non-conformité{{ recentAnomalies.length > 1 ? 's' : '' }}
                            </span>
                        </div>
                        <button
                            @click="router.push({ name: 'EQUIPMENT_MONITORING' })"
                            class="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline cursor-pointer"
                        >
                            Tout voir <ArrowUpRight :size="13" />
                        </button>
                    </div>

                    <DashboardSkeleton v-if="loading" type="table" :rows="4" />

                    <div v-else-if="recentAnomalies.length === 0" class="py-12 flex flex-col items-center justify-center text-center gap-2 text-gray-400">
                        <CheckCircle2 :size="32" class="text-emerald-500" />
                        <p class="text-xs font-semibold text-gray-700">Aucune anomalie critique enregistrée</p>
                        <p class="text-[11px] text-gray-400">L'ensemble des équipements contrôlés sur cette période sont conformes.</p>
                    </div>

                    <div v-else class="space-y-2 max-h-[290px] overflow-y-auto pr-1">
                        <div
                            v-for="anom in recentAnomalies"
                            :key="anom.id"
                            @click="goToMonitoring(anom.monitoring_id)"
                            class="p-2.5 rounded-lg border border-red-100 bg-red-50/50 hover:bg-red-50 transition cursor-pointer flex items-start justify-between gap-3 text-xs"
                        >
                            <div class="flex items-start gap-2.5 min-w-0">
                                <div class="w-7 h-7 rounded-lg bg-red-100 text-red-600 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                                    <Wrench :size="14" />
                                </div>
                                <div class="min-w-0">
                                    <div class="flex items-center gap-1.5 flex-wrap">
                                        <p class="font-bold text-gray-900">{{ anom.name }}</p>
                                        <span class="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-white border border-gray-200 text-gray-600">
                                            {{ anom.type }}
                                        </span>
                                    </div>
                                    <p class="text-gray-600 text-[11px] mt-0.5 truncate">
                                        📍 <span class="font-medium text-gray-800">{{ anom.site }}</span> • {{ anom.location }}
                                    </p>
                                    <p class="text-red-700 text-[11px] mt-0.5 italic">
                                        « {{ anom.comment }} »
                                    </p>
                                </div>
                            </div>

                            <div class="text-right shrink-0">
                                <span class="text-[10px] text-gray-400 block">{{ anom.date }}</span>
                                <span class="inline-flex items-center gap-1 text-[11px] font-semibold text-primary mt-1 hover:underline">
                                    Fiche <ArrowUpRight :size="11" />
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 4. SECTION : DERNIERS CONTRÔLES MATÉRIELS & SYNTHÈSE DES ÉQUIPEMENTS -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <!-- DERNIÈRES FICHES DE SUIVI MATÉRIEL (TABLEAU TYPE DASHBOARD GÉNÉRAL) -->
            <div class="lg:col-span-7 bg-white rounded-xl border border-gray-200 p-5 shadow-xs flex flex-col justify-between">
                <div>
                    <div class="flex items-center justify-between pb-3 border-b border-gray-100 mb-3">
                        <div>
                            <h3 class="font-bold text-gray-800 text-sm">Derniers contrôles de suivi matériel</h3>
                            <p class="text-xs text-gray-500">Sessions d'inspection des équipements récemment renseignées</p>
                        </div>
                        <button
                            @click="router.push({ name: 'EQUIPMENT_MONITORING' })"
                            class="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline cursor-pointer"
                        >
                            Voir tout <ArrowUpRight :size="13" />
                        </button>
                    </div>

                    <DashboardSkeleton v-if="loading" type="table" :rows="5" />

                    <div v-else-if="latestMonitorings.length === 0" class="py-10 text-center text-xs text-gray-400">
                        Aucune fiche de suivi d'équipements enregistrée pour cette année
                    </div>

                    <div v-else class="overflow-x-auto">
                        <table class="w-full text-xs">
                            <thead>
                                <tr class="text-left text-gray-400 font-semibold border-b border-gray-100">
                                    <th class="pb-2">Date</th>
                                    <th class="pb-2">Site / Station</th>
                                    <th class="pb-2">Inspecteur</th>
                                    <th class="pb-2 text-center">Conformité</th>
                                    <th class="pb-2 text-right">Statut</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-50">
                                <tr
                                    v-for="item in latestMonitorings"
                                    :key="item.id"
                                    @click="goToMonitoring(item.id)"
                                    class="hover:bg-slate-50 cursor-pointer transition-colors"
                                >
                                    <td class="py-2.5 text-gray-500 font-mono text-[11px]">
                                        {{ item.date }}
                                    </td>
                                    <td class="py-2.5 font-bold text-gray-800 truncate max-w-[150px]" :title="item.site">
                                        {{ item.site }}
                                    </td>
                                    <td class="py-2.5 text-gray-600 truncate max-w-[130px]" :title="item.inspector">
                                        {{ item.inspector }}
                                    </td>
                                    <td class="py-2.5 text-center">
                                        <div class="inline-flex items-center gap-1.5 font-semibold" :class="conformityTextColor(item.conformity_rate)">
                                            <span class="w-2 h-2 rounded-full" :class="statusDotBg(item.status_color)"></span>
                                            <span>{{ item.conformity_rate }}%</span>
                                        </div>
                                    </td>
                                    <td class="py-2.5 text-right">
                                        <span
                                            class="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold"
                                            :class="statusBadgeClass(item.status_color)"
                                        >
                                            {{ item.status }}
                                        </span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!-- SYNTHÈSE PAR FAMILLE D'ÉQUIPEMENTS & VOLUMES -->
            <div class="lg:col-span-5 bg-white rounded-xl border border-gray-200 p-5 shadow-xs flex flex-col justify-between">
                <div>
                    <div class="flex items-center justify-between pb-3 border-b border-gray-100 mb-3">
                        <div>
                            <h3 class="font-bold text-gray-800 text-sm">Synthèse par famille d'équipements</h3>
                            <p class="text-xs text-gray-500">Taux de conformité par domaine de sécurité</p>
                        </div>
                    </div>

                    <DashboardSkeleton v-if="loading" type="table" :rows="4" />
                    <div v-else class="space-y-3 text-xs">
                        <!-- FAMILLES D'ÉQUIPEMENTS AVEC JAUGE DE CONFORMITÉ -->
                        <div
                            v-for="cat in categoriesBreakdown"
                            :key="cat.category"
                            class="p-3 rounded-lg border border-slate-100 bg-slate-50/70"
                        >
                            <div class="flex items-center justify-between">
                                <div>
                                    <p class="font-bold text-gray-800 text-xs">{{ cat.category }}</p>
                                    <p class="text-[11px] text-gray-500">{{ cat.description }}</p>
                                </div>
                                <span class="font-bold text-xs tabular-nums text-gray-900 bg-white px-2 py-0.5 rounded border border-gray-200">
                                    {{ cat.rate }}%
                                </span>
                            </div>
                            <div class="mt-2 w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                                <div
                                    class="h-2 rounded-full transition-all duration-500"
                                    :style="{ width: `${cat.rate}%`, backgroundColor: cat.color }"
                                ></div>
                            </div>
                            <div class="flex items-center justify-between mt-1 text-[10px] text-gray-400">
                                <span>Volume en parc : <strong>{{ cat.total }} unités</strong></span>
                                <span>Conformes : <strong>{{ cat.ok_count }} / {{ cat.items_count || cat.total }}</strong></span>
                            </div>
                        </div>

                        <!-- CALIBRES RAPIDES -->
                        <div class="grid grid-cols-2 gap-2 pt-1">
                            <div class="p-2 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
                                <span class="text-gray-600 font-medium text-[11px]">P50 (50kg)</span>
                                <span class="font-bold text-xs bg-white px-1.5 py-0.5 rounded border border-gray-200 text-gray-800">{{ details.p50 || 0 }}</span>
                            </div>
                            <div class="p-2 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
                                <span class="text-gray-600 font-medium text-[11px]">P9 (9kg)</span>
                                <span class="font-bold text-xs bg-white px-1.5 py-0.5 rounded border border-gray-200 text-gray-800">{{ details.p9 || 0 }}</span>
                            </div>
                            <div class="p-2 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
                                <span class="text-gray-600 font-medium text-[11px]">P6 (6kg)</span>
                                <span class="font-bold text-xs bg-white px-1.5 py-0.5 rounded border border-gray-200 text-gray-800">{{ details.p6 || 0 }}</span>
                            </div>
                            <div class="p-2 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
                                <span class="text-gray-600 font-medium text-[11px]">CO2 (Carbone)</span>
                                <span class="font-bold text-xs bg-white px-1.5 py-0.5 rounded border border-gray-200 text-gray-800">{{ details.co2 || 0 }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 5. CARTOGRAPHIE DES ÉQUIPEMENTS PAR STATION (ZONE GPS AVEC PLEIN ÉCRAN) -->
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
    BarChart3,
    AlertTriangle,
    CheckCircle2,
    Wrench,
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
    avg_conformity: 100,
    total_anomalies: 0,
});

const statusDistribution = ref({
    conforme: 0,
    warning: 0,
    danger: 0,
    total_sites: 0,
});

const details = ref<Record<string, number>>({});
const latestMonitorings = ref<any[]>([]);
const recentAnomalies = ref<any[]>([]);
const categoriesBreakdown = ref<any[]>([]);

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

// Donut Chart Santé du parc
const donutSeries = computed(() => [
    statusDistribution.value.conforme || 0,
    statusDistribution.value.warning || 0,
    statusDistribution.value.danger || 0,
]);

const donutOptions = ref({
    chart: { type: 'donut', fontFamily: 'inherit' },
    labels: ['Conforme (≥ 90%)', 'Contrôle requis (70-89%)', 'Non conforme (< 70%)'],
    colors: ['#10B981', '#F59E0B', '#EF4444'],
    legend: { show: false },
    plotOptions: {
        pie: {
            donut: {
                size: '72%',
                labels: {
                    show: true,
                    name: { show: true, fontSize: '11px', color: '#64748B' },
                    value: { show: true, fontSize: '18px', fontWeight: 700, color: '#1E293B' },
                    total: {
                        show: true,
                        label: 'Stations',
                        fontSize: '11px',
                        fontWeight: 600,
                        color: '#64748B',
                        formatter: () => `${statusDistribution.value.total_sites || kpis.value.unique_sites || 0}`
                    }
                }
            }
        }
    },
    dataLabels: { enabled: false },
    stroke: { width: 0 }
});

function goToMonitoring(id: number | string) {
    if (id) {
        router.push({ name: 'EQUIPMENT_MONITORING_DETAILS', params: { id } });
    }
}

function conformityTextColor(rate: number) {
    if (rate >= 90) return 'text-emerald-600';
    if (rate >= 70) return 'text-amber-600';
    return 'text-red-600';
}

function statusDotBg(color: string) {
    if (color === 'green') return 'bg-emerald-500';
    if (color === 'yellow') return 'bg-amber-500';
    return 'bg-red-500';
}

function statusBadgeClass(color: string) {
    if (color === 'green') return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
    if (color === 'yellow') return 'bg-amber-50 text-amber-700 border border-amber-200';
    return 'bg-red-50 text-red-700 border border-red-200';
}

async function loadData(year: number) {
    loading.value = true;
    try {
        const res = await dashboardService.getEquipmentKPIs({ year });
        if (res?.data?.kpis) {
            kpis.value = res.data.kpis;
            if (res.data.kpis.status_distribution) {
                statusDistribution.value = res.data.kpis.status_distribution;
            }
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
        if (res?.data?.latest_monitorings) {
            latestMonitorings.value = res.data.latest_monitorings;
        }
        if (res?.data?.recent_anomalies) {
            recentAnomalies.value = res.data.recent_anomalies;
        }
        if (res?.data?.categories_breakdown) {
            categoriesBreakdown.value = res.data.categories_breakdown;
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
