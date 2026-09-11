<script setup lang="ts">
    import { ref } from 'vue';

    import Header from '../../../components/shared/Header.vue';
    import TabUI from '../../../components/ui/TabUI.vue';

    import GeneralSection from './sections/GeneralSection.vue';
    import PreferenceSection from './sections/PreferenceSection.vue';
    import EmailSection from './sections/EmailSection.vue';

    const tab = ref({
        index: 0,
        data: ["Générale", "Préférences", "E-mail"],
    })
</script>

<template>
    <div class="min-h-screen bg-background">
        <Header title="Paramètres" show-search />

        <div class="p-6 lg:p-8">

            <div class="mb-6 space-y-1">
                <h1 class="text-2xl font-bold tracking-tight text-text-primary md:text-3xl">
                    Paramètres
                </h1>
                <p class="text-sm text-text-secondary">
                    Configurez la plateforme et vos préférences personnelles.
                </p>
            </div>

            <div
                class="flex flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-sm md:flex-row">
                <TabUI mode="V" v-model="tab.index" :tab-data="tab.data" />

                <div class="w-full border-t border-border md:border-l md:border-t-0">
                    <GeneralSection v-if="tab.index === 0" />
                    <PreferenceSection v-if="tab.index === 1" />
                    <EmailSection v-if="tab.index === 2" />
                </div>
            </div>

        </div>
    </div>
</template>