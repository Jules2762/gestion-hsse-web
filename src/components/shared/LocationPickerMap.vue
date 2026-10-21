<template>
  <div class="w-full">
    <!-- PLACEHOLDER VISIBLE DANS LA MODALE LORSQUE LE PLEIN ÉCRAN EST ACTIF -->
    <div
      v-if="isFullscreen"
      class="p-4 rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 flex flex-col items-center justify-center text-center gap-2"
      :class="height"
    >
      <MapPin :size="24" class="text-primary animate-bounce" />
      <p class="text-xs font-semibold text-gray-700">La carte est actuellement ouverte en plein écran</p>
      <button
        type="button"
        @click="toggleFullscreen"
        class="px-3 py-1 bg-white border border-gray-300 text-xs font-medium rounded-lg text-gray-700 hover:bg-gray-50 shadow-2xs cursor-pointer"
      >
        Réduire la carte
      </button>
    </div>

    <!-- CONTENEUR DU SÉLECTEUR CARTOGRAPHIQUE (TÉLÉPORTÉ AU BODY EN PLEIN ÉCRAN) -->
    <Teleport to="body" :disabled="!isFullscreen">
      <div
        class="flex flex-col gap-2 w-full transition-all duration-200"
        :class="isFullscreen ? '!fixed !inset-0 !z-[100005] !w-screen !h-screen !bg-white !p-4 sm:!p-6 !m-0 !overflow-hidden !flex !flex-col !shadow-2xl' : ''"
      >
        <!-- EN-TÊTE SPÉCIFIQUE DU MODE PLEIN ÉCRAN -->
        <div
          v-if="isFullscreen"
          class="flex items-center justify-between pb-3 border-b border-gray-200 mb-1 shrink-0"
        >
          <div class="flex items-center gap-2.5">
            <div class="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
              <MapPin :size="20" />
            </div>
            <div>
              <h3 class="text-sm font-bold text-gray-900 flex items-center gap-2">
                <span>Sélecteur d'Emplacement Cartographique</span>
                <span class="text-[10px] font-semibold text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-full">
                  Plein Écran
                </span>
              </h3>
              <p class="text-xs text-gray-500">
                Cliquez n'importe où sur Madagascar pour pointer les coordonnées GPS et récupérer la localité.
              </p>
            </div>
          </div>

          <button
            type="button"
            @click="toggleFullscreen"
            class="px-3 py-1.5 rounded-lg border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-2xs transition"
            title="Quitter le mode plein écran (Échap)"
          >
            <Minimize2 :size="14" />
            <span>Quitter le plein écran (Échap)</span>
          </button>
        </div>

        <!-- BARRE DE RECHERCHE DE LIEU SUR LA CARTE + ACTIONS -->
        <div class="flex items-center gap-1.5 shrink-0">
          <div class="relative flex-1 min-w-0">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Rechercher une ville, commune, quartier..."
              class="w-full h-8 pl-7 pr-7 text-xs rounded-lg border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none bg-white transition"
              @keydown.enter.prevent="searchPlace"
            />
            <Search :size="13" class="absolute left-2.5 top-2.5 text-gray-400" />
            <button
              v-if="searchQuery"
              type="button"
              @click="searchQuery = ''"
              class="absolute right-2 top-2 text-gray-400 hover:text-gray-600"
            >
              <X :size="12" />
            </button>
          </div>

          <button
            type="button"
            @click="searchPlace"
            :disabled="isSearching || !searchQuery.trim()"
            class="h-8 px-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1 transition disabled:opacity-50 cursor-pointer shrink-0"
          >
            <Loader2 v-if="isSearching" :size="12" class="animate-spin" />
            <span v-else>Chercher</span>
          </button>

          <button
            v-if="hasCoords"
            type="button"
            @click="clearCoords"
            title="Effacer la position"
            class="h-8 px-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 border border-gray-200 transition shrink-0 cursor-pointer"
          >
            <Trash2 :size="12" />
          </button>

          <!-- BOUTON PLEIN ÉCRAN -->
          <button
            type="button"
            @click="toggleFullscreen"
            :title="isFullscreen ? 'Quitter le plein écran (Échap)' : 'Agrandir la carte en plein écran'"
            class="h-8 px-2.5 rounded-lg border transition shrink-0 flex items-center gap-1 text-xs cursor-pointer font-medium"
            :class="isFullscreen ? 'bg-red-50 border-red-200 text-red-700 hover:bg-red-100' : 'bg-slate-100 border-gray-200 text-slate-700 hover:bg-slate-200'"
          >
            <component :is="isFullscreen ? Minimize2 : Maximize2" :size="13" />
            <span>{{ isFullscreen ? 'Réduire' : 'Plein écran' }}</span>
          </button>
        </div>

        <!-- BOUTONS DE SAUT RAPIDE PAR PROVINCE / VILLE PRINCIPALE -->
        <div class="flex items-center gap-1 overflow-x-auto pb-0.5 scrollbar-none text-[10px] shrink-0">
          <span class="text-gray-400 shrink-0 font-medium">Aller à :</span>
          <button
            v-for="hub in mainHubs"
            :key="hub.name"
            type="button"
            @click="jumpToHub(hub)"
            class="px-1.5 py-0.5 rounded bg-gray-100 hover:bg-primary/10 hover:text-primary text-gray-600 transition shrink-0 font-medium cursor-pointer"
          >
            {{ hub.name }}
          </button>
        </div>

        <!-- CONTENEUR CARTE LEAFLET INTERACTIVE -->
        <div
          class="relative w-full rounded-xl border border-gray-300 overflow-hidden shadow-2xs select-none"
          :class="isFullscreen ? 'flex-1 min-h-0' : height"
        >
          <LMap
            ref="lMapRef"
            v-model:zoom="mapZoom"
            v-model:center="mapCenter"
            :use-global-leaflet="false"
            class="w-full h-full z-0 cursor-crosshair"
            @ready="onMapReady"
            @click="onMapClick"
          >
            <!-- FOND DE CARTE OPENSTREETMAP -->
            <LTileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              layer-type="base"
              name="OpenStreetMap"
              :max-zoom="19"
              attribution="&copy; OpenStreetMap"
            />

            <!-- POINT SÉLECTIONNÉ (MARKER PIN) -->
            <template v-if="hasCoords">
              <LCircleMarker
                :lat-lng="[effectiveLat, effectiveLng]"
                :radius="10"
                color="#0F9D58"
                fill-color="#10B981"
                :fill-opacity="0.95"
                :weight="3"
              >
                <LTooltip :options="{ permanent: true, direction: 'top', offset: [0, -10] }">
                  <div class="text-[10px] font-bold text-gray-900 flex items-center gap-1">
                    <span>📍</span>
                    <span>{{ effectiveLat.toFixed(5) }}, {{ effectiveLng.toFixed(5) }}</span>
                  </div>
                </LTooltip>
              </LCircleMarker>

              <!-- Halo d'animation ou périmètre indicatif -->
              <LCircleMarker
                :lat-lng="[effectiveLat, effectiveLng]"
                :radius="20"
                color="#0F9D58"
                fill-color="#0F9D58"
                :fill-opacity="0.15"
                :weight="1"
              />
            </template>
          </LMap>

          <!-- INDICATION AU DÉMARRAGE -->
          <div
            v-if="!hasCoords"
            class="absolute bottom-2 left-2 right-2 z-[400] bg-black/75 text-white text-[10px] py-1 px-2.5 rounded-lg text-center backdrop-blur-xs pointer-events-none"
          >
            🎯 Cliquez n'importe où sur la carte de Madagascar pour positionner le site
          </div>

          <!-- SPINNER PENDANT LE GÉOCODAGE INVERSE -->
          <div
            v-if="isGeocoding"
            class="absolute top-2 right-2 z-[400] bg-white/95 border border-primary/30 text-primary px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1.5 shadow-md backdrop-blur-xs"
          >
            <Loader2 :size="12" class="animate-spin" />
            <span>Récupération des données...</span>
          </div>
        </div>

        <!-- FEEDBACK DES DONNÉES RÉCUPÉRÉES -->
        <div
          v-if="feedbackMsg"
          class="p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] flex items-start gap-1.5 animate-in fade-in shrink-0"
        >
          <CheckCircle2 :size="14" class="text-emerald-600 shrink-0 mt-0.5" />
          <div class="min-w-0 flex-1">
            <span class="font-bold">Données récupérées automatiquement :</span>
            <span class="block text-[10px] text-emerald-700 mt-0.5">{{ feedbackMsg }}</span>
          </div>
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
  LTooltip,
} from "@vue-leaflet/vue-leaflet";
import { CheckCircle2, Loader2, MapPin, Maximize2, Minimize2, Search, Trash2, X } from "@lucide/vue";
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";

