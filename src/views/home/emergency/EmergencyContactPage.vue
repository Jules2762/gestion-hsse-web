<template>
  <div class="min-h-screen bg-background text-text-primary pb-12">
    <!-- HEADER GLOBAL -->
    <Header title="emergency.title" :thumbnails="[
      { label: 'thumbnails.home', name: 'DASHBOARD' },
      { label: 'thumbnails.emergency', name: 'EMERGENCY' }
    ]" />

    <div class="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto space-y-5">

      <!-- ========================================================= -->
      <!-- 1. CARTES KPI / SYNTHÈSE DES SECOURS NATIONAUX           -->
      <!-- ========================================================= -->
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <!-- Total Secours -->
        <div class="rounded-2xl border border-border bg-surface p-3.5 shadow-2xs flex flex-col justify-between">
          <div class="flex items-center justify-between">
            <span class="text-[11px] font-semibold text-text-secondary">Secours Répertoriés</span>
            <div class="h-7 w-7 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
              <PhoneCall :size="14" />
            </div>
          </div>
          <div class="mt-1.5">
            <span class="text-xl font-black text-gray-900">{{ mapStats.total_contacts || contacts.length }}</span>
            <span class="text-[10px] text-gray-500 block">Services d'intervention</span>
          </div>
        </div>

        <!-- Pompiers -->
        <div class="rounded-2xl border border-red-200/60 bg-red-50/40 p-3.5 shadow-2xs flex flex-col justify-between">
          <div class="flex items-center justify-between">
            <span class="text-[11px] font-bold text-red-900">Sapeurs-Pompiers</span>
            <div class="h-7 w-7 rounded-lg bg-red-600 text-white flex items-center justify-center font-bold shadow-xs">
              🚒
            </div>
          </div>
          <div class="mt-1.5">
            <span class="text-xl font-black text-red-700">{{ countByType('POMPIER') }}</span>
            <span class="text-[10px] text-red-600 block">Centres de secours (118)</span>
          </div>
        </div>

        <!-- Hôpitaux -->
        <div class="rounded-2xl border border-emerald-200/60 bg-emerald-50/40 p-3.5 shadow-2xs flex flex-col justify-between">
          <div class="flex items-center justify-between">
            <span class="text-[11px] font-bold text-emerald-900">Hôpitaux & CHU</span>
            <div class="h-7 w-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold shadow-xs">
              🏥
            </div>
          </div>
          <div class="mt-1.5">
            <span class="text-xl font-black text-emerald-700">{{ countByType('HOPITAL') }}</span>
            <span class="text-[10px] text-emerald-600 block">Urgences médicales</span>
          </div>
        </div>

        <!-- Ambulances -->
        <div class="rounded-2xl border border-sky-200/60 bg-sky-50/40 p-3.5 shadow-2xs flex flex-col justify-between">
          <div class="flex items-center justify-between">
            <span class="text-[11px] font-bold text-sky-900">Ambulances SAMU</span>
            <div class="h-7 w-7 rounded-lg bg-sky-500 text-white flex items-center justify-center font-bold shadow-xs">
              🚑
            </div>
          </div>
          <div class="mt-1.5">
            <span class="text-xl font-black text-sky-700">{{ countByType('AMBULANCE') }}</span>
            <span class="text-[10px] text-sky-600 block">Unités d'intervention</span>
          </div>
        </div>

        <!-- Forces de l'ordre -->
        <div class="rounded-2xl border border-indigo-200/60 bg-indigo-50/40 p-3.5 shadow-2xs flex flex-col justify-between">
          <div class="flex items-center justify-between">
            <span class="text-[11px] font-bold text-indigo-900">Forces de l'Ordre</span>
            <div class="h-7 w-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold shadow-xs">
              👮
            </div>
          </div>
          <div class="mt-1.5">
            <span class="text-xl font-black text-indigo-700">
              {{ countByType('POLICE') + countByType('GENDARMERIE') }}
            </span>
            <span class="text-[10px] text-indigo-600 block">Police & Gendarmerie</span>
          </div>
        </div>

        <!-- Stations Galana (SS) -->
        <div class="rounded-2xl border border-amber-200/60 bg-amber-50/40 p-3.5 shadow-2xs flex flex-col justify-between">
          <div class="flex items-center justify-between">
            <span class="text-[11px] font-bold text-amber-900">Stations Galana</span>
            <div class="h-7 w-7 rounded-lg bg-amber-500 text-white flex items-center justify-center font-bold shadow-xs">
              ⛽
            </div>
          </div>
          <div class="mt-1.5">
            <span class="text-xl font-black text-amber-700">{{ sites.length }}</span>
            <span class="text-[10px] text-amber-600 block">Stations-Services (SS)</span>
          </div>
        </div>
      </div>

      <!-- ========================================================= -->
      <!-- 2. SECTION PRINCIPALE À 2 COLONNES : ANNUAIRE & CARTE     -->
      <!-- ========================================================= -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">

        <!-- ======================================================= -->
        <!-- COLONNE GAUCHE (6 cols) : ANNUAIRE ET SECOURS PROCHES   -->
        <!-- ======================================================= -->
        <div class="lg:col-span-6 space-y-4">
          <div class="rounded-2xl border border-border bg-surface p-4 sm:p-5 shadow-2xs space-y-4">

            <!-- EN-TÊTE DE L'ANNUAIRE & ACTIONS -->
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 class="text-sm sm:text-base font-bold text-gray-900 flex items-center gap-2">
                  <BookOpen :size="17" class="text-primary" />
                  <span>Annuaire Opérationnel des Secours</span>
                </h3>
                <p class="text-xs text-gray-500">
                  Cliquez sur un secours pour le localiser sur la carte.
                </p>
              </div>

              <!-- Actions : Exporter, Actualiser, Nouveau secours -->
              <div class="flex items-center gap-2 flex-wrap">
                <ButtonFilter
                  :text="'Exporter'"
                  @click="exportData"
                  :loading="loading_export"
                  :icon="DownloadIcon"
                  :badge="filteredDirectoryContacts.length.toString()"
                />
                <ButtonFilter
                  :text="'Actualiser'"
                  @click="loadData"
                  :loading="mapLoading"
                  :icon="RefreshCw"
                />
                <button
                  type="button"
                  @click="openAddModal"
                  class="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3 py-1.5 text-xs font-semibold text-white shadow-2xs hover:bg-primary/90 transition cursor-pointer shrink-0"
                >
                  <Plus :size="14" />
                  <span>Nouveau secours</span>
                </button>
              </div>
            </div>

            <!-- FILTRE DE PROXIMITÉ PAR STATION-SERVICE GALANA (SS) - RECHERCHE AMÉLIORÉE -->
            <div class="p-3.5 rounded-2xl bg-amber-50/90 border border-amber-200 shadow-2xs space-y-2.5 relative">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <div class="h-6 w-6 rounded-lg bg-amber-500/20 text-amber-800 flex items-center justify-center font-bold">
                    <Fuel :size="14" class="text-amber-700" />
                  </div>
                  <div>
                    <span class="text-xs font-bold text-amber-950 block">Proximité d'une Station-Service (SS) Galana</span>
                    <span class="text-[10px] text-amber-700">Calcul automatique des secours les plus proches</span>
                  </div>
                </div>
                <button
                  v-if="selectedStation"
                  type="button"
                  @click="clearStationSelection"
                  class="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 hover:text-red-700 bg-white/80 hover:bg-white px-2 py-0.5 rounded-lg border border-amber-300 transition cursor-pointer"
                  title="Désélectionner la station"
                >
                  <XIcon :size="12" />
                  <span>Réinitialiser</span>
                </button>
              </div>

              <!-- Sélecteur interactif avec recherche dynamique -->
              <div class="relative">
                <button
                  type="button"
                  @click="isStationDropdownOpen = !isStationDropdownOpen"
                  class="w-full rounded-xl border bg-white px-3.5 py-2 text-left text-xs font-medium text-gray-800 outline-none transition flex items-center justify-between gap-2 shadow-2xs cursor-pointer hover:border-amber-400"
                  :class="isStationDropdownOpen ? 'border-amber-500 ring-2 ring-amber-500/20' : 'border-amber-300'"
                >
                  <div class="flex items-center gap-2 min-w-0">
                    <span class="text-base shrink-0">{{ selectedStation ? '⛽' : '🔍' }}</span>
                    <div v-if="selectedStation" class="min-w-0 truncate">
                      <span class="font-bold text-gray-900">{{ selectedStation.name }}</span>
                      <span class="text-gray-500 text-[11px] ml-1.5">— {{ selectedStation.locality || 'Madagascar' }} ({{ selectedStation.province || 'National' }})</span>
                    </div>
                    <span v-else class="text-gray-400 font-normal truncate">
                      Rechercher ou choisir une station Galana (ou cliquer sur un repère ⛽ de la carte)...
                    </span>
                  </div>
                  <div class="flex items-center gap-1 shrink-0 text-gray-400">
                    <span v-if="sites.length" class="text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded-md">
                      {{ sites.length }} SS
                    </span>
                    <ChevronDown :size="14" class="transition-transform duration-200" :class="{ 'rotate-180': isStationDropdownOpen }" />
                  </div>
                </button>

                <!-- Overlay pour fermer le popover en cliquant en dehors -->
                <div
                  v-if="isStationDropdownOpen"
                  class="fixed inset-0 z-40"
                  @click="isStationDropdownOpen = false"
                />

                <!-- Popover déroulant de sélection avec recherche instantanée -->
                <div
                  v-if="isStationDropdownOpen"
                  class="absolute left-0 right-0 top-full mt-1.5 z-50 rounded-2xl border border-gray-200 bg-white p-3 shadow-xl space-y-2.5 max-h-96 flex flex-col"
                >
                  <!-- Champ de recherche interne -->
                  <div class="relative">
                    <Search :size="14" class="absolute left-3 top-2.5 text-gray-400" />
                    <input
                      v-model="stationSearchQuery"
                      type="text"
                      placeholder="Filtrer par nom de station, ville, province..."
                      class="w-full rounded-xl border border-gray-200 bg-gray-50 pl-8.5 pr-8 py-1.5 text-xs text-gray-800 outline-none focus:border-amber-500 focus:bg-white"
                      autofocus
                    />
                    <button
                      v-if="stationSearchQuery"
                      type="button"
                      @click="stationSearchQuery = ''"
                      class="absolute right-2.5 top-2 text-gray-400 hover:text-gray-600"
                    >
                      <XIcon :size="13" />
                    </button>
                  </div>

                  <!-- Onglets de filtrage par province -->
                  <div v-if="stationProvinces.length > 1" class="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-hide text-[10px]">
                    <button
                      type="button"
                      @click="stationProvinceFilter = 'ALL'"
                      class="px-2 py-0.5 rounded-lg font-semibold transition shrink-0 cursor-pointer border"
                      :class="stationProvinceFilter === 'ALL'
                        ? 'bg-amber-600 text-white border-amber-600'
                        : 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200'"
                    >
                      Toutes ({{ sites.length }})
                    </button>
                    <button
                      v-for="prov in stationProvinces"
                      :key="prov"
                      type="button"
                      @click="stationProvinceFilter = prov"
                      class="px-2 py-0.5 rounded-lg font-semibold transition shrink-0 cursor-pointer border"
                      :class="stationProvinceFilter === prov
                        ? 'bg-amber-600 text-white border-amber-600'
                        : 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200'"
                    >
                      {{ prov }}
                    </button>
                  </div>

                  <!-- Liste scrollable des stations -->
                  <div class="overflow-y-auto space-y-1 max-h-56 pr-1 divide-y divide-gray-50">
                    <button
                      v-for="st in filteredStations"
                      :key="st.id"
                      type="button"
                      @click="selectStation(st)"
                      class="w-full text-left p-2 rounded-xl text-xs flex items-center justify-between gap-2 hover:bg-amber-50/80 transition cursor-pointer group"
                      :class="selectedStation?.id === st.id ? 'bg-amber-100/70 font-bold text-amber-950' : 'text-gray-700'"
                    >
                      <div class="flex items-center gap-2 min-w-0">
                        <span class="text-base shrink-0">⛽</span>
                        <div class="min-w-0">
                          <div class="font-bold text-gray-900 group-hover:text-amber-800 truncate">
                            {{ st.name }}
                          </div>
                          <div class="text-[11px] text-gray-500 truncate">
                            {{ st.locality || 'Madagascar' }}
                          </div>
                        </div>
                      </div>
                      <div class="flex items-center gap-1.5 shrink-0">
                        <span v-if="st.province" class="text-[9px] font-semibold uppercase px-1.5 py-0.5 rounded-md bg-gray-100 text-gray-600 group-hover:bg-amber-200/60">
                          {{ st.province }}
                        </span>
                        <Check v-if="selectedStation?.id === st.id" :size="14" class="text-amber-600 shrink-0" />
                      </div>
                    </button>

                    <!-- État vide -->
                    <div v-if="filteredStations.length === 0" class="py-6 text-center text-xs text-gray-400">
                      Aucune station Galana ne correspond à votre recherche.
                    </div>
                  </div>
                </div>
              </div>

              <!-- Bannière Station Active -->
              <div
                v-if="selectedStation"
                class="flex items-center justify-between text-[11px] text-amber-900 bg-white/80 rounded-xl p-2.5 border border-amber-200 shadow-2xs"
              >
                <span class="flex items-center gap-1.5">
                  <span class="text-sm">🎯</span>
                  <span>Secours classés par <strong>proximité</strong> avec :</span>
                  <strong class="underline font-bold">{{ selectedStation.name }}</strong>
                </span>
                <span class="font-mono text-[10px] text-amber-800 font-bold bg-amber-100 px-2 py-0.5 rounded-md">
                  {{ filteredDirectoryContacts.length }} secours à proximité
                </span>
              </div>
            </div>

            <!-- RECHERCHE TEXTUELLE GLOBALE & FILTRE PROVINCE -->
            <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <!-- Recherche rapide avec bouton effacer -->
              <div class="relative flex-1">
                <Search :size="14" class="absolute left-3 top-2.5 text-gray-400" />
                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="Rechercher service, ville, tél, adresse..."
                  class="w-full rounded-xl border border-gray-200 bg-gray-50/50 pl-8.5 pr-8 py-1.5 text-xs text-gray-800 outline-none focus:border-primary focus:bg-white"
                />
                <button
                  v-if="searchQuery"
                  type="button"
                  @click="searchQuery = ''"
                  class="absolute right-2.5 top-2 text-gray-400 hover:text-gray-600"
                >
                  <XIcon :size="13" />
                </button>
              </div>

              <!-- Filtre Province -->
              <select
                v-model="selectedProvinceFilter"
                class="rounded-xl border border-gray-200 bg-gray-50/50 px-3 py-1.5 text-xs font-medium text-gray-700 outline-none focus:border-primary shrink-0 cursor-pointer"
              >
                <option value="ALL">Toutes provinces ({{ contacts.length }})</option>
                <option v-for="prov in provinceList" :key="prov" :value="prov">{{ prov }}</option>
              </select>

              <!-- Bouton reset si filtres actifs -->
              <button
                v-if="searchQuery || selectedCategory !== 'ALL' || selectedProvinceFilter !== 'ALL' || selectedStation"
                type="button"
                @click="resetFilters"
                class="text-xs text-primary hover:underline font-semibold shrink-0 cursor-pointer px-1"
              >
                Effacer filtres
              </button>
            </div>

            <!-- CHIPS DE FILTRAGE PAR TYPE DE SERVICE -->
            <div class="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-hide text-xs">
              <button
                v-for="cat in categoryChips"
                :key="cat.id"
                type="button"
                @click="selectedCategory = cat.id"
                class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl font-semibold transition cursor-pointer shrink-0 select-none border text-[11px]"
                :class="selectedCategory === cat.id
                  ? 'bg-gray-900 text-white border-gray-900 shadow-2xs'
                  : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'"
              >
                <span>{{ cat.icon }}</span>
                <span>{{ cat.label }}</span>
                <span
                  class="rounded-full px-1.5 py-0.2 text-[10px]"
                  :class="selectedCategory === cat.id ? 'bg-white/20 text-white' : 'bg-gray-200/80 text-gray-700'"
                >
                  {{ cat.count }}
                </span>
              </button>
            </div>

            <!-- LISTE / GRILLE DES CONTACTS D'URGENCE -->
            <div
              v-if="filteredDirectoryContacts.length > 0"
              class="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[calc(100vh-320px)] min-h-[400px] overflow-y-auto pr-1"
            >
              <div
                v-for="contact in filteredDirectoryContacts"
                :key="contact.id"
                @click="handleCardClick(contact)"
                class="rounded-2xl border p-3.5 shadow-2xs transition-all flex flex-col justify-between group relative cursor-pointer"
                :class="selectedContactId === contact.id
                  ? 'border-primary ring-2 ring-primary/30 bg-primary/5 shadow-sm'
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-xs'"
              >
                <div>
                  <!-- En-tête de la carte -->
                  <div class="flex items-start justify-between gap-2">
                    <div class="flex items-start gap-2 min-w-0">
                      <div
                        class="h-8 w-8 rounded-xl flex items-center justify-center text-xs font-bold shadow-2xs shrink-0"
                        :style="{ backgroundColor: typeTheme(contact.type).bg, color: typeTheme(contact.type).text }"
                      >
                        {{ typeTheme(contact.type).icon }}
                      </div>
                      <div class="min-w-0">
                        <div class="flex items-center gap-1.5 flex-wrap">
                          <span
                            class="inline-block px-1.5 py-0.2 rounded-full text-[9px] font-bold uppercase tracking-wider"
                            :style="{ backgroundColor: typeTheme(contact.type).badgeBg, color: typeTheme(contact.type).badgeText }"
                          >
                            {{ typeTheme(contact.type).label }}
                          </span>

                          <!-- Badge distance si une station est active -->
                          <span
                            v-if="contact.distance_km !== undefined && contact.distance_km !== 99999"
                            class="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded-full text-[10px] font-bold"
                            :class="contact.distance_km < 5
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : contact.distance_km < 15
                              ? 'bg-blue-100 text-blue-800 border border-blue-300'
                              : 'bg-amber-100 text-amber-900 border border-amber-300'"
                          >
                            <MapPin :size="10" />
                            <span>{{ formatDistance(contact.distance_km) }}</span>
                          </span>
                        </div>

                        <h4 class="font-bold text-gray-900 text-xs sm:text-sm mt-1 leading-snug line-clamp-1">
                          {{ contact.name }}
                        </h4>
                        <p class="text-[10px] text-gray-500 font-medium flex items-center gap-1 mt-0.5 truncate">
                          <MapPin :size="10" class="text-gray-400 shrink-0" />
                          <span class="truncate">{{ contact.locality || 'Madagascar' }}</span>
                          <span v-if="contact.location?.province" class="text-gray-400 truncate">
                            ({{ contact.location.province }})
                          </span>
                        </p>
                      </div>
                    </div>

                    <!-- Actions d'édition / suppression -->
                    <div class="flex items-center gap-0.5 shrink-0" @click.stop>
                      <button
                        type="button"
                        @click="openEditModal(contact)"
                        title="Modifier"
                        class="h-6 w-6 rounded-md hover:bg-gray-100 text-gray-400 hover:text-gray-700 flex items-center justify-center transition"
                      >
                        <Edit3 :size="12" />
                      </button>
                      <button
                        type="button"
                        @click="confirmDelete(contact)"
                        title="Supprimer"
                        class="h-6 w-6 rounded-md hover:bg-red-50 text-gray-400 hover:text-red-600 flex items-center justify-center transition"
                      >
                        <Trash2 :size="12" />
                      </button>
                    </div>
                  </div>

                  <!-- Téléphone principal d'urgence -->
                  <div class="mt-3 space-y-1">
                    <div
                      v-if="contact.contact_1 || contact.phone"
                      class="flex items-center justify-between p-1.5 px-2 rounded-xl bg-emerald-50/70 border border-emerald-200/80"
                      @click.stop
                    >
                      <div class="flex items-center gap-1.5 truncate mr-1">
                        <span class="text-emerald-700 text-xs">📞</span>
                        <span class="font-mono font-bold text-emerald-900 text-xs tracking-wide truncate">
                          {{ contact.contact_1 || contact.phone }}
                        </span>
                      </div>
                      <div class="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          @click="copyPhone(contact.contact_1 || contact.phone || '')"
                          class="px-1.5 py-0.5 rounded bg-white text-gray-700 text-[9px] font-semibold hover:bg-gray-100 border border-gray-200 transition"
                          title="Copier"
                        >
                          Copier
                        </button>
                        <a
                          :href="'tel:' + (contact.contact_1 || contact.phone)"
                          class="px-2 py-0.5 rounded bg-emerald-600 text-white text-[9px] font-bold hover:bg-emerald-700 transition"
                        >
                          Appeler
                        </a>
                      </div>
                    </div>

                    <!-- Téléphone secondaire -->
                    <div
                      v-if="contact.contact_2"
                      class="flex items-center justify-between p-1 px-2 rounded-lg bg-gray-50 border border-gray-200 text-[10px]"
                      @click.stop
                    >
                      <span class="text-gray-600 truncate">Ligne 2 : {{ contact.contact_2 }}</span>
                      <a
                        :href="'tel:' + contact.contact_2"
                        class="text-primary font-bold hover:underline shrink-0 ml-1"
                      >
                        Appeler
                      </a>
                    </div>

                    <!-- STATIONS-SERVICE (SS) GALANA LES PLUS PROCHES -->
                    <div
                      v-if="getNearestSitesForContact(contact).length > 0"
                      class="mt-2.5 pt-2 border-t border-dashed border-gray-200/90 flex flex-col gap-1.5"
                      @click.stop
                    >
                      <div class="flex items-center justify-between text-[10px] font-bold text-amber-950">
                        <span class="flex items-center gap-1">
                          <Fuel :size="12" class="text-amber-600 shrink-0" />
                          <span>Stations Galana les plus proches :</span>
                        </span>
                        <span class="text-[9px] text-amber-700 font-semibold">
                          {{ getNearestSitesForContact(contact).length }} SS
                        </span>
                      </div>

                      <div class="flex flex-wrap gap-1">
                        <button
                          v-for="st in getNearestSitesForContact(contact)"
                          :key="st.id"
                          type="button"
                          @click="handleSelectStationFromCard(st)"
                          class="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] transition cursor-pointer border shadow-2xs group/st"
                          :class="selectedStation?.id === st.id
                            ? 'bg-amber-600 text-white border-amber-600 font-bold'
                            : 'bg-amber-50/80 hover:bg-amber-100 text-amber-950 border-amber-200 hover:border-amber-300'"
                          :title="'Centrer sur la station ' + st.name + ' (' + formatDistance(st.distance_km) + ') sur la carte'"
                        >
                          <span class="font-bold text-amber-900" :class="{ '!text-white': selectedStation?.id === st.id }">⛽ {{ st.name }}</span>
                          <span
                            class="font-mono text-[9px] px-1 py-0.2 rounded font-semibold"
                            :class="selectedStation?.id === st.id
                              ? 'bg-white/20 text-white'
                              : st.distance_km < 5
                              ? 'bg-emerald-100 text-emerald-800'
                              : st.distance_km < 25
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-gray-100 text-gray-700'"
                          >
                            {{ formatDistance(st.distance_km) }}
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Footer carte avec bouton centrer -->
                <div class="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between text-[10px]">
                  <span
                    class="font-semibold text-primary group-hover:underline flex items-center gap-1"
                  >
                    <Compass :size="11" />
                    <span>Sélectionner sur la carte</span>
                  </span>

                  <span
                    v-if="contact.latitude && contact.longitude"
                    class="text-gray-400 font-mono text-[9px]"
                  >
                    GPS OK
                  </span>
                </div>
              </div>
            </div>

            <!-- ÉTAT VIDE -->
            <div
              v-else
              class="rounded-2xl border border-dashed border-gray-300 p-8 text-center flex flex-col items-center justify-center gap-2"
            >
              <div class="h-10 w-10 rounded-2xl bg-gray-100 text-gray-400 flex items-center justify-center text-lg">
                🔍
              </div>
              <h4 class="text-xs sm:text-sm font-bold text-gray-800">Aucun service de secours correspondant</h4>
              <p class="text-[11px] text-gray-500 max-w-xs">
                Aucun contact d'urgence ne correspond à vos filtres ou à votre recherche.
              </p>
              <button
                type="button"
                @click="resetFilters"
                class="mt-1 text-xs font-bold text-primary hover:underline cursor-pointer"
              >
                Réinitialiser les filtres
              </button>
            </div>
          </div>
        </div>

        <!-- ======================================================= -->
        <!-- COLONNE DROITE (6 cols) : CARTOGRAPHIE DYNAMIQUE       -->
        <!-- ======================================================= -->
        <div class="lg:col-span-6 lg:sticky lg:top-4">
          <EmergencyMap
            ref="emergencyMapRef"
            :contacts="contactsWithDistance"
            :sites="sites"
            :loading="mapLoading"
            :selected-contact-id="selectedContactId"
            :selected-station-id="selectedStation?.id"
            @select-contact="handleSelectContactFromMap"
            @select-station="handleSelectStationFromMap"
            @clear-selection="clearStationSelection"
          />
        </div>

      </div>
    </div>

    <!-- MODAL D'AJOUT / ÉDITION -->
    <EmergencyContactModal
      :is-open="isModalOpen"
      :contact="selectedContactForEdit"
      :available-sites="modalSites"
      :is-submitting="isSubmitting"
      @close="closeModal"
      @submit="handleModalSubmit"
    />

    <!-- MODAL DE CONFIRMATION DE SUPPRESSION -->
    <div
      v-if="contactToDelete"
      class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-xs p-4"
    >
      <div class="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl space-y-4">
        <div class="flex items-center gap-3">
          <div class="h-10 w-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
            <Trash2 :size="20" />
          </div>
          <div>
            <h4 class="font-bold text-gray-900 text-sm">Supprimer le secours</h4>
            <p class="text-xs text-gray-500">Cette action est irréversible.</p>
          </div>
        </div>

        <p class="text-xs text-gray-700">
          Êtes-vous sûr de vouloir supprimer définitivement le contact
          <strong class="text-gray-900">« {{ contactToDelete.name }} »</strong> ?
        </p>

        <div class="flex items-center justify-end gap-2 pt-2">
          <button
            type="button"
            @click="contactToDelete = null"
            class="rounded-xl border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-100 transition cursor-pointer"
          >
            Annuler
          </button>
          <button
            type="button"
            @click="executeDelete"
            class="rounded-xl bg-red-600 px-4 py-2 text-xs font-semibold text-white hover:bg-red-700 transition cursor-pointer shadow-xs"
          >
            Supprimer définitivement
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  BookOpen,
  Check,
  ChevronDown,
  Compass,
  DownloadIcon,
  Edit3,
  Fuel,
  MapPin,
  PhoneCall,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  XIcon,
} from "@lucide/vue";
import { computed, onMounted, ref } from "vue";
import { toast } from "vue3-toastify";
import Header from "../../../components/shared/Header.vue";
import ButtonFilter from "../../../components/ui/ButtonFilter.vue";
import { exportUtils } from "../../../core/utils/export.utils.ts";
import emergencyContactService from "../../../core/services/emergencyContact.service";
import type {
  EmergencyContactFormType,
  EmergencyContactType,
  EmergencySiteType,
  EmergencyType,
} from "../../../@types/EmergencyContact.type";
import EmergencyMap from "./components/EmergencyMap.vue";
import EmergencyContactModal from "./components/EmergencyContactModal.vue";

