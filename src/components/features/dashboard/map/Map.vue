<template>
  <div
    class="rounded-3xl bg-white p-5 shadow-sm transition-all"
    :class="show_fullscreen ? 'fixed inset-0 z-[9999] w-screen h-screen rounded-none p-4 md:p-6 flex flex-col bg-white' : ''"
  >
    <div class="mb-3 flex items-center justify-between shrink-0 flex-wrap gap-2">
      <div class="flex items-center gap-2">
        <h3 class="font-bold text-gray-800 text-sm md:text-base flex items-center gap-2">
          <span>Cartographie des inspections & checklists</span>
          <span
            v-if="show_fullscreen"
            class="text-xs font-semibold text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-full"
          >
            Mode Plein Écran
          </span>
        </h3>
        <span class="text-xs text-gray-400 font-normal">({{ filteredSites.length }} sites géolocalisés)</span>
      </div>

      <!-- Filtres et bouton plein écran -->
      <div class="flex items-center gap-2">
        <select
          v-if="provinces.length"
          v-model="selectedProvince"
          class="text-xs border border-gray-200 rounded-lg px-2.5 py-1 bg-white outline-none focus:border-primary text-gray-700"
        >
          <option value="ALL">Toutes provinces ({{ sites.length }})</option>
          <option v-for="prov in provinces" :key="prov" :value="prov">{{ prov }}</option>
        </select>

        <!-- Filtre Statut -->
        <select
          v-model="selectedStatus"
          class="text-xs border border-gray-200 rounded-lg px-2.5 py-1 bg-white outline-none focus:border-primary text-gray-700 font-medium"
        >
          <option value="ALL">Tous les statuts</option>
          <option value="green">🟢 Conforme (≥ 90%)</option>
          <option value="yellow">🟡 Contrôle requis (&lt; 90%)</option>
          <option value="red">🔴 Anomalie (&lt; 70%)</option>
          <option value="COMPLETED">✅ Inspection Clôturée</option>
          <option value="IN_PROGRESS">🔄 Inspection En cours</option>
          <option value="DRAFT">📅 Inspection Planifiée</option>
        </select>

        <button
          type="button"
          @click="toggleFullscreen"
          class="inline-flex items-center gap-1.5 border rounded-lg px-3 py-1 text-xs font-semibold transition cursor-pointer shadow-xs select-none"
          :class="show_fullscreen ? 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100' : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200'"
          :title="show_fullscreen ? 'Quitter le plein écran (Échap)' : 'Afficher la carte en plein écran'"
        >
          <component :is="show_fullscreen ? Minimize2 : Fullscreen" :size="14" />
          <span>{{ show_fullscreen ? 'Quitter' : 'Plein écran' }}</span>
        </button>
      </div>
    </div>

    <div
      class="overflow-hidden rounded-2xl relative transition-all border border-gray-200"
      :class="show_fullscreen ? 'flex-1 w-full min-h-0' : 'h-[360px]'"
    >
      <div v-if="loading" class="absolute inset-0 bg-white/70 backdrop-blur-2xs z-[1000] flex flex-col items-center justify-center gap-2 text-gray-500">
        <Loader :size="24" class="animate-spin text-primary" />
        <span class="text-xs font-medium">Chargement de la cartographie des sites...</span>
      </div>

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

        <LCircleMarker
          v-for="site in filteredSites"
          :key="site.id"
          :lat-lng="[site.latitude, site.longitude]"
          :radius="8"
          :color="markerColor(site.status).stroke"
          :fill-color="markerColor(site.status).fill"
          :fill-opacity="0.85"
          :weight="2"
        >
          <!-- TOOLTIP AU SURVOL -->
          <LTooltip :options="{ direction: 'top', offset: [0, -8] }">
            <div class="text-xs font-semibold">
              <p class="font-bold text-gray-800">{{ site.name }}</p>
              <p class="text-gray-500 font-normal">{{ site.locality }} ({{ site.province }})</p>
              <p class="text-emerald-700 font-semibold">{{ site.conformity_rate }}% conforme • {{ site.total_checklists }} checklists</p>
            </div>
          </LTooltip>

          <!-- POPUP AU CLIC -->
          <LPopup :options="{ maxWidth: 300 }">
            <div class="text-xs space-y-2 p-1 min-w-[220px]">
              <div class="border-b border-gray-100 pb-1.5">
                <div class="flex items-center justify-between gap-2">
                  <h4 class="font-bold text-sm text-gray-900">{{ site.name }}</h4>
                  <span
                    class="px-2 py-0.5 rounded-full text-[10px] font-bold"
                    :class="badgeColor(site.status)"
                  >
                    {{ site.conformity_rate }}% conforme
                  </span>
                </div>
                <p class="text-[11px] text-gray-500 mt-0.5">📍 {{ site.locality }} ({{ site.province }})</p>
                <p v-if="site.dms" class="text-[10px] text-gray-400 font-mono">GPS : {{ site.dms }}</p>
              </div>

              <div class="space-y-1 bg-slate-50 p-2 rounded-lg border border-slate-100">
                <div class="flex justify-between items-center text-[11px]">
                  <span class="text-gray-500">Checklists totales :</span>
                  <span class="font-bold text-gray-800">{{ site.total_checklists }}</span>
                </div>
                <div class="flex justify-between items-center text-[11px]">
                  <span class="text-gray-500">Clôturées :</span>
                  <span class="font-semibold text-emerald-600">{{ site.completed_checklists }}</span>
                </div>
                <div v-if="site.last_checklist_date" class="text-[10px] text-gray-500 border-t border-slate-200/60 pt-1 mt-1">
                  Dernier contrôle : <b>{{ site.last_checklist_date }}</b>
                  <p v-if="site.last_checklist_title" class="truncate font-medium text-gray-700">{{ site.last_checklist_title }}</p>
                </div>
                <div v-else class="text-[10px] text-amber-600 italic">
                  Aucun contrôle enregistré sur ce site
                </div>
              </div>

              <!-- Contacts d'urgence -->
              <div v-if="site.emergency_contacts && site.emergency_contacts.length" class="text-[10px] text-gray-600">
                <span class="font-bold text-gray-700">🚨 Secours proches :</span>
                <span class="truncate block">{{ site.emergency_contacts[0].name }} ({{ site.emergency_contacts[0].phone || 'N/A' }})</span>
              </div>

              <!-- Bouton redirection -->
              <button
                type="button"
                @click="goToChecklists(site)"
                class="w-full mt-1.5 py-1 px-2.5 bg-primary text-white text-[11px] font-bold rounded-lg hover:bg-primary/90 transition cursor-pointer flex items-center justify-center gap-1 shadow-2xs"
              >
                <span>Consulter les checklists</span>
                <ArrowUpRight :size="12" />
              </button>
            </div>
          </LPopup>
        </LCircleMarker>
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
import { Fullscreen, Minimize2, Loader, ArrowUpRight } from "@lucide/vue";
import { computed, nextTick, onMounted, onUnmounted, ref } from "vue";
import { useRouter } from "vue-router";
import dashboardService from "../../../../core/services/dashboard.service";

