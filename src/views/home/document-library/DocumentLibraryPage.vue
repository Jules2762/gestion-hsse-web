<template>
    <div class="h-screen flex flex-col">

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

        <!-- TOOLBAR -->



        <!-- CONTENT -->

        <div class="
                flex-1
                bg-surface
                
                flex flex-row
            ">

            <!-- LEFT TREE -->

            <div class="
                    w-60
                    min-w-60
                    border-r
                    select-none
                    border-border
                    p-4
                    overflow-y-auto
                ">
                <div class="flex mb-4 flex-row items-center justify-between">
                    <h5>
                        {{t('document library.folders')}}
                    </h5>
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

                <button class="
                        w-full
                        flex
                        items-center
                        gap-2
                        rounded-lg
                        px-2
                        py-1.5
                        transition-colors
                        hover:bg-surface-alt
                    " @click="openFolder(1)">
                    <FolderOpen :size="18" class="text-warning" />

                    Documents
                </button>

                <div class="
                        mt-2
                        ml-2
                        space-y-1
                    ">
                    <template v-for="folder in folders" :key="folder.id">
                        <div class="
                                w-full
                                flex
                                items-center
                                gap-2
                                rounded-lg
                                px-2
                                py-1.5
                                cursor-pointer
                                transition-colors
                                hover:bg-surface-alt
                            " :class="currentFolderId === folder.id
                                ? 'bg-primary/10 text-primary'
                                : ''
                                " @click="openFolder(folder.id)">
                            <button class="rounded p-0.5 transition-colors hover:bg-primary-light"
                                @click.stop="toggleFolder(folder.id)">
                                <template v-if="getChildren(
                                    folder.id
                                ).length">
                                    <ChevronDown v-if="
                                        isExpanded(folder.id)
                                    " :size="14" />

                                    <ChevronRight v-else :size="14" />
                                </template>

                            </button>

                            <Folder :size="18" class="text-warning" />

                            {{ folder.name }}
                        </div>

                        <div v-if="
                            isExpanded(folder.id)
                        " class="
                                ml-6
                                space-y-1
                            ">
                            <button v-for="
