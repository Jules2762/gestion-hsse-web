<template>
    <div class="flex flex-row w-full">
        <div class="flex flex-col w-full transition-all" :class="selected_action ? 'w-[calc(100%-400px)]' : 'w-full'">
            <!-- HEADER -->
            <Header title="Gestion des actions correctives" show-search @search="handleSearch" :thumbnails="[
                { label: 'Accueil', name: 'DASHBOARD' },
                { label: 'Inspection', name: 'INSPECTION' },
                { label: 'Actions correctives', name: 'ACTION' }
            ]" />

            <!-- ======================= RIBBON TOOLBAR & FILTRES ======================= -->
            <div class="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div class="px-6 py-3 flex flex-wrap items-center justify-between gap-4">
                    <!-- Onglets Origine (Toutes / Checklists / VMC) -->
                    <div class="flex items-center gap-1.5 bg-gray-100 p-1 rounded-xl">
                        <button
                            type="button"
                            @click="setOrigin('ALL')"
                            :class="selectedOrigin === 'ALL' ? 'bg-white text-gray-900 shadow-xs font-semibold' : 'text-gray-500 hover:text-gray-800'"
                            class="px-3.5 py-1.5 text-xs rounded-lg transition-all flex items-center gap-2 cursor-pointer">
                            <span>Toutes</span>
                            <span class="px-1.5 py-0.5 rounded-full text-[10px]" :class="selectedOrigin === 'ALL' ? 'bg-primary/10 text-primary font-bold' : 'bg-gray-200 text-gray-600'">
                                {{ meta.total }}
                            </span>
                        </button>

                        <button
                            type="button"
                            @click="setOrigin('CHECKLIST')"
                            :class="selectedOrigin === 'CHECKLIST' ? 'bg-white text-blue-700 shadow-xs font-semibold' : 'text-gray-500 hover:text-gray-800'"
                            class="px-3.5 py-1.5 text-xs rounded-lg transition-all flex items-center gap-2 cursor-pointer">
                            <ListChecks :size="14" class="text-blue-600" />
                            <span>Checklists</span>
                            <span class="px-1.5 py-0.5 rounded-full text-[10px]" :class="selectedOrigin === 'CHECKLIST' ? 'bg-blue-100 text-blue-800 font-bold' : 'bg-gray-200 text-gray-600'">
                                {{ meta.checklist_count }}
                            </span>
                        </button>

                        <button
                            type="button"
                            @click="setOrigin('VMC')"
                            :class="selectedOrigin === 'VMC' ? 'bg-white text-[#0F9D58] shadow-xs font-semibold' : 'text-gray-500 hover:text-gray-800'"
                            class="px-3.5 py-1.5 text-xs rounded-lg transition-all flex items-center gap-2 cursor-pointer">
                            <ShieldAlert :size="14" class="text-[#0F9D58]" />
                            <span>Visites VMC</span>
                            <span class="px-1.5 py-0.5 rounded-full text-[10px]" :class="selectedOrigin === 'VMC' ? 'bg-emerald-100 text-emerald-800 font-bold' : 'bg-gray-200 text-gray-600'">
                                {{ meta.vmc_count }}
                            </span>
                        </button>
                    </div>

                    <!-- Filtres : Statut, Date, Recherche et Recharger -->
                    <div class="flex flex-wrap items-center gap-3">
                        <!-- Filtre Statut -->
                        <div class="flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-lg p-0.5 text-xs">
                            <button
                                type="button"
                                v-for="st in statusOptions"
                                :key="st.value"
                                @click="setStatusFilter(st.value)"
                                :class="selectedStatus === st.value ? 'bg-white text-gray-900 shadow-xs font-bold border border-gray-200' : 'text-gray-600 hover:text-gray-900'"
                                class="px-2.5 py-1 rounded-md transition-all cursor-pointer">
                                {{ st.label }}
                            </button>
                        </div>

                        <!-- Date -->
                        <div class="relative flex items-center">
                            <Calendar1Icon :size="15" class="absolute left-3 text-gray-400 pointer-events-none" />
                            <input
                                type="date"
                                v-model="selectedDate"
                                @change="fetchActions"
                                class="pl-9 pr-3 py-1.5 text-xs border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-primary" />
                            <button
                                v-if="selectedDate"
                                @click="selectedDate = ''; fetchActions()"
                                class="ml-1 text-gray-400 hover:text-gray-600 text-xs">
                                ✕
                            </button>
                        </div>

                        <!-- Actualiser -->
                        <button
                            type="button"
                            @click="fetchActions"
                            :disabled="loading"
                            class="p-2 text-gray-600 hover:text-primary border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors cursor-pointer"
                            title="Actualiser les actions">
                            <RefreshCw :size="15" :class="loading ? 'animate-spin text-primary' : ''" />
                        </button>
                    </div>
                </div>

                <!-- KPI SUMMARY BAR -->
                <div class="border-t border-gray-100 px-6 py-2.5 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-50/50">
                    <div class="flex items-center gap-2">
                        <span class="w-2.5 h-2.5 rounded-full bg-slate-400"></span>
                        <span class="text-gray-500">Total actions :</span>
                        <span class="font-bold text-gray-800">{{ meta.current_count ?? meta.total }}</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <span class="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                        <span class="text-gray-500">En attente :</span>
                        <span class="font-bold text-amber-600">{{ meta.pending }}</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <span class="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                        <span class="text-gray-500">En cours :</span>
                        <span class="font-bold text-blue-600">{{ meta.in_progress }}</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                        <span class="text-gray-500">Terminées :</span>
                        <span class="font-bold text-emerald-600">{{ meta.finished }}</span>
                    </div>
                </div>
            </div>

            <!-- CONTENU PRINCIPAL -->
            <div class="flex flex-col flex-1 min-w-0">
                <!-- CHARGEMENT -->
                <div v-if="loading" class="p-16 flex flex-col items-center justify-center gap-3 text-gray-500">
                    <Loader2 :size="32" class="animate-spin text-primary" />
                    <span class="text-sm font-medium">Chargement des actions correctives en cours...</span>
                </div>

                <!-- AUCUN RÉSULTAT -->
                <div v-else-if="actions.length === 0" class="p-16 flex flex-col items-center justify-center text-center">
                    <div class="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mb-4">
                        <AlertCircle :size="28" />
                    </div>
                    <h5 class="text-gray-700 font-semibold mb-1">Aucune action corrective trouvée</h5>
                    <p class="text-sm text-gray-500 max-w-sm">
                        Aucune action ne correspond aux filtres sélectionnés. Modifiez vos critères de recherche.
                    </p>
                    <div class="flex gap-2 mt-4">
                        <button
                            v-if="selectedOrigin !== 'ALL' || selectedStatus || selectedDate || searchQuery"
                            @click="resetFilters"
                            class="px-4 py-2 text-xs font-medium text-primary bg-primary/10 rounded-lg hover:bg-primary/20 transition">
                            Réinitialiser tous les filtres
                        </button>
                    </div>
                </div>

                <!-- TABLEAU (PLEINE LARGEUR, CONFORME AUX AUTRES PAGES) -->
                <div v-else class="transition-all w-full overflow-x-auto scrollbar-hide">
                    <table class="w-full">
                        <thead>
                            <tr>
                                <th class="w-16 text-center">REF</th>
                                <th>ORIGINE</th>
                                <th>INSPECTION SOURCE</th>
                                <th>ÉCART / CONSTAT</th>
                                <th>ACTION CORRECTIVE</th>
                                <th>RESPONSABLE</th>
                                <th class="text-center">STATUT</th>
                                <th class="text-center">E-MAIL</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr
                                v-for="(item, index) in actions"
                                :key="getActionKey(item)"
                                @contextmenu.prevent="openContextMenu($event, item)"
                                @click="selected_action = item"
                                :class="isSelected(item) ? 'bg-primary/10 font-medium' : ''"
                                class="cursor-pointer">
                                <!-- Index -->
                                <td class="font-mono text-xs text-gray-400 text-center">
                                    #{{ item.raw_id || (index + 1) }}
                                </td>

                                <!-- Origine Badge -->
                                <td>
                                    <span
                                        v-if="item.origin === 'CHECKLIST'"
                                        class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                                        <ListChecks :size="11" />
                                        Checklist
                                    </span>
                                    <span
                                        v-else
                                        class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-[#0F9D58] border border-emerald-200">
                                        <ShieldAlert :size="11" />
                                        VMC
                                    </span>
                                </td>

                                <!-- Source inspection (clickable) -->
                                <td>
                                    <div class="flex flex-col">
                                        <span class="font-bold text-gray-800 line-clamp-1 hover:text-primary" @click.stop="goToInspection(item)">
                                            {{ item.parent_title }}
                                        </span>
                                        <span class="text-[10px] text-gray-400 mt-0.5">
                                            Site: {{ item.parent_site }}
                                        </span>
                                    </div>
                                </td>

                                <!-- Constat / Question non conforme -->
                                <td>
                                    <div class="flex flex-col max-w-xs">
                                        <span class="text-gray-800 font-medium line-clamp-2">
                                            {{ item.item_title }}
                                        </span>
                                        <span v-if="item.item_observation" class="text-[10px] text-gray-400 italic mt-0.5 line-clamp-1">
                                            Obs: {{ item.item_observation }}
                                        </span>
                                    </div>
                                </td>

                                <!-- Action corrective -->
                                <td>
                                    <p class="font-semibold text-gray-900 line-clamp-2">
                                        {{ item.description }}
                                    </p>
                                    <span class="text-[10px] text-gray-400 mt-0.5 block font-mono">
                                        Créée le {{ item.created_at_date || item.created_at }}
                                    </span>
                                </td>

                                <!-- Responsable -->
                                <td>
                                    <div v-if="item.assigned_to" class="flex items-center gap-2">
                                        <div class="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                                            {{ item.assigned_to.first_name ? item.assigned_to.first_name.charAt(0).toUpperCase() : 'R' }}
                                        </div>
                                        <div class="truncate">
                                            <p class="font-medium text-gray-800 truncate">
                                                {{ item.assigned_to.name || item.assigned_to.first_name + ' ' + (item.assigned_to.last_name || '') }}
                                            </p>
                                            <p class="text-[10px] text-gray-400 truncate">
                                                {{ item.assigned_to.department || item.assigned_to.job || '—' }}
                                            </p>
                                        </div>
                                    </div>
                                    <span v-else class="text-gray-400 italic text-[11px]">Non assigné</span>
                                </td>

                                <!-- Statut -->
                                <td class="text-center">
                                    <ActionStatus :name="item.status || 'PENDING'" />
                                </td>

                                <!-- E-mail -->
                                <td class="text-center">
                                    <ActionEmailStatus :status="item.email_status || 'NOT_SENT'" />
                                </td>
                            </tr>
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colspan="8" class="w-full p-4 border-t border-gray-200">
                                    <div class="flex flex-row items-center justify-between text-sm">
                                        <span class="text-xs text-gray-500 font-medium">
                                            Affichage de {{ actions.length }} actions correctives
                                        </span>
                                    </div>
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>

            <!-- MENU CONTEXTUEL -->
            <ContextMenuUI
                v-model="contextMenu.isOpen"
                :context-menu="contextMenu.contextMenu"
                :actions="contextMenuActions" />
        </div>

        <!-- ======================= DRAWER LATÉRAL ======================= -->
        <aside
            v-if="selected_action"
            aria-label="Détails de l'action corrective"
            class="bg-white border-l border-gray-200 overflow-y-auto overflow-x-hidden h-screen sticky top-0 scrollbar-hide transition-all shadow-xl z-20 shrink-0 w-[400px] min-w-[400px] max-w-[400px] p-5">
                <!-- HEADER SIDEBAR -->
                <div class="border-b border-gray-200 pb-3 flex items-start justify-between">
                    <div>
                        <div class="flex items-center gap-2">
                            <h5 class="font-bold text-sm text-gray-900">Détails de l'action</h5>
                            <span
                                v-if="selected_action.origin === 'CHECKLIST'"
                                class="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-700">
                                Checklist
                            </span>
                            <span
                                v-else
                                class="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-[#0F9D58]">
                                VMC
                            </span>
                        </div>
                        <p class="text-[11px] text-gray-500 mt-0.5">
                            Réf : #{{ selected_action.raw_id || selected_action.id }}
                        </p>
                    </div>

                    <button
                        @click="selected_action = undefined"
                        class="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 cursor-pointer">
                        <XIcon :size="18" />
                    </button>
                </div>

                <!-- CARTE STATUT & DESCRIPTION -->
                <div class="mt-4 rounded-xl border border-primary/20 bg-primary/5 p-4">
                    <div class="flex items-center justify-between">
                        <ActionStatus :name="selected_action.status || 'PENDING'" />
                        <ActionEmailStatus :status="selected_action.email_status || 'NOT_SENT'" />
                    </div>
                    <p class="mt-3 text-xs font-semibold text-gray-800 leading-relaxed">
                        {{ selected_action.description }}
                    </p>
                </div>

                <!-- CONSTANT / POINT NON-CONFORME -->
                <div class="mt-4 p-3 bg-red-50/70 border border-red-200/80 rounded-xl text-xs">
                    <span class="text-[10px] uppercase tracking-wider font-bold text-red-700 block">
                        Constat non conforme (Écart)
                    </span>
                    <p class="mt-1 font-medium text-gray-800">
                        {{ selected_action.item_title }}
                    </p>
                    <p v-if="selected_action.item_observation" class="mt-1.5 text-gray-600 italic">
                        Observation : {{ selected_action.item_observation }}
                    </p>
                </div>

                <!-- INSPECTION SOURCE -->
                <div class="mt-4 border-t border-gray-200 pt-3">
                    <span class="text-[10px] uppercase tracking-wide font-bold text-gray-400 block mb-1">
                        Origine & Inspection source
                    </span>
                    <div class="bg-gray-50 border border-gray-200 rounded-lg p-2.5 flex items-center justify-between">
                        <div class="truncate mr-2">
                            <p class="text-xs font-bold text-gray-800 truncate">
                                {{ selected_action.parent_title }}
                            </p>
                            <p class="text-[10px] text-gray-500">
                                Site : {{ selected_action.parent_site }} ({{ selected_action.parent_type }})
                            </p>
                        </div>
                        <button
                            type="button"
                            @click="goToInspection(selected_action)"
                            class="p-1.5 text-xs text-primary bg-primary/10 hover:bg-primary/20 rounded-md transition-colors cursor-pointer shrink-0"
                            title="Ouvrir la fiche d'inspection">
                            <ExternalLink :size="14" />
                        </button>
                    </div>
                </div>

                <!-- RESPONSABLE -->
                <div class="mt-4 border-t border-gray-200 pt-3">
                    <span class="text-[10px] uppercase tracking-wide font-bold text-gray-400 block mb-2">
                        Responsable de l'action
                    </span>

                    <div v-if="selected_action.assigned_to" class="flex items-center gap-3">
                        <div class="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-bold text-primary shrink-0">
                            {{ selected_action.assigned_to.first_name ? selected_action.assigned_to.first_name.charAt(0).toUpperCase() : 'R' }}
                        </div>
                        <div class="truncate">
                            <p class="text-xs font-bold text-gray-900 truncate">
                                {{ selected_action.assigned_to.name || selected_action.assigned_to.first_name + ' ' + (selected_action.assigned_to.last_name || '') }}
                            </p>
                            <p class="text-[11px] text-gray-500 truncate">
                                {{ selected_action.assigned_to.email || 'Aucun e-mail' }}
                            </p>
                            <p class="text-[10px] text-gray-400 mt-0.5 truncate">
                                {{ selected_action.assigned_to.department }} — {{ selected_action.assigned_to.job }}
                            </p>
                        </div>
                    </div>
                    <div v-else class="text-xs text-gray-400 italic">
                        Aucun responsable assigné pour cette action.
                    </div>
                </div>

                <!-- DATES -->
                <div class="mt-4 border-t border-gray-200 pt-3 flex items-center justify-between text-xs text-gray-500">
                    <span>Créée le :</span>
                    <span class="font-medium text-gray-800">{{ selected_action.created_at }}</span>
                </div>

                <!-- PIÈCES JOINTES & PHOTOS -->
                <div class="mt-4 border-t border-gray-200 pt-3">
                    <div class="flex items-center justify-between mb-2">
                        <div class="flex items-center gap-1.5">
                            <Paperclip :size="14" class="text-gray-500" />
                            <span class="text-[10px] uppercase tracking-wide font-bold text-gray-400">
                                Pièces jointes & Photos
                            </span>
                            <span class="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-gray-100 text-gray-600">
                                {{ selected_action.attachments?.length || 0 }}
                            </span>
                        </div>
                        <button
                            type="button"
                            @click="triggerFileInput"
                            :disabled="isUploadingAttachment"
                            class="text-xs font-bold text-primary hover:text-primary/80 flex items-center gap-1 cursor-pointer disabled:opacity-50 transition-colors">
                            <Loader2 v-if="isUploadingAttachment" :size="12" class="animate-spin" />
                            <Plus v-else :size="12" />
                            <span>Ajouter</span>
                        </button>
                    </div>

                    <!-- Input caché pour upload de fichiers -->
                    <input
                        ref="fileInputRef"
                        type="file"
                        multiple
                        accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
                        class="hidden"
                        @change="handleFileUpload"
                    />

                    <!-- Liste / Grille des pièces jointes -->
                    <div v-if="selected_action.attachments && selected_action.attachments.length > 0" class="flex flex-col gap-2">
                        <!-- Miniatures Photos -->
                        <div v-if="photoAttachments.length > 0" class="flex flex-col gap-1.5">
                            <span class="text-[10px] text-gray-400 font-semibold">Photos & Preuves :</span>
                            <div class="grid grid-cols-3 gap-2">
                                <div
                                    v-for="att in photoAttachments"
                                    :key="att.id"
                                    class="group relative h-20 rounded-lg overflow-hidden border border-gray-200 bg-gray-50 cursor-pointer shadow-xs hover:border-primary transition-all"
                                    @click="openLightbox(att)"
                                    :title="att.file_name">
                                    <img
                                        :src="resolveAttachmentUrl(att)"
                                        :alt="att.file_name"
                                        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                                        loading="lazy"
                                    />
                                    <!-- Source Badge -->
                                    <span
                                        :class="att.source === 'ACTION' ? 'bg-primary text-white' : 'bg-gray-800/80 text-white'"
                                        class="absolute bottom-1 left-1 text-[8px] font-bold px-1 py-0.2 rounded backdrop-blur-xs">
                                        {{ att.source === 'ACTION' ? 'Preuve' : 'Constat' }}
                                    </span>
                                    <!-- Overlay hover icons -->
                                    <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-1.5 transition-opacity">
                                        <button
                                            type="button"
                                            @click.stop="openLightbox(att)"
                                            class="p-1 rounded-full bg-white/90 text-gray-800 hover:bg-white transition-colors"
                                            title="Agrandir">
                                            <Eye :size="13" />
                                        </button>
                                        <button
                                            v-if="att.source === 'ACTION'"
                                            type="button"
                                            @click.stop="deleteAttachment(att)"
                                            class="p-1 rounded-full bg-red-600/90 text-white hover:bg-red-600 transition-colors"
                                            title="Supprimer">
                                            <Trash2 :size="13" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Documents (PDF, Word, etc.) -->
                        <div v-if="docAttachments.length > 0" class="flex flex-col gap-1.5 mt-1">
                            <span class="text-[10px] text-gray-400 font-semibold">Documents :</span>
                            <div class="flex flex-col gap-1.5">
                                <div
                                    v-for="att in docAttachments"
                                    :key="att.id"
                                    class="flex items-center justify-between p-2 rounded-lg bg-gray-50 border border-gray-200 hover:bg-gray-100/70 transition-colors text-xs">
                                    <a
                                        :href="resolveAttachmentUrl(att)"
                                        target="_blank"
                                        class="flex items-center gap-2 truncate flex-1 mr-2 text-gray-800 hover:text-primary">
                                        <FileText :size="16" class="text-gray-500 shrink-0" />
                                        <div class="truncate">
                                            <p class="font-medium text-[11px] truncate">{{ att.file_name }}</p>
                                            <p class="text-[9px] text-gray-400">{{ formatFileSize(att.file_size) }} • {{ att.source === 'ACTION' ? 'Preuve action' : 'Inspection' }}</p>
                                        </div>
                                    </a>
                                    <div class="flex items-center gap-1 shrink-0">
                                        <a
                                            :href="resolveAttachmentUrl(att)"
                                            target="_blank"
                                            download
                                            class="p-1 text-gray-400 hover:text-primary rounded transition-colors"
                                            title="Télécharger">
                                            <Download :size="13" />
                                        </a>
                                        <button
                                            v-if="att.source === 'ACTION'"
                                            type="button"
                                            @click="deleteAttachment(att)"
                                            class="p-1 text-gray-400 hover:text-red-600 rounded transition-colors"
                                            title="Supprimer">
                                            <Trash2 :size="13" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- État vide -->
                    <div
                        v-else
                        @click="triggerFileInput"
                        class="p-4 border-2 border-dashed border-gray-200 hover:border-primary/50 rounded-xl flex flex-col items-center justify-center gap-1 text-center cursor-pointer transition-colors bg-gray-50/50 hover:bg-primary/5 group">
                        <Upload :size="18" class="text-gray-400 group-hover:text-primary transition-colors" />
                        <span class="text-xs font-semibold text-gray-600 group-hover:text-primary transition-colors">
                            Aucune pièce jointe
                        </span>
                        <span class="text-[10px] text-gray-400">
                            Cliquez pour joindre une photo ou un document de preuve
                        </span>
                    </div>
                </div>

                <!-- ACTIONS WORKFLOW -->
                <div class="mt-5 border-t border-gray-200 pt-4 flex flex-col gap-2">
                    <!-- Statut Workflow Buttons -->
                    <button
                        v-if="selected_action.status === 'PENDING'"
                        type="button"
                        @click="updateActionStatus(selected_action, 'IN_PROGRESS')"
                        class="w-full py-2 px-3 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-colors">
                        <PlayCircle :size="15" />
                        Prendre en charge (En cours)
                    </button>

                    <button
                        v-if="selected_action.status === 'IN_PROGRESS'"
                        type="button"
                        @click="updateActionStatus(selected_action, 'FINISHED')"
                        class="w-full py-2 px-3 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-colors">
                        <CheckCircle2 :size="15" />
                        Clôturer l'action (Terminée)
                    </button>

                    <button
                        v-if="selected_action.status === 'FINISHED'"
                        type="button"
                        @click="updateActionStatus(selected_action, 'PENDING')"
                        class="w-full py-2 px-3 text-xs font-bold text-gray-700 bg-amber-100 hover:bg-amber-200 rounded-lg flex items-center justify-center gap-2 cursor-pointer transition-colors">
                        <RotateCcw :size="15" />
                        Réouvrir l'action
                    </button>

                    <!-- Notifier par email officiel -->
                    <button
                        type="button"
                        @click="sendEmail(selected_action)"
                        :disabled="sendingEmailKey === getActionKey(selected_action)"
                        class="w-full py-2 px-3 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 rounded-lg flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-xs">
                        <Loader2 v-if="sendingEmailKey === getActionKey(selected_action)" :size="15" class="animate-spin" />
                        <Mail v-else :size="15" />
                        <span>{{ selected_action.email_status === 'SENT' ? 'Réenvoyer l\'e-mail officiel' : 'Notifier par e-mail' }}</span>
                    </button>

                    <!-- Brouillon Outlook / Mailto si un email existe -->
                    <a
                        v-if="selected_action.assigned_to?.email"
                        :href="getMailtoLink(selected_action)"
                        class="w-full py-1.5 px-3 text-[11px] font-medium text-gray-600 hover:text-gray-800 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-center gap-1.5 cursor-pointer transition-colors text-center">
                        <ExternalLink :size="13" />
                        <span>Ouvrir un brouillon dans Outlook</span>
                    </a>

                    <!-- Naviguer vers l'inspection -->
                    <button
                        type="button"
                        @click="goToInspection(selected_action)"
                        class="w-full py-2 px-3 text-xs font-semibold text-primary hover:bg-primary/10 border border-primary/20 rounded-lg flex items-center justify-center gap-2 cursor-pointer transition-colors">
                        <ExternalLink :size="15" />
                        Voir la fiche complète
                    </button>
                </div>
        </aside>

        <!-- LIGHTBOX / APERÇU PHOTO AGRANDIE -->
        <div
            v-if="lightboxAttachment"
            class="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4 transition-all"
            @click="lightboxAttachment = null">
            <div class="relative max-w-4xl max-h-[90vh] flex flex-col items-center gap-2" @click.stop>
                <!-- Top action bar -->
                <div class="w-full flex items-center justify-between text-white px-1">
                    <div class="flex items-center gap-2 truncate mr-4">
                        <span class="text-xs font-medium truncate">{{ lightboxAttachment.file_name }}</span>
                        <span
                            :class="lightboxAttachment.source === 'ACTION' ? 'bg-primary text-white' : 'bg-white/20 text-white'"
                            class="text-[9px] font-bold px-1.5 py-0.5 rounded">
                            {{ lightboxAttachment.source === 'ACTION' ? 'Preuve action' : 'Constat inspection' }}
                        </span>
                    </div>
                    <div class="flex items-center gap-2 shrink-0">
                        <a
                            :href="resolveAttachmentUrl(lightboxAttachment)"
                            target="_blank"
                            download
                            class="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                            title="Télécharger l'image">
                            <Download :size="16" />
                        </a>
                        <button
                            type="button"
                            @click="lightboxAttachment = null"
                            class="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                            title="Fermer">
                            <XIcon :size="16" />
                        </button>
                    </div>
                </div>

                <!-- Image display -->
                <div class="rounded-xl overflow-hidden shadow-2xl bg-black/40 flex items-center justify-center max-h-[82vh]">
                    <img
                        :src="resolveAttachmentUrl(lightboxAttachment)"
                        :alt="lightboxAttachment.file_name"
                        class="max-w-full max-h-[82vh] object-contain"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, type Component } from 'vue'
