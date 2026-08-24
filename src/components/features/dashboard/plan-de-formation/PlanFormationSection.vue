<template>
  <div class="p-4 flex flex-col gap-y-4">
    <KPICards />

    <div class="grid grid-cols-2 gap-x-3">
      <div class="flex flex-col gap-4">
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



  </div>
</template>
<script setup lang="ts">


import KPICards from './KPICards.vue';
import { ref } from 'vue';

const series = ref([{ name: 'Personnes formées', data: [44, 55, 41, 67, 22] },])
const options = ref({
  chart: { type: 'bar' },
  xaxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May'] }
})
const table_section_data = ref([
  {
    direction: "DG",
    absent: 2,
    formées: "5%"
  },
  {
    direction: "DG",
    absent: 2,
    formées: "5%"
  },
  {
    direction: "DG",
    absent: 2,
    formées: "5%"
  },
  {
    direction: "DG",
    absent: 2,
    formées: "5%"
  },
  {
    direction: "DG",
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
    show: false,
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