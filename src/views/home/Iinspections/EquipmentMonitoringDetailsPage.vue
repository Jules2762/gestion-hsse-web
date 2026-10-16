<template>
    <div class="min-h-screen bg-slate-100/80 py-4 print:bg-white print:p-0 print:min-h-0 print:m-0">
        <!-- HEADER ET ACTIONS EN LIGNE (MASQUÉ À L'IMPRESSION) -->
        <div class="max-w-5xl mx-auto mb-4 px-4 sm:px-0 print:hidden">
            <Header title="Détails du suivi matériel" :thumbnails="[
                { label: 'Accueil', name: 'DASHBOARD' },
                { label: 'Inspections', name: 'INSPECTION' },
                { label: 'Suivi du matériel', name: 'EQUIPMENT_MONITORING' },
                { label: 'Fiche détaillée', name: 'EQUIPMENT_MONITORING_DETAILS' }
            ]" />

            <div class="mt-3 bg-white border border-gray-200 rounded-xl p-3 px-4 flex flex-wrap items-center justify-between gap-3 shadow-xs">
                <div class="flex items-center gap-3">
                    <button
                        @click="router.push({ name: 'EQUIPMENT_MONITORING' })"
                        class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition cursor-pointer"
                    >
                        <ArrowLeft :size="15" />
                        Retour à la liste
                    </button>
                    <span class="text-sm font-bold text-gray-800 truncate" v-if="equipment">
                        Fiche n° {{ equipment.id }} — {{ getSiteNameText(equipment.site_name) }}
                    </span>
                    <ChecklistStatus v-if="equipment" :name="(equipment.status as any) || 'COMPLETED'" />
                    <span
                        v-if="equipment"
                        class="px-2.5 py-0.5 rounded-full text-[11px] font-bold inline-block"
                        :class="badgeColor(equipment.status, equipment.conformity_rate)"
                    >
                        {{ formatStatus(equipment.status, equipment.conformity_rate) }}
                    </span>
                </div>

                <div class="flex items-center gap-2">
                    <button
                        v-if="equipment?.id"
                        @click="router.push({ name: 'EQUIPMENT_MONITORING_UPDATE', params: { id: equipment.id } })"
                        class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition cursor-pointer"
                    >
                        <Edit :size="14" />
                        Modifier la fiche
                    </button>

                    <button
                        @click="handlePrint"
                        class="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-white bg-primary hover:bg-primary/90 rounded-lg shadow-sm transition cursor-pointer"
                    >
                        <Printer :size="15" />
                        Imprimer / PDF
                    </button>
                </div>
            </div>
        </div>

        <!-- ÉTAT DE CHARGEMENT -->
        <div v-if="loading" class="p-20 flex flex-col items-center justify-center gap-3 text-gray-500 print:hidden">
            <Loader :size="32" class="animate-spin text-primary" />
            <span class="text-sm font-medium">Chargement du contrôle de matériel...</span>
        </div>

        <!-- ÉTAT D'ERREUR -->
        <div v-else-if="errorMessage" class="p-10 max-w-xl mx-auto my-10 bg-red-50 border border-red-200 rounded-xl text-center text-red-600 print:hidden">
            <p class="font-semibold">{{ errorMessage }}</p>
            <button
                @click="router.push({ name: 'EQUIPMENT_MONITORING' })"
                class="mt-4 px-4 py-2 text-xs bg-red-600 text-white rounded-lg hover:bg-red-700 cursor-pointer"
            >
                Retour au suivi des matériels
            </button>
        </div>

        <!-- ======================= FICHE DE SUIVI COMPLÈTE ======================= -->
        <div v-else-if="equipment" class="sheet-container max-w-5xl mx-auto bg-white p-6 sm:p-10 shadow-lg border border-gray-200 rounded-2xl print:shadow-none print:border-none print:p-0 print:m-0 print:w-full print:max-w-none text-gray-900 font-sans space-y-6">

            <!-- EN-TÊTE OFFICIEL GALANA -->
            <div class="border border-gray-300 rounded-xl overflow-hidden">
                <div class="flex flex-col sm:flex-row">
                    <div class="sm:w-[28%] p-4 flex items-center justify-center bg-gray-50 border-b sm:border-b-0 sm:border-r border-gray-300">
                        <img src="/logo/galana-rubis.png" alt="Galana Groupe Rubis" class="max-h-14 w-auto object-contain" />
                    </div>
                    <div class="sm:w-[72%] flex flex-col justify-between">
                        <div class="p-4 text-center">
                            <h1 class="text-base sm:text-lg font-black tracking-wide uppercase text-gray-900 font-sans">
                                CONTRÔLE & SUIVI DU MATÉRIEL HSSE
                            </h1>
                            <p class="text-xs text-gray-500 mt-0.5">Réseau des Stations-Service & Sites Pétroliers Galana</p>
                        </div>
                        <div class="border-t border-gray-300 bg-gray-50/70 grid grid-cols-2 sm:grid-cols-5 text-xs divide-x divide-gray-300">
                            <div class="p-2 text-center">
                                <span class="text-gray-400 block text-[10px] uppercase font-bold">Référence</span>
                                <span class="font-mono font-bold text-gray-800">{{ equipment.id }}</span>
                            </div>
                            <div class="p-2 text-center">
                                <span class="text-gray-400 block text-[10px] uppercase font-bold">Station / Site</span>
                                <span class="font-bold text-gray-800">{{ getSiteNameText(equipment.site_name) }}</span>
                            </div>
                            <div class="p-2 text-center">
                                <span class="text-gray-400 block text-[10px] uppercase font-bold">Date contrôle</span>
                                <span class="font-medium text-gray-800">{{ equipment.date || 'N/A' }}</span>
                            </div>
                            <div class="p-2 text-center">
                                <span class="text-gray-400 block text-[10px] uppercase font-bold">Inspecteur</span>
                                <span class="font-medium text-gray-800">{{ inspectorName }}</span>
                            </div>
                            <div class="p-2 text-center flex flex-col items-center justify-center">
                                <span class="text-gray-400 block text-[10px] uppercase font-bold mb-0.5">Statut</span>
                                <ChecklistStatus :name="(equipment.status as any) || 'COMPLETED'" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- BANDEAU KPI DE CONFORMITÉ -->
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div class="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col items-center justify-center text-center">
                    <span class="text-[11px] font-semibold text-gray-500">Taux actuel</span>
                    <span class="text-xl font-black mt-0.5" :class="(equipment.conformity_rate ?? 100) >= 90 ? 'text-emerald-700' : 'text-red-700'">
                        {{ equipment.conformity_rate ?? 100 }}%
                    </span>
                    <span
                        v-if="equipment.initial_conformity_rate !== undefined && equipment.initial_conformity_rate !== equipment.conformity_rate"
                        class="text-[9px] font-bold text-amber-800 bg-amber-100/70 px-2 py-0.5 rounded-full mt-1 border border-amber-200"
                        :title="`Taux initial constaté lors de la visite : ${equipment.initial_conformity_rate}%`"
                    >
                        Taux initial : {{ equipment.initial_conformity_rate }}%
                    </span>
                </div>
                <div class="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col items-center justify-center text-center">
                    <span class="text-[11px] font-semibold text-gray-500">Équipements unitaires</span>
                    <span class="text-xl font-black text-gray-800 mt-0.5">{{ items.length }}</span>
                </div>
                <div class="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col items-center justify-center text-center">
                    <span class="text-[11px] font-semibold text-gray-500">Conformes</span>
                    <span class="text-xl font-black text-emerald-600 mt-0.5">{{ compliantItemsCount }}</span>
                </div>
                <div class="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col items-center justify-center text-center">
                    <span class="text-[11px] font-semibold text-gray-500">Anomalies détectées</span>
                    <span class="text-xl font-black mt-0.5" :class="nonCompliantItemsCount > 0 ? 'text-red-600' : 'text-gray-400'">
                        {{ nonCompliantItemsCount }}
                    </span>
                </div>
            </div>

            <!-- SECTION 1 : ÉQUIPEMENTS ENREGISTRÉS DYNAMIQUES (EquipmentItem) -->
            <div class="border border-gray-200 rounded-xl p-5 bg-white shadow-2xs">
                <div class="flex items-center justify-between pb-3 border-b border-gray-200 mb-4">
                    <div>
                        <h3 class="font-bold text-gray-900 text-sm flex items-center gap-2">
                            <span>📦 Équipements & Matériels enregistrés</span>
                            <span class="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-bold">{{ items.length }} items</span>
                        </h3>
                        <p class="text-xs text-gray-500 mt-0.5">Détail des matériels saisis, états de conformité et preuves photos</p>
                    </div>
                </div>

                <div v-if="!items.length" class="text-center py-8 text-gray-400 text-xs bg-gray-50 rounded-lg border border-dashed border-gray-200">
                    <p class="font-medium text-gray-600">Aucun équipement unitaire spécifique n'a été inséré pour ce contrôle.</p>
                    <p class="text-[11px] text-gray-400 mt-1">Consultez la synthèse globale ci-dessous pour les relevés volumiques de la station.</p>
                </div>

                <div v-else class="space-y-3">
                    <div
                        v-for="item in items"
                        :key="item.id"
                        class="p-4 rounded-xl border border-gray-200 bg-slate-50/50 hover:bg-slate-50 transition flex flex-col gap-3"
                    >
                        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div>
                                <div class="flex items-center gap-2">
                                    <h4 class="font-bold text-gray-900 text-sm">{{ item.name }}</h4>
                                    <span class="px-2 py-0.5 rounded-md bg-gray-200/70 text-gray-700 text-[10px] font-semibold uppercase">
                                        {{ item.type }}
                                    </span>
                                </div>
                                <p class="text-xs text-gray-500 mt-0.5">
                                    <span v-if="item.location">📍 Emplacement : <b>{{ item.location }}</b> • </span>
                                    <span>Relevé / Quantité : <b>{{ item.value ?? '1' }}</b></span>
                                    <span v-if="item.comment" class="italic text-gray-600 ml-2">« {{ item.comment }} »</span>
                                </p>
                            </div>

                            <!-- Bascule conformité -->
                            <div class="flex items-center gap-2 print:hidden">
                                <button
                                    type="button"
                                    @click="toggleItemConformity(item)"
                                    class="px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer select-none"
                                    :class="item.conformity ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' : 'bg-red-100 text-red-800 hover:bg-red-200'"
                                    :title="'Cliquer pour modifier l\'état de conformité'"
                                >
                                    {{ item.conformity ? '🟢 Conforme' : '🔴 Non conforme' }}
                                </button>
                                <span
                                    v-if="item.initial_conformity === false && item.conformity === true"
                                    class="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full"
                                    title="Cet équipement était initialement non conforme et a été régularisé"
                                >
                                    Régularisé
                                </span>
                            </div>
                            <div class="hidden print:block text-xs font-bold" :class="item.conformity ? 'text-emerald-700' : 'text-red-700'">
                                {{ item.conformity ? 'CONFORME' : 'NON CONFORME' }}
                            </div>
                        </div>

                        <!-- Galerie des photos de l'item -->
                        <div class="border-t border-gray-200/80 pt-2.5">
                            <div class="flex items-center justify-between mb-2">
                                <span class="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                                    <ImageIcon :size="14" class="text-gray-400" />
                                    Preuves photos ({{ (item.attachments || []).length }})
                                </span>

                                <label class="text-xs font-bold text-primary hover:underline cursor-pointer flex items-center gap-1 print:hidden">
                                    <Plus :size="13" />
                                    <span>Ajouter une photo</span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        class="hidden"
                                        @change="onUploadPhoto($event, item)"
                                    />
                                </label>
                            </div>

                            <div v-if="item.attachments && item.attachments.length" class="flex flex-wrap gap-2.5">
                                <div
                                    v-for="att in item.attachments"
                                    :key="att.id"
                                    @click="previewImage(att.file_path)"
                                    class="w-20 h-20 rounded-xl overflow-hidden border border-gray-200 shadow-2xs cursor-pointer hover:opacity-90 relative group transition"
                                    title="Agrandir la photo"
                                >
                                    <img :src="resolvePhotoUrl(att.file_path)" class="w-full h-full object-cover" />
                                </div>
                            </div>
                            <p v-else class="text-xs text-gray-400 italic">Aucune preuve photo enregistrée pour cet équipement.</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- SECTION 2 : SYNTHÈSE GLOBALE DU PARC & MATÉRIEL -->
            <div class="border border-gray-200 rounded-xl p-5 bg-white shadow-2xs">
                <div class="pb-3 border-b border-gray-200 mb-4">
                    <h3 class="font-bold text-gray-900 text-sm">📊 Synthèse globale des dotations</h3>
                    <p class="text-xs text-gray-500 mt-0.5">Volumes déclarés sur la station lors de la visite</p>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <!-- Extincteurs & Bacs -->
                    <div class="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-200">
                        <h4 class="font-bold text-gray-800 text-xs uppercase tracking-wide text-primary">Protection Incendie & Bacs</h4>
                        <div class="divide-y divide-gray-200">
                            <div class="py-1.5 flex justify-between"><span>Poudre 50 kg (P50)</span><span class="font-bold">{{ equipment.p50 ?? 0 }}</span></div>
                            <div class="py-1.5 flex justify-between"><span>Poudre 9 kg (P9)</span><span class="font-bold">{{ equipment.p9 ?? 0 }}</span></div>
                            <div class="py-1.5 flex justify-between"><span>Poudre 6 kg (P6)</span><span class="font-bold">{{ equipment.p6 ?? 0 }}</span></div>
                            <div class="py-1.5 flex justify-between"><span>CO₂</span><span class="font-bold">{{ equipment.co2 ?? 0 }}</span></div>
                            <div class="py-1.5 flex justify-between"><span>Bac métallique</span><span class="font-bold">{{ equipment.bas_met ?? 0 }}</span></div>
                            <div class="py-1.5 flex justify-between"><span>Bac plastique & rétention</span><span class="font-bold">{{ (equipment.bas_plast ?? 0) + (equipment.bac_de_retention ?? 0) }}</span></div>
                            <div class="py-1.5 flex justify-between"><span>Pelles</span><span class="font-bold">{{ equipment.pelles ?? 0 }}</span></div>
                            <div class="py-1.5 flex justify-between"><span>Poubelles (120L / 240L)</span><span class="font-bold">{{ (equipment.poubelles_120l ?? 0) + (equipment.poubelles_240l ?? 0) }}</span></div>
                        </div>
                    </div>

                    <!-- Signalisation & Sécurité -->
                    <div class="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-200">
                        <h4 class="font-bold text-gray-800 text-xs uppercase tracking-wide text-primary">Signalisation & Règles HSSE</h4>
                        <div class="divide-y divide-gray-200">
                            <div class="py-1.5 flex justify-between"><span>Picto Extincteur</span><span class="font-bold">{{ equipment.picto_ext ?? 0 }}</span></div>
                            <div class="py-1.5 flex justify-between"><span>Picto CAF</span><span class="font-bold">{{ equipment.picto_caf ?? 0 }}</span></div>
                            <div class="py-1.5 flex justify-between"><span>Picto Défense de fumer</span><span class="font-bold">{{ equipment.picto_defense_de_fumer ?? 0 }}</span></div>
                            <div class="py-1.5 flex justify-between"><span>Point de rassemblement</span><span class="font-bold">{{ equipment.point_de_rasso ?? 0 }}</span></div>
                            <div class="py-1.5 flex justify-between"><span>Contacts d'urgence affichés</span><span class="font-bold">{{ equipment.contact_d_urgence ?? 0 }}</span></div>
                            <div class="py-1.5 flex justify-between"><span>Canne d'enfutage</span><span class="font-bold">{{ equipment.canne_d_enfutage ?? 0 }}</span></div>
                            <div class="py-1.5 flex justify-between"><span>Picto Danger TGBT</span><span class="font-bold" :class="equipment.picto_danger_tgbt ? 'text-emerald-700' : 'text-red-700'">{{ equipment.picto_danger_tgbt ? 'Oui' : 'Non' }}</span></div>
                            <div class="py-1.5 flex justify-between"><span>Livret / Fiche réflexe</span><span class="font-bold" :class="equipment.livret_fiche_reflexe ? 'text-emerald-700' : 'text-red-700'">{{ equipment.livret_fiche_reflexe ? 'Oui' : 'Non' }}</span></div>
                        </div>
                    </div>
                </div>

                <!-- Observations -->
                <div v-if="equipment.observations" class="mt-4 p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900">
                    <span class="font-bold block mb-1">📝 Remarques & Observations :</span>
                    <p class="whitespace-pre-line">{{ equipment.observations }}</p>
                </div>
            </div>

            <!-- SECTION 3 : PIED DE PAGE & VALIDATION OFFICIELLE -->
            <div class="pt-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
                <div>
                    <p class="font-semibold text-gray-700">Fiche certifiée Galana Distribution Pétrolière</p>
                    <p class="text-[11px] text-gray-400">Direction HSSE Madagascar • Inspection Réseau Matériel</p>
                </div>
                <div class="text-right">
                    <p>Relevé validé le : <b>{{ equipment.date || 'N/A' }}</b></p>
                    <p class="text-[11px] text-gray-400">Par l'inspecteur : {{ inspectorName }}</p>
                </div>
            </div>
        </div>

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
                    <X :size="20" />
                </button>
                <img :src="lightboxUrl" class="max-w-full max-h-[85vh] rounded-xl object-contain shadow-2xl" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Header from '../../../components/shared/Header.vue';
