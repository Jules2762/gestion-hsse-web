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
                        class="relative flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">

                        <!-- En-tête -->
                        <div class="flex items-start justify-between gap-4 border-b border-border p-5 pb-4">
                            <div>
                                <h3 class="text-lg font-bold text-text-primary flex items-center gap-2">
                                    <ShieldCheck class="h-5 w-5 text-primary" />
                                    {{ locale === 'en' ? 'Manage permissions' : 'Gérer les permissions' }}
                                    <span class="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                                        {{ modalAssigned.length }} / {{ ALL_PERMISSIONS.length }} {{ locale === 'en' ? 'assigned' : 'assignées' }}
                                    </span>
                                </h3>
                                <p class="mt-0.5 text-xs text-text-secondary">
                                    {{ locale === 'en' ? 'Permissions are organized by module for easier assignment. Drag & drop or use buttons.' : 'Permissions regroupées par module pour simplifier l\'attribution. Glissez-déposez ou utilisez les boutons rapides.' }}
                                </p>
                            </div>
                            <button type="button" @click="closePermissionsModal"
                                class="shrink-0 rounded-lg p-1 text-text-muted hover:bg-slate-100 hover:text-text-secondary cursor-pointer transition">
                                <X class="h-5 w-5" />
                            </button>
                        </div>

                        <!-- Barre d'onglets de filtrage par module & actions globales -->
                        <div class="bg-slate-50/90 border-b border-border px-5 py-2.5 flex flex-wrap items-center justify-between gap-3">
                            <!-- Filtres par catégorie -->
                            <div class="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                                <button
                                    type="button"
                                    @click="selectedCategoryFilter = 'ALL'"
                                    :class="selectedCategoryFilter === 'ALL' ? 'bg-primary text-white shadow-sm' : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'"
                                    class="text-xs font-semibold px-2.5 py-1 rounded-lg transition shrink-0 cursor-pointer flex items-center gap-1.5"
                                >
                                    <Layers class="h-3.5 w-3.5" />
                                    {{ locale === 'en' ? 'All' : 'Tous les modules' }}
                                    <span class="text-[10px] opacity-80">({{ ALL_PERMISSIONS.length }})</span>
                                </button>
                                <button
                                    v-for="cat in ALL_CATEGORIES"
                                    :key="cat.id"
                                    type="button"
                                    @click="selectedCategoryFilter = cat.id"
                                    :class="selectedCategoryFilter === cat.id ? 'bg-primary text-white shadow-sm' : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'"
                                    class="text-xs font-semibold px-2.5 py-1 rounded-lg transition shrink-0 cursor-pointer flex items-center gap-1.5"
                                >
                                    <component :is="cat.icon" class="h-3.5 w-3.5" />
                                    {{ locale === 'en' ? cat.titleEn : cat.title }}
                                    <span class="text-[10px] opacity-80">
                                        ({{ getCategoryCount(cat) }})
                                    </span>
                                </button>
                            </div>

                            <!-- Actions globales Rapides -->
                            <div class="flex items-center gap-2">
                                <button
                                    type="button"
                                    v-if="modalAvailable.length > 0"
                                    @click="addAllAvailable"
                                    class="text-[11px] font-semibold text-primary hover:text-primary-dark hover:bg-primary-light/50 px-2.5 py-1 rounded-lg border border-primary/20 transition cursor-pointer flex items-center gap-1"
                                >
                                    <CheckCheck class="h-3.5 w-3.5" />
                                    {{ locale === 'en' ? 'Grant all' : 'Tout accorder' }}
                                </button>
                                <button
                                    type="button"
                                    v-if="modalAssigned.length > 0"
                                    @click="removeAllAssigned"
                                    class="text-[11px] font-semibold text-danger hover:text-danger/80 hover:bg-danger/10 px-2.5 py-1 rounded-lg border border-danger/20 transition cursor-pointer flex items-center gap-1"
                                >
                                    <Trash2 class="h-3.5 w-3.5" />
                                    {{ locale === 'en' ? 'Revoke all' : 'Tout révoquer' }}
                                </button>
                            </div>
                        </div>

                        <div v-if="permissionsError"
                            class="mx-5 mt-4 flex items-center gap-2 rounded-xl border border-danger/30 bg-danger/10 p-3 text-sm text-danger">
                            <CircleAlert class="h-4 w-4 shrink-0" />
                            {{ permissionsError }}
                        </div>

                        <!-- Grille Deux Colonnes -->
                        <div class="grid flex-1 grid-cols-1 gap-4 overflow-hidden p-5 sm:grid-cols-2">

                            <!-- ASSIGNÉES (GAUCHE) -->
                            <div class="flex flex-col min-h-0 h-[52vh] gap-2">
                                <div class="flex items-center justify-between">
                                    <p class="text-xs font-semibold text-slate-700">
                                        {{ locale === 'en' ? `Permissions of ${currentUser?.first_name}` : `Permissions accordées à ${currentUser?.first_name}` }}
                                        <span class="text-primary font-bold">({{ modalAssigned.length }})</span>
                                    </p>
                                </div>
                                <div class="w-full">
                                    <InputFilter :icon="Search" v-model="search_left_permission" :placeholder="locale === 'en' ? 'Search assigned...' : 'Filtrer les assignées...'" />
                                </div>
                                <div class="flex-1 min-h-0 overflow-y-auto flex flex-col gap-3 rounded-2xl border-2 border-dashed p-3 transition-colors"
                                    :class="dragOverZone === 'assigned' ? 'border-primary bg-primary-light/40' : 'border-border bg-surface'"
                                    @dragover.prevent="dragOverZone = 'assigned'" @dragleave="dragOverZone = null"
                                    @drop.prevent="handleDrop('assigned')">

                                    <p v-if="modalAssigned.length === 0" class="m-auto text-xs text-text-muted text-center px-4 py-8">
                                        {{ locale === 'en' ? 'No permissions assigned yet. Pick from the right column.' : 'Aucune permission assignée. Cliquez sur une permission ou glissez-la depuis la colonne de droite.' }}
                                    </p>
                                    <p v-else-if="groupedAssigned.length === 0" class="m-auto text-xs text-text-muted text-center px-4 py-8">
                                        {{ locale === 'en' ? 'No permissions match the filter or search.' : 'Aucune permission assignée ne correspond au filtre ou à la recherche.' }}
                                    </p>

                                    <!-- Groupes par catégorie -->
                                    <div v-for="group in groupedAssigned" :key="group.category.id" class="flex flex-col gap-1.5">
                                        <!-- En-tête de catégorie -->
                                        <div class="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-slate-100/90 border border-slate-200/80">
                                            <button type="button" @click="toggleCategoryCollapse(group.category.id, 'assigned')" class="flex items-center gap-1.5 text-xs font-bold text-slate-800 hover:text-primary transition cursor-pointer">
                                                <component :is="group.category.icon" class="h-3.5 w-3.5" :class="group.category.textColor" />
                                                <span>{{ locale === 'en' ? group.category.titleEn : group.category.title }}</span>
                                                <span class="text-[10px] font-semibold px-1.5 py-0.5 rounded-full" :class="group.category.bgLight + ' ' + group.category.textColor">
                                                    {{ group.permissions.length }}
                                                </span>
                                                <ChevronDown class="h-3.5 w-3.5 text-slate-400 transition-transform duration-200" :class="{ '-rotate-90': isCategoryCollapsed(group.category.id, 'assigned') }" />
                                            </button>
                                            <button
                                                v-if="group.permissions.length > 0"
                                                type="button"
                                                @click="removeAllFromCategory(group.category)"
                                                class="text-[10px] font-semibold text-danger hover:text-danger/80 hover:bg-danger/10 px-1.5 py-0.5 rounded transition cursor-pointer flex items-center gap-0.5"
                                                :title="locale === 'en' ? 'Revoke this whole group' : 'Retirer toutes les permissions de ce groupe'"
                                            >
                                                <Minus class="h-3 w-3" />
                                                <span>{{ locale === 'en' ? 'Revoke group' : 'Retirer le groupe' }}</span>
                                            </button>
                                        </div>

                                        <!-- Cartes de permissions du groupe -->
                                        <div
                                            v-if="!isCategoryCollapsed(group.category.id, 'assigned')"
                                            class="flex flex-col gap-1.5 pl-1"
                                        >
                                            <div
                                                v-for="name in group.permissions"
                                                :key="name"
                                                draggable="true"
                                                @dragstart="onDragStart(name, 'assigned', $event)"
                                                @dragend="dragOverZone = null"
                                                class="group flex cursor-grab items-center gap-2 rounded-xl border border-border bg-white p-2 text-xs shadow-sm transition-all hover:border-danger/40 hover:shadow-md active:cursor-grabbing"
                                            >
                                                <GripVertical class="h-3.5 w-3.5 shrink-0 text-text-muted/60 group-hover:text-text-muted" />
                                                <div class="flex-1 min-w-0">
                                                    <div class="flex items-center gap-1.5 flex-wrap">
                                                        <span class="font-semibold text-text-primary text-xs">
                                                            {{ getPermissionLabel(name) }}
                                                        </span>
                                                        <code class="text-[9px] font-mono font-medium px-1 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200/60">
                                                            {{ name }}
                                                        </code>
                                                    </div>
                                                    <p v-if="getPermissionDesc(name)" class="text-[10px] text-text-muted truncate mt-0.5">
                                                        {{ getPermissionDesc(name) }}
                                                    </p>
                                                </div>
                                                <button
                                                    type="button"
                                                    @click="moveToAvailable(name)"
                                                    class="shrink-0 rounded-lg p-1.5 text-text-muted hover:bg-red-50 hover:text-danger transition cursor-pointer"
                                                    :title="locale === 'en' ? 'Revoke permission' : 'Retirer la permission'"
                                                >
                                                    <ChevronRight class="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>

                            <!-- DISPONIBLES (DROITE) -->
                            <div class="flex flex-col min-h-0 h-[52vh] gap-2">
                                <div class="flex items-center justify-between">
                                    <p class="text-xs font-semibold text-slate-700">
                                        {{ locale === 'en' ? 'Available permissions' : 'Permissions disponibles' }}
                                        <span class="text-emerald-600 font-bold">({{ modalAvailable.length }})</span>
                                    </p>
                                </div>
                                <div class="w-full">
                                    <InputFilter :icon="Search" v-model="search_right_permission" :placeholder="locale === 'en' ? 'Search available...' : 'Filtrer les disponibles...'" />
                                </div>
                                <div class="flex-1 min-h-0 overflow-y-auto flex flex-col gap-3 rounded-2xl border-2 border-dashed p-3 transition-colors"
                                    :class="dragOverZone === 'available' ? 'border-primary bg-primary-light/40' : 'border-border bg-surface'"
                                    @dragover.prevent="dragOverZone = 'available'" @dragleave="dragOverZone = null"
                                    @drop.prevent="handleDrop('available')">

                                    <p v-if="modalAvailable.length === 0" class="m-auto text-xs text-text-muted text-center px-4 py-8">
                                        {{ locale === 'en' ? 'All permissions have been assigned to this user.' : 'Toutes les permissions disponibles ont été accordées à cet utilisateur.' }}
                                    </p>
                                    <p v-else-if="groupedAvailable.length === 0" class="m-auto text-xs text-text-muted text-center px-4 py-8">
                                        {{ locale === 'en' ? 'No permissions match the filter or search.' : 'Aucune permission disponible ne correspond au filtre ou à la recherche.' }}
                                    </p>

                                    <!-- Groupes par catégorie -->
                                    <div v-for="group in groupedAvailable" :key="group.category.id" class="flex flex-col gap-1.5">
                                        <!-- En-tête de catégorie -->
                                        <div class="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-slate-100/90 border border-slate-200/80">
                                            <button type="button" @click="toggleCategoryCollapse(group.category.id, 'available')" class="flex items-center gap-1.5 text-xs font-bold text-slate-800 hover:text-primary transition cursor-pointer">
                                                <component :is="group.category.icon" class="h-3.5 w-3.5" :class="group.category.textColor" />
                                                <span>{{ locale === 'en' ? group.category.titleEn : group.category.title }}</span>
                                                <span class="text-[10px] font-semibold px-1.5 py-0.5 rounded-full" :class="group.category.bgLight + ' ' + group.category.textColor">
                                                    {{ group.permissions.length }}
                                                </span>
                                                <ChevronDown class="h-3.5 w-3.5 text-slate-400 transition-transform duration-200" :class="{ '-rotate-90': isCategoryCollapsed(group.category.id, 'available') }" />
                                            </button>
                                            <button
                                                v-if="group.permissions.length > 0"
                                                type="button"
                                                @click="addAllFromCategory(group.category)"
                                                class="text-[10px] font-semibold text-primary hover:text-primary-dark hover:bg-primary-light/50 px-1.5 py-0.5 rounded transition cursor-pointer flex items-center gap-0.5"
                                                :title="locale === 'en' ? 'Grant this whole group' : 'Accorder toutes les permissions de ce groupe'"
                                            >
                                                <Plus class="h-3 w-3" />
                                                <span>{{ locale === 'en' ? 'Grant group' : 'Ajouter le groupe' }}</span>
                                            </button>
                                        </div>

                                        <!-- Cartes de permissions du groupe -->
                                        <div
                                            v-if="!isCategoryCollapsed(group.category.id, 'available')"
                                            class="flex flex-col gap-1.5 pl-1"
                                        >
                                            <div
                                                v-for="name in group.permissions"
                                                :key="name"
                                                draggable="true"
                                                @dragstart="onDragStart(name, 'available', $event)"
                                                @dragend="dragOverZone = null"
                                                class="group flex cursor-grab items-center gap-2 rounded-xl border border-border bg-white p-2 text-xs shadow-sm transition-all hover:border-primary/40 hover:shadow-md active:cursor-grabbing"
                                            >
                                                <button
                                                    type="button"
                                                    @click="moveToAssigned(name)"
                                                    class="shrink-0 rounded-lg p-1.5 text-text-muted hover:bg-primary-light/60 hover:text-primary transition cursor-pointer"
                                                    :title="locale === 'en' ? 'Grant permission' : 'Accorder la permission'"
                                                >
                                                    <ChevronLeft class="h-4 w-4" />
                                                </button>
                                                <div class="flex-1 min-w-0">
                                                    <div class="flex items-center gap-1.5 flex-wrap">
                                                        <span class="font-semibold text-text-primary text-xs">
                                                            {{ getPermissionLabel(name) }}
                                                        </span>
                                                        <code class="text-[9px] font-mono font-medium px-1 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200/60">
                                                            {{ name }}
                                                        </code>
                                                    </div>
                                                    <p v-if="getPermissionDesc(name)" class="text-[10px] text-text-muted truncate mt-0.5">
                                                        {{ getPermissionDesc(name) }}
                                                    </p>
                                                </div>
                                                <GripVertical class="h-3.5 w-3.5 shrink-0 text-text-muted/60 group-hover:text-text-muted" />
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>

                        </div>

                        <!-- Pied de page -->
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
        AlertTriangle,
        Briefcase,
        CheckCheck,
        CheckCircle2,
        ChevronDown,
        ChevronLeft,
        ChevronRight,
        CircleAlert,
        ClipboardCheck,
        Edit2,
        Folder,
        GripVertical,
        Layers,
        Loader2,
        Mail,
        Minus,
        Pencil,
        Plus,
        Save,
        Search,
        ShieldCheck,
        ShieldOff,
        Trash2,
        UserRound,
        Users,
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
    const ALL_PERMISSIONS = ref<string[]>([])
    const dragOverZone = ref<"assigned" | "available" | null>(null)
    const isSavingPermissions = ref(false)
    const permissionsError = ref("")
    const selectedCategoryFilter = ref<string>("ALL")
    const collapsedCategories = ref<Record<string, boolean>>({})

    interface CategoryDef {
        id: string
        title: string
        titleEn: string
        icon: any
        bgLight: string
        textColor: string
        matches: (name: string) => boolean
    }

    const CATEGORIES: CategoryDef[] = [
        {
            id: "users",
            title: "Utilisateurs & Accès",
            titleEn: "Users & Access",
            icon: Users,
            bgLight: "bg-blue-50",
            textColor: "text-blue-600",
            matches: (name: string) => name.startsWith("USER_") || name.startsWith("PERMISSION_")
        },
        {
            id: "checklists",
            title: "Checklists & Inspections",
            titleEn: "Checklists & Inspections",
            icon: ClipboardCheck,
            bgLight: "bg-emerald-50",
            textColor: "text-emerald-600",
            matches: (name: string) => name.startsWith("CHECKLIST_") || name.includes("CHECKLIST")
        },
        {
            id: "actions",
            title: "Actions Correctives",
            titleEn: "Corrective Actions",
            icon: AlertTriangle,
            bgLight: "bg-amber-50",
            textColor: "text-amber-600",
            matches: (name: string) => name.startsWith("ACTION_")
        },
        {
            id: "documents",
            title: "Gestion Documentaire",
            titleEn: "Documents & Files",
            icon: Folder,
            bgLight: "bg-purple-50",
            textColor: "text-purple-600",
            matches: (name: string) => name.startsWith("DOCUMENT_")
        },
        {
            id: "other",
            title: "Autres Permissions",
            titleEn: "Other Permissions",
            icon: Layers,
            bgLight: "bg-slate-50",
            textColor: "text-slate-600",
            matches: (name: string) =>
                !name.startsWith("USER_") &&
                !name.startsWith("PERMISSION_") &&
                !name.startsWith("CHECKLIST_") &&
                !name.includes("CHECKLIST") &&
                !name.startsWith("ACTION_") &&
                !name.startsWith("DOCUMENT_")
        }
    ]

    function getCategoryCount(cat: CategoryDef): number {
        return ALL_PERMISSIONS.value.filter(p => cat.matches(p)).length
    }

    const ALL_CATEGORIES = computed(() =>
        CATEGORIES.filter(cat => getCategoryCount(cat) > 0)
    )

    const PERMISSION_METAS: Record<string, { labelFr: string; labelEn: string; descFr: string; descEn: string }> = {
        // Utilisateurs & Rôles
        USER_CREATE: {
            labelFr: "Créer un utilisateur",
            labelEn: "Create user",
            descFr: "Création de nouveaux comptes utilisateurs dans le système",
            descEn: "Create new user accounts in the system"
        },
        USER_READ: {
            labelFr: "Lister les utilisateurs",
            labelEn: "List users",
            descFr: "Accès à l'annuaire et à la liste des utilisateurs",
            descEn: "Access user directory and list of users"
        },
        USER_SHOW: {
            labelFr: "Consulter un utilisateur",
            labelEn: "View user profile",
            descFr: "Visualisation des détails et informations du profil utilisateur",
            descEn: "View user profile details and information"
        },
        USER_UPDATE: {
            labelFr: "Modifier un utilisateur",
            labelEn: "Update user",
            descFr: "Mise à jour des informations, poste et département",
            descEn: "Update profile information, job title, and department"
        },
        USER_DELETE: {
            labelFr: "Supprimer un utilisateur",
            labelEn: "Delete user",
            descFr: "Suppression définitive d'un compte utilisateur",
            descEn: "Permanently delete a user account"
        },
        USER_ENABLE: {
            labelFr: "Activer un utilisateur",
            labelEn: "Activate user",
            descFr: "Réactivation de l'accès pour un compte suspendu",
            descEn: "Re-enable access for a suspended account"
        },
        USER_DISABLE: {
            labelFr: "Désactiver un utilisateur",
            labelEn: "Deactivate user",
            descFr: "Suspension temporaire de l'accès au compte",
            descEn: "Temporarily suspend account access"
        },
        USER_ROLE_READ: {
            labelFr: "Consulter les rôles",
            labelEn: "View roles",
            descFr: "Visualiser les rôles attribués aux utilisateurs",
            descEn: "View user assigned roles"
        },
        USER_ROLE_UPDATE: {
            labelFr: "Modifier le rôle",
            labelEn: "Update role",
            descFr: "Changer le rôle attribué à un utilisateur",
            descEn: "Change the assigned role of a user"
        },
        USER_PERMISSION_READ: {
            labelFr: "Consulter les permissions",
            labelEn: "View user permissions",
            descFr: "Voir la liste des permissions attribuées à un utilisateur",
            descEn: "View permissions granted to an individual user"
        },
        USER_PERMISSION_UPDATE: {
            labelFr: "Modifier les permissions",
            labelEn: "Update user permissions",
            descFr: "Accorder ou retirer des permissions à un utilisateur",
            descEn: "Grant or revoke individual permissions for a user"
        },
        USER_PERMISSION_DELETE: {
            labelFr: "Révoquer les permissions",
            labelEn: "Revoke user permissions",
            descFr: "Supprimer des permissions spécifiques d'un utilisateur",
            descEn: "Remove specific permissions from a user"
        },
        PERMISSION_READ: {
            labelFr: "Référentiel des permissions",
            labelEn: "Read permission catalogue",
            descFr: "Consultation du catalogue global des permissions du système",
            descEn: "Access system-wide permission catalogue"
        },

        // Checklists & Inspections
        CHECKLIST_TEMPLATE_CREATE: {
            labelFr: "Créer un modèle de checklist",
            labelEn: "Create checklist template",
            descFr: "Conception de nouvelles grilles et trames d'inspection",
            descEn: "Design new inspection templates and checklists"
        },
        CHECKLIST_TEMPLATE_READ: {
            labelFr: "Lister les modèles de checklist",
            labelEn: "List checklist templates",
            descFr: "Consultation de la bibliothèque de modèles d'inspection",
            descEn: "Browse checklist templates library"
        },
        CHECKLIST_TEMPLATE_UPDATE: {
            labelFr: "Modifier un modèle de checklist",
            labelEn: "Update checklist template",
            descFr: "Édition des sections, questions et critères de contrôle",
            descEn: "Edit sections, questions, and inspection criteria"
        },
        CHECKLIST_TEMPLATE_DELETE: {
            labelFr: "Supprimer un modèle de checklist",
            labelEn: "Delete checklist template",
            descFr: "Suppression d'un modèle d'inspection de la bibliothèque",
            descEn: "Remove an inspection template from the library"
        },
        CHECKLIST_CREATE: {
            labelFr: "Programmer une inspection",
            labelEn: "Create inspection",
            descFr: "Création et affectation d'une inspection de site",
            descEn: "Create and schedule a site inspection"
        },
        CHECKLIST_READ: {
            labelFr: "Lister les inspections",
            labelEn: "List inspections",
            descFr: "Consultation des inspections en cours et de l'historique",
            descEn: "View active and past site inspections"
        },
        CHECKLIST_UPDATE: {
            labelFr: "Modifier une inspection",
            labelEn: "Update inspection",
            descFr: "Modification des paramètres d'une inspection planifiée",
            descEn: "Update details of a scheduled inspection"
        },
        CHECKLIST_DELETE: {
            labelFr: "Supprimer une inspection",
            labelEn: "Delete inspection",
            descFr: "Suppression d'une inspection ou d'une checklist",
            descEn: "Delete an inspection or checklist"
        },
        CHECKLIST_ANSWER: {
            labelFr: "Répondre à une inspection",
            labelEn: "Execute / Answer inspection",
            descFr: "Saisie terrain des réponses, photos et constats d'inspection",
            descEn: "Fill inspection findings, photos, and answers on site"
        },
        LOG_READ_CHECKLIST_COMPLETED: {
            labelFr: "Journal des inspections terminées",
            labelEn: "Audit log: completed inspections",
            descFr: "Consultation des rapports et audits d'inspections finalisées",
            descEn: "View audit logs and reports for completed inspections"
        },
        LOG_READ_CHECKLIST_CREATED: {
            labelFr: "Journal des créations d'inspections",
            labelEn: "Audit log: created inspections",
            descFr: "Historique d'audit des planifications d'inspections",
            descEn: "View audit logs for scheduled inspections"
        },

        // Actions Correctives
        ACTION_READ_ASSIGN: {
            labelFr: "Voir ses actions assignées",
            labelEn: "View my assigned actions",
            descFr: "Consultation des actions correctives assignées à son profil",
            descEn: "View corrective actions assigned to current user"
        },
        ACTION_READ_ALL: {
            labelFr: "Voir toutes les actions",
            labelEn: "View all actions",
            descFr: "Supervision de l'ensemble des plans d'actions de l'entreprise",
            descEn: "Oversee all corrective action plans across all sites"
        },
        ACTION_UPDATE_ASSIGN: {
            labelFr: "Mettre à jour ses actions",
            labelEn: "Update assigned actions",
            descFr: "Mise à jour du traitement et preuves pour ses actions",
            descEn: "Update progress and attach evidence for assigned actions"
        },
        ACTION_CHANGE_STATUS: {
            labelFr: "Changer le statut d'une action",
            labelEn: "Change action status",
            descFr: "Validation, clôture, réouverture ou rejet d'une action",
            descEn: "Validate, close, reopen, or reject an action status"
        },

        // Gestion Documentaire
        DOCUMENT_FOLDER_READ: {
            labelFr: "Explorer les dossiers",
            labelEn: "Browse document folders",
            descFr: "Navigation dans l'arborescence des dossiers documentaires",
            descEn: "Browse through document directory folders"
        },
        DOCUMENT_FOLDER_CREATE: {
            labelFr: "Créer un dossier",
            labelEn: "Create document folder",
            descFr: "Création d'un nouveau sous-dossier de classement",
            descEn: "Create a new document directory folder"
        },
        DOCUMENT_FOLDER_RENAME: {
            labelFr: "Renommer un dossier",
            labelEn: "Rename document folder",
            descFr: "Modification de l'intitulé d'un dossier documentaire",
            descEn: "Rename an existing document folder"
        },
        DOCUMENT_FOLDER_DELETE: {
            labelFr: "Supprimer un dossier",
            labelEn: "Delete document folder",
            descFr: "Suppression d'un dossier et de son contenu",
            descEn: "Delete a folder and its contents"
        },
        DOCUMENT_FILE_READ: {
            labelFr: "Lister les documents",
            labelEn: "List documents",
            descFr: "Affichage des fichiers et documents dans un dossier",
            descEn: "View list of documents in a folder"
        },
        DOCUMENT_FILE_VIEW: {
            labelFr: "Prévisualiser un document",
            labelEn: "Preview document",
            descFr: "Consultation directe en ligne (PDF, images, etc.)",
            descEn: "Preview documents online (PDF, images, etc.)"
        },
        DOCUMENT_FILE_UPLOAD: {
            labelFr: "Téléverser un document",
            labelEn: "Upload document",
            descFr: "Ajout et importation de nouveaux fichiers dans la GED",
            descEn: "Upload new files and procedures into the document system"
        },
        DOCUMENT_FILE_DOWNLOAD: {
            labelFr: "Télécharger un document",
            labelEn: "Download document",
            descFr: "Téléchargement d'un fichier sur le poste local",
            descEn: "Download document files locally"
        },
        DOCUMENT_FILE_RENAME: {
            labelFr: "Renommer un document",
            labelEn: "Rename document",
            descFr: "Modification du nom d'affichage d'un document",
            descEn: "Rename a document file"
        },
        DOCUMENT_FILE_DELETE: {
            labelFr: "Supprimer un document",
            labelEn: "Delete document",
            descFr: "Suppression définitive d'un fichier de la GED",
            descEn: "Permanently delete a document file"
        }
    }

    function getPermissionLabel(name: string): string {
        const meta = PERMISSION_METAS[name]
        if (meta) {
            return locale.value === "en" ? meta.labelEn : meta.labelFr
        }
        return name.replace(/_/g, " ")
    }

    function getPermissionDesc(name: string): string {
        const meta = PERMISSION_METAS[name]
        if (meta) {
            return locale.value === "en" ? meta.descEn : meta.descFr
        }
        return ""
    }

    function toggleCategoryCollapse(catId: string, side: "assigned" | "available") {
        const key = `${side}_${catId}`
        collapsedCategories.value[key] = !collapsedCategories.value[key]
    }

    function isCategoryCollapsed(catId: string, side: "assigned" | "available"): boolean {
        return !!collapsedCategories.value[`${side}_${catId}`]
    }

    function addAllAvailable() {
        if (selectedCategoryFilter.value === "ALL") {
            modalAssigned.value = [...new Set([...modalAssigned.value, ...modalAvailable.value])]
            modalAvailable.value = []
        } else {
            const cat = CATEGORIES.find(c => c.id === selectedCategoryFilter.value)
            if (!cat) return
            const toAdd = modalAvailable.value.filter(p => cat.matches(p))
            modalAssigned.value = [...new Set([...modalAssigned.value, ...toAdd])]
            modalAvailable.value = modalAvailable.value.filter(p => !toAdd.includes(p))
        }
    }

    function removeAllAssigned() {
        if (selectedCategoryFilter.value === "ALL") {
            modalAvailable.value = [...new Set([...modalAvailable.value, ...modalAssigned.value])]
            modalAssigned.value = []
        } else {
            const cat = CATEGORIES.find(c => c.id === selectedCategoryFilter.value)
            if (!cat) return
            const toRemove = modalAssigned.value.filter(p => cat.matches(p))
            modalAvailable.value = [...new Set([...modalAvailable.value, ...toRemove])]
            modalAssigned.value = modalAssigned.value.filter(p => !toRemove.includes(p))
        }
    }

    function addAllFromCategory(category: CategoryDef) {
        const toAdd = modalAvailable.value.filter(p => category.matches(p))
        modalAssigned.value = [...new Set([...modalAssigned.value, ...toAdd])]
        modalAvailable.value = modalAvailable.value.filter(p => !toAdd.includes(p))
    }

    function removeAllFromCategory(category: CategoryDef) {
        const toRemove = modalAssigned.value.filter(p => category.matches(p))
        modalAvailable.value = [...new Set([...modalAvailable.value, ...toRemove])]
        modalAssigned.value = modalAssigned.value.filter(p => !toRemove.includes(p))
    }

    interface PermissionGroup {
        category: CategoryDef
        permissions: string[]
    }

    const groupedAssigned = computed<PermissionGroup[]>(() => {
        const q = search_left_permission.value.trim().toLowerCase()
        let list = modalAssigned.value

        if (q) {
            list = list.filter(name => {
                const label = getPermissionLabel(name).toLowerCase()
                const desc = getPermissionDesc(name).toLowerCase()
                return name.toLowerCase().includes(q) || label.includes(q) || desc.includes(q)
            })
        }

        const activeCats = selectedCategoryFilter.value === "ALL"
            ? CATEGORIES
            : CATEGORIES.filter(c => c.id === selectedCategoryFilter.value)

        return activeCats
            .map(cat => ({
                category: cat,
                permissions: list.filter(name => cat.matches(name))
            }))
            .filter(group => group.permissions.length > 0)
    })

    const groupedAvailable = computed<PermissionGroup[]>(() => {
        const q = search_right_permission.value.trim().toLowerCase()
        let list = modalAvailable.value

        if (q) {
            list = list.filter(name => {
                const label = getPermissionLabel(name).toLowerCase()
                const desc = getPermissionDesc(name).toLowerCase()
                return name.toLowerCase().includes(q) || label.includes(q) || desc.includes(q)
            })
        }

        const activeCats = selectedCategoryFilter.value === "ALL"
            ? CATEGORIES
            : CATEGORIES.filter(c => c.id === selectedCategoryFilter.value)

        return activeCats
            .map(cat => ({
                category: cat,
                permissions: list.filter(name => cat.matches(name))
            }))
            .filter(group => group.permissions.length > 0)
    })

    let draggedPermission: { name: string; from: "assigned" | "available" } | null = null

    function openPermissionsModal() {

        modalAssigned.value = [...permissions.value]
        modalAvailable.value = ALL_PERMISSIONS.value.filter(
            name => !permissions.value.includes(name)
        )
        permissionsError.value = ""
        selectedCategoryFilter.value = "ALL"
        search_left_permission.value = ""
        search_right_permission.value = ""

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