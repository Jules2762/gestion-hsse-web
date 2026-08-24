<script setup lang="ts">
import { BanIcon, EditIcon, EyeIcon, Trash2Icon, UserRoundSearchIcon } from '@lucide/vue';
type propsType={
    showDetails?:boolean,
    showEdit?:boolean,
    showDelete?:boolean,
    showBan?:boolean,
    showUser?:boolean,
    onClickDetails?:()=>{},
    onClickEdit?:()=>{},
    onClickDelete?:()=>{},
    onClickBan?:()=>{},
    onClickUser?:()=>{},
}
const props=defineProps<propsType>()
</script>

<template>
    <div class="flex flex-row items-center gap-x-4">
        <button v-if="showDetails" @click="onClickDetails"> 
            <EyeIcon :size="15" />
        </button>
        <button v-if="showUser" @click="onClickUser"> 
            <UserRoundSearchIcon :size="15" />
        </button>
        <button v-if="showEdit" @click="onClickEdit">
            <EditIcon :size="15" />
        </button>
        <button v-if="showDelete" @click="onClickDelete">
            <Trash2Icon :size="15" class="text-red-600" />
        </button>
        <button v-if="showBan" @click="onClickBan">
            <BanIcon :size="15" class="text-red-600"/>
        </button>
    </div>
</template>