<template>
  <Teleport to="body" :disabled="!isFullscreen">
    <div
      class="bg-white rounded-2xl border border-border p-4 shadow-2xs flex flex-col gap-3"
      :class="isFullscreen
        ? '!fixed !inset-0 !z-[100000] !w-screen !h-screen !rounded-none !p-4 md:!p-6 !m-0 !overflow-hidden !flex !flex-col !bg-white'
        : 'h-full transition-colors'"
    >
    <!-- EN-TÊTE COMPACT AVEC FILTRES ET ACTIONS -->
    <div class="flex flex-col gap-2 pb-2.5 border-b border-border shrink-0">
      <div class="flex items-center justify-between gap-2">
        <div class="flex items-center gap-2 min-w-0">
          <div class="h-7 w-7 rounded-lg bg-red-50 text-red-600 flex items-center justify-center shrink-0 ring-2 ring-red-500/10">
            <Radio :size="15" class="animate-pulse" />
          </div>
          <div class="truncate">
            <h3 class="font-bold text-gray-800 text-xs sm:text-sm truncate flex items-center gap-1.5">
              <span>Cartographie Secours & Stations Galana</span>
              <span
                v-if="isFullscreen"
                class="text-[10px] font-semibold text-primary bg-primary/10 border border-primary/20 px-1.5 py-0.2 rounded-full"
              >
                Plein Écran
              </span>
            </h3>
            <p v-if="selectedStation" class="text-[10px] text-amber-700 font-semibold truncate flex items-center gap-1">
              <span>⛽ Station active : {{ selectedStation.name }} ({{ selectedStation.locality }})</span>
              <button
                type="button"
                @click="$emit('clear-selection')"
                class="text-gray-500 hover:text-gray-800 underline ml-1 cursor-pointer"
              >
                (Effacer)
              </button>
            </p>
            <p v-else class="text-[10px] text-gray-500 truncate">
              Cliquez sur un secours ou une station (SS) pour afficher les détails.
            </p>
          </div>
        </div>

        <!-- Bouton Plein Écran -->
        <button
          type="button"
          @click="toggleFullscreen"
          class="inline-flex items-center gap-1 border rounded-lg px-2 py-1 text-xs font-medium transition cursor-pointer shadow-2xs select-none shrink-0"
          :class="isFullscreen ? 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100' : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200'"
          :title="isFullscreen ? 'Quitter le plein écran (Échap)' : 'Plein écran'"
        >
          <component :is="isFullscreen ? Minimize2 : Maximize2" :size="13" />
          <span class="hidden sm:inline">{{ isFullscreen ? 'Quitter' : 'Agrandir' }}</span>
        </button>
      </div>

      <!-- BARRE DE RECHERCHE RAPIDE CARTE (SECOURS & STATIONS) -->
      <div class="relative w-full">
        <div class="relative flex items-center">
          <Search :size="14" class="absolute left-3 text-gray-400 pointer-events-none" />
          <input
            v-model="mapSearchQuery"
            type="text"
            placeholder="Rechercher sur la carte (secours, station Galana, ville, téléphone, adresse)..."
            @focus="isSearchDropdownOpen = true"
            @keydown.enter.prevent="handleSearchEnter"
            @keydown.escape="isSearchDropdownOpen = false"
            class="w-full rounded-xl border border-gray-200 bg-gray-50/80 pl-9 pr-24 py-1.5 text-xs text-gray-800 placeholder-gray-400 outline-none transition focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/10"
          />
          <div class="absolute right-2 flex items-center gap-1.5">
            <span
              v-if="mapSearchQuery.trim()"
              class="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-primary/10 text-primary whitespace-nowrap"
            >
              {{ filteredContacts.length + filteredSites.length }} repères
            </span>
            <button
              v-if="mapSearchQuery"
              type="button"
              @click="clearMapSearch"
              class="p-0.5 rounded-full hover:bg-gray-200 text-gray-400 hover:text-gray-600 transition cursor-pointer"
              title="Effacer la recherche"
            >
              <XIcon :size="13" />
            </button>
          </div>
        </div>

        <!-- Popover déroulant des résultats de recherche -->
        <div
          v-if="isSearchDropdownOpen && mapSearchQuery.trim().length > 0"
          class="fixed inset-0 z-[1040]"
          @click="isSearchDropdownOpen = false"
        />

        <div
          v-if="isSearchDropdownOpen && mapSearchQuery.trim().length > 0"
          class="absolute left-0 right-0 top-full mt-1.5 z-[1050] rounded-2xl border border-gray-200 bg-white p-3 shadow-xl max-h-80 overflow-y-auto space-y-3"
        >
          <!-- Groupe 1 : Secours d'urgence -->
          <div v-if="searchResultsContacts.length > 0">
            <div class="flex items-center justify-between pb-1.5 border-b border-gray-100 text-[11px] font-bold text-gray-700">
              <span class="flex items-center gap-1">
                <span>🚨 Services de secours</span>
                <span class="text-xs text-red-600 font-extrabold">({{ searchResultsContacts.length }})</span>
              </span>
              <span class="text-[10px] text-gray-400 font-normal">Cliquer pour localiser</span>
            </div>
            <div class="divide-y divide-gray-50 mt-1">
              <button
                v-for="c in searchResultsContacts"
                :key="'c-' + c.id"
                type="button"
                @click="selectContactFromSearch(c)"
                class="w-full text-left p-2 rounded-xl hover:bg-gray-50 flex items-center justify-between gap-2 transition cursor-pointer group"
              >
                <div class="flex items-center gap-2 min-w-0">
                  <div
                    class="h-7 w-7 rounded-lg flex items-center justify-center text-xs shrink-0 shadow-2xs font-bold"
                    :style="{ backgroundColor: contactColors(c.type).fill + '15', color: contactColors(c.type).fill }"
                  >
                    {{ contactEmoji(c.type) }}
                  </div>
                  <div class="min-w-0 truncate">
                    <div class="font-bold text-gray-900 text-xs truncate group-hover:text-primary">
                      {{ c.name }}
                    </div>
                    <div class="text-[10px] text-gray-500 truncate flex items-center gap-1">
                      <MapPin :size="10" class="text-gray-400 shrink-0" />
                      <span>{{ c.locality || 'Madagascar' }}</span>
                      <span v-if="resolveContactProvince(c)" class="text-gray-400">({{ resolveContactProvince(c) }})</span>
                      <span v-if="c.contact_1 || c.phone" class="font-mono text-emerald-700 ml-1 font-semibold">📞 {{ c.contact_1 || c.phone }}</span>
                    </div>
                  </div>
                </div>
                <div class="shrink-0 flex items-center gap-1 text-[10px] text-primary font-semibold group-hover:underline">
                  <Compass :size="12" />
                  <span>Voir</span>
                </div>
              </button>
            </div>
          </div>

          <!-- Groupe 2 : Stations Galana (SS) -->
          <div v-if="searchResultsSites.length > 0">
            <div class="flex items-center justify-between pb-1.5 border-b border-gray-100 text-[11px] font-bold text-amber-900">
              <span class="flex items-center gap-1">
                <span>⛽ Stations Galana (SS)</span>
                <span class="text-xs text-amber-600 font-extrabold">({{ searchResultsSites.length }})</span>
              </span>
              <span class="text-[10px] text-gray-400 font-normal">Cliquer pour centrer et voir secours proches</span>
            </div>
            <div class="divide-y divide-gray-50 mt-1">
              <button
                v-for="s in searchResultsSites"
                :key="'s-' + s.id"
                type="button"
                @click="selectStationFromSearch(s)"
                class="w-full text-left p-2 rounded-xl hover:bg-amber-50/60 flex items-center justify-between gap-2 transition cursor-pointer group"
              >
                <div class="flex items-center gap-2 min-w-0">
                  <div class="h-7 w-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center text-xs shrink-0 font-bold">
                    ⛽
                  </div>
                  <div class="min-w-0 truncate">
                    <div class="font-bold text-gray-900 text-xs truncate group-hover:text-amber-800">
                      {{ s.name }}
                    </div>
                    <div class="text-[10px] text-gray-500 truncate flex items-center gap-1">
                      <MapPin :size="10" class="text-gray-400 shrink-0" />
                      <span>{{ s.locality || 'Madagascar' }}</span>
                      <span v-if="s.province" class="text-gray-400">({{ s.province }})</span>
                    </div>
                  </div>
                </div>
                <div class="shrink-0 flex items-center gap-1 text-[10px] text-amber-700 font-semibold group-hover:underline">
                  <Compass :size="12" />
                  <span>Centrer</span>
                </div>
              </button>
            </div>
          </div>

          <!-- Aucun résultat -->
          <div
            v-if="searchResultsContacts.length === 0 && searchResultsSites.length === 0"
            class="py-4 text-center text-gray-500"
          >
            <div class="text-xl mb-1">🔍</div>
            <p class="text-xs font-semibold text-gray-700">Aucun résultat trouvé sur la carte</p>
            <p class="text-[10px] text-gray-400 mt-0.5">
              Essayez un nom de ville (ex: Toamasina, Majunga), une catégorie (pompier, hôpital) ou une station Galana.
            </p>
          </div>
        </div>
      </div>

      <!-- FILTRES RAPIDES TYPE, PROVINCE & TOGGLES -->
      <div class="flex flex-wrap items-center gap-1.5 text-xs">
        <!-- Filtre Type de Secours -->
        <select
          v-model="selectedType"
          class="border border-gray-200 rounded-lg px-2 py-1 bg-gray-50 text-[11px] font-medium text-gray-700 outline-none focus:border-primary cursor-pointer"
        >
          <option value="ALL">Tous types ({{ contacts.length }})</option>
          <option value="POMPIER">🚒 Pompiers</option>
          <option value="HOPITAL">🏥 Hôpitaux</option>
          <option value="AMBULANCE">🚑 Ambulances</option>
          <option value="POLICE">👮 Police</option>
          <option value="GENDARMERIE">🛡️ Gendarmerie</option>
        </select>

        <!-- Filtre Province -->
        <select
          v-model="selectedProvince"
          class="border border-gray-200 rounded-lg px-2 py-1 bg-gray-50 text-[11px] font-medium text-gray-700 outline-none focus:border-primary cursor-pointer"
        >
          <option value="ALL">Toutes provinces</option>
          <option v-for="prov in provinceList" :key="prov" :value="prov">
            {{ prov }}
          </option>
        </select>

        <!-- Toggle Affichage Secours -->
        <button
          type="button"
          @click="showContacts = !showContacts"
          class="inline-flex items-center gap-1 border rounded-lg px-2 py-1 text-[11px] font-medium transition cursor-pointer select-none"
          :class="showContacts ? 'bg-red-50 text-red-800 border-red-300 font-bold' : 'bg-gray-50 text-gray-400 border-gray-200 hover:bg-gray-100'"
          title="Afficher/masquer les secours sur la carte"
        >
          <span>🚨 Secours ({{ filteredContacts.length }})</span>
        </button>

        <!-- Toggle Affichage Stations Galana (SS) -->
        <button
          type="button"
          @click="showStations = !showStations"
          class="inline-flex items-center gap-1 border rounded-lg px-2 py-1 text-[11px] font-medium transition cursor-pointer select-none"
          :class="showStations ? 'bg-amber-50 text-amber-900 border-amber-300 font-bold' : 'bg-gray-50 text-gray-400 border-gray-200 hover:bg-gray-100'"
          title="Afficher/masquer les stations-service Galana"
        >
          <Fuel :size="12" class="text-amber-600" />
          <span>Stations ({{ filteredSites.length }})</span>
        </button>

        <!-- Reset Vue -->
        <button
          type="button"
          @click="jumpTo([-18.8792, 47.5079], 6)"
          class="px-2 py-1 rounded-lg border border-gray-200 bg-white hover:bg-gray-100 text-gray-600 text-[11px] transition cursor-pointer font-medium ml-auto"
          title="Centrer sur Madagascar"
        >
          Centrer
        </button>
      </div>

      <!-- RACCOURCIS VILLES MAJEURES -->
      <div class="flex items-center gap-1 overflow-x-auto pb-0.5 scrollbar-hide text-[10px] text-gray-500">
        <span class="font-semibold text-gray-600 mr-0.5 shrink-0 flex items-center gap-0.5">
          <Compass :size="11" />
          Zoom :
        </span>
        <button
          v-for="city in cityJumpList"
          :key="city.name"
          type="button"
          @click="jumpTo(city.coords, city.zoom)"
          class="px-1.5 py-0.5 rounded border border-gray-200 bg-gray-50 hover:bg-primary/10 hover:border-primary/30 hover:text-primary transition cursor-pointer shrink-0"
        >
          {{ city.name }}
        </button>
      </div>
    </div>

    <!-- CONTENEUR CARTE LEAFLET -->
    <div
      ref="mapContainerRef"
      class="rounded-xl overflow-hidden border border-gray-200 relative"
      :class="isFullscreen ? 'flex-1 w-full min-h-0' : 'h-[500px] lg:h-[calc(100vh-270px)] min-h-[440px] w-full'"
    >
      <!-- SPINNER CHARGEMENT -->
      <div
        v-if="loading"
        class="absolute inset-0 bg-white/80 backdrop-blur-2xs z-[1000] flex flex-col items-center justify-center gap-2 text-gray-600"
      >
        <Loader2 :size="24" class="animate-spin text-primary" />
        <span class="text-xs font-semibold">Chargement des coordonnées des secours et stations...</span>
      </div>

      <!-- LÉGENDE COMPACTE -->
      <div
        class="absolute bottom-2.5 left-2.5 z-[1000] bg-white/95 backdrop-blur-xs border border-gray-200 rounded-xl p-2 shadow-md text-[10px] hidden sm:flex flex-col gap-1 max-w-[210px]"
      >
        <span class="font-bold text-gray-800 border-b border-gray-100 pb-0.5">Légende</span>
        <div class="flex items-center gap-1.5">
          <span class="h-2.5 w-2.5 rounded-full bg-red-600 border border-white shadow-xs"></span>
          <span class="text-gray-700">Pompiers (118)</span>
        </div>
        <div class="flex items-center gap-1.5">
          <span class="h-2.5 w-2.5 rounded-full bg-emerald-600 border border-white shadow-xs"></span>
          <span class="text-gray-700">Hôpitaux / CHU</span>
        </div>
        <div class="flex items-center gap-1.5">
          <span class="h-2.5 w-2.5 rounded-full bg-sky-500 border border-white shadow-xs"></span>
          <span class="text-gray-700">Ambulances SAMU</span>
        </div>
        <div class="flex items-center gap-1.5">
          <span class="h-2.5 w-2.5 rounded-full bg-indigo-600 border border-white shadow-xs"></span>
          <span class="text-gray-700">Police / Gendarmerie</span>
        </div>
        <div v-if="showStations" class="flex items-center gap-1.5 pt-0.5 border-t border-gray-100">
          <span class="h-2.5 w-2.5 rounded-full bg-amber-500 border border-white shadow-xs"></span>
          <span class="text-amber-900 font-semibold">Stations Galana (SS)</span>
        </div>
      </div>

      <!-- CARTE VUE-LEAFLET -->
      <LMap
        ref="lMapComponentRef"
        class="z-0 w-full h-full"
        :zoom="zoom"
        :center="mapCenter"
        @ready="onMapReady"
      >
        <LTileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap & Galana Distribution Pétrolière"
        />

        <!-- 1. MARKERS STATIONS GALANA (EN ARRIÈRE-PLAN) -->
        <template v-if="showStations">
          <LCircleMarker
            v-for="site in filteredSites"
            :key="'site-' + site.id"
            :ref="(el) => setSiteMarkerRef(el, site.id)"
            :lat-lng="[site.latitude, site.longitude]"
            :radius="site.id === (activeStationModal?.id || selectedStationId) ? 12 : 6.5"
            :color="site.id === (activeStationModal?.id || selectedStationId) ? '#78350F' : '#B45309'"
            :fill-color="site.id === (activeStationModal?.id || selectedStationId) ? '#F59E0B' : '#FBBF24'"
            :fill-opacity="0.9"
            :weight="site.id === (activeStationModal?.id || selectedStationId) ? 3.5 : 1.5"
            @click="handleStationMarkerClick(site)"
          >
            <!-- TOOLTIP -->
            <LTooltip :options="{ direction: 'top', offset: [0, -6] }">
              <div class="text-xs p-1">
                <span class="font-bold text-gray-900 block">⛽ Galana {{ site.name }}</span>
                <span class="text-gray-500 font-normal">{{ site.locality }} ({{ site.province }})</span>
                <span class="text-amber-800 font-semibold block text-[10px] mt-0.5">
                  Cliquez pour localiser les secours proches
                </span>
              </div>
            </LTooltip>

            <!-- POPUP STATIONS AVEC SECOURS LES PLUS PROCHES -->
            <LPopup :options="{ maxWidth: 320 }">
              <div class="text-xs space-y-2 p-1 min-w-[260px]">
                <div class="border-b border-gray-100 pb-1.5">
                  <div class="flex items-center gap-1 text-amber-700 font-bold">
                    <Fuel :size="14" />
                    <span>Station-Service GALANA (SS)</span>
                  </div>
                  <h4 class="font-bold text-gray-900 text-xs sm:text-sm mt-0.5">{{ site.name }}</h4>
                  <p class="text-[10px] text-gray-500">{{ site.locality }} • {{ site.province }}</p>
                </div>

                <!-- Secours d'urgence les plus proches géographiquement -->
                <div>
                  <div class="flex items-center justify-between mb-1.5">
                    <span class="text-[10px] font-bold uppercase tracking-wider text-gray-600">
                      Secours les plus proches :
                    </span>
                    <span class="text-[9px] font-semibold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded-md border border-emerald-200">
                      Distance directe
                    </span>
                  </div>

                  <div v-if="getNearestContactsForStation(site, 6).length" class="space-y-1.5">
                    <div
                      v-for="c in getNearestContactsForStation(site, 6)"
                      :key="c.id"
                      class="flex items-center justify-between p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-[11px] transition cursor-pointer"
                      @click="$emit('select-contact', c); jumpTo([c.latitude!, c.longitude!], 15)"
                    >
                      <div class="min-w-0 pr-2">
                        <span class="font-bold text-gray-900 block truncate text-xs">{{ c.name }}</span>
                        <div class="flex items-center gap-1.5 mt-0.5 text-[10px]">
                          <span
                            class="px-1.5 py-0.2 rounded font-bold text-white text-[9px]"
                            :style="{ backgroundColor: contactColors(c.type).fill }"
                          >
                            {{ contactLabel(c.type) }}
                          </span>
                          <span v-if="c.distance_km !== undefined" class="font-bold text-emerald-700 font-mono">
                            📍 {{ formatDistance(c.distance_km) }}
                          </span>
                        </div>
                      </div>

                      <!-- BOUTON NUMÉRO DE CONTACT TRÈS VISIBLE ET LISIBLE -->
                      <a
                        v-if="c.contact_1 || c.phone"
                        :href="'tel:' + (c.contact_1 || c.phone)"
                        @click.stop
                        class="phone-action-btn"
                        :title="'Appeler ' + (c.contact_1 || c.phone)"
                      >
                        <span>📞</span>
                        <span>{{ c.contact_1 || c.phone }}</span>
                      </a>
                    </div>
                  </div>
                  <div v-else class="text-[10px] text-gray-400 italic py-2 text-center bg-gray-50 rounded-lg">
                    Aucun secours géolocalisé à proximité.
                  </div>
                </div>

                <!-- Bouton Filtrer la liste par cette station -->
                <button
                  type="button"
                  @click="handleStationMarkerClick(site)"
                  class="w-full mt-2 py-1.5 px-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
                >
                  <Fuel :size="13" />
                  <span>Classer l'annuaire par cette station</span>
                </button>
              </div>
            </LPopup>
          </LCircleMarker>
        </template>

        <!-- 2. MARKERS CONTACTS D'URGENCE (AU PREMIER PLAN) -->
        <template v-if="showContacts">
          <LCircleMarker
            v-for="contact in filteredContacts"
            :key="'contact-' + contact.id"
            :ref="(el) => setContactMarkerRef(el, contact.id)"
            :lat-lng="[contact.latitude!, contact.longitude!]"
            :radius="contact.id === (activeContactModal?.id || selectedContactId) ? 14 : markerRadius(contact.type)"
            :color="contact.id === (activeContactModal?.id || selectedContactId) ? '#F59E0B' : '#FFFFFF'"
            :fill-color="contactColors(contact.type).fill"
            :fill-opacity="1.0"
            :weight="contact.id === (activeContactModal?.id || selectedContactId) ? 4 : 2.5"
            @click="handleContactMarkerClick(contact)"
          >
            <!-- TOOLTIP AU SURVOL -->
            <LTooltip :options="{ direction: 'top', offset: [0, -8] }">
              <div class="text-xs p-0.5">
                <span class="font-bold text-gray-900 block">{{ contact.name }}</span>
                <span class="text-gray-500 font-normal">{{ contactLabel(contact.type) }} • {{ contact.locality }}</span>
                <span v-if="contact.distance_km !== undefined && contact.distance_km !== 99999" class="font-bold text-emerald-700 block mt-0.5">
                  📍 à {{ formatDistance(contact.distance_km) }} de la station
                </span>
                <span v-if="contact.contact_1 || contact.phone" class="font-mono text-emerald-800 font-semibold block mt-0.5">
                  📞 {{ contact.contact_1 || contact.phone }}
                </span>
              </div>
            </LTooltip>

            <!-- POPUP DÉTAILLÉ AU CLIC -->
            <LPopup :options="{ maxWidth: 320 }">
              <div class="text-xs space-y-2 p-1 min-w-[240px]">
                <div class="border-b border-gray-100 pb-1.5">
                  <div class="flex items-center justify-between gap-1">
                    <span
                      class="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider text-white"
                      :style="{ backgroundColor: contactColors(contact.type).fill }"
                    >
                      {{ contactLabel(contact.type) }}
                    </span>
                    <span class="text-[10px] text-gray-400 font-medium">{{ contact.locality }}</span>
                  </div>
                  <h4 class="font-bold text-gray-900 text-xs sm:text-sm mt-1">{{ contact.name }}</h4>
                  <p v-if="contact.distance_km !== undefined && contact.distance_km !== 99999" class="text-[11px] font-bold text-emerald-700 mt-0.5">
                    📍 Distance : {{ formatDistance(contact.distance_km) }}
                  </p>
                  <p v-if="contact.address" class="text-[10px] text-gray-500 mt-0.5">{{ contact.address }}</p>
                </div>

                <!-- Lignes téléphoniques d'urgence -->
                <div class="space-y-1.5 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <span class="text-[9px] font-bold uppercase tracking-wider text-slate-500 block">
                    Appel direct d'urgence
                  </span>
                  <div class="flex flex-col gap-1.5">
                    <!-- Ligne 1 principale -->
                    <a
                      v-if="contact.contact_1 || contact.phone"
                      :href="'tel:' + (contact.contact_1 || contact.phone)"
                      class="phone-action-btn w-full justify-between"
                      :title="'Appeler ' + (contact.contact_1 || contact.phone)"
                    >
                      <span class="flex items-center gap-1.5">
                        <span>📞</span>
                        <span>{{ contact.contact_1 || contact.phone }}</span>
                      </span>
                      <span class="text-[10px] uppercase font-semibold opacity-90">Appeler</span>
                    </a>

                    <!-- Ligne 2 secondaire -->
                    <a
                      v-if="contact.contact_2"
                      :href="'tel:' + contact.contact_2"
                      class="inline-flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-white border border-gray-300 text-gray-800 font-semibold text-xs hover:bg-gray-100 transition !no-underline"
                      style="color: #1f2937 !important;"
                    >
                      <span class="text-[10px] font-mono">📞 Ligne 2 : {{ contact.contact_2 }}</span>
                      <span class="text-[9px] text-gray-500 font-semibold">Appeler</span>
                    </a>

                    <!-- Ligne 3 d'urgence -->
                    <a
                      v-if="contact.contact_3"
                      :href="'tel:' + contact.contact_3"
                      class="inline-flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-white border border-gray-300 text-gray-800 font-semibold text-xs hover:bg-gray-100 transition !no-underline"
                      style="color: #1f2937 !important;"
                    >
                      <span class="text-[10px] font-mono">📞 Ligne 3 : {{ contact.contact_3 }}</span>
                      <span class="text-[9px] text-gray-500 font-semibold">Appeler</span>
                    </a>
                  </div>
                </div>

                <div v-if="contact.notes" class="text-[10px] text-gray-600 italic bg-amber-50/50 p-1.5 rounded-lg border border-amber-100">
                  📝 {{ contact.notes }}
                </div>
              </div>
            </LPopup>
          </LCircleMarker>
        </template>
      </LMap>
    </div>
  </div>
