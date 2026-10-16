<template>
    <div class="w-full">
        <!-- HEADER -->
        <Header title="Ajouter un suivi des équipements" :thumbnails="[
            { label: 'Accueil', name: 'DASHBOARD' },
            { label: 'Inspections', name: 'INSPECTION' },
            { label: 'Suivi du matériel', name: 'EQUIPMENT_MONITORING' },
            { label: 'Nouveau', name: 'EQUIPMENT_MONITORING_NEW' }
        ]" />

        <!-- CONTENT CONTAINER -->
        <div class="max-w-7xl mt-5 mx-auto px-4 sm:px-6 pb-12">
            <div class="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
                
                <!-- ==================================================== -->
                <!-- FORMULAIRE PRINCIPAL (COLONNE GAUCHE) -->
                <!-- ==================================================== -->
                <div class="xl:col-span-8 space-y-6">
                    <div class="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                        
                        <!-- CARD HEADER -->
                        <div class="px-6 py-5 border-b border-gray-100 bg-slate-50/60 flex items-center justify-between gap-4">
                            <div class="flex items-center gap-3">
                                <div class="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-xs">
                                    <ClipboardList :size="20" />
                                </div>
                                <div>
                                    <h2 class="text-base font-bold text-gray-900">
                                        Nouveau contrôle de matériel
                                    </h2>
                                    <p class="text-xs text-gray-500">
                                        Planifiez le contrôle, assignez l'inspecteur responsable et renseignez les matériels.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <!-- SECTION 1 : INFORMATIONS NÉCESSAIRES AU SUIVI & PLANIFICATION -->
                        <div class="p-6 border-b border-gray-100 space-y-4">
                            <div class="flex items-center gap-2 mb-2">
                                <span class="w-6 h-6 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">1</span>
                                <h3 class="font-bold text-gray-800 text-sm">Informations générales & Planification</h3>
                            </div>

                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-xs font-semibold text-gray-700 mb-1.5">
                                        Site / Station <span class="text-red-500">*</span>
                                    </label>
                                    <input
                                        v-model="form.site_name"
                                        list="sites-datalist"
                                        type="text"
                                        placeholder="Sélectionner ou saisir un site..."
                                        class="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                                        :class="errors?.site_name ? 'border-red-500' : ''"
                                    />
                                    <datalist id="sites-datalist">
                                        <option v-for="site in sites" :key="site.id" :value="site.name">{{ site.name }}</option>
                                    </datalist>
                                    <p v-if="errors?.site_name" class="text-[11px] text-red-600 mt-1">Le site est requis.</p>
                                </div>

                                <div>
                                    <label class="block text-xs font-semibold text-gray-700 mb-1.5">
                                        Date prévue / du relevé <span class="text-red-500">*</span>
                                    </label>
                                    <input
                                        v-model="form.date"
                                        type="date"
                                        class="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                                    />
                                </div>

                                <div>
                                    <label class="block text-xs font-semibold text-gray-700 mb-1.5 flex items-center justify-between">
                                        <span>Inspecteur assigné</span>
                                        <span class="text-[10px] text-gray-400 font-normal">Choisi à l'avance</span>
                                    </label>
                                    <select
                                        v-model="form.user_id"
                                        class="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition cursor-pointer"
                                    >
                                        <option value="">Sélectionner un inspecteur (par défaut vous-même)...</option>
                                        <option v-for="user in users" :key="user.id" :value="user.id">
                                            {{ user.first_name || '' }} {{ user.last_name || '' }} {{ user.email ? `(${user.email})` : '' }} {{ user.job ? `— ${user.job}` : '' }}
                                        </option>
                                    </select>
                                </div>

                                <div>
                                    <label class="block text-xs font-semibold text-gray-700 mb-1.5 flex items-center justify-between">
                                        <span>Statut de l'inspection</span>
                                        <span class="text-[10px] text-gray-400 font-normal">Cycle d'inspection</span>
                                    </label>
                                    <select
                                        v-model="form.status"
                                        class="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition cursor-pointer font-medium"
                                    >
                                        <option v-for="st in ChecklistStatusJsonData" :key="st.value" :value="st.value">
                                            {{ st.label }}
                                        </option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label class="block text-xs font-semibold text-gray-700 mb-1.5">
                                    Observations générales (optionnel)
                                </label>
                                <textarea
                                    v-model="form.observations"
                                    rows="2"
                                    placeholder="Notes de visite, remarques sur la conformité globale du site..."
                                    class="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition resize-y"
                                ></textarea>
                            </div>
                        </div>

                        <!-- SECTION 2 : ÉQUIPEMENTS DYNAMIQUES (EquipmentItem) -->
                        <div class="p-6 space-y-4">
                            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <div class="flex items-center gap-2">
                                    <span class="w-6 h-6 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">2</span>
                                    <div>
                                        <h3 class="font-bold text-gray-800 text-sm flex items-center gap-2">
                                            <span>Matériels et équipements contrôlés</span>
                                            <span class="px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 text-xs font-bold">{{ items.length }}</span>
                                        </h3>
                                        <p class="text-[11px] text-gray-500">Ajoutez la liste des matériels et équipements à contrôler lors de l'inspection.</p>
                                    </div>
                                </div>

                                <div class="flex items-center gap-2">
                                    <button
                                        type="button"
                                        @click="loadStandardGalanaTemplates"
                                        class="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition cursor-pointer flex items-center gap-1.5"
                                        title="Insérer automatiquement la liste des matériels types Galana"
                                    >
                                        <Sparkles :size="13" class="text-amber-500" />
                                        <span>Modèle standard Galana</span>
                                    </button>

                                    <button
                                        type="button"
                                        @click="addNewItem"
                                        class="px-3.5 py-1.5 text-xs font-bold text-white bg-primary hover:bg-primary/90 rounded-lg shadow-2xs transition cursor-pointer flex items-center gap-1.5"
                                    >
                                        <Plus :size="14" />
                                        <span>Ajouter un matériel</span>
                                    </button>
                                </div>
                            </div>

                            <!-- ÉTAT VIDE -->
                            <div v-if="items.length === 0" class="py-12 px-4 text-center border-2 border-dashed border-gray-200 rounded-xl bg-slate-50/50">
                                <Package :size="32" class="mx-auto text-gray-300 mb-2" />
                                <h4 class="text-xs font-bold text-gray-700">Aucun équipement ajouté pour l'instant</h4>
                                <p class="text-[11px] text-gray-400 max-w-sm mx-auto mt-1">
                                    Cliquez sur « Modèle standard Galana » pour charger les 21 équipements types ou « Ajouter un matériel » pour une saisie personnalisée.
                                </p>
                                <div class="mt-4 flex items-center justify-center gap-2">
                                    <button
                                        type="button"
                                        @click="loadStandardGalanaTemplates"
                                        class="px-3 py-1.5 text-xs font-semibold text-primary bg-primary/10 hover:bg-primary hover:text-white rounded-lg transition cursor-pointer"
                                    >
                                        Charger le standard Galana
                                    </button>
                                    <button
                                        type="button"
                                        @click="addNewItem"
                                        class="px-3 py-1.5 text-xs font-semibold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg transition cursor-pointer"
                                    >
                                        + Ajouter manuellement
                                    </button>
                                </div>
                            </div>

                            <!-- LISTE DES ÉQUIPEMENTS AJOUTÉS -->
                            <div v-else class="space-y-3">
                                <div
                                    v-for="(item, index) in items"
                                    :key="index"
                                    class="equipment-item-card p-3.5 rounded-xl border bg-white hover:border-gray-300 transition-all shadow-2xs space-y-2.5"
                                    :class="item.isNew ? 'border-primary ring-2 ring-primary/20 bg-primary/5' : 'border-gray-200'"
                                >
                                    <div class="flex items-center justify-between gap-2">
                                        <div class="flex items-center gap-2 flex-1">
                                            <span class="w-5 h-5 rounded-md bg-gray-100 text-gray-500 flex items-center justify-center text-[10px] font-bold shrink-0">
                                                {{ index + 1 }}
                                            </span>
                                            <span v-if="item.isNew" class="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-primary text-white shrink-0">
                                                NOUVEAU
                                            </span>
                                            <input
                                                v-model="item.name"
                                                type="text"
                                                placeholder="Nom du matériel à contrôler (ex: Extincteur P50, Bac Métal...)"
                                                class="font-bold text-xs text-gray-900 border-b border-gray-200 hover:border-primary focus:border-primary focus:outline-none flex-1 py-1"
                                            />
                                        </div>

                                        <div class="flex items-center gap-2">
                                            <span class="text-[10px] font-semibold text-amber-700 bg-amber-50 border border-amber-200/80 px-2 py-0.5 rounded-md">
                                                À contrôler sur site
                                            </span>

                                            <!-- Bouton supprimer -->
                                            <button
                                                type="button"
                                                @click="removeItem(index)"
                                                class="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition cursor-pointer"
                                                title="Supprimer cet équipement de la planification"
                                            >
                                                <Trash2 :size="14" />
                                            </button>
                                        </div>
                                    </div>

                                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                                        <div>
                                            <label class="block text-[10px] text-gray-500 font-semibold mb-1">Catégorie d'équipement</label>
                                            <select
                                                v-model="item.type"
                                                class="w-full px-2.5 py-1.5 text-xs rounded-lg border border-gray-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-primary"
                                            >
                                                <option value="extincteur">Extincteur</option>
                                                <option value="bac">Bac & Rétention</option>
                                                <option value="materiel">Matériel & Outils</option>
                                                <option value="poubelle">Déchets & Poubelles</option>
                                                <option value="signalisation">Signalétique & Pictogrammes</option>
                                                <option value="securite">Sécurité Incendie</option>
                                                <option value="conformite">Document & Affichage</option>
                                                <option value="divers">Autre / Divers</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label class="block text-[10px] text-gray-500 font-semibold mb-1">Emplacement prévu</label>
                                            <input
                                                v-model="item.location"
                                                type="text"
                                                placeholder="Piste, TGBT, Boutique, Stockage..."
                                                class="w-full px-2.5 py-1.5 text-xs rounded-lg border border-gray-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-primary"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <input
                                            v-model="item.comment"
                                            type="text"
                                            placeholder="Consignes particulières ou remarque pour l'inspecteur (optionnel)..."
                                            class="w-full px-2.5 py-1.5 text-[11px] rounded-lg border border-dashed border-gray-200 text-gray-600 placeholder-gray-400 focus:bg-white focus:outline-none focus:border-primary"
                                        />
                                    </div>
                                </div>

                                <!-- BARRE D'ACTIONS BAS DE LISTE -->
                                <div class="flex flex-wrap items-center justify-center gap-2.5 pt-4 border-t border-dashed border-gray-200">
                                    <button
                                        type="button"
                                        @click="openAddModal"
                                        class="px-4 py-2 text-xs font-bold text-white bg-primary hover:bg-primary/90 rounded-xl shadow-2xs transition cursor-pointer flex items-center gap-1.5"
                                    >
                                        <Plus :size="14" />
                                        <span>Ajouter un matériel</span>
                                    </button>
                                    <button
                                        type="button"
                                        @click="addNewItemQuick"
                                        class="px-3.5 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-xl shadow-2xs transition cursor-pointer flex items-center gap-1.5"
                                    >
                                        <Plus :size="13" class="text-gray-400" />
                                        <span>+ Ligne vide en bas</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                <!-- ==================================================== -->
                <!-- APERÇU ET ACTIONS (COLONNE DROITE) -->
                <!-- ==================================================== -->
                <aside class="xl:col-span-4 sticky top-6 space-y-4">
                    <div class="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 space-y-4">
                        <div class="flex items-center justify-between border-b border-gray-100 pb-3">
                            <div>
                                <p class="text-[10px] font-bold uppercase tracking-wider text-gray-400">Synthèse en direct</p>
                                <h3 class="font-bold text-gray-900 text-sm">Aperçu du contrôle</h3>
                            </div>
                            <span class="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                                <ClipboardList :size="16" />
                            </span>
                        </div>

                        <!-- INFOS CLEFS -->
                        <div class="space-y-2 text-xs">
                            <div class="flex justify-between items-center py-1">
                                <span class="text-gray-500">Site :</span>
                                <span class="font-bold text-gray-900 text-right truncate max-w-[170px]">
                                    {{ form.site_name || 'Aucun site' }}
                                </span>
                            </div>
                            <div class="flex justify-between items-center py-1">
                                <span class="text-gray-500">Date prévue :</span>
                                <span class="font-mono text-gray-800">{{ form.date || '-' }}</span>
                            </div>
                            <div class="flex justify-between items-center py-1">
                                <span class="text-gray-500">Inspecteur :</span>
                                <span class="font-semibold text-gray-800 text-right truncate max-w-[170px]" :title="selectedInspectorName">
                                    {{ selectedInspectorName }}
                                </span>
                            </div>
                            <div class="flex justify-between items-center py-1">
                                <span class="text-gray-500">Statut d'inspection :</span>
                                <ChecklistStatus :name="(form.status as any)" />
                            </div>
                            <div class="flex justify-between items-center py-1">
                                <span class="text-gray-500">Total équipements :</span>
                                <span class="font-bold text-gray-900">{{ items.length }}</span>
                            </div>
                        </div>

                        <!-- LISTE RÉSUMÉE DES ÉQUIPEMENTS À CONTRÔLER -->
                        <div class="border border-slate-200 rounded-xl overflow-hidden bg-slate-50/50">
                            <div class="px-3.5 py-2.5 bg-slate-100/70 border-b border-slate-200 flex items-center justify-between">
                                <span class="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                                    <Package :size="13" class="text-primary" />
                                    <span>Matériels à contrôler</span>
                                </span>
                                <span class="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-black">
                                    {{ items.length }}
                                </span>
                            </div>

                            <div v-if="items.length > 0" class="max-h-72 overflow-y-auto divide-y divide-gray-100 p-2 space-y-1">
                                <div
                                    v-for="(it, i) in items"
                                    :key="i"
                                    class="p-2 rounded-lg bg-white border border-gray-100 hover:border-gray-200 transition text-xs flex items-center justify-between gap-2 shadow-2xs"
                                >
                                    <div class="flex items-center gap-2 min-w-0">
                                        <span class="w-5 h-5 rounded-md bg-slate-100 text-slate-500 text-[10px] font-bold flex items-center justify-center shrink-0">
                                            {{ i + 1 }}
                                        </span>
                                        <div class="min-w-0">
                                            <p class="font-semibold text-gray-800 text-[11px] truncate">
                                                {{ it.name || 'Sans nom' }}
                                            </p>
                                            <div class="flex items-center gap-1.5 text-[10px] text-gray-400">
                                                <span class="capitalize text-primary font-medium">{{ it.type }}</span>
                                                <span v-if="it.location" class="truncate">• {{ it.location }}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <span class="text-[9px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded shrink-0">
                                        À vérifier
                                    </span>
                                </div>
                            </div>
                            <div v-else class="p-6 text-center text-gray-400 text-xs">
                                Aucun matériel sélectionné pour l'instant.
                            </div>
                        </div>

                        <!-- ACTIONS -->
                        <div class="space-y-2 pt-2 border-t border-gray-100">
                            <button
                                type="button"
                                @click="submit"
                                :disabled="loading || !form.site_name"
                                class="w-full py-2.5 px-4 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary/90 transition shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                <Loader v-if="loading" :size="15" class="animate-spin" />
                                <Save v-else :size="15" />
                                <span>{{ loading ? 'Enregistrement en cours...' : 'Créer / Planifier le contrôle' }}</span>
                            </button>

                            <button
                                type="button"
                                @click="router.push({ name: 'EQUIPMENT_MONITORING' })"
                                class="w-full py-2 px-4 bg-gray-100 text-gray-700 text-xs font-semibold rounded-xl hover:bg-gray-200 transition cursor-pointer"
                            >
                                Annuler
                            </button>
                        </div>
                    </div>
                </aside>

            </div>
        </div>

        <!-- ==================================================== -->
        <!-- MODAL D'AJOUT D'UN MATÉRIEL (USER-FRIENDLY) -->
        <!-- ==================================================== -->
        <div
            v-if="isAddModalOpen"
            class="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
            @click.self="closeAddModal"
        >
            <div class="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
                <!-- MODAL HEADER -->
                <div class="px-6 py-4 bg-slate-50 border-b border-gray-100 flex items-center justify-between">
                    <div class="flex items-center gap-3">
                        <div class="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                            <Plus :size="18" />
                        </div>
                        <div>
                            <h3 class="font-bold text-gray-900 text-sm">Ajouter un matériel / équipement</h3>
                            <p class="text-[11px] text-gray-500">Renseignez les détails du matériel à contrôler</p>
                        </div>
                    </div>
                    <button
                        type="button"
                        @click="closeAddModal"
                        class="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition cursor-pointer"
                    >
                        <XIcon :size="18" />
                    </button>
                </div>

                <!-- MODAL BODY -->
                <form @submit.prevent="confirmAddModalItem" class="p-6 space-y-4">
                    <!-- NOM DU MATÉRIEL -->
                    <div>
                        <label class="block text-xs font-semibold text-gray-700 mb-1">
                            Nom du matériel <span class="text-red-500">*</span>
                        </label>
                        <input
                            ref="modalNameInputRef"
                            v-model="modalItem.name"
                            type="text"
                            required
                            placeholder="Ex: Extincteur CO₂, Caisse Anti-Feu, Bac Métal, Panneau..."
                            class="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                        />
                    </div>

                    <!-- CATÉGORIE & EMPLACEMENT -->
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label class="block text-xs font-semibold text-gray-700 mb-1">Catégorie</label>
                            <select
                                v-model="modalItem.type"
                                class="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 bg-white focus:outline-none focus:border-primary transition"
                            >
                                <option value="extincteur">Extincteur</option>
                                <option value="bac">Bac & Rétention</option>
                                <option value="materiel">Matériel & Outils</option>
                                <option value="poubelle">Déchets & Poubelles</option>
                                <option value="signalisation">Signalétique & Pictogrammes</option>
                                <option value="securite">Sécurité Incendie</option>
                                <option value="conformite">Document & Affichage</option>
                                <option value="divers">Autre / Divers</option>
                            </select>
                        </div>

                        <div>
                            <label class="block text-xs font-semibold text-gray-700 mb-1">Emplacement prévu</label>
                            <input
                                v-model="modalItem.location"
                                type="text"
                                placeholder="Piste, Boutique, TGBT, Stockage..."
                                class="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-300 focus:outline-none focus:border-primary transition"
                            />
                        </div>
                    </div>

                    <!-- COMMENTAIRE / CONSIGNES -->
                    <div>
                        <label class="block text-xs font-semibold text-gray-700 mb-1">Consignes particulières (optionnel)</label>
                        <textarea
                            v-model="modalItem.comment"
                            rows="2"
                            placeholder="Points d'attention, vérification spécifique..."
                            class="w-full px-3 py-1.5 text-xs rounded-xl border border-gray-300 focus:outline-none focus:border-primary transition resize-y"
                        ></textarea>
                    </div>

                    <!-- MODAL ACTIONS -->
                    <div class="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                        <button
                            type="button"
                            @click="closeAddModal"
                            class="px-4 py-2 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition cursor-pointer"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            :disabled="!modalItem.name.trim()"
                            class="px-5 py-2 text-xs font-bold text-white bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition shadow cursor-pointer flex items-center gap-1.5"
                        >
                            <Plus :size="14" />
                            <span>Ajouter l'équipement</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>

    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue"
