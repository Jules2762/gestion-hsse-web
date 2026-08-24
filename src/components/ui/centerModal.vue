<template>
    <transition name="center_modal">
        <div class="fixed z-50 top-0 left-0 bg-black/10 w-screen min-h-screen min-w-screen h-screen flex flex-row items-center justify-center" v-if="isOpen" @click.self="onClose">
            <div class=" center_modal_content bg-white shadow shadow-gray-300  flex flex-col rounded min-w-100 min-h-60 -translate-y-30">
                <div class="bg-gray-50 h-16 p-4 flex flex-row justify-between items-center border-b border-gray-300">
                    <h4 class="text-primary">{{ title }}</h4>
                    <button @click="onClose">
                        <XIcon :size="18"/>
                    </button>
                </div>
                <div class="bg-white flex-1 p-4">
                    <slot></slot>
                </div>
                <div class="bg-gray-50 h-16 p-4 flex  flex-row justify-end gap-3 items-center border-t border-gray-300">
                    <Button variant="outline" @click="onClose">Annuler</Button>
                    <Button >Confirmer</Button>
                    
                </div>
            </div>
        </div>
    </transition>
</template>
<script lang="ts" setup>
import { XIcon } from '@lucide/vue';
import Button from './Button.vue';

type propsType={
    isOpen?:boolean,
    onClose?:()=>{},
    title?:string
}
const props=defineProps<propsType>()
</script>
<style scoped>
.center_modal-enter-from,.center_modal-leave-to{
    opacity: 0;
}
.center_modal-enter-from .center_modal_content,.center_modal-leave-to .center_modal_content{
    opacity: 0;
    transform: translateY(-50px);
}
.center_modal-enter-active,.center_modal-leave-active{
    transition: all 0.3s ease-in-out;
}
.center_modal-enter-active .center_modal_content,.center_modal-leave-active .center_modal_content{
    transition: all 0.3s ease-in-out;
}
</style>