interface Props {
  latitude?: number | null;
  longitude?: number | null;
  locality?: string;
  province?: string;
  height?: string;
}

const props = withDefaults(defineProps<Props>(), {
  latitude: null,
  longitude: null,
  locality: "",
  province: "",
  height: "h-[280px]",
});

const emit = defineEmits<{
  (e: "update:latitude", val: number | null): void;
  (e: "update:longitude", val: number | null): void;
  (e: "locationDetected", data: {
    locality: string;
    province: string;
    dms: string;
    displayName: string;
    lat: number;
    lng: number;
  }): void;
}>();

// Coordonnées par défaut : Antananarivo, Madagascar
const defaultCenter: [number, number] = [-18.8792, 47.5079];
const mapCenter = ref<[number, number]>([...defaultCenter]);
const mapZoom = ref<number>(12);
const lMapRef = ref<any>(null);
let leafletMap: any = null;

const searchQuery = ref("");
const isSearching = ref(false);
const isGeocoding = ref(false);
const feedbackMsg = ref("");
const isFullscreen = ref(false);

function refreshMapSize() {
  if (leafletMap && typeof leafletMap.invalidateSize === "function") {
    try {
      leafletMap.invalidateSize({ animate: false });
    } catch {}
  }
}

function triggerStaggeredRefresh() {
  nextTick(() => {
    refreshMapSize();
    [50, 150, 300, 500].forEach((delay) => {
      setTimeout(() => {
        refreshMapSize();
      }, delay);
    });
  });
}

