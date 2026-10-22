<template>
    <div class="min-h-screen bg-background">

        <Header title="administration.users.update" :thumbnails="[
            {
                label: 'thumbnails.home',
                name: 'DASHBOARD'
            },
            {
                label: 'thumbnails.administration',
                name: 'ADMINISTRATION'
            },
            {
                label: 'thumbnails.users',
                name: 'USERS'
            },
            {
                label: 'thumbnails.update',
                name: 'UPDATE_USER'
            }
        ]" />

        <div class="p-6 lg:p-8">

            <!-- ETAT DE CHARGEMENT INITIAL -->
            <div v-if="isLoadingUser" class="flex items-center justify-center py-20 text-text-muted">
                <Loader2 class="h-5 w-5 animate-spin mr-2" />
                {{ locale === 'en' ? 'Loading user information...' : 'Chargement des informations de l\'utilisateur...' }}
            </div>

            <!-- ERREUR DE CHARGEMENT -->
            <div v-else-if="loadUserError"
                class="rounded-xl border border-danger/30 bg-danger/5 p-6 text-sm text-danger">
                {{ loadUserError }}
            </div>

            <form v-else class="flex flex-col gap-y-6" @submit.prevent="handleSubmit">

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
                                {{ locale === 'en' ? 'General Information' : 'Informations générales' }}
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
                                    {{ locale === 'en' ? 'Profile picture' : 'Photo de profil' }}
                                </p>
                                <p class="mt-0.5 text-xs text-text-muted">
                                    {{ locale === 'en' ? 'JPG or PNG, 2 MB maximum, optional.' : 'JPG ou PNG, 2 Mo maximum, optionnel.' }}
                                </p>
                                <p v-if="avatarError" class="mt-1 text-xs font-medium text-danger">
                                    {{ avatarError }}
                                </p>
                                <button v-if="avatarPreview" type="button" @click="removeAvatar"
                                    class="mt-1 text-xs font-medium text-danger hover:underline">
                                    {{ locale === 'en' ? 'Remove picture' : 'Retirer la photo' }}
                                </button>
                            </div>

                        </div>

                        <div class="flex flex-col gap-3">

                            <p class="text-xs font-medium text-text-muted">
                                {{ locale === 'en' ? 'Identity' : 'Identité' }}
                            </p>

                            <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                <Input v-model="form.first_name"
                                    :error="errors?.first_name ? errors?.first_name[0] : undefined" :label="locale === 'en' ? 'First name *' : 'Prénom *'"
                                    :icon="UserRound" />
                                <Input v-model="form.last_name" :label="locale === 'en' ? 'Last name' : 'Nom'" :icon="UserRound" />
                            </div>

                        </div>

                        <div class="flex flex-col gap-3 border-t border-border pt-5">

                            <p class="text-xs font-medium text-text-muted">
                                {{ locale === 'en' ? 'Contact & position' : 'Contact & poste' }}
                            </p>

                            <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">

                                <Input v-model="form.phone_number" type="tel" :label="locale === 'en' ? 'Phone number' : 'Numéro de téléphone'" :icon="Phone"
                                    :error="errors?.phone_number ? errors?.phone_number[0] : undefined"
                                    class="sm:col-span-2" />

                                <div class="relative">
                                    <Input v-model="form.department" :label="locale === 'en' ? 'Department' : 'Département'"
                                        :error="errors?.department ? errors?.department[0] : undefined"
                                        :icon="Building2Icon" :list_id="'department_id'" :lists="departments"
                                        :disabled="isLoadingFilters" />
                                    <Loader2 v-if="isLoadingFilters"
                                        class="absolute right-3 top-9 h-4 w-4 animate-spin text-text-muted" />
                                </div>
                                <div class="relative">
                                    <Input v-model="form.job" :label="locale === 'en' ? 'Position' : 'Fonction'" :icon="Briefcase" :list_id="'job_id'"
                                        :error="errors?.job ? errors?.job[0] : undefined" :lists="fonctions"
                                        :disabled="isLoadingFilters" />
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
                    <!-- APERCU (remplace la section Sécurisation) -->
                    <!-- ========================================================= -->

                    <div
                        class="flex flex-col gap-y-4 rounded-2xl border border-border bg-surface p-6 shadow-sm lg:col-span-2">

                        <div class="flex items-center gap-2.5">
                            <div
                                class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-light text-primary">
                                <Eye class="h-4 w-4" />
                            </div>
                            <h5>
                                {{ locale === 'en' ? 'Preview' : 'Aperçu' }}
                            </h5>
                        </div>

                        <!-- CARTE DE PREVIEW -->
                        <div
                            class="flex flex-col items-center gap-3 rounded-xl border border-border bg-background p-5 text-center">

                            <div
                                class="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-primary-light text-primary ring-4 ring-primary/5">
                                <img v-if="avatarPreview" :src="avatarPreview" alt="Photo de profil"
                                    class="h-full w-full object-cover" />
                                <UserRound v-else class="h-7 w-7" />
                            </div>

                            <div>
                                <p class="text-sm font-semibold text-text-primary">
                                    {{ previewFullName }}
                                </p>
                                <p class="text-xs text-text-muted">
                                    {{ form.job || (locale === 'en' ? 'Position not specified' : 'Fonction non renseignée') }}
                                </p>
                            </div>

                            <div
                                class="flex items-center gap-1.5 rounded-lg bg-surface px-3 py-1.5 text-xs text-text-muted">
                                <MailIcon class="h-3.5 w-3.5 shrink-0" />
                                {{ form.email || (locale === 'en' ? 'Email not specified' : 'Adresse e-mail non renseignée') }}
                            </div>

                        </div>

                        <!-- ROLE & STATUT -->
                        <div class="flex flex-col gap-y-3 border-t border-border pt-4">

                            <Select v-model="form.role" :label="locale === 'en' ? 'Role *' : 'Rôle *'" :icon="UserCog2Icon"
                                :options="userRoleOptions" />

                            <Select v-model="form.status" :label="locale === 'en' ? 'Status' : 'Statut'" :icon="ToggleRight"
                                :options="userStatusOptions" />

                        </div>

                        <p class="text-xs text-text-muted">
                            {{ locale === 'en' ? 'Email and password cannot be changed from this page.' : "L'e-mail et le mot de passe ne peuvent pas être modifiés depuis cette page." }}
                        </p>

                    </div>

                </div>


                <!-- ========================================================= -->
                <!-- ACTIONS -->
                <!-- ========================================================= -->

                <div class="flex w-full flex-row items-center justify-end gap-3 border-t border-border px-1 pt-6">
                    <Button variant="outline" type="button" :disabled="isSubmitting" @click="handleCancel">
                        {{ locale === 'en' ? 'Cancel' : 'Annuler' }}
                    </Button>
                    <Button type="submit" :left-icon="isSubmitting ? Loader2 : CheckCircle"
                        :disabled="isSubmitting == true" :loading="isSubmitting">
                        {{ isSubmitting ? (locale === 'en' ? "Saving..." : "Enregistrement...") : (locale === 'en' ? "Save" : "Enregistrer") }}
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
        CheckCircle,
        Eye,
        IdCard,
        Loader2,
        MailIcon,
        Phone,
        ToggleRight,
        UserRound,
        UserCog2Icon,
    } from '@lucide/vue'

    import { computed, onMounted, onUnmounted, ref } from 'vue'
    import { useRoute } from 'vue-router'
    import { useI18n } from 'vue-i18n'

    import Header from '../../../components/shared/Header.vue'
    import Input from '../../../components/ui/Input.vue'
    import Select from '../../../components/ui/Select.vue'
    import Button from '../../../components/ui/Button.vue'

    import {
        UserRoleDataJson,
        UserStatusJsonData
    } from '../../../@data/User.data.ts'

    import { router } from '../../../router/index.ts'
    import { toast } from 'vue3-toastify'

    import type {
        UserFormType,
        UserRoleType,
        UserStatusType
    } from '../../../@types/User.type.ts'
    import { useUserService } from '../../../core/services/user.service.ts'

    const { t, locale } = useI18n()

    const userRoleOptions = computed(() => [
        { label: locale.value === 'en' ? 'User' : 'Utilisateur', value: 'USER' },
        { label: locale.value === 'en' ? 'Administrator' : 'Administrateur', value: 'ADMIN' },
    ])

    const userStatusOptions = computed(() => [
        { label: locale.value === 'en' ? 'Active' : 'Actif', value: 'ENABLED' },
        { label: locale.value === 'en' ? 'Disabled' : 'Désactivé', value: 'DISABLED' },
    ])


    /*
    |--------------------------------------------------------------------------
    | IDENTIFIANT UTILISATEUR (route)
    |--------------------------------------------------------------------------
    */

    // NOTE : hypothèse sur le nom du paramètre de route ("id").
    // À adapter selon la déclaration de la route UPDATE_USER.
    const route = useRoute()
    const userId = route.params.id as string


    /*
    |--------------------------------------------------------------------------
    | FORMULAIRE
    |--------------------------------------------------------------------------
    | NOTE : email conservé en lecture seule (affichage dans l'aperçu) mais
    | n'est plus envoyé dans le payload de mise à jour. password /
    | confirmation_password ont été entièrement retirés : cette page ne
    | permet plus aucune modification liée à la sécurité du compte.
    */

    const form = ref({

        first_name: "",
        last_name: "",
        phone_number: "",
        department: "",
        job: "",

        email: "",
        role: "USER" as UserRoleType,
        status: "DISABLED" as UserStatusType

    })


    /*
    |--------------------------------------------------------------------------
    | CHARGEMENT DE L'UTILISATEUR
    |--------------------------------------------------------------------------
    */

    const isLoadingUser = ref(false)
    const loadUserError = ref("")
    const user = useUserService()

    function getUser() {

        isLoadingUser.value = true
        loadUserError.value = ""

        // NOTE : hypothèse sur le nom de la méthode du service pour récupérer
        // un utilisateur (ex: getUser, show, getById...). À adapter.
        user.show(userId)
            .then(res => {
                console.log(res.data)
                const data = res.data

                form.value.first_name = data.first_name ?? ""
                form.value.last_name = data.last_name ?? ""
                form.value.phone_number = data.phone_number ?? ""
                form.value.department = data.department ?? ""
                form.value.job = data.job ?? ""
                form.value.email = data.email ?? ""
                form.value.role = data.role[0]
                form.value.status = data.status ?? "DISABLED"

                // NOTE : hypothèse sur le nom du champ contenant l'URL de l'avatar
                // renvoyée par l'API (ex: image_path, avatar_url...).
                if (data.image_path) {
                    avatarPreview.value = data.image_path
                }

            })
            .catch(err => {
                loadUserError.value = "Impossible de charger les informations de cet utilisateur."
            })
            .finally(() => {
                isLoadingUser.value = false
            })

    }


    /*
    |--------------------------------------------------------------------------
    | APERCU
    |--------------------------------------------------------------------------
    */

    const previewFullName = computed(() => {
        const full = `${form.value.first_name} ${form.value.last_name}`.trim()
        return full.length > 0 ? full : "Nom non renseigné"
    })


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
    const avatarRemoved = ref(false)

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
        avatarRemoved.value = false

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
        avatarRemoved.value = true

        if (avatarInput.value) {
            avatarInput.value.value = ""
        }

    }


    /*
    |--------------------------------------------------------------------------
    | LISTES (DÉPARTEMENTS / FONCTIONS)
    |--------------------------------------------------------------------------
    */

    const departments = ref<string[]>([])
    const fonctions = ref<string[]>([])
    const isLoadingFilters = ref(false)
    const filtersError = ref("")

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


    /*
    |--------------------------------------------------------------------------
    | SOUMISSION
    |--------------------------------------------------------------------------
    */

    const isSubmitting = ref(false)
    const errors = ref<Record<keyof typeof form.value, string[]>>(
        {
            'department': [],
            'email': [],
            'first_name': [],
            'job': [],
            'last_name': [],
            'phone_number': [],
            'role': [],
            'status': [],
        }
    )

    let redirectTimeout: ReturnType<typeof setTimeout> | null = null

    async function handleSubmit() {

        if (isSubmitting.value) return

        isSubmitting.value = true

        // NOTE : email volontairement exclu du payload, cette page ne permet
        // plus de le modifier (ni le mot de passe).
        const payload: Record<string, unknown> = {
            first_name: form.value.first_name.trim(),
            last_name: form.value.last_name.trim(),
            phone_number: form.value.phone_number.trim(),
            department: form.value.department.trim(),
            job: form.value.job.trim(),
            role: form.value.role,
            status: form.value.status,
        }

        // NOTE : si l'API attend un upload multipart plutôt qu'un simple nom
        // de fichier, remplacer par l'envoi de `avatarFile.value` via FormData.
        if (avatarFile.value && avatarPreview.value) {
            payload.image_path = avatarPreview.value
        } else if (avatarRemoved.value) {
            payload.image_path = null
        }

        user.update(userId, payload as Partial<UserFormType>)
            .then(res => {
                toast.success('Utilisateur mis à jour avec succès')
                redirectTimeout = setTimeout(() => {
                    router.push({ name: "USERS" })
                }, 1000)
            })
            .catch(err => {
                if (err.status == '422') {
                    errors.value = err?.response?.data.errors
                } else {
                    toast.error(err?.response?.data?.message || 'Erreur lors de la mise à jour')
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

    onMounted(() => {
        getUser()
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