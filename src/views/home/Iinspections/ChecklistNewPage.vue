<script setup lang="ts">
import { Save } from '@lucide/vue';
import { ChecklistTypeData, SiteTypeDataJson } from '../../../@data/Checklist.data.ts';
import Header from '../../../components/shared/Header.vue';
import Button from '../../../components/ui/Button.vue';
import Input from '../../../components/ui/Input.vue';
import Select from '../../../components/ui/Select.vue';
import { router } from '../../../router/index.ts';

</script>

<template>
    <div>
        <Header title="Nouveau inspection" :thumbnails="[
            {
                'label': 'Tableau de bord',
                'name': 'DASHBOARD'
            },
            {
                'label': 'Inspection',
                'name': 'INSPECTION'
            }, {
                'label': 'Checklist',
                'name': 'CHECKLIST'
            }, {
                'label': 'Nouveau',
                'name': 'CHECKLIST_NEW'
            }
        ]" />

        <div class="p-4 flex flex-row items-center justify-center">
            <form class="grid grid-cols-2 col-span-8 w-200  p-6 bg-white rounded border border-gray-200 gap-4">
                <div class="col-span-2 flex flex-col gap-y-3">
                    <h4>Informations de l'inspection</h4>
                    <p>Sélectionnez le type d'inspection puis renseignez les informations de planification.</p>
                </div>
                <Select :options="ChecklistTypeData" label="Type d'inspection" class="col-span-2" />
                <Select :options="SiteTypeDataJson" label="Site" class="col-span-2" />
                <Input label="Date prévue" type="date" />
                <Input label="Heure prévue" type="time" />
                <div class="flex flex-row items-center col-span-2 justify-end gap-x-3">
                    <Button variant="outline" @click="router.back()">Annuler</Button>
                    <Button :left-icon="Save">Créer l'inspection</Button>
                </div>
            </form>

        </div>
    </div>
</template>