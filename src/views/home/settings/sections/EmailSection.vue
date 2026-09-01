<template>
    <div class="flex flex-col gap-y-5">
        <h3>E-mail</h3>
        <div class="p-5">
            <div class="mb-5">
                <h5>
                    Méthode d'ouverture
                </h5>
                <p class="mt-1 text-sm text-gray-500">
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
                        : 'border-gray-200 hover:border-gray-300'
                        ">
                    <div>
                        <p class="font-medium">
                            Outlook Desktop
                        </p>

                        <p class="
                            text-sm
                            text-gray-500
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
                    : 'border-gray-200 hover:border-gray-300'
                    ">
                    <div>
                        <p class="
                            font-medium
                        ">
                            Outlook Web
                        </p>

                        <p class="
                            text-sm
                            text-gray-500
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
                    : 'border-gray-200 hover:border-gray-300'
                    ">
                    <div>
                        <p class="
                            font-medium
                        ">
                            Demander à chaque fois
                        </p>

                        <p class="
                            text-sm
                            text-gray-500
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
                text-gray-500
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
                    border-gray-200
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
                text-gray-400
            ">
                Aucun destinataire
                sélectionné.
            </p>
        </div>
    </div>
</template>
<script setup lang="ts">
    import { computed, ref } from 'vue';
    import { Plus, X } from '@lucide/vue'

    type EmailOpenMethodType =
        | "OUTLOOK_DESKTOP"
        | "OUTLOOK_WEB"
        | "ASK"

    const emailOpenMethod =
        ref<EmailOpenMethodType>(
            "ASK",
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
</script>