child in getChildren(
    folder.id
)
                                " :key="child.id" class="
                                    w-full
                                    flex
                                    items-center
                                    gap-2
                                    rounded-lg
                                    px-2
                                    py-1.5
                                    transition-colors
                                    hover:bg-surface-alt
                                    text-sm
                                " @click="
                                    openFolder(
                                        child.id
                                    )
                                    ">
                                <FolderOpen :size="16" class="
                                        text-warning
                                    " />

                                {{ child.name }}
                            </button>
                        </div>
                    </template>
                </div>
            </div>

            <!-- CENTER -->

            <div class="
                    transition-all
                    p-4
                    overflow-y-auto
                " :class="right_sidebar && !sidebar.isShow ? 'w-7/12' : 'w-10/12'">
                <!-- BREADCRUMB -->

                <div class="flex flex-row items-center justify-between">
                    <div class="
                        mb-6
                        flex
                        items-center
                        gap-2
                        text-sm
                        text-text-secondary
                    ">
                        <button class="transition-colors hover:text-primary" @click="openFolder(1)">
                            Documentation HSSE
                        </button>

                        <template v-for="item in breadcrumb" :key="item.id">
                            <span>/</span>

                            <button class="
                                text-primary
                                font-medium
                                transition-colors
                                hover:text-primary-dark
                            " @click="
                                openFolder(
                                    item.id
                                )
                                ">
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
                            <span>{{t("document library.details")}}</span>
                        </button>
                    </div>
                </div>

                <!-- EXPLORER -->

                <div class="
                        grid
                        gap-4
                    " :class="right_sidebar && !sidebar.isShow ? 'grid-cols-5' : 'grid-cols-7'">
                    <div v-for="item in explorerItems" :key="item.data.id" class="
                            flex
                            flex-col
                            select-none
                            items-center
                            gap-3
                            p-3
                            rounded-xl
                            cursor-pointer
                            transition-colors
                            hover:bg-surface-alt
                        " :class="item.type === 'document' && selectedDocument?.id === item.data.id
                                ? 'bg-primary-light ring-1 ring-primary/30'
                                : ''
                            " @dblclick="
                                item.type === 'folder'
                                    ? openFolder(
                                        item.data.id
                                    )
                                    : openDocument(
                                        item.data as DocumentType
                                    )
                                " @click="
                                item.type ===
                                    'document'
                                    ? openDocument(
                                        item.data as DocumentType
                                    )
                                    : null;
                            " @contextmenu="
                                openContextMenu(
                                    $event,
                                    item.data,
                                    item.type as 'folder' | 'document',
                                )
                                ">
                        <Folder v-if="
                            item.type ===
                            'folder'
                        " :size="70" class="
                                text-warning
                            " />

                        <FileTextIcon v-else :size="70" class="
                                text-primary
                            " />

                        <span class="
                                text-center
                                text-sm
                            ">
                            {{ item.data.name }}
                        </span>
                    </div>
                </div>

                <div v-if="
                    !explorerItems.length
                " class="
                        flex
                        flex-col
                        items-center
                        justify-center
                        h-96
                        text-text-muted
                        gap-4
                    ">
                    <FolderOpen :size="80" />

                    <span>
                        Ce dossier est vide
                    </span>
                </div>
            </div>

            <!-- RIGHT PREVIEW -->

            <div v-if="right_sidebar && !sidebar.isShow" :class="right_sidebar && !sidebar.isShow ? 'w-3/12' : 'w-0'" class="
                   transition-all
                    border-l
                    border-border
                    p-4
                ">
                <template v-if="
                    selectedDocument
                ">
                    <h5 class="mb-5">
                        {{t('details')}}
                    </h5>

                    <div class="
                            flex
                            flex-col
                            gap-4
                        ">
                        <div>
                            <span class="
                                    mb-1
                                    block
                                    text-xs
                                    font-semibold
                                    uppercase
                                    tracking-wide
                                    text-text-secondary
                                ">
                                {{t('document library.name')}}
                            </span>

                            <p class="text-sm font-medium text-text-primary">
                                {{
                                    selectedDocument.name
                                }}
                            </p>
                        </div>

                        <div>
                            <span class="
                                    mb-1
                                    block
                                    text-xs
                                    font-semibold
                                    uppercase
                                    tracking-wide
                                    text-text-secondary
                                ">
                                {{t('document library.original name')}}
                            </span>

                            <p class="text-sm font-medium text-text-primary">
                                {{
                                    selectedDocument.original_name
                                }}
                            </p>
                        </div>

                        <div>
                            <span class="
                                    mb-1
                                    block
                                    text-xs
                                    font-semibold
                                    uppercase
                                    tracking-wide
                                    text-text-secondary
                                ">
                                Version
                            </span>

                            <p class="text-sm font-medium text-text-primary">
                                {{
                                    selectedDocument.version
                                }}
                            </p>
                        </div>

                        <div>
                            <span class="
                                    mb-1
                                    block
                                    text-xs
                                    font-semibold
                                    uppercase
                                    tracking-wide
                                    text-text-secondary
                                ">
                                Taille
                            </span>

                            <p class="text-sm font-medium text-text-primary">
                                {{
                                    selectedDocument.size
                                }}
                            </p>
                        </div>

                        <div>
                            <span class="
                                    mb-1
                                    block
                                    text-xs
                                    font-semibold
                                    uppercase
                                    tracking-wide
                                    text-text-secondary
                                ">
                                Type
                            </span>

                            <p class="text-sm font-medium text-text-primary">
                                {{
                                    selectedDocument.mime_type
                                }}
                            </p>
                        </div>

                        <div>
                            <span class="
                                    mb-1
                                    block
                                    text-xs
                                    font-semibold
                                    uppercase
                                    tracking-wide
                                    text-text-secondary
                                ">
                                Créé le
                            </span>

                            <p class="text-sm font-medium text-text-primary">
                                {{
                                    selectedDocument.created_at
                                }}
                            </p>
                        </div>
                    </div>
                </template>

                <div v-else class="
                        h-full
                        flex
                        items-center
                        justify-center
                        text-text-muted
                    ">
                    {{t('document library.no file selected')}}
                </div>
            </div>

        </div>
    </div>
    <div v-if="contextMenu.isOpen" class="
        fixed
        z-9999
        overflow-hidden
        rounded-xl
        border
        border-border
        bg-surface
        shadow-[0_20px_50px_rgba(0,0,0,.18)]
    " :style="{
        left: `${contextMenu.x}px`,
        top: `${contextMenu.y}px`,
    }">
        <!-- ACTIONS RAPIDES -->

        <div class="
            flex flex-col
            border-b
            border-border
            p-2
            min-w-56
        ">
            <button class="
                flex
                items-center
                gap-2
                rounded-lg
                p-2
                text-text-primary
                transition-colors
                hover:bg-surface-alt
            ">
                <Copy :size="18" />

                <span class="text-sm">
                    Copier
                </span>
            </button>
            <button class="
                flex
                items-center
                gap-2
                rounded-lg
                p-2
                text-text-primary
                transition-colors
                hover:bg-surface-alt
            ">
                <Scissors :size="18" />

                <span class="text-sm">
                    Couper
                </span>
            </button>
            <button class="
                flex
                items-center
                gap-2
                rounded-lg
                p-2
                text-text-primary
                transition-colors
                hover:bg-surface-alt
            ">
                <Download :size="18" />

                <span class="text-sm">
                    Télécharger
                </span>
            </button>
            <button class="
                flex
                items-center
                gap-2
                rounded-lg
                p-2
                text-text-primary
                transition-colors
                hover:bg-surface-alt
            ">
                <Info :size="18" />

                <span class="text-sm">
                    Info
                </span>
            </button>
        </div>

        <!-- ACTION DESTRUCTIVE -->

        <div class="p-2">
            <button class="
                flex
                w-full
                items-center
                gap-2
                rounded-lg
                p-2
                text-danger
                transition-colors
                hover:bg-danger/10
            ">
                <Trash2 :size="18" />

                <span class="text-sm">
                    Supprimer
                </span>
            </button>
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
    } from '@lucide/vue'
    import {
        Scissors,
        Copy,
        Trash2,
        Download,
        Info,

    } from '@lucide/vue'




    import Header from '../../../components/shared/Header.vue'

    import { computed, onMounted, onUnmounted, ref } from 'vue'

    import { useSidebarStore } from '../../../services/useSidebarStore..ts'

    import {
        DocumentData,
        FolderData,
    } from '../../../@data/DocumentLibrary.data.ts'

    import type {
        DocumentType,
        FolderType,
    } from '../../../@types/documentLibrary.type.ts'
