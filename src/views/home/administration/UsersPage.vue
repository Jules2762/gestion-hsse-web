

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
                <Input :icon="UserShield" list_id="user_type_id" :lists="UserRoleData" />
                <Button :left-icon="PlusIcon" @click="router.push({
                    name: 'ADD_USER'
                })">Créer un utilisateur</Button>
            </div>
        </div>
        <template v-if="show_mode == 0">
            <div class="p-4">
                <table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Nom</th>
                            <th>E-mail</th>
                            <th>Téléphone</th>
                            <th>Département</th>
                            <th>Fonction</th>
                            <th>Rôle</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in UserData" :key="index">
                            <td>{{ index + 1 }}</td>
                            <td>{{ item.first_name + " " + item.last_name }}</td>
                            <td>{{ item.email }}</td>
                            <td>{{ item.phone_number }}</td>
                            <td>{{ item?.department }}</td>
                            <td>{{ item?.job }}</td>
                            <td>
                                <UserStatus :name="item.status"/>
                            </td>
                            <td>{{UserRoleDataJson.find(i => i.value == item.role)?.label}}</td>
                            <td>
                                <ActionTable show-details show-edit show-ban @click-details="router.push({
                                    name:'PROFILE',
                                    params:{
                                        id:item.id
                                    }
                                })" @click-ban="ban_modal=true" @click-edit="router.push({
                                    name:'UPDATE_USER',
                                    params:{
                                        id:item.id
                                    }
                                })"/>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </template>
        <template v-if="show_mode == 1">
            <div class="">

            </div>
        </template>
        <CenterModal :is-open="ban_modal" title="Désactiver le compte utilisateur ?" @close="ban_modal=false">
            <p class="max-w-100 p-4   rounded">
                Cet utilisateur ne pourra plus se connecter à la plateforme GALANA HSSE ni accéder aux inspections,
                rapports et
                fonctionnalités qui lui sont attribués.
                <br>
                <br>
                Vous pourrez le réactiver ultérieurement si nécessaire. 
            </p>
        </CenterModal>
    </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import Header from '../../../components/shared/Header.vue';
import ShowMode from '../../../components/ui/ShowMode.vue';
import Button from '../../../components/ui/Button.vue';
import { PlusIcon, UserShield } from '@lucide/vue';
import Input from '../../../components/ui/Input.vue';
import { UserData, UserRoleData, UserRoleDataJson } from '../../../@data/User.data';
import ActionTable from '../../../components/ui/ActionTable.vue';
import { router } from '../../../router/index.ts';
import CenterModal from '../../../components/ui/centerModal.vue';
import UserStatus from '../../../components/features/user/UserStatus.vue';

const show_mode = ref(0)
const ban_modal=ref(false)
</script>