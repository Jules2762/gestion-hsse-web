<template>
    <div>
        <Header title="formation.update" :thumbnails="[
            {
                'label': 'thumbnails.home',
                'name': 'DASHBOARD'
            },
            {
                'label': 'thumbnails.training',
                'name': 'FORMATION'
            },
            {
                'label': 'thumbnails.update',
                'name': 'FORMATION_UPDATE'
            },
        ]" />
        <div class="p-4">
            <p>Créez une nouvelle session de formation et définissez les informations nécessaires au suivi des
                participants.</p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 p-4 items-start">
            <!-- FORM -->
            <form @submit.prevent.once="onSubmit()"
                class="lg:col-span-2 bg-white p-6 rounded border border-gray-200 grid grid-cols-2 gap-4">
                <Input required label="Titre" class="col-span-2" :icon="BookOpen" v-model="data.forms.title"
                    placeholder="Entrez le titre" :error="data.errors.title?.[0]" />
                <Select required v-model="data.forms.type" label="Type de formation" :icon="GraduationCap"
                    :options="FormationTypeJsonData" :error="data.errors.type?.[0]" />
                <Select required v-model="data.forms.volet" label="Volet" :options="VoletJsonData" :icon="ShieldCheck"
                    :error="data.errors.volet?.[0]" />
                <Input label="Formateur" class="col-span-2" :icon="UserRound" v-model="data.forms.trainer"
                    placeholder="Entrez le nom du formateur" :error="data.errors.trainer?.[0]" />
                <Input label="Cible" :icon="CrosshairIcon" v-model="data.forms.target" placeholder="Entrez la cible"
                    :error="data.errors.target?.[0]" />
                <Input label="Type cible" :icon="Users" v-model="data.forms.target_type"
                    placeholder="Entrez le type de cible" :error="data.errors.target_type?.[0]" />
                <Input label="Nombre de participants" class="col-span-2" type="number" :icon="UsersRound"
                    v-model="data.forms.participant" placeholder="Entrez le nombre de participants"
                    :error="data.errors.participant?.[0]" :min="0" />
                <Input label="Date" type="date" :icon="CalendarDays" v-model="data.forms.date"
                    placeholder="Sélectionnez la date" :error="data.errors.date?.[0]" />
                <Input label="Durée (heures)" type="time" :icon="Clock3" v-model="data.forms.duration"
                    :error="data.errors.duration?.[0]" />
               <!-- <Select required v-model="data.forms.status" label="Status" :options="FormationTypeJsonData" :icon="ShieldCheck"
                    :error="data.errors.status?.[0]"  class="col-span-2"/> -->
                <div class="col-span-2 flex flex-row items-center justify-end gap-3 pt-2 border-t border-gray-100 mt-2">
                    <Button :variant="'outline'" type="button" @click="router.back()">Annuler</Button>
                    <Button :left-icon="CheckCircle" type="submit" :disabled="disabled"
                        :loading="data.options.loading">Confirmer</Button>
                </div>
            </form>

            <!-- PREVIEW -->
            <PerviewSectionUI :title="data.forms.title" :tags="[data.forms.type, data.forms.volet]">

                <div class="p-5 flex flex-col gap-4">
                    <div class="flex items-start gap-3">
                        <UserRound class="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                        <div>
                            <p class="text-xs text-gray-400">Formateur</p>
                            <p class="text-sm text-gray-800">{{ data.forms.trainer || '—' }}</p>
                        </div>
                    </div>

                    <div class="flex items-start gap-3">
                        <CrosshairIcon class="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                        <div>
                            <p class="text-xs text-gray-400">Cible</p>
                            <p class="text-sm text-gray-800">
                                {{ data.forms.target || '—' }}
                                <span v-if="data.forms.target_type" class="text-gray-400">
                                    ({{ data.forms.target_type }})
                                </span>
                            </p>
                        </div>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div class="flex items-start gap-3">
                            <UsersRound class="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                            <div>
                                <p class="text-xs text-gray-400">Participants</p>
                                <p class="text-sm text-gray-800">{{ data.forms.participant || 0 }}</p>
                            </div>
                        </div>
                        <div class="flex items-start gap-3">
                            <Clock3 class="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                            <div>
                                <p class="text-xs text-gray-400">Durée</p>
                                <p class="text-sm text-gray-800">{{ data.forms.duration? data.forms.duration:'--' }}</p>
                            </div>
                        </div>
                    </div>

                    <div class="flex items-start gap-3 pt-3 border-t border-gray-100">
                        <CalendarDays class="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                        <div>
                            <p class="text-xs text-gray-400">Date</p>
                            <p class="text-sm text-gray-800">{{ formattedDate }}</p>
                        </div>
                    </div>
                </div>
            </PerviewSectionUI>
        </div>
        <LoadingUI v-if="loading_fetch"/>
    </div>
