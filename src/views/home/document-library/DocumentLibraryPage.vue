<template>
    <div class="h-screen flex flex-col" @click="contextMenu.isOpen = false; contextMenuDocument.isOpen = false">

        <Header title="document library" show-search :thumbnails="[
            {
                label: 'thumbnails.home',
                name: 'DASHBOARD'
            },
            {
                label: 'thumbnails.document library',
                name: 'DOCUMENT_LIBRARY'
            }
        ]" />

        <!-- CONTENT -->

        <div class="flex-1 bg-surface flex flex-row h-full">

            <!-- LEFT TREE -->

            <div class="w-60 min-w-60 border-r select-none self-start sticky top-0 border-border p-4 overflow-y-auto h-full">
                <div class="flex mb-4 flex-row items-center justify-between">
                    <h5>{{ t('document library.folders') }}</h5>
                    <div class="flex flex-row items-center gap-x-1">
                        <button title="Nouveau dossier"
                            @click="data_create.folder_id = selected_folder?.id as string; modal.create = true"
                            class="rounded-lg p-1.5 text-text-secondary transition-colors hover:bg-primary-light hover:text-primary">
                            <FolderPlus :size="20" />
                        </button>
                        <button title="Nouveau document" @click.stop="openFilePicker(currentFolderId)"
                            class="rounded-lg p-1.5 text-text-secondary transition-colors hover:bg-primary-light hover:text-primary">
                            <FilePlus :size="20" />
                        </button>

                        <!-- Input fichier caché (partagé par tous les déclencheurs) -->
                        <input ref="fileInput" type="file" multiple class="hidden" :accept="ACCEPT_ATTR" @click.stop
                            @change="onFileInputChange" />
                    </div>
                </div>

                <button
                    class="w-full flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-surface-alt"
                    :class="selected_folder === undefined ? 'bg-primary/10 text-primary' : ''"
                    @click="openFolder(undefined)">
                    <FolderOpen :size="18" class="text-warning" />
                    Documents
                </button>

                <div class="mt-2 ml-2 space-y-1">
                    <template v-for="folder in mainFolder" :key="folder!.id">
                        <div class="w-full flex items-center gap-2 rounded-lg px-2 py-1.5 cursor-pointer transition-colors hover:bg-surface-alt"
                            :class="selected_folder?.id === folder.id ? 'bg-primary/10 text-primary' : ''"
                            @click="openFolder(folder)"
                            @contextmenu.prevent.stop="contextMenu.contextMenu = $event; contextMenu.isOpen = true; contextMenu.folder = folder">
                            <button class="rounded p-0.5 transition-colors hover:bg-primary-light"
                                @click.stop="toggleFolder(folder.id)">
                                <template v-if="folder.children?.length">
                                    <ChevronDown v-if="isExpanded(folder.id)" :size="14" />
                                    <ChevronRight v-else :size="14" />
                                </template>
                            </button>

                            <Folder :size="18" class="text-warning  " />
                            <span class="text-nowrap truncate">
                                {{ folder.name }}
                            </span>
                        </div>

                        <div v-if="isExpanded(folder.id)" class="ml-6 space-y-1">
                            <button v-for="child in folder.children" :key="child.id"
                                class="w-full flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-surface-alt text-sm"
                                :class="selected_folder?.id === child.id ? 'bg-primary/10 text-primary' : ''"
                                @click="openFolder(child)"
                                @contextmenu.prevent.stop="contextMenu.contextMenu = $event; contextMenu.isOpen = true; contextMenu.folder = child">
                                <FolderOpen :size="16" class="text-warning" />
                                <span class="text-nowrap truncate">
  
                                {{ child.name }}
                                </span>
                            </button>
                        </div>
                    </template>
                </div>
            </div>

            <!-- CENTER -->

            <div class="relative transition-all p-4 overflow-y-auto self-start h-full"
                :class="right_sidebar && !sidebar.isShow ? 'w-7/12' : 'w-10/12'" @dragenter.prevent="onDragEnter"
                @dragover.prevent @dragleave.prevent="onDragLeave" @drop.prevent="onDrop">

                <!-- OVERLAY DRAG & DROP -->

                <div v-if="isDragging"
                    class="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-primary bg-primary/10 text-primary pointer-events-none">
                    <UploadCloud :size="64" />
                    <span class="font-medium">
                        Déposez vos fichiers ici{{ breadcrumb.length ? ' (' + breadcrumb[breadcrumb.length - 1].name +
                        ')' : '' }}
                    </span>
                </div>

                <!-- BREADCRUMB -->

                <div class="flex flex-row items-center justify-between">
                    <div class="mb-6 flex items-center gap-2 text-sm text-text-secondary">
                        <button class="transition-colors hover:text-primary" @click="openFolder(undefined)">
                            Documentation
                        </button>

                        <template v-for="item in breadcrumb" :key="item.id">
                            <span>/</span>
                            <button class="text-primary font-medium transition-colors hover:text-primary-dark"
                                @click="openFolder(item)">
                                {{ item.name }}
                            </button>
                        </template>
                    </div>
                    <div class="flex flex-row items-center gap-x-3">
                        <button
                            class="flex flex-row items-center gap-x-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors"
                            :class="right_sidebar ? 'bg-primary-light text-primary' : 'text-text-secondary hover:bg-surface-alt'"
                            @click="right_sidebar = !right_sidebar">
                            <PanelRight :size="18" />
                            <span>{{ t("document library.details") }}</span>
                        </button>
                    </div>
                </div>

                <!-- EXPLORER -->

                <div class="grid gap-4" :class="right_sidebar && !sidebar.isShow ? 'grid-cols-5' : 'grid-cols-7'">

                    <!-- FOLDERS -->

                    <div v-for="folder in folders.folders" :key="`folder-${folder.id}`"
                        class="flex flex-col select-none items-center gap-2 p-3 rounded-xl cursor-pointer transition-colors hover:bg-surface-alt"
                        @dblclick="openFolder(folder)" @dragover.prevent
                        @drop.prevent.stop="onDropOnFolder($event, folder)"
                        @contextmenu.prevent.stop="contextMenu.contextMenu = $event; contextMenu.isOpen = true; contextMenu.folder = folder">
                        <FolderIcon :size="50" class="text-warning" />
                        <span class="text-xs text-center">{{ folder.name }}</span>
                    </div>

                    <!-- DOCUMENTS -->

                    <div v-for="document in folders.documents" :key="`document-${document.id}`"
                        class="flex flex-col select-none items-center gap-2 p-3 rounded-xl cursor-pointer transition-colors hover:bg-surface-alt"
                        :class="selectedDocument?.id === document.id ? 'bg-primary-light ring-1 ring-primary/30' : ''"
                        @click="openDocument(document)" @dblclick="openDocumentFile(document)"
                        @contextmenu.prevent.stop="onDocumentContextMenu($event, document)">
                        <component :is="fileIcon(document).icon" :size="50" :class="fileIcon(document).color" />
                        <span class="text-xs text-center break-all">{{ document.name }}</span>
                    </div>
                </div>

                <div class="flex flex-col items-center justify-center h-96 text-text-muted gap-4"
                    v-if="folders.folders?.length == 0 && folders.documents?.length == 0">
                    <FolderOpen :size="80" />
                    <span>Ce dossier est vide</span>
                    <span class="text-xs">Glissez-déposez des fichiers ici ou cliquez sur « Nouveau document ».</span>
                </div>
            </div>

            <!-- RIGHT PREVIEW -->

            <div v-if="right_sidebar " :class="right_sidebar ? 'w-3/12' : 'w-0'"
                class="transition-all border-l border-border p-4 self-start sticky top-0 h-full max-h-screen overflow-y-auto">
                <template v-if="selectedDocument">
                    <h5 class="mb-5">{{ t('details') }}</h5>

                    <!-- APERÇU DU FICHIER -->

                    <div :key="selectedDocument.id"
                        class="mb-5 overflow-hidden rounded-lg border border-border bg-surface-alt">
                        <div v-if="previewLoading"
                            class="flex h-48 items-center justify-center text-xs text-text-muted">
                            Chargement de l'aperçu…
                        </div>

                        <img v-else-if="previewKind === 'image' && previewUrl" :src="previewUrl"
                            :alt="selectedDocument.name" title="Cliquer pour agrandir"
                            class="max-h-72 w-full cursor-zoom-in object-contain"
                            @click="openDocumentFile(selectedDocument)" />

                        <video v-else-if="previewKind === 'video' && previewUrl" :src="previewUrl" controls
                            preload="metadata" class="max-h-72 w-full bg-black" />

                        <iframe v-else-if="previewKind === 'pdf' && previewUrl" :src="previewUrl"
                            :title="selectedDocument.name" class="h-96 w-full bg-white" />

                        <pre v-else-if="previewKind === 'text' && previewText !== null"
                            class="max-h-72 overflow-auto whitespace-pre-wrap break-words p-3 text-xs">{{ previewText }}</pre>

                        <div v-else class="flex h-48 flex-col items-center justify-center gap-3 p-4 text-center">
                            <component :is="fileIcon(selectedDocument).icon" :size="56"
                                :class="fileIcon(selectedDocument).color" />
                            <p class="text-xs text-text-muted">
                                <template v-if="previewError">Impossible de charger l'aperçu.</template>
                                <template v-else-if="previewTooLarge">Fichier volumineux : aperçu désactivé.</template>
                                <template v-else>Aperçu non disponible pour ce format.</template>
                            </p>
                            <div class="flex gap-2">
                                <button class="rounded-lg px-2.5 py-1 text-xs text-primary hover:bg-primary-light"
                                    @click="openDocumentFile(selectedDocument)">
                                    Ouvrir
                                </button>
                                <button class="rounded-lg px-2.5 py-1 text-xs text-primary hover:bg-primary-light"
                                    @click="downloadDocument(selectedDocument)">
                                    Télécharger
                                </button>
                            </div>
                        </div>
                    </div>

                    <div class="flex flex-col gap-4">
                        <div>
                            <span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-text-secondary">
                                {{ t('document library.name') }}
                            </span>
                            <p class="text-sm font-medium text-text-primary">{{ selectedDocument.name }}</p>
                        </div>

                        <div>
                            <span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-text-secondary">
                                {{ t('document library.original name') }}
                            </span>
                            <p class="text-sm font-medium text-text-primary">{{ selectedDocument.original_name }}</p>
                        </div>

                        <div>
                            <span
                                class="mb-1 block text-xs font-semibold uppercase tracking-wide text-text-secondary">Version</span>
                            <p class="text-sm font-medium text-text-primary">{{ selectedDocument.version }}</p>
                        </div>

                        <div>
                            <span
                                class="mb-1 block text-xs font-semibold uppercase tracking-wide text-text-secondary">Taille</span>
                            <p class="text-sm font-medium text-text-primary">{{ formatSize(selectedDocument.size) }}</p>
                        </div>

                        <div>
                            <span
                                class="mb-1 block text-xs font-semibold uppercase tracking-wide text-text-secondary">Type</span>
                            <p class="text-sm font-medium text-text-primary">{{ selectedDocument.mime_type }}</p>
                        </div>

                        <div>
                            <span
                                class="mb-1 block text-xs font-semibold uppercase tracking-wide text-text-secondary">Créé
                                le</span>
                            <p class="text-sm font-medium text-text-primary">{{ formatDate(selectedDocument.created_at)
                                }}</p>
                        </div>
                    </div>
                </template>

                <div v-else class="h-full flex items-center justify-center text-text-muted">
                    {{ t('document library.no file selected') }}
                </div>
            </div>

        </div>

        <ContextMenuUI :model-value="contextMenu.isOpen" :context-menu="contextMenu.contextMenu"
            :actions="contextMenu.actions" :bottom_actions="contextMenu.bottom_actions" />
        <ContextMenuUI :model-value="contextMenuDocument.isOpen" :context-menu="contextMenuDocument.contextMenu"
            :actions="contextMenuDocument.actions" :bottom_actions="contextMenuDocument.bottom_actions" />

        <CenterModal :is-open="modal.delete" @close="modal.delete = false" title="Confirmation de suppression"
            :title-variant="'danger'" :confirm-variant="'danger'" :confirm-loading="loading_delete_folder"
            @confirm="deleteFolder()">
            <p class="text-xs">
                Êtes-vous sûr de vouloir supprimer ce dossier ?

                La suppression du dossier peut également supprimer les éléments qu'il contient. Cette action est
                irréversible.
            </p>
        </CenterModal>

        <CenterModal :is-open="modal.rename" @confirm="renameFolder()"
            @close="() => { modal.rename = false; data_rename.folder_id = ''; data_rename.folder_name = '' }"
            title="Renommer">
            <Input label="Saisissez le nouveau nom du dossier." v-model="data_rename.folder_name" />
        </CenterModal>
        <CenterModal :is-open="modal.create" :confirm-loading="loading_create_folder" @confirm="createFolder()"
            @close="() => { modal.create = false; data_create.folder_id = ''; data_create.folder_name = '' }"
            title="Nouveau dossier">
            <Input label="Saisissez le nom du dossier." v-model="data_create.folder_name" />
        </CenterModal>

        <!-- MODAL RENOMMER DOCUMENT -->

        <CenterModal :is-open="modal.rename_document" :confirm-loading="loading_rename_document"
            @confirm="renameDocument()"
            @close="() => { modal.rename_document = false; data_rename_document.id = ''; data_rename_document.name = '' }"
            title="Renommer le document">
            <Input label="Saisissez le nouveau nom du document." v-model="data_rename_document.name" />
        </CenterModal>

        <!-- MODAL SUPPRESSION DOCUMENT -->

        <CenterModal :is-open="modal.delete_document" @close="modal.delete_document = false"
            title="Confirmation de suppression" :title-variant="'danger'" :confirm-variant="'danger'"
            :confirm-loading="loading_delete_document" @confirm="deleteDocument()">
            <p class="text-xs">
                Êtes-vous sûr de vouloir supprimer le document
                <strong>{{ contextMenuDocument.document?.name }}</strong> ? Cette action est irréversible.
            </p>
        </CenterModal>

        <!-- MODAL PROPRIÉTÉS DOCUMENT -->

        <div v-if="modal.properties_document && propertiesDocument"
            class="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
            @click.self="modal.properties_document = false">
            <div class="w-full max-w-md rounded-xl border border-border bg-surface p-6 shadow-xl" @click.stop>
                <div class="mb-4 flex items-center justify-between">
                    <h5>Propriétés</h5>
                    <button class="text-text-secondary hover:text-primary" @click="modal.properties_document = false">
                        <X :size="18" />
                    </button>
                </div>

                <div class="mb-5 flex items-center gap-3">
                    <component :is="fileIcon(propertiesDocument).icon" :size="40"
                        :class="fileIcon(propertiesDocument).color" />
                    <p class="break-all text-sm font-medium">{{ propertiesDocument.name }}</p>
                </div>

                <dl class="grid grid-cols-3 gap-x-3 gap-y-3 text-sm">
                    <dt class="text-text-secondary">Nom d'origine</dt>
                    <dd class="col-span-2 break-all">{{ propertiesDocument.original_name }}</dd>

                    <dt class="text-text-secondary">Type</dt>
                    <dd class="col-span-2 break-all">{{ propertiesDocument.mime_type }}</dd>

                    <dt class="text-text-secondary">Taille</dt>
                    <dd class="col-span-2">{{ formatSize(propertiesDocument.size) }}</dd>

                    <dt class="text-text-secondary">Version</dt>
                    <dd class="col-span-2">{{ propertiesDocument.version }}</dd>

                    <dt class="text-text-secondary">Emplacement</dt>
                    <dd class="col-span-2 break-all">{{ currentPathLabel }}</dd>

                    <dt class="text-text-secondary">Créé le</dt>
                    <dd class="col-span-2">{{ formatDate(propertiesDocument.created_at) }}</dd>
                </dl>

                <div class="mt-6 flex justify-end gap-2">
                    <button class="rounded-lg px-3 py-1.5 text-sm text-text-secondary hover:bg-surface-alt"
                        @click="modal.properties_document = false">
                        Fermer
                    </button>
                    <button
                        class="flex items-center gap-2 rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-white"
                        @click="downloadDocument(propertiesDocument)">
                        <Download :size="16" />
                        Télécharger
                    </button>
                </div>
            </div>
        </div>

        <!-- PANNEAU DE PROGRESSION DES UPLOADS -->

        <div v-if="uploads.length"
            class="fixed bottom-4 right-4 z-50 w-80 rounded-xl border border-border bg-surface shadow-lg">
            <div class="flex items-center justify-between border-b border-border px-4 py-2">
                <span class="text-sm font-medium">Téléversement</span>
                <button class="text-text-secondary hover:text-primary" @click="uploads = []">
                    <X :size="16" />
                </button>
            </div>
            <ul class="max-h-60 overflow-y-auto p-3 space-y-3">
                <li v-for="u in uploads" :key="u.id" class="text-xs">
                    <div class="flex justify-between gap-2">
                        <span class="truncate">{{ u.name }}</span>
                        <span v-if="u.status === 'uploading'">{{ u.progress }}%</span>
                        <span v-else-if="u.status === 'done'" class="text-green-600">OK</span>
                        <span v-else-if="u.status === 'error'" class="text-red-600">Erreur</span>
                    </div>
                    <div class="mt-1 h-1.5 w-full overflow-hidden rounded bg-surface-alt">
                        <div class="h-full transition-all" :class="u.status === 'error' ? 'bg-red-500' : 'bg-primary'"
                            :style="{ width: u.progress + '%' }" />
                    </div>
                    <p v-if="u.error" class="mt-1 text-red-600">{{ u.error }}</p>
                </li>
            </ul>
        </div>
    </div>

