<script setup lang="ts">
import { computed, type Component } from 'vue'
import { Minus, TrendingDown, TrendingUp } from '@lucide/vue'
import type { ColorType } from '../../../@types/Dashboard.type'

type ThemeStyle = {
  card: string
  iconWrap: string
  icon: string
  ring: string
}

type Props = {
  title: string
  icon: Component
  value?: string | number
  /** Ligne secondaire sous la valeur (ex. « sur 24 questions ») */
  subtitle?: string
  /** Unité ou suffixe collé à la valeur (ex. « % », « h ») */
  unit?: string
  theme?: ColorType
  /** Variation par rapport à la période précédente */
  delta?: number
  /** Sens favorable de la variation. Une baisse des non-conformités est une bonne nouvelle. */
  deltaGoodWhen?: 'up' | 'down'
  deltaLabel?: string
  /** Rend la carte actionnable : elle devient un <button> et émet `click`. */
  clickable?: boolean
  /** État sélectionné, utile quand la carte sert de filtre. */
  selected?: boolean
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  deltaGoodWhen: 'up',
  deltaLabel: 'vs période précédente',
})

defineEmits<{ click: [] }>()

/* Classes en chaînes littérales : Tailwind scanne le source,
 * une classe construite dynamiquement ne serait jamais générée. */
const THEMES: Record<ColorType | 'default', ThemeStyle> = {
  default: { card: 'border-gray-200 bg-white', iconWrap: 'bg-gray-100', icon: 'text-gray-600', ring: 'ring-gray-400' },
  red: { card: 'border-red-300 bg-red-300/10', iconWrap: 'bg-red-300/25', icon: 'text-red-600', ring: 'ring-red-500' },
  green: { card: 'border-green-300 bg-green-300/10', iconWrap: 'bg-green-300/25', icon: 'text-green-600', ring: 'ring-green-500' },
  orange: { card: 'border-orange-300 bg-orange-300/10', iconWrap: 'bg-orange-300/25', icon: 'text-orange-600', ring: 'ring-orange-500' },
  blue: { card: 'border-blue-300 bg-blue-300/10', iconWrap: 'bg-blue-300/25', icon: 'text-blue-600', ring: 'ring-blue-500' },
  purple: { card: 'border-purple-300 bg-purple-300/10', iconWrap: 'bg-purple-300/25', icon: 'text-purple-600', ring: 'ring-purple-500' },
  pink: { card: 'border-pink-300 bg-pink-300/10', iconWrap: 'bg-pink-300/25', icon: 'text-pink-600', ring: 'ring-pink-500' },
  yellow: { card: 'border-yellow-300 bg-yellow-300/10', iconWrap: 'bg-yellow-300/25', icon: 'text-yellow-600', ring: 'ring-yellow-500' },
  indigo: { card: 'border-indigo-300 bg-indigo-300/10', iconWrap: 'bg-indigo-300/25', icon: 'text-indigo-600', ring: 'ring-indigo-500' },
  teal: { card: 'border-teal-300 bg-teal-300/10', iconWrap: 'bg-teal-300/25', icon: 'text-teal-600', ring: 'ring-teal-500' },
  cyan: { card: 'border-cyan-300 bg-cyan-300/10', iconWrap: 'bg-cyan-300/25', icon: 'text-cyan-600', ring: 'ring-cyan-500' },
  gray: { card: 'border-gray-300 bg-gray-300/10', iconWrap: 'bg-gray-300/25', icon: 'text-gray-600', ring: 'ring-gray-500' },
  slate: { card: 'border-slate-300 bg-slate-300/10', iconWrap: 'bg-slate-300/25', icon: 'text-slate-600', ring: 'ring-slate-500' },
}

const style = computed(() => THEMES[props.theme ?? 'default'])

const numberFormatter = new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 2 })

const displayValue = computed(() => {
  if (props.value === undefined || props.value === null) return '—'
  return typeof props.value === 'number' ? numberFormatter.format(props.value) : props.value
})

const trend = computed(() => {
  if (props.delta === undefined || props.delta === 0) {
    return { icon: Minus, tone: 'text-gray-600 bg-gray-100', sign: '' }
  }
  const isUp = props.delta > 0
  const isGood = isUp === (props.deltaGoodWhen === 'up')
  return {
    icon: isUp ? TrendingUp : TrendingDown,
    tone: isGood ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100',
    sign: isUp ? '+' : '−',
  }
})

const deltaText = computed(() =>
  props.delta === undefined ? '' : `${trend.value.sign}${numberFormatter.format(Math.abs(props.delta))}`,
)

const tag = computed(() => (props.clickable ? 'button' : 'div'))
</script>

<template>
  <component
    :is="tag"
    :type="clickable ? 'button' : undefined"
    :aria-pressed="clickable ? selected : undefined"
    class="flex h-full min-w-0 flex-col justify-between gap-5 rounded-lg border p-4 text-left transition-shadow"
    :class="[
      style.card,
      clickable && `cursor-pointer hover:shadow-md focus-visible:outline-none focus-visible:ring-2 ${style.ring}`,
      selected && `ring-2 ${style.ring}`,
    ]"
    @click="clickable && $emit('click')"
  >
    <!-- En-tête : titre sur 2 lignes max, icône toujours visible -->
    <div class="flex w-full items-start justify-between gap-x-3">
      <h5 class="line-clamp-2 min-w-0 text-sm font-medium leading-snug text-gray-600">{{ title }}</h5>

      <div class="shrink-0 rounded-full p-2" :class="style.iconWrap">
        <component :is="icon" :size="18" :class="style.icon" aria-hidden="true" />
      </div>
    </div>

    <!-- Squelette : même hauteur que le contenu réel, pas de saut de mise en page -->
    <div v-if="loading" class="flex flex-col gap-2" aria-busy="true">
      <div class="h-9 w-20 animate-pulse rounded bg-gray-200" />
      <div class="h-3 w-28 animate-pulse rounded bg-gray-100" />
    </div>

    <!-- Valeur toujours collée en bas : alignée d'une carte à l'autre -->
    <div v-else class="flex flex-col gap-1.5">
      <p class="flex items-baseline gap-1">
        <span class="text-3xl font-semibold leading-none tabular-nums text-gray-900">{{ displayValue }}</span>
        <span v-if="unit" class="text-lg font-medium leading-none text-gray-500">{{ unit }}</span>
      </p>

      <p v-if="subtitle" class="text-sm text-gray-500">{{ subtitle }}</p>

      <p v-if="delta !== undefined" class="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
        <span class="inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-medium" :class="trend.tone">
          <component :is="trend.icon" :size="12" aria-hidden="true" />
          {{ deltaText }}
        </span>
        <span class="text-gray-500">{{ deltaLabel }}</span>
      </p>
    </div>
  </component>
</template>