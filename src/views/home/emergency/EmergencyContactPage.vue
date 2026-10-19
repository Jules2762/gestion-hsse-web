<template>
  <div class="min-h-screen bg-background text-text-primary pb-12">
    <!-- HEADER GLOBAL -->
    <Header title="Contacts d'urgence & Secours" show-search />

    <div class="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">

      <!-- ========================================================= -->
      <!-- 1. CARTES KPI / SYNTHÈSE DES SECOURS NATIONAUX           -->
      <!-- ========================================================= -->
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        <!-- Total Secours -->
        <div class="rounded-2xl border border-border bg-surface p-4 shadow-2xs flex flex-col justify-between">
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold text-text-secondary">Secours Répertoriés</span>
            <div class="h-8 w-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
              <PhoneCall :size="16" />
            </div>
          </div>
          <div class="mt-2">
            <span class="text-2xl font-black text-gray-900">{{ mapStats.total_contacts || contacts.length }}</span>
            <span class="text-[11px] text-gray-500 block mt-0.5">Services géolocalisés</span>
          </div>
        </div>

        <!-- Pompiers -->
        <div class="rounded-2xl border border-red-200/60 bg-red-50/40 p-4 shadow-2xs flex flex-col justify-between">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-red-900">Sapeurs-Pompiers</span>
            <div class="h-8 w-8 rounded-xl bg-red-600 text-white flex items-center justify-center font-bold shadow-xs">
              🚒
            </div>
          </div>
          <div class="mt-2">
            <span class="text-2xl font-black text-red-700">{{ countByType('POMPIER') }}</span>
            <span class="text-[11px] text-red-600 block mt-0.5">Centres de secours (118)</span>
          </div>
        </div>

        <!-- Hôpitaux -->
        <div class="rounded-2xl border border-emerald-200/60 bg-emerald-50/40 p-4 shadow-2xs flex flex-col justify-between">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-emerald-900">Hôpitaux & CHU</span>
            <div class="h-8 w-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-xs">
              🏥
            </div>
          </div>
          <div class="mt-2">
            <span class="text-2xl font-black text-emerald-700">{{ countByType('HOPITAL') }}</span>
            <span class="text-[11px] text-emerald-600 block mt-0.5">Urgences médicales</span>
          </div>
        </div>

        <!-- Ambulances -->
        <div class="rounded-2xl border border-sky-200/60 bg-sky-50/40 p-4 shadow-2xs flex flex-col justify-between">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-sky-900">Ambulances & SAMU</span>
            <div class="h-8 w-8 rounded-xl bg-sky-500 text-white flex items-center justify-center font-bold shadow-xs">
              🚑
            </div>
          </div>
          <div class="mt-2">
            <span class="text-2xl font-black text-sky-700">{{ countByType('AMBULANCE') }}</span>
            <span class="text-[11px] text-sky-600 block mt-0.5">Unités d'intervention</span>
          </div>
        </div>

        <!-- Police & Gendarmerie -->
        <div class="col-span-2 sm:col-span-1 rounded-2xl border border-indigo-200/60 bg-indigo-50/40 p-4 shadow-2xs flex flex-col justify-between">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-indigo-900">Forces de l'Ordre</span>
            <div class="h-8 w-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-xs">
              👮
            </div>
          </div>
          <div class="mt-2">
            <span class="text-2xl font-black text-indigo-700">
              {{ countByType('POLICE') + countByType('GENDARMERIE') }}
            </span>
            <span class="text-[11px] text-indigo-600 block mt-0.5">Commissariats & Brigades</span>
          </div>
        </div>
      </div>

      <!-- ========================================================= -->
      <!-- 2. CARTOGRAPHIE DES SECOURS ET SITES GALANA              -->
      <!-- ========================================================= -->
      <div ref="mapContainerRef">
        <EmergencyMap
          ref="emergencyMapRef"
          :contacts="contacts"
          :sites="sites"
          :loading="mapLoading"
        />
      </div>

      <!-- ========================================================= -->
      <!-- 3. ANNUAIRE COMPLET DES CONTACTS D'URGENCE               -->
      <!-- ========================================================= -->
      <div class="rounded-2xl border border-border bg-surface p-5 sm:p-6 shadow-2xs space-y-5">
        <!-- BARRE DE RECHERCHE, FILTRES PAR CATÉGORIE & BOUTON AJOUT -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 class="text-base font-bold text-gray-900 flex items-center gap-2">
              <BookOpen :size="18" class="text-primary" />
              <span>Annuaire Opérationnel des Secours</span>
            </h3>
            <p class="text-xs text-gray-500">
              Numéros d'appel direct, coordonnées et liste des stations Galana rattachées à chaque service.
            </p>
          </div>

          <div class="flex flex-wrap items-center gap-2">
            <!-- Recherche rapide -->
            <div class="relative min-w-[220px]">
              <Search :size="14" class="absolute left-3 top-2.5 text-gray-400" />
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Rechercher service, ville, tél..."
                class="w-full rounded-xl border border-gray-200 bg-gray-50/50 pl-8.5 pr-3 py-1.5 text-xs text-gray-800 outline-none focus:border-primary focus:bg-white"
              />
            </div>

            <!-- Filtre Province -->
            <select
              v-model="selectedProvinceFilter"
              class="rounded-xl border border-gray-200 bg-gray-50/50 px-3 py-1.5 text-xs font-medium text-gray-700 outline-none focus:border-primary"
            >
              <option value="ALL">Toutes provinces</option>
              <option v-for="prov in provinceList" :key="prov" :value="prov">{{ prov }}</option>
            </select>

            <!-- Bouton Nouveau Contact -->
            <button
              type="button"
              @click="openAddModal"
              class="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-1.5 text-xs font-semibold text-white shadow-2xs hover:bg-primary/90 transition cursor-pointer"
            >
              <Plus :size="15" />
              <span>Nouveau secours</span>
            </button>
          </div>
        </div>

        <!-- CHIPS DE FILTRAGE PAR TYPE DE SERVICE -->
        <div class="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-hide text-xs">
          <button
            v-for="cat in categoryChips"
            :key="cat.id"
            type="button"
            @click="selectedCategory = cat.id"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold transition cursor-pointer shrink-0 select-none border"
            :class="selectedCategory === cat.id
              ? 'bg-gray-900 text-white border-gray-900 shadow-2xs'
              : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'"
          >
            <span>{{ cat.icon }}</span>
            <span>{{ cat.label }}</span>
            <span
              class="rounded-full px-1.5 py-0.2 text-[10px]"
              :class="selectedCategory === cat.id ? 'bg-white/20 text-white' : 'bg-gray-200/80 text-gray-700'"
            >
              {{ cat.count }}
            </span>
          </button>
        </div>

        <!-- GRILLE DES CONTACTS D'URGENCE -->
        <div v-if="filteredDirectoryContacts.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="contact in filteredDirectoryContacts"
            :key="contact.id"
            class="rounded-2xl border border-gray-200 bg-white p-4 shadow-2xs hover:shadow-sm transition-all flex flex-col justify-between group relative"
          >
            <div>
              <!-- En-tête de la carte -->
              <div class="flex items-start justify-between gap-2">
                <div class="flex items-start gap-2.5">
                  <div
                    class="h-9 w-9 rounded-xl flex items-center justify-center text-sm font-bold shadow-2xs shrink-0"
                    :style="{ backgroundColor: typeTheme(contact.type).bg, color: typeTheme(contact.type).text }"
                  >
                    {{ typeTheme(contact.type).icon }}
                  </div>
                  <div>
                    <span
                      class="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
                      :style="{ backgroundColor: typeTheme(contact.type).badgeBg, color: typeTheme(contact.type).badgeText }"
                    >
                      {{ typeTheme(contact.type).label }}
                    </span>
                    <h4 class="font-bold text-gray-900 text-sm mt-1 leading-snug">{{ contact.name }}</h4>
                    <p class="text-[11px] text-gray-500 font-medium flex items-center gap-1 mt-0.5">
                      <MapPin :size="11" class="text-gray-400" />
                      <span>{{ contact.locality || 'Madagascar' }}</span>
                      <span v-if="contact.location?.province" class="text-gray-400">({{ contact.location.province }})</span>
                    </p>
                  </div>
                </div>

                <!-- Actions contextuelles (Editer / Supprimer) -->
                <div class="flex items-center gap-1">
                  <button
                    type="button"
                    @click="openEditModal(contact)"
                    title="Modifier ce contact"
                    class="h-7 w-7 rounded-lg border border-transparent hover:border-gray-200 hover:bg-gray-100 text-gray-400 hover:text-gray-700 flex items-center justify-center transition"
                  >
                    <Edit3 :size="13" />
                  </button>
                  <button
                    type="button"
                    @click="confirmDelete(contact)"
                    title="Supprimer ce contact"
                    class="h-7 w-7 rounded-lg border border-transparent hover:border-red-200 hover:bg-red-50 text-gray-400 hover:text-red-600 flex items-center justify-center transition"
                  >
                    <Trash2 :size="13" />
                  </button>
                </div>
              </div>

              <!-- Lignes téléphoniques d'urgence avec clic direct -->
              <div class="mt-3.5 space-y-1.5">
                <div
                  v-if="contact.contact_1"
                  class="flex items-center justify-between p-2 rounded-xl bg-emerald-50/70 border border-emerald-200/80"
                >
                  <div class="flex items-center gap-2">
                    <span class="text-emerald-700 font-bold text-xs">📞</span>
                    <span class="font-mono font-bold text-emerald-900 text-xs tracking-wide">{{ contact.contact_1 }}</span>
                  </div>
                  <div class="flex items-center gap-1">
                    <button
                      type="button"
                      @click="copyPhone(contact.contact_1)"
                      class="px-2 py-0.5 rounded bg-white text-gray-700 text-[10px] font-semibold hover:bg-gray-100 border border-gray-200 transition"
                      title="Copier le numéro"
                    >
                      Copier
                    </button>
                    <a
                      :href="'tel:' + contact.contact_1"
                      class="px-2 py-0.5 rounded bg-emerald-600 text-white text-[10px] font-bold hover:bg-emerald-700 transition"
                    >
                      Appeler
                    </a>
                  </div>
                </div>

                <!-- Numéro secondaire si présent -->
                <div
                  v-if="contact.contact_2"
                  class="flex items-center justify-between p-1.5 px-2 rounded-xl bg-gray-50 border border-gray-200 text-xs"
                >
                  <span class="text-gray-600 font-medium text-[11px]">Ligne 2 : {{ contact.contact_2 }}</span>
                  <a
                    :href="'tel:' + contact.contact_2"
                    class="text-[10px] text-primary font-bold hover:underline"
                  >
                    Appeler
                  </a>
                </div>
              </div>

              <!-- Stations Galana couvertes -->
              <div v-if="contact.sites && contact.sites.length" class="mt-3">
                <span class="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                  Stations Galana couvertes ({{ contact.sites.length }}) :
                </span>
                <div class="flex flex-wrap gap-1">
                  <span
                    v-for="s in contact.sites.slice(0, 4)"
                    :key="s.id"
                    class="px-1.5 py-0.5 rounded bg-amber-50 text-amber-900 border border-amber-200/60 text-[10px] font-semibold"
                  >
                    ⛽ {{ s.name }}
                  </span>
                  <span
                    v-if="contact.sites.length > 4"
                    class="px-1.5 py-0.5 rounded bg-gray-100 text-gray-600 text-[10px] font-bold"
                  >
                    +{{ contact.sites.length - 4 }} autres
                  </span>
                </div>
              </div>
            </div>

            <!-- Bouton "Localiser sur la carte" en bas de carte -->
            <div class="mt-3.5 pt-2.5 border-t border-gray-100 flex items-center justify-between">
              <button
                type="button"
                @click="locateOnMap(contact)"
                class="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary/80 transition cursor-pointer"
              >
                <Compass :size="13" />
                <span>Localiser sur la carte</span>
              </button>

              <span v-if="contact.latitude && contact.longitude" class="text-[10px] font-mono text-gray-400">
                GPS OK
              </span>
            </div>
          </div>
        </div>

        <!-- ÉTAT VIDE -->
        <div
          v-else
          class="rounded-2xl border border-dashed border-gray-300 p-8 text-center flex flex-col items-center justify-center gap-2"
        >
          <div class="h-12 w-12 rounded-2xl bg-gray-100 text-gray-400 flex items-center justify-center text-xl">
            🔍
          </div>
          <h4 class="text-sm font-bold text-gray-800">Aucun service de secours correspondant</h4>
          <p class="text-xs text-gray-500 max-w-sm">
            Aucun contact d'urgence ne correspond à votre recherche ou à vos filtres actuels.
          </p>
          <button
            type="button"
            @click="resetFilters"
            class="mt-2 text-xs font-bold text-primary hover:underline"
          >
            Réinitialiser les filtres
          </button>
        </div>
      </div>
    </div>

    <!-- MODAL D'AJOUT / ÉDITION -->
    <EmergencyContactModal
      :is-open="isModalOpen"
      :contact="selectedContactForEdit"
      :available-sites="availableSites"
      :is-submitting="isSubmitting"
      @close="closeModal"
      @submit="handleModalSubmit"
    />

    <!-- MODAL DE CONFIRMATION DE SUPPRESSION -->
    <div
      v-if="contactToDelete"
      class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-xs p-4"
    >
      <div class="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl space-y-4">
        <div class="flex items-center gap-3">
          <div class="h-10 w-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
            <Trash2 :size="20" />
          </div>
          <div>
            <h3 class="text-sm font-bold text-gray-900">Supprimer ce contact d'urgence ?</h3>
            <p class="text-xs text-gray-500">{{ contactToDelete.name }} ({{ contactToDelete.locality }})</p>
          </div>
        </div>
        <p class="text-xs text-gray-600">
          Ce service d'urgence sera détaché des stations Galana associées et retiré de l'annuaire opérationnel.
        </p>
        <div class="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
          <button
            type="button"
            @click="contactToDelete = null"
            class="px-4 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-100"
          >
            Annuler
          </button>
          <button
            type="button"
            @click="executeDelete"
            class="px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-semibold hover:bg-red-700 transition"
          >
            Confirmer la suppression
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  BookOpen,
  Compass,
  Edit3,
  MapPin,
  PhoneCall,
  Plus,
  Search,
  Trash2,
} from "@lucide/vue";
import { computed, onMounted, ref } from "vue";
import { toast } from "vue3-toastify";
import Header from "../../../components/shared/Header.vue";
import emergencyContactService from "../../../core/services/emergencyContact.service";
import type {
  EmergencyContactFormType,
  EmergencyContactType,
  EmergencySiteType,
  EmergencyType,
} from "../../../@types/EmergencyContact.type";
import EmergencyMap from "./components/EmergencyMap.vue";
import EmergencyContactModal from "./components/EmergencyContactModal.vue";

