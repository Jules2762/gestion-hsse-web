<template>
  <div class="flex flex-col gap-y-6">
    <!-- EN-TÊTE -->
    <div class="border-b border-border p-5">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-base font-bold text-text-primary">Messagerie, Protocoles & Notifications E-mail</h3>
          <p class="mt-1 text-xs text-text-secondary">
            Comportement des liens vers la messagerie, serveur d'envoi SMTP et destinataires en copie automatique.
          </p>
        </div>
        <span class="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-[#0F9D58] ring-1 ring-[#0F9D58]/20">
          <MailCheck class="h-3.5 w-3.5" />
          Passerelle SMTP Active
        </span>
      </div>
    </div>

    <!-- 1. MÉTHODE D'OUVERTURE DES E-MAILS -->
    <div class="border-b border-border p-5">
      <div class="mb-4">
        <div class="flex items-center gap-2">
          <Send class="h-4 w-4 text-[#0F9D58]" />
          <h5 class="text-xs font-bold text-text-primary">Méthode d'Ouverture des Liens E-mail</h5>
        </div>
        <p class="mt-0.5 text-xs text-text-secondary">
          Définissez comment s'ouvrent les adresses e-mail cliquées depuis les fiches d'audit et les profils.
        </p>
      </div>

      <div class="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <!-- Outlook Desktop -->
        <div
          @click="emailOpenMethod = 'OUTLOOK_DESKTOP'"
          class="flex cursor-pointer flex-col justify-between rounded-xl border p-4 transition-all duration-200"
          :class="emailOpenMethod === 'OUTLOOK_DESKTOP'
            ? 'border-[#0F9D58] bg-[#0F9D58]/5 ring-2 ring-[#0F9D58]/20 shadow-xs'
            : 'border-border bg-surface hover:border-[#0F9D58]/40 hover:bg-surface-alt'"
        >
          <div>
            <div class="flex items-center justify-between">
              <span class="inline-flex items-center gap-1.5 text-xs font-semibold text-text-primary">
                <Monitor class="h-4 w-4 text-[#0F9D58]" />
                Outlook Desktop
              </span>
              <span class="rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold text-emerald-800">
                Installé
              </span>
            </div>
            <p class="mt-2 text-[11px] leading-relaxed text-text-secondary">
              Lance directement l'application Microsoft Outlook installée sur le poste de travail.
            </p>
          </div>
          <div class="mt-3 flex items-center justify-between border-t border-border/50 pt-2 text-[11px]">
            <span class="text-text-muted">Recommandé PC</span>
            <div
              class="flex h-4 w-4 items-center justify-center rounded-full border"
              :class="emailOpenMethod === 'OUTLOOK_DESKTOP' ? 'border-[#0F9D58] bg-[#0F9D58] text-white' : 'border-border'"
            >
              <Check v-if="emailOpenMethod === 'OUTLOOK_DESKTOP'" class="h-2.5 w-2.5 stroke-[3]" />
            </div>
          </div>
        </div>

        <!-- Outlook Web -->
        <div
          @click="emailOpenMethod = 'OUTLOOK_WEB'"
          class="flex cursor-pointer flex-col justify-between rounded-xl border p-4 transition-all duration-200"
          :class="emailOpenMethod === 'OUTLOOK_WEB'
            ? 'border-[#0F9D58] bg-[#0F9D58]/5 ring-2 ring-[#0F9D58]/20 shadow-xs'
            : 'border-border bg-surface hover:border-[#0F9D58]/40 hover:bg-surface-alt'"
        >
          <div>
            <div class="flex items-center justify-between">
              <span class="inline-flex items-center gap-1.5 text-xs font-semibold text-text-primary">
                <Globe class="h-4 w-4 text-[#0F9D58]" />
                Outlook Web
              </span>
              <span class="rounded bg-blue-50 px-1.5 py-0.5 text-[10px] font-medium text-blue-700">
                Office 365
              </span>
            </div>
            <p class="mt-2 text-[11px] leading-relaxed text-text-secondary">
              Ouvre un nouvel onglet avec la version Web d'Outlook (portal.office.com).
            </p>
          </div>
          <div class="mt-3 flex items-center justify-between border-t border-border/50 pt-2 text-[11px]">
            <span class="text-text-muted">Navigateur</span>
            <div
              class="flex h-4 w-4 items-center justify-center rounded-full border"
              :class="emailOpenMethod === 'OUTLOOK_WEB' ? 'border-[#0F9D58] bg-[#0F9D58] text-white' : 'border-border'"
            >
              <Check v-if="emailOpenMethod === 'OUTLOOK_WEB'" class="h-2.5 w-2.5 stroke-[3]" />
            </div>
          </div>
        </div>

        <!-- Ask -->
        <div
          @click="emailOpenMethod = 'ASK'"
          class="flex cursor-pointer flex-col justify-between rounded-xl border p-4 transition-all duration-200"
          :class="emailOpenMethod === 'ASK'
            ? 'border-[#0F9D58] bg-[#0F9D58]/5 ring-2 ring-[#0F9D58]/20 shadow-xs'
            : 'border-border bg-surface hover:border-[#0F9D58]/40 hover:bg-surface-alt'"
        >
          <div>
            <div class="flex items-center justify-between">
              <span class="inline-flex items-center gap-1.5 text-xs font-semibold text-text-primary">
                <HelpCircle class="h-4 w-4 text-[#0F9D58]" />
                Demander à chaque fois
              </span>
              <span class="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-700">
                Dialogue
              </span>
            </div>
            <p class="mt-2 text-[11px] leading-relaxed text-text-secondary">
              Affiche un dialogue modal pour choisir la méthode à chaque envoi de message.
            </p>
          </div>
          <div class="mt-3 flex items-center justify-between border-t border-border/50 pt-2 text-[11px]">
            <span class="text-text-muted">Flexible</span>
            <div
              class="flex h-4 w-4 items-center justify-center rounded-full border"
              :class="emailOpenMethod === 'ASK' ? 'border-[#0F9D58] bg-[#0F9D58] text-white' : 'border-border'"
            >
              <Check v-if="emailOpenMethod === 'ASK'" class="h-2.5 w-2.5 stroke-[3]" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 2. EXPÉDITION & SERVEUR SMTP -->
    <div class="border-b border-border p-5">
      <div class="mb-4">
        <div class="flex items-center gap-2">
          <Server class="h-4 w-4 text-[#0F9D58]" />
          <h5 class="text-xs font-bold text-text-primary">Serveur d'Envoi SMTP & Expéditeur Officiel</h5>
        </div>
        <p class="mt-0.5 text-xs text-text-secondary">
          Paramètres de connexion utilisés par la plateforme pour émettre les alertes automatiques.
        </p>
      </div>

      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-4">
        <Input v-model="smtpForm.from_name" label="Nom affiché de l'expéditeur" :icon="User" placeholder="Galana HSSE Système" />
        <Input v-model="smtpForm.from_email" type="email" label="Adresse d'expédition (From)" :icon="Mail" placeholder="no-reply-hsse@galana.mg" />
      </div>

      <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Input v-model="smtpForm.smtp_host" label="Hôte SMTP" :icon="Server" placeholder="smtp.office365.com" />
        <Input v-model.number="smtpForm.smtp_port" type="number" label="Port SMTP" :icon="Hash" placeholder="587" />
        <Select v-model="smtpForm.smtp_encryption" label="Chiffrement" :icon="Lock" :options="encryptionOptions" />
      </div>
    </div>

    <!-- 3. DESTINATAIRES EN COPIE (CC) -->
    <div class="p-5">
      <div class="mb-4">
        <div class="flex items-center gap-2">
          <Users class="h-4 w-4 text-[#0F9D58]" />
          <h5 class="text-xs font-bold text-text-primary">Destinataires en Copie Permanente (CC)</h5>
        </div>
        <p class="mt-0.5 text-xs text-text-secondary">
          Ces rôles reçoivent systématiquement une copie des alertes d'assignation et de clôture d'actions correctives.
        </p>
      </div>

      <div class="flex gap-2">
        <select
          v-model="selectedRecipientId"
          class="flex-1 rounded-xl border border-border bg-surface px-3 py-2 text-xs text-text-primary focus:border-[#0F9D58] focus:outline-hidden"
        >
          <option :value="undefined">Sélectionner un rôle à ajouter en copie...</option>
          <option v-for="recipient in selectableRecipients" :key="recipient.id" :value="recipient.id">
            {{ recipient.label }}
          </option>
        </select>

        <button
          @click="addRecipient"
          :disabled="!selectedRecipientId"
          class="inline-flex items-center gap-1.5 rounded-xl bg-[#0F9D58] px-4 py-2 text-xs font-semibold text-white shadow-2xs transition hover:bg-[#0c8248] disabled:opacity-40"
        >
          <Plus :size="16" />
          Ajouter
        </button>
      </div>

      <div v-if="selectedRecipients.length" class="mt-3 flex flex-wrap gap-2">
        <div
          v-for="recipient in selectedRecipients"
          :key="recipient.id"
          class="inline-flex items-center gap-2 rounded-full border border-[#0F9D58]/30 bg-[#0F9D58]/5 px-3 py-1 text-xs font-medium text-text-primary"
        >
          <span>{{ recipient.label }}</span>
          <button
            @click="removeRecipient(recipient.id)"
            class="rounded-full p-0.5 text-text-muted hover:bg-danger/10 hover:text-danger"
          >
            <X :size="13" />
          </button>
        </div>
      </div>

      <p v-else class="mt-3 text-xs text-text-muted">
        Aucun destinataire permanent configuré en copie.
      </p>
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
        Annuler
      </button>

      <button
        type="button"
        :disabled="!hasChanges || isSaving"
        @click="save"
        class="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#0F9D58] px-4 py-2 text-xs font-semibold text-white shadow-2xs transition hover:bg-[#0c8248] disabled:opacity-50"
      >
        <Loader2 v-if="isSaving" class="h-3.5 w-3.5 animate-spin" />
        <Save v-else class="h-3.5 w-3.5" />
        Enregistrer les paramètres e-mail
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  Check,
  Globe,
  Hash,
  HelpCircle,
  Loader2,
  Lock,
  Mail,
  MailCheck,
  Monitor,
  Plus,
  RotateCcw,
  Save,
  Send,
  Server,
  User,
  Users,
  X
} from '@lucide/vue'
import { computed, onMounted, reactive, ref } from 'vue'
import Input from '../../../../components/ui/Input.vue'
import Select from '../../../../components/ui/Select.vue'
import settingService from '../../../../core/services/setting.service'
import { toast } from 'vue3-toastify'

