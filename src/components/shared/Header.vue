<template>
    <div class="flex w-full flex-col gap-y-2 border-b border-gray-200">
        <div class=" bg-white px-6 py-3 flex flex-row items-center justify-between">
            <div class="flex flex-col gap-y-1">
                <h5>{{ title }}</h5>
                <div v-if="thumbnails" class="p-1">

                    <div class="flex flex-row  gap-x-3">
                        <div v-for="(item, index) in thumbnails" :key="index"
                            class="flex flex-row text-xs gap-x-3 font-semibold text-slate-600 items-center">
                            <div @click="router.push({ name: item.name })" class="hover:text-slate-800"
                                :class="item.name == useRoute().name ? 'text-primary' : ''">{{ item.label }}</div>
                            <ChevronRight :size="15" v-show="thumbnails.length >= 2 && thumbnails.length != index + 1">
                            </ChevronRight>
                        </div>
                    </div>
                </div>
            </div>
            <div class="flex flex-row gap-x-5 items-center">
                <form class="w-100" v-if="showSearch">
                    <Input :icon="SearchIcon" v-model="data"></Input>
                </form>
                <div class="flex flex-row items-center gap-x-4">
                    <button class="relative" @click="modalRight = true">
                        <BellIcon />
                        <div v-if="notifications.getData.length > 0 && notifications.getData.some(item => !item.viewed)"
                            class="absolute -top-0.5 -right-0.5 bg-red-600 w-3 h-3 rounded-full"></div>
                    </button>
                    <button @click="router.push({
                        name:'PROFILE'
                    })">
                        <User2Icon />
                    </button>
                </div>
            </div>
        </div>

        <RightModal :is-open="modalRight" @on-close="
            modalRight = false;
        notifications.viewed();
        ">
            <div class="flex h-full flex-col">
                <!-- HEADER -->

                <div class="
        border-b
        border-slate-200
        p-4
        
      ">
                    <h3>
                        Notifications
                    </h3>

                    <p class="mt-1 text-sm text-slate-500">
                        Activités récentes
                    </p>
                </div>

                <!-- LISTE -->

                <div v-if="notifications.getData.length > 0" class="
        flex-1
        overflow-y-auto
      ">
                    <div v-for="(value, index) in notifications.getData" :key="index" class="
          relative
          border-b
          border-slate-100
          p-4
          transition-colors
          hover:bg-slate-50 group
        " :class="value.viewed ? '' : 'bg-primary/5'">


                        <div class=" w-full">
                            <div class="w-full flex flex-row items-center justify-between ">
                                <h5 class="
              text-sm
              font-semibold
              text-slate-800
            ">
                                    {{ value.title }}
                                </h5>
                                <div class="flex flex-row gap-x-3 items-center ">
                                    <div class="w-2 h-2  rounded-full bg-red-600" v-if="!value.viewed"></div>
                                    <button class="hidden group-hover:block " @click="notifications.deleteOne(index)">
                                        <Trash2Icon :size="15" />
                                    </button>
                                </div>
                            </div>

                            <p v-if="value.description" class="
              mt-1
              text-sm
              text-slate-500
             max-w-8/12
            ">
                                {{ value.description }}
                            </p>

                            <span v-if="value.ago" class="
              mt-2
              block
              text-xs
              text-slate-400
            ">
                                {{ value.ago }}
                            </span>
                        </div>
                    </div>
                </div>

                <!-- ETAT VIDE -->

                <div v-else class="
        flex
        flex-1
        flex-col
        items-center
        justify-center
        gap-3
        p-6
      ">
                    <span class="text-5xl">
                        🔔
                    </span>

                    <div class="text-center">
                        <h4>
                            Aucune notification
                        </h4>

                        <p class="mt-1 text-sm text-slate-500">
                            Vous n'avez aucune notification pour le moment.
                        </p>
                    </div>
                </div>
            </div>
        </RightModal>
    </div>
</template>
<script setup lang="ts">
import { BellIcon, ChevronRight, SearchIcon, Trash2Icon, User2Icon, XIcon } from '@lucide/vue';
import { useRoute } from 'vue-router';
import { router } from '../../router';
import Input from "../ui/Input.vue"
import { computed, onMounted, ref } from 'vue';
import RightModal from '../ui/rightModal.vue';
import { useNotificationStore } from '../../services/useNotificationStore.ts';

type thumblenailsType = {
    label: string,
    name: string
}[]
type propsType = {
    title?: string,
    showSearch?: boolean
    thumbnails?: thumblenailsType,
    modelValue?: string
}
const props = defineProps<propsType>()
const emit = defineEmits(['update:modelValue'])
const modalRight = ref(false)
const data = computed({
    get(): string | undefined {
        return props.modelValue
    },
    set(value: string | undefined) {
        emit("update:modelValue", value)
    }
})
const notifications = useNotificationStore()
onMounted(() => {
    notifications.add({
        title: "hello",
        description: "qksdkqhsdjkhqjkshdjkhqjkshdjkqhsjkdhjqhsjkdh kjqhsjkdhqjksdh",
        ago: "il y a 1minutes"
    })
})

</script>