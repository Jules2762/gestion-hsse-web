<script setup lang="ts">
import {
    ClipboardCheck,
    ClipboardPen,
    Loader2,
    ShieldCheck,
    Target,
    ArrowUpRight,
    CheckCircle2,
    Clock,
    AlertCircle,
    ChevronDown,
    Calendar,
    Check
} from '@lucide/vue';
import Card from '../Card.vue';
import DashboardSkeleton from '../DashboardSkeleton.vue';
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import dashboardService from '../../../../core/services/dashboard.service';

const router = useRouter();

const loading = ref(true);
const loadingPerf = ref(false);
const selectedYear = ref(new Date().getFullYear());

const years = computed(() => {
    const current = new Date().getFullYear();
    return Array.from({ length: 6 }, (_, i) => current - i);
});

const kpis = ref({
    plan_completion_rate: 0,
    inspections_realisees: 0,
    global_conformity_rate: 0,
    open_actions: 0
});

const series = ref<any[]>([
    { name: 'Formations', data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
    { name: 'Inspections & VMC', data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
    { name: 'Actions Correctives', data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
    { name: 'Non-conformités', data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
]);

const options = ref({
    chart: {
        type: 'area',
        toolbar: { show: false },
        fontFamily: 'inherit'
    },
    stroke: { curve: 'smooth', width: 2 },
    xaxis: {
        categories: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sept', 'Oct', 'Nov', 'Déc']
    },
    colors: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'],
    dataLabels: { enabled: false },
    grid: { borderColor: '#f1f5f9' },
});

const latestInspections = ref<any[]>([]);
const latestActions = ref<any[]>([]);

async function fetchPerformance(year: number) {
    loadingPerf.value = true;
    try {
        const perfRes = await dashboardService.getGeneralPerformance({ year });
        if (perfRes?.data) {
            const data = perfRes.data;
            if (data.series) series.value = data.series;
            if (data.categories) {
                options.value = {
                    ...options.value,
                    xaxis: { categories: data.categories }
                };
            }
        }
    } catch (e) {
        console.error('Erreur chargement performance annuelle:', e);
    } finally {
        loadingPerf.value = false;
    }
}

watch(selectedYear, (newYear) => {
    fetchPerformance(newYear);
});

async function loadData() {
    loading.value = true;
    try {
        const [kpiRes, inspRes, actRes] = await Promise.allSettled([
            dashboardService.getGeneralKPIs(),
            dashboardService.getGeneralLatestInspections(),
            dashboardService.getGeneralLatestActions()
        ]);

        if (kpiRes.status === 'fulfilled' && kpiRes.value?.data) {
            kpis.value = kpiRes.value.data;
        }

        if (inspRes.status === 'fulfilled' && inspRes.value?.data) {
            latestInspections.value = inspRes.value.data;
        }

        if (actRes.status === 'fulfilled' && actRes.value?.data) {
            latestActions.value = actRes.value.data;
        }
    } catch (e) {
        console.error('Erreur chargement dashboard général:', e);
    } finally {
        loading.value = false;
    }

    await fetchPerformance(selectedYear.value);
}

function navigateToInspection(item: any) {
    if (item.route_name === 'CHECKLIST_DETAILS') {
        router.push({ name: 'CHECKLIST_DETAILS', params: { id: item.route_param } });
    } else if (item.route_name === 'VMC_DETAILS') {
        router.push({ name: 'VMC_DETAILS', params: { id: item.route_param } });
    }
}

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

function navigateToAction() {
    router.push({ name: 'ACTION' });
}

onMounted(() => {
    loadData();
    document.addEventListener('mousedown', handleYearClickOutside);
});

onBeforeUnmount(() => {
    document.removeEventListener('mousedown', handleYearClickOutside);
});
</script>

<template>
    <div class="flex flex-col gap-y-4 p-4">

        <!-- CARTES KPI DYNAMIQUES -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <Card
                title="Taux de réalisation du plan"
                theme="red"
                :value="kpis.plan_completion_rate + '%'"
                :icon="Target"
            />
            <Card
                title="Inspections réalisées"
                theme="green"
                :value="String(kpis.inspections_realisees)"
                :icon="ClipboardCheck"
            />
            <Card
                title="Taux de conformité global"
                theme="orange"
                :value="kpis.global_conformity_rate + '%'"
                :icon="ShieldCheck"
            />
            <Card
                title="Actions ouvertes"
                theme="cyan"
                :value="String(kpis.open_actions)"
                :icon="ClipboardPen"
            />
        </div>

        <!-- GRAPHIQUE PERFORMANCE HSSE GLOBALE -->
        <div class="bg-white rounded-xl border border-gray-200 p-5 shadow-xs">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div>
                    <h3 class="font-bold text-gray-800 text-base">Performance HSSE Globale</h3>
                    <p class="text-xs text-gray-500">Évolution mensuelle consolidée des formations, inspections, actions et non-conformités</p>
                </div>
                <div class="flex items-center gap-2 shrink-0">
                    <div v-if="loadingPerf" class="flex items-center text-xs text-primary gap-1 mr-2">
                        <Loader2 class="animate-spin" :size="14" />
                        Chargement...
                    </div>
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
            <apexchart type="area" height="340" :options="options" :series="series"></apexchart>
        </div>

        <!-- DERNIÈRES INSPECTIONS & DERNIÈRES ACTIONS CORRECTIVES -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">

            <!-- DERNIÈRES INSPECTIONS -->
            <div class="bg-white rounded-xl border border-gray-200 p-5 shadow-xs flex flex-col justify-between">
                <div>
                    <div class="flex items-center justify-between pb-3 border-b border-gray-100 mb-3">
                        <div>
                            <h3 class="font-bold text-gray-800 text-sm">Dernières inspections</h3>
                            <p class="text-xs text-gray-500">Checklists et VMC récemment clôturées</p>
                        </div>
                        <button
                            @click="router.push({ name: 'CHECKLIST' })"
                            class="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                        >
                            Voir tout <ArrowUpRight :size="13" />
                        </button>
                    </div>

                    <div v-if="loading" class="py-12 flex justify-center text-gray-400">
                        <Loader2 class="animate-spin" :size="24" />
                    </div>

                    <div v-else-if="latestInspections.length === 0" class="py-10 text-center text-xs text-gray-400">
                        Aucune inspection récente enregistrée
                    </div>

                    <table v-else class="w-full text-xs">
                        <thead>
                            <tr class="text-left text-gray-400 font-semibold border-b border-gray-100">
                                <th class="pb-2">Type / Intitulé</th>
                                <th class="pb-2">Site / Lieu</th>
                                <th class="pb-2">Inspecteur</th>
                                <th class="pb-2 text-right">Conformité</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-50">
                            <tr
                                v-for="item in latestInspections"
                                :key="item.id + item.type_badge"
                                @click="navigateToInspection(item)"
                                class="hover:bg-slate-50 cursor-pointer transition-colors"
                            >
                                <td class="py-2.5 font-medium text-gray-800">
                                    <span
                                        class="inline-block px-1.5 py-0.5 text-[10px] font-bold rounded mr-1.5"
                                        :class="item.type_badge === 'Checklist' ? 'bg-blue-50 text-blue-700' : 'bg-emerald-50 text-emerald-700'"
                                    >
                                        {{ item.type_badge }}
                                    </span>
                                    <span class="truncate max-w-[140px] inline-block align-middle" :title="item.title">
                                        {{ item.title }}
                                    </span>
                                </td>
                                <td class="py-2.5 text-gray-500 truncate max-w-[120px]" :title="item.site">
                                    {{ item.site }}
                                </td>
                                <td class="py-2.5 text-gray-600 truncate max-w-[110px]" :title="item.inspector">
                                    {{ item.inspector }}
                                </td>
                                <td class="py-2.5 text-right font-semibold text-emerald-600">
                                    {{ item.conformity_rate }}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- DERNIÈRES ACTIONS CORRECTIVES -->
            <div class="bg-white rounded-xl border border-gray-200 p-5 shadow-xs flex flex-col justify-between">
                <div>
                    <div class="flex items-center justify-between pb-3 border-b border-gray-100 mb-3">
                        <div>
                            <h3 class="font-bold text-gray-800 text-sm">Dernières actions correctives</h3>
                            <p class="text-xs text-gray-500">Actions issues des contrôles terrain</p>
                        </div>
                        <button
                            @click="navigateToAction"
                            class="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                        >
                            Voir tout <ArrowUpRight :size="13" />
                        </button>
                    </div>

                    <div v-if="loading" class="py-12 flex justify-center text-gray-400">
                        <Loader2 class="animate-spin" :size="24" />
                    </div>

                    <div v-else-if="latestActions.length === 0" class="py-10 text-center text-xs text-gray-400">
                        Aucune action corrective enregistrée
                    </div>

                    <table v-else class="w-full text-xs">
                        <thead>
                            <tr class="text-left text-gray-400 font-semibold border-b border-gray-100">
                                <th class="pb-2">Action</th>
                                <th class="pb-2">Origine</th>
                                <th class="pb-2">Responsable</th>
                                <th class="pb-2 text-right">Statut</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-50">
                            <tr
                                v-for="item in latestActions"
                                :key="item.id + item.origin"
                                @click="navigateToAction"
                                class="hover:bg-slate-50 cursor-pointer transition-colors"
                            >
                                <td class="py-2.5 font-medium text-gray-800">
                                    <span class="truncate max-w-[160px] inline-block align-middle" :title="item.title">
                                        {{ item.title }}
                                    </span>
                                </td>
                                <td class="py-2.5">
                                    <span
                                        class="px-1.5 py-0.5 text-[10px] font-bold rounded"
                                        :class="item.origin === 'Checklist' ? 'bg-indigo-50 text-indigo-700' : 'bg-emerald-50 text-emerald-700'"
                                    >
                                        {{ item.origin }}
                                    </span>
                                </td>
                                <td class="py-2.5 text-gray-600 truncate max-w-[110px]" :title="item.responsible">
                                    {{ item.responsible }}
                                </td>
                                <td class="py-2.5 text-right font-medium">
                                    <span
                                        class="px-2 py-0.5 text-[11px] rounded-full inline-flex items-center gap-1"
                                        :class="{
                                            'bg-emerald-100 text-emerald-800': item.status === 'DONE' || item.status === 'Clôturé',
                                            'bg-blue-100 text-blue-800': item.status === 'IN_PROGRESS' || item.status === 'En cours',
                                            'bg-amber-100 text-amber-800': item.status === 'TODO' || item.status === 'À faire'
                                        }"
                                    >
                                        <span class="h-1.5 w-1.5 rounded-full bg-current"></span>
                                        {{ item.status === 'DONE' ? 'Fait' : item.status === 'IN_PROGRESS' ? 'En cours' : 'À faire' }}
                                    </span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

        </div>

    </div>
</template>