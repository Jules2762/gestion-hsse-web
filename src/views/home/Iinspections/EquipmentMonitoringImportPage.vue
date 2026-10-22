<template>
    <div class="min-h-screen bg-white">
        <Header title="inspections.equipment-monitoring.title" :thumbnails="[
            { label: 'thumbnails.home', name: 'DASHBOARD' },
            { label: 'thumbnails.inspections', name: 'INSPECTION' },
            { label: 'thumbnails.equipment-monitoring', name: 'EQUIPMENT_MONITORING' },
            { label: 'thumbnails.import', name: 'EQUIPMENT_MONITORING_IMPORT' }
        ]" />
        <div class="p-6 lg:p-8">

        <div class="mx-auto max-w-7xl">

            <!-- ========================================================= -->
            <!-- HEADER + ETAPES -->
            <!-- ========================================================= -->

            <div class="mb-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">

                <div class="max-w-xl">
                    <h1 class="text-2xl font-semibold text-text-primary">
                        {{ locale === 'en' ? 'Import equipment monitoring' : 'Importer le suivi matériel' }}
                    </h1>
                    <p class="mt-1.5 text-sm text-text-secondary">
                        {{ locale === 'en' ? 'Upload your Excel file, verify data, then launch import.' : "Chargez votre fichier Excel, contrôlez les données, puis lancez l'importation." }}
                    </p>
                </div>

                <ol class="flex items-center" :aria-label="locale === 'en' ? 'Import progress' : 'Progression de l\'importation'">
                    <template v-for="(step, i) in [
                        { n: 1, label: locale === 'en' ? 'File' : 'Fichier', state: hasFile ? 'done' : 'active' },
                        { n: 2, label: locale === 'en' ? 'Preview' : 'Prévisualisation', state: canImport ? 'done' : hasFile ? 'active' : 'todo' },
                        { n: 3, label: locale === 'en' ? 'Import' : 'Importation', state: canImport ? 'active' : 'todo' }
                    ]" :key="step.n">

                        <li class="flex items-center gap-2.5"
                            :aria-current="step.state === 'active' ? 'step' : undefined">
                            <span
                                class="flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold transition-colors"
                                :class="step.state === 'done'
                                    ? 'bg-primary text-white'
                                    : step.state === 'active'
                                        ? 'bg-primary-light text-primary ring-2 ring-primary'
                                        : 'bg-surface-alt text-text-muted'">
                                {{ step.state === 'done' ? '✓' : step.n }}
                            </span>
                            <span class="hidden text-sm font-medium sm:block"
                                :class="step.state === 'todo' ? 'text-text-muted' : 'text-text-primary'">
                                {{ step.label }}
                            </span>
                        </li>

                        <li v-if="i < 2" aria-hidden="true" class="mx-3 h-0.5 w-8 rounded transition-colors sm:w-14"
                            :class="step.state === 'done' ? 'bg-primary' : 'bg-border'" />

                    </template>
                </ol>

            </div>


            <!-- ========================================================= -->
            <!-- UPLOAD -->
            <!-- ========================================================= -->

            <template v-if="!hasFile">

                <div class="grid gap-6 lg:grid-cols-3">

                    <!-- Zone de dépôt : l'input recouvre toute la zone (clic + glisser-déposer natifs) -->

                    <div
                        class="group relative flex min-h-96 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-primary/30 bg-surface px-6 py-14 text-center transition-all duration-200 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/30 hover:border-primary hover:bg-primary-light/40 lg:col-span-2">

                        <div class="flex flex-col items-center">

                            <div class="relative mb-6">
                                <div
                                    class="flex h-20 w-20 items-center justify-center rounded-2xl bg-white shadow-md ring-1 ring-border transition-transform duration-200 group-hover:-translate-y-1">
                                    <FileSpreadsheet class="h-10 w-10 text-success" />
                                </div>
                                <div
                                    class="absolute -bottom-2 -right-2 flex h-9 w-9 items-center justify-center rounded-full bg-primary text-white shadow-md ring-4 ring-white">
                                    <Upload class="h-4 w-4" />
                                </div>
                            </div>

                            <h2 class="text-lg font-semibold text-text-primary">
                                {{ locale === 'en' ? 'Drag and drop your Excel file here' : 'Glissez votre fichier Excel ici' }}
                            </h2>

                            <p class="mt-1.5 max-w-sm text-sm text-text-secondary">
                                ou sélectionnez-le depuis votre ordinateur. Le fichier est lu dans votre navigateur,
                                rien n'est enregistré avant la dernière étape.
                            </p>

                            <span
                                class="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors group-hover:bg-primary-dark">
                                <Upload class="h-4 w-4" />
                                {{ locale === 'en' ? 'Choose a file' : 'Choisir un fichier' }}
                            </span>

                            <div class="mt-6 flex items-center gap-2 text-xs text-text-muted">
                                <span>{{ locale === 'en' ? 'Accepted formats' : 'Formats acceptés' }}</span>
                                <span v-for="ext in ['XLSX', 'XLS', 'CSV']" :key="ext"
                                    class="rounded-md bg-surface-alt px-2 py-0.5 font-medium text-text-secondary">
                                    {{ ext }}
                                </span>
                            </div>

                        </div>

                        <input ref="fileInput" type="file" title="" aria-label="Choisir un fichier Excel"
                            class="absolute inset-0 h-full w-full cursor-pointer opacity-0" accept=".xlsx,.xls,.csv"
                            @change="handleFile" />

                    </div>


                    <!-- Colonne d'aide -->

                    <aside class="flex flex-col gap-4">

                        <div class="rounded-2xl border border-border bg-surface p-5">
                            <h2 class="text-base font-semibold text-text-primary">
                                {{ locale === 'en' ? 'No file yet?' : 'Pas encore de fichier ?' }}
                            </h2>
                            <p class="mt-1.5 text-sm text-text-secondary">
                                {{ locale === 'en' ? 'The template contains valid headers, a sample row and instructions.' : "Le modèle contient les bons en-têtes, une ligne d'exemple et une feuille d'instructions." }}
                            </p>
                            <button type="button" @click="downloadTemplate"
                                class="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-primary/30 bg-white px-4 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-primary-light">
                                <Download class="h-4 w-4" />
                                {{ locale === 'en' ? 'Download template' : 'Télécharger le modèle' }}
                            </button>
                        </div>

                        <div class="rounded-2xl border border-border bg-surface p-5">
                            <h3 class="text-sm font-semibold text-text-primary">{{ locale === 'en' ? 'Before importing' : "Avant d'importer" }}</h3>
                            <ul class="mt-3 space-y-3 text-sm text-text-secondary">
                                <li class="flex gap-2.5">
                                    <span class="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary"></span>
                                    <span>Seule la première feuille du classeur est lue.</span>
                                </li>
                                <li class="flex gap-2.5">
                                    <span class="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary"></span>
                                    <span>Une ligne correspond au relevé d'un site (SS) pour une date.</span>
                                </li>
                                <li class="flex gap-2.5">
                                    <span class="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary"></span>
                                    <span>Date au format AAAA-MM-JJ ou JJ/MM/AAAA.</span>
                                </li>
                                <li class="flex gap-2.5">
                                    <span class="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary"></span>
                                    <span>Colonnes Oui/Non : Oui, Non, 1, 0, True ou False.</span>
                                </li>
                            </ul>
                        </div>

                    </aside>

                </div>


                <!-- Structure attendue (même code couleur que le modèle Excel) -->

                <div class="mt-6 rounded-2xl border border-border bg-surface p-5">

                    <div class="flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <h2 class="text-base font-semibold text-text-primary">{{ locale === 'en' ? 'Expected structure' : 'Structure attendue' }}</h2>
                            <p class="mt-0.5 text-sm text-text-secondary">
                                {{ locale === 'en' ? 'First row headers must match these names exactly.' : 'Les en-têtes de la première ligne doivent porter exactement ces noms.' }}
                            </p>
                        </div>
                        <div class="flex items-center gap-4 text-xs text-text-secondary">
                            <span class="flex items-center gap-1.5">
                                <span class="h-3 w-3 rounded-sm bg-primary"></span>{{ locale === 'en' ? 'Required' : 'Obligatoire' }}
                            </span>
                            <span class="flex items-center gap-1.5">
                                <span class="h-3 w-3 rounded-sm bg-accent-dark"></span>{{ locale === 'en' ? 'Optional' : 'Optionnel' }}
                            </span>
                        </div>
                    </div>

                    <div class="mt-5 space-y-5">
                        <div v-for="group in [
                            { label: 'Identification', fields: importFields.filter(f => f.type === 'string' || f.type === 'date') },
                            { label: 'Quantités', fields: importFields.filter(f => f.type === 'number') },
                            { label: 'Conformité (Oui / Non)', fields: importFields.filter(f => f.type === 'boolean') }
                        ]" :key="group.label">

                            <p class="mb-2 text-sm font-medium text-text-primary">
                                {{ group.label }}
                                <span class="ml-1 text-xs font-normal text-text-muted">
                                    {{ group.fields.length }} colonne(s)
                                </span>
                            </p>

                            <div class="flex flex-wrap gap-2">
                                <span v-for="field in group.fields" :key="field.key"
                                    class="rounded-lg px-2.5 py-1.5 text-xs font-semibold text-white"
                                    :class="field.required ? 'bg-primary' : 'bg-accent-dark'">
                                    {{ field.excelName }}
                                </span>
                            </div>

                        </div>
                    </div>

                </div>

            </template>


            <!-- ========================================================= -->
            <!-- INFORMATIONS FICHIER + ACTIONS -->
            <!-- ========================================================= -->

            <div v-if="hasFile"
                class="sticky top-4 z-10 mb-6 rounded-2xl border border-border bg-surface p-5 shadow-sm">

                <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                    <div class="flex min-w-0 items-center gap-4">

                        <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-light">
                            <FileSpreadsheet class="h-6 w-6 text-success" />
                        </div>

                        <div class="min-w-0">
                            <p class="truncate font-semibold text-text-primary">{{ fileName }}</p>

                            <div class="mt-1.5 flex flex-wrap items-center gap-2 text-xs">
                                <span class="rounded-md bg-surface-alt px-2 py-0.5 text-text-secondary">
                                    {{ formatFileSize(fileSize) }}
                                </span>
                                <span class="rounded-md bg-surface-alt px-2 py-0.5 text-text-secondary">
                                    {{ rows.length }} {{ locale === 'en' ? 'row(s)' : 'ligne(s)' }}
                                </span>
                                <span class="rounded-md bg-surface-alt px-2 py-0.5 text-text-secondary">
                                    {{ headers.length }} {{ locale === 'en' ? 'column(s)' : 'colonne(s)' }}
                                </span>

                                <span v-if="canImport"
                                    class="inline-flex items-center gap-1 rounded-full bg-success/10 px-2.5 py-0.5 font-semibold text-success">
                                    <CheckCircle2 class="h-3.5 w-3.5" /> {{ locale === 'en' ? 'Ready to import' : 'Prêt à importer' }}
                                </span>
                                <span v-else-if="missingColumns.length"
                                    class="inline-flex items-center gap-1 rounded-full bg-danger/10 px-2.5 py-0.5 font-semibold text-danger">
                                    <CircleAlert class="h-3.5 w-3.5" /> {{ missingColumns.length }} colonne(s)
                                    manquante(s)
                                </span>
                                <span v-else
                                    class="inline-flex items-center gap-1 rounded-full bg-warning/10 px-2.5 py-0.5 font-semibold text-warning">
                                    <CircleAlert class="h-3.5 w-3.5" /> {{ validationErrors.length }} erreur(s) à
                                    corriger
                                </span>
                            </div>
                        </div>

                    </div>

                    <div class="flex flex-wrap items-center gap-2">

                        <button type="button" @click="downloadTemplate"
                            class="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary-light">
                            <Download class="h-4 w-4" />
                            {{ locale === 'en' ? 'Template' : 'Modèle' }}
                        </button>

                        <button type="button" @click="removeFile()"
                            class="inline-flex items-center gap-2 rounded-xl border border-danger/30 px-3 py-2 text-sm font-semibold text-danger transition-colors hover:bg-danger/10">
                            <Trash2 class="h-4 w-4" />
                            {{ locale === 'en' ? 'Delete' : 'Supprimer' }}
                        </button>

                        <button type="button" :disabled="!canImport || loading_import" @click="prepareImport"
                            class="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold shadow-sm transition-all duration-200"
                            :class="!canImport || loading_import
                                ? 'cursor-not-allowed bg-surface-alt text-text-muted'
                                : 'bg-linear-to-r from-success to-primary-dark text-white hover:-translate-y-0.5 hover:shadow-md'">
                            <Upload class="h-4 w-4" v-if="loading_import == false" />
                            <Loader class="h-4 w-4 animate-spin" v-else />
                            {{ locale === 'en' ? 'Prepare import' : "Préparer l'importation" }}
                        </button>

                    </div>

                </div>

            </div>


            <!-- ========================================================= -->
            <!-- ERREUR GLOBALE -->
            <!-- ========================================================= -->

            <div v-if="globalError" role="alert"
                class="mb-6 flex items-start gap-3 rounded-xl border border-danger/30 bg-danger/10 p-4 text-sm text-danger">
                <CircleAlert class="mt-0.5 h-5 w-5 shrink-0" />
                <div>
                    <p class="font-semibold">Erreur d'importation</p>
                    <p class="mt-1">{{ globalError }}</p>
                </div>
            </div>


            <!-- ========================================================= -->
            <!-- VERIFICATION DES COLONNES -->
            <!-- ========================================================= -->

            <div v-if="hasFile" class="mb-6 rounded-2xl border border-border bg-surface p-5">

                <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h2 class="text-base font-semibold text-text-primary">{{ locale === 'en' ? 'Column verification' : 'Vérification des colonnes' }}</h2>
                        <p class="mt-1 text-sm text-text-secondary">
                            {{ locale === 'en' ? 'Verify that your file structure matches the expected template.' : 'Vérifiez que la structure de votre fichier correspond au modèle attendu.' }}
                        </p>
                    </div>

                    <div class="inline-flex rounded-full px-3 py-1 text-xs font-semibold" :class="missingColumns.length === 0
                        ? 'bg-primary-light text-primary ring-1 ring-primary/20'
                        : 'bg-danger/10 text-danger ring-1 ring-danger/20'">
                        {{ missingColumns.length === 0 ? (locale === 'en' ? 'Valid structure' : 'Structure valide') : `${missingColumns.length} ${locale === 'en' ? 'missing column(s)' : 'colonne(s) manquante(s)'}` }}
                    </div>
                </div>

                <div class="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    <div v-for="field in importFields" :key="field.key"
                        class="flex items-center justify-between gap-2 rounded-lg border p-3" :class="columnMapping[field.key]
                            ? 'border-success/30 bg-primary-light/60'
                            : field.required ? 'border-danger/30 bg-danger/10' : 'border-border bg-surface-alt'">
                        <div class="min-w-0">
                            <p class="truncate text-sm font-medium text-text-primary">{{ field.excelName }}</p>
                            <p class="mt-0.5 text-xs text-text-muted">
                                {{ columnMapping[field.key] ? 'Trouvée' : field.required ? 'Obligatoire, introuvable' :
                                'Optionnelle, absente' }}
                            </p>
                        </div>

                        <CheckCircle2 v-if="columnMapping[field.key]" class="h-5 w-5 shrink-0 text-success" />
                        <CircleAlert v-else-if="field.required" class="h-5 w-5 shrink-0 text-danger" />
                        <Circle v-else class="h-5 w-5 shrink-0 text-text-muted" />
                    </div>
                </div>

                <div v-if="missingColumns.length" class="mt-5 rounded-lg border border-danger/30 bg-danger/10 p-4">
                    <p class="text-sm font-semibold text-danger">Colonnes obligatoires manquantes :</p>
                    <div class="mt-2 flex flex-wrap gap-2">
                        <span v-for="column in missingColumns" :key="column"
                            class="rounded-full bg-surface px-3 py-1 text-xs font-medium text-danger">
                            {{ column }}
                        </span>
                    </div>
                </div>

            </div>


            <!-- ========================================================= -->
            <!-- PREVIEW -->
            <!-- ========================================================= -->

            <div v-if="hasFile" class="preview-panel overflow-hidden rounded-2xl border border-border bg-surface">

                <div
                    class="flex flex-col gap-3 border-b border-border bg-surface-alt/80 p-5 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h2 class="text-base font-semibold text-text-primary">{{ locale === 'en' ? 'Data preview' : 'Prévisualisation des données' }}</h2>
                        <p class="mt-1 text-sm text-text-secondary">
                            {{ locale === 'en' ? 'Here is the data that will be prepared for import.' : "Voici les données qui seront préparées pour l'importation." }}
                        </p>
                    </div>

                    <div
                        class="inline-flex items-center gap-2 rounded-xl bg-accent-dark/5 px-3 py-2 text-xs font-semibold text-accent-dark ring-1 ring-accent-dark/10">
                        <Eye class="h-4 w-4" />
                        {{ previewRows.length }} {{ locale === 'en' ? 'row(s) displayed' : 'ligne(s) affichée(s)' }}
                    </div>
                </div>

                <div class="overflow-x-auto">
                    <table class="w-full min-w-max border-collapse">

                        <thead>
                            <tr>
                                <th>#</th>
                                <th v-for="field in importFields" :key="field.key">{{ field.label }}</th>
                            </tr>
                        </thead>

                        <tbody>
                            <tr v-for="(row, rowIndex) in previewRows" :key="rowIndex"
                                class="border-b border-border transition hover:bg-surface-alt">

                                <td
                                    class="sticky left-0 z-1 border-r border-border bg-surface px-4 py-3 text-xs font-medium text-text-secondary">
                                    {{ rowIndex + 1 }}
                                </td>

                                <td v-for="field in importFields" :key="field.key"
                                    class="whitespace-nowrap px-4 py-3 text-sm text-text-secondary">

                                    <template v-if="field.key === 'site_name'">
                                        <span
                                            class="inline-flex rounded-md bg-accent-dark/5 px-2 py-1 font-medium text-accent-dark">
                                            {{ getDisplayValue(row, field) }}
                                        </span>
                                    </template>

                                    <template v-else-if="field.type === 'date'">
                                        <span
                                            class="inline-flex rounded-md bg-accent-medium/10 px-2 py-1 font-medium text-accent-dark">
                                            {{ getDisplayValue(row, field) }}
                                        </span>
                                    </template>

                                    <template v-else-if="field.type === 'boolean'">
                                        <span
                                            class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
                                            :class="parseBoolean(getRawValue(row, field))
                                                ? 'bg-success/10 text-success'
                                                : 'bg-surface-alt text-text-secondary'">
                                            <Check v-if="parseBoolean(getRawValue(row, field))" class="h-3.5 w-3.5" />
                                            <X v-else class="h-3.5 w-3.5" />
                                            {{ parseBoolean(getRawValue(row, field)) ? (locale === 'en' ? 'Yes' : 'Oui') : (locale === 'en' ? 'No' : 'Non') }}
                                        </span>
                                    </template>

                                    <template v-else>
                                        {{ getDisplayValue(row, field) }}
                                    </template>

                                </td>
                            </tr>

                            <tr v-if="previewRows.length === 0">
                                <td :colspan="importFields.length + 1" class="px-5 py-12 text-center">
                                    <div
                                        class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-surface-alt">
                                        <FileX class="h-6 w-6 text-text-muted" />
                                    </div>
                                    <p class="mt-3 text-sm font-medium text-text-secondary">{{ locale === 'en' ? 'No data to display' : 'Aucune donnée à afficher' }}</p>
                                </td>
                            </tr>
                        </tbody>

                    </table>
                </div>

                <div v-if="rows.length > previewLimit"
                    class="border-t border-border bg-surface-alt px-5 py-3 text-center text-xs text-text-secondary">
                    Seules les {{ previewLimit }} premières lignes sont affichées.
                    Les {{ rows.length }} lignes seront prises en compte.
                </div>

            </div>


            <!-- ========================================================= -->
            <!-- ERREURS DE VALIDATION -->
            <!-- ========================================================= -->

            <div v-if="validationErrors.length" class="mt-6 rounded-2xl border border-warning/30 bg-warning/10 p-5">

                <div class="flex items-start gap-3">
                    <CircleAlert class="mt-0.5 h-5 w-5 text-warning" />
                    <div>
                        <h3 class="font-semibold text-warning">{{ locale === 'en' ? 'Data to review' : 'Données à vérifier' }}</h3>
                        <p class="mt-1 text-sm text-warning/80">
                            {{ validationErrors.length }} erreur(s) détectée(s).
                        </p>
                    </div>
                </div>

                <div class="mt-4 max-h-60 overflow-y-auto">
                    <div v-for="(error, index) in validationErrors" :key="index"
                        class="border-b border-warning/20 py-2 text-sm text-warning last:border-0">
                        <span class="font-semibold">Ligne {{ error.row }} :</span>
                        {{ error.message }}
                    </div>
                </div>

            </div>

        </div>
        </div>

    </div>