function toggleFullscreen() {
  isFullscreen.value = !isFullscreen.value;
  triggerStaggeredRefresh();
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === "Escape" && isFullscreen.value) {
    isFullscreen.value = false;
    triggerStaggeredRefresh();
  }
}

onMounted(() => {
  window.addEventListener("keydown", onKeydown);
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", onKeydown);
});

// Villes & carrefours clés de Madagascar pour navigation rapide
const mainHubs = [
  { name: "Tana", lat: -18.8792, lng: 47.5079, zoom: 13 },
  { name: "Tamatave", lat: -18.1492, lng: 49.4023, zoom: 13 },
  { name: "Majunga", lat: -15.7167, lng: 46.3167, zoom: 13 },
  { name: "Antsirabe", lat: -19.8659, lng: 47.0333, zoom: 13 },
  { name: "Fianar", lat: -21.4536, lng: 47.0858, zoom: 13 },
  { name: "Tuléar", lat: -23.3500, lng: 43.6667, zoom: 13 },
  { name: "Diégo", lat: -12.2833, lng: 49.2833, zoom: 13 },
  { name: "Sambava", lat: -14.2667, lng: 50.1667, zoom: 13 },
];

const hasCoords = computed(() => {
  return (
    props.latitude !== null &&
    props.latitude !== undefined &&
    props.longitude !== null &&
    props.longitude !== undefined &&
    !isNaN(Number(props.latitude)) &&
    !isNaN(Number(props.longitude))
  );
});

