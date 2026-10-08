<template>
    <div class="relative">
        <!-- Click-outside overlay to close any open popover -->
        <div v-if="openFilter" class="fixed inset-0 z-40" @click="openFilter = null" />

        <div class="px-4 pb-3 flex flex-row flex-wrap items-center gap-2 min-h-9">
            <span class="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-gray-400 mr-1">
                <SlidersHorizontalIcon :size="13" />
                Filtres
            </span>

            <!-- Date range filter pill -->
            <div v-if="showDateFilter" class="relative">
                <button class="filter-pill" :class="{ 'filter-pill-active': hasDateFilter }"
                    @click.stop="toggleFilter('__date__')">
                    <CalendarIcon :size="13" />
                    <span>{{ dateFilterLabel }}</span>
                    <ChevronDownIcon :size="13" />
                </button>

                <div v-if="openFilter === '__date__'" class="popover w-64 " @click.stop>
                    <p class="popover-title">Filtrer par {{ dateLabel.toLowerCase() }}</p>
                    <div class="flex flex-col gap-2 px-1">
                        <ChipInputFilter type="date" label="Du" v-model="dateRange.from" />
                        <ChipInputFilter type="date" label="Au" v-model="dateRange.to" />
                    </div>
                    <div class="popover-footer">
                        <button class="popover-clear" @click="clearDate">Effacer</button>
                        <button class="popover-ok" @click="openFilter = null">OK</button>
                    </div>
                </div>
            </div>

            <!-- Quick column filter pills -->
            <div v-for="key in filterableKeys" :key="key" class="relative">
                <button class="filter-pill" :class="{ 'filter-pill-active': (filters[key] ?? []).length }"
                    @click.stop="toggleFilter(key)">
                    <span>{{ columnLabels[key] }}</span>
                    <span v-if="(filters[key] ?? []).length" class="filter-pill-count">{{ filters[key].length }}</span>
                    <ChevronDownIcon :size="13" />
                </button>

                <div v-if="openFilter === key" class="popover min-w-56 max-w-120 w-fit" @click.stop>
                    <p class="popover-title">{{ columnLabels[key] }}</p>
                    <input v-model="filterSearch" type="text" placeholder="Rechercher..." class="popover-input mb-2" />
                    <div class="max-h-44 overflow-y-auto pr-1 flex flex-col gap-0.5">
                        <label v-for="val in optionsFor(key)" :key="val"
                            class="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer">
                            <input type="checkbox" :checked="(filters[key] ?? []).includes(val)"
                                @change="toggleValue(key, val)" class="rounded border-gray-300 text-primary" />
                            <span class="truncate normal-case text-gray-500">{{ val }}</span>
                        </label>
                        <p v-if="optionsFor(key).length === 0" class="px-2 py-2 text-xs text-gray-400">
                            Aucun résultat
                        </p>
                    </div>
                    <div class="popover-footer">
                        <button class="popover-clear" @click="clearColumn(key)">Effacer</button>
                        <button class="popover-ok" @click="openFilter = null">OK</button>
                    </div>
                </div>
            </div>

            <!-- Active filter chips -->
            <template v-if="activeFilterChips.length">
                <div class="w-px h-4 bg-gray-300 mx-1" />
                <span v-for="chip in activeFilterChips" :key="chip.key + chip.value" class="chip">
                    <span class="text-gray-400">{{ chip.label }}:</span> {{ chip.value }}
                    <button @click="removeChip(chip)" class="chip-remove">
                        <XIcon :size="11" />
                    </button>
                </span>
                <button class="text-xs font-medium text-primary hover:underline ml-1" @click="$emit('clear-all')">
                    Réinitialiser
                </button>
            </template>

            <span class="ml-auto text-xs text-gray-400 whitespace-nowrap">
                {{ resultsCount }} / {{ resultsTotal }} résultat{{ resultsTotal > 1 ? 's' : '' }}
            </span>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { computed, ref } from 'vue'
    import { CalendarIcon, ChevronDownIcon, SlidersHorizontalIcon, XIcon } from '@lucide/vue'
    import ChipInputFilter from './ChipInputFilter.vue'

    type DateRangeValue = { from: string; to: string }

    type propsType = {
        /**
         *   Ordered list of filterable column keys (e.g. ['type', 'volet', 'trainer', 'target'])
         * */
        filterableKeys: string[]
        /**  Display label per column key (e.g. { type: 'Type', volet: 'Volet' }) 
        */
        columnLabels: Record<string, string>
        /**  Selected values per column key — mutated directly by this component (push/splice), pass a reactive object */
        filters: Record<string, string[]>
        /** Unique available values per column key, computed by the parent from its own data source  */
        columnOptions: Record<string, string[]>
        /** Optional date range — mutated directly by this component, pass a reactive object  */
        dateRange?: DateRangeValue
        showDateFilter?: boolean
        dateLabel?: string
        resultsCount?: number
        resultsTotal?: number
    }

    const props = withDefaults(defineProps<propsType>(), {
        dateRange: () => ({ from: '', to: '' }),
        showDateFilter: true,
        dateLabel: 'Date',
        resultsCount: 0,
        resultsTotal: 0,
    })

    defineEmits<{
        (e: 'clear-all'): void
    }>()

    // Which popover is currently open ('__date__', a column key, or null)
    const openFilter = ref<string | null>(null)
    // Local search text used to filter the checkbox list inside an open column popover
    const filterSearch = ref('')

    const hasDateFilter = computed(() => !!(props.dateRange.from || props.dateRange.to))

    const dateFilterLabel = computed(() =>
        hasDateFilter.value
            ? `${props.dateRange.from || '…'} → ${props.dateRange.to || '…'}`
            : props.dateLabel,
    )

    type Chip = { key: string; label: string; value: string }

    const activeFilterChips = computed<Chip[]>(() => {
        const chips: Chip[] = []
        if (hasDateFilter.value) {
            chips.push({ key: '__date__', label: props.dateLabel, value: dateFilterLabel.value })
        }
        for (const key of props.filterableKeys) {
            for (const value of props.filters[key] ?? []) {
                chips.push({ key, label: props.columnLabels[key], value })
            }
        }
        return chips
    })

    function toggleFilter(key: string) {
        filterSearch.value = ''
        openFilter.value = openFilter.value === key ? null : key
    }

    function optionsFor(key: string): string[] {
        const list = props.columnOptions[key] ?? []
        if (!filterSearch.value) return list
        const q = filterSearch.value.toLowerCase()
        return list.filter(v => v.toLowerCase().includes(q))
    }

    function toggleValue(key: string, value: string) {
        const arr = props.filters[key]
        if (!arr) return
        const i = arr.indexOf(value)
        if (i > -1) arr.splice(i, 1)
        else arr.push(value)
    }

    function clearColumn(key: string) {
        const arr = props.filters[key]
        if (arr) arr.length = 0
    }

    function clearDate() {
        props.dateRange.from = ''
        props.dateRange.to = ''
    }

    function removeChip(chip: Chip) {
        if (chip.key === '__date__') {
            clearDate()
            return
        }
        const arr = props.filters[chip.key]
        if (!arr) return
        const i = arr.indexOf(chip.value)
        if (i > -1) arr.splice(i, 1)
    }
