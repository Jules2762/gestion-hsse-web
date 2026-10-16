<template>
  <div class="p-4 flex flex-col gap-y-6">

    <!-- ALERTE D'ERREUR -->
    <div v-if="error" role="alert"
      class="flex items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
      <span>Impossible de charger les données d'administration. Vérifiez la connexion puis réessayez.</span>
      <button type="button"
        class="shrink-0 rounded border border-red-300 bg-white px-3 py-1 font-medium hover:bg-red-100 transition"
        @click="loadAllData">
        Réessayer
      </button>
    </div>

    <!-- 1. CARTES KPIS D'ADMINISTRATION -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card
        title="Utilisateurs Inscrits"
        :icon="UsersIcon"
        :value="kpis.total_users"
        :subtitle="`${kpis.active_users} actif(s) • ${kpis.inactive_users} inactif(s)`"
        theme="blue"
        :loading="loading"
        clickable
        @click="router.push('/users')"
      />

      <Card
        title="Administrateurs Système"
        :icon="ShieldCheck"
        :value="kpis.admin_users"
        :subtitle="`${kpis.standard_users} utilisateur(s) standard`"
        theme="purple"
        :loading="loading"
        clickable
        @click="router.push('/users')"
      />

      <Card
        title="Personnel Référencé"
        :icon="Briefcase"
        :value="kpis.total_personnels"
        subtitle="Collaborateurs & Équipes Galana"
        theme="green"
        :loading="loading"
        clickable
        @click="router.push('/personnels')"
      />

      <Card
        title="Traçabilité & Audit (30j)"
        :icon="Activity"
        :value="kpis.logs_this_month"
        :subtitle="`${kpis.logs_today} action(s) tracée(s) aujourd'hui`"
        theme="orange"
        :loading="loading"
        clickable
        @click="router.push('/activity')"
      />
    </div>

    <!-- 2. SECTION GRAPHIQUES : ACTIVITÉ SYSTÈME & RÉPARTITION PAR DIRECTION -->
    <div class="grid grid-cols-1 xl:grid-cols-12 gap-4">

      <!-- ÉVOLUTION DE L'ACTIVITÉ (AREA CHART) -->
      <ChartCard title="Activité du système et connexions" class="xl:col-span-7 flex flex-col">
        <template #header-action>
          <div class="flex items-center gap-1 bg-gray-100 p-0.5 rounded-lg text-xs font-medium">
            <button
              v-for="d in [7, 14, 30]"
              :key="d"
              type="button"
              @click="selectedDays = d"
              class="px-2.5 py-1 rounded-md transition-colors"
              :class="selectedDays === d ? 'bg-white text-gray-800 shadow-2xs font-semibold' : 'text-gray-500 hover:text-gray-900'"
            >
              {{ d }} jours
            </button>
          </div>
        </template>

        <div v-if="!loading && activityChartData.categories.length" class="flex-1">
          <apexchart
            type="area"
            height="320"
            :options="activityChartOptions"
            :series="activityChartData.series"
            :key="`activity-${selectedDays}`"
          />
        </div>
        <DashboardSkeleton v-else type="chart" :height="320" />
      </ChartCard>

      <!-- RÉPARTITION DU PERSONNEL PAR DIRECTION (DONUT) -->
      <ChartCard title="Répartition du personnel par direction" class="xl:col-span-5 flex flex-col">
        <div v-if="!loading && directionSeries.length" class="flex-1 flex flex-col justify-center">
          <apexchart
            type="donut"
            height="320"
            :options="directionDonutOptions"
            :series="directionSeries"
            :key="directionDonutKey"
          />
        </div>
        <DashboardSkeleton v-else type="donut" :height="320" />
      </ChartCard>

    </div>

    <!-- 3. SECTION BASSE : JOURNAL D'AUDIT RÉCENT & UTILISATEURS LES PLUS ACTIFS -->
    <div class="grid grid-cols-1 xl:grid-cols-12 gap-4">

      <!-- JOURNAL D'AUDIT RÉCENT -->
      <ChartCard title="Journal d'audit et activités récentes" class="xl:col-span-7 flex flex-col">
        <template #header-action>
          <button
            type="button"
            @click="router.push('/activity')"
            class="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
          >
            <span>Voir tout le journal</span>
            <ArrowRight :size="13" />
          </button>
        </template>

        <div class="overflow-x-auto flex-1">
          <DashboardSkeleton v-if="loading" type="list" :rows="5" />
          <div v-else-if="recentLogs.length" class="divide-y divide-gray-100">
            <div
              v-for="log in recentLogs"
              :key="log.id"
              class="py-3 px-1 flex items-start justify-between gap-3 hover:bg-gray-50/80 transition rounded-lg"
            >
              <div class="flex items-start gap-3 min-w-0">
                <span
                  class="mt-0.5 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase shrink-0"
                  :class="getLogBadgeClass(log.type)"
                >
                  {{ formatLogType(log.type) }}
                </span>

                <div class="min-w-0">
                  <p class="text-xs font-semibold text-gray-800 truncate">{{ log.title }}</p>
                  <p class="text-[11px] text-gray-500 line-clamp-1">{{ log.description }}</p>
                  <p class="text-[10px] text-gray-400 mt-0.5">
                    Par <span class="font-medium text-gray-600">{{ log.user_name }}</span>
                  </p>
                </div>
              </div>

              <div class="text-right shrink-0">
                <span class="text-[11px] font-medium text-gray-400 whitespace-nowrap">{{ log.created_at }}</span>
              </div>
            </div>
          </div>
          <div v-else class="h-48 flex items-center justify-center text-gray-400 text-sm">
            Aucun événement d'audit récent.
          </div>
        </div>
      </ChartCard>

      <!-- UTILISATEURS LES PLUS ACTIFS -->
      <ChartCard title="Utilisateurs & Contributeurs actifs" class="xl:col-span-5 flex flex-col">
        <template #header-action>
          <button
            type="button"
            @click="router.push('/users')"
            class="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
          >
            <span>Gérer les comptes</span>
            <ArrowRight :size="13" />
          </button>
        </template>

        <div class="overflow-x-auto flex-1">
          <DashboardSkeleton v-if="loading" type="table" :rows="4" />
          <table v-else class="min-w-full text-xs">
            <thead>
              <tr class="text-left text-gray-500 border-b border-gray-200">
                <th class="py-2 pr-3 font-medium">Utilisateur</th>
                <th class="py-2 pr-3 font-medium">Rôle</th>
                <th class="py-2 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <template v-if="topUsers.length">
                <tr v-for="u in topUsers" :key="u.id" class="hover:bg-gray-50/80 transition">
                  <td class="py-2.5 pr-3">
                    <div class="flex items-center gap-2">
                      <div class="w-7 h-7 rounded-full bg-slate-700 text-white flex items-center justify-center font-bold text-[11px] shrink-0">
                        {{ u.name.charAt(0).toUpperCase() }}
                      </div>
                      <div class="min-w-0">
                        <p class="font-semibold text-gray-800 truncate">{{ u.name }}</p>
                        <p class="text-[10px] text-gray-400 truncate">{{ u.email }}</p>
                      </div>
                    </div>
                  </td>
                  <td class="py-2.5 pr-3">
                    <span
                      class="px-2 py-0.5 rounded text-[10px] font-semibold"
                      :class="u.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'"
                    >
                      {{ u.role === 'ADMIN' ? 'Administrateur' : 'Utilisateur' }}
                    </span>
                  </td>
                  <td class="py-2.5 text-right font-bold text-gray-700 tabular-nums">
                    {{ u.actions_count }}
                  </td>
                </tr>
              </template>
              <tr v-else>
                <td colspan="3" class="py-8 text-center text-gray-400">
                  Aucun utilisateur trouvé.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </ChartCard>

    </div>

  </div>
