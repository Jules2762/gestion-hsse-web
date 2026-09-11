<script setup lang="ts">
import { Loader, LoaderCircle } from '@lucide/vue'
import { useSlots, type Component } from 'vue'

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'danger'
  | 'success'
  | 'ghost'
  |'icon'
  |'primary-icon'

export type ButtonSize =
  | 'sm'
  | 'md'
  | 'lg'

interface Props {
  variant?: ButtonVariant
  size?: ButtonSize
  type?: 'button' | 'submit' | 'reset'
  loading?: boolean
  disabled?: boolean
  fullWidth?: boolean
  leftIcon?: Component
  rightIcon?: Component
}

withDefaults(
  defineProps<Props>(),
  {
    variant: 'primary',
    size: 'md',
    type: 'button',
    loading: false,
    disabled: false,
    fullWidth: false,
  },
)

</script>

<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    
    :class="[
      size!='sm'?'min-w-50':'w-fit p-0 h-fit','inline-flex items-center justify-center gap-2 rounded-md font-semibold transition-all duration-200 ',

      fullWidth && 'w-full',

      loading || disabled
        ? 'cursor-not-allowed opacity-60'
        : '',

      size === 'sm' &&
        ' p-2 text-sm',

      size === 'md' &&
        'h-12 px-5 text-sm',

      size === 'lg' &&
        'h-14 px-6 text-base',

      variant === 'primary' &&
        'bg-primary text-white shadow-lg shadow-green-100 hover:bg-primary-dark',
      variant === 'primary-icon' &&
        'bg-primary text-white shadow-lg shadow-green-100 hover:bg-primary-dark',

      variant === 'secondary' &&
        'bg-slate-100 text-slate-700 hover:bg-slate-200',

      variant === 'outline' &&
        'border border-border bg-white text-text-primary hover:bg-slate-50',
     
      variant === 'danger' &&
        'bg-danger text-white hover:bg-red-600',

      variant === 'success' &&
        'bg-success text-white hover:bg-green-600',

      variant === 'ghost' &&
        'bg-transparent text-primary hover:bg-primary-light',
    ]"
  >
    <Loader
      v-if="loading"
      class="h-4 w-4 animate-spin"
    />

    <component
      :is="leftIcon"
      v-else-if="leftIcon"
      :size="18"
    />

    <slot v-if="variant!='icon'" />

    <component
      :is="rightIcon"
      v-if="!loading && rightIcon"
      class="h-4 w-4"
    />
  </button>
</template>