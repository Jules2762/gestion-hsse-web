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
                <div class="col-span-2 flex flex-col gap-y-3">
                    <h4>Informations de la VMC</h4>
                    <p>Sélectionnez le type de visite puis renseignez la date, le site et les personnes concernées.</p>
                </div>
                <Select required :options="VMCTypeData" v-model="data.type" label="Type de VMC" class="col-span-2" />
                <Input label="Date" type="date" v-model="data.date" required />
                <Input label="Site" v-model="data.site" />
                <Input label="Inspecteur" v-model="data.inspector" />
                <Input label="Personne accompagnante" v-model="data.accompanying_person" />
                <div class="flex flex-row items-center col-span-2 justify-end gap-x-3">
                    <Button variant="outline" @click="router.back()" type="button"
                        :disabled="loading_submit">Annuler</Button>
                    <Button :left-icon="Save" :loading="loading_submit" :disabled="disabled_submit || loading_submit"
                        type="submit">Créer la VMC</Button>
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
                                    Nouvelle VMC
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

                        <p class="text-xs uppercase tracking-wider text-gray-400 mb-3">
                            Type de VMC
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
                                    Date
                                </p>

                                <p v-if="data.date" class="mt-1 font-medium">
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

                                <p v-if="data.inspector" class="mt-1 font-medium truncate">
                                    {{ data.inspector }}
                                </p>

                                <p v-else class="mt-1 text-sm text-gray-400">
                                    Non renseigné
                                </p>
                            </div>

                            <!-- ACCOMPAGNANT -->
                            <div class="col-span-2">
                                <p class="text-xs text-gray-500">
                                    Personne accompagnante
                                </p>

                                <p v-if="data.accompanying_person" class="mt-1 font-medium">
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

                        <p class="text-xs uppercase tracking-wider text-gray-400 mb-4">
                            Résumé
                        </p>

                        <div class="rounded-xl bg-slate-50 border border-slate-100 p-4">

                            <template v-for="(row, index) in summaryRows" :key="row.label">

                                <div v-if="index > 0" class="h-px bg-gray-200 my-3" />

                                <div class="flex items-center justify-between gap-4">
                                    <span class="text-sm text-gray-500">
                                        {{ row.label }}
                                    </span>

                                    <span class="text-sm font-medium text-right max-w-40 truncate"
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
    import { computed, ref } from 'vue';
    import type { VMCFormType, VMCType } from '../../../@types/VMC.type.ts';
    import vmcService from '../../../core/services/vmc.service.ts';

    // TODO : déplacer dans @data/VMC.data.ts et adapter au format attendu par <Select>
    const VMCTypeData: { label: string, value: VMCType }[] = [
        { label: 'Station-Service', value: 'Station-Service' },
        { label: 'Inspection camion', value: 'Inspection camion' },
        { label: 'Visite Magasins & Agences', value: 'Visite Magasins & Agences' },
    ]

    const data = ref<VMCFormType>({
        type: '',
        date: '',
        site: '',
        inspector: '',
        accompanying_person: ''
    })
    const loading_submit = ref<boolean>(false)

    // Seuls le type et la date sont obligatoires
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
        { label: 'Inspecteur', value: data.value.inspector },
        { label: 'Accompagnant', value: data.value.accompanying_person },
    ])

    function onSubmit() {
        if (loading_submit.value || disabled_submit.value) return

        loading_submit.value = true

        // Les champs optionnels vides ne sont pas envoyés
        const payload: VMCFormType = {
            type: data.value.type,
            date: data.value.date,
            site: data.value.site?.trim() || undefined,
            inspector: data.value.inspector?.trim() || undefined,
            accompanying_person: data.value.accompanying_person?.trim() || undefined,
        }

        // NOTE : hypothèse sur le nom de la méthode du service (store, comme pour checklist).
        vmcService.store(payload)
            .then(() => {
                router.push({
                    name: 'VMC'
                })
            })
            .catch(err => {
                console.error(err)
            })
            .finally(() => {
                loading_submit.value = false
            })
    }
</script>