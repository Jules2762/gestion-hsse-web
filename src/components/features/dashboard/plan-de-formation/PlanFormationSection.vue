<template>
  <div class="p-4 flex flex-col gap-y-4">
    <KPICards />

    <div class="flex flex-col gap-3">
      <div class="grid grid-cols-2 gap-4">
        <div class="bg-white rounded p-4 ">
          <h3>Personnes formées par direction</h3>
          <apexchart type="bar" :options="options" :series="series"></apexchart>
        </div>
        <div class="bg-white rounded p-4">
          <h3>Taux de personnes formées par direction</h3>
          <apexchart type="pie" :series="pie_series" :options="pie_options"></apexchart>
        </div>
      </div>
      <div class="w-full h-fit ">
        <table class="min-w-full">
          <thead>
            <tr>
              <th>Direction</th>
              <th>Absents à la formation</th>
              <th>Formées par direction</th>
            </tr>
          </thead>
          <tbody>
            <template v-if="table_section_data.length">
              <tr v-for="(item, index) in table_section_data" :key="index">
                <td>{{ item.direction }}</td>
                <td>{{ item.absent }}</td>
                <td>{{ item.formées }}</td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>

    </div>
    <div class="grid grid-cols-6 gap-4">
      <div class="bg-white rounded p-4 col-span-4 ">
        <h3>Nombre de formées par session</h3>
        <apexchart type="bar" :options="options_session" :series="series_session"></apexchart>
      </div>
    </div>


  </div>
</template>
<script setup lang="ts">


import KPICards from './KPICards.vue';
import { ref } from 'vue';
const colors = [
  '#008FFB', // Blue
  '#00E396', // Green
  '#FEB019', // Orange
  '#FF4560', // Red
  '#775DD0', // Purple
  '#546E7A', // Blue Grey
  '#26A69A', // Teal
  '#3F51B5', // Indigo
  '#8BC34A', // Light Green
  '#FF9800', // Deep Orange
  '#9C27B0', // Violet
  '#03A9F4', // Light Blue
  '#E91E63', // Pink
  '#CDDC39', // Lime
  '#607D8B', // Slate
  '#F44336', // Bright Red
  '#009688', // Dark Teal
  '#673AB7', // Deep Purple
  '#4CAF50', // Material Green
  '#FFC107', // Amber
]
const series = ref([{ name: 'Personnes formées', data: [44, 55, 41, 67, 22] },])
const options = ref({
  chart: { type: 'bar' },
  xaxis: { categories: ['RH', 'DG', 'HSSE', 'DCM', 'DAF'] }
})
const series_session = ref([{ name: 'Personnes formées', data: [44, 55, 41, 67, 22, 24, 33, 11, 44, 55, 45, 12, 13, 9] },])
const options_session = ref({
  chart: { type: 'bar' },
  colors: colors,
  plotOptions: {
    bar: {
      columnWidth: '45%',
      distributed: true,
    },
  },
  legend: {
    show: false,
  },
  xaxis: { categories: ['Sécurité chantier', 'Sûreté au quotidient', 'VMC (Middle Management)', 'Conduite Defensive', 'Bonne Pratique d\'Hygiène (BPH)', 'SMHSSE Contractants', 'HSSE Client B2B (Ravitailleurs)', 'Lutte antipollution (Operation de Bunkering)', 'Utilisation extincteur sur feux réels', 'Premiers secours (Equipe Agence)', 'Operations à risques (Transporteurs)', 'HSSE (Station Service)', 'HSSE (Baie de lavage & entretien)', 'ATEX'] }
})
const table_section_data = ref([
  {
    direction: "DG",
    absent: 2,
    formées: "5%"
  },
  {
    direction: "DAF",
    absent: 2,
    formées: "5%"
  },
  {
    direction: "DCM",
    absent: 2,
    formées: "5%"
  },
  {
    direction: "DSI",
    absent: 2,
    formées: "5%"
  },
  {
    direction: "DOP",
    absent: 2,
    formées: "5%"
  },
])
const pie_series = ref([42, 23, 15, 12, 8])
const pie_options = ref({
  chart: {
    width: 500,
    type: 'pie',
  },
  labels: ['DG', 'RH', 'HSSE', 'IT', 'TRANSPORT'],

  legend: {
    show: true,
  },
  plotOptions: {
    pie: {
      dataLabels: {
        external: {
          show: true,
        },
      },
    },
  },
  responsive: [
    {
      breakpoint: 480,
      options: {
        chart: {
          width: 320,
        },
      },
    },
  ],
})
</script>