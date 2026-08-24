<template>
  <div
    :class="statusClass"
    class="
      inline-flex
      items-center
      rounded-full
      border
      px-3
      py-1
      text-xs
      font-semibold
    "
  >
    {{
      ChecklistStatusJsonData.find(
        item => item.value === name,
      )?.label
    }}
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ChecklistStatusType } from '../../../@types/Checklist.type';
import { ChecklistStatusJsonData } from '../../../@data/Checklist.data';



const props = defineProps<{
  name: ChecklistStatusType
}>()

const statusClass = computed(() => {
  switch (props.name) {
    case 'DRAFT':
      return `
        bg-amber-100
        text-amber-700
        border-amber-200
      `

    case 'IN_PROGRESS':
      return `
        bg-blue-100
        text-blue-700
        border-blue-200
      `

    case 'COMPLETED':
      return `
        bg-green-100
        text-green-700
        border-green-200
      `

    case 'CANCELLED':
      return `
        bg-red-100
        text-red-700
        border-red-200
      `

    default:
      return `
        bg-slate-100
        text-slate-700
        border-slate-200
      `
  }
})
</script>