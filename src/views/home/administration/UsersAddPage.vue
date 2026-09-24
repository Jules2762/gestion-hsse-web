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

            <form class="flex flex-col gap-y-6" @submit.prevent="handleSubmit">

                <div class="grid grid-cols-1 gap-4 lg:grid-cols-6">

                    <!-- ========================================================= -->
                    <!-- INFORMATIONS GENERALES -->
                    <!-- ========================================================= -->

                    <div
                        class="flex flex-col gap-5 rounded-2xl border border-border bg-surface p-6 shadow-sm lg:col-span-4">

                        <div class="flex items-center gap-2.5">
                            <div
                                class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-light text-primary">
                                <IdCard class="h-4 w-4" />
                            </div>
                            <h5>
                                Informations générales
                            </h5>
                        </div>

                        <!-- PHOTO DE PROFIL -->

                        <div class="flex items-center gap-4 rounded-xl border border-dashed border-border p-4">

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
                                    JPG ou PNG, 2 Mo maximum, optionnel.
                                </p>
                                <p v-if="avatarError" class="mt-1 text-xs font-medium text-danger">
                                    {{ avatarError }}
                                </p>
                                <button v-if="avatarPreview" type="button" @click="removeAvatar"
                                    class="mt-1 text-xs font-medium text-danger hover:underline">
                                    Retirer la photo
                                </button>
                            </div>

                        </div>

                        <div class="flex flex-col gap-3">

                            <p class="text-xs font-medium text-text-muted">
                                Identité
                            </p>

                            <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                <!--
                                    NOTE : en français, "Nom" désigne le nom de famille et
                                    "Prénom" le prénom. Les libellés étaient auparavant
                                    inversés par rapport aux champs first_name / last_name.
                                -->
                                <Input v-model="form.first_name" :error="errors?.first_name ? errors?.first_name[0]: undefined" label="Prénom *" :icon="UserRound" />
                                <Input v-model="form.last_name" label="Nom" :icon="UserRound" />
                            </div>

                        </div>

                        <div class="flex flex-col gap-3 border-t border-border pt-5">

                            <p class="text-xs font-medium text-text-muted">
                                Contact &amp; poste
                            </p>

                            <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">

                                <Input v-model="form.phone_number" type="tel" label="Numéro de téléphone" :icon="Phone"                                     :error="errors?.phone_number ? errors?.phone_number[0] : undefined"
                                    class="sm:col-span-2" />

                                <div class="relative">
                                    <Input v-model="form.department" label="Département" :error="errors?.department ? errors?.department[0] : undefined"
                                        :icon="Building2Icon"
                                        :list_id="'department_id'" :lists="departments" :disabled="isLoadingFilters" />
                                    <Loader2 v-if="isLoadingFilters"
                                        class="absolute right-3 top-9 h-4 w-4 animate-spin text-text-muted" />
                                </div>
                                <div class="relative">
                                    <Input v-model="form.job" label="Fonction" :icon="Briefcase" :list_id="'job_id'"                                         :error="errors?.job ? errors?.job[0] : undefined"
                                        :lists="fonctions" :disabled="isLoadingFilters" />
                                    <Loader2 v-if="isLoadingFilters"
                                        class="absolute right-3 top-9 h-4 w-4 animate-spin text-text-muted" />
                                </div>

                            </div>

                            <p v-if="filtersError" class="text-xs font-medium text-danger">
                                {{ filtersError }}
                            </p>

                        </div>

                    </div>


                    <!-- ========================================================= -->
                    <!-- SECURISATION -->
                    <!-- ========================================================= -->

                    <div
                        class="flex flex-col gap-y-4 rounded-2xl border border-border bg-surface p-6 shadow-sm lg:col-span-2">

                        <div class="flex items-center gap-2.5">
                            <div
                                class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-light text-primary">
                                <ShieldCheck class="h-4 w-4" />
                            </div>
                            <h5>
                                Sécurisation
                            </h5>
                        </div>

                        <div class="flex flex-col gap-y-3">

                            <Input v-model="form.email" type="email" label="E-mail *" :icon="MailIcon" :error="errors?.email ? errors?.email[0] : undefined"/>

                            <Input v-model="form.password" type="password" label="Mot de passe *" :icon="LockIcon" :error="errors?.password ? errors?.password[0] : undefined" />

                            <Input v-model="form.confirmation_password" type="password"
                                label="Confirmation de mot de passe *" :icon="LockKeyhole" />

                            <ul class="-mt-1 flex flex-col gap-1">
                                <li class="flex items-center gap-1.5 text-xs"
                                    :class="isLengthValid ? 'text-success' : 'text-text-muted'">
                                    <Check v-if="isLengthValid" class="h-3.5 w-3.5 shrink-0" />
                                    <Circle v-else class="h-3.5 w-3.5 shrink-0" />
                                    8 caractères minimum
                                </li>
                                <li class="flex items-center gap-1.5 text-xs"
                                    :class="isMatchValid ? 'text-success' : 'text-text-muted'">
                                    <Check v-if="isMatchValid" class="h-3.5 w-3.5 shrink-0" />
                                    <Circle v-else class="h-3.5 w-3.5 shrink-0" />
                                    Les deux mots de passe correspondent
                                </li>
                            </ul>

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

                <div class="flex w-full flex-row items-center justify-end gap-3 border-t border-border px-1 pt-6">
                    <Button variant="outline" type="button" :disabled="isSubmitting" @click="handleCancel">
                        Annuler
                    </Button>
                    <Button type="submit" :left-icon="isSubmitting ? Loader2 : CheckCircle"
                        :disabled="isSubmitting == true || validated_form == false" :loading="isSubmitting">
                        {{ isSubmitting ? "Enregistrement..." : "Enregistrer" }}
                    </Button>
                </div>

            </form>

        </div>


    </div>
