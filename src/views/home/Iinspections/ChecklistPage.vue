<script setup lang="ts">
import { CalendarCheck, CalendarIcon, ClipboardCheck, PlusIcon } from '@lucide/vue';
import Header from '../../../components/shared/Header.vue';
import Button from '../../../components/ui/Button.vue';
import ShowMode from '../../../components/ui/ShowMode.vue';
import { ref } from 'vue';
import Input from '../../../components/ui/Input.vue';
import ActionTable from '../../../components/ui/ActionTable.vue';
import { ChecklistsData } from '../../../@data/Checklist.data.ts';
import ChecklistStatus from '../../../components/features/checklist/ChecklistStatus.vue';
const data = ref(ChecklistsData)
const show_mode = ref(0) //0 ou 1
const current_page = ref(1)

</script>

<template>
    <div class="flex flex-col ">
        <Header title="Checklist" show-search :thumbnails="[
            {
                label:'Accueil',
                name:'DASHBOARD'
            },
             {
                label:'Inspections',
                name:'TEMPLATE'
            },
             {
                label:'Checklist',
                name:'CHECKLIST'
            },
        ]"></Header>
        <div class="bg-white border-b border-gray-200 p-2 flex flex-row justify-between items-center">
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
         <div class="  flex flex-col gap-y-4 ">
            
            <template v-if="show_mode == 0">

                <div class="p-4">
                    <table class="">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Titre</th>
                                <th>Description</th>
                                <th>Type</th>
                                <th>Lieu</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item, index) in data" :key="index">
                                <td>{{ index + 1 }}</td>
                                <td>{{ item.title }}</td>
                                <td class="truncate max-w-70">{{ item.description }}</td>
                                <td>{{ item.type }}</td>
                                <td>{{ item.location }}</td>
                                <td>
                                    <ChecklistStatus :name="item.status"/>
                                </td>
                                <td>
                                    <ActionTable show-details show-edit show-delete/>
                                </td>
                            </tr>
                        </tbody>

                    </table>
                    <div class="bg-white flex flex-row items-center justify-end py-4 pr-6">
                        <vue-awesome-paginate @click="(page: number) => { }" :hide-prev-next-when-ends="true"
                            :total-items="50" :items-per-page="3" :max-pages-shown="4"
                            v-model="current_page"></vue-awesome-paginate>
                    </div>
                </div>

            </template>
            <template v-if="show_mode == 1">
                <div class="flex flex-col p-4">
                    <div class="grid grid-cols-5 gap-3">
                        <CardTemplate v-for="(item, index) in data" :key="index" v-bind="item" />

                    </div>
                </div>
            </template>
        </div>
    </div>
</template>