const contacts = ref<EmergencyContactType[]>([]);
const sites = ref<EmergencySiteType[]>([]);
const availableSites = ref<any[]>([]);
const mapLoading = ref(true);
const isSubmitting = ref(false);

const searchQuery = ref("");
const selectedCategory = ref<string>("ALL");
const selectedProvinceFilter = ref<string>("ALL");

const isModalOpen = ref(false);
const selectedContactForEdit = ref<EmergencyContactType | null>(null);
const contactToDelete = ref<EmergencyContactType | null>(null);

const emergencyMapRef = ref<any>(null);
const mapContainerRef = ref<HTMLElement | null>(null);

const mapStats = ref({
  total_contacts: 0,
  total_sites: 0,
  pompier: 0,
  hopital: 0,
  ambulance: 0,
  police: 0,
  gendarmerie: 0,
});

// Liste des provinces disponibles
const provinceList = computed(() => {
  const set = new Set<string>();
  contacts.value.forEach((c) => {
    if (c.location?.province) set.add(c.location.province);
    c.sites?.forEach((s) => {
      if (s.province) set.add(s.province);
    });
  });
  return Array.from(set).sort();
});

// Chips de catégories avec compteurs
const categoryChips = computed(() => [
  { id: "ALL", label: "Tous les secours", icon: "🚨", count: contacts.value.length },
  { id: "POMPIER", label: "Sapeurs-Pompiers", icon: "🚒", count: countByType("POMPIER") },
  { id: "HOPITAL", label: "Hôpitaux & Cliniques", icon: "🏥", count: countByType("HOPITAL") },
  { id: "AMBULANCE", label: "Ambulances SAMU", icon: "🚑", count: countByType("AMBULANCE") },
  { id: "POLICE", label: "Police Nationale", icon: "👮", count: countByType("POLICE") },
  { id: "GENDARMERIE", label: "Gendarmerie", icon: "🛡️", count: countByType("GENDARMERIE") },
]);

