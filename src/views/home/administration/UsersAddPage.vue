<script setup lang="ts">
import { Briefcase, Building2Icon, CheckCircle, LockIcon, LockKeyhole, MailIcon, UserCog2Icon } from '@lucide/vue';
import Header from '../../../components/shared/Header.vue';
import Input from '../../../components/ui/Input.vue';
import Button from '../../../components/ui/Button.vue';
import Select from '../../../components/ui/Select.vue';
import { UserRoleData, UserRoleDataJson } from '../../../@data/User.data.ts';
import { router } from '../../../router/index.ts';

</script>

<template>
    <div class="flex flex-col gap-y-4">
        <Header title="Nouveau compte utilisateur" :thumbnails="[
            {
                label: 'Accueil',
                name: 'DASHBOARD'
            },
            {
                label: 'Admministration',
                name: 'ADMINISTRATION'
            },
            {
                label: 'Utilisateur',
                name: 'USERS'
            },
            {
                label: 'Nouveau',
                name: 'ADD_USER'
            },
        ]" />
        <form class="flex flex-col gap-y-4">
            <div class="m-4 grid grid-cols-6 gap-3">
                <div class="col-span-4 p-6 bg-white border border-gray-200 flex flex-col gap-4">
                    <h5>Information générale</h5>
                    <div class="grid grid-cols-2 gap-3">

                        <Input label="Nom" :icon="MailIcon" />
                        <Input label="Prenom" :icon="LockIcon" />

                        <Input label="Numéro de téléphone" :icon="LockKeyhole" class="col-span-2" />
                        <Input label="Departement" :icon="Building2Icon" />
                        <Input label="Fonction" :icon="Briefcase" />
                    </div>
                </div>
                <div class="col-span-2 p-6 bg-white border border-gray-200 flex flex-col gap-y-4">
                    <h5>Sécurisation</h5>
                    <div class="flex flex-col gap-y-3">
                        <Input label="E-mail" :icon="MailIcon" />
                        <Input label="Mot de passe" :icon="LockIcon" />
                        <Input label="Confirmation de mot de passe" :icon="LockKeyhole" />
                        <Select label="Rôle" :icon="UserCog2Icon" :options="UserRoleDataJson" />
                    </div>
                </div>
            </div>
            <div class="w-full flex flex-row items-center justify-end px-4 gap-3">
                <Button variant="outline" @click="router.back()" type="button">Annuler</Button>
                <Button type="submit" :left-icon="CheckCircle">Enregistrer</Button>
            </div>
        </form>
    </div>
</template>