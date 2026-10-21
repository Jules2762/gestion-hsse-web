<template>
  <div class="p-4 flex flex-col gap-y-4">
    <div v-if="error" role="alert"
      class="flex items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
      <span>{{ locale === 'en' ? 'Unable to load indicators. Check connection and retry.' : 'Impossible de charger les indicateurs. Vérifie ta connexion puis réessaie.' }}</span>
      <button type="button"
        class="shrink-0 rounded border border-red-300 bg-white px-3 py-1 font-medium hover:bg-red-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
        @click="fetchKPIs">
        {{ t('common.retry') || (locale === 'en' ? 'Retry' : 'Réessayer') }}
      </button>
    </div>

    <KPICards v-bind="data_kpis" :loading="loading" />

    <!-- Personnes formées par direction -->
    <div class="grid grid-cols-1 xl:grid-cols-2 gap-4">
      <ChartCard :title="locale === 'en' ? 'Trained staff by department' : 'Personnes formées par direction'">
        <apexchart v-if="direction_series_data.length" :key="`bar-${direction_series_data.map((s) => s.name).join('-')}`" type="bar" height="320" :options="direction_options" :series="direction_series" />
        <DashboardSkeleton v-else type="chart" :height="320" />
      </ChartCard>

      <ChartCard :title="locale === 'en' ? 'Distribution of trained staff by department' : 'Répartition des personnes formées par direction'">
        <apexchart v-if="direction_series_data.length" :key="pie_chart_key" type="donut" height="320" :options="pie_options" :series="pie_series" />
        <DashboardSkeleton v-else type="donut" :height="320" />
      </ChartCard>
    </div>

    <!-- Tableau -->
    <ChartCard :title="locale === 'en' ? 'Department breakdown' : 'Détail par direction'">
      <div class="overflow-x-auto">
        <table class="min-w-full text-sm">
          <thead>
            <tr class="text-left text-gray-500 border-b border-gray-200">
              <th class="py-2 pr-4 font-medium w-fit">{{ t('table.direction') || (locale === 'en' ? 'Department' : 'Direction') }}</th>
              <th class="py-2 font-medium">{{ locale === 'en' ? 'Trained staff' : 'personnes formées' }}</th>
              <th class="py-2 font-medium w-8/12">{{ locale === 'en' ? 'Trained staff rate' : 'Taux de personnes formées' }}</th>
            </tr>
          </thead>
          <tbody>
            <template v-if="table_section_data.length">
              <tr v-for="item in table_section_data" :key="item.direction"
                class="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                  <td class="py-2.5 pr-4 font-medium text-gray-800">{{ item.direction }}</td>
                  <td class="py-2.5 pr-4 font-medium text-gray-800">{{ item.trained_per_direction}} <span class="text-gray-400 text-xs">/ {{ item.direction_personnel_count }}</span></td>
                <td class="py-2.5">
                  <div class="flex items-center gap-3">
                    <div class="h-2 flex-1 rounded-full bg-gray-100 overflow-hidden">
                      <div class="h-full rounded-full bg-blue-500" :style="{ width: `${item.rate_trained_per_direction}%` }" />
                    </div>
                    <span class="w-12 text-right tabular-nums text-gray-700">{{ item.rate_trained_per_direction }}%</span>
                  </div>
                </td>
              </tr>
            </template>
            <tr v-else-if="loading">
              <td colspan="3" class="py-4">
                <DashboardSkeleton type="table" :rows="3" />
              </td>
            </tr>
            <tr v-else>
              <td colspan="3" class="py-8 text-center text-gray-400">
                {{ locale === 'en' ? 'No data available at this time.' : 'Aucune donnée disponible pour le moment.' }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </ChartCard>
    <ChartCard title="">
      <div class="flex flex-row items-center justify-between">
        <h5 class="text-base font-semibold text-gray-800 mb-3">{{ locale === 'en' ? 'Number of training sessions per month' : 'Nombre de formations par mois' }}</h5>
       <select v-model="currentYear" class="border border-gray-300 rounded px-2 py-1 w-24 text-sm">
          <option v-for="year in years" :key="year" :value="year">
            {{ year }}
          </option>
        </select>
      </div>
      <apexchart v-if="data_monthly_chart.data.length" :key="`monthly-${currentYear}`" type="bar" height="320" :options="monthly_options" :series="monthly_series" />
      <DashboardSkeleton v-else type="chart" :height="320" />
    </ChartCard>
    <!-- Sessions : barres horizontales pour que les intitulés longs restent lisibles -->
    <ChartCard :title="locale === 'en' ? 'Number of people trained per session' : 'Nombre de personnes formées par session'">
      <apexchart v-if="sessions.length" :key="`sessions-${sessions.length}`" type="bar" :height="session_height" :options="session_options" :series="session_series" />
      <DashboardSkeleton v-else type="chart" :height="session_height" />
    </ChartCard>
  </div>
</template>

<script setup lang="ts">
  import { computed, defineComponent, h, onMounted, ref, watch, type ComputedRef } from 'vue';
  import { useI18n } from 'vue-i18n';
  import type { DashboardTrainingPlanChartDirectionType, DashboardTrainingPlanChartSessionType, DashboardTrainingPlanKPIs, DashboardTrainingPlanTableDirectionType } from '../../../../@types/Dashboard.type.ts';
  import dashboardService from '../../../../core/services/dashboard.service.ts';
  import KPICards from './KPICards.vue';
  import DashboardSkeleton from '../DashboardSkeleton.vue';

  const { t, locale } = useI18n();

  /* Carte réutilisable : un seul style pour tous les blocs */
  const ChartCard = defineComponent({
    props: { title: { type: String, required: true } },
    setup(props, { slots }) {
      return () =>
        h('section', { class: 'bg-white rounded-lg border border-gray-200 p-4 min-w-0' }, [
          h('h3', { class: 'text-base font-semibold text-gray-800 mb-3' }, props.title),
          slots.default?.(),
        ]);
    },
  });

  const colors = [
    '#008FFB', '#00E396', '#FEB019', '#FF4560', '#775DD0',
    '#546E7A', '#26A69A', '#3F51B5', '#8BC34A', '#FF9800',
    '#9C27B0', '#03A9F4', '#E91E63', '#CDDC39', '#607D8B',
  ];
 

  const years = computed(() => {
    const current = new Date().getFullYear()

    return Array.from(
      { length: 10 },
      (_, i) => current - i
    )
  })
  const baseChart = {
    toolbar: { show: false },
    fontFamily: 'inherit',
    animations: { speed: 400 },
  };

  /* ---------- Personnes formées par direction ---------- */
  const direction_series_data = ref<DashboardTrainingPlanChartDirectionType[]>([]);
  const direction_series = computed(() => [
    { name: locale.value === 'en' ? 'Trained staff' : 'Personnes formées', data: direction_series_data.value.map((s) => s.trained) },
  ]);
  const direction_options = computed(() => ({
    chart: { ...baseChart, type: 'bar' as const },
    colors: ['#008FFB'],
    plotOptions: { bar: { borderRadius: 4, columnWidth: '45%' } },
    dataLabels: { enabled: true },
    grid: { borderColor: '#f1f1f1' },
    xaxis: { categories: direction_series_data.value.map((s) => s.name) },
    yaxis: { title: { text: locale.value === 'en' ? 'People' : 'Personnes' } },
  }));

  /* ---------- Répartition (donut) ---------- */
  const pie_chart_key = computed(() => `donut-${direction_series_data.value.map((d) => d.name).join('-')}`);
  const pie_series = computed<number[]>(() => direction_series_data.value.map((item) => item.trained));
  const pie_options = computed(() => ({
    chart: {
      ...baseChart,
      type: 'donut' as const,
    },
    labels: direction_series_data.value.map((item) => item.name),
    colors,
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
          const noun = locale.value === 'en' ? (val > 1 ? 'people' : 'person') : (val > 1 ? 'personnes' : 'personne');
          return `${val} ${noun} (${percent}%)`;
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
              label: locale.value === 'en' ? 'Total trained' : 'Total formés',
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
    responsive: [
      {
        breakpoint: 480,
        options: {
          legend: {
            position: 'bottom',
          },
        },
      },
    ],
  }));

  /* ---------- Tableau ---------- */
  const table_section_data = ref<DashboardTrainingPlanTableDirectionType[]>([]);

  /* ---------- Sessions ---------- */
  const sessions = ref<DashboardTrainingPlanChartSessionType[]>([
  ]);
  type monthlyChartDataType = {
    month: number,
    month_name: string,
    count: number,
    planned_count: number,
    canceled_count: number
  };
  type monthlyChartResponseType = {
    year: number,
    data: monthlyChartDataType[]
  }
  const session_series = computed(() => [
    { name: locale.value === 'en' ? 'Trained staff' : 'Personnes formées', data: sessions.value.map((s) => s.count) },
  ]);
  const session_height = computed(() => Math.max(300, sessions.value.length * 36));
  const session_options = computed(() => ({
    chart: { ...baseChart, type: 'bar' },
    colors,
    plotOptions: { bar: { horizontal: true, distributed: true, borderRadius: 3, barHeight: '70%' } },
    dataLabels: { enabled: true },
    legend: { show: false },
    grid: { borderColor: '#f1f1f1' },
    xaxis: { categories: sessions.value.map((s) => s.name) },
    yaxis: { labels: { maxWidth: 280 } },
    tooltip: { y: { formatter: (val: number) => `${val} ${locale.value === 'en' ? 'people' : 'personnes'}` } },
  }));

  /* ---------- KPIs ---------- */
  const data_kpis = ref<DashboardTrainingPlanKPIs>({
    sessionsCount: 0,
    totalTrainingHours: 0,
    trainingPlanCompletionRate: 0,
    totalParticipants: 0,
    overallParticipationRate: 0,
    uniqueTrainedPeople: 0,
    trainingParticipationRate:0
  });
  const data_monthly_chart = ref<monthlyChartResponseType>({
    year: new Date().getFullYear(),
    data: []
  });
  const monthly_options = computed(() => ({
    chart: { type: 'bar', },

    xaxis: { categories: data_monthly_chart.value.data.map((item)=>item.month_name) }
  }));
  const monthly_series = computed(() => [
    { name: locale.value === 'en' ? 'Completed' : 'Terminés', data: data_monthly_chart.value.data.map((item)=>item.count) },
    { name: locale.value === 'en' ? 'Planned' : 'Plannifiés', data: data_monthly_chart.value.data.map((item)=>item.planned_count) },
    { name: locale.value === 'en' ? 'Cancelled' : 'Annulés', data: data_monthly_chart.value.data.map((item)=>item.canceled_count) }
  ])
  const loading = ref(false);
  const error = ref(false);

  async function fetchKPIs() {
    loading.value = true;
    error.value = false;
    try {
      const response = await dashboardService.getTrainingPlanKPIs();
      data_kpis.value.sessionsCount = response.data.sessionsCount;
      data_kpis.value.totalTrainingHours = response.data.totalTrainingHours;  
      data_kpis.value.trainingPlanCompletionRate = response.data.trainingPlanCompletionRate;
      data_kpis.value.totalParticipants = response.data.totalParticipants;
      data_kpis.value.overallParticipationRate = response.data.overallParticipationRate;
      data_kpis.value.uniqueTrainedPeople = response.data.uniqueTrainedPeople;
      data_kpis.value.trainingParticipationRate = response.data.trainingParticipationRate;
    } catch (e) {
      error.value = true;
      console.error('Erreur lors du chargement des KPIs', e);
    } finally {
      loading.value = false;
    }
  }
  function fetchSessions() {
    dashboardService.getTrainingPlanSessions()
      .then((response) => {
        sessions.value = response.data;
      })
      .catch((e) => {
        console.error('Erreur lors du chargement des sessions', e);
      });
  }
  function fetchDirections(){
    dashboardService.getTrainingPlanDirections()
      .then((response) => {
        table_section_data.value = response.data;
      })
      .catch((e) => {
        console.error('Erreur lors du chargement des directions', e);
      });
  }
  function fetchChartDirections(){
    dashboardService.getTrainingPlanChartDirections()
      .then((response) => {
        direction_series_data.value = response.data;
      })
      .catch((e) => {
        console.error('Erreur lors du chargement des directions pour le graphique', e);
      });
  }
  const currentYear = ref<number | string>(new Date().getFullYear());
  function getMonthlyChartData(params?:{year: number | string}) {
    dashboardService.getMonthlyChart(params)
      .then((response) => {
        // Handle the response data for the monthly chart
        console.log('Monthly chart data:', response.data);
        data_monthly_chart.value = response.data;
      })
      .catch((e) => {
        console.error('Erreur lors du chargement des données mensuelles', e);
      });
  }
  watch(currentYear, (newYear:number | string) => {
    getMonthlyChartData({ year: newYear });
  });

  onMounted(()=>{
    fetchKPIs();
    fetchSessions();
    fetchDirections();
    fetchChartDirections();
    getMonthlyChartData({ year: currentYear.value });
  });
</script>