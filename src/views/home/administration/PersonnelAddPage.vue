<template>
    <div class="min-h-screen bg-background">

        <Header title="Nouveau membre du personnel" :thumbnails="[
            { label: 'Accueil', name: 'DASHBOARD' },
            { label: 'Administration', name: 'ADMINISTRATION' },
            { label: 'Personnel', name: 'PERSONNEL' },
            { label: 'Nouveau', name: 'PERSONNEL_ADD' }
        ]" />

        <div class="p-6 pb-0 lg:p-8 lg:pb-0">

            <form class="flex flex-col gap-y-6" novalidate @submit.prevent="handleSubmit(false)">

               

                <div class="grid grid-cols-1 items-start gap-6 lg:grid-cols-6">

                    <!-- ========================================================= -->
                    <!-- FORMULAIRE -->
                    <!-- ========================================================= -->

                    <div
                        class="flex flex-col divide-y divide-border rounded-2xl border border-border bg-surface shadow-sm lg:col-span-4">

                        <!-- Identité -->
                        <section class="flex flex-col gap-4 p-6">

                            <div class="flex items-center gap-3">
                                <div
                                    class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-light text-primary">
                                    <IdCard class="h-4.5 w-4.5" />
                                </div>
                                <div>
                                    <h5>Identité</h5>
                                    <p class="text-xs text-text-muted">Comment cette personne apparaîtra dans la liste.
                                    </p>
                                </div>
                            </div>

                            <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                <Input v-model="form.first_name" label="Prénom *" :icon="UserRound"
                                    :error="errors.first_name?.[0]" />
                                <Input v-model="form.last_name" label="Nom" :icon="UserRound"
                                    :error="errors.last_name?.[0]" />
                                <Input v-model="form.email" type="email" label="E-mail *" :icon="MailIcon"
                                    :error="errors.email?.[0]" class="sm:col-span-2" />
                            </div>

                        </section>

                        <!-- Affectation -->
                        <section class="flex flex-col gap-4 p-6">

                            <div class="flex items-center gap-3">
                                <div
                                    class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-light text-primary">
                                    <Building2Icon class="h-4.5 w-4.5" />
                                </div>
                                <div>
                                    <h5>Affectation</h5>
                                    <p class="text-xs text-text-muted">Poste occupé et rattachement dans l'organisation.
                                    </p>
                                </div>
                                <Loader2 v-if="isLoadingFilters" class="ml-auto h-4 w-4 animate-spin text-text-muted"
                                    aria-label="Chargement des suggestions" />
                            </div>

                            <!-- Les champs restent saisissables pendant le chargement :
                                 les listes ne servent qu'à suggérer des valeurs. -->
                            <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                <Input v-model="form.fonction" label="Fonction *" :icon="Briefcase"
                                list_id="fonction-lists" :lists="fonctions"
                                     :error="errors.fonction?.[0]"
                                    class="sm:col-span-2" />
                                <Input v-model="form.direction" label="Direction *" :icon="Network"
                                    :error="errors.direction?.[0]" />
                                <Input v-model="form.entity" label="Entité *" :icon="Building2Icon"
                                    :error="errors.entity?.[0]" />
                            </div>

                            <p v-if="filtersError" class="text-xs font-medium text-danger">
                                {{ filtersError }}
                            </p>

                        </section>

                    </div>


                    <!-- ========================================================= -->
                    <!-- APERÇU DE LA FICHE -->
                    <!-- ========================================================= -->

                    <aside
                        class="flex flex-col gap-5 rounded-2xl border border-border bg-surface p-6 shadow-sm lg:sticky lg:top-6 lg:col-span-2">

                        <div class="flex flex-col items-center gap-3 text-center">

                            <div
                                class="flex h-16 w-16 items-center justify-center rounded-full bg-primary-light text-xl font-semibold text-primary ring-4 ring-primary/5">
                                <span v-if="initials">{{ initials }}</span>
                                <UserRound v-else class="h-7 w-7" />
                            </div>

                            <div class="min-w-0">
                                <p class="truncate text-base font-semibold"
                                    :class="fullName ? 'text-text-primary' : 'text-text-muted'">
                                    {{ fullName || "Nouveau membre" }}
                                </p>
                                <p class="truncate text-sm"
                                    :class="form.fonction.trim() ? 'text-text-primary' : 'text-text-muted'">
                                    {{ form.fonction.trim() || "Fonction à renseigner" }}
                                </p>
                            </div>

                        </div>

                        <dl class="flex flex-col gap-2.5 rounded-xl bg-background p-4 text-sm">
                            <div class="flex items-center gap-2.5">
                                <MailIcon class="h-4 w-4 shrink-0 text-text-muted" />
                                <dt class="sr-only">E-mail</dt>
                                <dd class="truncate"
                                    :class="form.email.trim() ? 'text-text-primary' : 'text-text-muted'">
                                    {{ form.email.trim() || "Adresse e-mail" }}
                                </dd>
                            </div>
                            <div class="flex items-center gap-2.5">
                                <Network class="h-4 w-4 shrink-0 text-text-muted" />
                                <dt class="sr-only">Direction</dt>
                                <dd class="truncate"
                                    :class="form.direction.trim() ? 'text-text-primary' : 'text-text-muted'">
                                    {{ form.direction.trim() || "Direction" }}
                                </dd>
                            </div>
                            <div class="flex items-center gap-2.5">
                                <Building2Icon class="h-4 w-4 shrink-0 text-text-muted" />
                                <dt class="sr-only">Entité</dt>
                                <dd class="truncate"
                                    :class="form.entity.trim() ? 'text-text-primary' : 'text-text-muted'">
                                    {{ form.entity.trim() || "Entité" }}
                                </dd>
                            </div>
                        </dl>

                        <div class="flex flex-col gap-3 border-t border-border pt-5">

                            <div class="flex items-center justify-between text-xs">
                                <span class="font-medium text-text-muted">Champs obligatoires</span>
                                <span class="font-semibold"
                                    :class="completedCount === checks.length ? 'text-success' : 'text-text-primary'">
                                    {{ completedCount }} / {{ checks.length }}
                                </span>
                            </div>

                            <div class="h-1.5 overflow-hidden rounded-full bg-border">
                                <div class="h-full rounded-full bg-primary transition-[width] duration-300"
                                    :class="{ 'bg-success!': completedCount === checks.length }"
                                    :style="{ width: `${(completedCount / checks.length) * 100}%` }" />
                            </div>

                            <ul class="flex flex-col gap-1">
                                <li v-for="check in checks" :key="check.label" class="flex items-center gap-1.5 text-xs"
                                    :class="check.ok ? 'text-success' : 'text-text-muted'">
                                    <Check v-if="check.ok" class="h-3.5 w-3.5 shrink-0" />
                                    <Circle v-else class="h-3.5 w-3.5 shrink-0" />
                                    {{ check.label }}
                                </li>
                            </ul>

                        </div>

                    </aside>

                </div>


                <!-- ========================================================= -->
                <!-- ACTIONS (barre fixe en bas de page) -->
                <!-- ========================================================= -->

                <div
                    class="sticky bottom-0 z-10 -mx-6 flex flex-col-reverse items-stretch justify-end gap-3 border-t border-border bg-surface/90 px-6 py-4 backdrop-blur sm:flex-row sm:items-center lg:-mx-8 lg:px-8">
                    <Button variant="outline" type="button" :disabled="isBusy" @click="handleCancel">
                        Annuler
                    </Button>
                    <Button variant="outline" type="button" :left-icon="UserPlus" :disabled="isBusy"
                        :loading="isSubmitting && addAnotherMode" @click="handleSubmit(true)">
                        Enregistrer et ajouter un autre
                    </Button>
                    <Button type="submit" :left-icon="isSubmitting && !addAnotherMode ? Loader2 : CheckCircle"
                        :disabled="isBusy" :loading="isSubmitting && !addAnotherMode">
                        {{ isSubmitting && !addAnotherMode ? "Enregistrement..." : "Enregistrer" }}
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
        Check,
        CheckCircle,
        Circle,
        IdCard,
        Loader2,
        MailIcon,
        Network,
        UserPlus,
        UserRound,
    } from '@lucide/vue'

    import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
    import { onBeforeRouteLeave } from 'vue-router'

    import Header from '../../../components/shared/Header.vue'
    import Input from '../../../components/ui/Input.vue'
    import Button from '../../../components/ui/Button.vue'

    import { router } from '../../../router/index.ts'

    import type { PersonnelFormType } from '../../../@types/Personnel.type.ts'
    import personnelService from '../../../core/services/personnel.service.ts'
