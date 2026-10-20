<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto"
  >
    <div
      class="w-full max-w-5xl rounded-2xl border border-gray-200 bg-white shadow-2xl overflow-hidden flex flex-col my-4 max-h-[92vh]"
    >
      <!-- HEADER DU MODAL -->
      <div class="flex items-center justify-between p-4 sm:p-5 border-b border-gray-100 bg-slate-50/80 shrink-0">
        <div class="flex items-center gap-3 min-w-0">
          <div
            class="h-10 w-10 rounded-xl flex items-center justify-center font-bold text-white shadow-xs shrink-0 text-lg"
            :style="{ backgroundColor: typeColor(form.type) }"
          >
            {{ typeEmoji(form.type) }}
          </div>
          <div class="min-w-0">
            <h3 class="text-base font-bold text-gray-900 truncate">
              {{ isEditing ? 'Modifier le service de secours' : 'Nouveau service de secours' }}
            </h3>
            <p class="text-xs text-gray-500 truncate">
              Sélectionnez l'emplacement sur la carte pour associer automatiquement les stations Galana proches.
            </p>
          </div>
        </div>

        <button
          type="button"
          @click="onClose"
          class="h-8 w-8 rounded-lg border border-gray-200 bg-white text-gray-400 hover:text-gray-700 flex items-center justify-center hover:bg-gray-100 transition shrink-0 cursor-pointer"
        >
          <X :size="16" />
        </button>
      </div>

      <!-- FORMULAIRE (SCROLLABLE) -->
      <form @submit.prevent="handleSubmit" class="p-4 sm:p-5 space-y-4 overflow-y-auto flex-1 text-xs">
        <!-- 1. TYPE DE SERVICE & NOM -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label class="block font-semibold text-gray-700 mb-1">
              Type de secours <span class="text-red-500">*</span>
            </label>
            <select
              v-model="form.type"
              required
              class="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3 py-2 text-xs font-semibold text-gray-800 outline-none focus:border-primary focus:bg-white cursor-pointer"
            >
              <option value="POMPIER">🚒 Sapeurs-Pompiers</option>
              <option value="HOPITAL">🏥 Hôpital / Clinique</option>
              <option value="AMBULANCE">🚑 Ambulance / SAMU</option>
              <option value="POLICE">👮 Police Nationale</option>
              <option value="GENDARMERIE">🛡️ Gendarmerie</option>
            </select>
          </div>

          <div class="sm:col-span-2">
            <label class="block font-semibold text-gray-700 mb-1">
              Nom de l'établissement / Brigade <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.name"
              type="text"
              required
              placeholder="ex: C.U.A Tsaralalana, HJRA Antananarivo, Brigade Port-Bergé..."
              class="w-full rounded-xl border border-gray-200 px-3 py-2 text-xs text-gray-800 outline-none focus:border-primary"
            />
          </div>
        </div>

        <!-- 2. LAYOUT EN 2 COLONNES : COORDONNÉES/INFOS (GAUCHE) & CARTE/STATIONS (DROITE) -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          
          <!-- COLONNE GAUCHE (5 cols) : LIGNES D'APPEL, ADRESSE & CONSIGNES -->
          <div class="lg:col-span-5 space-y-3.5">
            <!-- TÉLÉPHONES & CONTACT -->
            <div class="rounded-xl bg-slate-50/80 border border-slate-200 p-3.5 space-y-3">
              <span class="text-[11px] font-bold text-gray-800 uppercase tracking-wider block flex items-center gap-1.5">
                <Phone :size="13" class="text-emerald-600" />
                <span>Coordonnées Téléphoniques</span>
              </span>

              <div>
                <label class="block font-semibold text-gray-700 mb-1">
                  Ligne Principale 1 <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="form.contact_1"
                  type="text"
                  required
                  placeholder="ex: 0344210142 ou 118"
                  class="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs text-gray-800 font-mono font-semibold outline-none focus:border-emerald-600"
                />
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label class="block font-semibold text-gray-700 mb-1">
                    Ligne Secondaire 2
                  </label>
                  <input
                    v-model="form.contact_2"
                    type="text"
                    placeholder="ex: 0202228054"
                    class="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs text-gray-800 font-mono outline-none focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label class="block font-semibold text-gray-700 mb-1">
                    Ligne d'Urgence 3
                  </label>
                  <input
                    v-model="form.contact_3"
                    type="text"
                    placeholder="ex: 0320780110"
                    class="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs text-gray-800 font-mono outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              <div>
                <label class="block font-semibold text-gray-700 mb-1">Adresse e-mail</label>
                <input
                  v-model="form.email"
                  type="email"
                  placeholder="ex: secours.tana@galana.mg"
                  class="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs text-gray-800 outline-none focus:border-primary"
                />
              </div>

              <div>
                <label class="block font-semibold text-gray-700 mb-1">Adresse postale / Quartier</label>
                <input
                  v-model="form.address"
                  type="text"
                  placeholder="ex: Tsaralalana, Analakely, Route des Hydrocarbures..."
                  class="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs text-gray-800 outline-none focus:border-primary"
                />
              </div>
            </div>

            <!-- CONSIGNES & NOTES -->
            <div>
              <label class="block font-semibold text-gray-700 mb-1">
                Consignes d'urgence & Notes opérationnelles
              </label>
              <textarea
                v-model="form.notes"
                rows="3"
                placeholder="ex: Contacter en priorité pour tout départ de feu sur piste, hydrocarbures ou incident médical majeur..."
                class="w-full rounded-xl border border-gray-200 px-3 py-2 text-xs text-gray-800 outline-none focus:border-primary resize-none"
              ></textarea>
            </div>
          </div>

          <!-- COLONNE DROITE (7 cols) : SÉLECTION SUR LA CARTE & STATIONS COUVERTES -->
          <div class="lg:col-span-7 space-y-3.5">

            <!-- BLOC CARTE INTERACTIVE -->
            <!-- BLOC CARTE INTERACTIVE -->
            <div class="rounded-xl border border-gray-200 bg-slate-50/50 p-3 space-y-2.5">
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                <div>
                  <span class="text-[11px] font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Crosshair :size="13" class="text-primary" />
                    <span>Emplacement & Sélection sur la Carte</span>
                  </span>
                  <p class="text-[10px] text-gray-500">
                    Cliquez sur la carte pour positionner le secours et détecter automatiquement la ville.
                  </p>
                </div>

                <div class="flex items-center gap-1.5">
                  <!-- RACCOURCIS VILLES -->
                  <div class="flex items-center gap-1 overflow-x-auto pb-0.5">
                    <span class="text-[10px] font-semibold text-gray-400 shrink-0">Zoom :</span>
                    <button
                      v-for="city in cityJumpList"
                      :key="city.name"
                      type="button"
                      @click="jumpToCity(city.coords, city.zoom)"
                      class="px-1.5 py-0.5 rounded border border-gray-200 bg-white hover:bg-primary/10 hover:border-primary/40 hover:text-primary text-[10px] font-medium text-gray-600 transition cursor-pointer shrink-0 shadow-2xs"
                    >
                      {{ city.name }}
                    </button>
                  </div>

                  <!-- BOUTON PLEIN ÉCRAN CARTE -->
                  <button
                    type="button"
                    @click="toggleMapFullscreen"
                    class="px-2 py-0.5 rounded-lg border border-gray-200 bg-white hover:bg-primary/10 hover:border-primary/30 hover:text-primary flex items-center gap-1 text-[10px] font-semibold text-gray-700 transition cursor-pointer shrink-0 shadow-2xs"
                    :title="isMapFullscreen ? 'Réduire la carte (Échap)' : 'Agrandir la carte en plein écran'"
                  >
                    <component :is="isMapFullscreen ? Minimize2 : Maximize2" :size="12" />
                    <span class="hidden sm:inline">{{ isMapFullscreen ? 'Réduire' : 'Plein écran' }}</span>
                  </button>
                </div>
              </div>

              <!-- CONTENEUR LEAFLET (AVEC TÉLÉPORTATION POUR PLEIN ÉCRAN) -->
              <Teleport to="body" :disabled="!isMapFullscreen">
                <div
                  :class="isMapFullscreen
                    ? 'fixed inset-0 z-[100005] bg-black/75 backdrop-blur-sm p-3 sm:p-5 flex flex-col items-center justify-center'
                    : 'w-full'"
                >
                  <div
                    :class="isMapFullscreen
                      ? 'w-full h-full max-w-7xl max-h-[94vh] bg-white rounded-2xl shadow-2xl p-4 flex flex-col border border-gray-200 overflow-hidden'
                      : 'w-full'"
                  >
                    <!-- EN-TÊTE PLEIN ÉCRAN DÉDIÉ -->
                    <div v-if="isMapFullscreen" class="flex items-center justify-between gap-3 pb-3 mb-3 border-b border-gray-100 shrink-0">
                      <div class="flex items-center gap-2.5 min-w-0">
                        <div class="h-8 w-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                          <Compass :size="16" />
                        </div>
                        <div class="min-w-0">
                          <h4 class="font-bold text-sm text-gray-900 truncate">
                            Positionnement précis sur la carte de Madagascar
                          </h4>
                          <p class="text-[11px] text-gray-500 truncate flex items-center gap-2">
                            <span>Cliquez pour placer le repère. La localité est détectée automatiquement.</span>
                            <span v-if="form.locality" class="font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                              📍 {{ form.locality }}
                            </span>
                          </p>
                        </div>
                      </div>

                      <div class="flex items-center gap-2 shrink-0">
                        <!-- Raccourcis villes en plein écran -->
                        <div class="hidden sm:flex items-center gap-1">
                          <span class="text-[10px] text-gray-400 font-semibold">Villes :</span>
                          <button
                            v-for="city in cityJumpList"
                            :key="'fs-' + city.name"
                            type="button"
                            @click="jumpToCity(city.coords, city.zoom)"
                            class="px-2 py-1 rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 text-[11px] font-medium text-gray-700 transition cursor-pointer"
                          >
                            {{ city.name }}
                          </button>
                        </div>

                        <!-- Bouton Fermer Plein Écran -->
                        <button
                          type="button"
                          @click="toggleMapFullscreen"
                          class="px-3 py-1.5 rounded-xl bg-primary text-white hover:bg-primary/90 text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                        >
                          <Minimize2 :size="13" />
                          <span>Valider & Réduire</span>
                        </button>
                      </div>
                    </div>

                    <!-- CADRE CARTE -->
                    <div
                      :class="isMapFullscreen
                        ? 'flex-1 w-full min-h-0 rounded-xl overflow-hidden border border-gray-300 relative shadow-inner bg-gray-100'
                        : 'h-56 sm:h-64 rounded-xl overflow-hidden border border-gray-300 relative shadow-inner bg-gray-100'"
                    >
                      <!-- Helper overlay banner -->
                      <div class="absolute top-2 left-2 z-[1000] bg-white/90 backdrop-blur-xs border border-gray-200 px-2.5 py-1 rounded-lg shadow-xs text-[10px] font-semibold text-gray-700 flex items-center gap-1.5 pointer-events-none">
                        <MapPin :size="12" class="text-primary animate-bounce" />
                        <span>Cliquez n'importe où pour pointer l'adresse</span>
                      </div>

                      <!-- Bouton flottant agrandir / réduire sur la carte -->
                      <button
                        type="button"
                        @click="toggleMapFullscreen"
                        class="absolute top-2 right-2 z-[1000] h-7 w-7 rounded-lg bg-white/90 hover:bg-white border border-gray-200 text-gray-700 hover:text-primary shadow-xs flex items-center justify-center transition cursor-pointer"
                        :title="isMapFullscreen ? 'Réduire la carte (Échap)' : 'Agrandir en plein écran'"
                      >
                        <component :is="isMapFullscreen ? Minimize2 : Maximize2" :size="13" />
                      </button>

                      <!-- CARTE VUE-LEAFLET -->
                      <LMap
                        ref="pickerMapRef"
                        :zoom="pickerZoom"
                        :center="pickerCenter"
                        @ready="onPickerMapReady"
                        @click="onMapClick"
                        class="w-full h-full z-0 cursor-crosshair"
                      >
                        <LTileLayer
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                          attribution="&copy; OpenStreetMap & Galana"
                        />

                        <!-- STATIONS GALANA EN AMBRE -->
                        <LCircleMarker
                          v-for="site in validSitesForMap"
                          :key="'site-' + site.id"
                          :lat-lng="[site.latitude!, site.longitude!]"
                          :radius="selectedSiteIds.includes(site.id) ? 7 : 5"
                          :color="selectedSiteIds.includes(site.id) ? '#FFFFFF' : '#D97706'"
                          :fill-color="selectedSiteIds.includes(site.id) ? '#059669' : '#F59E0B'"
                          :fill-opacity="0.9"
                          :weight="selectedSiteIds.includes(site.id) ? 2.5 : 1.5"
                          @click.stop="onSiteMarkerClick(site)"
                        >
                          <LTooltip :options="{ direction: 'top', offset: [0, -6] }">
                            <div class="text-[11px] p-0.5">
                              <span class="font-bold text-gray-900 block">⛽ {{ site.name }}</span>
                              <span class="text-gray-500 font-normal">{{ site.locality || site.code || 'Station Galana' }}</span>
                              <span
                                v-if="selectedSiteIds.includes(site.id)"
                                class="font-bold text-emerald-700 block mt-0.5"
                              >
                                ✓ Station couverte
                              </span>
                            </div>
                          </LTooltip>
                        </LCircleMarker>

                        <!-- RAYON DE COUVERTURE 15 KM (TRANSLUCIDE) -->
                        <LCircle
                          v-if="form.latitude !== null && form.longitude !== null"
                          :lat-lng="[form.latitude, form.longitude]"
                          :radius="15000"
                          :color="typeColor(form.type)"
                          :fill-color="typeColor(form.type)"
                          :fill-opacity="0.07"
                          :weight="1.5"
                          :dash-array="'4, 6'"
                        />

                        <!-- MARQUEUR DU CONTACT D'URGENCE SÉLECTIONNÉ -->
                        <LCircleMarker
                          v-if="form.latitude !== null && form.longitude !== null"
                          :lat-lng="[form.latitude, form.longitude]"
                          :radius="9"
                          :color="'#FFFFFF'"
                          :fill-color="typeColor(form.type)"
                          :fill-opacity="1"
                          :weight="3"
                        >
                          <LTooltip :options="{ permanent: false, direction: 'top', offset: [0, -8] }">
                            <div class="text-xs font-bold text-gray-900 p-0.5">
                              {{ typeEmoji(form.type) }} {{ form.name || 'Emplacement choisi' }}
                              <span class="block text-[10px] text-gray-500 font-normal">
                                [{{ form.latitude != null ? form.latitude.toFixed(4) : '' }}, {{ form.longitude != null ? form.longitude.toFixed(4) : '' }}]
                              </span>
                            </div>
                          </LTooltip>
                        </LCircleMarker>
                      </LMap>
                    </div>

                    <!-- PIED DE CARTE EN PLEIN ÉCRAN -->
                    <div v-if="isMapFullscreen" class="mt-3 pt-2.5 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2 shrink-0 text-xs">
                      <div class="flex items-center gap-3">
                        <span v-if="form.latitude != null && form.longitude != null" class="font-mono text-gray-600 bg-gray-100 px-2 py-1 rounded-md text-[11px]">
                          GPS : {{ Number(form.latitude).toFixed(5) }}, {{ Number(form.longitude).toFixed(5) }}
                        </span>
                        <span v-if="form.locality" class="font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md text-[11px] flex items-center gap-1">
                          <CheckCircle2 :size="12" class="text-emerald-600" />
                          <span>Localité auto : {{ form.locality }}</span>
                        </span>
                        <span class="text-gray-500 text-[11px]">
                          {{ selectedSiteIds.length }} station(s) Galana rattachée(s)
                        </span>
                      </div>
                      <button
                        type="button"
                        @click="toggleMapFullscreen"
                        class="px-4 py-1.5 rounded-xl bg-gray-900 text-white hover:bg-gray-800 font-bold text-xs transition cursor-pointer"
                      >
                        Terminer la sélection
                      </button>
                    </div>
                  </div>
                </div>
              </Teleport>

              <!-- INPUTS COORDONNÉES GPS & LOCALITÉ -->
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                <div>
                  <div class="flex items-center justify-between mb-1">
                    <label class="block font-semibold text-gray-700">
                      Localité / Ville <span class="text-red-500">*</span>
                    </label>
                    <span v-if="isResolvingLocality" class="text-[10px] text-primary flex items-center gap-1 font-normal">
                      <Loader2 :size="10" class="animate-spin" />
                      <span>Détection...</span>
                    </span>
                    <span v-else-if="form.locality" class="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                      <CheckCircle2 :size="10" class="text-emerald-600" />
                      <span>Auto</span>
                    </span>
                  </div>
                  <input
                    v-model="form.locality"
                    type="text"
                    required
                    placeholder="ex: ANTANANARIVO..."
                    class="w-full rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-800 outline-none focus:border-primary font-medium"
                  />
                </div>

                <div>
                  <label class="block font-semibold text-gray-700 mb-1">
                    Latitude GPS
                  </label>
                  <input
                    v-model.number="form.latitude"
                    type="number"
                    step="any"
                    placeholder="ex: -18.9055"
                    @change="onCoordinatesInputChange"
                    class="w-full rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-800 outline-none focus:border-primary font-mono"
                  />
                </div>

                <div>
                  <label class="block font-semibold text-gray-700 mb-1">
                    Longitude GPS
                  </label>
                  <input
                    v-model.number="form.longitude"
                    type="number"
                    step="any"
                    placeholder="ex: 47.5250"
                    @change="onCoordinatesInputChange"
                    class="w-full rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-800 outline-none focus:border-primary font-mono"
                  />
                </div>
              </div>

              <!-- BANDEAU DE CONFIRMATION / FEEDBACK PROXIMITÉ -->
              <div
                v-if="form.latitude !== null && form.longitude !== null"
                class="flex items-center justify-between p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px]"
              >
                <div class="flex items-center gap-1.5 min-w-0">
                  <CheckCircle2 :size="14" class="text-emerald-600 shrink-0" />
                  <span class="truncate">
                    Emplacement fixé [{{ form.latitude != null ? form.latitude.toFixed(4) : '' }}, {{ form.longitude != null ? form.longitude.toFixed(4) : '' }}]
                    <span v-if="nearbyStationsCount > 0" class="font-bold">
                      • {{ nearbyStationsCount }} station(s) à ≤ 15 km
                    </span>
                  </span>
                </div>
                <button
                  type="button"
                  @click="autoSelectNearestSites(15, true)"
                  class="font-bold text-emerald-700 hover:text-emerald-900 underline shrink-0 cursor-pointer text-[10px] ml-2"
                >
                  ⚡ Ré-appliquer auto-sélection
                </button>
              </div>
            </div>

            <!-- BLOC STATIONS GALANA COUVERTES -->
            <div class="rounded-xl border border-gray-200 bg-slate-50/50 p-3 space-y-2">
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                <div>
                  <label class="block font-semibold text-gray-800">
                    Stations-Service Galana couvertes
                  </label>
                  <p class="text-[10px] text-gray-500">
                    Classées par distance depuis l'emplacement GPS sélectionné.
                  </p>
                </div>

                <div class="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    @click="autoSelectNearestSites(15, true)"
                    class="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-500 text-white font-bold text-[10px] hover:bg-amber-600 shadow-2xs transition cursor-pointer"
                    title="Auto-sélectionner les stations à 15 km max"
                  >
                    <Sparkles :size="11" />
                    <span>Auto-sélection (≤ 15 km)</span>
                  </button>
                  <button
                    type="button"
                    @click="selectAllSites"
                    class="px-1.5 py-1 rounded-md border border-gray-200 bg-white hover:bg-gray-100 text-gray-600 text-[10px] font-semibold cursor-pointer"
                  >
                    Tout
                  </button>
                  <button
                    type="button"
                    @click="deselectAllSites"
                    class="px-1.5 py-1 rounded-md border border-gray-200 bg-white hover:bg-gray-100 text-gray-600 text-[10px] font-semibold cursor-pointer"
                  >
                    Aucun
                  </button>
                </div>
              </div>

              <!-- BARRE DE RECHERCHE DANS LES STATIONS -->
              <div class="relative">
                <Search :size="13" class="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  v-model="siteSearchQuery"
                  type="text"
                  placeholder="Filtrer les stations par nom ou ville..."
                  class="w-full rounded-lg border border-gray-200 bg-white pl-7 pr-3 py-1.5 text-[11px] text-gray-800 outline-none focus:border-primary placeholder:text-gray-400"
                />
              </div>

              <!-- LISTE DES STATIONS TRIÉES PAR PROXIMITÉ -->
              <div class="border border-gray-200 rounded-xl p-2 max-h-44 overflow-y-auto bg-white space-y-1">
                <div
                  v-for="site in sitesWithDistance"
                  :key="site.id"
                  @click="toggleSiteSelection(site.id)"
                  class="flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-lg border transition cursor-pointer select-none"
                  :class="selectedSiteIds.includes(site.id)
                    ? 'bg-amber-50/70 border-amber-300 text-amber-950 font-semibold'
                    : 'bg-white border-gray-100 hover:bg-gray-50 text-gray-700'"
                >
                  <div class="flex items-center gap-2 min-w-0">
                    <input
                      type="checkbox"
                      :checked="selectedSiteIds.includes(site.id)"
                      class="rounded text-primary focus:ring-primary h-3.5 w-3.5 cursor-pointer shrink-0"
                      @click.stop
                      @change="toggleSiteSelection(site.id)"
                    />
                    <div class="truncate">
                      <span class="text-xs block truncate">⛽ {{ site.name }}</span>
                      <span class="text-[10px] text-gray-400 block truncate">
                        {{ site.locality || site.province || site.code || 'Station' }}
                      </span>
                    </div>
                  </div>

                  <!-- BADGE DE DISTANCE -->
                  <div class="shrink-0">
                    <span
                      v-if="site.distance_km !== undefined"
                      class="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[10px] font-bold"
                      :class="site.distance_km <= 5
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : site.distance_km <= 15
                        ? 'bg-blue-100 text-blue-800 border border-blue-300'
                        : 'bg-gray-100 text-gray-600 border border-gray-200'"
                    >
                      <MapPin :size="10" />
                      <span>{{ formatDistance(site.distance_km) }}</span>
                    </span>
                    <span
                      v-else
                      class="text-[9px] text-gray-400 font-medium"
                    >
                      Sans GPS
                    </span>
                  </div>
                </div>

                <div
                  v-if="sitesWithDistance.length === 0"
                  class="text-center py-4 text-[11px] text-gray-400 italic"
                >
                  Aucune station ne correspond à votre recherche.
                </div>
              </div>

              <!-- COMPTEUR DES SÉLECTIONS -->
              <div class="flex items-center justify-between text-[10px] text-gray-500 pt-0.5">
                <span>{{ selectedSiteIds.length }} station(s) sélectionnée(s)</span>
                <span v-if="form.latitude && form.longitude" class="text-emerald-700 font-semibold">
                  Trié du plus proche au plus éloigné
                </span>
              </div>
            </div>

          </div>

        </div>
      </form>

      <!-- PIED DE MODAL AVEC ACTIONS -->
      <div class="flex items-center justify-between p-4 border-t border-gray-100 bg-slate-50 shrink-0">
        <span class="text-xs text-gray-500">
          <span class="text-red-500 font-bold">*</span> Champs obligatoires
        </span>

        <div class="flex items-center gap-2">
          <button
            type="button"
            @click="onClose"
            class="rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-100 transition cursor-pointer"
          >
            Annuler
          </button>

          <button
            type="button"
            :disabled="isSubmitting"
            @click="handleSubmit"
            class="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-primary/90 transition disabled:opacity-50 cursor-pointer"
          >
            <Loader2 v-if="isSubmitting" :size="14" class="animate-spin" />
            <span>{{ isEditing ? 'Enregistrer les modifications' : 'Créer le contact d’urgence' }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import "leaflet/dist/leaflet.css";
import {
  LCircle,
  LCircleMarker,
  LMap,
  LTileLayer,
  LTooltip,
} from "@vue-leaflet/vue-leaflet";
import {
  CheckCircle2,
  Compass,
  Crosshair,
  Loader2,
  MapPin,
  Maximize2,
  Minimize2,
  Phone,
  Search,
  Sparkles,
  X,
} from "@lucide/vue";
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from "vue";
import { toast } from "vue3-toastify";
import type {
  EmergencyContactFormType,
  EmergencyContactType,
  EmergencyType,
} from "../../../../@types/EmergencyContact.type";

export interface EmergencySiteOption {
  id: number;
  name: string;
  code?: string;
  locality?: string;
  province?: string;
  latitude?: number | null;
  longitude?: number | null;
  location?: {
    latitude?: number | string | null;
    longitude?: number | string | null;
    locality?: string;
    province?: string;
  };
}

interface Props {
  isOpen: boolean;
  contact?: EmergencyContactType | null;
  availableSites?: EmergencySiteOption[];
  isSubmitting?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  contact: null,
  availableSites: () => [],
  isSubmitting: false,
});

