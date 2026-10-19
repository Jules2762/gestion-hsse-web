<template>
  <div class="rounded-2xl border border-gray-200 bg-white shadow-2xs overflow-hidden transition-all duration-200">
    <!-- EN-TÊTE DU BLOC LOCALISATION -->
    <div
      class="p-3 bg-gradient-to-r from-slate-50 to-amber-50/40 border-b border-gray-100 flex items-center justify-between gap-2 select-none"
    >
      <div class="flex items-center gap-2 min-w-0">
        <div class="h-7 w-7 rounded-lg bg-amber-500/15 text-amber-700 flex items-center justify-center shrink-0">
          <Fuel :size="15" />
        </div>
        <div class="min-w-0">
          <div class="flex items-center gap-1.5 flex-wrap">
            <span class="text-xs font-bold text-gray-900 truncate">
              {{ displaySiteName }}
            </span>
            <span
              v-if="resolvedProvince"
              class="text-[9px] font-semibold text-amber-800 bg-amber-100/70 border border-amber-200 px-1.5 py-0.2 rounded-full uppercase"
            >
              {{ resolvedProvince }}
            </span>
          </div>
          <p class="text-[10px] text-gray-500 truncate flex items-center gap-1">
            <MapPin :size="10" class="text-gray-400 shrink-0" />
            <span>{{ displayLocality }}</span>
            <span v-if="hasExactCoords" class="font-mono text-gray-400 text-[9px] ml-1">
              ({{ formattedCoords }})
            </span>
          </p>
        </div>
      </div>

      <!-- ACTIONS D'EN-TÊTE : GOOGLE MAPS, PLEIN ÉCRAN, REPLIER -->
      <div class="flex items-center gap-1 shrink-0">
        <!-- Lien Google Maps externe -->
        <a
          v-if="hasExactCoords"
          :href="googleMapsUrl"
          target="_blank"
          rel="noopener noreferrer"
          title="Ouvrir dans Google Maps"
          class="p-1 rounded-md text-gray-400 hover:text-primary hover:bg-white transition cursor-pointer border border-transparent hover:border-gray-200 shadow-2xs"
        >
          <ExternalLink :size="13" />
        </a>

        <!-- Bouton Plein écran -->
        <button
          type="button"
          @click="toggleFullscreen"
          class="p-1 rounded-md text-gray-500 hover:text-gray-900 hover:bg-white transition cursor-pointer border border-transparent hover:border-gray-200 shadow-2xs"
          :title="isFullscreen ? 'Quitter le plein écran (Échap)' : 'Agrandir la carte en plein écran'"
        >
          <component :is="isFullscreen ? Minimize2 : Maximize2" :size="13" />
        </button>

        <!-- Bouton Replier / Déplier -->
        <button
          type="button"
          @click="toggleCollapse"
          class="p-1 rounded-md text-gray-500 hover:text-gray-900 hover:bg-white transition cursor-pointer border border-transparent hover:border-gray-200 shadow-2xs"
          :title="isCollapsed ? 'Déplier la carte' : 'Replier la carte'"
        >
          <component :is="isCollapsed ? ChevronDown : ChevronUp" :size="14" />
        </button>
      </div>
    </div>

    <!-- CONTENEUR PRINCIPAL DE LA CARTE (AVEC TÉLÉPORTATION EN PLEIN ÉCRAN) -->
    <Teleport to="body" :disabled="!isFullscreen">
      <div
        v-show="!isCollapsed || isFullscreen"
        :class="isFullscreen
          ? '!fixed !inset-0 !z-[100000] !w-screen !h-screen !rounded-none !p-4 md:!p-6 !m-0 !overflow-hidden !flex !flex-col !bg-white'
          : 'relative'"
      >
        <!-- BARRE D'ACTION EN MODE PLEIN ÉCRAN -->
        <div
          v-if="isFullscreen"
          class="flex items-center justify-between gap-3 pb-3 border-b border-gray-200 mb-3 shrink-0"
        >
          <div class="flex items-center gap-2">
            <div class="h-8 w-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
              <Fuel :size="18" />
            </div>
            <div>
              <h3 class="font-bold text-gray-900 text-sm md:text-base flex items-center gap-2">
                <span>Cartographie de l'emplacement : {{ displaySiteName }}</span>
                <span class="text-[11px] font-semibold text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-full">
                  Plein Écran
                </span>
              </h3>
              <p class="text-xs text-gray-500">
                Localisation GPS, province de {{ resolvedProvince || 'Madagascar' }} et secours d'urgence rattachés
              </p>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <button
              type="button"
              @click="recenterMap"
              class="px-2.5 py-1.5 rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <Compass :size="14" />
              <span>Recadrer</span>
            </button>
            <button
              type="button"
              @click="toggleFullscreen"
              class="px-3 py-1.5 rounded-lg border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <Minimize2 :size="14" />
              <span>Quitter le plein écran</span>
            </button>
          </div>
        </div>

        <!-- CONTENEUR DU WIDGET LEAFLET -->
        <div
          ref="mapContainerRef"
          class="relative w-full overflow-hidden transition-all"
          :class="isFullscreen ? 'flex-1 min-h-0 rounded-2xl border border-gray-200' : 'h-[175px] bg-slate-100'"
        >
          <!-- SPINNER DE CHARGEMENT -->
          <div
            v-if="loadingSites"
            class="absolute inset-0 bg-white/70 backdrop-blur-2xs z-[1000] flex items-center justify-center gap-2 text-xs text-gray-600 font-medium"
          >
            <div class="w-4 h-4 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
            <span>Chargement de la carte...</span>
          </div>

          <!-- BOUTON RE-CENTRER FLOTTANT (HORS PLEIN ÉCRAN) -->
          <button
            v-if="!isFullscreen && hasExactCoords"
            type="button"
            @click="recenterMap"
            class="absolute top-2 right-2 z-[900] bg-white/90 hover:bg-white text-gray-700 shadow-md border border-gray-200 rounded-lg p-1 text-[10px] font-semibold flex items-center gap-1 transition cursor-pointer select-none"
            title="Recadrer sur la station"
          >
            <Compass :size="12" class="text-primary" />
          </button>

          <!-- COMPOSANT VUE-LEAFLET -->
          <LMap
            ref="lMapRef"
            class="z-0 w-full h-full"
            :zoom="mapZoom"
            :center="mapCenter"
            @ready="onMapReady"
          >
            <LTileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap & Galana"
            />

            <!-- 1. MARKER DU SITE / STATION ACTIVE -->
            <template v-if="hasExactCoords">
              <!-- Halo de pulsation extérieur -->
              <LCircleMarker
                :lat-lng="[currentLat, currentLng]"
                :radius="17"
                :color="statusTheme.color"
                :fill-color="statusTheme.fill"
                :fill-opacity="0.25"
                :weight="1.5"
                class="animate-pulse"
              />

              <!-- Point central de la station -->
              <LCircleMarker
                :lat-lng="[currentLat, currentLng]"
                :radius="9.5"
                :color="statusTheme.stroke"
                :fill-color="statusTheme.fill"
                :fill-opacity="1"
                :weight="2.5"
              >
                <!-- Tooltip permanent compact -->
                <LTooltip :options="{ permanent: false, direction: 'top', offset: [0, -8] }">
                  <div class="text-[11px] font-bold text-gray-900 flex items-center gap-1">
                    <span>⛽</span>
                    <span>{{ displaySiteName }}</span>
                  </div>
                </LTooltip>

                <!-- Popup détaillée au clic sur le marker -->
                <LPopup :options="{ maxWidth: 280, minWidth: 220 }">
                  <div class="flex flex-col gap-2 p-1 text-xs">
                    <div class="border-b border-gray-100 pb-1.5">
                      <div class="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-amber-700">
                        <Fuel :size="12" />
                        <span>Station Galana (SS)</span>
                      </div>
                      <h4 class="font-bold text-gray-900 text-sm mt-0.5">{{ displaySiteName }}</h4>
                      <p class="text-[11px] text-gray-500">
                        {{ displayLocality }}
                        <span v-if="resolvedProvince" class="text-gray-400">({{ resolvedProvince }})</span>
                      </p>
                    </div>

                    <div class="flex items-center justify-between text-[11px] bg-slate-50 p-1.5 rounded-lg border border-slate-100">
                      <span class="text-gray-500">GPS :</span>
                      <span class="font-mono text-gray-800 font-semibold">{{ currentLat.toFixed(5) }}, {{ currentLng.toFixed(5) }}</span>
                    </div>

                    <div v-if="conformityRate !== undefined && conformityRate !== null" class="flex items-center justify-between text-[11px]">
                      <span class="text-gray-500">Conformité :</span>
                      <span class="font-bold" :class="Number(conformityRate) >= 90 ? 'text-emerald-700' : 'text-amber-700'">
                        {{ conformityRate }}%
                      </span>
                    </div>

                    <!-- Lien externe direct Google Maps -->
                    <a
                      :href="googleMapsUrl"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="mt-1 w-full py-1 px-2.5 rounded-lg bg-primary hover:bg-primary/90 text-white font-semibold text-[11px] flex items-center justify-center gap-1 text-center shadow-xs"
                    >
                      <ExternalLink :size="12" />
                      <span>Ouvrir dans Google Maps</span>
                    </a>
                  </div>
                </LPopup>
              </LCircleMarker>
            </template>

            <!-- 2. MARKERS DES SECOURS D'URGENCE PROCHES (POMPIERS, HÔPITAL, POLICE) -->
            <template v-if="showEmergency && nearbyEmergencyContacts.length > 0">
              <LCircleMarker
                v-for="contact in nearbyEmergencyContacts"
                :key="'c-' + contact.id"
                :lat-lng="[contact.latitude!, contact.longitude!]"
                :radius="6.5"
                :color="contactColors(contact.type).stroke"
                :fill-color="contactColors(contact.type).fill"
                :fill-opacity="0.9"
                :weight="1.5"
              >
                <LTooltip :options="{ permanent: false, direction: 'top', offset: [0, -6] }">
                  <div class="text-[10px] font-bold text-gray-900">
                    {{ contactEmoji(contact.type) }} {{ contact.name }}
                  </div>
                </LTooltip>

                <LPopup :options="{ maxWidth: 240 }">
                  <div class="p-1 space-y-1.5 text-xs">
                    <div class="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider" :style="{ color: contactColors(contact.type).fill }">
                      <span>{{ contactEmoji(contact.type) }}</span>
                      <span>{{ contactLabel(contact.type) }}</span>
                    </div>
                    <div class="font-bold text-gray-900">{{ contact.name }}</div>
                    <div class="text-[11px] text-gray-500">{{ contact.locality }}</div>
                    <div v-if="contact.distance_km !== undefined" class="text-[10px] font-semibold text-emerald-700">
                      📍 À env. {{ contact.distance_km.toFixed(1) }} km de la station
                    </div>
                    <div v-if="contact.contact_1 || contact.phone" class="pt-1 border-t border-gray-100">
                      <a
                        :href="`tel:${contact.contact_1 || contact.phone}`"
                        class="w-full inline-flex items-center justify-center gap-1 px-2 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-bold font-mono text-[11px]"
                      >
                        <Phone :size="11" />
                        <span>{{ contact.contact_1 || contact.phone }}</span>
                      </a>
                    </div>
                  </div>
                </LPopup>
              </LCircleMarker>
            </template>
          </LMap>
        </div>

        <!-- PIED DE CARTE COMPACT AVEC SECOURS LES PLUS PROCHES -->
        <div
          v-if="!isCollapsed && showEmergency && nearbyEmergencyContacts.length > 0"
          class="p-2.5 bg-slate-50 border-t border-gray-100 flex flex-col gap-1.5 text-[11px]"
        >
          <div class="flex items-center justify-between text-[10px] font-bold text-gray-500 uppercase tracking-wider">
            <span class="flex items-center gap-1">
              <span>🚨</span>
              <span>Secours à proximité de la station</span>
            </span>
            <span class="text-[9px] text-gray-400 font-normal">
              {{ nearbyEmergencyContacts.length }} service(s)
            </span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            <div
              v-for="c in nearbyEmergencyContacts.slice(0, 2)"
              :key="'badge-' + c.id"
              class="p-1.5 bg-white rounded-lg border border-gray-200/80 flex items-center justify-between gap-1 shadow-2xs"
            >
              <div class="min-w-0 truncate">
                <span class="font-bold text-gray-800 truncate block text-[10px]">
                  {{ contactEmoji(c.type) }} {{ c.name }}
                </span>
                <span v-if="c.distance_km !== undefined" class="text-[9px] text-emerald-700 font-semibold block">
                  {{ c.distance_km < 1 ? '< 1 km' : c.distance_km.toFixed(1) + ' km' }}
                </span>
              </div>
              <a
                v-if="c.contact_1 || c.phone"
                :href="`tel:${c.contact_1 || c.phone}`"
                class="shrink-0 p-1 rounded-md bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition cursor-pointer font-bold text-[10px]"
                :title="`Appeler ${c.name} (${c.contact_1 || c.phone})`"
              >
                📞 {{ c.contact_1 || c.phone }}
              </a>
            </div>
          </div>
        </div>

        <!-- CAS SANS COORDONNÉES EXACTES -->
        <div
          v-if="!hasExactCoords"
          class="p-2 bg-amber-50/70 border-t border-amber-100 text-[10px] text-amber-800 flex items-center justify-between"
        >
          <span>📍 Coordonnées estimées sur Madagascar pour <b>{{ displaySiteName }}</b></span>
          <span class="text-amber-600 font-semibold">(Position indicative)</span>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import "leaflet/dist/leaflet.css";
