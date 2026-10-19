<template>
  <div
    class="bg-white rounded-2xl border border-border p-5 shadow-2xs flex flex-col gap-4 transition-all duration-200"
    :class="isFullscreen ? 'fixed inset-0 z-[9999] w-screen h-screen rounded-none p-4 md:p-6 overflow-hidden flex flex-col bg-white' : ''"
  >
    <!-- EN-TÊTE AVEC FILTRES ET ACTIONS -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-border shrink-0">
      <div>
        <div class="flex items-center gap-2">
          <div class="h-8 w-8 rounded-xl bg-red-50 text-red-600 flex items-center justify-center ring-2 ring-red-500/10">
            <Radio :size="18" class="animate-pulse" />
          </div>
          <div>
            <h3 class="font-bold text-gray-800 text-sm md:text-base flex items-center gap-2">
              <span>Cartographie Nationale des Secours & Stations Galana</span>
              <span
                v-if="isFullscreen"
                class="text-xs font-semibold text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-full"
              >
                Mode Plein Écran
              </span>
            </h3>
            <p class="text-xs text-gray-500">
              Couverture géographique des sapeurs-pompiers, hôpitaux, ambulances et forces de l'ordre rattachés aux sites pétroliers.
            </p>
          </div>
        </div>
      </div>

      <!-- FILTRES ET BOUTONS -->
      <div class="flex flex-wrap items-center gap-2 text-xs">
        <!-- Filtre Type de Secours -->
        <select
          v-model="selectedType"
          class="border border-gray-200 rounded-lg px-2.5 py-1.5 bg-gray-50 font-medium text-gray-700 outline-none focus:border-primary"
        >
          <option value="ALL">Tous les secours ({{ contacts.length }})</option>
          <option value="POMPIER">🚒 Sapeurs-Pompiers</option>
          <option value="HOPITAL">🏥 Hôpitaux & Cliniques</option>
          <option value="AMBULANCE">🚑 Ambulances SAMU</option>
          <option value="POLICE">👮 Commissariats de Police</option>
          <option value="GENDARMERIE">🛡️ Brigades de Gendarmerie</option>
        </select>

        <!-- Filtre Province -->
        <select
          v-model="selectedProvince"
          class="border border-gray-200 rounded-lg px-2.5 py-1.5 bg-gray-50 font-medium text-gray-700 outline-none focus:border-primary"
        >
          <option value="ALL">Toutes provinces</option>
          <option v-for="prov in provinceList" :key="prov" :value="prov">
            {{ prov }}
          </option>
        </select>

        <!-- Toggle Affichage Stations Galana -->
        <button
          type="button"
          @click="showStations = !showStations"
          class="inline-flex items-center gap-1.5 border rounded-lg px-2.5 py-1.5 font-medium transition cursor-pointer select-none"
          :class="showStations ? 'bg-amber-50 text-amber-800 border-amber-200' : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100'"
        >
          <Fuel :size="14" />
          <span>Stations Galana ({{ sites.length }})</span>
        </button>

        <!-- Bouton Plein Écran -->
        <button
          type="button"
          @click="toggleFullscreen"
          class="inline-flex items-center gap-1.5 border rounded-lg px-3 py-1.5 font-medium transition cursor-pointer shadow-xs select-none"
          :class="isFullscreen ? 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100' : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200'"
          :title="isFullscreen ? 'Quitter le plein écran (Échap)' : 'Afficher la carte en plein écran'"
        >
          <component :is="isFullscreen ? Minimize2 : Maximize2" :size="14" />
          <span>{{ isFullscreen ? 'Quitter' : 'Plein écran' }}</span>
        </button>
      </div>
    </div>

    <!-- RACCOURCIS RAPIDES DES PROVINCES -->
    <div class="flex items-center gap-1.5 flex-wrap text-[11px] shrink-0 text-gray-500">
      <span class="font-semibold text-gray-700 mr-1 flex items-center gap-1">
        <Compass :size="13" />
        Accès direct :
      </span>
      <button
        v-for="city in cityJumpList"
        :key="city.name"
        type="button"
        @click="jumpTo(city.coords, city.zoom)"
        class="px-2 py-0.5 rounded-md border border-gray-200 bg-gray-50 hover:bg-primary/10 hover:border-primary/30 hover:text-primary transition cursor-pointer"
      >
        {{ city.name }}
      </button>
      <button
        type="button"
        @click="jumpTo([-18.8792, 47.5079], 6)"
        class="px-2 py-0.5 rounded-md border border-gray-200 bg-white hover:bg-gray-100 text-gray-600 transition cursor-pointer font-medium ml-auto"
      >
        Réinitialiser la vue
      </button>
    </div>

    <!-- CONTENEUR DE LA CARTE LEAFLET -->
    <div
      class="rounded-xl overflow-hidden border border-gray-200 relative transition-all"
      :class="isFullscreen ? 'flex-1 w-full min-h-0' : 'h-[460px] w-full'"
    >
      <!-- SPINNER DE CHARGEMENT -->
      <div
        v-if="loading"
        class="absolute inset-0 bg-white/80 backdrop-blur-2xs z-[1000] flex flex-col items-center justify-center gap-2 text-gray-600"
      >
        <Loader2 :size="28" class="animate-spin text-primary" />
        <span class="text-xs font-semibold">Chargement des données cartographiques des secours...</span>
      </div>

      <!-- LÉGENDE FLOTTANTE -->
      <div
        class="absolute bottom-3 left-3 z-[1000] bg-white/95 backdrop-blur-xs border border-gray-200 rounded-xl p-2.5 shadow-md text-[11px] hidden sm:flex flex-col gap-1.5 max-w-[240px]"
      >
        <span class="font-bold text-gray-800 border-b border-gray-100 pb-1">Légende des Secours</span>
        <div class="flex items-center gap-2">
          <span class="h-3 w-3 rounded-full bg-red-600 border border-white shadow-xs"></span>
          <span class="text-gray-700 font-medium">Sapeurs-Pompiers (118 / CPC)</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="h-3 w-3 rounded-full bg-emerald-600 border border-white shadow-xs"></span>
          <span class="text-gray-700 font-medium">Hôpitaux & Cliniques (CHU)</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="h-3 w-3 rounded-full bg-sky-500 border border-white shadow-xs"></span>
          <span class="text-gray-700 font-medium">Ambulances & SAMU</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="h-3 w-3 rounded-full bg-indigo-600 border border-white shadow-xs"></span>
          <span class="text-gray-700 font-medium">Commissariats de Police (117)</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="h-3 w-3 rounded-full bg-purple-600 border border-white shadow-xs"></span>
          <span class="text-gray-700 font-medium">Gendarmerie Nationale (119)</span>
        </div>
        <div v-if="showStations" class="flex items-center gap-2 pt-1 border-t border-gray-100">
          <span class="h-3 w-3 rounded-full bg-amber-500 border border-white shadow-xs"></span>
          <span class="text-amber-900 font-medium">Stations Galana couvertes</span>
        </div>
      </div>

      <!-- CARTE VUE-LEAFLET -->
      <LMap
        class="z-0 w-full h-full"
        :zoom="zoom"
        :center="mapCenter"
        @ready="onMapReady"
      >
        <LTileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap & Galana Distribution Pétrolière"
        />

        <!-- 1. MARKERS CONTACTS D'URGENCE -->
        <LCircleMarker
          v-for="contact in filteredContacts"
          :key="'contact-' + contact.id"
          :lat-lng="[contact.latitude!, contact.longitude!]"
          :radius="markerRadius(contact.type)"
          :color="contactColors(contact.type).stroke"
          :fill-color="contactColors(contact.type).fill"
          :fill-opacity="0.9"
          :weight="2.5"
        >
          <!-- TOOLTIP AU SURVOL -->
          <LTooltip :options="{ direction: 'top', offset: [0, -8] }">
            <div class="text-xs p-0.5">
              <span class="font-bold text-gray-900 block">{{ contact.name }}</span>
              <span class="text-gray-500 font-normal">{{ contactLabel(contact.type) }} • {{ contact.locality }}</span>
              <span v-if="contact.phone" class="font-mono text-emerald-700 font-semibold block mt-0.5">📞 {{ contact.phone }}</span>
            </div>
          </LTooltip>

          <!-- POPUP DÉTAILLÉ AU CLIC -->
          <LPopup :options="{ maxWidth: 320 }">
            <div class="text-xs space-y-2.5 p-1 min-w-[240px]">
              <!-- Entête -->
              <div class="border-b border-gray-100 pb-2">
                <div class="flex items-center justify-between gap-2">
                  <span
                    class="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-white"
                    :style="{ backgroundColor: contactColors(contact.type).fill }"
                  >
                    {{ contactLabel(contact.type) }}
                  </span>
                  <span class="text-[11px] text-gray-400 font-medium">{{ contact.locality }}</span>
                </div>
                <h4 class="font-bold text-gray-900 text-sm mt-1.5">{{ contact.name }}</h4>
                <p v-if="contact.address" class="text-[11px] text-gray-500 mt-0.5">{{ contact.address }}</p>
              </div>

              <!-- Numéros de téléphone d'urgence -->
              <div class="space-y-1.5 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <span class="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Lignes d'urgence directes</span>
                <div class="flex flex-col gap-1">
                  <a
                    v-if="contact.contact_1"
                    :href="'tel:' + contact.contact_1"
                    class="inline-flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition"
                  >
                    <span class="flex items-center gap-1.5">
                      <span>📞</span>
                      <span>{{ contact.contact_1 }}</span>
                    </span>
                    <span class="text-[10px] uppercase font-normal opacity-90">Appeler</span>
                  </a>

                  <a
                    v-if="contact.contact_2"
                    :href="'tel:' + contact.contact_2"
                    class="inline-flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-white border border-gray-300 text-gray-800 font-semibold text-xs hover:bg-gray-100 transition"
                  >
                    <span class="flex items-center gap-1.5">
                      <span>📞 Ligne 2 :</span>
                      <span>{{ contact.contact_2 }}</span>
                    </span>
                    <span class="text-[10px] text-gray-500">Appeler</span>
                  </a>

                  <a
                    v-if="contact.contact_3"
                    :href="'tel:' + contact.contact_3"
                    class="inline-flex items-center justify-between px-2.5 py-1 rounded-lg bg-white border border-gray-200 text-gray-700 text-[11px] hover:bg-gray-100 transition"
                  >
                    <span>Ligne 3 : {{ contact.contact_3 }}</span>
                  </a>
                </div>
              </div>

              <!-- Sites Galana rattachés -->
              <div v-if="contact.sites && contact.sites.length" class="space-y-1">
                <span class="text-[10px] font-bold uppercase tracking-wider text-gray-500 block">
                  Stations Galana rattachées ({{ contact.sites.length }}) :
                </span>
                <div class="flex flex-wrap gap-1 max-h-24 overflow-y-auto">
                  <span
                    v-for="st in contact.sites"
                    :key="st.id"
                    class="px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-semibold"
                  >
                    ⛽ {{ st.name }}
                  </span>
                </div>
              </div>

              <div v-if="contact.notes" class="text-[11px] text-gray-600 italic bg-amber-50/50 p-2 rounded-lg border border-amber-100">
                📝 {{ contact.notes }}
              </div>
            </div>
          </LPopup>
        </LCircleMarker>

        <!-- 2. MARKERS STATIONS GALANA -->
        <template v-if="showStations">
          <LCircleMarker
            v-for="site in filteredSites"
            :key="'site-' + site.id"
            :lat-lng="[site.latitude, site.longitude]"
            :radius="6"
            color="#B45309"
            fill-color="#F59E0B"
            :fill-opacity="0.8"
            :weight="1.5"
          >
            <!-- TOOLTIP -->
            <LTooltip :options="{ direction: 'top', offset: [0, -6] }">
              <div class="text-xs p-0.5">
                <span class="font-bold text-gray-900 block">⛽ Galana {{ site.name }}</span>
                <span class="text-gray-500 font-normal">{{ site.locality }} ({{ site.province }})</span>
                <span class="text-amber-800 font-semibold block text-[10px] mt-0.5">
                  {{ site.emergency_contacts?.length || 0 }} service(s) de secours rattaché(s)
                </span>
              </div>
            </LTooltip>

            <!-- POPUP -->
            <LPopup :options="{ maxWidth: 280 }">
              <div class="text-xs space-y-2 p-1 min-w-[220px]">
                <div class="border-b border-gray-100 pb-1.5">
                  <div class="flex items-center gap-1.5 text-amber-700 font-bold">
                    <Fuel :size="14" />
                    <span>Station-Service GALANA</span>
                  </div>
                  <h4 class="font-bold text-gray-900 text-sm mt-0.5">{{ site.name }}</h4>
                  <p class="text-[11px] text-gray-500">{{ site.locality }} • {{ site.province }}</p>
                </div>

                <!-- Contacts d'urgence liés à cette station -->
                <div>
                  <span class="text-[10px] font-bold uppercase tracking-wider text-gray-500 block mb-1">
                    Secours d'urgence rattachés :
                  </span>
                  <div v-if="site.emergency_contacts && site.emergency_contacts.length" class="space-y-1">
                    <div
                      v-for="c in site.emergency_contacts"
                      :key="c.id"
                      class="flex items-center justify-between p-1.5 rounded-lg bg-gray-50 border border-gray-200 text-[11px]"
                    >
                      <div>
                        <span class="font-bold text-gray-800 block">{{ c.name }}</span>
                        <span class="text-[10px] text-gray-500">{{ contactLabel(c.type) }}</span>
                      </div>
                      <a
                        v-if="c.phone"
                        :href="'tel:' + c.phone"
                        class="px-2 py-1 rounded bg-emerald-600 text-white font-bold text-[10px] hover:bg-emerald-700 transition"
                      >
                        {{ c.phone }}
                      </a>
                    </div>
                  </div>
                  <div v-else class="text-[11px] text-gray-400 italic">
                    Aucun secours spécifique rattaché directement.
                  </div>
                </div>
              </div>
            </LPopup>
          </LCircleMarker>
        </template>
      </LMap>
    </div>
  </div>
