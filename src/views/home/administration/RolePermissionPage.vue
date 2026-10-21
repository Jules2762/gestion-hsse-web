<template>
    <div class="min-h-screen bg-white">

        <Header title="administration.roles.title" :thumbnails="[
            {
                label: 'thumbnails.home',
                name: 'DASHBOARD'
            },
            {
                label: 'thumbnails.users',
                name: 'USERS'
            },
            {
                label: 'thumbnails.roles',
                name: 'ROLE_PERMISSION'
            }
        ]" />

        <div class="p-6 lg:p-8">
            <!-- ========================================================= -->
            <!-- INTRODUCTION -->
            <!-- ========================================================= -->

            <!-- <div class="mb-6 space-y-1">
                <h1 class="text-2xl font-bold tracking-tight text-text-primary md:text-3xl">
                    Rôle et permissions
                </h1>
                <p class="text-sm text-text-secondary">
                    Définissez le rôle de l'utilisateur et les actions qu'il est autorisé à effectuer.
                </p>
            </div> -->


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
                    class="mb-6 flex flex-col gap-4 rounded-2xl  p-5 border border-gray-200 md:flex-row md:items-center md:justify-between">

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
                            {{ currentUser.status === 'ENABLED' ? (locale === 'en' ? 'Active' : 'Actif') : (locale === 'en' ? 'Disabled' : 'Désactivé') }}
                        </span>

                        <span
                            class="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ring-1"
                            :class="currentUser.role === 'ADMIN'
                                ? 'bg-accent-dark/10 text-accent-dark ring-accent-dark/20'
                                : 'bg-surface-alt text-text-secondary ring-border'">
                            {{ currentUser.role === 'ADMIN' ? (locale === 'en' ? 'Administrator' : 'Administrateur') : (locale === 'en' ? 'User' : 'Utilisateur') }}
                        </span>

                    </div>

                </div>
                <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">

                    <!-- ========================================================= -->
                    <!-- ROLE -->
                    <!-- ========================================================= -->

                    <div class="lg:col-span-1 self-start bg-white p-4 rounded sticky top-5">
                        <div class="flex flex-row items-center justify-between w-full">
                            <h2 class="text-base font-semibold text-text-primary">
                                {{ locale === 'en' ? 'Role' : 'Rôle' }}
                            </h2>
                            <button type="button" @click="openRoleModal" v-if="my_info?.id!=currentUser.id"
                                class="text-text-muted transition-colors hover:text-text-primary cursor-pointer">
                                <Edit2 :size="20" />
                            </button>
                        </div>
                        <p class="mt-1 text-sm text-text-secondary">
                            {{ locale === 'en' ? 'The role determines the general access level of the user.' : 'Le rôle détermine le niveau d\'accès général de l\'utilisateur.' }}
                        </p>

                        <div class="mt-4 space-y-3">

                            <div
                                class="w-full rounded-2xl border border-primary bg-primary-light/60 p-4 text-left ring-1 ring-primary/30">
                                <div class="flex items-start gap-3">

                                    <div
                                        class="flex h-10 w-10 shrink-0 items-center bg-primary text-white justify-center rounded-xl">
                                        <UserRound class="h-5 w-5" />
                                    </div>

                                    <div class="min-w-0 flex-1">

                                        <div class="flex items-center justify-between gap-2">
                                            <p class="font-semibold text-text-primary">
                                                {{ currentUser?.role === 'ADMIN' ? (locale === 'en' ? 'Administrator' : 'Administrateur') : (locale === 'en' ? 'User' : 'Utilisateur') }}
                                            </p>
                                            <CheckCircle2 class="h-5 w-5 shrink-0 text-primary" />
                                        </div>

                                        <p class="mt-1 text-sm text-text-secondary">
                                            {{ currentRoleMeta?.description }}
                                        </p>

                                    </div>

                                </div>
                            </div>

                        </div>

                    </div>


                    <!-- ========================================================= -->
                    <!-- PERMISSIONS -->
                    <!-- ========================================================= -->

                    <div class="lg:col-span-2">

                        <div class="flex w-full flex-row items-center justify-between">
                            <div>
                                <h2 class="text-base font-semibold text-text-primary">
                                    {{ locale === 'en' ? 'Permissions' : 'Permissions' }}
                                </h2>
                                <p class="mt-1 text-sm text-text-secondary">
                                    {{ locale === 'en' ? 'Actions that the user is authorized to perform on user accounts.' : 'Actions que l\'utilisateur est autorisé à effectuer sur les comptes utilisateurs.' }}
                                </p>
                            </div>
                            <button v-if="my_info?.id != currentUser.id" type="button" @click="openPermissionsModal"
                                class="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-dark cursor-pointer">
                                <Pencil class="h-4 w-4" />
                                {{ locale === 'en' ? 'Manage' : 'Gérer' }}
                            </button>
                        </div>

                        <div v-if="currentUser.role === 'ADMIN'"
                            class="mt-4 flex items-center gap-2 rounded-2xl border border-accent-dark/20 bg-accent-dark/5 p-4 text-sm text-accent-dark">
                            <ShieldCheck class="h-4 w-4 shrink-0" />
                            {{ locale === 'en' ? 'This user is an administrator: they have all permissions.' : 'Cet utilisateur est administrateur : il dispose de toutes les permissions.' }}
                        </div>

                        <div v-else-if="permissions.length === 0"
                            class="mt-4 flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border bg-surface p-8 text-center">
                            <ShieldOff class="h-8 w-8 text-text-muted" />
                            <p class="text-sm text-text-secondary">
                                {{ locale === 'en' ? 'No permissions assigned at the moment.' : 'Aucune permission assignée pour le moment.' }}
                            </p>
                        </div>

                        <div v-else class="mt-4 flex flex-wrap gap-2">
                            <span v-for="name in permissions" :key="name"
                                class="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 text-sm text-text-primary">
                                {{ name }}
                            </span>
                        </div>

                    </div>

                </div>


            </template>

        </div>


        <!-- ========================================================= -->
        <!-- MESSAGE DE SUCCES -->
        <!-- ========================================================= -->

        <Transition name="toast">
            <div v-if="successMessage"
                class="fixed right-6 top-6 z-50 flex max-w-sm items-start gap-3 rounded-2xl border border-status-success/20 bg-surface p-4 shadow-2xl ring-1 ring-status-success/5">

                <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-light">
                    <CheckCircle2 class="h-5 w-5 text-success" />
                </div>

                <div>
                    <p class="font-semibold text-text-primary">
                        {{ locale === 'en' ? 'Role updated' : 'Rôle mis à jour' }}
                    </p>
                    <p class="mt-1 text-sm text-text-secondary">
                        {{ successMessage }}
                    </p>
                </div>

                <button type="button" @click="successMessage = ''"
                    class="ml-2 text-text-muted hover:text-text-secondary cursor-pointer">
                    <X class="h-4 w-4" />
                </button>

            </div>
        </Transition>


        <!-- ========================================================= -->
        <!-- MODALE : MODIFICATION DU RÔLE -->
        <!-- ========================================================= -->

        <Teleport to="body">
            <Transition name="modal-fade">
                <div v-if="isRoleModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">

                    <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="closeRoleModal"></div>

                    <div
                        class="relative flex max-h-[85vh] w-full max-w-md flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">

                        <div class="flex items-start justify-between gap-4 border-b border-border p-5">
                            <div>
                                <h3 class="text-lg font-semibold text-text-primary">
                                    {{ locale === 'en' ? 'Edit role' : 'Modifier le rôle' }}
                                </h3>
                                <p class="mt-0.5 text-sm text-text-secondary">
                                    {{ locale === 'en' ? `Choose the access level for ${currentUser?.first_name}.` : `Choisissez le niveau d'accès de ${currentUser?.first_name}.` }}
                                </p>
                            </div>
                            <button type="button" @click="closeRoleModal"
                                class="shrink-0 text-text-muted hover:text-text-secondary cursor-pointer">
                                <X class="h-5 w-5" />
                            </button>
                        </div>

                        <div v-if="roleError"
                            class="mx-5 mt-4 flex items-center gap-2 rounded-xl border border-danger/30 bg-danger/10 p-3 text-sm text-danger">
                            <CircleAlert class="h-4 w-4 shrink-0" />
                            {{ roleError }}
                        </div>

                        <div class="flex-1 space-y-3 overflow-y-auto p-5">

                            <button v-for="roleOption in UserRoleMeta" :key="roleOption.value" type="button"
                                @click="modalSelectedRole = roleOption.value as UserRoleType"
                                class="w-full rounded-2xl border p-4 text-left transition-all cursor-pointer" :class="modalSelectedRole === roleOption.value
                                    ? 'border-primary bg-primary-light/60 ring-1 ring-primary/30'
                                    : 'border-border bg-white hover:border-primary/40 hover:bg-primary-light/20'">

                                <div class="flex items-start gap-3">

                                    <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl" :class="modalSelectedRole === roleOption.value
                                        ? 'bg-primary text-white'
                                        : 'bg-surface-alt text-text-secondary'">
                                        <UserRound class="h-5 w-5" />
                                    </div>

                                    <div class="min-w-0 flex-1">

                                        <div class="flex items-center justify-between gap-2">
                                            <p class="font-semibold text-text-primary">
                                                {{ roleOption.value === 'ADMIN' ? (locale === 'en' ? 'Administrator' : 'Administrateur') : (locale === 'en' ? 'User' : 'Utilisateur') }}
                                            </p>
                                            <CheckCircle2 v-if="modalSelectedRole === roleOption.value"
                                                class="h-5 w-5 shrink-0 text-primary" />
                                        </div>

                                        <p class="mt-1 text-sm text-text-secondary">
                                            {{ roleOption.description }}
                                        </p>

                                    </div>

                                </div>

                            </button>

                        </div>

                        <div class="flex flex-col-reverse gap-3 border-t border-border p-5 sm:flex-row sm:justify-end">
                            <button type="button" :disabled="isSavingRole" @click="closeRoleModal"
                                class="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-surface px-5 py-2.5 text-sm font-semibold text-text-secondary shadow-sm transition-colors hover:bg-surface-alt disabled:opacity-60 cursor-pointer">
                                {{ locale === 'en' ? 'Cancel' : 'Annuler' }}
                            </button>
                            <button type="button" :disabled="isSavingRole || modalSelectedRole === currentUser?.role"
                                @click="saveRoleModal"
                                class="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-dark disabled:opacity-60 cursor-pointer">
                                <Loader2 v-if="isSavingRole" class="h-4 w-4 animate-spin" />
                                <Save v-else class="h-4 w-4" />
                                {{ isSavingRole ? (locale === 'en' ? "Saving..." : "Enregistrement...") : (locale === 'en' ? "Save" : "Enregistrer") }}
                            </button>
                        </div>

                    </div>

                </div>
            </Transition>
        </Teleport>


        <!-- ========================================================= -->
        <!-- MODALE : GESTION DES PERMISSIONS (DRAG & DROP) -->
        <!-- ========================================================= -->

        <Teleport to="body">
            <Transition name="modal-fade">
                <div v-if="isPermissionsModalOpen" class="fixed  inset-0 z-50 flex items-center justify-center p-4">

                    <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="closePermissionsModal"></div>

                    <div
                        class="relative flex max-h-[85vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">

                        <div class="flex items-start justify-between gap-4 border-b border-border p-5">
                            <div>
                                <h3 class="text-lg font-semibold text-text-primary">
                                    {{ locale === 'en' ? 'Manage permissions' : 'Gérer les permissions' }}
                                </h3>
                                <p class="mt-0.5 text-sm text-text-secondary">
                                    {{ locale === 'en' ? 'Drag a permission from one column to another, or use the arrows.' : 'Glissez une permission d\'une colonne à l\'autre, ou utilisez les flèches.' }}
                                </p>
                            </div>
                            <button type="button" @click="closePermissionsModal"
                                class="shrink-0 text-text-muted hover:text-text-secondary cursor-pointer">
                                <X class="h-5 w-5" />
                            </button>
                        </div>

                        <div v-if="permissionsError"
                            class="mx-5 mt-4 flex items-center gap-2 rounded-xl border border-danger/30 bg-danger/10 p-3 text-sm text-danger">
                            <CircleAlert class="h-4 w-4 shrink-0" />
                            {{ permissionsError }}
                        </div>

                        <div class="grid flex-1 grid-cols-1 gap-4 overflow-y-auto p-5 sm:grid-cols-2">

                            <!-- ASSIGNÉES (GAUCHE) -->
                            <div class="flex min-h-0 self-start sticky top-0 flex-col  gap-2">
                                <p class="text-xs font-medium text-text-muted">
                                    {{ locale === 'en' ? `Permissions of ${currentUser?.first_name} (${modalAssigned.length})` : `Permissions de ${currentUser?.first_name} (${modalAssigned.length})` }}
                                </p>
                                <div class="w-full">
                                    <InputFilter :icon="Search" v-model="search_left_permission" />
                                </div>
                                <div class="flex min-h-[220px] flex-col gap-2 rounded-2xl border-2 border-dashed p-3 transition-colors"
                                    :class="dragOverZone === 'assigned' ? 'border-primary bg-primary-light/40' : 'border-border bg-surface'"
                                    @dragover.prevent="dragOverZone = 'assigned'" @dragleave="dragOverZone = null"
                                    @drop.prevent="handleDrop('assigned')">

                                    <p v-if="modalAssigned.length === 0" class="m-auto text-sm text-text-muted">
                                        {{ locale === 'en' ? 'Drop a permission here' : 'Déposez une permission ici' }}
                                    </p>

                                    <div v-for="name in modalAssigned.filter(item=>item.toLowerCase().includes(search_left_permission.toLowerCase()))" :key="name" draggable="true"
                                        @dragstart="onDragStart(name, 'assigned', $event)"
                                        @dragend="dragOverZone = null"
                                        class="flex cursor-grab items-center gap-2 rounded-xl border border-border bg-white p-3 text-sm shadow-sm transition-shadow hover:shadow-md active:cursor-grabbing">
                                        <GripVertical class="h-4 w-4 shrink-0 text-text-muted" />
                                        <span class="flex-1 text-text-primary">
                                            {{ name }}
                                        </span>
                                        <button type="button" @click="moveToAvailable(name)"
                                            class="shrink-0 rounded-lg p-1 text-text-muted hover:bg-surface-alt hover:text-danger cursor-pointer">
                                            <ChevronRight class="h-4 w-4" />
                                        </button>
                                    </div>

                                </div>
                            </div>

                            <!-- DISPONIBLES (DROITE) -->
                            <div class="flex min-h-0 flex-col sticky top-0 self-start gap-2">
                                <p class="text-xs font-medium text-text-muted">
                                    {{ locale === 'en' ? `Available permissions (${modalAvailable.length})` : `Permissions disponibles (${modalAvailable.length})` }}
                                </p>
                                <div class="w-full">
                                    <InputFilter :icon="Search"  v-model="search_right_permission"/>
                                </div>
                                <div class="flex min-h-[220px] flex-col gap-2 rounded-2xl border-2 border-dashed p-3 transition-colors"
                                    :class="dragOverZone === 'available' ? 'border-primary bg-primary-light/40' : 'border-border bg-surface'"
                                    @dragover.prevent="dragOverZone = 'available'" @dragleave="dragOverZone = null"
                                    @drop.prevent="handleDrop('available')">

                                    <p v-if="modalAvailable.length === 0" class="m-auto text-sm text-text-muted">
                                        {{ locale === 'en' ? 'All permissions are assigned' : 'Toutes les permissions sont assignées' }}
                                    </p>

                                    <div v-for="name in modalAvailable.filter(item => item.toLowerCase().includes(search_right_permission.toLowerCase()))" :key="name" draggable="true"
                                        @dragstart="onDragStart(name, 'available', $event)"
                                        @dragend="dragOverZone = null"
                                        class="flex cursor-grab items-center gap-2 rounded-xl border border-border bg-white p-3 text-sm shadow-sm transition-shadow hover:shadow-md active:cursor-grabbing">
                                        <button type="button" @click="moveToAssigned(name)"
                                            class="shrink-0 rounded-lg p-1 text-text-muted hover:bg-surface-alt hover:text-primary cursor-pointer">
                                            <ChevronLeft class="h-4 w-4" />
                                        </button>
                                        <span class="flex-1 text-text-primary">
                                            {{ name}}
                                        </span>
                                        <GripVertical class="h-4 w-4 shrink-0 text-text-muted" />
                                    </div>

                                </div>
                            </div>

                        </div>

                        <div class="flex flex-col-reverse gap-3 border-t border-border p-5 sm:flex-row sm:justify-end">
                            <button type="button" :disabled="isSavingPermissions" @click="closePermissionsModal"
                                class="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-surface px-5 py-2.5 text-sm font-semibold text-text-secondary shadow-sm transition-colors hover:bg-surface-alt disabled:opacity-60 cursor-pointer">
                                {{ locale === 'en' ? 'Cancel' : 'Annuler' }}
                            </button>
                            <button type="button" :disabled="isSavingPermissions" @click="savePermissionsModal"
                                class="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-dark disabled:opacity-60 cursor-pointer">
                                <Loader2 v-if="isSavingPermissions" class="h-4 w-4 animate-spin" />
                                <Save v-else class="h-4 w-4" />
                                {{ isSavingPermissions ? (locale === 'en' ? "Saving..." : "Enregistrement...") : (locale === 'en' ? "Save" : "Enregistrer") }}
                            </button>
                        </div>

                    </div>

                </div>
            </Transition>
        </Teleport>

    </div>
