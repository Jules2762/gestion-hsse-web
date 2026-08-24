<template>
  <div
    :class="statusClass"
    class="
      inline-flex
      items-center
      rounded-full
      px-3
      py-1
      text-xs
      font-semibold
      border
    "
  >
    {{
      UserStatusJsonData.find(
        item => item.value === name,
      )?.label
    }}
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { UserStatusType } from '../../../@types/User.type';
import { UserStatusJsonData } from '../../../@data/User.data';


type Props = {
  name: UserStatusType
}

const props = defineProps<Props>()

const statusClass = computed(() => {
  switch (props.name) {
    case 'ENABLED':
      return `
        bg-green-100
        text-green-700
        border-green-200
      `

    case 'DISABLED':
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