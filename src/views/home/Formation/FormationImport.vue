<script setup lang="ts">
import {
    UploadCloud,
    FileText,
    X,
    CheckCircle2,
    CloudDownload,
} from '@lucide/vue'

import { computed, ref } from 'vue'
import Header from '../../../components/shared/Header.vue'
import { router } from '../../../router'
import type { routes } from '../../../router/routes'
import Button from '../../../components/ui/Button.vue'

const dragOver = ref(false)

const selectedFile = ref<File | null>(
    null,
)

const uploadProgress = ref(0)

const isUploading = ref(false)

const fileSize = computed(() => {
    if (!selectedFile.value)
        return ''

    const size =
        selectedFile.value.size

    if (
        size >
        1024 * 1024
    ) {
        return `${(
            size /
            1024 /
            1024
        ).toFixed(2)} MB`
    }

    return `${(
        size / 1024
    ).toFixed(2)} KB`
})

function onDrop(
    event: DragEvent,
) {
    dragOver.value = false

    const file =
        event.dataTransfer
            ?.files?.[0]

    if (!file) return

    setFile(file)
}

function onFileChange(
    event: Event,
) {
    const file = (
        event.target as HTMLInputElement
    ).files?.[0]

    if (!file) return

    setFile(file)
}

function setFile(
    file: File,
) {
    selectedFile.value = file

    simulateUpload()
}

function simulateUpload() {
    uploadProgress.value = 0

    isUploading.value = true

    const interval =
        setInterval(() => {
            uploadProgress.value += 10

            if (
                uploadProgress.value >=
                100
            ) {
                uploadProgress.value =
                    100

                isUploading.value =
                    false

                clearInterval(
                    interval,
                )
            }
        }, 100)
}

function removeFile() {
    selectedFile.value = null

    uploadProgress.value = 0

    isUploading.value = false
}
</script>

<template>
    <div class="
            mx-auto
            flex
            flex-col
        ">
        <!-- HEADER -->
        <Header title="Import Formation"  :thumbnails="[
            {
                'label':'Tableau de bord',
                'name':'DASHBOARD'
            },
            {
                'label':'Formation',
                'name':'FORMATION'
            },
            {
                'label':'Import',
                'name':'FORMATION_IMPORT'
            },
        ]"/>


        <div class="p-4 flex flex-col gap-4 items-center">
            <p class="
                    mt-1
                    text-sm
                    text-gray-500
                ">
                Importez une fiche
                de présence ou un
                document de
                formation.
            </p>


            <!-- DROP ZONE -->

            <div class=" bg-white w-200
                rounded-2xl
                border-2
                border-dashed
                p-10
                transition-all
            " :class="dragOver
                ? 'border-primary bg-primary/5'
                : 'border-gray-300'
                " @dragover.prevent="
                    dragOver = true
                    " @dragleave="
                    dragOver = false
                    " @drop.prevent="
                    onDrop($event)
                    ">
                <div class="
                    flex
                    flex-col
                    items-center
                    gap-4
                ">
                    <UploadCloud :size="60" class="
                        text-primary
                    " />

                    <div class="
                        text-center
                    ">
                        <h5>
                            Déposer un
                            fichier ici
                        </h5>

                        <p class="
                            text-sm
                            text-gray-500
                        ">
                            PDF, DOCX,
                            XLSX, CSV
                        </p>
                    </div>

                    <label class="
                        cursor-pointer
                        rounded-xl
                        bg-primary
                        px-4
                        py-2
                        
                        text-white
                    ">
                        Parcourir

                        <input hidden type="file" accept="
                            .pdf,
                            .docx,
                            .xlsx,
                            .csv
                        " @change="
                            onFileChange
                        " />
                    </label>
                </div>
            </div>

            <!-- FILE INFO -->

            <div v-if="selectedFile" class="
                rounded-2xl
                border
                border-gray-200
                bg-white
                w-200
                p-5
            ">
                <div class="
                    flex
                    items-start
                    justify-between
                ">
                    <div class="
                        flex
                        gap-4
                    ">
                        <FileText :size="40" class="
                            text-primary
                        " />

                        <div>
                            <h5>
                                {{
                                    selectedFile.name
                                }}
                            </h5>

                            <p class="
                                text-sm
                                text-gray-500
                            ">
                                {{
                                    fileSize
                                }}
                            </p>
                        </div>
                    </div>

                    <button class="
                        rounded-lg
                        p-2
                        hover:bg-red-50
                    " @click="
                        removeFile
                    ">
                        <X class="
                            text-red-500
                        " />
                    </button>
                </div>

                <!-- PROGRESS -->

                <div class="
                    mt-5
                ">
                    <div class="
                        h-2
                        overflow-hidden
                        rounded-full
                        bg-gray-100
                    ">
                        <div class="
                            h-full
                            bg-primary
                            transition-all
                        " :style="{
                            width: `${uploadProgress}%`,
                        }" />
                    </div>

                    <div class="
                        mt-2
                        flex
                        items-center
                        justify-between
                        text-sm
                    ">
                        <span>
                            {{
                                uploadProgress
                            }}%
                        </span>

                        <span v-if="
                            isUploading
                        ">
                            Import en
                            cours...
                        </span>

                        <span v-else class="
                            flex
                            items-center
                            gap-1
                            text-green-600
                        ">
                            <CheckCircle2 :size="16" />

                            Prêt à être
                            importé
                        </span>
                    </div>
                </div>
            </div>

            <!-- ACTIONS -->

            <div class="
                flex
                justify-end
                gap-3 w-200
            ">
                <Button :variant="'outline'" @click="router.back()">
                    Annuler
                </button>

                <Button :left-icon="CloudDownload" :disabled="!selectedFile
                    ">
                    Importer
                </button>
            </div>
        </div>
    </div>
</template>