<template>
    <div class="flex flex-row w-full h-full min-h-screen">
        <!-- CONTENU PRINCIPAL (GAUCHE) -->
        <div class="flex flex-col flex-1 min-w-0">
            <!-- HEADER -->
            <Header
                title="administration.sites.title"
                :thumbnails="[
                    { label: 'thumbnails.home', name: 'DASHBOARD' },
                    { label: 'thumbnails.administration', name: 'ADMINISTRATION' },
                    { label: 'thumbnails.sites', name: 'SITES' }
                ]"
            />

            <!-- ======================= CARTES KPI ======================= -->
            <div class="px-6 pt-5 pb-2 bg-slate-50/60 border-b border-gray-200">
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <!-- Total Sites -->
                    <div class="bg-white rounded-xl p-3.5 border border-gray-200 shadow-2xs flex items-center justify-between">
                        <div>
                            <p class="text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {{ t('administration.sites.total') }}
                            </p>
                            <p class="text-2xl font-black text-gray-900 mt-1">{{ pagination.total }}</p>
                        </div>
                        <div class="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold">
                            <MapPin :size="20" />
                        </div>
                    </div>

                    <!-- Stations Service -->
                    <div class="bg-white rounded-xl p-3.5 border border-amber-200/80 shadow-2xs flex items-center justify-between">
                        <div>
                            <p class="text-xs font-medium text-amber-700 uppercase tracking-wider">
                                {{ t('administration.sites.stations') }}
                            </p>
                            <p class="text-2xl font-black text-amber-600 mt-1">{{ kpiStats.stations }}</p>
                        </div>
                        <div class="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold text-lg">
                            ⛽
                        </div>
                    </div>

                    <!-- Magasins, Agences & Sièges -->
                    <div class="bg-white rounded-xl p-3.5 border border-blue-200/80 shadow-2xs flex items-center justify-between">
                        <div>
                            <p class="text-xs font-medium text-blue-700 uppercase tracking-wider">
                                {{ t('administration.sites.others') }}
                            </p>
                            <p class="text-2xl font-black text-blue-600 mt-1">{{ kpiStats.others }}</p>
                        </div>
                        <div class="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center font-bold">
                            <Building2 :size="20" />
                        </div>
                    </div>

                    <!-- Géolocalisés GPS -->
                    <div class="bg-white rounded-xl p-3.5 border border-emerald-200/80 shadow-2xs flex items-center justify-between">
                        <div>
                            <p class="text-xs font-medium text-emerald-700 uppercase tracking-wider">
                                {{ t('administration.sites.geolocated') }}
                            </p>
                            <p class="text-2xl font-black text-emerald-600 mt-1">{{ kpiStats.geolocated }}</p>
                        </div>
                        <div class="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold">
                            <Navigation :size="20" />
                        </div>
                    </div>
                </div>
            </div>

            <!-- ======================= RIBBON TOOLBAR ======================= -->
            <div class="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div class="h-16 px-6 flex flex-row items-center justify-between gap-4">
                    <div class="flex flex-row items-center gap-1.5">
                        <ButtonFilter
                            :text="t('common.add')"
                            :icon="Plus"
                            is-primary
                            @click="openAddModal"
                        />
                        <ButtonFilter
                            :text="t('administration.sites.export')"
                            :icon="Download"
                            :badge="pagination.total.toString()"
                            :loading="loading_export"
                            @click="handleExport"
                        />
                        <ButtonFilter
                            :text="t('administration.sites.refresh')"
                            :icon="RefreshCw"
                            :loading="loading"
                            @click="fetchData()"
                        />
                    </div>
                    <div class="flex flex-row items-center gap-2">
                        <InputFilter
                            :icon="Search"
                            :placeholder="t('administration.sites.search_placeholder')"
                            v-model="searchQuery"
                        />
                    </div>
                </div>

                <!-- CHIP FILTERS -->
                <ChipFilter
                    :filterable-keys="filterableKeys"
                    :column-labels="columnLabels"
                    :column-options="columnOptions"
                    :filters="filters"
                    :show-date-filter="false"
                    :results-count="pagination.to"
                    :results-total="pagination.total"
                    @clear-all="clearFilters"
                />
            </div>

            <!-- ======================= TABLEAU DES SITES ======================= -->
            <div class="flex flex-col flex-1 min-w-0">
                <!-- CHARGEMENT -->
                <div v-if="loading" class="p-16 flex flex-col items-center justify-center gap-3 text-gray-500">
                    <Loader2 :size="32" class="animate-spin text-primary" />
                    <span class="text-sm">{{ t('administration.sites.table.loading') }}</span>
                </div>

                <!-- AUCUN RÉSULTAT -->
                <div v-else-if="sites.length === 0" class="p-16 flex flex-col items-center justify-center text-center">
                    <div class="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mb-4">
                        <MapPinOff :size="28" />
                    </div>
                    <h5 class="text-gray-700 font-semibold mb-1">
                        {{ t('administration.sites.table.empty_title') }}
                    </h5>
                    <p class="text-sm text-gray-500 max-w-sm">
                        {{ t('administration.sites.table.empty_desc') }}
                    </p>
                    <button
                        v-if="searchQuery || filters.type.length || filters.province.length"
                        @click="clearFilters"
                        class="mt-4 px-4 py-2 text-xs font-medium text-primary bg-primary/10 rounded-lg hover:bg-primary/20 transition cursor-pointer"
                    >
                        {{ t('common.reset_filters') }}
                    </button>
                </div>

                <!-- TABLEAU -->
                <div v-else class="overflow-x-auto">
                    <table class="w-full">
                        <thead>
                            <tr>
                                <th class="w-12 text-center">#</th>
                                <th class="w-32">{{ t('administration.sites.table.code') }}</th>
                                <th class="w-48">{{ t('administration.sites.table.name') }}</th>
                                <th class="w-36">{{ t('administration.sites.table.type') }}</th>
                                <th class="w-40">{{ t('administration.sites.table.locality') }}</th>
                                <th class="w-32">{{ t('administration.sites.table.province') }}</th>
                                <th class="w-44">{{ t('administration.sites.table.gps') }}</th>
                                <!-- <th class="w-24 text-center">{{ t('administration.sites.table.actions') }}</th> -->
                            </tr>
                        </thead>
                        <tbody>
                            <tr
                                v-for="(site, index) in sites"
                                :key="site.id"
                                @click="openPreview(site)"
                                @contextmenu.prevent="openContextMenu($event, site)"
                                class="cursor-pointer transition-colors"
                                :class="selected_site?.id === site.id ? 'bg-primary/10 font-medium' : 'hover:bg-slate-50'"
                            >
                                <!-- Index -->
                                <td class="font-mono text-xs text-gray-400 text-center">
                                    {{ (pagination.current_page - 1) * pagination.per_page + index + 1 }}
                                </td>

                                <!-- Code -->
                                <td>
                                    <span class="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                                        {{ site.code || '-' }}
                                    </span>
                                </td>

                                <!-- Nom (Colonne avec largeur maîtrisée) -->
                                <td>
                                    <div class="font-semibold text-gray-900 truncate max-w-[190px]" :title="site.name">
                                        {{ site.name }}
                                    </div>
                                </td>

                                <!-- Type -->
                                <td>
                                    <span
                                        class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border"
                                        :class="getTypeBadgeClass(site.type)"
                                    >
                                        <span class="w-1.5 h-1.5 rounded-full" :class="getTypeDotClass(site.type)"></span>
                                        {{ formatTypeLabel(site.type) }}
                                    </span>
                                </td>

                                <!-- Localité -->
                                <td class="text-xs text-gray-700">
                                    <span class="font-medium truncate block max-w-[150px]" :title="site.location?.locality || '-'">
                                        {{ site.location?.locality || '-' }}
                                    </span>
                                </td>

                                <!-- Province -->
                                <td>
                                    <span class="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-200/60">
                                        {{ site.location?.province || '-' }}
                                    </span>
                                </td>

                                <!-- Coordonnées GPS -->
                                <td>
                                    <div v-if="site.location?.latitude && site.location?.longitude" class="flex flex-col gap-0.5">
                                        <div class="flex items-center gap-1">
                                            <a
                                                :href="`https://www.google.com/maps?q=${site.location.latitude},${site.location.longitude}`"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                @click.stop
                                                class="inline-flex items-center gap-1 text-[11px] font-mono font-medium text-emerald-700 hover:text-emerald-900 hover:underline"
                                                :title="t('administration.sites.sidebar.maps')"
                                            >
                                                <Navigation :size="11" class="text-emerald-600 shrink-0" />
                                                <span>{{ Number(site.location.latitude).toFixed(4) }}, {{ Number(site.location.longitude).toFixed(4) }}</span>
                                                <ExternalLink :size="10" class="text-gray-400" />
                                            </a>
                                        </div>
                                        <span v-if="site.location.dms" class="text-[9.5px] text-gray-400 font-mono truncate max-w-[160px]">
                                             {{ site.location.dms }}
                                        </span>
                                    </div>
                                    <span v-else class="text-xs text-gray-400 italic">
                                        {{ t('administration.sites.table.no_gps') }}
                                    </span>
                                </td>

                                <!-- Actions -->
                                <!-- <td class="text-center" @click.stop>
                                    <div class="flex items-center justify-center gap-1">
                                        <button
                                            type="button"
                                            @click="openEditModal(site)"
                                            class="p-1.5 rounded-lg text-gray-500 hover:bg-slate-100 hover:text-primary transition"
                                            :title="t('administration.sites.sidebar.edit')"
                                        >
                                            <Edit :size="14" />
                                        </button>
                                        <button
                                            type="button"
                                            @click="confirmDelete(site)"
                                            class="p-1.5 rounded-lg text-gray-500 hover:bg-red-50 hover:text-red-600 transition"
                                            :title="t('administration.sites.sidebar.delete')"
                                        >
                                            <Trash2 :size="14" />
                                        </button>
                                    </div>
                                </td> -->
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- PAGINATION -->
                <div
                    v-if="pagination.total > pagination.per_page"
                    class="px-6 py-4 bg-white border-t border-gray-200 flex items-center justify-between"
                >
                    <span class="text-xs text-gray-500">
                        {{ t('common.displaying') }} {{ pagination.from }}-{{ pagination.to }} {{ t('common.of') }} {{ pagination.total }} {{ t('common.results') }}
                    </span>
                    <div class="flex items-center gap-1">
                        <button
                            :disabled="pagination.current_page <= 1"
                            @click="changePage(pagination.current_page - 1)"
                            class="px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                        >
                            {{ t('common.previous') }}
                        </button>
                        <button
                            v-for="page in totalPages"
                            :key="page"
                            @click="changePage(page)"
                            class="w-8 h-8 text-xs font-semibold rounded-lg transition"
                            :class="pagination.current_page === page ? 'bg-primary text-white shadow-xs' : 'text-gray-600 hover:bg-gray-100'"
                        >
                            {{ page }}
                        </button>
                        <button
                            :disabled="pagination.current_page >= totalPages"
                            @click="changePage(pagination.current_page + 1)"
                            class="px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                        >
                            {{ t('common.next') }}
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- ========================================================= -->
        <!-- VOLET LATÉRAL DROIT (RIGHT SIDEBAR & CARTOGRAPHIE DU SITE) -->
        <!-- ========================================================= -->
        <aside
            v-if="right_sidebar.isOpen && selected_site"
            :aria-label="t('administration.sites.sidebar.preview_title')"
            class="sticky top-0 flex h-screen w-[420px] min-w-[420px] max-w-[420px] shrink-0 flex-col border-l border-gray-200 bg-white shadow-xl z-20 overflow-y-auto scrollbar-thin"
        >
            <!-- En-tête du volet droit -->
            <header class="flex items-start justify-between gap-3 border-b border-gray-200 p-4 bg-white shrink-0">
                <div class="flex min-w-0 flex-1 flex-col">
                    <div class="flex items-center gap-1.5 flex-wrap">
                        <span class="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                            {{ selected_site.code || 'SITE' }}
                        </span>
                        <span
                            class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border"
                            :class="getTypeBadgeClass(selected_site.type)"
                        >
                            <span class="w-1.5 h-1.5 rounded-full" :class="getTypeDotClass(selected_site.type)"></span>
                            {{ formatTypeLabel(selected_site.type) }}
                        </span>
                    </div>
                    <h3 class="mt-1.5 text-sm font-bold text-gray-900 truncate" :title="selected_site.name">
                        {{ selected_site.name }}
                    </h3>
                    <p class="text-[11px] text-gray-500 mt-0.5 flex items-center gap-1 truncate">
                        <MapPin :size="11" class="text-gray-400 shrink-0" />
                        <span>{{ selected_site.location?.locality || '-' }}</span>
                        <span v-if="selected_site.location?.province" class="text-gray-400 font-semibold">• {{ selected_site.location.province }}</span>
                    </p>
                </div>

                <button
                    type="button"
                    :aria-label="t('common.close')"
                    class="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
                    @click="closeRightSidebar"
                >
                    <X :size="18" />
                </button>
            </header>

            <!-- Contenu du volet : Cartographie & Détails -->
            <div class="flex flex-1 flex-col gap-4 p-4 bg-slate-50/50">
                <!-- 1. CARTOGRAPHIE INTERACTIVE VIA SidebarLocationMap -->
                <SidebarLocationMap
                    :site-name="selected_site.name"
                    :location-name="selected_site.location?.locality || selected_site.name"
                    :latitude="selected_site.location?.latitude"
                    :longitude="selected_site.location?.longitude"
                    :locality="selected_site.location?.locality"
                    :province="selected_site.location?.province"
                    :status="selected_site.type"
                    map-height="h-[250px]"
                />

                <!-- 2. FICHE DÉTAILLÉE DU SITE -->
                <div class="bg-white rounded-xl border border-gray-200 p-3.5 shadow-2xs space-y-3">
                    <h5 class="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
                        <Info :size="13" class="text-primary" />
                        <span>{{ t('administration.sites.sidebar.title') }}</span>
                    </h5>

                    <div class="grid grid-cols-2 gap-2 text-xs">
                        <div class="p-2.5 bg-slate-50 rounded-lg">
                            <span class="text-gray-400 block text-[10px] font-medium">{{ t('administration.sites.table.type') }}</span>
                            <span class="font-semibold text-gray-800">{{ formatTypeLabel(selected_site.type) }}</span>
                        </div>
                        <div class="p-2.5 bg-slate-50 rounded-lg">
                            <span class="text-gray-400 block text-[10px] font-medium">{{ t('administration.sites.table.code') }}</span>
                            <span class="font-mono font-semibold text-gray-800">{{ selected_site.code || '-' }}</span>
                        </div>
                        <div class="p-2.5 bg-slate-50 rounded-lg col-span-2">
                            <span class="text-gray-400 block text-[10px] font-medium">{{ t('administration.sites.table.locality') }} &amp; {{ t('administration.sites.table.province') }}</span>
                            <span class="font-medium text-gray-800">{{ selected_site.location?.locality || '-' }} ({{ selected_site.location?.province || '-' }})</span>
                        </div>
                        <div class="p-2.5 bg-slate-50 rounded-lg col-span-2">
                            <span class="text-gray-400 block text-[10px] font-medium">{{ t('administration.sites.table.gps') }}</span>
                            <div v-if="selected_site.location?.latitude && selected_site.location?.longitude" class="mt-0.5">
                                <span class="font-mono text-emerald-700 font-bold text-xs">
                                    {{ Number(selected_site.location.latitude).toFixed(5) }}, {{ Number(selected_site.location.longitude).toFixed(5) }}
                                </span>
                                <span v-if="selected_site.location.dms" class="block font-mono text-[10px] text-gray-400">
                                    {{ selected_site.location.dms }}
                                </span>
                            </div>
                            <span v-else class="text-gray-400 italic text-[11px]">{{ t('administration.sites.sidebar.not_specified') }}</span>
                        </div>
                    </div>
                </div>

                <!-- 3. ACTIONS RAPIDES DU VOLET -->
                <div class="flex items-center gap-2">
                    <button
                        type="button"
                        @click="openEditModal(selected_site)"
                        class="flex-1 py-2 px-3 rounded-lg border border-gray-200 bg-white hover:bg-slate-50 text-gray-700 font-semibold text-xs flex items-center justify-center gap-1.5 shadow-2xs transition cursor-pointer"
                    >
                        <Edit :size="13" class="text-primary" />
                        <span>{{ t('administration.sites.sidebar.edit') }}</span>
                    </button>
                    <a
                        v-if="selected_site.location?.latitude && selected_site.location?.longitude"
                        :href="`https://www.google.com/maps?q=${selected_site.location.latitude},${selected_site.location.longitude}`"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="flex-1 py-2 px-3 rounded-lg border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold text-xs flex items-center justify-center gap-1.5 shadow-2xs transition"
                    >
                        <ExternalLink :size="13" />
                        <span>{{ t('administration.sites.sidebar.maps') }}</span>
                    </a>
                    <button
                        type="button"
                        @click="confirmDelete(selected_site)"
                        class="p-2 rounded-lg border border-red-200 bg-red-50 hover:bg-red-100 text-red-600 transition shadow-2xs cursor-pointer"
                        :title="t('administration.sites.sidebar.delete')"
                    >
                        <Trash2 :size="14" />
                    </button>
                </div>
            </div>
        </aside>

        <!-- ========================================================= -->
        <!-- MODAL AJOUT / MODIFICATION AVEC SÉLECTION PAR CARTE -->
        <!-- ========================================================= -->
        <Teleport to="body">
            <transition name="modal-fade">
                <div
                    v-if="modalState.isOpen"
                    class="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto"
                    @click.self="closeModal"
                >
                    <div
                        class="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden border border-gray-200 animate-in fade-in zoom-in-95 duration-200"
                    >
                        <!-- En-tête Modal -->
                        <div class="px-5 py-3.5 bg-gradient-to-r from-slate-50 to-amber-50/40 border-b border-gray-200 flex items-center justify-between shrink-0">
                            <div class="flex items-center gap-2.5">
                                <div class="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                                    <MapPin :size="18" />
                                </div>
                                <div>
                                    <h4 class="text-sm font-bold text-gray-900">
                                        {{ modalState.isEdit ? t('administration.sites.form.edit_title') : t('administration.sites.form.add_title') }}
                                    </h4>
                                    <p class="text-[11px] text-gray-500">
                                        {{ t('administration.sites.form.desc') }}
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                @click="closeModal"
                                class="p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-white transition cursor-pointer"
                            >
                                <X :size="18" />
                            </button>
                        </div>

                        <!-- Corps Modal en 2 Colonnes : Formulaire + Carte Sélecteur -->
                        <form @submit.prevent="saveSite" class="flex flex-col flex-1 overflow-y-auto">
                            <div class="p-5 grid grid-cols-1 lg:grid-cols-12 gap-5">
                                <!-- COLONNE GAUCHE (LG: 6) : FORMULAIRE -->
                                <div class="lg:col-span-6 space-y-3.5">
                                    <!-- Nom du site -->
                                    <div>
                                        <label class="block text-xs font-semibold text-gray-700 mb-1">
                                            {{ t('administration.sites.form.name') }} <span class="text-red-500">*</span>
                                        </label>
                                        <input
                                            v-model="form.name"
                                            type="text"
                                            required
                                            :placeholder="getNamePlaceholder(form.type)"
                                            @blur="onNameBlur"
                                            class="w-full h-9 px-3 rounded-lg border border-gray-300 text-xs focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition uppercase"
                                        />
                                    </div>

                                    <div class="grid grid-cols-2 gap-3">
                                        <!-- Code du site -->
                                        <div>
                                            <div class="flex items-center justify-between mb-1">
                                                <label class="block text-xs font-semibold text-gray-700">
                                                    {{ t('administration.sites.form.code') }}
                                                </label>
                                                <button
                                                    v-if="form.name && form.code !== generateCodeFromName(form.name)"
                                                    type="button"
                                                    @click="form.code = generateCodeFromName(form.name); isCodeManual = false"
                                                    class="text-[10px] text-primary hover:underline font-medium cursor-pointer"
                                                    :title="t('administration.sites.form.auto_sync')"
                                                >
                                                    {{ t('administration.sites.form.auto_sync') }}: {{ generateCodeFromName(form.name) }}
                                                </button>
                                            </div>
                                            <input
                                                v-model="form.code"
                                                @input="isCodeManual = true"
                                                type="text"
                                                placeholder="ex: SS_ANKORONDRANO"
                                                class="w-full h-9 px-3 rounded-lg border border-gray-300 text-xs font-mono focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition uppercase"
                                            />
                                        </div>

                                        <!-- Type de site -->
                                        <div>
                                            <label class="block text-xs font-semibold text-gray-700 mb-1">
                                                {{ t('administration.sites.form.type') }}
                                            </label>
                                            <select
                                                v-model="form.type"
                                                @change="onTypeChange"
                                                class="w-full h-9 px-2 rounded-lg border border-gray-300 text-xs focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none bg-white transition"
                                            >
                                                <option value="STATION_SERVICE">{{ t('administration.sites.types.station_service') }}</option>
                                                <option value="MAGASIN">{{ t('administration.sites.types.magasin') }}</option>
                                                <option value="AGENCE">{{ t('administration.sites.types.agence') }}</option>
                                                <option value="SIEGE">{{ t('administration.sites.types.siege') }}</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div class="grid grid-cols-2 gap-3">
                                        <!-- Province -->
                                        <div>
                                            <label class="block text-xs font-semibold text-gray-700 mb-1">
                                                {{ t('administration.sites.form.province') }}
                                            </label>
                                            <select
                                                v-model="form.province"
                                                class="w-full h-9 px-2 rounded-lg border border-gray-300 text-xs focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none bg-white transition"
                                            >
                                                <option value="">-- {{ t('common.filters') }} --</option>
                                                <option value="ANTANANARIVO">ANTANANARIVO</option>
                                                <option value="TOAMASINA">TOAMASINA</option>
                                                <option value="MAHAJANGA">MAHAJANGA</option>
                                                <option value="FIANARANTSOA">FIANARANTSOA</option>
                                                <option value="TOLIARA">TOLIARA</option>
                                                <option value="ANTSIRANANA">ANTSIRANANA</option>
                                            </select>
                                        </div>

                                        <!-- Localité -->
                                        <div>
                                            <label class="block text-xs font-semibold text-gray-700 mb-1">
                                                {{ t('administration.sites.form.locality') }}
                                            </label>
                                            <input
                                                v-model="form.locality"
                                                type="text"
                                                placeholder="ex: Ankorondrano"
                                                class="w-full h-9 px-3 rounded-lg border border-gray-300 text-xs focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition"
                                            />
                                        </div>
                                    </div>

                                    <!-- SECTION COORDONNÉES GPS MANUELLES -->
                                    <div class="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                                        <div class="flex items-center justify-between">
                                            <span class="text-[11px] font-bold text-gray-800 flex items-center gap-1 uppercase tracking-wider">
                                                <Navigation :size="12" class="text-primary" />
                                                <span>{{ t('administration.sites.form.gps_title') }}</span>
                                            </span>
                                            <button
                                                type="button"
                                                @click="getCurrentLocation"
                                                :disabled="gettingLocation"
                                                class="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold text-primary bg-primary/10 rounded-md hover:bg-primary/20 transition disabled:opacity-50 cursor-pointer"
                                            >
                                                <Loader2 v-if="gettingLocation" :size="10" class="animate-spin" />
                                                <MapPin v-else :size="10" />
                                                <span>{{ t('administration.sites.form.my_location') }}</span>
                                            </button>
                                        </div>

                                        <div class="grid grid-cols-2 gap-2">
                                            <div>
                                                <label class="block text-[10px] text-gray-500 mb-0.5 font-medium">{{ t('administration.sites.form.latitude') }}</label>
                                                <input
                                                    v-model.number="form.latitude"
                                                    type="number"
                                                    step="any"
                                                    placeholder="-18.8897"
                                                    class="w-full h-8 px-2.5 rounded-lg border border-gray-300 text-xs font-mono focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none bg-white"
                                                />
                                            </div>
                                            <div>
                                                <label class="block text-[10px] text-gray-500 mb-0.5 font-medium">{{ t('administration.sites.form.longitude') }}</label>
                                                <input
                                                    v-model.number="form.longitude"
                                                    type="number"
                                                    step="any"
                                                    placeholder="47.5225"
                                                    class="w-full h-8 px-2.5 rounded-lg border border-gray-300 text-xs font-mono focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none bg-white"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label class="block text-[10px] text-gray-500 mb-0.5 font-medium">{{ t('administration.sites.form.dms') }}</label>
                                            <input
                                                v-model="form.dms"
                                                type="text"
                                                placeholder="ex: 18°53'23''S 47°31'21''E"
                                                class="w-full h-8 px-2.5 rounded-lg border border-gray-300 text-xs font-mono focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none bg-white"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <!-- COLONNE DROITE (LG: 6) : SÉLECTION PAR CARTE & RÉCUPÉRATION AUTO -->
                                <div class="lg:col-span-6 flex flex-col gap-2">
                                    <div class="flex items-center justify-between">
                                        <label class="text-xs font-bold text-gray-800 flex items-center gap-1.5 uppercase tracking-wider">
                                            <span>🗺️</span>
                                            <span>{{ t('administration.sites.form.map_selection') }}</span>
                                        </label>
                                        <span class="text-[10px] text-gray-500">
                                            {{ t('administration.sites.form.map_hint') }}
                                        </span>
                                    </div>

                                    <!-- COMPOSANT SÉLECTEUR DE CARTE -->
                                    <LocationPickerMap
                                        :latitude="form.latitude"
                                        :longitude="form.longitude"
                                        :locality="form.locality"
                                        :province="form.province"
                                        height="h-[285px]"
                                        @update:latitude="val => form.latitude = val"
                                        @update:longitude="val => form.longitude = val"
                                        @location-detected="onLocationDetected"
                                    />
                                </div>
                            </div>

                            <!-- Erreur éventuelle -->
                            <div v-if="formError" class="mx-5 mb-3 p-3 rounded-lg bg-red-50 text-red-600 text-xs font-medium border border-red-200">
                                {{ formError }}
                            </div>

                            <!-- Pied de modal avec boutons d'action -->
                            <div class="px-5 py-3.5 bg-gray-50 border-t border-gray-200 flex items-center justify-end gap-2 shrink-0">
                                <button
                                    type="button"
                                    @click="closeModal"
                                    class="px-4 py-2 text-xs font-medium text-gray-600 hover:bg-gray-200 rounded-lg transition cursor-pointer"
                                >
                                    {{ t('administration.sites.form.cancel') }}
                                </button>
                                <button
                                    type="submit"
                                    :disabled="saving"
                                    class="px-5 py-2 text-xs font-semibold text-white bg-primary hover:bg-primary/90 rounded-lg shadow-xs transition flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                                >
                                    <Loader2 v-if="saving" :size="13" class="animate-spin" />
                                    <span>{{ modalState.isEdit ? t('administration.sites.form.update') : t('administration.sites.form.save') }}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </transition>
        </Teleport>

        <!-- ======================= MODAL DE SUPPRESSION ======================= -->
        <CenterModal
            :is-open="deleteModal.isOpen"
            :title="t('administration.sites.delete')"
            @close="deleteModal.isOpen = false"
        >
            <div class="space-y-4">
                <p class="text-sm text-gray-600">
                    {{ t('administration.sites.delete_confirm') }}
                    <span class="font-bold text-gray-900 block mt-1">{{ deleteModal.site?.name }} ({{ deleteModal.site?.code }})</span>
                </p>
                <p class="text-xs text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-100">
                    ⚠️ {{ t('administration.sites.delete_warning') }}
                </p>
                <div class="flex items-center justify-end gap-2 pt-2">
                    <button
                        type="button"
                        @click="deleteModal.isOpen = false"
                        class="px-4 py-2 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition cursor-pointer"
                    >
                        {{ t('administration.sites.form.cancel') }}
                    </button>
                    <button
                        type="button"
                        :disabled="deleting"
                        @click="executeDelete"
                        class="px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-xs transition flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                    >
                        <Loader2 v-if="deleting" :size="14" class="animate-spin" />
                        <span>{{ t('administration.sites.delete') }}</span>
                    </button>
                </div>
            </div>
        </CenterModal>

        <!-- MENU CONTEXTUEL (CLIC DROIT) -->
        <ContextMenuUI
            v-model="contextMenu.isOpen"
            :context-menu="contextMenu.contextMenu"
            :actions="context_menu_actions"
        />
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch, type ComputedRef } from 'vue';
import { useI18n } from 'vue-i18n';
import { toast } from 'vue3-toastify';
import Header from '../../../components/shared/Header.vue';
import ButtonFilter from '../../../components/ui/ButtonFilter.vue';
import InputFilter from '../../../components/ui/InputFilter.vue';
import ChipFilter from '../../../components/ui/ChipFilter.vue';
import CenterModal from '../../../components/ui/centerModal.vue';
import ContextMenuUI from '../../../components/ui/ContextMenuUI.vue';
import SidebarLocationMap from '../../../components/shared/SidebarLocationMap.vue';
import LocationPickerMap from '../../../components/shared/LocationPickerMap.vue';
import siteService from '../../../core/services/site.service';
import { exportUtils } from '../../../core/utils/export.utils';
import type { SiteFormType, SiteType } from '../../../@types/Site.type';
import type { ContextMenuActionType, contextMenuType } from '../../../@types/ContextMenu.type';
import {
    Building2,
    Download,
    Edit,
    ExternalLink,
    Info,
    Loader2,
    MapPin,
    MapPinOff,
    Navigation,
    Plus,
    RefreshCw,
    Search,
    Trash2,
    X
} from '@lucide/vue';

