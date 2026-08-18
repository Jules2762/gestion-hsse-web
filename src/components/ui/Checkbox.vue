<script setup lang="ts">
interface Props {
  modelValue?: boolean
  label?: string
  disabled?: boolean
}

withDefaults(
  defineProps<Props>(),
  {
    label: '',
    disabled: false,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()
</script>

<template>
  <label class="
      flex
      cursor-pointer
      items-center
      gap-3
      normal-case
      tracking-normal
      select-none
    ">
    <input :checked="modelValue" :disabled="disabled" type="checkbox" class="
        h-4
        w-4
        rounded
        border-border
        text-primary
        focus:ring-2
      focus:ring-[#0F9D58]/20
      " @change="
        emit(
          'update:modelValue',
          ($event.target as HTMLInputElement)
            .checked
        )
        " />

    <span class="
        text-sm
        font-medium
        text-text-secondary
      ">
      {{ label }}
    </span>
  </label>
</template>