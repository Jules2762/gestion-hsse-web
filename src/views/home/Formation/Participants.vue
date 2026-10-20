<template>
    <div class="flex flex-row" @click="context_menu.is_open = false">
        <div class="flex flex-col w-full">
            <Header title="formation.participants" :thumbnails="[
                {
                    'label': 'thumbnails.home',
                    'name': 'DASHBOARD'
                }, {
                    'label': 'thumbnails.training',
                    'name': 'FORMATION'
                },
                {
                    'label': 'formation.participants',
                    'name': 'PARTICIPANT'
                },
            ]" />

            <!-- ===================================
                 FORMATION CONTEXT BANNER
            ==================================== -->
            <div v-if="formationDetails" class="bg-white border-b border-gray-200 px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div class="flex items-center gap-4">
                    <router-link :to="{ name: 'FORMATION' }"
                        class="p-2 rounded-lg border border-gray-200 text-gray-500 hover:text-gray-800 hover:bg-gray-50 transition cursor-pointer"
                        title="Retour aux formations">
                        <ArrowLeft :size="18" />
                    </router-link>
                    <div>
                        <div class="flex items-center gap-2">
                            <h2 class="text-lg font-bold text-gray-900">{{ formationDetails.title }}</h2>
                            <span :class="getVoletBadgeClass(formationDetails.volet)" class="px-2 py-0.5 rounded text-xs font-semibold">
                                {{ formationDetails.volet }}
                            </span>
                            <span class="px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
                                {{ formationDetails.type }}
                            </span>
                        </div>
                        <div class="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500 mt-1">
                            <span v-if="formationDetails.date" class="flex items-center gap-1">
                                <Calendar :size="13" class="text-gray-400" />
                                {{ formationDetails.date }}
                            </span>
                            <span v-if="formationDetails.duration" class="flex items-center gap-1">
                                <Clock :size="13" class="text-gray-400" />
                                {{ formationDetails.duration }}
                            </span>
                            <span v-if="formationDetails.trainer" class="flex items-center gap-1">
                                <User :size="13" class="text-gray-400" />
                                Formateur : <strong class="text-gray-700">{{ formationDetails.trainer }}</strong>
                            </span>
                            <span v-if="formationDetails.target" class="flex items-center gap-1">
                                <Users :size="13" class="text-gray-400" />
                                Cible : <strong class="text-gray-700">{{ formationDetails.target }}</strong>
                            </span>
                        </div>
                    </div>
                </div>

                <!-- KPI Inscrits vs Prévus -->
                <div class="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 self-start md:self-auto">
                    <div class="flex flex-col">
                        <span class="text-[11px] font-medium text-gray-500 uppercase tracking-wider">Inscrits / Prévus</span>
                        <div class="flex items-baseline gap-1">
                            <span class="text-lg font-bold text-primary">{{ data?.length ?? 0 }}</span>
                            <span class="text-xs text-gray-400">/ {{ formationDetails.participant ?? 0 }}</span>
                        </div>
                    </div>
                    <div class="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div class="h-full bg-primary rounded-full transition-all duration-500"
                            :style="{ width: `${Math.min(100, Math.round(((data?.length ?? 0) / (formationDetails.participant || 1)) * 100))}%` }">
                        </div>
                    </div>
                </div>
            </div>

            <!-- ===================================
                 FILTER & TOOLBAR SECTION
            ==================================== -->
            <div class="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div class="h-16 px-6 flex flex-row items-center justify-between gap-4">
                    <div class="flex flex-row items-center gap-2 flex-wrap">
                        <!-- BOUTON D'AJOUT MULTI-PARTICIPANTS -->
                        <button
                            type="button"
                            @click="openAddModal"
                            class="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-primary/90 shadow-sm transition cursor-pointer">
                            <UserPlus :size="16" />
                            <span>Ajouter des participants</span>
                            <span v-if="availablePersonnelsCount > 0" class="ml-1 px-1.5 py-0.5 rounded-full bg-white/20 text-[10px]">
                                {{ availablePersonnelsCount }} dispo
                            </span>
                        </button>

                        <ButtonFilter :text="t('formation.actions.export')" :icon="DownloadIcon" :badge="(filteredData?.length ?? 0).toString()" @click="exportParticipants" />

                        <!-- BARRE D'ACTIONS DE SÉLECTION MULTIPLE TABLEAU PRINCIPAL -->
                        <template v-if="selectedTableIds.length > 0">
                            <div class="w-px h-6 bg-gray-300 mx-1" />
                            <div class="flex items-center gap-2 bg-primary/10 border border-primary/20 px-3 py-1 rounded-lg">
                                <span class="text-xs font-semibold text-primary">
                                    {{ selectedTableIds.length }} sélectionné(s)
                                </span>
                                <button
                                    type="button"
                                    @click="openBatchDeleteConfirm"
                                    class="text-xs text-danger font-medium hover:underline flex items-center gap-1 cursor-pointer">
                                    <Trash2Icon :size="13" />
                                    <span>Retirer</span>
                                </button>
                                <span class="text-gray-300">|</span>
                                <button
                                    type="button"
                                    @click="exportSelectedParticipants"
                                    class="text-xs text-primary font-medium hover:underline flex items-center gap-1 cursor-pointer">
                                    <DownloadIcon :size="13" />
                                    <span>Exporter</span>
                                </button>
                                <button
                                    type="button"
                                    @click="selectedTableIds = []"
                                    class="text-gray-400 hover:text-gray-600 ml-1 cursor-pointer">
                                    <X :size="14" />
                                </button>
                            </div>
                        </template>
                    </div>

                    <InputFilter :icon="Search" v-model="searchQuery" placeholder="Rechercher un participant..." />
                </div>

                <ChipFilter :filterable-keys="filterableKeys" :column-labels="columnLabels"
                    :column-options="columnOptions" :filters="filters" :show-date-filter="false" @clear-all="clearFilters" />
            </div>

            <!-- ===================================
                 TABLEAU DES PARTICIPANTS
            ==================================== -->
            <div class="flex flex-row relative min-h-[400px]">
                <div class="overflow-x-auto transition-all" :class="selected_personnel ? 'w-[calc(100%-400px)]' : 'w-full'">
                    <table>
                        <thead>
                            <tr>
                                <th class="w-10 text-center">
                                    <input
                                        type="checkbox"
                                        :checked="isAllTableSelected"
                                        :indeterminate.prop="isTableIndeterminate"
                                        @change="toggleSelectAllTable"
                                        class="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary/20 cursor-pointer" />
                                </th>
                                <th>REF</th>
                                <th>NOM</th>
                                <th>E-MAIL</th>
                                <th>FONCTION</th>
                                <th>DIRECTION</th>
                                <th>ENTITÉ</th>
                                <th class="text-right pr-4">ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="item in filteredData" :key="item.id" @contextmenu.prevent="openContextMenu($event, item)"
                                @click="selected_personnel = item"
                                :class="[
                                    selected_personnel?.id == item.id ? 'bg-primary/10' : '',
                                    selectedTableIds.includes(item.id) ? 'bg-emerald-50/50' : ''
                                ]"
                                class="cursor-pointer hover:bg-gray-50/80 transition">
                                <td class="text-center" @click.stop>
                                    <input
                                        type="checkbox"
                                        :value="item.id"
                                        v-model="selectedTableIds"
                                        class="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary/20 cursor-pointer" />
                                </td>
                                <td class="font-mono text-xs text-gray-500">{{ item.id }}</td>
                                <td>
                                    <div class="flex items-center gap-2">
                                        <div class="w-7 h-7 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center shrink-0">
                                            {{ (item.first_name?.[0] || '') + (item.last_name?.[0] || '') }}
                                        </div>
                                        <span class="font-medium text-gray-900">{{ item.first_name + ' ' + item.last_name }}</span>
                                    </div>
                                </td>
                                <td class="text-gray-600">{{ item.email }}</td>
                                <td>
                                    <span class="inline-block px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700">
                                        {{ item.fonction || '-' }}
                                    </span>
                                </td>
                                <td>
                                    <span class="inline-block px-2 py-0.5 rounded text-xs bg-blue-50 text-blue-700 border border-blue-100">
                                        {{ item.direction || '-' }}
                                    </span>
                                </td>
                                <td>
                                    <span class="inline-block px-2 py-0.5 rounded text-xs bg-amber-50 text-amber-700 border border-amber-100">
                                        {{ item.entity || '-' }}
                                    </span>
                                </td>
                                <td class="text-right pr-4" @click.stop>
                                    <button
                                        type="button"
                                        @click="deleteSpecificParticipant(item)"
                                        class="p-1 rounded text-gray-400 hover:text-danger hover:bg-danger/10 transition cursor-pointer"
                                        title="Retirer de la formation">
                                        <Trash2Icon :size="16" />
                                    </button>
                                </td>
                            </tr>
                            <tr v-if="filteredData.length === 0">
                                <td colspan="8" class="text-center py-12 text-gray-500">
                                    <div class="flex flex-col items-center justify-center gap-2">
                                        <Users :size="32" class="text-gray-300" />
                                        <p class="font-medium text-gray-600">Aucun participant trouvé pour cette formation.</p>
                                        <p class="text-xs text-gray-400">Cliquez sur « Ajouter des participants » pour inscrire des collaborateurs.</p>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- ===================================
                     VOLET LATÉRAL DE DÉTAIL PARTICIPANT
                ==================================== -->
                <aside
                    v-if="selected_personnel"
                    aria-label="Fiche participant"
                    class="w-[400px] min-w-[400px] max-w-[400px] bg-white border-l border-gray-200 sticky top-0 h-screen overflow-y-auto p-5 z-20 shrink-0 shadow-xl scrollbar-hide flex flex-col justify-between"
                >
                    <div>
                        <div class="flex items-start justify-between pb-4 border-b border-gray-200 mb-5">
                            <div>
                                <p class="text-[11px] font-bold uppercase tracking-wider text-gray-400">Participant #{{ selected_personnel.id }}</p>
                                <h4 class="mt-0.5 font-bold text-gray-900 text-base">{{ selected_personnel.first_name }} {{ selected_personnel.last_name }}</h4>
                            </div>
                            <button
                                class="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
                                @click="selected_personnel = undefined"
                                type="button"
                                aria-label="Fermer la fiche"
                            >
                                <X :size="18" />
                            </button>
                        </div>
                        <div class="flex flex-col items-center gap-2 py-4 bg-gray-50/60 rounded-xl border border-gray-100 mb-5">
                            <div class="w-16 h-16 rounded-full bg-primary/10 text-primary font-bold text-xl flex items-center justify-center">
                                {{ (selected_personnel.first_name?.[0] || '') + (selected_personnel.last_name?.[0] || '') }}
                            </div>
                            <div class="text-center px-2">
                                <div class="font-bold text-gray-900 text-sm">{{ selected_personnel.first_name }} {{ selected_personnel.last_name }}</div>
                                <div class="text-xs text-gray-500 font-mono">{{ selected_personnel.email }}</div>
                            </div>
                        </div>
                        <div class="flex flex-col gap-3 text-xs">
                            <div class="flex items-center justify-between border-b border-gray-100 pb-2">
                                <span class="text-gray-400">Fonction</span>
                                <span class="font-medium text-gray-700">{{ selected_personnel.fonction || '-' }}</span>
                            </div>
                            <div class="flex items-center justify-between border-b border-gray-100 pb-2">
                                <span class="text-gray-400">Direction</span>
                                <span class="font-medium text-gray-700">{{ selected_personnel.direction || '-' }}</span>
                            </div>
                            <div class="flex items-center justify-between border-b border-gray-100 pb-2">
                                <span class="text-gray-400">Entité</span>
                                <span class="font-medium text-gray-700">{{ selected_personnel.entity || '-' }}</span>
                            </div>
                        </div>
                    </div>
                    <div class="pt-4 border-t border-gray-100 flex flex-col gap-2">
                        <button
                            class="w-full py-2.5 px-3 text-xs font-semibold text-danger bg-danger/10 hover:bg-danger/20 rounded-lg flex items-center justify-center gap-1.5 transition cursor-pointer"
                            @click="deleteSpecificParticipant(selected_personnel)">
                            <Trash2Icon :size="15" />
                            <span>Retirer de la session</span>
                        </button>
                    </div>
                </aside>
            </div>
        </div>

        <!-- ===================================
             MODAL D'AJOUT MULTI-PARTICIPANTS
        ==================================== -->
        <div v-if="isAddModalOpen" class="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div class="bg-white rounded-2xl shadow-2xl w-full max-w-3xl flex flex-col max-h-[90vh] overflow-hidden border border-gray-100">
                <!-- Modal Header -->
                <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                            <UserPlus :size="20" />
                        </div>
                        <div>
                            <h3 class="font-bold text-gray-900 text-base">Inscrire des participants</h3>
                            <p class="text-xs text-gray-500">
                                Sélectionnez les collaborateurs à inscrire à la session « {{ formationDetails?.title || 'Formation' }} ».
                            </p>
                        </div>
                    </div>
                    <button @click="closeAddModal" class="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition cursor-pointer">
                        <X :size="18" />
                    </button>
                </div>

                <!-- Modal Filter & Toolbar -->
                <div class="px-6 py-3 border-b border-gray-100 flex flex-col gap-3 bg-white">
                    <div class="flex items-center gap-3">
                        <!-- Barre de recherche -->
                        <div class="relative flex-1">
                            <Search :size="15" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                v-model="modalSearchQuery"
                                type="text"
                                placeholder="Rechercher par nom, prénom, email, fonction..."
                                class="w-full h-9 pl-9 pr-8 rounded-lg border border-gray-200 text-xs text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition" />
                            <button
                                v-if="modalSearchQuery"
                                @click="modalSearchQuery = ''"
                                class="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer">
                                <X :size="14" />
                            </button>
                        </div>

                        <!-- Bouton pour ouvrir le formulaire d'ajout rapide d'un nouveau personnel -->
                        <button
                            type="button"
                            @click="showCreatePersonnelForm = !showCreatePersonnelForm"
                            :class="showCreatePersonnelForm ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
                            class="px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shrink-0">
                            <Plus :size="14" />
                            <span>{{ showCreatePersonnelForm ? 'Fermer le formulaire' : 'Nouveau personnel' }}</span>
                        </button>
                    </div>

                    <!-- Filtres par Direction (Pills) -->
                    <div v-if="availableDirections.length > 0" class="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                        <span class="text-gray-400 text-[11px] font-medium mr-1 shrink-0">Direction :</span>
                        <button
                            type="button"
                            @click="modalDirectionFilter = ''"
                            :class="modalDirectionFilter === '' ? 'bg-primary text-white font-semibold' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
                            class="px-2.5 py-1 rounded-full text-xs transition cursor-pointer shrink-0">
                            Toutes ({{ availablePersonnels.length }})
                        </button>
                        <button
                            v-for="dir in availableDirections"
                            :key="dir"
                            type="button"
                            @click="modalDirectionFilter = dir"
                            :class="modalDirectionFilter === dir ? 'bg-primary text-white font-semibold' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
                            class="px-2.5 py-1 rounded-full text-xs transition cursor-pointer shrink-0 flex items-center gap-1">
                            <span>{{ dir }}</span>
                            <span class="text-[10px] opacity-75">({{ countByDirection[dir] || 0 }})</span>
                        </button>
                    </div>

                    <!-- Sous-barre de sélection globale -->
                    <div class="flex items-center justify-between text-xs pt-1 border-t border-gray-100">
                        <div class="flex items-center gap-3">
                            <button
                                type="button"
                                @click="toggleSelectAllFilteredModal"
                                class="text-primary font-semibold hover:underline flex items-center gap-1 cursor-pointer">
                                <CheckCircle2 :size="14" />
                                <span>{{ isAllFilteredModalSelected ? 'Tout désélectionner' : `Tout sélectionner (${filteredAvailablePersonnels.length})` }}</span>
                            </button>
                            <span class="text-gray-300">|</span>
                            <span class="text-gray-500">
                                {{ filteredAvailablePersonnels.length }} collaborateur(s) affiché(s)
                            </span>
                        </div>
                        <div v-if="selectedPersonnelIds.length > 0" class="font-bold text-primary">
                            {{ selectedPersonnelIds.length }} sélectionné(s)
                        </div>
                    </div>
                </div>

                <!-- =========================================================
                     FORMULAIRE INLINE : CRÉER UN COLLABORATEUR À LA VOLÉE
                ========================================================== -->
                <div v-if="showCreatePersonnelForm" class="p-4 bg-emerald-50/60 border-b border-emerald-200/80 animate-in fade-in duration-200">
                    <div class="flex items-center justify-between mb-3">
                        <div class="flex items-center gap-2">
                            <Sparkles :size="16" class="text-primary" />
                            <h4 class="text-xs font-bold text-gray-800">Ajout rapide d'un collaborateur dans le système</h4>
                        </div>
                        <span class="text-[11px] text-gray-500">Il sera automatiquement sélectionné après sa création.</span>
                    </div>

                    <form @submit.prevent="createAndSelectPersonnel" class="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                        <div>
                            <label class="block text-gray-600 font-medium mb-1">Prénom *</label>
                            <input
                                v-model="newPersonnelForm.first_name"
                                required
                                type="text"
                                placeholder="ex: Jean"
                                class="w-full h-8 px-2.5 rounded-lg border border-gray-300 bg-white focus:outline-none focus:border-primary" />
                        </div>
                        <div>
                            <label class="block text-gray-600 font-medium mb-1">Nom *</label>
                            <input
                                v-model="newPersonnelForm.last_name"
                                required
                                type="text"
                                placeholder="ex: Rakoto"
                                class="w-full h-8 px-2.5 rounded-lg border border-gray-300 bg-white focus:outline-none focus:border-primary" />
                        </div>
                        <div>
                            <label class="block text-gray-600 font-medium mb-1">Email *</label>
                            <input
                                v-model="newPersonnelForm.email"
                                required
                                type="email"
                                placeholder="ex: j.rakoto@galana.mg"
                                class="w-full h-8 px-2.5 rounded-lg border border-gray-300 bg-white focus:outline-none focus:border-primary" />
                        </div>
                        <div>
                            <label class="block text-gray-600 font-medium mb-1">Fonction *</label>
                            <input
                                v-model="newPersonnelForm.fonction"
                                required
                                type="text"
                                placeholder="ex: Opérateur Dépot"
                                class="w-full h-8 px-2.5 rounded-lg border border-gray-300 bg-white focus:outline-none focus:border-primary" />
                        </div>
                        <div>
                            <label class="block text-gray-600 font-medium mb-1">Direction *</label>
                            <input
                                v-model="newPersonnelForm.direction"
                                required
                                type="text"
                                placeholder="ex: Exploitation"
                                class="w-full h-8 px-2.5 rounded-lg border border-gray-300 bg-white focus:outline-none focus:border-primary" />
                        </div>
                        <div>
                            <label class="block text-gray-600 font-medium mb-1">Entité *</label>
                            <input
                                v-model="newPersonnelForm.entity"
                                required
                                type="text"
                                placeholder="ex: Tamatave"
                                class="w-full h-8 px-2.5 rounded-lg border border-gray-300 bg-white focus:outline-none focus:border-primary" />
                        </div>

                        <div class="md:col-span-3 flex justify-end gap-2 pt-2 border-t border-emerald-200/50">
                            <button
                                type="button"
                                @click="showCreatePersonnelForm = false"
                                class="px-3 py-1.5 rounded-lg border border-gray-300 text-gray-600 hover:bg-white transition cursor-pointer">
                                Annuler
                            </button>
                            <button
                                type="submit"
                                :disabled="loadingCreatePersonnel"
                                class="px-4 py-1.5 rounded-lg bg-primary text-white font-semibold hover:bg-primary/90 flex items-center gap-1.5 transition cursor-pointer">
                                <Plus :size="14" />
                                <span>{{ loadingCreatePersonnel ? 'Création en cours...' : 'Enregistrer et sélectionner' }}</span>
                            </button>
                        </div>
                    </form>
                </div>

                <!-- ===================================
                     LISTE DES COLLABORATEURS SÉLECTIONNABLES
                ==================================== -->
                <div class="flex-1 overflow-y-auto max-h-[380px] p-4 flex flex-col gap-1.5 bg-gray-50/30">
                    <div
                        v-for="item in filteredAvailablePersonnels"
                        :key="item.id"
                        @click="togglePersonnelSelection(item.id)"
                        :class="selectedPersonnelIds.includes(item.id) ? 'bg-primary/10 border-primary/30 ring-1 ring-primary/20' : 'bg-white border-gray-200 hover:border-gray-300'"
                        class="p-3 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition select-none">
                        <div class="flex items-center gap-3">
                            <input
                                type="checkbox"
                                :checked="selectedPersonnelIds.includes(item.id)"
                                @click.stop="togglePersonnelSelection(item.id)"
                                class="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary/20 cursor-pointer shrink-0" />

                            <div class="w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center shrink-0">
                                {{ (item.first_name?.[0] || '') + (item.last_name?.[0] || '') }}
                            </div>

                            <div class="flex flex-col">
                                <div class="flex items-center gap-2">
                                    <span class="font-bold text-xs text-gray-900">{{ item.first_name }} {{ item.last_name }}</span>
                                    <span v-if="isTargetMatch(item)"
                                        class="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-0.5">
                                        <Sparkles :size="10" />
                                        Cible recommandée
                                    </span>
                                </div>
                                <span class="text-[11px] text-gray-500">{{ item.email }}</span>
                            </div>
                        </div>

                        <div class="flex items-center gap-2">
                            <span class="px-2 py-0.5 rounded text-[11px] font-medium bg-gray-100 text-gray-700">
                                {{ item.fonction || '-' }}
                            </span>
                            <span class="px-2 py-0.5 rounded text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-100">
                                {{ item.direction || '-' }}
                            </span>
                            <span class="px-2 py-0.5 rounded text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-100 hidden sm:inline-block">
                                {{ item.entity || '-' }}
                            </span>
                        </div>
                    </div>

                    <!-- Empty state -->
                    <div v-if="filteredAvailablePersonnels.length === 0" class="py-12 flex flex-col items-center justify-center text-center gap-2">
                        <Users :size="36" class="text-gray-300" />
                        <p class="font-semibold text-xs text-gray-700">
                            {{ availablePersonnels.length === 0 ? 'Tous les collaborateurs sont déjà inscrits !' : 'Aucun collaborateur correspondant.' }}
                        </p>
                        <p class="text-[11px] text-gray-400 max-w-sm">
                            {{ availablePersonnels.length === 0
                                ? 'Tous les personnels enregistrés font déjà partie de cette session de formation.'
                                : 'Essayez de modifier votre recherche ou filtre par direction, ou ajoutez un nouveau personnel ci-dessus.' }}
                        </p>
                        <button
                            v-if="modalSearchQuery || modalDirectionFilter"
                            type="button"
                            @click="modalSearchQuery = ''; modalDirectionFilter = ''"
                            class="mt-2 text-xs text-primary font-semibold hover:underline cursor-pointer">
                            Réinitialiser les filtres
                        </button>
                    </div>
                </div>

                <!-- Modal Footer -->
                <div class="px-6 py-4 border-t border-gray-100 bg-white flex items-center justify-between">
                    <div>
                        <template v-if="selectedPersonnelIds.length > 0">
                            <button
                                type="button"
                                @click="selectedPersonnelIds = []"
                                class="text-xs text-gray-500 hover:text-danger hover:underline cursor-pointer">
                                Vider la sélection ({{ selectedPersonnelIds.length }})
                            </button>
                        </template>
                        <template v-else>
                            <span class="text-xs text-gray-400">Aucun participant sélectionné</span>
                        </template>
                    </div>

                    <div class="flex items-center gap-3">
                        <button
                            type="button"
                            @click="closeAddModal"
                            class="px-4 py-2 rounded-lg border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition cursor-pointer">
                            Annuler
                        </button>
                        <button
                            type="button"
                            :disabled="selectedPersonnelIds.length === 0 || loading_add_participant"
                            @click="submitBatchAddParticipants"
                            class="px-5 py-2 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm flex items-center gap-2 transition cursor-pointer">
                            <span v-if="loading_add_participant" class="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                            <span>Inscrire les participants ({{ selectedPersonnelIds.length }})</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- ===================================
             CONFIRMATION DE RETRAIT PAR LOT
        ==================================== -->
        <CenterModal
            :is-open="isBatchDeleteModalOpen"
            title="Retirer les participants sélectionnés"
            title-variant="danger"
            confirm-title="Confirmer le retrait"
            confirm-variant="danger"
            :confirm-loading="loadingBatchDelete"
            @close="isBatchDeleteModalOpen = false"
            @confirm="submitBatchDelete">
            <div class="flex flex-col gap-2">
                <p class="text-xs text-gray-600">
                    Êtes-vous sûr de vouloir retirer les <strong class="text-gray-900">{{ selectedTableIds.length }} participant(s)</strong> sélectionnés de cette session de formation ?
                </p>
                <p class="text-[11px] text-gray-400">
                    Cette action retirera ces collaborateurs de la liste des inscrits pour cette session.
                </p>
            </div>
        </CenterModal>

        <!-- Context menu -->
        <ContextMenuUI :model-value="context_menu.is_open"
            @close="context_menu.is_open = false; context_menu.participant = undefined"
            :context-menu="context_menu.context_menu"
            :actions="context_menu.actions"
            :bottom_actions="context_menu.bottom_actions" />
    </div>
