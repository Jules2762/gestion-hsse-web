<template>
    <div class="flex flex-row w-full">
        <div class="flex flex-col w-full transition-all" :class="selected_user ? 'w-[calc(100%-400px)]' : 'w-full'">
            <Header title="administration.users.title" :thumbnails="[
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
            ]" />
            <!-- ======================= RIBBON TOOLBAR ======================= -->
            <div class="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div class="h-16 px-6 flex flex-row items-center justify-between gap-4">
                    <div class="flex flex-row items-center gap-1.5">
                        <ButtonFilter :text="t('common.add') || (locale === 'en' ? 'Add' : 'Ajouter')" :icon="Plus" is-primary @click="openAddModal" />
                        <ButtonFilter :text="t('common.export') || (locale === 'en' ? 'Export' : 'Exporter')" :icon="Download" :loading="loading_export"
                            :badge="pagination.total.toString()" @click="exportData()" />
                        <ButtonFilter :text="t('common.refresh') || (locale === 'en' ? 'Refresh' : 'Actualiser')" :icon="RefreshCw" :loading="loading" @click="fetchData()" />
                    </div>
                    <div class="flex flex-row items-center gap-2">
                        <InputFilter :icon="Search" :placeholder="locale === 'en' ? 'Search a user...' : 'Rechercher un utilisateur...'" v-model="filters.search[0]" />
                    </div>
                </div>
                <ChipFilter :filterableKeys="filterableKeys" :column-labels="columnLabels" :filters="filters"
                    :column-options="columnOptions as Record<string, string[]>" :show-date-filter="false"
                    @clear-all="clearFilters()"></ChipFilter>
            </div>

            <div class="flex flex-col flex-1 min-w-0">
                <table>
                    <thead>
                        <tr>
                            <th class="w-16 text-center">{{ t('table.ref') }}</th>
                            <th>{{ t('table.first_and_last_name') }}</th>
                            <th>{{ t('table.email') }}</th>
                            <th>{{ t('table.phone') }}</th>
                            <th>{{ t('table.department') }}</th>
                            <th>{{ t('table.function') }}</th>
                            <th>{{ t('table.role') }}</th>
                            <th>{{ t('table.status') }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr @contextmenu.prevent="($event) => { contextMenu = $event; isOpenContextMenu = true; context_menu_user = item }"
                            v-for="(item, index) in data" :key="index"
                            :class="selected_user?.id == item.id ? 'bg-primary/10 font-medium' : ''" @click="selectUser(item)"
                            class="cursor-pointer">
                            <td class="font-mono text-xs text-gray-400 text-center">#{{ item.id }}</td>
                            <td class="font-medium text-gray-900">{{ item.first_name + " " + item.last_name }}</td>
                            <td class="text-gray-600 font-mono text-xs">{{ item.email }}</td>
                            <td class="text-gray-500 font-mono text-xs">{{ item.phone_number }}</td>
                            <td class="text-gray-700">{{ item?.department }}</td>
                            <td class="text-gray-700">{{ item?.job }}</td>

                            <td>
                                <template v-if="!loading_status">
                                    <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-slate-100 text-slate-700">
                                        {{ item.role === 'ADMIN' ? (locale === 'en' ? 'Administrator' : 'Administrateur') : (locale === 'en' ? 'User' : 'Utilisateur') }}
                                    </span>
                                </template>
                                <template v-else-if="loading_status && context_menu_user?.id == item.id">
                                    <Loader :size="20" class="animate-spin text-primary" />
                                </template>
                            </td>
                            <td>
                                <UserStatus :name="item.status" />
                            </td>
                        </tr>

                    </tbody>
                    <tfoot>
                        <tr>
                            <td colspan="8" class="w-full p-4 border-t border-gray-200">
                                <div class="flex flex-row items-center justify-between text-sm">
                                    <span class="text-xs text-gray-500 font-medium">
                                        {{ t('common.displaying') }} {{ pagination.to }} {{ t('common.of') }} {{ pagination.total }} {{ locale === 'en' ? 'users' : 'utilisateurs' }}
                                    </span>
                                    <vue-awesome-paginate :hide-prev-next-when-ends="true" :total-items="pagination.total"
                                        :items-per-page="15" :max-pages-shown="4" v-model="pagination.current_page"
                                        @click="(page: number) => { pagination.current_page = page }" />
                                </div>
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>
            <CenterModal :is-open="ban_modal" :title="locale === 'en' ? 'Disable user account?' : 'Désactiver le compte utilisateur ?'" @close="ban_modal = false"
                @confirm="confirmDisableUser">
                <p class="max-w-100 p-4 rounded text-sm text-gray-600">
                    Cet utilisateur ne pourra plus se connecter à la plateforme GALANA HSSE ni accéder aux inspections,
                    rapports et
                    fonctionnalités qui lui sont attribués.
                    <br>
                    <br>
                    Vous pourrez le réactiver ultérieurement si nécessaire.
                </p>
            </CenterModal>
            <ContextMenuUI v-model="isOpenContextMenu" :context-menu="contextMenu" :actions="[
                {
                    label: locale === 'en' ? 'Profile' : 'Profil',
                    icon: User,
                    onClick: () => router.push({
                        name: 'PROFILE',
                        params: {
                            id: context_menu_user?.id
                        }
                    })
                },
                {
                    label: locale === 'en' ? 'Role and Permissions' : 'Rôle et Permissions',
                    icon: UserCog2,
                    onClick: () => router.push({
                        name: 'ROLE_PERMISSION',
                        params: {
                            id: context_menu_user?.id
                        }
                    })
                },
                {
                    label: locale === 'en' ? 'Activities' : 'Activités',
                    icon: Activity,
                    onClick: () => router.push({
                        name: 'ACTIVITY',
                        query: {
                            user: `${context_menu_user?.first_name || ''} ${context_menu_user?.last_name || ''}`.trim()
                        }
                    })
                },
                ...(canChangeStatus
                    ? [{
                        label: locale === 'en' ? 'Edit' : 'Modifier',
                        icon: Edit,
                        variant: 'WARNING',
                        onClick() {
                            router.push({
                                name: 'UPDATE_USER',
                                params: {
                                    id: context_menu_user?.id
                                }
                            }) 
                        }
                    } satisfies ContextMenuActionType] : []),
                ...(canChangeStatus
                    ? [{
                        label: context_menu_user?.status === 'ENABLED'
                            ? (locale === 'en' ? 'Disable' : 'Désactiver')
                            : (locale === 'en' ? 'Enable' : 'Activer'),
                        icon: context_menu_user?.status === 'ENABLED'
                            ? Ban
                            : CircleCheck,
                        variant: context_menu_user?.status === 'ENABLED'
                            ? 'DANGER'
                            : 'SUCCESS',
                        onClick: context_menu_user?.status === 'ENABLED'
                            ? () => { ban_modal = true }
                            : enableUser
                    } satisfies ContextMenuActionType]
                    : [])
            ]">
            </ContextMenuUI>
        </div>
        <!-- ======================= DRAWER LATÉRAL ======================= -->
        <aside v-if="selected_user" aria-label="Aperçu de l'utilisateur"
            class="w-[400px] min-w-[400px] max-w-[400px] bg-white border-l border-gray-200 p-5 overflow-y-auto shrink-0 shadow-xl z-20 sticky top-0 h-screen scrollbar-hide">
            <!-- HEADER DU VOLET -->
            <div class="flex items-start justify-between pb-4 border-b border-gray-200 mb-5">
                <div class="min-w-0 flex-1">
                    <p class="text-[11px] font-bold uppercase tracking-wider text-gray-400">{{ locale === 'en' ? 'User #' : 'Utilisateur n°' }} {{ selected_user.id }}</p>
                    <h4 class="mt-1 font-bold text-gray-900 truncate">{{ selected_user.first_name }} {{ selected_user.last_name }}</h4>
                </div>
                <button
                    @click="selected_user = undefined"
                    type="button"
                    aria-label="Fermer l'aperçu"
                    class="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                >
                    <XIcon :size="18" />
                </button>
            </div>
            <!-- HEADER -->

            <div class="
            flex
            flex-col
            items-center
            gap-4
           
            pb-5
        ">
                <div class="
                flex
                h-20
                w-20
                items-center
                justify-center
                rounded-full
                bg-primary/10
                text-2xl
                font-bold
                text-primary
            ">
                    {{
                        selected_user.first_name
                            ?.charAt(0)
                    }}
                </div>

                <div class="text-center">
                    <h5>
                        {{
                            selected_user.first_name
                        }}
                        {{
                            selected_user.last_name
                        }}
                    </h5>

                    <p class="
                    text-sm
                    text-gray-500
                ">
                        {{
                            selected_user.email
                        }}
                    </p>
                </div>

                <UserStatus :name="selected_user.status
                    " />
            </div>
            <!-- action -->
            <div class="
            
            border-b
            border-gray-200
            py-5
        ">
                <div class="
                flex
                flex-col
                gap-2
            ">
                    <Button class="w-full" @click="
                        router.push({
                            name:
                                'PROFILE',
                            params: {
                                id:
                                    selected_user.id,
                            },
                        })
                        ">
                        {{ locale === 'en' ? 'View profile' : 'Voir profil' }}
                    </Button>

                    <Button variant="outline" class="w-full" @click="
                        router.push({
                            name:
                                'ROLE_PERMISSION',
                            params: {
                                id:
                                    selected_user.id,
                            },
                        })
                        ">
                        {{ locale === 'en' ? 'Roles and permissions' : 'Rôles et permissions' }}
                    </Button>
                </div>
            </div>
            <!-- ORGANISATION -->

            <div class="mt-5">
                <h6 class="
                mb-4
                text-gray-500
            ">
                    {{ locale === 'en' ? 'Organization' : 'Organisation' }}
                </h6>

                <div class="
                flex
                flex-col
                gap-4
            ">
                    <div>
                        <span class="
                        text-xs
                        text-gray-500
                    ">
                            {{ locale === 'en' ? 'Department' : 'Département' }}
                        </span>

                        <p>
                            {{
                                selected_user.department ??
                                "-"
                            }}
                        </p>
                    </div>

                    <div>
                        <span class="
                        text-xs
                        text-gray-500
                    ">
                            {{ locale === 'en' ? 'Job Title' : 'Fonction' }}
                        </span>

                        <p>
                            {{
                                selected_user.job ??
                                "-"
                            }}
                        </p>
                    </div>

                    <div>
                        <span class="
                        text-xs
                        text-gray-500
                    ">
                            Téléphone
                        </span>

                        <p>
                            {{
                                selected_user.phone_number ??
                                "-"
                            }}
                        </p>
                    </div>
                </div>
            </div>

            <!-- ROLE -->

            <div class="
            mt-6
            border-t
            border-gray-200
            pt-5
        ">
                <h6 class="
                mb-4
                text-gray-500
            ">
                    Accès
                </h6>

                <div>
                    <span class="
                    text-xs
                    text-gray-500
                ">
                        Rôle
                    </span>

                    <div class="
                    mt-2
                ">
                        <span class="
                        rounded-full
                        bg-primary/10
                        px-3
                        py-1
                        text-sm
                        text-primary
                    ">
                            {{

                                selected_user?.role[0]

                            }}
                        </span>
                    </div>
                </div>

                <div class="mt-5">
                    <span class="
                    text-xs
                    text-gray-500
                ">
                        Permissions
                    </span>

                    <p class="mt-1">
                        {{
                            permissionsCount
                        }}
                        permission(s)
                    </p>
                </div>
            </div>



        </aside>

        <!-- ========================================================= -->
        <!-- MODAL NOUVEL UTILISATEUR (IN-PAGE MODAL)                  -->
        <!-- ========================================================= -->
        <Teleport to="body">
            <transition name="modal-fade">
                <div
                    v-if="modal_add"
                    class="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto"
                    @click.self="modal_add = false"
                >
                    <div
                        class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden border border-gray-200 animate-in fade-in zoom-in-95 duration-200"
                    >
                        <!-- En-tête Modal -->
                        <div class="px-5 py-3.5 bg-gradient-to-r from-slate-50 to-amber-50/40 border-b border-gray-200 flex items-center justify-between shrink-0">
                            <div class="flex items-center gap-2.5">
                                <div class="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                                    <UserCog2 :size="18" />
                                </div>
                                <div>
                                    <h4 class="text-sm font-bold text-gray-900">
                                        {{ locale === 'en' ? 'Add New User' : 'Créer un nouvel utilisateur' }}
                                    </h4>
                                    <p class="text-[11px] text-gray-500">
                                        {{ locale === 'en' ? 'Define credentials, role, department and account status.' : 'Définissez les identifiants, le rôle, le département et le statut du compte.' }}
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                @click="modal_add = false"
                                class="p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-white transition cursor-pointer"
                            >
                                <XIcon :size="18" />
                            </button>
                        </div>

                        <!-- Formulaire Modal -->
                        <form @submit.prevent="submitAddUser" class="flex flex-col flex-1 overflow-y-auto">
                            <div class="p-5 space-y-4">
                                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                    <!-- Prénom -->
                                    <div>
                                        <label class="block text-xs font-semibold text-gray-700 mb-1">
                                            {{ locale === 'en' ? 'First Name' : 'Prénom' }} <span class="text-red-500">*</span>
                                        </label>
                                        <input
                                            v-model="newUserForm.first_name"
                                            type="text"
                                            required
                                            :placeholder="locale === 'en' ? 'First name' : 'Prénom'"
                                            class="w-full h-9 px-3 rounded-lg border border-gray-300 text-xs focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition"
                                        />
                                    </div>

                                    <!-- Nom -->
                                    <div>
                                        <label class="block text-xs font-semibold text-gray-700 mb-1">
                                            {{ locale === 'en' ? 'Last Name' : 'Nom' }}
                                        </label>
                                        <input
                                            v-model="newUserForm.last_name"
                                            type="text"
                                            :placeholder="locale === 'en' ? 'Last name' : 'Nom de famille'"
                                            class="w-full h-9 px-3 rounded-lg border border-gray-300 text-xs focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition"
                                        />
                                    </div>
                                </div>

                                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                    <!-- Email -->
                                    <div>
                                        <label class="block text-xs font-semibold text-gray-700 mb-1">
                                            {{ locale === 'en' ? 'Email' : 'Adresse e-mail' }} <span class="text-red-500">*</span>
                                        </label>
                                        <input
                                            v-model="newUserForm.email"
                                            type="email"
                                            required
                                            placeholder="nom.prenom@galana.mg"
                                            class="w-full h-9 px-3 rounded-lg border border-gray-300 text-xs focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition"
                                        />
                                    </div>

                                    <!-- Téléphone -->
                                    <div>
                                        <label class="block text-xs font-semibold text-gray-700 mb-1">
                                            {{ locale === 'en' ? 'Phone' : 'Téléphone' }}
                                        </label>
                                        <input
                                            v-model="newUserForm.phone_number"
                                            type="text"
                                            placeholder="+261 34 00 000 00"
                                            class="w-full h-9 px-3 rounded-lg border border-gray-300 text-xs focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition"
                                        />
                                    </div>
                                </div>

                                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                    <!-- Poste / Fonction -->
                                    <div>
                                        <label class="block text-xs font-semibold text-gray-700 mb-1 flex items-center justify-between">
                                            <span>{{ locale === 'en' ? 'Job Title / Position' : 'Poste / Fonction' }}</span>
                                            <span v-if="availableJobs.length" class="text-[10px] text-gray-400 font-normal">({{ availableJobs.length }} {{ locale === 'en' ? 'suggested' : 'suggérés' }})</span>
                                        </label>
                                        <input
                                            v-model="newUserForm.job"
                                            list="user_modal_jobs_datalist"
                                            type="text"
                                            :placeholder="locale === 'en' ? 'Select or type a position...' : 'Sélectionner ou saisir un poste...'"
                                            class="w-full h-9 px-3 rounded-lg border border-gray-300 text-xs focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition"
                                        />
                                        <datalist id="user_modal_jobs_datalist">
                                            <option v-for="j in availableJobs" :key="j" :value="j">{{ j }}</option>
                                        </datalist>
                                    </div>

                                    <!-- Département -->
                                    <div>
                                        <label class="block text-xs font-semibold text-gray-700 mb-1 flex items-center justify-between">
                                            <span>{{ locale === 'en' ? 'Department' : 'Département' }}</span>
                                            <span v-if="availableDepartments.length" class="text-[10px] text-gray-400 font-normal">({{ availableDepartments.length }} {{ locale === 'en' ? 'suggested' : 'suggérés' }})</span>
                                        </label>
                                        <input
                                            v-model="newUserForm.department"
                                            list="user_modal_departments_datalist"
                                            type="text"
                                            :placeholder="locale === 'en' ? 'Select or type a department...' : 'Sélectionner ou saisir un département...'"
                                            class="w-full h-9 px-3 rounded-lg border border-gray-300 text-xs focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition"
                                        />
                                        <datalist id="user_modal_departments_datalist">
                                            <option v-for="d in availableDepartments" :key="d" :value="d">{{ d }}</option>
                                        </datalist>
                                    </div>
                                </div>

                                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                    <!-- Rôle -->
                                    <div>
                                        <label class="block text-xs font-semibold text-gray-700 mb-1">
                                            {{ locale === 'en' ? 'System Role' : 'Rôle système' }} <span class="text-red-500">*</span>
                                        </label>
                                        <select
                                            v-model="newUserForm.role"
                                            required
                                            class="w-full h-9 px-3 rounded-lg border border-gray-300 text-xs focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none bg-white transition cursor-pointer font-medium"
                                        >
                                            <option v-for="r in UserRoleDataJson" :key="r.value" :value="r.value">{{ r.label }}</option>
                                        </select>
                                    </div>

                                    <!-- Statut -->
                                    <div>
                                        <label class="block text-xs font-semibold text-gray-700 mb-1">
                                            {{ locale === 'en' ? 'Account Status' : 'Statut du compte' }} <span class="text-red-500">*</span>
                                        </label>
                                        <select
                                            v-model="newUserForm.status"
                                            required
                                            class="w-full h-9 px-3 rounded-lg border border-gray-300 text-xs focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none bg-white transition cursor-pointer font-medium"
                                        >
                                            <option value="ENABLED">{{ locale === 'en' ? 'Active / Enabled' : 'Actif' }}</option>
                                            <option value="DISABLED">{{ locale === 'en' ? 'Disabled' : 'Désactivé' }}</option>
                                        </select>
                                    </div>
                                </div>

                                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                    <!-- Mot de passe -->
                                    <div>
                                        <label class="block text-xs font-semibold text-gray-700 mb-1">
                                            {{ locale === 'en' ? 'Password' : 'Mot de passe' }} <span class="text-red-500">*</span>
                                        </label>
                                        <input
                                            v-model="newUserForm.password"
                                            type="password"
                                            required
                                            minlength="8"
                                            placeholder="••••••••"
                                            class="w-full h-9 px-3 rounded-lg border border-gray-300 text-xs focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition"
                                        />
                                    </div>

                                    <!-- Confirmation mot de passe -->
                                    <div>
                                        <label class="block text-xs font-semibold text-gray-700 mb-1">
                                            {{ locale === 'en' ? 'Confirm Password' : 'Confirmer mot de passe' }} <span class="text-red-500">*</span>
                                        </label>
                                        <input
                                            v-model="newUserForm.confirmation_password"
                                            type="password"
                                            required
                                            minlength="8"
                                            placeholder="••••••••"
                                            class="w-full h-9 px-3 rounded-lg border border-gray-300 text-xs focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition"
                                        />
                                    </div>
                                </div>
                            </div>

                            <!-- Footer d'actions -->
                            <div class="px-5 py-3 bg-slate-50/80 border-t border-gray-200 flex items-center justify-end gap-2.5 shrink-0">
                                <button
                                    type="button"
                                    @click="modal_add = false"
                                    class="px-4 py-2 text-xs font-medium text-gray-600 hover:bg-gray-200 rounded-lg transition cursor-pointer"
                                >
                                    {{ locale === 'en' ? 'Cancel' : 'Annuler' }}
                                </button>
                                <button
                                    type="submit"
                                    :disabled="loading_add || !newUserForm.first_name || !newUserForm.email || !newUserForm.password || (newUserForm.password !== newUserForm.confirmation_password)"
                                    class="px-5 py-2 text-xs font-semibold text-white bg-primary hover:bg-primary/90 rounded-lg shadow-xs transition flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                                >
                                    <Loader2 v-if="loading_add" :size="13" class="animate-spin" />
                                    <span>{{ locale === 'en' ? 'Create User' : 'Créer l\'utilisateur' }}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </transition>
        </Teleport>
    </div>