type SitePaginationType = {
    current_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
    last_page: number;
};

const { t } = useI18n();

const loading = ref(false);
const loading_export = ref(false);
const saving = ref(false);
const deleting = ref(false);
const gettingLocation = ref(false);
const formError = ref<string | null>(null);

const sites = ref<SiteType[]>([]);
const searchQuery = ref('');

// Right Sidebar État & Site sélectionné
const right_sidebar = ref<{
    isOpen: boolean;
}>({
    isOpen: false,
});
const selected_site = ref<SiteType | null>(null);

const pagination = ref<SitePaginationType>({
    current_page: 1,
    per_page: 15,
    total: 0,
    from: 0,
    to: 0,
    last_page: 1,
});

const filters = ref<{
    type: string[];
    province: string[];
}>({
    type: [],
    province: [],
});

const filterableKeys = ['type', 'province'];

const columnLabels = computed<Record<string, string>>(() => ({
    type: t('administration.sites.table.type'),
    province: t('administration.sites.table.province'),
}));

const columnOptions = ref<Record<string, string[]>>({
    type: ['STATION_SERVICE', 'MAGASIN', 'AGENCE', 'SIEGE'],
    province: ['ANTANANARIVO', 'TOAMASINA', 'MAHAJANGA', 'FIANARANTSOA', 'TOLIARA', 'ANTSIRANANA'],
});

