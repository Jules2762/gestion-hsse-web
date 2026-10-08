<template>
  <div class="p-4 flex flex-col gap-y-4">
    <div v-if="error" role="alert"
      class="flex items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
      <span>Impossible de charger les indicateurs. Vérifie ta connexion puis réessaie.</span>
      <button type="button"
        class="shrink-0 rounded border border-red-300 bg-white px-3 py-1 font-medium hover:bg-red-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
        @click="fetchKPIs">
        Réessayer
      </button>
    </div>

    <KPICards v-bind="data_kpis" :loading="loading" />

    <!-- Personnes formées par direction -->
    <div class="grid grid-cols-1 xl:grid-cols-2 gap-4">
      <ChartCard title="Personnes formées par direction">
        <apexchart type="bar" height="320" :options="direction_options" :series="direction_series" />
      </ChartCard>

      <ChartCard title="Répartition des personnes formées par direction">
        <apexchart type="donut" height="320" :options="pie_options" :series="pie_series" />
      </ChartCard>
    </div>

    <!-- Tableau -->
    <ChartCard title="Détail par direction">
      <div class="overflow-x-auto">
        <table class="min-w-full text-sm">
          <thead>
            <tr class="text-left text-gray-500 border-b border-gray-200">
              <th class="py-2 pr-4 font-medium w-fit">Direction</th>
              
              <th class="py-2 font-medium ">personnes formées</th>
              <th class="py-2 font-medium w-8/12">Taux de personnes formées</th>
            </tr>
          </thead>
          <tbody>
            <template v-if="table_section_data.length">
              <tr v-for="item in table_section_data" :key="item.direction"
                class="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                  <td class="py-2.5 pr-4 font-medium text-gray-800 ">{{ item.direction }}</td>
                  <td class="py-2.5 pr-4 font-medium text-gray-800 ">{{ item.trained_per_direction}} <span class="text-gray-400 text-xs">/ {{ item.direction_personnel_count }}</span></td>
                  
               
                
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
            <tr v-else>
              <td colspan="3" class="py-8 text-center text-gray-400">
                Aucune donnée disponible pour le moment.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </ChartCard>
    <ChartCard title="">
      <div class="flex flex-row items-center justify-between">
        <h5 class="text-base font-semibold text-gray-800 mb-3">Nombre de formations par mois</h5>
       <select v-model="currentYear" class="border border-gray-300 rounded px-2 py-1 w-24 text-sm">
          <option v-for="year in years" :key="year" :value="year">
            {{ year }}
          </option>
        </select>
      </div>
      <apexchart type="bar" height="320" :options="monthly_options" :series="monthly_series" />
    </ChartCard>
    <!-- Sessions : barres horizontales pour que les intitulés longs restent lisibles -->
    <ChartCard title="Nombre de personnes formées par session">
      <apexchart type="bar" :height="session_height" :options="session_options" :series="session_series" />
    </ChartCard>
  </div>
</template>

<script setup lang="ts">
  import { computed, defineComponent, h, onMounted, ref, watch, type ComputedRef } from 'vue';
  import type { DashboardTrainingPlanChartDirectionType, DashboardTrainingPlanChartSessionType, DashboardTrainingPlanKPIs, DashboardTrainingPlanTableDirectionType } from '../../../../@types/Dashboard.type.ts';
  import dashboardService from '../../../../core/services/dashboard.service.ts';
  import KPICards from './KPICards.vue';

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
  const direction_series_data=ref<DashboardTrainingPlanChartDirectionType[]>([
   
  ]);
  const direction_series = computed(() => [
    { name: 'Personnes formées', data: direction_series_data.value.map((s) => s.trained) }
  ]);
  const direction_options = computed(() => ({
    chart: { ...baseChart, type: 'bar' },
    colors: ['#008FFB'],
    plotOptions: { bar: { borderRadius: 4, columnWidth: '45%' } },
    dataLabels: { enabled: true },
    grid: { borderColor: '#f1f1f1' },
    xaxis: { categories: direction_series_data.value.map((s) => s.name) },
    yaxis: { title: { text: 'Personnes' } },
  }));

  /* ---------- Répartition (donut) ---------- */
  const pie_series:ComputedRef<number[]> = computed(()=>direction_series_data.value.map((item)=>item.trained/data_kpis.value.totalParticipants*100));
  const pie_options = computed(() => ({
    chart: {
      ...baseChart,
      type: 'donut',
    },

    labels: direction_series_data.value.map(item => item.name),

    colors,

    legend: {
      show: true,
      position: 'bottom',
    },

    dataLabels: {
      formatter: (val: number) => `${val.toFixed(2)}%`,
    },

    tooltip: {
      y: {
        formatter: (val: number) => `${val.toFixed(2)}%`,
      },
    },

    plotOptions: {
      pie: {
        donut: {
          size: '60%',

          labels: {
            show: true,

            total: {
              show: true,
              label: 'Total',
              formatter: () => '100.00%',
            },

            value: {
              formatter: (val: string) => `${Number(val).toFixed(2)}%`,
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
  }))

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
    { name: 'Personnes formées', data: sessions.value.map((s) => s.count) },
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
    tooltip: { y: { formatter: (val: number) => `${val} personnes` } },
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
    { name: 'Terminés', data: data_monthly_chart.value.data.map((item)=>item.count) },
    { name: 'Plannifiés', data: data_monthly_chart.value.data.map((item)=>item.planned_count) },
    { name: 'Annulés', data: data_monthly_chart.value.data.map((item)=>item.canceled_count) }
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