<script setup lang="ts">
import { ref } from 'vue';
import CardTemplate from '../../../components/features/Template/CardTemplate.vue';
import Header from '../../../components/shared/Header.vue';
import Button from '../../../components/ui/Button.vue';
import { ClipboardCheck, EditIcon, EyeIcon, LayoutGrid, ListIcon, PlusIcon, Table2, Trash2Icon } from '@lucide/vue';
import ShowMode from '../../../components/ui/ShowMode.vue';
import Input from '../../../components/ui/Input.vue';
import Pagination from '../../../components/ui/Pagination.vue';
import { VueAwesomePaginate } from 'vue-awesome-paginate';
const data = ref([
    {
        title: "Sécurité incendie",
        description: "Inspection détaillée des équipements de lutte contre l'incendie, incluant les extincteurs et les alarmes.",
        section: 5,
        question: 10,
        created_at: "01-15-2026"
    },
    {
        title: "Sécurité incendie",
        description: "Inspection détaillée des équipements de lutte contre l'incendie, incluant les extincteurs et les alarmes.",
        section: 5,
        question: 10,
        created_at: "01-15-2026"
    },
    {
        title: "Sécurité incendie",
        description: "Inspection détaillée des équipements de lutte contre l'incendie, incluant les extincteurs et les alarmes.",
        section: 5,
        question: 10,
        created_at: "01-15-2026"
    },
    {
        title: "Sécurité incendie",
        description: "Inspection détaillée des équipements de lutte contre l'incendie, incluant les extincteurs et les alarmes.",
        section: 5,
        question: 10,
        created_at: "01-15-2026"
    },
    {
        title: "Sécurité incendie",
        description: "Inspection détaillée des équipements de lutte contre l'incendie, incluant les extincteurs et les alarmes.",
        section: 5,
        question: 10,
        created_at: "01-15-2026"
    },
    {
        title: "Sécurité incendie",
        description: "Inspection détaillée des équipements de lutte contre l'incendie, incluant les extincteurs et les alarmes.",
        section: 5,
        question: 10,
        created_at: "01-15-2026"
    },
])
const show_mode = ref(0) //0 ou 1
const current_page = ref(1)
</script>

<template>
    <div class="flex flex-col ">
        <Header title="Templates" show-search />
        <div class="  flex flex-col gap-y-4 ">
            <div
                class="flex flex-row justify-between items-center p-2 bg-white max-w-full overflow-hidden border-b border-gray-200">

                <ShowMode v-model="show_mode" />

                <div class="flex flex-row items-center gap-4">
                    <div class="min-w-80">
                        <Input list_id="checklist_type" :lists="['Checklist voiture', 'Checklist inspection CC']"
                            :icon="ClipboardCheck" />
                    </div>
                    <Button :left-icon="PlusIcon">Créer un Template</Button>
                </div>
            </div>
            <template v-if="show_mode == 0">

                <div class="p-4">
                    <table class="">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Titre</th>
                                <th>Description</th>
                                <th>Section</th>
                                <th>Question</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item, index) in data" :key="index">
                                <td>{{ index + 1 }}</td>
                                <td>{{ item.title }}</td>
                                <td class="truncate max-w-70">{{ item.description }}</td>
                                <td>{{ item.section }}</td>
                                <td>{{ item.question }}</td>
                                <td>
                                    <div class="flex flex-row items-center gap-x-4">
                                        <button>
                                            <EyeIcon :size="15" />
                                        </button>
                                        <button>
                                            <EditIcon :size="15" />
                                        </button>
                                        <button>
                                            <Trash2Icon :size="15" />
                                        </button>
                                    </div>
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