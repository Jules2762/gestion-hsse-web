<template>
    <div class="flex flex-col gap-y-4">

        <!-- GROUPE 1 : TAUX DE RÉALISATION VMC -->
        <div class="flex flex-col gap-y-2">
            <div class="flex items-center justify-between">
                <h4 class="text-xs font-bold uppercase tracking-wider text-gray-500">
                    {{ locale === 'en' ? 'VMC Completion Rate' : 'Taux de réalisation VMC' }}
                </h4>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Card
                    title="VMC Réalisées"
                    theme="green"
                    :icon="ClipboardCheck"
                    :value="completedVmc"
                    :subtitle="`sur ${totalVmc} VMC au total`"
                    :loading="loading"
                />

                <Card
                    title="Taux de réalisation global"
                    theme="blue"
                    :icon="TrendingUp"
                    :value="completionRate"
                    unit="%"
                    :subtitle="`${completedVmc} VMC clôturées sur ${totalVmc}`"
                    :loading="loading"
                />

                <Card
                    title="Autres visites (En cours & Planifiées)"
                    theme="yellow"
                    :icon="Clock3"
                    :value="inProgressVmc + draftVmc"
                    :subtitle="`${inProgressVmc} en cours • ${draftVmc} planifiée(s)`"
                    :loading="loading"
                />
            </div>
        </div>

        <!-- GROUPE 2 : VISITES OPÉRATIONNELLES (SS, MAGASIN, AGENCE, CAMIONS) & REMONTÉES -->
        <div class="flex flex-col gap-y-2 mt-1">
            <div class="flex items-center justify-between">
                <h4 class="text-xs font-bold uppercase tracking-wider text-gray-500">
                    {{ locale === 'en' ? 'Visits by entity, Trucks & Safety reports' : 'Visites par entité, Camions & Remontées' }}
                </h4>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                <Card
                    title="Visites Station-Service (SS)"
                    theme="teal"
                    :icon="Building2"
                    :value="visitesSS"
                    subtitle="Pistes & boutiques"
                    :loading="loading"
                />

                <Card
                    title="Visites Magasins & Agences"
                    theme="orange"
                    :icon="Store"
                    :value="visitesMagasinAgence"
                    :subtitle="`${visitesMagasin} Magasin • ${visitesAgence} Agence`"
                    :loading="loading"
                />

                <Card
                    title="Inspections Camions"
                    theme="indigo"
                    :icon="Truck"
                    :value="visitesCamion"
                    subtitle="Camions-citernes transport"
                    :loading="loading"
                />

                <Card
                    title="Nombre de remontées"
                    theme="red"
                    :icon="AlertTriangle"
                    :value="totalRemontees"
                    subtitle="Safety Reports & écarts"
                    :loading="loading"
                />

                <Card
                    title="Taux de conformité des visites"
                    theme="cyan"
                    :icon="ShieldCheck"
                    :value="conformityRate"
                    unit="%"
                    subtitle="Points évalués conformes"
                    :loading="loading"
                />
            </div>
        </div>

    </div>
</template>

<script lang="ts" setup>
    import { useI18n } from 'vue-i18n';
    import {
        AlertTriangle,
        Building2,
        ClipboardCheck,
        Clock3,
        ShieldCheck,
        Store,
        TrendingUp,
        Truck,
    } from '@lucide/vue';
    import Card from '../Card.vue';
    import type { DashboardVmcKPIs } from '../../../../@types/Dashboard.type.ts';

    const { locale } = useI18n();

    withDefaults(defineProps<DashboardVmcKPIs & { loading?: boolean }>(), {
        loading: false,
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
</script>