</template>
<script setup lang="ts">
    import {
        FilePlus,
        PanelRight,
        FileTextIcon,
        Folder,
        FolderOpen,
        ChevronRight,
        ChevronDown,
        FolderPlus,
        FolderIcon,
        Pencil,
        Wrench,
        Trash2,
        UploadCloud,
        X,
        Eye,
        Download,
        Info,
        FileVideo,
        FileImage,
        FileSpreadsheet,
        Presentation,
    } from '@lucide/vue'

    import Header from '../../../components/shared/Header.vue'
    import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
    import { useSidebarStore } from '../../../services/useSidebarStore..ts'
    import type {
        DocumentType,
        FolderContentType,
        FolderType,
    } from '../../../@types/DocumentLibrary.type.ts'
    import { useI18n } from 'vue-i18n'
    import documentService from '../../../core/services/document.service.ts'
    import ContextMenuUI from '../../../components/ui/ContextMenuUI.vue'
    import type { ContextMenuActionType, contextMenuType } from '../../../@types/ContextMenu.type.ts'
    import CenterModal from '../../../components/ui/centerModal.vue'
    import Input from '../../../components/ui/Input.vue'

    const { t } = useI18n()
    const sidebar = useSidebarStore()

    const modal = ref({
        rename: false,
        delete: false,
        create: false,
        rename_document: false,
        delete_document: false,
        properties_document: false,
    })

    const contextMenu = ref<{
        isOpen: boolean
        contextMenu?: contextMenuType
        actions: ContextMenuActionType[]
        bottom_actions: ContextMenuActionType[]
        folder?: FolderType
    }>({
        isOpen: false,
        actions: [
            {
                label: 'Ouvrir',
                icon: FolderOpen,
                onClick() {
                    openFolder(contextMenu.value.folder)
                    contextMenu.value.isOpen = false
                },
            },
            {
                label: 'Nouveau dossier',
                icon: FolderPlus,
                onClick() {
                    modal.value.create = true
                    data_create.value.folder_id = contextMenu.value.folder?.id as string
                    contextMenu.value.isOpen = false
                },
            },
            {
                label: 'Ajouter un document',
                icon: FilePlus,
                onClick() {
                    openFilePicker(contextMenu.value.folder?.id)
                    contextMenu.value.isOpen = false
                },
            },
            {
                label: 'Renommer',
                icon: Pencil,
                onClick() {
                    modal.value.rename = true
                    data_rename.value.folder_id = contextMenu.value.folder?.id as string | number
                    data_rename.value.folder_name = contextMenu.value.folder?.name as string
                    contextMenu.value.isOpen = false
                },
            },
            {
                label: 'Propriétés',
                icon: Wrench,
            },
        ],
        bottom_actions: [
            {
                label: 'Supprimer',
                icon: Trash2,
                variant: 'DANGER',
                onClick() {
                    modal.value.delete = true
                    contextMenu.value.isOpen = false
                },
            },
        ],
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
        actions: [
            {
                label: 'Ouvrir',
                icon: Eye,
                onClick() {
                    const doc = contextMenuDocument.value.document
                    if (doc) openDocumentFile(doc)
                    contextMenuDocument.value.isOpen = false
                },
            },
            {
                label: 'Télécharger',
                icon: Download,
                onClick() {
                    const doc = contextMenuDocument.value.document
                    if (doc) downloadDocument(doc)
                    contextMenuDocument.value.isOpen = false
                },
            },
            {
                label: 'Renommer',
                icon: Pencil,
                onClick() {
                    const doc = contextMenuDocument.value.document
                    if (doc) {
                        data_rename_document.value.id = doc.id as string | number
                        data_rename_document.value.name = doc.name
                        modal.value.rename_document = true
                    }
                    contextMenuDocument.value.isOpen = false
                },
            },
            {
                label: 'Détails',
                icon: Info,
                onClick() {
                    const doc = contextMenuDocument.value.document
                    if (doc) openDocument(doc)
                    contextMenuDocument.value.isOpen = false
                },
            },
            {
                label: 'Propriétés',
                icon: Wrench,
                onClick() {
                    propertiesDocument.value = contextMenuDocument.value.document ?? null
                    modal.value.properties_document = true
                    contextMenuDocument.value.isOpen = false
                },
            },
        ],
        bottom_actions: [
            {
                label: 'Supprimer',
                icon: Trash2,
                variant: 'DANGER',
                onClick() {
                    modal.value.delete_document = true
                    contextMenuDocument.value.isOpen = false
                },
            },
        ],
        document: undefined,
    })

    const right_sidebar = ref(false)

    const data_rename = ref<{
        folder_id: string | number
        folder_name: string
    }>({
        folder_id: '',
        folder_name: '',
    })
    const data_create = ref<{
        folder_id: string | number
        folder_name: string
    }>({
        folder_id: '',
        folder_name: '',
    })

    const folders = ref<FolderContentType>({
        folders: [],
        documents: [],
    })

    const selectedDocument = ref<DocumentType | null>(null)
    const selected_folder = ref<FolderType | undefined>(undefined)
    const currentFolderId = ref<string | number | undefined>(undefined)
    const expandedFolders = ref<(string | number)[]>([])
    const mainFolder = ref<FolderType[]>()
    const loading_create_folder = ref<boolean>(false)
    const loading_delete_folder = ref<boolean>(false)

    const data_rename_document = ref<{
        id: string | number
        name: string
    }>({
        id: '',
        name: '',
    })
    const propertiesDocument = ref<DocumentType | null>(null)
    const loading_rename_document = ref<boolean>(false)
    const loading_delete_document = ref<boolean>(false)

    // ============================================================
    // ======================= DOCUMENTS ==========================
    // ============================================================

    function formatSize(size?: number | string | null): string {
        const bytes = Number(size)
        if (size === undefined || size === null || size === '' || Number.isNaN(bytes)) return '-'
        if (bytes < 1024) return `${bytes} o`
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`
        if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`
        return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} Go`
    }

    // ============================================================
    // ======================= APERÇU =============================
    // ============================================================

    const PREVIEW_MAX_BYTES = 50 * 1024 * 1024 // au-delà, pas de chargement automatique
    const PREVIEW_TEXT_MAX_CHARS = 5000
    const IMAGE_PREVIEW_MIMES = [
        'image/jpeg', 'image/png', 'image/gif', 'image/webp',
        'image/bmp', 'image/svg+xml', 'image/avif', 'image/x-icon', 'image/vnd.microsoft.icon',
    ]
    const VIDEO_PREVIEW_MIMES = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime']

    const previewUrl = ref<string | null>(null)
    const previewText = ref<string | null>(null)
    const previewLoading = ref(false)
    const previewError = ref(false)
    let previewToken = 0

    const previewKind = computed<'image' | 'video' | 'pdf' | 'text' | 'none'>(() => {
        const mime = selectedDocument.value?.mime_type ?? ''
        if (mime === 'application/pdf') return 'pdf'
        if (IMAGE_PREVIEW_MIMES.includes(mime)) return 'image'
        if (VIDEO_PREVIEW_MIMES.includes(mime)) return 'video'
        if (mime === 'text/plain' || mime === 'text/csv') return 'text'
        return 'none'
    })

    const previewTooLarge = computed(() => {
        const size = Number(selectedDocument.value?.size)
        return !Number.isNaN(size) && size > PREVIEW_MAX_BYTES
    })

    function clearPreview() {
        if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
        previewUrl.value = null
        previewText.value = null
        previewError.value = false
        previewLoading.value = false
    }

    async function loadPreview() {
        const token = ++previewToken
        clearPreview()

        const doc = selectedDocument.value
        if (!doc || !right_sidebar.value) return
        if (previewKind.value === 'none' || previewTooLarge.value) return

        previewLoading.value = true
        try {
            const blob = await fetchDocumentBlob(doc)
            if (token !== previewToken) return // un autre document a été sélectionné entre-temps

            if (previewKind.value === 'text') {
                const text = await blob.text()
                if (token !== previewToken) return
                previewText.value =
                    text.length > PREVIEW_TEXT_MAX_CHARS
                        ? text.slice(0, PREVIEW_TEXT_MAX_CHARS) + '\n…'
                        : text
            } else {
                previewUrl.value = URL.createObjectURL(blob)
            }
        } catch (err) {
            console.error(err)
            if (token === previewToken) previewError.value = true
        } finally {
            if (token === previewToken) previewLoading.value = false
        }
    }

    // Recharge l'aperçu quand on change de document ou qu'on ouvre le panneau
    watch([() => selectedDocument.value?.id, right_sidebar], loadPreview)

    onBeforeUnmount(clearPreview)

    // Icône + couleur selon le type de fichier
    function fileIcon(document: DocumentType) {
        const mime = document.mime_type ?? ''
        const ext = (document.original_name ?? document.name ?? '').split('.').pop()?.toLowerCase() ?? ''

        if (mime.startsWith('image/') || IMAGE_EXT.includes(ext)) {
            return { icon: FileImage, color: 'text-green-600' }
        }
        if (mime.startsWith('video/') || VIDEO_EXT.includes(ext)) {
            return { icon: FileVideo, color: 'text-red-500' }
        }
        if (['xls', 'xlsx', 'ods', 'csv'].includes(ext)) {
            return { icon: FileSpreadsheet, color: 'text-green-600' }
        }
        if (['ppt', 'pptx', 'odp'].includes(ext)) {
            return { icon: Presentation, color: 'text-warning' }
        }
        return { icon: FileTextIcon, color: 'text-primary' }
    }

    function formatDate(value?: string | null): string {
        if (!value) return '-'
        const d = new Date(value)
        return Number.isNaN(d.getTime()) ? value : d.toLocaleString('fr-FR')
    }

    const currentPathLabel = computed(() => {
        const path = breadcrumb.value.map(f => f.name).join(' / ')
        return path ? `Documentation HSSE / ${path}` : 'Documentation HSSE'
    })

    // Clic droit : sélectionne aussi le document
    function onDocumentContextMenu(e: MouseEvent, document: DocumentType) {
        contextMenu.value.isOpen = false
        selectedDocument.value = document
        contextMenuDocument.value.contextMenu = e as unknown as contextMenuType
        contextMenuDocument.value.document = document
        contextMenuDocument.value.isOpen = true
    }

    async function fetchDocumentBlob(document: DocumentType): Promise<Blob> {
        const res = await documentService.downloadDocument(document.id)
        return new Blob([res.data], { type: document.mime_type || res.data?.type })
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

    async function downloadDocument(document: DocumentType) {
        try {
            const blob = await fetchDocumentBlob(document)
            saveBlob(blob, document.original_name || document.name)
        } catch (err) {
            console.error(err)
        }
    }

    // Ouvre PDF, images, vidéos et .txt dans un nouvel onglet, télécharge les autres formats
    async function openDocumentFile(document: DocumentType) {
        // SVG exclu de l'aperçu : il peut contenir des scripts exécutés dans l'origine de l'app
        const mime = document.mime_type ?? ''
        const previewable =
            mime === 'application/pdf' ||
            mime === 'text/plain' ||
            mime.startsWith('video/') ||
            (mime.startsWith('image/') && mime !== 'image/svg+xml')

        if (!previewable) {
            return downloadDocument(document)
        }

        try {
            const blob = await fetchDocumentBlob(document)
            const url = URL.createObjectURL(blob)
            const tab = window.open(url, '_blank')
            if (!tab) saveBlob(blob, document.original_name || document.name) // popup bloquée
            setTimeout(() => URL.revokeObjectURL(url), 60_000)
        } catch (err) {
            console.error(err)
        }
    }

    function renameDocument() {
        const name = data_rename_document.value.name.trim()
        if (!name) return

        loading_rename_document.value = true
        documentService
            .renameDocument(data_rename_document.value.id, name)
            .then(() => {
                modal.value.rename_document = false
                if (selectedDocument.value?.id === data_rename_document.value.id) {
                    selectedDocument.value = { ...selectedDocument.value, name } as DocumentType
                }
                data_rename_document.value.id = ''
                data_rename_document.value.name = ''
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
        const doc = contextMenuDocument.value.document
        if (!doc) return

        loading_delete_document.value = true
        documentService
            .deleteDocument(doc.id)
            .then(() => {
                modal.value.delete_document = false
                if (selectedDocument.value?.id === doc.id) selectedDocument.value = null
                contextMenuDocument.value.document = undefined
                getFolderContents(currentFolderId.value)
            })
            .catch(err => {
                console.error(err)
            })
            .finally(() => {
                loading_delete_document.value = false
            })
    }

    // ============================================================
    // ======================= UPLOAD =============================
    // ============================================================

    type UploadItem = {
        id: number
        name: string
        progress: number
        status: 'pending' | 'uploading' | 'done' | 'error'
        error?: string
    }

    const IMAGE_EXT = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg', 'tif', 'tiff', 'heic', 'heif', 'avif', 'ico']
    const VIDEO_EXT = ['mp4', 'mov', 'avi', 'mkv', 'webm', 'wmv', 'flv', 'm4v', 'mpg', 'mpeg', '3gp']
    const DOCUMENT_EXT = [
        'pdf', 'doc', 'docx', 'odt', 'rtf', 'txt',
        'xls', 'xlsx', 'ods', 'csv',
        'ppt', 'pptx', 'odp',
    ]
    const ALLOWED_EXT = [...IMAGE_EXT, ...VIDEO_EXT, ...DOCUMENT_EXT]
    const ACCEPT_ATTR = ALLOWED_EXT.map(e => `.${e}`).join(',')
    const MAX_SIZE_MB = 500 // identique à max:512000 côté Laravel
    const MAX_SIZE = MAX_SIZE_MB * 1024 * 1024

    const fileInput = ref<HTMLInputElement | null>(null)
    const isDragging = ref(false)
    const uploads = ref<UploadItem[]>([])
    const uploadTargetFolderId = ref<string | number | undefined>(undefined)
    let dragCounter = 0
    let uploadId = 0

    // --- Ajout manuel ---
    function openFilePicker(folderId: string | number | undefined) {
        uploadTargetFolderId.value = folderId
        fileInput.value?.click()
    }

    function onFileInputChange(e: Event) {
        const input = e.target as HTMLInputElement
        const files = Array.from(input.files ?? [])
        if (files.length) uploadFiles(files, uploadTargetFolderId.value)
        input.value = '' // permet de re-sélectionner le même fichier
    }

    // --- Drag & drop ---
    function onDragEnter(e: DragEvent) {
        if (!e.dataTransfer?.types.includes('Files')) return
        dragCounter++
        isDragging.value = true
    }

    function onDragLeave() {
        dragCounter = Math.max(0, dragCounter - 1)
        if (dragCounter === 0) isDragging.value = false
    }

    function resetDrag() {
        dragCounter = 0
        isDragging.value = false
    }

    // Drop sur la zone centrale -> dossier courant
    function onDrop(e: DragEvent) {
        resetDrag()
        const files = Array.from(e.dataTransfer?.files ?? [])
        if (files.length) uploadFiles(files, currentFolderId.value)
    }

    // Drop sur une tuile de dossier -> ce dossier
    function onDropOnFolder(e: DragEvent, folder: FolderType) {
        resetDrag()
        const files = Array.from(e.dataTransfer?.files ?? [])
        if (files.length) uploadFiles(files, folder.id)
    }

    // --- Upload ---
    async function uploadFiles(files: File[], folderId: string | number | undefined) {
        const items = files.map(file => {
            const item: UploadItem = {
                id: ++uploadId,
                name: file.name,
                progress: 0,
                status: 'pending',
            }
            uploads.value.push(item)
            return { file, id: item.id }
        })

        for (const { file, id } of items) {
            // on repasse par le tableau réactif pour que l'UI se mette à jour
            const target = uploads.value.find(u => u.id === id)
            if (!target) continue

            const ext = file.name.split('.').pop()?.toLowerCase() ?? ''

            if (!ALLOWED_EXT.includes(ext)) {
                target.status = 'error'
                target.error = 'Type de fichier non autorisé'
                continue
            }
            if (file.size > MAX_SIZE) {
                target.status = 'error'
                target.error = `Fichier trop volumineux (max ${MAX_SIZE_MB} Mo)`
                continue
            }

            target.status = 'uploading'
            try {
                await documentService.uploadDocument(file, folderId, p => (target.progress = p))
                target.progress = 100
                target.status = 'done'
            } catch (err: any) {
                target.status = 'error'
                target.error =
                    err?.response?.data?.errors?.file?.[0] ??
                    err?.response?.data?.message ??
                    'Échec du téléversement'
            }
        }

        // Rafraîchit le dossier affiché (utile si on a uploadé dans le dossier courant)
        getFolderContents(currentFolderId.value)

        // Retire les uploads réussis après 3 s, garde les erreurs visibles
        setTimeout(() => {
            uploads.value = uploads.value.filter(u => u.status === 'error')
        }, 3000)
    }

    // ============================================================
    // ======================= DOSSIERS ===========================
    // ============================================================

    // Cherche le chemin (racine -> dossier courant) dans l'arbre déjà chargé (mainFolder)
    function findPath(
        tree: FolderType[] | undefined,
        id: string | number | undefined,
    ): FolderType[] {
        if (!tree || id === undefined) return []

        for (const node of tree) {
            if (node.id === id) return [node]

            if (node.children?.length) {
                const sub = findPath(node.children as FolderType[], id)
                if (sub.length) return [node, ...sub]
            }
        }

        return []
    }

    const breadcrumb = computed(() => findPath(mainFolder.value, currentFolderId.value))


    function openFolder(folder: FolderType | undefined) {
        selected_folder.value = folder
        selectedDocument.value = null
        currentFolderId.value = folder?.id

        getFolderContents(folder?.id)
    }

    function openDocument(document: DocumentType) {
        selectedDocument.value = document
        right_sidebar.value = true
    }

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

    function renameFolder() {
        documentService
            .renameFolder(data_rename.value.folder_id, data_rename.value.folder_name)
            .then(() => {
                modal.value.rename = false
                data_rename.value.folder_id = ''
                data_rename.value.folder_name = ''

                // Rafraîchit l'arbre et le contenu affiché pour refléter le nouveau nom
                getMainFolder()
                getFolderContents(currentFolderId.value)
            })
            .catch(err => {
                console.error(err)
            })
    }
    function createFolder() {
        loading_create_folder.value = true
        documentService.createFolder({
            'parent_id': data_create.value.folder_id,
            'name': data_create.value.folder_name,
        })
            .then(() => {
                data_create.value.folder_id = ''
                data_create.value.folder_name = ''
                modal.value.create = false
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
    function deleteFolder() {
        loading_delete_folder.value = true
        documentService.deleteFolder(contextMenu.value.folder?.id as string)
            .then(() => {
                contextMenu.value.folder = undefined
                modal.value.delete = false
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

    onMounted(() => {
        getMainFolder()
        getFolderContents(undefined)
    })
</script>