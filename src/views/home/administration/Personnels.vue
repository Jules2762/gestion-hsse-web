<template>
    <div class="flex flex-row w-full">
        <div class="flex flex-col w-full transition-all" :class="selected_personnel ? 'w-[calc(100%-400px)]' : 'w-full'">
            <Header title="administration.personnels.title" :thumbnails="[
                { label: 'thumbnails.home', name: 'DASHBOARD' },
                { label: 'thumbnails.administration', name: 'ADMINISTRATION' },
                { label: 'thumbnails.personnels', name: 'PERSONNEL' },
            ]" />

            <!-- FILTER SECTION -->
            <div class="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div class="h-16 px-6 flex flex-row items-center justify-between gap-4">
                    <div class="flex flex-row items-center gap-1.5">
                        <ButtonFilter
                            is-primary
                            :text="t('formation.actions.add')"
                            :icon="SquarePlusIcon"
                            @click="router.push({ name: 'PERSONNEL_ADD' })"
                        />
                        <ButtonFilter
                            text="Exporter"
                            :icon="DownloadIcon"
                            :badge="String(pagination.total)"
                            :loading="loading_export"
                            @click="handleExport"
                        />
                    </div>
                    <div class="flex flex-row items-center gap-2">
                        <InputFilter :icon="Search" placeholder="Rechercher un membre du personnel..." v-model="searchQuery" />
                    </div>
                </div>
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

            <!-- TABLE DES PERSONNELS -->
            <div v-if="loading" class="p-16 flex flex-col items-center justify-center gap-3 text-gray-500">
                <Loader2 :size="32" class="animate-spin text-primary" />
                <span class="text-sm">Chargement du personnel...</span>
            </div>

            <div v-else-if="!data || data.length === 0" class="p-16 flex flex-col items-center justify-center text-center">
                <div class="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mb-4">
                    <Users :size="28" />
                </div>
                <h5 class="text-gray-700 font-semibold mb-1">Aucun personnel trouvé</h5>
                <p class="text-sm text-gray-500 max-w-sm">
                    Aucun enregistrement ne correspond aux critères de filtre sélectionnés.
                </p>
                <button
                    v-if="searchQuery || filters.direction.length || filters.fonction.length || filters.entity.length"
                    @click="clearFilters"
                    class="mt-4 px-4 py-2 text-xs font-medium text-primary bg-primary/10 rounded-lg hover:bg-primary/20 transition"
                >
                    Réinitialiser les filtres
                </button>
            </div>

            <table v-else>
                <thead>
                    <tr>
                        <th class="w-16">REF</th>
                        <th>NOM ET PRÉNOM</th>
                        <th>E-MAIL</th>
                        <th>FONCTION</th>
                        <th>DIRECTION</th>
                        <th>ENTITÉ</th>
                    </tr>
                </thead>
                <tbody>
                    <tr
                        v-for="item in data"
                        :key="item.id"
                        class="cursor-pointer transition-colors"
                        :class="selected_personnel?.id === item.id ? 'bg-primary/10' : 'hover:bg-slate-50'"
                        @click="selected_personnel = item"
                        @contextmenu.prevent="openContextMenu($event, item)"
                    >
                        <td class="font-mono text-xs text-gray-400">#{{ item.id }}</td>
                        <td class="font-medium text-gray-900">
                            <div class="flex items-center gap-2">
                                <div class="w-7 h-7 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-xs shrink-0">
                                    {{ (item.first_name?.[0] || '') + (item.last_name?.[0] || '') }}
                                </div>
                                <span>{{ item.first_name }} {{ item.last_name }}</span>
                            </div>
                        </td>
                        <td class="text-gray-600 font-mono text-xs">{{ item.email }}</td>
                        <td class="text-gray-700">{{ item.fonction }}</td>
                        <td class="text-gray-700">{{ item.direction }}</td>
                        <td class="text-gray-500">{{ item.entity || '-' }}</td>
                    </tr>
                </tbody>
                <tfoot>
                    <tr>
                        <td colspan="6" class="w-full p-4 border-t border-gray-200">
                            <div class="flex flex-row items-center justify-between text-sm">
                                <span class="text-xs text-gray-500">
                                    Affichage de {{ pagination.to }} sur {{ pagination.total }} membres du personnel
                                </span>
                                <vue-awesome-paginate
                                    :hide-prev-next-when-ends="true"
                                    :total-items="pagination.total"
                                    :items-per-page="15"
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

        <!-- VOLET LATÉRAL DE DÉTAIL DU PERSONNEL -->
        <aside
            v-if="selected_personnel"
            aria-label="Fiche du personnel"
            class="w-[400px] min-w-[400px] max-w-[400px] bg-white border-l border-gray-200 p-5 sticky top-0 h-screen overflow-y-auto flex flex-col justify-between shadow-xl z-20 scrollbar-hide"
        >
            <div>
                <!-- EN-TÊTE DU VOLET -->
                <div class="flex items-start justify-between pb-4 border-b border-gray-200 mb-5">
                    <div class="min-w-0 flex-1">
                        <p class="text-[11px] font-bold uppercase tracking-wider text-gray-400">Personnel n° {{ selected_personnel.id }}</p>
                        <h4 class="mt-1 font-bold text-gray-900 truncate">{{ selected_personnel.first_name }} {{ selected_personnel.last_name }}</h4>
                    </div>
                    <button
                        @click="selected_personnel = undefined"
                        type="button"
                        aria-label="Fermer l'aperçu"
                        class="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                        <X :size="18" />
                    </button>
                </div>

                <!-- CARTE PROFIL -->
                <div class="flex flex-col items-center text-center p-5 rounded-2xl bg-slate-50 border border-gray-200 mb-5">
                    <div class="w-20 h-20 rounded-full bg-primary/10 text-primary font-black text-2xl flex items-center justify-center mb-3 ring-4 ring-primary/5">
                        {{ (selected_personnel.first_name?.[0] || '') + (selected_personnel.last_name?.[0] || '') }}
                    </div>
                    <h3 class="font-bold text-gray-900 text-base">
                        {{ selected_personnel.first_name }} {{ selected_personnel.last_name }}
                    </h3>
                    <p class="text-xs font-medium text-primary mt-0.5">{{ selected_personnel.fonction }}</p>
                    <p class="text-xs text-gray-500 mt-1 font-mono">{{ selected_personnel.email }}</p>
                </div>

                <!-- DÉTAILS D'AFFECTATION -->
                <div class="space-y-3">
                    <h5 class="text-xs font-bold text-gray-400 uppercase tracking-wider">Affectation & Organisation</h5>

                    <div class="p-3.5 rounded-xl border border-gray-200 bg-white space-y-2.5 text-xs">
                        <div class="flex items-center justify-between">
                            <span class="text-gray-500">Direction :</span>
                            <span class="font-semibold text-gray-800">{{ selected_personnel.direction }}</span>
                        </div>
                        <div class="flex items-center justify-between">
                            <span class="text-gray-500">Entité d'exploitation :</span>
                            <span class="font-semibold text-gray-800">{{ selected_personnel.entity || 'Non spécifiée' }}</span>
                        </div>
                        <div class="flex items-center justify-between">
                            <span class="text-gray-500">Référence système :</span>
                            <span class="font-mono text-gray-500">#{{ selected_personnel.id }}</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- BOUTONS D'ACTION DU VOLET -->
            <div class="pt-5 border-t border-gray-200 mt-6 flex flex-col gap-2">
                <Button
                    class="w-full"
                    :left-icon="Edit"
                    @click="router.push({ name: 'PERSONNEL_UPDATE', params: { id: selected_personnel.id } })"
                >
                    Modifier la fiche
                </Button>
                <Button
                    class="w-full"
                    variant="danger"
                    :left-icon="Trash2"
                    @click="promptDelete(selected_personnel)"
                >
                    Supprimer ce membre
                </Button>
            </div>
        </aside>

        <!-- MENU CONTEXTUEL -->
        <ContextMenuUI
            v-model="contextMenu.isOpen"
            :context-menu="contextMenu.contextMenu"
            :actions="context_menu_actions"
        />

        <!-- MODALE DE SUPPRESSION -->
        <CenterModal
            :is-open="modal_delete"
            title="Supprimer ce membre du personnel ?"
            confirm-variant="danger"
            :confirm-loading="loading_delete"
            @close="modal_delete = false"
            @confirm="confirmDelete"
        >
            <p class="text-sm text-gray-600">
                Êtes-vous sûr de vouloir retirer
                <strong>{{ item_to_delete?.first_name }} {{ item_to_delete?.last_name }}</strong>
                de la base du personnel ?
            </p>
        </CenterModal>
    </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import ButtonFilter from '../../../components/ui/ButtonFilter.vue';