</template>

<script setup lang="ts">
import "leaflet/dist/leaflet.css";
import {
  LMap,
  LCircleMarker,
  LPopup,
  LTooltip,
  LTileLayer,
} from "@vue-leaflet/vue-leaflet";
import {
  Compass,
  Fuel,
  Loader2,
  Maximize2,
  Minimize2,
  Radio,
} from "@lucide/vue";
import { computed, nextTick, onMounted, onUnmounted, ref } from "vue";
import type {
  EmergencyContactType,
  EmergencySiteType,
  EmergencyType,
} from "../../../../@types/EmergencyContact.type";

interface Props {
  contacts: EmergencyContactType[];
  sites: EmergencySiteType[];
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
});

const isFullscreen = ref(false);
const leafletMap = ref<any>(null);
const zoom = ref(6);
const mapCenter = ref<[number, number]>([-18.8792, 47.5079]);
const selectedType = ref<string>("ALL");
const selectedProvince = ref<string>("ALL");
const showStations = ref(true);

// Villes rapides pour zoomer
const cityJumpList = [
  { name: "Antananarivo", coords: [-18.9055, 47.525], zoom: 12 },
  { name: "Toamasina", coords: [-18.1492, 49.4023], zoom: 12 },
  { name: "Mahajanga", coords: [-15.7188, 46.3272], zoom: 12 },
  { name: "Antsiranana", coords: [-12.3088, 49.2938], zoom: 12 },
  { name: "Fianarantsoa", coords: [-21.4408, 47.0977], zoom: 12 },
  { name: "Toliara", coords: [-23.3508, 43.6686], zoom: 12 },
];