import {
  LMap,
  LTileLayer,
  LCircleMarker,
  LPopup,
  LTooltip,
} from "@vue-leaflet/vue-leaflet";
import {
  ChevronDown,
  ChevronUp,
  Compass,
  ExternalLink,
  Fuel,
  MapPin,
  Maximize2,
  Minimize2,
  Phone,
} from "@lucide/vue";
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from "vue";
import emergencyContactService from "../../core/services/emergencyContact.service";
import type {
  EmergencyContactType,
  EmergencySiteType,
  EmergencyType,
} from "../../@types/EmergencyContact.type";

interface Props {
  siteName?: string | null;
  locationName?: string | null;
  latitude?: number | string | null;
  longitude?: number | string | null;
  locality?: string | null;
  province?: string | null;
  status?: string | null;
  conformityRate?: number | string | null;
  initiallyCollapsed?: boolean;
  showEmergency?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  siteName: null,
  locationName: null,
  latitude: null,
  longitude: null,
  locality: null,
  province: null,
  status: null,
  conformityRate: null,
  initiallyCollapsed: false,
  showEmergency: true,
});

// ÉTAT DU WIDGET
const isCollapsed = ref(props.initiallyCollapsed);
const isFullscreen = ref(false);
const loadingSites = ref(false);
const mapContainerRef = ref<HTMLElement | null>(null);
const lMapRef = ref<any>(null);
const mapZoom = ref(13);
const mapCenter = ref<[number, number]>([-18.8792, 47.5079]);
let resizeObserver: ResizeObserver | null = null;

