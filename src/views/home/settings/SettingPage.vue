<script setup lang="ts">
import { computed, ref } from 'vue'
import Header from '../../../components/shared/Header.vue'

import GeneralSection from './sections/GeneralSection.vue'
import HsseSection from './sections/HsseSection.vue'
import PreferenceSection from './sections/PreferenceSection.vue'
import EmailSection from './sections/EmailSection.vue'
import SecuritySection from './sections/SecuritySection.vue'
import DocumentSection from './sections/DocumentSection.vue'

import {
  Building2,
  FileCode,
  FolderArchive,
  Globe2,
  Mail,
  RotateCcw,
  Search,
  ShieldAlert,
  ShieldCheck,
  Sliders,
  Type
} from '@lucide/vue'
import settingService from '../../../core/services/setting.service'
import { toast } from 'vue3-toastify'

/*
|--------------------------------------------------------------------------
| NAVIGATION PAR ONGLETS ENRICHIE
|--------------------------------------------------------------------------
*/

interface SettingTab {
  id: string
  title: string
  subtitle: string
  icon: any
  tag?: string
}

const tabs: SettingTab[] = [
  {
    id: 'general',
    title: 'Général & Identité',
    subtitle: 'Organisation, coordonnées & régionalisation',
    icon: Building2,
  },
  {
    id: 'hsse',
    title: 'Conformité & HSSE',
    subtitle: 'Règles d’or, urgence & seuils des VMC',
    icon: ShieldAlert,
    tag: 'Prioritaire'
  },
  {
    id: 'display',
    title: 'Affichage & Police',
    subtitle: 'Taille de police (13px/14.5px/16px), densité & alertes',
    icon: Type,
    tag: 'Nouveau'
  },
  {
    id: 'email',
    title: 'Messagerie & E-mail',
    subtitle: 'Ouverture Outlook, serveur SMTP & copies CC',
    icon: Mail,
  },
  {
    id: 'security',
    title: 'Sécurité & Audit',
    subtitle: 'Sessions, complexité mots de passe & journalisation',
    icon: ShieldCheck,
  },
  {
    id: 'documents',
    title: 'Gestion Documentaire',
    subtitle: 'Quotas de téléversement, formats & archivage GED',
    icon: FolderArchive,
  },
]

const currentTab = ref<string>('general')
const searchQuery = ref<string>('')
const isResetting = ref(false)
const showResetConfirm = ref(false)

const filteredTabs = computed(() => {
  if (!searchQuery.value.trim()) return tabs
  const query = searchQuery.value.toLowerCase().trim()
  return tabs.filter(t =>
    t.title.toLowerCase().includes(query) ||
    t.subtitle.toLowerCase().includes(query)
  )
})

function openSwagger() {
  window.open('http://127.0.0.1:8000/api/documentation', '_blank')
}

function handleResetAll() {
  isResetting.value = true
  settingService.reset()
    .then(() => {
      toast.success('Tous les paramètres ont été réinitialisés aux valeurs d’usine !')
      showResetConfirm.value = false
      setTimeout(() => {
        window.location.reload()
      }, 700)
    })
    .catch(() => {
      toast.error('Erreur lors de la réinitialisation des paramètres.')
    })
    .finally(() => {
      isResetting.value = false
    })
}
</script>

