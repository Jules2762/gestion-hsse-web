<script setup lang="ts">
import { Loader, Loader2Icon, LoaderPinwheelIcon } from '@lucide/vue';

</script>

<template>
    <div class="fixed z-40 top-0 left-0 w-screen flex flex-row items-center justify-center h-screen bg-black/10">
        <Loader2Icon class="animate-spin duration-75" :size="30"/>
    </div>
</template>