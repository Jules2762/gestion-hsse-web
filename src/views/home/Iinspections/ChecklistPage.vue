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
                        <ButtonFilter :text="locale === 'en' ? 'Add' : 'Ajouter'" :icon="Plus" is-primary @click="openAddModal" />
                        <ButtonFilter :text="locale === 'en' ? 'Import' : 'Importer'" :icon="UploadCloud" />
                        <ButtonFilter :text="locale === 'en' ? 'Export' : 'Export'" :icon="Download" :badge="String(pagination.total)" :loading="loading_export" @click="handleExport" />
                        <ButtonFilter :text="locale === 'en' ? 'Refresh' : 'Actualiser'" :icon="RefreshCw" :loading="loading" @click="fetchData()" />
                        <ButtonFilter :text="locale === 'en' ? 'Templates' : 'Modèles'" :icon="LayoutTemplateIcon" @click="router.push({
                            name: 'TEMPLATE'
                        })" />
                    </div>
                    <div class="flex flex-row items-center gap-2">
                        <InputFilter :icon="Search" :placeholder="locale === 'en' ? 'Search a checklist...' : 'Rechercher une checklist...'" v-model="search" />
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
                :site-type="selected_checklist.type || selected_checklist.site"
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

                    <Button variant="outline" class="w-full flex items-center justify-center gap-2" @click="openEditChecklistModal(selected_checklist)">
                        <Edit :size="15" />
                        <span>{{ locale === 'en' ? 'Edit inspection info' : 'Modifier les infos' }}</span>
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
                        class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl sm:max-w-3xl max-h-[92vh] flex flex-col overflow-hidden border border-gray-200 animate-in fade-in zoom-in-95 duration-200"
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
                                    <!-- Type de site / Cible -->
                                    <div>
                                        <label class="block text-xs font-semibold text-gray-700 mb-1">
                                            {{ locale === 'en' ? 'Target / Site Category' : 'Type de site / Cible' }} <span class="text-red-500">*</span>
                                        </label>
                                        <select
                                            v-model="newChecklistForm.site_type"
                                            required
                                            @change="onSiteTypeChange"
                                            class="w-full h-9 px-3 rounded-lg border border-gray-300 text-xs focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none bg-white transition cursor-pointer font-medium"
                                        >
                                            <option v-for="st in siteCategories" :key="st.value" :value="st.value">
                                                {{ st.label }}
                                            </option>
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

                                <!-- ======================================================== -->
                                <!-- CAS 1: SITE FIXE / STATION SERVICE / MAGASIN / AGENCE    -->
                                <!-- Choix par liste car cartographie déjà enregistrée        -->
                                <!-- ======================================================== -->
                                <div v-if="!isCartographyRequired" class="space-y-2">
                                    <div>
                                        <div class="flex items-center justify-between mb-1">
                                            <label class="block text-xs font-semibold text-gray-700">
                                                {{ locale === 'en' ? 'Galana Station / Site (registered list)' : 'Sélectionner la Station / le Site Galana' }} <span class="text-red-500">*</span>
                                            </label>
                                            <span v-if="registeredSites.length" class="text-[10px] text-gray-400">
                                                {{ filteredRegisteredSites.length }} / {{ registeredSites.length }} {{ locale === 'en' ? 'stations' : 'stations' }}
                                            </span>
                                        </div>

                                        <!-- Champ de recherche / filtrage rapide de la station -->
                                        <div class="relative mb-1.5">
                                            <Search class="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" :size="13" />
                                            <input
                                                v-model="stationSearchQuery"
                                                type="text"
                                                :placeholder="locale === 'en' ? 'Filter station by name, locality, province...' : 'Filtrer par nom de station, localité, province...'"
                                                class="w-full h-8 pl-8 pr-7 text-xs rounded-lg border border-gray-200 bg-slate-50/80 focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition"
                                            />
                                            <button
                                                v-if="stationSearchQuery"
                                                type="button"
                                                @click="stationSearchQuery = ''"
                                                class="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5 rounded cursor-pointer"
                                            >
                                                <XIcon :size="12" />
                                            </button>
                                        </div>

                                        <select
                                            :value="newChecklistForm.site"
                                            required
                                            @change="onRegisteredSiteChange"
                                            class="w-full h-9 px-3 rounded-lg border border-gray-300 text-xs focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none bg-white transition cursor-pointer font-medium"
                                        >
                                            <option value="" disabled>{{ locale === 'en' ? 'Select a registered site...' : 'Sélectionner un site enregistré...' }}</option>
                                            <option v-for="s in filteredRegisteredSites" :key="s.name" :value="s.name">
                                                {{ s.name }} {{ s.locality ? '— ' + s.locality : '' }} {{ s.province ? '(' + s.province + ')' : '' }}
                                            </option>
                                        </select>
                                    </div>

                                    <!-- Badge info station enregistrée avec cartographie -->
                                    <div
                                        v-if="selectedRegisteredSiteInfo"
                                        class="p-2.5 rounded-xl bg-emerald-50/80 border border-emerald-200 text-xs text-emerald-900 flex items-center justify-between gap-2"
                                    >
                                        <div class="flex items-center gap-2 min-w-0">
                                            <div class="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                                                <MapPin :size="13" />
                                            </div>
                                            <div class="min-w-0">
                                                <span class="font-bold text-xs truncate block">{{ selectedRegisteredSiteInfo.name }}</span>
                                                <span class="text-[11px] text-emerald-700">
                                                    {{ selectedRegisteredSiteInfo.locality || 'Madagascar' }}
                                                    <template v-if="selectedRegisteredSiteInfo.province"> • {{ selectedRegisteredSiteInfo.province }}</template>
                                                </span>
                                            </div>
                                        </div>
                                        <div class="text-[10px] font-mono text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded-md shrink-0 flex items-center gap-1">
                                            <CheckCircle2 :size="11" class="text-emerald-600" />
                                            <span v-if="selectedRegisteredSiteInfo.latitude && selectedRegisteredSiteInfo.longitude">
                                                GPS : {{ Number(selectedRegisteredSiteInfo.latitude).toFixed(4) }}, {{ Number(selectedRegisteredSiteInfo.longitude).toFixed(4) }}
                                            </span>
                                            <span v-else>{{ locale === 'en' ? 'Registered site' : 'Cartographie enregistrée' }}</span>
                                        </div>
                                    </div>
                                </div>

                                <!-- ======================================================== -->
                                <!-- CAS 2: VEHICULE, CAMION CITERNE (CC), B2B               -->
                                <!-- Input spécifique + Choix cartographique interactif       -->
                                <!-- ======================================================== -->
                                <div v-else class="space-y-3">
                                    <!-- Input site / cible -->
                                    <div>
                                        <label class="block text-xs font-semibold text-gray-700 mb-1">
                                            <template v-if="newChecklistForm.site_type === 'VEHICULE'">
                                                {{ locale === 'en' ? 'Vehicle License Plate / Identifier' : 'Immatriculation / Réf. du véhicule' }} <span class="text-gray-400 font-normal">({{ locale === 'en' ? 'Optional' : 'Optionnel' }})</span>
                                            </template>
                                            <template v-else-if="newChecklistForm.site_type === 'CAMION CITERNE'">
                                                {{ locale === 'en' ? 'Tanker Truck Number / License Plate' : 'Numéro / Immatriculation Camion Citerne (CC)' }} <span class="text-gray-400 font-normal">({{ locale === 'en' ? 'Optional' : 'Optionnel' }})</span>
                                            </template>
                                            <template v-else-if="newChecklistForm.site_type === 'B2B'">
                                                {{ locale === 'en' ? 'Client Name / B2B Installation' : 'Nom du client / Site client B2B' }} <span class="text-red-500">*</span>
                                            </template>
                                            <template v-else>
                                                {{ locale === 'en' ? 'Site / Identifier' : 'Désignation du site / Cible' }} <span class="text-red-500">*</span>
                                            </template>
                                        </label>
                                        <input
                                            v-model="newChecklistForm.site"
                                            type="text"
                                            :required="newChecklistForm.site_type !== 'VEHICULE' && newChecklistForm.site_type !== 'CAMION CITERNE'"
                                            :placeholder="
                                                newChecklistForm.site_type === 'VEHICULE'
                                                    ? 'Ex: Toyota Hilux - 1234 TAB (optionnel)'
                                                    : newChecklistForm.site_type === 'CAMION CITERNE'
                                                    ? 'Ex: Camion Citerne CC-04 / 5678 WWT (optionnel)'
                                                    : 'Ex: Client B2B - Usine Star Antsirabe'
                                            "
                                            class="w-full h-9 px-3 rounded-lg border border-gray-300 text-xs focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition"
                                        />
                                    </div>

                                    <!-- Choix cartographique interactif -->
                                    <div class="rounded-xl border border-gray-200 bg-slate-50/70 p-3 flex flex-col gap-2">
                                        <div class="flex items-center justify-between gap-2">
                                            <div class="flex items-center gap-1.5 text-xs font-bold text-gray-800">
                                                <MapPin :size="15" class="text-primary" />
                                                <span>{{ locale === 'en' ? 'Cartography location selection' : 'Choix cartographie de l\'inspection' }}</span>
                                                <span class="text-[10px] font-semibold text-primary bg-primary/10 border border-primary/20 px-1.5 py-0.2 rounded-full">
                                                    {{ locale === 'en' ? 'Click on map' : 'Cliquer sur la carte' }}
                                                </span>
                                            </div>
                                            <div v-if="newChecklistForm.latitude && newChecklistForm.longitude" class="text-[11px] font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                                                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                                <span>{{ Number(newChecklistForm.latitude).toFixed(4) }}, {{ Number(newChecklistForm.longitude).toFixed(4) }}</span>
                                            </div>
                                            <span v-else class="text-[10px] text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
                                                {{ locale === 'en' ? 'Point on map' : 'Pointer l\'emplacement' }}
                                            </span>
                                        </div>
                                        <p class="text-[11px] text-gray-500">
                                            {{ locale === 'en'
                                                ? 'Click on the map or search a city/quarter to pinpoint the inspection location for this vehicle, tanker truck or B2B site.'
                                                : 'Cliquez sur la carte ou recherchez la localité pour définir la position cartographique exacte du contrôle.'
                                            }}
                                        </p>

                                        <LocationPickerMap
                                            :latitude="newChecklistForm.latitude ?? null"
                                            :longitude="newChecklistForm.longitude ?? null"
                                            height="h-[220px]"
                                            @update:latitude="newChecklistForm.latitude = $event ?? undefined"
                                            @update:longitude="newChecklistForm.longitude = $event ?? undefined"
                                            @location-detected="onLocationPickerDetected"
                                        />
                                    </div>
                                </div>

                                <!-- Localisation précise / Zone / Détails -->
                                <div>
                                    <div class="flex items-center justify-between mb-1">
                                        <label class="block text-xs font-semibold text-gray-700">
                                            {{ locale === 'en' ? 'Precise location / Zone / Address' : 'Localisation précise / Zone / Adresse' }}
                                        </label>
                                        <button
                                            v-if="newChecklistForm.location"
                                            type="button"
                                            @click="newChecklistForm.location = ''"
                                            class="text-[10px] text-gray-400 hover:text-red-500 cursor-pointer transition"
                                        >
                                            {{ locale === 'en' ? 'Clear' : 'Effacer' }}
                                        </button>
                                    </div>
                                    <input
                                        v-model="newChecklistForm.location"
                                        type="text"
                                        :placeholder="
                                            isCartographyRequired
                                                ? 'Ex: PK 12 Route Nationale 2, Parking dépôt, Zone Industrielle...'
                                                : 'Ex: Piste de distribution, Boutique, Local technique TGBT...'
                                        "
                                        class="w-full h-9 px-3 rounded-lg border border-gray-300 text-xs focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition"
                                    />
                                    <!-- Suggestions rapides de zones (1-clic) -->
                                    <div class="mt-2 flex flex-wrap items-center gap-1.5">
                                        <span class="text-[10px] text-gray-400 font-medium mr-1">{{ locale === 'en' ? 'Quick zones:' : 'Zones types :' }}</span>
                                        <button
                                            v-for="zp in zonePresets"
                                            :key="zp"
                                            type="button"
                                            @click="applyZonePreset(newChecklistForm, zp)"
                                            :class="newChecklistForm.location === zp ? 'bg-primary text-white border-primary' : 'bg-slate-100 hover:bg-slate-200 text-gray-700 border-gray-200'"
                                            class="px-2 py-0.5 rounded-full text-[10px] border transition cursor-pointer"
                                        >
                                            {{ zp }}
                                        </button>
                                    </div>
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
                                    :disabled="loading_add || !newChecklistForm.type || (!newChecklistForm.site && newChecklistForm.site_type !== 'VEHICULE' && newChecklistForm.site_type !== 'CAMION CITERNE') || !newChecklistForm.date || !newChecklistForm.time"
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

        <!-- ========================================================= -->
        <!-- MODAL MODIFIER L'INSPECTION (EDIT CHECKLIST INFO MODAL)     -->
        <!-- ========================================================= -->
        <Teleport to="body">
            <transition name="modal-fade">
                <div
                    v-if="modal_edit"
                    class="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto"
                    @click.self="modal_edit = false"
                >
                    <div
                        class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl sm:max-w-3xl max-h-[92vh] flex flex-col overflow-hidden border border-gray-200 animate-in fade-in zoom-in-95 duration-200"
                    >
                        <!-- En-tête Modal Edit -->
                        <div class="px-5 py-3.5 bg-gradient-to-r from-amber-50 to-orange-50/50 border-b border-gray-200 flex items-center justify-between shrink-0">
                            <div class="flex items-center gap-2.5">
                                <div class="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold">
                                    <Edit :size="18" />
                                </div>
                                <div>
                                    <h4 class="text-sm font-bold text-gray-900">
                                        {{ locale === 'en' ? 'Edit Inspection Information' : 'Modifier les informations de l\'inspection' }}
                                    </h4>
                                    <p class="text-[11px] text-gray-500">
                                        Réf. #{{ editChecklistForm.id }} • {{ locale === 'en' ? 'Update inspection metadata, site, GPS location, and status.' : 'Mettez à jour les métadonnées, le site, la cartographie GPS et le statut.' }}
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                @click="modal_edit = false"
                                class="p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-white transition cursor-pointer"
                            >
                                <XIcon :size="18" />
                            </button>
                        </div>

                        <!-- Formulaire Modal Edit -->
                        <form @submit.prevent="submitEditChecklist" class="flex flex-col flex-1 overflow-y-auto">
                            <div class="p-5 space-y-4">
                                <!-- Titre de l'inspection -->
                                <div>
                                    <label class="block text-xs font-semibold text-gray-700 mb-1">
                                        {{ locale === 'en' ? 'Inspection Title' : 'Titre de l\'inspection' }} <span class="text-red-500">*</span>
                                    </label>
                                    <input
                                        v-model="editChecklistForm.title"
                                        type="text"
                                        required
                                        class="w-full h-9 px-3 rounded-lg border border-gray-300 text-xs focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition font-medium"
                                    />
                                </div>

                                <!-- Statut & Inspecteur -->
                                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                    <!-- Statut de l'inspection -->
                                    <div>
                                        <label class="block text-xs font-semibold text-gray-700 mb-1">
                                            {{ locale === 'en' ? 'Inspection Status' : 'Statut de l\'inspection' }} <span class="text-red-500">*</span>
                                        </label>
                                        <select
                                            v-model="editChecklistForm.status"
                                            required
                                            class="w-full h-9 px-3 rounded-lg border border-gray-300 text-xs focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none bg-white transition cursor-pointer font-semibold"
                                        >
                                            <option v-for="st in ChecklistStatusJsonData" :key="st.value" :value="st.value">
                                                {{ st.label }} ({{ st.value }})
                                            </option>
                                        </select>
                                    </div>

                                    <!-- Inspecteur assigné -->
                                    <div>
                                        <label class="block text-xs font-semibold text-gray-700 mb-1">
                                            {{ locale === 'en' ? 'Assigned inspector' : 'Inspecteur assigné' }}
                                        </label>
                                        <select
                                            v-model="editChecklistForm.inspector_id"
                                            class="w-full h-9 px-3 rounded-lg border border-gray-300 text-xs focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none bg-white transition cursor-pointer"
                                        >
                                            <option :value="undefined">{{ locale === 'en' ? 'Default (Unassigned / Yourself)' : 'Par défaut (Non assigné / Vous-même)' }}</option>
                                            <option v-for="usr in users" :key="usr.id" :value="usr.id">
                                                {{ usr.first_name ? (usr.first_name + ' ' + (usr.last_name || '')).trim() : (usr.name || usr.email) }} {{ usr.job ? '(' + usr.job + ')' : '' }}
                                            </option>
                                        </select>
                                    </div>
                                </div>

                                <!-- Type de site / Cible -->
                                <div>
                                    <label class="block text-xs font-semibold text-gray-700 mb-1">
                                        {{ locale === 'en' ? 'Target / Site Category' : 'Type de site / Cible' }} <span class="text-red-500">*</span>
                                    </label>
                                    <select
                                        v-model="editChecklistForm.site_type"
                                        required
                                        @change="onEditSiteTypeChange"
                                        class="w-full h-9 px-3 rounded-lg border border-gray-300 text-xs focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none bg-white transition cursor-pointer font-medium"
                                    >
                                        <option v-for="st in siteCategories" :key="st.value" :value="st.value">
                                            {{ st.label }}
                                        </option>
                                    </select>
                                </div>

                                <!-- CAS 1 EDIT: SITE FIXE / STATION SERVICE -->
                                <div v-if="!isEditCartographyRequired" class="space-y-2">
                                    <div>
                                        <div class="flex items-center justify-between mb-1">
                                            <label class="block text-xs font-semibold text-gray-700">
                                                {{ locale === 'en' ? 'Galana Station / Site (registered list)' : 'Station / Site Galana enregistré' }}
                                            </label>
                                            <span v-if="registeredSites.length" class="text-[10px] text-gray-400">
                                                {{ filteredEditRegisteredSites.length }} / {{ registeredSites.length }} {{ locale === 'en' ? 'stations' : 'stations' }}
                                            </span>
                                        </div>

                                        <!-- Champ de recherche de station en mode édition -->
                                        <div class="relative mb-1.5">
                                            <Search class="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" :size="13" />
                                            <input
                                                v-model="editStationSearchQuery"
                                                type="text"
                                                :placeholder="locale === 'en' ? 'Filter station by name, locality, province...' : 'Filtrer par nom de station, localité, province...'"
                                                class="w-full h-8 pl-8 pr-7 text-xs rounded-lg border border-gray-200 bg-slate-50/80 focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition"
                                            />
                                            <button
                                                v-if="editStationSearchQuery"
                                                type="button"
                                                @click="editStationSearchQuery = ''"
                                                class="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5 rounded cursor-pointer"
                                            >
                                                <XIcon :size="12" />
                                            </button>
                                        </div>

                                        <select
                                            :value="editChecklistForm.site"
                                            @change="onEditRegisteredSiteChange"
                                            class="w-full h-9 px-3 rounded-lg border border-gray-300 text-xs focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none bg-white transition cursor-pointer font-medium"
                                        >
                                            <option value="">{{ locale === 'en' ? '-- Select a registered site --' : '-- Sélectionner une station enregistrée --' }}</option>
                                            <option v-for="s in filteredEditRegisteredSites" :key="s.name" :value="s.name">
                                                {{ s.name }} {{ s.locality ? '— ' + s.locality : '' }} {{ s.province ? '(' + s.province + ')' : '' }}
                                            </option>
                                        </select>
                                    </div>

                                    <div
                                        v-if="selectedEditRegisteredSiteInfo"
                                        class="p-2.5 rounded-xl bg-emerald-50/80 border border-emerald-200 text-xs text-emerald-900 flex items-center justify-between gap-2"
                                    >
                                        <div class="flex items-center gap-2 min-w-0">
                                            <div class="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                                                <MapPin :size="13" />
                                            </div>
                                            <div class="min-w-0">
                                                <span class="font-bold text-xs truncate block">{{ selectedEditRegisteredSiteInfo.name }}</span>
                                                <span class="text-[11px] text-emerald-700">
                                                    {{ selectedEditRegisteredSiteInfo.locality || 'Madagascar' }}
                                                    <template v-if="selectedEditRegisteredSiteInfo.province"> • {{ selectedEditRegisteredSiteInfo.province }}</template>
                                                </span>
                                            </div>
                                        </div>
                                        <div class="text-[10px] font-mono text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded-md shrink-0">
                                            <span v-if="selectedEditRegisteredSiteInfo.latitude && selectedEditRegisteredSiteInfo.longitude">
                                                GPS : {{ Number(selectedEditRegisteredSiteInfo.latitude).toFixed(4) }}, {{ Number(selectedEditRegisteredSiteInfo.longitude).toFixed(4) }}
                                            </span>
                                            <span v-else>{{ locale === 'en' ? 'Registered site' : 'Cartographie enregistrée' }}</span>
                                        </div>
                                    </div>
                                </div>

                                <!-- CAS 2 EDIT: VEHICULE, CC, B2B -->
                                <div v-else class="space-y-3">
                                    <div>
                                        <label class="block text-xs font-semibold text-gray-700 mb-1">
                                            <template v-if="editChecklistForm.site_type === 'VEHICULE'">
                                                {{ locale === 'en' ? 'Vehicle License Plate / Identifier' : 'Immatriculation / Réf. du véhicule' }} <span class="text-gray-400 font-normal">({{ locale === 'en' ? 'Optional' : 'Optionnel' }})</span>
                                            </template>
                                            <template v-else-if="editChecklistForm.site_type === 'CAMION CITERNE'">
                                                {{ locale === 'en' ? 'Tanker Truck Number / License Plate' : 'Numéro / Immatriculation Camion Citerne (CC)' }} <span class="text-gray-400 font-normal">({{ locale === 'en' ? 'Optional' : 'Optionnel' }})</span>
                                            </template>
                                            <template v-else-if="editChecklistForm.site_type === 'B2B'">
                                                {{ locale === 'en' ? 'Client Name / B2B Installation' : 'Nom du client / Site client B2B' }} <span class="text-red-500">*</span>
                                            </template>
                                            <template v-else>
                                                {{ locale === 'en' ? 'Site / Identifier' : 'Désignation du site / Cible' }}
                                            </template>
                                        </label>
                                        <input
                                            v-model="editChecklistForm.site"
                                            type="text"
                                            :placeholder="
                                                editChecklistForm.site_type === 'VEHICULE'
                                                    ? 'Ex: Toyota Hilux - 1234 TAB (optionnel)'
                                                    : editChecklistForm.site_type === 'CAMION CITERNE'
                                                    ? 'Ex: Camion Citerne CC-04 / 5678 WWT (optionnel)'
                                                    : 'Ex: Client B2B - Usine Star Antsirabe'
                                            "
                                            class="w-full h-9 px-3 rounded-lg border border-gray-300 text-xs focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition"
                                        />
                                    </div>
                                </div>

                                <!-- Localisation précise / Zone / Adresse (avec presets 1-clic) -->
                                <div>
                                    <div class="flex items-center justify-between mb-1">
                                        <label class="block text-xs font-semibold text-gray-700">
                                            {{ locale === 'en' ? 'Precise location / Zone / Address' : 'Localisation précise / Zone / Adresse' }}
                                        </label>
                                        <button
                                            v-if="editChecklistForm.location"
                                            type="button"
                                            @click="editChecklistForm.location = ''"
                                            class="text-[10px] text-gray-400 hover:text-red-500 cursor-pointer transition"
                                        >
                                            {{ locale === 'en' ? 'Clear' : 'Effacer' }}
                                        </button>
                                    </div>
                                    <input
                                        v-model="editChecklistForm.location"
                                        type="text"
                                        :placeholder="locale === 'en' ? 'Ex: Distribution lanes, Shop, Technical room TGBT...' : 'Ex: Piste de distribution, Boutique, Local technique TGBT...'"
                                        class="w-full h-9 px-3 rounded-lg border border-gray-300 text-xs focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition"
                                    />
                                    <div class="mt-2 flex flex-wrap items-center gap-1.5">
                                        <span class="text-[10px] text-gray-400 font-medium mr-1">{{ locale === 'en' ? 'Quick zones:' : 'Zones types :' }}</span>
                                        <button
                                            v-for="zp in zonePresets"
                                            :key="zp"
                                            type="button"
                                            @click="applyZonePreset(editChecklistForm, zp)"
                                            :class="editChecklistForm.location === zp ? 'bg-primary text-white border-primary' : 'bg-slate-100 hover:bg-slate-200 text-gray-700 border-gray-200'"
                                            class="px-2 py-0.5 rounded-full text-[10px] border transition cursor-pointer"
                                        >
                                            {{ zp }}
                                        </button>
                                    </div>
                                </div>

                                <!-- Choix cartographique interactif GPS (disponible pour tous en édition) -->
                                <div class="rounded-xl border border-gray-200 bg-slate-50/70 p-3 flex flex-col gap-2">
                                    <div class="flex items-center justify-between gap-2">
                                        <div class="flex items-center gap-1.5 text-xs font-bold text-gray-800">
                                            <MapPin :size="15" class="text-primary" />
                                            <span>{{ locale === 'en' ? 'Inspection GPS Location' : 'Coordonnées GPS / Emplacement cartographique' }}</span>
                                        </div>
                                        <div v-if="editChecklistForm.latitude && editChecklistForm.longitude" class="text-[11px] font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                                            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                            <span>{{ Number(editChecklistForm.latitude).toFixed(4) }}, {{ Number(editChecklistForm.longitude).toFixed(4) }}</span>
                                        </div>
                                        <span v-else class="text-[10px] text-gray-400">
                                            {{ locale === 'en' ? 'No GPS set' : 'Non géolocalisé' }}
                                        </span>
                                    </div>
                                    <LocationPickerMap
                                        :latitude="editChecklistForm.latitude ?? null"
                                        :longitude="editChecklistForm.longitude ?? null"
                                        height="h-[200px]"
                                        @update:latitude="editChecklistForm.latitude = $event ?? undefined"
                                        @update:longitude="editChecklistForm.longitude = $event ?? undefined"
                                        @location-detected="onEditLocationPickerDetected"
                                    />
                                </div>

                                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                    <!-- Date -->
                                    <div>
                                        <label class="block text-xs font-semibold text-gray-700 mb-1">
                                            {{ locale === 'en' ? 'Date' : 'Date de contrôle' }} <span class="text-red-500">*</span>
                                        </label>
                                        <input
                                            v-model="editChecklistForm.date"
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
                                            v-model="editChecklistForm.time"
                                            type="time"
                                            required
                                            class="w-full h-9 px-3 rounded-lg border border-gray-300 text-xs focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition"
                                        />
                                    </div>
                                </div>

                                <!-- Commentaire / Observations -->
                                <div>
                                    <label class="block text-xs font-semibold text-gray-700 mb-1">
                                        {{ locale === 'en' ? 'General Comment / Observations' : 'Commentaire général / Observations' }}
                                    </label>
                                    <textarea
                                        v-model="editChecklistForm.comment"
                                        rows="2"
                                        :placeholder="locale === 'en' ? 'Add any context, general observation or inspection notes...' : 'Ajouter des notes générales, contexte ou observations sur l\'inspection...'"
                                        class="w-full p-2.5 rounded-lg border border-gray-300 text-xs focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition resize-none"
                                    ></textarea>
                                </div>

                                <!-- Description -->
                                <div>
                                    <label class="block text-xs font-semibold text-gray-700 mb-1">
                                        {{ locale === 'en' ? 'Description' : 'Description du contexte' }}
                                    </label>
                                    <input
                                        v-model="editChecklistForm.description"
                                        type="text"
                                        :placeholder="locale === 'en' ? 'Brief description of the inspection context...' : 'Brève description du contexte de contrôle...'"
                                        class="w-full h-9 px-3 rounded-lg border border-gray-300 text-xs focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition"
                                    />
                                </div>
                            </div>

                            <!-- Footer d'actions Edit -->
                            <div class="px-5 py-3 bg-slate-50/80 border-t border-gray-200 flex items-center justify-end gap-2.5 shrink-0">
                                <button
                                    type="button"
                                    @click="modal_edit = false"
                                    class="px-4 py-2 text-xs font-medium text-gray-600 hover:bg-gray-200 rounded-lg transition cursor-pointer"
                                >
                                    {{ locale === 'en' ? 'Cancel' : 'Annuler' }}
                                </button>
                                <button
                                    type="submit"
                                    :disabled="loading_edit || !editChecklistForm.title || !editChecklistForm.date || !editChecklistForm.time"
                                    class="px-5 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-xs transition flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                                >
                                    <Loader2 v-if="loading_edit" :size="13" class="animate-spin" />
                                    <span>{{ locale === 'en' ? 'Save Changes' : 'Enregistrer les modifications' }}</span>
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
    import { CheckCircle2, ClipboardList, Download, Edit, Eye, LayoutTemplateIcon, Loader2, MapPin, Plus, RefreshCw, Search, Trash2, UploadCloud, X as XIcon } from '@lucide/vue';
    import { useI18n } from 'vue-i18n';
    import Header from '../../../components/shared/Header.vue';
    import Button from '../../../components/ui/Button.vue';
    import { computed, onMounted, ref, watch, type ComputedRef } from 'vue';

    import { ChecklistsData, ChecklistStatusJsonData, ChecklistTypeData, SiteTypeDataJson } from '../../../@data/Checklist.data.ts';
    import { useTemplateService } from '../../../core/services/template.service.ts';
    import { useUserService } from '../../../core/services/user.service.ts';
    import type { CheckllistFormType, ChecklistStatusType } from '../../../@types/Checklist.type.ts';
    import ChecklistStatus from '../../../components/features/checklist/ChecklistStatus.vue';
    import SidebarLocationMap from '../../../components/shared/SidebarLocationMap.vue';
    import LocationPickerMap from '../../../components/shared/LocationPickerMap.vue';
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

    const siteCategories = [
        { label: 'Station Service', value: 'STATION SERVICE' },
        { label: 'Magasin', value: 'MAGASIN' },
        { label: 'Agence', value: 'AGENCE' },
        { label: 'Véhicule', value: 'VEHICULE' },
        { label: 'Camion Citerne (CC)', value: 'CAMION CITERNE' },
        { label: 'Client B2B', value: 'B2B' },
    ]

    const registeredSites = ref<{
        id: number | string;
        name: string;
        locality?: string;
        province?: string;
        latitude?: number | null;
        longitude?: number | null;
    }[]>([])

    const stationSearchQuery = ref('')
    const filteredRegisteredSites = computed(() => {
        const q = stationSearchQuery.value.trim().toLowerCase()
        if (!q) return registeredSites.value
        return registeredSites.value.filter(s =>
            s.name.toLowerCase().includes(q) ||
            (s.locality && s.locality.toLowerCase().includes(q)) ||
            (s.province && s.province.toLowerCase().includes(q))
        )
    })

    const zonePresets = [
        'Piste de distribution',
        'Boutique / Shop',
        'Local technique TGBT',
        'Zone Dépotage',
        'Baie de lavage / Vidange',
        'Bureaux administratifs',
        'Stockage & Cuves',
        'Parking & Dépôt',
        'Zone compresseur / Air',
        'Sanitaires / Vestiaires',
    ]

    function applyZonePreset(form: any, preset: string) {
        if (form.location === preset) {
            form.location = ''
        } else {
            form.location = preset
        }
    }

    const newChecklistForm = ref<CheckllistFormType>({
        type: undefined,
        site_type: 'STATION SERVICE',
        site: '',
        location: '',
        latitude: undefined,
        longitude: undefined,
        inspector_id: undefined,
        date: '',
        time: ''
    })

    const isCartographyRequired = computed(() => {
        const st = (newChecklistForm.value.site_type || '').toUpperCase()
        const tp = (newChecklistForm.value.type || '').toUpperCase()
        return st === 'VEHICULE' || st === 'CAMION CITERNE' || st === 'B2B' ||
               tp.includes('VEHICULE') || tp.includes('CITERNE') || tp.includes('CONSO')
    })

    const selectedRegisteredSiteInfo = computed(() => {
        return registeredSites.value.find(s => s.name === newChecklistForm.value.site)
    })

    function openAddModal() {
        const now = new Date()
        const todayStr = now.toISOString().split('T')[0]
        const timeStr = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
        const defaultType = dynamicTypes.value[0]?.value || undefined

        newChecklistForm.value = {
            type: defaultType,
            site_type: 'STATION SERVICE',
            site: '',
            location: '',
            latitude: undefined,
            longitude: undefined,
            inspector_id: undefined,
            date: todayStr,
            time: timeStr
        }

        onChecklistTypeChange()
        modal_add.value = true
        loadTemplatesAndUsers()
    }

    function onChecklistTypeChange() {
        const selectedTypeStr = (newChecklistForm.value.type || '').toUpperCase()
        const found = dynamicTypes.value.find(item => newChecklistForm.value.type === item.value)

        if (found?.site) {
            newChecklistForm.value.site_type = found.site as any
        } else if (selectedTypeStr.includes('VEHICULE')) {
            newChecklistForm.value.site_type = 'VEHICULE'
        } else if (selectedTypeStr.includes('CITERNE') || selectedTypeStr.includes('CAMION')) {
            newChecklistForm.value.site_type = 'CAMION CITERNE'
        } else if (selectedTypeStr.includes('CONSO') || selectedTypeStr.includes('B2B')) {
            newChecklistForm.value.site_type = 'B2B'
        } else if (selectedTypeStr.includes('RESEAU') || selectedTypeStr.includes('STATION')) {
            newChecklistForm.value.site_type = 'STATION SERVICE'
        } else if (selectedTypeStr.includes('MAGASIN') || selectedTypeStr.includes('AGENCE')) {
            newChecklistForm.value.site_type = 'MAGASIN'
        }

        onSiteTypeChange()
    }

    function onSiteTypeChange() {
        if (!isCartographyRequired.value) {
            const existing = registeredSites.value.find(s => s.name === newChecklistForm.value.site)
            if (existing) {
                newChecklistForm.value.latitude = existing.latitude ?? undefined
                newChecklistForm.value.longitude = existing.longitude ?? undefined
            } else if (registeredSites.value.length > 0) {
                const first = registeredSites.value[0]
                newChecklistForm.value.site = first.name
                newChecklistForm.value.latitude = first.latitude ?? undefined
                newChecklistForm.value.longitude = first.longitude ?? undefined
            }
        } else {
            if (registeredSites.value.some(s => s.name === newChecklistForm.value.site)) {
                newChecklistForm.value.site = ''
            }
        }
    }

    function onRegisteredSiteChange(e: Event) {
        const target = e.target as HTMLSelectElement
        const siteName = target.value
        newChecklistForm.value.site = siteName
        const found = registeredSites.value.find(s => s.name === siteName)
        if (found) {
            newChecklistForm.value.latitude = found.latitude ?? undefined
            newChecklistForm.value.longitude = found.longitude ?? undefined
        }
    }

    function onLocationPickerDetected(data: { locality: string; province: string; dms: string; displayName: string; lat: number; lng: number }) {
        newChecklistForm.value.latitude = data.lat
        newChecklistForm.value.longitude = data.lng
        if (!newChecklistForm.value.location && (data.locality || data.displayName)) {
            newChecklistForm.value.location = data.locality || data.displayName
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
            })
            .catch(err => console.error(err))

        siteService.all()
            .then(res => {
                const sList = res.data?.data || res.data || []
                registeredSites.value = sList.map((s: any) => ({
                    id: s.id,
                    name: s.name,
                    locality: s.location?.locality || s.locality || '',
                    province: s.location?.province || s.province || '',
                    latitude: s.location?.latitude ?? s.latitude ?? null,
                    longitude: s.location?.longitude ?? s.longitude ?? null,
                })).filter((s: any) => Boolean(s.name))

                if (!isCartographyRequired.value && !newChecklistForm.value.site && registeredSites.value.length > 0) {
                    const first = registeredSites.value[0]
                    newChecklistForm.value.site = first.name
                    newChecklistForm.value.latitude = first.latitude ?? undefined
                    newChecklistForm.value.longitude = first.longitude ?? undefined
                }
            })
            .catch(() => {})
    }

    async function submitAddChecklist() {
        if (!newChecklistForm.value.type || !newChecklistForm.value.date || !newChecklistForm.value.time) return
        const payload = { ...newChecklistForm.value }
        if (!payload.site || payload.site.trim() === '') {
            if (payload.site_type === 'VEHICULE') {
                payload.site = 'VEHICULE'
            } else if (payload.site_type === 'CAMION CITERNE') {
                payload.site = 'CAMION CITERNE'
            } else {
                return
            }
        }
        loading_add.value = true
        try {
            await checklistService.store(payload)
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

    // =========================================================
    // MODIFIER L'INSPECTION (EDIT CHECKLIST LOGIC)
    // =========================================================
    const modal_edit = ref(false)
    const loading_edit = ref(false)
    const editStationSearchQuery = ref('')

    const editChecklistForm = ref<{
        id?: string | number;
        title: string;
        description: string;
        status: ChecklistStatusType;
        site_type: string;
        site: string;
        location: string;
        latitude?: number;
        longitude?: number;
        inspector_id?: string | number;
        date: string;
        time: string;
        comment: string;
    }>({
        id: undefined,
        title: '',
        description: '',
        status: 'IN_PROGRESS' as ChecklistStatusType,
        site_type: 'STATION SERVICE',
        site: '',
        location: '',
        latitude: undefined,
        longitude: undefined,
        inspector_id: undefined,
        date: '',
        time: '',
        comment: '',
    })

    const isEditCartographyRequired = computed(() => {
        const st = (editChecklistForm.value.site_type || '').toUpperCase()
        return st === 'VEHICULE' || st === 'CAMION CITERNE' || st === 'B2B'
    })

    const filteredEditRegisteredSites = computed(() => {
        const q = editStationSearchQuery.value.trim().toLowerCase()
        if (!q) return registeredSites.value
        return registeredSites.value.filter(s =>
            s.name.toLowerCase().includes(q) ||
            (s.locality && s.locality.toLowerCase().includes(q)) ||
            (s.province && s.province.toLowerCase().includes(q))
        )
    })

    const selectedEditRegisteredSiteInfo = computed(() => {
        return registeredSites.value.find(s => s.name === editChecklistForm.value.site)
    })

    function onEditSiteTypeChange() {
        if (!isEditCartographyRequired.value) {
            const existing = registeredSites.value.find(s => s.name === editChecklistForm.value.site)
            if (existing) {
                editChecklistForm.value.latitude = existing.latitude ?? undefined
                editChecklistForm.value.longitude = existing.longitude ?? undefined
            } else if (registeredSites.value.length > 0 && !editChecklistForm.value.site) {
                const first = registeredSites.value[0]
                editChecklistForm.value.site = first.name
                editChecklistForm.value.latitude = first.latitude ?? undefined
                editChecklistForm.value.longitude = first.longitude ?? undefined
            }
        }
    }

    function onEditRegisteredSiteChange(e: Event) {
        const target = e.target as HTMLSelectElement
        const siteName = target.value
        editChecklistForm.value.site = siteName
        const found = registeredSites.value.find(s => s.name === siteName)
        if (found) {
            editChecklistForm.value.latitude = found.latitude ?? undefined
            editChecklistForm.value.longitude = found.longitude ?? undefined
            if (!editChecklistForm.value.location) {
                editChecklistForm.value.location = found.name
            }
        }
    }

    function onEditLocationPickerDetected(data: { locality: string; province: string; dms: string; displayName: string; lat: number; lng: number }) {
        editChecklistForm.value.latitude = data.lat
        editChecklistForm.value.longitude = data.lng
        if (!editChecklistForm.value.location && (data.locality || data.displayName)) {
            editChecklistForm.value.location = data.locality || data.displayName
        }
    }

    function openEditChecklistModal(chk?: Checklistype) {
        if (!chk) return
        loadTemplatesAndUsers()

        let inferredSiteType = 'STATION SERVICE'
        const chkSiteUpper = (chk.site || '').toUpperCase()
        const chkTypeUpper = (chk.type || '').toUpperCase()
        if (chkSiteUpper === 'VEHICULE' || chkTypeUpper.includes('VEHICULE')) {
            inferredSiteType = 'VEHICULE'
        } else if (chkSiteUpper.includes('CITERNE') || chkTypeUpper.includes('CITERNE') || chkTypeUpper.includes('CAMION')) {
            inferredSiteType = 'CAMION CITERNE'
        } else if (chkSiteUpper === 'B2B' || chkTypeUpper.includes('B2B') || chkTypeUpper.includes('CONSO')) {
            inferredSiteType = 'B2B'
        } else if (chkSiteUpper === 'MAGASIN' || chkTypeUpper.includes('MAGASIN')) {
            inferredSiteType = 'MAGASIN'
        } else if (chkSiteUpper === 'AGENCE' || chkTypeUpper.includes('AGENCE')) {
            inferredSiteType = 'AGENCE'
        }

        let inspId: string | number | undefined = undefined
        if (chk.inspector && typeof chk.inspector === 'object' && (chk.inspector as any).id) {
            inspId = (chk.inspector as any).id
        }

        editChecklistForm.value = {
            id: chk.id,
            title: chk.title || '',
            description: chk.description || '',
            status: (chk.status as ChecklistStatusType) || 'IN_PROGRESS',
            site_type: inferredSiteType,
            site: chk.site || '',
            location: chk.location || '',
            latitude: chk.site_location?.latitude ?? (chk as any).latitude ?? undefined,
            longitude: chk.site_location?.longitude ?? (chk as any).longitude ?? undefined,
            inspector_id: inspId,
            date: chk.date || new Date().toISOString().split('T')[0],
            time: chk.time || '08:00',
            comment: chk.comment || '',
        }

        editStationSearchQuery.value = ''
        modal_edit.value = true
    }

    async function submitEditChecklist() {
        if (!editChecklistForm.value.id || !editChecklistForm.value.title || !editChecklistForm.value.date || !editChecklistForm.value.time) return
        loading_edit.value = true
        try {
            const payload: any = {
                title: editChecklistForm.value.title,
                description: editChecklistForm.value.description,
                status: editChecklistForm.value.status,
                site_type: editChecklistForm.value.site_type,
                site: editChecklistForm.value.site || editChecklistForm.value.site_type,
                location: editChecklistForm.value.location,
                latitude: editChecklistForm.value.latitude,
                longitude: editChecklistForm.value.longitude,
                inspector_id: editChecklistForm.value.inspector_id,
                date: editChecklistForm.value.date,
                time: editChecklistForm.value.time,
                comment: editChecklistForm.value.comment,
            }

            const res = await checklistService.update(editChecklistForm.value.id, payload)
            toast.success(locale.value === 'en' ? 'Inspection updated successfully!' : 'Inspection modifiée avec succès !')
            modal_edit.value = false

            if (selected_checklist.value && selected_checklist.value.id === editChecklistForm.value.id) {
                if (res.data?.data) {
                    selected_checklist.value = { ...selected_checklist.value, ...res.data.data }
                } else {
                    selected_checklist.value.title = editChecklistForm.value.title
                    selected_checklist.value.description = editChecklistForm.value.description
                    selected_checklist.value.location = editChecklistForm.value.location
                    selected_checklist.value.site = editChecklistForm.value.site
                    selected_checklist.value.date = editChecklistForm.value.date
                    selected_checklist.value.time = editChecklistForm.value.time
                    selected_checklist.value.status = editChecklistForm.value.status as ChecklistStatusType
                    selected_checklist.value.comment = editChecklistForm.value.comment
                }
            }

            fetchData()
        } catch (err: any) {
            const errorMsg = err.response?.data?.message || (locale.value === 'en' ? 'Failed to update inspection.' : 'Erreur lors de la modification de l\'inspection.')
            toast.error(errorMsg)
        } finally {
            loading_edit.value = false
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
            label: locale.value === 'en' ? 'Details & Report' : 'Détails & Rapport',
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
            label: locale.value === 'en' ? 'Download report (PDF)' : 'Télécharger rapport (PDF)',
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
            label: locale.value === 'en' ? 'Edit inspection' : 'Modifier l\'inspection',
            variant: 'WARNING',
            icon: Edit,
            onClick: () => {
                if (contextMenu.value.checklist) {
                    openEditChecklistModal(contextMenu.value.checklist)
                }
            }
        },
        {
            label: locale.value === 'en' ? 'Delete' : 'Supprimer',
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
    const columnLabels = computed<Record<string, string>>(() => ({
        'type': locale.value === 'en' ? 'Type' : 'Type',
        'status': locale.value === 'en' ? 'Status' : 'Statut',
        'inspector': locale.value === 'en' ? 'Inspector' : 'Inspecteur',
    }))
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