type EmailOpenMethodType = 'OUTLOOK_DESKTOP' | 'OUTLOOK_WEB' | 'ASK'

const emailOpenMethod = ref<EmailOpenMethodType>('OUTLOOK_DESKTOP')
const savedEmailOpenMethod = ref<EmailOpenMethodType>('OUTLOOK_DESKTOP')

const encryptionOptions = [
  { label: 'TLS (Recommandé - Port 587)', value: 'tls' },
  { label: 'SSL (Port 465)', value: 'ssl' },
  { label: 'Aucun (Port 25)', value: 'none' }
]

const smtpDefaults = {
  from_name: 'Galana HSSE Système',
  from_email: 'no-reply-hsse@galana.mg',
  smtp_host: 'smtp.office365.com',
  smtp_port: 587,
  smtp_encryption: 'tls'
}

const smtpForm = reactive({ ...smtpDefaults })
const initialSmtpSnapshot = ref(JSON.stringify(smtpDefaults))

type RecipientType = {
  id: number
  label: string
}

const availableRecipients = ref<RecipientType[]>([
  { id: 1, label: 'Responsable hiérarchique du déclarant' },
  { id: 2, label: 'Responsable HSSE Galana' },
  { id: 3, label: 'Directeur d’exploitation de site' },
  { id: 4, label: 'Administrateurs du système' }
])