</script>

<style scoped>
/* ======================= Filter pills ======================= */
.filter-pill {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    padding: 0.3rem 0.6rem;
    border-radius: 9999px;
    border: 1px solid #e5e7eb;
    background-color: #fff;
    font-size: 0.75rem;
    color: #4b5563;
    transition: all 0.15s ease;
}

.filter-pill:hover {
    border-color: #d1d5db;
    background-color: #f9fafb;
}

.filter-pill-active {
    border-color: theme('colors.primary', #4f46e5);
    background-color: rgba(79, 70, 229, 0.06);
    color: theme('colors.primary', #4f46e5);
}

.filter-pill-count {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 1rem;
    height: 1rem;
    padding: 0 0.25rem;
    border-radius: 9999px;
    background-color: theme('colors.primary', #4f46e5);
    color: #fff;
    font-size: 0.65rem;
    font-weight: 600;
}

/* ======================= Chips ======================= */
.chip {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    padding: 0.25rem 0.5rem;
    border-radius: 9999px;
    background-color: #f3f4f6;
    font-size: 0.72rem;
    color: #374151;
}

.chip-remove {
    display: flex;
    align-items: center;
    color: #9ca3af;
}

.chip-remove:hover {
    color: #374151;
}

/* ======================= Popover ======================= */
.popover {
    position: absolute;
    top: calc(100% + 0.4rem);
    left: 0;
    z-index: 60;
    background-color: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 0.75rem;
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05);
    padding: 0.65rem;
}

.popover-title {
    font-size: 0.7rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.03em;
    color: #9ca3af;
    padding: 0 0.25rem 0.4rem;
}

.popover-input {
    width: 100%;
    height: 2rem;
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    padding: 0 0.6rem;
    font-size: 0.8rem;
    outline: none;
}

.popover-input:focus {
    border-color: theme('colors.primary', #4f46e5);
    box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.15);
}

.popover-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 0.5rem;
    margin-top: 0.5rem;
    border-top: 1px solid #f3f4f6;
}

.popover-clear {
    font-size: 0.72rem;
    color: #6b7280;
}

.popover-clear:hover {
    color: #374151;
}

.popover-ok {
    font-size: 0.72rem;
    font-weight: 600;
    color: theme('colors.primary', #4f46e5);
}
</style>