import { useRouter } from "vue-router"
import {
    ClipboardList,
    Plus,
    Trash2,
    Save,
    Sparkles,
    Package,
    Loader,
    X as XIcon,
} from "@lucide/vue"
import Header from "../../../components/shared/Header.vue"
import ChecklistStatus from "../../../components/features/checklist/ChecklistStatus.vue"
import { ChecklistStatusJsonData } from "../../../@data/Checklist.data.ts"
import type { SiteNameType } from "../../../@types/SiteName..type.ts"
import { useEquipmentMonitoringService } from "../../../core/services/equipmentMonitoring.service.ts"
import { useUserService } from "../../../core/services/user.service.ts"
import { toast } from "vue3-toastify"

const router = useRouter()
const equipments = useEquipmentMonitoringService()
const userService = useUserService()
const loading = ref(false)
const sites = ref<SiteNameType[]>([])
const users = ref<any[]>([])
const errors = ref<{ site_name?: string[]; date?: string[] } | null>(null)

interface DynamicItem {
    name: string
    type: string
    location?: string
    comment?: string
    isNew?: boolean
    value?: string | number
    conformity?: boolean
}

const form = reactive({
    site_name: "",
    date: new Date().toISOString().split("T")[0],
    user_id: "",
    status: "DRAFT",
    observations: "",
})

