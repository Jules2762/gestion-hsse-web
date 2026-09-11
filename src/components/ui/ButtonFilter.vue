<script setup lang="ts">
import type { Component } from 'vue';

type propsType={
    text?:string,
    icon?:Component,
    isPrimary?:boolean
}
const props=defineProps<propsType>()
</script>

<template>
    <button class="ribbon-btn " :class="isPrimary?'ribbon-btn-primary':''">
                        <component :is="icon" :size="18" />
    <span> {{ text }} </span>
    </button>
</template>