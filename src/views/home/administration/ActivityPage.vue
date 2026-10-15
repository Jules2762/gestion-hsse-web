<template>
    <div class="flex flex-col w-full">
        <Header title="Activités" :thumbnails="[
            { label: 'Accueil', name: 'DASHBOARD' },
            { label: 'Administration', name: 'ADMINISTRATION' },
            { label: 'Activités', name: 'ACTIVITY' }
        ]" />

        <!-- SECTION FILTRES IDENTIQUE AU DESIGN STANDARD (VMC / USERS) -->
        <div class="border-b border-gray-200 bg-white sticky top-0 z-10">
            <div class="h-16 px-6 flex flex-row items-center justify-between gap-4">
                <div class="flex flex-row items-center gap-1.5">
                    <ButtonFilter
                        text="Exporter"
                        :icon="Download"
                        :badge="pagination.total.toString()"
                        :loading="loading_export"
                        @click="exportData"
                    />
                </div>
                <div class="flex flex-row items-center gap-2">
                    <InputFilter :icon="Search" placeholder="Rechercher une activité..." v-model="searchQuery" />
                </div>
            </div>
            <ChipFilter
                :filterable-keys="filterableKeys"
                :column-labels="columnLabels"
                :column-options="columnOptions"
                :filters="filters"
                :results-total="pagination.total"
                :results-count="pagination.to"
                :date-range="dataRange"
                @clear-all="clearFilters"
            />
        </div>

        <!-- CONTENU PRINCIPAL AVEC PANNEAU LATÉRAL -->
        <div class="flex flex-row relative">
            <div class="transition-all flex-1 min-w-0" :class="selected_log ? 'w-[calc(100%-400px)]' : 'w-full'">

                <!-- INDICATEUR DE CHARGEMENT -->
                <div v-if="loading" class="p-12 flex flex-col items-center justify-center gap-3 text-gray-500">
                    <Loader :size="32" class="animate-spin text-primary" />
                    <span class="text-sm">Chargement du journal d'activités...</span>
                </div>

                <!-- AUCUN RÉSULTAT -->
                <div v-else-if="logs.length === 0" class="p-16 flex flex-col items-center justify-center text-center">
                    <div class="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mb-4">
                        <Logs :size="28" />
                    </div>
                    <h5 class="text-gray-700 font-semibold mb-1">Aucune activité enregistrée</h5>
                    <p class="text-sm text-gray-500 max-w-sm">
                        Aucun journal ne correspond à vos critères de recherche actuels.
                    </p>
                    <button
                        v-if="searchQuery || filters.type.length || filters.user.length || dataRange.from || dataRange.to"
                        @click="clearFilters"
                        class="mt-4 px-4 py-2 text-xs font-medium text-primary bg-primary/10 rounded-lg hover:bg-primary/20 transition"
                    >
                        Réinitialiser les filtres
                    </button>
                </div>

                <!-- VUE TABLEAU (show_mode === 0) -->
                <div v-else-if="show_mode === 0" class="overflow-x-auto">
                    <table class="w-full">
                        <thead>
                            <tr>
                                <th class="w-12">#</th>
                                <th class="w-40">Type</th>
                                <th>Titre</th>
                                <th>Description</th>
                                <th class="w-48">Utilisateur</th>
                                <th class="w-40">Date et heure</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr
                                v-for="(item, index) in logs"
                                :key="item.id"
                                @click="selected_log = item"
                                @contextmenu.prevent="openContextMenu($event, item)"
                                :class="selected_log?.id === item.id ? 'bg-primary/10' : 'hover:bg-slate-50 cursor-pointer'"
                            >
                                <td class="font-mono text-xs text-gray-400">
                                    {{ (pagination.current_page - 1) * pagination.per_page + index + 1 }}
                                </td>
                                <td>
                                    <span
                                        class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border"
                                        :class="getLogBadgeClass(item.type)"
                                    >
                                        {{ getLogTypeLabel(item.type) }}
                                    </span>
                                </td>
                                <td class="font-medium text-gray-800">
                                    {{ item.title }}
                                </td>
                                <td class="text-gray-600 text-sm max-w-md truncate" :title="item.description">
                                    {{ item.description || '-' }}
                                </td>
                                <td>
                                    <div class="flex items-center gap-2">
                                        <div
                                            v-if="item.user?.image_path"
                                            class="h-7 w-7 rounded-full overflow-hidden shrink-0"
                                        >
                                            <img :src="item.user.image_path" class="h-full w-full object-cover" />
                                        </div>
                                        <div
                                            v-else
                                            class="h-7 w-7 rounded-full bg-primary/10 text-primary font-semibold flex items-center justify-center text-xs shrink-0"
                                        >
                                            {{ getUserInitials(item.user) }}
                                        </div>
                                        <div class="truncate text-xs">
                                            <p class="font-medium text-gray-800 truncate">
                                                {{ getUserFullName(item.user) }}
                                            </p>
                                            <p class="text-gray-400 text-[10px] truncate">
                                                {{ item.user?.email || 'ID ' + item.user_id }}
                                            </p>
                                        </div>
                                    </div>
                                </td>
                                <td class="text-xs text-gray-500 font-mono whitespace-nowrap">
                                    {{ formatDate(item.created_at) }}
                                </td>
                            </tr>
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colspan="6" class="w-full p-4 border-t border-gray-200">
                                    <div class="flex flex-row items-center justify-between text-sm">
                                        <span class="text-xs text-gray-500">
                                            Affichage de {{ pagination.to }} sur {{ pagination.total }} activités
                                        </span>
                                        <vue-awesome-paginate
                                            :hide-prev-next-when-ends="true"
                                            :total-items="pagination.total"
                                            :items-per-page="pagination.per_page"
                                            :max-pages-shown="4"
                                            v-model="pagination.current_page"
                                            @click="onPageChange"
                                        />
                                    </div>
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>

                <!-- VUE CARTES (show_mode === 1) -->
                <div v-else class="p-4">
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div
                            v-for="item in logs"
                            :key="item.id"
                            @click="selected_log = item"
                            class="bg-white border rounded-xl p-4 cursor-pointer transition hover:shadow-sm flex flex-col justify-between gap-3"
                            :class="selected_log?.id === item.id ? 'border-primary ring-2 ring-primary/20' : 'border-gray-200'"
                        >
                            <div>
                                <div class="flex items-center justify-between mb-2">
                                    <span
                                        class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border"
                                        :class="getLogBadgeClass(item.type)"
                                    >
                                        {{ getLogTypeLabel(item.type) }}
                                    </span>
                                    <span class="text-[11px] text-gray-400 font-mono">
                                        {{ formatDate(item.created_at) }}
                                    </span>
                                </div>
                                <h6 class="font-semibold text-gray-900 mb-1 line-clamp-1">
                                    {{ item.title }}
                                </h6>
                                <p class="text-xs text-gray-600 line-clamp-2">
                                    {{ item.description || '-' }}
                                </p>
                            </div>

                            <div class="flex items-center gap-2 pt-2 border-t border-gray-100">
                                <div
                                    v-if="item.user?.image_path"
                                    class="h-6 w-6 rounded-full overflow-hidden shrink-0"
                                >
                                    <img :src="item.user.image_path" class="h-full w-full object-cover" />
                                </div>
                                <div
                                    v-else
                                    class="h-6 w-6 rounded-full bg-primary/10 text-primary font-semibold flex items-center justify-center text-[10px] shrink-0"
                                >
                                    {{ getUserInitials(item.user) }}
                                </div>
                                <span class="text-xs text-gray-600 truncate">
                                    {{ getUserFullName(item.user) }}
                                </span>
                            </div>
                        </div>
                    </div>

                    <!-- Pagination pour la vue cartes -->
                    <div class="mt-6 flex justify-end">
                        <vue-awesome-paginate
                            :hide-prev-next-when-ends="true"
                            :total-items="pagination.total"
                            :items-per-page="pagination.per_page"
                            :max-pages-shown="4"
                            v-model="pagination.current_page"
                            @click="onPageChange"
                        />
                    </div>
                </div>
            </div>

            <!-- VOLET LATÉRAL DE DÉTAILS -->
            <aside
                v-if="selected_log"
                aria-label="Détails de l'activité"
                class="w-[400px] min-w-[400px] max-w-[400px] bg-white border-l border-gray-200 sticky top-0 transition-all h-screen overflow-y-auto p-5 z-20 shrink-0 shadow-xl scrollbar-hide"
            >
                <!-- EN-TÊTE DU VOLET -->
                <div class="flex items-start justify-between pb-4 border-b border-gray-200">
                    <div class="min-w-0 flex-1">
                        <p class="text-[11px] font-bold uppercase tracking-wider text-gray-400">Journal n° {{ selected_log.id }}</p>
                        <h4 class="mt-1 font-bold text-gray-900 truncate">{{ selected_log.title }}</h4>
                    </div>
                    <button
                        class="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                        @click="selected_log = undefined"
                        type="button"
                        aria-label="Fermer l'aperçu"
                    >
                        <XIcon :size="18" />
                    </button>
                </div>

                <!-- BLOC ACTIVITÉ -->
                <div class="mt-5 rounded-xl border border-primary/20 bg-primary/5 p-4">
                    <div class="flex items-center justify-between gap-2 mb-2">
                        <span
                            class="inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium border"
                            :class="getLogBadgeClass(selected_log.type)"
                        >
                            {{ getLogTypeLabel(selected_log.type) }}
                        </span>
                        <span class="text-[11px] text-gray-500 font-mono">
                            #{{ selected_log.id }}
                        </span>
                    </div>

                    <h6 class="font-semibold text-gray-900 mt-2">
                        {{ selected_log.title }}
                    </h6>

                    <p class="mt-2 text-sm text-gray-600 whitespace-pre-line">
                        {{ selected_log.description || 'Aucune description détaillée.' }}
                    </p>
                </div>

                <!-- HORODATAGE -->
                <div class="mt-5 flex items-start gap-3">
                    <Clock :size="16" class="text-gray-400 mt-0.5 shrink-0" />
                    <div>
                        <span class="text-xs uppercase tracking-wide text-gray-500 block">
                            Date et heure
                        </span>
                        <p class="mt-0.5 text-sm font-medium text-gray-800 font-mono">
                            {{ formatDate(selected_log.created_at) }}
                        </p>
                    </div>
                </div>

                <!-- SECTION UTILISATEUR -->
                <div class="mt-6 border-t border-gray-200 pt-5">
                    <h6 class="mb-4 text-xs uppercase tracking-wider font-semibold text-gray-500">
                        Auteur de l'action
                    </h6>

                    <template v-if="selected_log.user">
                        <div class="flex items-center gap-3">
                            <img
                                v-if="selected_log.user.image_path"
                                :src="selected_log.user.image_path"
                                class="h-12 w-12 rounded-full object-cover shrink-0"
                            />
                            <div
                                v-else
                                class="h-12 w-12 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-sm shrink-0"
                            >
                                {{ getUserInitials(selected_log.user) }}
                            </div>

                            <div class="min-w-0">
                                <p class="font-semibold text-gray-900 text-sm truncate">
                                    {{ getUserFullName(selected_log.user) }}
                                </p>
                                <p class="text-xs text-gray-500 truncate">
                                    {{ selected_log.user.email }}
                                </p>
                            </div>
                        </div>

                        <!-- DÉTAILS DE L'UTILISATEUR -->
                        <div class="mt-4 flex flex-col gap-3 text-xs">
                            <div class="flex items-center justify-between border-b border-gray-100 pb-2">
                                <span class="text-gray-500">Rôle</span>
                                <span class="font-medium px-2 py-0.5 rounded text-[11px]" :class="selected_log.user.role === 'ADMIN' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'">
                                    {{ selected_log.user.role === 'ADMIN' ? 'Administrateur' : 'Utilisateur' }}
                                </span>
                            </div>

                            <div v-if="selected_log.user.department" class="flex items-center justify-between border-b border-gray-100 pb-2">
                                <span class="text-gray-500">Département</span>
                                <span class="font-medium text-gray-800 truncate max-w-[160px] text-right">
                                    {{ selected_log.user.department }}
                                </span>
                            </div>

                            <div v-if="selected_log.user.job" class="flex items-center justify-between border-b border-gray-100 pb-2">
                                <span class="text-gray-500">Fonction</span>
                                <span class="font-medium text-gray-800 truncate max-w-[160px] text-right">
                                    {{ selected_log.user.job }}
                                </span>
                            </div>

                            <div v-if="selected_log.user.phone_number" class="flex items-center justify-between border-b border-gray-100 pb-2">
                                <span class="text-gray-500">Téléphone</span>
                                <span class="font-medium text-gray-800">
                                    {{ selected_log.user.phone_number }}
                                </span>
                            </div>

                            <div class="flex items-center justify-between">
                                <span class="text-gray-500">Statut</span>
                                <span
                                    class="rounded-full px-2.5 py-0.5 text-[11px] font-medium"
                                    :class="selected_log.user.status === 'ENABLED' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'"
                                >
                                    {{ selected_log.user.status === 'ENABLED' ? 'Actif' : 'Inactif' }}
                                </span>
                            </div>
                        </div>
                    </template>

                    <template v-else>
                        <p class="text-xs text-gray-500 italic">
                            Utilisateur ID #{{ selected_log.user_id }} (compte non chargé ou supprimé)
                        </p>
                    </template>
                </div>

                <!-- SECTION PARAMÈTRES / PROPERTIES -->
                <div
                    v-if="selected_log.properties && Object.keys(selected_log.properties).length > 0"
                    class="mt-6 border-t border-gray-200 pt-5"
                >
                    <h6 class="mb-3 text-xs uppercase tracking-wider font-semibold text-gray-500">
                        Paramètres complémentaires
                    </h6>

                    <div class="rounded-lg bg-gray-50 border border-gray-200 p-3 text-xs space-y-2">
                        <div
                            v-for="(val, key) in selected_log.properties"
                            :key="key"
                            class="flex flex-col gap-0.5 border-b border-gray-200/60 pb-1.5 last:border-0 last:pb-0"
                        >
                            <span class="font-medium text-gray-500 text-[11px]">{{ formatPropertyKey(String(key)) }}</span>
                            <span class="text-gray-800 font-mono text-[11px] break-all">
                                {{ typeof val === 'object' ? JSON.stringify(val) : val }}
                            </span>
                        </div>
                    </div>
                </div>
            </aside>
        </div>

        <!-- MENU CONTEXTUEL (CLIC DROIT) -->
        <ContextMenuUI
            v-model="contextMenu.isOpen"
            :context-menu="contextMenu.contextMenu"
            :actions="contextMenu.actions"
        />
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import Header from '../../../components/shared/Header.vue'
import ButtonFilter from '../../../components/ui/ButtonFilter.vue'
import ChipFilter from '../../../components/ui/ChipFilter.vue'
import InputFilter from '../../../components/ui/InputFilter.vue'
import ShowMode from '../../../components/ui/ShowMode.vue'
import ContextMenuUI from '../../../components/ui/ContextMenuUI.vue'
import activityApi from '../../../core/api/activity.api'
import { exportUtils } from '../../../core/utils/export.utils'
import type { LogType } from '../../../@types/Logs.type'
import type { ContextMenuActionType, contextMenuType } from '../../../@types/ContextMenu.type'
import { router } from '../../../router'
import {
    Clock,
    Download,
    Loader,
    Logs,
    Search,
    User as UserIcon,
    X as XIcon,
} from '@lucide/vue'

