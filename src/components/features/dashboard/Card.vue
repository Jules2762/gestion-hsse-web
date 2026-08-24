<template>
    <div class=" rounded p-4 grid grid-rows-2 gap-4" :class="themeClass">
        <div class="w-full flex flex-row items-center justify-between gap-x-3">
            <h5 class="text-gray-500">{{ title }}</h5>
            <div class="bg-primary/10 rounded-full p-2">
                <component :is="icon" class="text-primary" />
            </div>
        </div>
        <div>
            <h1 >{{ value }}</h1>
        </div>
    </div>
</template>
<script setup lang="ts">
import { computed, type Component } from 'vue'

type ColorType =
  | 'red'
  | 'green'
  | 'orange'
  | 'blue'
  | 'purple'
  | 'pink'
  | 'yellow'
  | 'indigo'
  | 'teal'
  | 'cyan'
  | 'gray'
  | 'slate'

type Props = {
    title: string
    icon: Component
    value?: string
    theme?: ColorType
}

const props = defineProps<Props>()

    const themeClass = computed(() => {
  switch (props.theme) {
    case 'red':
      return `
        border-1
        bg-red-300/5
        border-red-200
      `

    case 'green':
      return `
        border-1
        bg-green-300/5
        border-green-200
      `

    case 'orange':
      return `
        border-1
        bg-orange-300/5
        border-orange-200
      `

    case 'blue':
      return `
        border-1
        bg-blue-300/5
        border-blue-200
      `

    case 'purple':
      return `
        border-1
        bg-purple-300/5
        border-purple-200
      `

    case 'pink':
      return `
        border-1
        bg-pink-300/5
        border-pink-200
      `

    case 'yellow':
      return `
        border-1
        bg-yellow-300/5
        border-yellow-200
      `

    case 'indigo':
      return `
        border-1
        bg-indigo-300/5
        border-indigo-200
      `

    case 'teal':
      return `
        border-1
        bg-teal-300/5
        border-teal-200
      `

    case 'cyan':
      return `
        border-1
        bg-cyan-300/5
        border-cyan-200
      `

    case 'gray':
      return `
        border-1
        bg-gray-300/5
        border-gray-200
      `

    case 'slate':
      return `
        border-1
        bg-slate-300/5
        border-slate-200
      `

    default:
      return `
        border-1
        bg-white
        border-gray-200
      `
  }
})


</script>