import { DownloadIcon, Search, SquarePlusIcon, Users, Loader2, X, Edit, Trash2 } from '@lucide/vue';
import { router } from '../../../router/index.ts';
import Header from '../../../components/shared/Header.vue';
import { computed, onMounted, ref, watch, type ComputedRef } from 'vue';
import InputFilter from '../../../components/ui/InputFilter.vue';
import type { PersonnelDataType } from '../../../@types/Personnel.type.ts';
import personnelService from '../../../core/services/personnel.service.ts';
import ChipFilter from '../../../components/ui/ChipFilter.vue';
import ContextMenuUI from '../../../components/ui/ContextMenuUI.vue';
import CenterModal from '../../../components/ui/centerModal.vue';
import Button from '../../../components/ui/Button.vue';
import { exportUtils } from '../../../core/utils/export.utils.ts';
import { toast } from 'vue3-toastify';
import type { ContextMenuActionType, contextMenuType } from '../../../@types/ContextMenu.type.ts';

const { t } = useI18n();

const loading = ref(false);
const loading_export = ref(false);
const loading_delete = ref(false);
const modal_delete = ref(false);
const item_to_delete = ref<PersonnelDataType | null>(null);

const selected_personnel = ref<PersonnelDataType>();
const data = ref<PersonnelDataType[]>([]);
const searchQuery = ref('');

