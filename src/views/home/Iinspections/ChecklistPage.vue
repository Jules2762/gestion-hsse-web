<script setup lang="ts">
import { CalendarCheck, CalendarIcon, PlusIcon } from '@lucide/vue';
import Header from '../../../components/shared/Header.vue';
import Button from '../../../components/ui/Button.vue';
import ShowMode from '../../../components/ui/ShowMode.vue';
import { ref } from 'vue';
import Input from '../../../components/ui/Input.vue';

const show_mode=ref(0)
</script>

<template>
    <div class="flex flex-col ">
        <Header title="Checklist" show-search></Header>
        <div class="bg-white border-b border-gray-200 px-4 py-4 flex flex-row justify-between items-center">
            <div class="">
                <ShowMode v-model="show_mode"/>
            </div>
            <div class="flex flex-row gap-x-4 items-center">
                <div class="min-w-80">
                    <Input :icon="CalendarIcon"/>
                </div>
                <div class="min-w-80">
                    <Input :icon="CalendarCheck"/>
                </div>
                <Button :left-icon="PlusIcon">Créer checklist</Button>
            </div>
        </div>
    </div>
</template>