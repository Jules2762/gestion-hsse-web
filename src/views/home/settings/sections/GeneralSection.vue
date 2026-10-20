<template>
    <div class="flex flex-col gap-y-6">
        <!-- HEADER -->
        <div class="border-b border-border p-5">
            <div class="flex items-center justify-between">
                <div>
                    <h3 class="text-base font-bold text-text-primary">Identité & Paramètres Généraux</h3>
                    <p class="mt-1 text-xs text-text-secondary">
                        Coordonnées institutionnelles de l'entité Galana, fuseau horaire et conventions d'affichage.
                    </p>
                </div>
                <span class="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-[#0F9D58] ring-1 ring-[#0F9D58]/20">
                    <Building2 class="h-3.5 w-3.5" />
                    Entité Opérationnelle
                </span>
            </div>
        </div>

        <!-- 1. IDENTITÉ DE L'ORGANISATION -->
        <div class="border-b border-border p-5">
            <div class="mb-4">
                <div class="flex items-center gap-2">
                    <Building2 class="h-4 w-4 text-[#0F9D58]" />
                    <h5 class="text-xs font-bold text-text-primary">Identité de l'Organisation</h5>
                </div>
                <p class="mt-0.5 text-xs text-text-secondary">
                    Ces informations et le logo figurent sur les fiches VMC, les rapports d'inspection et les exports PDF.
                </p>
            </div>

            <!-- ZONE LOGO -->
            <div class="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-xl border border-border bg-surface-alt/30 mb-5">
                <div class="relative h-20 w-20 shrink-0">
                    <div
                        class="flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl bg-white border border-border shadow-2xs ring-4 ring-[#0F9D58]/10">
                        <img v-if="logoPreview" :src="logoPreview" alt="Logo de l'organisation"
                            class="h-full w-full object-contain p-1" />
                        <div v-else class="flex flex-col items-center justify-center text-[#0F9D58]">
                            <Building2 class="h-8 w-8" />
                            <span class="text-[9px] font-bold mt-0.5">GALANA</span>
                        </div>
                    </div>

                    <label
                        class="absolute -bottom-1 -right-1 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-[#0F9D58] text-white shadow-sm transition hover:bg-[#0c8248]"
                        title="Changer le logo"
                    >
                        <Camera class="h-3.5 w-3.5" />
                        <input type="file" accept="image/*" class="hidden" @change="handleLogoChange" />
                    </label>
                </div>

                <div class="flex-1">
                    <div class="flex items-center gap-2">
                        <p class="text-xs font-semibold text-text-primary">
                            Logo officiel de la société
                        </p>
                        <span class="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] text-text-muted">
                            PNG, JPG ou SVG (Max 5 Mo)
                        </span>
                    </div>
                    <p class="mt-1 text-[11px] text-text-secondary">
                        Recommandé : image transparente avec un ratio 1:1 ou rectangulaire pour un affichage optimal sur les en-têtes.
                    </p>
                    <div class="mt-2 flex items-center gap-3">
                        <button v-if="logoPreview" type="button" @click="removeLogo"
                            class="text-xs font-medium text-danger hover:underline">
                            Retirer le logo personnalisé
                        </button>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input v-model="form.organization_name" label="Nom de l'organisation" :icon="Building2" placeholder="Galana Madagascar S.A." />
                <Input v-model="form.headquarters_site" label="Site d'exploitation / Siège" :icon="MapPin" placeholder="Terminal Pétrolier Toamasina" />
                <Input v-model="form.support_email" type="email" label="E-mail de support technique" :icon="MailIcon" placeholder="support.hsse@galana.mg" />
                <Input v-model="form.organization_phone" label="Téléphone standard" :icon="Phone" placeholder="+261 20 22 224 00" />
            </div>
        </div>

        <!-- 2. RÉGIONALISATION & AFFICHAGE -->
        <div class="p-5">
            <div class="mb-4">
                <div class="flex items-center gap-2">
                    <Globe class="h-4 w-4 text-[#0F9D58]" />
                    <h5 class="text-xs font-bold text-text-primary">Régionalisation, Langue & Date</h5>
                </div>
                <p class="mt-0.5 text-xs text-text-secondary">
                    Détermine la langue par défaut de l'interface, le fuseau horaire de journalisation et le formatage temporel.
                </p>
            </div>

            <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <Select v-model="form.language" label="Langue de l'interface" :icon="Languages"
                    :options="languageOptions" />

                <Select v-model="form.timezone" label="Fuseau horaire de référence" :icon="Clock" :options="timezoneOptions" />

                <Select v-model="form.date_format" label="Format de date standard" :icon="CalendarDays"
                    :options="dateFormatOptions" />
            </div>

            <!-- APERÇU DATE & HEURE LOCALE -->
            <div class="mt-4 flex items-center justify-between rounded-xl border border-dashed border-border bg-surface-alt/40 p-3">
                <div class="flex items-center gap-2 text-xs text-text-secondary">
                    <CalendarDays class="h-4 w-4 text-[#0F9D58]" />
                    <span>Exemple de date formatée :</span>
                    <strong class="text-text-primary">{{ formattedPreviewDate }}</strong>
                </div>
                <div class="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                    <span class="h-1.5 w-1.5 rounded-full bg-[#0F9D58] animate-pulse"></span>
                    <span>Heure serveur : GMT+3 (Toamasina / Tana)</span>
                </div>
            </div>
        </div>

        <!-- ========================================================= -->
        <!-- ACTIONS -->
        <!-- ========================================================= -->
        <div class="flex items-center justify-end gap-3 border-t border-border px-5 py-4">
            <button type="button" :disabled="!hasChanges || isSaving" @click="resetForm"
                class="inline-flex items-center justify-center gap-1.5 rounded-lg border border-border bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-2xs transition hover:bg-slate-50 disabled:opacity-50">
                <RotateCcw class="h-3.5 w-3.5" />
                Annuler
            </button>

            <button type="button" :disabled="!hasChanges || isSaving" @click="save"
                class="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#0F9D58] px-4 py-2 text-xs font-semibold text-white shadow-2xs transition hover:bg-[#0c8248] disabled:opacity-50">
                <Loader2 v-if="isSaving" class="h-3.5 w-3.5 animate-spin" />
                <Save v-else class="h-3.5 w-3.5" />
                Enregistrer les paramètres généraux
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import {
    Building2,
    CalendarDays,
    Camera,
    Clock,
    Globe,
    Languages,
    Loader2,
    MailIcon,
    MapPin,
    Phone,
    RotateCcw,
    Save
} from '@lucide/vue'
import { computed, onMounted, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import Input from '../../../../components/ui/Input.vue'
import Select from '../../../../components/ui/Select.vue'
import settingService from '../../../../core/services/setting.service'
import { toast } from 'vue3-toastify'

/*
|--------------------------------------------------------------------------
| OPTIONS
|--------------------------------------------------------------------------
*/

const languageOptions = [
    { label: "Français (Madagascar / Officiel)", value: "fr" },
    { label: "English (International)", value: "en" }
]

const timezoneOptions = [
    { label: "Antananarivo (UTC+3)", value: "Indian/Antananarivo" },
    { label: "UTC (Temps Universel)", value: "UTC" },
    { label: "Paris (UTC+1 / +2)", value: "Europe/Paris" }
]

const dateFormatOptions = [
    { label: "JJ/MM/AAAA (ex: 12/10/2026)", value: "DD/MM/YYYY" },
    { label: "AAAA-MM-JJ (ex: 2026-10-12)", value: "YYYY-MM-DD" },
    { label: "MM/JJ/AAAA (ex: 10/12/2026)", value: "MM/DD/YYYY" }
]

/*
|--------------------------------------------------------------------------
| FORMULAIRE & VALEURS PAR DÉFAUT
|--------------------------------------------------------------------------
*/

const defaults = {
    organization_name: "Galana Madagascar S.A.",
    headquarters_site: "Terminal Pétrolier & Raffinerie Toamasina",
    support_email: "support.hsse@galana.mg",
    organization_phone: "+261 20 22 224 00",
    language: "fr",
    timezone: "Indian/Antananarivo",
    date_format: "DD/MM/YYYY"
}

const form = reactive({ ...defaults })
const initialSnapshot = ref(JSON.stringify(defaults))

const logoFile = ref<File | null>(null)
const logoPreview = ref("")
const isLoading = ref(false)
const isSaving = ref(false)

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

const hasChanges = computed(() => {
    return (
        JSON.stringify(form) !== initialSnapshot.value ||
        logoFile.value !== null
    )
})

function loadSettings() {
    isLoading.value = true
    settingService.getByGroup('general')
        .then((res: any) => {
            const data = res.data?.data ?? {}
            if (data['general.organization_name']?.value !== undefined) {
                form.organization_name = data['general.organization_name'].value
            }
            if (data['general.headquarters_site']?.value !== undefined) {
                form.headquarters_site = data['general.headquarters_site'].value
            }
            if (data['general.support_email']?.value !== undefined) {
                form.support_email = data['general.support_email'].value
            }
            if (data['general.language']?.value !== undefined) {
                form.language = data['general.language'].value
            }
            if (data['general.timezone']?.value !== undefined) {
                form.timezone = data['general.timezone'].value
            }
            if (data['general.date_format']?.value !== undefined) {
                form.date_format = data['general.date_format'].value
            }
            if (data['general.logo_path']?.value) {
                logoPreview.value = data['general.logo_path'].value
            }
            initialSnapshot.value = JSON.stringify(form)
        })
        .finally(() => {
            isLoading.value = false
        })
}

function resetForm() {
    const parsed = JSON.parse(initialSnapshot.value)
    Object.assign(form, parsed)
    removeLogo()
}

const { locale } = useI18n()

function save() {
    isSaving.value = true
    settingService.update({
        'general.organization_name': form.organization_name,
        'general.headquarters_site': form.headquarters_site,
        'general.support_email': form.support_email,
        'general.language': form.language,
        'general.timezone': form.timezone,
        'general.date_format': form.date_format,
        'general.logo_path': logoPreview.value || null,
    })
    .then(() => {
        initialSnapshot.value = JSON.stringify(form)
        logoFile.value = null
        if (form.language) {
            locale.value = form.language
            localStorage.setItem('language', form.language)
        }
        toast.success("Paramètres généraux enregistrés avec succès !")
    })
    .catch(() => {
        toast.error("Erreur lors de l'enregistrement des paramètres.")
    })
    .finally(() => {
        isSaving.value = false
    })
}

onMounted(() => {
    loadSettings()
})
</script>