</template>
<script setup lang="ts">
    import { computed, onMounted, ref, watch } from 'vue';
    import { useI18n } from 'vue-i18n';
    import Header from '../../../components/shared/Header.vue';

    const { t, locale } = useI18n();


    import Button from '../../../components/ui/Button.vue';
    import { Activity, Ban, CircleCheck, Download, Edit, Plus, RefreshCw, Search, User, UserCog2, XIcon } from '@lucide/vue';
    import { toast } from 'vue3-toastify';

    import { UserExportFields, UserRoleData, UserRoleDataJson, UserStatusData } from '../../../@data/User.data';

    import CenterModal from '../../../components/ui/centerModal.vue';
    import UserStatus from '../../../components/features/user/UserStatus.vue';
    import type { ContextMenuActionType, contextMenuType } from '../../../@types/ContextMenu.type.ts';
    import ContextMenuUI from '../../../components/ui/ContextMenuUI.vue';
    import type { UserDataType, UserFilterType, UserFormType, UserRoleType, UserStatusType } from '../../../@types/User.type.ts';
    import { useUserService } from '../../../core/services/user.service.ts';
    import type { PaginationType } from '../../../@types/Pagination.type.ts';
    import ChipFilter from '../../../components/ui/ChipFilter.vue';
    import ButtonFilter from '../../../components/ui/ButtonFilter.vue';
    import InputFilter from '../../../components/ui/InputFilter.vue';
    import { exportUtils } from '../../../core/utils/export.utils.ts';
    import { router } from '../../../router';

    const data = ref<UserDataType[]>()
    const ban_modal = ref(false)
    const contextMenu = ref<contextMenuType>()
    const isOpenContextMenu = ref(false)
    const selected_user = ref<UserDataType>()
    const context_menu_user = ref<UserDataType>()
    const loading = ref<boolean>(false)
    const loading_status = ref<boolean>(false)
    const canChangeStatus = computed(() => {
        return !!my_info.value &&
            my_info.value.id !== context_menu_user.value?.id
    })
    type FilterKeyType = "department" | "fonction" | "role" | "status" | "search"
    const filterableKeys: Exclude<FilterKeyType, 'search'>[] = ["department", "fonction", "role", "status"]
    const columnLabels: Record<Exclude<FilterKeyType, 'search'>, string> = {
        "department": "Department",
        "fonction": "Fonction",
        "role": "Role",
        "status": "Status"
    }
    const loading_export = ref<boolean>(false)
    const columnOptions = ref<Record<Exclude<FilterKeyType, 'search'>, string[]>>()

    const availableJobs = computed(() => {
        return (columnOptions.value?.fonction || []).filter(Boolean)
    })

    const availableDepartments = computed(() => {
        return (columnOptions.value?.department || []).filter(Boolean)
    })

    const pagination = ref<PaginationType>({
        'current_page': 1,
        "to": 0,
        "total": 0
    })
    const filters = ref<Record<FilterKeyType, string[]>>({
        "department": [],
        "fonction": [],
        "role": [],
        "search": [],
        "status": []
    })
    const loading_permission = ref<boolean>(false)
    
    const modal_add = ref(false)
    const loading_add = ref(false)

    const newUserForm = ref({
        first_name: '',
        last_name: '',
        phone_number: '',
        department: '',
        job: '',
        email: '',
        password: '',
        confirmation_password: '',
        role: 'USER' as UserRoleType,
        status: 'ENABLED' as UserStatusType
    })

    function openAddModal() {
        if (!columnOptions.value?.department?.length || !columnOptions.value?.fonction?.length) {
            fetchDataFilters()
        }
        newUserForm.value = {
            first_name: '',
            last_name: '',
            phone_number: '',
            department: '',
            job: '',
            email: '',
            password: '',
            confirmation_password: '',
            role: 'USER',
            status: 'ENABLED'
        }
        modal_add.value = true
    }

    async function submitAddUser() {
        if (!newUserForm.value.first_name || !newUserForm.value.email || !newUserForm.value.password) return
        if (newUserForm.value.password !== newUserForm.value.confirmation_password) {
            toast.error(locale.value === 'en' ? 'Passwords do not match.' : 'Les mots de passe ne correspondent pas.')
            return
        }

        loading_add.value = true
        try {
            const payload: UserFormType = {
                first_name: newUserForm.value.first_name.trim(),
                last_name: newUserForm.value.last_name.trim(),
                phone_number: newUserForm.value.phone_number.trim(),
                department: newUserForm.value.department.trim(),
                job: newUserForm.value.job.trim(),
                email: newUserForm.value.email.trim(),
                password: newUserForm.value.password,
                confirmation_password: newUserForm.value.confirmation_password,
                role: newUserForm.value.role,
                status: newUserForm.value.status,
                image_path: undefined
            }
            await user.createUser(payload)
            toast.success(locale.value === 'en' ? 'User created successfully!' : 'Utilisateur créé avec succès !')
            modal_add.value = false
            fetchData()
            fetchDataFilters()
        } catch (err: any) {
            const errorMsg = err.response?.data?.message || (locale.value === 'en' ? 'Failed to create user.' : 'Erreur lors de la création de l\'utilisateur.')
            toast.error(errorMsg)
        } finally {
            loading_add.value = false
        }
    }

    const my_info = ref<UserDataType>()
    const permissionsCount = computed(
        () =>
            selected_user.value
                ?.permissions?.length ?? 0,
    )
    const user = useUserService()
    function fetchDataFilters() {
        user.getFilters()
            .then(res => {
                columnOptions.value = {
                    'department': res.data.department,
                    'fonction': res.data.fonction,
                    'role': UserRoleData,
                    'status': UserStatusData
                }
            })
            .catch(err => {
                console.error(err)
            })
            .finally(() => {
                console.table(filters.value)
            })
    }
    function fetchData(params?: UserFilterType) {
        loading.value = true
        user.index(params)
            .then(res => {
                console.log(res.data)
                data.value = res.data.data
                pagination.value.to = res.data.meta.to
                pagination.value.total = res.data.meta.total
            })
            .catch(err => {
                console.error(err)
            })
            .finally(() => {
                loading.value = false
            })
    }
    function clearFilters() {
        Object.keys(filters.value).forEach((key) => {
            filters.value[key as keyof typeof filters.value] = [] as string[]
        })
    }
    function exportData() {
        loading_export.value = true
        user.export({
            search: filters.value.search[0],
            department: filters.value.department,
            fonction: filters.value.fonction,
            role: filters.value.role,
            status: filters.value.status
        })
            .then(res => {
                const users: UserDataType[] = res.data.data
                const convertedFieldData =
                    Object.entries(UserExportFields).map(([key, value]) => {
                        return { 'key': key, 'excelName': value }
                    })

                exportUtils(users, convertedFieldData, undefined, undefined, 'export_users')
            })


            .catch(err => {
                console.error(err)
            })
            .finally(() => {
                loading_export.value = false
            })
    }
    function fetchPermission(id: string | number) {
        loading_permission.value = true
        user.getPermissions(id)
            .then(res => {
                console.table(res.data)
                selected_user.value!.permissions = res.data
            })
            .catch(err => {
                console.error(err)
            })
            .finally(() => {
                loading_permission.value = false
            })
    }
    function selectUser(item: UserDataType) {

        selected_user.value = item
        selected_user.value.permissions = []
        fetchPermission(item.id as string | number)
    }
    function enableUser() {
        loading_status.value = true
        user.enable(context_menu_user.value?.id as string | number)
            .then(res => {
                data.value?.forEach(
                    item =>
                        item.id == context_menu_user.value?.id ?
                            item.status = 'ENABLED' :
                            null
                )
                toast.success('Compte utilisateur activé avec succès')
            })
            .catch(err => {
                console.error(err)
                toast.error("Erreur lors de l'activation")
            })
            .finally(() => {
                loading_status.value = false
            })
    }
    function disableUser() {
        loading_status.value = true
        user.disable(context_menu_user.value?.id as string | number)
            .then(res => {
                data.value?.forEach(
                    item =>
                        item.id == context_menu_user.value?.id ?
                            item.status = 'DISABLED' :
                            null
                )
                toast.success('Compte utilisateur désactivé avec succès')
            })
            .catch(err => {
                console.error(err)
                toast.error("Erreur lors de la désactivation")
            })
            .finally(() => {
                loading_status.value = false
            })
    }
    function confirmDisableUser() {
        ban_modal.value = false
        disableUser()
    }
    function fetchMyInfo() {
        user.me()
            .then(res => {
                my_info.value = res.data.data
                // console.log(res.data.data)
            })
            .catch(err => {
                console.error(err)
            })
    }
    watch([filters.value], () => {
        fetchData({
            page: 1,
            search: filters.value.search[0],
            department: filters.value.department,
            fonction: filters.value.fonction,
            role: filters.value.role,
            status: filters.value.status
        })
    }, {
        immediate: false
    })
    watch(() => pagination.value.current_page, () => {
        fetchData({
            page: pagination.value.current_page,
            search: filters.value.search[0],
            department: filters.value.department,
            fonction: filters.value.fonction,
            role: filters.value.role,
            status: filters.value.status
        })
    }, {
        immediate: false
    })

    onMounted(() => {

        fetchDataFilters()
        fetchData()
        fetchMyInfo()

    })

</script>