const kpiStats = reactive({
    stations: 0,
    others: 0,
    geolocated: 0,
});

const modalState = reactive({
    isOpen: false,
    isEdit: false,
    siteId: null as number | null,
});

const form = reactive<SiteFormType>({
    name: '',
    code: '',
    type: 'STATION_SERVICE',
    locality: '',
    province: '',
    latitude: null,
    longitude: null,
    dms: '',
});

const isCodeManual = ref(false);

function generateCodeFromName(name: string): string {
    if (!name) return '';
    return name
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toUpperCase()
        .replace(/[^A-Z0-9]+/g, '_')
        .replace(/^_+|_+$/g, '');
}

function getTypePrefix(type: string): string {
    switch (type) {
        case 'MAGASIN':
            return 'MAG';
        case 'AGENCE':
            return 'AGENCE';
        case 'SIEGE':
            return 'SIEGE';
        case 'STATION_SERVICE':
        default:
            return 'SS';
    }
}

function getBaseSiteName(name: string): string {
    if (!name) return '';
    let result = name.trim();
    const regex = /^(SS|STATION[\s_-]?SERVICE|MAG|MAGASIN|AGENCE|AG|SIEGE|SIÈGE)([\s_:-]+|$)/i;
    while (regex.test(result)) {
        result = result.replace(regex, '').trim();
    }
    return result;
}