</template>

<script setup lang="ts">
    import { useI18n } from 'vue-i18n';
    import ButtonFilter from '../../../components/ui/ButtonFilter.vue';
    import CenterModal from '../../../components/ui/centerModal.vue';
    import {
        ArrowLeft,
        Calendar,
        CheckCircle2,
        Clock,
        DownloadIcon,
        Plus,
        Search,
        Sparkles,
        Trash2Icon,
        User,
        UserPlus,
        Users,
        X
    } from '@lucide/vue';
    import Header from '../../../components/shared/Header.vue';
    import { useRoute } from 'vue-router';
    import { computed, onMounted, ref } from 'vue';
    import InputFilter from '../../../components/ui/InputFilter.vue';
    import type { PersonnelDataType, PersonnelFormType } from '../../../@types/Personnel.type.ts';
    import type { FormationDataType } from '../../../@types/Formation.type.ts';
    import ChipFilter from '../../../components/ui/ChipFilter.vue';
    import personnelService from '../../../core/services/personnel.service.ts';
    import { useFormationService } from '../../../core/services/formation.service.ts';
    import { toast } from 'vue3-toastify';
    import ContextMenuUI from '../../../components/ui/ContextMenuUI.vue';
    import type { ContextMenuActionType, contextMenuType } from '../../../@types/ContextMenu.type.ts';
    import { exportUtils } from '../../../core/utils/export.utils.ts';

    const { t } = useI18n()
    const route = useRoute()
    const formationService = useFormationService()

    // Formation context
    const formationDetails = ref<FormationDataType>()

    // Participants data
    const data = ref<PersonnelDataType[]>([])
    const add_data = ref<PersonnelDataType[]>([])
    const selected_personnel = ref<PersonnelDataType>()
    const searchQuery = ref<string>('')

    // Table multi-selection
    const selectedTableIds = ref<(string | number)[]>([])
    const isBatchDeleteModalOpen = ref<boolean>(false)
    const loadingBatchDelete = ref<boolean>(false)

    // Add Modal State
    const isAddModalOpen = ref<boolean>(false)
    const modalSearchQuery = ref<string>('')
    const modalDirectionFilter = ref<string>('')
    const selectedPersonnelIds = ref<(string | number)[]>([])
    const loading_add_participant = ref<boolean>(false)

    // Quick creation form
    const showCreatePersonnelForm = ref<boolean>(false)
    const loadingCreatePersonnel = ref<boolean>(false)
    const newPersonnelForm = ref<PersonnelFormType>({
        first_name: '',
        last_name: '',
        email: '',
        fonction: '',
        direction: '',
        entity: ''
    })

    // Filters & Chips
    const filterableKeys: string[] = ['fonction', 'direction', 'entity']
    const columnLabels = ref<Record<string, string>>({
        'fonction': 'Fonction',
        'direction': 'Direction',
        'entity': 'Entité'
    })
    const filters = ref<Record<string, string[]>>({
        'fonction': [],
        'direction': [],
        'entity': [],
    })
    const columnOptions = ref<Record<string, string[]>>({
        'fonction': [],
        'direction': [],
        'entity': [],
    })

    // Context menu
    const context_menu = ref<{
        context_menu: contextMenuType,
        is_open: boolean,
        participant?: PersonnelDataType,
        actions?: ContextMenuActionType[],
        bottom_actions?: ContextMenuActionType[]
    }>({
        is_open: false,
        context_menu: {
            'clientX': undefined,
            'clientY': undefined,
        },
        bottom_actions: [
            {
                label: "Supprimer",
                variant: "DANGER",
                icon: Trash2Icon,
                onClick: () => deleteParticipant()
            }
        ],
        actions: [
            {
                label: "Détails",
                icon: Users,
                onClick: () => {
                    selected_personnel.value = context_menu.value.participant
                    context_menu.value.is_open = false
                }
            }
        ],
        participant: undefined,
    })

    // Computed filtered participants for the main table
    const filteredData = computed(() => {
        if (!data.value) return []
        let list = data.value
        if (searchQuery.value.trim()) {
            const q = searchQuery.value.toLowerCase().trim()
            list = list.filter(item =>
                `${item.first_name || ''} ${item.last_name || ''}`.toLowerCase().includes(q) ||
                item.email?.toLowerCase().includes(q) ||
                item.fonction?.toLowerCase().includes(q) ||
                item.direction?.toLowerCase().includes(q) ||
                item.entity?.toLowerCase().includes(q)
            )
        }
        if (filters.value.fonction && filters.value.fonction.length > 0) {
            list = list.filter(item => filters.value.fonction.includes(item.fonction))
        }
        if (filters.value.direction && filters.value.direction.length > 0) {
            list = list.filter(item => filters.value.direction.includes(item.direction))
        }
        if (filters.value.entity && filters.value.entity.length > 0) {
            list = list.filter(item => filters.value.entity.includes(item.entity))
        }
        return list
    })

    // Available personnel (excluding already enrolled participants)
    const availablePersonnels = computed(() => {
        const enrolledIds = new Set(data.value?.map(p => String(p.id)) || [])
        return (add_data.value || []).filter(item => !enrolledIds.has(String(item.id)))
    })

    const availablePersonnelsCount = computed(() => availablePersonnels.value.length)

    // Distinct directions available among candidate personnel
    const availableDirections = computed(() => {
        const dirs = availablePersonnels.value.map(p => p.direction).filter(Boolean) as string[]
        return [...new Set(dirs)].sort()
    })

    // Count candidates per direction
    const countByDirection = computed(() => {
        const counts: Record<string, number> = {}
        for (const p of availablePersonnels.value) {
            if (p.direction) {
                counts[p.direction] = (counts[p.direction] || 0) + 1
            }
        }
        return counts
    })

    // Filtered available personnel in modal (search + direction pill)
    const filteredAvailablePersonnels = computed(() => {
        let list = availablePersonnels.value
        if (modalDirectionFilter.value) {
            list = list.filter(p => p.direction === modalDirectionFilter.value)
        }
        if (modalSearchQuery.value.trim()) {
            const q = modalSearchQuery.value.toLowerCase().trim()
            list = list.filter(p =>
                `${p.first_name || ''} ${p.last_name || ''}`.toLowerCase().includes(q) ||
                p.email?.toLowerCase().includes(q) ||
                p.fonction?.toLowerCase().includes(q) ||
                p.direction?.toLowerCase().includes(q) ||
                p.entity?.toLowerCase().includes(q)
            )
        }
        return list
    })

    // Check if a personnel matches the training target
    function isTargetMatch(personnel: PersonnelDataType): boolean {
        if (!formationDetails.value?.target) return false
        const target = formationDetails.value.target.toLowerCase()
        return (
            (personnel.direction && target.includes(personnel.direction.toLowerCase())) ||
            (personnel.fonction && target.includes(personnel.fonction.toLowerCase())) ||
            target.includes('tous') ||
            target.includes('tout')
        )
    }

    // Modal select all / deselect all
    const isAllFilteredModalSelected = computed(() => {
        if (filteredAvailablePersonnels.value.length === 0) return false
        return filteredAvailablePersonnels.value.every(p => selectedPersonnelIds.value.includes(p.id))
    })

    function toggleSelectAllFilteredModal() {
        if (isAllFilteredModalSelected.value) {
            const filteredIdSet = new Set(filteredAvailablePersonnels.value.map(p => p.id))
            selectedPersonnelIds.value = selectedPersonnelIds.value.filter(id => !filteredIdSet.has(id))
        } else {
            const currentSelected = new Set(selectedPersonnelIds.value)
            for (const p of filteredAvailablePersonnels.value) {
                currentSelected.add(p.id)
            }
            selectedPersonnelIds.value = Array.from(currentSelected)
        }
    }

    function togglePersonnelSelection(id: string | number) {
        const index = selectedPersonnelIds.value.indexOf(id)
        if (index > -1) {
            selectedPersonnelIds.value.splice(index, 1)
        } else {
            selectedPersonnelIds.value.push(id)
        }
    }

    // Main table selection helpers
    const isAllTableSelected = computed(() => {
        if (filteredData.value.length === 0) return false
        return filteredData.value.every(item => selectedTableIds.value.includes(item.id))
    })

    const isTableIndeterminate = computed(() => {
        const count = filteredData.value.filter(item => selectedTableIds.value.includes(item.id)).length
        return count > 0 && count < filteredData.value.length
    })

    function toggleSelectAllTable() {
        if (isAllTableSelected.value) {
            const filteredIdSet = new Set(filteredData.value.map(item => item.id))
            selectedTableIds.value = selectedTableIds.value.filter(id => !filteredIdSet.has(id))
        } else {
            const set = new Set(selectedTableIds.value)
            for (const item of filteredData.value) {
                set.add(item.id)
            }
            selectedTableIds.value = Array.from(set)
        }
    }

    // Volet styling
    function getVoletBadgeClass(volet?: string): string {
        switch (volet) {
            case 'Sécurité':
                return 'bg-red-100 text-red-700 border border-red-200'
            case 'Santé':
                return 'bg-blue-100 text-blue-700 border border-blue-200'
            case 'Environnement':
                return 'bg-emerald-100 text-emerald-700 border border-emerald-200'
            case 'Sûreté':
                return 'bg-amber-100 text-amber-700 border border-amber-200'
            default:
                return 'bg-gray-100 text-gray-700 border border-gray-200'
        }
    }

    // Open/Close modal
    function openAddModal() {
        modalSearchQuery.value = ''
        modalDirectionFilter.value = ''
        selectedPersonnelIds.value = []
        showCreatePersonnelForm.value = false
        isAddModalOpen.value = true
    }

    function closeAddModal() {
        isAddModalOpen.value = false
        selectedPersonnelIds.value = []
        showCreatePersonnelForm.value = false
    }

    // Submit batch add
    function submitBatchAddParticipants() {
        if (selectedPersonnelIds.value.length === 0) {
            toast.warning('Veuillez sélectionner au moins un participant')
            return
        }

        loading_add_participant.value = true
        formationService.addParticipant({
            formation_id: route.params.id as string,
            personnel_ids: selectedPersonnelIds.value
        })
            .then(res => {
                const count = res.data?.added_count ?? selectedPersonnelIds.value.length
                toast.success(`${count} participant(s) inscrit(s) avec succès !`)
                closeAddModal()
                fetchData()
                fetchFormationDetails()
                fetchDataPersonnel()
            })
            .catch(err => {
                const message = err.response?.data?.message || "Erreur lors de l'inscription des participants"
                if (message === 'participant.exist') {
                    toast.error('Ce participant est déjà inscrit à cette session.')
                } else {
                    toast.error(message)
                }
            })
            .finally(() => {
                loading_add_participant.value = false
            })
    }

    // Quick create personnel and select
    function createAndSelectPersonnel() {
        loadingCreatePersonnel.value = true
        personnelService.store(newPersonnelForm.value)
            .then(res => {
                const created = res.data?.data || res.data
                toast.success('Collaborateur créé avec succès !')
                showCreatePersonnelForm.value = false

                // Reset quick form
                newPersonnelForm.value = {
                    first_name: '',
                    last_name: '',
                    email: '',
                    fonction: '',
                    direction: '',
                    entity: ''
                }

                // Refresh personnel and select the new one
                personnelService.indexAll().then(r => {
                    add_data.value = r.data.data
                    if (created?.id) {
                        selectedPersonnelIds.value.push(created.id)
                    }
                })
            })
            .catch(err => {
                toast.error(err.response?.data?.message || 'Erreur lors de la création du personnel')
            })
            .finally(() => {
                loadingCreatePersonnel.value = false
            })
    }

    // Batch delete participants
    function openBatchDeleteConfirm() {
        if (selectedTableIds.value.length === 0) return
        isBatchDeleteModalOpen.value = true
    }

    async function submitBatchDelete() {
        loadingBatchDelete.value = true
        let removed = 0
        const formationId = route.params.id as string

        try {
            for (const id of selectedTableIds.value) {
                await formationService.deleteParticipant(formationId, id)
                removed++
            }
            toast.success(`${removed} participant(s) retiré(s) avec succès`)
            selectedTableIds.value = []
            isBatchDeleteModalOpen.value = false
            fetchData()
            fetchFormationDetails()
        } catch (err) {
            console.error(err)
            toast.error("Erreur lors du retrait de certains participants")
            fetchData()
            fetchFormationDetails()
        } finally {
            loadingBatchDelete.value = false
        }
    }

    function clearFilters() {
        filters.value = {
            'fonction': [],
            'direction': [],
            'entity': [],
        }
    }

    function updateColumnOptions() {
        const list = data.value || []
        columnOptions.value = {
            fonction: [...new Set(list.map(p => p.fonction).filter(Boolean))] as string[],
            direction: [...new Set(list.map(p => p.direction).filter(Boolean))] as string[],
            entity: [...new Set(list.map(p => p.entity).filter(Boolean))] as string[],
        }
    }

    function exportParticipants() {
        const rowsToExport = filteredData.value.length ? filteredData.value : (data.value || [])
        if (rowsToExport.length === 0) {
            toast.info("Aucun participant à exporter")
            return
        }
        exportRows(rowsToExport, 'participants_formation')
        toast.success('Liste des participants exportée avec succès')
    }

    function exportSelectedParticipants() {
        const rows = (data.value || []).filter(p => selectedTableIds.value.includes(p.id))
        if (rows.length === 0) return
        exportRows(rows, 'participants_selection')
        toast.success(`${rows.length} participant(s) exporté(s)`)
    }

    function exportRows(rows: PersonnelDataType[], filename: string) {
        const fields = [
            { key: 'id', excelName: 'Réf' },
            { key: 'full_name', excelName: 'Nom et Prénom' },
            { key: 'email', excelName: 'Email' },
            { key: 'fonction', excelName: 'Fonction' },
            { key: 'direction', excelName: 'Direction' },
            { key: 'entity', excelName: 'Entité' },
        ]
        const formattedRows = rows.map(p => ({
            id: p.id,
            full_name: `${p.first_name || ''} ${p.last_name || ''}`.trim(),
            email: p.email || '',
            fonction: p.fonction || '',
            direction: p.direction || '',
            entity: p.entity || '',
        }))
        exportUtils(formattedRows, fields, undefined, undefined, filename)
    }

    function openContextMenu(event: MouseEvent, participant: PersonnelDataType) {
        context_menu.value.context_menu.clientX = event.clientX
        context_menu.value.context_menu.clientY = event.clientY
        context_menu.value.is_open = true
        context_menu.value.participant = participant
    }

    function fetchDataPersonnel() {
        personnelService.indexAll()
            .then(res => {
                add_data.value = res.data.data
            })
            .catch(err => {
                console.error(err)
            })
    }

    function fetchData() {
        formationService.getParticipants(route.params.id as string)
            .then(res => {
                data.value = res.data.data
                updateColumnOptions()
            })
            .catch(err => {
                console.error(err)
            })
    }

    function fetchFormationDetails() {
        formationService.show(route.params.id as string)
            .then(res => {
                formationDetails.value = res.data
            })
            .catch(err => {
                console.error(err)
            })
    }

    function deleteParticipant() {
        if (!context_menu.value.participant?.id) return
        deleteSpecificParticipant(context_menu.value.participant)
        context_menu.value.is_open = false
        context_menu.value.participant = undefined
    }

    function deleteSpecificParticipant(personnel: PersonnelDataType) {
        if (!personnel?.id) return
        formationService.deleteParticipant(route.params.id as string, personnel.id as string)
            .then(() => {
                toast.success('Participant retiré avec succès')
                data.value = data.value?.filter(item => item.id != personnel.id)
                selectedTableIds.value = selectedTableIds.value.filter(id => id != personnel.id)
                if (selected_personnel.value?.id == personnel.id) {
                    selected_personnel.value = undefined
                }
                updateColumnOptions()
                fetchFormationDetails()
            })
            .catch(err => {
                console.error(err)
                toast.error('Erreur lors du retrait du participant')
            })
    }

    onMounted(() => {
        fetchFormationDetails()
        fetchDataPersonnel()
        fetchData()
    })
</script>