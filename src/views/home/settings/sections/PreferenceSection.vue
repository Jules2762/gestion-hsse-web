<template>
    <div class="flex flex-col gap-y-5">
        <h3>Préférences</h3>

        <div class="p-5">

            <div class="mb-5">
                <h5>
                    Notifications
                </h5>
                <p class="mt-1 text-sm text-text-secondary">
                    Choisissez comment vous souhaitez être informé de l'activité sur la plateforme.
                </p>
            </div>

            <div class="divide-y divide-border overflow-hidden rounded-2xl border border-border">

                <div class="flex items-center justify-between gap-4 p-4">
                    <div>
                        <p class="font-medium text-text-primary">
                            Notifications par e-mail
                        </p>
                        <p class="mt-0.5 text-sm text-text-secondary">
                            Recevoir un e-mail en plus des notifications dans l'application.
                        </p>
                    </div>

                    <button type="button" role="switch" :aria-checked="form.email_notifications"
                        @click="form.email_notifications = !form.email_notifications"
                        class="relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors"
                        :class="form.email_notifications ? 'bg-primary' : 'bg-surface-alt'">
                        <span class="inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform"
                            :class="form.email_notifications ? 'translate-x-6' : 'translate-x-1'"></span>
                    </button>
                </div>

                <div class="flex items-center justify-between gap-4 p-4">
                    <div>
                        <p class="font-medium text-text-primary">
                            Rappels d'échéance
                        </p>
                        <p class="mt-0.5 text-sm text-text-secondary">
                            Être rappelé avant l'échéance d'une action corrective ou d'une formation.
                        </p>
                    </div>

                    <button type="button" role="switch" :aria-checked="form.deadline_reminders"
                        @click="form.deadline_reminders = !form.deadline_reminders"
                        class="relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors"
                        :class="form.deadline_reminders ? 'bg-primary' : 'bg-surface-alt'">
                        <span class="inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform"
                            :class="form.deadline_reminders ? 'translate-x-6' : 'translate-x-1'"></span>
                    </button>
                </div>

                <div v-if="form.deadline_reminders" class="p-4">
                    <Select v-model="form.reminder_delay" label="Délai de rappel" :icon="AlarmClock"
                        :options="reminderDelayOptions" />
                </div>

            </div>

        </div>

        <div class="p-5">

            <div class="mb-5">
                <h5>
                    Affichage
                </h5>
                <p class="mt-1 text-sm text-text-secondary">
                    Ajustez la densité des tableaux et le nombre d'éléments affichés par page.
                </p>
            </div>

            <div class="grid grid-cols-2 gap-3">

                <label class="flex cursor-pointer items-center justify-between rounded-xl border p-4 transition-all"
                    :class="form.density === 'comfortable'
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:bg-surface-alt'">
                    <div>
                        <p class="font-medium text-text-primary">
                            Confortable
                        </p>
                        <p class="mt-1 text-sm text-text-secondary">
                            Lignes plus espacées, lecture facilitée.
                        </p>
                    </div>
                    <input v-model="form.density" type="radio" value="comfortable" />
                </label>

                <label class="flex cursor-pointer items-center justify-between rounded-xl border p-4 transition-all"
                    :class="form.density === 'compact'
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:bg-surface-alt'">
                    <div>
                        <p class="font-medium text-text-primary">
                            Compacte
                        </p>
                        <p class="mt-1 text-sm text-text-secondary">
                            Plus de lignes visibles à l'écran.
                        </p>
                    </div>
                    <input v-model="form.density" type="radio" value="compact" />
                </label>

            </div>

            <div class="mt-3 max-w-xs">
                <Select v-model="form.page_size" label="Éléments par page" :icon="Rows3" :options="pageSizeOptions" />
            </div>

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
                    Préférences enregistrées
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
    AlarmClock,
    CheckCircle2,
    RotateCcw,
    Rows3,
    Save,
    X
} from '@lucide/vue'

import { computed, reactive, ref } from 'vue'

import Select from '../../../../components/ui/Select.vue'


/*
|--------------------------------------------------------------------------
| OPTIONS
|--------------------------------------------------------------------------
*/

const reminderDelayOptions = [
    { label: "1 jour avant", value: "1" },
    { label: "3 jours avant", value: "3" },
    { label: "1 semaine avant", value: "7" }
]

const pageSizeOptions = [
    { label: "10 par page", value: "10" },
    { label: "25 par page", value: "25" },
    { label: "50 par page", value: "50" },
    { label: "100 par page", value: "100" }
]


/*
|--------------------------------------------------------------------------
| FORMULAIRE
|--------------------------------------------------------------------------
|
| Placeholder en attendant l'API des préférences utilisateur.
|
*/

const defaults = {
    email_notifications: true,
    deadline_reminders: true,
    reminder_delay: "3",
    density: "comfortable",
    page_size: "25"
}

const form = reactive({ ...defaults })


/*
|--------------------------------------------------------------------------
| CHANGEMENTS
|--------------------------------------------------------------------------
*/

const hasChanges = computed(() => JSON.stringify(form) !== JSON.stringify(defaults))

function resetForm() {
    Object.assign(form, defaults)
}


/*
|--------------------------------------------------------------------------
| ENREGISTRER
|--------------------------------------------------------------------------
*/

const successMessage = ref("")

function save() {

    console.log("Préférences utilisateur :", { ...form })

    Object.assign(defaults, { ...form })

    successMessage.value = "Vos préférences ont été mises à jour."

}

</script>
