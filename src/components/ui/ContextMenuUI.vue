<template>
    <div
        v-if="modelValue"
        ref="div_ref"
        class="fixed z-[9999] min-w-[210px] w-auto max-w-[280px] rounded-xl border border-gray-100 bg-white shadow-2xl p-1.5 flex flex-col gap-y-0.5 select-none transition-all"
        :style="contextMenuStyle"
        @click.stop
    >
        <!-- ACTIONS PRINCIPALES -->
        <button
            v-for="(item, index) in actions"
            :key="index"
            type="button"
            @click="handleActionClick(item)"
            class="flex items-center justify-between gap-x-3 w-full px-2.5 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer text-left whitespace-nowrap"
            :class="themeVariant(item.variant)"
        >
            <div class="flex items-center gap-x-2.5 min-w-0">
                <component :is="item.icon" :size="16" class="shrink-0" v-if="!item.loading" />
                <Loader2Icon v-else :size="16" class="animate-spin shrink-0 text-primary" />
                <span class="truncate whitespace-nowrap font-medium">{{ translateLabel(item.label) }}</span>
            </div>
            <span
                v-if="item.badge"
                class="ml-2 text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-gray-100 text-gray-700"
            >
                {{ item.badge }}
            </span>
        </button>

        <!-- SÉPARATEUR ÉLÉGANT -->
        <hr
            v-if="bottom_actions && bottom_actions.length > 0 && actions && actions.length > 0"
            class="my-1 border-t border-gray-100"
        />

        <!-- ACTIONS DU BAS (EX: SUPPRIMER) -->
        <button
            v-for="(item, index) in bottom_actions"
            :key="'bottom-' + index"
            type="button"
            @click="handleActionClick(item)"
            class="flex items-center justify-between gap-x-3 w-full px-2.5 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer text-left whitespace-nowrap"
            :class="themeVariant(item.variant)"
        >
            <div class="flex items-center gap-x-2.5 min-w-0">
                <component :is="item.icon" :size="16" class="shrink-0" v-if="!item.loading" />
                <Loader2Icon v-else :size="16" class="animate-spin shrink-0 text-primary" />
                <span class="truncate whitespace-nowrap font-medium">{{ translateLabel(item.label) }}</span>
            </div>
            <span
                v-if="item.badge"
                class="ml-2 text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-gray-100 text-gray-700"
            >
                {{ item.badge }}
            </span>
        </button>
    </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import type { ContextMenuActionType, ContextMenuPropsType, ContextMenuVariantType } from '../../@types/ContextMenu.type';
import { Loader2Icon } from '@lucide/vue';

const props = defineProps<ContextMenuPropsType>();
const emit = defineEmits(["update:modelValue"]);
const { t, te } = useI18n();

const translateLabel = (label?: string) => {
    if (!label) return '';
    if (te(label)) return t(label);
    const map: Record<string, string> = {
        'Détails': t('common.details'),
        'Consulter': t('common.details'),
        'Modifier': t('common.edit'),
        'Éditer': t('common.edit'),
        'Supprimer': t('common.delete'),
        'Exporter': t('common.export'),
        'Export': t('common.export'),
        'Actualiser': t('common.refresh'),
        'Imprimer': 'Print',
        'Prévisualiser': 'Preview',
    };
    return map[label] || label;
};

const div_ref = ref<HTMLDivElement | null>(null);

const contextMenuStyle = computed(() => {
    if (!props.contextMenu) return {};

    const menuWidth = div_ref.value?.offsetWidth ?? 220;
    const menuHeight = div_ref.value?.offsetHeight ?? 180;

    let left = props.contextMenu.clientX ?? 0;
    let top = props.contextMenu.clientY ?? 0;

    // Éviter de déborder à droite
    if (left + menuWidth > window.innerWidth - 10) {
        left = window.innerWidth - menuWidth - 15;
    }

    // Éviter de déborder en bas
    if (top + menuHeight > window.innerHeight - 10) {
        top = window.innerHeight - menuHeight - 15;
    } else {
        top = top + 8;
    }

    return {
        left: `${Math.max(10, left)}px`,
        top: `${Math.max(10, top)}px`,
    };
});

function handleActionClick(item: ContextMenuActionType) {
    if (item.onClick) {
        item.onClick();
    }
    emit('update:modelValue', false);
}

function handleClickOutside(event: MouseEvent) {
    if (!div_ref.value?.contains(event.target as Node)) {
        emit('update:modelValue', false);
    }
}

function themeVariant(variant: ContextMenuVariantType | undefined) {
    switch (variant) {
        case "DANGER":
            return "text-red-600 hover:bg-red-50 hover:text-red-700 active:bg-red-100";
        case "WARNING":
            return "text-amber-600 hover:bg-amber-50 hover:text-amber-700 active:bg-amber-100";
        case "INFO":
            return "text-blue-600 hover:bg-blue-50 hover:text-blue-700 active:bg-blue-100";
        case "SUCCESS":
            return "text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 active:bg-emerald-100";
        default:
            return "text-gray-700 hover:bg-slate-50 hover:text-gray-900 active:bg-slate-100";
    }
}

onMounted(() => {
    document.addEventListener('mousedown', handleClickOutside);
});

onUnmounted(() => {
    document.removeEventListener('mousedown', handleClickOutside);
});
</script>