// CACHE PARTAGÉ DES SITES ET CONTACTS AU NIVEAU MODULE
let cachedSites: EmergencySiteType[] = [];
let cachedContacts: EmergencyContactType[] = [];
let sitesFetchPromise: Promise<any> | null = null;

const allSites = ref<EmergencySiteType[]>([]);
const allContacts = ref<EmergencyContactType[]>([]);

// CHARGEMENT DU RÉFÉRENTIEL DES SITES ET SECOURS
async function ensureSitesLoaded() {
  if (cachedSites.length > 0) {
    allSites.value = cachedSites;
    allContacts.value = cachedContacts;
    return;
  }

  if (!sitesFetchPromise) {
    loadingSites.value = true;
    sitesFetchPromise = emergencyContactService
      .getMapData()
      .then((data) => {
        cachedSites = data.sites || [];
        cachedContacts = data.contacts || [];
        allSites.value = cachedSites;
        allContacts.value = cachedContacts;
        return data;
      })
      .catch((err) => {
        console.error("Erreur de chargement du référentiel des sites Galana :", err);
      })
      .finally(() => {
        loadingSites.value = false;
        sitesFetchPromise = null;
      });
  }

  await sitesFetchPromise;
}

// UTILITAIRE DE NORMALISATION DE CHAÎNE
function cleanText(str?: string | null): string {
  if (!str) return "";
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/^(station service|station-service|station|ss|depot|dépôt|agence)\s+/gi, "")
    .replace(/[^a-z0-9]/g, "")
    .trim();
}