import Header from '../../../components/shared/Header.vue'
import ActionStatus from '../../../components/features/action/ActionStatus.vue'
import ActionEmailStatus from '../../../components/features/action/ActionEmailStatus.vue'
import ContextMenuUI from '../../../components/ui/ContextMenuUI.vue'
import { router } from '../../../router/index.ts'
import { useActionService } from '../../../core/services/action.service.ts'
import type { ActionAttachmentType, ActionMetaType, ActionStatusType, ActionType } from '../../../@types/Action.type.ts'
import type { contextMenuType } from '../../../@types/ContextMenu.type.ts'
import { toast } from 'vue3-toastify'
import {
    AlertCircle,
    Calendar1Icon,
    CheckCircle2,
    Download,
    ExternalLink,
    Eye,
    FileText,
    ListChecks,
    Loader2,
    Mail,
    Paperclip,
    PlayCircle,
    Plus,
    RefreshCw,
    RotateCcw,
    ShieldAlert,
    Trash2,
    Upload,
    XIcon
} from '@lucide/vue'

const actionService = useActionService()

// Données d'actions
const actions = ref<ActionType[]>([])
const selected_action = ref<ActionType>()
const loading = ref<boolean>(false)
const sendingEmailKey = ref<string | null>(null)

// Pièces jointes & photos
const lightboxAttachment = ref<ActionAttachmentType | null>(null)
const isUploadingAttachment = ref<boolean>(false)
const fileInputRef = ref<HTMLInputElement | null>(null)

