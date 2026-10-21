<template>
    <div class="flex w-full flex-row" @click="contextMenu.isOpen = false">

        <div class="flex min-w-0 flex-1 flex-col transition-all">

            <Header title="inspections.vmc.title" :thumbnails="[
                { label: 'thumbnails.home', name: 'DASHBOARD' },
                { label: 'thumbnails.inspections', name: 'INSPECTION' },
                { label: 'thumbnails.vmc', name: 'VMC' }
            ]" />

            <div class="border-b border-gray-200 bg-white sticky top-0 z-10">
                <div class="h-16 px-6 flex flex-row items-center justify-between gap-4">
                    <div class="flex flex-row items-center gap-1.5">
                        <ButtonFilter text="Ajout" :icon="PlusSquare" is-primary @click="openAddModal" />
                        <ButtonFilter text="Export" :icon="Download" :badge="String(pagination.total)" @click="handleExport" />
                        <ButtonFilter text="Actualiser" :icon="RefreshCw" :loading="loading" @click="fetchData()" />
                    </div>
                    <div class="flex flex-row items-center gap-2">
                        <InputFilter :icon="Search" placeholder="Rechercher une VMC..." v-model="searchQuery" />
                    </div>
                </div>
                <ChipFilter :filterable-keys="filterableKeys" :column-labels="columnLabels"
                    :column-options="columnOptions" :filters="filters" :results-total="pagination.total"
                    :results-count="pagination.to" :date-range="dataRange" @clear-all="clearFilters" />
            </div>

            <!-- LOADING SPINNER -->
            <div v-if="loading" class="p-16 flex flex-col items-center justify-center gap-3 text-gray-500">
                <Loader :size="32" class="animate-spin text-primary" />
                <span class="text-sm">{{ locale === 'en' ? 'Loading VMC visits...' : 'Chargement des VMC...' }}</span>
            </div>

            <!-- EMPTY STATE -->
            <div v-else-if="data.length === 0" class="p-16 flex flex-col items-center justify-center text-center">
                <div class="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mb-4">
                    <ClipboardList :size="28" />
                </div>
                <h5 class="text-gray-700 font-semibold mb-1">{{ locale === 'en' ? 'No VMC recorded' : 'Aucune VMC enregistrée' }}</h5>
                <p class="text-sm text-gray-500 max-w-sm">
                    {{ locale === 'en' ? 'No visit matches the selected filter criteria.' : 'Aucune visite ne correspond aux critères de filtre sélectionnés.' }}
                </p>
                <div class="flex gap-2 mt-4">
                    <button
                        v-if="searchQuery || filters.type.length || filters.site.length || filters.inspector.length || dataRange.from || dataRange.to"
                        @click="clearFilters"
                        class="px-4 py-2 text-xs font-medium text-primary bg-primary/10 rounded-lg hover:bg-primary/20 transition">
                        {{ t('common.reset_filters') }}
                    </button>
                    <button
                        @click="openAddModal"
                        class="px-4 py-2 text-xs font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition">
                        {{ locale === 'en' ? 'Create a VMC' : 'Créer une VMC' }}
                    </button>
                </div>
            </div>

            <!-- TABLE DES VMC -->
            <table v-else>
                <thead>
                    <tr>
                        <th class="w-16 text-center">{{ t('table.ref') }}</th>
                        <th>{{ t('table.date') }}</th>
                        <th>{{ t('table.type') }}</th>
                        <th>{{ t('table.site') }}</th>
                        <th>{{ t('table.inspector') }}</th>
                        <th>{{ t('table.status') }}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in data" :key="item.id" class="cursor-pointer"
                        :class="isSelected(item) ? 'bg-primary/10 font-medium' : ''" @click="openPreview(item)"
                        @contextmenu.prevent="openContextMenu($event, item)">
                        <td class="font-mono text-xs text-gray-400 text-center">#{{ item.id }}</td>
                        <td class="whitespace-nowrap text-gray-500 font-mono text-xs">{{ item.date ? new Date(item.date).toLocaleDateString() : '-' }}</td>
                        <td class="font-medium text-gray-900">{{ item.type }}</td>
                        <td class="text-gray-700">{{ item.site ? item.site : '-' }}</td>
                        <td class="text-gray-700">{{ item.inspector ? item.inspector : '-' }}</td>
                        <td>
                            <ChecklistStatus :name="item.status" />
                        </td>
                    </tr>
                </tbody>
                <tfoot>
                    <tr>
                        <td colspan="6" class="w-full p-4 border-t border-gray-200">
                            <div class="flex flex-row items-center justify-between text-sm">
                                <span class="text-xs text-gray-500 font-medium">
                                    {{ t('common.displaying') }} {{ pagination.to }} {{ t('common.of') }} {{ pagination.total }} {{ locale === 'en' ? 'VMC visits' : 'visites VMC' }}
                                </span>
                                <vue-awesome-paginate v-model="pagination.current_page" :total-items="pagination.total"
                                    :items-per-page="15" :max-pages-shown="4" :hide-prev-next-when-ends="true"
                                    @click="onPageChange" />
                            </div>
                        </td>
                    </tr>
                </tfoot>
            </table>

        </div>


        <!-- ========================================================= -->
        <!-- APERÇU DE LA VMC SÉLECTIONNÉE (DRAWER LATÉRAL) -->
        <!-- ========================================================= -->

        <aside v-if="right_sidebar.isOpen && selected" aria-label="Aperçu de la VMC"
            class="sticky top-0 flex h-screen w-[400px] min-w-[400px] max-w-[400px] shrink-0 flex-col border-l border-gray-200 bg-white shadow-xl z-20">

            <!-- En-tête -->
            <header class="flex items-start justify-between gap-3 border-b border-gray-200 p-5 bg-white shrink-0">

                <div class="flex min-w-0 flex-1 flex-col">
                    <p class="text-[11px] font-bold uppercase tracking-wider text-gray-400">VMC n° {{ selected.id }}</p>
                    <h4 class="mt-1 font-bold text-gray-900 truncate">{{ selected.title || selected.type || "Sans titre" }}</h4>
                    <div class="mt-2.5">
                        <ChecklistStatus :name="selected.status" />
                    </div>
                </div>

                <button type="button" aria-label="Fermer l'aperçu"
                    class="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
                    @click="closePreview">
                    <XIcon :size="18" />
                </button>

            </header>

            <!-- Contenu -->
            <div class="flex flex-1 flex-col gap-4 overflow-y-auto p-4 bg-slate-50/50">

                <!-- CARTOGRAPHIE DE L'EMPLACEMENT DU SITE VMC -->
                <SidebarLocationMap
                    :site-name="selected.site || selected.inspection?.site || selected.title"
                    :location-name="selected.site_location?.locality || selected.site"
                    :latitude="selected.site_location?.latitude"
                    :longitude="selected.site_location?.longitude"
                    :locality="selected.site_location?.locality"
                    :province="selected.site_location?.province"
                    :status="selected.status"
                    :conformity-rate="selectedStats.conformityRate"
                />

                <!-- RÉSUMÉ DE LA VISITE CLÔTURÉE / ÉVALUÉE -->
                <section v-if="selected.status === 'COMPLETED' || selectedStats.total > 0" class="flex flex-col gap-3">
                    <div class="flex items-center justify-between">
                        <h6 class="text-xs font-semibold uppercase tracking-wide text-text-muted">Résumé de clôture</h6>
                        <span v-if="selected.status === 'COMPLETED'" class="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            <CheckCircle2 :size="12" />
                            Clôturée
                        </span>
                    </div>

                    <!-- KPI Cards de conformité -->
                    <div class="grid grid-cols-2 gap-2">
                        <div class="p-3 bg-white rounded-xl border border-border shadow-xs flex flex-col">
                            <span class="text-[11px] text-gray-500 font-medium">Conformité</span>
                            <span class="text-lg font-bold text-gray-900 mt-1">{{ selectedStats.conformityRate }}%</span>
                            <span class="text-[10px] text-emerald-600 font-medium mt-0.5">{{ selectedStats.yes }} / {{ selectedStats.evaluated }} conformes</span>
                        </div>
                        <div class="p-3 bg-white rounded-xl border border-border shadow-xs flex flex-col">
                            <span class="text-[11px] text-gray-500 font-medium">Contrôles</span>
                            <span class="text-lg font-bold text-gray-900 mt-1">{{ selectedStats.total }} points</span>
                            <div class="flex items-center gap-1.5 text-[10px] mt-0.5">
                                <span class="text-emerald-600 font-semibold">{{ selectedStats.yes }} Oui</span>
                                <span v-if="selectedStats.no > 0" class="text-red-600 font-semibold">• {{ selectedStats.no }} Non</span>
                            </div>
                        </div>
                    </div>

                    <!-- Mini liste scrollable des critères vérifiés -->
                    <div v-if="selectedItems.length > 0" class="bg-white rounded-xl border border-border p-3 shadow-xs">
                        <div class="flex items-center justify-between mb-2">
                            <span class="text-xs font-semibold text-gray-800">Points vérifiés</span>
                            <span class="text-[11px] text-gray-400">{{ selectedItems.length }} critères</span>
                        </div>
                        <div class="max-h-44 overflow-y-auto space-y-2 pr-1 divide-y divide-gray-100">
                            <div v-for="(it, idx) in selectedItems" :key="idx" class="pt-1.5 first:pt-0 flex items-start gap-2 text-xs">
                                <span v-if="isItemYes(it.answer)" class="shrink-0 w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px] font-bold">✓</span>
                                <span v-else-if="isItemNo(it.answer)" class="shrink-0 w-4 h-4 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-[10px] font-bold">✕</span>
                                <span v-else class="shrink-0 w-4 h-4 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center text-[9px]">NA</span>
                                <div class="min-w-0 flex-1">
                                    <p class="truncate text-gray-800 font-medium leading-tight">{{ it.title }}</p>
                                    <p v-if="it.observation" class="text-[11px] text-amber-700 mt-0.5 truncate">Obs: {{ it.observation }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section class="flex flex-col gap-3">
                    <h6 class="text-xs font-semibold uppercase tracking-wide text-text-muted">Informations</h6>
                    <dl class="flex flex-col divide-y divide-border rounded-xl border border-border bg-white shadow-sm">
                        <div v-for="row in infoRows" :key="row.label" class="flex items-center gap-3 px-3.5 py-3">
                            <div
                                class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-light text-primary">
                                <component :is="row.icon" class="h-4 w-4" />
                            </div>
                            <div class="min-w-0">
                                <dt class="text-xs text-text-muted">{{ row.label }}</dt>
                                <dd class="truncate text-sm font-medium"
                                    :class="row.value ? 'text-text-primary' : 'text-text-muted'">
                                    {{ row.value || "-" }}
                                </dd>
                            </div>
                        </div>
                    </dl>
                </section>

                <section class="flex flex-col gap-3">
                    <h6 class="text-xs font-semibold uppercase tracking-wide text-text-muted">Responsables</h6>
                    <ul class="flex flex-col gap-2">
                        <li v-for="person in people" :key="person.label"
                            class="flex items-center gap-3 rounded-xl border border-border p-3 bg-white shadow-sm">
                            <div
                                class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-light text-xs font-semibold text-primary">
                                <span v-if="person.initials">{{ person.initials }}</span>
                                <UserRound v-else class="h-4 w-4" />
                            </div>
                            <div class="min-w-0">
                                <p class="text-xs text-text-muted">{{ person.label }}</p>
                                <p class="truncate text-sm font-medium"
                                    :class="person.name ? 'text-text-primary' : 'text-text-muted'">
                                    {{ person.name || "Non renseigné" }}
                                </p>
                                <p v-if="person.email" class="truncate text-xs text-text-muted">{{ person.email }}</p>
                            </div>
                        </li>
                    </ul>
                </section>

                <section class="flex flex-col gap-3">
                    <h6 class="text-xs font-semibold uppercase tracking-wide text-text-muted">Recommandations & Observations</h6>
                    <p v-if="selected.recommendation?.trim()"
                        class="whitespace-pre-line rounded-xl bg-white border border-border p-3.5 text-sm leading-relaxed text-text-primary shadow-sm">
                        {{ selected.recommendation }}
                    </p>
                    <p v-else class="rounded-xl border border-dashed border-border p-3.5 text-sm text-text-muted bg-white">
                        Aucune recommandation pour cette visite.
                    </p>
                </section>

            </div>

            <!-- Actions du footer : Clôture + Redirection Détails + Téléchargement PDF -->
            <footer class="flex flex-col gap-2 border-t border-border p-4 bg-white">
                <div class="flex items-center justify-between gap-2">
                    <Button variant="outline" type="button" @click="closePreview">Fermer</Button>

                    <div class="flex items-center gap-2">
                        <Button v-if="selected.status === 'DRAFT'" type="button" @click="changeStatus(selected, 'IN_PROGRESS')">
                            Démarrer la visite
                        </Button>
                        <Button v-else-if="selected.status === 'IN_PROGRESS'" type="button" @click="changeStatus(selected, 'COMPLETED')">
                            Clôturer la visite
                        </Button>
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-2 pt-1 border-t border-gray-100">
                    <Button type="button" :left-icon="Eye" @click="goToDetails(selected)">
                        Détails
                    </Button>
                    <Button variant="outline" type="button" :left-icon="FileDown" @click="downloadVmcPdf(selected)">
                        Fiche PDF
                    </Button>
                </div>
            </footer>

        </aside>

        <!-- MENU CONTEXTUEL -->
        <ContextMenuUI v-model="contextMenu.isOpen" :context-menu="contextMenu.contextMenu"
            :actions="contextMenuActions" :bottom_actions="contextMenuBottomActions"/>


        <!-- MODAL D'AJOUT DE VMC -->
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
                        <div class="px-5 py-3.5 bg-gradient-to-r from-slate-50 to-emerald-50/40 border-b border-gray-200 flex items-center justify-between shrink-0">
                            <div class="flex items-center gap-2.5">
                                <div class="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                                    <ShieldCheck :size="18" />
                                </div>
                                <div>
                                    <h4 class="text-sm font-bold text-gray-900">
                                        {{ locale === 'en' ? 'New VMC Visit' : 'Planifier une nouvelle VMC' }}
                                    </h4>
                                    <p class="text-[11px] text-gray-500">
                                        {{ locale === 'en' ? 'Select visit type, site and assign an inspector.' : "Sélectionnez le type de visite, le site et l'inspecteur en charge." }}
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
                        <form @submit.prevent="submitAddVmc" class="flex flex-col flex-1 overflow-y-auto">
                            <div class="p-5 space-y-4">
                                <!-- Type de VMC -->
                                <div>
                                    <label class="block text-xs font-semibold text-gray-700 mb-1">
                                        {{ locale === 'en' ? 'VMC Type' : 'Type de visite VMC' }} <span class="text-red-500">*</span>
                                    </label>
                                    <select
                                        v-model="newVmcForm.type"
                                        required
                                        class="w-full h-9 px-3 rounded-lg border border-gray-300 text-xs focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none bg-white transition cursor-pointer"
                                    >
                                        <option v-for="t in VMCTypeData" :key="t.value" :value="t.value">{{ t.label }}</option>
                                    </select>
                                </div>

                                <!-- Titre optionnel -->
                                <div>
                                    <label class="block text-xs font-semibold text-gray-700 mb-1">
                                        {{ locale === 'en' ? 'Title (Optional)' : 'Titre de la VMC (Optionnel)' }}
                                    </label>
                                    <input
                                        v-model="newVmcForm.title"
                                        type="text"
                                        :placeholder="locale === 'en' ? 'Ex: VMC Station-Service Ankorondrano' : 'Ex: VMC Station-Service Ankorondrano'"
                                        class="w-full h-9 px-3 rounded-lg border border-gray-300 text-xs focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition"
                                    />
                                </div>

                                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                    <!-- Date -->
                                    <div>
                                        <label class="block text-xs font-semibold text-gray-700 mb-1">
                                            {{ locale === 'en' ? 'Visit Date' : 'Date de la visite' }} <span class="text-red-500">*</span>
                                        </label>
                                        <input
                                            v-model="newVmcForm.date"
                                            type="date"
                                            required
                                            class="w-full h-9 px-3 rounded-lg border border-gray-300 text-xs focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition"
                                        />
                                    </div>

                                    <!-- Site avec input / datalist -->
                                    <div>
                                        <label class="block text-xs font-semibold text-gray-700 mb-1">
                                            {{ locale === 'en' ? 'Galana Site / Station' : 'Site / Station Galana' }} <span class="text-red-500">*</span>
                                        </label>
                                        <input
                                            v-model="newVmcForm.site"
                                            list="vmc_modal_sites_datalist"
                                            required
                                            :placeholder="locale === 'en' ? 'Select or type a site...' : 'Sélectionner ou saisir un site...'"
                                            class="w-full h-9 px-3 rounded-lg border border-gray-300 text-xs focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition"
                                        />
                                        <datalist id="vmc_modal_sites_datalist">
                                            <option v-for="(s, sIdx) in siteList" :key="sIdx" :value="s">{{ s }}</option>
                                        </datalist>
                                    </div>
                                </div>

                                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                    <!-- Inspecteur -->
                                    <div>
                                        <label class="block text-xs font-semibold text-gray-700 mb-1">
                                            {{ locale === 'en' ? 'Inspector / In charge' : 'Inspecteur / Responsable' }}
                                        </label>
                                        <input
                                            v-model="newVmcForm.inspector"
                                            list="vmc_modal_inspectors_datalist"
                                            :placeholder="locale === 'en' ? 'Select or type inspector...' : 'Sélectionner ou saisir un inspecteur...'"
                                            class="w-full h-9 px-3 rounded-lg border border-gray-300 text-xs focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition"
                                        />
                                        <datalist id="vmc_modal_inspectors_datalist">
                                            <option v-for="(p, pIdx) in personnelList" :key="pIdx" :value="p">{{ p }}</option>
                                        </datalist>
                                    </div>

                                    <!-- Accompagnant -->
                                    <div>
                                        <label class="block text-xs font-semibold text-gray-700 mb-1">
                                            {{ locale === 'en' ? 'Accompanying person' : 'Personne accompagnante' }}
                                        </label>
                                        <input
                                            v-model="newVmcForm.accompanying_person"
                                            type="text"
                                            :placeholder="locale === 'en' ? 'Name of accompanying person...' : 'Nom de l’accompagnant...'"
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
                                    :disabled="loading_add || !newVmcForm.type || !newVmcForm.site || !newVmcForm.date"
                                    class="px-5 py-2 text-xs font-semibold text-white bg-primary hover:bg-primary/90 rounded-lg shadow-xs transition flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                                >
                                    <Loader v-if="loading_add" :size="14" class="animate-spin" />
                                    <span>{{ locale === 'en' ? 'Create VMC' : 'Créer la VMC' }}</span>
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
    import {
        Ban,
        CalendarDays,
        CheckCircle2,
        ClipboardCheck, ClipboardList, ShieldCheck,
        Download,
        Eye,
        FileDown,
        Loader,
        MapPin,
        Play,
        PlusSquare,
        RefreshCw,
        Search,
        Trash2,
        UserCheck,
        UserRound,
        Users,
        XIcon,
    } from '@lucide/vue';
    import Header from '../../../components/shared/Header.vue';
    import ButtonFilter from '../../../components/ui/ButtonFilter.vue';
    import InputFilter from '../../../components/ui/InputFilter.vue';
    import ChipFilter from '../../../components/ui/ChipFilter.vue';
    import Button from '../../../components/ui/Button.vue';
    import ChecklistStatus from '../../../components/features/checklist/ChecklistStatus.vue';
    import SidebarLocationMap from '../../../components/shared/SidebarLocationMap.vue';
    import ContextMenuUI from '../../../components/ui/ContextMenuUI.vue';
    import { computed, onMounted, onUnmounted, ref, watch, type ComputedRef } from 'vue';
    import type { VMCDataType, VMCFilterType } from '../../../@types/VMC.type.ts';
    import type { UserDataType } from '../../../@types/User.type.ts';
    import type { ContextMenuActionType, contextMenuType } from '../../../@types/ContextMenu.type.ts';
    import vmcService from '../../../core/services/vmc.service.ts';
    import personnelService from '../../../core/services/personnel.service.ts';
    import siteService from '../../../core/services/site.service.ts';
    import { toast } from 'vue3-toastify';
    import type { VMCFormType } from '../../../@types/VMC.type.ts';
    import { router } from '../../../router/index.ts';
    import { useRoute } from 'vue-router';
    import { useI18n } from 'vue-i18n';

    const { t, locale } = useI18n()
    const route = useRoute()


    
    const VMCTypeData: { label: string, value: string }[] = [
        { label: 'Station-Service', value: 'Station-Service' },
        { label: 'Inspection camion', value: 'Inspection camion' },
        { label: 'Visite Magasins & Agences', value: 'Visite Magasins & Agences' },
        { label: 'Safety Report', value: 'SAFETY REPORT' },
        { label: 'Safety Moment', value: 'SAFETY MOMENT' },
        { label: 'Safety Awareness', value: 'SAFETY AWARENESS' },
    ]

    const modal_add = ref(false)
    const loading_add = ref(false)
    const newVmcForm = ref<VMCFormType>({
        type: 'Station-Service',
        title: '',
        date: new Date().toISOString().slice(0, 10),
        site: '',
        inspector: '',
        accompanying_person: '',
    })

    const personnelsListRaw = ref<any[]>([])
    const siteList = ref<string[]>([])

    const personnelList = computed(() => {
        return personnelsListRaw.value.map(p => {
            const fullName = `${p.first_name} ${p.last_name || ''}`.trim()
            const details = [p.direction, p.fonction].filter(Boolean).join(' - ')
            return details ? `${fullName} - ${details}` : fullName
        }).filter(Boolean)
    })

    function openAddModal() {
        newVmcForm.value = {
            type: 'Station-Service',
            title: '',
            date: new Date().toISOString().slice(0, 10),
            site: '',
            inspector: '',
            accompanying_person: '',
        }
        modal_add.value = true
        loadVmcSuggestions()
    }

    function loadVmcSuggestions() {
        if (personnelsListRaw.value.length === 0) {
            personnelService.indexAll()
                .then(res => {
                    personnelsListRaw.value = res.data?.data || res.data || []
                })
                .catch(err => console.error(err))
        }

        if (siteList.value.length === 0) {
            siteService.all()
                .then(res => {
                    const sites = res.data?.data || res.data || []
                    if (Array.isArray(sites) && sites.length > 0) {
                        siteList.value = sites.map((s: any) => s.name).filter(Boolean)
                    } else {
                        throw new Error('Fallback')
                    }
                })
                .catch(() => {
                    vmcService.getFilters()
                        .then(res => {
                            siteList.value = res.data?.site || []
                        })
                        .catch(err => console.error(err))
                })
        }
    }

    async function submitAddVmc() {
        if (!newVmcForm.value.type || !newVmcForm.value.site || !newVmcForm.value.date) return
        loading_add.value = true
        try {
            const rawInspector = (newVmcForm.value.inspector || '').trim()
            let assignedId: any = undefined
            let cleanInspector = rawInspector

            if (rawInspector) {
                const matched = personnelsListRaw.value.find(p => {
                    const full = `${p.first_name} ${p.last_name || ''}`.trim().toLowerCase()
                    const formatted = `${full} - ${[p.direction, p.fonction].filter(Boolean).join(' - ')}`.toLowerCase()
                    return rawInspector.toLowerCase() === formatted || rawInspector.toLowerCase() === full
                })

                if (matched) {
                    assignedId = matched.id
                    cleanInspector = `${matched.first_name} ${matched.last_name || ''}`.trim()
                } else if (rawInspector.includes(' - ')) {
                    cleanInspector = rawInspector.split(' - ')[0].trim()
                }
            }

            const payload: any = {
                ...newVmcForm.value,
                inspector: cleanInspector,
            }
            if (assignedId !== undefined) {
                payload.assigned_to = assignedId
            }

            await vmcService.store(payload)
            toast.success(locale.value === 'en' ? 'VMC created successfully!' : 'VMC créée avec succès !')
            modal_add.value = false
            fetchData()
        } catch (err: any) {
            const errorMsg = err.response?.data?.message || (locale.value === 'en' ? 'Failed to create VMC.' : 'Erreur lors de la création de la VMC.')
            toast.error(errorMsg)
        } finally {
            loading_add.value = false
        }
    }

    const filterableKeys: string[] = ['type', 'site', 'inspector']
    const columnLabels: Record<string, string> = {
        'type': 'Type',
        'site': 'Site',
        'inspector': 'Inspecteur'
    }
    const filters = ref<Record<string, string[]>>({
        'type': [],
        'site': [],
        'inspector': []
    })
    const columnOptions = ref<Record<string, string[]>>({
        'type': [],
        'site': [],
        'inspector': []
    })
    const searchQuery = ref<string>('')
    const loading = ref<boolean>(false)

    const right_sidebar = ref<{
        isOpen: boolean,
        selected_vmc?: VMCDataType
    }>({
        isOpen: false,
        selected_vmc: undefined
    })

    const data = ref<VMCDataType[]>([])
    const pagination = ref<{
        current_page: number,
        to: number,
        total: number
    }>({
        current_page: 1,
        to: 0,
        total: 0
    })

    const contextMenu = ref<{
        isOpen: boolean,
        contextMenu: contextMenuType,
        vmc?: VMCDataType
    }>({
        isOpen: false,
        contextMenu: {
            clientX: undefined,
            clientY: undefined
        },
        vmc: undefined
    })

    const dataRange = ref<{
        from: string,
        to: string
    }>({
        from: '',
        to: ''
    })

    const contextMenuActions: ComputedRef<ContextMenuActionType[]> = computed(() => {
        const vmc = contextMenu.value.vmc
        if (!vmc) return []

        const actions: ContextMenuActionType[] = [
            {
                label: 'Détails de la fiche',
                icon: Eye,
                onClick() {
                    goToDetails(vmc)
                    contextMenu.value.isOpen = false
                }
            },
            {
                label: 'Télécharger la fiche',
                icon: FileDown,
                onClick() {
                    downloadVmcPdf(vmc)
                    contextMenu.value.isOpen = false
                }
            }
        ]

        if (vmc.status === 'DRAFT') {
            actions.push({
                label: 'Démarrer la visite',
                icon: Play,
                variant: 'WARNING',
                onClick() {
                    changeStatus(vmc, 'IN_PROGRESS')
                    contextMenu.value.isOpen = false
                }
            })
            actions.push({
                label: 'Annuler',
                icon: Ban,
                variant: 'DANGER',
                onClick() {
                    changeStatus(vmc, 'CANCELLED')
                    contextMenu.value.isOpen = false
                }
            })
        } else if (vmc.status === 'IN_PROGRESS') {
            actions.push({
                label: 'Clôturer la visite',
                icon: CheckCircle2,
                onClick() {
                    changeStatus(vmc, 'COMPLETED')
                    contextMenu.value.isOpen = false
                }
            })
        }

        actions.push({
            label: 'Exporter CSV',
            icon: Download,
            onClick() {
                handleExport()
                contextMenu.value.isOpen = false
            }
        })

        return actions
    })

    const contextMenuBottomActions: ComputedRef<ContextMenuActionType[]> = computed(() => [
        {
            label: 'Supprimer',
            icon: Trash2,
            variant: 'DANGER',
            onClick() {
                const vmc = contextMenu.value.vmc
                if (!vmc) return
                if (confirm(`Êtes-vous sûr de vouloir supprimer la VMC #${vmc.id} (${vmc.title || vmc.type}) ?`)) {
                    vmcService.delete(vmc.id)
                        .then(() => {
                            if (right_sidebar.value.selected_vmc?.id === vmc.id) {
                                closePreview()
                            }
                            fetchData()
                            fetchFilters()
                        })
                        .catch(err => {
                            console.error(err)
                        })
                }
                contextMenu.value.isOpen = false
            }
        }
    ])

    /*
    |--------------------------------------------------------------------------
    | APERÇU
    |--------------------------------------------------------------------------
    */

    const selected = computed(() => right_sidebar.value.selected_vmc)

    const isSelected = (item: VMCDataType) =>
        right_sidebar.value.isOpen && selected.value?.id === item.id

    function goToDetails(item?: VMCDataType) {
        if (!item?.id) return
        router.push({
            name: 'VMC_DETAILS',
            params: { id: item.id }
        })
    }

    function downloadVmcPdf(item?: VMCDataType) {
        if (!item?.id) return
        router.push({
            name: 'VMC_DETAILS',
            params: { id: item.id },
            query: { print: 'true' }
        })
    }

    const selectedItems = computed(() => {
        return selected.value?.inspection?.items || []
    })

    function isItemYes(answer?: string): boolean {
        if (!answer) return false
        const a = answer.toUpperCase().trim()
        return a === 'OUI' || a === 'YES' || a === 'O'
    }

    function isItemNo(answer?: string): boolean {
        if (!answer) return false
        const a = answer.toUpperCase().trim()
        return a === 'NON' || a === 'NO' || a === 'N'
    }

    const selectedStats = computed(() => {
        const items = selectedItems.value
        const total = items.length
        const yes = items.filter((i: any) => isItemYes(i.answer)).length
        const no = items.filter((i: any) => isItemNo(i.answer)).length
        const na = total - yes - no
        const evaluated = yes + no
        const conformityRate = evaluated > 0 ? Math.round((yes / evaluated) * 100) : (total > 0 ? 100 : 0)

        return {
            total,
            yes,
            no,
            na,
            evaluated,
            conformityRate
        }
    })

    function openPreview(item: VMCDataType) {
        right_sidebar.value.selected_vmc = item
        right_sidebar.value.isOpen = true
    }

    function closePreview() {
        right_sidebar.value.isOpen = false
    }

    function openContextMenu(event: MouseEvent, item: VMCDataType) {
        contextMenu.value.contextMenu = event
        contextMenu.value.vmc = item
        contextMenu.value.isOpen = true
    }

    function formatDate(value?: string) {
        if (!value) return ''
        const date = new Date(value)
        if (Number.isNaN(date.getTime())) return value
        return new Intl.DateTimeFormat('fr-FR', { dateStyle: 'long' }).format(date)
    }

    const infoRows = computed(() => [
        { label: 'Date', value: formatDate(selected.value?.date), icon: CalendarDays },
        { label: 'Type', value: selected.value?.type, icon: ClipboardList },
        { label: 'Site', value: selected.value?.site, icon: MapPin },
        { label: 'Inspecteur', value: selected.value?.inspector, icon: UserCheck },
        { label: 'Personne accompagnante', value: selected.value?.accompanying_person, icon: Users },
    ])

    function describeUser(label: string, user?: UserDataType) {
        const first = user?.first_name?.trim() ?? ''
        const last = user?.last_name?.trim() ?? ''
        return {
            label,
            name: `${first} ${last}`.trim(),
            email: user?.email ?? '',
            initials: ((first[0] ?? '') + (last[0] ?? first[1] ?? '')).toUpperCase(),
        }
    }

    const people = computed(() => [
        describeUser('Assignée à', selected.value?.assigned_to),
        describeUser('Créée par', selected.value?.created_by),
    ])

    function changeStatus(item: VMCDataType, newStatus: string) {
        vmcService.updateStatus(item.id, newStatus)
            .then(res => {
                item.status = res.data.data.status
                if (right_sidebar.value.selected_vmc?.id === item.id) {
                    right_sidebar.value.selected_vmc.status = res.data.data.status
                }
                fetchData()
            })
            .catch(err => {
                console.error(err)
            })
    }

    function handleExport() {
        vmcService.export({
            type: filters.value.type,
            status: filters.value.status,
        }).then(res => {
            const blob = new Blob([res.data], { type: 'text/csv;charset=utf-8;' })
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', `export_vmc_${new Date().toISOString().slice(0, 10)}.csv`)
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
        }).catch(err => {
            console.error(err)
        })
    }

    function clearFilters() {
        filters.value.type = []
        filters.value.site = []
        filters.value.inspector = []
        dataRange.value.from = ''
        dataRange.value.to = ''
        searchQuery.value = ''
        pagination.value.current_page = 1
        fetchData()
    }

    function onPageChange(page: number) {
        pagination.value.current_page = page
        fetchData()
    }

    function onKeydown(event: KeyboardEvent) {
        if (event.key === 'Escape') closePreview()
    }

    /*
    |--------------------------------------------------------------------------
    | DONNÉES
    |--------------------------------------------------------------------------
    */

    function fetchData() {
        loading.value = true

        const params: VMCFilterType = {
            date: dataRange.value.from || dataRange.value.to ? dataRange.value : undefined,
            type: filters.value.type.length ? filters.value.type : undefined,
            site: filters.value.site.length ? filters.value.site : undefined,
            inspector: filters.value.inspector.length ? filters.value.inspector : undefined,
            search: searchQuery.value.trim() || undefined,
            page: pagination.value.current_page,
            per_page: 15,
        }

        vmcService.index(params)
            .then(res => {
                data.value = res.data.data
                pagination.value.to = res.data.meta.to ?? 0
                pagination.value.total = res.data.meta.total ?? 0
                if ((route.query.site || route.query.id) && !right_sidebar.value.selected_vmc && data.value.length > 0) {
                    openPreview(data.value[0])
                }
            })
            .catch(err => {
                console.error(err)
            })
            .finally(() => {
                loading.value = false
            })
    }

    function fetchFilters() {
        vmcService.getFilters()
            .then(res => {
                columnOptions.value.type = res.data.type || []
                columnOptions.value.site = res.data.site || []
                columnOptions.value.inspector = res.data.inspector || []
            })
            .catch(err => {
                console.error(err)
            })
    }

    onMounted(() => {
        if (route.query.site) {
            searchQuery.value = String(route.query.site)
        } else if (route.query.search) {
            searchQuery.value = String(route.query.search)
        }
        fetchData()
        fetchFilters()
        window.addEventListener('keydown', onKeydown)
    })

    watch(() => route.query, (newQ) => {
        if (newQ.site || newQ.search) {
            searchQuery.value = String(newQ.site || newQ.search)
        }
    })

    onUnmounted(() => {
        window.removeEventListener('keydown', onKeydown)
    })

    // Debounce search
    let searchTimeout: any = null
    watch(searchQuery, () => {
        clearTimeout(searchTimeout)
        searchTimeout = setTimeout(() => {
            pagination.value.current_page = 1
            fetchData()
        }, 300)
    })

    // Watch filters & date range
    watch([filters.value, dataRange.value], () => {
        pagination.value.current_page = 1
        fetchData()
    }, {
        deep: true,
        immediate: false
    })
</script>