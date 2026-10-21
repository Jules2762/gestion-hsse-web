<template>
    <div class="flex flex-row transition-all w-full ">
        <div class="w-full "
            :class="selectedFormation && data.length > 0 ? 'w-[calc(100%-400px)] min-w-[calc(100%-400px)] max-w-[calc(100%-400px)]' : 'w-full'">
            <Header title="formation.title" :thumbnails="[
                {
                    'label': 'thumbnails.home',
                    'name': 'DASHBOARD'
                }, {
                    'label': 'thumbnails.training',
                    'name': 'FORMATION'
                }
            ]" />

            <!-- ======================= RIBBON TOOLBAR ======================= -->
            <div class="bg-white border-b border-gray-200 sticky top-0">
                <div class="h-16 px-4 flex flex-row items-center justify-between">
                    <div class="flex flex-row items-center gap-1">
                        <ButtonFilter is-primary :text="t('formation.actions.add')" :icon="SquarePlusIcon" @click="openAddModal" />
                        <ButtonFilter :text="t('formation.actions.import')"
                            @click="router.push({ name: 'FORMATION_IMPORT' })" :icon="CloudDownloadIcon" />
                        <ButtonFilter :text="t('formation.actions.export')" @click="exportData()"
                            :loading="loading_export" :icon="DownloadIcon" :badge="pagination.total.toString()" />
                        <ButtonFilter :text="'Actualiser'" @click="fetchData()"
                            :loading="loading_data" :icon="RefreshCw" />
                        <!-- <div class="w-px h-8 bg-gray-300 mx-2" /> -->
                        <!-- <ButtonFilter text="Personnels" :icon="Users" :badge="'100'" @click="router.push({
                            name:'PERSONNEL'
                        })"/> -->
                    </div>
                    <div class="flex flex-row items-center gap-2">
                        <div class="relative">
                            <SearchIcon :size="15" class="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input v-model="searchQuery" type="text" :placeholder="t('formation.filters.input')"
                                class="h-9 w-64 rounded-lg border border-gray-300 bg-white pl-8 pr-3 text-sm text-gray-700 placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
                            <button v-if="searchQuery" @click="searchQuery = ''"
                                class="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                <XIcon :size="14" />
                            </button>
                        </div>
                    </div>
                </div>

                <!-- ======================= FILTER STRIP ======================= -->
                <ChipFilter :filterable-keys="filterableKeys" :column-labels="columnLabels" :filters="filters"
                    :column-options="columnOptions as Record<string, string[]>" :date-range="dateRange"
                    :results-count="pagination.to" :results-total="pagination.total" @clear-all="clearAllFilters" />
            </div>

            <div class="flex flex-row transition-all">
                <table class="w-full">
                    <thead>
                        <tr>
                            <th v-for="(item, index) in headers" :key="index">
                                <div class="flex items-center gap-1 select-none"
                                    :class="sortableKeys[index] ? 'cursor-pointer' : ''"
                                    @click="sortableKeys[index] && toggleSort(sortableKeys[index]!)">
                                    <span>{{ item }}</span>
                                    <!-- <component v-if="sortableKeys[index]" :is="sortIcon(sortableKeys[index])" :size="12"
                                        class="text-gray-400" /> -->
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <template v-if="loading_data == false && data.length > 0">
                            <tr v-for="(item, index) in data" :key="index" @click="selectedFormation = item"
                                @contextmenu.prevent="contextMenu.contextMenu = $event; contextMenu.isOpen = true; contextMenu.formation = item as FormationDataType"
                                :class="selectedFormation?.id == item.id ? 'bg-primary/10' : ''">
                                <td>{{ item.id }}</td>
                                <td class="text-nowrap">{{ getDate(item.date) }}</td>
                                <td class="truncate text-nowrap max-w-50">{{ item.title }}</td>
                                <td>{{ item.type }}</td>
                                <td>{{ item.volet }}</td>
                                <td>{{ item.trainer }}</td>
                                <td>{{ item.duration }}</td>
                                <td>{{ item.target }}</td>
                                <td>
                                    <div class="inline-flex
      items-center
      rounded-full
      border
      px-3
      py-1
      text-xs
      font-semibold" :class="getStyleStatus(item.status)">{{
        FormationStatusJsonData.find(i => i.value==item.status)?.label }}</div>
                                </td>

                            </tr>
                            <tr>
                                <td colspan="9" class="w-full">
                                    <div class="flex flex-row items-center text-sm justify-end ">
                                        <vue-awesome-paginate :hide-prev-next-when-ends="true"
                                            :total-items="pagination.total" :items-per-page="15" :max-pages-shown="4"
                                            v-model="pagination.current_page"
                                            @click="(page: number) => { pagination.current_page = page }" />
                                    </div>
                                </td>
                            </tr>
                        </template>
                        <tr v-else-if="loading_data == false && data.length > 0">
                            <td colspan="9" class="py-10 text-center text-gray-500">
                                <div class="flex flex-col items-center gap-2">
                                    <span>Aucun résultat pour ces filtres</span>
                                    <button class="text-xs font-medium text-primary hover:underline"
                                        @click="clearAllFilters">
                                        Réinitialiser les filtres
                                    </button>
                                </div>
                            </td>
                        </tr>
                        <tr v-else-if="data.length === 0 && loading_data == false">
                            <td colspan="9" class="py-10 text-center text-gray-500">
                                Aucune formation trouvée
                            </td>
                        </tr>
                        <tr v-else>
                            <td colspan="9" class="py-10">
                                <div class="flex flex-col items-center justify-center gap-3">
                                    <Loader :size="30" class="animate-spin text-primary" />

                                    <span class="text-sm text-gray-500">
                                        Chargement des formations...
                                    </span>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>


            </div>
        </div>
        <div :class="selectedFormation && data.length > 0 ? 'w-100 min-w-100' : 'w-0'"
            v-if="selectedFormation && data.length > 0" class="
            scrollbar-hide
            bg-white
            border-l
            border-gray-200
            self-start
            p-5
            h-fit
            sticky top-0 bottom-0
            
            overflow-y-auto
        ">
            <template v-if="selectedFormation || data.length > 0">

                <!-- HEADER -->

                <div class="
                    pb-5
                    border-b
                    border-gray-200
                ">
                    <div class="
                        flex
                        items-start
                        justify-between
                    ">
                        <div>
                            <p class="
                                text-xs
                                uppercase
                                tracking-widest
                                text-gray-500
                            ">
                                Formation
                            </p>

                            <h4 class="mt-1">
                                {{
                                    selectedFormation.title
                                }}
                            </h4>
                        </div>

                        <button class="
                            rounded-lg
                            p-2
                            hover:bg-slate-100
                        " @click="
                            selectedFormation = null
                            ">
                            <XIcon :size="18" />
                        </button>
                    </div>

                    <!-- BADGES -->

                    <div class="
                        mt-4
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
                            font-medium
                            text-primary
                        ">
                            {{
                                selectedFormation.type
                            }}
                        </span>

                        <span class="
                            rounded-full
                            bg-blue-100
                            px-3
                            py-1
                            text-xs
                            font-medium
                            text-blue-700
                        ">
                            {{
                                selectedFormation.volet
                            }}
                        </span>
                    </div>
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
                            Taux de participation
                        </p>

                        <h5>
                            {{
                                selectedFormation.participant
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
                            Durée
                        </p>

                        <h5>
                            {{
                                selectedFormation.duration
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
                            Public
                        </p>

                        <h5 class="
                            text-sm
                        ">
                            {{
                                selectedFormation.target_type
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
                        Informations générales
                    </h6>

                    <div class="
                        grid
                        grid-cols-2
                        gap-4
                    ">
                        <div>
                            <p class="
                                text-xs
                                text-gray-500 text-nowrap
                            ">
                                Date
                            </p>

                            <p>
                                {{
                                    selectedFormation.date
                                }}
                            </p>
                        </div>

                        <div>
                            <p class="
                                text-xs
                                text-gray-500
                            ">
                                Formateur
                            </p>

                            <p>
                                {{
                                    selectedFormation.trainer
                                }}
                            </p>
                        </div>

                        <div>
                            <p class="
                                text-xs
                                text-gray-500
                            ">
                                Type
                            </p>

                            <p>
                                {{
                                    selectedFormation.type
                                }}
                            </p>
                        </div>

                        <div>
                            <p class="
                                text-xs
                                text-gray-500
                            ">
                                Volet
                            </p>

                            <p>
                                {{
                                    selectedFormation.volet
                                }}
                            </p>
                        </div>
                    </div>
                </div>

                <!-- PUBLIC CIBLE -->

                <div class="
                    mt-6
                    border-t
                    border-gray-200
                    pt-5
                ">
                    <h6 class="mb-3">
                        Public concerné
                    </h6>

                    <p>
                        {{
                            selectedFormation.target
                        }}
                    </p>

                    <p class="
                        mt-2
                        text-sm
                        text-gray-500
                    ">
                        {{
                            selectedFormation.target_type
                        }}
                    </p>
                </div>

                <!-- PARTICIPATION -->

                <div class="
                    mt-6
                    border-t
                    border-gray-200
                    pt-5
                ">
                    <h6 class="mb-3">
                        Participation
                    </h6>

                    <div class="grid grid-cols-2 gap-2">
                        <div class="
                        rounded-xl
                        bg-green-50
                        border
                        border-green-200
                        p-4
                    ">
                            <div class="
                            flex
                            items-center
                            justify-between
                        ">
                                <span>
                                    Prévus
                                </span>

                                <span class="
                                text-lg
                                font-semibold
                                text-green-700
                            ">
                                    {{
                                        selectedFormation.participant
                                    }}
                                </span>
                            </div>
                        </div>
                        <div class="
                        rounded-xl
                        bg-green-50
                        border
                        border-green-200
                        p-4
                    ">
                            <div class="
                            flex
                            items-center
                            justify-between
                        ">
                                <span>
                                    Présents
                                </span>

                                <span class="
                                text-lg
                                font-semibold
                                text-green-700
                            ">
                                    {{
                                        selectedFormation.participant
                                    }}
                                </span>
                            </div>
                        </div>
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
                        <Button class="w-full" variant="danger"
                            @click="contextMenu.formation = selectedFormation; modal_delete = true">
                            Supprimer
                        </Button>
                        <Button class="w-full" variant="outline">
                            Modifier
                        </Button>


                    </div>
                </div>

            </template>
        </div>
        <ContextMenuUI v-model="contextMenu.isOpen" :context-menu="contextMenu.contextMenu" :actions="context_actions"
            :bottom_actions="context_bottom_actions" />
    </div>
    <CenterModal :confirm-loading="loading_delete" title-variant="danger" :is-open="modal_delete"
        @close="modal_delete = false" @confirm="deleteFormation(contextMenu?.formation?.id as string | number)"
        :title="t('formation.notification.delete.confirmation.title')" confirm-variant="danger">
        <p>{{ t('formation.notification.delete.confirmation.message') }}</p>
    </CenterModal>
    <CenterModal title="Reporter la formation" :is-open="modal.reporting_date"
        @close="modal.reporting_date = false; reporting_date = ''" @confirm="onResceduleDate()"
        :confirm-loading="loading_reschedule_date">
        <div class="flex flex-col gap-2">
            <label for="reporting_date" class="text-sm font-medium text-gray-700">
                Nouvelle date de la formation
            </label>

            <p class="text-xs text-gray-500">
                Sélectionnez la nouvelle date à laquelle la formation sera organisée.
            </p>

            <VueDatePicker id="reporting_date" v-model="reporting_date" :min-date="new Date()"
                :time-config="{ enableTimePicker: false }" />
        </div>
    </CenterModal>
    <LoadingUI v-if="loading_fetch" />

    <!-- ========================================================= -->
    <!-- MODAL NOUVELLE FORMATION (IN-PAGE MODAL)                  -->
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
                                <SquarePlusIcon :size="18" />
                            </div>
                            <div>
                                <h4 class="text-sm font-bold text-gray-900">
                                    {{ locale === 'en' ? 'New Training Session' : 'Planifier une nouvelle formation' }}
                                </h4>
                                <p class="text-[11px] text-gray-500">
                                    {{ locale === 'en' ? 'Create a training session and define details for tracking.' : 'Créez une session de formation et définissez les paramètres de suivi.' }}
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
                    <form @submit.prevent="submitAddFormation" class="flex flex-col flex-1 overflow-y-auto">
                        <div class="p-5 space-y-4">
                            <!-- Titre -->
                            <div>
                                <label class="block text-xs font-semibold text-gray-700 mb-1">
                                    {{ locale === 'en' ? 'Training Title' : 'Titre de la formation' }} <span class="text-red-500">*</span>
                                </label>
                                <input
                                    v-model="newFormationForm.title"
                                    type="text"
                                    required
                                    :placeholder="locale === 'en' ? 'Ex: Fire safety training, First aid...' : 'Ex: Formation sécurité incendie, SST, Risques chimiques...'"
                                    class="w-full h-9 px-3 rounded-lg border border-gray-300 text-xs focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition"
                                />
                            </div>

                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                <!-- Type -->
                                <div>
                                    <label class="block text-xs font-semibold text-gray-700 mb-1">
                                        {{ locale === 'en' ? 'Training Type' : 'Type de formation' }} <span class="text-red-500">*</span>
                                    </label>
                                    <select
                                        v-model="newFormationForm.type"
                                        required
                                        class="w-full h-9 px-3 rounded-lg border border-gray-300 text-xs focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none bg-white transition cursor-pointer"
                                    >
                                        <option v-for="t in FormationTypeJsonData" :key="t.value" :value="t.value">{{ t.label }}</option>
                                    </select>
                                </div>

                                <!-- Volet -->
                                <div>
                                    <label class="block text-xs font-semibold text-gray-700 mb-1">
                                        {{ locale === 'en' ? 'Pillar' : 'Volet HSSE' }} <span class="text-red-500">*</span>
                                    </label>
                                    <select
                                        v-model="newFormationForm.volet"
                                        required
                                        class="w-full h-9 px-3 rounded-lg border border-gray-300 text-xs focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none bg-white transition cursor-pointer"
                                    >
                                        <option v-for="v in VoletJsonData" :key="v.value" :value="v.value">{{ v.label }}</option>
                                    </select>
                                </div>
                            </div>

                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                <!-- Formateur -->
                                <div>
                                    <label class="block text-xs font-semibold text-gray-700 mb-1">
                                        {{ locale === 'en' ? 'Trainer' : 'Formateur' }} <span class="text-red-500">*</span>
                                    </label>
                                    <input
                                        v-model="newFormationForm.trainer"
                                        required
                                        list="formation_modal_trainers_datalist"
                                        type="text"
                                        :placeholder="locale === 'en' ? 'Enter trainer name...' : 'Entrez le nom du formateur...'"
                                        class="w-full h-9 px-3 rounded-lg border border-gray-300 text-xs focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition"
                                    />
                                    <datalist id="formation_modal_trainers_datalist">
                                        <option v-for="tr in trainerList" :key="tr" :value="tr">{{ tr }}</option>
                                    </datalist>
                                </div>

                                <!-- Nombre de participants -->
                                <div>
                                    <label class="block text-xs font-semibold text-gray-700 mb-1">
                                        {{ locale === 'en' ? 'Number of participants' : 'Nombre de participants' }} <span class="text-red-500">*</span>
                                    </label>
                                    <input
                                        v-model.number="newFormationForm.participant"
                                        type="number"
                                        min="1"
                                        required
                                        class="w-full h-9 px-3 rounded-lg border border-gray-300 text-xs focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition"
                                    />
                                </div>
                            </div>

                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                <!-- Cible -->
                                <div>
                                    <label class="block text-xs font-semibold text-gray-700 mb-1">
                                        {{ locale === 'en' ? 'Target' : 'Cible' }} <span class="text-red-500">*</span>
                                    </label>
                                    <input
                                        v-model="newFormationForm.target"
                                        type="text"
                                        required
                                        :placeholder="locale === 'en' ? 'Ex: Pompistes, Chefs de station, Tous...' : 'Ex: Pompistes, Chefs de station, Tous...'"
                                        class="w-full h-9 px-3 rounded-lg border border-gray-300 text-xs focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition"
                                    />
                                </div>

                                <!-- Type de cible -->
                                <div>
                                    <label class="block text-xs font-semibold text-gray-700 mb-1">
                                        {{ locale === 'en' ? 'Target Type' : 'Type de cible' }} <span class="text-red-500">*</span>
                                    </label>
                                    <input
                                        v-model="newFormationForm.target_type"
                                        type="text"
                                        required
                                        :placeholder="locale === 'en' ? 'Ex: Opérationnel, Administratif...' : 'Ex: Opérationnel, Administratif...'"
                                        class="w-full h-9 px-3 rounded-lg border border-gray-300 text-xs focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition"
                                    />
                                </div>
                            </div>

                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                <!-- Date -->
                                <div>
                                    <label class="block text-xs font-semibold text-gray-700 mb-1">
                                        {{ locale === 'en' ? 'Date' : 'Date de la formation' }} <span class="text-red-500">*</span>
                                    </label>
                                    <input
                                        v-model="newFormationForm.date"
                                        type="date"
                                        required
                                        class="w-full h-9 px-3 rounded-lg border border-gray-300 text-xs focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition"
                                    />
                                </div>

                                <!-- Durée -->
                                <div>
                                    <label class="block text-xs font-semibold text-gray-700 mb-1">
                                        {{ locale === 'en' ? 'Duration (hours)' : 'Durée (heures)' }} <span class="text-red-500">*</span>
                                    </label>
                                    <input
                                        v-model="newFormationForm.duration"
                                        type="text"
                                        placeholder="02:00 ou 2"
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
                                :disabled="loading_add || !newFormationForm.title || !newFormationForm.trainer || !newFormationForm.date"
                                class="px-5 py-2 text-xs font-semibold text-white bg-primary hover:bg-primary/90 rounded-lg shadow-xs transition flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                            >
                                <Loader v-if="loading_add" :size="13" class="animate-spin" />
                                <span>{{ locale === 'en' ? 'Create Session' : 'Créer la formation' }}</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </transition>
    </Teleport>
</template>

<script setup lang="ts">
    import { computed, onMounted, reactive, ref, watch, type ComputedRef } from 'vue';
    import Header from '../../../components/shared/Header.vue';
    import {
        ArrowDownIcon,
        ArrowUpDownIcon,
        ArrowUpIcon,
        CalendarClock,
        CircleSlash,
        CloudDownloadIcon,

        DownloadIcon,
        Edit,
        Eye,
        Loader,
        RefreshCw,
        SearchIcon,
        SquarePlusIcon,
        Trash2,
        Users,
        XIcon,
    } from '@lucide/vue';

    import ChipFilter from '../../../components/ui/ChipFilter.vue';
    import { router } from '../../../router/index.ts';
    import type { ContextMenuActionType, contextMenuType } from '../../../@types/ContextMenu.type.ts';
    import type { FormationDataType, FormationFilterType, FormationStatusType, FormationType, VoletType } from '../../../@types/Formation.type.ts';
    import ContextMenuUI from '../../../components/ui/ContextMenuUI.vue';
    import { useFormationService } from '../../../core/services/formation.service.ts';
    import { useI18n } from 'vue-i18n';
    import { toast } from 'vue3-toastify';
    import CenterModal from '../../../components/ui/centerModal.vue';
    import Button from '../../../components/ui/Button.vue';
    import { exportUtils } from '../../../core/utils/export.utils.ts';
    import ButtonFilter from '../../../components/ui/ButtonFilter.vue';
    import LoadingUI from '../../../components/ui/LoadingUI.vue';
    import { FormationStatusJsonData, FormationTypeJsonData, VoletJsonData } from '../../../@data/Formation.data.ts';
    import personnelService from '../../../core/services/personnel.service.ts';
    import type { FormationFormType } from '../../../@types/Formation.type.ts';
    import { VueDatePicker } from '@vuepic/vue-datepicker';

    const { t, locale } = useI18n()

    const modal_add = ref(false)
    const loading_add = ref(false)
    const trainerList = ref<string[]>([])

    const newFormationForm = ref<FormationFormType>({
        title: '',
        type: 'Formation',
        volet: 'Sécurité',
        trainer: '',
        target: '',
        target_type: '',
        participant: 1,
        date: new Date().toISOString().split('T')[0],
        duration: '02:00'
    })

    function openAddModal() {
        newFormationForm.value = {
            title: '',
            type: 'Formation',
            volet: 'Sécurité',
            trainer: '',
            target: '',
            target_type: '',
            participant: 1,
            date: new Date().toISOString().split('T')[0],
            duration: '02:00'
        }
        modal_add.value = true
        loadTrainerSuggestions()
    }

    function loadTrainerSuggestions() {
        if (trainerList.value.length === 0) {
            personnelService.indexAll()
                .then(res => {
                    const raw = res.data?.data || res.data || []
                    trainerList.value = raw.map((p: any) => {
                        const name = `${p.first_name || ''} ${p.last_name || ''}`.trim()
                        return name || p.email
                    }).filter(Boolean)
                })
                .catch(err => console.error(err))
        }
    }

    async function submitAddFormation() {
        if (!newFormationForm.value.title || !newFormationForm.value.trainer || !newFormationForm.value.date) return
        loading_add.value = true
        try {
            await formation.store(newFormationForm.value)
            toast.success(locale.value === 'en' ? 'Training session created successfully!' : 'Session de formation créée avec succès !')
            modal_add.value = false
            fetchData()
        } catch (err: any) {
            const errorMsg = err.response?.data?.message || (locale.value === 'en' ? 'Failed to create training session.' : 'Erreur lors de la création de la formation.')
            toast.error(errorMsg)
        } finally {
            loading_add.value = false
        }
    }


    const headers = computed(() => [
        t('table.ref'),
        t('table.date'),
        t('table.title'),
        t('table.type'),
        t('table.section'),
        t('table.trainer'),
        locale.value === 'en' ? 'Duration (h)' : 'Durée (h)',
        t('table.target'),
        t('table.status'),
    ])
    const data = ref<FormationDataType[]>([])


    const selectedFormation = ref<FormationDataType | null>()
    const modal_delete = ref(false)
    type ContextMenuState = {
        isOpen: boolean
        contextMenu?: contextMenuType
        formation?: FormationDataType

    }
    const loading_fetch = ref<boolean>(false)
    const loading_cancel = ref<boolean>(false)
    const contextMenu = ref<ContextMenuState>(
        {
            isOpen: false,
            formation: undefined
        }
    )
    const reporting_date=ref<string>('')
        const modal=ref<{
            reporting_date:boolean
        }>({
            reporting_date:false
        })
    const context_actions: ComputedRef<ContextMenuActionType[]> = computed(() => [
        {
            label: "Détails",
            icon: Eye,
            onClick: () => {
                selectedFormation.value = contextMenu.value.formation
            }
        },

        ...(contextMenu.value.formation?.status==="SCHEDULED"|| contextMenu.value.formation?.status === "POSTPONED"|| contextMenu.value.formation?.status === "COMPLETED" ? [
            {
                label: "Participants",
                icon: Users,
                badge: contextMenu.value.formation?.participant_count?.toString(),
                onClick: () => {
                    router.push({
                        name: 'FORMATION_PARTICIPANT',
                        params: {
                            id: contextMenu.value.formation?.id
                        }
                    })
                }
            }
        ] : []),

        ...(contextMenu.value.formation?.status != 'COMPLETED' ? [
            {
                label: 'Reporter',
                icon: CalendarClock,
                onClick: () => { modal.value.reporting_date=true;contextMenu.value.isOpen=false }
            }
        ] as ContextMenuActionType[] : []),

        {
            label: "Modifier",
            icon: Edit,
            variant: 'WARNING',
            onClick() {
                router.push({
                    name: 'FORMATION_UPDATE',
                    params: {
                        id: contextMenu.value.formation?.id
                    }
                })
            },
        },

        ...(contextMenu.value.formation?.status === 'SCHEDULED' ||
            contextMenu.value.formation?.status === 'POSTPONED'
            ? [
                {
                    label: "Annuler",
                    variant: "DANGER",
                    icon: CircleSlash,
                    onClick: () => cancelFormation(),
                    loading: loading_cancel.value
                }
            ] as ContextMenuActionType[]
            : []
        ),
    ])
    const context_bottom_actions: ContextMenuActionType[] = [
        {
            label: "Suprimer",
            icon: Trash2,
            variant: "DANGER",
            onClick: () => modal_delete.value = true
        },
    ]

    const formation = useFormationService()

    type FilterKey = 'type' | 'volet' | 'trainer' | 'target'
    const filterableKeys: FilterKey[] = ['type', 'volet', 'trainer', 'target']
    const columnLabels: Record<FilterKey, string> = {
        type: 'Type',
        volet: 'Volet',
        trainer: 'Formateur',
        target: 'Cible',
    }

    // index-aligned with `headers`, null = not filterable/sortable
    const sortableKeys: (string | null)[] = [null, 'date', 'type', 'volet', 'trainer', 'duration', 'target']

    const filters = reactive<Record<FilterKey, string[]>>({
        type: [],
        volet: [],
        trainer: [],
        target: [],
    })

    const dateRange = reactive({ from: '', to: '' })
    const searchQuery = ref('')

    // Unique available values per filterable column, computed from the raw dataset.
    // Passed to ChipFilter so it stays decoupled from where the data comes from.
    const columnOptions = ref<Record<string, string[]>>()
    const loading_data = ref<boolean>(false)
    const loading_export = ref<boolean>(false)
    const loading_delete = ref<boolean>(false)
    function clearAllFilters() {
        for (const key of filterableKeys) filters[key] = []
        dateRange.from = ''
        dateRange.to = ''
        searchQuery.value = ''
    }
    const sortKey = ref<string | null>(null)
    const sortDir = ref<'asc' | 'desc'>('asc')
    const pagination = ref({
        current_page: 1,
        to: 0,
        total: 0,
    })

    const exportFields: { key: string; excelName: string }[] = [
        { key: 'title', excelName: 'Titre' },
        { key: 'date', excelName: 'Date' },
        { key: 'type', excelName: 'Type de formation' },
        { key: 'volet', excelName: 'Volet' },
        { key: 'trainer', excelName: 'Formateur' },
        { key: 'duration', excelName: 'Durée' },
        { key: 'target', excelName: 'Cible' },
        { key: 'participant', excelName: 'Participants' },
        { key: 'target_type', excelName: 'Type cibles' },
    ]
    const loading_reschedule_date=ref<boolean>(false)
    function toggleSort(key: string) {
        if (sortKey.value === key) {
            sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc'
        } else {
            sortKey.value = key
            sortDir.value = 'asc'
        }
    }
    function getDate(dateString: string): string {
        const date = new Date(dateString)
        return date.toLocaleDateString()
    }



    function fetchData(params?: FormationFilterType) {
        loading_data.value = true
        formation.fetchData(params).then((res) => {
            console.log(res.data.data)
            const meta = res.data.meta
            data.value = res.data.data
            pagination.value.to = meta.to
            pagination.value.total = meta.total

        }).catch((err) => {

            if (err?.response.status == "422") {
                console.error(err?.response.data.errors, err.status)
                Object.keys(err?.response.data.errors).forEach((key) => {
                    console.log(key)

                })
                toast.error(t("formation.notification.list.date.to.after_or_equal"))
            }
        })
            .finally(() => {
                loading_data.value = false
            })
    }
    function fetchDataFilters() {
        formation.getFilters()
            .then((res) => {
                columnOptions.value = res.data
            })
    }
    function onSuccessExported() {
        toast.success(t('formation.notification.export.success'))
    }
    function onErrorExported() {
        toast.error(t('formation.notification.export.error'))
    }
    function exportData() {
        loading_export.value = true
        formation.getAllData({
            type: filters.type as FormationType[],
            section: filters.volet as VoletType[],
            date: dateRange,
            trainer: filters.trainer,
            target: filters.target,
            search: searchQuery.value
        })
            .then(res => {
                exportUtils(res.data.data as FormationDataType[], exportFields, onSuccessExported, onErrorExported, 'export_training')
            })
            .catch(err => {
                console.error(err)
                toast.error(t("formation.notification.export.error"))
                if (err?.response.status == "422") {

                    Object.keys(err?.response.data.errors).forEach((key) => {
                        toast.error(t('formation.notification.list.' + err?.response.data.errors[key][0]))

                    })
                }
            })
            .finally(() => {
                loading_export.value = false
            })
    }
    function cancelFormation() {
        loading_cancel.value = true
        formation.cancel(contextMenu.value.formation?.id as string)
            .then(res => {
                data.value = data.value.map(item =>
                    item.id === contextMenu.value.formation?.id
                        ? { ...item, status: "CANCELLED" }
                        : item
                )
            })
            .catch(err => {
                console.error(err)
            })
            .finally(() => {
                loading_cancel.value = false
            })
    }
    function deleteFormation(id: string | number) {
        loading_delete.value = true
        formation.delete(id)
            .then(res => {

                toast.success(
                    t("formation.notification.delete.success")
                )

                fetchData({
                    page: pagination.value.current_page,
                    type: filters.type as FormationType[],
                    section: filters.volet as VoletType[],
                    date: dateRange,
                    trainer: filters.trainer,
                    target: filters.target,
                    search: searchQuery.value
                })
                modal_delete.value = false
                selectedFormation.value = null
            })
            .catch(
                err => {
                    console.error(err)
                    if (err?.response?.status === 404) {
                        toast.error(t("formation.notification.delete.not_found"))
                    } else {
                        toast.error(t("formation.notification.delete.error"))
                    }
                }
            )
            .finally(() => {
                loading_delete.value = false
            })
    }
    function getStyleStatus(value: FormationStatusType) {
        switch (value) {
            case "POSTPONED":
                return `
        bg-amber-100
        text-amber-700
        border-amber-200
      `

            case 'COMPLETED':
                return `
        bg-green-100
        text-green-700
        border-green-200
      `

            case 'CANCELLED':
                return `
        bg-red-100
        text-red-700
        border-red-200
      `

            default:
                return `
        bg-slate-100
        text-slate-700
        border-slate-200
      `
        }
    }
function onResceduleDate(){
    loading_reschedule_date.value=true
    formation.reschedule(contextMenu.value.formation?.id as string,reporting_date.value)
    .then(res=>{
        console.log(res.data)
        data.value = data.value.map(item =>
            item.id === contextMenu.value.formation?.id
                ? { ...item, date: reporting_date.value,status:"POSTPONED" }
                : item
        )
    })
    .catch(err=>{
        console.error(err)
    })
    .finally(()=>{
        loading_reschedule_date.value = false
    })
}


    watch([filters, dateRange, searchQuery], () => {
        pagination.value.current_page = 1
        console.log(filters, dateRange, searchQuery.value)
        fetchData({
            page: 1,
            type: filters.type as FormationType[],
            section: filters.volet as VoletType[],
            date: dateRange,
            trainer: filters.trainer,
            target: filters.target,
            search: searchQuery.value
        })
    }, {
        immediate: false
    })
    watch(() => pagination.value.current_page, () => {

        fetchData({
            page: pagination.value.current_page,
            type: filters.type as FormationType[],
            section: filters.volet as VoletType[],
            date: dateRange,
            trainer: filters.trainer,
            target: filters.target,
            search: searchQuery.value
        })
    }, {
        immediate: false
    })

    watch(() => modal_delete.value, () => {
        if (modal_delete.value == true) {

            selectedFormation.value = contextMenu.value.formation

            contextMenu.value.isOpen = false
        }
    })
    onMounted(() => {


        fetchDataFilters()
        fetchData()

    })

</script>


<style scoped>
.preview-enter-from,
.preview-leave-to {
    transform: translateX(200px);
    opacity: 0;
}

.preview-enter-active,
.preview-leave-active {
    transition:
        all 0.25s ease-in-out;
}
</style>