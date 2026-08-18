

<template>
  <div class="flex flex-col">
    <label
      v-if="label"
      class="
        text-xs
        font-semibold
        uppercase
        tracking-wider
        text-[#64748B]
        ml-2
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
        'flex h-14 items-center rounded-2xl border bg-white px-4 transition-all duration-200',

        error
          ? 'border-red-500'
          : 'border-[#E2E8F0]',

        disabled
          ? 'cursor-not-allowed bg-slate-50 opacity-60'
          : '',

        'focus-within:border-[#0F9D58]',
        'focus-within:ring-4',
        'focus-within:ring-[#E8F5EE]',
      ]"
    >
      <component
        :is="icon"
        v-if="icon"
        class="
          mr-3
          h-5
          w-5
          shrink-0
          text-[#94A3B8]
        "
      />

      <input
        :value="modelValue"
        :placeholder="placeholder"
        :type="type"
        :disabled="disabled"
        class="
          h-full
          w-full
          bg-transparent
          text-sm
          text-[#334155]
          outline-none
          placeholder:text-[#94A3B8]
        "
        v-model="data"
        :list="list_id"
      />
       <datalist :id="list_id">
            <option v-for="(item, index) in lists" :key="index" :value="item">{{ item }}</option>
        </datalist>

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
import { computed, type Component, type InputTypeHTMLAttribute } from 'vue'

type propsType= {
  modelValue?: string
  label?: string
  placeholder?: string
  type?: InputTypeHTMLAttribute
  icon?: Component
  error?: string
  disabled?: boolean
  required?: boolean,
  lists?:string[],
  list_id?:string
}

const props=withDefaults(
  defineProps<propsType>(),
  {
    modelValue: '',
    type: 'text',
    placeholder: '',
    error: '',
    disabled: false,
    required: false,
  },
)



const emit = defineEmits(["update:modelValue"])
const data=computed({
  get():string|undefined{
    return props.modelValue
  },
  set(value:string|undefined):void{
    emit("update:modelValue",value)
  }
  
})
</script>