import ChecklistStatus from '../../../components/features/checklist/ChecklistStatus.vue';
import type { EquipmentItemType, EquipmentMonitoringType } from '../../../@types/EquipmentMonitoring.type';
import { useEquipmentMonitoringService } from '../../../core/services/equipmentMonitoring.service';
import {
    ArrowLeft,
    CheckCircle2,
    Edit,
    ImageIcon,
    Loader,
    Plus,
    Printer,
    Trash2,
    X
} from '@lucide/vue';

const route = useRoute();
const router = useRouter();
const equipmentsService = useEquipmentMonitoringService();

const loading = ref(true);
const errorMessage = ref<string | null>(null);
const equipment = ref<EquipmentMonitoringType | null>(null);
const items = ref<EquipmentItemType[]>([]);
const lightboxUrl = ref<string | null>(null);

const inspectorName = computed(() => {
    const user = (equipment.value as any)?.user;
    if (user?.first_name || user?.last_name) {
        return `${user.first_name || ''} ${user.last_name || ''}`.trim();
    }
    return 'Inspecteur HSSE';
});

const compliantItemsCount = computed(() => {
    return items.value.filter(it => it.conformity).length;
});

const nonCompliantItemsCount = computed(() => {
    return items.value.filter(it => !it.conformity).length;
});

