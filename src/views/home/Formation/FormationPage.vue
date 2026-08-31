<script setup lang="ts">
import { computed, ref } from 'vue';
import Header from '../../../components/shared/Header.vue';
import { FormationData } from '../../../@data/Formation.data.ts';
import ActionTable from '../../../components/ui/ActionTable.vue';
import { ChevronDown, CloudDownloadIcon, SquarePlusIcon, XIcon } from '@lucide/vue';
import { useSidebarStore } from '../../../services/useSidebarStore..ts';
import ShowMode from '../../../components/ui/ShowMode.vue';
import Button from '../../../components/ui/Button.vue';
import { router } from '../../../router/index.ts';

const headers = ["#", "DATE", "TYPE", "VOLET", "FORMATEUR", "Durée (h)", "cible", "ACTION"]
const data = ref([...FormationData])
const show_preview = ref<null | number | string>(null)
const selectedFormation = computed(
    () =>
        data.value.find(
            item =>
                item.id ===
                show_preview.value,
        ),
)
const sidebar = useSidebarStore()
const show_mode = ref(0)
</script>

<template>
    <div class="">
        <Header title="Formation" :thumbnails="[
            {
                'label': 'Tableau de bord',
                'name': 'DASHBOARD'
            }, {
                'label': 'Formation',
                'name': 'FORMATION'
            }
        ]" show-search />
        <div class="bg-white h-16 p-4 border-b flex flex-row items-center justify-between border-gray-200">
            <ShowMode v-model="show_mode" />
            <div class="flex flex-row items-center gap-x-3 ">
                <Button :variant="'outline'" :left-icon="CloudDownloadIcon" @click="router.push({
                    name: 'FORMATION_IMPORT'
                })">Importer</Button>
                <Button :left-icon="SquarePlusIcon" @click="router.push({
                    name: 'FORMATION_NEW'
                })">Ajouter</Button>
            </div>
        </div>
        <div class="flex flex-row transition-all">
            <table class="transition-all" :class="show_preview  ? 'w-9/12' : 'w-12/12'">
                <thead>
                    <tr>
                        <th v-for="(item, index) in headers" :key="index">{{ item }}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in data" :key="index" @click="show_preview = item.id"
                        :class="show_preview == item.id ? 'bg-primary/10' : ''">
                        <td>{{ item.id }}</td>
                        <td>{{ item.date }}</td>
                        <td>{{ item.type }}</td>
                        <td>{{ item.volet }}</td>
                        <td>{{ item.trainer }}</td>
                        <td>{{ item.duration }}</td>
                        <td>{{ item.target }}</td>
                        <td>
                            <ActionTable show-file show-download />
                        </td>
                    </tr>
                </tbody>
            </table>
            
                <div :class="show_preview?'w-3/12':'w-0'" v-if="show_preview " class="
            scrollbar-hide
            bg-white
            border-l
            border-gray-200
            transition-all
            p-5
            h-fit
            sticky top-0
            overflow-y-auto
        ">
                    <template v-if="selectedFormation">

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
                                        Formation
                                    </p>

                                    <h4 class="mt-1">
                                        {{
                                            selectedFormation.title
                                        }}
                                    </h4>
                                </div>

                                <button class="
                            rounded-lg
                            p-2
                            hover:bg-slate-100
                        " @click="
                            show_preview = null
                            ">
                                    <XIcon :size="18" />
                                </button>
                            </div>

                            <!-- BADGES -->

                            <div class="
                        mt-4
                        flex
                        flex-wrap
                        gap-2
                    ">
                                <span class="
                            rounded-full
                            bg-primary/10
                            px-3
                            py-1
                            text-xs
                            font-medium
                            text-primary
                        ">
                                    {{
                                        selectedFormation.type
                                    }}
                                </span>

                                <span class="
                            rounded-full
                            bg-blue-100
                            px-3
                            py-1
                            text-xs
                            font-medium
                            text-blue-700
                        ">
                                    {{
                                        selectedFormation.volet
                                    }}
                                </span>
                            </div>
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
                                    Participants
                                </p>

                                <h5>
                                    {{
                                        selectedFormation.participant
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
                                    Durée
                                </p>

                                <h5>
                                    {{
                                        selectedFormation.duration
                                    }}h
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
                                    Public
                                </p>

                                <h5 class="
                            text-sm
                        ">
                                    {{
                                        selectedFormation.target_type
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
                        grid
                        grid-cols-2
                        gap-4
                    ">
                                <div>
                                    <p class="
                                text-xs
                                text-gray-500
                            ">
                                        Date
                                    </p>

                                    <p>
                                        {{
                                            selectedFormation.date
                                        }}
                                    </p>
                                </div>

                                <div>
                                    <p class="
                                text-xs
                                text-gray-500
                            ">
                                        Formateur
                                    </p>

                                    <p>
                                        {{
                                            selectedFormation.trainer
                                        }}
                                    </p>
                                </div>

                                <div>
                                    <p class="
                                text-xs
                                text-gray-500
                            ">
                                        Type
                                    </p>

                                    <p>
                                        {{
                                            selectedFormation.type
                                        }}
                                    </p>
                                </div>

                                <div>
                                    <p class="
                                text-xs
                                text-gray-500
                            ">
                                        Volet
                                    </p>

                                    <p>
                                        {{
                                            selectedFormation.volet
                                        }}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <!-- PUBLIC CIBLE -->

                        <div class="
                    mt-6
                    border-t
                    border-gray-200
                    pt-5
                ">
                            <h6 class="mb-3">
                                Public concerné
                            </h6>

                            <p>
                                {{
                                    selectedFormation.target
                                }}
                            </p>

                            <p class="
                        mt-2
                        text-sm
                        text-gray-500
                    ">
                                {{
                                    selectedFormation.target_type
                                }}
                            </p>
                        </div>

                        <!-- PARTICIPATION -->

                        <div class="
                    mt-6
                    border-t
                    border-gray-200
                    pt-5
                ">
                            <h6 class="mb-3">
                                Participation
                            </h6>

                            <div class="
                        rounded-xl
                        bg-green-50
                        border
                        border-green-200
                        p-4
                    ">
                                <div class="
                            flex
                            items-center
                            justify-between
                        ">
                                    <span>
                                        Participants
                                    </span>

                                    <span class="
                                text-lg
                                font-semibold
                                text-green-700
                            ">
                                        {{
                                            selectedFormation.participant
                                        }}
                                    </span>
                                </div>
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
                                <Button class="w-full">
                                    Voir les participants
                                </Button>

                                <Button variant="outline" class="w-full">
                                    Télécharger la fiche
                                </Button>
                            </div>
                        </div>

                    </template>
                </div>
          
        </div>
    </div>
</template>
<style scoped>
.preview-enter-from,
.preview-leave-to {
    transform: translateX(200px);
    opacity: 0;
}

.preview-enter-active,
.preview-leave-active {
    transition:
        all 0.25s ease-in-out;
}
</style>