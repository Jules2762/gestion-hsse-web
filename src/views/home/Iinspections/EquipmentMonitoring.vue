<template>
    <div class="flex flex-row w-full">
        <div class="flex flex-col transition-all" :class="right_sidebar.isOpen ? 'w-[calc(100%-400px)]' : 'w-full'">
            <Header title="inspections.equipment-monitoring.title" :thumbnails="[
                { label: 'thumbnails.home', name: 'DASHBOARD' },
                { label: 'thumbnails.inspections', name: 'INSPECTION' },
                { label: 'thumbnails.equipment-monitoring', name: 'EQUIPMENT_MONITORING' },
            ]" />
            <!-- ======================= RIBBON TOOLBAR ======================= -->
            <div class="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div class="h-16 px-6 flex flex-row items-center justify-between gap-4">
                    <div class="flex flex-row items-center gap-1.5">
                        <ButtonFilter is-primary :text="locale === 'en' ? 'Add' : 'Ajout'" :icon="SquarePlusIcon" @click="openAddModal" />
                        <ButtonFilter :text="locale === 'en' ? 'Import' : 'Importer'" :icon="CloudDownloadIcon" @click="router.push({
                            name: 'EQUIPMENT_MONITORING_IMPORT'
                        })" />
                        <ButtonFilter :text="locale === 'en' ? 'Export' : 'Exporter'" :icon="DownloadIcon" :loading="loading_export"
                            :badge="pagination.total.toString()" @click="exportData()" />
                        <ButtonFilter :text="locale === 'en' ? 'Refresh' : 'Actualiser'" :icon="RefreshCw" :loading="loading_data"
                            @click="fetchData()" />
                    </div>

                    <!-- BADGES DE SYNTHÈSE DE CONFORMITÉ -->
                    <div class="hidden md:flex items-center gap-2">
                        <!-- TOUS -->
                        <button
                            type="button"
                            @click="quickFilterConformity('ALL')"
                            class="px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer border flex items-center gap-1.5 shadow-2xs"
                            :class="conformityFilter === 'ALL' ? 'bg-slate-100 text-slate-800 border-slate-300 font-bold' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'"
                            :title="locale === 'en' ? 'Show all equipment monitoring' : 'Afficher tous les suivis de matériel'"
                        >
                            <span>{{ t('common.total') }}</span>
                            <span class="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-slate-200 text-slate-700">
                                {{ metaStats.total || pagination.total }}
                            </span>
                        </button>

                        <!-- CONFORMES -->
                        <button
                            type="button"
                            @click="quickFilterConformity('CONFORME')"
                            class="px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer border flex items-center gap-1.5 shadow-2xs"
                            :class="conformityFilter === 'CONFORME' ? 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold' : 'bg-white text-gray-600 border-gray-200 hover:bg-emerald-50/50'"
                            :title="locale === 'en' ? 'Filter compliant equipment' : 'Filtrer uniquement les suivis conformes'"
                        >
                            <span class="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
                            <span>{{ t('status.CONFORME') }}</span>
                            <span class="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                                {{ metaStats.conforme }}
                            </span>
                        </button>

                        <!-- NON CONFORMES AVEC BADGE -->
                        <button
                            type="button"
                            @click="quickFilterConformity('NON_CONFORME')"
                            class="px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer border flex items-center gap-1.5 shadow-2xs"
                            :class="conformityFilter === 'NON_CONFORME' ? 'bg-red-50 text-red-800 border-red-300 font-bold' : 'bg-white text-gray-600 border-gray-200 hover:bg-red-50/50'"
                            :title="locale === 'en' ? 'Filter non-compliant equipment' : 'Filtrer les suivis non conformes ou requérant contrôle'"
                        >
                            <span class="w-2 h-2 rounded-full bg-red-500 inline-block"></span>
                            <span>{{ t('status.NON_CONFORME') }}</span>
                            <span
                                class="px-2 py-0.5 rounded-full text-[10px] font-bold leading-none"
                                :class="metaStats.non_conforme > 0 ? 'bg-red-600 text-white animate-pulse' : 'bg-gray-100 text-gray-600'"
                            >
                                {{ metaStats.non_conforme }}
                            </span>
                        </button>
                    </div>

                    <div class="flex flex-row items-center gap-2">
                        <InputFilter :icon="SearchIcon" :placeholder="locale === 'en' ? 'Search equipment...' : 'Rechercher un équipement...'" v-model="searchQuery" />
                    </div>
                </div>
                <ChipFilter :filterable-keys="filterableKeys" :column-labels="columnLables" :date-range="dateRange"
                    :filters="filters" :column-options="columnOptions as Record<filtersKeyType, string[]>"
                    @clear-all="clearAllFilters()" />
            </div>

            <div class="flex flex-row transition-all overflow-x-auto scrollbar-hide w-full"
                @click.self="right_sidebar.isOpen = false">
                <div class="min-h-fit w-full" @click.self="right_sidebar.isOpen = false">
                    <!-- LOADING STATE -->
                    <div v-if="loading_data" class="p-16 flex flex-col items-center justify-center text-center text-gray-400 gap-2">
                        <Loader :size="28" class="animate-spin text-primary" />
                        <span class="text-xs font-medium">{{ locale === 'en' ? 'Loading equipment monitoring...' : 'Chargement des suivis de matériel...' }}</span>
                    </div>

                    <!-- EMPTY STATE -->
                    <div v-else-if="!data || data.length === 0" class="p-16 flex flex-col items-center justify-center text-center">
                        <div class="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mb-3">
                            <SearchIcon :size="24" />
                        </div>
                        <h5 class="text-gray-700 font-semibold mb-1 text-sm">{{ locale === 'en' ? 'No equipment monitoring recorded' : 'Aucun suivi de matériel enregistré' }}</h5>
                        <p class="text-xs text-gray-500 max-w-sm">
                            {{ locale === 'en' ? 'No record matches the selected filter criteria.' : 'Aucun enregistrement ne correspond aux critères de filtre sélectionnés.' }}
                        </p>
                    </div>


                    <!-- TABLE DES SUIVIS DE MATÉRIEL -->
                    <table v-else class="w-full">
                        <thead>
                            <tr>
                                <th v-for="header in headers" :key="header" class="text-left">
                                    {{ header }}
                                </th>
                            </tr>
                        </thead>
                        <tbody class="h-fit">
                            <tr @contextmenu.prevent="context_menu.context_menu = $event; context_menu.equipment = item; context_menu.isOpen = true"
                                v-for="(item, index) in data" :key="index" class="cursor-pointer hover:bg-slate-50 transition-colors" @click="selectEquipment(item)" :class="right_sidebar.equipment?.id == item.id ? 'bg-primary/10' : ''">
                                <td class="font-mono text-xs text-gray-600 font-medium">
                                    {{ item.id }}
                                </td>
                                <td class="font-mono text-xs text-gray-600 whitespace-nowrap">
                                    {{ item.date }}
                                </td>

                                <td class="font-bold text-gray-900 uppercase text-xs tracking-wide">
                                    {{ getSiteNameText(item.site_name) }}
                                </td>

                                <td class="whitespace-nowrap text-xs text-gray-700">
                                    <div class="inline-flex items-center gap-1.5 font-medium">
                                        <div class="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 text-[10px] font-bold shrink-0">
                                            <User :size="12" />
                                        </div>
                                        <span class="truncate max-w-[140px]">{{ formatInspector(item.user) }}</span>
                                    </div>
                                </td>

                                <td class="whitespace-nowrap">
                                    <ChecklistStatus :name="(item.status as any) || 'COMPLETED'" />
                                </td>

                                <td class="whitespace-nowrap font-bold text-xs">
                                    <div class="inline-flex flex-col items-start gap-0.5">
                                        <span
                                            class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold"
                                            :class="(item.conformity_rate ?? 100) >= 100 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : ((item.conformity_rate ?? 100) >= 80 ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-red-50 text-red-700 border border-red-200')"
                                        >
                                            <span class="w-1.5 h-1.5 rounded-full" :class="(item.conformity_rate ?? 100) >= 100 ? 'bg-emerald-500' : ((item.conformity_rate ?? 100) >= 80 ? 'bg-amber-500' : 'bg-red-500')"></span>
                                            {{ formatConformityRate(item.conformity_rate) }}
                                        </span>
                                        <span
                                            v-if="(item.non_conforming_items_count ?? 0) > 0"
                                            class="text-[9px] font-bold text-red-700 bg-red-50 border border-red-200/80 px-1.5 py-0.2 rounded-full"
                                        >
                                            {{ item.non_conforming_items_count }} {{ item.non_conforming_items_count! > 1 ? (locale === 'en' ? 'defects' : 'anomalies') : (locale === 'en' ? 'defect' : 'anomalie') }}
                                        </span>
                                        <span
                                            v-else-if="item.initial_conformity_rate !== undefined && item.initial_conformity_rate !== item.conformity_rate"
                                            class="text-[9px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-1.5 py-0.2 rounded-full"
                                            :title="`Taux initial constaté lors de la visite : ${item.initial_conformity_rate}% (Régularisé)`"
                                        >
                                            {{ locale === 'en' ? 'Resolved' : 'Régularisé' }} (initial {{ item.initial_conformity_rate }}%)
                                        </span>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>


                    <ContextMenuUI v-model="context_menu.isOpen" :context-menu="context_menu.context_menu" :actions="context_actions" :bottom_actions="[
                    {
                        label: locale === 'en' ? 'Delete' : 'Supprimer',
                        icon: Trash2,
                        variant: 'DANGER',
                        onClick() {
                            right_sidebar.isOpen = true; right_sidebar.equipment = context_menu.equipment; modal_delete = true; context_menu.isOpen = false
                        },
                    }
                ]" />
                </div>

            </div>
            <div class="py-4 px-6 bg-white w-full border-t border-gray-200 flex flex-row items-center justify-between text-sm">
                <span class="text-xs text-gray-500 font-medium">
                    {{ locale === 'en' ? `Displaying ${pagination.to} of ${pagination.total} equipment` : `Affichage de ${pagination.to} sur ${pagination.total} équipements` }}
                </span>
                <vue-awesome-paginate :hide-prev-next-when-ends="true" :total-items="pagination.total"
                    :items-per-page="15" :max-pages-shown="4" v-model="pagination.current_page"
                    @click="(page: number) => pagination.current_page = page" />
            </div>

            <CenterModal class="w-30" :title="locale === 'en' ? 'Delete equipment monitoring?' : 'Supprimer le suivi d’équipement ?'" :is-open="modal_delete"
                @close="modal_delete = false" @confirm="deleteEquipments" :confirm-title="locale === 'en' ? 'Delete' : 'Supprimer'"
                :confirm-variant="'danger'" :confirm-loading="loading_delete">
                <p>{{ locale === 'en' ? 'Are you sure you want to delete this equipment monitoring record? This action cannot be undone.' : 'Êtes-vous sûr de vouloir supprimer ce suivi d’équipement ? Cette action est irréversible.' }}</p>
            </CenterModal>
        </div>

        <!-- ======================= DRAWER LATÉRAL ======================= -->
        <aside class="h-screen border-l border-gray-200 scrollbar-hide bg-white p-5 sticky top-0 overflow-y-auto shrink-0 shadow-xl z-20 w-[420px] min-w-[420px] max-w-[420px]" v-if="right_sidebar.isOpen">
            <!-- HEADER -->
            <div class="flex items-start justify-between border-b border-gray-200 pb-3">
                <div class="min-w-0 flex-1">
                    <p class="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                        {{ locale === 'en' ? 'Monitoring sheet #' : 'Fiche de suivi n°' }} {{ right_sidebar.equipment?.id }}
                    </p>
                    <h4 class="mt-0.5 font-bold text-gray-900 truncate text-sm">
                        {{ getSiteNameText(right_sidebar.equipment?.site_name) || (locale === 'en' ? 'Equipment details' : 'Détails du matériel') }}
                    </h4>
                    <div class="flex items-center gap-2 mt-2 flex-wrap">
                        <ChecklistStatus :name="(right_sidebar.equipment?.status as any) || 'COMPLETED'" />
                        <span
                            class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold"
                            :class="(right_sidebar.equipment?.conformity_rate ?? 100) >= 100 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : ((right_sidebar.equipment?.conformity_rate ?? 100) >= 80 ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-red-50 text-red-700 border border-red-200')"
                        >
                            {{ locale === 'en' ? 'Compliance:' : 'Conformité :' }} {{ right_sidebar.equipment?.conformity_rate ?? 100 }}%
                        </span>
                    </div>
                    <div class="mt-2.5 flex items-center gap-2 text-xs text-gray-700 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-100">
                        <div class="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                            <User :size="12" />
                        </div>
                        <div class="min-w-0">
                            <span class="text-[10px] uppercase font-bold text-gray-400 block leading-tight">{{ locale === 'en' ? 'Inspector' : 'Inspecteur' }}</span>
                            <span class="font-semibold text-gray-800 truncate block">{{ formatInspector(right_sidebar.equipment?.user) }}</span>
                        </div>
                    </div>
                </div>

                <div class="flex items-center gap-1">
                    <button
                        type="button"
                        title="Ouvrir la fiche complète"
                        class="p-1.5 rounded-lg text-gray-500 hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer"
                        @click="router.push({ name: 'EQUIPMENT_MONITORING_DETAILS', params: { id: right_sidebar.equipment?.id } })">
                        <ExternalLink :size="17" />
                    </button>
                    <button type="button" aria-label="Fermer l'aperçu"
                        class="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors cursor-pointer"
                        @click="right_sidebar.isOpen = false">
                        <XIcon :size="18" />
                    </button>
                </div>
            </div>

            <!-- CARTOGRAPHIE DE L'EMPLACEMENT DU SITE -->
            <SidebarLocationMap
                class="mt-3.5"
                :site-name="getSiteNameText(right_sidebar.equipment?.site_name)"
                :latitude="right_sidebar.equipment?.site_location?.latitude ?? right_sidebar.equipment?.latitude"
                :longitude="right_sidebar.equipment?.site_location?.longitude ?? right_sidebar.equipment?.longitude"
                :locality="right_sidebar.equipment?.site_location?.locality ?? right_sidebar.equipment?.locality"
                :province="right_sidebar.equipment?.site_location?.province ?? right_sidebar.equipment?.province"
                :status="right_sidebar.equipment?.status"
                :conformity-rate="right_sidebar.equipment?.conformity_rate"
            />

            <!-- ONGLET ITEMS VS SYNTHESE -->
            <div class="flex border-b border-gray-200 mt-3 text-xs font-medium">
                <button
                    type="button"
                    @click="activeTab = 'items'"
                    class="pb-2 px-3 border-b-2 font-semibold transition cursor-pointer flex items-center gap-1.5"
                    :class="activeTab === 'items' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'"
                >
                    <span>Équipements & Photos</span>
                    <span class="px-1.5 py-0.5 bg-gray-100 rounded-full text-[10px] font-bold text-gray-700">
                        {{ (right_sidebar.equipment?.items || []).length }}
                    </span>
                </button>
                <button
                    type="button"
                    @click="activeTab = 'summary'"
                    class="pb-2 px-3 border-b-2 font-semibold transition cursor-pointer"
                    :class="activeTab === 'summary' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'"
                >
                    Synthèse globale
                </button>
            </div>

            <!-- TAB 1: EQUIPMENTS ITEMS & PHOTOS -->
            <div v-if="activeTab === 'items'" class="mt-3 space-y-3">
                <div v-if="!(right_sidebar.equipment?.items?.length)" class="text-center py-8 text-gray-400 text-xs bg-slate-50 rounded-xl border border-dashed border-gray-200 p-4">
                    <p class="font-medium text-gray-600">Aucun équipement unitaire détaillé renseigné</p>
                    <p class="text-[11px] text-gray-400 mt-1">Consultez l'onglet « Synthèse globale » pour les relevés globaux de la fiche.</p>
                </div>
                <div
                    v-for="item in (right_sidebar.equipment?.items || [])"
                    :key="item.id"
                    class="p-3 rounded-xl border border-gray-200 bg-slate-50/50 hover:bg-white transition flex flex-col gap-2 shadow-2xs"
                >
                    <div class="flex items-start justify-between gap-2">
                        <div>
                            <h5 class="font-bold text-gray-800 text-xs">{{ item.name }}</h5>
                            <p class="text-[10px] text-gray-500">
                                Type: <span class="capitalize">{{ item.type }}</span>
                                <span v-if="item.location"> • 📍 {{ item.location }}</span>
                            </p>
                        </div>
                        <!-- Bouton bascule conformité -->
                        <div class="flex items-center gap-1.5">
                            <button
                                type="button"
                                @click="toggleItemConformity(item)"
                                class="px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer transition select-none"
                                :class="item.conformity ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' : 'bg-red-100 text-red-800 hover:bg-red-200'"
                                :title="'Cliquer pour basculer l\'état de conformité'"
                            >
                                {{ item.conformity ? '🟢 Conforme' : '🔴 Non conforme' }}
                            </button>
                            <span
                                v-if="item.initial_conformity === false && item.conformity === true"
                                class="text-[9px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.2 rounded-full"
                                title="Régularisé (initialement non conforme)"
                            >
                                Régularisé
                            </span>
                        </div>
                    </div>

                    <div class="flex items-center justify-between text-[11px] text-gray-600">
                        <span>Quantité / Relevé : <b>{{ item.value }}</b></span>
                        <span v-if="item.comment" class="italic text-gray-500 truncate max-w-[150px]">{{ item.comment }}</span>
                    </div>

                    <!-- Preuves photos de l'item -->
                    <div class="border-t border-gray-100 pt-2 flex flex-col gap-1.5">
                        <div class="flex items-center justify-between">
                            <span class="text-[10px] font-semibold text-gray-600">Preuves photos ({{ (item.attachments || []).length }}) :</span>
                            <label class="text-[10px] font-bold text-primary hover:underline cursor-pointer flex items-center gap-1">
                                <span>+ Photo</span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    class="hidden"
                                    @change="onUploadPhoto($event, item)"
                                />
                            </label>
                        </div>

                        <!-- Miniatures -->
                        <div v-if="item.attachments && item.attachments.length" class="flex flex-wrap gap-1.5">
                            <div
                                v-for="att in item.attachments"
                                :key="att.id"
                                @click="previewImage(att.file_path)"
                                class="w-14 h-14 rounded-lg overflow-hidden border border-gray-200 cursor-pointer hover:opacity-90 relative group"
                                title="Agrandir la photo"
                            >
                                <img :src="resolvePhotoUrl(att.file_path)" class="w-full h-full object-cover" />
                            </div>
                        </div>
                        <p v-else class="text-[10px] text-gray-400 italic">Aucune photo jointe</p>
                    </div>
                </div>
            </div>

            <!-- TAB 2: SYNTHESE GLOBALE (CHAMPS EXISTANTS) -->
            <div v-else class="mt-2">
                <!-- KPI -->

            <div class="
            mt-5
            grid
            grid-cols-2
            gap-3
        ">
                <div class="
                rounded-xl
                bg-slate-50
                p-4
            ">
                    <p class="
                    text-xs
                    text-gray-500
                ">
                        P50
                    </p>

                    <h4>
                        {{
                            right_sidebar.equipment?.p50
                        }}
                    </h4>
                </div>

                <div class="
                rounded-xl
                bg-slate-50
                p-4
            ">
                    <p class="
                    text-xs
                    text-gray-500
                ">
                        CO₂
                    </p>

                    <h4>
                        {{
                            right_sidebar.equipment?.co2
                        }}
                    </h4>
                </div>
            </div>

            <!-- EXTINCTEURS -->

            <div class="
            mt-6
            border-t
            border-gray-200
            pt-5
        ">
                <h6 class="mb-4">
                    Extincteurs
                </h6>

                <div class="
                grid
                grid-cols-2
                gap-3
            ">
                    <div>
                        <span class="
                        text-xs
                        text-gray-500
                    ">
                            P50
                        </span>

                        <p>
                            {{
                                right_sidebar.equipment?.p50
                            }}
                        </p>
                    </div>

                    <div>
                        <span class="
                        text-xs
                        text-gray-500
                    ">
                            P9
                        </span>

                        <p>
                            {{
                                right_sidebar.equipment?.p9
                            }}
                        </p>
                    </div>

                    <div>
                        <span class="
                        text-xs
                        text-gray-500
                    ">
                            P6
                        </span>

                        <p>
                            {{
                                right_sidebar.equipment?.p6
                            }}
                        </p>
                    </div>

                    <div>
                        <span class="
                        text-xs
                        text-gray-500
                    ">
                            CO₂
                        </span>

                        <p>
                            {{
                                right_sidebar.equipment?.co2
                            }}
                        </p>
                    </div>
                </div>
            </div>

            <!-- MATERIEL -->

            <div class="
            mt-6
            border-t
            border-gray-200
            pt-5
        ">
                <h6 class="mb-4">
                    Matériel
                </h6>

                <div class="
                flex
                flex-col
                gap-4
            ">
                    <div class="
                    flex
                    justify-between
                ">
                        <span>Pelles</span>

                        <strong>
                            {{
                                right_sidebar.equipment?.pelles
                            }}
                        </strong>
                    </div>

                    <div class="
                    flex
                    justify-between
                ">
                        <span>
                            Bac métal
                        </span>

                        <strong>
                            {{
                                right_sidebar.equipment?.bas_met
                            }}
                        </strong>
                    </div>

                    <div class="
                    flex
                    justify-between
                ">
                        <span>
                            Bac plastique
                        </span>

                        <strong>
                            {{
                                right_sidebar.equipment?.bas_plast
                            }}
                        </strong>
                    </div>

                    <div class="
                    flex
                    justify-between
                ">
                        <span>
                            Poubelle 120L
                        </span>

                        <strong>
                            {{
                                right_sidebar.equipment
                                    ?.poubelles_120l
                            }}
                        </strong>
                    </div>

                    <div class="
                    flex
                    justify-between
                ">
                        <span>
                            Poubelle 240L
                        </span>

                        <strong>
                            {{
                                right_sidebar.equipment
                                    ?.poubelles_240l
                            }}
                        </strong>
                    </div>
                </div>
            </div>

            <!-- SIGNALISATION -->

            <div class="
            mt-6
            border-t
            border-gray-200
            pt-5
        ">
                <h6 class="mb-4">
                    Signalisation
                </h6>

                <div class="
                flex
                flex-wrap
                gap-2
            ">
                    <span class="
                    rounded-full
                    bg-primary/10
                    px-3
                    py-1
                    text-xs
                ">
                        Ext :
                        {{
                            right_sidebar.equipment?.picto_ext
                        }}
                    </span>

                    <span class="
                    rounded-full
                    bg-primary/10
                    px-3
                    py-1
                    text-xs
                ">
                        CAF :
                        {{
                            right_sidebar.equipment?.picto_caf
                        }}
                    </span>

                    <span class="
                    rounded-full
                    bg-primary/10
                    px-3
                    py-1
                    text-xs
                ">
                        Défense fumer :
                        {{
                            right_sidebar.equipment
                                ?.picto_defense_de_fumer
                        }}
                    </span>
                </div>
            </div>

            <!-- CONTROLES -->

            <div class="
            mt-6
            border-t
            border-gray-200
            pt-5
        ">
                <h6 class="mb-4">
                    Contrôles
                </h6>

                <div class="
                flex
                flex-col
                gap-4
            ">
                    <div class="
                    flex
                    justify-between
                ">
                        <span>
                            Danger TGBT
                        </span>

                        <span :class="right_sidebar.equipment?.picto_danger_tgbt
                            ? 'text-green-600'
                            : 'text-red-600'
                            ">
                            {{
                                right_sidebar.equipment?.picto_danger_tgbt
                                    ? "Oui"
                                    : "Non"
                            }}
                        </span>
                    </div>

                    <div class="
                    flex
                    justify-between
                ">
                        <span>
                            Panneau Event
                        </span>

                        <span :class="right_sidebar.equipment?.panneau_event
                            ? 'text-green-600'
                            : 'text-red-600'
                            ">
                            {{
                                right_sidebar.equipment?.panneau_event
                                    ? "Oui"
                                    : "Non"
                            }}
                        </span>
                    </div>

                    <div class="
                    flex
                    justify-between
                ">
                        <span>
                            Livret réflexe
                        </span>

                        <span :class="right_sidebar.equipment?.livret_fiche_reflexe
                            ? 'text-green-600'
                            : 'text-red-600'
                            ">
                            {{
                                right_sidebar.equipment?.livret_fiche_reflexe
                                    ? "Oui"
                                    : "Non"
                            }}
                        </span>
                    </div>

                    <div class="
                    flex
                    justify-between
                ">
                        <span>
                            Politique HSSE
                        </span>

                        <span :class="right_sidebar.equipment?.politique
                            ? 'text-green-600'
                            : 'text-red-600'
                            ">
                            {{
                                right_sidebar.equipment?.politique
                                    ? "Oui"
                                    : "Non"
                            }}
                        </span>
                    </div>
                </div>
            </div>

            <!-- DATE -->

            <div class="
            mt-6
            border-t
            border-gray-200
            pt-5
        ">
                <span class="
                text-xs
                text-gray-500
            ">
                    Dernier relevé
                </span>

                <p class="mt-1 text-xs font-semibold text-gray-700">
                    {{ right_sidebar.equipment?.created_at || right_sidebar.equipment?.date || 'N/A' }}
                </p>
            </div>
        </div>
        </aside>

        <!-- LIGHTBOX MODAL IMAGE FULLSCREEN -->
        <div
            v-if="lightboxUrl"
            class="fixed inset-0 z-[10000] bg-black/85 backdrop-blur-xs flex items-center justify-center p-4 cursor-pointer"
            @click="lightboxUrl = null"
        >
            <div class="relative max-w-4xl max-h-[90vh]" @click.stop>
                <button
                    type="button"
                    @click="lightboxUrl = null"
                    class="absolute top-2 right-2 bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg cursor-pointer"
                    title="Fermer"
                >
                    <XIcon :size="20" />
                </button>
                <img :src="lightboxUrl" class="max-w-full max-h-[85vh] rounded-xl object-contain shadow-2xl" />
            </div>
        </div>

        <!-- ========================================================= -->
        <!-- MODAL NOUVEAU SUIVI MATÉRIEL (IN-PAGE MODAL)               -->
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
                                    <ClipboardList :size="18" />
                                </div>
                                <div>
                                    <h4 class="text-sm font-bold text-gray-900">
                                        {{ locale === 'en' ? 'New Equipment Monitoring' : 'Planifier un contrôle du parc matériel' }}
                                    </h4>
                                    <p class="text-[11px] text-gray-500">
                                        {{ locale === 'en' ? 'Select station, scheduled date and assigned inspector.' : 'Sélectionnez le site, la date d\'intervention et l\'inspecteur assigné.' }}
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
                        <form @submit.prevent="submitAddEquipment" class="flex flex-col flex-1 overflow-y-auto">
                            <div class="p-5 space-y-4">
                                <!-- Site / Station -->
                                <div>
                                    <label class="block text-xs font-semibold text-gray-700 mb-1">
                                        {{ locale === 'en' ? 'Site / Station Galana' : 'Site / Station Galana' }} <span class="text-red-500">*</span>
                                    </label>
                                    <input
                                        v-model="newEquipmentForm.site_name"
                                        required
                                        list="equipment_modal_sites_datalist"
                                        type="text"
                                        :placeholder="locale === 'en' ? 'Select or type station...' : 'Sélectionner ou saisir une station...'"
                                        class="w-full h-9 px-3 rounded-lg border border-gray-300 text-xs focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition"
                                    />
                                    <datalist id="equipment_modal_sites_datalist">
                                        <option v-for="site in sitesList" :key="site.id" :value="site.name">{{ site.name }}</option>
                                    </datalist>
                                </div>

                                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                    <!-- Date prévue -->
                                    <div>
                                        <label class="block text-xs font-semibold text-gray-700 mb-1">
                                            {{ locale === 'en' ? 'Scheduled inspection date' : 'Date prévue du contrôle' }} <span class="text-red-500">*</span>
                                        </label>
                                        <input
                                            v-model="newEquipmentForm.date"
                                            type="date"
                                            required
                                            class="w-full h-9 px-3 rounded-lg border border-gray-300 text-xs focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition"
                                        />
                                    </div>

                                    <!-- Inspecteur assigné -->
                                    <div>
                                        <label class="block text-xs font-semibold text-gray-700 mb-1">
                                            {{ locale === 'en' ? 'Assigned inspector' : 'Inspecteur assigné' }}
                                        </label>
                                        <select
                                            v-model="newEquipmentForm.user_id"
                                            class="w-full h-9 px-3 rounded-lg border border-gray-300 text-xs focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none bg-white transition cursor-pointer"
                                        >
                                            <option value="">{{ locale === 'en' ? 'Unassigned (default yourself)' : 'Non assigné (par défaut vous-même)' }}</option>
                                            <option v-for="user in usersList" :key="user.id" :value="user.id">
                                                {{ user.first_name || '' }} {{ user.last_name || '' }} {{ user.email ? '(' + user.email + ')' : '' }} {{ user.job ? '— ' + user.job : '' }}
                                            </option>
                                        </select>
                                    </div>
                                </div>

                                <!-- Statut initial -->
                                <div>
                                    <label class="block text-xs font-semibold text-gray-700 mb-1">
                                        {{ locale === 'en' ? 'Initial status' : 'Statut initial' }}
                                    </label>
                                    <select
                                        v-model="newEquipmentForm.status"
                                        class="w-full h-9 px-3 rounded-lg border border-gray-300 text-xs focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none bg-white transition cursor-pointer font-medium"
                                    >
                                        <option v-for="st in ChecklistStatusJsonData" :key="st.value" :value="st.value">
                                            {{ st.label }}
                                        </option>
                                    </select>
                                </div>

                                <!-- Observations -->
                                <div>
                                    <label class="block text-xs font-semibold text-gray-700 mb-1">
                                        {{ locale === 'en' ? 'Initial observations / Scope' : 'Observations initiales / Périmètre' }}
                                    </label>
                                    <textarea
                                        v-model="newEquipmentForm.observations"
                                        rows="2"
                                        :placeholder="locale === 'en' ? 'Notes on equipment to inspect (extinguishers, fire hose, sand buckets...)' : 'Notes sur les équipements à inspecter (extincteurs, RIA, bacs à sable...)'"
                                        class="w-full p-2.5 rounded-lg border border-gray-300 text-xs focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition"
                                    ></textarea>
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
                                    :disabled="loading_add || !newEquipmentForm.site_name || !newEquipmentForm.date"
                                    class="px-5 py-2 text-xs font-semibold text-white bg-primary hover:bg-primary/90 rounded-lg shadow-xs transition flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                                >
                                    <Loader v-if="loading_add" :size="13" class="animate-spin" />
                                    <span>{{ locale === 'en' ? 'Schedule Monitoring' : 'Planifier le contrôle' }}</span>
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
    import { computed, onMounted, ref, watch, type ComputedRef } from 'vue';
    import { useI18n } from 'vue-i18n';
    import { useRoute } from 'vue-router';
    import Header from '../../../components/shared/Header.vue';

    const { t, locale } = useI18n();

    import type { EquipmentMonitoringFilterType, EquipmentMonitoringFormType, EquipmentMonitoringType } from '../../../@types/EquipmentMonitoring.type.ts';
    import { EquipmentMonitoringFormData } from '../../../@data/EquipementMonitoring.data.ts';
    import type { ContextMenuActionType, contextMenuType } from '../../../@types/ContextMenu.type.ts';
    import ContextMenuUI from '../../../components/ui/ContextMenuUI.vue';
    import ChecklistStatus from '../../../components/features/checklist/ChecklistStatus.vue';
    import SidebarLocationMap from '../../../components/shared/SidebarLocationMap.vue';
    import { ChecklistStatusJsonData } from '../../../@data/Checklist.data.ts';
    import { CloudDownloadIcon, DownloadIcon, Edit, ExternalLink, Eye, Loader, Printer, RefreshCw, SearchIcon, SquarePlusIcon, Trash2, User, XIcon } from '@lucide/vue';
    import { router } from '../../../router/index.ts';
    import type { PaginationType } from '../../../@types/Pagination.type.ts';
    import ChipFilter from '../../../components/ui/ChipFilter.vue';
    import InputFilter from '../../../components/ui/InputFilter.vue';
    import { useEquipmentMonitoringService } from '../../../core/services/equipmentMonitoring.service.ts';
    import { exportUtils } from '../../../core/utils/export.utils.ts';
    import CenterModal from '../../../components/ui/centerModal.vue';
    import ButtonFilter from '../../../components/ui/ButtonFilter.vue';
    import { useSidebarNotification } from '../../../services/useSidebarNotification';
    import { useUserService } from '../../../core/services/user.service.ts';
    import type { SiteNameType } from '../../../@types/SiteName..type.ts';
    import { toast } from 'vue3-toastify';

    const route = useRoute()
    const sidebar_notification = useSidebarNotification()
    const equipments = useEquipmentMonitoringService()
    
    const userService = useUserService()
    const modal_add = ref(false)
    const loading_add = ref(false)
    const sitesList = ref<SiteNameType[]>([])
    const usersList = ref<any[]>([])

    const newEquipmentForm = ref({
        site_name: '',
        date: new Date().toISOString().split('T')[0],
        user_id: '',
        status: 'DRAFT',
        observations: ''
    })

    function openAddModal() {
        newEquipmentForm.value = {
            site_name: '',
            date: new Date().toISOString().split('T')[0],
            user_id: '',
            status: 'DRAFT',
            observations: ''
        }
        modal_add.value = true
        loadEquipmentSuggestions()
    }

    function loadEquipmentSuggestions() {
        if (sitesList.value.length === 0) {
            equipments.getSiteNames()
                .then((res: any) => {
                    sitesList.value = res.data || []
                })
                .catch(err => console.error('Erreur chargement sites:', err))
        }

        if (usersList.value.length === 0) {
            userService.index()
                .then((res: any) => {
                    usersList.value = res.data?.data || res.data || []
                })
                .catch(err => console.error('Erreur chargement utilisateurs:', err))
        }
    }

    async function submitAddEquipment() {
        if (!newEquipmentForm.value.site_name || !newEquipmentForm.value.date) return
        loading_add.value = true
        try {
            const payload: any = {
                site_name: newEquipmentForm.value.site_name,
                date: newEquipmentForm.value.date,
                user_id: newEquipmentForm.value.user_id || undefined,
                status: newEquipmentForm.value.status,
                observations: newEquipmentForm.value.observations || null,
                conformity_rate: 100,
                initial_conformity_rate: 100,
                items: []
            }
            await equipments.store(payload)
            toast.success(locale.value === 'en' ? 'Equipment monitoring scheduled successfully!' : 'Contrôle matériel planifié avec succès !')
            modal_add.value = false
            fetchData()
        } catch (err: any) {
            const errorMsg = err.response?.data?.message || (locale.value === 'en' ? 'Failed to schedule equipment monitoring.' : 'Erreur lors de la planification.')
            toast.error(errorMsg)
        } finally {
            loading_add.value = false
        }
    }

    const searchQuery = ref<string>("")
    const activeTab = ref<'items' | 'summary'>('items')
    const lightboxUrl = ref<string | null>(null)
    const right_sidebar = ref<{
        isOpen?: boolean,
        equipment?: EquipmentMonitoringType
    }>(
        {
            isOpen: false,
            equipment: undefined
        }
    )

    function selectEquipment(item: EquipmentMonitoringType) {
        right_sidebar.value = {
            isOpen: true,
            equipment: item,
        }
        activeTab.value = 'items'
        if (item.id) {
            equipments.getItems(item.id).then(res => {
                if (res?.data?.items && right_sidebar.value.equipment) {
                    right_sidebar.value.equipment.items = res.data.items
                    if (res.data.conformity_rate !== undefined) {
                        right_sidebar.value.equipment.conformity_rate = res.data.conformity_rate
                    }
                    if (res.data.status !== undefined) {
                        right_sidebar.value.equipment.status = res.data.status
                    }
                }
            }).catch(err => console.error("Erreur chargement items équipement:", err))
        }
    }

    function statusDotColor(status?: string, conformityRate?: number) {
        const rate = conformityRate ?? 100
        if (rate >= 90 && (!status || status === 'COMPLETED' || status === 'Conforme')) {
            return 'bg-emerald-500'
        }
        if (rate >= 70 || status === 'WARNING' || status === 'Contrôle requis') {
            return 'bg-amber-500'
        }
        return 'bg-red-500'
    }

    function badgeColor(status?: string, conformityRate?: number) {
        const rate = conformityRate ?? 100
        if (rate >= 90 && (!status || status === 'COMPLETED' || status === 'Conforme')) {
            return 'bg-[#D1FAE5]/70 text-[#065F46] border border-[#A7F3D0]'
        }
        if (rate >= 70 || status === 'WARNING' || status === 'Contrôle requis') {
            return 'bg-[#FEF3C7]/80 text-[#92400E] border border-[#FDE68A]'
        }
        return 'bg-[#FEE2E2]/80 text-[#991B1B] border border-[#FECACA]'
    }

    function formatStatus(status?: string, conformityRate?: number) {
        const rate = conformityRate ?? 100
        if (rate >= 90) return '🟢 Conforme'
        if (rate >= 70) return '🟡 Contrôle requis'
        return '🔴 Anomalie'
    }

    function formatStatusText(status?: string, conformityRate?: number) {
        const rate = conformityRate ?? 100
        if (rate >= 90) return 'Conforme'
        if (rate >= 70) return 'Contrôle requis'
        return 'Anomalie'
    }

    function formatConformityRate(rate?: number | string) {
        if (rate === undefined || rate === null) return '100%'
        const num = Number(rate)
        if (isNaN(num)) return '100%'
        if (num % 1 === 0) return `${num}%`
        return `${num.toFixed(2)}%`
    }

    function getSiteNameText(site: any): string {
        if (!site) return ''
        if (typeof site === 'string') return site
        if (typeof site === 'object' && site.name) return String(site.name)
        return String(site)
    }

    function formatInspector(user: any): string {
        if (!user) return locale.value === 'en' ? 'Unassigned' : 'Non assigné'
        if (user.first_name || user.last_name) {
            return `${user.first_name || ''} ${user.last_name || ''}`.trim()
        }
        if (user.name) return user.name
        if (user.email) return user.email
        return locale.value === 'en' ? 'Unassigned' : 'Non assigné'
    }

    function resolvePhotoUrl(path: string) {
        if (!path) return ''
        if (path.startsWith('http')) return path
        const backendUrl = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://127.0.0.1:8000'
        return `${backendUrl}${path}`
    }

    function previewImage(path: string) {
        lightboxUrl.value = resolvePhotoUrl(path)
    }

    async function toggleItemConformity(item: any) {
        const newConformity = !item.conformity
        item.conformity = newConformity
        try {
            await equipments.updateItem(item.id, { conformity: newConformity })
            if (right_sidebar.value.equipment?.id) {
                const r = await equipments.getItems(right_sidebar.value.equipment.id)
                if (r?.data?.items && right_sidebar.value.equipment) {
                    right_sidebar.value.equipment.items = r.data.items
                    if (r.data.conformity_rate !== undefined) {
                        right_sidebar.value.equipment.conformity_rate = r.data.conformity_rate
                    }
                    if (r.data.status !== undefined) {
                        right_sidebar.value.equipment.status = r.data.status
                    }
                }
            }
        } catch (err) {
            console.error('Erreur mise à jour conformité item:', err)
        }
    }

    async function onUploadPhoto(event: Event, item: any) {
        const input = event.target as HTMLInputElement
        if (!input.files || input.files.length === 0) return
        const file = input.files[0]
        try {
            const res = await equipments.uploadItemPhoto(item.id, file)
            if (res?.data?.attachment) {
                if (!item.attachments) item.attachments = []
                item.attachments.push(res.data.attachment)
            }
        } catch (err) {
            console.error('Erreur upload photo item:', err)
        } finally {
            input.value = ''
        }
    }

    function openOfficialPdf(id?: string | number) {
        if (!id) return;
        const routeData = router.resolve({
            name: 'EQUIPMENT_MONITORING_DETAILS',
            params: { id },
            query: { print: 'true' }
        });
        window.open(routeData.href, '_blank');
    }

    const context_actions: ComputedRef<ContextMenuActionType[]> = computed(() => {
        return [
            {
                label: locale.value === 'en' ? 'Quick preview' : 'Aperçu rapide',
                icon: Eye,
                onClick: () => {
                    right_sidebar.value.isOpen = true
                    right_sidebar.value.equipment = context_menu.value.equipment
                }
            },
            {
                label: locale.value === 'en' ? 'Full record (Details)' : 'Fiche complète (Détails)',
                icon: ExternalLink,
                onClick: () => {
                    if (context_menu.value.equipment?.id) {
                        router.push({
                            name: 'EQUIPMENT_MONITORING_DETAILS',
                            params: { id: context_menu.value.equipment.id }
                        })
                    }
                }
            },
            {
                label: locale.value === 'en' ? 'Edit' : 'Modifier',
                icon: Edit,
                variant: 'WARNING',
                onClick: () => {
                    router.push({
                        name: 'EQUIPMENT_MONITORING_UPDATE',
                        params: {
                            id: context_menu.value.equipment?.id
                        }
                    })
                }
            },
        ]
    })
    const context_menu = ref<{
        isOpen?: boolean,
        equipment?: EquipmentMonitoringType,
        context_menu?: contextMenuType

    }>({
        context_menu: undefined,
        isOpen: false, equipment: undefined
    })
    const headers = computed(() => [
        "#",
        t('table.date'),
        t('table.site'),
        t('table.inspector'),
        t('table.status'),
        t('table.conformity'),
    ])

    const data = ref<EquipmentMonitoringType[]>()
    type filtersKeyType = "site" | "status" | "inspector"
    const filterableKeys: filtersKeyType[] = ["site", "status", "inspector"]
    const columnLables = computed<Record<filtersKeyType, string>>(() => ({
        site: locale.value === 'en' ? 'Site' : 'Site',
        status: locale.value === 'en' ? 'Status' : 'Statut',
        inspector: locale.value === 'en' ? 'Inspector' : 'Inspecteur'
    }))
    const filters = ref<Record<filtersKeyType, string[]>>({
        site: [],
        status: [],
        inspector: [],
    })
    const conformityFilter = ref<'ALL' | 'CONFORME' | 'NON_CONFORME'>('ALL')
    const columnOptions = ref<Record<filtersKeyType, string[]>>({
        site: [],
        status: ChecklistStatusJsonData.map(item => item.label),
        inspector: [],
    })
    const dateRange = ref<{
        from: string,
        to: string
    }>({
        from: '',
        to: ''
    })
    const modal_delete = ref<boolean>(false)
    const showDateFilter = ref<boolean>(false)
    const pagination = ref<PaginationType>({
        'current_page': 1,
        'to': 0,
        'total': 0
    })
    const loading_data = ref<boolean>(false)
    const loading_export = ref<boolean>(false)
    const loading_delete = ref<boolean>(false)

    function getFilterParams(page = pagination.value.current_page): EquipmentMonitoringFilterType {
        return {
            page,
            site: filters.value.site.length ? filters.value.site : undefined,
            status: filters.value.status.length
                ? filters.value.status.map(item => ChecklistStatusJsonData.find(i => i.label === item)?.value || item)
                : undefined,
            conformity: conformityFilter.value !== 'ALL' ? conformityFilter.value : undefined,
            inspector: filters.value.inspector.length ? filters.value.inspector : undefined,
            date: dateRange.value.from || dateRange.value.to ? dateRange.value : undefined,
            search: searchQuery.value || undefined,
        }
    }

    async function handleRouteAutoSelect() {
        const targetMonitoringId = (route.params.id || route.query.monitoring_id) as string | undefined
        const targetSite = route.query.site as string | undefined

        if (targetMonitoringId) {
            const existing = data.value?.find(item => String(item.id) === String(targetMonitoringId))
            if (existing) {
                selectEquipment(existing)
                return
            }
            try {
                const res = await equipments.show(targetMonitoringId)
                if (res?.data) {
                    selectEquipment(res.data as EquipmentMonitoringType)
                }
            } catch (err) {
                console.error("Impossible de charger le contrôle spécifié:", err)
            }
        } else if (targetSite && data.value && data.value.length > 0) {
            const cleanSite = targetSite.toLowerCase().replace(/^ss\s+/i, '').trim()
            const match = data.value.find(item => {
                const itemSite = getSiteNameText(item.site_name).toLowerCase().replace(/^ss\s+/i, '').trim()
                return itemSite === cleanSite || itemSite.includes(cleanSite)
            })
            if (match) {
                selectEquipment(match)
            }
        }
    }

    const metaStats = ref({
        total: 0,
        conforme: 0,
        non_conforme: 0,
    })

    function quickFilterConformity(type: 'ALL' | 'CONFORME' | 'NON_CONFORME') {
        conformityFilter.value = type
        pagination.value.current_page = 1
        fetchData(getFilterParams(1))
    }

    function fetchData(params?: EquipmentMonitoringFilterType) {
        loading_data.value = true
        const queryParams = params ?? getFilterParams()
        return equipments.index(queryParams)
            .then(async res => {
                console.log(res.data)
                data.value = res.data.data as EquipmentMonitoringType[]
                if (res.data?.meta) {
                    pagination.value.to = res.data.meta.to
                    pagination.value.total = res.data.meta.total
                }
                if (res.data?.meta_stats) {
                    metaStats.value = res.data.meta_stats
                }
                sidebar_notification.fetchCounts()
                await handleRouteAutoSelect()
            })
            .catch(err => {
                console.error(err)
            }).finally(() => {
                loading_data.value = false
            })
    }

    function fetchFilters() {
        equipments.getFilters()
            .then(res => {
                console.log(res)
                const fetched = res.data as Record<filtersKeyType, string[]>
                columnOptions.value = {
                    site: fetched.site || [],
                    status: ChecklistStatusJsonData.map(item => item.label),
                    inspector: fetched.inspector || [],
                }
            })
            .catch(err => {
                console.error(err)
            })
    }

    function clearAllFilters() {
        filters.value.site = []
        filters.value.status = []
        filters.value.inspector = []
        conformityFilter.value = 'ALL'
        dateRange.value.from = ''
        dateRange.value.to = ''
        searchQuery.value = ""
        if (route.query.site || route.query.monitoring_id || route.params.id) {
            router.replace({ name: 'EQUIPMENT_MONITORING' })
        }
    }

    const exportFields: {
        key: keyof EquipmentMonitoringFormType, excelName: string
    }[] = Object.keys(EquipmentMonitoringFormData).map(item => ({
        key: item as keyof EquipmentMonitoringFormType,
        excelName: item.replace("d_", "d'").replace("site_name", 'ss').replace("poubelles", 'poubelle').toUpperCase().replaceAll('_', ' ')
    }))

    function exportData() {
        loading_export.value = true
        equipments.export(getFilterParams())
            .then(res => {
                const equipmentsData: EquipmentMonitoringType[] = res.data.data
                console.log(equipmentsData)
                const convertedData = equipmentsData.map(item => {
                    return Object.fromEntries(
                        Object.entries(item).map(([key, value]) => {
                            if (typeof value === 'boolean') {
                                return [key, value ? 'Oui' : 'Non']
                            }
                            return [key, value]
                        })
                    )
                })
                exportUtils(convertedData, exportFields, undefined, undefined, 'export_equipment_monitoring')
            })
            .catch(err => {
                console.error(err)
            })
            .finally(() => {
                loading_export.value = false
            })
    }

    function deleteEquipments() {
        loading_delete.value = true
        equipments.delete(right_sidebar.value.equipment?.id as string | number)
            .then(res => {
                console.log(res.data)
                fetchData(getFilterParams(pagination.value.current_page))
                modal_delete.value = false
            })
            .catch(err => {
                console.error(err)
            })
            .finally(() => {
                loading_delete.value = false
            })
    }

    watch([() => filters.value.site, () => filters.value.status, () => filters.value.inspector, dateRange.value, () => searchQuery.value, () => conformityFilter.value], () => {
        pagination.value.current_page = 1
        fetchData(getFilterParams(1))
    }, {
        deep: true,
        immediate: false
    })

    watch(() => pagination.value.current_page, (newPage) => {
        fetchData(getFilterParams(newPage))
    }, {
        immediate: false
    })

    watch([() => route.query.monitoring_id, () => route.query.site, () => route.params.id], () => {
        if (route.query.site && !filters.value.site.includes(String(route.query.site))) {
            filters.value.site = [String(route.query.site)]
        }
        handleRouteAutoSelect()
    })

    onMounted(() => {
        fetchFilters()
        if (route.query.site) {
            filters.value.site = [String(route.query.site)]
        }
        fetchData(getFilterParams(1))
    })
</script>