function getNamePlaceholder(type: string): string {
    switch (type) {
        case 'MAGASIN':
            return 'ex: MAG ALAROBIA';
        case 'AGENCE':
            return 'ex: AGENCE ALAROBIA';
        case 'SIEGE':
            return 'ex: SIEGE ANKORONDRANO';
        case 'STATION_SERVICE':
        default:
            return 'ex: SS ANKORONDRANO';
    }
}

function onTypeChange() {
    const newPrefix = getTypePrefix(form.type);
    const base = getBaseSiteName(form.name) || getBaseSiteName(form.code);

    if (base) {
        form.name = `${newPrefix} ${base}`;
        form.code = `${newPrefix}_${generateCodeFromName(base)}`;
    }
}

function onNameBlur() {
    if (!form.name.trim()) return;
    const base = getBaseSiteName(form.name);
    const prefix = getTypePrefix(form.type);
    if (base && !form.name.toUpperCase().startsWith(prefix)) {
        form.name = `${prefix} ${base}`;
    }
    if (!isCodeManual.value && form.name) {
        form.code = generateCodeFromName(form.name);
    }
}

watch(
    () => form.type,
    (newType, oldType) => {
        if (modalState.isOpen && newType && newType !== oldType) {
            onTypeChange();
        }
    }
);

