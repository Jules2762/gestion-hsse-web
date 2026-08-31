<template>
    <div class="flex flex-col">
        <Header title="Utilisateur" :thumbnails="[
            {
                label: 'Accueil',
                name: 'DASHBOARD'
            },
            {
                label: 'Administration',
                name: 'ADMINISTRATION'
            },
            {
                label: 'Utilisateur',
                name: 'USERS'
            },
        ]" show-search />
        <div class="bg-white flex flex-row items-center justify-between border-b border-gray-200 p-4">
            <div>
                <ShowMode v-model="show_mode" />

            </div>
            <div class="flex flex-row items-center gap-x-3">
                <Input :icon="UserShield" list_id="user_type_id" :lists="UserRoleData" v-model="filter.role" />
                <Button :left-icon="PlusIcon" @click="router.push({
                    name: 'ADD_USER'
                })">Créer un utilisateur</Button>
            </div>
        </div>
        <div class="flex flex-row">
            <template v-if="show_mode == 0">
                <div class="transition-all" :class="selected_user ? 'w-9/12' : 'w-12/12'">
                    <table>
                        <thead>
                            <tr>
                                <!-- <th>#</th> -->
                                <th>Nom</th>
                                <th>E-mail</th>
                                <th>Téléphone</th>
                                <th>Département</th>
                                <th>Fonction</th>
                                <th>Rôle</th>
                                <th>Status</th>
                                <!-- <th>Action</th> -->
                            </tr>
                        </thead>
                        <tbody>
                            <tr @contextmenu.prevent="($event) => { contextMenu = $event; isOpenContextMenu = true; context_menu_user = item }"
                                v-for="(item, index) in UserData.filter(item => filter.role ? item.role.toLowerCase().includes(filter.role.toLowerCase()) : item)"
                                :key="index" :class="selected_user?.id == item.id ? 'bg-primary/10' : ''"
                                @click="selected_user = item">
                                <!-- <td>{{ index + 1 }}</td> -->
                                <td>{{ item.first_name + " " + item.last_name }}</td>
                                <td>{{ item.email }}</td>
                                <td>{{ item.phone_number }}</td>
                                <td>{{ item?.department }}</td>
                                <td>{{ item?.job }}</td>

                                <td>{{UserRoleDataJson.find(i => i.value == item.role)?.label}}</td>
                                <td>
                                    <UserStatus :name="item.status" />
                                </td>
                                <!-- <td>
                                    <ActionTable 
                                        @click-ban="ban_modal = true" @click-edit="router.push({
                                            name: 'UPDATE_USER',
                                            params: {
                                                id: item.id
                                            }
                                        })"  />
                                </td> -->
                            </tr>
                        </tbody>
                    </table>
                </div>
            </template>
            <template v-if="show_mode == 1">
                <div class="col-span-9">
                    //mode card view
                </div>
            </template>
            <div v-if="selected_user" class="
        col-span-3
        bg-white
        border-l
        border-gray-200
        p-5
        
        overflow-y-auto
        sticky top-0
    " :class="selected_user ? 'w-3/12' : 'w-0'">
                <div class="absolute top-5 right-5">
                    <button @click="selected_user = undefined">
                        <XIcon />
                    </button>
                </div>
                <!-- HEADER -->

                <div class="
            flex
            flex-col
            items-center
            gap-4
           
            pb-5
        ">
                    <div class="
                flex
                h-20
                w-20
                items-center
                justify-center
                rounded-full
                bg-primary/10
                text-2xl
                font-bold
                text-primary
            ">
                        {{
                            selected_user.first_name
                                ?.charAt(0)
                        }}
                    </div>

                    <div class="text-center">
                        <h5>
                            {{
                                selected_user.first_name
                            }}
                            {{
                                selected_user.last_name
                            }}
                        </h5>

                        <p class="
                    text-sm
                    text-gray-500
                ">
                            {{
                                selected_user.email
                            }}
                        </p>
                    </div>

                    <UserStatus :name="selected_user.status
                        " />
                </div>
                <!-- action -->
                <div class="
            
            border-b
            border-gray-200
            py-5
        ">
                    <div class="
                flex
                flex-col
                gap-2
            ">
                        <Button class="w-full" @click="
                            router.push({
                                name:
                                    'PROFILE',
                                params: {
                                    id:
                                        selected_user.id,
                                },
                            })
                            ">
                            Voir profil
                        </Button>

                        <Button variant="outline" class="w-full" @click="
                            router.push({
                                name:
                                    'ROLE_PERMISSION',
                                params: {
                                    id:
                                        selected_user.id,
                                },
                            })
                            ">
                            Rôles et permissions
                        </Button>
                    </div>
                </div>
                <!-- ORGANISATION -->

                <div class="mt-5">
                    <h6 class="
                mb-4
                text-gray-500
            ">
                        Organisation
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
                                Département
                            </span>

                            <p>
                                {{
                                    selected_user.department ??
                                    "-"
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
                                    selected_user.job ??
                                    "-"
                                }}
                            </p>
                        </div>

                        <div>
                            <span class="
                        text-xs
                        text-gray-500
                    ">
                                Téléphone
                            </span>

                            <p>
                                {{
                                    selected_user.phone_number ??
                                    "-"
                                }}
                            </p>
                        </div>
                    </div>
                </div>

                <!-- ROLE -->

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
                        Accès
                    </h6>

                    <div>
                        <span class="
                    text-xs
                    text-gray-500
                ">
                            Rôle
                        </span>

                        <div class="
                    mt-2
                ">
                            <span class="
                        rounded-full
                        bg-primary/10
                        px-3
                        py-1
                        text-sm
                        text-primary
                    ">
                                {{
                                    UserRoleDataJson.find(
                                        role =>
                                            role.value ===
                                            selected_user?.role,
                                    )?.label
                                }}
                            </span>
                        </div>
                    </div>

                    <div class="mt-5">
                        <span class="
                    text-xs
                    text-gray-500
                ">
                            Permissions
                        </span>

                        <p class="mt-1">
                            {{
                                permissionsCount
                            }}
                            permission(s)
                        </p>
                    </div>
                </div>

                <!-- PERMISSIONS -->

                <div v-if="
                    selected_user
                        .permissions
                        ?.length
                " class="
            mt-5
        ">
                    <div class="
                flex
                flex-wrap
                gap-2
            ">
                        <span v-for="