</template>
<script setup lang="ts">
    import { BookOpen, CalendarDays, CheckCircle, Clock3, CrosshairIcon, GraduationCap, ShieldCheck, UserRound, Users, UsersRound } from '@lucide/vue';
    import Header from '../../../components/shared/Header.vue';
    import Input from '../../../components/ui/Input.vue';
    import Select from '../../../components/ui/Select.vue';
    import { FormationTypeJsonData, VoletJsonData } from '../../../@data/Formation.data.ts';
    import Button from '../../../components/ui/Button.vue';
    import { router } from '../../../router/index.ts';
    import type { FormationFormType } from '../../../@types/Formation.type.ts';
    import { computed, onMounted, ref, watch } from 'vue';
    import { useFormationService } from '../../../core/services/formation.service.ts';
    import { toast } from 'vue3-toastify';
    import { useI18n } from 'vue-i18n';
    import PerviewSectionUI from '../../../components/ui/PerviewSectionUI.vue';
import { useRoute } from 'vue-router';
import LoadingUI from '../../../components/ui/LoadingUI.vue';

    const emptyForm = (): FormationFormType => ({
        "title": "",
        "date": "",
        "duration": "00:00",
        "participant": 0,
        "target": "",
        "target_type": "",
        "trainer": "",
        "type": "Atelier",
        "volet": "Environnement",
    //    "status":"SCHEDULED"
    });

    const emptyErrors = (): { [key in keyof FormationFormType]: string[] | undefined } => ({
        "title": [],
        "date": [],
        "duration": [],
        "participant": [],
        "target": [],
        "target_type": [],
        "trainer": [],
        "type": [],
        "volet": [],
        // "status": [],
    });

    const data = ref<{
        forms: FormationFormType,
        errors: { [key in keyof FormationFormType]: string[] | undefined },
        options: {
            loading: boolean,
            disabled: boolean
        }
    }>({
        forms: emptyForm(),
        errors: emptyErrors(),
        options: {
            "loading": false,
            "disabled": false
        }
    });

    const { t } = useI18n();
    const formation = useFormationService();
    const loading_fetch=ref<boolean>(false)

    const formattedDate = computed(() => {
        if (!data.value.forms.date) return '—';
        const d = new Date(data.value.forms.date);
        if (isNaN(d.getTime())) return '—';
        return new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }).format(d);
    });


    // Required fields for the form to be submittable
    const disabled = computed(() => {
        const f = data.value.forms;
        const requiredStrings: (keyof FormationFormType)[] = ['title', 'date', 'trainer', 'target', 'target_type'];
        const hasEmptyString = requiredStrings.some((key) => !String(f[key] ?? '').trim());
        const hasValidParticipant = Number(f.participant) > 0;
        
        return hasEmptyString || !hasValidParticipant ;
    });
    const route=useRoute()

    function onSubmit() {
        if (disabled.value) return;

        data.value.options.loading = true;
        data.value.errors = emptyErrors();

        formation.update(route.params.id as string,data.value.forms).then((res) => {
            data.value.forms = emptyForm();
            console.log(res);
            toast.success(t('formation.notification.add.success'));
            setTimeout(() => {
                router.push({ name: "FORMATION" });
            }, 1000);
        })
            .catch((err) => {
                console.error(err.code);
                if (err?.response?.status == 422) {
                    Object.keys(err?.response.data.errors).forEach((key) => {
                        data.value.errors[key as keyof FormationFormType]?.unshift(
                            t('formation.notification.add.form_error.' + err?.response.data.errors[key][0])
                        );
                    });
                }
            })
            .finally(() => {
                data.value.options.loading = false;
            });
    }
    function fetchData(){
        loading_fetch.value=true
        formation.show(route.params?.id as string)
        .then(res=>{
            console.log(res)
            data.value.forms=res.data
        })
        .catch(err=>{
            console.error(err)
        })
        .finally(()=>{
            loading_fetch.value = false
        })
    }

    // watch(() => data.value.forms.duration, (val) => {
    //     if (val && val.includes(',')) {
    //         data.value.forms.duration = val.replace(',', '.');
    //     }
    // });
    onMounted(()=>{
        fetchData()
    })
</script>