watch(
    () => form.name,
    (newName) => {
        if (!isCodeManual.value && modalState.isOpen) {
            form.code = generateCodeFromName(newName);
        }
    }
);

const deleteModal = reactive({
    isOpen: false,
    site: null as SiteType | null,
});

const contextMenu = ref<{
    isOpen: boolean;
    contextMenu: contextMenuType;
    site?: SiteType;
}>({
    isOpen: false,
    contextMenu: {},
});

const context_menu_actions: ComputedRef<ContextMenuActionType[]> = computed(() => [
    {
        label: t('administration.sites.sidebar.open_preview'),
        icon: MapPin,
        onClick: () => {
            if (contextMenu.value.site) {
                openPreview(contextMenu.value.site);
            }
        },
    },
    {
        label: t('administration.sites.sidebar.edit'),
        icon: Edit,
        onClick: () => {
            if (contextMenu.value.site) {
                openEditModal(contextMenu.value.site);
            }
        },
    },
    {
        label: t('administration.sites.sidebar.maps'),
        icon: Navigation,
        onClick: () => {
            const s = contextMenu.value.site;
            if (s?.location?.latitude && s?.location?.longitude) {
                window.open(`https://www.google.com/maps?q=${s.location.latitude},${s.location.longitude}`, '_blank');
            } else {
                toast.info(t('administration.sites.table.no_gps'));
            }
        },
    },
    {
        label: t('administration.sites.sidebar.delete'),
        icon: Trash2,
        variant: 'DANGER',
        onClick: () => {
            if (contextMenu.value.site) {
                confirmDelete(contextMenu.value.site);
            }
        },
    },
]);

