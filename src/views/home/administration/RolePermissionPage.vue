<template>
    <div class="min-h-screen bg-background">

        <Header title="Rôle et permissions" :thumbnails="[
            {
                label: 'Tableau de bord',
                name: 'DASHBOARD'
            },
            {
                label: 'Utilisateurs',
                name: 'USERS'
            },
            {
                label: 'Rôle et permissions',
                name: 'ROLE_PERMISSION'
            }
        ]" />

        <div class="p-6 lg:p-8">

            <!-- ========================================================= -->
            <!-- INTRODUCTION -->
            <!-- ========================================================= -->

            <div class="mb-6 space-y-1">
                <h1 class="text-2xl font-bold tracking-tight text-text-primary md:text-3xl">
                    Rôle et permissions
                </h1>
                <p class="text-sm text-text-secondary">
                    Définissez le rôle de l'utilisateur et les actions qu'il est autorisé à effectuer.
                </p>
            </div>


            <!-- ========================================================= -->
            <!-- UTILISATEUR INTROUVABLE -->
            <!-- ========================================================= -->

            <div v-if="!currentUser"
                class="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border bg-surface p-12 text-center">
                <UserX class="h-10 w-10 text-text-muted" />
                <p class="text-sm font-medium text-text-secondary">
                    Utilisateur introuvable.
                </p>
            </div>


            <template v-else>

                <!-- ========================================================= -->
                <!-- CARTE UTILISATEUR -->
                <!-- ========================================================= -->

                <div
                    class="mb-6 flex flex-col gap-4 rounded-2xl border border-border bg-surface p-5 shadow-sm md:flex-row md:items-center md:justify-between">

                    <div class="flex items-center gap-4">

                        <div
                            class="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary-light text-lg font-bold text-primary">
                            {{ userInitials }}
                        </div>

                        <div class="min-w-0">

                            <p class="truncate font-semibold text-text-primary">
                                {{ currentUser.first_name }} {{ currentUser.last_name }}
                            </p>

                            <p class="mt-0.5 flex items-center gap-1.5 truncate text-sm text-text-secondary">
                                <Mail class="h-3.5 w-3.5 shrink-0" />
                                {{ currentUser.email }}
                            </p>

                            <p v-if="currentUser.job || currentUser.department"
                                class="mt-0.5 flex items-center gap-1.5 truncate text-xs text-text-muted">
                                <Briefcase class="h-3.5 w-3.5 shrink-0" />
                                <span v-if="currentUser.job">{{ currentUser.job }}</span>
                                <span v-if="currentUser.job && currentUser.department">·</span>
                                <span v-if="currentUser.department">{{ currentUser.department }}</span>
                            </p>

                        </div>

                    </div>

                    <div class="flex items-center gap-2">

                        <span
                            class="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ring-1"
                            :class="currentUser.status === 'ENABLED'
                                ? 'bg-success/10 text-success ring-success/20'
                                : 'bg-danger/10 text-danger ring-danger/20'">
                            <span class="h-1.5 w-1.5 rounded-full"
                                :class="currentUser.status === 'ENABLED' ? 'bg-success' : 'bg-danger'"></span>
                            {{ currentUser.status === 'ENABLED' ? 'Actif' : 'Désactivé' }}
                        </span>

                        <span
                            class="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ring-1"
                            :class="currentUser.role === 'ADMIN'
                                ? 'bg-accent-dark/10 text-accent-dark ring-accent-dark/20'
                                : 'bg-surface-alt text-text-secondary ring-border'">
                            {{ currentUser.role === 'ADMIN' ? 'Administrateur' : 'Utilisateur' }}
                        </span>

                    </div>

                </div>


                <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">

                    <!-- ========================================================= -->
                    <!-- ROLE -->
                    <!-- ========================================================= -->

                    <div class="lg:col-span-1">

                        <h2 class="text-base font-semibold text-text-primary">
                            Rôle
                        </h2>

                        <p class="mt-1 text-sm text-text-secondary">
                            Le rôle détermine le niveau d'accès général de l'utilisateur.
                        </p>

                        <div class="mt-4 space-y-3">

                            <!-- USER -->

                            <button type="button" @click="selectedRole = 'USER'"
                                class="w-full rounded-2xl border p-4 text-left transition-all" :class="selectedRole === 'USER'
                                    ? 'border-primary bg-primary-light/60 ring-1 ring-primary/30'
                                    : 'border-border bg-surface hover:bg-surface-alt'">

                                <div class="flex items-start gap-3">

                                    <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                                        :class="selectedRole === 'USER' ? 'bg-primary text-white' : 'bg-surface-alt text-text-secondary'">
                                        <UserRound class="h-5 w-5" />
                                    </div>

                                    <div class="min-w-0 flex-1">

                                        <div class="flex items-center justify-between gap-2">
                                            <p class="font-semibold text-text-primary">
                                                Utilisateur
                                            </p>
                                            <CheckCircle2 v-if="selectedRole === 'USER'"
                                                class="h-5 w-5 shrink-0 text-primary" />
                                        </div>

                                        <p class="mt-1 text-sm text-text-secondary">
                                            Accès standard. Les permissions sont attribuées individuellement
                                            ci-contre.
                                        </p>

                                    </div>

                                </div>

                            </button>


                            <!-- ADMIN -->

                            <button type="button" @click="selectedRole = 'ADMIN'"
                                class="w-full rounded-2xl border p-4 text-left transition-all" :class="selectedRole === 'ADMIN'
                                    ? 'border-accent-dark bg-accent-dark/5 ring-1 ring-accent-dark/30'
                                    : 'border-border bg-surface hover:bg-surface-alt'">

                                <div class="flex items-start gap-3">

                                    <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                                        :class="selectedRole === 'ADMIN' ? 'bg-accent-dark text-white' : 'bg-surface-alt text-text-secondary'">
                                        <ShieldCheck class="h-5 w-5" />
                                    </div>

                                    <div class="min-w-0 flex-1">

                                        <div class="flex items-center justify-between gap-2">
                                            <p class="font-semibold text-text-primary">
                                                Administrateur
                                            </p>
                                            <CheckCircle2 v-if="selectedRole === 'ADMIN'"
                                                class="h-5 w-5 shrink-0 text-accent-dark" />
                                        </div>

                                        <p class="mt-1 text-sm text-text-secondary">
                                            Accès complet à la plateforme, y compris la gestion des utilisateurs et
                                            des permissions.
                                        </p>

                                    </div>

                                </div>

                            </button>

                        </div>

                    </div>


                    <!-- ========================================================= -->
                    <!-- PERMISSIONS -->
                    <!-- ========================================================= -->

                    <div class="lg:col-span-2">

                        <h2 class="text-base font-semibold text-text-primary">
                            Permissions
                        </h2>

                        <p class="mt-1 text-sm text-text-secondary">
                            Actions que l'utilisateur est autorisé à effectuer sur les comptes utilisateurs.
                        </p>

                        <div v-if="selectedRole === 'ADMIN'"
                            class="mt-4 flex items-start gap-3 rounded-xl border border-accent-dark/20 bg-accent-dark/5 p-4 text-sm text-accent-dark">
                            <ShieldCheck class="mt-0.5 h-5 w-5 shrink-0" />
                            <p>
                                Le rôle Administrateur inclut automatiquement toutes les permissions ci-dessous.
                                Elles ne sont pas modifiables individuellement.
                            </p>
                        </div>

                        <div
                            class="mt-4 divide-y divide-border overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">

                            <div v-for="name in ALL_PERMISSIONS" :key="name"
                                class="flex items-center justify-between gap-4 p-4 transition-opacity"
                                :class="!canTogglePermissions ? 'opacity-70' : ''">

                                <div class="flex min-w-0 items-center gap-3">

                                    <div
                                        class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface-alt text-text-secondary">
                                        <component :is="permissionMeta[name as PermissionNameType].icon" class="h-5 w-5" />
                                    </div>

                                    <div class="min-w-0">
                                        <p class="font-medium text-text-primary">
                                            {{ permissionMeta[name as PermissionNameType].label }}
                                        </p>
                                        <p class="mt-0.5 text-sm text-text-secondary">
                                            {{ permissionMeta[name as PermissionNameType].description }}
                                        </p>
                                    </div>

                                </div>

                                <button type="button" role="switch" :aria-checked="isPermissionChecked(name as PermissionNameType)"
                                    :disabled="!canTogglePermissions" @click="togglePermission(name as PermissionNameType)"
                                    class="relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors"
                                    :class="[
                                        isPermissionChecked(name as PermissionNameType) ? 'bg-primary' : 'bg-surface-alt',
                                        canTogglePermissions ? 'cursor-pointer' : 'cursor-not-allowed'
                                    ]">
                                    <span
                                        class="inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform"
                                        :class="isPermissionChecked(name as PermissionNameType) ? 'translate-x-6' : 'translate-x-1'"></span>
                                </button>

                            </div>

                        </div>

                    </div>

                </div>


                <!-- ========================================================= -->
                <!-- ACTIONS -->
                <!-- ========================================================= -->

                <div class="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

                    <button type="button" :disabled="!hasChanges" @click="resetChanges"
                        class="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-surface px-5 py-2.5 text-sm font-semibold shadow-sm transition-all duration-200"
                        :class="hasChanges
                            ? 'text-text-secondary hover:-translate-y-0.5 hover:bg-surface-alt hover:shadow-md'
                            : 'cursor-not-allowed text-text-muted'">
                        <RotateCcw class="h-4 w-4" />
                        Annuler les modifications
                    </button>

                    <button type="button" :disabled="!hasChanges" @click="saveChanges"
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
                            Modifications enregistrées
                        </p>
                        <p class="mt-1 text-sm text-text-secondary">
                            {{ successMessage }}
                        </p>
                    </div>

                    <button type="button" @click="successMessage = ''"
                        class="ml-2 text-text-muted hover:text-text-secondary">
                        <X class="h-4 w-4" />
                    </button>

                </div>

            </template>

        </div>

    </div>
