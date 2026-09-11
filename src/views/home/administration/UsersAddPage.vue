<script setup lang="ts">

    import {
        Briefcase,
        Building2Icon,
        Camera,
        CheckCircle,
        CircleAlert,
        LockIcon,
        LockKeyhole,
        MailIcon,
        Phone,
        ToggleRight,
        UserRound,
        UserCog2Icon,
        X
    } from '@lucide/vue'

    import { computed, ref } from 'vue'

    import Header from '../../../components/shared/Header.vue'
    import Input from '../../../components/ui/Input.vue'
    import Button from '../../../components/ui/Button.vue'
    import Select from '../../../components/ui/Select.vue'

    import {
        UserRoleDataJson,
        UserStatusJsonData
    } from '../../../@data/User.data.ts'

    import { router } from '../../../router/index.ts'

    import type {
        UserRoleType,
        UserStatusType
    } from '../../../@types/User.type.ts'


    /*
    |--------------------------------------------------------------------------
    | FORMULAIRE
    |--------------------------------------------------------------------------
    */

    const form = ref({

        first_name: "",
        last_name: "",
        phone_number: "",
        department: "",
        job: "",

        email: "",
        password: "",
        confirmation_password: "",
        role: "" as UserRoleType | "",
        status: "ENABLED" as UserStatusType

    })


    /*
    |--------------------------------------------------------------------------
    | PHOTO DE PROFIL
    |--------------------------------------------------------------------------
    */

    const avatarFile = ref<File | null>(null)
    const avatarPreview = ref("")
    const avatarInput = ref<HTMLInputElement | null>(null)

    function handleAvatarChange(event: Event) {

        const target = event.target as HTMLInputElement
        const file = target.files?.[0]

        if (!file) return

        avatarFile.value = file

        const reader = new FileReader()

        reader.onload = () => {
            avatarPreview.value = String(reader.result ?? "")
        }

        reader.readAsDataURL(file)

    }

    function removeAvatar() {

        avatarFile.value = null
        avatarPreview.value = ""

        if (avatarInput.value) {
            avatarInput.value.value = ""
        }

    }


    /*
    |--------------------------------------------------------------------------
    | VALIDATION
    |--------------------------------------------------------------------------
    */

    const submitted = ref(false)

    const errors = computed(() => {

        const list: string[] = []

        if (!form.value.first_name.trim()) {
            list.push("Le nom est obligatoire.")
        }

        if (!form.value.last_name.trim()) {
            list.push("Le prénom est obligatoire.")
        }

        if (!form.value.email.trim()) {
            list.push("L'adresse e-mail est obligatoire.")
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email.trim())) {
            list.push("L'adresse e-mail n'est pas valide.")
        }

        if (
            form.value.phone_number.trim() &&
            !/^[0-9+\s().-]{6,}$/.test(form.value.phone_number.trim())
        ) {
            list.push("Le numéro de téléphone n'est pas valide.")
        }

        if (!form.value.role) {
            list.push("Le rôle est obligatoire.")
        }

        if (!form.value.password) {
            list.push("Le mot de passe est obligatoire.")
        } else if (form.value.password.length < 8) {
            list.push("Le mot de passe doit contenir au moins 8 caractères.")
        }

        if (!form.value.confirmation_password) {
            list.push("La confirmation du mot de passe est obligatoire.")
        } else if (form.value.password !== form.value.confirmation_password) {
            list.push("Les deux mots de passe ne correspondent pas.")
        }

        return list

    })

    const hasErrors = computed(() => errors.value.length > 0)


    /*
    |--------------------------------------------------------------------------
    | SOUMISSION
    |--------------------------------------------------------------------------
    |
    | Pour le moment, aucune API : la création reste simulée.
    |
    */

    const isSubmitting = ref(false)
    const successMessage = ref("")

    async function handleSubmit() {

        submitted.value = true

        if (hasErrors.value) return

        isSubmitting.value = true

        const payload = {
            ...form.value,
            image_path: avatarFile.value?.name ?? null
        }

        console.log("Nouveau compte utilisateur :", payload)

        await new Promise(resolve => setTimeout(resolve, 600))

        isSubmitting.value = false

        successMessage.value =
            `Le compte de ${form.value.first_name} ${form.value.last_name} a été créé avec succès.`

        setTimeout(() => {
            router.push({ name: "USERS" })
        }, 1200)

    }

    function handleCancel() {

        if (isSubmitting.value) return

        router.back()

    }

</script>