</Teleport>
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
  Search,
  XIcon,
  MapPin,
} from "@lucide/vue";
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from "vue";
import type {
  EmergencyContactType,
  EmergencySiteType,
  EmergencyType,
} from "../../../../@types/EmergencyContact.type";

interface Props {
  contacts: EmergencyContactType[];
  sites: EmergencySiteType[];
  loading?: boolean;
  selectedContactId?: number | null;
  selectedStationId?: number | null;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  selectedContactId: null,
  selectedStationId: null,
});

const emit = defineEmits<{
  (e: "select-contact", contact: EmergencyContactType): void;
  (e: "select-station", station: EmergencySiteType): void;
  (e: "clear-selection"): void;
}>();

const isFullscreen = ref(false);
const leafletMap = ref<any>(null);
const zoom = ref(6);
const mapCenter = ref<[number, number]>([-18.8792, 47.5079]);
const selectedType = ref<string>("ALL");
const selectedProvince = ref<string>("ALL");
const showStations = ref(true);
const showContacts = ref(true);

// Recherche textuelle sur la carte
const mapSearchQuery = ref("");
const isSearchDropdownOpen = ref(false);

const selectedStation = computed(() => {
  if (!props.selectedStationId) return null;
  return props.sites.find((s) => s.id === props.selectedStationId) || null;
});