function countByType(type: string): number {
  return contacts.value.filter((c) => c.type === type).length;
}

// Contacts filtrés pour l'annuaire
const filteredDirectoryContacts = computed(() => {
  return contacts.value.filter((c) => {
    // 1. Filtre catégorie
    if (selectedCategory.value !== "ALL" && c.type !== selectedCategory.value) {
      return false;
    }

    // 2. Filtre province
    if (selectedProvinceFilter.value !== "ALL") {
      const matchProv =
        c.location?.province === selectedProvinceFilter.value ||
        c.sites?.some((s) => s.province === selectedProvinceFilter.value);
      if (!matchProv) return false;
    }

    // 3. Recherche textuelle
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase().trim();
      const matchName = c.name?.toLowerCase().includes(q);
      const matchLoc = c.locality?.toLowerCase().includes(q);
      const matchC1 = c.contact_1?.toLowerCase().includes(q);
      const matchC2 = c.contact_2?.toLowerCase().includes(q);
      const matchSite = c.sites?.some((s) => s.name?.toLowerCase().includes(q));
      if (!matchName && !matchLoc && !matchC1 && !matchC2 && !matchSite) {
        return false;
      }
    }

    return true;
  });
});

async function loadData() {
  mapLoading.value = true;
  try {
    const mapData = await emergencyContactService.getMapData();
    contacts.value = mapData.contacts || [];
    sites.value = mapData.sites || [];
    mapStats.value = mapData.stats || mapStats.value;

    // Charger les sites disponibles pour l'ajout de contact
    try {
      const sitesRes = await emergencyContactService.getAvailableSites();
      availableSites.value = sitesRes.data || [];
    } catch {
      availableSites.value = sites.value.map((s) => ({ id: s.id, name: s.name, locality: s.locality }));
    }
  } catch (err) {
    console.error("Erreur chargement contacts d'urgence :", err);
    toast.error("Impossible de charger les contacts d'urgence.");
  } finally {
    mapLoading.value = false;
  }
}

