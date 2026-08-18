<template>
    <div class="bg-white rounded p-4 grid grid-rows-2 gap-4">
            <div class="w-full flex flex-row items-center justify-between gap-x-3">
                <h5 class="text-gray-500">{{title}}</h5>
                <div class="bg-primary/10 rounded-full p-2">
                    <component :is="icon" class="text-primary"/>
                </div>
            </div>
            <div>
                <h1>{{value}}</h1>
            </div>
        </div>
</template>
<script lang="ts" setup>
import type { Component } from 'vue';

type propsType={
    title:string,
    icon:Component,
    value?:string
}
const props=defineProps<propsType>()
</script>