const contacts = ref<EmergencyContactType[]>([]);
const sites = ref<EmergencySiteType[]>([]);
const availableSites = ref<any[]>([]);
const mapLoading = ref(true);
const isSubmitting = ref(false);

// Sites Galana combinés avec coordonnées GPS pour le modal d'ajout/édition
const modalSites = computed(() => {
  const map = new Map<number, any>();

  availableSites.value.forEach((s: any) => {
    map.set(s.id, {
      id: s.id,
      name: s.name,
      code: s.code,
      locality: s.locality || s.location?.locality,
      province: s.province || s.location?.province,
      latitude: s.latitude !== undefined && s.latitude !== null ? Number(s.latitude) : (s.location?.latitude ? parseFloat(String(s.location.latitude)) : null),
      longitude: s.longitude !== undefined && s.longitude !== null ? Number(s.longitude) : (s.location?.longitude ? parseFloat(String(s.location.longitude)) : null),
    });
  });

  sites.value.forEach((s) => {
    const existing = map.get(s.id) || {};
    map.set(s.id, {
      ...existing,
      id: s.id,
      name: s.name,
      code: s.code || existing.code,
      locality: s.locality || existing.locality,
      province: s.province || existing.province,
      latitude: s.latitude !== undefined && s.latitude !== null ? Number(s.latitude) : existing.latitude,
      longitude: s.longitude !== undefined && s.longitude !== null ? Number(s.longitude) : existing.longitude,
    });
  });

  return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
});