const selectedRecipients = ref<RecipientType[]>([
  { id: 1, label: 'Responsable hiérarchique du déclarant' },
  { id: 2, label: 'Responsable HSSE Galana' }
])
const savedRecipientIds = ref<number[]>([1, 2])
const selectedRecipientId = ref<number>()

const selectableRecipients = computed(() =>
  availableRecipients.value.filter(
    available => !selectedRecipients.value.some(selected => selected.id === available.id)
  )
)

function addRecipient() {
  const recipient = selectableRecipients.value.find(item => item.id === selectedRecipientId.value)
  if (!recipient) return
  selectedRecipients.value.push(recipient)
  selectedRecipientId.value = undefined
}

function removeRecipient(id: number) {
  selectedRecipients.value = selectedRecipients.value.filter(item => item.id !== id)
}

const isSaving = ref(false)

const hasChanges = computed(() => {
  if (emailOpenMethod.value !== savedEmailOpenMethod.value) return true
  if (JSON.stringify(smtpForm) !== initialSmtpSnapshot.value) return true

  const currentIds = selectedRecipients.value.map(r => r.id).sort()
  const savedIds = [...savedRecipientIds.value].sort()
  return JSON.stringify(currentIds) !== JSON.stringify(savedIds)
})

function loadSettings() {
  settingService.getByGroup('email')
    .then((res: any) => {
      const data = res.data?.data ?? {}
      if (data['email.open_method']?.value) {
        emailOpenMethod.value = data['email.open_method'].value
        savedEmailOpenMethod.value = emailOpenMethod.value
      }
      if (data['email.from_name']?.value) smtpForm.from_name = data['email.from_name'].value
      if (data['email.from_email']?.value) smtpForm.from_email = data['email.from_email'].value
      if (data['email.smtp_host']?.value) smtpForm.smtp_host = data['email.smtp_host'].value
      if (data['email.smtp_port']?.value !== undefined) smtpForm.smtp_port = Number(data['email.smtp_port'].value)
      if (data['email.smtp_encryption']?.value) smtpForm.smtp_encryption = data['email.smtp_encryption'].value

      initialSmtpSnapshot.value = JSON.stringify(smtpForm)
    })
    .catch(() => {})
}