const photoAttachments = computed<ActionAttachmentType[]>(() => {
    const list = selected_action.value?.attachments || []
    return list.filter(isImageAttachment)
})

const docAttachments = computed<ActionAttachmentType[]>(() => {
    const list = selected_action.value?.attachments || []
    return list.filter(att => !isImageAttachment(att))
})

function isImageAttachment(att: ActionAttachmentType): boolean {
    if (att.file_type && att.file_type.startsWith('image/')) return true
    const ext = (att.file_name || att.file_path || '').split('.').pop()?.toLowerCase()
    return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'].includes(ext || '')
}

function resolveAttachmentUrl(att: ActionAttachmentType): string {
    if (att.url) {
        if (att.url.startsWith('http')) return att.url
        const backendUrl = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://127.0.0.1:8000'
        return `${backendUrl}${att.url.startsWith('/') ? '' : '/'}${att.url}`
    }
    if (att.file_path) {
        if (att.file_path.startsWith('http')) return att.file_path
        const backendUrl = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://127.0.0.1:8000'
        const clean = att.file_path.startsWith('/') ? att.file_path : `/${att.file_path}`
        return clean.startsWith('/storage') ? `${backendUrl}${clean}` : `${backendUrl}/storage${clean}`
    }
    return ''
}

function formatFileSize(bytes?: number | null): string {
    if (!bytes) return ''
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

function openLightbox(att: ActionAttachmentType) {
    lightboxAttachment.value = att
}

function triggerFileInput() {
    fileInputRef.value?.click()
}

async function handleFileUpload(event: Event) {
    const target = event.target as HTMLInputElement
    const files = target.files
    if (!files || files.length === 0 || !selected_action.value) return

    if (!selected_action.value.origin || !selected_action.value.id) {
        toast.error("Impossible d'associer un fichier à cette action.")
        return
    }

    isUploadingAttachment.value = true
    try {
        for (let i = 0; i < files.length; i++) {
            const file = files[i]
            const res = await actionService.uploadAttachment(
                selected_action.value.origin,
                selected_action.value.id,
                file
            )
            const newAtt = res.data?.data
            if (newAtt) {
                if (!selected_action.value.attachments) {
                    selected_action.value.attachments = []
                }
                selected_action.value.attachments.push(newAtt)

                const actionInList = actions.value.find(a => getActionKey(a) === getActionKey(selected_action.value!))
                if (actionInList) {
                    if (!actionInList.attachments) actionInList.attachments = []
                    actionInList.attachments.push(newAtt)
                }
            }
        }
        toast.success(files.length > 1 ? `${files.length} fichiers ajoutés avec succès.` : 'Pièce jointe ajoutée avec succès.')
    } catch (err: any) {
        console.error('Erreur lors de l\'upload du fichier:', err)
        const msg = err.response?.data?.message || "Échec de l'enregistrement de la pièce jointe."
        toast.error(msg)
    } finally {
        isUploadingAttachment.value = false
        if (target) target.value = ''
    }
}

async function deleteAttachment(att: ActionAttachmentType) {
    if (!confirm(`Supprimer la pièce jointe "${att.file_name}" ?`)) return

    try {
        await actionService.deleteAttachment(att.id)
        if (selected_action.value && selected_action.value.attachments) {
            selected_action.value.attachments = selected_action.value.attachments.filter(a => a.id !== att.id)
        }
        const actionInList = actions.value.find(a => getActionKey(a) === getActionKey(selected_action.value!))
        if (actionInList && actionInList.attachments) {
            actionInList.attachments = actionInList.attachments.filter(a => a.id !== att.id)
        }
        if (lightboxAttachment.value?.id === att.id) {
            lightboxAttachment.value = null
        }
        toast.success('Pièce jointe supprimée.')
    } catch (err: any) {
        console.error('Erreur lors de la suppression du fichier:', err)
        const msg = err.response?.data?.message || "Échec de la suppression de la pièce jointe."
        toast.error(msg)
    }
}

function getActionKey(item?: ActionType): string {
    if (!item) return ''
    return `${item.origin || ''}_${item.id || ''}`
}

function isSelected(item: ActionType): boolean {
    if (!selected_action.value) return false
    return getActionKey(selected_action.value) === getActionKey(item)
}

// Meta stats
const meta = ref<ActionMetaType>({
    total: 0,
    pending: 0,
    in_progress: 0,
    finished: 0,
    checklist_count: 0,
    vmc_count: 0,
})

// Filtres
const selectedOrigin = ref<'ALL' | 'CHECKLIST' | 'VMC'>('ALL')
const selectedStatus = ref<ActionStatusType | ''>('')
const selectedDate = ref<string>('')
const searchQuery = ref<string>('')

const statusOptions: { label: string; value: ActionStatusType | '' }[] = [
    { label: 'Tous', value: '' },
    { label: 'En attente', value: 'PENDING' },
    { label: 'En cours', value: 'IN_PROGRESS' },
    { label: 'Terminée', value: 'FINISHED' },
]

// Menu contextuel
const contextMenu = ref<{
    isOpen: boolean
    contextMenu?: contextMenuType
    action?: ActionType
}>({
    isOpen: false,
})

function setOrigin(origin: 'ALL' | 'CHECKLIST' | 'VMC') {
    selectedOrigin.value = origin
    fetchActions()
}

function setStatusFilter(status: ActionStatusType | '') {
    selectedStatus.value = status
    fetchActions()
}

function handleSearch(query: string) {
    searchQuery.value = query
    fetchActions()
}

function resetFilters() {
    selectedOrigin.value = 'ALL'
    selectedStatus.value = ''
    selectedDate.value = ''
    searchQuery.value = ''
    fetchActions()
}

// Chargement des actions depuis l'API
async function fetchActions() {
    loading.value = true
    try {
        const res = await actionService.index({
            origin: selectedOrigin.value,
            status: selectedStatus.value || undefined,
            date: selectedDate.value || undefined,
            search: searchQuery.value || undefined,
        })

        actions.value = res.data.data || []
        if (res.data.meta) {
            meta.value = res.data.meta
        }

        // Si l'action sélectionnée est toujours présente, on la met à jour
        if (selected_action.value) {
            const currentKey = getActionKey(selected_action.value)
            const found = actions.value.find(a => getActionKey(a) === currentKey)
            if (found) {
                selected_action.value = found
            }
        }
    } catch (err) {
        console.error('Erreur lors du chargement des actions correctives:', err)
    } finally {
        loading.value = false
    }
}

// Mise à jour du statut d'une action
async function updateActionStatus(action: ActionType, newStatus: ActionStatusType) {
    if (!action.id || !action.origin) return
    try {
        await actionService.updateStatus(action.origin, action.id, newStatus)
        action.status = newStatus
        if (selected_action.value && isSelected(action)) {
            selected_action.value.status = newStatus
        }
        // Rafraîchir les compteurs
        fetchActions()
    } catch (err) {
        console.error('Erreur de mise à jour du statut:', err)
    }
}

// Cycle rapide du statut
function toggleNextStatus(item: ActionType) {
    if (item.status === 'PENDING') {
        updateActionStatus(item, 'IN_PROGRESS')
    } else if (item.status === 'IN_PROGRESS') {
        updateActionStatus(item, 'FINISHED')
    } else {
        updateActionStatus(item, 'PENDING')
    }
}

function getNextStatusLabel(status?: ActionStatusType): string {
    switch (status) {
        case 'PENDING':
            return 'Passer en cours'
        case 'IN_PROGRESS':
            return 'Clôturer l\'action'
        default:
            return 'Réouvrir'
    }
}

function getNextStatusIcon(status?: ActionStatusType): Component {
    switch (status) {
        case 'PENDING':
            return PlayCircle
        case 'IN_PROGRESS':
            return CheckCircle2
        default:
            return RotateCcw
    }
}

// Navigation vers l'inspection source
function goToInspection(action: ActionType) {
    if (action.origin === 'CHECKLIST') {
        const id = action.parent_id || action.checklist_item_id
        if (id) {
            router.push({ name: 'CHECKLIST_DETAILS', params: { id } })
        }
    } else if (action.origin === 'VMC') {
        const id = action.parent_id
        if (id) {
            router.push({ name: 'VMC_DETAILS', params: { id } })
        }
    }
}

// Brouillon pour ouverture directe dans le client de messagerie
function getMailtoLink(action: ActionType): string {
    const email = action.assigned_to?.email || ''
    const subject = encodeURIComponent(`[GALANA HSSE] Action corrective #${action.raw_id || action.id} : ${action.description}`)
    const body = encodeURIComponent(
        `Bonjour ${action.assigned_to?.name || ''},\n\n` +
        `Une action corrective vous a été attribuée sur la plateforme HSSE Galana :\n\n` +
        `• Origine : ${action.origin_label || action.origin} (${action.parent_title})\n` +
        `• Constat / Écart : ${action.item_title}\n` +
        `• Action demandée : ${action.description}\n` +
        `• Statut actuel : ${action.status}\n\n` +
        `Merci de vous connecter sur l'application GALANA HSSE pour traiter et clôturer cette action dès réalisation.\n\n` +
        `Cordialement,\nDépartement HSSE - Galana Madagascar`
    )
    return `mailto:${email}?subject=${subject}&body=${body}`
}

// Notification officielle par e-mail transmise par le serveur
async function sendEmail(action: ActionType) {
    const email = action.assigned_to?.email
    if (!email) {
        toast.warning("Impossible d'envoyer l'e-mail : aucun e-mail valide n'est associé au responsable.")
        return
    }

    if (!action.id || !action.origin) return

    const key = getActionKey(action)
    sendingEmailKey.value = key

    try {
        const res = await actionService.notify(action.origin, action.id)
        action.email_status = 'SENT'
        if (selected_action.value && isSelected(action)) {
            selected_action.value.email_status = 'SENT'
        }
        toast.success(res.data?.message || `E-mail de notification envoyé avec succès à ${email}.`)
    } catch (err: any) {
        console.error('Erreur lors de l\'envoi de l\'e-mail:', err)
        const msg = err.response?.data?.message || "Échec de l'envoi de l'e-mail de notification."
        toast.error(msg)
    } finally {
        sendingEmailKey.value = null
    }
}

// Menu contextuel
function openContextMenu(event: MouseEvent, item: ActionType) {
    contextMenu.value.contextMenu = event as any
    contextMenu.value.action = item
    contextMenu.value.isOpen = true
}

const contextMenuActions = computed(() => {
    const action = contextMenu.value.action
    if (!action) return []

    const statusObj = textContextMenuStatus(action.status)

    return [
        {
            label: 'Détails & pièces jointes',
            icon: Paperclip,
            onClick: () => {
                selected_action.value = action
            }
        },
        {
            label: statusObj.text,
            icon: statusObj.icon,
            variant: statusObj.theme,
            onClick: () => {
                if (action.status === 'PENDING') updateActionStatus(action, 'IN_PROGRESS')
                else if (action.status === 'IN_PROGRESS') updateActionStatus(action, 'FINISHED')
                else updateActionStatus(action, 'PENDING')
            }
        },
        {
            label: action.email_status === 'SENT' ? 'Réenvoyer e-mail' : 'Envoyer e-mail',
            icon: Mail,
            onClick: () => sendEmail(action)
        },
        {
            label: action.origin === 'CHECKLIST' ? 'Voir la checklist source' : 'Voir la visite VMC source',
            icon: ExternalLink,
            onClick: () => goToInspection(action)
        }
    ]
})

function textContextMenuStatus(status?: ActionStatusType): {
    text: string
    icon: Component
    theme?: any
} {
    switch (status) {
        case 'PENDING':
            return { text: 'Prendre en charge', icon: PlayCircle, theme: 'INFO' }
        case 'IN_PROGRESS':
            return { text: 'Clôturer l\'action', icon: CheckCircle2, theme: 'SUCCESS' }
        default:
            return { text: 'Réouvrir l\'action', icon: RotateCcw, theme: 'WARNING' }
    }
}

onMounted(() => {
    fetchActions()
})
</script>