const searchQuery = ref("");
const selectedCategory = ref<string>("ALL");
const selectedProvinceFilter = ref<string>("ALL");

// Station sélectionnée pour le calcul de proximité
const selectedStationIdModel = ref<number | null>(null);
const selectedStation = ref<EmergencySiteType | null>(null);

// Filtre de proximité station amélioré (combobox avec recherche)
const isStationDropdownOpen = ref(false);
const stationSearchQuery = ref("");
const stationProvinceFilter = ref("ALL");

// Provinces uniques des stations Galana
const stationProvinces = computed(() => {
  const set = new Set<string>();
  sites.value.forEach((s) => {
    if (s.province) set.add(s.province.toUpperCase().trim());
  });
  return Array.from(set).sort();
});

// Stations filtrées pour le dropdown interactif
const filteredStations = computed(() => {
  let list = sites.value;

  if (stationProvinceFilter.value !== "ALL") {
    list = list.filter((s) => (s.province || "").toUpperCase().trim() === stationProvinceFilter.value);
  }

  if (stationSearchQuery.value.trim()) {
    const q = stationSearchQuery.value.toLowerCase().trim();
    list = list.filter((s) => {
      const matchName = (s.name || "").toLowerCase().includes(q);
      const matchLoc = (s.locality || "").toLowerCase().includes(q);
      const matchProv = (s.province || "").toLowerCase().includes(q);
      const matchCode = (s.code || "").toLowerCase().includes(q);
      return matchName || matchLoc || matchProv || matchCode;
    });
  }

  return list;
});

