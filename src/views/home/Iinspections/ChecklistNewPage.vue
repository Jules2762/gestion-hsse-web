<template>
    <div>
        <Header title="inspections.checklists.new" :thumbnails="[
            {
                'label': 'thumbnails.home',
                'name': 'DASHBOARD'
            },
            {
                'label': 'thumbnails.inspections',
                'name': 'INSPECTION'
            }, {
                'label': 'thumbnails.checklists',
                'name': 'CHECKLIST'
            }, {
                'label': 'thumbnails.new',
                'name': 'CHECKLIST_NEW'
            }
        ]" />

        <div class="p-4 grid grid-cols-12 gap-4">
            <form @submit.prevent="onSubmit()" class=" col-span-8 grid grid-cols-2  p-6 bg-white rounded border border-gray-200 gap-4">
                <div class="col-span-2 flex flex-col gap-y-3">
                    <h4>Informations de l'inspection</h4>
                    <p>Sélectionnez le type d'inspection puis renseignez les informations de planification.</p>
                </div>
                <Select required :options="dynamicTypes" v-model="data.type" label="Type d'inspection" class="col-span-2" />
                <Select required :options="dynamicSites" label="Catégorie de site" v-model="data.site" class="col-span-2" />
                <Input
                    label="Emplacement / Station Galana (Localisation GPS)"
                    v-model="data.location"
                    placeholder="Ex: ANKORONDRANO, TAMATAVE, AINA, AMBANJA..."
                    :lists="stationList"
                    list_id="checklist_stations_datalist"
                    class="col-span-2"
                />
                <Input label="Date prévue" type="date" v-model="data.date" required />
                <Input label="Heure prévue" type="time" v-model="data.time" required />
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
                                    {{ getSelectedTypeLabel() }}
                                </p>

                                <p class="text-xs text-gray-500 truncate">
                                    {{ data.type }}
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
                                    Catégorie de site
                                </p>

                                <p v-if="data.site" class="mt-1 font-medium">
                                    {{ data.site }}
                                </p>

                                <p v-else class="mt-1 text-sm text-gray-400">
                                    Non renseigné
                                </p>
                            </div>

                            <!-- LOCALISATION / STATION -->
                            <div class="col-span-2">
                                <p class="text-xs text-gray-500">
                                    Station / Localisation
                                </p>

                                <p v-if="data.location" class="mt-1 font-medium text-emerald-700 flex items-center gap-1">
                                    <span>📍</span>
                                    <span>{{ data.location }}</span>
                                </p>

                                <p v-else class="mt-1 text-sm text-gray-400">
                                    Non spécifiée (Optionnel)
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

                            <div v-if="data.location" class="h-px bg-gray-200 my-3" />

                            <div v-if="data.location" class="flex items-center justify-between">
                                <span class="text-sm text-gray-500">
                                    Station / GPS
                                </span>

                                <span class="text-sm font-medium text-emerald-800 text-right max-w-44 truncate">
                                    📍 {{ data.location }}
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
    import { computed, onMounted, ref, watch } from 'vue';
    import { useTemplateService } from '../../../core/services/template.service.ts';
    import { useChecklistService } from '../../../core/services/checklist.service.ts';
    import type { CheckllistFormType } from '../../../@types/Checklist.type.ts';
    import { toast } from 'vue3-toastify';

    const templates = ref<ChecklistTemplateType[]>()
    const dynamicTypes = ref<{ label: string; value: string; site?: string }[]>([...ChecklistTypeData])
    const dynamicSites = ref<{ label: string; value: string }[]>([...SiteTypeDataJson])
    const stationList = ref<string[]>([])

    const now = new Date()
    const todayStr = now.toISOString().split('T')[0]
    const timeStr = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })

    const data = ref<CheckllistFormType>({
        type: undefined,
        site: undefined,
        location: '',
        date: todayStr,
        time: timeStr
    })

    const templateService = useTemplateService()
    const checklistService = useChecklistService()
    const loading_submit = ref<boolean>(false)

    const disabled_submit = computed(() => {
        return !data.value.type || !data.value.site || !data.value.date || !data.value.time
    })

    function getSelectedTypeLabel(): string {
        const found = dynamicTypes.value.find(t => t.value === data.value.type)
        return found?.label || data.value.type || '—'
    }

    function fetchDataTemplate() {
        templateService.index()
            .then(res => {
                templates.value = res.data.data
                if (templates.value && templates.value.length > 0) {
                    const loadedTypes = templates.value.map(tpl => ({
                        label: tpl.title,
                        value: tpl.type || tpl.title,
                        site: tpl.site
                    }))
                    dynamicTypes.value = loadedTypes
                }
            })
            .catch(err => {
                console.error(err)
            })

        checklistService.getFilters()
            .then(res => {
                if (res.data?.type && res.data.type.length > 0) {
                    const filterTypes = res.data.type.map((t: string) => ({
                        label: t,
                        value: t
                    }))
                    for (const ft of filterTypes) {
                        if (!dynamicTypes.value.some(dt => dt.value === ft.value)) {
                            dynamicTypes.value.push(ft)
                        }
                    }
                }

                if (res.data?.station && res.data.station.length > 0) {
                    stationList.value = res.data.station
                }

                if (res.data?.site && res.data.site.length > 0) {
                    const serverSites = res.data.site.map((s: string) => ({
                        label: s,
                        value: s
                    }))
                    for (const ss of serverSites) {
                        if (!dynamicSites.value.some(ds => ds.value === ss.value)) {
                            dynamicSites.value.push(ss)
                        }
                    }
                }
            })
            .catch(err => console.error(err))
    }

    function onSubmit() {
        if (disabled_submit.value) return
        loading_submit.value = true
        checklistService.store(data.value)
            .then(res => {
                toast.success("Inspection créée avec succès !")
                const createdId = res.data?.data?.id
                if (createdId) {
                    router.push({
                        name: 'CHECKLIST_DETAILS',
                        params: { id: createdId }
                    })
                } else {
                    router.push({
                        name: 'CHECKLIST'
                    })
                }
            })
            .catch(err => {
                console.error(err)
                const errorMsg =
                    err.response?.data?.message ||
                    err.response?.data?.errors?.type?.[0] ||
                    err.response?.data?.errors?.site?.[0] ||
                    err.response?.data?.errors?.location?.[0] ||
                    "Erreur lors de la création de l'inspection."
                toast.error(errorMsg)
            })
            .finally(() => {
                loading_submit.value = false
            })
    }

    onMounted(() => {
        fetchDataTemplate()
    })

    watch(() => data.value.type, () => {
        const found = dynamicTypes.value.find(item => data.value.type == item.value)
        if (found?.site) {
            data.value.site = found.site as any
        }
    })
</script>