<script setup lang="ts">
    import { Loader } from '@lucide/vue';
    import type { Component } from 'vue';

    type propsType = {
        text?: string,
        icon?: Component,
        isPrimary?: boolean,
        loading?: boolean,
        badge?: string
    }
    const props = defineProps<propsType>()
</script>

<template>
    <button class="ribbon-btn " :class="[isPrimary ? 'ribbon-btn-primary' : '', { 'ribbon-btn-disabled': loading }]"
        :disabled="loading">

        <component :is="icon" :size="18" v-if="!loading" />
        <Loader v-else class="animate-spin" />

        <span> {{ text }} </span>
        <span v-if="badge" class="ribbon-btn-count">{{ badge
            }}</span>
    </button>
</template>