</template>

<script setup lang="ts">
import { computed, defineComponent, h, onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import {
  Users as UsersIcon,
  ShieldCheck,
  Briefcase,
  Activity,
  ArrowRight,
} from '@lucide/vue';
import Card from '../Card.vue';
import DashboardSkeleton from '../DashboardSkeleton.vue';
import dashboardService from '../../../../core/services/dashboard.service';

const router = useRouter();

/* Composant ChartCard avec slot d'action d'en-tête */
const ChartCard = defineComponent({
  props: { title: { type: String, required: true } },
  setup(props, { slots }) {
    return () =>
      h('section', { class: 'bg-white rounded-lg border border-gray-200 p-4 min-w-0' }, [
        h('div', { class: 'flex items-center justify-between mb-3' }, [
          h('h3', { class: 'text-base font-semibold text-gray-800' }, props.title),
          slots['header-action']?.(),
        ]),
        slots.default?.(),
      ]);
  },
});

const loading = ref(true);
const error = ref(false);
const selectedDays = ref(14);

/* Données KPIs */
const kpis = ref({
  total_users: 0,
  active_users: 0,
  inactive_users: 0,
  admin_users: 0,
  standard_users: 0,
  total_personnels: 0,
  total_logs: 0,
  logs_this_month: 0,
  logs_today: 0,
});

/* Données Graphique Activité */
const activityChartData = ref<{
  categories: string[];
  series: { name: string; data: number[] }[];
}>({
  categories: [],
  series: [],
});

const activityChartOptions = computed(() => ({
  chart: {
    type: 'area' as const,
    toolbar: { show: false },
    fontFamily: 'inherit',
    animations: { speed: 400 },
  },
  stroke: { curve: 'smooth' as const, width: 2 },
  colors: ['#3B82F6', '#10B981', '#8B5CF6'],
  dataLabels: { enabled: false },
  grid: { borderColor: '#f1f5f9' },
  xaxis: {
    categories: activityChartData.value.categories,
  },
  yaxis: {
    title: { text: 'Actions / Connexions' },
  },
  legend: {
    position: 'bottom' as const,
    horizontalAlign: 'center' as const,
  },
}));

/* Données Graphique Donut Directions */
const directionStats = ref<{ direction: string; count: number }[]>([]);

const directionSeries = computed(() => directionStats.value.map((d) => d.count));
const directionDonutKey = computed(() => `donut-${directionStats.value.map((d) => d.direction).join('-')}`);

const donutColors = [
  '#008FFB', '#00E396', '#FEB019', '#FF4560', '#775DD0',
  '#546E7A', '#26A69A', '#3F51B5', '#8BC34A', '#FF9800',
];

const directionDonutOptions = computed(() => ({
  chart: {
    type: 'donut' as const,
    toolbar: { show: false },
    fontFamily: 'inherit',
  },
  labels: directionStats.value.map((d) => d.direction),
  colors: donutColors,
  legend: {
    show: true,
    position: 'bottom' as const,
    horizontalAlign: 'center' as const,
    fontSize: '12px',
    formatter: (seriesName: string, opts: any) => {
      const val = opts.w.globals.series[opts.seriesIndex];
      return `${seriesName} (${val})`;
    },
  },
  dataLabels: {
    enabled: true,
    formatter: (val: number) => `${val.toFixed(1)}%`,
  },
  tooltip: {
    y: {
      formatter: (val: number, opts: any) => {
        const total = opts.globals.seriesTotals.reduce((a: number, b: number) => a + b, 0);
        const percent = total > 0 ? ((val / total) * 100).toFixed(1) : '0';
        return `${val} collaborateur${val > 1 ? 's' : ''} (${percent}%)`;
      },
    },
  },
  plotOptions: {
    pie: {
      donut: {
        size: '62%',
        labels: {
          show: true,
          name: {
            show: true,
            fontSize: '14px',
            fontWeight: 600,
            color: '#475569',
          },
          value: {
            show: true,
            fontSize: '20px',
            fontWeight: 700,
            color: '#0f172a',
            formatter: (val: string) => `${val} pers.`,
          },
          total: {
            show: true,
            label: 'Total Personnel',
            fontSize: '13px',
            fontWeight: 600,
            color: '#64748b',
            formatter: (w: any) => {
              const total = w.globals.seriesTotals.reduce((a: number, b: number) => a + b, 0);
              return `${total} pers.`;
            },
          },
        },
      },
    },
  },
}));

/* Données Activités Récentes et Top Utilisateurs */
const recentLogs = ref<any[]>([]);
const topUsers = ref<any[]>([]);

function formatLogType(type: string): string {
  if (type === 'LOGIN') return 'Connexion';
  if (type === 'LOGOUT') return 'Déconnexion';
  if (type.startsWith('USER_')) return 'Utilisateur';
  if (type.startsWith('PERSONNEL_')) return 'Personnel';
  if (type.startsWith('CHECKLIST_')) return 'Checklist';
  if (type.startsWith('VMC_')) return 'VMC';
  if (type.startsWith('FORMATION_')) return 'Formation';
  if (type.startsWith('PARTICIPANT_')) return 'Participant';
  if (type.startsWith('DOCUMENT_') || type.startsWith('FOLDER_')) return 'GED';
  if (type.startsWith('ACTION_')) return 'Action';
  if (type.startsWith('EQUIPMENT_')) return 'Matériel';
  return type;
}

function getLogBadgeClass(type: string): string {
  if (type === 'LOGIN' || type === 'LOGOUT') return 'bg-blue-100 text-blue-700';
  if (type.startsWith('USER_')) return 'bg-purple-100 text-purple-700';
  if (type.startsWith('PERSONNEL_')) return 'bg-indigo-100 text-indigo-700';
  if (type.startsWith('CHECKLIST_') || type.startsWith('VMC_')) return 'bg-emerald-100 text-emerald-700';
  if (type.startsWith('FORMATION_') || type.startsWith('PARTICIPANT_')) return 'bg-teal-100 text-teal-700';
  if (type.startsWith('DOCUMENT_') || type.startsWith('FOLDER_')) return 'bg-amber-100 text-amber-700';
  if (type.startsWith('ACTION_')) return 'bg-orange-100 text-orange-700';
  return 'bg-gray-100 text-gray-700';
}

async function loadKPIs() {
  try {
    const res = await dashboardService.getAdminKPIs();
    if (res?.data) {
      kpis.value = res.data;
    }
  } catch (e) {
    console.error('Erreur chargement KPIs admin:', e);
    error.value = true;
  }
}

async function loadActivityChart(days: number) {
  try {
    const res = await dashboardService.getAdminActivityChart({ days });
    if (res?.data) {
      activityChartData.value = res.data;
    }
  } catch (e) {
    console.error('Erreur chargement graphique activité admin:', e);
  }
}

async function loadDirectionsStats() {
  try {
    const res = await dashboardService.getAdminDirectionsStats();
    if (res?.data?.personnel_by_direction) {
      directionStats.value = res.data.personnel_by_direction;
    }
  } catch (e) {
    console.error('Erreur chargement directions admin:', e);
  }
}

async function loadRecentActivities() {
  try {
    const res = await dashboardService.getAdminRecentActivities();
    if (res?.data) {
      recentLogs.value = res.data.recent_logs || [];
      topUsers.value = res.data.top_users || [];
    }
  } catch (e) {
    console.error('Erreur chargement activités récentes admin:', e);
  }
}

async function loadAllData() {
  loading.value = true;
  error.value = false;
  try {
    await Promise.allSettled([
      loadKPIs(),
      loadActivityChart(selectedDays.value),
      loadDirectionsStats(),
      loadRecentActivities(),
    ]);
  } finally {
    loading.value = false;
  }
}

watch(selectedDays, (newDays) => {
  loadActivityChart(newDays);
});

onMounted(() => {
  loadAllData();
});
</script>
