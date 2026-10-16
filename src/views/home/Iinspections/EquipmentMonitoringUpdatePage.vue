<template>
    <div class="w-full">
        <!-- HEADER -->
        <Header title="Modifier le suivi des équipements" :thumbnails="[
            { label: 'Accueil', name: 'DASHBOARD' },
            { label: 'Inspections', name: 'INSPECTION' },
            { label: 'Suivi du matériel', name: 'EQUIPMENT_MONITORING' },
            { label: 'Modifier', name: 'EQUIPMENT_MONITORING_UPDATE' }
        ]" />

        <!-- CONTENT CONTAINER -->
        <div class="max-w-7xl mt-5 mx-auto px-4 sm:px-6 pb-12">
            <!-- CHARGEMENT INITIAL -->
            <div v-if="loadingInitial" class="p-16 flex flex-col items-center justify-center text-center text-gray-400 gap-2">
                <Loader :size="28" class="animate-spin text-primary" />
                <span class="text-xs font-medium">Chargement des données du contrôle...</span>
            </div>

            <div v-else class="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
                
                <!-- ==================================================== -->
                <!-- FORMULAIRE PRINCIPAL (COLONNE GAUCHE) -->
                <!-- ==================================================== -->
                <div class="xl:col-span-8 space-y-6">
                    <div class="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                        
                        <!-- CARD HEADER -->
                        <div class="px-6 py-5 border-b border-gray-100 bg-slate-50/60 flex items-center justify-between gap-4">
                            <div class="flex items-center gap-3">
                                <div class="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-white shadow-xs">
                                    <Edit :size="20" />
                                </div>
                                <div>
                                    <h2 class="text-base font-bold text-gray-900">
                                        Modification du suivi n° {{ monitoringId }}
                                    </h2>
                                    <p class="text-xs text-gray-500">
                                        Mettez à jour les informations du contrôle et les équipements relevés.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <!-- SECTION 1 : INFORMATIONS NÉCESSAIRES AU SUIVI -->
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
                                        list="sites-update-datalist"
                                        type="text"
                                        placeholder="Sélectionner ou saisir un site..."
                                        class="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                                        :class="errors?.site_name ? 'border-red-500' : ''"
                                    />
                                    <datalist id="sites-update-datalist">
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
                                        <span class="text-[10px] text-gray-400 font-normal">Choisi parmi les utilisateurs</span>
                                    </label>
                                    <select
                                        v-model="form.user_id"
                                        class="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition cursor-pointer"
                                    >
                                        <option value="">Sélectionner un inspecteur...</option>
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
                                        <p class="text-[11px] text-gray-500">Modifiez, ajoutez ou supprimez des équipements.</p>
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
                                        @click="openAddModal"
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
                                <h4 class="text-xs font-bold text-gray-700">Aucun équipement renseigné</h4>
                                <p class="text-[11px] text-gray-400 max-w-sm mx-auto mt-1">
                                    Cliquez sur « Modèle standard Galana » pour charger les équipements types ou « Ajouter un matériel » pour une saisie personnalisée.
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
                                        @click="openAddModal"
                                        class="px-3 py-1.5 text-xs font-semibold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg transition cursor-pointer"
                                    >
                                        + Ajouter un matériel
                                    </button>
                                </div>
                            </div>

                            <!-- LISTE DES ÉQUIPEMENTS -->
                            <div v-else class="space-y-3">
                                <div
                                    v-for="(item, index) in items"
                                    :key="index"
                                    class="equipment-item-card p-3.5 rounded-xl border bg-white hover:border-gray-300 transition-all shadow-2xs space-y-3"
                                    :class="item.isNew ? 'border-primary ring-2 ring-primary/20 bg-primary/5' : 'border-gray-200'"
                                >
                                    <div class="flex items-start justify-between gap-2">
                                        <div class="flex items-center gap-2 flex-1">
                                            <span class="w-5 h-5 rounded-md bg-gray-100 text-gray-500 flex items-center justify-center text-[10px] font-bold">
                                                {{ index + 1 }}
                                            </span>
                                            <input
                                                v-model="item.name"
                                                type="text"
                                                placeholder="Nom du matériel..."
                                                class="font-bold text-xs text-gray-900 border-b border-gray-200 hover:border-primary focus:border-primary focus:outline-none flex-1 py-0.5"
                                            />
                                        </div>

                                        <div class="flex items-center gap-2">
                                            <!-- Bouton bascule conformité -->
                                            <button
                                                type="button"
                                                @click="item.conformity = !item.conformity"
                                                class="px-2.5 py-1 rounded-full text-xs font-bold cursor-pointer transition select-none flex items-center gap-1 shadow-2xs"
                                                :class="item.conformity ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'"
                                                :title="'Cliquer pour modifier l\'état de conformité'"
                                            >
                                                <span class="w-1.5 h-1.5 rounded-full inline-block" :class="item.conformity ? 'bg-emerald-500' : 'bg-red-500'"></span>
                                                <span>{{ item.conformity ? 'Conforme' : 'Non conforme' }}</span>
                                            </button>

                                            <!-- Bouton supprimer -->
                                            <button
                                                type="button"
                                                @click="removeItem(index)"
                                                class="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition cursor-pointer"
                                                title="Supprimer cet équipement"
                                            >
                                                <Trash2 :size="14" />
                                            </button>
                                        </div>
                                    </div>

                                    <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-xs">
                                        <div>
                                            <label class="block text-[10px] text-gray-500 font-semibold mb-1">Catégorie</label>
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
                                            <label class="block text-[10px] text-gray-500 font-semibold mb-1">Relevé / Quantité</label>
                                            <input
                                                v-model="item.value"
                                                type="text"
                                                placeholder="Quantité ou Présent/Absent"
                                                class="w-full px-2.5 py-1.5 text-xs rounded-lg border border-gray-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-primary"
                                            />
                                        </div>

                                        <div>
                                            <label class="block text-[10px] text-gray-500 font-semibold mb-1">Emplacement</label>
                                            <input
                                                v-model="item.location"
                                                type="text"
                                                placeholder="Piste, TGBT, Boutique..."
                                                class="w-full px-2.5 py-1.5 text-xs rounded-lg border border-gray-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-primary"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <input
                                            v-model="item.comment"
                                            type="text"
                                            placeholder="Commentaire ou observation spécifique (optionnel)..."
                                            class="w-full px-2.5 py-1 text-[11px] rounded-lg border border-dashed border-gray-200 text-gray-600 placeholder-gray-400 focus:bg-white focus:outline-none focus:border-primary"
                                        />
                                    </div>

                                    <!-- SECTION PHOTOS & PREUVES DU MATÉRIEL -->
                                    <div class="border-t border-gray-100 pt-2.5 flex flex-col gap-2">
                                        <div class="flex items-center justify-between">
                                            <span class="text-[11px] font-semibold text-gray-700 flex items-center gap-1.5">
                                                <Camera :size="13" class="text-gray-500" />
                                                <span>Photos & Preuves</span>
                                                <span v-if="(item.attachments && item.attachments.length) || (item.pendingPhotos && item.pendingPhotos.length)" class="text-[10px] font-bold text-gray-600 bg-gray-100 px-1.5 py-0.2 rounded-full">
                                                    {{ (item.attachments?.length || 0) + (item.pendingPhotos?.length || 0) }}
                                                </span>
                                                <span v-if="item.uploadingPhoto" class="flex items-center gap-1 text-[10px] text-primary font-medium">
                                                    <Loader :size="11" class="animate-spin" />
                                                    <span>Envoi en cours...</span>
                                                </span>
                                            </span>

                                            <label class="text-[11px] font-bold text-primary hover:text-primary/80 hover:underline cursor-pointer flex items-center gap-1">
                                                <Plus :size="13" />
                                                <span>Ajouter une photo</span>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    multiple
                                                    class="hidden"
                                                    @change="onAddPhoto($event, item)"
                                                />
                                            </label>
                                        </div>

                                        <!-- Galerie de photos pour cet équipement -->
                                        <div v-if="(item.attachments && item.attachments.length) || (item.pendingPhotos && item.pendingPhotos.length)" class="flex flex-wrap gap-2 pt-1">
                                            <!-- Photos existantes enregistrées -->
                                            <div
                                                v-for="att in item.attachments"
                                                :key="att.id"
                                                class="relative group w-16 h-16 rounded-lg overflow-hidden border border-gray-200 bg-slate-100 shadow-2xs"
                                            >
                                                <img
                                                    :src="resolvePhotoUrl(att.file_path)"
                                                    class="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform"
                                                    @click="previewImage(resolvePhotoUrl(att.file_path))"
                                                    title="Cliquer pour agrandir la photo"
                                                />
                                                <button
                                                    type="button"
                                                    @click="removeExistingPhoto(item, att.id)"
                                                    class="absolute top-1 right-1 w-5 h-5 bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow cursor-pointer"
                                                    title="Supprimer cette photo"
                                                >
                                                    <XIcon :size="11" />
                                                </button>
                                            </div>

                                            <!-- Photos nouvellement ajoutées en attente d'enregistrement -->
                                            <div
                                                v-for="(photo, pIndex) in item.pendingPhotos"
                                                :key="pIndex"
                                                class="relative group w-16 h-16 rounded-lg overflow-hidden border border-dashed border-primary/50 bg-primary/5 shadow-2xs"
                                            >
                                                <img
                                                    :src="photo.preview"
                                                    class="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform"
                                                    @click="previewImage(photo.preview)"
                                                    title="Photo en attente d'enregistrement"
                                                />
                                                <span class="absolute bottom-0 inset-x-0 bg-primary/85 text-[8px] font-bold text-white text-center py-0.2">
                                                    Nouveau
                                                </span>
                                                <button
                                                    type="button"
                                                    @click="removePendingPhoto(item, pIndex)"
                                                    class="absolute top-1 right-1 w-5 h-5 bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow cursor-pointer"
                                                    title="Supprimer"
                                                >
                                                    <XIcon :size="11" />
                                                </button>
                                            </div>
                                        </div>
                                        <p v-else class="text-[11px] text-gray-400 italic">
                                            Aucune photo jointe pour ce matériel.
                                        </p>
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
                            <span class="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center">
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

                        <!-- INDICATEURS DE CONFORMITÉ -->
                        <div class="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
                            <div class="flex items-center justify-between">
                                <span class="text-xs font-semibold text-gray-600">Taux actuel</span>
                                <span class="text-base font-black" :class="conformityRate >= 90 ? 'text-emerald-700' : 'text-red-700'">
                                    {{ conformityRate }}%
                                </span>
                            </div>

                            <!-- TRACE DU TAUX INITIAL CONSTATÉ -->
                            <div v-if="initialConformityRate !== null && initialConformityRate !== conformityRate" class="flex items-center justify-between text-xs px-2.5 py-1.5 bg-amber-50 rounded-lg border border-amber-200/60 text-amber-900">
                                <span class="text-[11px] font-medium">Taux initial (trace historique) :</span>
                                <span class="font-bold text-[11px] font-mono">{{ initialConformityRate }}%</span>
                            </div>

                            <div class="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                                <div
                                    class="h-full rounded-full transition-all duration-300"
                                    :class="conformityRate >= 90 ? 'bg-emerald-500' : (conformityRate >= 70 ? 'bg-amber-500' : 'bg-red-500')"
                                    :style="{ width: `${conformityRate}%` }"
                                ></div>
                            </div>

                            <div class="grid grid-cols-2 gap-2 text-center text-xs pt-1">
                                <div class="bg-white p-2 rounded-lg border border-gray-100">
                                    <span class="text-[10px] text-gray-400 block">Conformes</span>
                                    <span class="font-bold text-emerald-600">{{ compliantCount }}</span>
                                </div>
                                <div class="bg-white p-2 rounded-lg border border-gray-100">
                                    <span class="text-[10px] text-gray-400 block">Anomalies</span>
                                    <span class="font-bold text-red-600">{{ nonCompliantCount }}</span>
                                </div>
                            </div>
                        </div>

                        <!-- ÉVALUATION CONFORMITÉ -->
                        <div class="flex items-center justify-between text-xs py-1">
                            <span class="text-gray-500">Qualité du parc :</span>
                            <span class="px-2.5 py-0.5 rounded-full text-[11px] font-bold" :class="statusBadgeClass">
                                {{ statusText }}
                            </span>
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
                                <span>{{ loading ? 'Mise à jour en cours...' : 'Enregistrer les modifications' }}</span>
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

                    <!-- CATÉGORIE & QUANTITÉ -->
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
                            <label class="block text-xs font-semibold text-gray-700 mb-1">Relevé / Quantité</label>
                            <input
                                v-model="modalItem.value"
                                type="text"
                                placeholder="Ex: 1, 2, Présent, Conforme..."
                                class="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-300 focus:outline-none focus:border-primary transition"
                            />
                        </div>
                    </div>

                    <!-- EMPLACEMENT & CONFORMITÉ -->
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                        <div>
                            <label class="block text-xs font-semibold text-gray-700 mb-1">Emplacement</label>
                            <input
                                v-model="modalItem.location"
                                type="text"
                                placeholder="Ex: Piste, Boutique, TGBT..."
                                class="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-300 focus:outline-none focus:border-primary transition"
                            />
                        </div>

                        <div>
                            <label class="block text-xs font-semibold text-gray-700 mb-1">État de conformité</label>
                            <button
                                type="button"
                                @click="modalItem.conformity = !modalItem.conformity"
                                class="w-full py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer border shadow-2xs"
                                :class="modalItem.conformity ? 'bg-emerald-50 text-emerald-700 border-emerald-300' : 'bg-red-50 text-red-700 border-red-300'"
                            >
                                <span class="w-2 h-2 rounded-full" :class="modalItem.conformity ? 'bg-emerald-500' : 'bg-red-500'"></span>
                                <span>{{ modalItem.conformity ? 'Conforme' : 'Non conforme' }}</span>
                            </button>
                        </div>
                    </div>

                    <!-- COMMENTAIRE -->
                    <div>
                        <label class="block text-xs font-semibold text-gray-700 mb-1">Commentaire / Observation</label>
                        <textarea
                            v-model="modalItem.comment"
                            rows="2"
                            placeholder="Remarques éventuelles sur l'état du matériel..."
                            class="w-full px-3 py-1.5 text-xs rounded-xl border border-gray-300 focus:outline-none focus:border-primary transition resize-y"
                        ></textarea>
                    </div>

                    <!-- PHOTOS -->
                    <div class="border-t border-gray-100 pt-3">
                        <div class="flex items-center justify-between mb-2">
                            <label class="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                                <Camera :size="14" class="text-gray-500" />
                                <span>Photos & Preuves</span>
                                <span v-if="modalItem.pendingPhotos.length" class="text-[10px] font-bold text-gray-600 bg-gray-100 px-1.5 py-0.2 rounded-full">
                                    {{ modalItem.pendingPhotos.length }}
                                </span>
                            </label>

                            <label class="text-xs font-bold text-primary hover:underline cursor-pointer flex items-center gap-1">
                                <Plus :size="13" />
                                <span>Parcourir</span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    class="hidden"
                                    @change="onModalAddPhotos"
                                />
                            </label>
                        </div>

                        <div v-if="modalItem.pendingPhotos.length" class="flex flex-wrap gap-2 pt-1">
                            <div
                                v-for="(photo, pIdx) in modalItem.pendingPhotos"
                                :key="pIdx"
                                class="relative group w-16 h-16 rounded-lg overflow-hidden border border-gray-200 shadow-2xs"
                            >
                                <img :src="photo.preview" class="w-full h-full object-cover" />
                                <button
                                    type="button"
                                    @click="removeModalPhoto(pIdx)"
                                    class="absolute top-1 right-1 w-5 h-5 bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer"
                                    title="Supprimer la photo"
                                >
                                    <XIcon :size="11" />
                                </button>
                            </div>
                        </div>
                        <p v-else class="text-[11px] text-gray-400 italic">
                            Aucune photo sélectionnée pour ce matériel.
                        </p>
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

        <!-- LIGHTBOX MODAL IMAGE FULLSCREEN -->
        <div
            v-if="lightboxUrl"
            class="fixed inset-0 z-[10000] bg-black/85 backdrop-blur-xs flex items-center justify-center p-4 cursor-pointer"
            @click="lightboxUrl = null"
        >
            <div class="relative max-w-4xl max-h-[90vh]" @click.stop>
                <button
                    type="button"
                    @click="lightboxUrl = null"
                    class="absolute top-2 right-2 bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg cursor-pointer"
                    title="Fermer"
                >
                    <XIcon :size="20" />
                </button>
                <img :src="lightboxUrl" class="max-w-full max-h-[85vh] rounded-xl object-contain shadow-2xl" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue"
