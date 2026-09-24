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

        <div class="p-4 grid grid-cols-12 gap-4">
            <form @submit.prevent="onSubmit()" class=" col-span-8 grid grid-cols-2  p-6 bg-white rounded border border-gray-200 gap-4">
                <div class="col-span-2 flex flex-col gap-y-3">
                    <h4>Informations de l'inspection</h4>
                    <p>Sélectionnez le type d'inspection puis renseignez les informations de planification.</p>
                </div>
                <Select :options="ChecklistTypeData" v-model="data.type" label="Type d'inspection" class="col-span-2" />
                <Select :options="SiteTypeDataJson" label="Site" v-model="data.site" class="col-span-2" />
                <Input label="Date prévue" type="date" v-model="data.date" />
                <Input label="Heure prévue" type="time" v-model="data.time" />
                <div class="flex flex-row items-center col-span-2 justify-end gap-x-3">
                    <Button variant="outline" @click="router.back()" type="button">Annuler</Button>
                    <Button :left-icon="Save" :loading="loading_submit" :disabled="disabled_submit" type="submit">Créer l'inspection</Button>
                </div>
            </form>
            
            <!-- PREVIEW -->
            <div class="col-span-4">
                <div class="bg-white rounded border border-gray-200 sticky top-4 overflow-hidden">

                    <!-- HEADER -->
                    <div class="p-5 border-b border-gray-200">
                        <div class="flex items-start justify-between gap-3">

                            <div class="min-w-0">
                                <p class="text-xs uppercase tracking-widest text-gray-400">
                                    Aperçu
                                </p>

                                <h4 class="mt-1">
                                    Nouvelle inspection
                                </h4>

                                <p class="mt-1 text-sm text-gray-500">
                                    Vérifiez les informations avant de créer l'inspection.
                                </p>
                            </div>

                            <div
                                class="shrink-0 w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                <ClipboardCheck :size="20" />
                            </div>

                        </div>
                    </div>

                    <!-- TYPE -->
                    <div class="p-5 border-b border-gray-200">

                        <p class="text-xs uppercase tracking-wider text-gray-400 mb-3">
                            Type d'inspection
                        </p>

                        <div v-if="data.type" class="flex items-center gap-3">
                            <div class="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                                <ClipboardCheck :size="17" class="text-primary" />
                            </div>

                            <div class="min-w-0">
                                <p class="font-medium truncate">
                                    {{ data.type }}
                                </p>

                                <p class="text-xs text-gray-500">
                                    Type sélectionné
                                </p>
                            </div>
                        </div>

                        <div v-else class="text-sm text-gray-400">
                            Aucun type sélectionné
                        </div>

                    </div>

                    <!-- PLANIFICATION -->
                    <div class="p-5 border-b border-gray-200">

                        <p class="text-xs uppercase tracking-wider text-gray-400 mb-4">
                            Planification
                        </p>

                        <div class="grid grid-cols-2 gap-4">

                            <!-- SITE -->
                            <div class="col-span-2">
                                <p class="text-xs text-gray-500">
                                    Site
                                </p>

                                <p v-if="data.site" class="mt-1 font-medium">
                                    {{ data.site }}
                                </p>

                                <p v-else class="mt-1 text-sm text-gray-400">
                                    Non renseigné
                                </p>
                            </div>

                            <!-- DATE -->
                            <div>
                                <p class="text-xs text-gray-500">
                                    Date prévue
                                </p>

                                <p v-if="data.date" class="mt-1 font-medium">
                                    {{ data.date }}
                                </p>

                                <p v-else class="mt-1 text-sm text-gray-400">
                                    Non renseignée
                                </p>
                            </div>

                            <!-- HEURE -->
                            <div>
                                <p class="text-xs text-gray-500">
                                    Heure prévue
                                </p>

                                <p v-if="data.time" class="mt-1 font-medium">
                                    {{ data.time }}
                                </p>

                                <p v-else class="mt-1 text-sm text-gray-400">
                                    Non renseignée
                                </p>
                            </div>

                        </div>
                    </div>

                    <!-- RÉSUMÉ -->
                    <div class="p-5">

                        <p class="text-xs uppercase tracking-wider text-gray-400 mb-4">
                            Résumé
                        </p>

                        <div class="rounded-xl bg-slate-50 border border-slate-100 p-4">

                            <div class="flex items-center justify-between">
                                <span class="text-sm text-gray-500">
                                    Type
                                </span>

                                <span class="text-sm font-medium"
                                    :class="data.type ? 'text-gray-800' : 'text-gray-400'">
                                    {{ data.type || '—' }}
                                </span>
                            </div>

                            <div class="h-px bg-gray-200 my-3" />

                            <div class="flex items-center justify-between">
                                <span class="text-sm text-gray-500">
                                    Site
                                </span>

                                <span class="text-sm font-medium text-right max-w-40 truncate"
                                    :class="data.site ? 'text-gray-800' : 'text-gray-400'">
                                    {{ data.site || '—' }}
                                </span>
                            </div>

                            <div class="h-px bg-gray-200 my-3" />

                            <div class="flex items-center justify-between">
                                <span class="text-sm text-gray-500">
                                    Date
                                </span>

                                <span class="text-sm font-medium"
                                    :class="data.date ? 'text-gray-800' : 'text-gray-400'">
                                    {{ data.date || '—' }}
                                </span>
                            </div>

                            <div class="h-px bg-gray-200 my-3" />

                            <div class="flex items-center justify-between">
                                <span class="text-sm text-gray-500">
                                    Heure
                                </span>

                                <span class="text-sm font-medium"
                                    :class="data.time ? 'text-gray-800' : 'text-gray-400'">
                                    {{ data.time || '—' }}
                                </span>
                            </div>

                        </div>

                        <!-- STATUS -->
                        <div class="mt-4 flex items-center gap-2 text-xs"
                            :class="disabled_submit ? 'text-gray-400' : 'text-green-600'">
                            <span class="w-2 h-2 rounded-full"
                                :class="disabled_submit ? 'bg-gray-300' : 'bg-green-500'" />

                            <span>
                                {{
                                    disabled_submit
                                        ? 'Informations incomplètes'
                                        : 'Inspection prête à être créée'
                                }}
                            </span>
                        </div>

                    </div>

                </div>
            </div>
            

        </div>
    </div>