const selectedInspectorName = computed(() => {
    if (!form.user_id) return "Non assigné (vous-même)"
    const found = users.value.find(u => String(u.id) === String(form.user_id))
    if (!found) return "Inspecteur assigné"
    const fullName = `${found.first_name || ""} ${found.last_name || ""}`.trim()
    return fullName || found.email || "Inspecteur assigné"
})

const items = ref<DynamicItem[]>([])

const standardGalanaTemplates: DynamicItem[] = [
    { name: "Extincteur P50", type: "extincteur", location: "Piste" },
    { name: "Extincteur P9", type: "extincteur", location: "Piste" },
    { name: "Extincteur P6", type: "extincteur", location: "Boutique / Bureau" },
    { name: "Extincteur CO₂", type: "extincteur", location: "TGBT" },
    { name: "Bac Métallique", type: "bac", location: "Piste" },
    { name: "Bac Plastique", type: "bac", location: "Piste" },
    { name: "Bac de Rétention", type: "bac", location: "Stockage" },
    { name: "Pelles", type: "materiel", location: "Zone sable" },
    { name: "Poubelles 120L", type: "poubelle", location: "Piste" },
    { name: "Poubelle 240L", type: "poubelle", location: "Extérieur" },
    { name: "Boîte CAF (Anti-Feu)", type: "materiel", location: "Piste" },
    { name: "Plots de sécurité", type: "securite", location: "Piste" },
    { name: "Chaînettes", type: "securite", location: "Piste" },
    { name: "Détecteurs de fumée", type: "securite", location: "Boutique / TGBT" },
    { name: "Picto Danger TGBT", type: "signalisation", location: "TGBT" },
    { name: "Panneau Dépotage en cours", type: "signalisation", location: "Aire dépotage" },
    { name: "Panneau Évent", type: "signalisation", location: "Évents" },
    { name: "Point de rassemblement", type: "signalisation", location: "Parking" },
    { name: "Contact d'urgence", type: "signalisation", location: "Bureau gérance" },
    { name: "Livret / Fiche réflexe", type: "conformite", location: "Bureau" },
    { name: "Politique HSSE affichée", type: "conformite", location: "Bureau" },
]