// Provinces distinctes
const provinceList = computed(() => {
  const set = new Set<string>();
  props.sites.forEach((s) => {
    if (s.province) set.add(s.province);
  });
  return Array.from(set).sort();
});

// Contacts filtrés sur la carte
const filteredContacts = computed(() => {
  return props.contacts.filter((c) => {
    if (!c.latitude || !c.longitude) return false;
    if (selectedType.value !== "ALL" && c.type !== selectedType.value) return false;
    if (selectedProvince.value !== "ALL") {
      const matchProv =
        c.location?.province === selectedProvince.value ||
        c.sites?.some((s) => s.province === selectedProvince.value);
      if (!matchProv) return false;
    }
    return true;
  });
});

// Sites Galana filtrés sur la carte
const filteredSites = computed(() => {
  return props.sites.filter((s) => {
    if (!s.latitude || !s.longitude) return false;
    if (selectedProvince.value !== "ALL" && s.province !== selectedProvince.value) return false;
    if (selectedType.value !== "ALL") {
      const hasType = s.emergency_contacts?.some((c) => c.type === selectedType.value);
      if (!hasType) return false;
    }
    return true;
  });
});

function onMapReady(map: any) {
  leafletMap.value = map;
}

function jumpTo(coords: number[] | [number, number], targetZoom = 12) {
  mapCenter.value = [coords[0], coords[1]];
  zoom.value = targetZoom;
  if (leafletMap.value) {
    leafletMap.value.setView(coords, targetZoom, { animate: true });
  }
}