</template>
<script setup lang="ts">

    import {
        Briefcase,
        Building2Icon,
        Camera,
        Check,
        CheckCircle,
        Circle,
        IdCard,
        LockIcon,
        LockKeyhole,
        Loader2,
        MailIcon,
        Phone,
        ShieldCheck,
        ToggleRight,
        UserRound,
        UserCog2Icon,
    } from '@lucide/vue'

    import { computed, onMounted, onUnmounted, ref, watch } from 'vue'

    import Header from '../../../components/shared/Header.vue'
    import Input from '../../../components/ui/Input.vue'
    import Select from '../../../components/ui/Select.vue'

    import {
        UserRoleDataJson,
        UserStatusJsonData
    } from '../../../@data/User.data.ts'

    import { router } from '../../../router/index.ts'

    import type {
        UserFormType,
        UserRoleType,
        UserStatusType
    } from '../../../@types/User.type.ts'
    import { useUserService } from '../../../core/services/user.service.ts'
    import Button from '../../../components/ui/Button.vue'


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
        role: "USER" as UserRoleType ,
        status: "DISABLED" as UserStatusType

    })
    const validated_form = ref<boolean>(false)


    /*
    |--------------------------------------------------------------------------
    | PHOTO DE PROFIL
    |--------------------------------------------------------------------------
    */

    const MAX_AVATAR_SIZE = 2 * 1024 * 1024 // 2 Mo

    const avatarFile = ref<File | null>(null)
    const avatarPreview = ref("")
    const avatarInput = ref<HTMLInputElement | null>(null)
    const avatarError = ref("")

    function handleAvatarChange(event: Event) {

        const target = event.target as HTMLInputElement
        const file = target.files?.[0]

        avatarError.value = ""

        if (!file) return

        if (!file.type.startsWith("image/")) {
            avatarError.value = "Le fichier doit être une image (JPG, PNG...)."
            target.value = ""
            return
        }

        if (file.size > MAX_AVATAR_SIZE) {
            avatarError.value = "L'image ne doit pas dépasser 2 Mo."
            target.value = ""
            return
        }

        avatarFile.value = file

        const reader = new FileReader()

        reader.onload = () => {
            avatarPreview.value = String(reader.result ?? "")
        }

        reader.onerror = () => {
            avatarError.value = "Impossible de lire ce fichier."
        }

        reader.readAsDataURL(file)

    }

    function removeAvatar() {

        avatarFile.value = null
        avatarPreview.value = ""
        avatarError.value = ""

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


    const isLengthValid = computed(() => form.value.password.length >= 8)
    const isMatchValid = computed(() =>
        form.value.password.length > 0 &&
        form.value.password === form.value.confirmation_password
    )

    /*
    |--------------------------------------------------------------------------
    | LISTES (DÉPARTEMENTS / FONCTIONS)
    |--------------------------------------------------------------------------
    */

    const departments = ref<string[]>([])
    const fonctions = ref<string[]>([])
    const isLoadingFilters = ref(false)
    const filtersError = ref("")

    /*
    |--------------------------------------------------------------------------
    | SOUMISSION
    |--------------------------------------------------------------------------
    */

    const isSubmitting = ref(false)
    const submitError = ref("")
    const user = useUserService()
    const errors=ref<Record<keyof typeof form.value,string[]>>(
        {
            'confirmation_password':[],
            'department': [],
            'email': [],
            'first_name': [],
            'job': [],
            'last_name': [],
            'password': [],
            'phone_number': [],
            'role': [],
            'status': [],
        }
    )

    let redirectTimeout: ReturnType<typeof setTimeout> | null = null

    async function handleSubmit() {

        if (isSubmitting.value) return
        submitted.value = true
        submitError.value = ""
        isSubmitting.value = true

        const payload = {
            first_name: form.value.first_name.trim(),
            last_name: form.value.last_name.trim(),
            phone_number: form.value.phone_number.trim(),
            department: form.value.department.trim(),
            job: form.value.job.trim(),
            email: form.value.email.trim(),
            password: form.value.password,
            confirmation_password: form.value.confirmation_password,
            role: form.value.role,
            status: form.value.status,
            // NOTE : si l'API attend un upload multipart plutôt qu'un simple nom
            // de fichier, remplacer par l'envoi de `avatarFile.value` via FormData.
            image_path: avatarFile.value?.name ?? null
        }


        // NOTE : hypothèse sur le nom de la méthode du service. À adapter
        // si `useUserService()` expose un autre nom (ex: `create`, `store`...).
        user.createUser(payload as UserFormType)
            .then(res => {
                redirectTimeout = setTimeout(() => {
                    router.push({ name: "USERS" })
                }, 1200)
            })
            .catch(err => {
                
                if(err.status=='422'){
                    errors.value= err?.response?.data.errors
                }
            })
            .finally(() => {
                isSubmitting.value = false
            })




    }

    function handleCancel() {

        if (isSubmitting.value) return

        router.back()

    }

    function getFilters() {

        isLoadingFilters.value = true
        filtersError.value = ""

        user.getFilters()
            .then(res => {
                departments.value = res.data.department ?? []
                fonctions.value = res.data.fonction ?? []
            })
            .catch(err => {
                console.error(err?.response?.data?.errors)
            })
            .finally(() => {
                isLoadingFilters.value = false
            })

    }

    watch(
        form.value, () => {
            console.table(form.value)
           if(Object.values({
                first_name: form.value.first_name,
                email: form.value.email,
                phone_number: form.value.phone_number,
                status: form.value.status,
                password: form.value.password,
                confirmation_password: form.value.confirmation_password,
                role: form.value.role,
                department: form.value.department,
                job: form.value.job
            }).some(value => value != '' || value != undefined)&&form.value.password===form.value.confirmation_password){
                validated_form.value=true
            }
            else {
                validated_form.value=false
            }
        
    })

    onMounted(() => {
        getFilters()
    })

    onUnmounted(() => {
        if (redirectTimeout) {
            clearTimeout(redirectTimeout)
        }
    })

</script>

<style scoped>
.banner-enter-active,
.banner-leave-active {
    transition: opacity 0.2s ease, transform 0.2s ease;
}

.banner-enter-from,
.banner-leave-to {
    opacity: 0;
    transform: translateY(-4px);
}

.toast-enter-active {
    transition: opacity 0.25s ease, transform 0.25s ease;
}

.toast-leave-active {
    transition: opacity 0.15s ease;
}

.toast-enter-from {
    opacity: 0;
    transform: translate(8px, -8px);
}

.toast-leave-to {
    opacity: 0;
}
</style>