const show_mode = ref(0)
const loading = ref(false)
const loading_export = ref(false)
const logs = ref<LogType[]>([])
const selected_log = ref<LogType>()

const searchQuery = ref<string>('')

/* =======================================================
   CONFIGURATION DES FILTRES CHIPFILTER
   ======================================================= */

const filterableKeys: string[] = ['type', 'user']

const columnLabels: Record<string, string> = {
    type: 'Type',
    user: 'Utilisateur',
}

const filters = ref<Record<string, string[]>>({
    type: [],
    user: [],
})

const columnOptions = ref<Record<string, string[]>>({
    type: [],
    user: [],
})

const dataRange = ref<{
    from: string
    to: string
}>({
    from: '',
    to: '',
})

const pagination = ref({
    current_page: 1,
    per_page: 15,
    to: 0,
    total: 0,
})

const contextMenu = ref<{
    isOpen: boolean
    contextMenu?: contextMenuType
    log?: LogType
    actions: ContextMenuActionType[]
}>({
    isOpen: false,
    actions: [
        {
            label: "Profil de l'auteur",
            icon: UserIcon,
            onClick: () => {
                const user = contextMenu.value.log?.user
                if (user?.id) {
                    router.push({
                        name: 'PROFILE',
                        params: { id: user.id }
                    })
                }
            }
        }
    ]
})

