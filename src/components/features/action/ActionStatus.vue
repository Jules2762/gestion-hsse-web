<template>
  <div
    :class="statusClass"
    class="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap shadow-2xs"
  >
    <span class="w-1.5 h-1.5 rounded-full" :class="dotClass"></span>
    <span>
      {{
        ActionStatusDataJson.find(
          item => item.value === name,
        )?.label || name
      }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ActionStatusDataJson } from '../../../@data/Action.data'
import type { ActionStatusType } from '../../../@types/Action.type'

type Props = {
  name: ActionStatusType
}

const props = defineProps<Props>()

const statusClass = computed(() => {
  switch (props.name) {
    case 'PENDING':
      return 'bg-amber-50 text-amber-700 border-amber-200'

    case 'IN_PROGRESS':
      return 'bg-blue-50 text-blue-700 border-blue-200'

    case 'FINISHED':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200'

    default:
      return 'bg-slate-50 text-slate-700 border-slate-200'
  }
})

const dotClass = computed(() => {
  switch (props.name) {
    case 'PENDING':
      return 'bg-amber-500'

    case 'IN_PROGRESS':
      return 'bg-blue-500'

    case 'FINISHED':
      return 'bg-emerald-500'

    default:
      return 'bg-slate-400'
  }
})
</script>