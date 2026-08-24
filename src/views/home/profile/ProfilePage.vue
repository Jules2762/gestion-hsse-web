<script setup lang="ts">
import { EditIcon, MailIcon } from '@lucide/vue';
import Header from '../../../components/shared/Header.vue';
import Button from '../../../components/ui/Button.vue';
import { ref } from 'vue';
import RolePermissionSection from '../../../components/features/profile/RolePermissionSection.vue';
import OverviewSection from '../../../components/features/profile/OverviewSection.vue';
import InformationSection from '../../../components/features/profile/InformationSection.vue';
import { router } from '../../../router/index.ts';


const tab_profile = [
    "Vue d'ensemble",
    "Information",
    "Rôle et permission"
]
const selected_tab = ref(0)
</script>

<template>
    <div class="">
        <Header title="Profil" :thumbnails="[
            {
                label: 'Accueil',
                name: 'DASHBOARD'
            }, {
                label: 'Profil',
                name: 'PROFILE'
            }
        ]" />
    </div>
    <div class="p-4 grid grid-cols-6 gap-2">
        <div class="col-span-4 flex flex-col gap-2">
            <div class="bg-white p-4 w-full rounded border border-gray-200">
                <div class="w-full flex flex-row justify-between items-center">
                    <div class="flex flex-row gap-x-3 items-center">
                        <img src="/images/profile.webp"
                            class="w-20 h-20 object-cover rounded-full border-4 border-primary/50" />
                        <div class="">
                            <h4>ARIMANANA Maherison Jules</h4>
                            <div class="flex flex-row items-center gap-x-3">
                                <MailIcon :size="18" />
                                <p>arimananajules@gmail.com</p>
                            </div>
                        </div>
                    </div>
                    <Button :left-icon="EditIcon" variant="outline" @click="router.push({
                        name:'UPDATE_PROFILE'
                    })" >Mettre à jour le profil</Button>
                </div>
                <div class="p-6">
                    <h5>Bio</h5>
                    <p>Passionné par la sécurité, la conformité et l'amélioration continue. J'accompagne les équipes
                        dans le suivi des inspections HSSE, la gestion des actions correctives et la prévention des
                        risques sur le terrain.</p>
                </div>
            </div>
            <div class="bg-white p-4 flex flex-col gap-y-4 w-full rounded border border-gray-200">
                <div class="w-full border-b border-gray-200 px-3 pt-3 gap-x-3 flex flex-row ">
                    <button v-for="(item, index) in tab_profile" :key="index" @click="selected_tab = index" class="pb-2"
                        :class="index == selected_tab ? 'border-b-2 border-primary text-primary' : ''">{{ item
                        }}</button>
                </div>
                <template v-if="selected_tab==0">
                    <OverviewSection/>
                </template>
                <template v-if="selected_tab==1">
                    <InformationSection/>
                </template>
                <template v-if="selected_tab==2">
                    <RolePermissionSection/>
                </template>
            </div>
        </div>
        <div class="col-span-2 flex flex-col gap-2  top-0 ">
            <div class="bg-white flex flex-col gap-y-4 p-4 w-full rounded border border-gray-200">
                <div class="w-full flex flex-col gap-y-3">
                    <h5>Activités récents</h5>
                    <div class="flex flex-col gap-y-2">
                        <div class="border border-gray-200/80 rounded p-4">
                            <h6>Nouveau checklist</h6>
                            <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Neque, totam blanditiis
                                repellendus nisi ...</p>
                        </div>
                        <div class="border border-gray-200/80 rounded p-4">
                            <h6>Nouveau checklist</h6>
                            <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Neque, totam blanditiis
                                repellendus nisi ...</p>
                        </div>
                        <div class="border border-gray-200/80 rounded p-4">
                        <h6>Nouveau checklist</h6>
                        <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Neque, totam blanditiis repellendus nisi ...</p>
                    </div>
                    </div>
                    <Button variant="ghost">Voir plus</Button>
                </div>

            </div>
        </div>
    </div>
</template>