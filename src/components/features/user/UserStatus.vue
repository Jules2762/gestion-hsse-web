<template>
  <div
    :class="statusClass"
    class="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap shadow-2xs"
  >
    <span class="w-1.5 h-1.5 rounded-full" :class="dotClass"></span>
    <span>
      {{
        UserStatusJsonData.find(
          item => item.value === name,
        )?.label || name
      }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { UserStatusType } from '../../../@types/User.type'
import { UserStatusJsonData } from '../../../@data/User.data'

type Props = {
  name: UserStatusType
}

const props = defineProps<Props>()

const statusClass = computed(() => {
  switch (props.name) {
    case 'ENABLED':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200'

    case 'DISABLED':
      return 'bg-rose-50 text-rose-700 border-rose-200'

    default:
      return 'bg-slate-50 text-slate-700 border-slate-200'
  }
})

const dotClass = computed(() => {
  switch (props.name) {
    case 'ENABLED':
      return 'bg-emerald-500'

    case 'DISABLED':
      return 'bg-rose-500'

    default:
      return 'bg-slate-400'
  }
})
</script>