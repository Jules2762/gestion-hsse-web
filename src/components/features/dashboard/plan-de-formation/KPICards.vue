<template>
    <!--
    5 cartes de même largeur :
    - mobile : 1 colonne
    - sm     : 2 colonnes (la 5e occupe toute la largeur)
    - lg+    : les 5 cartes sur une seule ligne
  -->
    <div class="w-full grid grid-cols-12  gap-3">
        <div v-for="(kpi,index) in kpis" :key="kpi.title" :class="[index < 4 ? 'col-span-3' : 'col-span-4']" class="flex min-w-0 *:w-full *:h-full  ">
            <Card :title="kpi.title" :theme="kpi.theme as ColorType" :icon="kpi.icon"  :value="kpi.value" :unit="kpi.unit"
                :loading="loading" />
          
        </div>
    </div>
</template>

<script lang="ts" setup>
    import { computed } from 'vue';
    import { useI18n } from 'vue-i18n';
    import { ClipboardCheck, Clock3, TargetIcon, TrendingUp, UsersIcon } from '@lucide/vue';
    import Card from '../Card.vue';
    import type { ColorType, DashboardTrainingPlanKPIs } from '../../../../@types/Dashboard.type.ts';

    const props = withDefaults(defineProps<DashboardTrainingPlanKPIs & { loading?: boolean }>(), {
        loading: false,
        sessionsCount: 0,
        totalTrainingHours: 0,
        trainingPlanCompletionRate: 0,
        totalParticipants: 0,
        overallParticipationRate: 0,
    });

    const { locale } = useI18n();

    const kpis = computed(() => [
        {
            title: locale.value === 'en' ? 'Completed Training Sessions' : 'Nombre de sessions réalisées',
            theme: 'green',
            icon: ClipboardCheck,
            value: props.sessionsCount,
            span: '',
        },
        {
            title: locale.value === 'en' ? 'Total Training Hours' : 'Nombre total des heures de formation',
            theme: 'red',
            icon: Clock3,
            value: props.totalTrainingHours,
            unit: 'h',
            span: '',
        },
        {
            title: locale.value === 'en' ? 'Training Plan Completion Rate' : 'Taux de réalisation du plan de formation',
            theme: 'blue',
            icon: TargetIcon,
            value: props.trainingPlanCompletionRate,
            unit: '%',
            span: '',
        },
        {
            title: locale.value === 'en' ? 'Total Participants' : 'Nombre de personnes ayant participé',
            theme: 'cyan',
            icon: UsersIcon,
            value: props.totalParticipants,
            span: '',
        },
        {
            title: locale.value === 'en' ? 'Overall Participation Rate' : 'Taux de participation global',
            theme: 'yellow',
            icon: TrendingUp,
            value: props.overallParticipationRate,
            unit: '%',
            span: '',
        },
        {
            title: locale.value === 'en' ? 'Unique Trained People' : 'Personnes ayant suivi au moins une formation',
            theme: 'blue',
            icon: UsersIcon,
            value: props.uniqueTrainedPeople,
            unit: '',
            span: '',
        },
        {
            title: locale.value === 'en' ? 'Unique Training Participation Rate' : 'Taux de personnes ayant participé à au moins une formation',
            theme: 'green',
            icon: TrendingUp,
            value: props.trainingParticipationRate,
            unit: '%',
            span: '',
        },
    ]);
</script>