function getSiteNameText(site: any): string {
    if (!site) return '';
    if (typeof site === 'string') return site;
    if (typeof site === 'object' && site.name) return String(site.name);
    return String(site);
}

function badgeColor(status?: string, conformityRate?: number) {
    const rate = conformityRate ?? 100;
    if (rate >= 90 && (!status || status === 'COMPLETED' || status === 'Conforme')) {
        return 'bg-emerald-100 text-emerald-800 border border-emerald-200';
    }
    if (rate >= 70 || status === 'WARNING' || status === 'Contrôle requis') {
        return 'bg-amber-100 text-amber-800 border border-amber-200';
    }
    return 'bg-red-100 text-red-800 border border-red-200';
}

function formatStatus(status?: string, conformityRate?: number) {
    const rate = conformityRate ?? 100;
    if (rate >= 90) return '🟢 Conforme';
    if (rate >= 70) return '🟡 Contrôle requis';
    return '🔴 Anomalie';
}

function resolvePhotoUrl(path: string) {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    const backendUrl = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://127.0.0.1:8000';
    return `${backendUrl}${path}`;
}

function previewImage(path: string) {
    lightboxUrl.value = resolvePhotoUrl(path);
}

async function toggleItemConformity(item: any) {
    const newConformity = !item.conformity;
    item.conformity = newConformity;
    try {
        await equipmentsService.updateItem(item.id, { conformity: newConformity });
        if (equipment.value?.id) {
            const r = await equipmentsService.getItems(equipment.value.id);
            if (r?.data?.items) {
                items.value = r.data.items;
                if (r.data.conformity_rate !== undefined) {
                    equipment.value.conformity_rate = r.data.conformity_rate;
                }
                if (r.data.status !== undefined) {
                    equipment.value.status = r.data.status;
                }
            }
        }
    } catch (err) {
        console.error('Erreur mise à jour conformité item:', err);
    }
}