import jobService from '../../../core/services/job.service.ts'


    /*
    |--------------------------------------------------------------------------
    | FORMULAIRE
    |--------------------------------------------------------------------------
    */

    // id et added_by sont renseignés par l'API (utilisateur connecté)

    type FormErrors = Partial<Record<keyof PersonnelFormType, string[]>>

    const emptyForm = (): PersonnelFormType => ({
        first_name: "",
        last_name: "",
        email: "",
        fonction: "",
        direction: "",
        entity: "",
    })

    const form = ref<PersonnelFormType>(emptyForm())
    const errors = ref<FormErrors>({})

        // Dès qu'un champ est modifié, son message d'erreur disparaît
        ; (Object.keys(form.value) as (keyof PersonnelFormType)[]).forEach(key => {
            watch(() => form.value[key], () => {
                delete errors.value[key]
            })
        })

    const isDirty = computed(() =>
        Object.values(form.value).some(value => (value ?? "").trim() !== "")
    )


    /*
    |--------------------------------------------------------------------------
    | APERÇU & PROGRESSION
    |--------------------------------------------------------------------------
    */

    const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    const fullName = computed(() =>
        `${form.value.first_name} ${form.value.last_name ?? ""}`.trim()
    )

    const initials = computed(() => {
        const first = form.value.first_name.trim()
        const last = (form.value.last_name ?? "").trim()
        if (!first && !last) return ""
        return ((first[0] ?? "") + (last[0] ?? first[1] ?? "")).toUpperCase()
    })

    const checks = computed(() => [
        { label: "Prénom", ok: form.value.first_name.trim() !== "" },
        { label: "E-mail valide", ok: EMAIL_REGEX.test(form.value.email.trim()) },
        { label: "Fonction", ok: form.value.fonction.trim() !== "" },
        { label: "Direction", ok: form.value.direction.trim() !== "" },
        { label: "Entité", ok: form.value.entity.trim() !== "" },
    ])

    const completedCount = computed(() => checks.value.filter(c => c.ok).length)


    /*
    |--------------------------------------------------------------------------
    | VALIDATION
    |--------------------------------------------------------------------------
    */

    function validate(): FormErrors {

        const found: FormErrors = {}

        if (!form.value.first_name.trim()) {
            found.first_name = ["Saisissez le prénom."]
        }

        if (!form.value.email.trim()) {
            found.email = ["Saisissez l'adresse e-mail."]
        } else if (!EMAIL_REGEX.test(form.value.email.trim())) {
            found.email = ["Cette adresse e-mail n'est pas valide."]
        }

        if (!form.value.fonction.trim()) {
            found.fonction = ["Saisissez la fonction."]
        }

        if (!form.value.direction.trim()) {
            found.direction = ["Saisissez la direction."]
        }

        if (!form.value.entity.trim()) {
            found.entity = ["Saisissez l'entité."]
        }

        return found

    }


    /*
    |--------------------------------------------------------------------------
    | LISTES (FONCTIONS / DIRECTIONS / ENTITÉS)
    |--------------------------------------------------------------------------
    */

    const fonctions = ref<string[]>([])
    const directions = ref<string[]>([])
    const entities = ref<string[]>([])
    const isLoadingFilters = ref(false)
    const filtersError = ref("")

 
    /*
    |--------------------------------------------------------------------------
    | SOUMISSION
    |--------------------------------------------------------------------------
    */

    const isSubmitting = ref(false)
    const isSuccess = ref(false)
    const addAnotherMode = ref(false)
    const submitError = ref("")
    const successMessage = ref("")

    // Bloque toute nouvelle action pendant l'envoi et la redirection,
    // pour éviter de créer le même membre deux fois.
    const isBusy = computed(() => isSubmitting.value || isSuccess.value)

    let redirectTimeout: ReturnType<typeof setTimeout> | null = null
    let messageTimeout: ReturnType<typeof setTimeout> | null = null
        

    function  getFilters(){
        jobService.getNames()
        .then(res=>{
            fonctions.value=res.data
        })
        .catch(err=>{
            console.error(err)
        })
    }

    function handleSubmit(addAnother: boolean) {

        if (isBusy.value) return

        submitError.value = ""
        successMessage.value = ""
        errors.value = validate()

        if (Object.keys(errors.value).length > 0) {
            submitError.value = "Corrigez les champs signalés avant d'enregistrer."
            return
        }

        addAnotherMode.value = addAnother
        isSubmitting.value = true

        const payload: PersonnelFormType = {
            first_name: form.value.first_name.trim(),
            last_name: form.value.last_name?.trim() || undefined,
            email: form.value.email.trim().toLowerCase(),
            fonction: form.value.fonction.trim(),
            direction: form.value.direction.trim(),
            entity: form.value.entity.trim(),
        }

        personnelService.store(payload)
            .then(() => {

                if (addAnother) {
                    form.value = emptyForm()
                    errors.value = {}
                    successMessage.value = "Le membre du personnel a été ajouté. Vous pouvez en saisir un autre."
                    messageTimeout = setTimeout(() => { successMessage.value = "" }, 5000)
                    return
                }

                isSuccess.value = true
                successMessage.value = "Le membre du personnel a été ajouté."
                redirectTimeout = setTimeout(() => {
                    router.push({ name: "PERSONNEL" })
                }, 1200)

            })
            .catch(err => {

                if (err?.response?.status === 422) {
                    errors.value = err.response.data?.errors ?? {}
                    submitError.value = "Corrigez les champs signalés avant d'enregistrer."
                } else {
                    submitError.value = "L'enregistrement a échoué. Vérifiez la connexion puis réessayez."
                }

            })
            .finally(() => {
                isSubmitting.value = false
            })

    }

    function handleCancel() {

        if (isBusy.value) return

        // La confirmation en cas de modifications non enregistrées
        // est gérée par onBeforeRouteLeave ci-dessous.
        router.push({ name: "PERSONNEL" })

    }

    onBeforeRouteLeave(() => {

        if (isDirty.value && !isSuccess.value) {
            return window.confirm("Les informations saisies ne sont pas enregistrées. Quitter cette page ?")
        }

    })
    window.onbeforeunload = () => {
        if (isDirty.value && !isSuccess.value) {
            return "Les informations saisies ne sont pas enregistrées. Quitter cette page ?"
        }
    }

    onMounted(() => {
        getFilters()
    })

    onUnmounted(() => {
        if (redirectTimeout) clearTimeout(redirectTimeout)
        if (messageTimeout) clearTimeout(messageTimeout)
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

@media (prefers-reduced-motion: reduce) {

    .banner-enter-active,
    .banner-leave-active {
        transition: none;
    }
}
</style>