const totalPages = computed(() => {
    return Math.ceil(pagination.value.total / pagination.value.per_page) || 1;
});

function openPreview(site: SiteType) {
    selected_site.value = site;
    right_sidebar.value.isOpen = true;
}

function closeRightSidebar() {
    right_sidebar.value.isOpen = false;
    selected_site.value = null;
}

async function fetchData(page = pagination.value.current_page) {
    loading.value = true;
    try {
        const res = await siteService.index({
            search: searchQuery.value || undefined,
            type: filters.value.type.length ? filters.value.type : undefined,
            province: filters.value.province.length ? filters.value.province : undefined,
            page,
            per_page: pagination.value.per_page,
        });

        if (res?.data) {
            sites.value = res.data.data || [];
            pagination.value = {
                current_page: res.data.current_page || 1,
                per_page: res.data.per_page || 15,
                total: res.data.total || 0,
                from: res.data.from || 0,
                to: res.data.to || 0,
                last_page: res.data.last_page || 1,
            };

            // Sélection automatique du premier site ou mise à jour de la sélection
            if (sites.value.length > 0) {
                if (selected_site.value) {
                    const updated = sites.value.find(s => s.id === selected_site.value?.id);
                    if (updated) {
                        selected_site.value = updated;
                    }
                } else {
                    selected_site.value = sites.value[0];
                    right_sidebar.value.isOpen = true;
                }
            } else {
                selected_site.value = null;
                right_sidebar.value.isOpen = false;
            }
        }
        await updateKpis();
    } catch (err) {
        console.error('Erreur chargement sites :', err);
    } finally {
        loading.value = false;
    }
}