const emit = defineEmits<{
  (e: "close"): void;
  (e: "submit", form: EmergencyContactFormType): void;
}>();

const isEditing = computed(() => !!props.contact);

const pickerMapRef = ref<any>(null);
const pickerMapInstance = ref<any>(null);
const pickerZoom = ref(6);
const pickerCenter = ref<[number, number]>([-18.8792, 47.5079]);
const siteSearchQuery = ref("");
const isMapFullscreen = ref(false);
const isResolvingLocality = ref(false);
let reverseGeocodeAbortController: AbortController | null = null;

// Référentiel des principales villes et communes de Madagascar pour auto-détection immédiate
const MADAGASCAR_LOCALITIES: Array<{ name: string; lat: number; lng: number }> = [
  { name: "Antananarivo", lat: -18.9055, lng: 47.525 },
  { name: "Imeritsiatosika", lat: -18.9833, lng: 47.3167 },
  { name: "Arivonimamo", lat: -19.0167, lng: 47.1833 },
  { name: "Ambatolampy", lat: -19.3833, lng: 47.4167 },
  { name: "Antsirabe", lat: -19.8659, lng: 47.0333 },
  { name: "Toamasina", lat: -18.1492, lng: 49.4023 },
  { name: "Mahajanga", lat: -15.7188, lng: 46.3272 },
  { name: "Antsiranana", lat: -12.3088, lng: 49.2938 },
  { name: "Fianarantsoa", lat: -21.4408, lng: 47.0977 },
  { name: "Toliara", lat: -23.3508, lng: 43.6686 },
  { name: "Moramanga", lat: -18.9492, lng: 48.2301 },
  { name: "Brickaville", lat: -18.82, lng: 49.07 },
  { name: "Ambositra", lat: -20.53, lng: 47.24 },
  { name: "Manakara", lat: -22.14, lng: 48.01 },
  { name: "Farafangana", lat: -22.82, lng: 47.83 },
  { name: "Tolagnaro", lat: -25.03, lng: 46.99 },
  { name: "Morondava", lat: -20.29, lng: 44.28 },
  { name: "Ambanja", lat: -13.68, lng: 48.45 },
  { name: "Ambilobe", lat: -13.2, lng: 49.05 },
  { name: "Sambava", lat: -14.27, lng: 50.17 },
  { name: "Antalaha", lat: -14.9, lng: 50.28 },
  { name: "Nosy Be", lat: -13.31, lng: 48.26 },
  { name: "Sainte Marie", lat: -16.9, lng: 49.9 },
  { name: "Maevatanana", lat: -16.95, lng: 46.83 },
  { name: "Port-Bergé", lat: -15.57, lng: 47.62 },
  { name: "Miarinarivo", lat: -18.96, lng: 46.91 },
  { name: "Tsiroanomandidy", lat: -18.77, lng: 46.05 },
  { name: "Mandritsara", lat: -15.84, lng: 48.82 },
  { name: "Mananjary", lat: -21.22, lng: 48.33 },
  { name: "Ihosy", lat: -22.4, lng: 46.12 },
  { name: "Sakaraha", lat: -22.9, lng: 44.53 },
  { name: "Ivato", lat: -18.798, lng: 47.478 },
  { name: "Talatamaty", lat: -18.835, lng: 47.465 },
  { name: "Tanjombato", lat: -18.965, lng: 47.53 },
  { name: "Ilafy", lat: -18.855, lng: 47.555 },
  { name: "Sabotsy Namehana", lat: -18.825, lng: 47.55 },
  { name: "Ambohimanambola", lat: -18.935, lng: 47.605 },
  { name: "Ambohidratrimo", lat: -18.82, lng: 47.44 },
  { name: "Itaosy", lat: -18.925, lng: 47.48 },
  { name: "Anosizato", lat: -18.935, lng: 47.495 },
  { name: "Andoharanofotsy", lat: -18.975, lng: 47.545 },
];