// Contact sélectionné pour centrage sur la carte
const selectedContactId = ref<number | null>(null);

const isModalOpen = ref(false);
const selectedContactForEdit = ref<EmergencyContactType | null>(null);
const contactToDelete = ref<EmergencyContactType | null>(null);

const emergencyMapRef = ref<any>(null);

const mapStats = ref({
  total_contacts: 0,
  total_sites: 0,
  pompier: 0,
  hopital: 0,
  ambulance: 0,
  police: 0,
  gendarmerie: 0,
});

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

interface NearbyStation {
  id: number;
  name: string;
  locality?: string;
  province?: string;
  latitude?: number;
  longitude?: number;
  distance_km: number;
}

// Stations Galana (SS) les plus proches d'un contact d'urgence donné
function getNearestSitesForContact(contact: EmergencyContactType, limit = 2): NearbyStation[] {
  const cLat = contact.latitude !== undefined && contact.latitude !== null ? Number(contact.latitude) : null;
  const cLng = contact.longitude !== undefined && contact.longitude !== null ? Number(contact.longitude) : null;
  if (cLat === null || cLng === null || isNaN(cLat) || isNaN(cLng) || !sites.value.length) {
    return [];
  }

  const list: NearbyStation[] = [];
  for (const s of sites.value) {
    const sLat = s.latitude !== undefined && s.latitude !== null ? Number(s.latitude) : null;
    const sLng = s.longitude !== undefined && s.longitude !== null ? Number(s.longitude) : null;
    if (sLat !== null && sLng !== null && !isNaN(sLat) && !isNaN(sLng)) {
      list.push({
        id: s.id,
        name: s.name,
        locality: s.locality,
        province: s.province,
        latitude: sLat,
        longitude: sLng,
        distance_km: calculateDistanceKm(cLat, cLng, sLat, sLng),
      });
    }
  }

  list.sort((a, b) => a.distance_km - b.distance_km);
  return list.slice(0, limit);
}

