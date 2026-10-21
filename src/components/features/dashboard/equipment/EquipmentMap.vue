<template>
  <div
    class="bg-white rounded-xl border border-gray-200 p-5 shadow-xs flex flex-col gap-4 transition-all duration-200"
    :class="isFullscreen ? 'fixed inset-0 z-[9999] w-screen h-screen rounded-none p-4 md:p-6 overflow-hidden flex flex-col bg-white' : ''"
  >
    <!-- EN-TÊTE AVEC FILTRES ET STATISTIQUES -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-gray-100 shrink-0">
      <div>
        <div class="flex items-center gap-2">
          <MapPin :size="18" class="text-primary" />
          <h3 class="font-bold text-gray-800 text-sm md:text-base flex items-center gap-2">
            {{ locale === 'en' ? 'Station equipment mapping' : 'Cartographie des équipements par station' }}
            <span
              v-if="isFullscreen"
              class="text-xs font-semibold text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-full"
            >
              {{ locale === 'en' ? 'Fullscreen Mode' : 'Mode Plein Écran' }}
            </span>
          </h3>
        </div>
        <p class="text-xs text-gray-500">{{ locale === 'en' ? 'GPS geolocation of service stations and fleet compliance status' : 'Géolocalisation GPS des stations-service et état de conformité du parc matériel' }}</p>
      </div>

      <!-- FILTRES PAR PROVINCE ET ÉTAT + BOUTON FULLSCREEN -->
      <div class="flex flex-wrap items-center gap-2 text-xs">
        <!-- Filtre Province -->
        <select
          v-model="selectedProvince"
          class="border border-gray-200 rounded-lg px-2.5 py-1.5 bg-gray-50 font-medium text-gray-700 outline-none focus:border-primary"
        >
          <option value="ALL">{{ locale === 'en' ? 'All provinces' : 'Toutes les provinces' }} ({{ sites.length }})</option>
          <option v-for="prov in provinces" :key="prov" :value="prov">
            {{ prov }}
          </option>
        </select>

        <!-- Filtre Statut -->
        <select
          v-model="selectedStatus"
          class="border border-gray-200 rounded-lg px-2.5 py-1.5 bg-gray-50 font-medium text-gray-700 outline-none focus:border-primary"
        >
          <option value="ALL">{{ locale === 'en' ? 'All statuses' : 'Tous les statuts' }}</option>
          <option value="green">{{ locale === 'en' ? '🟢 100% Compliant' : '🟢 100% Conforme' }}</option>
          <option value="yellow">{{ locale === 'en' ? '🟡 Inspection needed' : '🟡 Contrôle à prévoir' }}</option>
          <option value="red">{{ locale === 'en' ? '🔴 Anomaly / Non-compliant' : '🔴 Anomalie / Non conforme' }}</option>
        </select>

        <!-- Bouton Plein Écran Principal -->
        <button
          type="button"
          @click="toggleFullscreen"
          class="inline-flex items-center gap-1.5 border rounded-lg px-3 py-1.5 font-medium transition cursor-pointer shadow-xs select-none"
          :class="isFullscreen ? 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100' : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200'"
          :title="isFullscreen ? (locale === 'en' ? 'Exit fullscreen (Esc)' : 'Quitter le plein écran (Échap)') : (locale === 'en' ? 'Show map in fullscreen' : 'Afficher la carte en plein écran')"
        >
          <component :is="isFullscreen ? Minimize2 : Maximize2" :size="15" />
          <span>{{ isFullscreen ? (locale === 'en' ? 'Exit fullscreen' : 'Quitter le plein écran') : (locale === 'en' ? 'Fullscreen' : 'Plein écran') }}</span>
          <span v-if="isFullscreen" class="hidden sm:inline text-[10px] bg-red-200/60 px-1 py-0.5 rounded font-mono">{{ locale === 'en' ? 'Esc' : 'Échap' }}</span>
        </button>
      </div>
    </div>

    <!-- BADGES RAPIDES DE SYNTHÈSE GÉOGRAPHIQUE -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs shrink-0">
      <div class="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
        <span class="text-slate-600 font-medium">{{ locale === 'en' ? 'Stations on map' : 'Stations sur la carte' }}</span>
        <span class="font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
          {{ filteredSites.length }} / {{ sites.length }}
        </span>
      </div>
      <div class="p-2.5 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-between">
        <span class="text-emerald-800 font-medium">{{ locale === 'en' ? '100% Compliant fleet' : 'Parc 100% conforme' }}</span>
        <span class="font-bold text-emerald-800 bg-white px-2 py-0.5 rounded border border-emerald-200">
          {{ sites.filter(s => s.status === 'green').length }}
        </span>
      </div>
      <div class="p-2.5 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-between">
        <span class="text-amber-800 font-medium">{{ locale === 'en' ? 'Inspections needed' : 'Contrôles à prévoir' }}</span>
        <span class="font-bold text-amber-800 bg-white px-2 py-0.5 rounded border border-amber-200">
          {{ sites.filter(s => s.status === 'yellow').length }}
        </span>
      </div>
      <div class="p-2.5 rounded-lg bg-red-50 border border-red-100 flex items-center justify-between">
        <span class="text-red-800 font-medium">{{ locale === 'en' ? 'Anomalies detected' : 'Anomalies détectées' }}</span>
        <span class="font-bold text-red-800 bg-white px-2 py-0.5 rounded border border-red-200">
          {{ sites.filter(s => s.status === 'red').length }}
        </span>
      </div>
    </div>

    <!-- CONTENEUR CARTE LEAFLET -->
    <div
      class="rounded-xl overflow-hidden border border-gray-200 relative transition-all"
      :class="isFullscreen ? 'flex-1 w-full min-h-0' : 'h-[440px] w-full'"
    >
      <!-- BOUTON FLOTTANT SUR LA CARTE -->
      <button
        type="button"
        @click="toggleFullscreen"
        class="absolute top-3 right-3 z-[1000] bg-white/95 hover:bg-white text-gray-700 shadow-md border border-gray-300 rounded-lg px-2.5 py-1.5 flex items-center gap-1.5 text-xs font-semibold cursor-pointer transition hover:scale-105 select-none"
        :title="isFullscreen ? (locale === 'en' ? 'Exit fullscreen (Esc)' : 'Quitter le plein écran (Échap)') : (locale === 'en' ? 'Show map in fullscreen' : 'Afficher la carte en plein écran')"
      >
        <component :is="isFullscreen ? Minimize2 : Maximize2" :size="15" class="text-primary" />
        <span>{{ isFullscreen ? (locale === 'en' ? 'Collapse' : 'Réduire') : (locale === 'en' ? 'Fullscreen' : 'Plein écran') }}</span>
      </button>

      <DashboardSkeleton v-if="loading" type="chart" :height="440" />

      <LMap
        v-else
        :zoom="zoom"
        :center="center"
        class="h-full w-full z-0"
        @ready="onMapReady"
      >
        <LTileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap & Galana Distribution Pétrolière"
        />

        <!-- MARQUEURS PAR STATION -->
        <LCircleMarker
          v-for="site in filteredSites"
          :key="site.id"
          :lat-lng="[site.latitude, site.longitude]"
          :radius="9"
          :color="markerColor(site.status).stroke"
          :fill-color="markerColor(site.status).fill"
          :fill-opacity="0.85"
          :weight="2"
        >
          <!-- TOOLTIP AU SURVOL -->
          <LTooltip :options="{ direction: 'top', offset: [0, -8] }">
            <div class="text-xs font-semibold">
              <p class="font-bold text-gray-800">{{ formatStationName(site.name) }}</p>
              <p class="text-gray-500 font-normal">{{ site.locality }}</p>
              <p class="text-emerald-700 font-semibold">{{ site.conformity_rate }}% {{ locale === 'en' ? 'compliant' : 'conforme' }}</p>
            </div>
          </LTooltip>

          <!-- POPUP AU CLIC -->
          <LPopup :options="{ maxWidth: 320 }">
            <div class="text-xs space-y-2.5 p-1 min-w-[240px]">
              <!-- En-tête station -->
              <div class="border-b border-gray-100 pb-2">
                <div class="flex items-center justify-between gap-2">
                  <h4 class="font-bold text-sm text-gray-900 leading-tight">{{ formatStationName(site.name) }}</h4>
                  <span
                    class="px-2 py-0.5 rounded-full text-[10px] font-bold inline-block"
                    :class="badgeColor(site.status)"
                  >
                    {{ site.conformity_rate }}% {{ locale === 'en' ? 'compliant' : 'conforme' }}
                  </span>
                </div>
                <p class="text-[11px] text-gray-500 mt-0.5">
                  📍 {{ site.locality }} ({{ site.province }})
                </p>
                <p v-if="site.dms" class="text-[10px] text-gray-400 font-mono">
                  GPS : {{ site.dms }}
                </p>
              </div>

              <!-- Synthèse des équipements -->
              <div class="space-y-1.5 bg-slate-50 p-2 rounded-lg border border-slate-100">
                <p class="font-semibold text-gray-700 text-[11px] flex items-center justify-between">
                  <span>{{ locale === 'en' ? 'Inspected equipment fleet:' : 'Parc matériel inspecté :' }}</span>
                  <span class="text-primary font-bold">{{ site.total_items || (site.total_extincteurs + site.total_bacs) }} {{ locale === 'en' ? 'units' : 'unités' }}</span>
                </p>
                <div class="flex items-center justify-between text-[10px] pb-1 border-b border-slate-200/60">
                  <span class="text-emerald-700 font-semibold">✓ {{ site.ok_items ?? site.total_items ?? 0 }} {{ locale === 'en' ? 'compliant' : 'conformes' }}</span>
                  <span :class="(site.anomaly_items || 0) > 0 ? 'text-red-600 font-bold' : 'text-gray-400'">
                    {{ (site.anomaly_items || 0) > 0 ? `⚠ ${site.anomaly_items} ${locale === 'en' ? 'anomaly(ies)' : 'anomalie(s)'}` : (locale === 'en' ? '0 anomaly' : '0 anomalie') }}
                  </span>
                </div>
                <div class="grid grid-cols-2 gap-1 text-[11px] pt-0.5">
                  <div>{{ locale === 'en' ? '• Extinguishers:' : '• Extincteurs :' }} <b>{{ site.total_extincteurs }}</b></div>
                  <div>{{ locale === 'en' ? '• Retentions:' : '• Bacs :' }} <b>{{ site.total_bacs }}</b></div>
                  <div class="text-gray-500 text-[10px]">P50: {{ site.counts?.p50 || 0 }} | P9: {{ site.counts?.p9 || 0 }}</div>
                  <div class="text-gray-500 text-[10px]">CO2: {{ site.counts?.co2 || 0 }} | P6: {{ site.counts?.p6 || 0 }}</div>
                </div>
              </div>

              <!-- Équipements détaillés si disponibles -->
              <div v-if="site.items && site.items.length" class="space-y-1">
                <p class="font-semibold text-gray-700 text-[11px]">{{ locale === 'en' ? 'Recent items inspected:' : 'Derniers items contrôlés :' }}</p>
                <div class="max-h-24 overflow-y-auto space-y-1 pr-1">
                  <div
                    v-for="it in site.items"
                    :key="it.id"
                    class="flex items-center justify-between p-1 rounded bg-white border border-gray-100 text-[10px]"
                  >
                    <span class="truncate max-w-[130px] font-medium text-gray-700">{{ it.name }} ({{ it.type }})</span>
                    <span
                      class="px-1.5 py-0.5 rounded font-semibold text-[9px]"
                      :class="it.conformity ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'"
                    >
                      {{ it.conformity ? (locale === 'en' ? 'Compliant' : 'Conforme') : (locale === 'en' ? 'Non-compliant' : 'Non conforme') }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Secours d'urgence proches -->
              <div v-if="site.emergency_contacts && site.emergency_contacts.length" class="border-t border-gray-100 pt-2">
                <p class="font-semibold text-gray-700 text-[11px] mb-1">🚨 {{ locale === 'en' ? 'Nearby emergency services:' : 'Secours d\'urgence proches :' }}</p>
                <div class="space-y-1 max-h-20 overflow-y-auto">
                  <div
                    v-for="c in site.emergency_contacts"
                    :key="c.id"
                    class="flex items-center justify-between text-[10px] text-gray-600 bg-gray-50 p-1 rounded"
                  >
                    <span class="truncate max-w-[140px] font-medium">{{ c.name }}</span>
                    <a
                      v-if="c.phone"
                      :href="`tel:${c.phone}`"
                      class="text-primary font-bold hover:underline"
                    >
                      📞 {{ c.phone }}
                    </a>
                  </div>
                </div>
              </div>

              <!-- Date dernier contrôle + Bouton de redirection vers les détails -->
              <div class="pt-2 border-t border-gray-100 flex flex-col gap-1.5">
                <div class="flex items-center justify-between text-[10px] text-gray-400">
                  <span>{{ locale === 'en' ? 'Last inspection:' : 'Dernier contrôle :' }}</span>
                  <span class="font-medium text-gray-600">{{ site.last_monitoring_date || 'N/A' }}</span>
                </div>

                <button
                  type="button"
                  @click="goToMonitoringDetails(site)"
                  class="w-full mt-1 py-1.5 px-3 rounded-lg bg-primary hover:bg-primary/90 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-sm transition active:scale-[0.98] cursor-pointer"
                  :title="site.last_monitoring_id ? (locale === 'en' ? 'View detailed equipment monitoring' : 'Consulter le suivi détaillé des équipements') : (locale === 'en' ? 'Access monitoring registry for this site' : 'Accéder au registre des suivis pour ce site')"
                >
                  <Eye :size="13" />
                  <span>{{ site.last_monitoring_id ? (locale === 'en' ? 'View monitoring details' : 'Consulter les détails du suivi') : (locale === 'en' ? 'View site monitoring' : 'Voir le suivi du site') }}</span>
                  <ArrowUpRight :size="13" />
                </button>
              </div>
            </div>
          </LPopup>
        </LCircleMarker>
      </LMap>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import 'leaflet/dist/leaflet.css';
import { LMap, LTileLayer, LCircleMarker, LPopup, LTooltip } from '@vue-leaflet/vue-leaflet';
import { ArrowUpRight, Eye, MapPin, Maximize2, Minimize2 } from '@lucide/vue';
import DashboardSkeleton from '../DashboardSkeleton.vue';
import dashboardService from '../../../../core/services/dashboard.service';

const { locale } = useI18n();

type SiteMapItem = {
  id: number;
  name: string;
  code?: string;
  locality: string;
  province: string;
  latitude: number;
  longitude: number;
  dms?: string;
  status: 'green' | 'yellow' | 'red';
  conformity_rate: number;
  last_monitoring_date?: string;
  last_monitoring_id?: string;
  last_monitoring_raw_id?: number;
  total_extincteurs: number;
  total_bacs: number;
  total_items?: number;
  ok_items?: number;
  anomaly_items?: number;
  counts?: {
    p50: number;
    p9: number;
    p6: number;
    co2: number;
    bac: number;
  };
  items?: Array<{
    id: number;
    type: string;
    name: string;
    conformity: boolean;
    value: any;
    location?: string;
  }>;
  emergency_contacts?: Array<{
    id: number;
    type: string;
    name: string;
    phone?: string;
  }>;
};

const router = useRouter();
const loading = ref(true);
const sites = ref<SiteMapItem[]>([]);
const center = ref<[number, number]>([-18.8792, 47.5079]);
const zoom = ref(6);
const isFullscreen = ref(false);
const leafletMap = ref<any>(null);

const selectedProvince = ref<string>('ALL');
const selectedStatus = ref<string>('ALL');

const provinces = computed(() => {
  const set = new Set<string>();
  sites.value.forEach(s => {
    if (s.province) set.add(s.province);
  });
  return Array.from(set).sort();
});

const filteredSites = computed(() => {
  return sites.value.filter(s => {
    if (selectedProvince.value !== 'ALL' && s.province !== selectedProvince.value) {
      return false;
    }
    if (selectedStatus.value !== 'ALL' && s.status !== selectedStatus.value) {
      return false;
    }
    return true;
  });
});

function formatStationName(name?: string) {
  if (!name) return '';
  const trimmed = name.trim();
  return trimmed.toUpperCase().startsWith('SS') ? trimmed : `SS ${trimmed}`;
}

function goToMonitoringDetails(site: SiteMapItem) {
  if (isFullscreen.value) {
    isFullscreen.value = false;
  }
  if (site.last_monitoring_id) {
    router.push({
      name: 'EQUIPMENT_MONITORING_DETAILS',
      params: { id: site.last_monitoring_id }
    });
  } else {
    router.push({
      name: 'EQUIPMENT_MONITORING',
      query: {
        site: site.name
      }
    });
  }
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

function onMapReady(map: any) {
  leafletMap.value = map;
}

function toggleFullscreen() {
  isFullscreen.value = !isFullscreen.value;
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
  if (e.key === 'Escape' && isFullscreen.value) {
    toggleFullscreen();
  }
}

const props = defineProps<{
  year?: number;
}>();

async function loadMapData(yearOverride?: number) {
  loading.value = true;
  try {
    const yr = yearOverride ?? props.year;
    const res = await dashboardService.getEquipmentMapData(yr ? { year: yr } : undefined);
    if (res?.data && Array.isArray(res.data)) {
      sites.value = res.data;
    }
  } catch (err) {
    console.error('Erreur chargement cartographie équipements:', err);
  } finally {
    loading.value = false;
  }
}

watch(() => props.year, (newYear?: number) => {
  loadMapData(newYear);
});

onMounted(() => {
  loadMapData();
  window.addEventListener('keydown', onKeyDown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', onKeyDown);
});
</script>