function openContextMenu(event: MouseEvent, item: LogType) {
    contextMenu.value.log = item
    contextMenu.value.isOpen = true
    contextMenu.value.contextMenu = event
}

/* =======================================================
   CHARGEMENT DES DONNÉES DEPUIS L'API
   ======================================================= */

function buildFilterParams(): Record<string, any> {
    const params: Record<string, any> = {
        page: pagination.value.current_page,
        per_page: pagination.value.per_page,
    }

    if (searchQuery.value && searchQuery.value.trim().length > 0) {
        params.search = searchQuery.value.trim()
    }

    if (filters.value.type && filters.value.type.length > 0) {
        params.type = filters.value.type
    }

    if (filters.value.user && filters.value.user.length > 0) {
        params.user = filters.value.user
    }

    if (dataRange.value.from) {
        params['date.from'] = dataRange.value.from
    }

    if (dataRange.value.to) {
        params['date.to'] = dataRange.value.to
    }

    return params
}

async function fetchLogs() {
    loading.value = true
    try {
        const params = buildFilterParams()
        const response = await activityApi.index(params)
        const responseData = response.data

        if (Array.isArray(responseData)) {
            logs.value = responseData
            pagination.value.total = responseData.length
            pagination.value.to = responseData.length
        } else if (responseData?.data) {
            logs.value = responseData.data
            const meta = responseData.meta ?? responseData
            pagination.value.total = meta.total ?? responseData.data.length
            pagination.value.to = meta.to ?? Math.min(pagination.value.current_page * pagination.value.per_page, pagination.value.total)
        } else {
            logs.value = []
            pagination.value.total = 0
            pagination.value.to = 0
        }

        // Si l'élément sélectionné n'est plus dans la liste, on le synchronise
        if (selected_log.value) {
            const found = logs.value.find(l => l.id === selected_log.value?.id)
            if (found) {
                selected_log.value = found
            }
        }
    } catch (error) {
        console.error('Erreur lors du chargement des activités :', error)
        logs.value = []
        pagination.value.total = 0
        pagination.value.to = 0
    } finally {
        loading.value = false
    }
}