import { useI18n } from 'vue-i18n'
import documentService from '../../../core/services/document.service.ts'

    const {t}=useI18n()
    const sidebar = useSidebarStore()
    const selected_explorer_item = ref<null | number>()
    const right_sidebar = ref(false)

    const folders =
        ref<FolderType[]>([
            
        ])

    const documents =
        ref<DocumentType[]>([
            ...DocumentData,
        ])

    const selectedDocument =
        ref<DocumentType | null>(
            null,
        )

    const currentFolderId =
        ref<
            string | number | null
        >(1)

    const expandedFolders = ref<
        (string | number)[]
    >([1])

    const currentFolder = computed(
        () =>
            folders.value.find(
                folder =>
                    folder.id ===
                    currentFolderId.value,
            ),
    )

    const currentFolders = computed(
        () =>
            folders.value.filter(
                folder =>
                    folder.parent_id ===
                    currentFolderId.value,
            ),
    )

    const currentDocuments =
        computed(() =>
            documents.value.filter(
                document =>
                    document.folder_id ===
                    currentFolderId.value,
            ),
        )

    const explorerItems = computed(
        () => [
            ...currentFolders.value.map(
                folder => ({
                    type: 'folder',
                    data: folder,
                }),
            ),

            ...currentDocuments.value.map(
                document => ({
                    type: 'document',
                    data: document,
                }),
            ),
        ],
    )

    const breadcrumb = computed(
        () => {
            const path:
                FolderType[] = []

            let current =
                folders.value.find(
                    folder =>
                        folder.id ===
                        currentFolderId.value,
                )

            while (current) {
                path.unshift(
                    current,
                )

                current =
                    folders.value.find(
                        folder =>
                            folder.id ===
                            current?.parent_id,
                    )
            }

            return path
        },
    )

    function getChildren(
        parentId:
            | string
            | number
            | undefined,
    ) {
        return folders.value.filter(
            folder =>
                folder.parent_id ===
                parentId,
        )
    }

    function openFolder(
        id:
            | string
            | number,
    ) {
        currentFolderId.value =
            id

        selectedDocument.value =
            null
    }

    function openDocument(
        document: DocumentType,
    ) {
        selectedDocument.value =
            document

        right_sidebar.value = true
    }

    function isExpanded(
        id:
            | string
            | number,
    ) {
        return expandedFolders.value.includes(
            id,
        )
    }

    function toggleFolder(
        id:
            | string
            | number,
    ) {
        if (
            expandedFolders.value.includes(
                id,
            )
        ) {
            expandedFolders.value =
                expandedFolders.value.filter(
                    item =>
                        item !==
                        id,
                )
        } else {
            expandedFolders.value.push(
                id,
            )
        }
    }

    function getRootFolders() {
        return folders.value.filter(
            folder =>
                !folder.parent_id,
        )
    }

    const contextMenu = ref({
        isOpen: false,

        x: 0,

        y: 0,

        item: null as
            | DocumentType
            | FolderType
            | null,

        type: null as
            | 'folder'
            | 'document'
            | null,
    })
    function openContextMenu(
        event: MouseEvent,
        item: FolderType | DocumentType,
        type: 'folder' | 'document',
    ) {
        event.preventDefault()

        contextMenu.value = {
            isOpen: true,

            x: event.clientX,

            y: event.clientY,

            item,

            type,
        }
    }
    function closeContextMenu() {
        contextMenu.value.isOpen = false
    }

    function fetchFolders(){
        documentService.index()
        .then(res=>{
            console.log(res.data)
            folders.value=res.data.children
        })
        .catch(err=>{
            console.error(err)
        })
    }

    onMounted(() => {
        window.addEventListener(
            'click',
            closeContextMenu,
        )
        fetchFolders()
    })

    onUnmounted(() => {
        window.removeEventListener(
            'click',
            closeContextMenu,
        )
    })
</script>