<template>
    <div v-if="isOpen" ref="div_ref" class="
        fixed
        z-9999
        w-56
        rounded
        border
        border-gray-200
        bg-white
        p-3
        shadow-xl
    " :style="contextMenuStyle" @click.stop>
        <slot></slot>
    </div>
</template>
<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref, type VNodeRef } from 'vue';
import type { contextMenuType } from '../../@types/ContextMenu.type';

type propsType = {
    contextMenu?: contextMenuType,
    isOpen?: boolean
}
const props = defineProps<propsType>()
const div_ref = ref<HTMLDivElement | null>(null)
const contextMenuStyle = computed(() => {

    if (!props.contextMenu)
        return {}
    const menuWidth =
        div_ref.value?.offsetWidth ?? 250

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
            10
    }

    return {
        left: `${left}px`,
        top: `${top as number + 15}px`,
    }
})
const emit=defineEmits(["update:isOpen"])
function handleClickOutside(
    event: MouseEvent,
) {
    if (
        !div_ref.value
            ?.contains(
                event.target as Node,
            )
    ) {
        emit('update:isOpen',false)
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