<template>
  <div class="flex flex-col">
    <label
      v-if="label"
      class="
        ml-2
        text-xs
        font-semibold
        uppercase
        tracking-wider
        text-[#64748B]
      "
    >
      {{ label }}

      <span
        v-if="required"
        class="text-red-500"
      >
        *
      </span>
    </label>

    <div
      :class="[
        'flex h-10 items-center rounded-lg border bg-white px-3 transition-all duration-200',

        error
          ? 'border-red-500'
          : 'border-[#E2E8F0]',

        disabled
          ? 'cursor-not-allowed bg-slate-50 opacity-60'
          : '',

        'focus-within:border-[#0F9D58]',
        'focus-within:ring-2',
        'focus-within:ring-[#0F9D58]/20',
      ]"
    >
      <component
        :is="icon"
        v-if="icon"
        class="
          mr-2.5
          h-4
          w-4
          shrink-0
          text-[#94A3B8]
        "
      />

      <select
        v-model="data"
        :disabled="disabled"
        class="
          h-full
          w-full
          cursor-pointer
          appearance-none
          bg-transparent
          text-xs
          text-[#334155]
          outline-none
        "
      >
        <option
          value=""
          disabled
        >
          {{ placeholder }}
        </option>

        <option
          v-for="(item, index) in options"
          :key="index"
          :value="item.value"
        >
          {{ item.label }}
        </option>
      </select>

      <ChevronDown
        :size="18"
        class="text-[#94A3B8]"
      />
    </div>

    <p
      v-if="error"
      class="
        text-xs
        font-medium
        text-red-500
      "
    >
      {{ error }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { ChevronDown } from '@lucide/vue'
import {
  computed,
  type Component,
} from 'vue'

type Option = {
  label: string
  value: string
}

type Props = {
  modelValue?: string
  label?: string
  placeholder?: string
  icon?: Component
  error?: string
  disabled?: boolean
  required?: boolean
  options?: Option[]
}

const props = withDefaults(
  defineProps<Props>(),
  {
    modelValue: '',
    placeholder:
      'Sélectionner',
    error: '',
    disabled: false,
    required: false,
    options: () => [],
  },
)

const emit = defineEmits<{
  'update:modelValue': [string]
}>()

const data = computed({
  get() {
    return props.modelValue
  },

  set(value: string) {
    emit(
      'update:modelValue',
      value,
    )
  },
})
</script>