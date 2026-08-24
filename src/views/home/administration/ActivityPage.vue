<script setup lang="ts">
import { ref } from 'vue';
import { UserData, UserRoleDataJson } from '../../../@data/User.data.ts';
import Header from '../../../components/shared/Header.vue';
import { router } from '../../../router/index.ts';
import ActionTable from '../../../components/ui/ActionTable.vue';
const show_mode = ref(0)

</script>

<template>
    <div>
        <Header title="Activités" show-search :thumbnails="[
            {
                label:'Accueil',
                name:'DASHBOARD'
            },{
                label:'Administration',
                name:'ADMINISTRATION'
            },{
                label:'Activité',
                name:'ACTIVITY'
            }
        ]"/>
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
                            <td>{{UserRoleDataJson.find(i => i.value == item.role)?.label}}</td>
                            <td>
                                <ActionTable show-user  @click-user="router.push({
                                    name:'PROFILE',
                                    params:{
                                        id:item.id
                                    }
                                })" @click-edit="router.push({
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
    </div>
</template>