<template>
    <transition name="modal">
        <div @click.self="close" v-if="isOpen" class="w-screen h-screen bg-black/10 fixed   ">
            <div class="modal-content fixed  bg-white h-screen z-50 top-0 right-0 " :class="width?width:'w-100'">
                <slot></slot>
            </div>
        </div>
    </transition>
</template>
<script lang="ts" setup>
type propsType = {
    isOpen?: boolean,
    width?:string

}
const props = defineProps<propsType>()
const emit = defineEmits(["on-close"])
function close() {
    emit("on-close")
}
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

.modal-enter-from>.modal-content,
.modal-leave-to>.modal-content {
    opacity: 0;
    transform: translateX(300px);
}

.modal-enter-active>.modal-content,
.modal-leave-active>.modal-content {
    transition: all 0.3s ease-in-out;
}
</style>