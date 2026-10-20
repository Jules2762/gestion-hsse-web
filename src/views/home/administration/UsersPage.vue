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
                        <ButtonFilter text="Ajouter" :icon="Plus" is-primary @click="router.push({
                            name: 'ADD_USER'
                        })" />
                        <ButtonFilter text="Exporter" :icon="Download" :loading="loading_export"
                            :badge="pagination.total.toString()" @click="exportData()" />
                    </div>
                    <div class="flex flex-row items-center gap-2">
                        <InputFilter :icon="Search" placeholder="Rechercher un utilisateur..." v-model="filters.search[0]" />
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
                            <th class="w-16 text-center">REF</th>
                            <th>NOM ET PRÉNOM</th>
                            <th>E-MAIL</th>
                            <th>TÉLÉPHONE</th>
                            <th>DÉPARTEMENT</th>
                            <th>FONCTION</th>
                            <th>RÔLE</th>
                            <th>STATUT</th>
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
                                        {{UserRoleDataJson.find(i => i.value == item.role)?.label || item.role}}
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
                                        Affichage de {{ pagination.to }} sur {{ pagination.total }} utilisateurs
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
            <CenterModal :is-open="ban_modal" title="Désactiver le compte utilisateur ?" @close="ban_modal = false"
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
                    label: 'Profil',
                    icon: User,
                    onClick: () => router.push({
                        name: 'PROFILE',
                        params: {
                            id: context_menu_user?.id
                        }
                    })
                },
                {
                    label: 'Rôle et Permissions',
                    icon: UserCog2,
                    onClick: () => router.push({
                        name: 'ROLE_PERMISSION',
                        params: {
                            id: context_menu_user?.id
                        }
                    })
                },
                {
                    label: 'Activités',
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
                        label: 'Modifier',
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
                            ? 'Désactiver'
                            : 'Activer',
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
                    <p class="text-[11px] font-bold uppercase tracking-wider text-gray-400">Utilisateur n° {{ selected_user.id }}</p>
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
                        Voir profil
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
                        Rôles et permissions
                    </Button>
                </div>
            </div>
            <!-- ORGANISATION -->

            <div class="mt-5">
                <h6 class="
                mb-4
                text-gray-500
            ">
                    Organisation
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
                            Département
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
                            Fonction
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
    </div>
</template>
<script setup lang="ts">
    import { onMounted, ref, watch } from 'vue';
    import Header from '../../../components/shared/Header.vue';

    import Button from '../../../components/ui/Button.vue';
    import { Activity, Ban, CircleCheck, Download, Edit, Plus, Search, User, UserCog2, XIcon } from '@lucide/vue';
    import { toast } from 'vue3-toastify';

    import { UserExportFields, UserRoleData, UserRoleDataJson, UserStatusData } from '../../../@data/User.data';

    import CenterModal from '../../../components/ui/centerModal.vue';
    import UserStatus from '../../../components/features/user/UserStatus.vue';
    import type { ContextMenuActionType, contextMenuType } from '../../../@types/ContextMenu.type.ts';
    import ContextMenuUI from '../../../components/ui/ContextMenuUI.vue';
    import type { UserDataType, UserFilterType } from '../../../@types/User.type.ts';
    import { computed } from 'vue'
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