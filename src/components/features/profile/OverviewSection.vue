<!-- src/components/features/profile/OverviewSection.vue -->
<script setup lang="ts">
import {
  Building2,
  Briefcase,
  Mail,
  Phone,
  ShieldCheck,
  Calendar,
  Check,
  Copy,
  Hash,
  MapPin,
  Sparkles,
  UserCheck,
  FileText
} from '@lucide/vue'
import { computed, ref } from 'vue'
import type { ProfileUser } from '../../../views/home/profile/ProfilePage.vue'
import { UserRoleDataJson } from '../../../@data/User.data.ts'

const props = defineProps<{ user: ProfileUser }>()
const emit = defineEmits<{ (e: 'go-to-tab', index: number): void; (e: 'open-edit'): void }>()

const copiedField = ref<string | null>(null)

function copyToClipboard(text: string | undefined, fieldName: string) {
  if (!text) return
  navigator.clipboard.writeText(text).then(() => {
    copiedField.value = fieldName
    setTimeout(() => {
      if (copiedField.value === fieldName) {
        copiedField.value = null
      }
    }, 2000)
  })
}

const roleLabel = computed(() => {
  const match = (UserRoleDataJson as { value: string; label: string }[])?.find(
    (item) => item.value === props.user.role
  )
  return match?.label ?? props.user.role ?? 'Utilisateur'
})

const memberSinceFormatted = computed(() => {
  if (!props.user.created_at) return 'Date non spécifiée'
  try {
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(new Date(props.user.created_at))
  } catch {
    return String(props.user.created_at)
  }
})
</script>