import { useRoute, useRouter } from "vue-router"
import {
    ClipboardList,
    Plus,
    Trash2,
    Save,
    Edit,
    Sparkles,
    Package,
    Loader,
    UserCheck,
    Camera,
    X as XIcon,
    Image as ImageIcon,
} from "@lucide/vue"
import Header from "../../../components/shared/Header.vue"
import ChecklistStatus from "../../../components/features/checklist/ChecklistStatus.vue"
import { ChecklistStatusJsonData } from "../../../@data/Checklist.data.ts"
import type { SiteNameType } from "../../../@types/SiteName..type.ts"
import { useEquipmentMonitoringService } from "../../../core/services/equipmentMonitoring.service.ts"
import { useUserService } from "../../../core/services/user.service.ts"
import { toast } from "vue3-toastify"

const route = useRoute()
const router = useRouter()
const equipments = useEquipmentMonitoringService()
const userService = useUserService()
const monitoringId = computed(() => route.params.id as string)

const loadingInitial = ref(true)
const loading = ref(false)
const sites = ref<SiteNameType[]>([])
const users = ref<any[]>([])
const errors = ref<{ site_name?: string[]; date?: string[] } | null>(null)
const lightboxUrl = ref<string | null>(null)

interface DynamicItem {
    id?: number
    name: string
    type: string
    value: string | number
    conformity: boolean
    initial_conformity?: boolean
    location?: string
    comment?: string
    isNew?: boolean
    attachments?: Array<{
        id: number
        file_path: string
        file_name?: string
        file_type?: string
        file_size?: number
    }>
    pendingPhotos?: Array<{
        file: File
        preview: string
    }>
    uploadingPhoto?: boolean
}

