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

        <div class="flex-1 bg-surface flex flex-row">

            <!-- LEFT TREE -->

            <div class="w-60 min-w-60 border-r select-none border-border p-4 overflow-y-auto">
                <div class="flex mb-4 flex-row items-center justify-between">
                    <h5>{{ t('document library.folders') }}</h5>
                    <div class="flex flex-row items-center gap-x-1">
                        <button title="Nouveau dossier"
                            class="rounded-lg p-1.5 text-text-secondary transition-colors hover:bg-primary-light hover:text-primary">
                            <FolderPlus :size="20" />
                        </button>
                        <button title="Nouveau document"
                            class="rounded-lg p-1.5 text-text-secondary transition-colors hover:bg-primary-light hover:text-primary">
                            <FilePlus :size="20" />
                        </button>
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

                            <Folder :size="18" class="text-warning" />
                            {{ folder.name }}
                        </div>

                        <div v-if="isExpanded(folder.id)" class="ml-6 space-y-1">
                            <button v-for="child in folder.children" :key="child.id"
                                class="w-full flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-surface-alt text-sm"
                                :class="selected_folder?.id === child.id ? 'bg-primary/10 text-primary' : ''"
                                @click="openFolder(child)"
                                @contextmenu.prevent.stop="contextMenu.contextMenu = $event; contextMenu.isOpen = true; contextMenu.folder = child">
                                <FolderOpen :size="16" class="text-warning" />
                                {{ child.name }}
                            </button>
                        </div>
                    </template>
                </div>
            </div>

            <!-- CENTER -->

            <div class="transition-all p-4 overflow-y-auto"
                :class="right_sidebar && !sidebar.isShow ? 'w-7/12' : 'w-10/12'">

                <!-- BREADCRUMB -->

                <div class="flex flex-row items-center justify-between">
                    <div class="mb-6 flex items-center gap-2 text-sm text-text-secondary">
                        <button class="transition-colors hover:text-primary" @click="openFolder(undefined)">
                            Documentation HSSE
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
                        @click="openFolder(folder)"
                        @contextmenu.prevent.stop="contextMenu.contextMenu = $event; contextMenu.isOpen = true; contextMenu.folder = folder">
                        <FolderIcon :size="50" class="text-warning" />
                        <span class="text-xs text-center">{{ folder.name }}</span>
                    </div>

                    <!-- DOCUMENTS -->

                    <div v-for="document in folders.documents" :key="`document-${document.id}`"
                        class="flex flex-col select-none items-center gap-2 p-3 rounded-xl cursor-pointer transition-colors hover:bg-surface-alt"
                        :class="selectedDocument?.id === document.id ? 'bg-primary-light ring-1 ring-primary/30' : ''"
                        @click="openDocument(document)"
                        @contextmenu.prevent.stop="contextMenuDocument.contextMenu = $event; contextMenuDocument.isOpen = true; contextMenuDocument.document = document">
                        <FileTextIcon :size="50" class="text-primary" />
                        <span class="text-xs text-center">{{ document.name }}</span>
                    </div>
                </div>

                <div class="flex flex-col items-center justify-center h-96 text-text-muted gap-4"
                    v-if="folders.folders?.length == 0 && folders.documents?.length == 0">
                    <FolderOpen :size="80" />
                    <span>Ce dossier est vide</span>
                </div>
            </div>

            <!-- RIGHT PREVIEW -->

            <div v-if="right_sidebar && !sidebar.isShow" :class="right_sidebar && !sidebar.isShow ? 'w-3/12' : 'w-0'"
                class="transition-all border-l border-border p-4">
                <template v-if="selectedDocument">
                    <h5 class="mb-5">{{ t('details') }}</h5>

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
                            <p class="text-sm font-medium text-text-primary">{{ selectedDocument.size }}</p>
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
                            <p class="text-sm font-medium text-text-primary">{{ selectedDocument.created_at }}</p>
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
            :title-variant="'danger'" :confirm-variant="'danger'">
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
    } from '@lucide/vue'

    import Header from '../../../components/shared/Header.vue'
    import { computed, onMounted, ref } from 'vue'
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
        actions: [],
        bottom_actions: [],
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

    const folders = ref<FolderContentType>({
        folders: [],
        documents: [],
    })

    const selectedDocument = ref<DocumentType | null>(null)
    const selected_folder = ref<FolderType | undefined>(undefined)
    const currentFolderId = ref<string | number | undefined>(undefined)
    const expandedFolders = ref<(string | number)[]>([])
    const mainFolder = ref<FolderType[]>()

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

    onMounted(() => {
        getMainFolder()
        getFolderContents(undefined)
    })
</script>