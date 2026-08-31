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
import { router } from '../../../router/index.ts';
import type { Checklistype } from '../../../@types/Checklist.type.ts';
const data = ref(ChecklistsData)
const show_mode = ref(0) //0 ou 1
const current_page = ref(1)
const selected_checklist = ref<Checklistype>()
</script>

<template>
    <div class="flex flex-col ">
        <Header title="Checklist" show-search :thumbnails="[
            {
                label: 'Accueil',
                name: 'DASHBOARD'
            },
            {
                label: 'Inspections',
                name: 'TEMPLATE'
            },
            {
                label: 'Checklist',
                name: 'CHECKLIST'
            },
        ]"></Header>
        <div class="bg-white border-b border-gray-200 p-2 flex flex-row justify-between items-center">
            <div class="">
                <ShowMode v-model="show_mode" />
            </div>
            <div class="flex flex-row gap-x-4 items-center">
                <div class="min-w-80">
                    <Input :icon="CalendarIcon" />
                </div>
                <div class="min-w-80">
                    <Input :icon="CalendarCheck" />
                </div>
                <Button @click="router.push({
                    name: 'CHECKLIST_NEW'
                })" :left-icon="PlusIcon">Créer checklist</Button>
            </div>
        </div>
        <div class="  flex flex-row ">

            <template v-if="show_mode == 0">

                <div :class="selected_checklist ? 'w-9/12' : 'w-12/12'" class="transition-all">
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
                            <tr v-for="(item, index) in data" :key="index" @click="selected_checklist = item">
                                <td>{{ index + 1 }}</td>
                                <td>{{ item.title }}</td>
                                <td class="truncate max-w-70">{{ item.description }}</td>
                                <td>{{ item.type }}</td>
                                <td>{{ item.location }}</td>
                                <td>
                                    <ChecklistStatus :name="item.status" />
                                </td>
                                <td>
                                    <ActionTable show-details show-edit show-delete @click-details="router.push({
                                        name: 'CHECKLIST_DETAILS', params: {
                                            id: 1
                                        }
                                    })" />
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
            <transition name="preview">
                <div v-if="selected_checklist" class="
            w-3/12
            bg-white
            border-l
            border-gray-200
            p-5
            overflow-y-auto
            h-screen
            sticky top-0
            scrollbar-hide
        ">
                    <!-- HEADER -->

                    <div class="
                pb-5
                border-b
                border-gray-200
            ">
                        <div class="
                    flex
                    items-start
                    justify-between
                ">
                            <div>
                                <p class="
                            text-xs
                            uppercase
                            tracking-widest
                            text-gray-500
                        ">
                                    Checklist
                                </p>

                                <h4 class="mt-1">
                                    {{
                                        selected_checklist.title
                                    }}
                                </h4>
                            </div>

                            <button class="
                        p-2
                        rounded-lg
                        hover:bg-slate-100
                    " @click="
                        selected_checklist =
                        undefined
                        ">
                                ✕
                            </button>
                        </div>

                        <div class="mt-3">
                            <ChecklistStatus :name="selected_checklist.status
                                " />
                        </div>
                    </div>

                    <!-- DESCRIPTION -->

                    <div class="
                mt-5
                rounded-xl
                border
                border-primary/20
                bg-primary/5
                p-4
            ">
                        <p class="
                    text-sm
                    text-gray-700
                ">
                            {{
                                selected_checklist.description ||
                                'Aucune description disponible.'
                            }}
                        </p>
                    </div>

                    <!-- KPI -->

                    <div class="
                mt-5
                grid
                grid-cols-3
                gap-3
            ">
                        <div class="
                    rounded-xl
                    bg-slate-50
                    p-3
                    text-center
                ">
                            <p class="
                        text-xs
                        text-gray-500
                    ">
                                Sections
                            </p>

                            <h5>
                                {{
                                    selected_checklist.sections
                                        ?.length
                                }}
                            </h5>
                        </div>

                        <div class="
                    rounded-xl
                    bg-slate-50
                    p-3
                    text-center
                ">
                            <p class="
                        text-xs
                        text-gray-500
                    ">
                                Questions
                            </p>

                            <h5>
                                {{
                                    selected_checklist.sections
                                        ?.reduce(
                                            (
                                                total,
                                                section,
                                            ) =>
                                                total +
                                                section.items.length,
                                            0,
                                        )
                                }}
                            </h5>
                        </div>

                        <div class="
                    rounded-xl
                    bg-slate-50
                    p-3
                    text-center
                ">
                            <p class="
                        text-xs
                        text-gray-500
                    ">
                                Actions
                            </p>

                            <h5>
                                {{
                                    selected_checklist.sections
                                        ?.flatMap(
                                            section =>
                                                section.items,
                                        )
                                        .filter(
                                            item =>
                                                item.action,
                                        ).length
                                }}
                            </h5>
                        </div>
                    </div>

                    <!-- INFORMATIONS -->

                    <div class="
                mt-6
                border-t
                border-gray-200
                pt-5
            ">
                        <h6 class="
                    mb-4
                    text-gray-500
                ">
                            Informations générales
                        </h6>

                        <div class="
                    flex
                    flex-col
                    gap-4
                ">
                            <div>
                                <p class="
                            text-xs
                            text-gray-500
                        ">
                                    Type
                                </p>

                                <p>
                                    {{
                                        selected_checklist.type
                                    }}
                                </p>
                            </div>

                            <div>
                                <p class="
                            text-xs
                            text-gray-500
                        ">
                                    Site
                                </p>

                                <p>
                                    {{
                                        selected_checklist.site
                                    }}
                                </p>
                            </div>

                            <div>
                                <p class="
                            text-xs
                            text-gray-500
                        ">
                                    Lieu
                                </p>

                                <p>
                                    {{
                                        selected_checklist.location
                                    }}
                                </p>
                            </div>

                            <div>
                                <p class="
                            text-xs
                            text-gray-500
                        ">
                                    Date
                                </p>

                                <p>
                                    {{
                                        selected_checklist.date
                                    }}
                                </p>
                            </div>

                            <div>
                                <p class="
                            text-xs
                            text-gray-500
                        ">
                                    Heure
                                </p>

                                <p>
                                    {{
                                        selected_checklist.time
                                    }}
                                </p>
                            </div>
                        </div>
                    </div>

                    <!-- RESPONSABLES -->

                    <div class="
                mt-6
                border-t
                border-gray-200
                pt-5
            ">
                        <h6 class="mb-4">
                            Intervenants
                        </h6>

                        <div class="
                    flex
                    flex-col
                    gap-4
                ">
                            <div>
                                <p class="
                            text-xs
                            text-gray-500
                        ">
                                    Inspecteur
                                </p>

                                <p>
                                    {{
                                        selected_checklist.inspector
                                    }}
                                </p>
                            </div>

                            <div>
                                <p class="
                            text-xs
                            text-gray-500
                        ">
                                    Accompagnateur
                                </p>

                                <p>
                                    {{
                                        selected_checklist.accompanying_person ||
                                        "-"
                                    }}
                                </p>
                            </div>

                            <div>
                                <p class="
                            text-xs
                            text-gray-500
                        ">
                                    Responsable
                                </p>

                                <p>
                                    {{
                                        selected_checklist.manager
                                    }}
                                </p>
                            </div>

                            <div>
                                <p class="
                            text-xs
                            text-gray-500
                        ">
                                    Contact
                                </p>

                                <p>
                                    {{
                                        selected_checklist.contact
                                    }}
                                </p>
                            </div>
                        </div>
                    </div>

                    <!-- COMMENTAIRE -->

                    <div v-if="
                        selected_checklist.comment
                    " class="
                mt-6
                border-t
                border-gray-200
                pt-5
            ">
                        <h6 class="mb-3">
                            Commentaire
                        </h6>

                        <div class="
                    rounded-xl
                    bg-slate-50
                    p-4
                ">
                            {{
                                selected_checklist.comment
                            }}
                        </div>
                    </div>

                    <!-- ACTIONS -->

                    <div class="
                mt-6
                border-t
                border-gray-200
                pt-5
            ">
                        <div class="
                    flex
                    flex-col
                    gap-2
                ">
                            <Button class="w-full" @click="
                                router.push({
                                    name: 'CHECKLIST_DETAILS',
                                    params: {
                                        id: selected_checklist.id,
                                    },
                                })
                                ">
                                Voir la checklist
                            </Button>

                            <Button variant="outline" class="w-full">
                                Voir les actions
                            </Button>
                        </div>
                    </div>
                </div>
            </transition>
        </div>
    </div>
</template>