const initialConformityRate = ref<number | null>(null)

const form = reactive({
    site_name: "",
    date: "",
    user_id: "",
    status: "DRAFT",
    observations: "",
})

const selectedInspectorName = computed(() => {
    if (!form.user_id) return "Non assigné"
    const found = users.value.find(u => String(u.id) === String(form.user_id))
    if (!found) return "Inspecteur assigné"
    const fullName = `${found.first_name || ""} ${found.last_name || ""}`.trim()
    return fullName || found.email || "Inspecteur assigné"
})

const items = ref<DynamicItem[]>([])

const standardGalanaTemplates = [
    { name: "Extincteur P50", type: "extincteur", value: 1, conformity: true, location: "Piste" },
    { name: "Extincteur P9", type: "extincteur", value: 2, conformity: true, location: "Piste" },
    { name: "Extincteur P6", type: "extincteur", value: 2, conformity: true, location: "Boutique / Bureau" },
    { name: "Extincteur CO₂", type: "extincteur", value: 1, conformity: true, location: "TGBT" },
    { name: "Bac Métallique", type: "bac", value: 1, conformity: true, location: "Piste" },
    { name: "Bac Plastique", type: "bac", value: 1, conformity: true, location: "Piste" },
    { name: "Bac de Rétention", type: "bac", value: 1, conformity: true, location: "Stockage" },
    { name: "Pelles", type: "materiel", value: 2, conformity: true, location: "Zone sable" },
    { name: "Poubelles 120L", type: "poubelle", value: 2, conformity: true, location: "Piste" },
    { name: "Poubelle 240L", type: "poubelle", value: 1, conformity: true, location: "Extérieur" },
    { name: "Boîte CAF (Anti-Feu)", type: "materiel", value: 1, conformity: true, location: "Piste" },
    { name: "Plots de sécurité", type: "securite", value: 4, conformity: true, location: "Piste" },
    { name: "Chaînettes", type: "securite", value: 2, conformity: true, location: "Piste" },
    { name: "Détecteurs de fumée", type: "securite", value: 2, conformity: true, location: "Boutique / TGBT" },
    { name: "Picto Danger TGBT", type: "signalisation", value: "Présent", conformity: true, location: "TGBT" },
    { name: "Panneau Dépotage en cours", type: "signalisation", value: "Présent", conformity: true, location: "Aire dépotage" },
    { name: "Panneau Évent", type: "signalisation", value: "Présent", conformity: true, location: "Évents" },
    { name: "Point de rassemblement", type: "signalisation", value: "Présent", conformity: true, location: "Parking" },
    { name: "Contact d'urgence", type: "signalisation", value: "Présent", conformity: true, location: "Bureau gérance" },
    { name: "Livret / Fiche réflexe", type: "conformite", value: "Présent", conformity: true, location: "Bureau" },
    { name: "Politique HSSE affichée", type: "conformite", value: "Présent", conformity: true, location: "Bureau" },
]

