<!-- src/views/home/profile/ProfilePage.vue -->
<script setup lang="ts">
import {
  MailIcon,
  Loader2,
  Phone,
  CalendarDays,
  X,
  ShieldCheck,
  CheckCircle2,
  KeyRound,
  Building2,
  UserCheck,
  Sparkles,
  Copy,
  Check,
  HardHat,
  ShieldAlert,
  UserPen,
  Headphones,
  CheckCircle,
  Hash,
  Eye,
  EyeOff,
  Lock
} from '@lucide/vue'
import Header from '../../../components/shared/Header.vue'
import Button from '../../../components/ui/Button.vue'
import Card from '../../../components/features/dashboard/Card.vue'
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import RolePermissionSection from '../../../components/features/profile/RolePermissionSection.vue'
import OverviewSection from '../../../components/features/profile/OverviewSection.vue'
import SecuritySection from '../../../components/features/profile/SecuritySection.vue'
import RecentActivitySection from '../../../components/features/profile/RecentActivitySection.vue'
import { UserRoleDataJson, UserStatusJsonData } from '../../../@data/User.data.ts'
import { useUserService } from '../../../core/services/user.service.ts'
import { useRoute } from 'vue-router'
import Input from '../../../components/ui/Input.vue'
import { toast } from 'vue3-toastify'

export interface ProfileUser {
  id?: string | number
  first_name: string
  last_name: string
  email: string
  phone_number?: string
  department?: string
  job?: string
  role: string
  status: string
  permissions: string[]
  avatar?: string | null
  bio?: string
  created_at?: string
}

const { t, locale } = useI18n()

const tab_profile = computed(() => [
  { label: t('profile.tabs.overview', 'Coordonnées & Organisation'), id: 0 },
  { label: t('profile.tabs.roles', 'Rôles & Habilitations'), id: 1 },
  { label: t('profile.tabs.security', 'Sécurité & Conformité HSSE'), id: 2 }
])
const selected_tab = ref(0)
const copiedHeaderField = ref<string | null>(null)

function copyText(text: string | undefined, key: string) {
  if (!text) return
  navigator.clipboard.writeText(text).then(() => {
    copiedHeaderField.value = key
    toast.success(locale.value === 'en' ? 'Copied to clipboard' : 'Copié dans le presse-papier')
    setTimeout(() => {
      if (copiedHeaderField.value === key) {
        copiedHeaderField.value = null
      }
    }, 2000)
  })
}

/*
|--------------------------------------------------------------------------
| CHARGEMENT DU PROFIL
|--------------------------------------------------------------------------
*/

const service = useUserService()
const isLoading = ref(false)
const loadError = ref("")

const user = ref<ProfileUser>({
  first_name: "",
  last_name: "",
  email: "",
  role: "USER",
  status: "ENABLED",
  permissions: [],
})
const route = useRoute()

function getProfile() {
  isLoading.value = true
  loadError.value = ""

  const rawId = route.params.id as string | undefined
  const targetId = rawId && rawId !== 'undefined' && rawId !== 'null' ? rawId : undefined

  service
    .getProfile(targetId)
    .then((res: any) => {
      user.value = {
        ...user.value,
        ...res.data,
        permissions: res.data.permissions ?? [],
      }
      if (user.value.id) {
        getPermission(user.value.id)
      }
    })
    .catch(() => {
      loadError.value = "Impossible de charger les informations du profil utilisateur."
    })
    .finally(() => {
      isLoading.value = false
    })
}

const fullName = computed(() => {
  const full = `${user.value.first_name} ${user.value.last_name || ''}`.trim()
  return full.length > 0 ? full : "Utilisateur Galana"
})

const userInitials = computed(() => {
  const f = user.value.first_name ? user.value.first_name[0] : 'U'
  const l = user.value.last_name ? user.value.last_name[0] : ''
  return `${f}${l}`.toUpperCase()
})

const statusInfo = computed(() => {
  const active = user.value.status === 'ACTIVE' || user.value.status === 'ENABLED'
  return {
    label: active ? t('status.ENABLED', 'Actif') : t('status.DISABLED', 'Désactivé'),
    active
  }
})

