<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { ActionEmailStatusDataJson, themeEmailStatus } from '../../../@data/Action.data';
import type { ActionEmailStatusType } from '../../../@types/Action.type';

type propsType = {
    status: ActionEmailStatusType
}
const props = defineProps<propsType>()
const { t, te } = useI18n()

const displayLabel = computed(() => {
    if (props.status && te(`status.${props.status}`)) {
        return t(`status.${props.status}`)
    }
    return ActionEmailStatusDataJson.find(item => item.value == props.status)?.label || props.status
})

const dotClass = computed(() => {
    return props.status === 'SENT' ? 'bg-emerald-500' : 'bg-amber-500';
});
</script>

<template>
    <div :class="themeEmailStatus(status)" class="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap shadow-2xs"> 
        <span class="w-1.5 h-1.5 rounded-full" :class="dotClass"></span>
        <span>{{ displayLabel }}</span>
    </div>
</template>