<template>
  <div class="flex flex-col">
    <label v-if="label" class="
        text-xs
        font-semibold
        uppercase
        tracking-wider
        text-text-secondary
        ml-2
      ">
      {{ label }}

      <span v-if="required" class="text-red-500">
        *
      </span>
    </label>

    <div :class="[
      'flex h-10 items-center rounded-lg border bg-white px-3 transition-all duration-200',

      error
        ? 'border-red-500'
        : 'border-border',

      disabled
        ? 'cursor-not-allowed bg-slate-50 opacity-60'
        : '',

      'focus-within:border-primary',
      'focus-within:ring-2',
      'focus-within:ring-primary/20',
    ]">
      <component :is="icon" v-if="icon" class="
          mr-2.5
          h-4
          w-4
          shrink-0
          text-text-muted
        " />

      <input :placeholder="placeholder" :min="min" :max="max" :type="type" :disabled="disabled" :inputMode="inputMode" class="
          h-full
          w-full
          bg-transparent
          text-xs
          text-text-primary
          outline-none
          placeholder:text-text-muted
        " v-model="data" :list="list_id" />
      <datalist :id="list_id">
        <option v-for="(item, index) in lists" :key="index" :value="item">{{ item }}</option>
      </datalist>

    </div>

    <p v-if="error" class="
        text-xs
        font-medium
        text-red-500
      ">
      {{ error }}
    </p>
  </div>
</template>
<script setup lang="ts">
  import { computed, type Component, type InputTypeHTMLAttribute } from 'vue'
  type inputModeType = "text"
    | "decimal"
    | "email"
    | "numeric"
    | "tel"
    | "search"
    | "url"
    | "none"
    | undefined;
  type propsType = {
    modelValue?: string | number
    label?: string
    placeholder?: string
    type?: InputTypeHTMLAttribute,
    inputMode?: inputModeType,
    icon?: Component
    error?: string
    disabled?: boolean
    required?: boolean,
    lists?: string[],
    list_id?: string,
    min?: number | string
    max?: number | string
  }

  const props = withDefaults(
    defineProps<propsType>(),
    {
      modelValue: '',
      type: 'text',
      placeholder: '',
      error: '',
      disabled: false,
      required: false,
      inputMode: undefined,
      min: 0,
      max: undefined,
    },
  )


  const emit = defineEmits(["update:modelValue"])
  const data = computed({
    get(): string | number | undefined {
      return props.modelValue
    },
    set(value: string | undefined): void {
      emit("update:modelValue", value)
    }

  })
</script>