</template>

<script setup lang="ts">

    import {
        Briefcase,
        CheckCircle2,
        Eye,
        Mail,
        Pencil,
        RotateCcw,
        Save,
        ShieldCheck,
        Trash2,
        UserPlus,
        UserRound,
        UserX,
        X
    } from "@lucide/vue"

    import { computed, ref, watch } from "vue"

    import Header from "../../../components/shared/Header.vue"

    import { router } from "../../../router"

    import type {
        PermissionNameType,
        UserDataType
    } from "../../../@types/User.type.ts"


    /*
    |--------------------------------------------------------------------------
    | PERMISSIONS DISPONIBLES
    |--------------------------------------------------------------------------
    */

    // const ALL_PERMISSIONS: PermissionNameType[] = [
    const ALL_PERMISSIONS = [
        "USER_CREATE",
        "USER_READ",
        "USER_UPDATE",
        "USER_DELETE"
    ]

    const permissionMeta: Record<PermissionNameType, { label: string, description: string, icon: any }> = {
        USER_CREATE: {
            label: "Créer des utilisateurs",
            description: "Ajouter de nouveaux comptes utilisateurs.",
            icon: UserPlus
        },
        USER_READ: {
            label: "Consulter les utilisateurs",
            description: "Voir la liste et les détails des comptes.",
            icon: Eye
        },
        USER_UPDATE: {
            label: "Modifier les utilisateurs",
            description: "Mettre à jour les informations d'un compte existant.",
            icon: Pencil
        },
        USER_DELETE: {
            label: "Supprimer des utilisateurs",
            description: "Supprimer définitivement un compte utilisateur.",
            icon: Trash2
        }
    }


    /*
    |--------------------------------------------------------------------------
    | DONNEES UTILISATEUR
    |--------------------------------------------------------------------------
    |
    | Placeholder en attendant l'API. À remplacer par un appel au service
    | utilisateur (ex: fetch de /users/:id) une fois disponible.
    |
    */

    const users = ref<UserDataType[]>([

        {
            id: 1,
            first_name: "Mialy",
            last_name: "Rakoto",
            email: "mialy.rakoto@galana.mg",
            department: "HSSE",
            job: "Coordinatrice HSSE",
            status: "ENABLED",
            role: "USER",
            permissions: [
                { name: "USER_READ", created_at: "2026-01-10", updated_at: "2026-01-10" },
                { name: "USER_UPDATE", created_at: "2026-01-10", updated_at: "2026-02-02" }
            ]
        },

        {
            id: 2,
            first_name: "Tojo",
            last_name: "Andria",
            email: "tojo.andria@galana.mg",
            department: "Informatique",
            job: "Administrateur système",
            status: "ENABLED",
            role: "ADMIN",
            permissions: [
                { name: "USER_CREATE", created_at: "2025-11-02", updated_at: "2025-11-02" },
                { name: "USER_READ", created_at: "2025-11-02", updated_at: "2025-11-02" },
                { name: "USER_UPDATE", created_at: "2025-11-02", updated_at: "2025-11-02" },
                { name: "USER_DELETE", created_at: "2025-11-02", updated_at: "2025-11-02" }
            ]
        }

    ])


    /*
    |--------------------------------------------------------------------------
    | UTILISATEUR COURANT
    |--------------------------------------------------------------------------
    */

    const currentUser = computed(() => {

        const routeId = router.currentRoute.value.params.id

        if (!routeId) {
            return users.value[0] ?? null
        }

        return users.value.find(
            user => String(user.id) === String(routeId)
        ) ?? null

    })

    const userInitials = computed(() => {

        if (!currentUser.value) return ""

        const first = currentUser.value.first_name?.[0] ?? ""
        const last = currentUser.value.last_name?.[0] ?? ""

        return `${first}${last}`.toUpperCase()

    })


    /*
    |--------------------------------------------------------------------------
    | SELECTION EN COURS
    |--------------------------------------------------------------------------
    */

    const selectedRole = ref<UserDataType["role"]>("USER")
    const selectedPermissions = ref<Set<PermissionNameType>>(new Set())
    const successMessage = ref("")

    function loadCurrentUserState() {

        if (!currentUser.value) return

        selectedRole.value = currentUser.value.role

        selectedPermissions.value = new Set(
            (currentUser.value.permissions ?? []).map(permission => permission.name)
        )

    }

    watch(currentUser, loadCurrentUserState, { immediate: true })


    /*
    |--------------------------------------------------------------------------
    | PERMISSIONS EFFECTIVES
    |--------------------------------------------------------------------------
    |
    | Un administrateur possède implicitement toutes les permissions.
    |
    */

    const canTogglePermissions = computed(() => selectedRole.value === "USER")

    const effectivePermissions = computed<PermissionNameType[]>(
        () => {

        if (selectedRole.value === "ADMIN") {
            return [...ALL_PERMISSIONS] as PermissionNameType[]
        }

        return ALL_PERMISSIONS.filter(
            name => selectedPermissions.value.has(name as PermissionNameType)
        ) as PermissionNameType[]

    })

    function isPermissionChecked(name: PermissionNameType) {
        return effectivePermissions.value.includes(name)
    }

    function togglePermission(name: PermissionNameType) {

        if (!canTogglePermissions.value) return

        const next = new Set(selectedPermissions.value)

        if (next.has(name)) {
            next.delete(name)
        } else {
            next.add(name)
        }

        selectedPermissions.value = next

    }


    /*
    |--------------------------------------------------------------------------
    | CHANGEMENTS
    |--------------------------------------------------------------------------
    */

    const hasChanges = computed(() => {

        if (!currentUser.value) return false

        if (selectedRole.value !== currentUser.value.role) return true

        const original = new Set(
            (currentUser.value.permissions ?? []).map(permission => permission.name)
        )

        const current = new Set(effectivePermissions.value)

        if (original.size !== current.size) return true

        for (const name of original) {
            if (!current.has(name)) return true
        }

        return false

    })

    function resetChanges() {
        loadCurrentUserState()
    }


    /*
    |--------------------------------------------------------------------------
    | ENREGISTRER
    |--------------------------------------------------------------------------
    |
    | Pour le moment, aucune API : la mise à jour reste locale.
    |
    */

    function saveChanges() {

        if (!currentUser.value || !hasChanges.value) return

        const today = new Date().toISOString().slice(0, 10)

        const originalPermissions = currentUser.value.permissions ?? []

        currentUser.value.role = selectedRole.value

        currentUser.value.permissions = effectivePermissions.value.map(name => {

            const existing = originalPermissions.find(
                permission => permission.name === name
            )

            return {
                name,
                created_at: existing?.created_at ?? today,
                updated_at: today
            }

        })

        successMessage.value =
            `Le rôle et les permissions de ${currentUser.value.first_name} ont été mis à jour.`

    }

</script>