function locateOnMap(contact: EmergencyContactType) {
  if (contact.latitude && contact.longitude) {
    // Défiler vers la carte
    mapContainerRef.value?.scrollIntoView({ behavior: "smooth", block: "center" });

    // Zoomer sur le marker
    setTimeout(() => {
      if (emergencyMapRef.value) {
        emergencyMapRef.value.jumpTo([contact.latitude, contact.longitude], 14);
      }
    }, 300);
  } else {
    toast.info("Coordonnées GPS non renseignées pour ce contact.");
  }
}

function copyPhone(phone: string) {
  navigator.clipboard.writeText(phone);
  toast.success(`Numéro ${phone} copié dans le presse-papier !`);
}

function openAddModal() {
  selectedContactForEdit.value = null;
  isModalOpen.value = true;
}

function openEditModal(contact: EmergencyContactType) {
  selectedContactForEdit.value = contact;
  isModalOpen.value = true;
}

function closeModal() {
  isModalOpen.value = false;
  selectedContactForEdit.value = null;
}

async function handleModalSubmit(formData: EmergencyContactFormType) {
  isSubmitting.value = true;
  try {
    if (selectedContactForEdit.value) {
      await emergencyContactService.updateContact(selectedContactForEdit.value.id, formData);
      toast.success("Contact d'urgence mis à jour avec succès !");
    } else {
      await emergencyContactService.createContact(formData);
      toast.success("Nouveau contact d'urgence créé !");
    }
    closeModal();
    await loadData();
  } catch (err: any) {
    console.error("Erreur enregistrement contact :", err);
    toast.error(err.response?.data?.message || "Erreur lors de l'enregistrement.");
  } finally {
    isSubmitting.value = false;
  }
}

