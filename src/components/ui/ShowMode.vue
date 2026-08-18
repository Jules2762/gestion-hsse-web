<template>
  <div
    class="
      flex
      items-center
      rounded-xl
      border
      border-border
      bg-white
      p-1
      w-23.2
    "
  >
    <button
      @click="data = 0"
      class="
        rounded-lg
        p-3
        transition-colors
      "
      :class="
        data === 0
          ? 'bg-primary text-white'
          : 'text-text-secondary hover:bg-slate-100'
      "
    >
      <Table2 :size="18" />
    </button>

    <button
      @click="data = 1"
      class="
        rounded-lg
        p-3
        transition-colors
      "
      :class="
        data === 1
          ? 'bg-primary text-white'
          : 'text-text-secondary hover:bg-slate-100'
      "
    >
      <LayoutGrid :size="18" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { Table2, LayoutGrid } from '@lucide/vue'
import { computed } from 'vue'

type Props = {
  modelValue: number
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [number]
}>()

const data = computed({
  get: () => props.modelValue,
  set: (value: number) => {
    emit('update:modelValue', value)
  },
})
</script>