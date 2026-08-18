<script setup lang="ts">
import { AlertTriangle, BadgeCheck, CalendarCheck2Icon, CalendarDays, ClipboardCheck, ClipboardPen, Clock3, ClockAlert, Eye, ShieldAlert, ShieldCheck, Siren, Target, TriangleAlert, Users } from '@lucide/vue';
import Card from '../Card.vue';
import { ref } from 'vue';
const series = ref([
    { name: 'Formation', data: [4, 50, 41, 7, 28] },
    { name: 'Inspection', data: [44, 55, 41, 67, 22] },
    { name: 'Conformité', data: [41, 52, 4, 69, 32] },
    { name: 'Action Correctives', data: [48, 5, 1, 6, 20] },
    { name: 'Incidents', data: [28, 25, 21, 26, 20] },
])
const options = ref({
    chart: { type: 'line', },

    xaxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May'] }
})
const seriesRep = ref([
    { name: 'DG', data: [4, 50, 41, 7, 28, 58, 38, 40] },
    { name: 'Finance', data: [4, 50, 41, 7, 28, 58, 38, 40] },
    { name: 'RH', data: [4, 50, 41, 7, 28, 58, 38, 40] },
    { name: 'Opérations', data: [14, 25, 11, 17, 18, 51, 31, 10] },
    { name: 'Logistique', data: [42, 5, 4, 7, 8, 5, 8, 4] },
   
])
const optionsRep = ref({
    chart: { type: 'bar', },

    xaxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Juin', 'Juillet', 'Aout'] }
})
</script>

<template>
    <div class="flex flex-col gap-y-4 p-4">

        <div class="grid grid-cols-4 gap-3">
            <Card title="Taux de réalisation du plan" value="56" :icon="Target" />
            <Card title="Inspections réalisées" value="56" :icon="ClipboardCheck" />
            <Card title="Taux de conformité global" value="56" :icon="ShieldCheck" />
            <Card title="Actions ouvertes" value="56" :icon="ClipboardPen" />
        </div>
        <div class="bg-white gap-y-3 p-4 ">
            <h3>Performance HSSE Globale</h3>
            <apexchart type="line" height="400" :options="options" :series="series"></apexchart>
        </div>
        <div class="grid grid-cols-2 gap-3">
            <div class="bg-white p-4">
                <h3>Dernières inspections</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Intitulé</th>
                            <th>Inspecteur</th>
                            <th>Taux de conformité</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Inspection voiture</td>
                            <td>Raholisoa</td>
                            <td>80%</td>
                        </tr>
                        <tr>
                            <td>Inspection voiture</td>
                            <td>Raholisoa</td>
                            <td>80%</td>
                        </tr>
                        <tr>
                            <td>Inspection voiture</td>
                            <td>Raholisoa</td>
                            <td>80%</td>
                        </tr>
                        <tr>
                            <td>Inspection voiture</td>
                            <td>Raholisoa</td>
                            <td>80%</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="bg-white p-4">
                <h3>Dernières actions correction</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Inspection</th>
                            <th>Action</th>
                            <th>Responsable</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Inspection voiture</td>
                            <td>Raholisoa</td>
                            <td>80%</td>
                        </tr>
                        <tr>
                            <td>Inspection voiture</td>
                            <td>Raholisoa</td>
                            <td>80%</td>
                        </tr>
                        <tr>
                            <td>Inspection voiture</td>
                            <td>Raholisoa</td>
                            <td>80%</td>
                        </tr>
                        <tr>
                            <td>Inspection voiture</td>
                            <td>Raholisoa</td>
                            <td>80%</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div class="bg-white p-4">
            <h3>Performance par direction</h3>
             <apexchart type="bar" height="400" :options="optionsRep" :series="seriesRep"></apexchart>
        </div>
       
    </div>
</template>