</template>

<script setup lang="ts">

    import {
        computed,
        ref
    } from "vue"

    import {
        Check,
        CheckCircle2,
        Circle,
        CircleAlert,
        Download,
        Eye,
        FileSpreadsheet,
        FileX,
        Loader,
        Trash2,
        Upload,
        X
    } from "@lucide/vue"

    import * as XLSX from "xlsx-js-style"
    import { useI18n } from "vue-i18n"
    import Header from "../../../components/shared/Header.vue"
    import type { EquipmentMonitoringFormType } from "../../../@types/EquipmentMonitoring.type"
    import { useEquipmentMonitoringService } from "../../../core/services/equipmentMonitoring.service"
    import { toast } from "vue3-toastify"
    import { router } from "../../../router"

    const { t, locale } = useI18n()


    /*
    |--------------------------------------------------------------------------
    | TYPES
    |--------------------------------------------------------------------------
    */

    type ImportFieldType =
        | "string"
        | "number"
        | "boolean"
        | "date"


    type ImportField = {

        key: string

        label: string

        excelName: string

        required?: boolean

        type: ImportFieldType

    }


    type ImportRow =
        Record<string, any>


    type ValidationError = {

        row: number

        message: string

    }


    /*
    |--------------------------------------------------------------------------
    | CHAMPS DU MODELE EXCEL
    |--------------------------------------------------------------------------
    */

    const importFields: ImportField[] = [

        {
            key: "site_name",
            label: "SS",
            excelName: "SS",
            required: true,
            type: "string"
        },

        {
            key: "date",
            label: "DATE",
            excelName: "DATE",
            required: true,
            type: "date"
        },

        {
            key: "p50",
            label: "P50",
            excelName: "P50",
            type: "number"
        },

        {
            key: "p9",
            label: "P9",
            excelName: "P9",
            type: "number"
        },

        {
            key: "p6",
            label: "P6",
            excelName: "P6",
            type: "number"
        },

        {
            key: "co2",
            label: "CO2",
            excelName: "CO2",
            type: "number"
        },

        {
            key: "bas_met",
            label: "BAS MET",
            excelName: "BAS MET",
            type: "number"
        },

        {
            key: "bas_plast",
            label: "BAS PLAST",
            excelName: "BAS PLAST",
            type: "number"
        },
        {
            key: "bac_de_retention",
            label: "BAC DE RETENTION",
            excelName: "BAC DE RETENTION",
            type: "number"
        },

        {
            key: "pelles",
            label: "PELLES",
            excelName: "PELLES",
            type: "number"
        },

        {
            key: "poubelles_120l",
            label: "POUBELLE 120L",
            excelName: "POUBELLE 120L",
            type: "number"
        },

        {
            key: "poubelle_240l",
            label: "POUBELLE 240L",
            excelName: "POUBELLE 240L",
            type: "number"
        },

        {
            key: "caf",
            label: "CAF",
            excelName: "CAF",
            type: "number"
        },

        {
            key: "picto_ext",
            label: "PICTO EXT",
            excelName: "PICTO EXT",
            type: "number"
        },

        {
            key: "picto_caf",
            label: "PICTO CAF",
            excelName: "PICTO CAF",
            type: "number"
        },

        {
            key: "picto_defense_de_fumer",
            label: "PICTO DEFENSE DE FUMER",
            excelName: "PICTO DEFENSE DE FUMER",
            type: "number"
        },

        {
            key: "point_de_rasso",
            label: "POINT DE RASSO",
            excelName: "POINT DE RASSO",
            type: "number"
        },

        {
            key: "contact_d_urgence",
            label: "CONTACT D'URGENCE",
            excelName: "CONTACT D'URGENCE",
            type: "number"
        },

        {
            key: "canne_d_enfutage",
            label: "CANNE D'ENFUTAGE",
            excelName: "CANNE D'ENFUTAGE",
            type: "number"
        },

        {
            key: "panneau_depotage_en_cours",
            label: "PANNEAU DEPOTAGE EN COURS",
            excelName: "PANNEAU DEPOTAGE EN COURS",
            type: "number"
        },

        {
            key: "picto_danger_tgbt",
            label: "PICTO DANGER TGBT",
            excelName: "PICTO DANGER TGBT",
            type: "boolean"
        },

        {
            key: "panneau_event",
            label: "PANNEAU EVENT",
            excelName: "PANNEAU EVENT",
            type: "boolean"
        },

        {
            key: "livret_fiche_reflexe",
            label: "LIVRET FICHE REFLEXE",
            excelName: "LIVRET FICHE REFLEXE",
            type: "boolean"
        },

        {
            key: "politique",
            label: "POLITIQUE",
            excelName: "POLITIQUE",
            type: "boolean"
        },

        {
            key: "detecteur_de_fumee",
            label: "DETECTEUR DE FUMEE",
            excelName: "DETECTEUR DE FUMEE",
            type: "number"
        },

        {
            key: "plots",
            label: "PLOTS",
            excelName: "PLOTS",
            type: "number"
        },

        {
            key: "chainettes",
            label: "CHAINETTES",
            excelName: "CHAINETTES",
            type: "number"
        }

    ]


    /*
    |--------------------------------------------------------------------------
    | STATE
    |--------------------------------------------------------------------------
    */

    const fileInput =
        ref<HTMLInputElement | null>(null)

    const fileName =
        ref("")

    const fileSize =
        ref(0)

    const headers =
        ref<string[]>([])

    const rows =
        ref<ImportRow[]>([])

    const columnMapping =
        ref<Record<string, string>>({})

    const globalError =
        ref("")

    const successMessage =
        ref("")

    const previewLimit =
        20

    const validationErrors =
        ref<ValidationError[]>([])


    /*
    |--------------------------------------------------------------------------
    | COMPUTED
    |--------------------------------------------------------------------------
    */