const pagination = ref({
    current_page: 1,
    from: 0,
    to: 0,
    total: 0,
});

type FilterKeyType = 'fonction' | 'direction' | 'entity';
const filterableKeys: FilterKeyType[] = ['fonction', 'direction', 'entity'];
const columnLabels: Record<FilterKeyType, string> = {
    direction: 'Direction',
    entity: 'Entité',
    fonction: 'Fonction',
};

const filters = ref<Record<FilterKeyType, string[]>>({
    direction: [],
    entity: [],
    fonction: [],
});

const columnOptions = ref<Record<FilterKeyType, string[]>>({
    direction: [],
    entity: [],
    fonction: [],
});

const contextMenu = ref<{
    isOpen: boolean;
    contextMenu?: contextMenuType;
    personnel?: PersonnelDataType;
}>({
    isOpen: false,
});

const context_menu_actions: ComputedRef<ContextMenuActionType[]> = computed(() => [
    {
        label: 'Détails',
        icon: Users,
        onClick: () => {
            selected_personnel.value = contextMenu.value.personnel;
        },
    },
    {
        label: 'Modifier',
        icon: Edit,
        variant: 'WARNING',
        onClick: () => {
            if (contextMenu.value.personnel?.id) {
                router.push({
                    name: 'PERSONNEL_UPDATE',
                    params: { id: contextMenu.value.personnel.id },
                });
            }
        },
    },
    {
        label: 'Supprimer',
        icon: Trash2,
        variant: 'DANGER',
        onClick: () => {
            if (contextMenu.value.personnel) {
                promptDelete(contextMenu.value.personnel);
            }
        },
    },
]);