async function fetchFilters() {
    try {
        const response = await activityApi.getFilters()
        const types: string[] = response.data?.types || []
        const users: string[] = response.data?.users || []

        columnOptions.value = {
            type: types,
            user: users,
        }
    } catch (error) {
        console.error('Erreur lors du chargement des types d\'activités :', error)
    }
}

function onPageChange(page: number) {
    pagination.value.current_page = page
    fetchLogs()
}

function clearFilters() {
    for (const key of filterableKeys) {
        filters.value[key] = []
    }
    dataRange.value.from = ''
    dataRange.value.to = ''
    searchQuery.value = ''
    pagination.value.current_page = 1
    fetchLogs()
}

/* =======================================================
   EXPORT DES ACTIVITÉS EXCEL
   ======================================================= */

async function exportData() {
    loading_export.value = true
    try {
        const params = buildFilterParams()
        delete params.page
        delete params.per_page

        const res = await activityApi.export(params)
        const items = res.data?.data ?? (Array.isArray(res.data) ? res.data : [])

        const exportFields = [
            { key: 'id', excelName: 'Réf' },
            { key: 'type', excelName: 'Type d\'activité' },
            { key: 'title', excelName: 'Titre' },
            { key: 'description', excelName: 'Description' },
            { key: 'author', excelName: 'Auteur' },
            { key: 'email', excelName: 'Email' },
            { key: 'date', excelName: 'Date et heure' },
        ]

        const formattedRows = items.map((item: any) => ({
            id: item.id,
            type: getLogTypeLabel(item.type),
            title: item.title,
            description: item.description || '',
            author: item.user?.full_name || (item.user ? `${item.user.first_name} ${item.user.last_name}` : 'Système'),
            email: item.user?.email || '',
            date: formatDate(item.created_at),
        }))

        exportUtils(formattedRows, exportFields, undefined, undefined, 'activites_hsse')
    } catch (error) {
        console.error('Erreur lors de l\'exportation des activités :', error)
    } finally {
        loading_export.value = false
    }
}