</template>

<script setup lang="ts">

    import {
        Briefcase,
        CheckCircle2,
        ChevronLeft,
        ChevronRight,
        CircleAlert,
        Edit2,
        GripVertical,
        Loader2,
        Mail,
        Pencil,
        Save,
        Search,
        ShieldCheck,
        ShieldOff,
        UserRound,
        UserX,
        X
    } from "@lucide/vue"
    import { computed, onMounted, onUnmounted, ref, watch } from "vue"
    import { useI18n } from "vue-i18n"
    import Header from "../../../components/shared/Header.vue"
    import type {
        UserDataType,
        UserRoleType
    } from "../../../@types/User.type.ts"
    import { useRoute } from "vue-router"
    import { useUserService } from "../../../core/services/user.service.ts"
    import { UserRoleDataJson, UserRoleMeta } from "../../../@data/User.data.ts"
    import { AxiosError } from "axios"
    import InputFilter from "../../../components/ui/InputFilter.vue"

    const { t, locale } = useI18n()

  

    /*
    |--------------------------------------------------------------------------
    | UTILISATEUR COURANT
    |--------------------------------------------------------------------------
    */

    const currentUser = ref<UserDataType>()
    const permissions = ref<string[]>([])
    const my_info = ref<UserDataType>()
        const search_left_permission=ref<string>('')
        const search_right_permission=ref<string>('')
    const userInitials = computed(() => {

        if (!currentUser.value) return ""

        const first = currentUser.value.first_name?.[0] ?? ""
        const last = currentUser.value.last_name?.[0] ?? ""

        return `${first}${last}`.toUpperCase()

    })


    /*
    |--------------------------------------------------------------------------
    | ROLE ACTUEL
    |--------------------------------------------------------------------------
    */

    const successMessage = ref("")

    const currentRoleMeta = computed(() =>
        UserRoleMeta.find(item => item.value === currentUser.value?.role)
    )

    const route = useRoute()
    const userService = useUserService()

    function fetchData() {
        const user_id = route.params?.id
        userService.show(user_id as string | number)
            .then(res => {
                console.log(res.data)
                currentUser.value = res.data
            })
            .catch(err => {
                console.error(err)
            })

    }

    function fetchPermissions() {
        const user_id = route.params?.id
        userService.getPermissions(user_id as string)
            .then(res => {
                permissions.value = res.data
            })
            .catch(err => {
                console.error(err)
            })
    }


    /*
    |--------------------------------------------------------------------------
    | MODALE DE MODIFICATION DU RÔLE
    |--------------------------------------------------------------------------
    */

    const isRoleModalOpen = ref(false)
    const modalSelectedRole = ref<UserDataType["role"]>("USER")
    const isSavingRole = ref(false)
    const roleError = ref("")

    function openRoleModal() {

        if (!currentUser.value) return

        modalSelectedRole.value = currentUser.value.role
        roleError.value = ""

        isRoleModalOpen.value = true

    }

    function closeRoleModal() {

        if (isSavingRole.value) return

        isRoleModalOpen.value = false

    }

    function saveRoleModal() {

        if (!currentUser.value) return

        if (modalSelectedRole.value === currentUser.value.role) {
            isRoleModalOpen.value = false
            return
        }

        isSavingRole.value = true
        roleError.value = ""

        const user_id = route.params?.id
        const newRole = modalSelectedRole.value

        // NOTE : hypothèse sur le nom de la méthode du service. À adapter si
        // `useUserService()` expose un autre nom (ex: `updateUser`, `changeRole`...).
        console.log(newRole)
        userService.updateRole(user_id as string, newRole)
            .then(() => {

                if (currentUser.value) {
                    currentUser.value.role = newRole
                }

                successMessage.value =
                    `Le rôle de ${currentUser.value?.first_name} a été mis à jour.`

                isRoleModalOpen.value = false

            })
            .catch((err:AxiosError) => {
                console.error(err)
                roleError.value =
                    "Impossible de mettre à jour le rôle. Veuillez réessayer."
            })
            .finally(() => {
                isSavingRole.value = false
            })

    }


    /*
    |--------------------------------------------------------------------------
    | MODALE DE GESTION DES PERMISSIONS (DRAG & DROP)
    |--------------------------------------------------------------------------
    |
    | La modale travaille sur des copies locales (modalAssigned / modalAvailable)
    | et ne touche `permissions` qu'une fois l'enregistrement confirmé.
    |
    */

    const isPermissionsModalOpen = ref(false)
    const modalAssigned = ref<string[]>([])
    const modalAvailable = ref<string[]>([])
    const ALL_PERMISSIONS=ref<string[]>([])
    const dragOverZone = ref<"assigned" | "available" | null>(null)
    const isSavingPermissions = ref(false)
    const permissionsError = ref("")

    let draggedPermission: { name: string; from: "assigned" | "available" } | null = null

    function openPermissionsModal() {

        modalAssigned.value = [...permissions.value]
        modalAvailable.value = ALL_PERMISSIONS.value.filter(
            name => !permissions.value.includes(name)
        )
        permissionsError.value = ""

        isPermissionsModalOpen.value = true

    }

    function closePermissionsModal() {

        if (isSavingPermissions.value) return

        isPermissionsModalOpen.value = false

    }

    function moveToAssigned(name: string) {

        modalAvailable.value = modalAvailable.value.filter(item => item !== name)

        if (!modalAssigned.value.includes(name)) {
            modalAssigned.value.push(name)
        }

    }

    function moveToAvailable(name: string) {

        modalAssigned.value = modalAssigned.value.filter(item => item !== name)

        if (!modalAvailable.value.includes(name)) {
            modalAvailable.value.push(name)
        }

    }

    function onDragStart(name: string, from: "assigned" | "available", event: DragEvent) {

        draggedPermission = { name, from }

        if (event.dataTransfer) {
            event.dataTransfer.setData("text/plain", name)
            event.dataTransfer.effectAllowed = "move"
        }

    }

    function handleDrop(target: "assigned" | "available") {

        dragOverZone.value = null

        if (!draggedPermission) return

        const { name, from } = draggedPermission

        if (from !== target) {
            if (target === "assigned") {
                moveToAssigned(name)
            } else {
                moveToAvailable(name)
            }
        }

        draggedPermission = null

    }

    function savePermissionsModal() {

        if (!currentUser.value) return

        isSavingPermissions.value = true
        permissionsError.value = ""

        const user_id = route.params?.id

        // NOTE : hypothèse sur le nom de la méthode du service. À adapter si
        // `useUserService()` expose un autre nom (ex: `setPermissions`, `sync`...).
        userService.updatePermissions(user_id as string, modalAssigned.value)
            .then((res) => {
                permissions.value = [...modalAssigned.value]
                isPermissionsModalOpen.value = false
                console.log(res)
            })
            .catch(err => {
                console.error(err)
                permissionsError.value =
                    "Impossible d'enregistrer les permissions. Veuillez réessayer."
            })
            .finally(() => {
                isSavingPermissions.value = false
            })

    }

    const anyModalOpen = computed(() => isRoleModalOpen.value || isPermissionsModalOpen.value)

    function handleEscapeKey(event: KeyboardEvent) {
        if (event.key === "Escape") {
            closeRoleModal()
            closePermissionsModal()
        }
    }

    function fetchAllPermissions(){
        userService.getAllPermissions()
        .then(res=>{
            // console.log(res.data)
            ALL_PERMISSIONS.value=res.data
            
        })
        .catch((err:AxiosError)=>{
            console.error(err)
        })
    }
    function fetchMyInfo() {
        userService.me()
            .then(res => {
                my_info.value = res.data.data
                // console.log(res.data.data)
            })
            .catch(err => {
                console.error(err)
            })
    }
    watch(anyModalOpen, isOpen => {

        if (isOpen) {
            document.addEventListener("keydown", handleEscapeKey)
            document.body.style.overflow = "hidden"
        } else {
            document.removeEventListener("keydown", handleEscapeKey)
            document.body.style.overflow = ""
        }

    })

    onUnmounted(() => {
        document.removeEventListener("keydown", handleEscapeKey)
        document.body.style.overflow = ""
    })

    onMounted(() => {
        fetchData()
        fetchPermissions()
        fetchAllPermissions()
        fetchMyInfo()
    })

</script>

<style scoped>
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

.modal-fade-enter-active,
.modal-fade-leave-active {
    transition: opacity 0.2s ease;
}

.modal-fade-enter-active>div:last-child,
.modal-fade-leave-active>div:last-child {
    transition: opacity 0.2s ease, transform 0.2s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
    opacity: 0;
}

.modal-fade-enter-from>div:last-child,
.modal-fade-leave-to>div:last-child {
    opacity: 0;
    transform: scale(0.97) translateY(4px);
}
</style>