// Villes rapides pour zoomer
const cityJumpList = [
  { name: "Antananarivo", coords: [-18.9055, 47.525], zoom: 12 },
  { name: "Toamasina", coords: [-18.1492, 49.4023], zoom: 12 },
  { name: "Mahajanga", coords: [-15.7188, 46.3272], zoom: 12 },
  { name: "Antsiranana", coords: [-12.3088, 49.2938], zoom: 12 },
  { name: "Fianarantsoa", coords: [-21.4408, 47.0977], zoom: 12 },
  { name: "Toliara", coords: [-23.3508, 43.6686], zoom: 12 },
];

// 6 provinces officielles de Madagascar
const standardProvinces = [
  "ANTANANARIVO",
  "ANTSIRANANA",
  "FIANARANTSOA",
  "MAHAJANGA",
  "TOAMASINA",
  "TOLIARA",
];

// Résolution de province
function resolveContactProvince(c: EmergencyContactType): string {
  if (c.province) return c.province.toUpperCase().trim();
  if (c.location?.province) return c.location.province.toUpperCase().trim();
  if (c.locality) {
    const loc = c.locality.toUpperCase().trim();
    if (["ANTANANARIVO", "TANA", "ANTSIRABE", "AMBATOLAMPY", "TALATAMATY", "IVATO", "ANALAKELY", "TSARALALANA"].some(x => loc.includes(x))) return "ANTANANARIVO";
    if (["TOAMASINA", "TAMATAVE", "MORAMANGA", "BRICKAVILLE", "AMBATONDRAZAKA"].some(x => loc.includes(x))) return "TOAMASINA";
    if (["MAHAJANGA", "MAJUNGA", "ANTSOHIHY", "MAROVOAY", "PORT-BERGE"].some(x => loc.includes(x))) return "MAHAJANGA";
    if (["ANTSIRANANA", "DIEGO", "NOSY BE", "SAMBAVA", "AMBANJA", "AMBILOBE", "ANDAPA"].some(x => loc.includes(x))) return "ANTSIRANANA";
    if (["FIANARANTSOA", "MANAKARA", "AMBOSITRA", "FARAFANGANA", "IRONDRO"].some(x => loc.includes(x))) return "FIANARANTSOA";
    if (["TOLIARA", "TULEAR", "MORONDAVA", "IHOSY", "TOLAGNARO", "FORT DAUPHIN", "SAKARAHA", "AMPANIHY"].some(x => loc.includes(x))) return "TOLIARA";
  }
  return "";
}

