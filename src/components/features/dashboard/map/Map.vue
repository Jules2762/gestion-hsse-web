<script setup lang="ts">
import "leaflet/dist/leaflet.css";

import {
  LMap,
  LMarker,
  LPopup,
  LTileLayer,
} from "@vue-leaflet/vue-leaflet";
import { Fullscreen, X } from "@lucide/vue";
import { ref } from "vue";
  const show_fullscreen=ref(false)
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
]

const center = [-18.8792, 47.5079];
</script>

<template>
  <div
    class="
      rounded-3xl
      bg-white
      
      p-6
      shadow-sm
    "
  >
  
    <div
      class="
        mb-4
        flex
        items-center
        justify-between
      "
    >
      <h3>
        Performance des sites
      </h3>

     
    </div>

    <div
      class="

        
        overflow-hidden
        rounded-2xl
      "
      :class="show_fullscreen?'fixed top-0 left-0 right-0 h-full w-full ':'h-125 relative'"
    >
    <button class="absolute top-4 right-4 z-500 bg-white p-1 rounded border border-gray-400" @click="show_fullscreen=!show_fullscreen">
    <Fullscreen v-if="!show_fullscreen"/>
    <X v-else/>
  </button>
      <LMap class="z-0 w-full h-full"
        :zoom="6"
        :center="center"
       
      >
        <LTileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          
        />

        <LMarker
          v-for="site in sites"
          :key="site.name"
          :lat-lng="[site.lat, site.lng]"
          attribution="Galana Distribution Petrolière"
        >
          <LPopup>
            <div class="space-y-2">
              <h4>
                {{ site.name }}
              </h4>

              <p>
                Conformité :
                <b>
                  {{ site.conformity }}%
                </b>
              </p>

              <p>
                Inspections :
                <b>
                  {{ site.inspections }}
                </b>
              </p>

              <p>
                Non-conformités :
                <b>
                  {{ site.nonConformities }}
                </b>
              </p>
            </div>
          </LPopup>
        </LMarker>
      </LMap>
    </div>
  </div>
</template>