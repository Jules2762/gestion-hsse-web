<template>
    <div class="flex flex-col gap-y-5">
        <h3>E-mail</h3>
        <div class="p-5">
            <div class="mb-5">
                <h5>
                    Méthode d'ouverture
                </h5>
                <p class="mt-1 text-sm text-text-secondary">
                    Choisissez comment ouvrir
                    les e-mails depuis la
                    plateforme GALANA HSSE.
                </p>
            </div>

            <div class="grid grid-cols-3 gap-3">
                <!-- Outlook Desktop -->

                <label
                    class="flex cursor-pointer items-center justify-between rounded-xl border p-4 transition-all normal-case"
                    :class="emailOpenMethod ===
                        'OUTLOOK_DESKTOP'
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-border/60'
                        ">
                    <div>
                        <p class="font-medium">
                            Outlook Desktop
                        </p>

                        <p class="
                            text-sm
                            text-text-secondary
                        ">
                            Ouvre l'application
                            Outlook installée sur
                            le poste.
                        </p>
                    </div>

                    <input v-model="emailOpenMethod
                        " type="radio" value="OUTLOOK_DESKTOP" />
                </label>

                <!-- Outlook Web -->

                <label class="
                    flex
                    cursor-pointer
                    items-center
                    normal-case
                    justify-between
                    rounded-xl
                    border
                    p-4
                    transition-all
                " :class="emailOpenMethod ===
                    'OUTLOOK_WEB'
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-border/60'
                    ">
                    <div>
                        <p class="
                            font-medium
                        ">
                            Outlook Web
                        </p>

                        <p class="
                            text-sm
                            text-text-secondary
                        ">
                            Ouvre Outlook dans
                            le navigateur.
                        </p>
                    </div>

                    <input v-model="emailOpenMethod
                        " type="radio" value="OUTLOOK_WEB" />
                </label>

                <!-- Ask -->

                <label class="
                    flex
                    cursor-pointer
                    items-center
                    justify-between
                    rounded-xl
                    border
                    p-4
                    normal-case
                    transition-all
                " :class="emailOpenMethod ===
                    'ASK'
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-border/60'
                    ">
                    <div>
                        <p class="
                            font-medium
                        ">
                            Demander à chaque fois
                        </p>

                        <p class="
                            text-sm
                            text-text-secondary
                        ">
                            Affiche une boîte de dialogue
                            avant l'ouverture d'un e-mail.
                        </p>
                    </div>

                    <input v-model="emailOpenMethod
                        " type="radio" value="ASK" />
                </label>
            </div>
        </div>
        <div class="
           
            p-5
        ">
            <h5>
                Destinataires en copie
            </h5>

            <p class="
                mt-1
                text-sm
                text-text-secondary
            ">
                Recevront une copie des
                notifications des actions
                correctives.
            </p>

            <!-- AJOUT -->

            <div class="
                mt-5
                flex
                gap-2
            ">
                <select v-model="selectedRecipientId
                    " class="
                    flex-1
                    rounded-xl
                    border
                    border-border
                    px-3
                    py-2
                ">
                    <option :value="undefined">
                        Sélectionner
                    </option>

                    <option v-for="
recipient in
    selectableRecipients
                    " :key="recipient.id
                        " :value="recipient.id
                            ">
                        {{
                            recipient.label
                        }}
                    </option>
                </select>

                <button class="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-xl
                    bg-primary
                    text-white
                " @click="
                    addRecipient
                ">
                    <Plus :size="18" />
                </button>
            </div>

            <!-- TAGS -->

            <div class="
                mt-4
                flex
                flex-wrap
                gap-3
            ">
                <div v-for="
recipient in
    selectedRecipients
                " :key="recipient.id
                    " class="
                    flex
                    items-center
                    gap-2
                    rounded-full
                    border
                    border-primary/20
                    bg-primary/5
                    px-4
                    py-2
                ">
                    <span>
                        {{
                            recipient.label
                        }}
                    </span>

                    <button class="
                        rounded-full
                        p-1
                        hover:bg-primary/10
                    " @click="
                        removeRecipient(
                            recipient.id,
                        )
                        ">
                        <X :size="14" />
                    </button>
                </div>
            </div>

            <!-- ETAT VIDE -->

            <p v-if="
                !selectedRecipients.length
            " class="
                mt-4
                text-sm
                text-text-muted
            ">
                Aucun destinataire
                sélectionné.
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
                    E-mail enregistré
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
    import { computed, ref } from 'vue';
    import { CheckCircle2, Plus, RotateCcw, Save, X } from '@lucide/vue'

    type EmailOpenMethodType =
        | "OUTLOOK_DESKTOP"
        | "OUTLOOK_WEB"
        | "ASK"

    const DEFAULT_EMAIL_OPEN_METHOD: EmailOpenMethodType = "ASK"

    const emailOpenMethod =
        ref<EmailOpenMethodType>(
            DEFAULT_EMAIL_OPEN_METHOD,
        )
    type RecipientType = {
        id: number
        label: string
    }

    const availableRecipients = ref<
        RecipientType[]
    >([
        {
            id: 1,
            label:
                'Responsable hiérarchique',
        },
        {
            id: 2,
            label:
                'Responsable HSSE',
        },
        {
            id: 3,
            label: 'Administrateurs',
        },
    ])

    const selectedRecipients =
        ref<RecipientType[]>([])

    const selectedRecipientId =
        ref<number>()

    const selectableRecipients =
        computed(() =>
            availableRecipients.value.filter(
                available =>
                    !selectedRecipients.value.some(
                        selected =>
                            selected.id ===
                            available.id,
                    ),
            ),
        )

    function addRecipient() {
        const recipient =
            selectableRecipients.value.find(
                item =>
                    item.id ===
                    selectedRecipientId.value,
            )

        if (!recipient) return

        selectedRecipients.value.push(
            recipient,
        )

        selectedRecipientId.value =
            undefined
    }

    function removeRecipient(
        id: number,
    ) {
        selectedRecipients.value =
            selectedRecipients.value.filter(
                item => item.id !== id,
            )
    }


    /*
    |--------------------------------------------------------------------------
    | CHANGEMENTS
    |--------------------------------------------------------------------------
    |
    | Placeholder en attendant l'API des paramètres e-mail.
    |
    */

    const savedEmailOpenMethod =
        ref<EmailOpenMethodType>(DEFAULT_EMAIL_OPEN_METHOD)

    const savedRecipientIds =
        ref<number[]>([])

    const hasChanges = computed(() => {

        if (emailOpenMethod.value !== savedEmailOpenMethod.value) return true

        const currentIds = selectedRecipients.value.map(recipient => recipient.id).sort()
        const savedIds = [...savedRecipientIds.value].sort()

        return JSON.stringify(currentIds) !== JSON.stringify(savedIds)

    })

    function resetForm() {

        emailOpenMethod.value = savedEmailOpenMethod.value

        selectedRecipients.value = availableRecipients.value.filter(
            recipient => savedRecipientIds.value.includes(recipient.id)
        )

        selectedRecipientId.value = undefined

    }


    /*
    |--------------------------------------------------------------------------
    | ENREGISTRER
    |--------------------------------------------------------------------------
    */

    const successMessage = ref("")

    function save() {

        console.log("Paramètres e-mail :", {
            emailOpenMethod: emailOpenMethod.value,
            recipients: selectedRecipients.value,
        })

        savedEmailOpenMethod.value = emailOpenMethod.value

        savedRecipientIds.value = selectedRecipients.value.map(recipient => recipient.id)

        successMessage.value = "Vos préférences e-mail ont été mises à jour."

    }
</script>