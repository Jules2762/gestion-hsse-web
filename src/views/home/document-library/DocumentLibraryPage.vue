<template>
    <div class="h-screen flex flex-col">

        <Header title="Bibliothèque documentaire" show-search :thumbnails="[
            {
                label: 'Tableau de bord',
                name: 'DASHBOARD'
            },
            {
                label: 'Document Library',
                name: 'DOCUMENT_LIBRARY'
            }
        ]" />

        <!-- TOOLBAR -->



        <!-- CONTENT -->

        <div class="
                flex-1
                bg-white
                
                flex flex-row
            ">

            <!-- LEFT TREE -->

            <div class="
                    w-60
                    min-w-60
                    border-r
                    select-none
                    border-gray-200
                    p-4
                    overflow-y-auto
                ">
                <div class="flex mb-4 flex-row items-center justify-between">
                    <h5 class="">
                        Dossiers
                    </h5>
                    <div class="flex flex-row items-center gap-x-2">
                        <button>
                            <FolderPlus :size="20" />
                        </button>
                        <button>
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
                        hover:bg-slate-100
                    " @click="openFolder(1)">
                    <FolderOpen :size="18" class="text-yellow-500" />

                Documents
                </button>

                <div class="
                        mt-2
                        ml-2
                        space-y-1
                    ">
                    <template v-for="folder in folders.filter(
                        item => item.parent_id === 1
                    )" :key="folder.id">
                        <button class="
                                w-full
                                flex
                                items-center
                                gap-2
                                rounded-lg
                                px-2
                                py-1.5
                                hover:bg-slate-100
                            " :class="currentFolderId === folder.id
                                ? 'bg-primary/10 text-primary'
                                : ''
                                " @click="openFolder(folder.id)">
                            <button @click.stop="toggleFolder(folder.id)">
                                <template v-if="getChildren(
                                    folder.id
                                ).length">
                                    <ChevronDown v-if="
                                        isExpanded(folder.id)
                                    " :size="14" />

                                    <ChevronRight v-else :size="14" />
                                </template>

                            </button>

                            <Folder :size="18" class="text-yellow-500" />

                            {{ folder.name }}
                        </button>

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
                                    hover:bg-slate-100
                                    text-sm
                                " @click="
                                    openFolder(
                                        child.id
                                    )
                                    ">
                                <FolderOpen :size="16" class="
                                        text-yellow-500
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
                " :class="right_sidebar&&!sidebar.isShow?'w-7/12':'w-10/12'">
                <!-- BREADCRUMB -->

                <div class="flex flex-row items-center justify-between">
                    <div class="
                        mb-6
                        flex
                        items-center
                        gap-2
                        text-sm
                        text-gray-500
                    ">
                        <button @click="openFolder(1)">
                            Documentation HSSE
                        </button>

                        <template v-for="item in breadcrumb" :key="item.id">
                            <span>/</span>

                            <button class="
                                text-primary
                                font-medium
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
                        <button class="flex flex-row items-center gap-x-3" @click="right_sidebar=!right_sidebar">
                            <PanelRight />
                            <span class="text-[14px]">Détails</span>
                        </button>
                    </div>
                </div>

                <!-- EXPLORER -->

                <div class="
                        grid
                        
                        gap-4
                    " :class="right_sidebar&&!sidebar.isShow?'grid-cols-5':'grid-cols-7'">
                    <div v-for="item in explorerItems" :key="item.data.id" class="
                            flex
                            flex-col
                            select-none
                            items-center
                            gap-3
                            p-3
                            rounded-xl
                            hover:bg-slate-100
                            cursor-pointer
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
                                text-yellow-500
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
                        text-gray-400
                        gap-4
                    ">
                    <FolderOpen :size="80" />

                    <span>
                        Ce dossier est vide
                    </span>
                </div>
            </div>

            <!-- RIGHT PREVIEW -->

            <div v-if="right_sidebar && !sidebar.isShow" :class="right_sidebar && !sidebar.isShow?'w-3/12':'w-0'" class="
                   transition-all
                    border-l
                    border-gray-200
                    p-4
                ">
                <template v-if="
                    selectedDocument
                ">
                    <h5 class="mb-5">
                        Détails
                    </h5>

                    <div class="
                            flex
                            flex-col
                            gap-4
                        ">
                        <div>
                            <span class="
                                    text-xs
                                    text-gray-500
                                ">
                                Nom
                            </span>

                            <p>
                                {{
                                    selectedDocument.name
                                }}
                            </p>
                        </div>

                        <div>
                            <span class="
                                    text-xs
                                    text-gray-500
                                ">
                                Nom original
                            </span>

                            <p>
                                {{
                                    selectedDocument.original_name
                                }}
                            </p>
                        </div>

                        <div>
                            <span class="
                                    text-xs
                                    text-gray-500
                                ">
                                Version
                            </span>

                            <p>
                                {{
                                    selectedDocument.version
                                }}
                            </p>
                        </div>

                        <div>
                            <span class="
                                    text-xs
                                    text-gray-500
                                ">
                                Taille
                            </span>

                            <p>
                                {{
                                    selectedDocument.size
                                }}
                            </p>
                        </div>

                        <div>
                            <span class="
                                    text-xs
                                    text-gray-500
                                ">
                                Type
                            </span>

                            <p>
                                {{
                                    selectedDocument.mime_type
                                }}
                            </p>
                        </div>

                        <div>
                            <span class="
                                    text-xs
                                    text-gray-500
                                ">
                                Créé le
                            </span>

                            <p>
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
                        text-gray-400
                    ">
                    Aucun document sélectionné
                </div>
            </div>

        </div>
    </div>
    <div v-if="contextMenu.isOpen" class="
        fixed
        z-99999
        
        overflow-hidden
        rounded-2xl
        border
        border-gray-200
        bg-white
        shadow-[0_20px_50px_rgba(0,0,0,.18)]
    " :style="{
        left: `${contextMenu.x}px`,
        top: `${contextMenu.y}px`,
    }">
        <!-- ACTIONS RAPIDES -->

        <div class="
            flex flex-col
            border-b
            border-gray-200
            p-4
            min-w-50
            
        ">
            <button class="
                flex
                
                items-center
                gap-2
                rounded-lg
                p-2
                hover:bg-slate-100
            ">
                <Copy :size="18" />

                <span class="text-[12px]">
                    Copier
                </span>
            </button>
            <button class="
                flex
                
                items-center
                gap-2
                rounded-lg
                p-2
                hover:bg-slate-100
            ">
                <Scissors :size="18" />

                <span class="text-[12px]">
                    Couper
                </span>
            </button>
            <button class="
                flex
               
                items-center
                gap-2
                rounded-lg
                p-2
                hover:bg-slate-100
            ">
                <Download :size="18" />

                <span class="text-[12px]">
                    Télécharger
                </span>
            </button>
            <button class="
                flex
              
                items-center
                gap-2
                rounded-lg
                p-2
                hover:bg-slate-100
            ">
                <Info :size="18" />

                <span class="text-[12px]">
                    Info
                </span>
            </button>
            <button class="
                flex
                
                items-center
                gap-2
                rounded-lg
                p-2
                hover:bg-slate-100
                text-red-600
            ">
                <Trash2 :size="18" />

                <span class="text-[12px]">
                    Supprimer
                </span>
            </button>
        </div>
    </div>

</template>
<script setup lang="ts">
import {
    FilePlus,
    FolderPlusIcon,
    PanelRight,
    Trash2Icon,
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
    Pencil,
    Share2,
    Trash2,

    Move,
    Download,
    Archive,
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

const sidebar = useSidebarStore()
const selected_explorer_item = ref<null | number>()
const right_sidebar = ref(false)

const folders =
    ref<FolderType[]>([
        ...FolderData,
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

onMounted(() => {
    window.addEventListener(
        'click',
        closeContextMenu,
    )
})

onUnmounted(() => {
    window.removeEventListener(
        'click',
        closeContextMenu,
    )
})
</script>