async function updateKpis() {
    try {
        const allRes = await siteService.all();
        if (allRes?.data) {
            const list: SiteType[] = allRes.data;
            kpiStats.stations = list.filter(s => s.type === 'STATION_SERVICE' || s.name.startsWith('SS')).length;
            kpiStats.others = list.filter(s => ['MAGASIN', 'AGENCE', 'SIEGE'].includes(s.type)).length;
            kpiStats.geolocated = list.filter(s => s.location?.latitude && s.location?.longitude).length;
        }
    } catch {
        // Ignorer
    }
}

async function fetchFilterOptions() {
    try {
        const res = await siteService.getFilters();
        if (res?.data) {
            if (res.data.types?.length) {
                columnOptions.value.type = res.data.types;
            }
            if (res.data.provinces?.length) {
                columnOptions.value.province = res.data.provinces;
            }
        }
    } catch {
        // Ignorer
    }
}

function clearFilters() {
    filters.value.type = [];
    filters.value.province = [];
    searchQuery.value = '';
    pagination.value.current_page = 1;
    fetchData(1);
}

function changePage(page: number) {
    if (page < 1 || page > totalPages.value) return;
    pagination.value.current_page = page;
    fetchData(page);
}

let searchTimer: any = null;
watch(searchQuery, () => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
        pagination.value.current_page = 1;
        fetchData(1);
    }, 300);
});

watch(filters, () => {
    pagination.value.current_page = 1;
    fetchData(1);
}, { deep: true });

function openAddModal() {
    modalState.isOpen = true;
    modalState.isEdit = false;
    modalState.siteId = null;
    isCodeManual.value = false;
    formError.value = null;
    form.name = '';
    form.code = '';
    form.type = 'STATION_SERVICE';
    form.locality = '';
    form.province = 'ANTANANARIVO';
    form.latitude = null;
    form.longitude = null;
    form.dms = '';
}

function openEditModal(site: SiteType) {
    modalState.isOpen = true;
    modalState.isEdit = true;
    modalState.siteId = site.id;
    isCodeManual.value = false;
    formError.value = null;
    form.name = site.name;
    form.code = site.code;
    form.type = site.type;
    form.locality = site.location?.locality || '';
    form.province = site.location?.province || '';
    form.latitude = site.location?.latitude ?? null;
    form.longitude = site.location?.longitude ?? null;
    form.dms = site.location?.dms || '';
}

function closeModal() {
    modalState.isOpen = false;
    formError.value = null;
}