<template>
  <div class="flex flex-col gap-6 p-1">
    <!-- SECTION 1 : BIOGRAPHIE / PRESENTATION -->
    <div class="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
      <div class="mb-3 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <div class="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-[#0F9D58]">
            <Sparkles class="h-4 w-4" />
          </div>
          <h4 class="text-sm font-semibold text-slate-800">À propos & Présentation</h4>
        </div>
        <button
          type="button"
          @click="emit('open-edit')"
          class="text-xs font-medium text-[#0F9D58] hover:underline"
        >
          Modifier
        </button>
      </div>

      <div
        v-if="user.bio"
        class="rounded-lg border-l-4 border-l-[#0F9D58] bg-slate-50 p-4 text-sm leading-relaxed text-slate-700 italic"
      >
        « {{ user.bio }} »
      </div>
      <div
        v-else
        class="rounded-lg border border-dashed border-slate-200 bg-slate-50/50 p-4 text-center text-xs text-slate-500"
      >
        Aucune présentation rédigée. Cliquez sur « Modifier le profil » pour ajouter une biographie ou une description de votre poste.
      </div>
    </div>

    <!-- SECTION 2 : AFFECTATION & ORGANISATION GALANA -->
    <div class="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
      <div class="mb-4 flex items-center gap-2">
        <div class="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
          <Building2 class="h-4 w-4" />
        </div>
        <h4 class="text-sm font-semibold text-slate-800">Organisation & Affectation</h4>
      </div>

      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <!-- Departement -->
        <div class="flex items-start gap-3 rounded-lg border border-slate-100 bg-slate-50/60 p-3.5 transition hover:bg-slate-50">
          <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-slate-600 shadow-xs border border-slate-200">
            <Building2 class="h-4 w-4 text-emerald-600" />
          </div>
          <div class="min-w-0 flex-1">
            <p class="text-xs font-medium text-slate-500">Direction / Département</p>
            <p class="truncate text-sm font-semibold text-slate-800">
              {{ user.department || 'Direction HSSE' }}
            </p>
            <span class="mt-0.5 inline-block text-[11px] text-slate-500">Pôle Opérationnel & Sécurité</span>
          </div>
        </div>

        <!-- Fonction / Poste -->
        <div class="flex items-start gap-3 rounded-lg border border-slate-100 bg-slate-50/60 p-3.5 transition hover:bg-slate-50">
          <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-slate-600 shadow-xs border border-slate-200">
            <Briefcase class="h-4 w-4 text-blue-600" />
          </div>
          <div class="min-w-0 flex-1">
            <p class="text-xs font-medium text-slate-500">Fonction / Poste</p>
            <p class="truncate text-sm font-semibold text-slate-800">
              {{ user.job || 'Responsable HSSE' }}
            </p>
            <span class="mt-0.5 inline-block text-[11px] text-slate-500">Poste actif validé</span>
          </div>
        </div>

        <!-- Role systeme -->
        <div class="flex items-start gap-3 rounded-lg border border-slate-100 bg-slate-50/60 p-3.5 transition hover:bg-slate-50">
          <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-slate-600 shadow-xs border border-slate-200">
            <ShieldCheck class="h-4 w-4 text-indigo-600" />
          </div>
          <div class="min-w-0 flex-1">
            <p class="text-xs font-medium text-slate-500">Rôle d'accréditation</p>
            <p class="truncate text-sm font-semibold text-slate-800">
              {{ roleLabel }}
            </p>
            <button
              type="button"
              @click="emit('go-to-tab', 1)"
              class="mt-0.5 inline-flex items-center text-[11px] font-medium text-indigo-600 hover:underline"
            >
              Consulter les {{ user.permissions?.length ?? 0 }} habilitations →
            </button>
          </div>
        </div>

        <!-- Site principal -->
        <div class="flex items-start gap-3 rounded-lg border border-slate-100 bg-slate-50/60 p-3.5 transition hover:bg-slate-50">
          <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-slate-600 shadow-xs border border-slate-200">
            <MapPin class="h-4 w-4 text-rose-600" />
          </div>
          <div class="min-w-0 flex-1">
            <p class="text-xs font-medium text-slate-500">Site d'attachement</p>
            <p class="truncate text-sm font-semibold text-slate-800">
              Galana Terminal & Raffinerie
            </p>
            <span class="mt-0.5 inline-block text-[11px] text-slate-500">Toamasina / Antananarivo</span>
          </div>
        </div>
      </div>
    </div>

    <!-- SECTION 3 : COORDONNEES & COMMUNICATIONS -->
    <div class="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
      <div class="mb-4 flex items-center gap-2">
        <div class="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
          <Phone class="h-4 w-4" />
        </div>
        <h4 class="text-sm font-semibold text-slate-800">Coordonnées & Communication</h4>
      </div>

      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <!-- Email Pro -->
        <div class="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50/60 p-3.5 transition hover:bg-slate-50">
          <div class="flex items-center gap-3 min-w-0">
            <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-slate-600 shadow-xs border border-slate-200">
              <Mail class="h-4 w-4 text-emerald-600" />
            </div>
            <div class="min-w-0">
              <p class="text-xs font-medium text-slate-500">E-mail professionnel</p>
              <a
                v-if="user.email"
                :href="`mailto:${user.email}`"
                class="truncate text-sm font-semibold text-slate-800 hover:text-[#0F9D58] block"
              >
                {{ user.email }}
              </a>
              <p v-else class="text-sm text-slate-400 italic">Non renseigné</p>
            </div>
          </div>
          <button
            v-if="user.email"
            type="button"
            @click="copyToClipboard(user.email, 'email')"
            title="Copier l'adresse e-mail"
            class="ml-2 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
          >
            <Check v-if="copiedField === 'email'" class="h-3.5 w-3.5 text-emerald-600" />
            <Copy v-else class="h-3.5 w-3.5" />
          </button>
        </div>

        <!-- Telephone -->
        <div class="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50/60 p-3.5 transition hover:bg-slate-50">
          <div class="flex items-center gap-3 min-w-0">
            <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-slate-600 shadow-xs border border-slate-200">
              <Phone class="h-4 w-4 text-blue-600" />
            </div>
            <div class="min-w-0">
              <p class="text-xs font-medium text-slate-500">Téléphone de service</p>
              <a
                v-if="user.phone_number"
                :href="`tel:${user.phone_number}`"
                class="truncate text-sm font-semibold text-slate-800 hover:text-blue-600 block"
              >
                {{ user.phone_number }}
              </a>
              <p v-else class="text-sm text-slate-400 italic">Non renseigné</p>
            </div>
          </div>
          <button
            v-if="user.phone_number"
            type="button"
            @click="copyToClipboard(user.phone_number, 'phone')"
            title="Copier le numéro"
            class="ml-2 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
          >
            <Check v-if="copiedField === 'phone'" class="h-3.5 w-3.5 text-emerald-600" />
            <Copy v-else class="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>

    <!-- SECTION 4 : SYSTEME & AUDIT -->
    <div class="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
      <div class="mb-4 flex items-center gap-2">
        <div class="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
          <UserCheck class="h-4 w-4" />
        </div>
        <h4 class="text-sm font-semibold text-slate-800">Compte & Métadonnées</h4>
      </div>

      <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <!-- ID Unique -->
        <div class="rounded-lg border border-slate-100 bg-slate-50/60 p-3.5">
          <div class="flex items-center justify-between">
            <span class="text-xs font-medium text-slate-500 flex items-center gap-1">
              <Hash class="h-3.5 w-3.5 text-slate-400" /> ID Compte
            </span>
            <button
              v-if="user.id"
              type="button"
              @click="copyToClipboard(String(user.id), 'id')"
              class="text-[11px] text-slate-500 hover:text-slate-800"
            >
              {{ copiedField === 'id' ? 'Copié !' : 'Copier' }}
            </button>
          </div>
          <p class="mt-1 font-mono text-xs font-semibold text-slate-800 truncate">
            {{ user.id || 'N/A' }}
          </p>
        </div>

        <!-- Date creation -->
        <div class="rounded-lg border border-slate-100 bg-slate-50/60 p-3.5">
          <span class="text-xs font-medium text-slate-500 flex items-center gap-1">
            <Calendar class="h-3.5 w-3.5 text-slate-400" /> Inscription
          </span>
          <p class="mt-1 text-xs font-semibold text-slate-800 truncate">
            {{ memberSinceFormatted }}
          </p>
        </div>

        <!-- Etat de verification -->
        <div class="rounded-lg border border-slate-100 bg-slate-50/60 p-3.5">
          <span class="text-xs font-medium text-slate-500 flex items-center gap-1">
            <FileText class="h-3.5 w-3.5 text-slate-400" /> Statut d'accès
          </span>
          <p class="mt-1 flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
            <span class="h-2 w-2 rounded-full bg-emerald-500"></span>
            Actif & Conforme HSSE
          </p>
        </div>
      </div>
    </div>
  </div>
</template>