<template>
    <div v-if="modelValue" ref="div_ref" class="
        fixed
        z-9999
        w-56
       rounded
        border
        border-gray-200
        bg-white
        shadow-[0_20px_50px_rgba(0,0,0,.18)]
         p-4
        flex flex-col
       
    " :style="contextMenuStyle" @click.stop>
        <button v-for="(item, index) in actions" :key="index" @click="item.onClick"
            class="flex flex-row gap-x-3 items-center  w-full p-2 " :class="themeVariant(item.variant)">
            <component :is="item.icon" :size="21"/>
            <span class="text-[14px]">{{ item.label }}</span>
        </button>
       <div class="border-t border-gray-300" v-if="bottom_actions?.length">
           <button v-for="(item, index) in bottom_actions" :key="index" @click="item.onClick"
                class="flex flex-row gap-x-3 items-center   w-full p-2 " :class="themeVariant(item.variant)">
                <component :is="item.icon" :size="21" />
                <span class="text-[14px]">{{ item.label }}</span>
            </button>
       </div>
    </div>
</template>
<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref } from 'vue';
import type { ContextMenuPropsType, ContextMenuVariantType } from '../../@types/ContextMenu.type';

const props = defineProps<ContextMenuPropsType>()
const div_ref = ref<HTMLDivElement | null>(null)
const contextMenuStyle = computed(() => {

    if (!props.contextMenu)
        return {}
    const menuWidth =
        div_ref.value?.offsetWidth ?? 250
        const menuHeight=div_ref.value?.offsetHeight??250

    let left =
        props.contextMenu.clientX

    let top =
        props.contextMenu.clientY

    if (
        left as number + menuWidth >
        window.innerWidth
    ) {
        left =
            window.innerWidth -
            menuWidth -
            20
    }
    if(top as number +menuHeight>window.innerHeight){
        top=window.innerHeight-menuHeight-10
    }

    return {
        left: `${left}px`,
        top: `${top as number + 15}px`,
    }
})
const emit = defineEmits(["update:modelValue"])
function handleClickOutside(
    event: MouseEvent,
) {
    if (
        !div_ref.value
            ?.contains(
                event.target as Node,
            )
    ) {
        emit('update:modelValue', false)
    }
}

function themeVariant(variant:ContextMenuVariantType|undefined){
    switch (variant) {
        case "DANGER":
            
            return "text-red-600 hover:bg-red-100"
        case "WARNING":
            
            return "text-yellow-600 hover:bg-yellow-100"
    
        case "INFO":
            
            return "text-blue-600 hover:bg-blue-100"
        case "SUCCESS":
            
            return "text-green-600 hover:bg-green-100"
    
        default:
            return " hover:bg-slate-100"
    }
}
onMounted(() => {
    document.addEventListener(
        'mousedown',
        handleClickOutside,
    )
})

onUnmounted(() => {
    document.removeEventListener(
        'mousedown',
        handleClickOutside,
    )
})
</script>