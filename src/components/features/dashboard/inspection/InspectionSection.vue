<template>
    <div class="flex flex-col gap-y-4 p-4">
        <div class="bg-white p-4 flex flex-col">
            <h3>Évolution des inspections</h3>
            <apexchart type="area" height="350" :options="options" :series="series"></apexchart>
        </div>
        <div class="grid grid-cols-4 gap-3">
            <Card title="Inspections réalisées" theme="green" value="156" :icon="ClipboardCheck"/>
            <Card title="Inspections en retard" theme="blue" value="156" :icon="ClockAlert"/>
            <Card title="Taux de conformité moyen" theme="red" value="156" :icon="ShieldCheck"/>
            <Card title="Non-conformités détectées" theme="cyan" value="156" :icon="TriangleAlert"/>
        </div>
        <div class="grid grid-cols-6 gap-3">
            <div class="col-span-4 bg-white p-4 h-fit">
                <h3>Conformité par catégorie</h3>
                <apexchart type="bar" :options="optionsConf" :series="seriesConf"></apexchart>
            </div>
            <div class="col-span-2 bg-white p-4">
                <Map/>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import Map from '../map/Map.vue';
import Card from '../Card.vue';
import { ClipboardCheck, ClockAlert, ShieldCheck, TriangleAlert } from '@lucide/vue';

const series = ref([
    
    { name: 'Inspection prevus', data: [65, 51, 77, 42,12] },
    { name: 'Inspection réalisées', data: [15, 11, 17, 22,2] },
])
const options = ref({
    chart: { type: 'bar' },
    xaxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May'] }
})
const seriesConf = ref([
    
    { name: 'Conformité par catégorie (%)', data: [65, 51, 77, 42] },
])
const optionsConf = ref({
    chart: { type: 'bar' },
    xaxis: { categories: ['Sécurité', 'Santé', 'Environnement', 'Qualité',] }
})
</script>