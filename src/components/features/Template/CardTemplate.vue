<script setup lang="ts">
import { EditIcon, EyeIcon, MoreVertical, Trash2Icon } from '@lucide/vue';
type propsType={
    title:string,
    description?:string,
    section:number,
    question:number,
    created_at:string
}
const props=defineProps<propsType>()
</script>

<template>
    <div class="bg-white p-6 rounded flex flex-col gap-y-3 shadow-md shadow-gray-300/20">
        <div class="flex flex-row justify-between items-center">
            <h4>{{title}}</h4>
            <button>
                <MoreVertical/>
            </button>
        </div>
        <p>{{description}}</p>
        <div class="grid grid-cols-2 divide-x divide-gray-300">
            
            <div class="flex flex-col ">
                <div>{{section}}</div>
                <label >Section</label>
            </div>
            <div class="flex flex-col pl-2">
                <div>{{question}}</div>
                <label >Question</label>
            </div>
           
        </div>
        <div class="flex flex-row justify-between items-center">
            <p class="text-xs">
                {{created_at}}
            </p>
            <div class="flex flex-row items-center gap-x-4">
                <button>
                    <EyeIcon :size="15"/>
                </button>
                <button>
                    <EditIcon :size="15"/>
                </button>
                <button>
                    <Trash2Icon :size="15"/>
                </button>
            </div>
        </div>
    </div>
</template>