const loading_import=ref<boolean>(false)
    const hasFile =
        computed(() => {

            return rows.value.length > 0

        })


    const previewRows =
        computed(() => {

            return rows.value.slice(
                0,
                previewLimit
            )

        })


    const missingColumns =
        computed(() => {

            return importFields
                .filter(
                    field =>
                        field.required &&
                        !columnMapping.value[field.key]
                )
                .map(
                    field =>
                        field.excelName
                )

        })


    const canImport =
        computed(() => {

            return (
                hasFile.value &&
                missingColumns.value.length === 0 &&
                validationErrors.value.length === 0
            )

        })

    const equipments = useEquipmentMonitoringService()
    /*
    |--------------------------------------------------------------------------
    | NORMALISATION
    |--------------------------------------------------------------------------
    */

    function normalize(
        value: string
    ): string {

        return String(value)
            .trim()
            .toLowerCase()
            .normalize("NFD")
            .replace(
                /[\u0300-\u036f]/g,
                ""
            )
            .replace(
                /\s+/g,
                " "
            )

    }


    /*
    |--------------------------------------------------------------------------
    | FORMAT DATE
    |--------------------------------------------------------------------------
    */

    function formatDate(
        date: Date
    ): string {

        return `${date.getFullYear()}-${String(
            date.getMonth() + 1
        ).padStart(2, "0")}-${String(
            date.getDate()
        ).padStart(2, "0")}`

    }


    /*
    |--------------------------------------------------------------------------
    | PARSE DATE EXCEL
    |--------------------------------------------------------------------------
    */

    function parseExcelDate(
        value: any
    ): string | null {

        if (
            value === null ||
            value === undefined ||
            value === ""
        ) {

            return null

        }


        /*
        |--------------------------------------------------------------------------
        | Date JavaScript
        |--------------------------------------------------------------------------
        */

        if (
            value instanceof Date
        ) {

            if (
                isNaN(value.getTime())
            ) {

                return null

            }

            return formatDate(value)

        }


        /*
        |--------------------------------------------------------------------------
        | Numéro de série Excel
        |--------------------------------------------------------------------------
        */

        if (
            typeof value === "number"
        ) {

            const date =
                XLSX.SSF.parse_date_code(
                    value
                )

            if (
                !date
            ) {

                return null

            }

            return `${date.y}-${String(
                date.m
            ).padStart(2, "0")}-${String(
                date.d
            ).padStart(2, "0")}`

        }


        const stringValue =
            String(value).trim()


        /*
        |--------------------------------------------------------------------------
        | YYYY-MM-DD
        |--------------------------------------------------------------------------
        */

        if (
            /^\d{4}-\d{2}-\d{2}$/.test(
                stringValue
            )
        ) {

            const date =
                new Date(
                    `${stringValue}T00:00:00`
                )

            if (
                !isNaN(
                    date.getTime()
                )
            ) {

                return stringValue

            }

        }


        /*
        |--------------------------------------------------------------------------
        | DD/MM/YYYY
        |--------------------------------------------------------------------------
        */

        const match =
            stringValue.match(
                /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/
            )


        if (
            match
        ) {

            const day =
                Number(match[1])

            const month =
                Number(match[2])

            const year =
                Number(match[3])

            const date =
                new Date(
                    year,
                    month - 1,
                    day
                )


            if (
                date.getFullYear() === year &&
                date.getMonth() === month - 1 &&
                date.getDate() === day
            ) {

                return `${year}-${String(
                    month
                ).padStart(2, "0")}-${String(
                    day
                ).padStart(2, "0")}`

            }

        }


        return null

    }


    /*
    |--------------------------------------------------------------------------
    | LECTURE DU FICHIER
    |--------------------------------------------------------------------------
    */

    async function handleFile(
        event: Event
    ) {

        globalError.value = ""

        successMessage.value = ""

        validationErrors.value = []


        const target =
            event.target as HTMLInputElement


        const file =
            target.files?.[0]


        if (
            !file
        ) {

            return

        }


        const extension =
            file.name
                .split(".")
                .pop()
                ?.toLowerCase()


        if (
            !extension ||
            ![
                "xlsx",
                "xls",
                "csv"
            ].includes(extension)
        ) {

            globalError.value =
                "Format de fichier non supporté. Utilisez XLSX, XLS ou CSV."

            return

        }


        fileName.value =
            file.name


        fileSize.value =
            file.size


        try {

            await readExcelFile(
                file
            )

        } catch (error) {

            console.error(
                error
            )

            globalError.value =
                "Impossible de lire le fichier. Vérifiez qu'il respecte le modèle fourni."

            removeFile(false)

        }

    }


    /*
    |--------------------------------------------------------------------------
    | LECTURE EXCEL
    |--------------------------------------------------------------------------
    */

    async function readExcelFile(
        file: File
    ) {

        const buffer =
            await file.arrayBuffer()


        const workbook =
            XLSX.read(
                buffer,
                {
                    type: "array",
                    cellDates: true
                }
            )


        if (
            !workbook.SheetNames.length
        ) {

            throw new Error(
                "Aucune feuille trouvée."
            )

        }


        const sheetName =
            workbook.SheetNames[0]


        const worksheet =
            workbook.Sheets[
            sheetName
            ]


        /*
        |--------------------------------------------------------------------------
        | HEADERS
        |--------------------------------------------------------------------------
        */

        const rawHeaders =
            XLSX.utils.sheet_to_json(
                worksheet,
                {
                    header: 1,
                    defval: ""
                }
            ) as any[][]


        if (
            !rawHeaders.length ||
            !rawHeaders[0]?.length
        ) {

            throw new Error(
                "Le fichier ne contient aucune colonne."
            )

        }


        headers.value =
            rawHeaders[0]
                .map(
                    value =>
                        String(value).trim()
                )
                .filter(
                    value =>
                        value !== ""
                )


        /*
        |--------------------------------------------------------------------------
        | DATA
        |--------------------------------------------------------------------------
        */

        rows.value =
            XLSX.utils.sheet_to_json(
                worksheet,
                {
                    defval: "",
                    raw: true
                }
            ) as ImportRow[]


        if (
            rows.value.length === 0
        ) {

            throw new Error(
                "Le fichier ne contient aucune donnée."
            )

        }


        /*
        |--------------------------------------------------------------------------
        | MAPPING
        |--------------------------------------------------------------------------
        */

        initializeMapping()


        /*
        |--------------------------------------------------------------------------
        | VALIDATION
        |--------------------------------------------------------------------------
        */

        validateRows()

    }


    /*
    |--------------------------------------------------------------------------
    | MAPPING DES COLONNES
    |--------------------------------------------------------------------------
    */

    function initializeMapping() {

        const mapping:
            Record<string, string> = {}


        for (
            const field
            of importFields
        ) {

            const match =
                headers.value.find(
                    header =>
                        normalize(header) ===
                        normalize(
                            field.excelName
                        )
                )


            if (
                match
            ) {

                mapping[field.key] =
                    match

            }

        }


        columnMapping.value =
            mapping

    }


    /*
    |--------------------------------------------------------------------------
    | VALEUR BRUTE
    |--------------------------------------------------------------------------
    */

    function getRawValue(
        row: ImportRow,
        field: ImportField
    ) {

        const column =
            columnMapping.value[
            field.key
            ]


        if (
            !column
        ) {

            return ""

        }


        return row[column]

    }


    /*
    |--------------------------------------------------------------------------
    | VALEUR AFFICHÉE
    |--------------------------------------------------------------------------
    */

    function getDisplayValue(
        row: ImportRow,
        field: ImportField
    ) {

        const value =
            getRawValue(
                row,
                field
            )


        if (
            value === null ||
            value === undefined ||
            value === ""
        ) {

            return "—"

        }


        /*
        |--------------------------------------------------------------------------
        | DATE
        |--------------------------------------------------------------------------
        */

        if (
            field.type === "date"
        ) {

            return (
                parseExcelDate(
                    value
                ) ?? "—"
            )

        }


        /*
        |--------------------------------------------------------------------------
        | NUMBER
        |--------------------------------------------------------------------------
        */

        if (
            field.type === "number"
        ) {

            const number =
                Number(value)


            if (
                Number.isNaN(
                    number
                )
            ) {

                return String(
                    value
                )

            }


            return number.toString()

        }


        return String(
            value
        )

    }


    /*
    |--------------------------------------------------------------------------
    | BOOLEAN
    |--------------------------------------------------------------------------
    */

    function parseBoolean(
        value: any
    ): boolean {

        if (
            typeof value === "boolean"
        ) {

            return value

        }


        const normalized =
            String(value)
                .trim()
                .toLowerCase()


        return [
            "true",
            "1",
            "oui",
            "yes",
            "y",
            "x"
        ].includes(
            normalized
        )

    }


    /*
    |--------------------------------------------------------------------------
    | VALIDATION DES LIGNES
    |--------------------------------------------------------------------------
    */

    function validateRows() {

        validationErrors.value = []


        rows.value.forEach(
            (
                row,
                index
            ) => {

                const excelRow =
                    index + 2


                for (
                    const field
                    of importFields
                ) {

                    const column =
                        columnMapping.value[
                        field.key
                        ]


                    /*
                    |--------------------------------------------------------------------------
                    | Colonne absente
                    |--------------------------------------------------------------------------
                    */

                    if (
                        !column
                    ) {

                        continue

                    }


                    const value =
                        row[column]


                    /*
                    |--------------------------------------------------------------------------
                    | REQUIRED
                    |--------------------------------------------------------------------------
                    */

                    if (
                        field.required &&
                        (
                            value === undefined ||
                            value === null ||
                            String(value).trim() === ""
                        )
                    ) {

                        validationErrors.value.push({

                            row: excelRow,

                            message:
                                `La colonne "${field.excelName}" est obligatoire.`

                        })

                        continue

                    }


                    /*
                    |--------------------------------------------------------------------------
                    | DATE
                    |--------------------------------------------------------------------------
                    */

                    if (
                        field.type === "date" &&
                        value !== "" &&
                        value !== null &&
                        value !== undefined
                    ) {

                        const date =
                            parseExcelDate(
                                value
                            )


                        if (
                            !date
                        ) {

                            validationErrors.value.push({

                                row: excelRow,

                                message:
                                    `"${field.excelName}" doit contenir une date valide. Valeur reçue : "${value}".`

                            })

                        }

                    }


                    /*
                    |--------------------------------------------------------------------------
                    | NUMBER
                    |--------------------------------------------------------------------------
                    */

                    if (
                        field.type === "number" &&
                        value !== "" &&
                        value !== null &&
                        value !== undefined
                    ) {

                        const number =
                            Number(value)


                        if (
                            Number.isNaN(
                                number
                            )
                        ) {

                            validationErrors.value.push({

                                row: excelRow,

                                message:
                                    `"${field.excelName}" doit être un nombre. Valeur reçue : "${value}".`

                            })

                        }

                    }


                    /*
                    |--------------------------------------------------------------------------
                    | BOOLEAN
                    |--------------------------------------------------------------------------
                    */

                    if (
                        field.type === "boolean" &&
                        value !== "" &&
                        value !== null &&
                        value !== undefined
                    ) {

                        const normalized =
                            String(value)
                                .trim()
                                .toLowerCase()


                        const allowed = [

                            "true",
                            "false",

                            "1",
                            "0",

                            "oui",
                            "non",

                            "yes",
                            "no",

                            "y",
                            "n",

                            "x"

                        ]


                        if (
                            !allowed.includes(
                                normalized
                            )
                        ) {

                            validationErrors.value.push({

                                row: excelRow,

                                message:
                                    `"${field.excelName}" doit contenir Oui/Non, 1/0 ou True/False.`

                            })

                        }

                    }

                }

            }

        )

    }


    /*
    |--------------------------------------------------------------------------
    | TRANSFORMATION DES DONNÉES
    |--------------------------------------------------------------------------
    */

    function transformRows() {

        return rows.value.map(
            row => {

                const result:
                    Record<string, any> = {}


                for (
                    const field
                    of importFields
                ) {

                    const column =
                        columnMapping.value[
                        field.key
                        ]


                    if (
                        !column
                    ) {

                        continue

                    }


                    const value =
                        row[column]


                    /*
                    |--------------------------------------------------------------------------
                    | STRING
                    |--------------------------------------------------------------------------
                    */

                    if (
                        field.type === "string"
                    ) {

                        result[field.key] =
                            value === null ||
                                value === undefined
                                ? ""
                                : String(
                                    value
                                ).trim()

                    }


                    /*
                    |--------------------------------------------------------------------------
                    | DATE
                    |--------------------------------------------------------------------------
                    */

                    else if (
                        field.type === "date"
                    ) {

                        result[field.key] =
                            parseExcelDate(
                                value
                            ) ?? ""

                    }


                    /*
                    |--------------------------------------------------------------------------
                    | NUMBER
                    |--------------------------------------------------------------------------
                    */

                    else if (
                        field.type === "number"
                    ) {

                        result[field.key] =
                            value === "" ||
                                value === null ||
                                value === undefined
                                ? 0
                                : Number(
                                    value
                                )

                    }


                    /*
                    |--------------------------------------------------------------------------
                    | BOOLEAN
                    |--------------------------------------------------------------------------
                    */

                    else if (
                        field.type === "boolean"
                    ) {

                        result[field.key] =
                            parseBoolean(
                                value
                            )

                    }

                }


                return result

            }
        )

    }


    /*
    |--------------------------------------------------------------------------
    | PREPARER IMPORT
    |--------------------------------------------------------------------------
    |
    | Pour le moment, aucune API.
    |
    */

    function prepareImport() {

        if (
            !canImport.value
        ) {

            return

        }


        const data =
            transformRows()
            loading_import.value=true
        equipments.storeBatch({
            equipments: data as EquipmentMonitoringFormType[]
        })
            .then((res) => {
                console.log(res)
                toast.success("success")
                setTimeout(() => {
                    removeFile(true)
                    router.push(
                        {
                            "name": "EQUIPMENT_MONITORING"
                        }
                    )
                }, 1000)
            })
            .catch(err => {
                console.error(err?.response)
                toast.error("error")
            })
            .finally(()=>{
                loading_import.value=false
            })


    }


    /*
    |--------------------------------------------------------------------------
    | STYLES DU MODELE
    |--------------------------------------------------------------------------
    | Couleurs alignées sur la charte de l'application (main.css).
    */

    const templateColors = {

        requiredHeader: "0F9D58",   // --color-primary
        optionalHeader: "1E3A5F",   // --color-accent-dark
        exampleFill: "F1F5F9",   // --color-surface-alt
        exampleText: "64748B",   // --color-text-secondary
        borderLight: "E2E8F0",   // --color-border
        titleText: "1E3A5F",   // --color-accent-dark
        white: "FFFFFF"

    }


    function thinBorder(
        color: string
    ) {

        return {

            top: { style: "thin", color: { rgb: color } },
            bottom: { style: "thin", color: { rgb: color } },
            left: { style: "thin", color: { rgb: color } },
            right: { style: "thin", color: { rgb: color } }

        }

    }


    function setCellStyle(
        worksheet: Record<string, any>,
        rowIndex: number,
        colIndex: number,
        style: Record<string, any>
    ) {

        const ref =
            XLSX.utils.encode_cell({
                r: rowIndex,
                c: colIndex
            })

        if (!worksheet[ref]) {

            worksheet[ref] = { t: "s", v: "" }

        }

        worksheet[ref].s = style

    }


    /*
    |--------------------------------------------------------------------------
    | TELECHARGER LE MODELE
    |--------------------------------------------------------------------------
    */

    function downloadTemplate() {

        const templateHeaders =
            importFields.map(
                field =>
                    field.excelName
            )


        /*
        |--------------------------------------------------------------------------
        | Exemple
        |--------------------------------------------------------------------------
        */

        const exampleRow:
            Record<string, any> = {

            SS:
                "Station Exemple",

            DATE:
                "2026-09-01",

            P50:
                2,

            P9:
                3,

            P6:
                4,

            CO2:
                1,

            "BAS MET":
                2,

            "BAS PLAST":
                3,
            "BAC DE RETENTION":
                3,

            PELLES:
                2,

            "POUBELLE 120L":
                3,

            "POUBELLE 240L":
                2,

            CAF:
                1,

            "PICTO EXT":
                2,

            "PICTO CAF":
                2,

            "PICTO DEFENSE DE FUMER":
                1,

            "POINT DE RASSO":
                1,

            "CONTACT D'URGENCE":
                1,

            "CANNE D'ENFUTAGE":
                1,

            "PANNEAU DEPOTAGE EN COURS":
                1,

            "PICTO DANGER TGBT":
                "Oui",

            "PANNEAU EVENT":
                "Oui",

            "LIVRET FICHE REFLEXE":
                "Oui",

            POLITIQUE:
                "Oui",

            "DETECTEUR DE FUMEE":
                4,

            PLOTS:
                5,

            CHAINETTES:
                3

        }


        /*
        |--------------------------------------------------------------------------
        | Worksheet
        |--------------------------------------------------------------------------
        */

        const worksheet =
            XLSX.utils.aoa_to_sheet([

                templateHeaders,

                templateHeaders.map(
                    header =>
                        exampleRow[
                        header
                        ] ?? ""
                )

            ])


        /*
        |--------------------------------------------------------------------------
        | Largeur
        |--------------------------------------------------------------------------
        */

        worksheet["!cols"] =
            templateHeaders.map(
                header => ({

                    wch:
                        Math.max(
                            header.length + 3,
                            15
                        )

                })
            )


        /*
        |--------------------------------------------------------------------------
        | Hauteur des lignes (en-tête + exemple)
        |--------------------------------------------------------------------------
        */

        worksheet["!rows"] = [
            { hpx: 28 },
            { hpx: 22 }
        ]


        /*
        |--------------------------------------------------------------------------
        | Style de l'en-tête (vert = obligatoire, bleu nuit = optionnel)
        |--------------------------------------------------------------------------
        */

        importFields.forEach(
            (field, colIndex) => {

                setCellStyle(
                    worksheet,
                    0,
                    colIndex,
                    {
                        fill: {
                            patternType: "solid",
                            fgColor: {
                                rgb: field.required
                                    ? templateColors.requiredHeader
                                    : templateColors.optionalHeader
                            }
                        },
                        font: {
                            name: "Calibri",
                            sz: 11,
                            bold: true,
                            color: { rgb: templateColors.white }
                        },
                        alignment: {
                            horizontal: "center",
                            vertical: "center",
                            wrapText: true
                        },
                        border: thinBorder(templateColors.white)
                    }
                )


                /*
                |----------------------------------------------------------------
                | Style de la ligne d'exemple
                |----------------------------------------------------------------
                */

                setCellStyle(
                    worksheet,
                    1,
                    colIndex,
                    {
                        fill: {
                            patternType: "solid",
                            fgColor: { rgb: templateColors.exampleFill }
                        },
                        font: {
                            name: "Calibri",
                            sz: 11,
                            italic: true,
                            color: { rgb: templateColors.exampleText }
                        },
                        alignment: {
                            horizontal: "center",
                            vertical: "center"
                        },
                        border: thinBorder(templateColors.borderLight)
                    }
                )

            }
        )


        /*
        |--------------------------------------------------------------------------
        | Feuille d'instructions
        |--------------------------------------------------------------------------
        */

        const instructionsRows = [

            ["Instructions d'utilisation du modèle"],
            [""],
            ["Légende des couleurs de l'en-tête"],
            ["", "Colonne obligatoire"],
            ["", "Colonne optionnelle"],
            [""],
            ["Conseils"],
            ["Ne modifiez pas les noms des colonnes (ligne 1 du fichier)."],
            ["Le format de date attendu est AAAA-MM-JJ, par exemple 2026-09-01."],
            ["Les champs Oui/Non acceptent aussi 1/0 ou True/False."],
            ["Supprimez la ligne d'exemple (ligne 2) avant d'importer vos propres données."],
            ["Une ligne correspond au relevé d'un site pour une date donnée."]

        ]


        const instructionsSheet =
            XLSX.utils.aoa_to_sheet(
                instructionsRows
            )


        instructionsSheet["!cols"] = [
            { wch: 4 },
            { wch: 70 }
        ]


        setCellStyle(
            instructionsSheet,
            0,
            0,
            {
                font: {
                    name: "Calibri",
                    sz: 14,
                    bold: true,
                    color: { rgb: templateColors.titleText }
                }
            }
        )

        setCellStyle(
            instructionsSheet,
            2,
            0,
            {
                font: {
                    name: "Calibri",
                    sz: 11,
                    bold: true,
                    color: { rgb: templateColors.titleText }
                }
            }
        )

        setCellStyle(
            instructionsSheet,
            6,
            0,
            {
                font: {
                    name: "Calibri",
                    sz: 11,
                    bold: true,
                    color: { rgb: templateColors.titleText }
                }
            }
        )

        setCellStyle(
            instructionsSheet,
            3,
            0,
            {
                fill: {
                    patternType: "solid",
                    fgColor: { rgb: templateColors.requiredHeader }
                }
            }
        )

        setCellStyle(
            instructionsSheet,
            4,
            0,
            {
                fill: {
                    patternType: "solid",
                    fgColor: { rgb: templateColors.optionalHeader }
                }
            }
        )


        /*
        |--------------------------------------------------------------------------
        | Workbook
        |--------------------------------------------------------------------------
        */

        const workbook =
            XLSX.utils.book_new()


        XLSX.utils.book_append_sheet(
            workbook,
            worksheet,
            "Suivi matériel"
        )

        XLSX.utils.book_append_sheet(
            workbook,
            instructionsSheet,
            "Instructions"
        )


        XLSX.writeFile(
            workbook,
            "modele_suivi_materiel.xlsx"
        )

    }


    /*
    |--------------------------------------------------------------------------
    | SUPPRIMER FICHIER
    |--------------------------------------------------------------------------
    */

    function removeFile(
        resetInput = true
    ) {

        fileName.value = ""

        fileSize.value = 0

        headers.value = []

        rows.value = []

        columnMapping.value = {}

        validationErrors.value = []

        globalError.value = ""

        successMessage.value = ""


        if (
            resetInput &&
            fileInput.value
        ) {

            fileInput.value.value = ""

        }

    }


    /*
    |--------------------------------------------------------------------------
    | TAILLE FICHIER
    |--------------------------------------------------------------------------
    */

    function formatFileSize(
        bytes: number
    ): string {

        if (
            bytes === 0
        ) {

            return "0 Ko"

        }


        const units = [

            "o",
            "Ko",
            "Mo",
            "Go"

        ]


        const index =
            Math.floor(

                Math.log(bytes) /
                Math.log(1024)

            )


        return `${(

            bytes /
            Math.pow(
                1024,
                index
            )

        ).toFixed(1)} ${units[index]}`

    }

</script>