</template>
<script setup lang="ts">
    import { ClipboardCheck, Save } from '@lucide/vue';
    import { ChecklistTypeData, SiteTypeDataJson } from '../../../@data/Checklist.data.ts';
    import Header from '../../../components/shared/Header.vue';
    import Button from '../../../components/ui/Button.vue';
    import Input from '../../../components/ui/Input.vue';
    import Select from '../../../components/ui/Select.vue';
    import { router } from '../../../router/index.ts';
    import type { ChecklistTemplateType } from '../../../@types/ChecklistTemplate.type.ts';
    import { onMounted, ref, watch } from 'vue';
    import { useTemplateService } from '../../../core/services/template.service.ts';
    import { useChecklistService } from '../../../core/services/checklist.service.ts';
    import type { CheckllistFormType } from '../../../@types/Checklist.type.ts';
    const templates = ref<ChecklistTemplateType[]>()
    const data = ref<CheckllistFormType>({
        type: undefined,
        site: undefined,
        date: undefined,
        time: undefined
    })
    const templateService = useTemplateService()
    const checklistService = useChecklistService()
    const loading_submit = ref<boolean>(false)
    const disabled_submit = ref<boolean>(true)
    function fetchDataTemplate() {
        templateService.index()
            .then(res => {
                console.log(res.data.data)
                templates.value = res.data.data
            })
            .catch(err => {
                console.error(err)
            })
    }
    function onSubmit() {
        loading_submit.value = true
        checklistService.store(data.value)
        checklistService.store(data.value)
        .then(res=>{
            console.log(res.data)
            router.push({
                name:'CHECKLIST'
            })
        })
        .catch(err=>{
            console.error(err)
        })
        .finally(()=>{
            loading_submit.value=false
        })
    }
    onMounted(() => {
        fetchDataTemplate()
    })
    watch(data.value, () => {
        disabled_submit.value=Object.values(data.value).some(value=>value==undefined||value=='')
    })
</script>