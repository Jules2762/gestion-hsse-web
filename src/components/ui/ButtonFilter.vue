<script setup lang="ts">
    import { Loader } from '@lucide/vue';
    import type { Component } from 'vue';
    import { useI18n } from 'vue-i18n';

    type propsType = {
        text?: string,
        icon?: Component,
        isPrimary?: boolean,
        loading?: boolean,
        badge?: string
    }
    const props = defineProps<propsType>()
    const { t, te } = useI18n();

    const displayText = (val?: string) => {
        if (!val) return '';
        if (te(val)) return t(val);
        const map: Record<string, string> = {
            'Ajout': t('common.add'),
            'Ajouter': t('common.add'),
            'Créer': t('common.create'),
            'Importer': t('common.import'),
            'Export': t('common.export'),
            'Exporter': t('common.export'),
            'Modifier': t('common.edit'),
            'Supprimer': t('common.delete'),
            'Détails': t('common.details'),
            'Filtres': t('common.filters'),
            'Filtre': t('common.filters'),
            'Templates': t('inspections.templates.title'),
            'Modèles': t('inspections.templates.title'),
            'Actualiser': t('common.refresh'),
            'Retour': t('common.back'),
            'Enregistrer': t('common.save'),
            'Annuler': t('common.cancel'),
            'Fermer': t('common.close'),
        };
        return map[val] || val;
    };
</script>

<template>
    <button class="ribbon-btn " :class="[isPrimary ? 'ribbon-btn-primary' : '', { 'ribbon-btn-disabled': loading }]"
        :disabled="loading">

        <component :is="icon" :size="18" v-if="!loading" />
        <Loader v-else class="animate-spin" />

        <span> {{ displayText(text) }} </span>
        <span v-if="badge" class="ribbon-btn-count">{{ badge }}</span>
    </button>
</template>