function toggleFullscreen() {
  isFullscreen.value = !isFullscreen.value;
  nextTick(() => {
    setTimeout(() => {
      if (leafletMap.value) {
        leafletMap.value.invalidateSize();
      }
    }, 250);
  });
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === "Escape" && isFullscreen.value) {
    toggleFullscreen();
  }
}

onMounted(() => {
  window.addEventListener("keydown", onKeydown);
});

onUnmounted(() => {
  window.removeEventListener("keydown", onKeydown);
});

// Couleurs par type de secours
function contactColors(type: EmergencyType | string) {
  switch (type) {
    case "POMPIER":
      return { fill: "#DC2626", stroke: "#991B1B" }; // Rouge
    case "HOPITAL":
      return { fill: "#059669", stroke: "#047857" }; // Vert émeraude
    case "AMBULANCE":
      return { fill: "#0284C7", stroke: "#0369A1" }; // Bleu ciel
    case "POLICE":
      return { fill: "#4F46E5", stroke: "#3730A3" }; // Indigo
    case "GENDARMERIE":
      return { fill: "#7C3AED", stroke: "#5B21B6" }; // Violet
    default:
      return { fill: "#EA580C", stroke: "#C2410C" }; // Orange
  }
}

function markerRadius(type: EmergencyType | string) {
  if (type === "POMPIER" || type === "HOPITAL") return 9;
  return 8;
}

function contactLabel(type: EmergencyType | string) {
  switch (type) {
    case "POMPIER":
      return "Sapeurs-Pompiers";
    case "HOPITAL":
      return "Hôpital / CHU";
    case "AMBULANCE":
      return "Ambulance / SAMU";
    case "POLICE":
      return "Police Nationale";
    case "GENDARMERIE":
      return "Gendarmerie";
    default:
      return type;
  }
}

defineExpose({
  jumpTo,
});
</script>
