<template>
    <div class="bg-white p-4 flex  gap-x-4 border-b border-gray-200 " :class="mode=='H'?'flex-row':'h-lvh w-80  flex-col gap-y-3  sticky top-0'">
            <button v-for="(value,index) in tabData" :key="index" :class="[index==data&&mode=='H'?'border-b-3 border-primary text-primary font-semibold':'',index==data&&mode=='V'?'p-2 bg-slate-600/10 rounded text-slate-600 font-semibold':'p-2',mode=='H'?'':'justify-between']" @click="data=index" class="flex  flex-row items-center gap-x-2 h-fit">
                <span>{{value}}</span>
                <span v-if="data!=index" class="flex flex-row items-center justify-center text-xs w-4 text-white h-4 rounded-full bg-red-400">1</span>
            </button>
        </div>
</template>
<script setup lang="ts">
import { computed } from 'vue';

type propsType={
    tabData:string[],
    modelValue:number,
    mode?:"H"|"V"

}
const props=withDefaults(defineProps<propsType>(),{
    modelValue:0,
    mode:"H"
})
const emit=defineEmits(["update:modelValue"])
const data=computed({
    get():number{
        return props.modelValue
    },
    set(value:number):void{
        emit("update:modelValue",value)
    }
})
</script>