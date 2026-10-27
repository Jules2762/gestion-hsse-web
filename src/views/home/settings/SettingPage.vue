<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
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

const { t, te, locale } = useI18n()

const tabs = computed<SettingTab[]>(() => [
  {
    id: 'general',
    title: locale.value === 'en' ? 'General & Identity' : 'Général & Identité',
    subtitle: locale.value === 'en' ? 'Organization, contact details & localization' : 'Organisation, coordonnées & régionalisation',
    icon: Building2,
  },
  {
    id: 'hsse',
    title: locale.value === 'en' ? 'Compliance & HSSE' : 'Conformité & HSSE',
    subtitle: locale.value === 'en' ? 'Golden rules, emergency & VMC thresholds' : 'Règles d’or, urgence & seuils des VMC',
    icon: ShieldAlert,
    tag: locale.value === 'en' ? 'Priority' : 'Prioritaire'
  },
  {
    id: 'display',
    title: locale.value === 'en' ? 'Display & Font' : 'Affichage & Police',
    subtitle: locale.value === 'en' ? 'Font size (13px/14.5px/16px), density & alerts' : 'Taille de police (13px/14.5px/16px), densité & alertes',
    icon: Type,
    tag: locale.value === 'en' ? 'New' : 'Nouveau'
  },
  {
    id: 'email',
    title: locale.value === 'en' ? 'Messaging & Email' : 'Messagerie & E-mail',
    subtitle: locale.value === 'en' ? 'Outlook launch, SMTP server & CC copies' : 'Ouverture Outlook, serveur SMTP & copies CC',
    icon: Mail,
  },
  {
    id: 'security',
    title: locale.value === 'en' ? 'Security & Audit' : 'Sécurité & Audit',
    subtitle: locale.value === 'en' ? 'Sessions, password complexity & logging' : 'Sessions, complexité mots de passe & journalisation',
    icon: ShieldCheck,
  },
  {
    id: 'documents',
    title: locale.value === 'en' ? 'Document Management' : 'Gestion Documentaire',
    subtitle: locale.value === 'en' ? 'Upload quotas, formats & DMS archiving' : 'Quotas de téléversement, formats & archivage GED',
    icon: FolderArchive,
  },
])

const currentTab = ref<string>('general')
const searchQuery = ref<string>('')

const filteredTabs = computed(() => {
  if (!searchQuery.value.trim()) return tabs.value
  const query = searchQuery.value.toLowerCase().trim()
  return tabs.value.filter(tab => {
    return tab.title.toLowerCase().includes(query) || tab.subtitle.toLowerCase().includes(query)
  })
})
</script>

<template>
  <div class="min-h-screen bg-background text-text-primary">
    <Header title="settings.title"  />

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
                :placeholder="t('common.search') + '...'"
                class="w-full rounded-xl border border-border bg-surface-alt/40 pl-9 pr-3 py-2 text-xs text-text-primary placeholder:text-text-muted focus:border-[#0F9D58] focus:bg-surface focus:outline-hidden"
              />
            </div>

            <!-- LISTE DES ONGLETS -->
            <div class="space-y-1">
              <button
                v-for="tab in filteredTabs"
                :key="tab.id"
                type="button"
                @click="currentTab = tab.id"
                class="group flex w-full items-center justify-between rounded-xl p-3 text-left transition-all duration-200"
                :class="currentTab === tab.id
                  ? 'bg-[#0F9D58]/10 text-[#0F9D58] ring-1 ring-[#0F9D58]/20 font-semibold'
                  : 'text-text-primary hover:bg-surface-alt hover:text-text-primary'"
              >
                <div class="flex items-center gap-3 min-w-0">
                  <div
                    class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors"
                    :class="currentTab === tab.id
                      ? 'bg-[#0F9D58] text-white shadow-2xs'
                      : 'bg-surface-alt text-text-secondary group-hover:bg-slate-200'"
                  >
                    <component :is="tab.icon" class="h-4 w-4" />
                  </div>

                  <div class="min-w-0">
                    <p class="truncate text-xs font-semibold" :class="currentTab === tab.id ? 'text-[#0F9D58]' : 'text-text-primary'">
                      {{ te('settings.tabs.' + tab.id) ? t('settings.tabs.' + tab.id) : tab.title }}
                    </p>
                    <p class="truncate text-[11px] text-text-secondary">
                      {{ tab.subtitle }}
                    </p>
                  </div>
                </div>

                <div class="flex items-center gap-1.5 shrink-0 pl-2">
                  <span
                    v-if="tab.tag"
                    class="rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider"
                    :class="tab.tag === 'Prioritaire' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'"
                  >
                    {{ tab.tag }}
                  </span>
                  <div
                    class="h-1.5 w-1.5 rounded-full transition-opacity"
                    :class="currentTab === tab.id ? 'bg-[#0F9D58] opacity-100' : 'opacity-0'"
                  />
                </div>
              </button>
            </div>
          </div>

          <!-- CARTE D'INFORMATIONS DU SYSTÈME -->
          <div class="rounded-2xl border border-border bg-linear-to-br from-surface to-surface-alt/40 p-4 shadow-2xs space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-[11px] font-bold uppercase tracking-wider text-text-muted">
                {{ locale === 'en' ? 'Galana System Status' : 'Statut Système Galana' }}
              </span>
              <span class="inline-flex items-center gap-1 text-[10px] font-semibold text-[#0F9D58]">
                <Globe2 class="h-3 w-3" />
                Terminal Toamasina
              </span>
            </div>

            <div class="space-y-1.5 text-xs text-text-secondary border-t border-border/60 pt-2.5">
              <div class="flex items-center justify-between">
                <span>{{ locale === 'en' ? 'Platform Version' : 'Version Plateforme' }}</span>
                <span class="font-medium text-text-primary">v2.4.0 HSSE</span>
              </div>
              <div class="flex items-center justify-between">
                <span>{{ locale === 'en' ? 'Backend API Engine' : 'Moteur API Backend' }}</span>
                <span class="font-medium text-text-primary">Laravel 11 / PHP 8.3</span>
              </div>
              <div class="flex items-center justify-between">
                <span>{{ locale === 'en' ? 'Saved Parameters' : 'Paramètres enregistrés' }}</span>
                <span class="font-semibold text-[#0F9D58]">{{ locale === 'en' ? '46 active parameters' : '46 paramètres actifs' }}</span>
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