permission in
    selected_user.permissions
                " :key="permission.name
                    " class="
                    rounded-full
                    bg-slate-100
                    px-3
                    py-1
                    text-xs
                ">
                            {{
                                permission.name
                            }}
                        </span>
                    </div>
                </div>

                <!-- ACTIONS -->


            </div>
        </div>
        <CenterModal :is-open="ban_modal" title="Désactiver le compte utilisateur ?" @close="ban_modal = false">
            <p class="max-w-100 p-4   rounded">
                Cet utilisateur ne pourra plus se connecter à la plateforme GALANA HSSE ni accéder aux inspections,
                rapports et
                fonctionnalités qui lui sont attribués.
                <br>
                <br>
                Vous pourrez le réactiver ultérieurement si nécessaire.
            </p>
        </CenterModal>
        <ContextMenuUI v-model:is-open="isOpenContextMenu" :context-menu="contextMenu">
            <div class="flex flex-col ">
                <button @click="router.push({
                    name: 'PROFILE',
                    params: {
                        id: context_menu_user?.id
                    }
                })" class="flex flex-row gap-x-3 items-center text-gray-600 w-full p-1 hover:bg-gray-100">
                    <User />
                    <span>Utilisateur</span>
                </button>
                <button @click="router.push(
                    {
                        name: 'ROLE_PERMISSION',
                        params: {
                            id: context_menu_user?.id
                        }
                    }
                )" class="flex flex-row gap-x-3 items-center text-gray-600 w-full p-1 hover:bg-gray-100">
                    <UserCog2 />
                    <span>Rôle et permissions</span>
                </button>
            </div>
        </ContextMenuUI>
    </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import Header from '../../../components/shared/Header.vue';
import ShowMode from '../../../components/ui/ShowMode.vue';
import Button from '../../../components/ui/Button.vue';
import { Eye, PlusIcon, User, UserCog2, UserShield, XIcon } from '@lucide/vue';
import Input from '../../../components/ui/Input.vue';
import { UserData, UserRoleData, UserRoleDataJson } from '../../../@data/User.data';
import ActionTable from '../../../components/ui/ActionTable.vue';
import { router } from '../../../router/index.ts';
import CenterModal from '../../../components/ui/centerModal.vue';
import UserStatus from '../../../components/features/user/UserStatus.vue';
import type { contextMenuType } from '../../../@types/ContextMenu.type.ts';
import ContextMenuUI from '../../../components/ui/ContextMenuUI.vue';
import type { UserDataType, UserRoleType } from '../../../@types/User.type.ts';
import { computed } from 'vue'

const show_mode = ref(0)
const ban_modal = ref(false)
const contextMenu = ref<contextMenuType>()
const isOpenContextMenu = ref(false)
const selected_user = ref<UserDataType>()
const context_menu_user = ref<UserDataType>()
const filter = ref<{ role?: UserRoleType }>({
    role: undefined
})

const permissionsCount = computed(
    () =>
        selected_user.value
            ?.permissions?.length ?? 0,
)
</script>