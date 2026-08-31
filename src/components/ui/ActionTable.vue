<script setup lang="ts">
import { BanIcon, Download, EditIcon, EyeIcon, FileSearch2Icon, MoreVerticalIcon, Trash2Icon, UserRoundSearchIcon } from '@lucide/vue';
import { ref } from 'vue';
import type { contextMenuType } from '../../@types/ContextMenu.type';
type propsType = {
    showDetails?: boolean,
    showFile?: boolean,
    showEdit?: boolean,
    showDelete?: boolean,
    showMore?: boolean,
    showBan?: boolean,
    showUser?: boolean,
    showDownload?: boolean,
    contextMenu?: contextMenuType,
    onClickDetails?: () => {},
    onClickFile?: () => {},
    onClickEdit?: () => {},
    onClickDelete?: () => {},
    onClickBan?: () => {},
    onClickUser?: () => {},
    onClickDownload?: () => {},
   


}
const props = defineProps<propsType>()
const emit = defineEmits(['update:contextMenu',"onClickMore"])
function onMoreClicked(event: MouseEvent) {
    emit("update:contextMenu", {
        clientX: event.clientX,
        clientY: event.clientY
    } as contextMenuType)
    console.log(event)
    emit("onClickMore")
}
</script>

<template>
    <div class="flex flex-row items-center gap-x-4">
        <button v-if="showDetails" @click="onClickDetails">
            <EyeIcon :size="15" />
        </button>
        <button v-if="showFile" @click="onClickFile">
            <FileSearch2Icon :size="15" />
        </button>
        <button v-if="showDownload" @click="onClickDownload">
            <Download :size="15" />
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
            <BanIcon :size="15" class="text-red-600" />
        </button>
        <button v-if="showMore" @click="onMoreClicked">
            <MoreVerticalIcon :size="15" class="" />
        </button>
       
    </div>
</template>