function loadStandardGalanaTemplates() {
    if (items.value.length > 0) {
        if (!confirm("Voulez-vous remplacer les matériels actuels par les 21 équipements du modèle standard Galana ?")) {
            return
        }
    }
    items.value = standardGalanaTemplates.map(it => ({
        ...it,
        attachments: [],
        pendingPhotos: [],
    }))
    toast.success("Modèle standard Galana appliqué (21 équipements).")
}

// ==========================================
// MODAL D'AJOUT D'UN MATÉRIEL
// ==========================================
const isAddModalOpen = ref(false)
const modalNameInputRef = ref<HTMLInputElement | null>(null)

const modalItem = reactive({
    name: "",
    type: "materiel",
    value: "1",
    location: "",
    conformity: true,
    comment: "",
    pendingPhotos: [] as Array<{ file: File; preview: string }>,
})

function openAddModal() {
    modalItem.name = ""
    modalItem.type = "materiel"
    modalItem.value = "1"
    modalItem.location = ""
    modalItem.conformity = true
    modalItem.comment = ""
    modalItem.pendingPhotos = []
    isAddModalOpen.value = true
    setTimeout(() => {
        modalNameInputRef.value?.focus()
    }, 100)
}

function closeAddModal() {
    isAddModalOpen.value = false
}