// Sélection d'une station directement depuis le badge d'un contact d'urgence
function handleSelectStationFromCard(nearbyStation: NearbyStation) {
  const fullStation = sites.value.find((s) => s.id === nearbyStation.id);
  if (fullStation) {
    handleSelectStationFromMap(fullStation);
    if (emergencyMapRef.value && fullStation.latitude && fullStation.longitude) {
      emergencyMapRef.value.selectStation(fullStation);
    }
  }
}

// Contacts avec distance calculée par rapport à la station sélectionnée
const contactsWithDistance = computed<EmergencyContactType[]>(() => {
  if (!selectedStation.value || !selectedStation.value.latitude || !selectedStation.value.longitude) {
    return contacts.value.map((c) => ({ ...c, distance_km: undefined }));
  }

  const sLat = selectedStation.value.latitude;
  const sLng = selectedStation.value.longitude;

  return contacts.value.map((c) => {
    if (c.latitude && c.longitude) {
      const dist = calculateDistanceKm(sLat, sLng, c.latitude, c.longitude);
      return { ...c, distance_km: dist };
    }
    return { ...c, distance_km: 99999 };
  });
});

// 6 provinces officielles de Madagascar
const standardProvinces = [
  "ANTANANARIVO",
  "ANTSIRANANA",
  "FIANARANTSOA",
  "MAHAJANGA",
  "TOAMASINA",
  "TOLIARA",
];