<template>
    <div class="min-h-screen bg-background">

        <Header title="Nouveau compte utilisateur" :thumbnails="[
            {
                label: 'Accueil',
                name: 'DASHBOARD'
            },
            {
                label: 'Administration',
                name: 'ADMINISTRATION'
            },
            {
                label: 'Utilisateur',
                name: 'USERS'
            },
            {
                label: 'Nouveau',
                name: 'ADD_USER'
            }
        ]" />

        <div class="p-6 lg:p-8">

            <div class="mb-6 space-y-1">
                <h1 class="text-2xl font-bold tracking-tight text-text-primary md:text-3xl">
                    Nouveau compte utilisateur
                </h1>
                <p class="text-sm text-text-secondary">
                    Renseignez les informations ci-dessous pour créer un nouvel accès à la plateforme.
                </p>
            </div>


            <!-- ========================================================= -->
            <!-- ERREURS DE VALIDATION -->
            <!-- ========================================================= -->

            <div v-if="submitted && hasErrors"
                class="mb-6 flex items-start gap-3 rounded-xl border border-danger/30 bg-danger/10 p-4 text-sm text-danger">
                <CircleAlert class="mt-0.5 h-5 w-5 shrink-0" />
                <div>
                    <p class="font-semibold">
                        Veuillez corriger les points suivants :
                    </p>
                    <ul class="mt-1 list-inside list-disc space-y-0.5">
                        <li v-for="(error, index) in errors" :key="index">
                            {{ error }}
                        </li>
                    </ul>
                </div>
            </div>


            <form class="flex flex-col gap-y-6" @submit.prevent="handleSubmit">

                <div class="grid grid-cols-1 gap-4 lg:grid-cols-6">

                    <!-- ========================================================= -->
                    <!-- INFORMATIONS GENERALES -->
                    <!-- ========================================================= -->

                    <div
                        class="flex flex-col gap-4 rounded-2xl border border-border bg-surface p-6 shadow-sm lg:col-span-4">

                        <h5>
                            Informations générales
                        </h5>

                        <!-- PHOTO DE PROFIL -->

                        <div class="flex items-center gap-4">

                            <div class="relative h-16 w-16 shrink-0">

                                <div
                                    class="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-primary-light text-primary ring-4 ring-primary/5">
                                    <img v-if="avatarPreview" :src="avatarPreview" alt="Photo de profil"
                                        class="h-full w-full object-cover" />
                                    <UserRound v-else class="h-7 w-7" />
                                </div>

                                <label
                                    class="absolute -bottom-1 -right-1 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-primary text-white shadow-sm transition-colors hover:bg-primary-dark">
                                    <Camera class="h-3.5 w-3.5" />
                                    <input ref="avatarInput" type="file" accept="image/*" class="hidden"
                                        @change="handleAvatarChange" />
                                </label>

                            </div>

                            <div>
                                <p class="text-sm font-medium text-text-primary">
                                    Photo de profil
                                </p>
                                <p class="mt-0.5 text-xs text-text-muted">
                                    JPG ou PNG, optionnel.
                                </p>
                                <button v-if="avatarPreview" type="button" @click="removeAvatar"
                                    class="mt-1 text-xs font-medium text-danger hover:underline">
                                    Retirer la photo
                                </button>
                            </div>

                        </div>

                        <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">

                            <Input v-model="form.first_name" label="Nom *" :icon="UserRound" />
                            <Input v-model="form.last_name" label="Prénom *" :icon="UserRound" />

                            <Input v-model="form.phone_number" type="tel" label="Numéro de téléphone" :icon="Phone"
                                class="sm:col-span-2" />

                            <Input v-model="form.department" label="Département" :icon="Building2Icon" />
                            <Input v-model="form.job" label="Fonction" :icon="Briefcase" />

                        </div>

                    </div>


                    <!-- ========================================================= -->
                    <!-- SECURISATION -->
                    <!-- ========================================================= -->

                    <div
                        class="flex flex-col gap-y-4 rounded-2xl border border-border bg-surface p-6 shadow-sm lg:col-span-2">

                        <h5>
                            Sécurisation
                        </h5>

                        <div class="flex flex-col gap-y-3">

                            <Input v-model="form.email" type="email" label="E-mail *" :icon="MailIcon" />

                            <Input v-model="form.password" type="password" label="Mot de passe *" :icon="LockIcon" />

                            <Input v-model="form.confirmation_password" type="password"
                                label="Confirmation de mot de passe *" :icon="LockKeyhole" />

                            <p class="-mt-1 text-xs text-text-muted">
                                8 caractères minimum.
                            </p>

                            <Select v-model="form.role" label="Rôle *" :icon="UserCog2Icon"
                                :options="UserRoleDataJson" />

                            <Select v-model="form.status" label="Statut" :icon="ToggleRight"
                                :options="UserStatusJsonData" />

                        </div>

                    </div>

                </div>


                <!-- ========================================================= -->
                <!-- ACTIONS -->
                <!-- ========================================================= -->

                <div class="flex w-full flex-row items-center justify-end gap-3 px-1">
                    <Button variant="outline" type="button" :disabled="isSubmitting" @click="handleCancel">
                        Annuler
                    </Button>
                    <Button type="submit" :left-icon="CheckCircle" :disabled="isSubmitting">
                        {{ isSubmitting ? "Enregistrement..." : "Enregistrer" }}
                    </Button>
                </div>

            </form>

        </div>


        <!-- ========================================================= -->
        <!-- MESSAGE -->
        <!-- ========================================================= -->

        <div v-if="successMessage"
            class="fixed right-6 top-6 z-50 flex max-w-sm items-start gap-3 rounded-2xl border border-status-success/20 bg-surface p-4 shadow-2xl ring-1 ring-status-success/5">

            <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-light">
                <CheckCircle class="h-5 w-5 text-success" />
            </div>

            <div>
                <p class="font-semibold text-text-primary">
                    Compte créé
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