const cityJumpList: Array<{ name: string; coords: [number, number]; zoom: number }> = [
  { name: "Tana", coords: [-18.9055, 47.525], zoom: 12 },
  { name: "Tamatave", coords: [-18.1492, 49.4023], zoom: 12 },
  { name: "Majunga", coords: [-15.7188, 46.3272], zoom: 12 },
  { name: "Diego", coords: [-12.3088, 49.2938], zoom: 12 },
  { name: "Fianar", coords: [-21.4408, 47.0977], zoom: 12 },
  { name: "Tuléar", coords: [-23.3508, 43.6686], zoom: 12 },
];

const form = ref<EmergencyContactFormType>({
  type: "POMPIER",
  name: "",
  locality: "",
  latitude: null,
  longitude: null,
  contact_1: "",
  contact_2: "",
  contact_3: "",
  email: "",
  address: "",
  notes: "",
  site_ids: [],
});

const selectedSiteIds = ref<number[]>([]);

// Helper pour extraire les coordonnées réelles d'une station
function getSiteCoordinates(site: EmergencySiteOption): { lat: number; lng: number } | null {
  const lat = site.latitude !== undefined && site.latitude !== null
    ? Number(site.latitude)
    : (site.location?.latitude ? parseFloat(String(site.location.latitude)) : null);

  const lng = site.longitude !== undefined && site.longitude !== null
    ? Number(site.longitude)
    : (site.location?.longitude ? parseFloat(String(site.location.longitude)) : null);

  if (lat !== null && !isNaN(lat) && lng !== null && !isNaN(lng)) {
    return { lat, lng };
  }
  return null;
}