function openContextMenu(event: MouseEvent, item: PersonnelDataType) {
    contextMenu.value.personnel = item;
    contextMenu.value.isOpen = true;
    contextMenu.value.contextMenu = event;
}

function buildParams() {
    const params: Record<string, any> = {
        page: pagination.value.current_page,
    };
    if (searchQuery.value && searchQuery.value.trim().length > 0) {
        params.search = searchQuery.value.trim();
    }
    if (filters.value.direction.length > 0) {
        params.direction = filters.value.direction;
    }
    if (filters.value.fonction.length > 0) {
        params.fonction = filters.value.fonction;
    }
    if (filters.value.entity.length > 0) {
        params.entity = filters.value.entity;
    }
    return params;
}

async function fetchData() {
    loading.value = true;
    try {
        const params = buildParams();
        const res = await personnelService.index(params);
        if (res?.data) {
            data.value = res.data.data ?? (Array.isArray(res.data) ? res.data : []);
            const meta = res.data.meta ?? res.data;
            pagination.value.from = meta.from ?? 1;
            pagination.value.to = meta.to ?? data.value.length;
            pagination.value.total = meta.total ?? data.value.length;
        }
    } catch (err) {
        console.error('Erreur chargement personnel:', err);
    } finally {
        loading.value = false;
    }
}

async function fetchFilters() {
    try {
        const res = await personnelService.getFilters();
        if (res?.data) {
            columnOptions.value = {
                direction: res.data.direction ?? [],
                entity: res.data.entity ?? [],
                fonction: res.data.fonction ?? [],
            };
        }
    } catch (err) {
        console.error('Erreur chargement filtres personnel:', err);
    }
}

function onPageChange(page: number) {
    pagination.value.current_page = page;
    fetchData();
}

function clearFilters() {
    filters.value.direction = [];
    filters.value.entity = [];
    filters.value.fonction = [];
    searchQuery.value = '';
    pagination.value.current_page = 1;
    fetchData();
}

function promptDelete(item: PersonnelDataType) {
    item_to_delete.value = item;
    modal_delete.value = true;
}

async function confirmDelete() {
    if (!item_to_delete.value?.id) return;
    loading_delete.value = true;
    try {
        await personnelService.destroy(item_to_delete.value.id);
        toast.success('Membre du personnel supprimé avec succès');
        modal_delete.value = false;
        if (selected_personnel.value?.id === item_to_delete.value.id) {
            selected_personnel.value = undefined;
        }
        item_to_delete.value = null;
        fetchData();
    } catch (err) {
        console.error('Erreur suppression personnel:', err);
        toast.error('Impossible de supprimer ce personnel');
    } finally {
        loading_delete.value = false;
    }
}

async function handleExport() {
    loading_export.value = true;
    try {
        const params = buildParams();
        delete params.page;
        const res = await personnelService.export(params);
        const rows = res?.data?.data || [];
        if (rows.length === 0) {
            toast.info('Aucun personnel à exporter');
            return;
        }
        const exportFields = [
            { key: 'Ref', excelName: 'Référence' },
            { key: 'Nom', excelName: 'Nom' },
            { key: 'Prénom', excelName: 'Prénom' },
            { key: 'E-mail', excelName: 'Adresse e-mail' },
            { key: 'Fonction', excelName: 'Fonction' },
            { key: 'Direction', excelName: 'Direction' },
            { key: 'Entité', excelName: 'Entité' },
        ];
        exportUtils(
            rows,
            exportFields,
            () => toast.success('Export du personnel réussi'),
            () => toast.error("Erreur lors de l'export"),
            'personnel_galana'
        );
    } catch (err) {
        console.error('Erreur export personnel:', err);
        toast.error("Impossible d'exporter le personnel");
    } finally {
        loading_export.value = false;
    }
}

watch([filters.value, () => searchQuery.value], () => {
    pagination.value.current_page = 1;
    fetchData();
});

onMounted(() => {
    fetchFilters();
    fetchData();
});
</script>