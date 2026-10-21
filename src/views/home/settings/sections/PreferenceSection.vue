<template>
    <div class="flex flex-col gap-y-6">
        <!-- HEADER -->
        <div class="border-b border-border p-5">
            <h3 class="text-base font-bold text-text-primary">
                {{ locale === 'en' ? 'Display & Notification Preferences' : "Préférences d'Affichage & Notifications" }}
            </h3>
            <p class="mt-1 text-xs text-text-secondary">
                {{ locale === 'en' ? 'Customize font size, list density, and alerts for the GALANA HSSE platform.' : 'Personnalisez la taille de la police, la densité des listes et les alertes de la plateforme GALANA HSSE.' }}
            </p>
        </div>

        <!-- 1. TAILLE DE LA POLICE (FONT SIZE) -->
        <div class="border-b border-border p-5">
            <div class="mb-4 flex items-center justify-between">
                <div>
                    <div class="flex items-center gap-2">
                        <Type class="h-4 w-4 text-[#0F9D58]" />
                        <h5 class="text-xs font-bold text-text-primary">
                            {{ locale === 'en' ? 'Font size' : 'Taille de la police de caractères' }}
                        </h5>
                    </div>
                    <p class="mt-0.5 text-xs text-text-secondary">
                        {{ locale === 'en' ? 'Dynamically adjusts text size across all application pages.' : "Ajuste dynamiquement la taille du texte sur toutes les pages de l'application." }}
                    </p>
                </div>
                <span class="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700 ring-1 ring-emerald-600/20">
                    <Sparkles class="h-3 w-3" />
                    {{ locale === 'en' ? 'Live preview' : 'Aperçu instantané' }}
                </span>
            </div>

            <!-- CHOIX DES 3 TAILLES -->
            <div class="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <!-- COMPACT (13px - profil style) -->
                <div
                    @click="selectFontSize('compact')"
                    class="group relative flex cursor-pointer flex-col justify-between rounded-xl border p-4 transition-all duration-200"
                    :class="form.font_size === 'compact'
                        ? 'border-[#0F9D58] bg-[#0F9D58]/5 ring-2 ring-[#0F9D58]/20 shadow-xs'
                        : 'border-border bg-surface hover:border-[#0F9D58]/40 hover:bg-surface-alt'"
                >
                    <div>
                        <div class="flex items-center justify-between">
                            <span class="inline-flex items-center gap-1.5 font-semibold text-text-primary text-xs">
                                <span class="h-2 w-2 rounded-full" :class="form.font_size === 'compact' ? 'bg-[#0F9D58]' : 'bg-slate-300'"></span>
                                {{ locale === 'en' ? 'Compact (13px)' : 'Compacte (13px)' }}
                            </span>
                            <span class="rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold text-emerald-800">
                                {{ locale === 'en' ? 'Profile page' : 'Page profil' }}
                            </span>
                        </div>
                        <p class="mt-2 text-[11px] leading-relaxed text-text-secondary">
                            {{ locale === 'en' ? 'Identical style to the profile page. Optimizes data density and displays more rows without scrolling.' : 'Style identique à la page profil. Optimise la densité des données et affiche plus de lignes sans défilement.' }}
                        </p>
                    </div>

                    <div class="mt-3 flex items-center justify-between border-t border-border/50 pt-2 text-[11px]">
                        <span class="text-text-muted">{{ locale === 'en' ? 'Recommended' : 'Recommandé' }}</span>
                        <div
                            class="flex h-4 w-4 items-center justify-center rounded-full border transition-colors"
                            :class="form.font_size === 'compact' ? 'border-[#0F9D58] bg-[#0F9D58] text-white' : 'border-border'"
                        >
                            <Check v-if="form.font_size === 'compact'" class="h-2.5 w-2.5 stroke-[3]" />
                        </div>
                    </div>
                </div>

                <!-- STANDARD (14.5px) -->
                <div
                    @click="selectFontSize('standard')"
                    class="group relative flex cursor-pointer flex-col justify-between rounded-xl border p-4 transition-all duration-200"
                    :class="form.font_size === 'standard'
                        ? 'border-[#0F9D58] bg-[#0F9D58]/5 ring-2 ring-[#0F9D58]/20 shadow-xs'
                        : 'border-border bg-surface hover:border-[#0F9D58]/40 hover:bg-surface-alt'"
                >
                    <div>
                        <div class="flex items-center justify-between">
                            <span class="inline-flex items-center gap-1.5 font-semibold text-text-primary text-xs">
                                <span class="h-2 w-2 rounded-full" :class="form.font_size === 'standard' ? 'bg-[#0F9D58]' : 'bg-slate-300'"></span>
                                {{ locale === 'en' ? 'Standard (14.5px)' : 'Standard (14.5px)' }}
                            </span>
                            <span class="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-700">
                                {{ locale === 'en' ? 'Balanced' : 'Équilibrée' }}
                            </span>
                        </div>
                        <p class="mt-2 text-[11px] leading-relaxed text-text-secondary">
                            {{ locale === 'en' ? 'Balanced size offering a good compromise between reading comfort and screen clutter.' : "Taille équilibrée offrant un bon compromis entre confort de lecture et encombrement de l'interface." }}
                        </p>
                    </div>

                    <div class="mt-3 flex items-center justify-between border-t border-border/50 pt-2 text-[11px]">
                        <span class="text-text-muted">{{ locale === 'en' ? 'Classic' : 'Classique' }}</span>
                        <div
                            class="flex h-4 w-4 items-center justify-center rounded-full border transition-colors"
                            :class="form.font_size === 'standard' ? 'border-[#0F9D58] bg-[#0F9D58] text-white' : 'border-border'"
                        >
                            <Check v-if="form.font_size === 'standard'" class="h-2.5 w-2.5 stroke-[3]" />
                        </div>
                    </div>
                </div>

                <!-- LARGE (16px) -->
                <div
                    @click="selectFontSize('large')"
                    class="group relative flex cursor-pointer flex-col justify-between rounded-xl border p-4 transition-all duration-200"
                    :class="form.font_size === 'large'
                        ? 'border-[#0F9D58] bg-[#0F9D58]/5 ring-2 ring-[#0F9D58]/20 shadow-xs'
                        : 'border-border bg-surface hover:border-[#0F9D58]/40 hover:bg-surface-alt'"
                >
                    <div>
                        <div class="flex items-center justify-between">
                            <span class="inline-flex items-center gap-1.5 font-semibold text-text-primary text-xs">
                                <span class="h-2 w-2 rounded-full" :class="form.font_size === 'large' ? 'bg-[#0F9D58]' : 'bg-slate-300'"></span>
                                {{ locale === 'en' ? 'Large (16px)' : 'Grande (16px)' }}
                            </span>
                            <span class="rounded bg-blue-50 px-1.5 py-0.5 text-[10px] font-medium text-blue-700">
                                {{ locale === 'en' ? 'Readability' : 'Lisibilité' }}
                            </span>
                        </div>
                        <p class="mt-2 text-[11px] leading-relaxed text-text-secondary">
                            {{ locale === 'en' ? 'Larger characters for maximum visual comfort, especially suited for high-resolution monitors.' : 'Caractères plus grands pour un confort visuel maximal, particulièrement adapté aux moniteurs haute résolution.' }}
                        </p>
                    </div>

                    <div class="mt-3 flex items-center justify-between border-t border-border/50 pt-2 text-[11px]">
                        <span class="text-text-muted">{{ locale === 'en' ? 'Enlarged' : 'Agrandie' }}</span>
                        <div
                            class="flex h-4 w-4 items-center justify-center rounded-full border transition-colors"
                            :class="form.font_size === 'large' ? 'border-[#0F9D58] bg-[#0F9D58] text-white' : 'border-border'"
                        >
                            <Check v-if="form.font_size === 'large'" class="h-2.5 w-2.5 stroke-[3]" />
                        </div>
                    </div>
                </div>
            </div>

            <!-- BOÎTE DE PRÉVISUALISATION EN DIRECT -->
            <div class="mt-4 rounded-xl border border-dashed border-border bg-surface-alt/40 p-4">
                <div class="flex items-center justify-between mb-2">
                    <p class="text-[11px] font-semibold text-text-muted uppercase tracking-wider">
                        {{ locale === 'en' ? 'Live preview' : 'Aperçu en temps réel' }}
                    </p>
                    <span class="text-[11px] text-[#0F9D58] font-medium">
                        {{ locale === 'en' ? 'Active:' : 'Actif :' }} {{ currentFontSizeLabel }}
                    </span>
                </div>
                <div class="rounded-lg border border-border bg-surface p-3 shadow-2xs space-y-2">
                    <div class="flex items-center justify-between">
                        <span class="font-bold text-text-primary">{{ locale === 'en' ? 'VMC Management Visit #2026-084' : 'Visite Managériale VMC #2026-084' }}</span>
                        <span class="rounded bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-[#0F9D58]">
                            {{ t('status.CONFORME') }}
                        </span>
                    </div>
                    <p class="text-text-secondary">
                        {{ locale === 'en' ? 'Hydrocarbon storage area - Inspection of retention basins and CO2 extinguishers.' : 'Zone de stockage des hydrocarbures - Vérification des bacs de rétention et extincteurs CO2.' }}
                    </p>
                    <div class="flex items-center gap-3 text-xs text-text-muted pt-1 border-t border-border/60">
                        <span>{{ locale === 'en' ? 'Inspector: Jean Rakoto' : 'Inspecteur : Jean Rakoto' }}</span>
                        <span>•</span>
                        <span>{{ locale === 'en' ? 'Date: 10/12/2026' : 'Date : 12/10/2026' }}</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- 2. DENSITÉ & PAGINATION -->
        <div class="border-b border-border p-5">
            <div class="mb-4">
                <div class="flex items-center gap-2">
                    <Rows3 class="h-4 w-4 text-[#0F9D58]" />
                    <h5 class="text-xs font-bold text-text-primary">
                        {{ locale === 'en' ? 'Lists & Tables Display' : 'Affichage des Listes & Tableaux' }}
                    </h5>
                </div>
                <p class="mt-0.5 text-xs text-text-secondary">
                    {{ locale === 'en' ? 'Adjust row spacing and default number of items per page.' : "Ajustez l'espacement des lignes et le nombre d'éléments affichés par page par défaut." }}
                </p>
            </div>

            <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <label
                    class="flex cursor-pointer items-center justify-between rounded-xl border p-4 transition-all duration-200"
                    :class="form.density === 'compact'
                        ? 'border-[#0F9D58] bg-[#0F9D58]/5 ring-2 ring-[#0F9D58]/20'
                        : 'border-border bg-surface hover:bg-surface-alt'"
                >
                    <div>
                        <p class="text-xs font-semibold text-text-primary">
                            {{ locale === 'en' ? 'Compact density' : 'Densité compacte' }}
                        </p>
                        <p class="mt-1 text-[11px] text-text-secondary">
                            {{ locale === 'en' ? 'Ideal for viewing maximum inspections and actions without scrolling.' : "Idéal pour visualiser un maximum d'inspections et d'actions sans défiler." }}
                        </p>
                    </div>
                    <input v-model="form.density" type="radio" value="compact" class="accent-[#0F9D58]" />
                </label>

                <label
                    class="flex cursor-pointer items-center justify-between rounded-xl border p-4 transition-all duration-200"
                    :class="form.density === 'comfortable'
                        ? 'border-[#0F9D58] bg-[#0F9D58]/5 ring-2 ring-[#0F9D58]/20'
                        : 'border-border bg-surface hover:bg-surface-alt'"
                >
                    <div>
                        <p class="text-xs font-semibold text-text-primary">
                            {{ locale === 'en' ? 'Comfortable density' : 'Densité confortable' }}
                        </p>
                        <p class="mt-1 text-[11px] text-text-secondary">
                            {{ locale === 'en' ? 'Airier and more spaced lines for relaxed viewing.' : 'Lignes plus aérées et espacées pour une consultation détendue.' }}
                        </p>
                    </div>
                    <input v-model="form.density" type="radio" value="comfortable" class="accent-[#0F9D58]" />
                </label>
            </div>

            <div class="mt-4 max-w-xs">
                <Select
                    v-model="form.page_size"
                    :label="locale === 'en' ? 'Default items per page' : 'Éléments par page par défaut'"
                    :icon="Rows3"
                    :options="pageSizeOptions"
                />
            </div>
        </div>

        <!-- 3. NOTIFICATIONS -->
        <div class="p-5">
            <div class="mb-4">
                <div class="flex items-center gap-2">
                    <Bell class="h-4 w-4 text-[#0F9D58]" />
                    <h5 class="text-xs font-bold text-text-primary">
                        {{ locale === 'en' ? 'Alerts & Notifications' : 'Alertes & Notifications' }}
                    </h5>
                </div>
                <p class="mt-0.5 text-xs text-text-secondary">
                    {{ locale === 'en' ? 'Choose frequency and receiving method for system alerts.' : 'Choisissez la fréquence et le mode de réception des alertes système.' }}
                </p>
            </div>

            <div class="divide-y divide-border overflow-hidden rounded-xl border border-border">
                <div class="flex items-center justify-between gap-4 p-4">
                    <div>
                        <p class="text-xs font-semibold text-text-primary">
                            {{ locale === 'en' ? 'Email notifications' : 'Notifications par e-mail' }}
                        </p>
                        <p class="mt-0.5 text-[11px] text-text-secondary">
                            {{ locale === 'en' ? 'Receive an email message when a corrective action is assigned.' : "Recevoir un message électronique lors de l'assignation d'une action corrective." }}
                        </p>
                    </div>
                    <button
                        type="button"
                        role="switch"
                        :aria-checked="form.email_notifications"
                        @click="form.email_notifications = !form.email_notifications"
                        class="relative inline-flex h-5 w-10 shrink-0 cursor-pointer items-center rounded-full transition-colors"
                        :class="form.email_notifications ? 'bg-[#0F9D58]' : 'bg-slate-200'"
                    >
                        <span
                            class="inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform"
                            :class="form.email_notifications ? 'translate-x-5' : 'translate-x-1'"
                        ></span>
                    </button>
                </div>

                <div class="flex items-center justify-between gap-4 p-4">
                    <div>
                        <p class="text-xs font-semibold text-text-primary">
                            {{ locale === 'en' ? 'Automatic deadline reminders' : "Rappels d'échéance automatiques" }}
                        </p>
                        <p class="mt-0.5 text-[11px] text-text-secondary">
                            {{ locale === 'en' ? 'Alert assignee before the deadline of a preventive action or VMC.' : "Alerter le responsable avant la date butoir d'une action de prévention ou d'une VMC." }}
                        </p>
                    </div>
                    <button
                        type="button"
                        role="switch"
                        :aria-checked="form.deadline_reminders"
                        @click="form.deadline_reminders = !form.deadline_reminders"
                        class="relative inline-flex h-5 w-10 shrink-0 cursor-pointer items-center rounded-full transition-colors"
                        :class="form.deadline_reminders ? 'bg-[#0F9D58]' : 'bg-slate-200'"
                    >
                        <span
                            class="inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform"
                            :class="form.deadline_reminders ? 'translate-x-5' : 'translate-x-1'"
                        ></span>
                    </button>
                </div>

                <div v-if="form.deadline_reminders" class="p-4 bg-surface-alt/30">
                    <Select
                        v-model="form.reminder_delay"
                        :label="locale === 'en' ? 'Reminder delay before deadline' : 'Délai de rappel avant échéance'"
                        :icon="AlarmClock"
                        :options="reminderDelayOptions"
                    />
                </div>
            </div>
        </div>

        <!-- ========================================================= -->
        <!-- ACTIONS -->
        <!-- ========================================================= -->
        <div class="flex items-center justify-end gap-3 border-t border-border px-5 py-4">
            <button
                type="button"
                :disabled="!hasChanges || isSaving"
                @click="resetForm"
                class="inline-flex items-center justify-center gap-1.5 rounded-lg border border-border bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-2xs transition hover:bg-slate-50 disabled:opacity-50"
            >
                <RotateCcw class="h-3.5 w-3.5" />
                {{ t('common.cancel') }}
            </button>

            <button
                type="button"
                :disabled="!hasChanges || isSaving"
                @click="save"
                class="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#0F9D58] px-4 py-2 text-xs font-semibold text-white shadow-2xs transition hover:bg-[#0c8248] disabled:opacity-50"
            >
                <Loader2 v-if="isSaving" class="h-3.5 w-3.5 animate-spin" />
                <Save v-else class="h-3.5 w-3.5" />
                {{ locale === 'en' ? 'Save preferences' : 'Enregistrer les préférences' }}
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import {
    AlarmClock,
    Bell,
    Check,
    Loader2,
    RotateCcw,
    Rows3,
    Save,
    Sparkles,
    Type
} from '@lucide/vue'
import { computed, onMounted, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import Select from '../../../../components/ui/Select.vue'
import settingService from '../../../../core/services/setting.service'
import {
    applyFontSize,
    FONT_SIZES,
    type FontSizeOption,
    getStoredFontSize
} from '../../../../core/utils/fontSize'
import { toast } from 'vue3-toastify'

const { t, locale } = useI18n()

/*
|--------------------------------------------------------------------------
| OPTIONS
|--------------------------------------------------------------------------
*/

const reminderDelayOptions = computed(() => [
    { label: locale.value === 'en' ? "24 hours before (1 day)" : "24 heures avant (1 jour)", value: "24" },
    { label: locale.value === 'en' ? "48 hours before (2 days)" : "48 heures avant (2 jours)", value: "48" },
    { label: locale.value === 'en' ? "72 hours before (3 days)" : "72 heures avant (3 jours)", value: "72" },
    { label: locale.value === 'en' ? "1 week before (7 days)" : "1 semaine avant (7 jours)", value: "168" }
])

const pageSizeOptions = computed(() => [
    { label: locale.value === 'en' ? "10 per page" : "10 par page", value: "10" },
    { label: locale.value === 'en' ? "15 per page (Standard)" : "15 par page (Standard)", value: "15" },
    { label: locale.value === 'en' ? "25 per page" : "25 par page", value: "25" },
    { label: locale.value === 'en' ? "50 per page" : "50 par page", value: "50" }
])

/*
|--------------------------------------------------------------------------
| FORMULAIRE & VALEURS PAR DÉFAUT
|--------------------------------------------------------------------------
*/

const defaults = {
    font_size: getStoredFontSize(),
    density: "compact",
    page_size: "15",
    email_notifications: true,
    deadline_reminders: true,
    reminder_delay: "48"
}

const form = reactive({ ...defaults })
const initialSnapshot = ref(JSON.stringify(defaults))
const isLoading = ref(false)
const isSaving = ref(false)

const currentFontSizeLabel = computed(() => {
    const opt = form.font_size as FontSizeOption
    if (locale.value === 'en') {
        if (opt === 'compact') return 'Compact (13px)'
        if (opt === 'standard') return 'Standard (14.5px)'
        if (opt === 'large') return 'Large (16px)'
    }
    return FONT_SIZES[opt]?.label || form.font_size
})

const hasChanges = computed(() => JSON.stringify(form) !== initialSnapshot.value)

function selectFontSize(size: FontSizeOption) {
    form.font_size = size
    applyFontSize(size)
}

function loadSettings() {
    isLoading.value = true
    Promise.all([
        settingService.getByGroup('display').catch(() => null),
        settingService.getByGroup('notifications').catch(() => null)
    ])
    .then(([displayRes, notifRes]) => {
        const displayData = displayRes?.data?.data ?? {}
        const notifData = notifRes?.data?.data ?? {}

        if (displayData['display.font_size']?.value) {
            form.font_size = displayData['display.font_size'].value as FontSizeOption
            applyFontSize(form.font_size)
        }
        if (displayData['display.density']?.value) {
            form.density = displayData['display.density'].value
        }
        if (displayData['display.page_size']?.value !== undefined) {
            form.page_size = String(displayData['display.page_size'].value)
        }

        if (notifData['notifications.email_notifications']?.value !== undefined) {
            form.email_notifications = Boolean(notifData['notifications.email_notifications'].value)
        }
        if (notifData['notifications.deadline_reminders']?.value !== undefined) {
            form.deadline_reminders = Boolean(notifData['notifications.deadline_reminders'].value)
        }
        if (notifData['notifications.reminder_delay']?.value !== undefined) {
            form.reminder_delay = String(notifData['notifications.reminder_delay'].value)
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
    applyFontSize(form.font_size)
}

function save() {
    isSaving.value = true
    settingService.update({
        'display.font_size': form.font_size,
        'display.density': form.density,
        'display.page_size': Number(form.page_size),
        'notifications.email_notifications': form.email_notifications,
        'notifications.deadline_reminders': form.deadline_reminders,
        'notifications.reminder_delay': form.reminder_delay,
    })
    .then(() => {
        initialSnapshot.value = JSON.stringify(form)
        applyFontSize(form.font_size)
        toast.success(locale.value === 'en' ? "Display preferences saved successfully!" : "Vos préférences d'affichage ont été enregistrées avec succès !")
    })
    .catch(() => {
        toast.error(locale.value === 'en' ? "Error saving preferences." : "Erreur lors de la sauvegarde des préférences.")
    })
    .finally(() => {
        isSaving.value = false
    })
}

onMounted(() => {
    loadSettings()
})
</script>