const router = useRouter();
const loading = ref(true);
const show_fullscreen = ref(false);
const leafletMap = ref<any>(null);
const sites = ref<any[]>([]);
const center = ref<[number, number]>([-18.8792, 47.5079]);
const selectedProvince = ref<string>("ALL");
const selectedStatus = ref<string>("ALL");

const provinces = computed(() => {
  const set = new Set<string>();
  sites.value.forEach(s => {
    if (s.province) set.add(s.province);
  });
  return Array.from(set).sort();
});

const filteredSites = computed(() => {
  return sites.value.filter(s => {
    if (selectedProvince.value !== "ALL" && s.province !== selectedProvince.value) {
      return false;
    }
    if (selectedStatus.value !== "ALL") {
      if (['green', 'yellow', 'red'].includes(selectedStatus.value)) {
        if (s.status !== selectedStatus.value) return false;
      } else {
        if (s.last_checklist_status !== selectedStatus.value) return false;
      }
    }
    return Boolean(s.latitude && s.longitude);
  });
});

function onMapReady(map: any) {
  leafletMap.value = map;
}

function markerColor(status: string) {
  if (status === 'red') {
    return { stroke: '#B91C1C', fill: '#EF4444' };
  }
  if (status === 'yellow') {
    return { stroke: '#D97706', fill: '#F59E0B' };
  }
  return { stroke: '#047857', fill: '#10B981' };
}

function badgeColor(status: string) {
  if (status === 'red') return 'bg-red-100 text-red-800';
  if (status === 'yellow') return 'bg-amber-100 text-amber-800';
  return 'bg-emerald-100 text-emerald-800';
}

function goToChecklists(site: any) {
  if (show_fullscreen.value) {
    show_fullscreen.value = false;
  }
  router.push({
    name: 'CHECKLIST',
    query: { site: site.name }
  });
}

function toggleFullscreen() {
  show_fullscreen.value = !show_fullscreen.value;
  nextTick(() => {
    setTimeout(() => {
      if (leafletMap.value) leafletMap.value.invalidateSize();
    }, 150);
    setTimeout(() => {
      if (leafletMap.value) leafletMap.value.invalidateSize();
    }, 350);
  });
}

function onKeyDown(e: KeyboardEvent) {
  if (e.key === 'Escape' && show_fullscreen.value) {
    toggleFullscreen();
  }
}

async function loadSites() {
  loading.value = true;
  try {
    const res = await dashboardService.getInspectionMapData();
    if (res?.data && Array.isArray(res.data)) {
      sites.value = res.data;
    }
  } catch (err) {
    console.error("Erreur chargement carte inspection:", err);
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  window.addEventListener('keydown', onKeyDown);
  loadSites();
});

onUnmounted(() => {
  window.removeEventListener('keydown', onKeyDown);
});
</script>