// Provinces distinctes
const provinceList = computed(() => {
  const set = new Set<string>();
  props.sites.forEach((s) => {
    if (s.province) set.add(s.province.toUpperCase().trim());
  });
  props.contacts.forEach((c) => {
    const p = resolveContactProvince(c);
    if (p) set.add(p);
  });
  if (set.size === 0) {
    standardProvinces.forEach((p) => set.add(p));
  }
  return Array.from(set).sort();
});

// Calcul de distance Haversine en km
function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

function formatDistance(dist?: number): string {
  if (dist === undefined || dist === null) return "";
  if (dist < 1) return `${Math.round(dist * 1000)} m`;
  return `${dist.toFixed(1)} km`;
}

// Trouver les secours les plus proches d'une station donnée
function getNearestContactsForStation(station: EmergencySiteType, limit = 6) {
  if (!station.latitude || !station.longitude) return [];
  const sLat = Number(station.latitude);
  const sLng = Number(station.longitude);

  return props.contacts
    .filter((c) => c.latitude !== undefined && c.latitude !== null && c.longitude !== undefined && c.longitude !== null)
    .map((c) => ({
      ...c,
      latitude: Number(c.latitude),
      longitude: Number(c.longitude),
      distance_km: calculateDistanceKm(sLat, sLng, Number(c.latitude), Number(c.longitude)),
    }))
    .sort((a, b) => a.distance_km - b.distance_km)
    .slice(0, limit);
}