function onModalAddPhotos(event: Event) {
    const input = event.target as HTMLInputElement
    if (!input.files || input.files.length === 0) return
    for (const f of Array.from(input.files)) {
        modalItem.pendingPhotos.push({
            file: f,
            preview: URL.createObjectURL(f),
        })
    }
    input.value = ""
}

function removeModalPhoto(index: number) {
    const removed = modalItem.pendingPhotos.splice(index, 1)
    if (removed[0]?.preview) {
        URL.revokeObjectURL(removed[0].preview)
    }
}

function confirmAddModalItem() {
    if (!modalItem.name.trim()) {
        toast.warning("Veuillez saisir le nom du matériel.")
        return
    }

    const newItem: DynamicItem = {
        name: modalItem.name.trim(),
        type: modalItem.type,
        value: modalItem.value,
        conformity: modalItem.conformity,
        location: modalItem.location.trim() || undefined,
        comment: modalItem.comment.trim() || undefined,
        attachments: [],
        pendingPhotos: [...modalItem.pendingPhotos],
        isNew: true,
    }

    // Ajout en TÊTE de liste pour être immédiatement visible à l'écran
    items.value.unshift(newItem)
    isAddModalOpen.value = false
    toast.success(`Matériel « ${newItem.name} » ajouté en tête de contrôle !`)

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
        value: 1,
        conformity: true,
        location: "",
        comment: "",
        attachments: [],
        pendingPhotos: [],
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

function resolvePhotoUrl(path: string) {
    if (!path) return ""
    if (path.startsWith("http")) return path
    const backendUrl = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace("/api", "") : "http://127.0.0.1:8000"
    return `${backendUrl}${path}`
}

function previewImage(url: string) {
    lightboxUrl.value = url
}

async function onAddPhoto(event: Event, item: DynamicItem) {
    const input = event.target as HTMLInputElement
    if (!input.files || input.files.length === 0) return
    const files = Array.from(input.files)

    for (const file of files) {
        if (item.id) {
            try {
                item.uploadingPhoto = true
                const res = await equipments.uploadItemPhoto(item.id, file)
                if (res?.data?.attachment) {
                    if (!item.attachments) item.attachments = []
                    item.attachments.push(res.data.attachment)
                    toast.success(`Photo ajoutée pour ${item.name || 'le matériel'}`)
                }
            } catch (err) {
                console.error("Erreur lors de l'upload de photo:", err)
                toast.error("Impossible de téléverser la photo.")
            } finally {
                item.uploadingPhoto = false
            }
        } else {
            if (!item.pendingPhotos) item.pendingPhotos = []
            item.pendingPhotos.push({
                file,
                preview: URL.createObjectURL(file),
            })
        }
    }
    input.value = ""
}

async function removeExistingPhoto(item: DynamicItem, photoId: number) {
    try {
        await equipments.deleteItemPhoto(photoId)
        if (item.attachments) {
            item.attachments = item.attachments.filter(att => att.id !== photoId)
        }
        toast.success("Photo supprimée avec succès")
    } catch (err) {
        console.error("Erreur suppression photo:", err)
        toast.error("Impossible de supprimer la photo.")
    }
}

function removePendingPhoto(item: DynamicItem, index: number) {
    if (item.pendingPhotos) {
        const removed = item.pendingPhotos.splice(index, 1)
        if (removed[0]?.preview) {
            URL.revokeObjectURL(removed[0].preview)
        }
    }
}

const compliantCount = computed(() => items.value.filter(it => it.conformity).length)
const nonCompliantCount = computed(() => items.value.filter(it => !it.conformity).length)

const conformityRate = computed(() => {
    if (items.value.length === 0) return 100
    const rate = (compliantCount.value / items.value.length) * 100
    return Math.round(rate * 10) / 10
})

const estimatedStatus = computed(() => {
    if (conformityRate.value >= 90) return "COMPLETED"
    if (conformityRate.value >= 70) return "WARNING"
    return "NON_CONFORME"
})

const statusText = computed(() => {
    if (conformityRate.value >= 90) return "🟢 Conforme"
    if (conformityRate.value >= 70) return "🟡 Contrôle requis"
    return "🔴 Anomalie"
})

const statusBadgeClass = computed(() => {
    if (conformityRate.value >= 90) return "bg-emerald-50 text-emerald-800 border border-emerald-200"
    if (conformityRate.value >= 70) return "bg-amber-50 text-amber-800 border border-amber-200"
    return "bg-red-50 text-red-800 border border-red-200"
})

async function fetchDetails() {
    loadingInitial.value = true
    try {
        const res = await equipments.show(monitoringId.value)
        const d = res?.data as any
        if (d) {
            form.site_name = typeof d.site_name === "object" ? d.site_name?.name : d.site_name
            form.date = d.date || ""
            form.user_id = d.user?.id || d.user_id || ""
            
            const validStatuses = ["DRAFT", "IN_PROGRESS", "COMPLETED", "CANCELLED"]
            form.status = validStatuses.includes(d.status) ? d.status : "COMPLETED"
            
            form.observations = d.observations || ""
            initialConformityRate.value = d.initial_conformity_rate !== undefined ? d.initial_conformity_rate : (d.conformity_rate ?? 100)

            if (d.items && Array.isArray(d.items)) {
                items.value = d.items.map((it: any) => ({
                    id: it.id,
                    name: it.name,
                    type: it.type || "divers",
                    value: it.value,
                    conformity: Boolean(it.conformity),
                    initial_conformity: it.initial_conformity !== undefined ? Boolean(it.initial_conformity) : Boolean(it.conformity),
                    location: it.location || "",
                    comment: it.comment || "",
                    attachments: it.attachments ? [...it.attachments] : [],
                    pendingPhotos: [],
                }))
            }
        }
    } catch (err) {
        console.error("Erreur chargement suivi:", err)
        toast.error("Impossible de charger les données du suivi.")
    } finally {
        loadingInitial.value = false
    }
}

async function submit() {
    errors.value = null
    if (!form.site_name) {
        errors.value = { site_name: ["Le site est requis"] }
        toast.error("Veuillez renseigner un site.")
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
            conformity_rate: conformityRate.value,
            initial_conformity_rate: initialConformityRate.value !== null ? initialConformityRate.value : conformityRate.value,
            items: items.value.map(it => ({
                id: it.id,
                name: it.name || "Matériel non spécifié",
                type: it.type || "divers",
                conformity: it.conformity,
                initial_conformity: it.initial_conformity !== undefined ? it.initial_conformity : it.conformity,
                value_type: typeof it.value === "number" ? "number" : "text",
                value: String(it.value ?? ""),
                location: it.location || null,
                comment: it.comment || null,
            })),
        }

        const updateRes = await equipments.update(monitoringId.value, payload)
        const returnedItems = updateRes?.data?.items || []

        // Téléverser les photos en attente pour chaque matériel
        for (let i = 0; i < items.value.length; i++) {
            const item = items.value[i]
            if (item.pendingPhotos && item.pendingPhotos.length > 0) {
                const targetId = item.id || returnedItems[i]?.id || returnedItems.find((r: any) => r.name === item.name)?.id
                if (targetId) {
                    for (const p of item.pendingPhotos) {
                        try {
                            await equipments.uploadItemPhoto(targetId, p.file)
                        } catch (uploadErr) {
                            console.error("Erreur upload photo différée:", uploadErr)
                        }
                    }
                }
            }
        }

        toast.success("Suivi du matériel mis à jour avec succès !")
        router.push({ name: "EQUIPMENT_MONITORING_DETAILS", params: { id: monitoringId.value } })
    } catch (err: any) {
        console.error("Erreur mise à jour suivi:", err)
        if (err?.response?.status === 422 && err.response.data.errors) {
            errors.value = err.response.data.errors
            toast.error("Veuillez vérifier les informations saisies.")
        } else {
            toast.error("Une erreur est survenue lors de la mise à jour.")
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
    fetchDetails()
})
</script>
