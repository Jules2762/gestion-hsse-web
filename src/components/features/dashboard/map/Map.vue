<script setup lang="ts">
import "leaflet/dist/leaflet.css";

import {
  LMap,
  LMarker,
  LPopup,
  LTileLayer,
} from "@vue-leaflet/vue-leaflet";

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
        h-[500px]
        overflow-hidden
        rounded-2xl
      "
    >
      <LMap
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