function normalizeSearchText(str?: string | null): string {
  if (!str) return "";
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function matchesSearch(text: string | null | undefined, query: string): boolean {
  if (!text) return false;
  return normalizeSearchText(text).includes(query);
}

function matchesPhoneSearch(phone: string | null | undefined, queryDigits: string): boolean {
  if (!phone || !queryDigits) return false;
  const cleanedPhone = phone.replace(/\D/g, "");
  return cleanedPhone.includes(queryDigits);
}

function contactEmoji(type: EmergencyType | string) {
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

function contactMatchesSearch(c: EmergencyContactType, q: string, qDigits: string): boolean {
  if (!q) return true;
  if (matchesSearch(c.name, q)) return true;
  if (matchesSearch(c.locality, q)) return true;
  if (matchesSearch(c.address, q)) return true;
  if (matchesSearch(c.notes, q)) return true;
  if (matchesSearch(c.type, q)) return true;
  if (matchesSearch(contactLabel(c.type), q)) return true;
  if (matchesSearch(resolveContactProvince(c), q)) return true;
  if (matchesSearch(c.location?.label, q)) return true;
  if (qDigits.length >= 3) {
    if (matchesPhoneSearch(c.contact_1, qDigits)) return true;
    if (matchesPhoneSearch(c.phone, qDigits)) return true;
    if (matchesPhoneSearch(c.contact_2, qDigits)) return true;
    if (matchesPhoneSearch(c.contact_3, qDigits)) return true;
  }
  return false;
}

function siteMatchesSearch(s: EmergencySiteType, q: string): boolean {
  if (!q) return true;
  if (matchesSearch(s.name, q)) return true;
  if (matchesSearch(s.locality, q)) return true;
  if (matchesSearch(s.province, q)) return true;
  if (matchesSearch(s.code, q)) return true;
  return false;
}

// Contacts filtrés sur la carte
const filteredContacts = computed(() => {
  const q = normalizeSearchText(mapSearchQuery.value);
  const qDigits = mapSearchQuery.value.replace(/\D/g, "");

  return props.contacts
    .filter((c) => {
      const lat = c.latitude !== undefined && c.latitude !== null ? Number(c.latitude) : null;
      const lng = c.longitude !== undefined && c.longitude !== null ? Number(c.longitude) : null;
      if (lat === null || lng === null || isNaN(lat) || isNaN(lng)) return false;

      if (selectedType.value !== "ALL" && c.type !== selectedType.value) return false;

      if (selectedProvince.value !== "ALL") {
        const targetProv = selectedProvince.value.toUpperCase().trim();
        const contactProv = resolveContactProvince(c);
        if (contactProv && contactProv !== targetProv) return false;
      }

      if (q && !contactMatchesSearch(c, q, qDigits)) return false;

      return true;
    })
    .map((c) => ({
      ...c,
      latitude: Number(c.latitude),
      longitude: Number(c.longitude),
    }));
});

// Sites Galana (SS) filtrés sur la carte
const filteredSites = computed(() => {
  const q = normalizeSearchText(mapSearchQuery.value);

  return props.sites
    .filter((s) => {
      const lat = s.latitude !== undefined && s.latitude !== null ? Number(s.latitude) : null;
      const lng = s.longitude !== undefined && s.longitude !== null ? Number(s.longitude) : null;
      if (lat === null || lng === null || isNaN(lat) || isNaN(lng)) return false;

      if (selectedProvince.value !== "ALL" && s.province !== selectedProvince.value) return false;

      if (q && !siteMatchesSearch(s, q)) return false;

      return true;
    })
    .map((s) => ({
      ...s,
      latitude: Number(s.latitude),
      longitude: Number(s.longitude),
    }));
});

// Résultats de recherche rapide (dropdown)
const searchResultsContacts = computed(() => {
  if (!mapSearchQuery.value.trim()) return [];
  const q = normalizeSearchText(mapSearchQuery.value);
  const qDigits = mapSearchQuery.value.replace(/\D/g, "");
  return props.contacts
    .filter((c) => contactMatchesSearch(c, q, qDigits))
    .slice(0, 6);
});

const searchResultsSites = computed(() => {
  if (!mapSearchQuery.value.trim()) return [];
  const q = normalizeSearchText(mapSearchQuery.value);
  return props.sites
    .filter((s) => siteMatchesSearch(s, q))
    .slice(0, 6);
});

function clearMapSearch() {
  mapSearchQuery.value = "";
  isSearchDropdownOpen.value = false;
}

function selectContactFromSearch(contact: EmergencyContactType) {
  showContacts.value = true;
  isSearchDropdownOpen.value = false;
  emit("select-contact", contact);
  selectContact(contact);
}

function selectStationFromSearch(station: EmergencySiteType) {
  showStations.value = true;
  isSearchDropdownOpen.value = false;
  emit("select-station", station);
  selectStation(station);
}

function handleSearchEnter() {
  if (searchResultsContacts.value.length > 0) {
    selectContactFromSearch(searchResultsContacts.value[0]);
  } else if (searchResultsSites.value.length > 0) {
    selectStationFromSearch(searchResultsSites.value[0]);
  }
}

const mapContainerRef = ref<HTMLElement | null>(null);
const lMapComponentRef = ref<any>(null);
let resizeObserver: ResizeObserver | null = null;

const activeStationModal = ref<EmergencySiteType | null>(null);
const activeContactModal = ref<EmergencyContactType | null>(null);

const siteMarkerRefs = new Map<number, any>();
const contactMarkerRefs = new Map<number, any>();

function setSiteMarkerRef(el: any, id: number) {
  if (el) {
    siteMarkerRefs.set(id, el);
  } else {
    siteMarkerRefs.delete(id);
  }
}

function setContactMarkerRef(el: any, id: number) {
  if (el) {
    contactMarkerRefs.set(id, el);
  } else {
    contactMarkerRefs.delete(id);
  }
}

function openSitePopup(siteId: number) {
  setTimeout(() => {
    const marker = siteMarkerRefs.get(siteId);
    if (marker) {
      const obj = marker.leafletObject || marker;
      if (obj && typeof obj.openPopup === "function") {
        try {
          obj.openPopup();
        } catch {}
      }
    }
  }, 220);
}

function openContactPopup(contactId: number) {
  setTimeout(() => {
    const marker = contactMarkerRefs.get(contactId);
    if (marker) {
      const obj = marker.leafletObject || marker;
      if (obj && typeof obj.openPopup === "function") {
        try {
          obj.openPopup();
        } catch {}
      }
    }
  }, 220);
}

function getMapInstance(): any {
  if (leafletMap.value) {
    if (typeof leafletMap.value.invalidateSize === "function") return leafletMap.value;
    if (typeof leafletMap.value.leafletObject?.invalidateSize === "function") return leafletMap.value.leafletObject;
  }
  if (lMapComponentRef.value) {
    if (typeof lMapComponentRef.value.invalidateSize === "function") return lMapComponentRef.value;
    if (typeof lMapComponentRef.value.leafletObject?.invalidateSize === "function") return lMapComponentRef.value.leafletObject;
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

function onMapReady(map: any) {
  leafletMap.value = map;
  nextTick(() => {
    refreshMapSize();
  });
}

function jumpTo(coords: number[] | [number, number], targetZoom = 12) {
  mapCenter.value = [coords[0], coords[1]];
  zoom.value = targetZoom;
  const map = getMapInstance();
  if (map) {
    map.setView(coords, targetZoom, { animate: true });
  }
}

function selectContact(contact: EmergencyContactType) {
  activeContactModal.value = contact;
  activeStationModal.value = null;
  showContacts.value = true;
  if (contact.latitude && contact.longitude) {
    jumpTo([Number(contact.latitude), Number(contact.longitude)], 15);
    openContactPopup(contact.id);
  }
}

function selectStation(station: EmergencySiteType) {
  activeStationModal.value = station;
  activeContactModal.value = null;
  showStations.value = true;
  if (station.latitude && station.longitude) {
    jumpTo([Number(station.latitude), Number(station.longitude)], 14);
    openSitePopup(station.id);
  }
}

function handleContactMarkerClick(contact: EmergencyContactType) {
  emit("select-contact", contact);
  selectContact(contact);
}

function handleStationMarkerClick(site: EmergencySiteType) {
  emit("select-station", site);
  selectStation(site);
}

watch(
  () => props.selectedContactId,
  (newId) => {
    if (newId) {
      const c = props.contacts.find((x) => x.id === newId);
      if (c) {
        selectContact(c);
      }
    } else {
      activeContactModal.value = null;
    }
  }
);

watch(
  () => props.selectedStationId,
  (newId) => {
    if (newId) {
      const s = props.sites.find((x) => x.id === newId);
      if (s) {
        selectStation(s);
      }
    } else {
      activeStationModal.value = null;
    }
  }
);

function toggleFullscreen() {
  isFullscreen.value = !isFullscreen.value;

  nextTick(() => {
    refreshMapSize();
    [40, 100, 200, 350, 600].forEach((delay) => {
      setTimeout(() => {
        refreshMapSize();
      }, delay);
    });
  });
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === "Escape" && isFullscreen.value) {
    toggleFullscreen();
  }
}

function onWindowResize() {
  refreshMapSize();
}

onMounted(() => {
  window.addEventListener("keydown", onKeydown);
  window.addEventListener("resize", onWindowResize);

  nextTick(() => {
    refreshMapSize();
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
  window.removeEventListener("resize", onWindowResize);
  if (resizeObserver) {
    resizeObserver.disconnect();
    resizeObserver = null;
  }
});

// Couleurs par type de secours
function contactColors(type: EmergencyType | string) {
  switch (type) {
    case "POMPIER":
      return { fill: "#DC2626", stroke: "#FFFFFF" }; // Rouge vif avec contour blanc
    case "HOPITAL":
      return { fill: "#059669", stroke: "#FFFFFF" }; // Vert émeraude avec contour blanc
    case "AMBULANCE":
      return { fill: "#0284C7", stroke: "#FFFFFF" }; // Bleu ciel avec contour blanc
    case "POLICE":
      return { fill: "#4F46E5", stroke: "#FFFFFF" }; // Indigo avec contour blanc
    case "GENDARMERIE":
      return { fill: "#7C3AED", stroke: "#FFFFFF" }; // Violet avec contour blanc
    default:
      return { fill: "#EA580C", stroke: "#FFFFFF" }; // Orange
  }
}

function markerRadius(type: EmergencyType | string) {
  if (type === "POMPIER" || type === "HOPITAL") return 10;
  return 9;
}

function contactLabel(type: EmergencyType | string) {
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

defineExpose({
  jumpTo,
  selectContact,
  selectStation,
  refreshMapSize,
  toggleFullscreen,
});
</script>

<style>
/* Forcer la lisibilité absolue des liens et numéros de téléphone dans les popups Leaflet */
.leaflet-popup-content a {
  color: #ffffff !important;
  text-decoration: none !important;
}

.leaflet-popup-content a.phone-action-btn {
  display: inline-flex !important;
  align-items: center !important;
  gap: 0.375rem !important;
  padding: 0.35rem 0.65rem !important;
  border-radius: 0.5rem !important;
  background-color: #059669 !important; /* emerald-600 */
  color: #ffffff !important;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace !important;
  font-weight: 700 !important;
  font-size: 0.75rem !important;
  line-height: 1rem !important;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05) !important;
  transition: all 0.15s ease !important;
  text-decoration: none !important;
  white-space: nowrap !important;
}

.leaflet-popup-content a.phone-action-btn:hover {
  background-color: #047857 !important; /* emerald-700 */
  color: #ffffff !important;
}

.leaflet-popup-content a.phone-action-btn * {
  color: #ffffff !important;
}

/* Style de la boîte popup Leaflet */
.leaflet-popup-content-wrapper {
  border-radius: 1rem !important;
  padding: 0.25rem !important;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.1) !important;
}

.leaflet-popup-content {
  margin: 0.75rem 0.85rem !important;
  line-height: 1.4 !important;
}
</style>
