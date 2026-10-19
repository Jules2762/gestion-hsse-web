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
  FolderArchive,
  Globe2,
  Mail,
  Search,
  ShieldAlert,
  ShieldCheck,
  Type
} from '@lucide/vue'

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

const filteredTabs = computed(() => {
  if (!searchQuery.value.trim()) return tabs
  const query = searchQuery.value.toLowerCase().trim()
  return tabs.filter(t =>
    t.title.toLowerCase().includes(query) ||
    t.subtitle.toLowerCase().includes(query)
  )
})
</script>

<template>
  <div class="min-h-screen bg-background text-text-primary">
    <Header title="Paramètres" show-search />

    <div class="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">

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