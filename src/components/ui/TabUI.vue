<template>
    <div role="tablist" :aria-orientation="isHorizontal ? 'horizontal' : 'vertical'" class="bg-white border-slate-200 h-fit"
        :class="isHorizontal
                ? 'flex flex-row items-center gap-2 overflow-x-auto pb-1 scrollbar-hide border-b px-4 sm:px-6 pt-2.5'
                : 'sticky top-0 flex h-dvh w-80 shrink-0 flex-col gap-y-1 border-r p-4'
            " @keydown="onKeydown">
        <button v-for="(item, index) in normalizedTabs" :key="index"
            :ref="(el) => (tabs[index] = el as HTMLButtonElement | null)" type="button" role="tab"
            :aria-selected="index === data" :tabindex="index === data ? 0 : -1"
            class="transition flex items-center gap-2 cursor-pointer whitespace-nowrap outline-none select-none focus-visible:ring-2 focus-visible:ring-primary/40"
            :class="[
                isHorizontal
                    ? 'pb-3 px-3 text-xs sm:text-sm font-bold border-b-2 -mb-[1px]'
                    : 'justify-between rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-bold',
                index === data
                    ? isHorizontal
                        ? 'border-primary text-primary font-black'
                        : 'bg-primary/10 text-primary font-black'
                    : isHorizontal
                        ? 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300 font-semibold'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-semibold'
            ]" @click="select(index)">
            <component
                v-if="item.icon"
                :is="item.icon"
                :size="16"
                class="shrink-0 transition-colors"
                :class="index === data ? 'text-primary' : 'text-slate-400 group-hover:text-slate-600'"
            />

            <span>{{ t(item.label) }}</span>

            <!-- Badge pill identique au centre d'aide -->
            <span
                v-if="item.badge !== undefined && item.badge !== null && item.badge !== false && item.badge !== 0"
                class="text-[10px] px-1.5 py-0.2 rounded-full font-semibold transition-colors"
                :class="index === data
                    ? 'bg-primary/10 text-primary'
                    : 'bg-slate-100 text-slate-600'"
                :aria-label="`${item.badge} éléments`"
            >
                {{ typeof item.badge === 'number' && item.badge > 99 ? '99+' : item.badge }}
            </span>
        </button>
    </div>
</template>

<script setup lang="ts">
    import { computed, ref } from 'vue'
    import { useI18n } from 'vue-i18n'

    export type TabItem = {
        key?: string
        label: string
        icon?: any
        badge?: string | number | boolean
        component?: any
    }

    type PropsType = {
        tabData?: (string | TabItem)[]
        tabs?: TabItem[]
        modelValue?: number
        mode?: 'H' | 'V'
        /** Compteurs par onglet (même ordre que tabData/tabs). Pas de compteur si absent ou 0. */
        badges?: (number | string)[]
    }

    const props = withDefaults(defineProps<PropsType>(), {
        modelValue: 0,
        mode: 'H',
    })

    const emit = defineEmits<{ 'update:modelValue': [value: number] }>()

    const { t } = useI18n()

    const isHorizontal = computed(() => props.mode === 'H')

    const normalizedTabs = computed<TabItem[]>(() => {
        const raw = props.tabs || props.tabData || []
        return raw.map((item, index) => {
            if (typeof item === 'string') {
                return {
                    label: item,
                    badge: props.badges?.[index],
                    icon: undefined,
                }
            }
            return {
                ...item,
                badge: item.badge !== undefined ? item.badge : props.badges?.[index],
            }
        })
    })

    const data = computed<number>({
        get: () => props.modelValue,
        set: (value) => emit('update:modelValue', value),
    })

    /* Navigation clavier : flèches, Début, Fin (pattern WAI-ARIA « tabs ») */
    const tabs = ref<(HTMLButtonElement | null)[]>([])

    function select(index: number) {
        data.value = index
        tabs.value[index]?.focus()
    }

    function onKeydown(event: KeyboardEvent) {
        const last = normalizedTabs.value.length - 1
        const next = isHorizontal.value ? 'ArrowRight' : 'ArrowDown'
        const prev = isHorizontal.value ? 'ArrowLeft' : 'ArrowUp'

        if (event.key === next) select(data.value >= last ? 0 : data.value + 1)
        else if (event.key === prev) select(data.value <= 0 ? last : data.value - 1)
        else if (event.key === 'Home') select(0)
        else if (event.key === 'End') select(last)
        else return

        event.preventDefault()
    }
</script>
