<template>
    <div class="flex flex-col gap-y-5">
        <h3>Générale</h3>

        <div class="p-5">

            <div class="mb-5">
                <h5>
                    Identité de l'organisation
                </h5>
                <p class="mt-1 text-sm text-text-secondary">
                    Ces informations apparaissent sur les documents générés par la plateforme.
                </p>
            </div>

            <div class="flex items-center gap-4">

                <div class="relative h-16 w-16 shrink-0">

                    <div
                        class="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-primary-light text-primary ring-4 ring-primary/5">
                        <img v-if="logoPreview" :src="logoPreview" alt="Logo de l'organisation"
                            class="h-full w-full object-cover" />
                        <Building2 v-else class="h-7 w-7" />
                    </div>

                    <label
                        class="absolute -bottom-1 -right-1 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-primary text-white shadow-sm transition-colors hover:bg-primary-dark">
                        <Camera class="h-3.5 w-3.5" />
                        <input type="file" accept="image/*" class="hidden" @change="handleLogoChange" />
                    </label>

                </div>

                <div>
                    <p class="text-sm font-medium text-text-primary">
                        Logo de l'organisation
                    </p>
                    <p class="mt-0.5 text-xs text-text-muted">
                        JPG ou PNG, optionnel.
                    </p>
                    <button v-if="logoPreview" type="button" @click="removeLogo"
                        class="mt-1 text-xs font-medium text-danger hover:underline">
                        Retirer le logo
                    </button>
                </div>

            </div>

            <div class="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Input v-model="form.organization_name" label="Nom de l'organisation" :icon="Building2" />
                <Input v-model="form.support_email" type="email" label="E-mail de support" :icon="MailIcon" />
            </div>

        </div>

        <div class="p-5">

            <div class="mb-5">
                <h5>
                    Régionalisation
                </h5>
                <p class="mt-1 text-sm text-text-secondary">
                    Ces réglages contrôlent l'affichage des dates et de l'interface. Le format des fichiers
                    exportés (ex : modèles Excel) n'est pas affecté.
                </p>
            </div>

            <div class="grid grid-cols-1 gap-3 sm:grid-cols-3">

                <Select v-model="form.language" label="Langue de l'interface" :icon="Languages"
                    :options="languageOptions" />

                <Select v-model="form.timezone" label="Fuseau horaire" :icon="Clock" :options="timezoneOptions" />

                <Select v-model="form.date_format" label="Format de date" :icon="CalendarDays"
                    :options="dateFormatOptions" />

            </div>

            <p class="mt-3 text-xs text-text-muted">
                Aperçu : {{ formattedPreviewDate }}
            </p>

        </div>


        <!-- ========================================================= -->
        <!-- ACTIONS -->
        <!-- ========================================================= -->

        <div class="flex items-center justify-end gap-3 border-t border-border px-5 py-4">

            <button type="button" :disabled="!hasChanges" @click="resetForm"
                class="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-surface px-5 py-2.5 text-sm font-semibold shadow-sm transition-all duration-200"
                :class="hasChanges
                    ? 'text-text-secondary hover:-translate-y-0.5 hover:bg-surface-alt hover:shadow-md'
                    : 'cursor-not-allowed text-text-muted'">
                <RotateCcw class="h-4 w-4" />
                Annuler
            </button>

            <button type="button" :disabled="!hasChanges" @click="save"
                class="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold shadow-sm transition-all duration-200"
                :class="hasChanges
                    ? 'bg-linear-to-r from-success to-primary-dark text-white hover:-translate-y-0.5 hover:shadow-md'
                    : 'cursor-not-allowed bg-surface-alt text-text-muted'">
                <Save class="h-4 w-4" />
                Enregistrer
            </button>

        </div>


        <!-- ========================================================= -->
        <!-- MESSAGE -->
        <!-- ========================================================= -->

        <div v-if="successMessage"
            class="fixed right-6 top-6 z-50 flex max-w-sm items-start gap-3 rounded-2xl border border-status-success/20 bg-surface p-4 shadow-2xl ring-1 ring-status-success/5">

            <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-light">
                <CheckCircle2 class="h-5 w-5 text-success" />
            </div>

            <div>
                <p class="font-semibold text-text-primary">
                    Paramètres enregistrés
                </p>
                <p class="mt-1 text-sm text-text-secondary">
                    {{ successMessage }}
                </p>
            </div>

            <button type="button" @click="successMessage = ''" class="ml-2 text-text-muted hover:text-text-secondary">
                <X class="h-4 w-4" />
            </button>

        </div>

    </div>