const effectiveLat = computed(() => Number(props.latitude) || defaultCenter[0]);
const effectiveLng = computed(() => Number(props.longitude) || defaultCenter[1]);

// Initialiser le centre de la carte selon les coordonnées reçues
watch(
  () => [props.latitude, props.longitude],
  ([lat, lng]) => {
    if (lat !== null && lng !== null && !isNaN(Number(lat)) && !isNaN(Number(lng))) {
      mapCenter.value = [Number(lat), Number(lng)];
      if (leafletMap) {
        leafletMap.setView([Number(lat), Number(lng)], Math.max(mapZoom.value, 13));
      }
    }
  },
  { immediate: true }
);

function onMapReady(map: any) {
  leafletMap = map;
  nextTick(() => {
    setTimeout(() => {
      try {
        map.invalidateSize({ animate: false });
        if (hasCoords.value) {
          map.setView([effectiveLat.value, effectiveLng.value], Math.max(mapZoom.value, 13));
        }
      } catch {}
    }, 150);
  });
}

function jumpToHub(hub: { name: string; lat: number; lng: number; zoom: number }) {
  mapCenter.value = [hub.lat, hub.lng];
  mapZoom.value = hub.zoom;
  if (leafletMap) {
    leafletMap.setView([hub.lat, hub.lng], hub.zoom, { animate: true });
  }
}

// Clic utilisateur sur la carte pour poser le repère
async function onMapClick(e: any) {
  if (!e?.latlng) return;
  const lat = Number(e.latlng.lat);
  const lng = Number(e.latlng.lng);

  emit("update:latitude", Number(lat.toFixed(6)));
  emit("update:longitude", Number(lng.toFixed(6)));

  await reverseGeocode(lat, lng);
}

// Conversion de coordonnées décimales en DMS (Degrés Minutes Secondes)
function convertToDms(lat: number, lng: number): string {
  function toDms(val: number, isLat: boolean): string {
    const dir = isLat ? (val >= 0 ? "N" : "S") : val >= 0 ? "E" : "W";
    const absVal = Math.abs(val);
    const deg = Math.floor(absVal);
    const minFloat = (absVal - deg) * 60;
    const min = Math.floor(minFloat);
    const sec = Math.round((minFloat - min) * 60);
    return `${deg}°${min}'${sec}''${dir}`;
  }
  return `${toDms(lat, true)} ${toDms(lng, false)}`;
}

// Détection de la province de Madagascar à partir des attributs retournés
function detectProvince(text: string): string {
  const upper = text.toUpperCase();
  if (
    upper.includes("ANTANANARIVO") ||
    upper.includes("ANALAMANGA") ||
    upper.includes("VAKINANKARATRA") ||
    upper.includes("ITASY") ||
    upper.includes("BONGOLAVA")
  ) {
    return "ANTANANARIVO";
  }
  if (
    upper.includes("TOAMASINA") ||
    upper.includes("TAMATAVE") ||
    upper.includes("ATSINANANA") ||
    upper.includes("ANALANJIROFO") ||
    upper.includes("ALAOTRA")
  ) {
    return "TOAMASINA";
  }
  if (
    upper.includes("MAHAJANGA") ||
    upper.includes("MAJUNGA") ||
    upper.includes("BOENY") ||
    upper.includes("SOFIA") ||
    upper.includes("BETSIBOKA") ||
    upper.includes("MELAKY")
  ) {
    return "MAHAJANGA";
  }
  if (
    upper.includes("FIANARANTSOA") ||
    upper.includes("HAUTE MATSIATRA") ||
    upper.includes("VATOVAVY") ||
    upper.includes("FITOVINANY") ||
    upper.includes("IHOROMBE") ||
    upper.includes("AMORON")
  ) {
    return "FIANARANTSOA";
  }
  if (
    upper.includes("TOLIARA") ||
    upper.includes("TULEAR") ||
    upper.includes("ATSIMO-ANDREFANA") ||
    upper.includes("ANDROY") ||
    upper.includes("ANOSY") ||
    upper.includes("MENABE")
  ) {
    return "TOLIARA";
  }
  if (
    upper.includes("ANTSIRANANA") ||
    upper.includes("DIEGO") ||
    upper.includes("DIANA") ||
    upper.includes("SAVA")
  ) {
    return "ANTSIRANANA";
  }
  return "";
}

