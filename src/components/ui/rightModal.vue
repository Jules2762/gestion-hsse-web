<template>
    <transition name="modal">
        <div
            v-if="isOpen"
            @click.self="close"
            class="fixed inset-0 z-[9999] bg-black/40 backdrop-blur-xs flex justify-end"
        >
            <div
                class="modal-content relative bg-white h-screen shadow-2xl flex flex-col z-[10000] overflow-hidden"
                :class="width ? width : 'w-full max-w-[420px] sm:w-[420px]'"
            >
                <slot></slot>
            </div>
        </div>
    </transition>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted } from 'vue';

type propsType = {
    isOpen?: boolean;
    width?: string;
};

const props = defineProps<propsType>();
const emit = defineEmits(["on-close"]);

function close() {
    emit("on-close");
}

function handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'Escape' && props.isOpen) {
        close();
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
.modal-enter-from,
.modal-leave-to {
    opacity: 0;
}

.modal-enter-active,
.modal-leave-active {
    transition: all 0.25s ease-in-out;
}

.modal-enter-from > .modal-content,
.modal-leave-to > .modal-content {
    opacity: 0;
    transform: translateX(100%);
}

.modal-enter-active > .modal-content,
.modal-leave-active > .modal-content {
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
</style>