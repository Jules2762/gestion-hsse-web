<template>
    <div>
        <Header title="Nouvelle VMC" :thumbnails="[
            {
                'label': 'Tableau de bord',
                'name': 'DASHBOARD'
            },
            {
                'label': 'Inspection',
                'name': 'INSPECTION'
            }, {
                'label': 'VMC',
                'name': 'VMC'
            }, {
                'label': 'Nouveau',
                'name': 'VMC_NEW'
            }
        ]" />

        <div class="p-4 grid grid-cols-12 gap-4">
            <form @submit.prevent="onSubmit()"
                class="col-span-8 grid grid-cols-2 p-6 bg-white rounded border border-gray-200 gap-4">
                <div class="col-span-2 flex flex-col gap-y-1">
                    <h4 class="font-semibold text-gray-800 text-lg">Informations de la VMC</h4>
                    <p class="text-sm text-gray-500">Sélectionnez le type de visite puis renseignez la date, le site et l'inspecteur.</p>
                </div>

                <div v-if="errorMessage" class="col-span-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                    {{ errorMessage }}
                </div>

                <Select required :options="VMCTypeData" v-model="data.type" label="Type de VMC" class="col-span-2" />
                
                <Input label="Titre de la VMC (Optionnel)" v-model="data.title" placeholder="Ex: VMC Station-Service Ankorondrano" class="col-span-2" />

                <Input label="Date" type="date" v-model="data.date" required />

                <!-- Site avec liste de suggestions -->
                <Input
                    label="Site"
                    v-model="data.site"
                    placeholder="Ex: Station Ankorondrano, Dépôt, ..."
                    :lists="siteList"
                    list_id="sites_datalist"
                />

                <!-- Inspecteur : Input avec choix liste affichant Nom complet - Direction - Fonction -->
                <Input
                    label="Inspecteur / Responsable"
                    v-model="data.inspector"
                    placeholder="Saisissez ou choisissez un inspecteur..."
                    :lists="personnelList"
                    list_id="inspectors_datalist"
                />

                <Input label="Personne accompagnante" v-model="data.accompanying_person" placeholder="Nom de l'accompagnant..." />

                <div class="flex flex-row items-center col-span-2 justify-end gap-x-3 mt-2">
                    <Button variant="outline" @click="router.back()" type="button"
                        :disabled="loading_submit">Annuler</Button>
                    <Button :left-icon="Save" :loading="loading_submit" :disabled="disabled_submit || loading_submit"
                        type="submit">Créer la VMC</Button>
                </div>
            </form>

            <!-- PREVIEW -->
            <div class="col-span-4">
                <div class="bg-white rounded border border-gray-200 sticky top-4 overflow-hidden shadow-sm">

                    <!-- HEADER -->
                    <div class="p-5 border-b border-gray-200">
                        <div class="flex items-start justify-between gap-3">

                            <div class="min-w-0">
                                <p class="text-xs uppercase tracking-widest text-gray-400">
                                    Aperçu
                                </p>

                                <h4 class="mt-1 font-semibold text-gray-800 truncate">
                                    {{ data.title || 'Nouvelle VMC' }}
                                </h4>

                                <p class="mt-1 text-sm text-gray-500">
                                    Vérifiez les informations avant de créer la VMC.
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

                        <p class="text-xs uppercase tracking-wider text-gray-400 mb-3 font-semibold">
                            Type de VMC
                        </p>

                        <div v-if="data.type" class="flex items-center gap-3">
                            <div class="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                                <ClipboardCheck :size="17" class="text-primary" />
                            </div>

                            <div class="min-w-0">
                                <p class="font-medium truncate text-gray-800">
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

                        <p class="text-xs uppercase tracking-wider text-gray-400 mb-4 font-semibold">
                            Détails de visite
                        </p>

                        <div class="grid grid-cols-2 gap-4">

                            <!-- SITE -->
                            <div class="col-span-2">
                                <p class="text-xs text-gray-500">
                                    Site
                                </p>

                                <p v-if="data.site" class="mt-1 font-medium text-gray-800">
                                    {{ data.site }}
                                </p>

                                <p v-else class="mt-1 text-sm text-gray-400">
                                    Non renseigné
                                </p>
                            </div>

                            <!-- DATE -->
                            <div>
                                <p class="text-xs text-gray-500">
                                    Date
                                </p>

                                <p v-if="data.date" class="mt-1 font-medium text-gray-800">
                                    {{ formattedDate }}
                                </p>

                                <p v-else class="mt-1 text-sm text-gray-400">
                                    Non renseignée
                                </p>
                            </div>

                            <!-- INSPECTEUR -->
                            <div>
                                <p class="text-xs text-gray-500">
                                    Inspecteur
                                </p>

                                <p v-if="cleanInspectorName" class="mt-1 font-medium truncate text-gray-800">
                                    {{ cleanInspectorName }}
                                </p>

                                <p v-if="matchingPersonnel" class="text-xs text-gray-400 truncate">
                                    {{ [matchingPersonnel.direction, matchingPersonnel.fonction].filter(Boolean).join(' • ') }}
                                </p>

                                <p v-else-if="!cleanInspectorName" class="mt-1 text-sm text-gray-400">
                                    Non renseigné
                                </p>
                            </div>

                            <!-- ACCOMPAGNANT -->
                            <div class="col-span-2">
                                <p class="text-xs text-gray-500">
                                    Personne accompagnante
                                </p>

                                <p v-if="data.accompanying_person" class="mt-1 font-medium text-gray-800">
                                    {{ data.accompanying_person }}
                                </p>

                                <p v-else class="mt-1 text-sm text-gray-400">
                                    Non renseignée
                                </p>
                            </div>

                        </div>
                    </div>

                    <!-- RÉSUMÉ -->
                    <div class="p-5">

                        <p class="text-xs uppercase tracking-wider text-gray-400 mb-4 font-semibold">
                            Résumé
                        </p>

                        <div class="rounded-xl bg-slate-50 border border-slate-100 p-4">

                            <template v-for="(row, index) in summaryRows" :key="row.label">

                                <div v-if="index > 0" class="h-px bg-gray-200 my-3" />

                                <div class="flex items-center justify-between gap-4">
                                    <span class="text-sm text-gray-500">
                                        {{ row.label }}
                                    </span>

                                    <span class="text-sm font-medium text-right max-w-44 truncate"
                                        :class="row.value ? 'text-gray-800' : 'text-gray-400'">
                                        {{ row.value || '—' }}
                                    </span>
                                </div>

                            </template>

                        </div>

                        <!-- STATUS -->
                        <div class="mt-4 flex items-center gap-2 text-xs"
                            :class="disabled_submit ? 'text-gray-400' : 'text-green-600'">
                            <span class="w-2 h-2 rounded-full"
                                :class="disabled_submit ? 'bg-gray-300' : 'bg-green-500'" />

                            <span>
                                {{
                                    disabled_submit
                                        ? 'Informations incomplètes (type et date requis)'
                                        : 'VMC prête à être créée'
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
    import Header from '../../../components/shared/Header.vue';
    import Button from '../../../components/ui/Button.vue';
    import Input from '../../../components/ui/Input.vue';
    import Select from '../../../components/ui/Select.vue';
    import { router } from '../../../router/index.ts';
    import { computed, onMounted, ref } from 'vue';
    import type { VMCFormType } from '../../../@types/VMC.type.ts';
    import vmcService from '../../../core/services/vmc.service.ts';
    import personnelService from '../../../core/services/personnel.service.ts';

    const VMCTypeData: { label: string, value: string }[] = [
        { label: 'Station-Service', value: 'Station-Service' },
        { label: 'Inspection camion', value: 'Inspection camion' },
        { label: 'Visite Magasins & Agences', value: 'Visite Magasins & Agences' },
        { label: 'Safety Report', value: 'SAFETY REPORT' },
        { label: 'Safety Moment', value: 'SAFETY MOMENT' },
        { label: 'Safety Awareness', value: 'SAFETY AWARENESS' },
    ]

    const data = ref<VMCFormType>({
        type: 'Station-Service',
        title: '',
        date: new Date().toISOString().slice(0, 10),
        site: '',
        inspector: '',
        accompanying_person: '',
    })

    const loading_submit = ref<boolean>(false)
    const errorMessage = ref<string>('')

    /* Personnels list : Nom complet - Direction - Fonction */
    const personnels = ref<any[]>([])
    const personnelList = computed(() => {
        return personnels.value.map(p => {
            const fullName = `${p.first_name} ${p.last_name || ''}`.trim()
            const details = [p.direction, p.fonction].filter(Boolean).join(' - ')
            return details ? `${fullName} - ${details}` : fullName
        }).filter(Boolean)
    })

    /* Sites list pour choix liste */
    const siteList = ref<string[]>([])

    function fetchPersonnels() {
        personnelService.indexAll()
            .then(res => {
                personnels.value = res.data.data || res.data || []
            })
            .catch(err => {
                console.error(err)
            })
    }

    function fetchSites() {
        vmcService.getFilters()
            .then(res => {
                siteList.value = res.data.site || []
            })
            .catch(err => {
                console.error(err)
            })
    }

    const matchingPersonnel = computed(() => {
        const val = data.value.inspector?.trim().toLowerCase()
        if (!val) return null

        return personnels.value.find(p => {
            const fullName = `${p.first_name} ${p.last_name || ''}`.trim().toLowerCase()
            const details = [p.direction, p.fonction].filter(Boolean).join(' - ').toLowerCase()
            const fullDisplay = details ? `${fullName} - ${details}` : fullName

            return (
                val === fullDisplay ||
                val === fullName ||
                val.startsWith(fullName) ||
                (p.first_name && val.includes(p.first_name.toLowerCase()))
            )
        })
    })

    const cleanInspectorName = computed(() => {
        if (matchingPersonnel.value) {
            return `${matchingPersonnel.value.first_name} ${matchingPersonnel.value.last_name || ''}`.trim()
        }
        if (data.value.inspector?.includes(' - ')) {
            return data.value.inspector.split(' - ')[0].trim()
        }
        return data.value.inspector?.trim() || ''
    })

    // Type et date obligatoires
    const disabled_submit = computed(() => !data.value.type || !data.value.date)

    const formattedDate = computed(() => {
        if (!data.value.date) return ''
        const date = new Date(data.value.date)
        if (Number.isNaN(date.getTime())) return data.value.date
        return new Intl.DateTimeFormat('fr-FR', { dateStyle: 'long', timeZone: 'UTC' }).format(date)
    })

    const summaryRows = computed(() => [
        { label: 'Type', value: data.value.type },
        { label: 'Site', value: data.value.site },
        { label: 'Date', value: formattedDate.value },
        { label: 'Inspecteur', value: cleanInspectorName.value || data.value.inspector },
        { label: 'Accompagnant', value: data.value.accompanying_person },
    ])

    function onSubmit() {
        if (loading_submit.value || disabled_submit.value) return

        loading_submit.value = true
        errorMessage.value = ''

        const payload: VMCFormType = {
            type: data.value.type,
            date: data.value.date,
            title: data.value.title?.trim() || undefined,
            site: data.value.site?.trim() || undefined,
            inspector: cleanInspectorName.value || data.value.inspector?.trim() || undefined,
            assigned_to: matchingPersonnel.value?.id || undefined,
            accompanying_person: data.value.accompanying_person?.trim() || undefined,
        }

        vmcService.store(payload)
            .then(() => {
                router.push({
                    name: 'VMC'
                })
            })
            .catch(err => {
                console.error(err)
                errorMessage.value = err?.response?.data?.message || 'Erreur lors de la création de la VMC'
            })
            .finally(() => {
                loading_submit.value = false
            })
    }

    onMounted(() => {
        fetchPersonnels()
        fetchSites()
    })
</script>