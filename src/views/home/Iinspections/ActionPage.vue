<script setup lang="ts">
import { ref } from 'vue';
import { UserData, UserRoleDataJson } from '../../../@data/User.data.ts';
import Header from '../../../components/shared/Header.vue';
import { router } from '../../../router/index.ts';
import ActionTable from '../../../components/ui/ActionTable.vue';
import ActionStatus from '../../../components/features/action/ActionStatus.vue';
import ShowMode from '../../../components/ui/ShowMode.vue';
import Input from '../../../components/ui/Input.vue';
import { Calendar1Icon, Type } from '@lucide/vue';
import Select from '../../../components/ui/Select.vue';
import UserCard from '../../../components/features/user/UserCard.vue';
const show_mode = ref(0)

</script>

<template>
    <div>
        <Header title="Gestion des actions correctives" show-search :thumbnails="[
            {
                label: 'Accueil',
                name: 'DASHBOARD'
            }, {
                label: 'Inspection',
                name: 'INSPECTION'
            }, {
                label: 'Actions',
                name: 'ACTION'
            }
        ]" />
        <div class="bg-white p-4 border-b border-gray-200 h-18 flex flex-row items-center justify-between">
            <!-- <ShowMode v-model="show_mode"/> -->
             <div></div>
            <div class="flex flex-row gap-x-3 items-center">
                <Select :icon="Type" class="min-w-80"/>
                <Input :icon="Calendar1Icon" class="min-w-80"/>
            </div>
        </div>
        <template  v-if="show_mode==0">
           <div class="p-4">
             <table >
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Date</th>
                        <th>Inspection</th>
                        <th>Inspecteur</th>
                        <th>Action corrective</th>
                        <th>Responsable</th>
                        <th>status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>1</td>
                        <td>16-06-2023</td>
                        <td>Lorem ipsum dolor sit amet consectetur.</td>
                        <td>Jules ARIMANANA</td>
                        <td>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</td>
                        <td>Dozel RAKOTOSON</td>
                        <td>
                            <ActionStatus name="IN_PROGRESS" />
                        </td>
                        <td>
                            <ActionTable show-user />
                        </td>
                    </tr>
                </tbody>
            </table>
           </div>
        </template >
        <template v-else>
            <div class="grid grid-cols-4 gap-3">
                
            </div>
        </template>
    </div>
</template>