function loadStandardGalanaTemplates() {
    if (items.value.length > 0) {
        if (!confirm("Voulez-vous remplacer les matériels actuels par les 21 équipements du modèle standard Galana ?")) {
            return
        }
    }
    items.value = standardGalanaTemplates.map(it => ({
        ...it,
        value: "0",
        conformity: true,
    }))
    toast.success("Modèle standard Galana appliqué (21 équipements).")
}

// ==========================================
// MODAL D'AJOUT D'UN MATÉRIEL (PLANIFICATION)
// ==========================================
const isAddModalOpen = ref(false)
const modalNameInputRef = ref<HTMLInputElement | null>(null)

const modalItem = reactive({
    name: "",
    type: "materiel",
    location: "",
    comment: "",
})

function openAddModal() {
    modalItem.name = ""
    modalItem.type = "materiel"
    modalItem.location = ""
    modalItem.comment = ""
    isAddModalOpen.value = true
    setTimeout(() => {
        modalNameInputRef.value?.focus()
    }, 100)
}

function closeAddModal() {
    isAddModalOpen.value = false
}

function confirmAddModalItem() {
    if (!modalItem.name.trim()) {
        toast.warning("Veuillez saisir le nom du matériel.")
        return
    }

    const newItem: DynamicItem = {
        name: modalItem.name.trim(),
        type: modalItem.type,
        location: modalItem.location.trim() || undefined,
        comment: modalItem.comment.trim() || undefined,
        value: "0",
        conformity: true,
        isNew: true,
    }

    // Ajout en TÊTE de liste pour être immédiatement visible à l'écran
    items.value.unshift(newItem)
    isAddModalOpen.value = false
    toast.success(`Matériel « ${newItem.name} » ajouté à la liste !`)

    // Défilement doux vers la section des équipements
    setTimeout(() => {
        const firstCard = document.querySelector('.equipment-item-card')
        if (firstCard) {
            firstCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
        }
    }, 150)
}

