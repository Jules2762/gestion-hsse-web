<template>
    <div
        class="h-screen flex flex-col bg-[#f8fafc] text-slate-800 select-none overflow-hidden outline-none"
        tabindex="0"
        @click="closeAllContextMenus"
        @keydown="handleGlobalKeydown">

        <!-- HEADER GÉNÉRAL DE L'APPLICATION -->
        <Header
            title="Explorateur de documents"
            :thumbnails="[
                { label: 'Accueil', name: 'DASHBOARD' },
                { label: 'Bibliothèque de documents', name: 'DOCUMENT_LIBRARY' }
            ]" />

        <!-- ========================================================================= -->
        <!-- 1. BARRE D'OUTILS STYLE WINDOWS EXPLORER (NAVIGATION + ADRESSE + RECHERCHE) -->
        <!-- ========================================================================= -->
        <div class="bg-white border-b border-slate-200 px-3 py-2 flex items-center gap-2 shadow-xs z-10">
            <!-- Boutons de navigation (Historique & Parent) -->
            <div class="flex items-center gap-1 text-slate-600">
                <button
                    title="Précédent (Alt + Flèche Gauche)"
                    :disabled="!canGoBack"
                    @click="goBack"
                    class="p-1.5 rounded-md transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-100 disabled:hover:bg-transparent">
                    <ArrowLeft :size="17" />
                </button>
                <button
                    title="Suivant (Alt + Flèche Droite)"
                    :disabled="!canGoForward"
                    @click="goForward"
                    class="p-1.5 rounded-md transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-100 disabled:hover:bg-transparent">
                    <ArrowRight :size="17" />
                </button>
                <button
                    title="Dossier parent (Alt + Flèche Haut / Retour Arrière)"
                    :disabled="!canGoUp"
                    @click="goUp"
                    class="p-1.5 rounded-md transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-100 disabled:hover:bg-transparent">
                    <ArrowUp :size="17" />
                </button>
                <button
                    title="Actualiser (F5)"
                    @click="refreshExplorer"
                    class="p-1.5 rounded-md hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer">
                    <RotateCw :size="16" :class="{ 'animate-spin': isRefreshing }" />
                </button>
            </div>

            <!-- Barre d'adresse Windows (Breadcrumb interactif) -->
            <div class="flex-1 flex items-center bg-slate-50 hover:bg-white focus-within:bg-white border border-slate-300 focus-within:border-[#0F9D58] focus-within:ring-2 focus-within:ring-[#0F9D58]/20 rounded-lg px-2.5 py-1 text-xs transition-all shadow-2xs">
                <div class="flex items-center gap-1 text-slate-500 mr-2 shrink-0">
                    <HardDrive :size="15" class="text-[#0F9D58]" />
                    <button
                        @click="openFolder(undefined)"
                        class="hover:text-[#0F9D58] hover:underline font-medium cursor-pointer">
                        Documents HSSE
                    </button>
                </div>

                <div class="flex items-center gap-1 overflow-x-auto no-scrollbar flex-1">
                    <template v-for="(folder, idx) in breadcrumb" :key="folder.id">
                        <ChevronRight :size="13" class="text-slate-400 shrink-0" />
                        <button
                            @click="openFolder(folder)"
                            class="px-1.5 py-0.5 rounded hover:bg-slate-200/60 transition-colors font-medium text-slate-700 hover:text-slate-900 truncate max-w-[150px] cursor-pointer"
                            :class="{ 'font-bold text-[#0F9D58]': idx === breadcrumb.length - 1 }">
                            {{ folder.name }}
                        </button>
                    </template>
                </div>

                <!-- Bouton Copier le chemin -->
                <button
                    title="Copier le chemin d'accès"
                    @click="copyCurrentPath"
                    class="ml-2 p-1 text-slate-400 hover:text-slate-700 rounded transition-colors cursor-pointer shrink-0">
                    <Check v-if="pathCopied" :size="14" class="text-emerald-600" />
                    <Copy v-else :size="14" />
                </button>
            </div>

            <!-- Barre de recherche Windows (Filtrage instantané) -->
            <div class="w-64 relative shrink-0">
                <Search :size="15" class="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                    type="text"
                    v-model="searchQuery"
                    :placeholder="`Rechercher dans : ${currentFolderName}...`"
                    class="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-300 focus:border-[#0F9D58] focus:ring-2 focus:ring-[#0F9D58]/20 rounded-lg pl-8 pr-7 py-1 text-xs text-slate-800 placeholder-slate-400 transition-all outline-none" />
                <button
                    v-if="searchQuery"
                    @click="searchQuery = ''"
                    title="Effacer la recherche"
                    class="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer">
                    <X :size="14" />
                </button>
            </div>
        </div>

        <!-- ========================================================================= -->
        <!-- 2. RUBAN DE COMMANDES WINDOWS 11 (ACTIONS, TRI, AFFICHAGE)                 -->
        <!-- ========================================================================= -->
        <div class="bg-white border-b border-slate-200 px-3 py-1.5 flex items-center justify-between text-xs text-slate-700">
            <div class="flex items-center gap-1 flex-wrap">

                <!-- Bouton Menu + Nouveau -->
                <div class="relative">
                    <button
                        @click.stop="toggleMenu('new')"
                        class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#0F9D58] hover:bg-[#0c854a] text-white font-semibold transition-colors cursor-pointer shadow-xs">
                        <FolderPlus :size="15" />
                        <span>Nouveau</span>
                        <ChevronDown :size="13" />
                    </button>

                    <!-- Dropdown Nouveau -->
                    <div
                        v-if="activeMenu === 'new'"
                        class="absolute left-0 top-full mt-1 w-52 bg-white border border-slate-200 rounded-xl shadow-xl py-1 z-30 flex flex-col text-xs"
                        @click.stop>
                        <button
                            @click="triggerCreateFolder; activeMenu = null"
                            class="flex items-center gap-2.5 px-3 py-2 text-left hover:bg-slate-100 transition-colors cursor-pointer">
                            <FolderPlus :size="16" class="text-amber-500" />
                            <div class="flex-1">
                                <span class="font-medium text-slate-800">Dossier</span>
                                <span class="text-[10px] text-slate-400 block">Créer un nouveau sous-dossier</span>
                            </div>
                        </button>
                        <div class="border-t border-slate-100 my-0.5"></div>
                        <button
                            @click="openFilePicker(currentFolderId); activeMenu = null"
                            class="flex items-center gap-2.5 px-3 py-2 text-left hover:bg-slate-100 transition-colors cursor-pointer">
                            <FilePlus :size="16" class="text-[#0F9D58]" />
                            <div class="flex-1">
                                <span class="font-medium text-slate-800">Téléverser des fichiers</span>
                                <span class="text-[10px] text-slate-400 block">Glisser-déposer ou parcourir</span>
                            </div>
                        </button>
                    </div>
                </div>

                <div class="h-4 w-px bg-slate-200 mx-1"></div>

                <!-- Actions contextuelles rapides -->
                <button
                    title="Copier le nom"
                    :disabled="!hasSelection"
                    @click="copySelectedName"
                    class="p-1.5 rounded-lg hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer text-slate-700">
                    <Copy :size="16" />
                </button>

                <button
                    title="Renommer (F2)"
                    :disabled="!canRenameSingle"
                    @click="triggerRenameSelected"
                    class="p-1.5 rounded-lg hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer text-slate-700">
                    <Pencil :size="16" />
                </button>

                <button
                    title="Supprimer (Suppr)"
                    :disabled="!hasSelection"
                    @click="triggerDeleteSelected"
                    class="p-1.5 rounded-lg hover:bg-red-50 text-slate-700 hover:text-red-600 disabled:opacity-30 disabled:hover:bg-transparent disabled:text-slate-700 transition-colors cursor-pointer">
                    <Trash2 :size="16" />
                </button>

                <button
                    title="Télécharger le fichier"
                    :disabled="!selectedDocument"
                    @click="selectedDocument && downloadDocument(selectedDocument)"
                    class="p-1.5 rounded-lg hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer text-slate-700">
                    <Download :size="16" />
                </button>

                <div class="h-4 w-px bg-slate-200 mx-1"></div>

                <!-- Dropdown Trier -->
                <div class="relative">
                    <button
                        @click.stop="toggleMenu('sort')"
                        class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer font-medium text-slate-700">
                        <SlidersHorizontal :size="15" />
                        <span>Trier</span>
                        <ChevronDown :size="12" />
                    </button>

                    <!-- Menu Trier -->
                    <div
                        v-if="activeMenu === 'sort'"
                        class="absolute left-0 top-full mt-1 w-44 bg-white border border-slate-200 rounded-xl shadow-xl py-1 z-30 text-xs"
                        @click.stop>
                        <div class="px-2.5 py-1 font-semibold text-slate-400 text-[10px] uppercase">Trier par</div>
                        <button
                            v-for="s in sortOptions"
                            :key="s.key"
                            @click="setSort(s.key); activeMenu = null"
                            class="flex items-center justify-between w-full px-3 py-1.5 hover:bg-slate-100 transition-colors cursor-pointer text-left">
                            <span>{{ s.label }}</span>
                            <Check v-if="sortField === s.key" :size="13" class="text-[#0F9D58]" />
                        </button>
                        <div class="border-t border-slate-100 my-1"></div>
                        <button
                            @click="sortAsc = true; activeMenu = null"
                            class="flex items-center justify-between w-full px-3 py-1.5 hover:bg-slate-100 transition-colors cursor-pointer text-left">
                            <span>Croissant</span>
                            <Check v-if="sortAsc" :size="13" class="text-[#0F9D58]" />
                        </button>
                        <button
                            @click="sortAsc = false; activeMenu = null"
                            class="flex items-center justify-between w-full px-3 py-1.5 hover:bg-slate-100 transition-colors cursor-pointer text-left">
                            <span>Décroissant</span>
                            <Check v-if="!sortAsc" :size="13" class="text-[#0F9D58]" />
                        </button>
                    </div>
                </div>

                <!-- Dropdown Afficher -->
                <div class="relative">
                    <button
                        @click.stop="toggleMenu('view')"
                        class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer font-medium text-slate-700">
                        <component :is="viewModeIcon" :size="15" />
                        <span>Afficher</span>
                        <ChevronDown :size="12" />
                    </button>

                    <!-- Menu Afficher -->
                    <div
                        v-if="activeMenu === 'view'"
                        class="absolute left-0 top-full mt-1 w-48 bg-white border border-slate-200 rounded-xl shadow-xl py-1 z-30 text-xs"
                        @click.stop>
                        <div class="px-2.5 py-1 font-semibold text-slate-400 text-[10px] uppercase">Modes d'affichage</div>
                        <button
                            @click="viewMode = 'details'; activeMenu = null"
                            class="flex items-center justify-between w-full px-3 py-2 hover:bg-slate-100 transition-colors cursor-pointer text-left">
                            <div class="flex items-center gap-2">
                                <List :size="15" />
                                <span>Détails (Tableau)</span>
                            </div>
                            <Check v-if="viewMode === 'details'" :size="14" class="text-[#0F9D58]" />
                        </button>
                        <button
                            @click="viewMode = 'icons'; activeMenu = null"
                            class="flex items-center justify-between w-full px-3 py-2 hover:bg-slate-100 transition-colors cursor-pointer text-left">
                            <div class="flex items-center gap-2">
                                <Grid :size="15" />
                                <span>Grandes icônes</span>
                            </div>
                            <Check v-if="viewMode === 'icons'" :size="14" class="text-[#0F9D58]" />
                        </button>
                        <button
                            @click="viewMode = 'list'; activeMenu = null"
                            class="flex items-center justify-between w-full px-3 py-2 hover:bg-slate-100 transition-colors cursor-pointer text-left">
                            <div class="flex items-center gap-2">
                                <Columns :size="15" />
                                <span>Liste compacte</span>
                            </div>
                            <Check v-if="viewMode === 'list'" :size="14" class="text-[#0F9D58]" />
                        </button>
                    </div>
                </div>

            </div>

            <!-- Bouton Volet d'aperçu / Détails à droite -->
            <div class="flex items-center gap-2">
                <button
                    title="Afficher/masquer le volet des détails (Alt + P)"
                    @click="right_sidebar = !right_sidebar"
                    class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-medium transition-colors cursor-pointer"
                    :class="right_sidebar ? 'bg-[#0F9D58]/10 text-[#0F9D58] border-[#0F9D58]/30 font-semibold' : 'hover:bg-slate-100 text-slate-700'">
                    <PanelRight :size="15" />
                    <span>Détails</span>
                </button>
            </div>
        </div>

        <!-- ========================================================================= -->
        <!-- 3. CORPS CENTRAL : ARBRE GAUCHE + EXPLORATEUR + VOLET DÉTAILS DROIT        -->
        <!-- ========================================================================= -->
        <div class="flex-1 flex flex-row overflow-hidden relative">

            <!-- A. VOLET DE NAVIGATION GAUCHE (TREEVIEW WINDOWS) -->
            <div class="w-64 min-w-64 border-r border-slate-200 bg-white p-3 overflow-y-auto h-full flex flex-col shrink-0">
                <div class="flex items-center justify-between mb-2 px-1 text-slate-400 text-[11px] font-bold uppercase tracking-wider">
                    <span>Navigation</span>
                </div>

                <!-- Section Accès rapide / Racine -->
                <div class="space-y-0.5 mb-3">
                    <button
                        @click="openFolder(undefined)"
                        class="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors text-left cursor-pointer"
                        :class="currentFolderId === undefined ? 'bg-[#0F9D58]/10 text-[#0F9D58] font-semibold' : 'text-slate-700 hover:bg-slate-100'">
                        <FolderOpen :size="16" class="text-amber-500 shrink-0" />
                        <span class="truncate">Documents HSSE (Racine)</span>
                    </button>
                </div>

                <div class="flex items-center justify-between mb-1.5 px-1 text-slate-400 text-[11px] font-bold uppercase tracking-wider">
                    <span>Dossiers</span>
                    <button
                        title="Nouveau dossier"
                        @click="triggerCreateFolder"
                        class="p-1 hover:bg-slate-100 rounded text-slate-500 hover:text-[#0F9D58] cursor-pointer">
                        <FolderPlus :size="14" />
                    </button>
                </div>

                <!-- Arborescence hiérarchique récursive -->
                <div class="flex-1 overflow-y-auto space-y-0.5 pr-1">
                    <template v-for="folder in mainFolder" :key="folder.id">
                        <!-- Nœud parent -->
                        <div
                            class="group w-full flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs transition-colors cursor-pointer"
                            :class="currentFolderId === folder.id ? 'bg-[#0F9D58]/10 text-[#0F9D58] font-bold' : 'text-slate-700 hover:bg-slate-100'"
                            @click="openFolder(folder)"
                            @contextmenu.prevent.stop="openFolderContextMenu($event, folder)">
                            
                            <button
                                v-if="folder.children?.length"
                                @click.stop="toggleFolder(folder.id)"
                                class="p-0.5 rounded hover:bg-slate-200/80 text-slate-400 hover:text-slate-700 shrink-0 cursor-pointer">
                                <ChevronDown v-if="isExpanded(folder.id)" :size="13" />
                                <ChevronRight v-else :size="13" />
                            </button>
                            <span v-else class="w-4 shrink-0"></span>

                            <Folder :size="16" class="text-amber-500 shrink-0" />
                            <span class="truncate flex-1">{{ folder.name }}</span>

                            <span
                                v-if="folder.children?.length"
                                class="text-[10px] text-slate-400 group-hover:text-slate-600">
                                {{ folder.children.length }}
                            </span>
                        </div>

                        <!-- Enfants du dossier -->
                        <div v-if="isExpanded(folder.id)" class="ml-4 pl-2 border-l border-slate-200 space-y-0.5">
                            <button
                                v-for="child in folder.children"
                                :key="child.id"
                                @click="openFolder(child)"
                                @contextmenu.prevent.stop="openFolderContextMenu($event, child)"
                                class="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs transition-colors text-left cursor-pointer"
                                :class="currentFolderId === child.id ? 'bg-[#0F9D58]/10 text-[#0F9D58] font-bold' : 'text-slate-600 hover:bg-slate-100'">
                                <FolderOpen :size="14" class="text-amber-500 shrink-0" />
                                <span class="truncate flex-1">{{ child.name }}</span>
                            </button>
                        </div>
                    </template>
                </div>
            </div>

            <!-- B. ZONE PRINCIPALE DE L'EXPLORATEUR (CANVAS) -->
            <div
                class="flex-1 bg-white flex flex-col h-full overflow-hidden relative"
                @dragenter.prevent="onDragEnter"
                @dragover.prevent
                @dragleave.prevent="onDragLeave"
                @drop.prevent="onDrop"
                @contextmenu.prevent="openEmptyAreaContextMenu($event)">

                <!-- Overlay de Drag & Drop -->
                <div
                    v-if="isDragging"
                    class="absolute inset-0 z-40 flex flex-col items-center justify-center gap-3 bg-[#0F9D58]/10 backdrop-blur-2xs border-2 border-dashed border-[#0F9D58] text-[#0F9D58] pointer-events-none">
                    <UploadCloud :size="64" class="animate-bounce" />
                    <span class="text-base font-bold">
                        Déposez vos fichiers ici pour les importer dans « {{ currentFolderName }} »
                    </span>
                    <span class="text-xs text-slate-600">
                        Tous types de documents supportés (PDF, Office, Images, Vidéos)
                    </span>
                </div>

                <!-- Input fichier caché -->
                <input
                    ref="fileInput"
                    type="file"
                    multiple
                    class="hidden"
                    :accept="ACCEPT_ATTR"
                    @change="onFileInputChange" />

                <!-- CONTENU DE L'EXPLORATEUR (3 MODES D'AFFICHAGE) -->
                <div class="flex-1 overflow-y-auto p-3" @click="clearSelection">

                    <!-- ============================================================ -->
                    <!-- MODE 1 : DÉTAILS (TABLEAU STYLE WINDOWS EXPLORER AUTHENTIQUE) -->
                    <!-- ============================================================ -->
                    <div v-if="viewMode === 'details'" class="w-full text-xs" @click.stop>
                        <table class="w-full text-left border-collapse select-none">
                            <thead>
                                <tr class="border-b border-slate-200 text-slate-500 font-semibold select-none text-[11px]">
                                    <th class="py-2 pl-3 pr-2 w-8 text-center">
                                        <input
                                            type="checkbox"
                                            :checked="isAllSelected"
                                            @change="toggleSelectAll"
                                            class="rounded border-slate-300 text-[#0F9D58] focus:ring-[#0F9D58]" />
                                    </th>
                                    <th
                                        @click="setSort('name')"
                                        class="py-2 px-3 hover:bg-slate-100 rounded-md cursor-pointer transition-colors">
                                        <div class="flex items-center gap-1.5">
                                            <span>Nom</span>
                                            <span v-if="sortField === 'name'" class="text-[#0F9D58]">
                                                {{ sortAsc ? '▲' : '▼' }}
                                            </span>
                                        </div>
                                    </th>
                                    <th
                                        @click="setSort('updated_at')"
                                        class="py-2 px-3 w-44 hover:bg-slate-100 rounded-md cursor-pointer transition-colors">
                                        <div class="flex items-center gap-1.5">
                                            <span>Modifié le</span>
                                            <span v-if="sortField === 'updated_at'" class="text-[#0F9D58]">
                                                {{ sortAsc ? '▲' : '▼' }}
                                            </span>
                                        </div>
                                    </th>
                                    <th
                                        @click="setSort('type')"
                                        class="py-2 px-3 w-48 hover:bg-slate-100 rounded-md cursor-pointer transition-colors">
                                        <div class="flex items-center gap-1.5">
                                            <span>Type</span>
                                            <span v-if="sortField === 'type'" class="text-[#0F9D58]">
                                                {{ sortAsc ? '▲' : '▼' }}
                                            </span>
                                        </div>
                                    </th>
                                    <th
                                        @click="setSort('size')"
                                        class="py-2 px-3 w-28 text-right hover:bg-slate-100 rounded-md cursor-pointer transition-colors">
                                        <div class="flex items-center justify-end gap-1.5">
                                            <span>Taille</span>
                                            <span v-if="sortField === 'size'" class="text-[#0F9D58]">
                                                {{ sortAsc ? '▲' : '▼' }}
                                            </span>
                                        </div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <!-- Lignes de dossiers -->
                                <tr
                                    v-for="folder in filteredFolders"
                                    :key="`row-folder-${folder.id}`"
                                    @click.exact.stop="selectFolder(folder)"
                                    @click.ctrl.exact.stop="toggleFolderSelection(folder.id)"
                                    @dblclick="openFolder(folder)"
                                    @contextmenu.prevent.stop="openFolderContextMenu($event, folder)"
                                    @dragover.prevent
                                    @drop.prevent.stop="onDropOnFolder($event, folder)"
                                    class="border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer group"
                                    :class="{ 'bg-blue-50/70 text-slate-900 font-medium': selectedFolderIds.has(folder.id) }">
                                    <td class="py-2 pl-3 pr-2 text-center" @click.stop>
                                        <input
                                            type="checkbox"
                                            :checked="selectedFolderIds.has(folder.id)"
                                            @change="toggleFolderSelection(folder.id)"
                                            class="rounded border-slate-300 text-[#0F9D58] focus:ring-[#0F9D58]" />
                                    </td>
                                    <td class="py-2 px-3">
                                        <div class="flex items-center gap-2.5">
                                            <Folder :size="18" class="text-amber-500 shrink-0" />
                                            <span class="truncate">{{ folder.name }}</span>
                                        </div>
                                    </td>
                                    <td class="py-2 px-3 text-slate-500 whitespace-nowrap">
                                        {{ formatDate(folder.created_at) }}
                                    </td>
                                    <td class="py-2 px-3 text-slate-500 whitespace-nowrap">
                                        Dossier de fichiers
                                    </td>
                                    <td class="py-2 px-3 text-slate-400 text-right">
                                        —
                                    </td>
                                </tr>

                                <!-- Lignes de documents -->
                                <tr
                                    v-for="doc in filteredDocuments"
                                    :key="`row-doc-${doc.id}`"
                                    @click.exact.stop="selectDocument(doc)"
                                    @click.ctrl.exact.stop="toggleDocumentSelection(doc.id)"
                                    @dblclick="openDocumentFile(doc)"
                                    @contextmenu.prevent.stop="openDocumentContextMenu($event, doc)"
                                    class="border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer group"
                                    :class="{ 'bg-blue-50/70 text-slate-900 font-medium': selectedDocumentIds.has(doc.id) }">
                                    <td class="py-2 pl-3 pr-2 text-center" @click.stop>
                                        <input
                                            type="checkbox"
                                            :checked="selectedDocumentIds.has(doc.id)"
                                            @change="toggleDocumentSelection(doc.id)"
                                            class="rounded border-slate-300 text-[#0F9D58] focus:ring-[#0F9D58]" />
                                    </td>
                                    <td class="py-2 px-3">
                                        <div class="flex items-center gap-2.5">
                                            <component
                                                :is="fileIcon(doc).icon"
                                                :size="18"
                                                :class="fileIcon(doc).color"
                                                class="shrink-0" />
                                            <span class="truncate">{{ doc.name }}</span>
                                        </div>
                                    </td>
                                    <td class="py-2 px-3 text-slate-500 whitespace-nowrap">
                                        {{ formatDate(doc.created_at) }}
                                    </td>
                                    <td class="py-2 px-3 text-slate-500 whitespace-nowrap">
                                        {{ formatDocType(doc) }}
                                    </td>
                                    <td class="py-2 px-3 text-slate-600 text-right font-mono">
                                        {{ formatSize(doc.size) }}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <!-- ============================================================ -->
                    <!-- MODE 2 : GRANDES ICÔNES (GRID / TUILES WINDOWS 11)           -->
                    <!-- ============================================================ -->
                    <div
                        v-else-if="viewMode === 'icons'"
                        class="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-3 select-none"
                        @click.stop>

                        <!-- Tuiles Dossiers -->
                        <div
                            v-for="folder in filteredFolders"
                            :key="`tile-folder-${folder.id}`"
                            @click.exact.stop="selectFolder(folder)"
                            @click.ctrl.exact.stop="toggleFolderSelection(folder.id)"
                            @dblclick="openFolder(folder)"
                            @contextmenu.prevent.stop="openFolderContextMenu($event, folder)"
                            @dragover.prevent
                            @drop.prevent.stop="onDropOnFolder($event, folder)"
                            class="relative p-3 rounded-xl flex flex-col items-center text-center gap-2 transition-all cursor-pointer border border-transparent hover:border-slate-200 hover:bg-slate-50 group"
                            :class="{ 'bg-blue-50 border-blue-200 ring-2 ring-blue-400/40': selectedFolderIds.has(folder.id) }">
                            
                            <!-- Case à cocher discrète au survol / sélection -->
                            <div
                                class="absolute top-1.5 left-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                :class="{ 'opacity-100': selectedFolderIds.has(folder.id) }"
                                @click.stop>
                                <input
                                    type="checkbox"
                                    :checked="selectedFolderIds.has(folder.id)"
                                    @change="toggleFolderSelection(folder.id)"
                                    class="rounded border-slate-300 text-[#0F9D58] focus:ring-[#0F9D58]" />
                            </div>

                            <FolderIcon :size="48" class="text-amber-500 drop-shadow-xs group-hover:scale-105 transition-transform" />
                            <span class="text-xs font-medium text-slate-800 line-clamp-2 break-all" :title="folder.name">
                                {{ folder.name }}
                            </span>
                        </div>

                        <!-- Tuiles Documents -->
                        <div
                            v-for="doc in filteredDocuments"
                            :key="`tile-doc-${doc.id}`"
                            @click.exact.stop="selectDocument(doc)"
                            @click.ctrl.exact.stop="toggleDocumentSelection(doc.id)"
                            @dblclick="openDocumentFile(doc)"
                            @contextmenu.prevent.stop="openDocumentContextMenu($event, doc)"
                            class="relative p-3 rounded-xl flex flex-col items-center text-center gap-2 transition-all cursor-pointer border border-transparent hover:border-slate-200 hover:bg-slate-50 group"
                            :class="{ 'bg-blue-50 border-blue-200 ring-2 ring-blue-400/40': selectedDocumentIds.has(doc.id) }">
                            
                            <div
                                class="absolute top-1.5 left-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                :class="{ 'opacity-100': selectedDocumentIds.has(doc.id) }"
                                @click.stop>
                                <input
                                    type="checkbox"
                                    :checked="selectedDocumentIds.has(doc.id)"
                                    @change="toggleDocumentSelection(doc.id)"
                                    class="rounded border-slate-300 text-[#0F9D58] focus:ring-[#0F9D58]" />
                            </div>

                            <div class="relative">
                                <component
                                    :is="fileIcon(doc).icon"
                                    :size="48"
                                    :class="fileIcon(doc).color"
                                    class="drop-shadow-xs group-hover:scale-105 transition-transform" />
                                <span class="absolute -bottom-1 -right-1 text-[9px] font-black uppercase px-1 py-0.2 bg-slate-800 text-white rounded">
                                    {{ getExt(doc) }}
                                </span>
                            </div>

                            <span class="text-xs font-medium text-slate-800 line-clamp-2 break-all" :title="doc.name">
                                {{ doc.name }}
                            </span>
                            <span class="text-[10px] text-slate-400">{{ formatSize(doc.size) }}</span>
                        </div>
                    </div>

                    <!-- ============================================================ -->
                    <!-- MODE 3 : LISTE COMPACTE                                       -->
                    <!-- ============================================================ -->
                    <div
                        v-else-if="viewMode === 'list'"
                        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 select-none"
                        @click.stop>

                        <div
                            v-for="folder in filteredFolders"
                            :key="`list-folder-${folder.id}`"
                            @click.exact.stop="selectFolder(folder)"
                            @dblclick="openFolder(folder)"
                            @contextmenu.prevent.stop="openFolderContextMenu($event, folder)"
                            class="flex items-center gap-2.5 p-2 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer"
                            :class="{ 'bg-blue-50 border-blue-200 font-semibold': selectedFolderIds.has(folder.id) }">
                            <Folder :size="18" class="text-amber-500 shrink-0" />
                            <span class="text-xs truncate flex-1">{{ folder.name }}</span>
                        </div>

                        <div
                            v-for="doc in filteredDocuments"
                            :key="`list-doc-${doc.id}`"
                            @click.exact.stop="selectDocument(doc)"
                            @dblclick="openDocumentFile(doc)"
                            @contextmenu.prevent.stop="openDocumentContextMenu($event, doc)"
                            class="flex items-center gap-2.5 p-2 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer"
                            :class="{ 'bg-blue-50 border-blue-200 font-semibold': selectedDocumentIds.has(doc.id) }">
                            <component
                                :is="fileIcon(doc).icon"
                                :size="18"
                                :class="fileIcon(doc).color"
                                class="shrink-0" />
                            <span class="text-xs truncate flex-1">{{ doc.name }}</span>
                            <span class="text-[10px] text-slate-400">{{ formatSize(doc.size) }}</span>
                        </div>
                    </div>

                    <!-- ÉTAT VIDE (AUCUN ÉLÉMENT OU AUCUN RÉSULTAT DE RECHERCHE) -->
                    <div
                        v-if="filteredFolders.length === 0 && filteredDocuments.length === 0"
                        class="h-80 flex flex-col items-center justify-center text-slate-400 gap-3">
                        <FolderOpen :size="64" class="text-slate-300 stroke-[1.5]" />
                        <div class="text-center">
                            <p class="text-sm font-semibold text-slate-700">
                                {{ searchQuery ? 'Aucun résultat trouvé' : 'Ce dossier est vide' }}
                            </p>
                            <p class="text-xs text-slate-400 mt-1">
                                {{ searchQuery ? `Aucun élément ne correspond à « ${searchQuery} »` : 'Glissez-déposez des fichiers ici ou cliquez sur « Nouveau ».' }}
                            </p>
                        </div>
                        <button
                            v-if="!searchQuery"
                            @click="openFilePicker(currentFolderId)"
                            class="mt-2 px-3 py-1.5 text-xs font-semibold text-white bg-[#0F9D58] hover:bg-[#0c854a] rounded-lg transition-colors cursor-pointer shadow-xs">
                            Téléverser des fichiers
                        </button>
                    </div>

                </div>

            </div>

            <!-- C. VOLET D'APERÇU ET DÉTAILS À DROITE (PREVIEW PANE WINDOWS) -->
            <div
                v-if="right_sidebar"
                class="w-80 min-w-80 border-l border-slate-200 bg-white p-4 overflow-y-auto h-full flex flex-col shrink-0 shadow-lg z-20">
                
                <div class="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
                    <h5 class="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Volet des détails
                    </h5>
                    <button
                        @click="right_sidebar = false"
                        class="p-1 text-slate-400 hover:text-slate-700 rounded transition-colors cursor-pointer">
                        <X :size="16" />
                    </button>
                </div>

                <!-- Aperçu Document sélectionné -->
                <template v-if="selectedDocument">
                    <!-- Zone d'aperçu dynamique -->
                    <div class="mb-4 overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                        <div v-if="previewLoading" class="h-44 flex items-center justify-center text-xs text-slate-400">
                            <RotateCw :size="18" class="animate-spin text-[#0F9D58] mr-2" />
                            Chargement de l'aperçu...
                        </div>

                        <img
                            v-else-if="previewKind === 'image' && previewUrl"
                            :src="previewUrl"
                            :alt="selectedDocument.name"
                            title="Cliquer pour ouvrir"
                            class="max-h-56 w-full object-contain cursor-pointer"
                            @click="openDocumentFile(selectedDocument)" />

                        <video
                            v-else-if="previewKind === 'video' && previewUrl"
                            :src="previewUrl"
                            controls
                            class="max-h-56 w-full bg-black" />

                        <iframe
                            v-else-if="previewKind === 'pdf' && previewUrl"
                            :src="previewUrl"
                            :title="selectedDocument.name"
                            class="h-64 w-full bg-white" />

                        <pre
                            v-else-if="previewKind === 'text' && previewText !== null"
                            class="max-h-56 overflow-auto whitespace-pre-wrap break-words p-3 text-[11px] font-mono text-slate-700">{{ previewText }}</pre>

                        <div v-else class="h-40 flex flex-col items-center justify-center gap-2 p-3 text-center">
                            <component
                                :is="fileIcon(selectedDocument).icon"
                                :size="48"
                                :class="fileIcon(selectedDocument).color" />
                            <p class="text-xs text-slate-500 font-medium truncate max-w-full">
                                {{ selectedDocument.name }}
                            </p>
                        </div>
                    </div>

                    <!-- Métadonnées Windows Explorer -->
                    <div class="space-y-3 text-xs">
                        <div>
                            <span class="block text-[10px] uppercase font-bold text-slate-400">Nom du fichier</span>
                            <p class="font-semibold text-slate-800 break-all mt-0.5">{{ selectedDocument.name }}</p>
                        </div>
                        <div>
                            <span class="block text-[10px] uppercase font-bold text-slate-400">Type</span>
                            <p class="text-slate-700 mt-0.5">{{ formatDocType(selectedDocument) }}</p>
                        </div>
                        <div>
                            <span class="block text-[10px] uppercase font-bold text-slate-400">Taille</span>
                            <p class="text-slate-700 font-mono mt-0.5">{{ formatSize(selectedDocument.size) }}</p>
                        </div>
                        <div>
                            <span class="block text-[10px] uppercase font-bold text-slate-400">Date de modification</span>
                            <p class="text-slate-700 mt-0.5">{{ formatDate(selectedDocument.created_at) }}</p>
                        </div>
                        <div>
                            <span class="block text-[10px] uppercase font-bold text-slate-400">Emplacement</span>
                            <p class="text-slate-700 break-all mt-0.5">{{ currentPathLabel }}</p>
                        </div>
                    </div>

                    <!-- Boutons d'action dans le volet -->
                    <div class="mt-6 pt-4 border-t border-slate-200 flex flex-col gap-2">
                        <button
                            @click="openDocumentFile(selectedDocument)"
                            class="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-white bg-[#0F9D58] hover:bg-[#0c854a] rounded-lg transition-colors cursor-pointer shadow-xs">
                            <Eye :size="15" />
                            Ouvrir le document
                        </button>
                        <button
                            @click="downloadDocument(selectedDocument)"
                            class="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer">
                            <Download :size="15" />
                            Télécharger
                        </button>
                    </div>
                </template>

                <!-- Aperçu Dossier sélectionné -->
                <template v-else-if="selected_folder">
                    <div class="h-32 flex flex-col items-center justify-center gap-2 bg-slate-50 rounded-xl border border-slate-200 mb-4">
                        <FolderIcon :size="48" class="text-amber-500" />
                        <span class="text-xs font-bold text-slate-800">{{ selected_folder.name }}</span>
                    </div>

                    <div class="space-y-3 text-xs">
                        <div>
                            <span class="block text-[10px] uppercase font-bold text-slate-400">Type</span>
                            <p class="text-slate-700 mt-0.5">Dossier de fichiers</p>
                        </div>
                        <div>
                            <span class="block text-[10px] uppercase font-bold text-slate-400">Date de création</span>
                            <p class="text-slate-700 mt-0.5">{{ formatDate(selected_folder.created_at) }}</p>
                        </div>
                        <div>
                            <span class="block text-[10px] uppercase font-bold text-slate-400">Emplacement</span>
                            <p class="text-slate-700 break-all mt-0.5">{{ currentPathLabel }}</p>
                        </div>
                    </div>

                    <div class="mt-6 pt-4 border-t border-slate-200 flex flex-col gap-2">
                        <button
                            @click="openFolder(selected_folder)"
                            class="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-white bg-[#0F9D58] hover:bg-[#0c854a] rounded-lg transition-colors cursor-pointer shadow-xs">
                            <FolderOpen :size="15" />
                            Ouvrir le dossier
                        </button>
                    </div>
                </template>

                <!-- Aucun élément sélectionné -->
                <div v-else class="flex-1 flex flex-col items-center justify-center text-slate-400 text-xs text-center p-4">
                    <Info :size="32" class="text-slate-300 mb-2" />
                    <span>Sélectionnez un dossier ou un fichier pour afficher ses propriétés et son aperçu.</span>
                </div>
            </div>

        </div>

        <!-- ========================================================================= -->
        <!-- 4. BARRE D'ÉTAT INFÉRIEURE STYLE WINDOWS EXPLORER                           -->
        <!-- ========================================================================= -->
        <div class="bg-slate-100 border-t border-slate-200 px-4 py-1.5 flex items-center justify-between text-[11px] text-slate-600 font-medium">
            <div class="flex items-center gap-4">
                <span>{{ totalItemsCount }} élément(s)</span>
                <span v-if="searchQuery" class="text-amber-600 font-semibold">
                    (Recherche active)
                </span>
                <span v-if="selectedCount > 0" class="text-slate-900 font-bold border-l border-slate-300 pl-4">
                    {{ selectedCount }} élément(s) sélectionné(s)
                    <span v-if="selectedTotalSize > 0" class="font-mono text-slate-500 font-normal">
                        ({{ formatSize(selectedTotalSize) }})
                    </span>
                </span>
            </div>

            <!-- Boutons de vue rapides à droite de la barre d'état -->
            <div class="flex items-center gap-1 text-slate-500">
                <button
                    title="Affichage Détails"
                    @click="viewMode = 'details'"
                    class="p-1 rounded hover:bg-slate-200 transition-colors cursor-pointer"
                    :class="{ 'text-[#0F9D58] bg-slate-200 font-bold': viewMode === 'details' }">
                    <List :size="14" />
                </button>
                <button
                    title="Affichage Grandes icônes"
                    @click="viewMode = 'icons'"
                    class="p-1 rounded hover:bg-slate-200 transition-colors cursor-pointer"
                    :class="{ 'text-[#0F9D58] bg-slate-200 font-bold': viewMode === 'icons' }">
                    <Grid :size="14" />
                </button>
                <button
                    title="Affichage Liste compacte"
                    @click="viewMode = 'list'"
                    class="p-1 rounded hover:bg-slate-200 transition-colors cursor-pointer"
                    :class="{ 'text-[#0F9D58] bg-slate-200 font-bold': viewMode === 'list' }">
                    <Columns :size="14" />
                </button>
            </div>
        </div>

        <!-- ========================================================================= -->
        <!-- 5. MENUS CONTEXTUELS ET MODALES                                            -->
        <!-- ========================================================================= -->
        <ContextMenuUI
            :model-value="contextMenu.isOpen"
            :context-menu="contextMenu.contextMenu"
            :actions="contextMenu.actions"
            :bottom_actions="contextMenu.bottom_actions" />

        <ContextMenuUI
            :model-value="contextMenuDocument.isOpen"
            :context-menu="contextMenuDocument.contextMenu"
            :actions="contextMenuDocument.actions"
            :bottom_actions="contextMenuDocument.bottom_actions" />

        <!-- MODAL CRÉATION DOSSIER -->
        <CenterModal
            :is-open="modal.create"
            :confirm-loading="loading_create_folder"
            @confirm="createFolder"
            @close="closeCreateModal"
            title="Nouveau dossier">
            <Input
                label="Nom du dossier"
                placeholder="Nouveau dossier"
                v-model="data_create.folder_name"
                autofocus />
        </CenterModal>

        <!-- MODAL RENOMMER DOSSIER -->
        <CenterModal
            :is-open="modal.rename"
            @confirm="renameFolder"
            @close="modal.rename = false"
            title="Renommer le dossier">
            <Input
                label="Nouveau nom du dossier"
                v-model="data_rename.folder_name"
                autofocus />
        </CenterModal>

        <!-- MODAL SUPPRESSION DOSSIER -->
        <CenterModal
            :is-open="modal.delete"
            @close="modal.delete = false"
            title="Supprimer le dossier"
            :title-variant="'danger'"
            :confirm-variant="'danger'"
            :confirm-loading="loading_delete_folder"
            @confirm="deleteFolder">
            <p class="text-xs text-slate-700">
                Êtes-vous sûr de vouloir supprimer ce dossier ? Tous les sous-dossiers et fichiers qu'il contient seront également supprimés. Cette action est irréversible.
            </p>
        </CenterModal>

        <!-- MODAL RENOMMER DOCUMENT -->
        <CenterModal
            :is-open="modal.rename_document"
            :confirm-loading="loading_rename_document"
            @confirm="renameDocument"
            @close="modal.rename_document = false"
            title="Renommer le document">
            <Input
                label="Nouveau nom du document"
                v-model="data_rename_document.name"
                autofocus />
        </CenterModal>

        <!-- MODAL SUPPRESSION DOCUMENT -->
        <CenterModal
            :is-open="modal.delete_document"
            @close="modal.delete_document = false"
            title="Supprimer le document"
            :title-variant="'danger'"
            :confirm-variant="'danger'"
            :confirm-loading="loading_delete_document"
            @confirm="deleteDocument">
            <p class="text-xs text-slate-700">
                Êtes-vous sûr de vouloir supprimer le document
                <strong>{{ contextMenuDocument.document?.name }}</strong> ? Cette action est irréversible.
            </p>
        </CenterModal>

        <!-- MODAL PROPRIÉTÉS WINDOWS STYLE -->
        <div
            v-if="modal.properties_document && propertiesDocument"
            class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-2xs"
            @click.self="modal.properties_document = false">
            <div class="w-full max-w-md rounded-xl border border-slate-300 bg-white p-5 shadow-2xl" @click.stop>
                <div class="mb-4 flex items-center justify-between pb-2 border-b border-slate-200">
                    <h5 class="text-sm font-bold text-slate-800">Propriétés de {{ propertiesDocument.name }}</h5>
                    <button class="text-slate-400 hover:text-slate-700 cursor-pointer" @click="modal.properties_document = false">
                        <X :size="18" />
                    </button>
                </div>

                <div class="mb-4 flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <component
                        :is="fileIcon(propertiesDocument).icon"
                        :size="40"
                        :class="fileIcon(propertiesDocument).color" />
                    <div class="min-w-0 flex-1">
                        <p class="break-all text-xs font-bold text-slate-800">{{ propertiesDocument.name }}</p>
                        <p class="text-[11px] text-slate-500">{{ formatDocType(propertiesDocument) }}</p>
                    </div>
                </div>

                <dl class="grid grid-cols-3 gap-x-3 gap-y-2.5 text-xs">
                    <dt class="text-slate-500 font-medium">Type :</dt>
                    <dd class="col-span-2 text-slate-800">{{ propertiesDocument.mime_type }}</dd>

                    <dt class="text-slate-500 font-medium">Taille :</dt>
                    <dd class="col-span-2 text-slate-800 font-mono">{{ formatSize(propertiesDocument.size) }} ({{ propertiesDocument.size }} octets)</dd>

                    <dt class="text-slate-500 font-medium">Emplacement :</dt>
                    <dd class="col-span-2 text-slate-800 break-all">{{ currentPathLabel }}</dd>

                    <dt class="text-slate-500 font-medium">Nom d'origine :</dt>
                    <dd class="col-span-2 text-slate-800 break-all">{{ propertiesDocument.original_name }}</dd>

                    <dt class="text-slate-500 font-medium">Créé le :</dt>
                    <dd class="col-span-2 text-slate-800">{{ formatDate(propertiesDocument.created_at) }}</dd>

                    <dt class="text-slate-500 font-medium">Version :</dt>
                    <dd class="col-span-2 text-slate-800">{{ propertiesDocument.version }}</dd>
                </dl>

                <div class="mt-6 flex justify-end gap-2 pt-3 border-t border-slate-200">
                    <button
                        class="rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
                        @click="modal.properties_document = false">
                        Fermer
                    </button>
                    <button
                        class="flex items-center gap-1.5 rounded-lg bg-[#0F9D58] hover:bg-[#0c854a] px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs transition-colors cursor-pointer"
                        @click="downloadDocument(propertiesDocument)">
                        <Download :size="14" />
                        Télécharger
                    </button>
                </div>
            </div>
        </div>

        <!-- PANNEAU FLOTTANT DE PROGRESSION DES TÉLÉVERSEMENTS -->
        <div
            v-if="uploads.length"
            class="fixed bottom-10 right-5 z-50 w-80 rounded-xl border border-slate-200 bg-white shadow-2xl">
            <div class="flex items-center justify-between border-b border-slate-100 px-4 py-2 bg-slate-50 rounded-t-xl">
                <span class="text-xs font-bold text-slate-800">Téléversement en cours</span>
                <button class="text-slate-400 hover:text-slate-700 cursor-pointer" @click="uploads = []">
                    <X :size="14" />
                </button>
            </div>
            <ul class="max-h-60 overflow-y-auto p-3 space-y-2.5">
                <li v-for="u in uploads" :key="u.id" class="text-xs">
                    <div class="flex justify-between gap-2">
                        <span class="truncate font-medium text-slate-800">{{ u.name }}</span>
                        <span v-if="u.status === 'uploading'" class="font-mono text-[#0F9D58]">{{ u.progress }}%</span>
                        <span v-else-if="u.status === 'done'" class="text-emerald-600 font-semibold">Terminé</span>
                        <span v-else-if="u.status === 'error'" class="text-red-600 font-semibold">Erreur</span>
                    </div>
                    <div class="mt-1 h-1.5 w-full overflow-hidden rounded bg-slate-100">
                        <div
                            class="h-full transition-all duration-300"
                            :class="u.status === 'error' ? 'bg-red-500' : 'bg-[#0F9D58]'"
                            :style="{ width: u.progress + '%' }" />
                    </div>
                    <p v-if="u.error" class="mt-0.5 text-[10px] text-red-600">{{ u.error }}</p>
                </li>
            </ul>
        </div>

    </div>