// RÉSOLUTION DU SITE GALANA ET DES COORDONNÉES GPS
const matchedSite = computed<EmergencySiteType | null>(() => {
  const queryName = cleanText(props.siteName);
  const queryLoc = cleanText(props.locationName);

  if (!queryName && !queryLoc) return null;

  // 1. Recherche par nom exact ou nom contenant
  let found = allSites.value.find((s) => {
    const sName = cleanText(s.name);
    return sName && (sName === queryName || sName.includes(queryName) || queryName.includes(sName));
  });

  if (found) return found;

  // 2. Recherche par localité
  if (queryLoc || queryName) {
    const target = queryLoc || queryName;
    found = allSites.value.find((s) => {
      const sLoc = cleanText(s.locality);
      return sLoc && (sLoc === target || sLoc.includes(target) || target.includes(sLoc));
    });
  }

  return found || null;
});

// COORDONNÉES EFFECTIVES
const currentLat = computed<number>(() => {
  if (props.latitude !== null && props.latitude !== undefined && !isNaN(Number(props.latitude))) {
    return Number(props.latitude);
  }
  if (matchedSite.value && matchedSite.value.latitude) {
    return Number(matchedSite.value.latitude);
  }
  return -18.8792; // Tananarive fallback
});

const currentLng = computed<number>(() => {
  if (props.longitude !== null && props.longitude !== undefined && !isNaN(Number(props.longitude))) {
    return Number(props.longitude);
  }
  if (matchedSite.value && matchedSite.value.longitude) {
    return Number(matchedSite.value.longitude);
  }
  return 47.5079;
});

