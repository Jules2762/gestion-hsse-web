<template>
    <div>
        <Header title="Nouvelle formation" :thumbnails="[
            {
                'label': 'Tableau de bord',
                'name': 'DASHBOARD'
            },
            {
                'label': 'Formation',
                'name': 'FORMATION'
            },
            {
                'label': 'Nouveau',
                'name': 'FORMATION_NEW'
            },
        ]" />
        <div class="p-4">
            <p>Créez une nouvelle session de formation et définissez les informations nécessaires au suivi des
                participants.</p>
        </div>
        <div class="flex flex-row items-center justify-center">
            <form @submit.prevent="onSubmit()" class="bg-white p-6 rounded border border-gray-200 w-200 grid grid-cols-2 gap-4">
                <Input label="Titre" class="col-span-2" :icon="BookOpen" v-model="data.forms.title"
                    placeholder="Entrez le titre" :error="data.errors.title?.[0]" />
                <Select  v-model="data.forms.type" label="Type de formation" class="" :icon="GraduationCap"
                    :options="FormationTypeJsonData" :error="data.errors.type?.[0]" />
                <Select v-model="data.forms.volet" label="Volet" class="" :options="VoletJsonData"
                    :icon="ShieldCheck"  :error="data.errors.volet?.[0]" />
                <Input label="Formateur" class="col-span-2" :icon="UserRound" v-model="data.forms.trainer"
                    placeholder="Entrez le nom du formateur" :error="data.errors.trainer?.[0]" />
                <Input label="Cible" class="" :icon="CrosshairIcon" v-model="data.forms.target"
                    placeholder="Entrez la cible" :error="data.errors.target?.[0]" />
                <Input label="Type cible" class="" :icon="Users" v-model="data.forms.target_type"
                    placeholder="Entrez le type de cible" :error="data.errors.target_type?.[0]" />
                <Input label="Nombre de partipant" class="col-span-2" type="number" :icon="UsersRound"
                    v-model="data.forms.participant" placeholder="Entrez le nombre de participants"                     :error="data.errors.participant?.[0]" />
                <Input label="Date" class="" type="date" :icon="CalendarDays" v-model="data.forms.date"
                    placeholder="Sélectionnez la date" :error="data.errors.date?.[0]"/>
                <Input input-mode="decimal" label="Durée" class="" type="text" :icon="Clock3" v-model="data.forms.duration"
                    placeholder="0.00" :error="data.errors.duration?.[0]" />
                <div class="col-span-2 flex flex-row items-center justify-end gap-3">
                    <Button :variant="'outline'" type="button"  @click="router.back()">Annuler</Button>
                    <Button :left-icon="CheckCircle" type='submit' :loading="data.options.loading">Confirmer</Button>
                </div>
            </form>
        </div>
    </div>
</template>
<script setup lang="ts">
    import { BookOpen, CalendarDays, CheckCircle, Clock3, CrosshairIcon, GraduationCap, ShieldCheck, TargetIcon, UserRound, UserRoundCogIcon, Users, UsersRound } from '@lucide/vue';
    import Header from '../../../components/shared/Header.vue';
    import Input from '../../../components/ui/Input.vue';
    import Select from '../../../components/ui/Select.vue';
    import { FormationTypeJsonData, VoletJsonData } from '../../../@data/Formation.data.ts';
    import Button from '../../../components/ui/Button.vue';
    import { router } from '../../../router/index.ts';
    import type { FormationFormType } from '../../../@types/Formation.type.ts';
    import { computed, ref, watch } from 'vue';
import { useFormationService } from '../../../core/services/formation.service.ts';
import { toast } from 'vue3-toastify';
import { useI18n } from 'vue-i18n';

    const data = ref<{
        forms: FormationFormType,
        errors: {
            [key in keyof FormationFormType]: string[]|undefined
        },
        options:{
            loading:boolean,
            disabled:boolean
        }
    }>({
        forms: {
            "title": "",
            "date": "",
            "duration": "0.00",
            "participant": 0,
            "target": "",
            "target_type": "",
            "trainer": "",
            "type": "Atelier",
            "volet": "Environnement",

        }, errors: {
            "title": [],
            "date": [],
            "duration": [],
            "participant": [],
            "target": [],
            "target_type": [],
            "trainer": [],
            "type": [],
            "volet": [],
        },
        options:{
            "loading":false,
            "disabled":false
        }
    })
    const {t}=useI18n()
const formation=useFormationService()

    function onSubmit(){

        data.value.options.loading=true
        data.value.errors={
            "title": [],
            "date": [],
            "duration": [],
            "participant": [],
            "target": [],
            "target_type": [],
            "trainer": [],
            "type": [],
            "volet": [],
        }
        formation.store(data.value.forms).then((res)=>{
            data.value.forms={
                "title": "",
                "date": "",
                "duration": "0.00",
                "participant": 0,
                "target": "",
                "target_type": "",
                "trainer": "",
                "type": "Atelier",
                "volet": "Environnement",
            }
            console.log(res)
            toast.success(t('formation.notification.add.success'))
            setTimeout(()=>{
                router.push({
                    name:"FORMATION"
                })
            },1000)
        })
        .catch((err)=>{
            console.error(err.code)
            if(err?.response?.status==422){
                Object.keys(err?.response.data.errors).forEach((key) => {
                    data.value.errors[key as keyof FormationFormType]?.unshift(t('formation.notification.add.form_error.' + err?.response.data.errors[key][0]))
                })    
            }        
            // console.error(err?.response?.data?.errors)
        })
        .finally(()=>{
            data.value.options.loading=false
        })
    }

   
       watch(data.value,()=>{
            data.value.forms.duration=data.value.forms.duration.replace(',', '.')
       })
    
</script>