<template>
  <div class="min-h-screen bg-background text-text-primary">
    <Header title="Paramètres" show-search />

    <div class="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">

      <!-- ========================================================= -->
      <!-- HERO HEADER AVEC ACTIONS GLOBALES                         -->
      <!-- ========================================================= -->
      <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-border bg-surface p-5 sm:p-6 shadow-2xs">
        <div class="flex items-start gap-4">
          <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#0F9D58]/10 text-[#0F9D58] ring-4 ring-[#0F9D58]/5">
            <Sliders class="h-6 w-6 stroke-[2.2]" />
          </div>
          <div>
            <div class="flex items-center gap-2.5">
              <h1 class="text-lg sm:text-xl font-bold tracking-tight text-text-primary">
                Paramètres de la Plateforme GALANA HSSE
              </h1>
              <span class="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-[#0F9D58] ring-1 ring-[#0F9D58]/20">
                <span class="h-1.5 w-1.5 rounded-full bg-[#0F9D58] animate-pulse"></span>
                Base synchronisée
              </span>
            </div>
            <p class="mt-1 text-xs text-text-secondary max-w-2xl leading-relaxed">
              Configurez l'organisation, les protocoles de conformité HSSE, la typographie globale (taille de police), la messagerie et les politiques de sécurité.
            </p>
          </div>
        </div>

        <div class="flex flex-wrap items-center gap-2 sm:self-center">
          <!-- BOUTON SWAGGER -->
          <button
            type="button"
            @click="openSwagger"
            class="inline-flex items-center gap-1.5 rounded-xl border border-border bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-2xs transition hover:bg-slate-50 hover:border-slate-300"
            title="Consulter la documentation interactive de l'API"
          >
            <FileCode class="h-3.5 w-3.5 text-blue-600" />
            <span>Swagger API</span>
          </button>

          <!-- BOUTON RÉINITIALISER -->
          <button
            type="button"
            @click="showResetConfirm = true"
            class="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50/50 px-3 py-2 text-xs font-semibold text-rose-700 transition hover:bg-rose-100/60"
            title="Restaurer toutes les valeurs par défaut"
          >
            <RotateCcw class="h-3.5 w-3.5" />
            <span>Réinitialiser</span>
          </button>
        </div>
      </div>

      <!-- ========================================================= -->
      <!-- CORPS PRINCIPAL : SIDEBAR + PANNEAU DE CONFIGURATION     -->
      <!-- ========================================================= -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        <!-- 1. NAVIGATION LATÉRALE (COL 4) -->
        <div class="lg:col-span-4 space-y-4">
          <div class="rounded-2xl border border-border bg-surface p-3 shadow-2xs space-y-2">

            <!-- CHAMP DE RECHERCHE RAPIDE -->
            <div class="relative px-1 pt-1 pb-2">
              <Search class="absolute left-3.5 top-3.5 h-3.5 w-3.5 text-text-muted" />
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Filtrer les rubriques..."
                class="w-full rounded-xl border border-border bg-surface-alt/40 pl-9 pr-3 py-2 text-xs text-text-primary placeholder:text-text-muted focus:border-[#0F9D58] focus:bg-surface focus:outline-hidden"
              />
            </div>

            <!-- LISTE DES ONGLETS -->
            <div class="space-y-1">
              <button
                v-for="t in filteredTabs"
                :key="t.id"
                type="button"
                @click="currentTab = t.id"
                class="group flex w-full items-center justify-between rounded-xl p-3 text-left transition-all duration-200"
                :class="currentTab === t.id
                  ? 'bg-[#0F9D58]/10 text-[#0F9D58] ring-1 ring-[#0F9D58]/20 font-semibold'
                  : 'text-text-primary hover:bg-surface-alt hover:text-text-primary'"
              >
                <div class="flex items-center gap-3 min-w-0">
                  <div
                    class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors"
                    :class="currentTab === t.id
                      ? 'bg-[#0F9D58] text-white shadow-2xs'
                      : 'bg-surface-alt text-text-secondary group-hover:bg-slate-200'"
                  >
                    <component :is="t.icon" class="h-4 w-4" />
                  </div>

                  <div class="min-w-0">
                    <p class="truncate text-xs font-semibold" :class="currentTab === t.id ? 'text-[#0F9D58]' : 'text-text-primary'">
                      {{ t.title }}
                    </p>
                    <p class="truncate text-[11px] text-text-secondary">
                      {{ t.subtitle }}
                    </p>
                  </div>
                </div>

                <div class="flex items-center gap-1.5 shrink-0 pl-2">
                  <span
                    v-if="t.tag"
                    class="rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider"
                    :class="t.tag === 'Prioritaire' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'"
                  >
                    {{ t.tag }}
                  </span>
                  <div
                    class="h-1.5 w-1.5 rounded-full transition-opacity"
                    :class="currentTab === t.id ? 'bg-[#0F9D58] opacity-100' : 'opacity-0'"
                  />
                </div>
              </button>
            </div>
          </div>

          <!-- CARTE D'INFORMATIONS DU SYSTÈME -->
          <div class="rounded-2xl border border-border bg-linear-to-br from-surface to-surface-alt/40 p-4 shadow-2xs space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-[11px] font-bold uppercase tracking-wider text-text-muted">
                Statut Système Galana
              </span>
              <span class="inline-flex items-center gap-1 text-[10px] font-semibold text-[#0F9D58]">
                <Globe2 class="h-3 w-3" />
                Terminal Toamasina
              </span>
            </div>

            <div class="space-y-1.5 text-xs text-text-secondary border-t border-border/60 pt-2.5">
              <div class="flex items-center justify-between">
                <span>Version Plateforme</span>
                <span class="font-medium text-text-primary">v2.4.0 HSSE</span>
              </div>
              <div class="flex items-center justify-between">
                <span>Moteur API Backend</span>
                <span class="font-medium text-text-primary">Laravel 11 / PHP 8.3</span>
              </div>
              <div class="flex items-center justify-between">
                <span>Paramètres enregistrés</span>
                <span class="font-semibold text-[#0F9D58]">46 paramètres actifs</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 2. PANNEAU DE CONTENU (COL 8) -->
        <div class="lg:col-span-8">
          <div class="overflow-hidden rounded-2xl border border-border bg-surface shadow-2xs">
            <Transition name="fade" mode="out-in">
              <GeneralSection v-if="currentTab === 'general'" />
              <HsseSection v-else-if="currentTab === 'hsse'" />
              <PreferenceSection v-else-if="currentTab === 'display'" />
              <EmailSection v-else-if="currentTab === 'email'" />
              <SecuritySection v-else-if="currentTab === 'security'" />
              <DocumentSection v-else-if="currentTab === 'documents'" />
            </Transition>
          </div>
        </div>

      </div>

    </div>

    <!-- ========================================================= -->
    <!-- MODAL DE CONFIRMATION DE RÉINITIALISATION                 -->
    <!-- ========================================================= -->
    <div
      v-if="showResetConfirm"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4"
    >
      <div class="w-full max-w-md rounded-2xl border border-border bg-surface p-6 shadow-2xl space-y-4">
        <div class="flex items-center gap-3">
          <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-100 text-rose-700">
            <RotateCcw class="h-5 w-5" />
          </div>
          <div>
            <h3 class="text-sm font-bold text-text-primary">
              Réinitialiser tous les paramètres ?
            </h3>
            <p class="text-xs text-text-secondary">
              Cette action restaurera les 46 paramètres système à leurs valeurs initiales d'usine.
            </p>
          </div>
        </div>

        <div class="rounded-xl bg-amber-50 border border-amber-200/60 p-3 text-xs text-amber-900 leading-relaxed">
          ⚠️ Toutes vos personnalisations (taille de police, identité d'organisation, délais d'alerte VMC, quotas GED) seront réinitialisées.
        </div>

        <div class="flex items-center justify-end gap-2 pt-2 border-t border-border">
          <button
            type="button"
            @click="showResetConfirm = false"
            class="rounded-xl border border-border bg-surface px-4 py-2 text-xs font-semibold text-text-secondary hover:bg-surface-alt"
          >
            Annuler
          </button>
          <button
            type="button"
            :disabled="isResetting"
            @click="handleResetAll"
            class="rounded-xl bg-rose-600 px-4 py-2 text-xs font-semibold text-white shadow-2xs hover:bg-rose-700 disabled:opacity-50"
          >
            {{ isResetting ? 'Réinitialisation en cours...' : 'Confirmer la réinitialisation' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(4px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>