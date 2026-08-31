<script setup lang="ts">
import { BookOpen, CalendarDays, CheckCircle, Clock3, CrosshairIcon, GraduationCap, ShieldCheck, TargetIcon, UserRound, UserRoundCogIcon, Users, UsersRound } from '@lucide/vue';
import Header from '../../../components/shared/Header.vue';
import Input from '../../../components/ui/Input.vue';
import Select from '../../../components/ui/Select.vue';
import { FormationTypeJsonData, VoletJsonData } from '../../../@data/Formation.data.ts';
import Button from '../../../components/ui/Button.vue';
import { router } from '../../../router/index.ts';

</script>

<template>
    <div>
        <Header title="Nouvelle formation" :thumbnails="[
            {
                'label':'Tableau de bord',
                'name':'DASHBOARD'
            },
            {
                'label':'Formation',
                'name':'FORMATION'
            },
            {
                'label':'Nouveau',
                'name':'FORMATION_NEW'
            },
        ]"/>
        <div class="p-4">
            <p>Créez une nouvelle session de formation et définissez les informations nécessaires au suivi des participants.</p>
        </div>
        <div class="flex flex-row items-center justify-center">
            <form class="bg-white p-6 rounded border border-gray-200 w-200 grid grid-cols-2 gap-4">
                <Input label="Titre" class="col-span-2" :icon="BookOpen"/>
                <Select label="Type de formation" class="" :icon="GraduationCap" :options="FormationTypeJsonData"/>
                <Select label="Volet" class="" :options="VoletJsonData" :icon="ShieldCheck"/>
                <Input label="Formateur" class="col-span-2" :icon="UserRound"/>
                <Input label="Cible" class="" :icon="CrosshairIcon"/>
                <Input label="Type cible" class="" :icon="Users"/>
                <Input label="Nombre de partipant" class="col-span-2" type="number" :icon="UsersRound"/>
                <Input label="Date" class="" type="date" :icon="CalendarDays"/>
                <Input label="Durée" class="" type="number" :icon="Clock3"/>
                <div class="col-span-2 flex flex-row items-center justify-end gap-3">
                    <Button :variant="'outline'" @click="router.back()">Annuler</Button>
                    <Button :left-icon="CheckCircle">Confirmer</Button>
                </div>
            </form>
        </div>
    </div>
</template>