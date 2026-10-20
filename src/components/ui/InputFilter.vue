<template>
    <div ref="container" class="flex flex-row items-center gap-2">
        <div class="relative" :class="fullWidth ? 'w-full' : 'w-64'">
            <!-- Input -->
            <component :is="icon" v-if="icon" :size="15" class="absolute left-2.5 top-1/2
                       -translate-y-1/2 text-gray-400" />

            <input v-model="inputValue" type="text" autocomplete="off" :placeholder="displayPlaceholder"
                @focus="openDropdown" class="h-9 w-full rounded-lg border
                       border-gray-300 bg-white pl-8 pr-16
                       text-xs text-gray-700
                       placeholder:text-gray-400
                       focus:border-primary focus:outline-none
                       focus:ring-2 focus:ring-primary/20" />

            <!-- Clear -->
            <button v-if="props.modelValue" type="button" @click="clear" class="absolute right-8 top-1/2
                       -translate-y-1/2 text-gray-400
                       hover:text-gray-600">
                <XIcon :size="14" />
            </button>

            <!-- Chevron -->
            <button v-if="lists?.length" type="button" @click="toggleDropdown" class="absolute right-2 top-1/2
                       -translate-y-1/2 text-gray-400
                       hover:text-gray-600">
                <ChevronDown :size="16" class="transition-transform" :class="isOpen ? 'rotate-180' : ''" />
            </button>

            <!-- Dropdown -->
            <div v-if="isOpen && lists?.length" class="absolute left-0 top-full z-50 mt-1
                       max-h-60 w-full overflow-y-auto
                       rounded-lg border border-gray-200
                       bg-white shadow-lg">
                <button v-for="item in filteredLists" :key="item.value" type="button"
                    @mousedown.prevent="selectItem(item)" class="w-full px-3 py-2 text-left
                           transition hover:bg-gray-50" :class="String(item.value) === String(props.modelValue)
                                ? 'bg-gray-50'
                                : ''
                            ">
                    <div class="text-xs font-medium text-gray-800">
                        {{ item.label }}
                    </div>
                    <p class="text-[11px] text-gray-400">
                        {{ item.description }}
                    </p>
                </button>

                <div v-if="filteredLists.length === 0" class="px-3 py-3 text-xs text-gray-400">
                    {{ t('common.no_data') }}
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
    import type { Component } from 'vue'
    import {
        computed,
        onBeforeUnmount,
        onMounted,
        ref
    } from 'vue'
    import { useI18n } from 'vue-i18n'
    import {
        ChevronDown,
        X as XIcon
    } from '@lucide/vue'

    const { t, te, locale } = useI18n()

    type ListItem = {
        label: string
        value: string,
        description?:string
    }

    type PropsType = {
        modelValue?: string | number | null
        icon?: Component
        placeholder?: string
        fullWidth?: boolean
        list_id?: string
        lists?: ListItem[]
    }

    const props = defineProps<PropsType>()

    const emit = defineEmits<{
        'update:modelValue': [value: string | number | null]
    }>()

    const displayPlaceholder = computed(() => {
        if (!props.placeholder) return t('common.search') + '...'
        if (te(props.placeholder)) return t(props.placeholder)
        if (locale.value === 'en' && props.placeholder.startsWith('Rechercher')) {
            return props.placeholder.replace(/^Rechercher\s*(une|un|des)?\s*/i, 'Search ').replace(/\.\.\.$/, '...')
        }
        return props.placeholder
    })

    const container = ref<HTMLElement | null>(null)
    const isOpen = ref(false)
    const search = ref('')

    const selectedItem = computed(() => {
        return props.lists?.find(
            item => String(item.value) === String(props.modelValue)
        )
    })

    const inputValue = computed({
        get() {
            if (isOpen.value) {
                return search.value
            }

            return selectedItem.value?.label ?? ''
        },

        set(value: string) {
            search.value = value

            // L'utilisateur recommence à rechercher
            if (props.modelValue !== undefined && props.modelValue !== null) {
                emit('update:modelValue', null)
            }

            isOpen.value = true
        }
    })

    const filteredLists = computed(() => {
        if (!props.lists) {
            return []
        }

        const query = search.value.trim().toLowerCase()

        if (!query) {
            return props.lists
        }

        return props.lists.filter(item =>
            item.label.toLowerCase().includes(query)
        )
    })

    function openDropdown() {
        if (!props.lists?.length) {
            return
        }

        search.value = ''
        isOpen.value = true
    }

    function toggleDropdown() {
        if (isOpen.value) {
            isOpen.value = false
            search.value = ''
        } else {
            openDropdown()
        }
    }

    function selectItem(item: ListItem) {
        emit('update:modelValue', item.value)

        search.value = ''
        isOpen.value = false
    }

    function clear() {
        emit('update:modelValue', null)

        search.value = ''
        isOpen.value = false
    }

    function handleClickOutside(event: MouseEvent) {
        if (
            container.value &&
            !container.value.contains(event.target as Node)
        ) {
            isOpen.value = false
            search.value = ''
        }
    }

    onMounted(() => {
        document.addEventListener('mousedown', handleClickOutside)
    })

    onBeforeUnmount(() => {
        document.removeEventListener('mousedown', handleClickOutside)
    })
</script>