// Calcul de distance Haversine en km
function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Rayon de la Terre en km
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

// Stations valides avec coordonnées pour affichage sur la carte
const validSitesForMap = computed(() => {
  return props.availableSites
    .map((s) => {
      const coords = getSiteCoordinates(s);
      if (!coords) return null;
      return {
        ...s,
        latitude: coords.lat,
        longitude: coords.lng,
      };
    })
    .filter((s): s is NonNullable<typeof s> => s !== null);
});

// Stations enrichies avec la distance par rapport au contact et triées
export interface SiteWithDistance extends EmergencySiteOption {
  distance_km?: number;
  is_nearby?: boolean;
}

const sitesWithDistance = computed<SiteWithDistance[]>(() => {
  const hasContactGps = form.value.latitude !== null && form.value.longitude !== null;

  const list: SiteWithDistance[] = props.availableSites.map((site) => {
    const coords = getSiteCoordinates(site);
    let distance_km: number | undefined = undefined;

    if (hasContactGps && coords) {
      distance_km = calculateDistanceKm(
        form.value.latitude!,
        form.value.longitude!,
        coords.lat,
        coords.lng
      );
    }

    return {
      ...site,
      latitude: coords ? coords.lat : (site.latitude ?? null),
      longitude: coords ? coords.lng : (site.longitude ?? null),
      locality: site.locality || site.location?.locality || "",
      province: site.province || site.location?.province || "",
      distance_km,
      is_nearby: distance_km !== undefined ? distance_km <= 15 : false,
    };
  });

  // Tri : du plus proche au plus éloigné, puis alphabétique
  list.sort((a, b) => {
    if (a.distance_km !== undefined && b.distance_km !== undefined) {
      return a.distance_km - b.distance_km;
    }
    if (a.distance_km !== undefined) return -1;
    if (b.distance_km !== undefined) return 1;
    return a.name.localeCompare(b.name);
  });

  // Filtrage par texte de recherche
  if (siteSearchQuery.value.trim()) {
    const q = siteSearchQuery.value.toLowerCase().trim();
    return list.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        (s.locality && s.locality.toLowerCase().includes(q)) ||
        (s.code && s.code.toLowerCase().includes(q))
    );
  }

  return list;
});