const apiProvinces = ref<string[]>([]);

// Résolution de province pour chaque contact
function resolveContactProvince(c: EmergencyContactType): string {
  if (c.province) return c.province.toUpperCase().trim();
  if (c.location?.province) return c.location.province.toUpperCase().trim();
  if (c.locality) {
    const loc = c.locality.toUpperCase().trim();
    if (["ANTANANARIVO", "ANTSIRABE", "AMBATOLAMPY", "TALATAMATY", "IVATO"].some(x => loc.includes(x))) return "ANTANANARIVO";
    if (["TOAMASINA", "TAMATAVE", "MORAMANGA", "BRICKAVILLE", "AMBATONDRAZAKA"].some(x => loc.includes(x))) return "TOAMASINA";
    if (["MAHAJANGA", "MAJUNGA", "ANTSOHIHY", "MAROVOAY", "PORT-BERGE"].some(x => loc.includes(x))) return "MAHAJANGA";
    if (["ANTSIRANANA", "DIEGO", "NOSY BE", "SAMBAVA", "AMBANJA", "AMBILOBE", "ANDAPA"].some(x => loc.includes(x))) return "ANTSIRANANA";
    if (["FIANARANTSOA", "MANAKARA", "AMBOSITRA", "FARAFANGANA", "IRONDRO"].some(x => loc.includes(x))) return "FIANARANTSOA";
    if (["TOLIARA", "TULEAR", "MORONDAVA", "IHOSY", "TOLAGNARO", "FORT DAUPHIN", "SAKARAHA", "AMPANIHY"].some(x => loc.includes(x))) return "TOLIARA";
  }
  return "";
}

// Liste des provinces disponibles
const provinceList = computed(() => {
  const set = new Set<string>();

  // 1. Provinces fournies par l'API
  apiProvinces.value.forEach((p) => {
    if (p) set.add(p.toUpperCase().trim());
  });

  // 2. Provinces des sites Galana
  sites.value.forEach((s) => {
    if (s.province) set.add(s.province.toUpperCase().trim());
  });

  // 3. Provinces déduites des contacts
  contacts.value.forEach((c) => {
    const p = resolveContactProvince(c);
    if (p) set.add(p);
  });

  // 4. Fallback vers les 6 provinces de Madagascar si la liste est vide
  if (set.size === 0) {
    standardProvinces.forEach((p) => set.add(p));
  }

  return Array.from(set).sort();
});

// Chips de catégories avec compteurs
const categoryChips = computed(() => [
  { id: "ALL", label: "Tous les secours", icon: "🚨", count: contacts.value.length },
  { id: "POMPIER", label: "Pompiers", icon: "🚒", count: countByType("POMPIER") },
  { id: "HOPITAL", label: "Hôpitaux", icon: "🏥", count: countByType("HOPITAL") },
  { id: "AMBULANCE", label: "Ambulances", icon: "🚑", count: countByType("AMBULANCE") },
  { id: "POLICE", label: "Police", icon: "👮", count: countByType("POLICE") },
  { id: "GENDARMERIE", label: "Gendarmerie", icon: "🛡️", count: countByType("GENDARMERIE") },
]);

function countByType(type: string): number {
  return contacts.value.filter((c) => c.type === type).length;
}

