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
      'flex h-14 items-center rounded-2xl border bg-white px-4 transition-all duration-200',

      error
        ? 'border-red-500'
        : 'border-border',

      disabled
        ? 'cursor-not-allowed bg-slate-50 opacity-60'
        : '',

      'focus-within:border-primary',
      'focus-within:ring-4',
      'focus-within:ring-[#E8F5EE]',
    ]">
      <component :is="icon" v-if="icon" class="
          mr-3
          h-5
          w-5
          shrink-0
          text-text-muted
        " />

      <input :placeholder="placeholder" :min="min" :type="type" :disabled="disabled" :inputmode="inputMode" class="
          h-full
          w-full
          bg-transparent
          text-sm
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
    min?:number
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
      min:0
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