<template>
  <div class="flex flex-col gap-y-6">
    <!-- EN-TÊTE -->
    <div class="border-b border-border p-5">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-base font-bold text-text-primary">
            {{ locale === 'en' ? 'Security, Authentication & Traceability' : 'Sécurité, Authentification & Traçabilité' }}
          </h3>
          <p class="mt-1 text-xs text-text-secondary">
            {{ locale === 'en' ? 'Access management policy, password complexity and Galana HSSE audit logging.' : "Politique de gestion des accès, complexité des mots de passe et journalisation d'audit Galana HSSE." }}
          </p>
        </div>
        <span class="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-[#0F9D58] ring-1 ring-[#0F9D58]/20">
          <ShieldCheck class="h-3.5 w-3.5" />
          {{ locale === 'en' ? 'IT Policy Compliant' : 'Conforme Politique DSI' }}
        </span>
      </div>
    </div>

    <!-- 1. SESSIONS ET CONNEXION -->
    <div class="border-b border-border p-5">
      <div class="mb-4">
        <div class="flex items-center gap-2">
          <Clock class="h-4 w-4 text-[#0F9D58]" />
          <h5 class="text-xs font-bold text-text-primary">
            {{ locale === 'en' ? 'Session Management & Lockout' : 'Gestion des Sessions & Verrouillage' }}
          </h5>
        </div>
        <p class="mt-0.5 text-xs text-text-secondary">
          {{ locale === 'en' ? 'Automatic logout timeout on inactivity and brute force protection.' : "Délai de déconnexion automatique en cas d'inactivité et protection contre les attaques par force brute." }}
        </p>
      </div>

      <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Input
          v-model.number="form.session_timeout_minutes"
          type="number"
          min="15"
          max="1440"
          :label="locale === 'en' ? 'Max inactivity (minutes)' : 'Inactivité max (minutes)'"
          :icon="Timer"
          placeholder="120"
        />

        <Input
          v-model.number="form.max_login_attempts"
          type="number"
          min="3"
          max="10"
          :label="locale === 'en' ? 'Failed attempts before lockout' : 'Échecs avant blocage'"
          :icon="ShieldAlert"
          placeholder="5"
        />

        <Input
          v-model.number="form.lockout_duration_minutes"
          type="number"
          min="5"
          max="120"
          :label="locale === 'en' ? 'Lockout duration (minutes)' : 'Durée de blocage (minutes)'"
          :icon="KeyRound"
          placeholder="15"
        />
      </div>
    </div>

    <!-- 2. POLITIQUE DES MOTS DE PASSE -->
    <div class="border-b border-border p-5">
      <div class="mb-4">
        <div class="flex items-center gap-2">
          <Lock class="h-4 w-4 text-[#0F9D58]" />
          <h5 class="text-xs font-bold text-text-primary">
            {{ locale === 'en' ? 'Password Policy' : 'Politique de Mots de Passe' }}
          </h5>
        </div>
        <p class="mt-0.5 text-xs text-text-secondary">
          {{ locale === 'en' ? 'Strength requirements and mandatory renewal frequency for user accounts.' : 'Exigences de robustesse et périodicité de renouvellement imposées aux comptes utilisateurs.' }}
        </p>
      </div>

      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-4">
        <Input
          v-model.number="form.password_min_length"
          type="number"
          min="6"
          max="32"
          :label="locale === 'en' ? 'Minimum length (characters)' : 'Longueur minimale (caractères)'"
          :icon="KeyRound"
          placeholder="8"
        />

        <Input
          v-model.number="form.password_expiration_days"
          type="number"
          min="0"
          max="365"
          :label="locale === 'en' ? 'Mandatory renewal (days)' : 'Renouvellement obligatoire (jours)'"
          :icon="Calendar"
          placeholder="90"
        />
      </div>

      <div class="divide-y divide-border overflow-hidden rounded-xl border border-border">
        <!-- Exiger caractères spéciaux -->
        <div class="flex items-center justify-between gap-4 p-4">
          <div>
            <p class="text-xs font-semibold text-text-primary">
              {{ locale === 'en' ? 'Require uppercase, numbers and special characters' : 'Exiger majuscules, chiffres et caractères spéciaux' }}
            </p>
            <p class="mt-0.5 text-[11px] text-text-secondary">
              {{ locale === 'en' ? 'Requires at least one symbol (#, $, @, !), uppercase letter and digit when creating or updating passwords.' : 'Impose au moins un symbole (#, $, @, !), une majuscule et un chiffre lors de la création ou modification du mot de passe.' }}
            </p>
          </div>
          <button
            type="button"
            role="switch"
            :aria-checked="form.require_special_characters"
            @click="form.require_special_characters = !form.require_special_characters"
            class="relative inline-flex h-5 w-10 shrink-0 cursor-pointer items-center rounded-full transition-colors"
            :class="form.require_special_characters ? 'bg-[#0F9D58]' : 'bg-slate-200'"
          >
            <span
              class="inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform"
              :class="form.require_special_characters ? 'translate-x-5' : 'translate-x-1'"
            />
          </button>
        </div>
      </div>
    </div>

    <!-- 3. AUDIT & JOURNALISATION -->
    <div class="p-5">
      <div class="mb-4">
        <div class="flex items-center gap-2">
          <FileText class="h-4 w-4 text-[#0F9D58]" />
          <h5 class="text-xs font-bold text-text-primary">
            {{ locale === 'en' ? 'Action Logging & HSSE Audit' : 'Journalisation des Actions & Audit HSSE' }}
          </h5>
        </div>
        <p class="mt-0.5 text-xs text-text-secondary">
          {{ locale === 'en' ? 'Traceability of consultations, deletions and approvals for regulatory compliance.' : 'Traçabilité des consultations, suppressions et validations pour conformité réglementaire.' }}
        </p>
      </div>

      <div class="divide-y divide-border overflow-hidden rounded-xl border border-border">
        <div class="flex items-center justify-between gap-4 p-4">
          <div>
            <p class="text-xs font-semibold text-text-primary">
              {{ locale === 'en' ? 'Full logging of audit actions' : "Journalisation intégrale des actions d'audit" }}
            </p>
            <p class="mt-0.5 text-[11px] text-text-secondary">
              {{ locale === 'en' ? 'Logs IP address, user, timestamp and action for each validation or modification of VMC records.' : "Enregistre l'adresse IP, l'utilisateur, l'horodatage et l'action pour chaque validation ou modification de fiche VMC." }}
            </p>
          </div>
          <button
            type="button"
            role="switch"
            :aria-checked="form.log_all_actions"
            @click="form.log_all_actions = !form.log_all_actions"
            class="relative inline-flex h-5 w-10 shrink-0 cursor-pointer items-center rounded-full transition-colors"
            :class="form.log_all_actions ? 'bg-[#0F9D58]' : 'bg-slate-200'"
          >
            <span
              class="inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform"
              :class="form.log_all_actions ? 'translate-x-5' : 'translate-x-1'"
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
        {{ locale === 'en' ? 'Save security settings' : 'Enregistrer les paramètres de sécurité' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  Calendar,
  Clock,
  FileText,
  KeyRound,
  Loader2,
  Lock,
  RotateCcw,
  Save,
  ShieldAlert,
  ShieldCheck,
  Timer
} from '@lucide/vue'
import { computed, onMounted, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import Input from '../../../../components/ui/Input.vue'
import settingService from '../../../../core/services/setting.service'
import { toast } from 'vue3-toastify'

const { t, locale } = useI18n()

const defaults = {
  session_timeout_minutes: 120,
  password_min_length: 8,
  password_expiration_days: 90,
  require_special_characters: true,
  max_login_attempts: 5,
  lockout_duration_minutes: 15,
  log_all_actions: true,
}

const form = reactive({ ...defaults })
const initialSnapshot = ref(JSON.stringify(defaults))
const isLoading = ref(false)
const isSaving = ref(false)

const hasChanges = computed(() => JSON.stringify(form) !== initialSnapshot.value)

function loadSettings() {
  isLoading.value = true
  settingService
    .getByGroup('security')
    .then((res: any) => {
      const data = res.data?.data ?? {}
      if (data['security.session_timeout_minutes']?.value !== undefined) {
        form.session_timeout_minutes = Number(data['security.session_timeout_minutes'].value)
      }
      if (data['security.password_min_length']?.value !== undefined) {
        form.password_min_length = Number(data['security.password_min_length'].value)
      }
      if (data['security.password_expiration_days']?.value !== undefined) {
        form.password_expiration_days = Number(data['security.password_expiration_days'].value)
      }
      if (data['security.require_special_characters']?.value !== undefined) {
        form.require_special_characters = Boolean(data['security.require_special_characters'].value)
      }
      if (data['security.max_login_attempts']?.value !== undefined) {
        form.max_login_attempts = Number(data['security.max_login_attempts'].value)
      }
      if (data['security.lockout_duration_minutes']?.value !== undefined) {
        form.lockout_duration_minutes = Number(data['security.lockout_duration_minutes'].value)
      }
      if (data['security.log_all_actions']?.value !== undefined) {
        form.log_all_actions = Boolean(data['security.log_all_actions'].value)
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
      'security.session_timeout_minutes': form.session_timeout_minutes,
      'security.password_min_length': form.password_min_length,
      'security.password_expiration_days': form.password_expiration_days,
      'security.require_special_characters': form.require_special_characters,
      'security.max_login_attempts': form.max_login_attempts,
      'security.lockout_duration_minutes': form.lockout_duration_minutes,
      'security.log_all_actions': form.log_all_actions,
    })
    .then(() => {
      initialSnapshot.value = JSON.stringify(form)
      toast.success(locale.value === 'en' ? 'Security settings saved successfully!' : 'Paramètres de sécurité enregistrés avec succès !')
    })
    .catch(() => {
      toast.error(locale.value === 'en' ? 'Error saving security settings.' : 'Erreur lors de la sauvegarde des paramètres de sécurité.')
    })
    .finally(() => {
      isSaving.value = false
    })
}

onMounted(() => {
  loadSettings()
})
</script>