// Contacts filtrés pour l'annuaire (avec tri par proximité si station active)
const filteredDirectoryContacts = computed(() => {
  const list = contactsWithDistance.value.filter((c) => {
    // 1. Filtre catégorie
    if (selectedCategory.value !== "ALL" && c.type !== selectedCategory.value) {
      return false;
    }

    // 2. Filtre province
    if (selectedProvinceFilter.value !== "ALL") {
      const targetProv = selectedProvinceFilter.value.toUpperCase().trim();
      const contactProv = resolveContactProvince(c);
      if (contactProv !== targetProv) {
        return false;
      }
    }

    // 3. Recherche textuelle multi-champs
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase().trim();
      const matchName = (c.name || "").toLowerCase().includes(q);
      const matchLoc = (c.locality || c.location?.locality || "").toLowerCase().includes(q);
      const matchProv = (resolveContactProvince(c) || "").toLowerCase().includes(q);
      const matchAddr = (c.address || "").toLowerCase().includes(q);
      const matchC1 = (c.contact_1 || c.phone || "").toLowerCase().includes(q);
      const matchC2 = (c.contact_2 || "").toLowerCase().includes(q);
      const matchC3 = (c.contact_3 || "").toLowerCase().includes(q);
      const matchNotes = (c.notes || "").toLowerCase().includes(q);

      const typeKeywords: Record<string, string[]> = {
        POMPIER: ["pompier", "pompiers", "incendie", "118", "secours", "caserne"],
        HOPITAL: ["hopital", "hôpital", "chu", "clinique", "urgence", "médical", "medecin", "docteur", "santé"],
        AMBULANCE: ["ambulance", "samu", "évacuation", "evacuation", "smur"],
        POLICE: ["police", "commissariat", "117", "sécurité"],
        GENDARMERIE: ["gendarmerie", "gendarme", "brigade", "119"],
      };
      const matchTypeKeywords = (typeKeywords[c.type] || []).some(k => k.includes(q) || q.includes(k));

      if (!matchName && !matchLoc && !matchProv && !matchAddr && !matchC1 && !matchC2 && !matchC3 && !matchNotes && !matchTypeKeywords) {
        return false;
      }
    }

    return true;
  });

  // Si une station est sélectionnée, on trie les contacts par distance croissante (les plus proches en premier)
  if (selectedStation.value) {
    list.sort((a, b) => (a.distance_km ?? 99999) - (b.distance_km ?? 99999));
  }

  return list;
});

// Exportation Excel des contacts d'urgence avec leurs informations complètes
const loading_export = ref(false);

const exportFields = [
  { key: "type_label", excelName: "Type de secours" },
  { key: "name", excelName: "Nom de l'organisme / Centre" },
  { key: "contact_1", excelName: "Téléphone d'urgence" },
  { key: "contact_2", excelName: "Ligne directe / Secondaire" },
  { key: "contact_3", excelName: "Autre contact" },
  { key: "email", excelName: "E-mail" },
  { key: "locality", excelName: "Ville / Localité" },
  { key: "province", excelName: "Province / Région" },
  { key: "address", excelName: "Adresse" },
  { key: "nearest_station", excelName: "Site Galana le plus proche" },
  { key: "nearest_distance", excelName: "Distance (site le plus proche)" },
  { key: "nearby_sites", excelName: "Sites / Stations Galana à proximité" },
  { key: "assigned_sites", excelName: "Sites rattachés (système)" },
  { key: "reference_station", excelName: "Station sélectionnée (filtre)" },
  { key: "latitude", excelName: "Latitude" },
  { key: "longitude", excelName: "Longitude" },
  { key: "notes", excelName: "Observations / Notes" },
];

function exportData() {
  if (filteredDirectoryContacts.value.length === 0) {
    toast.warning("Aucun contact d'urgence à exporter.");
    return;
  }

  loading_export.value = true;
  try {
    const typeLabelMap: Record<string, string> = {
      POMPIER: "Sapeurs-Pompiers",
      HOPITAL: "Hôpital & Urgences médicales",
      AMBULANCE: "Ambulance & SAMU",
      POLICE: "Police Nationale",
      GENDARMERIE: "Gendarmerie Nationale",
    };

    const rows = filteredDirectoryContacts.value.map((c) => {
      const nearest = getNearestSitesForContact(c, 5);
      const nearestSite = nearest.length > 0 ? nearest[0] : null;

      // Stations proches avec distance calculée ou fallback par même localité
      let nearbySitesText = "—";
      if (nearest.length > 0) {
        nearbySitesText = nearest
          .map((st) => `${st.name}${st.locality ? ' [' + st.locality + ']' : ''} (${formatDistance(st.distance_km)})`)
          .join(" ; ");
      } else {
        const cLoc = (c.locality || c.location?.locality || "").toLowerCase().trim();
        if (cLoc) {
          const sameLocSites = sites.value.filter(
            (s) => (s.locality || "").toLowerCase().trim() === cLoc
          );
          if (sameLocSites.length > 0) {
            nearbySitesText = sameLocSites
              .map((s) => `${s.name} [${s.locality || cLoc}]`)
              .join(" ; ");
          }
        }
      }

      // Sites rattachés enregistrés en base
      const assignedSitesText =
        Array.isArray(c.sites) && c.sites.length > 0
          ? c.sites.map((s: any) => `${s.name}${s.locality ? ' (' + s.locality + ')' : ''}`).join(" ; ")
          : "—";

      // Station de référence si activement sélectionnée
      const refStationText = selectedStation.value
        ? `${selectedStation.value.name}${selectedStation.value.locality ? ' (' + selectedStation.value.locality + ')' : ''} : ${c.distance_km !== undefined && c.distance_km !== 99999 ? formatDistance(c.distance_km) : 'N/A'}`
        : "—";

      return {
        type_label: typeLabelMap[c.type] || c.type,
        name: c.name || "—",
        contact_1: c.contact_1 || c.phone || "—",
        contact_2: c.contact_2 || "—",
        contact_3: c.contact_3 || "—",
        email: c.email || "—",
        locality: c.locality || c.location?.locality || "—",
        province: resolveContactProvince(c) || "—",
        address: c.address || "—",
        nearest_station: nearestSite
          ? `${nearestSite.name}${nearestSite.locality ? ' (' + nearestSite.locality + ')' : ''}`
          : "—",
        nearest_distance: nearestSite ? formatDistance(nearestSite.distance_km) : "—",
        nearby_sites: nearbySitesText,
        assigned_sites: assignedSitesText,
        reference_station: refStationText,
        latitude: c.latitude !== undefined && c.latitude !== null ? String(c.latitude) : "—",
        longitude: c.longitude !== undefined && c.longitude !== null ? String(c.longitude) : "—",
        notes: c.notes || "—",
      };
    });

    exportUtils(
      rows,
      exportFields,
      () => toast.success(`${rows.length} contacts d'urgence exportés avec succès !`),
      () => toast.error("Échec de l'exportation des contacts d'urgence."),
      "contacts_urgence_galana"
    );
  } finally {
    loading_export.value = false;
  }
}