const hasExactCoords = computed<boolean>(() => {
  const hasPropCoords = props.latitude !== null && props.latitude !== undefined && !isNaN(Number(props.latitude));
  const hasMatchedCoords = !!(matchedSite.value && matchedSite.value.latitude && matchedSite.value.longitude);
  return hasPropCoords || hasMatchedCoords;
});

// NOM DU SITE AFFICHÉ
const displaySiteName = computed<string>(() => {
  if (props.siteName && props.siteName.trim()) return props.siteName.trim();
  if (matchedSite.value?.name) return matchedSite.value.name;
  if (props.locationName && props.locationName.trim()) return props.locationName.trim();
  return "Station / Emplacement";
});

// LOCALITÉ AFFICHÉE
const displayLocality = computed<string>(() => {
  if (props.locality) return props.locality;
  if (matchedSite.value?.locality) return matchedSite.value.locality;
  if (props.locationName) return props.locationName;
  return "Madagascar";
});

// PROVINCE AFFICHÉE
const resolvedProvince = computed<string>(() => {
  if (props.province) return props.province.toUpperCase();
  if (matchedSite.value?.province) return matchedSite.value.province.toUpperCase();
  return "";
});

// COORDONNÉES FORMATÉES
const formattedCoords = computed<string>(() => {
  return `${currentLat.value.toFixed(4)}, ${currentLng.value.toFixed(4)}`;
});

// LIEN GOOGLE MAPS
const googleMapsUrl = computed<string>(() => {
  return `https://www.google.com/maps/search/?api=1&query=${currentLat.value},${currentLng.value}`;
});

// CALCUL DE DISTANCE EN KM (FORMULE HAVERSINE)
function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Rayon de la Terre en km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// CONTACTS D'URGENCE LES PLUS PROCHES
const nearbyEmergencyContacts = computed<EmergencyContactType[]>(() => {
  if (!hasExactCoords.value || allContacts.value.length === 0) return [];

  const sLat = currentLat.value;
  const sLng = currentLng.value;

  const withDist = allContacts.value
    .filter((c) => c.latitude && c.longitude)
    .map((c) => ({
      ...c,
      distance_km: haversineDistance(sLat, sLng, Number(c.latitude!), Number(c.longitude!)),
    }))
    .sort((a, b) => a.distance_km - b.distance_km);

  // Sélectionner les secours pertinents les plus proches (jusqu'à 4 max)
  return withDist.slice(0, 4);
});

// COULEUR & THEME SELON CONFORMITÉ OU STATUT
const statusTheme = computed(() => {
  const conf = props.conformityRate !== null && props.conformityRate !== undefined ? Number(props.conformityRate) : null;
  if (conf !== null) {
    if (conf >= 90) return { fill: "#10B981", stroke: "#047857", color: "#059669" }; // Vert
    if (conf >= 70) return { fill: "#F59E0B", stroke: "#B45309", color: "#D97706" }; // Ambre
    return { fill: "#EF4444", stroke: "#B91C1C", color: "#DC2626" }; // Rouge
  }

  const st = (props.status || "").toUpperCase();
  if (st.includes("COMPLETED") || st.includes("CLOTUR") || st.includes("CONFORME")) {
    return { fill: "#10B981", stroke: "#047857", color: "#059669" };
  }
  if (st.includes("PROGRESS") || st.includes("PLANIF") || st.includes("DRAFT")) {
    return { fill: "#F59E0B", stroke: "#B45309", color: "#D97706" };
  }
  return { fill: "#F59E0B", stroke: "#B45309", color: "#D97706" };
});