const roleLabel = computed(() => {
  const isEn = locale.value === 'en'
  const r = (user.value.role || '').toUpperCase()
  if (r === 'ADMIN') return isEn ? 'Administrator' : 'Administrateur'
  if (r === 'USER') return isEn ? 'User' : 'Utilisateur'
  const match = (UserRoleDataJson as { value: string; label: string }[])?.find(
    (item) => item.value === user.value.role
  )
  return match?.label ?? user.value.role ?? (isEn ? 'User' : 'Utilisateur')
})

const memberSince = computed(() => {
  if (!user.value.created_at) return null
  try {
    return new Intl.DateTimeFormat(locale.value === 'en' ? 'en-US' : 'fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(new Date(user.value.created_at))
  } catch {
    return null
  }
})

function getPermission(id: string | number) {
  service
    .getPermissions(id)
    .then((res) => {
      user.value.permissions = res.data ?? []
    })
    .catch((err) => {
      console.error('Erreur permissions:', err)
    })
}

onMounted(() => {
  getProfile()
})

watch(
  () => route.params.id,
  () => {
    getProfile()
  }
)

/*
|--------------------------------------------------------------------------
| MODAL DE MISE A JOUR DU PROFIL
|--------------------------------------------------------------------------
*/

const showEditModal = ref(false)
const isSubmitting = ref(false)
const submitError = ref("")

const editForm = reactive({
  first_name: "",
  last_name: "",
  phone_number: "",
  bio: "",
})

function openEditModal() {
  editForm.first_name = user.value.first_name ?? ""
  editForm.last_name = user.value.last_name ?? ""
  editForm.phone_number = user.value.phone_number ?? ""
  editForm.bio = user.value.bio ?? ""
  submitError.value = ""
  showEditModal.value = true
}

function closeEditModal() {
  if (isSubmitting.value) return
  showEditModal.value = false
}

function submitEditModal() {
  if (!editForm.first_name.trim()) {
    submitError.value = "Le prénom est obligatoire."
    return
  }

  isSubmitting.value = true
  submitError.value = ""

  service
    .updateProfile(user.value.id as string, { ...editForm })
    .then((res: any) => {
      user.value = {
        ...user.value,
        ...editForm,
        ...(res?.data ?? {}),
      }
      toast.success("Profil mis à jour avec succès !")
      showEditModal.value = false
    })
    .catch(() => {
      submitError.value = "Impossible de mettre à jour le profil."
      toast.error("Erreur lors de la mise à jour du profil.")
    })
    .finally(() => {
      isSubmitting.value = false
    })
}

/*
|--------------------------------------------------------------------------
| MODAL DE MODIFICATION DU MOT DE PASSE
|--------------------------------------------------------------------------
*/

const showPasswordModal = ref(false)
const isSubmittingPassword = ref(false)
const passwordSubmitError = ref("")
const passwordFieldErrors = ref<Record<string, string[]>>({})

const showCurrentPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)

const passwordForm = reactive({
  current_password: "",
  password: "",
  password_confirmation: "",
})

function openPasswordModal() {
  passwordForm.current_password = ""
  passwordForm.password = ""
  passwordForm.password_confirmation = ""
  passwordSubmitError.value = ""
  passwordFieldErrors.value = {}
  showCurrentPassword.value = false
  showNewPassword.value = false
  showConfirmPassword.value = false
  showPasswordModal.value = true
}

function closePasswordModal() {
  if (isSubmittingPassword.value) return
  showPasswordModal.value = false
}

function submitPasswordModal() {
  passwordSubmitError.value = ""
  passwordFieldErrors.value = {}

  if (!passwordForm.current_password) {
    passwordSubmitError.value = "Le mot de passe actuel est obligatoire."
    return
  }
  if (!passwordForm.password) {
    passwordSubmitError.value = "Le nouveau mot de passe est obligatoire."
    return
  }
  if (passwordForm.password.length < 8) {
    passwordSubmitError.value = "Le nouveau mot de passe doit comporter au moins 8 caractères."
    return
  }
  if (passwordForm.password !== passwordForm.password_confirmation) {
    passwordSubmitError.value = "La confirmation du mot de passe ne correspond pas."
    return
  }
  if (passwordForm.password === passwordForm.current_password) {
    passwordSubmitError.value = "Le nouveau mot de passe doit être différent du mot de passe actuel."
    return
  }

  isSubmittingPassword.value = true

  service
    .updatePassword({ ...passwordForm })
    .then((res: any) => {
      toast.success(res?.data?.message || "Mot de passe modifié avec succès !")
      closePasswordModal()
    })
    .catch((err: any) => {
      if (err?.response?.data?.errors) {
        passwordFieldErrors.value = err.response.data.errors
        passwordSubmitError.value = err.response.data.message || "Veuillez corriger les erreurs."
      } else {
        passwordSubmitError.value = err?.response?.data?.message || "Impossible de modifier le mot de passe."
      }
      toast.error(passwordSubmitError.value)
    })
    .finally(() => {
      isSubmittingPassword.value = false
    })
}
</script>

