<template>
  <div class="p-4 flex flex-col gap-y-6">

    <!-- ALERTE D'ERREUR -->
    <div v-if="error" role="alert"
      class="flex items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
      <span>Impossible de charger les indicateurs VMC. Vérifiez la connexion puis réessayez.</span>
      <button type="button"
        class="shrink-0 rounded border border-red-300 bg-white px-3 py-1 font-medium hover:bg-red-100 transition"
        @click="fetchAllData">
        Réessayer
      </button>
    </div>

    <!-- 1. CARTES KPIS (TAUX DE RÉALISATION & VISITES OPÉRATIONNELLES) -->
    <VmcKPICards v-bind="data_kpis" :loading="loading" />

    <!-- 2. SECTION : TAUX DE RÉALISATION PAR DIRECTION & PAR PERSONNE -->
    <div class="flex flex-col gap-y-3">
      <div class="border-b border-gray-200 pb-2">
        <h3 class="text-base font-bold text-gray-800">Taux de réalisation VMC par Direction et par Personne</h3>
        <p class="text-xs text-gray-500">Suivi individuel et par département de l'exécution des visites managériales.</p>
      </div>

      <div class="grid grid-cols-1 xl:grid-cols-12 gap-4">

        <!-- PAR DIRECTION : GRAPHIQUE ET TABLEAU -->
        <ChartCard title="Taux de réalisation pour chaque Direction" class="xl:col-span-6 flex flex-col">
          <template v-if="loading">
            <DashboardSkeleton type="chart" :height="240" class="mb-4" />
            <DashboardSkeleton type="table" :rows="4" />
          </template>
          <template v-else>
            <apexchart type="bar" height="240" :options="directions_chart_options" :series="directions_chart_series" class="mb-4" />

            <div class="overflow-x-auto flex-1">
              <table class="min-w-full text-sm">
                <thead>
                  <tr class="text-left text-gray-500 border-b border-gray-200">
                    <th class="py-2 pr-3 font-medium">Direction</th>
                    <th class="py-2 pr-3 font-medium text-center">Réalisées</th>
                    <th class="py-2 pr-3 font-medium text-center">Total</th>
                    <th class="py-2 font-medium w-4/12">Taux</th>
                  </tr>
                </thead>
                <tbody>
                  <template v-if="directions_data.length">
                    <tr v-for="dir in directions_data" :key="dir.direction"
                      class="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition">
                      <td class="py-2.5 pr-3 font-medium text-gray-800">{{ dir.direction }}</td>
                      <td class="py-2.5 pr-3 font-semibold text-center text-green-600">{{ dir.completed }}</td>
                      <td class="py-2.5 pr-3 font-medium text-center text-gray-700">{{ dir.total }}</td>
                      <td class="py-2.5">
                        <div class="flex items-center gap-2">
                          <div class="h-2 flex-1 rounded-full bg-gray-100 overflow-hidden">
                            <div class="h-full rounded-full bg-blue-500" :style="{ width: `${dir.rate}%` }" />
                          </div>
                          <span class="w-11 text-right tabular-nums text-xs font-semibold text-gray-700">{{ dir.rate }}%</span>
                        </div>
                      </td>
                    </tr>
                  </template>
                  <tr v-else>
                    <td colspan="4" class="py-8 text-center text-gray-400">
                      Aucune donnée de direction disponible.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </template>
        </ChartCard>

        <!-- PAR PERSONNE : TABLEAU DÉTAILLÉ -->
        <ChartCard title="Nombre de VMC réalisé pour chaque personne et taux de réalisation" class="xl:col-span-6 flex flex-col">
          <template v-if="loading">
            <DashboardSkeleton type="table" :rows="6" />
          </template>
          <template v-else>
            <div class="mb-3">
              <input
                type="text"
                v-model="personSearch"
                placeholder="Filtrer une personne ou fonction..."
                class="w-full text-xs px-3 py-2 border border-gray-200 rounded-lg outline-none focus:border-primary"
              />
            </div>

            <div class="overflow-x-auto flex-1 max-h-[360px] overflow-y-auto">
              <table class="min-w-full text-sm">
                <thead class="sticky top-0 bg-white">
                  <tr class="text-left text-gray-500 border-b border-gray-200">
                    <th class="py-2 pr-3 font-medium">Personne</th>
                    <th class="py-2 pr-3 font-medium">Direction</th>
                    <th class="py-2 pr-3 font-medium text-center">Réalisées</th>
                    <th class="py-2 pr-3 font-medium text-center">Prévues</th>
                    <th class="py-2 font-medium w-3/12">Taux</th>
                  </tr>
                </thead>
                <tbody>
                  <template v-if="filteredPeople.length">
                    <tr v-for="person in filteredPeople" :key="person.id"
                      class="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition">
                      <td class="py-2.5 pr-3">
                        <p class="font-medium text-gray-800 leading-tight">{{ person.name }}</p>
                        <p class="text-xs text-gray-400 leading-tight">{{ person.fonction }}</p>
                      </td>
                      <td class="py-2.5 pr-3 text-xs text-gray-600 font-medium">{{ person.direction }}</td>
                      <td class="py-2.5 pr-3 font-semibold text-center text-green-600">{{ person.completed }}</td>
                      <td class="py-2.5 pr-3 font-medium text-center text-gray-700">{{ person.total }}</td>
                      <td class="py-2.5">
                        <div class="flex items-center gap-2">
                          <div class="h-2 flex-1 rounded-full bg-gray-100 overflow-hidden">
                            <div class="h-full rounded-full bg-emerald-500" :style="{ width: `${person.rate}%` }" />
                          </div>
                          <span class="w-11 text-right tabular-nums text-xs font-semibold text-gray-700">{{ person.rate }}%</span>
                        </div>
                      </td>
                    </tr>
                  </template>
                  <tr v-else>
                    <td colspan="5" class="py-8 text-center text-gray-400">
                      Aucune personne trouvée.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </template>
        </ChartCard>

      </div>
    </div>

    <!-- 3. SECTION : ÉVOLUTION ET VISITES PAR SITES -->
    <div class="flex flex-col gap-y-3">
      <div class="border-b border-gray-200 pb-2">
        <h3 class="text-base font-bold text-gray-800">Évolution des visites et répartition géographique</h3>
        <p class="text-xs text-gray-500">Suivi dans le temps et répartition par site opérationnel (Stations-Services, Magasins, Agences, Dépôts).</p>
      </div>

      <div class="grid grid-cols-1 xl:grid-cols-12 gap-4">

        <!-- ÉVOLUTION MENSUELLE -->
        <ChartCard title="" class="xl:col-span-7">
          <div class="flex flex-row items-center justify-between mb-3">
            <h5 class="text-base font-semibold text-gray-800">Évolution mensuelle des visites VMC</h5>
            <select v-model="currentYear" class="border border-gray-300 rounded px-2.5 py-1 text-sm bg-white outline-none focus:border-primary">
              <option v-for="year in years" :key="year" :value="year">
                {{ year }}
              </option>
            </select>
          </div>
          <DashboardSkeleton v-if="loading" type="chart" :height="300" />
          <apexchart v-else type="bar" height="300" :options="monthly_options" :series="monthly_series" />
        </ChartCard>

        <!-- SITES OPÉRATIONNELS -->
        <ChartCard title="Visites par site opérationnel" class="xl:col-span-5">
          <DashboardSkeleton v-if="loading" type="table" :rows="6" />
          <div v-else class="overflow-x-auto max-h-[340px] overflow-y-auto">
            <table class="min-w-full text-sm">
              <thead class="sticky top-0 bg-white">
                <tr class="text-left text-gray-500 border-b border-gray-200">
                  <th class="py-2 pr-3 font-medium">Site</th>
                  <th class="py-2 pr-3 font-medium text-center">Visites</th>
                  <th class="py-2 pr-3 font-medium text-center">Clôturées</th>
                  <th class="py-2 font-medium w-4/12">Taux</th>
                </tr>
              </thead>
              <tbody>
                <template v-if="sites_data.length">
                  <tr v-for="item in sites_data" :key="item.site"
                    class="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition">
                    <td class="py-2.5 pr-3 font-medium text-gray-800 text-xs">{{ item.site }}</td>
                    <td class="py-2.5 pr-3 font-semibold text-center text-gray-700">{{ item.total }}</td>
                    <td class="py-2.5 pr-3 font-medium text-center text-green-600">{{ item.completed }}</td>
                    <td class="py-2.5">
                      <div class="flex items-center gap-2">
                        <div class="h-2 flex-1 rounded-full bg-gray-100 overflow-hidden">
                          <div class="h-full rounded-full bg-primary" :style="{ width: `${item.rate}%` }" />
                        </div>
                        <span class="w-11 text-right tabular-nums text-xs font-semibold text-gray-700">{{ item.rate }}%</span>
                      </div>
                    </td>
                  </tr>
                </template>
                <tr v-else>
                  <td colspan="4" class="py-8 text-center text-gray-400">
                    Aucune visite par site enregistrée pour le moment.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </ChartCard>

      </div>

      <!-- CARTOGRAPHIE DES VISITES VMC -->
      <VmcMap />
    </div>

  </div>