/* =======================================================
   WATCHERS RÉACTIFS
   ======================================================= */

watch(
    () => filters.value,
    () => {
        pagination.value.current_page = 1
        fetchLogs()
    },
    { deep: true }
)

watch(
    () => dataRange.value,
    () => {
        pagination.value.current_page = 1
        fetchLogs()
    },
    { deep: true }
)

let searchTimeout: any = null
watch(searchQuery, () => {
    clearTimeout(searchTimeout)
    searchTimeout = setTimeout(() => {
        pagination.value.current_page = 1
        fetchLogs()
    }, 350)
})

const route = useRoute()

onMounted(async () => {
    await fetchFilters()
    if (route.query.user) {
        filters.value.user = [route.query.user as string]
    }
    fetchLogs()
})

/* =======================================================
   HELPERS D'AFFICHAGE & LABELS
   ======================================================= */

function getUserFullName(user?: any): string {
    if (!user) return 'Système'
    if (user.full_name) return user.full_name
    return [user.first_name, user.last_name].filter(Boolean).join(' ') || 'Utilisateur inconnu'
}

function getUserInitials(user?: any): string {
    if (!user) return 'SY'
    const first = user.first_name ? user.first_name[0] : ''
    const last = user.last_name ? user.last_name[0] : ''
    return (first + last).toUpperCase() || 'U'
}