<template>
  <div class="min-h-screen bg-slate-50/50 pb-12">
    <!-- ENTETE PRINCIPALE -->
    <Header
      title="profile.title"
      :thumbnails="[
        {
          label: 'thumbnails.home',
          name: 'DASHBOARD'
        },
        {
          label: 'thumbnails.profile',
          name: 'PROFILE'
        }
      ]"
    />

    <!-- ETAT DE CHARGEMENT / ERREUR -->
    <div
      v-if="isLoading"
      class="flex flex-col items-center justify-center py-28 text-slate-500"
    >
      <Loader2 class="h-8 w-8 animate-spin text-[#0F9D58] mb-3" />
      <p class="text-sm font-medium">Chargement des données du profil...</p>
    </div>

    <div
      v-else-if="loadError"
      class="mx-6 my-6 rounded-xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700 shadow-xs"
    >
      <div class="flex items-center gap-2 font-bold mb-1">
        <ShieldAlert class="h-4 w-4" />
        Erreur de chargement
      </div>
      <p>{{ loadError }}</p>
      <button
        @click="getProfile"
        class="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-700"
      >
        Réessayer
      </button>
    </div>

    <!-- CONTENU PRINCIPAL DU PROFIL -->
    <div v-else class="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      <!-- 1. HERO BANNER EXECUTIVE CORPORATE -->
      <div class="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <!-- Bandeau supérieur style Corporate Galana avec dégradé pétrole & émeraude -->
        <div class="h-36 sm:h-44 bg-gradient-to-r from-slate-900 via-slate-800 to-[#0c3924] relative px-6 flex items-end">
          <!-- Motifs en arrière-plan -->
          <div class="absolute inset-0 opacity-15 bg-[radial-gradient(#0F9D58_1px,transparent_1px)] [background-size:16px_16px]"></div>
          
          <!-- Badge d'accréditation en haut à droite -->
          <div class="absolute top-4 right-4 sm:top-5 sm:right-6 flex items-center gap-2">
            <span class="inline-flex items-center gap-1.5 rounded-full bg-slate-900/80 backdrop-blur-xs px-3 py-1 text-xs font-semibold text-emerald-400 border border-emerald-500/30">
              <span class="h-2 w-2 rounded-full bg-[#0F9D58] animate-pulse"></span>
              Galana HSSE Portal
            </span>
          </div>
        </div>

        <!-- Corps du profil avec Avatar chevauchant -->
        <div class="px-6 pb-6 pt-0">
          <div class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 -mt-14 sm:-mt-16 mb-5">
            <!-- Avatar & Identité -->
            <div class="flex flex-col sm:flex-row items-center sm:items-end gap-4 text-center sm:text-left">
              <!-- Avatar avec bague et statut -->
              <div class="relative">
                <img
                  v-if="user.avatar"
                  :src="user.avatar"
                  alt="Avatar"
                  class="h-28 w-28 sm:h-32 sm:sm-32 rounded-2xl object-cover ring-4 ring-white shadow-md bg-white"
                />
                <div
                  v-else
                  class="h-28 w-28 sm:h-32 sm:w-32 rounded-2xl ring-4 ring-white shadow-md bg-gradient-to-br from-emerald-600 to-teal-800 flex items-center justify-center text-white font-black text-3xl select-none"
                >
                  {{ userInitials }}
                </div>

                <!-- Indicateur de statut en coin -->
                <span
                  class="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full ring-2 ring-white"
                  :class="statusInfo.active ? 'bg-emerald-500' : 'bg-rose-500'"
                  :title="statusInfo.label"
                >
                  <Check v-if="statusInfo.active" class="h-3.5 w-3.5 text-white stroke-[3]" />
                  <X v-else class="h-3.5 w-3.5 text-white stroke-[3]" />
                </span>
              </div>

              <!-- Noms, fonction & statut -->
              <div class="pt-2 sm:pt-0">
                <div class="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h1 class="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                    {{ fullName }}
                  </h1>
                  <span
                    class="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold"
                    :class="
                      statusInfo.active
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    "
                  >
                    <span
                      class="h-1.5 w-1.5 rounded-full"
                      :class="statusInfo.active ? 'bg-emerald-500' : 'bg-rose-500'"
                    />
                    {{ statusInfo.label }}
                  </span>
                </div>

                <div class="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-1.5 text-xs text-slate-600">
                  <span class="font-semibold text-slate-800">{{ user.job || (locale === 'en' ? 'Position not specified' : 'Fonction non spécifiée') }}</span>
                  <span class="text-slate-300">•</span>
                  <span class="inline-flex items-center gap-1 font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                    <Building2 class="h-3 w-3" />
                    {{ user.department || (locale === 'en' ? 'HSSE Department' : 'Département HSSE') }}
                  </span>
                  <span class="text-slate-300">•</span>
                  <span class="inline-flex items-center gap-1 font-medium text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                    <ShieldCheck class="h-3 w-3" />
                    {{ roleLabel }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Boutons d'action -->
            <div class="flex flex-wrap items-center justify-center sm:justify-end shrink-0 gap-2">
              <button
                type="button"
                @click="openPasswordModal"
                class="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-700 shadow-xs transition hover:bg-slate-50 hover:text-slate-900 cursor-pointer"
              >
                <KeyRound class="h-4 w-4 text-[#0F9D58]" />
                <span>{{ locale === 'en' ? 'Password' : 'Mot de passe' }}</span>
              </button>

              <button
                type="button"
                @click="openEditModal"
                class="inline-flex items-center gap-2 rounded-xl bg-[#0F9D58] px-4 py-2.5 text-xs font-semibold text-white shadow-xs transition hover:bg-[#0c8248] hover:shadow-sm cursor-pointer"
              >
                <UserPen class="h-4 w-4" />
                <span>{{ locale === 'en' ? 'Edit profile' : 'Modifier le profil' }}</span>
              </button>
            </div>
          </div>

          <!-- Puce coordonnées directes rapides -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-4 border-t border-slate-100 text-xs">
            <!-- Email -->
            <div class="flex items-center justify-between rounded-lg bg-slate-50/80 px-3 py-2 border border-slate-100">
              <div class="flex items-center gap-2 min-w-0">
                <MailIcon class="h-3.5 w-3.5 text-slate-400 shrink-0" />
                <span class="truncate text-slate-700 font-medium">{{ user.email || (locale === 'en' ? 'Not specified' : 'Non renseigné') }}</span>
              </div>
              <button
                v-if="user.email"
                type="button"
                @click="copyText(user.email, 'email')"
                :title="locale === 'en' ? 'Copy email' : 'Copier l\'e-mail'"
                class="text-slate-400 hover:text-slate-700 ml-1.5 shrink-0"
              >
                <Check v-if="copiedHeaderField === 'email'" class="h-3.5 w-3.5 text-emerald-600" />
                <Copy v-else class="h-3.5 w-3.5" />
              </button>
            </div>

            <!-- Téléphone -->
            <div class="flex items-center justify-between rounded-lg bg-slate-50/80 px-3 py-2 border border-slate-100">
              <div class="flex items-center gap-2 min-w-0">
                <Phone class="h-3.5 w-3.5 text-slate-400 shrink-0" />
                <span class="truncate text-slate-700 font-medium">{{ user.phone_number || (locale === 'en' ? 'Phone not specified' : 'Téléphone non renseigné') }}</span>
              </div>
              <button
                v-if="user.phone_number"
                type="button"
                @click="copyText(user.phone_number, 'phone')"
                :title="locale === 'en' ? 'Copy phone' : 'Copier le téléphone'"
                class="text-slate-400 hover:text-slate-700 ml-1.5 shrink-0"
              >
                <Check v-if="copiedHeaderField === 'phone'" class="h-3.5 w-3.5 text-emerald-600" />
                <Copy v-else class="h-3.5 w-3.5" />
              </button>
            </div>

            <!-- Membre depuis -->
            <div class="flex items-center justify-between rounded-lg bg-slate-50/80 px-3 py-2 border border-slate-100">
              <div class="flex items-center gap-2 min-w-0">
                <CalendarDays class="h-3.5 w-3.5 text-slate-400 shrink-0" />
                <span class="truncate text-slate-700 font-medium">
                  {{ memberSince ? (locale === 'en' ? `Member since ${memberSince}` : `Inscrit le ${memberSince}`) : (locale === 'en' ? 'Active Galana account' : 'Compte actif Galana') }}
                </span>
              </div>
              <span class="h-2 w-2 rounded-full bg-emerald-500 shrink-0"></span>
            </div>
          </div>
        </div>
      </div>

      <!-- 2. KPI CARDS RÉSUMÉ EXÉCUTIF (Couleurs foncées conformes) -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card
          :title="locale === 'en' ? 'Account Status' : 'État du Compte'"
          :value="statusInfo.label"
          :subtitle="locale === 'en' ? 'Certified & HSSE compliant access' : 'Accès certifié & conforme HSSE'"
          theme="green"
          :icon="CheckCircle2"
        />

        <Card
          :title="locale === 'en' ? 'System Accreditation' : 'Accréditation Système'"
          :value="roleLabel"
          :subtitle="locale === 'en' ? 'Active privilege level' : 'Niveau de privilèges actif'"
          theme="blue"
          :icon="ShieldCheck"
        />

        <Card
          :title="locale === 'en' ? 'Active Permissions' : 'Habilitations Actives'"
          :value="user.permissions?.length ?? 0"
          :unit="locale === 'en' ? 'rights' : 'droits'"
          :subtitle="locale === 'en' ? 'Across all system modules' : 'Répartis sur l’ensemble des modules'"
          theme="indigo"
          :icon="KeyRound"
          clickable
          @click="selected_tab = 1"
        />

        <Card
          :title="locale === 'en' ? 'Pole Attachment' : 'Rattachement Pôle'"
          :value="user.department || 'HSSE'"
          :subtitle="user.job || (locale === 'en' ? 'Operational function' : 'Fonction opérationnelle')"
          theme="teal"
          :icon="Building2"
        />
      </div>

      <!-- 3. MAIN SECTION GRID (ONGLETS À GAUCHE, ACTIVITÉ ET CHARTE À DROITE) -->
      <div class="grid grid-cols-1 lg:grid-cols-6 gap-6 items-start">
        <!-- COLONNE PRINCIPALE DES ONGLETS (4 COLS) -->
        <div class="lg:col-span-4 flex flex-col gap-4">
          <!-- Barre d'onglets épurée -->
          <div class="flex items-center gap-2 border-b border-slate-200 bg-white rounded-xl px-3 pt-2 shadow-xs">
            <button
              v-for="item in tab_profile"
              :key="item.id"
              type="button"
              @click="selected_tab = item.id"
              class="relative pb-3 pt-2 px-3 text-xs font-semibold transition cursor-pointer"
              :class="
                selected_tab === item.id
                  ? 'text-[#0F9D58]'
                  : 'text-slate-600 hover:text-slate-900'
              "
            >
              {{ item.label }}
              <!-- Indicateur souligné émeraude -->
              <span
                v-if="selected_tab === item.id"
                class="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0F9D58] rounded-full"
              ></span>
            </button>
          </div>

          <!-- Contenu des onglets -->
          <div>
            <template v-if="selected_tab === 0">
              <OverviewSection
                :user="user"
                @go-to-tab="selected_tab = $event"
                @open-edit="openEditModal"
              />
            </template>

            <template v-if="selected_tab === 1">
              <RolePermissionSection :user="user" />
            </template>

            <template v-if="selected_tab === 2">
              <SecuritySection :user="user" @open-password-modal="openPasswordModal" />
            </template>
          </div>
        </div>

        <!-- COLONNE LATERALE (2 COLS) : HISTORIQUE ET CHARTE HSSE -->
        <div class="lg:col-span-2 flex flex-col gap-5">
          <!-- WIDGET 1 : JOURNAL D'ACTIVITE RECENTE -->
          <RecentActivitySection :user-id="user.id" />

          <!-- WIDGET 2 : ENGAGEMENT HSSE & SUPPORT -->
          <div class="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
            <div class="flex items-center gap-2 mb-3">
              <div class="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-[#0F9D58]">
                <HardHat class="h-4 w-4" />
              </div>
              <h4 class="text-sm font-bold text-slate-800">{{ locale === 'en' ? 'Quality & HSSE Commitment' : 'Engagement Qualité & HSSE' }}</h4>
            </div>

            <p class="text-xs text-slate-600 leading-relaxed mb-4">
              {{ locale === 'en' ? 'Compliance with Galana HSSE requirements guarantees the protection of our employees, facility safety, and environmental preservation.' : 'La conformité aux exigences HSSE de Galana garantit la protection de nos collaborateurs, la sûreté des installations et la préservation de l\'environnement.' }}
            </p>

            <div class="space-y-2 border-t border-slate-100 pt-3 text-xs">
              <div class="flex items-center justify-between text-slate-700">
                <span class="flex items-center gap-1.5 text-slate-500">
                  <Headphones class="h-3.5 w-3.5 text-emerald-600" />
                  {{ locale === 'en' ? 'HSSE Support:' : 'Assistance HSSE :' }}
                </span>
                <span class="font-semibold text-slate-800">{{ locale === 'en' ? 'Ext 404 / IT Dept' : 'Poste 404 / DSI' }}</span>
              </div>
              <div class="flex items-center justify-between text-slate-700">
                <span class="flex items-center gap-1.5 text-slate-500">
                  <ShieldCheck class="h-3.5 w-3.5 text-blue-600" />
                  {{ locale === 'en' ? 'Protocol:' : 'Protocole :' }}
                </span>
                <span class="font-semibold text-emerald-700">{{ locale === 'en' ? 'Zero Incident' : 'Zéro Incident' }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- MODAL DE MISE A JOUR DU PROFIL -->
    <Teleport to="body">
      <div
        v-if="showEditModal"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <!-- Overlay avec léger flou moderne -->
        <div
          class="absolute inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
          @click="closeEditModal"
        ></div>

        <div
          class="relative w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl max-h-[90vh] overflow-y-auto"
        >
          <!-- En-tete du modal -->
          <div class="flex items-center justify-between border-b border-slate-100 pb-4">
            <div class="flex items-center gap-3">
              <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-[#0F9D58]">
                <UserPen class="h-5 w-5" />
              </div>
              <div>
                <h3 class="text-base font-bold text-slate-900">{{ locale === 'en' ? 'Update my profile' : 'Mettre à jour mon profil' }}</h3>
                <p class="text-xs text-slate-500">{{ locale === 'en' ? 'Modify your contact information and biography' : 'Modifiez vos informations de contact et votre biographie' }}</p>
              </div>
            </div>
            <button
              @click="closeEditModal"
              type="button"
              class="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition cursor-pointer"
            >
              <X :size="18" />
            </button>
          </div>

          <!-- Formulaire -->
          <form @submit.prevent="submitEditModal" class="mt-5 space-y-4">
            <div
              v-if="submitError"
              class="rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700 font-medium"
            >
              {{ submitError }}
            </div>

            <!-- Avatar Preview info -->
            <div class="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/70 p-3">
              <div
                class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#0F9D58] font-bold text-white shadow-2xs text-lg select-none"
              >
                {{ userInitials }}
              </div>
              <div class="text-xs">
                <p class="font-semibold text-slate-800">{{ fullName }}</p>
                <p class="text-slate-500">{{ user.email }}</p>
              </div>
            </div>

            <!-- Champs Nom & Prénom -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                v-model="editForm.first_name"
                required
                type="text"
                :label="locale === 'en' ? 'First name *' : 'Prénom *'"
                :placeholder="locale === 'en' ? 'Your first name' : 'Votre prénom'"
              />
              <Input
                v-model="editForm.last_name"
                type="text"
                :label="locale === 'en' ? 'Last name' : 'Nom de famille'"
                :placeholder="locale === 'en' ? 'Your last name' : 'Votre nom'"
              />
            </div>

            <!-- Téléphone -->
            <Input
              v-model="editForm.phone_number"
              type="tel"
              :label="locale === 'en' ? 'Service phone number' : 'Numéro de téléphone de service'"
              placeholder="+261 34 00 000 00"
            />

            <!-- Bio -->
            <div class="flex flex-col gap-1.5">
              <div class="flex items-center justify-between">
                <label class="text-xs font-semibold text-slate-700">{{ locale === 'en' ? 'About / Introduction' : 'À propos / Présentation' }}</label>
                <span class="text-[11px] text-slate-400">{{ editForm.bio?.length || 0 }}/300 {{ locale === 'en' ? 'chars' : 'car.' }}</span>
              </div>
              <textarea
                v-model="editForm.bio"
                rows="3"
                maxlength="300"
                :placeholder="locale === 'en' ? 'Briefly describe your missions or role within the Galana HSSE team...' : 'Présentez brièvement vos missions ou votre rôle au sein de l\'équipe HSSE Galana...'"
                class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 placeholder-slate-400 transition focus:border-[#0F9D58] focus:outline-none focus:ring-1 focus:ring-[#0F9D58]"
              ></textarea>
            </div>

            <!-- Notice email / role -->
            <p class="text-[11px] text-slate-400 leading-tight">
              {{ locale === 'en' ? 'Note: Work email, department assignment, and system permissions are managed by IT administrators.' : 'Note : L\'adresse e-mail professionnelle, l\'affectation de département et les habilitations système sont gérées par les administrateurs DSI.' }}
            </p>

            <!-- Actions buttons -->
            <div class="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
              <Button
                type="button"
                variant="outline"
                @click="closeEditModal"
                :disabled="isSubmitting"
              >
                {{ t('common.cancel', 'Annuler') }}
              </Button>
              <button
                type="submit"
                :disabled="isSubmitting"
                class="inline-flex items-center gap-1.5 rounded-lg bg-[#0F9D58] px-4 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-[#0c8248] disabled:opacity-50 cursor-pointer"
              >
                <Loader2 v-if="isSubmitting" class="h-4 w-4 animate-spin" />
                <CheckCircle v-else class="h-4 w-4" />
                <span>{{ isSubmitting ? (locale === 'en' ? 'Saving...' : 'Enregistrement...') : (locale === 'en' ? 'Save' : 'Enregistrer') }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- MODAL DE CHANGEMENT DU MOT DE PASSE -->
    <Teleport to="body">
      <div
        v-if="showPasswordModal"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <!-- Overlay -->
        <div
          class="absolute inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
          @click="closePasswordModal"
        ></div>

        <div
          class="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl max-h-[90vh] overflow-y-auto"
        >
          <!-- En-tête -->
          <div class="flex items-center justify-between border-b border-slate-100 pb-4">
            <div class="flex items-center gap-3">
              <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-[#0F9D58]">
                <KeyRound class="h-5 w-5" />
              </div>
              <div>
                <h3 class="text-base font-bold text-slate-900">{{ locale === 'en' ? 'Change password' : 'Modifier le mot de passe' }}</h3>
                <p class="text-xs text-slate-500">{{ locale === 'en' ? 'Secure access to your Galana account' : 'Sécurisez l\'accès à votre compte Galana' }}</p>
              </div>
            </div>
            <button
              @click="closePasswordModal"
              type="button"
              class="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition cursor-pointer"
            >
              <X :size="18" />
            </button>
          </div>

          <!-- Formulaire -->
          <form @submit.prevent="submitPasswordModal" class="mt-5 space-y-4">
            <div
              v-if="passwordSubmitError"
              class="rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700 font-medium"
            >
              {{ passwordSubmitError }}
            </div>

            <!-- Mot de passe actuel -->
            <div class="space-y-1.5">
              <label class="block text-xs font-semibold text-slate-700">{{ locale === 'en' ? 'Current password *' : 'Mot de passe actuel *' }}</label>
              <div class="relative flex items-center">
                <input
                  v-model="passwordForm.current_password"
                  :type="showCurrentPassword ? 'text' : 'password'"
                  required
                  :placeholder="locale === 'en' ? 'Your current password' : 'Votre mot de passe actuel'"
                  class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 pr-10 text-xs text-slate-800 placeholder-slate-400 transition focus:border-[#0F9D58] focus:outline-none focus:ring-1 focus:ring-[#0F9D58]"
                  :class="{ 'border-rose-400': passwordFieldErrors.current_password }"
                />
                <button
                  type="button"
                  @click="showCurrentPassword = !showCurrentPassword"
                  class="absolute right-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <EyeOff v-if="showCurrentPassword" :size="16" />
                  <Eye v-else :size="16" />
                </button>
              </div>
              <p v-if="passwordFieldErrors.current_password" class="text-[11px] text-rose-600">
                {{ passwordFieldErrors.current_password[0] }}
              </p>
            </div>

            <!-- Nouveau mot de passe -->
            <div class="space-y-1.5">
              <label class="block text-xs font-semibold text-slate-700">{{ locale === 'en' ? 'New password *' : 'Nouveau mot de passe *' }}</label>
              <div class="relative flex items-center">
                <input
                  v-model="passwordForm.password"
                  :type="showNewPassword ? 'text' : 'password'"
                  required
                  minlength="8"
                  :placeholder="locale === 'en' ? 'Minimum 8 characters' : 'Minimum 8 caractères'"
                  class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 pr-10 text-xs text-slate-800 placeholder-slate-400 transition focus:border-[#0F9D58] focus:outline-none focus:ring-1 focus:ring-[#0F9D58]"
                  :class="{ 'border-rose-400': passwordFieldErrors.password }"
                />
                <button
                  type="button"
                  @click="showNewPassword = !showNewPassword"
                  class="absolute right-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <EyeOff v-if="showNewPassword" :size="16" />
                  <Eye v-else :size="16" />
                </button>
              </div>
              <p v-if="passwordFieldErrors.password" class="text-[11px] text-rose-600">
                {{ passwordFieldErrors.password[0] }}
              </p>
            </div>

            <!-- Confirmation mot de passe -->
            <div class="space-y-1.5">
              <label class="block text-xs font-semibold text-slate-700">{{ locale === 'en' ? 'Confirm new password *' : 'Confirmer le nouveau mot de passe *' }}</label>
              <div class="relative flex items-center">
                <input
                  v-model="passwordForm.password_confirmation"
                  :type="showConfirmPassword ? 'text' : 'password'"
                  required
                  minlength="8"
                  :placeholder="locale === 'en' ? 'Repeat new password' : 'Répétez le nouveau mot de passe'"
                  class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 pr-10 text-xs text-slate-800 placeholder-slate-400 transition focus:border-[#0F9D58] focus:outline-none focus:ring-1 focus:ring-[#0F9D58]"
                  :class="{ 'border-rose-400': passwordFieldErrors.password_confirmation }"
                />
                <button
                  type="button"
                  @click="showConfirmPassword = !showConfirmPassword"
                  class="absolute right-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <EyeOff v-if="showConfirmPassword" :size="16" />
                  <Eye v-else :size="16" />
                </button>
              </div>
              <p v-if="passwordFieldErrors.password_confirmation" class="text-[11px] text-rose-600">
                {{ passwordFieldErrors.password_confirmation[0] }}
              </p>
            </div>

            <!-- Rappel sécurité -->
            <div class="rounded-lg bg-slate-50 border border-slate-100 p-3 text-[11px] text-slate-500 space-y-1">
              <p class="font-semibold text-slate-700">{{ locale === 'en' ? 'Security recommendations:' : 'Recommandations de sécurité :' }}</p>
              <ul class="list-disc list-inside space-y-0.5 text-slate-600">
                <li>{{ locale === 'en' ? 'At least 8 characters required' : 'Au moins 8 caractères requis' }}</li>
                <li>{{ locale === 'en' ? 'Must be different from current password' : 'Doit être différent de l\'actuel' }}</li>
              </ul>
            </div>

            <!-- Actions buttons -->
            <div class="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
              <Button
                type="button"
                variant="outline"
                @click="closePasswordModal"
                :disabled="isSubmittingPassword"
              >
                {{ t('common.cancel', 'Annuler') }}
              </Button>
              <button
                type="submit"
                :disabled="isSubmittingPassword"
                class="inline-flex items-center gap-1.5 rounded-lg bg-[#0F9D58] px-4 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-[#0c8248] disabled:opacity-50 cursor-pointer"
              >
                <Loader2 v-if="isSubmittingPassword" class="h-4 w-4 animate-spin" />
                <CheckCircle v-else class="h-4 w-4" />
                <span>{{ isSubmittingPassword ? (locale === 'en' ? 'Updating...' : 'Modification...') : (locale === 'en' ? 'Change password' : 'Modifier le mot de passe') }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>
  </div>
</template>