</template>

<script setup lang="ts">
    import {
        ArrowLeft,
        ArrowRight,
        ArrowUp,
        RotateCw,
        Search,
        HardDrive,
        ChevronRight,
        ChevronDown,
        Copy,
        Check,
        X,
        Folder,
        FolderOpen,
        FolderPlus,
        FolderIcon,
        FilePlus,
        Download,
        Pencil,
        Trash2,
        SlidersHorizontal,
        Grid,
        List,
        Columns,
        PanelRight,
        Eye,
        Info,
        UploadCloud,
        FileText as FileTextIcon,
        FileVideo,
        FileImage,
        FileSpreadsheet,
        Presentation,
    } from '@lucide/vue'

    import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
    import Header from '../../../components/shared/Header.vue'
    import ContextMenuUI from '../../../components/ui/ContextMenuUI.vue'
    import CenterModal from '../../../components/ui/centerModal.vue'
    import Input from '../../../components/ui/Input.vue'
    import type { ContextMenuActionType, contextMenuType } from '../../../@types/ContextMenu.type.ts'
    import type {
        DocumentType,
        FolderContentType,
        FolderType,
    } from '../../../@types/DocumentLibrary.type.ts'
    import documentService from '../../../core/services/document.service.ts'

    // ============================================================
    // ÉTAT DE NAVIGATION & HISTORIQUE (WINDOWS EXPLORER)
    // ============================================================
    const history = ref<(string | number | undefined)[]>([undefined])
    const historyIndex = ref<number>(0)
    const canGoBack = computed(() => historyIndex.value > 0)
    const canGoForward = computed(() => historyIndex.value < history.value.length - 1)
    const canGoUp = computed(() => currentFolderId.value !== undefined)

    const isRefreshing = ref<boolean>(false)
    const pathCopied = ref<boolean>(false)
    const searchQuery = ref<string>('')
    const right_sidebar = ref<boolean>(false)

    // Modes d'affichage : 'details' | 'icons' | 'list'
    const viewMode = ref<'details' | 'icons' | 'list'>('details')
    const viewModeIcon = computed(() => {
        if (viewMode.value === 'icons') return Grid
        if (viewMode.value === 'list') return Columns
        return List
    })

    // Menus déroulants du ruban
    const activeMenu = ref<'new' | 'sort' | 'view' | null>(null)
    function toggleMenu(menu: 'new' | 'sort' | 'view') {
        activeMenu.value = activeMenu.value === menu ? null : menu
    }

    // Tri
    type SortKey = 'name' | 'updated_at' | 'type' | 'size'
    const sortField = ref<SortKey>('name')
    const sortAsc = ref<boolean>(true)
    const sortOptions = [
        { key: 'name' as SortKey, label: 'Nom' },
        { key: 'updated_at' as SortKey, label: 'Date de modification' },
        { key: 'type' as SortKey, label: 'Type' },
        { key: 'size' as SortKey, label: 'Taille' },
    ]

    function setSort(field: SortKey) {
        if (sortField.value === field) {
            sortAsc.value = !sortAsc.value
        } else {
            sortField.value = field
            sortAsc.value = true
        }
    }

    // ============================================================
    // DOSSIERS & DOCUMENTS CHARGÉS
    // ============================================================
    const mainFolder = ref<FolderType[]>([])
    const currentFolderId = ref<string | number | undefined>(undefined)
    const selected_folder = ref<FolderType | undefined>(undefined)
    const selectedDocument = ref<DocumentType | null>(null)
    const expandedFolders = ref<(string | number)[]>([])

    const folders = ref<FolderContentType>({
        folders: [],
        documents: [],
    })

    // Sélections multiples
    const selectedFolderIds = ref<Set<string | number>>(new Set())
    const selectedDocumentIds = ref<Set<string | number>>(new Set())

    const selectedCount = computed(() => selectedFolderIds.value.size + selectedDocumentIds.value.size)
    const hasSelection = computed(() => selectedCount.value > 0)
    const canRenameSingle = computed(() => selectedCount.value === 1)

    // Modales
    const modal = ref({
        rename: false,
        delete: false,
        create: false,
        rename_document: false,
        delete_document: false,
        properties_document: false,
    })

    const data_create = ref({ folder_id: '' as string | number, folder_name: '' })
    const data_rename = ref({ folder_id: '' as string | number, folder_name: '' })
    const data_rename_document = ref({ id: '' as string | number, name: '' })
    const propertiesDocument = ref<DocumentType | null>(null)

    const loading_create_folder = ref<boolean>(false)
    const loading_rename_document = ref<boolean>(false)
    const loading_delete_folder = ref<boolean>(false)
    const loading_delete_document = ref<boolean>(false)

    // ============================================================
    // MENUS CONTEXTUELS
    // ============================================================
    const contextMenu = ref<{
        isOpen: boolean
        contextMenu?: contextMenuType
        actions: ContextMenuActionType[]
        bottom_actions: ContextMenuActionType[]
        folder?: FolderType
    }>({
        isOpen: false,
        actions: [],
        bottom_actions: [],
        folder: undefined,
    })

    const contextMenuDocument = ref<{
        isOpen: boolean
        contextMenu?: contextMenuType
        actions: ContextMenuActionType[]
        bottom_actions: ContextMenuActionType[]
        document?: DocumentType
    }>({
        isOpen: false,
        actions: [],
        bottom_actions: [],
        document: undefined,
    })

    function closeAllContextMenus() {
        contextMenu.value.isOpen = false
        contextMenuDocument.value.isOpen = false
        activeMenu.value = null
    }

    // ============================================================
    // FILTRAGE ET TRI DES ÉLÉMENTS DU DOSSIER
    // ============================================================
    const filteredFolders = computed(() => {
        let list = [...(folders.value.folders || [])]
        if (searchQuery.value.trim()) {
            const q = searchQuery.value.toLowerCase().trim()
            list = list.filter(f => f.name.toLowerCase().includes(q))
        }

        list.sort((a, b) => {
            let res = 0
            if (sortField.value === 'name') {
                res = a.name.localeCompare(b.name, 'fr', { numeric: true })
            } else if (sortField.value === 'updated_at') {
                res = new Date(a.created_at || '').getTime() - new Date(b.created_at || '').getTime()
            }
            return sortAsc.value ? res : -res
        })

        return list
    })

    const filteredDocuments = computed(() => {
        let list = [...(folders.value.documents || [])]
        if (searchQuery.value.trim()) {
            const q = searchQuery.value.toLowerCase().trim()
            list = list.filter(d => d.name.toLowerCase().includes(q) || (d.mime_type || '').toLowerCase().includes(q))
        }

        list.sort((a, b) => {
            let res = 0
            if (sortField.value === 'name') {
                res = a.name.localeCompare(b.name, 'fr', { numeric: true })
            } else if (sortField.value === 'updated_at') {
                res = new Date(a.created_at || '').getTime() - new Date(b.created_at || '').getTime()
            } else if (sortField.value === 'size') {
                res = (Number(a.size) || 0) - (Number(b.size) || 0)
            } else if (sortField.value === 'type') {
                res = (a.mime_type || '').localeCompare(b.mime_type || '')
            }
            return sortAsc.value ? res : -res
        })

        return list
    })

    const totalItemsCount = computed(() => filteredFolders.value.length + filteredDocuments.value.length)

    const isAllSelected = computed(() => {
        const total = totalItemsCount.value
        return total > 0 && selectedCount.value === total
    })

    const selectedTotalSize = computed(() => {
        let sum = 0
        const docs = folders.value.documents || []
        for (const doc of docs) {
            if (selectedDocumentIds.value.has(doc.id)) {
                sum += Number(doc.size) || 0
            }
        }
        return sum
    })

    // ============================================================
    // BREADCRUMB & NOM DU DOSSIER COURANT
    // ============================================================
    function findPath(tree: FolderType[] | undefined, id: string | number | undefined): FolderType[] {
        if (!tree || id === undefined) return []
        for (const node of tree) {
            if (node.id === id) return [node]
            if (node.children?.length) {
                const sub = findPath(node.children, id)
                if (sub.length) return [node, ...sub]
            }
        }
        return []
    }

    const breadcrumb = computed(() => findPath(mainFolder.value, currentFolderId.value))

    const currentFolderName = computed(() => {
        if (breadcrumb.value.length) {
            return breadcrumb.value[breadcrumb.value.length - 1].name
        }
        return 'Documents HSSE'
    })

    const currentPathLabel = computed(() => {
        const parts = breadcrumb.value.map(f => f.name)
        return parts.length ? `Documents HSSE / ${parts.join(' / ')}` : 'Documents HSSE'
    })

    function copyCurrentPath() {
        const full = `Ce PC > Documents HSSE${breadcrumb.value.length ? ' > ' + breadcrumb.value.map(f => f.name).join(' > ') : ''}`
        navigator.clipboard.writeText(full)
        pathCopied.value = true
        setTimeout(() => { pathCopied.value = false }, 2000)
    }

    // ============================================================
    // ACTIONS DE NAVIGATION
    // ============================================================
    function openFolder(folder: FolderType | undefined, recordHistory = true) {
        currentFolderId.value = folder?.id
        selected_folder.value = folder
        clearSelection()
        searchQuery.value = ''

        if (recordHistory) {
            history.value = history.value.slice(0, historyIndex.value + 1)
            history.value.push(folder?.id)
            historyIndex.value = history.value.length - 1
        }

        getFolderContents(folder?.id)
    }

    function findFolderInTree(tree: FolderType[], id: string | number | undefined): FolderType | undefined {
        if (id === undefined) return undefined
        for (const f of tree) {
            if (f.id === id) return f
            if (f.children?.length) {
                const sub = findFolderInTree(f.children, id)
                if (sub) return sub
            }
        }
        return undefined
    }

    function goBack() {
        if (historyIndex.value > 0) {
            historyIndex.value--
            const targetId = history.value[historyIndex.value]
            const targetFolder = findFolderInTree(mainFolder.value, targetId)
            openFolder(targetFolder, false)
        }
    }

    function goForward() {
        if (historyIndex.value < history.value.length - 1) {
            historyIndex.value++
            const targetId = history.value[historyIndex.value]
            const targetFolder = findFolderInTree(mainFolder.value, targetId)
            openFolder(targetFolder, false)
        }
    }

    function goUp() {
        if (breadcrumb.value.length > 1) {
            const parent = breadcrumb.value[breadcrumb.value.length - 2]
            openFolder(parent)
        } else if (currentFolderId.value !== undefined) {
            openFolder(undefined)
        }
    }

    function refreshExplorer() {
        isRefreshing.value = true
        getMainFolder()
        getFolderContents(currentFolderId.value)
        setTimeout(() => { isRefreshing.value = false }, 400)
    }

    // ============================================================
    // GESTION DES SÉLECTIONS
    // ============================================================
    function selectFolder(folder: FolderType) {
        selectedFolderIds.value.clear()
        selectedDocumentIds.value.clear()
        selectedFolderIds.value.add(folder.id)
        selected_folder.value = folder
        selectedDocument.value = null
    }

    function selectDocument(doc: DocumentType) {
        selectedFolderIds.value.clear()
        selectedDocumentIds.value.clear()
        selectedDocumentIds.value.add(doc.id)
        selectedDocument.value = doc
        selected_folder.value = undefined
    }

    function toggleFolderSelection(id: string | number) {
        if (selectedFolderIds.value.has(id)) {
            selectedFolderIds.value.delete(id)
        } else {
            selectedFolderIds.value.add(id)
        }
        updatePrimarySelection()
    }

    function toggleDocumentSelection(id: string | number) {
        if (selectedDocumentIds.value.has(id)) {
            selectedDocumentIds.value.delete(id)
        } else {
            selectedDocumentIds.value.add(id)
        }
        updatePrimarySelection()
    }

    function toggleSelectAll() {
        if (isAllSelected.value) {
            clearSelection()
        } else {
            selectedFolderIds.value = new Set(filteredFolders.value.map(f => f.id))
            selectedDocumentIds.value = new Set(filteredDocuments.value.map(d => d.id))
            updatePrimarySelection()
        }
    }

    function clearSelection() {
        selectedFolderIds.value.clear()
        selectedDocumentIds.value.clear()
        selectedDocument.value = null
        selected_folder.value = undefined
    }

    function updatePrimarySelection() {
        if (selectedDocumentIds.value.size === 1 && selectedFolderIds.value.size === 0) {
            const id = Array.from(selectedDocumentIds.value)[0]
            selectedDocument.value = folders.value.documents?.find(d => d.id === id) || null
            selected_folder.value = undefined
        } else if (selectedFolderIds.value.size === 1 && selectedDocumentIds.value.size === 0) {
            const id = Array.from(selectedFolderIds.value)[0]
            selected_folder.value = folders.value.folders?.find(f => f.id === id)
            selectedDocument.value = null
        } else {
            selectedDocument.value = null
            selected_folder.value = undefined
        }
    }

    function copySelectedName() {
        let name = ''
        if (selectedDocument.value) name = selectedDocument.value.name
        else if (selected_folder.value) name = selected_folder.value.name
        if (name) navigator.clipboard.writeText(name)
    }

    // ============================================================
    // RACCOURCIS CLAVIER (WINDOWS NATIVE SHORTCUTS)
    // ============================================================
    function handleGlobalKeydown(e: KeyboardEvent) {
        const tag = (e.target as HTMLElement)?.tagName?.toLowerCase()
        if (tag === 'input' || tag === 'textarea') return

        if (e.key === 'F2') {
            e.preventDefault()
            triggerRenameSelected()
        } else if (e.key === 'Delete') {
            e.preventDefault()
            triggerDeleteSelected()
        } else if (e.key === 'Enter') {
            e.preventDefault()
            if (selected_folder.value) openFolder(selected_folder.value)
            else if (selectedDocument.value) openDocumentFile(selectedDocument.value)
        } else if (e.key === 'Backspace' || (e.altKey && e.key === 'ArrowUp')) {
            e.preventDefault()
            goUp()
        } else if (e.altKey && e.key === 'ArrowLeft') {
            e.preventDefault()
            goBack()
        } else if (e.altKey && e.key === 'ArrowRight') {
            e.preventDefault()
            goForward()
        } else if (e.key === 'F5') {
            e.preventDefault()
            refreshExplorer()
        } else if (e.key === 'Escape') {
            clearSelection()
        } else if (e.ctrlKey && e.key === 'a') {
            e.preventDefault()
            toggleSelectAll()
        }
    }

    // ============================================================
    // MENUS CONTEXTUELS SPÉCIFIQUES
    // ============================================================
    function openFolderContextMenu(e: MouseEvent, folder: FolderType) {
        closeAllContextMenus()
        selectFolder(folder)

        contextMenu.value.folder = folder
        contextMenu.value.contextMenu = e as unknown as contextMenuType
        contextMenu.value.actions = [
            {
                label: 'Ouvrir',
                icon: FolderOpen,
                onClick() {
                    openFolder(folder)
                    contextMenu.value.isOpen = false
                },
            },
            {
                label: 'Nouveau sous-dossier',
                icon: FolderPlus,
                onClick() {
                    data_create.value.folder_id = folder.id
                    data_create.value.folder_name = ''
                    modal.value.create = true
                    contextMenu.value.isOpen = false
                },
            },
            {
                label: 'Téléverser des fichiers',
                icon: FilePlus,
                onClick() {
                    openFilePicker(folder.id)
                    contextMenu.value.isOpen = false
                },
            },
            {
                label: 'Renommer (F2)',
                icon: Pencil,
                onClick() {
                    data_rename.value.folder_id = folder.id
                    data_rename.value.folder_name = folder.name
                    modal.value.rename = true
                    contextMenu.value.isOpen = false
                },
            },
        ]
        contextMenu.value.bottom_actions = [
            {
                label: 'Supprimer (Suppr)',
                icon: Trash2,
                variant: 'DANGER',
                onClick() {
                    modal.value.delete = true
                    contextMenu.value.isOpen = false
                },
            },
        ]
        contextMenu.value.isOpen = true
    }

    function openDocumentContextMenu(e: MouseEvent, doc: DocumentType) {
        closeAllContextMenus()
        selectDocument(doc)

        contextMenuDocument.value.document = doc
        contextMenuDocument.value.contextMenu = e as unknown as contextMenuType
        contextMenuDocument.value.actions = [
            {
                label: 'Ouvrir',
                icon: Eye,
                onClick() {
                    openDocumentFile(doc)
                    contextMenuDocument.value.isOpen = false
                },
            },
            {
                label: 'Télécharger',
                icon: Download,
                onClick() {
                    downloadDocument(doc)
                    contextMenuDocument.value.isOpen = false
                },
            },
            {
                label: 'Renommer (F2)',
                icon: Pencil,
                onClick() {
                    data_rename_document.value.id = doc.id
                    data_rename_document.value.name = doc.name
                    modal.value.rename_document = true
                    contextMenuDocument.value.isOpen = false
                },
            },
            {
                label: 'Propriétés',
                icon: Info,
                onClick() {
                    propertiesDocument.value = doc
                    modal.value.properties_document = true
                    contextMenuDocument.value.isOpen = false
                },
            },
        ]
        contextMenuDocument.value.bottom_actions = [
            {
                label: 'Supprimer (Suppr)',
                icon: Trash2,
                variant: 'DANGER',
                onClick() {
                    modal.value.delete_document = true
                    contextMenuDocument.value.isOpen = false
                },
            },
        ]
        contextMenuDocument.value.isOpen = true
    }

    function openEmptyAreaContextMenu(e: MouseEvent) {
        closeAllContextMenus()
        contextMenu.value.folder = undefined
        contextMenu.value.contextMenu = e as unknown as contextMenuType
        contextMenu.value.actions = [
            {
                label: 'Nouveau dossier',
                icon: FolderPlus,
                onClick() {
                    triggerCreateFolder()
                    contextMenu.value.isOpen = false
                },
            },
            {
                label: 'Téléverser des fichiers',
                icon: FilePlus,
                onClick() {
                    openFilePicker(currentFolderId.value)
                    contextMenu.value.isOpen = false
                },
            },
            {
                label: 'Actualiser (F5)',
                icon: RotateCw,
                onClick() {
                    refreshExplorer()
                    contextMenu.value.isOpen = false
                },
            },
        ]
        contextMenu.value.bottom_actions = []
        contextMenu.value.isOpen = true
    }

    function triggerCreateFolder() {
        data_create.value.folder_id = currentFolderId.value as string || ''
        data_create.value.folder_name = ''
        modal.value.create = true
    }

    function closeCreateModal() {
        modal.value.create = false
        data_create.value.folder_name = ''
    }

    function triggerRenameSelected() {
        if (selectedDocument.value) {
            data_rename_document.value.id = selectedDocument.value.id
            data_rename_document.value.name = selectedDocument.value.name
            modal.value.rename_document = true
        } else if (selected_folder.value) {
            data_rename.value.folder_id = selected_folder.value.id
            data_rename.value.folder_name = selected_folder.value.name
            modal.value.rename = true
        }
    }

    function triggerDeleteSelected() {
        if (selectedDocument.value) {
            contextMenuDocument.value.document = selectedDocument.value
            modal.value.delete_document = true
        } else if (selected_folder.value) {
            contextMenu.value.folder = selected_folder.value
            modal.value.delete = true
        }
    }

    // ============================================================
    // ARBORESCENCE DOSSIERS
    // ============================================================
    function isExpanded(id: string | number) {
        return expandedFolders.value.includes(id)
    }

    function toggleFolder(id: string | number) {
        if (expandedFolders.value.includes(id)) {
            expandedFolders.value = expandedFolders.value.filter(item => item !== id)
        } else {
            expandedFolders.value.push(id)
        }
    }

    function getMainFolder() {
        documentService
            .getFolders()
            .then(res => {
                mainFolder.value = res.data
            })
            .catch(err => {
                console.error(err)
            })
    }

    function getFolderContents(id: number | string | undefined) {
        documentService
            .getFolderContents(id)
            .then(res => {
                folders.value = res.data
            })
            .catch(err => {
                console.error(err)
            })
    }

    function createFolder() {
        const name = data_create.value.folder_name.trim()
        if (!name) return

        loading_create_folder.value = true
        documentService
            .createFolder({
                parent_id: data_create.value.folder_id,
                name: name,
            })
            .then(() => {
                closeCreateModal()
                getMainFolder()
                getFolderContents(currentFolderId.value)
            })
            .catch(err => {
                console.error(err)
            })
            .finally(() => {
                loading_create_folder.value = false
            })
    }

    function renameFolder() {
        const name = data_rename.value.folder_name.trim()
        if (!name) return

        documentService
            .renameFolder(data_rename.value.folder_id, name)
            .then(() => {
                modal.value.rename = false
                getMainFolder()
                getFolderContents(currentFolderId.value)
            })
            .catch(err => {
                console.error(err)
            })
    }

    function deleteFolder() {
        const id = contextMenu.value.folder?.id || selected_folder.value?.id
        if (!id) return

        loading_delete_folder.value = true
        documentService
            .deleteFolder(id)
            .then(() => {
                modal.value.delete = false
                clearSelection()
                getMainFolder()
                getFolderContents(currentFolderId.value)
            })
            .catch(err => {
                console.error(err)
            })
            .finally(() => {
                loading_delete_folder.value = false
            })
    }

    // ============================================================
    // OPÉRATIONS SUR LES DOCUMENTS
    // ============================================================
    function renameDocument() {
        const name = data_rename_document.value.name.trim()
        if (!name) return

        loading_rename_document.value = true
        documentService
            .renameDocument(data_rename_document.value.id, name)
            .then(() => {
                modal.value.rename_document = false
                if (selectedDocument.value?.id === data_rename_document.value.id) {
                    selectedDocument.value.name = name
                }
                getFolderContents(currentFolderId.value)
            })
            .catch(err => {
                console.error(err)
            })
            .finally(() => {
                loading_rename_document.value = false
            })
    }

    function deleteDocument() {
        const doc = contextMenuDocument.value.document || selectedDocument.value
        if (!doc) return

        loading_delete_document.value = true
        documentService
            .deleteDocument(doc.id)
            .then(() => {
                modal.value.delete_document = false
                clearSelection()
                getFolderContents(currentFolderId.value)
            })
            .catch(err => {
                console.error(err)
            })
            .finally(() => {
                loading_delete_document.value = false
            })
    }

    async function fetchDocumentBlob(doc: DocumentType): Promise<Blob> {
        const res = await documentService.downloadDocument(doc.id)
        return new Blob([res.data], { type: doc.mime_type || res.data?.type })
    }

    function saveBlob(blob: Blob, filename: string) {
        const url = URL.createObjectURL(blob)
        const a = window.document.createElement('a')
        a.href = url
        a.download = filename
        window.document.body.appendChild(a)
        a.click()
        a.remove()
        setTimeout(() => URL.revokeObjectURL(url), 1000)
    }

    async function downloadDocument(doc: DocumentType) {
        try {
            const blob = await fetchDocumentBlob(doc)
            saveBlob(blob, doc.original_name || doc.name)
        } catch (err) {
            console.error(err)
        }
    }

    async function openDocumentFile(doc: DocumentType) {
        const mime = doc.mime_type ?? ''
        const previewable =
            mime === 'application/pdf' ||
            mime === 'text/plain' ||
            mime.startsWith('video/') ||
            (mime.startsWith('image/') && mime !== 'image/svg+xml')

        if (!previewable) {
            return downloadDocument(doc)
        }

        try {
            const blob = await fetchDocumentBlob(doc)
            const url = URL.createObjectURL(blob)
            const tab = window.open(url, '_blank')
            if (!tab) saveBlob(blob, doc.original_name || doc.name)
            setTimeout(() => URL.revokeObjectURL(url), 60_000)
        } catch (err) {
            console.error(err)
        }
    }

    // ============================================================
    // GESTION DES APERÇUS (PREVIEW PANE)
    // ============================================================
    const previewUrl = ref<string | null>(null)
    const previewText = ref<string | null>(null)
    const previewLoading = ref(false)
    let previewToken = 0

    const previewKind = computed<'image' | 'video' | 'pdf' | 'text' | 'none'>(() => {
        const mime = selectedDocument.value?.mime_type ?? ''
        if (mime === 'application/pdf') return 'pdf'
        if (mime.startsWith('image/') && mime !== 'image/svg+xml') return 'image'
        if (mime.startsWith('video/')) return 'video'
        if (mime === 'text/plain' || mime === 'text/csv') return 'text'
        return 'none'
    })

    function clearPreview() {
        if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
        previewUrl.value = null
        previewText.value = null
        previewLoading.value = false
    }

    async function loadPreview() {
        const token = ++previewToken
        clearPreview()

        const doc = selectedDocument.value
        if (!doc || !right_sidebar.value || previewKind.value === 'none') return

        previewLoading.value = true
        try {
            const blob = await fetchDocumentBlob(doc)
            if (token !== previewToken) return

            if (previewKind.value === 'text') {
                const text = await blob.text()
                if (token !== previewToken) return
                previewText.value = text.slice(0, 3000)
            } else {
                previewUrl.value = URL.createObjectURL(blob)
            }
        } catch (err) {
            console.error(err)
        } finally {
            if (token === previewToken) previewLoading.value = false
        }
    }

    watch([() => selectedDocument.value?.id, right_sidebar], loadPreview)
    onBeforeUnmount(clearPreview)

    // ============================================================
    // UPLOAD & DRAG ET DROP
    // ============================================================
    type UploadItem = {
        id: number
        name: string
        progress: number
        status: 'pending' | 'uploading' | 'done' | 'error'
        error?: string
    }

    const fileInput = ref<HTMLInputElement | null>(null)
    const isDragging = ref<boolean>(false)
    const uploads = ref<UploadItem[]>([])
    const uploadTargetFolderId = ref<string | number | undefined>(undefined)
    let uploadId = 0
    let dragCounter = 0

    const ALLOWED_EXT = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'csv', 'ppt', 'pptx', 'txt', 'jpg', 'jpeg', 'png', 'webp', 'mp4', 'mov', 'avi']
    const ACCEPT_ATTR = ALLOWED_EXT.map(e => `.${e}`).join(',')

    function openFilePicker(folderId: string | number | undefined) {
        uploadTargetFolderId.value = folderId
        fileInput.value?.click()
    }

    function onFileInputChange(e: Event) {
        const input = e.target as HTMLInputElement
        const files = Array.from(input.files ?? [])
        if (files.length) uploadFiles(files, uploadTargetFolderId.value)
        input.value = ''
    }

    function onDragEnter(e: DragEvent) {
        if (!e.dataTransfer?.types.includes('Files')) return
        dragCounter++
        isDragging.value = true
    }

    function onDragLeave() {
        dragCounter = Math.max(0, dragCounter - 1)
        if (dragCounter === 0) isDragging.value = false
    }

    function onDrop(e: DragEvent) {
        dragCounter = 0
        isDragging.value = false
        const files = Array.from(e.dataTransfer?.files ?? [])
        if (files.length) uploadFiles(files, currentFolderId.value)
    }

    function onDropOnFolder(e: DragEvent, folder: FolderType) {
        dragCounter = 0
        isDragging.value = false
        const files = Array.from(e.dataTransfer?.files ?? [])
        if (files.length) uploadFiles(files, folder.id)
    }

    async function uploadFiles(files: File[], folderId: string | number | undefined) {
        for (const file of files) {
            const item: UploadItem = {
                id: ++uploadId,
                name: file.name,
                progress: 0,
                status: 'uploading',
            }
            uploads.value.push(item)

            try {
                await documentService.uploadDocument(file, folderId, p => {
                    item.progress = p
                })
                item.progress = 100
                item.status = 'done'
            } catch (err: any) {
                item.status = 'error'
                item.error = err?.response?.data?.message || 'Erreur lors de l\'envoi'
            }
        }

        getFolderContents(currentFolderId.value)
        setTimeout(() => {
            uploads.value = uploads.value.filter(u => u.status === 'error')
        }, 4000)
    }

    // ============================================================
    // UTILITAIRES DE FORMATAGE
    // ============================================================
    function formatSize(size?: number | string | null): string {
        const bytes = Number(size)
        if (!size || Number.isNaN(bytes)) return '—'
        if (bytes < 1024) return `${bytes} o`
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`
        if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`
        return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} Go`
    }

    function formatDate(value?: string | null): string {
        if (!value) return '—'
        const d = new Date(value)
        if (Number.isNaN(d.getTime())) return String(value)
        return new Intl.DateTimeFormat('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }).format(d)
    }

    function getExt(doc: DocumentType): string {
        const ext = (doc.name || '').split('.').pop()?.toLowerCase() || ''
        return ext.slice(0, 4)
    }

    function formatDocType(doc: DocumentType): string {
        const ext = (doc.name || '').split('.').pop()?.toLowerCase() || ''
        if (['pdf'].includes(ext)) return 'Document Adobe Acrobat (PDF)'
        if (['xlsx', 'xls', 'csv'].includes(ext)) return 'Feuille de calcul Microsoft Excel'
        if (['docx', 'doc'].includes(ext)) return 'Document Microsoft Word'
        if (['pptx', 'ppt'].includes(ext)) return 'Présentation PowerPoint'
        if (['png', 'jpg', 'jpeg', 'webp', 'gif'].includes(ext)) return `Fichier image ${ext.toUpperCase()}`
        if (['mp4', 'mov', 'avi', 'mkv'].includes(ext)) return `Fichier vidéo ${ext.toUpperCase()}`
        if (['txt'].includes(ext)) return 'Document texte'
        return doc.mime_type || 'Fichier'
    }

    function fileIcon(doc: DocumentType) {
        const ext = (doc.name || '').split('.').pop()?.toLowerCase() || ''
        if (['png', 'jpg', 'jpeg', 'webp', 'gif', 'svg'].includes(ext)) {
            return { icon: FileImage, color: 'text-emerald-600' }
        }
        if (['mp4', 'mov', 'avi', 'mkv'].includes(ext)) {
            return { icon: FileVideo, color: 'text-rose-500' }
        }
        if (['xlsx', 'xls', 'csv'].includes(ext)) {
            return { icon: FileSpreadsheet, color: 'text-[#0F9D58]' }
        }
        if (['pptx', 'ppt'].includes(ext)) {
            return { icon: Presentation, color: 'text-amber-500' }
        }
        if (['pdf'].includes(ext)) {
            return { icon: FileTextIcon, color: 'text-red-500' }
        }
        return { icon: FileTextIcon, color: 'text-sky-600' }
    }

    onMounted(() => {
        getMainFolder()
        getFolderContents(undefined)
    })
</script>

<style scoped>
/* Scrollbar subtile Windows style */
.no-scrollbar::-webkit-scrollbar {
    display: none;
}
.no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
</style>