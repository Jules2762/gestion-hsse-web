<script setup lang="ts">
import { computed, ref } from 'vue';
import { UserData, UserRoleDataJson } from '../../../@data/User.data.ts';
import Header from '../../../components/shared/Header.vue';
import { router } from '../../../router/index.ts';
import ActionTable from '../../../components/ui/ActionTable.vue';
import type { UserDataType } from '../../../@types/User.type.ts';
import type { LogType, LogTypeType } from '../../../@types/Logs.type.ts';
import { LogData, LogTypeData } from '../../../@data/Logs.data.ts';
import { Logs, XIcon } from '@lucide/vue';
import ShowMode from '../../../components/ui/ShowMode.vue';
import Input from '../../../components/ui/Input.vue';
const show_mode = ref(0)
const selectedUser = computed(() => {
    return UserData.find(
        user => user.id === selected_log.value?.user_id,
    )
})
const filter = ref<{
    type?: LogTypeType
}>({
    type:undefined
})
const selected_log = ref<LogType>()
const data = ref([...LogData])
const dataFiltered = computed(() => {
    return data.value.filter(item => filter.value?.type ? item.type.includes(filter.value.type) : item)
})
</script>

<template>
    <div class="">
        <Header title="Activités" show-search :thumbnails="[
            {
                label: 'Accueil',
                name: 'DASHBOARD'
            }, {
                label: 'Administration',
                name: 'ADMINISTRATION'
            }, {
                label: 'Activité',
                name: 'ACTIVITY'
            }
        ]" />
        <div class="bg-white  border-b border-gray-200 p-4 flex flex-row items-center justify-between">
            <ShowMode v-model="show_mode"></ShowMode>
            <div class="flex flex-row items-center gap-3">
                <Input list_id="type_id" :lists="LogTypeData" :icon="Logs" v-model="filter.type" />
            </div>
        </div>
        <div class="flex flex-row">
            <table class="transition-all" :class="selected_log ? ' w-9/12' : 'w-12/12'">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>type</th>
                        <th>titre</th>
                        <th>Description</th>
                        <th>ID utilisateur</th>
                        <th>date</th>

                        <!-- <th>Action</th> -->
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in dataFiltered" :key="index" @click="selected_log = item"
                        :class="selected_log?.id == item.id ? 'bg-primary/10' : ''">
                        <td>{{ index + 1 }}</td>
                        <td>{{ item.type }}</td>
                        <td>{{ item.title }}</td>
                        <td>{{ item.description }}</td>
                        <td>{{ item.user_id }}</td>
                        <td>{{ item.created_at }}</td>
                        <!-- <td>

                        </td> -->
                    </tr>
                </tbody>
            </table>
            <div v-if="selected_log" :class="selected_log ? ' w-3/12' : 'w-0'" class="
        bg-white
        border-l
        border-gray-200
        sticky
        top-0
        transition-all
        h-fit
        p-4
    ">
                <!-- HEADER -->

                <div class="
            flex
            items-center
            justify-between
            pb-4
            border-b
            border-gray-200
        ">
                    <div>
                        <h5>
                            Détails de l'activité
                        </h5>

                        <p class="
                    text-xs
                    text-gray-500
                ">
                            Journal d'audit
                        </p>
                    </div>

                    <button class="
                rounded-lg
                p-2
                hover:bg-slate-100
            " @click="
                selected_log =
                undefined
                ">
                        <XIcon :size="18" />
                    </button>
                </div>

                <!-- ACTIVITY -->

                <div class="
            mt-5
            rounded-xl
            border
            border-primary/20
            bg-primary/5
            p-4
        ">
                    <h6>
                        {{
                            selected_log.title
                        }}
                    </h6>

                    <p class="
                mt-2
                text-sm
                text-gray-600
            ">
                        {{
                            selected_log.description
                        }}
                    </p>

                    <span class="
                mt-4
                inline-flex
                rounded-full
                bg-primary/10
                px-3
                py-1
                text-xs
                font-medium
                text-primary
            ">
                        {{
                            selected_log.type
                        }}
                    </span>
                </div>

                <!-- DATE -->

                <div class="mt-6">
                    <span class="
                text-xs
                uppercase
                tracking-wide
                text-gray-500
            ">
                        Date et heure
                    </span>

                    <p class="mt-1">
                        {{
                            selected_log.created_at
                        }}
                    </p>
                </div>

                <!-- USER -->

                <template v-if="selectedUser">
                    <div class="
                mt-6
                border-t
                border-gray-200
                pt-5
            ">
                        <h6 class="mb-4">
                            Utilisateur
                        </h6>

                        <div class="
                    flex
                    items-center
                    gap-3
                ">
                            <img v-if="
                                selectedUser.image_path
                            " :src="selectedUser.image_path
                                " class="
                        h-14
                        w-14
                        rounded-full
                        object-cover
                    " />

                            <div>
                                <p class="
                            font-medium
                        ">
                                    {{
                                        selectedUser.first_name
                                    }}
                                    {{
                                        selectedUser.last_name
                                    }}
                                </p>

                                <p class="
                            text-sm
                            text-gray-500
                        ">
                                    {{
                                        selectedUser.email
                                    }}
                                </p>
                            </div>
                        </div>
                    </div>

                    <!-- ROLE -->

                    <div class="mt-5">
                        <span class="
                    text-xs
                    uppercase
                    tracking-wide
                    text-gray-500
                ">
                            Rôle
                        </span>

                        <div class="mt-2">
                            <span class="
                        rounded-full
                        bg-green-100
                        px-3
                        py-1
                        text-xs
                        font-medium
                        text-green-700
                    ">
                                {{
                                    UserRoleDataJson.find(
                                        role =>
                                            role.value ===
                                            selectedUser?.role
                                    )?.label
                                }}
                            </span>
                        </div>
                    </div>

                    <!-- CONTACT -->

                    <div class="
                mt-6
                border-t
                border-gray-200
                pt-5
            ">
                        <h6 class="mb-4">
                            Informations
                        </h6>

                        <div class="
                    flex
                    flex-col
                    gap-4
                ">
                            <div>
                                <span class="
                            text-xs
                            text-gray-500
                        ">
                                    Téléphone
                                </span>

                                <p>
                                    {{
                                        selectedUser.phone_number ??
                                        '-'
                                    }}
                                </p>
                            </div>

                            <div>
                                <span class="
                            text-xs
                            text-gray-500
                        ">
                                    Département
                                </span>

                                <p>
                                    {{
                                        selectedUser.department ??
                                        '-'
                                    }}
                                </p>
                            </div>

                            <div>
                                <span class="
                            text-xs
                            text-gray-500
                        ">
                                    Fonction
                                </span>

                                <p>
                                    {{
                                        selectedUser.job ??
                                        '-'
                                    }}
                                </p>
                            </div>

                            <div>
                                <span class="
                            text-xs
                            text-gray-500
                        ">
                                    Statut
                                </span>

                                <div class="mt-1">
                                    <span class="
                                rounded-full
                                px-3
                                py-1
                                text-xs
                                font-medium
                            " :class="selectedUser.status ===
                                'ENABLED'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-red-100 text-red-700'
                                ">
                                        {{
                                            selectedUser.status ===
                                                'ENABLED'
                                                ? 'Actif'
                                                : 'Inactif'
                                        }}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>
            </div>
        </div>
    </div>
</template>