</template>

<script setup lang="ts">
  import { computed, defineComponent, h, onMounted, ref, watch } from 'vue';
  import type {
    DashboardVmcDirectionType,
    DashboardVmcKPIs,
    DashboardVmcPersonType,
    DashboardVmcSiteType,
  } from '../../../../@types/Dashboard.type.ts';
  import dashboardService from '../../../../core/services/dashboard.service.ts';
  import VmcKPICards from './VmcKPICards.vue';
  import VmcMap from './VmcMap.vue';
  import DashboardSkeleton from '../DashboardSkeleton.vue';

  /* Composant conteneur de carte */
  const ChartCard = defineComponent({
    props: { title: { type: String, required: true } },
    setup(props, { slots }) {
      return () =>
        h('section', { class: 'bg-white rounded-lg border border-gray-200 p-4 min-w-0 shadow-sm' }, [
          props.title ? h('h3', { class: 'text-base font-semibold text-gray-800 mb-3' }, props.title) : null,
          slots.default?.(),
        ]);
    },
  });

  const loading = ref(false);
  const error = ref(false);
  const personSearch = ref('');

  const currentYear = ref(new Date().getFullYear());
  const years = computed(() => {
    const current = new Date().getFullYear();
    return Array.from({ length: 7 }, (_, i) => current - i);
  });

  /* 1. KPIs */
  const data_kpis = ref<DashboardVmcKPIs>({
    totalVmc: 0,
    completedVmc: 0,
    completionRate: 0,
    inProgressVmc: 0,
    draftVmc: 0,
    visitesSS: 0,
    visitesCamion: 0,
    visitesMagasinAgence: 0,
    visitesMagasin: 0,
    visitesAgence: 0,
    totalRemontees: 0,
    totalActions: 0,
    closedActions: 0,
    conformityRate: 100,
  });

  /* 2. Direction Data & Chart */
  const directions_data = ref<DashboardVmcDirectionType[]>([]);
  const directions_chart_series = computed(() => [
    {
      name: 'VMC Réalisées',
      data: directions_data.value.map(d => d.completed),
    },
    {
      name: 'VMC Prévues',
      data: directions_data.value.map(d => d.total),
    },
  ]);

  const directions_chart_options = computed(() => ({
    chart: {
      type: 'bar',
      toolbar: { show: false },
      fontFamily: 'inherit',
    },
    colors: ['#22c55e', '#3b82f6'],
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 4,
        columnWidth: '50%',
      },
    },
    xaxis: {
      categories: directions_data.value.map(d => d.direction),
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    legend: {
      position: 'top' as const,
      horizontalAlign: 'right' as const,
    },
    dataLabels: { enabled: false },
    grid: {
      borderColor: '#f1f5f9',
    },
  }));

  /* 3. People Data */
  const people_data = ref<DashboardVmcPersonType[]>([]);
  const filteredPeople = computed(() => {
    const q = personSearch.value.trim().toLowerCase();
    if (!q) return people_data.value;
    return people_data.value.filter(
      p =>
        p.name.toLowerCase().includes(q) ||
        p.direction.toLowerCase().includes(q) ||
        p.fonction.toLowerCase().includes(q)
    );
  });

  /* 4. Monthly Chart */
  const monthly_series = ref<{ name: string; data: number[] }[]>([
    { name: 'Clôturées', data: [] },
    { name: 'En cours', data: [] },
    { name: 'Planifiées', data: [] },
  ]);

  const monthly_options = ref({
    chart: {
      stacked: true,
      toolbar: { show: false },
      fontFamily: 'inherit',
    },
    colors: ['#22c55e', '#eab308', '#3b82f6'],
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 4,
        columnWidth: '55%',
      },
    },
    xaxis: {
      categories: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sept', 'Oct', 'Nov', 'Déc'],
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    legend: {
      position: 'top' as const,
      horizontalAlign: 'right' as const,
    },
    dataLabels: { enabled: false },
    grid: {
      borderColor: '#f1f5f9',
    },
  });

  /* 5. Sites Table */
  const sites_data = ref<DashboardVmcSiteType[]>([]);

  /* Récupération des données */
  function fetchKPIs() {
    return dashboardService.getVmcKPIs()
      .then(res => {
        data_kpis.value = res.data;
      })
      .catch(err => {
        console.error(err);
        error.value = true;
      });
  }

  function fetchDirections() {
    return dashboardService.getVmcDirections()
      .then(res => {
        directions_data.value = res.data;
      })
      .catch(err => {
        console.error(err);
        error.value = true;
      });
  }

  function fetchPeople() {
    return dashboardService.getVmcPeople()
      .then(res => {
        people_data.value = res.data;
      })
      .catch(err => {
        console.error(err);
        error.value = true;
      });
  }

  function fetchMonthly() {
    return dashboardService.getVmcMonthly({ year: currentYear.value })
      .then(res => {
        monthly_series.value = res.data.series;
        monthly_options.value = {
          ...monthly_options.value,
          xaxis: {
            ...monthly_options.value.xaxis,
            categories: res.data.categories,
          },
        };
      })
      .catch(err => {
        console.error(err);
        error.value = true;
      });
  }

  function fetchSites() {
    return dashboardService.getVmcSites()
      .then(res => {
        sites_data.value = res.data;
      })
      .catch(err => {
        console.error(err);
        error.value = true;
      });
  }

  function fetchAllData() {
    loading.value = true;
    error.value = false;
    Promise.allSettled([
      fetchKPIs(),
      fetchDirections(),
      fetchPeople(),
      fetchMonthly(),
      fetchSites(),
    ]).finally(() => {
      loading.value = false;
    });
  }

  onMounted(() => {
    fetchAllData();
  });

  watch(currentYear, () => {
    fetchMonthly();
  });
</script>
