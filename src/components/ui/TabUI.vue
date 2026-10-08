<template>
    <div role="tablist" :aria-orientation="isHorizontal ? 'horizontal' : 'vertical'" class="bg-white border-gray-200 h-fit"
        :class="isHorizontal
                ? 'flex flex-row gap-x-2 overflow-x-auto overflow-y-hidden border-b px-4 pt-2'
                : 'sticky top-0 flex h-dvh w-80 shrink-0 flex-col gap-y-1 border-r p-4'
            " @keydown="onKeydown">
        <button v-for="(label, index) in tabData" :key="index"
            :ref="(el) => (tabs[index] = el as HTMLButtonElement | null)" type="button" role="tab"
            :aria-selected="index === data" :tabindex="index === data ? 0 : -1" class="flex shrink-0 items-center gap-x-2 whitespace-nowrap text-sm transition-colors
             focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60" :class="[
                isHorizontal
                    ? 'rounded-t px-3 py-2.5 -mb-px border-b-2'
                    : 'justify-between rounded px-3 py-2',
                index === data
                    ? isHorizontal
                        ? 'border-primary font-semibold text-primary'
                        : 'bg-slate-600/10 font-semibold text-slate-700'
                    : isHorizontal
                        ? 'border-transparent text-gray-600 hover:border-gray-300 hover:text-gray-900'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
            ]" @click="data = index">
            <span>{{ t(label) }}</span>

            <!-- Badge facultatif : affiché seulement si un compteur > 0 est fourni pour cet onglet -->
            <span v-if="badges?.[index] && index !== data"
                class="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-xs font-medium text-white"
                :aria-label="`${badges[index]} nouveaux éléments`">
                {{ badges[index] > 99 ? '99+' : badges[index] }}
            </span>
        </button>
    </div>
</template>

<script setup lang="ts">
    import { computed, ref } from 'vue'
    import { useI18n } from 'vue-i18n'

    type PropsType = {
        tabData: string[]
        modelValue?: number
        mode?: 'H' | 'V'
        /** Compteurs par onglet (même ordre que `tabData`). Pas de compteur si absent ou 0. */
        badges?: number[]
    }

    const props = withDefaults(defineProps<PropsType>(), {
        modelValue: 0,
        mode: 'H',
    })

    const emit = defineEmits<{ 'update:modelValue': [value: number] }>()

    const { t } = useI18n()

    const isHorizontal = computed(() => props.mode === 'H')

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
        const last = props.tabData.length - 1
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