// Nombre de stations à moins de 15 km
const nearbyStationsCount = computed(() => {
  if (form.value.latitude === null || form.value.longitude === null) return 0;
  return sitesWithDistance.value.filter((s) => s.distance_km !== undefined && s.distance_km <= 15).length;
});

// Auto-sélection des stations proches (≤ maxRadiusKm)
function autoSelectNearestSites(maxRadiusKm = 15, notify = false) {
  if (form.value.latitude === null || form.value.longitude === null) {
    if (notify) toast.info("Veuillez d'abord sélectionner un emplacement sur la carte.");
    return;
  }

  const validSites = props.availableSites
    .map((s) => {
      const coords = getSiteCoordinates(s);
      if (!coords) return null;
      const d = calculateDistanceKm(form.value.latitude!, form.value.longitude!, coords.lat, coords.lng);
      return { id: s.id, name: s.name, locality: s.locality || s.location?.locality, distance: d };
    })
    .filter((s): s is NonNullable<typeof s> => s !== null);

  if (validSites.length === 0) return;

  validSites.sort((a, b) => a.distance - b.distance);

  // Stations dans le rayon demandé
  let nearby = validSites.filter((s) => s.distance <= maxRadiusKm);

  // Si aucune station dans ce rayon (ex: zone rurale isolée), prendre les 2 plus proches
  if (nearby.length === 0) {
    nearby = validSites.slice(0, 2);
  }

  selectedSiteIds.value = nearby.map((s) => s.id);

  if (notify) {
    toast.success(
      `${nearby.length} station(s) Galana proche(s) auto-sélectionnée(s) (≤ ${maxRadiusKm} km).`
    );
  }
}