function confirmDelete(contact: EmergencyContactType) {
  contactToDelete.value = contact;
}

async function executeDelete() {
  if (!contactToDelete.value) return;
  try {
    await emergencyContactService.deleteContact(contactToDelete.value.id);
    toast.success("Contact d'urgence supprimé avec succès.");
    contactToDelete.value = null;
    await loadData();
  } catch (err) {
    toast.error("Erreur lors de la suppression.");
  }
}

function resetFilters() {
  searchQuery.value = "";
  selectedCategory.value = "ALL";
  selectedProvinceFilter.value = "ALL";
}

function typeTheme(type: EmergencyType | string) {
  switch (type) {
    case "POMPIER":
      return {
        icon: "🚒",
        label: "Sapeurs-Pompiers",
        bg: "#FEE2E2",
        text: "#DC2626",
        badgeBg: "#DC2626",
        badgeText: "#FFFFFF",
      };
    case "HOPITAL":
      return {
        icon: "🏥",
        label: "Hôpital / CHU",
        bg: "#D1FAE5",
        text: "#059669",
        badgeBg: "#059669",
        badgeText: "#FFFFFF",
      };
    case "AMBULANCE":
      return {
        icon: "🚑",
        label: "Ambulance SAMU",
        bg: "#E0F2FE",
        text: "#0284C7",
        badgeBg: "#0284C7",
        badgeText: "#FFFFFF",
      };
    case "POLICE":
      return {
        icon: "👮",
        label: "Police Nationale",
        bg: "#EEF2FF",
        text: "#4F46E5",
        badgeBg: "#4F46E5",
        badgeText: "#FFFFFF",
      };
    case "GENDARMERIE":
      return {
        icon: "🛡️",
        label: "Gendarmerie",
        bg: "#F3E8FF",
        text: "#7C3AED",
        badgeBg: "#7C3AED",
        badgeText: "#FFFFFF",
      };
    default:
      return {
        icon: "🚨",
        label: type,
        bg: "#FFEDD5",
        text: "#EA580C",
        badgeBg: "#EA580C",
        badgeText: "#FFFFFF",
      };
  }
}

onMounted(() => {
  loadData();
});
</script>