async function onUploadPhoto(event: Event, item: any) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    const file = input.files[0];
    try {
        const res = await equipmentsService.uploadItemPhoto(item.id, file);
        if (res?.data?.attachment) {
            if (!item.attachments) item.attachments = [];
            item.attachments.push(res.data.attachment);
        }
    } catch (err) {
        console.error('Erreur upload photo item:', err);
    } finally {
        input.value = '';
    }
}

function handlePrint() {
    window.print();
}

async function loadDetails() {
    const id = (route.params.id || route.query.monitoring_id) as string;
    if (!id) {
        errorMessage.value = "Identifiant de contrôle d'équipement non spécifié.";
        loading.value = false;
        return;
    }

    loading.value = true;
    errorMessage.value = null;

    try {
        const [showRes, itemsRes] = await Promise.allSettled([
            equipmentsService.show(id),
            equipmentsService.getItems(id)
        ]);

        if (showRes.status === 'fulfilled' && showRes.value?.data) {
            equipment.value = showRes.value.data as EquipmentMonitoringType;
        } else {
            throw new Error("Impossible de récupérer la fiche de contrôle.");
        }

        if (itemsRes.status === 'fulfilled' && itemsRes.value?.data?.items) {
            items.value = itemsRes.value.data.items;
            if (itemsRes.value.data.conformity_rate !== undefined && equipment.value) {
                equipment.value.conformity_rate = itemsRes.value.data.conformity_rate;
            }
            if (itemsRes.value.data.status !== undefined && equipment.value) {
                equipment.value.status = itemsRes.value.data.status;
            }
        }
    } catch (err: any) {
        console.error('Erreur chargement détails équipement:', err);
        errorMessage.value = err?.response?.data?.message || err?.message || 'Erreur lors du chargement des détails du suivi.';
    } finally {
        loading.value = false;
    }
}

onMounted(() => {
    loadDetails();
});
</script>