function formatDate(dateString?: string | null): string {
    if (!dateString) return '-'
    try {
        const date = new Date(dateString)
        return new Intl.DateTimeFormat('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }).format(date)
    } catch {
        return dateString
    }
}

function formatPropertyKey(key: string): string {
    return key
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (char) => char.toUpperCase())
}

function getLogTypeLabel(type: string): string {
    const labels: Record<string, string> = {
        LOGIN: 'Connexion',
        LOGOUT: 'Déconnexion',
        USER_CREATED: 'Utilisateur créé',
        USER_UPDATED: 'Utilisateur modifié',
        USER_DELETED: 'Utilisateur supprimé',
        USER_ENABLED: 'Utilisateur activé',
        USER_DISABLED: 'Utilisateur désactivé',
        USER_ROLE_UPDATED: 'Rôle modifié',
        USER_PERMISSION_UPDATED: 'Permissions modifiées',
        PERSONNEL_CREATED: 'Personnel ajouté',
        FORMATION_CREATED: 'Formation créée',
        FORMATION_UPDATED: 'Formation modifiée',
        FORMATION_DELETED: 'Formation supprimée',
        FORMATION_CANCELLED: 'Formation annulée',
        FORMATION_RESCHEDULED: 'Formation reportée',
        FORMATION_IMPORTED: 'Formations importées',
        PARTICIPANT_ADDED: 'Participant ajouté',
        PARTICIPANT_DELETED: 'Participant retiré',
        EQUIPMENT_CREATED: 'Équipement créé',
        EQUIPMENT_UPDATED: 'Équipement modifié',
        EQUIPMENT_DELETED: 'Équipement supprimé',
        EQUIPMENT_IMPORTED: 'Équipements importés',
        CHECKLIST_CREATED: 'Checklist créée',
        CHECKLIST_UPDATED: 'Checklist modifiée',
        CHECKLIST_DELETED: 'Checklist supprimée',
        CHECKLIST_FINISHED: 'Checklist terminée',
        CHECKLIST_TEMPLATE_CREATED: 'Modèle créé',
        CHECKLIST_TEMPLATE_UPDATED: 'Modèle modifié',
        CHECKLIST_TEMPLATE_DELETED: 'Modèle supprimé',
        FOLDER_CREATED: 'Dossier créé',
        FOLDER_RENAMED: 'Dossier renommé',
        FOLDER_DELETED: 'Dossier supprimé',
        DOCUMENT_UPLOADED: 'Document téléversé',
        DOCUMENT_DELETED: 'Document supprimé',
        DOCUMENT_DOWNLOADED: 'Document téléchargé',
        VMC_CREATED: 'VMC créée',
    }

    return labels[type] || type.replace(/_/g, ' ')
}

function getLogBadgeClass(type: string): string {
    if (type.includes('CREATE') || type.includes('UPLOAD') || type === 'USER_ENABLED') {
        return 'bg-emerald-50 text-emerald-700 border-emerald-200'
    }
    if (type.includes('UPDATE') || type.includes('RENAME')) {
        return 'bg-blue-50 text-blue-700 border-blue-200'
    }
    if (type.includes('DELETE') || type === 'USER_DISABLED' || type.includes('CANCEL')) {
        return 'bg-rose-50 text-rose-700 border-rose-200'
    }
    if (type === 'LOGIN' || type === 'LOGOUT') {
        return 'bg-indigo-50 text-indigo-700 border-indigo-200'
    }
    if (type.includes('RESCHEDULE') || type.includes('IMPORT')) {
        return 'bg-amber-50 text-amber-700 border-amber-200'
    }
    if (type.includes('FINISH')) {
        return 'bg-teal-50 text-teal-700 border-teal-200'
    }

    return 'bg-gray-50 text-gray-700 border-gray-200'
}
</script>
