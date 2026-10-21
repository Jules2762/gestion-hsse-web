<template>
    <Teleport to="body">
        <transition name="center_modal">
            <div class="fixed inset-0 z-[100000] bg-black/50 backdrop-blur-xs flex items-center justify-center p-4" v-if="isOpen" @click.self="handleClose">
                <div class="center_modal_content bg-white shadow-xl flex flex-col rounded-xl min-w-100 min-h-60 overflow-hidden border border-gray-200" :class="`w-${width}`">
                    <div class="bg-gray-50 h-14 p-4 flex flex-row justify-between items-center border-b border-gray-200">
                        <h4 class="text-sm font-bold" :class="themeTitle">{{ title }}</h4>
                        <button @click="handleClose" class="text-gray-400 hover:text-gray-700 transition cursor-pointer">
                            <XIcon :size="16"/>
                        </button>
                    </div>
                    <div class="bg-white flex-1 p-4 w-full text-xs">
                        <slot></slot>
                    </div>
                    <div class="bg-gray-50 h-14 p-4 flex flex-row justify-between gap-3 items-center border-t border-gray-200">
                        <Button variant="outline" @click="handleClose" full-width>{{ cancelTitle }}</Button>
                        <Button @click="handleConfirm" :variant="confirmVariant" :loading="confirmLoading" full-width>{{ confirmTitle }}</Button>
                    </div>
                </div>
            </div>
        </transition>
    </Teleport>
</template>

<script lang="ts" setup>
import { XIcon } from '@lucide/vue';
import Button, { type ButtonVariant } from './Button.vue';
import { computed, onMounted, onUnmounted } from 'vue';

type propsType = {
    isOpen?: boolean;
    onClose?: () => void;
    title?: string;
    titleVariant?: "primary" | "danger" | "warning" | "normal";
    onConfirm?: () => void;
    cancelTitle?: string;
    confirmTitle?: string;
    confirmVariant?: ButtonVariant;
    confirmLoading?: boolean;
    width?: number;
};

const props = withDefaults(defineProps<propsType>(), {
    cancelTitle: "Annuler",
    confirmTitle: "Confirmer",
    titleVariant: "normal",
    width: 80,
});

const emit = defineEmits<{
    (e: 'close'): void;
    (e: 'confirm'): void;
}>();

function handleClose() {
    emit('close');
    props.onClose?.();
}

function handleConfirm() {
    emit('confirm');
    props.onConfirm?.();
}

const themeTitle = computed(() => {
    switch (props.titleVariant) {
        case "primary":
            return "text-primary";
        case "danger":
            return "text-red-600";
        case "warning":
            return "text-orange-600";
        default:
            return "";
    }
});

function handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'Escape' && props.isOpen) {
        handleClose();
    }
}

onMounted(() => {
    window.addEventListener('keydown', handleKeyDown);
});

onUnmounted(() => {
    window.removeEventListener('keydown', handleKeyDown);
});
</script>

<style scoped>
.center_modal-enter-from,
.center_modal-leave-to {
    opacity: 0;
}
.center_modal-enter-from .center_modal_content,
.center_modal-leave-to .center_modal_content {
    opacity: 0;
    transform: translateY(-20px) scale(0.97);
}
.center_modal-enter-active,
.center_modal-leave-active {
    transition: all 0.25s ease-in-out;
}
.center_modal-enter-active .center_modal_content,
.center_modal-leave-active .center_modal_content {
    transition: all 0.25s ease-in-out;
}
</style>