// Géocodage inverse via OpenStreetMap Nominatim
async function reverseGeocode(lat: number, lng: number) {
  isGeocoding.value = true;
  feedbackMsg.value = "";
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`;
    const res = await fetch(url, {
      headers: { "Accept-Language": "fr,en" },
    });
    if (!res.ok) throw new Error("Geocoding failed");
    const data = await res.json();

    let detectedLocality = "";
    let detectedProvince = "";
    const dms = convertToDms(lat, lng);

    if (data && data.address) {
      const addr = data.address;
      const parts = [
        addr.suburb || addr.neighbourhood || addr.quarter || addr.village || addr.hamlet,
        addr.city || addr.town || addr.municipality || addr.county,
      ].filter(Boolean);

      detectedLocality =
        parts.length > 0
          ? parts.join(", ")
          : (data.display_name ? data.display_name.split(",").slice(0, 2).join(",") : "");

      const fullText = `${addr.state || ""} ${addr.region || ""} ${addr.county || ""} ${data.display_name || ""}`;
      detectedProvince = detectProvince(fullText);
    }

    emit("locationDetected", {
      locality: detectedLocality.trim(),
      province: detectedProvince,
      dms,
      displayName: data?.display_name || "",
      lat,
      lng,
    });

    feedbackMsg.value = `${detectedLocality || "Position définie"} • ${
      detectedProvince || "Madagascar"
    } [${dms}]`;
  } catch (err) {
    // Calcul au moins le DMS si Nominatim est inaccessible
    const dms = convertToDms(lat, lng);
    emit("locationDetected", {
      locality: "",
      province: "",
      dms,
      displayName: "",
      lat,
      lng,
    });
    feedbackMsg.value = `Position : ${lat.toFixed(5)}, ${lng.toFixed(5)} [${dms}]`;
  } finally {
    isGeocoding.value = false;
  }
}

// Recherche textuelle d'un lieu à Madagascar
async function searchPlace() {
  const query = searchQuery.value.trim();
  if (!query) return;

  isSearching.value = true;
  feedbackMsg.value = "";
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      query
    )}&countrycodes=mg&limit=5`;
    const res = await fetch(url, { headers: { "Accept-Language": "fr,en" } });
    const results = await res.json();

    if (results && results.length > 0) {
      const item = results[0];
      const lat = parseFloat(item.lat);
      const lng = parseFloat(item.lon);

      mapCenter.value = [lat, lng];
      mapZoom.value = 14;
      if (leafletMap) {
        leafletMap.setView([lat, lng], 14, { animate: true });
      }

      emit("update:latitude", Number(lat.toFixed(6)));
      emit("update:longitude", Number(lng.toFixed(6)));

      await reverseGeocode(lat, lng);
    } else {
      feedbackMsg.value = `Aucun résultat trouvé pour "${query}" à Madagascar.`;
    }
  } catch (err) {
    feedbackMsg.value = "Erreur réseau lors de la recherche du lieu.";
  } finally {
    isSearching.value = false;
  }
}

function clearCoords() {
  emit("update:latitude", null);
  emit("update:longitude", null);
  feedbackMsg.value = "";
}
</script>

<style scoped>
/* Supprimer les outlines bleus par défaut sur la carte Leaflet */
:deep(.leaflet-container:focus) {
  outline: none;
}
</style>