// COULEURS ET EMOJIS DES SECOURS
function contactColors(type: EmergencyType | string) {
  switch (type) {
    case "POMPIER":
      return { fill: "#DC2626", stroke: "#FFFFFF" };
    case "HOPITAL":
      return { fill: "#059669", stroke: "#FFFFFF" };
    case "AMBULANCE":
      return { fill: "#0284C7", stroke: "#FFFFFF" };
    case "POLICE":
      return { fill: "#4F46E5", stroke: "#FFFFFF" };
    case "GENDARMERIE":
      return { fill: "#7C3AED", stroke: "#FFFFFF" };
    default:
      return { fill: "#EA580C", stroke: "#FFFFFF" };
  }
}

function contactEmoji(type: EmergencyType | string): string {
  switch (type) {
    case "POMPIER":
      return "🚒";
    case "HOPITAL":
      return "🏥";
    case "AMBULANCE":
      return "🚑";
    case "POLICE":
      return "👮";
    case "GENDARMERIE":
      return "🛡️";
    default:
      return "🚨";
  }
}

function contactLabel(type: EmergencyType | string): string {
  switch (type) {
    case "POMPIER":
      return "Pompiers";
    case "HOPITAL":
      return "Hôpital";
    case "AMBULANCE":
      return "Ambulance";
    case "POLICE":
      return "Police";
    case "GENDARMERIE":
      return "Gendarmerie";
    default:
      return type;
  }
}

// RAFRAÎCHISSEMENT ET CONTRÔLE DE LA CARTE LEAFLET
let leafletMapInstance: any = null;

function getMapInstance(): any {
  if (leafletMapInstance && typeof leafletMapInstance.invalidateSize === "function") {
    return leafletMapInstance;
  }
  if (lMapRef.value?.leafletObject && typeof lMapRef.value.leafletObject.invalidateSize === "function") {
    return lMapRef.value.leafletObject;
  }
  return null;
}

function refreshMapSize() {
  const map = getMapInstance();
  if (map) {
    try {
      map.invalidateSize({ animate: false, pan: false });
    } catch {}
  }
}

function triggerStaggeredRefresh() {
  nextTick(() => {
    refreshMapSize();
    [50, 150, 300, 600].forEach((delay) => {
      setTimeout(() => {
        refreshMapSize();
      }, delay);
    });
  });
}

function onMapReady(map: any) {
  leafletMapInstance = map;
  updateMapCenterAndZoom();
  triggerStaggeredRefresh();
}

function updateMapCenterAndZoom() {
  const targetCoords: [number, number] = [currentLat.value, currentLng.value];
  mapCenter.value = targetCoords;
  mapZoom.value = hasExactCoords.value ? 14 : 6;

  const map = getMapInstance();
  if (map) {
    try {
      map.setView(targetCoords, mapZoom.value, { animate: true });
    } catch {}
  }
}

function recenterMap() {
  updateMapCenterAndZoom();
  triggerStaggeredRefresh();
}

function toggleCollapse() {
  isCollapsed.value = !isCollapsed.value;
  if (!isCollapsed.value) {
    triggerStaggeredRefresh();
  }
}

function toggleFullscreen() {
  isFullscreen.value = !isFullscreen.value;
  if (isFullscreen.value && isCollapsed.value) {
    isCollapsed.value = false;
  }
  triggerStaggeredRefresh();
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === "Escape" && isFullscreen.value) {
    toggleFullscreen();
  }
}

// WATCHERS SUR LES CHANGEMENTS DE PROPS (Ex: clic sur une autre ligne)
watch(
  () => [props.siteName, props.locationName, props.latitude, props.longitude],
  () => {
    updateMapCenterAndZoom();
    triggerStaggeredRefresh();
  },
  { deep: true }
);

onMounted(() => {
  ensureSitesLoaded();
  window.addEventListener("keydown", onKeydown);
  window.addEventListener("resize", refreshMapSize);

  nextTick(() => {
    updateMapCenterAndZoom();
    triggerStaggeredRefresh();

    if (mapContainerRef.value && typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(() => {
        refreshMapSize();
      });
      resizeObserver.observe(mapContainerRef.value);
    }
  });
});

onUnmounted(() => {
  window.removeEventListener("keydown", onKeydown);
  window.removeEventListener("resize", refreshMapSize);
  if (resizeObserver) {
    resizeObserver.disconnect();
    resizeObserver = null;
  }
});
</script>

<style>
/* Style des popups Leaflet pour intégration parfaite dans la sidebar */
.leaflet-popup-content-wrapper {
  border-radius: 0.85rem !important;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1) !important;
}
</style>
