<template>
    <div class="flex flex-row items-center gap-2">
        <div class="relative">
            <component :is="icon" v-if="icon" :size="15" class="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input v-model="data" type="text" :placeholder="placeholder || 'Rechercher ...'"
                class="h-9 w-64 rounded-lg border border-gray-300 bg-white pl-8 pr-3 text-sm text-gray-700 placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
            <button v-if="data" @click="data = ''"
                class="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <XIcon :size="14" />
            </button>
        </div>
    </div>
</template>
<script setup lang="ts">
    import type { Component } from 'vue';
    import { computed } from 'vue'
    type propsType = {
        modelValue?: string | number,
        icon?: Component,
        placeholder?:string
    }
    const props = defineProps < propsType > ()
    const emit = defineEmits(["update:modelValue"])
    const data = computed({
        get: () => props.modelValue,
        set: (val) => {
            emit('update:modelValue', val)
        }
    })
</script>