function addNewItem() {
    openAddModal()
}

function addNewItemQuick() {
    items.value.push({
        name: "",
        type: "materiel",
        location: "",
        comment: "",
        value: "0",
        conformity: true,
        isNew: true,
    })
    toast.info("Nouvelle ligne ajoutée en fin de liste.")
    setTimeout(() => {
        const cards = document.querySelectorAll('.equipment-item-card')
        const lastCard = cards[cards.length - 1]
        if (lastCard) {
            lastCard.scrollIntoView({ behavior: 'smooth', block: 'center' })
            const input = lastCard.querySelector('input')
            input?.focus()
        }
    }, 100)
}

function removeItem(index: number) {
    items.value.splice(index, 1)
}

async function submit() {
    errors.value = null
    if (!form.site_name) {
        errors.value = { site_name: ["Le site est requis"] }
        toast.error("Veuillez sélectionner un site.")
        return
    }

    loading.value = true
    try {
        const payload: any = {
            site_name: form.site_name,
            date: form.date,
            user_id: form.user_id || undefined,
            status: form.status,
            observations: form.observations || null,
            conformity_rate: 100,
            initial_conformity_rate: 100,
            items: items.value.map(it => ({
                name: it.name || "Matériel non spécifié",
                type: it.type || "divers",
                conformity: true,
                initial_conformity: true,
                value_type: "number",
                value: "0",
                location: it.location || null,
                comment: it.comment || null,
            })),
        }

        const res = await equipments.store(payload)

        toast.success("Contrôle de matériel planifié avec succès !")
        const newId = res?.data?.id
        if (newId) {
            router.push({ name: "EQUIPMENT_MONITORING_DETAILS", params: { id: newId } })
        } else {
            router.push({ name: "EQUIPMENT_MONITORING" })
        }
    } catch (err: any) {
        console.error("Erreur enregistrement suivi:", err)
        if (err?.response?.status === 422 && err.response.data.errors) {
            errors.value = err.response.data.errors
            toast.error("Veuillez vérifier les informations saisies.")
        } else {
            toast.error("Une erreur est survenue lors de l'enregistrement.")
        }
    } finally {
        loading.value = false
    }
}

function fetchSiteNames() {
    equipments.getSiteNames()
        .then(res => {
            sites.value = res.data
        })
        .catch(err => {
            console.error("Erreur chargement sites:", err)
        })
}

function fetchUsers() {
    userService.index()
        .then(res => {
            users.value = res.data?.data || res.data || []
        })
        .catch(err => {
            console.error("Erreur chargement utilisateurs:", err)
        })
}

onMounted(() => {
    fetchSiteNames()
    fetchUsers()
    loadStandardGalanaTemplates()
})
</script>