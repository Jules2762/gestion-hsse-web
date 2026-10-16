<script setup lang="ts">
import "leaflet/dist/leaflet.css";

import {
  LMap,
  LMarker,
  LPopup,
  LTileLayer,
} from "@vue-leaflet/vue-leaflet";
import { Fullscreen, Minimize2 } from "@lucide/vue";
import { nextTick, onMounted, onUnmounted, ref } from "vue";

const show_fullscreen = ref(false);
const leafletMap = ref<any>(null);

const sites = [
  {
    name: 'Antananarivo',
    lat: -18.8792,
    lng: 47.5079,
    conformity: 92,
    inspections: 28,
    nonConformities: 3,
  },
  {
    name: 'Toamasina',
    lat: -18.1492,
    lng: 49.4023,
    conformity: 84,
    inspections: 17,
    nonConformities: 7,
  },
  {
    name: 'Mahajanga',
    lat: -15.7167,
    lng: 46.3167,
    conformity: 96,
    inspections: 12,
    nonConformities: 1,
  },
  {
    name: 'Antsirabe',
    lat: -19.8658,
    lng: 47.0335,
    conformity: 89,
    inspections: 9,
    nonConformities: 2,
  },
];

const center = [-18.8792, 47.5079];

function onMapReady(map: any) {
  leafletMap.value = map;
}

function toggleFullscreen() {
  show_fullscreen.value = !show_fullscreen.value;
  nextTick(() => {
    setTimeout(() => {
      if (leafletMap.value) {
        leafletMap.value.invalidateSize();
      }
    }, 150);
    setTimeout(() => {
      if (leafletMap.value) {
        leafletMap.value.invalidateSize();
      }
    }, 350);
  });
}

function onKeyDown(e: KeyboardEvent) {
  if (e.key === 'Escape' && show_fullscreen.value) {
    toggleFullscreen();
  }
}

onMounted(() => {
  window.addEventListener('keydown', onKeyDown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', onKeyDown);
});
</script>

<template>
  <div
    class="rounded-3xl bg-white p-6 shadow-sm transition-all"
    :class="show_fullscreen ? 'fixed inset-0 z-[9999] w-screen h-screen rounded-none p-4 md:p-6 flex flex-col bg-white' : ''"
  >
    <div class="mb-4 flex items-center justify-between shrink-0">
      <div class="flex items-center gap-2">
        <h3 class="font-bold text-gray-800 text-sm md:text-base flex items-center gap-2">
          Performance des sites
          <span
            v-if="show_fullscreen"
            class="text-xs font-semibold text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-full"
          >
            Mode Plein Écran
          </span>
        </h3>
      </div>

      <!-- Bouton Plein Écran En-tête -->
      <button
        type="button"
        @click="toggleFullscreen"
        class="inline-flex items-center gap-1.5 border rounded-lg px-3 py-1.5 text-xs font-semibold transition cursor-pointer shadow-xs select-none"
        :class="show_fullscreen ? 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100' : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200'"
        :title="show_fullscreen ? 'Quitter le plein écran (Échap)' : 'Afficher la carte en plein écran'"
      >
        <component :is="show_fullscreen ? Minimize2 : Fullscreen" :size="15" />
        <span>{{ show_fullscreen ? 'Quitter le plein écran' : 'Plein écran' }}</span>
        <span v-if="show_fullscreen" class="hidden sm:inline text-[10px] bg-red-200/60 px-1 py-0.5 rounded font-mono">Échap</span>
      </button>
    </div>

    <div
      class="overflow-hidden rounded-2xl relative transition-all border border-gray-200"
      :class="show_fullscreen ? 'flex-1 w-full min-h-0' : 'h-125'"
    >
      <!-- Bouton Flottant sur la Carte -->
      <button
        type="button"
        @click="toggleFullscreen"
        class="absolute top-3 right-3 z-[1000] bg-white/95 hover:bg-white text-gray-700 shadow-md border border-gray-300 rounded-lg px-2.5 py-1.5 flex items-center gap-1.5 text-xs font-semibold cursor-pointer transition hover:scale-105 select-none"
        :title="show_fullscreen ? 'Quitter le plein écran (Échap)' : 'Plein écran'"
      >
        <component :is="show_fullscreen ? Minimize2 : Fullscreen" :size="15" class="text-primary" />
        <span>{{ show_fullscreen ? 'Réduire' : 'Plein écran' }}</span>
      </button>

      <LMap
        class="z-0 w-full h-full"
        :zoom="6"
        :center="center"
        @ready="onMapReady"
      >
        <LTileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap & Galana Distribution Pétrolière"
        />

        <LMarker
          v-for="site in sites"
          :key="site.name"
          :lat-lng="[site.lat, site.lng]"
        >
          <LPopup>
            <div class="space-y-2 text-xs">
              <h4 class="font-bold text-sm text-gray-900">
                {{ site.name }}
              </h4>

              <p>
                Conformité :
                <b class="text-emerald-700">{{ site.conformity }}%</b>
              </p>

              <p>
                Inspections :
                <b>{{ site.inspections }}</b>
              </p>

              <p>
                Non-conformités :
                <b class="text-red-700">{{ site.nonConformities }}</b>
              </p>
            </div>
          </LPopup>
        </LMarker>
      </LMap>
    </div>
  </div>
</template>