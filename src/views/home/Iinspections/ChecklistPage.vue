<template>
    <div class="flex flex-row w-full">
        <div class="flex flex-col w-full transition-all" :class="selected_checklist ? 'w-[calc(100%-400px)]' : 'w-full'">
            <Header title="inspections.checklists.title" :thumbnails="[
                {
                    label: 'thumbnails.home',
                    name: 'DASHBOARD'
                },
                {
                    label: 'thumbnails.inspections',
                    name: 'INSPECTION'
                },
                {
                    label: 'thumbnails.checklists',
                    name: 'CHECKLIST'
                },
            ]"></Header>

            <!-- ======================= RIBBON TOOLBAR ======================= -->
            <div class="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div class="h-16 px-6 flex flex-row items-center justify-between gap-4">
                    <div class="flex flex-row items-center gap-1.5">
                        <ButtonFilter text="Ajouter" :icon="Plus" is-primary @click="openAddModal" />
                        <ButtonFilter text="Importer" :icon="UploadCloud" />
                        <ButtonFilter text="Export" :icon="Download" :badge="String(pagination.total)" :loading="loading_export" @click="handleExport" />
                        <ButtonFilter text="Actualiser" :icon="RefreshCw" :loading="loading" @click="fetchData()" />
                        <ButtonFilter text="Templates" :icon="LayoutTemplateIcon" @click="router.push({
                            name: 'TEMPLATE'
                        })" />
                    </div>
                    <div class="flex flex-row items-center gap-2">
                        <InputFilter :icon="Search" placeholder="Rechercher une checklist..." v-model="search" />
                    </div>
                </div>
                <ChipFilter :filterable-keys="filterableKeys" :column-labels="columnLabels" :filters="filters"
                    :column-options="columnOptions" :results-count="pagination.to" :results-total="pagination.total"
                    @clear-all="clearFilters()" />
            </div>

            <!-- CONTENU PRINCIPAL -->
            <div class="flex flex-col flex-1 min-w-0">
                <!-- INDICATEUR DE CHARGEMENT -->
                <div v-if="loading" class="p-16 flex flex-col items-center justify-center gap-3 text-gray-500">
                    <Loader2 :size="32" class="animate-spin text-primary" />
                    <span class="text-sm">{{ locale === 'en' ? 'Loading checklists...' : 'Chargement des checklists...' }}</span>
                </div>

                <!-- AUCUN RÉSULTAT -->
                <div v-else-if="!data || data.length === 0" class="p-16 flex flex-col items-center justify-center text-center">
                    <div class="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mb-4">
                        <ClipboardList :size="28" />
                    </div>
                    <h5 class="text-gray-700 font-semibold mb-1">{{ locale === 'en' ? 'No checklists recorded' : 'Aucune checklist enregistrée' }}</h5>
                    <p class="text-sm text-gray-500 max-w-sm">
                        {{ locale === 'en' ? 'No inspection matches the selected filter criteria.' : 'Aucune inspection ne correspond aux critères de filtre sélectionnés.' }}
                    </p>
                    <div class="flex gap-2 mt-4">
                        <button
                            v-if="search || filters.type.length || filters.status.length || filters.inspector.length || dateRange.from || dateRange.to"
                            @click="clearFilters"
                            class="px-4 py-2 text-xs font-medium text-primary bg-primary/10 rounded-lg hover:bg-primary/20 transition">
                            {{ t('common.reset_filters') }}
                        </button>
                        <button
                            @click="openAddModal"
                            class="px-4 py-2 text-xs font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition">
                            {{ locale === 'en' ? 'Create a checklist' : 'Créer une checklist' }}
                        </button>
                    </div>
                </div>

                <!-- TABLEAU -->
                <div v-else class="transition-all w-full">
                    <table>
                        <thead>
                            <tr>
                                <th class="w-16 text-center">{{ t('table.ref') }}</th>
                                <th>{{ t('table.title') }}</th>
                                <th>{{ t('table.site') }}</th>
                                <th>{{ t('table.location') }}</th>
                                <th>{{ t('table.status') }}</th>
                                <th>{{ t('table.date') }}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item, index) in data" :key="index" @click="selected_checklist = item"
                                @contextmenu.prevent="contextMenu.contextMenu = $event; contextMenu.isOpen = true; contextMenu.checklist = item"
                                :class="selected_checklist?.id == item.id ? 'bg-primary/10 font-medium' : ''"
                                class="cursor-pointer">
                                <td class="font-mono text-xs text-gray-400 text-center">#{{ item.id }}</td>
                                <td class="font-medium text-gray-900">{{ item.title }}</td>
                                <td class="truncate max-w-70 text-gray-700">{{ item.site }}</td>
                                <td class="text-gray-500">{{ item.location ? item.location : '-' }}</td>
                                <td>
                                    <ChecklistStatus :name="item.status" />
                                </td>
                                <td class="text-gray-500 font-mono text-xs">{{ item.date + ' ' + item.time }}</td>
                            </tr>
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colspan="6" class="w-full p-4 border-t border-gray-200">
                                    <div class="flex flex-row items-center justify-between text-sm">
                                        <span class="text-xs text-gray-500 font-medium">
                                            {{ t('common.displaying') }} {{ pagination.to }} {{ t('common.of') }} {{ pagination.total }} checklists
                                        </span>
                                        <vue-awesome-paginate @click="(page: number) => { pagination.current_page = page }"
                                            :hide-prev-next-when-ends="true" :total-items="pagination.total" :items-per-page="15"
                                            :max-pages-shown="4" v-model="pagination.current_page"></vue-awesome-paginate>
                                    </div>
                                </td>
                            </tr>
                        </tfoot>
                    </table>

                </div>
            </div>

            <ContextMenuUI v-model="contextMenu.isOpen" :context-menu="contextMenu.contextMenu"
                :actions="context_menu_actions" />
        </div>

        <!-- ======================= DRAWER LATÉRAL ======================= -->
        <aside v-if="selected_checklist" aria-label="Aperçu de la checklist"
            class="bg-white border-l border-gray-200 overflow-y-auto overflow-x-hidden h-screen sticky top-0 scrollbar-hide transition-all shadow-xl z-20 shrink-0 w-[400px] min-w-[400px] max-w-[400px] p-5">
            <!-- HEADER DU VOLET -->
            <div class="pb-4 border-b border-gray-200">
                <div class="flex items-start justify-between gap-3">
                    <div class="min-w-0 flex-1">
                        <p class="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                            {{ locale === 'en' ? 'Checklist #' : 'Checklist n°' }} {{ selected_checklist?.id }}
                        </p>
                        <h4 class="mt-1 font-bold text-gray-900 truncate">
                            {{ selected_checklist?.title }}
                        </h4>
                        <div class="mt-2.5">
                            <ChecklistStatus :name="selected_checklist.status" />
                        </div>
                    </div>

                    <button
                        type="button"
                        :aria-label="t('common.close')"
                        class="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
                        @click="selected_checklist = undefined">
                        <XIcon :size="18" />
                    </button>
                </div>
            </div>

            <!-- CARTOGRAPHIE DE L'EMPLACEMENT DU SITE -->
            <SidebarLocationMap
                class="mt-4"
                :site-name="selected_checklist.location || selected_checklist.site"
                :location-name="selected_checklist.location"
                :latitude="selected_checklist.site_location?.latitude"
                :longitude="selected_checklist.site_location?.longitude"
                :locality="selected_checklist.site_location?.locality"
                :province="selected_checklist.site_location?.province"
                :status="selected_checklist.status"
            />

            <!-- DESCRIPTION -->

            <div class="
                mt-5
                rounded-xl
                border
                border-primary/20
                bg-primary/5
                p-4
            ">
                <p class="
                    text-sm
                    text-gray-700
                ">
                    {{
                        selected_checklist?.description ||
                        t('common.no_description')
                    }}
                </p>
            </div>

            <!-- KPI -->

            <div class="
                mt-5
                grid
                grid-cols-3
                gap-3
            ">
                <div class="
                    rounded-xl
                    bg-slate-50
                    p-3
                    text-center
                ">
                    <p class="
                        text-xs
                        text-gray-500
                    ">
                        {{ t('common.sections') }}
                    </p>

                    <h5>
                        {{
                            selected_checklist?.sections
                                ?.length
                        }}
                    </h5>
                </div>

                <div class="
                    rounded-xl
                    bg-slate-50
                    p-3
                    text-center
                ">
                    <p class="
                        text-xs
                        text-gray-500
                    ">
                        {{ t('common.questions') }}
                    </p>

                    <h5>
                        {{
                            selected_checklist?.sections?.reduce(
                                (total, section) => total + (section.items?.length ?? 0),
                                0
                            ) ?? 0
                        }}
                    </h5>
                </div>

                <div class="
                    rounded-xl
                    bg-slate-50
                    p-3
                    text-center
                ">
                    <p class="
                        text-xs
                        text-gray-500
                    ">
                        {{ t('common.actions') }}
                    </p>

                    <h5>
                        {{
                            selected_checklist?.sections ? selected_checklist?.sections
                                ?.flatMap(
                                    section =>
                                        section ? section.items : [],
                                )
                                .filter(
                                    item =>
                                        item ? item.action : undefined,
                                ).length : 0
                        }}
                    </h5>
                </div>
            </div>

            <!-- INFORMATIONS -->

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
                    {{ t('common.general_info') }}
                </h6>

                <div class="
                    flex
                    flex-col
                    gap-4
                ">
                    <div>
                        <p class="
                            text-xs
                            text-gray-500
                        ">
                            {{ t('table.type') }}
                        </p>

                        <p>
                            {{
                                selected_checklist?.type
                            }}
                        </p>
                    </div>

                    <div>
                        <p class="
                            text-xs
                            text-gray-500
                        ">
                            {{ t('table.site') }}
                        </p>

                        <p>
                            {{
                                selected_checklist?.site
                            }}
                        </p>
                    </div>

                    <div>
                        <p class="
                            text-xs
                            text-gray-500
                        ">
                            {{ t('table.location') }}
                        </p>

                        <p>
                            {{
                                selected_checklist?.location
                            }}
                        </p>
                    </div>

                    <div>
                        <p class="
                            text-xs
                            text-gray-500
                        ">
                            {{ t('table.date') }}
                        </p>

                        <p>
                            {{
                                selected_checklist?.date
                            }}
                        </p>
                    </div>

                    <div>
                        <p class="
                            text-xs
                            text-gray-500
                        ">
                            {{ t('table.time') }}
                        </p>

                        <p>
                            {{
                                selected_checklist?.time
                            }}
                        </p>
                    </div>
                </div>
            </div>

            <!-- RESPONSABLES -->

            <div class="
                mt-6
                border-t
                border-gray-200
                pt-5
            ">
                <h6 class="mb-4">
                    {{ t('common.stakeholders') }}
                </h6>

                <div class="
                    flex
                    flex-col
                    gap-4
                ">
                    <div>
                        <p class="
                            text-xs
                            text-gray-500
                        ">
                            {{ t('table.inspector') }}
                        </p>

                        <p>
                            {{
                                selected_checklist?.inspector
                                    ? (typeof selected_checklist.inspector === 'object'
                                        ? `${selected_checklist.inspector.first_name || ''} ${selected_checklist.inspector.last_name || ''}`.trim() || t('common.not_assigned')
                                        : selected_checklist.inspector)
                                    : t('common.not_assigned')
                            }}
                        </p>
                    </div>

                    <div>
                        <p class="
                            text-xs
                            text-gray-500
                        ">
                            {{ t('common.accompanying') }}
                        </p>

                        <p>
                            {{
                                selected_checklist?.accompanying_person ||
                                "-"
                            }}
                        </p>
                    </div>

                    <div>
                        <p class="
                            text-xs
                            text-gray-500
                        ">
                            {{ t('common.manager') }}
                        </p>

                        <p>
                            {{
                                selected_checklist?.manager
                            }}
                        </p>
                    </div>

                    <div>
                        <p class="
                            text-xs
                            text-gray-500
                        ">
                            {{ t('common.contact') }}
                        </p>

                        <p>
                            {{
                                selected_checklist?.contact
                            }}
                        </p>
                    </div>
                </div>
            </div>

            <!-- COMMENTAIRE -->

            <div v-if="
                selected_checklist?.comment
            " class="
                mt-6
                border-t
                border-gray-200
                pt-5
            ">
                <h6 class="mb-3">
                    {{ t('common.comment') }}
                </h6>

                <div class="
                    rounded-xl
                    bg-slate-50
                    p-4
                ">
                    {{
                        selected_checklist.comment
                    }}
                </div>
            </div>

            <!-- ACTIONS -->

            <div class="
                mt-6
                border-t
                border-gray-200
                pt-5
            ">
                <div class="
                    flex
                    flex-col
                    gap-2
                ">
                    <Button class="w-full" @click="
                        router.push({
                            name: 'CHECKLIST_DETAILS',
                            params: {
                                id: selected_checklist?.id,
                            },
                        })
                        ">
                        {{ locale === 'en' ? 'View checklist' : 'Voir la checklist' }}
                    </Button>

                    <Button variant="outline" class="w-full" @click="router.push({ name: 'ACTION' })">
                        {{ locale === 'en' ? 'View actions' : 'Voir les actions' }}
                    </Button>
                </div>
            </div>
        </aside>

        <CenterModal
            :is-open="modal_delete"
            :title="locale === 'en' ? 'Delete checklist?' : 'Supprimer la checklist ?'"
            confirm-variant="danger"
            :confirm-loading="loading_delete"
            @close="modal_delete = false"
            @confirm="deleteChecklist"
        >
            <p class="text-sm text-gray-600">
                {{ locale === 'en' ? 'Are you sure you want to permanently delete inspection' : 'Êtes-vous sûr de vouloir supprimer définitivement l\'inspection' }}
                <strong>« {{ item_to_delete?.title || ('#' + item_to_delete?.id) }} »</strong> ?
                {{ locale === 'en' ? 'This action will also delete all associated checks and actions.' : 'Cette action supprimera également tous les contrôles et actions associés.' }}
            </p>
        </CenterModal>

        <!-- ========================================================= -->
        <!-- MODAL NOUVELLE INSPECTION CHECKLIST (IN-PAGE MODAL)        -->
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
                                    <ClipboardCheck :size="18" />
                                </div>
                                <div>
                                    <h4 class="text-sm font-bold text-gray-900">
                                        {{ locale === 'en' ? 'New inspection checklist' : 'Planifier une nouvelle checklist' }}
                                    </h4>
                                    <p class="text-[11px] text-gray-500">
                                        {{ locale === 'en' ? 'Select template type, site and assign an inspector.' : 'Sélectionnez le type d\'audit, le site et l\'inspecteur assigné.' }}
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
                        <form @submit.prevent="submitAddChecklist" class="flex flex-col flex-1 overflow-y-auto">
                            <div class="p-5 space-y-4">
                                <!-- Type d'inspection -->
                                <div>
                                    <label class="block text-xs font-semibold text-gray-700 mb-1">
                                        {{ locale === 'en' ? 'Checklist template / Type' : 'Type de checklist / Audit' }} <span class="text-red-500">*</span>
                                    </label>
                                    <select
                                        v-model="newChecklistForm.type"
                                        required
                                        @change="onChecklistTypeChange"
                                        class="w-full h-9 px-3 rounded-lg border border-gray-300 text-xs focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none bg-white transition cursor-pointer"
                                    >
                                        <option value="" disabled>{{ locale === 'en' ? 'Select checklist type...' : 'Sélectionner un type de checklist...' }}</option>
                                        <option v-for="t in dynamicTypes" :key="t.value" :value="t.value">{{ t.label }}</option>
                                    </select>
                                </div>

                                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                    <!-- Site / Station -->
                                    <div>
                                        <label class="block text-xs font-semibold text-gray-700 mb-1">
                                            {{ locale === 'en' ? 'Galana Site / Station' : 'Site / Station Galana' }} <span class="text-red-500">*</span>
                                        </label>
                                        <select
                                            v-model="newChecklistForm.site"
                                            required
                                            class="w-full h-9 px-3 rounded-lg border border-gray-300 text-xs focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none bg-white transition cursor-pointer"
                                        >
                                            <option value="" disabled>{{ locale === 'en' ? 'Select site...' : 'Sélectionner un site...' }}</option>
                                            <option v-for="s in dynamicSites" :key="s.value" :value="s.value">{{ s.label }}</option>
                                        </select>
                                    </div>

                                    <!-- Inspecteur assigné -->
                                    <div>
                                        <label class="block text-xs font-semibold text-gray-700 mb-1">
                                            {{ locale === 'en' ? 'Assigned inspector' : 'Inspecteur assigné' }}
                                        </label>
                                        <select
                                            v-model="newChecklistForm.inspector_id"
                                            class="w-full h-9 px-3 rounded-lg border border-gray-300 text-xs focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none bg-white transition cursor-pointer"
                                        >
                                            <option :value="undefined">{{ locale === 'en' ? 'Default (Unassigned / Yourself)' : 'Par défaut (Non assigné / Vous-même)' }}</option>
                                            <option v-for="usr in users" :key="usr.id" :value="usr.id">
                                                {{ usr.first_name ? (usr.first_name + ' ' + (usr.last_name || '')).trim() : (usr.name || usr.email) }} {{ usr.job ? '(' + usr.job + ')' : '' }}
                                            </option>
                                        </select>
                                    </div>
                                </div>

                                <!-- Localisation précise -->
                                <div>
                                    <label class="block text-xs font-semibold text-gray-700 mb-1">
                                        {{ locale === 'en' ? 'Precise location / Zone' : 'Localisation précise / Zone' }}
                                    </label>
                                    <input
                                        v-model="newChecklistForm.location"
                                        type="text"
                                        :placeholder="locale === 'en' ? 'Ex: Piste de distribution, Boutique, Dépôt...' : 'Ex: Piste de distribution, Boutique, Dépôt...'"
                                        class="w-full h-9 px-3 rounded-lg border border-gray-300 text-xs focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition"
                                    />
                                </div>

                                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                    <!-- Date -->
                                    <div>
                                        <label class="block text-xs font-semibold text-gray-700 mb-1">
                                            {{ locale === 'en' ? 'Date' : 'Date de contrôle' }} <span class="text-red-500">*</span>
                                        </label>
                                        <input
                                            v-model="newChecklistForm.date"
                                            type="date"
                                            required
                                            class="w-full h-9 px-3 rounded-lg border border-gray-300 text-xs focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition"
                                        />
                                    </div>

                                    <!-- Heure -->
                                    <div>
                                        <label class="block text-xs font-semibold text-gray-700 mb-1">
                                            {{ locale === 'en' ? 'Time' : 'Heure de contrôle' }} <span class="text-red-500">*</span>
                                        </label>
                                        <input
                                            v-model="newChecklistForm.time"
                                            type="time"
                                            required
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
                                    :disabled="loading_add || !newChecklistForm.type || !newChecklistForm.site || !newChecklistForm.date || !newChecklistForm.time"
                                    class="px-5 py-2 text-xs font-semibold text-white bg-primary hover:bg-primary/90 rounded-lg shadow-xs transition flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                                >
                                    <Loader2 v-if="loading_add" :size="13" class="animate-spin" />
                                    <span>{{ locale === 'en' ? 'Create Inspection' : 'Créer l\'inspection' }}</span>
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
    import { ClipboardList, Download, Edit, Eye, LayoutTemplateIcon, Loader2, Plus, RefreshCw, Search, Trash2, UploadCloud, X as XIcon } from '@lucide/vue';
    import { useI18n } from 'vue-i18n';
    import Header from '../../../components/shared/Header.vue';
    import Button from '../../../components/ui/Button.vue';
    import { computed, onMounted, ref, watch, type ComputedRef } from 'vue';

    import { ChecklistsData, ChecklistStatusJsonData, ChecklistTypeData, SiteTypeDataJson } from '../../../@data/Checklist.data.ts';
    import { useTemplateService } from '../../../core/services/template.service.ts';
    import { useUserService } from '../../../core/services/user.service.ts';
    import type { CheckllistFormType } from '../../../@types/Checklist.type.ts';
    import ChecklistStatus from '../../../components/features/checklist/ChecklistStatus.vue';
    import SidebarLocationMap from '../../../components/shared/SidebarLocationMap.vue';
    import { router } from '../../../router/index.ts';
    import { useRoute } from 'vue-router';
    import type { ChecklistFilterType, Checklistype } from '../../../@types/Checklist.type.ts';
    import type { ContextMenuActionType, contextMenuType } from '../../../@types/ContextMenu.type.ts';
    import ContextMenuUI from '../../../components/ui/ContextMenuUI.vue';
    import ButtonFilter from '../../../components/ui/ButtonFilter.vue';
    import InputFilter from '../../../components/ui/InputFilter.vue';
    import ChipFilter from '../../../components/ui/ChipFilter.vue';
    import { useChecklistService } from '../../../core/services/checklist.service.ts';
    import siteService from '../../../core/services/site.service.ts';
    import CenterModal from '../../../components/ui/centerModal.vue';
    import { exportUtils } from '../../../core/utils/export.utils.ts';
    import { toast } from 'vue3-toastify';

    const { t, locale } = useI18n()
    const route = useRoute()
    const data = ref<Checklistype[]>()
    const loading = ref(false)
    const loading_export = ref(false)
    const modal_delete = ref(false)
    const loading_delete = ref(false)

    const item_to_delete = ref<Checklistype | null>(null)

    const modal_add = ref(false)
    const loading_add = ref(false)
    const users = ref<any[]>([])
    const templateService = useTemplateService()
    const userService = useUserService()
    const dynamicTypes = ref<{ label: string; value: string; site?: string }[]>([...ChecklistTypeData])
    const dynamicSites = ref<{ label: string; value: string }[]>([...SiteTypeDataJson])

    const newChecklistForm = ref<CheckllistFormType>({
        type: undefined,
        site: undefined,
        location: '',
        inspector_id: undefined,
        date: '',
        time: ''
    })

    function openAddModal() {
        const now = new Date()
        const todayStr = now.toISOString().split('T')[0]
        const timeStr = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
        newChecklistForm.value = {
            type: dynamicTypes.value[0]?.value || undefined,
            site: dynamicSites.value[0]?.value || undefined,
            location: '',
            inspector_id: undefined,
            date: todayStr,
            time: timeStr
        }
        modal_add.value = true
        loadTemplatesAndUsers()
    }

    function onChecklistTypeChange() {
        const found = dynamicTypes.value.find(item => newChecklistForm.value.type === item.value)
        if (found?.site) {
            newChecklistForm.value.site = found.site as any
        }
    }

    function loadTemplatesAndUsers() {
        if (users.value.length === 0) {
            userService.index()
                .then((res: any) => {
                    users.value = res.data?.data || res.data || []
                })
                .catch((err: any) => console.error('Erreur chargement utilisateurs:', err))
        }

        templateService.index()
            .then(res => {
                if (res.data?.data && res.data.data.length > 0) {
                    dynamicTypes.value = res.data.data.map((tpl: any) => ({
                        label: tpl.title,
                        value: tpl.type || tpl.title,
                        site: tpl.site
                    }))
                }
            })
            .catch(err => console.error(err))

        checklistService.getFilters()
            .then(res => {
                if (res.data?.type && res.data.type.length > 0) {
                    for (const ft of res.data.type) {
                        if (!dynamicTypes.value.some(dt => dt.value === ft)) {
                            dynamicTypes.value.push({ label: ft, value: ft })
                        }
                    }
                }
                if (res.data?.site && res.data.site.length > 0) {
                    for (const ss of res.data.site) {
                        if (!dynamicSites.value.some(ds => ds.value === ss)) {
                            dynamicSites.value.push({ label: ss, value: ss })
                        }
                    }
                }
            })
            .catch(err => console.error(err))

        siteService.all()
            .then(res => {
                const sList = res.data?.data || res.data || []
                for (const s of sList) {
                    if (s.name && !dynamicSites.value.some(ds => ds.value === s.name)) {
                        dynamicSites.value.push({ label: s.name, value: s.name })
                    }
                }
            })
            .catch(() => {})
    }

    async function submitAddChecklist() {
        if (!newChecklistForm.value.type || !newChecklistForm.value.site || !newChecklistForm.value.date || !newChecklistForm.value.time) return
        loading_add.value = true
        try {
            await checklistService.store(newChecklistForm.value)
            toast.success(locale.value === 'en' ? 'Inspection created successfully!' : 'Inspection créée avec succès !')
            modal_add.value = false
            fetchData()
        } catch (err: any) {
            const errorMsg = err.response?.data?.message || (locale.value === 'en' ? 'Failed to create inspection.' : 'Erreur lors de la création de l\'inspection.')
            toast.error(errorMsg)
        } finally {
            loading_add.value = false
        }
    }


    const pagination = ref({
        current_page: 1,
        total: 0,
        to: 0
    })
    const selected_checklist = ref<Checklistype>()
    const contextMenu = ref<{
        isOpen: boolean,
        contextMenu?: contextMenuType,
        checklist?: Checklistype,
    }>({
        isOpen: false,
    })

    const context_menu_actions: ComputedRef<ContextMenuActionType[]> = computed(() => [
        {
            label: "Détails & Rapport",
            icon: Eye,
            onClick: () => {
                if (contextMenu.value.checklist?.id) {
                    router.push({
                        name: 'CHECKLIST_DETAILS',
                        params: { id: contextMenu.value.checklist.id }
                    })
                }
            }
        },
        {
            label: "Télécharger rapport (PDF)",
            icon: Download,
            onClick: () => {
                if (contextMenu.value.checklist?.id) {
                    router.push({
                        name: 'CHECKLIST_DETAILS',
                        params: { id: contextMenu.value.checklist.id }
                    })
                }
            }
        },
        {
            label: "Modifier",
            variant: 'WARNING',
            icon: Edit,
            onClick: () => {
                if (contextMenu.value.checklist?.id) {
                    router.push({
                        name: 'CHECKLIST_DETAILS',
                        params: { id: contextMenu.value.checklist.id }
                    })
                }
            }
        },
        {
            label: "Supprimer",
            variant: 'DANGER',
            icon: Trash2,
            onClick: () => {
                if (contextMenu.value.checklist) {
                    item_to_delete.value = contextMenu.value.checklist;
                    modal_delete.value = true;
                }
            }
        }
    ])
    const filterableKeys: string[] = ['type', 'status', 'inspector']
    const columnLabels: Record<string, string> = {
        'type': 'Type',
        'status': 'Status',
        'inspector': 'Inspecteur',
    }
    const dateRange = ref<Record<string, string>>({
        from: '',
        to: ''
    })
    const search = ref<string>()
    const filters = ref<Record<string, string[]>>({
        'type': [],
        'status': [],
        'inspector': [],

    })
    const columnOptions = ref<Record<string, string[]>>({
        'type': [],
        'status': ChecklistStatusJsonData.map(item => item.label),
        'inspector': []
    })
    const checklistService = useChecklistService()
    function fetchData(params?: ChecklistFilterType) {
        loading.value = true
        checklistService.index(params)
            .then(res => {
                pagination.value.total = res.data.meta.total
                pagination.value.to = res.data.meta.to
                data.value = res.data.data
            })
            .catch(err => { console.error(err) })
            .finally(() => {
                loading.value = false
            })
    }
    function fetchFilters() {
        checklistService.getFilters()
            .then(res => {
                // console.log(res.data)
                columnOptions.value.type = res.data.type
                columnOptions.value.inspector = res.data.inspector
            })
            .catch(err => {
                console.error(err)
            })
    }
    function clearFilters() {
        filters.value.type = []
        filters.value.status = []
        filters.value.inspector = []
        search.value = ''
        dateRange.value.from = ''
        dateRange.value.to = ''
    }
    onMounted(() => {
        if (route.query.site) {
            search.value = String(route.query.site)
        } else if (route.query.search) {
            search.value = String(route.query.search)
        }
        fetchFilters()
        fetchData({
            search: search.value,
        })
    })
    watch(() => route.query, (newQ) => {
        if (newQ.site || newQ.search) {
            search.value = String(newQ.site || newQ.search)
        }
    })
    watch([
        filters.value, () => search.value, dateRange.value
    ], () => {



        fetchData({
            page: 1,
            search: search.value,
            status: filters.value.status.map(item => ChecklistStatusJsonData.find(i => i.label == item)?.value) as string[],
            type: filters.value.type,
            inspector: filters.value.inspector,
            date: dateRange.value
        })
    }, {
        immediate: false
    })

    async function handleExport() {
        loading_export.value = true
        try {
            const params: any = {
                search: search.value,
                status: filters.value.status.map(item => ChecklistStatusJsonData.find(i => i.label == item)?.value) as string[],
                type: filters.value.type,
                inspector: filters.value.inspector,
            }
            const res = await checklistService.export(params)
            const items = res.data?.data || []
            if (items.length === 0) {
                toast.info("Aucune donnée à exporter")
                return
            }

            const exportFields = [
                { key: 'Ref', excelName: 'Référence' },
                { key: 'Date', excelName: 'Date' },
                { key: 'Titre', excelName: 'Titre de l\'inspection' },
                { key: 'Type', excelName: 'Type' },
                { key: 'Site', excelName: 'Site' },
                { key: 'Lieu', excelName: 'Lieu' },
                { key: 'Inspecteur', excelName: 'Inspecteur' },
                { key: 'Statut', excelName: 'Statut' },
                { key: 'Conformite', excelName: 'Taux de conformité' },
            ]

            exportUtils(
                items,
                exportFields,
                () => toast.success("Export des checklists réussi"),
                () => toast.error("Erreur lors de l'export"),
                "checklists_hsse"
            )
        } catch (e) {
            console.error("Erreur export checklist:", e)
            toast.error("Impossible d'exporter les checklists")
        } finally {
            loading_export.value = false
        }
    }

    async function deleteChecklist() {
        if (!item_to_delete.value?.id) return
        loading_delete.value = true
        try {
            await checklistService.destroy(item_to_delete.value.id)
            toast.success("Inspection supprimée avec succès")
            modal_delete.value = false
            item_to_delete.value = null
            fetchData()
        } catch (e) {
            console.error("Erreur suppression checklist:", e)
            toast.error("Impossible de supprimer la checklist")
        } finally {
            loading_delete.value = false
        }
    }

</script>