function resetForm() {
  emailOpenMethod.value = savedEmailOpenMethod.value
  selectedRecipients.value = availableRecipients.value.filter(recipient =>
    savedRecipientIds.value.includes(recipient.id)
  )
  selectedRecipientId.value = undefined
  Object.assign(smtpForm, JSON.parse(initialSmtpSnapshot.value))
}

function save() {
  isSaving.value = true
  settingService.update({
    'email.open_method': emailOpenMethod.value,
    'email.from_name': smtpForm.from_name,
    'email.from_email': smtpForm.from_email,
    'email.smtp_host': smtpForm.smtp_host,
    'email.smtp_port': smtpForm.smtp_port,
    'email.smtp_encryption': smtpForm.smtp_encryption,
  })
    .then(() => {
      savedEmailOpenMethod.value = emailOpenMethod.value
      savedRecipientIds.value = selectedRecipients.value.map(r => r.id)
      initialSmtpSnapshot.value = JSON.stringify(smtpForm)
      toast.success('Paramètres e-mail enregistrés avec succès !')
    })
    .catch(() => {
      toast.error("Erreur lors de l'enregistrement des paramètres e-mail.")
    })
    .finally(() => {
      isSaving.value = false
    })
}

onMounted(() => {
  loadSettings()
})
</script>