<template>
  <div
    :class="statusClass"
    class="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap shadow-2xs"
  >
    <span class="w-1.5 h-1.5 rounded-full" :class="dotClass"></span>
    <span>{{ displayLabel }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { ChecklistStatusType } from '../../../@types/Checklist.type'
import { ChecklistStatusJsonData } from '../../../@data/Checklist.data'

const props = defineProps<{
  name: ChecklistStatusType
}>()

const { t, te } = useI18n()

const displayLabel = computed(() => {
  if (props.name && te(`status.${props.name}`)) {
    return t(`status.${props.name}`)
  }
  return ChecklistStatusJsonData.find(item => item.value === props.name)?.label || props.name
})


const statusClass = computed(() => {
  switch (props.name) {
    case 'DRAFT':
      return 'bg-amber-50 text-amber-700 border-amber-200'

    case 'IN_PROGRESS':
      return 'bg-blue-50 text-blue-700 border-blue-200'

    case 'COMPLETED':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200'

    case 'CANCELLED':
      return 'bg-rose-50 text-rose-700 border-rose-200'

    default:
      return 'bg-slate-50 text-slate-700 border-slate-200'
  }
})

const dotClass = computed(() => {
  switch (props.name) {
    case 'DRAFT':
      return 'bg-amber-500'

    case 'IN_PROGRESS':
      return 'bg-blue-500'

    case 'COMPLETED':
      return 'bg-emerald-500'

    case 'CANCELLED':
      return 'bg-rose-500'

    default:
      return 'bg-slate-400'
  }
})
</script>