async function loadData() {
  mapLoading.value = true;
  try {
    const mapData = await emergencyContactService.getMapData();
    contacts.value = mapData.contacts || [];
    sites.value = mapData.sites || [];
    mapStats.value = mapData.stats || mapStats.value;

    if (mapData.provinces && Array.isArray(mapData.provinces) && mapData.provinces.length > 0) {
      apiProvinces.value = mapData.provinces;
    }

    try {
      const sitesRes = await emergencyContactService.getAvailableSites();
      availableSites.value = sitesRes.data || [];
    } catch {
      availableSites.value = sites.value.map((s) => ({ id: s.id, name: s.name, locality: s.locality }));
    }
  } catch (err) {
    console.error("Erreur chargement contacts d'urgence :", err);
    toast.error("Impossible de charger les contacts d'urgence.");
  } finally {
    mapLoading.value = false;
  }
}

// Clic sur une carte de secours : centrage et sélection automatique sur la carte
function handleCardClick(contact: EmergencyContactType) {
  selectedContactId.value = contact.id;
  if (contact.latitude && contact.longitude) {
    emergencyMapRef.value?.selectContact(contact);
  } else {
    toast.info(`Coordonnées GPS non renseignées pour ${contact.name}.`);
  }
}

// Sélection depuis la carte Leaflet
function handleSelectContactFromMap(contact: EmergencyContactType) {
  selectedContactId.value = contact.id;
}

// Sélection d'une station (SS) depuis la carte Leaflet
function handleSelectStationFromMap(station: EmergencySiteType) {
  selectedStation.value = station;
  selectedStationIdModel.value = station.id;
  selectedContactId.value = null;
  isStationDropdownOpen.value = false;
  stationSearchQuery.value = "";
  toast.info(`Secours classés par proximité avec la station ${station.name}`);
}

// Sélection manuelle depuis le dropdown de recherche de stations
function selectStation(station: EmergencySiteType) {
  selectedStation.value = station;
  selectedStationIdModel.value = station.id;
  selectedContactId.value = null;
  isStationDropdownOpen.value = false;
  stationSearchQuery.value = "";
  emergencyMapRef.value?.selectStation(station);
  toast.info(`Secours classés par proximité avec la station ${station.name}`);
}

// Réinitialiser la sélection de station
function clearStationSelection() {
  selectedStation.value = null;
  selectedStationIdModel.value = null;
  isStationDropdownOpen.value = false;
  stationSearchQuery.value = "";
}

function copyPhone(phone: string) {
  navigator.clipboard.writeText(phone);
  toast.success(`Numéro ${phone} copié dans le presse-papier !`);
}

function openAddModal() {
  selectedContactForEdit.value = null;
  isModalOpen.value = true;
}

function openEditModal(contact: EmergencyContactType) {
  selectedContactForEdit.value = contact;
  isModalOpen.value = true;
}

function closeModal() {
  isModalOpen.value = false;
  selectedContactForEdit.value = null;
}

async function handleModalSubmit(formData: EmergencyContactFormType) {
  isSubmitting.value = true;
  try {
    if (selectedContactForEdit.value) {
      await emergencyContactService.updateContact(selectedContactForEdit.value.id, formData);
      toast.success("Contact d'urgence mis à jour avec succès !");
    } else {
      await emergencyContactService.createContact(formData);
      toast.success("Nouveau contact d'urgence créé !");
    }
    closeModal();
    await loadData();
  } catch (err: any) {
    console.error("Erreur enregistrement contact :", err);
    toast.error(err.response?.data?.message || "Erreur lors de l'enregistrement.");
  } finally {
    isSubmitting.value = false;
  }
}

function confirmDelete(contact: EmergencyContactType) {
  contactToDelete.value = contact;
}

async function executeDelete() {
  if (!contactToDelete.value) return;
  try {
    await emergencyContactService.deleteContact(contactToDelete.value.id);
    toast.success("Contact d'urgence supprimé avec succès.");
    contactToDelete.value = null;
    await loadData();
  } catch (err) {
    toast.error("Erreur lors de la suppression.");
  }
}

function resetFilters() {
  searchQuery.value = "";
  selectedCategory.value = "ALL";
  selectedProvinceFilter.value = "ALL";
  clearStationSelection();
}

function typeTheme(type: EmergencyType | string) {
  switch (type) {
    case "POMPIER":
      return {
        icon: "🚒",
        label: "Sapeurs-Pompiers",
        bg: "#FEE2E2",
        text: "#DC2626",
        badgeBg: "#DC2626",
        badgeText: "#FFFFFF",
      };
    case "HOPITAL":
      return {
        icon: "🏥",
        label: "Hôpital / CHU",
        bg: "#D1FAE5",
        text: "#059669",
        badgeBg: "#059669",
        badgeText: "#FFFFFF",
      };
    case "AMBULANCE":
      return {
        icon: "🚑",
        label: "Ambulance SAMU",
        bg: "#E0F2FE",
        text: "#0284C7",
        badgeBg: "#0284C7",
        badgeText: "#FFFFFF",
      };
    case "POLICE":
      return {
        icon: "👮",
        label: "Police Nationale",
        bg: "#EEF2FF",
        text: "#4F46E5",
        badgeBg: "#4F46E5",
        badgeText: "#FFFFFF",
      };
    case "GENDARMERIE":
      return {
        icon: "🛡️",
        label: "Gendarmerie",
        bg: "#F3E8FF",
        text: "#7C3AED",
        badgeBg: "#7C3AED",
        badgeText: "#FFFFFF",
      };
    default:
      return {
        icon: "🚨",
        label: type,
        bg: "#FFEDD5",
        text: "#EA580C",
        badgeBg: "#EA580C",
        badgeText: "#FFFFFF",
      };
  }
}

onMounted(() => {
  loadData();
});
</script>
