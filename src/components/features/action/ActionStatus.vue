<template>
  <div
    :class="getStyleStatus"
    class="
      inline-flex
      items-center
      rounded-full
      px-3
      py-1
      text-xs
      font-semibold
      text-nowrap
    "
  >
    {{
      ActionStatusDataJson.find(
        item => item.value === name,
      )?.label
    }}
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

const getStyleStatus = computed(() => {
  switch (props.name) {
    case 'PENDING':
      return 'bg-amber-100 text-amber-700'

    case 'IN_PROGRESS':
      return 'bg-blue-100 text-blue-700'

    case 'FINISHED':
      return 'bg-green-100 text-green-700'

    default:
      return 'bg-slate-100 text-slate-700'
  }
})
</script>