</template>

<script setup lang="ts">

import {
    Building2,
    CalendarDays,
    Camera,
    CheckCircle2,
    Clock,
    Languages,
    MailIcon,
    RotateCcw,
    Save,
    X
} from '@lucide/vue'

import { computed, reactive, ref } from 'vue'

import Input from '../../../../components/ui/Input.vue'
import Select from '../../../../components/ui/Select.vue'


/*
|--------------------------------------------------------------------------
| OPTIONS
|--------------------------------------------------------------------------
*/

const languageOptions = [
    { label: "Français", value: "fr" },
    { label: "English", value: "en" }
]

const timezoneOptions = [
    { label: "Antananarivo (GMT+3)", value: "Indian/Antananarivo" },
    { label: "UTC (GMT+0)", value: "UTC" },
    { label: "Paris (GMT+1)", value: "Europe/Paris" }
]

const dateFormatOptions = [
    { label: "JJ/MM/AAAA", value: "DD/MM/YYYY" },
    { label: "AAAA-MM-JJ", value: "YYYY-MM-DD" },
    { label: "MM/JJ/AAAA", value: "MM/DD/YYYY" }
]


/*
|--------------------------------------------------------------------------
| FORMULAIRE
|--------------------------------------------------------------------------
|
| Placeholder en attendant l'API des paramètres de l'organisation.
|
*/

const defaults = {
    organization_name: "Galana HSSE",
    support_email: "support.hsse@galana.mg",
    language: "fr",
    timezone: "Indian/Antananarivo",
    date_format: "DD/MM/YYYY"
}

const form = reactive({ ...defaults })

const logoFile = ref<File | null>(null)
const logoPreview = ref("")

function handleLogoChange(event: Event) {

    const target = event.target as HTMLInputElement
    const file = target.files?.[0]

    if (!file) return

    logoFile.value = file

    const reader = new FileReader()

    reader.onload = () => {
        logoPreview.value = String(reader.result ?? "")
    }

    reader.readAsDataURL(file)

}

function removeLogo() {
    logoFile.value = null
    logoPreview.value = ""
}


/*
|--------------------------------------------------------------------------
| APERCU DE FORMAT DE DATE
|--------------------------------------------------------------------------
*/

const formattedPreviewDate = computed(() => {

    const today = new Date()

    const day = String(today.getDate()).padStart(2, "0")
    const month = String(today.getMonth() + 1).padStart(2, "0")
    const year = today.getFullYear()

    switch (form.date_format) {

        case "YYYY-MM-DD":
            return `${year}-${month}-${day}`

        case "MM/DD/YYYY":
            return `${month}/${day}/${year}`

        default:
            return `${day}/${month}/${year}`

    }

})


/*
|--------------------------------------------------------------------------
| CHANGEMENTS
|--------------------------------------------------------------------------
*/

const hasChanges = computed(() => {

    return (
        JSON.stringify(form) !== JSON.stringify(defaults) ||
        logoFile.value !== null
    )

})

function resetForm() {

    Object.assign(form, defaults)

    removeLogo()

}


/*
|--------------------------------------------------------------------------
| ENREGISTRER
|--------------------------------------------------------------------------
*/

const successMessage = ref("")

function save() {

    console.log("Paramètres généraux :", {
        ...form,
        logo: logoFile.value?.name ?? null
    })

    Object.assign(defaults, { ...form })

    successMessage.value = "Les informations de l'organisation ont été mises à jour."

}

</script>
