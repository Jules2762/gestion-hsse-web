<template>
  <div class="flex flex-col gap-y-5">
    <div class="border-b border-border p-5">
      <h3 class="text-base font-bold text-text-primary">
        {{ locale === 'en' ? 'Compliance & HSSE Golden Rules' : 'Conformité & Règles d’Or HSSE' }}
      </h3>
      <p class="mt-1 text-xs text-text-secondary">
        {{ locale === 'en' ? 'Operational settings governing field inspections, VMC management visits and Galana occupational safety.' : 'Paramètres opérationnels régissant les inspections terrain, les visites managériales VMC et la sécurité au travail Galana.' }}
      </p>
    </div>

    <!-- 1. LIGNE D'URGENCE & ESCALADE -->
    <div class="p-5 border-b border-border">
      <div class="mb-4">
        <h5 class="text-xs font-bold text-text-primary">
          {{ locale === 'en' ? 'Emergency Hotline & Key Contacts' : 'Ligne d’Urgence & Contacts Clés' }}
        </h5>
        <p class="mt-0.5 text-xs text-text-secondary">
          {{ locale === 'en' ? 'Priority contact information displayed on field sheets and in the help bar.' : 'Coordonnées prioritaires affichées sur les fiches de terrain et dans la barre d’assistance.' }}
        </p>
      </div>

      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          v-model="form.emergency_hotline"
          :label="locale === 'en' ? 'HSSE Emergency Hotline (Ext / Phone)' : 'Ligne d’urgence HSSE (Poste / Tel)'"
          :icon="PhoneCall"
          placeholder="+261 20 22 404 40 / Poste 404"
        />
        <Input
          v-model="form.hse_manager_email"
          type="email"
          :label="locale === 'en' ? 'HSSE Manager Email' : 'E-mail du Responsable HSSE'"
          :icon="Mail"
          placeholder="hsse-manager@galana.mg"
        />
      </div>
    </div>

    <!-- 2. CADENCE DES INSPECTIONS & VMC -->
    <div class="p-5 border-b border-border">
      <div class="mb-4">
        <h5 class="text-xs font-bold text-text-primary">
          {{ locale === 'en' ? 'Inspection Cadence & Thresholds' : 'Cadence & Seuils des Contrôles' }}
        </h5>
        <p class="mt-0.5 text-xs text-text-secondary">
          {{ locale === 'en' ? 'Frequency of VMC Compliance Visits and reminder delays for corrective actions.' : 'Périodicité des Visites Managériales de Conformité et délais de rappel des actions correctives.' }}
        </p>
      </div>

      <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Input
          v-model.number="form.vmc_frequency_days"
          type="number"
          min="7"
          max="180"
          :label="locale === 'en' ? 'VMC Frequency (days)' : 'Fréquence VMC (jours)'"
          :icon="Calendar"
        />
        <Input
          v-model.number="form.inspection_reminder_days"
          type="number"
          min="1"
          max="30"
          :label="locale === 'en' ? 'Reminder notice (days)' : 'Préavis de rappel (jours)'"
          :icon="Bell"
        />
        <Input
          v-model.number="form.action_plan_overdue_threshold_days"
          type="number"
          min="1"
          max="60"
          :label="locale === 'en' ? 'Action overdue threshold (days)' : 'Seuil retard action (jours)'"
          :icon="ClockAlert"
        />
      </div>
    </div>

    <!-- 3. RÈGLES DE CONFORMITÉ & PROTOCOLES -->
    <div class="p-5">
      <div class="mb-4">
        <h5 class="text-xs font-bold text-text-primary">
          {{ locale === 'en' ? 'Protocols & Operational Requirements' : 'Protocoles & Exigences Opérationnelles' }}
        </h5>
        <p class="mt-0.5 text-xs text-text-secondary">
          {{ locale === 'en' ? 'Options to strengthen quality processes and incident management.' : 'Options de renforcement des processus qualité et gestion des incidents.' }}
        </p>
      </div>

      <div class="divide-y divide-border rounded-xl border border-border">
        <!-- Objectif Zero Incident -->
        <div class="flex items-center justify-between gap-4 p-4">
          <div>
            <p class="text-xs font-semibold text-text-primary">
              {{ locale === 'en' ? '“Zero Incident Target” Policy' : 'Politique « Objectif Zéro Incident »' }}
            </p>
            <p class="mt-0.5 text-[11px] text-text-secondary">
              {{ locale === 'en' ? 'Displays safety commitment ribbon on dashboards and VMC sheets.' : 'Affiche le ruban d’engagement sécurité sur les tableaux de bord et fiches VMC.' }}
            </p>
          </div>
          <button
            type="button"
            role="switch"
            :aria-checked="form.target_zero_incident"
            @click="form.target_zero_incident = !form.target_zero_incident"
            class="relative inline-flex h-5 w-10 shrink-0 cursor-pointer items-center rounded-full transition-colors"
            :class="form.target_zero_incident ? 'bg-[#0F9D58]' : 'bg-slate-200'"
          >
            <span
              class="inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform"
              :class="form.target_zero_incident ? 'translate-x-5' : 'translate-x-1'"
            />
          </button>
        </div>

        <!-- Escalade auto -->
        <div class="flex items-center justify-between gap-4 p-4">
          <div>
            <p class="text-xs font-semibold text-text-primary">
              {{ locale === 'en' ? 'Automatic escalation of critical incidents' : 'Escalade automatique des incidents critiques' }}
            </p>
            <p class="mt-0.5 text-[11px] text-text-secondary">
              {{ locale === 'en' ? 'Sends a priority email alert to Site Director and HSSE Manager upon entry of a level 3+ incident.' : 'Transmet une alerte prioritaire par e-mail au Directeur de site et au Responsable HSSE dès saisie d’un événement de niveau 3+.' }}
            </p>
          </div>
          <button
            type="button"
            role="switch"
            :aria-checked="form.incident_auto_escalation"
            @click="form.incident_auto_escalation = !form.incident_auto_escalation"
            class="relative inline-flex h-5 w-10 shrink-0 cursor-pointer items-center rounded-full transition-colors"
            :class="form.incident_auto_escalation ? 'bg-[#0F9D58]' : 'bg-slate-200'"
          >
            <span
              class="inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform"
              :class="form.incident_auto_escalation ? 'translate-x-5' : 'translate-x-1'"
            />
          </button>
        </div>

        <!-- Preuve photo -->
        <div class="flex items-center justify-between gap-4 p-4">
          <div>
            <p class="text-xs font-semibold text-text-primary">
              {{ locale === 'en' ? 'Mandatory photo proof for closure' : 'Preuve photographique obligatoire pour clôture' }}
            </p>
            <p class="mt-0.5 text-[11px] text-text-secondary">
              {{ locale === 'en' ? 'Prevents final approval of a corrective action without supporting attachment.' : 'Empêche la validation définitive d’une action corrective sans pièce jointe justificative.' }}
            </p>
          </div>
          <button
            type="button"
            role="switch"
            :aria-checked="form.require_action_photo_proof"
            @click="form.require_action_photo_proof = !form.require_action_photo_proof"
            class="relative inline-flex h-5 w-10 shrink-0 cursor-pointer items-center rounded-full transition-colors"
            :class="form.require_action_photo_proof ? 'bg-[#0F9D58]' : 'bg-slate-200'"
          >
            <span
              class="inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform"
              :class="form.require_action_photo_proof ? 'translate-x-5' : 'translate-x-1'"
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
        {{ locale === 'en' ? 'Save HSSE settings' : 'Enregistrer les paramètres HSSE' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  PhoneCall,
  Mail,
  Calendar,
  Bell,
  ClockAlert,
  RotateCcw,
  Save,
  Loader2
} from '@lucide/vue'
import { computed, onMounted, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import Input from '../../../../components/ui/Input.vue'
import settingService from '../../../../core/services/setting.service'
import { toast } from 'vue3-toastify'

const { t, locale } = useI18n()

const defaults = {
  emergency_hotline: '+261 20 22 404 40 / Poste 404',
  hse_manager_email: 'hsse-manager@galana.mg',
  target_zero_incident: true,
  vmc_frequency_days: 30,
  inspection_reminder_days: 3,
  action_plan_overdue_threshold_days: 7,
  incident_auto_escalation: true,
  require_action_photo_proof: true,
}

const form = reactive({ ...defaults })
const initialSnapshot = ref(JSON.stringify(defaults))
const isLoading = ref(false)
const isSaving = ref(false)

const hasChanges = computed(() => JSON.stringify(form) !== initialSnapshot.value)

function loadSettings() {
  isLoading.value = true
  settingService
    .getByGroup('hsse')
    .then((res: any) => {
      const data = res.data?.data ?? {}
      if (data['hsse.emergency_hotline']?.value !== undefined) form.emergency_hotline = data['hsse.emergency_hotline'].value
      if (data['hsse.hse_manager_email']?.value !== undefined) form.hse_manager_email = data['hsse.hse_manager_email'].value
      if (data['hsse.target_zero_incident']?.value !== undefined) form.target_zero_incident = data['hsse.target_zero_incident'].value
      if (data['hsse.vmc_frequency_days']?.value !== undefined) form.vmc_frequency_days = Number(data['hsse.vmc_frequency_days'].value)
      if (data['hsse.inspection_reminder_days']?.value !== undefined) form.inspection_reminder_days = Number(data['hsse.inspection_reminder_days'].value)
      if (data['hsse.action_plan_overdue_threshold_days']?.value !== undefined) form.action_plan_overdue_threshold_days = Number(data['hsse.action_plan_overdue_threshold_days'].value)
      if (data['hsse.incident_auto_escalation']?.value !== undefined) form.incident_auto_escalation = data['hsse.incident_auto_escalation'].value
      if (data['hsse.require_action_photo_proof']?.value !== undefined) form.require_action_photo_proof = data['hsse.require_action_photo_proof'].value
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
      'hsse.emergency_hotline': form.emergency_hotline,
      'hsse.hse_manager_email': form.hse_manager_email,
      'hsse.target_zero_incident': form.target_zero_incident,
      'hsse.vmc_frequency_days': form.vmc_frequency_days,
      'hsse.inspection_reminder_days': form.inspection_reminder_days,
      'hsse.action_plan_overdue_threshold_days': form.action_plan_overdue_threshold_days,
      'hsse.incident_auto_escalation': form.incident_auto_escalation,
      'hsse.require_action_photo_proof': form.require_action_photo_proof,
    })
    .then(() => {
      initialSnapshot.value = JSON.stringify(form)
      toast.success(locale.value === 'en' ? 'HSSE settings saved successfully!' : 'Paramètres HSSE enregistrés avec succès !')
    })
    .catch(() => {
      toast.error(locale.value === 'en' ? 'Error saving HSSE settings.' : 'Erreur lors de la sauvegarde des paramètres HSSE.')
    })
    .finally(() => {
      isSaving.value = false
    })
}

onMounted(() => {
  loadSettings()
})
</script>