// Réception des données récupérées automatiquement depuis la carte
function onLocationDetected(data: {
    locality: string;
    province: string;
    dms: string;
    displayName: string;
    lat: number;
    lng: number;
}) {
    if (data.locality) {
        // Extraire la première partie avant la virgule pour éviter d'embarquer la province/région
        const cleanMainLoc = data.locality.split(',')[0].trim();
        form.locality = cleanMainLoc || data.locality;
    }
    if (data.province) {
        form.province = data.province;
    }
    if (data.dms) {
        form.dms = data.dms;
    }
    // Si le nom du site est encore vide ou ne contient qu'un préfixe
    const baseName = getBaseSiteName(form.name);
    if (!baseName && data.locality) {
        const cleanLoc = data.locality.split(',')[0].replace(/[^a-zA-Z0-9\s]/g, '').trim().toUpperCase();
        const prefix = getTypePrefix(form.type);
        form.name = `${prefix} ${cleanLoc}`;
        if (!isCodeManual.value) {
            form.code = generateCodeFromName(form.name);
        }
    }
}

function getCurrentLocation() {
    if (!navigator.geolocation) {
        toast.error(t('administration.sites.messages.geo_not_supported'));
        return;
    }
    gettingLocation.value = true;
    navigator.geolocation.getCurrentPosition(
        (pos) => {
            const lat = parseFloat(pos.coords.latitude.toFixed(6));
            const lng = parseFloat(pos.coords.longitude.toFixed(6));
            form.latitude = lat;
            form.longitude = lng;
            gettingLocation.value = false;
        },
        (err) => {
            console.error(err);
            gettingLocation.value = false;
            toast.error(t('administration.sites.messages.geo_error'));
        },
        { enableHighAccuracy: true, timeout: 10000 }
    );
}

async function saveSite() {
    if (!form.name.trim()) return;
    saving.value = true;
    formError.value = null;

    try {
        if (modalState.isEdit && modalState.siteId) {
            await siteService.update(modalState.siteId, form);
            toast.success(t('administration.sites.messages.updated'));
        } else {
            await siteService.store(form);
            toast.success(t('administration.sites.messages.created'));
        }
        closeModal();
        await fetchData();
    } catch (err: any) {
        const msg = err?.response?.data?.message || t('administration.sites.messages.save_error');
        formError.value = msg;
        toast.error(msg);
    } finally {
        saving.value = false;
    }
}

function confirmDelete(site: SiteType) {
    deleteModal.site = site;
    deleteModal.isOpen = true;
}

async function executeDelete() {
    if (!deleteModal.site) return;
    deleting.value = true;
    try {
        await siteService.destroy(deleteModal.site.id);
        toast.success(t('administration.sites.messages.deleted'));
        deleteModal.isOpen = false;
        deleteModal.site = null;
        await fetchData();
    } catch (err: any) {
        const msg = err?.response?.data?.message || t('administration.sites.messages.delete_error');
        console.error('Erreur suppression site :', err);
        toast.error(msg);
    } finally {
        deleting.value = false;
    }
}

function openContextMenu(event: MouseEvent, site: SiteType) {
    contextMenu.value.site = site;
    contextMenu.value.isOpen = true;
    contextMenu.value.contextMenu = event;
}

async function handleExport() {
    loading_export.value = true;
    try {
        const res = await siteService.export({
            search: searchQuery.value || undefined,
            type: filters.value.type.length ? filters.value.type : undefined,
            province: filters.value.province.length ? filters.value.province : undefined,
        });

        if (res?.data) {
            const dataToExport = res.data.map((item: any) => ({
                code: item.code,
                name: item.name,
                type: formatTypeLabel(item.type),
                locality: item.locality,
                province: item.province,
                latitude: item.latitude,
                longitude: item.longitude,
                dms: item.dms,
                created_at: item.created_at,
            }));

            const exportFields = [
                { key: 'code', excelName: t('administration.sites.table.code') },
                { key: 'name', excelName: t('administration.sites.table.name') },
                { key: 'type', excelName: t('administration.sites.table.type') },
                { key: 'locality', excelName: t('administration.sites.table.locality') },
                { key: 'province', excelName: t('administration.sites.table.province') },
                { key: 'latitude', excelName: t('administration.sites.form.latitude') },
                { key: 'longitude', excelName: t('administration.sites.form.longitude') },
                { key: 'dms', excelName: t('administration.sites.form.dms') },
                { key: 'created_at', excelName: 'Date' },
            ];

            exportUtils(dataToExport, exportFields, undefined, undefined, 'Sites_Galana');
            toast.success(t('administration.sites.messages.export_success'));
        }
    } catch (err) {
        console.error('Erreur export :', err);
        toast.error(t('administration.sites.messages.export_error'));
    } finally {
        loading_export.value = false;
    }
}

function formatTypeLabel(type?: string): string {
    switch (type) {
        case 'STATION_SERVICE':
            return t('administration.sites.types.station_service');
        case 'MAGASIN':
            return t('administration.sites.types.magasin');
        case 'AGENCE':
            return t('administration.sites.types.agence');
        case 'SIEGE':
            return t('administration.sites.types.siege');
        default:
            return type || '-';
    }
}

function getTypeBadgeClass(type?: string): string {
    switch (type) {
        case 'STATION_SERVICE':
            return 'bg-amber-50 text-amber-800 border-amber-200/80';
        case 'MAGASIN':
            return 'bg-emerald-50 text-emerald-800 border-emerald-200/80';
        case 'AGENCE':
            return 'bg-blue-50 text-blue-800 border-blue-200/80';
        case 'SIEGE':
            return 'bg-purple-50 text-purple-800 border-purple-200/80';
        default:
            return 'bg-slate-50 text-slate-700 border-slate-200';
    }
}

function getTypeDotClass(type?: string): string {
    switch (type) {
        case 'STATION_SERVICE':
            return 'bg-amber-500';
        case 'MAGASIN':
            return 'bg-emerald-500';
        case 'AGENCE':
            return 'bg-blue-500';
        case 'SIEGE':
            return 'bg-purple-500';
        default:
            return 'bg-slate-400';
    }
}

onMounted(() => {
    fetchData();
    fetchFilterOptions();
});
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
    transition: opacity 0.2s ease, transform 0.2s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
    opacity: 0;
    transform: scale(0.97);
}
</style>