// Résolution automatique de la localité / ville depuis les coordonnées cliquées
async function resolveLocalityFromCoordinates(lat: number, lng: number) {
  // 1. Détection immédiate locale : commune ou grande ville malgache la plus proche
  let closestName = "";
  let minDistance = Infinity;

  for (const city of MADAGASCAR_LOCALITIES) {
    const d = calculateDistanceKm(lat, lng, city.lat, city.lng);
    if (d < minDistance) {
      minDistance = d;
      closestName = city.name;
    }
  }

  // Vérifier également les stations Galana disponibles proches
  for (const site of props.availableSites) {
    const coords = getSiteCoordinates(site);
    const loc = site.locality || site.location?.locality;
    if (coords && loc) {
      const d = calculateDistanceKm(lat, lng, coords.lat, coords.lng);
      if (d < minDistance) {
        minDistance = d;
        closestName = loc;
      }
    }
  }

  // Si on est à moins de 25 km d'un repère connu, affecter immédiatement
  if (closestName && minDistance <= 25) {
    form.value.locality = closestName.toUpperCase();
  }

  // 2. Géocodage inverse OpenStreetMap Nominatim pour précision administrative
  if (reverseGeocodeAbortController) {
    reverseGeocodeAbortController.abort();
  }
  reverseGeocodeAbortController = new AbortController();
  isResolvingLocality.value = true;

  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=14&addressdetails=1`;
    const res = await fetch(url, {
      signal: reverseGeocodeAbortController.signal,
      headers: { "Accept-Language": "fr" },
    });
    if (res.ok) {
      const data = await res.json();
      const addr = data.address || {};
      const detectedCity =
        addr.town ||
        addr.village ||
        addr.city ||
        addr.municipality ||
        addr.suburb ||
        addr.hamlet ||
        addr.county ||
        addr.state_district ||
        addr.state;
      if (detectedCity && typeof detectedCity === "string") {
        form.value.locality = detectedCity.trim().toUpperCase();
        if (data.display_name && !form.value.address?.trim()) {
          const road = addr.road || addr.suburb || addr.neighbourhood;
          if (road) {
            form.value.address = road;
          }
        }
      }
    }
  } catch (err: any) {
    if (err.name !== "AbortError") {
      // Conserver la détection locale
    }
  } finally {
    isResolvingLocality.value = false;
  }
}

// Bascule mode plein écran pour la carte
function toggleMapFullscreen() {
  isMapFullscreen.value = !isMapFullscreen.value;
  refreshPickerMapSize();
}

function refreshPickerMapSize() {
  nextTick(() => {
    [30, 80, 180, 350, 600].forEach((delay) => {
      setTimeout(() => {
        if (pickerMapInstance.value) {
          try {
            if (typeof pickerMapInstance.value.invalidateSize === "function") {
              pickerMapInstance.value.invalidateSize();
            } else if (typeof pickerMapInstance.value.leafletObject?.invalidateSize === "function") {
              pickerMapInstance.value.leafletObject.invalidateSize();
            }
          } catch {}
        }
        if (pickerMapRef.value) {
          try {
            if (typeof pickerMapRef.value.invalidateSize === "function") {
              pickerMapRef.value.invalidateSize();
            } else if (typeof pickerMapRef.value.leafletObject?.invalidateSize === "function") {
              pickerMapRef.value.leafletObject.invalidateSize();
            }
          } catch {}
        }
      }, delay);
    });
  });
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === "Escape" && isMapFullscreen.value) {
    e.stopPropagation();
    isMapFullscreen.value = false;
    refreshPickerMapSize();
  }
}

onMounted(() => {
  window.addEventListener("keydown", onKeydown);
});

onUnmounted(() => {
  window.removeEventListener("keydown", onKeydown);
  if (reverseGeocodeAbortController) {
    reverseGeocodeAbortController.abort();
    reverseGeocodeAbortController = null;
  }
});

// Clic sur la carte Leaflet
function onMapClick(e: any) {
  if (!e || !e.latlng) return;
  const lat = Math.round(e.latlng.lat * 1000000) / 1000000;
  const lng = Math.round(e.latlng.lng * 1000000) / 1000000;

  form.value.latitude = lat;
  form.value.longitude = lng;

  // Détection automatique immédiate de la localité/ville
  resolveLocalityFromCoordinates(lat, lng);

  // Auto-sélectionner automatiquement les stations les plus proches
  autoSelectNearestSites(15, false);
}

// Clic sur un marker station Galana de la carte
function onSiteMarkerClick(site: EmergencySiteOption) {
  const coords = getSiteCoordinates(site);
  if (!coords) return;

  form.value.latitude = coords.lat;
  form.value.longitude = coords.lng;

  if (site.locality) {
    form.value.locality = site.locality.toUpperCase();
  } else {
    resolveLocalityFromCoordinates(coords.lat, coords.lng);
  }

  autoSelectNearestSites(15, false);

  if (!selectedSiteIds.value.includes(site.id)) {
    selectedSiteIds.value.push(site.id);
  }

  toast.info(`Emplacement calé sur la station Galana ${site.name}`);
}

// Changement manuel des coordonnées dans les champs input
function onCoordinatesInputChange() {
  if (form.value.latitude != null && form.value.longitude != null) {
    const lat = Number(form.value.latitude);
    const lng = Number(form.value.longitude);
    if (!isNaN(lat) && !isNaN(lng)) {
      if (pickerMapInstance.value) {
        pickerMapInstance.value.setView([lat, lng], 13);
      }
      resolveLocalityFromCoordinates(lat, lng);
      autoSelectNearestSites(15, false);
    }
  }
}

// Raccourcis villes
function jumpToCity(coords: [number, number], targetZoom = 12) {
  pickerCenter.value = coords;
  pickerZoom.value = targetZoom;
  if (pickerMapInstance.value) {
    pickerMapInstance.value.setView(coords, targetZoom, { animate: true });
  }
}

function onPickerMapReady(map: any) {
  pickerMapInstance.value = map;
  setTimeout(() => {
    map.invalidateSize();
  }, 250);
}

function selectAllSites() {
  selectedSiteIds.value = props.availableSites.map((s) => s.id);
}

function deselectAllSites() {
  selectedSiteIds.value = [];
}

function toggleSiteSelection(id: number) {
  const index = selectedSiteIds.value.indexOf(id);
  if (index >= 0) {
    selectedSiteIds.value.splice(index, 1);
  } else {
    selectedSiteIds.value.push(id);
  }
}

watch(
  () => props.isOpen,
  (open) => {
    if (open) {
      nextTick(() => {
        setTimeout(() => {
          if (pickerMapInstance.value) {
            pickerMapInstance.value.invalidateSize();
            if (form.value.latitude && form.value.longitude) {
              pickerMapInstance.value.setView([form.value.latitude, form.value.longitude], 13);
            }
          }
        }, 300);
      });
    }
  }
);

watch(
  () => props.contact,
  (newVal) => {
    if (newVal) {
      form.value = {
        type: newVal.type,
        name: newVal.name,
        locality: newVal.locality || "",
        latitude: newVal.latitude || null,
        longitude: newVal.longitude || null,
        contact_1: newVal.contact_1 || "",
        contact_2: newVal.contact_2 || "",
        contact_3: newVal.contact_3 || "",
        email: newVal.email || "",
        address: newVal.address || "",
        notes: newVal.notes || "",
        site_ids: newVal.sites ? newVal.sites.map((s) => s.id) : [],
      };
      selectedSiteIds.value = newVal.sites ? newVal.sites.map((s) => s.id) : [];

      if (newVal.latitude && newVal.longitude) {
        pickerCenter.value = [newVal.latitude, newVal.longitude];
        pickerZoom.value = 13;
      }
    } else {
      form.value = {
        type: "POMPIER",
        name: "",
        locality: "",
        latitude: null,
        longitude: null,
        contact_1: "",
        contact_2: "",
        contact_3: "",
        email: "",
        address: "",
        notes: "",
        site_ids: [],
      };
      selectedSiteIds.value = [];
      pickerCenter.value = [-18.8792, 47.5079];
      pickerZoom.value = 6;
    }
  },
  { immediate: true }
);

function handleSubmit() {
  if (!form.value.name.trim() || !form.value.contact_1.trim()) {
    toast.error("Veuillez renseigner le nom et au moins un numéro de téléphone d'urgence.");
    return;
  }
  form.value.site_ids = [...selectedSiteIds.value];
  emit("submit", { ...form.value });
}

function onClose() {
  emit("close");
}

function typeColor(type: EmergencyType | string) {
  switch (type) {
    case "POMPIER":
      return "#DC2626";
    case "HOPITAL":
      return "#059669";
    case "AMBULANCE":
      return "#0284C7";
    case "POLICE":
      return "#4F46E5";
    case "GENDARMERIE":
      return "#7C3AED";
    default:
      return "#EA580C";
  }
}

function typeEmoji(type: EmergencyType | string) {
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
</script>
