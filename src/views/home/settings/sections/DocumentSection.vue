<template>
  <div class="flex flex-col gap-y-6">
    <!-- EN-TÊTE -->
    <div class="border-b border-border p-5">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-base font-bold text-text-primary">
            {{ locale === 'en' ? 'Electronic Document Management (DMS)' : 'Gestion Électronique des Documents (GED)' }}
          </h3>
          <p class="mt-1 text-xs text-text-secondary">
            {{ locale === 'en' ? 'Allowed file formats, upload quotas, and legal retention policies for Galana HSSE reports.' : 'Formats autorisés, quotas de téléversement et règles de conservation légale des rapports Galana HSSE.' }}
          </p>
        </div>
        <span class="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-[#0F9D58] ring-1 ring-[#0F9D58]/20">
          <FileCheck class="h-3.5 w-3.5" />
          {{ locale === 'en' ? 'DMS Storage Active' : 'Stockage GED Actif' }}
        </span>
      </div>
    </div>

    <!-- 1. LIMITES & FORMATS -->
    <div class="border-b border-border p-5">
      <div class="mb-4">
        <div class="flex items-center gap-2">
          <UploadCloud class="h-4 w-4 text-[#0F9D58]" />
          <h5 class="text-xs font-bold text-text-primary">
            {{ locale === 'en' ? 'Uploads & File Quotas' : 'Téléversements & Quotas Fichiers' }}
          </h5>
        </div>
        <p class="mt-0.5 text-xs text-text-secondary">
          {{ locale === 'en' ? 'Maximum accepted size for inspection attachments and allowed extensions.' : "Taille limite acceptée pour les pièces jointes d'inspection et extensions autorisées." }}
        </p>
      </div>

      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-4">
        <Input
          v-model.number="form.max_upload_size_mb"
          type="number"
          min="5"
          max="100"
          :label="locale === 'en' ? 'Max file size (MB)' : 'Taille maximale par fichier (Mo)'"
          :icon="HardDrive"
          placeholder="25"
        />

        <Input
          v-model.number="form.retention_period_years"
          type="number"
          min="1"
          max="15"
          :label="locale === 'en' ? 'Legal retention period (years)' : 'Durée d\'archivage légale (années)'"
          :icon="Archive"
          placeholder="5"
        />
      </div>

      <div>
        <Input
          v-model="form.allowed_file_types"
          :label="locale === 'en' ? 'Allowed file extensions (comma separated)' : 'Extensions de fichiers autorisées (séparées par une virgule)'"
          :icon="FileType"
          placeholder="pdf,doc,docx,xls,xlsx,png,jpg,jpeg,zip"
        />
        <div class="mt-2.5 flex flex-wrap gap-1.5">
          <span
            v-for="ext in allowedExtensionsList"
            :key="ext"
            class="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700"
          >
            .{{ ext.trim().toLowerCase() }}
          </span>
        </div>
      </div>
    </div>

    <!-- 2. VERSIONING AUTOMATIQUE -->
    <div class="p-5">
      <div class="mb-4">
        <div class="flex items-center gap-2">
          <Layers class="h-4 w-4 text-[#0F9D58]" />
          <h5 class="text-xs font-bold text-text-primary">
            {{ locale === 'en' ? 'Lifecycle & Version History' : 'Cycle de Vie & Historisation' }}
          </h5>
        </div>
        <p class="mt-0.5 text-xs text-text-secondary">
          {{ locale === 'en' ? 'Integrity management and archiving of document revisions.' : "Gestion de l'intégrité et archivage des révisions documentaires." }}
        </p>
      </div>

      <div class="divide-y divide-border overflow-hidden rounded-xl border border-border">
        <div class="flex items-center justify-between gap-4 p-4">
          <div>
            <p class="text-xs font-semibold text-text-primary">
              {{ locale === 'en' ? 'Automatic document versioning' : 'Gestion automatique des versions de documents' }}
            </p>
            <p class="mt-0.5 text-[11px] text-text-secondary">
              {{ locale === 'en' ? 'Systematically archives previous version of a document or audit evidence when replaced.' : "Archive systématiquement l'ancienne version d'un document ou d'une preuve d'audit lors d'un remplacement." }}
            </p>
          </div>
          <button
            type="button"
            role="switch"
            :aria-checked="form.auto_versioning"
            @click="form.auto_versioning = !form.auto_versioning"
            class="relative inline-flex h-5 w-10 shrink-0 cursor-pointer items-center rounded-full transition-colors"
            :class="form.auto_versioning ? 'bg-[#0F9D58]' : 'bg-slate-200'"
          >
            <span
              class="inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform"
              :class="form.auto_versioning ? 'translate-x-5' : 'translate-x-1'"
            />
          </button>
        </div>
      </div>
    </div>

    <!-- ACTIONS -->
    <div class="flex items-center justify-end gap-3 border-t border-border px-5 py-4">
      <button
        type="button"
        :disabled="!hasChanges || isSaving"
        @click="resetForm"
        class="inline-flex items-center justify-center gap-1.5 rounded-lg border border-border bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-2xs transition hover:bg-slate-50 disabled:opacity-50"
      >
        <RotateCcw class="h-3.5 w-3.5" />
        {{ t('common.cancel') }}
      </button>

      <button
        type="button"
        :disabled="!hasChanges || isSaving"
        @click="save"
        class="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#0F9D58] px-4 py-2 text-xs font-semibold text-white shadow-2xs transition hover:bg-[#0c8248] disabled:opacity-50"
      >
        <Loader2 v-if="isSaving" class="h-3.5 w-3.5 animate-spin" />
        <Save v-else class="h-3.5 w-3.5" />
        {{ locale === 'en' ? 'Save DMS settings' : 'Enregistrer les paramètres GED' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  Archive,
  FileCheck,
  FileType,
  HardDrive,
  Layers,
  Loader2,
  RotateCcw,
  Save,
  UploadCloud
} from '@lucide/vue'
import { computed, onMounted, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import Input from '../../../../components/ui/Input.vue'
import settingService from '../../../../core/services/setting.service'
import { toast } from 'vue3-toastify'

const { t, locale } = useI18n()

const defaults = {
  max_upload_size_mb: 25,
  allowed_file_types: 'pdf,doc,docx,xls,xlsx,png,jpg,jpeg,zip',
  auto_versioning: true,
  retention_period_years: 5,
}

const form = reactive({ ...defaults })
const initialSnapshot = ref(JSON.stringify(defaults))
const isLoading = ref(false)
const isSaving = ref(false)

const allowedExtensionsList = computed(() => {
  return form.allowed_file_types
    .split(',')
    .map(s => s.trim())
    .filter(Boolean)
})

const hasChanges = computed(() => JSON.stringify(form) !== initialSnapshot.value)

function loadSettings() {
  isLoading.value = true
  settingService
    .getByGroup('documents')
    .then((res: any) => {
      const data = res.data?.data ?? {}
      if (data['documents.max_upload_size_mb']?.value !== undefined) {
        form.max_upload_size_mb = Number(data['documents.max_upload_size_mb'].value)
      }
      if (data['documents.allowed_file_types']?.value !== undefined) {
        form.allowed_file_types = String(data['documents.allowed_file_types'].value)
      }
      if (data['documents.auto_versioning']?.value !== undefined) {
        form.auto_versioning = Boolean(data['documents.auto_versioning'].value)
      }
      if (data['documents.retention_period_years']?.value !== undefined) {
        form.retention_period_years = Number(data['documents.retention_period_years'].value)
      }
      initialSnapshot.value = JSON.stringify(form)
    })
    .finally(() => {
      isLoading.value = false
    })
}

function resetForm() {
  const parsed = JSON.parse(initialSnapshot.value)
  Object.assign(form, parsed)
}

function save() {
  isSaving.value = true
  settingService
    .update({
      'documents.max_upload_size_mb': form.max_upload_size_mb,
      'documents.allowed_file_types': form.allowed_file_types,
      'documents.auto_versioning': form.auto_versioning,
      'documents.retention_period_years': form.retention_period_years,
    })
    .then(() => {
      initialSnapshot.value = JSON.stringify(form)
      toast.success(locale.value === 'en' ? 'Document settings saved successfully!' : 'Paramètres documentaires enregistrés avec succès !')
    })
    .catch(() => {
      toast.error(locale.value === 'en' ? 'Error saving document settings.' : 'Erreur lors de la sauvegarde des paramètres documentaires.')
    })
    .finally(() => {
      isSaving.value = false
    })
}

onMounted(() => {
  loadSettings()
})
</script>
