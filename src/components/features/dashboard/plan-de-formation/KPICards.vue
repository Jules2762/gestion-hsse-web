<template>
    <div class="w-full grid grid-cols-4 gap-3">
        <Card title="Nombre de sessions réalisées" :icon="ClipboardCheck" value="24"/>
        <Card title="Nombre total des heures de formation (h)" :icon="Clock3" value="156"/>
        <Card title="Taux de réalisation du plan de formation" :icon="TargetIcon" value="83%"/>
        <Card title="Nombre de personnes ayant participé" :icon="UsersIcon" value="112"/>
        <Card title="Taux de participation global" :icon="TrendingUp" value="92%"/>
        
    </div>
</template>
<script lang="ts" setup>
import { ClipboardCheck, Clock3, TargetIcon, TrendingUp, UsersIcon } from '@lucide/vue';
import Card from '../Card.vue';


</script>