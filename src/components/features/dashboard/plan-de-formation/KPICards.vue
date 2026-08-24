<template>
    <div class="w-full grid max-md:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-3">
        <Card title="Nombre de sessions réalisées" theme="green" :icon="ClipboardCheck" value="24"/>
        <Card title="Nombre total des heures de formation (h)" theme="red" :icon="Clock3" value="156"/>
        <Card title="Taux de réalisation du plan de formation" theme="blue" :icon="TargetIcon" value="83%"/>
        <Card title="Nombre de personnes ayant participé" theme="cyan" :icon="UsersIcon" value="112"/>
        <Card title="Taux de participation global" theme="yellow" :icon="TrendingUp" value="92%"/>
        
    </div>
</template>
<script lang="ts" setup>
import { ClipboardCheck, Clock3, TargetIcon, TrendingUp, UsersIcon } from '@lucide/vue';
import Card from '../Card.vue';


</script>