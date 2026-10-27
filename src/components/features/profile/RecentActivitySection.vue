<!-- src/components/features/profile/RecentActivitySection.vue -->
<script setup lang="ts">
import {
  ClipboardCheck,
  ClipboardList,
  UserPlus,
  PencilLine,
  ShieldCheck,
  Loader2,
  Inbox,
  RotateCw,
  Activity as ActivityIcon,
  CheckCircle,
  FileText
} from '@lucide/vue'
import { computed, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import Button from '../../ui/Button.vue'
import activityApi from '../../../core/api/activity.api.ts'

const props = defineProps<{
  userId?: string | number
}>()

const { t, locale } = useI18n()

interface Activity {
  id: string | number
  type: string
  title: string
  description: string
  created_at: string
}

const PAGE_SIZE = 6

const TYPE_CONFIG: Record<
  string,
  { icon: any; bg: string; text: string; label: string }
> = {
  CHECKLIST_CREATED: {
    icon: ClipboardList,
    bg: 'bg-blue-50 border-blue-200',
    text: 'text-blue-600',
    label: 'Nouvelle Checklist'
  },
  CHECKLIST_COMPLETED: {
    icon: ClipboardCheck,
    bg: 'bg-emerald-50 border-emerald-200',
    text: 'text-[#0F9D58]',
    label: 'Inspection Validée'
  },
  USER_CREATED: {
    icon: UserPlus,
    bg: 'bg-purple-50 border-purple-200',
    text: 'text-purple-600',
    label: 'Création Compte'
  },
  PROFILE_UPDATED: {
    icon: PencilLine,
    bg: 'bg-amber-50 border-amber-200',
    text: 'text-amber-600',
    label: 'Mise à jour Profil'
  },
  ROLE_UPDATED: {
    icon: ShieldCheck,
    bg: 'bg-rose-50 border-rose-200',
    text: 'text-rose-600',
    label: 'Changement de Rôle'
  }
}

function getConfig(type: string) {
  const isEn = locale.value === 'en'
  const labels: Record<string, { fr: string; en: string }> = {
    CHECKLIST_CREATED: { fr: 'Nouvelle Checklist', en: 'New Checklist' },
    CHECKLIST_COMPLETED: { fr: 'Inspection Validée', en: 'Validated Inspection' },
    USER_CREATED: { fr: 'Création Compte', en: 'Account Creation' },
    PROFILE_UPDATED: { fr: 'Mise à jour Profil', en: 'Profile Update' },
    ROLE_UPDATED: { fr: 'Changement de Rôle', en: 'Role Change' }
  }

  const base = TYPE_CONFIG[type] ?? {
    icon: FileText,
    bg: 'bg-slate-50 border-slate-200',
    text: 'text-slate-600',
    label: isEn ? 'Activity' : 'Activité'
  }

  return {
    ...base,
    label: labels[type] ? (isEn ? labels[type].en : labels[type].fr) : base.label
  }
}

function timeAgo(dateString: string): string {
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return ''

  const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
  const isEn = locale.value === 'en'

  const ranges: [number, string, string][] = [
    [60, 'seconde', 'second'],
    [60, 'minute', 'minute'],
    [24, 'heure', 'hour'],
    [7, 'jour', 'day'],
    [4.345, 'semaine', 'week'],
    [12, 'mois', 'month'],
    [Number.POSITIVE_INFINITY, 'an', 'year']
  ]

  let value = seconds
  let unitFr = 'seconde'
  let unitEn = 'second'

  for (const [limit, lFr, lEn] of ranges) {
    if (value < limit) {
      unitFr = lFr
      unitEn = lEn
      break
    }
    value = Math.floor(value / limit)
    unitFr = lFr
    unitEn = lEn
  }

  const rounded = Math.max(1, Math.floor(value))
  if (isEn) {
    const plural = rounded > 1 ? 's' : ''
    return `${rounded} ${unitEn}${plural} ago`
  } else {
    const plural = rounded > 1 && unitFr !== 'mois' ? 's' : ''
    return `il y a ${rounded} ${unitFr}${plural}`
  }
}

const activities = ref<Activity[]>([])
const page = ref(1)
const isLoading = ref(false)
const isLoadingMore = ref(false)
const loadError = ref('')
const hasMore = ref(false)

function getActivities(isLoadMore = false) {
  if (isLoadMore) {
    isLoadingMore.value = true
  } else {
    isLoading.value = true
    page.value = 1
  }
  loadError.value = ''

  activityApi
    .index({
      user_id: props.userId,
      page: page.value,
      per_page: PAGE_SIZE
    })
    .then((res) => {
      const responseData = res.data
      const items: Activity[] =
        responseData?.data ?? (Array.isArray(responseData) ? responseData : [])

      activities.value = isLoadMore ? [...activities.value, ...items] : items

      const total =
        responseData?.meta?.total ?? responseData?.total ?? items.length
      hasMore.value = activities.value.length < total
    })
    .catch(() => {
      loadError.value = locale.value === 'en' ? 'Unable to load activity logs.' : 'Impossible de charger le journal des activités.'
    })
    .finally(() => {
      isLoading.value = false
      isLoadingMore.value = false
    })
}

function loadMore() {
  page.value += 1
  getActivities(true)
}

const isEmpty = computed(
  () => !isLoading.value && !loadError.value && activities.value.length === 0
)

watch(
  () => props.userId,
  (newId) => {
    if (newId) getActivities()
  }
)

onMounted(() => {
  getActivities()
})
</script>

<template>
  <div class="flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
    <!-- EN-TETE DU BLOC ACTIVITE -->
    <div class="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
      <div class="flex items-center gap-2">
        <div class="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-[#0F9D58]">
          <ActivityIcon class="h-4 w-4" />
        </div>
        <div>
          <h4 class="text-sm font-bold text-slate-800">{{ locale === 'en' ? 'Recent Activity' : 'Activités Récentes' }}</h4>
          <p class="text-[11px] text-slate-500">{{ locale === 'en' ? 'User action audit history' : 'Historique des actions de l\'utilisateur' }}</p>
        </div>
      </div>

      <button
        type="button"
        @click="getActivities(false)"
        :title="locale === 'en' ? 'Refresh list' : 'Actualiser la liste'"
        :disabled="isLoading"
        class="inline-flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 disabled:opacity-50"
      >
        <RotateCw class="h-3.5 w-3.5" :class="{ 'animate-spin': isLoading }" />
      </button>
    </div>

    <!-- CHARGEMENT INITIAL -->
    <div v-if="isLoading" class="flex flex-col items-center justify-center py-12 text-slate-400">
      <Loader2 class="h-6 w-6 animate-spin text-[#0F9D58]" />
      <span class="mt-2 text-xs font-medium">{{ locale === 'en' ? 'Loading events...' : 'Chargement des événements...' }}</span>
    </div>

    <!-- ERREUR -->
    <div v-else-if="loadError" class="rounded-lg border border-rose-200 bg-rose-50 p-4 text-xs text-rose-700">
      {{ loadError }}
    </div>

    <!-- AUCUNE ACTIVITE -->
    <div v-else-if="isEmpty" class="flex flex-col items-center justify-center py-10 text-center text-slate-400">
      <div class="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400 mb-2">
        <Inbox class="h-6 w-6" />
      </div>
      <p class="text-xs font-semibold text-slate-700">{{ locale === 'en' ? 'No recent activity' : 'Aucune activité récente' }}</p>
      <p class="text-[11px] text-slate-500 max-w-[200px] mt-0.5">
        {{ locale === 'en' ? 'Future inspections, VMC cards and changes will appear here.' : 'Les futures inspections, fiches VMC et modifications apparaîtront ici.' }}
      </p>
    </div>

    <!-- TIMELINE LIST -->
    <div v-else class="relative pl-3 space-y-4 before:absolute before:left-5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
      <div
        v-for="act in activities"
        :key="act.id"
        class="relative flex items-start gap-3 group"
      >
        <!-- Icone du type -->
        <div
          class="relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border shadow-2xs transition group-hover:scale-105"
          :class="[getConfig(act.type).bg, getConfig(act.type).text]"
        >
          <component :is="getConfig(act.type).icon" class="h-3.5 w-3.5" />
        </div>

        <!-- Contenu -->
        <div class="min-w-0 flex-1 rounded-lg border border-slate-100 bg-slate-50/70 p-3 transition group-hover:bg-slate-50 group-hover:border-slate-200">
          <div class="flex items-center justify-between gap-1 mb-1">
            <span class="text-xs font-bold text-slate-800 line-clamp-1">
              {{ act.title }}
            </span>
            <span class="shrink-0 text-[10px] text-slate-500 font-medium tabular-nums">
              {{ timeAgo(act.created_at) }}
            </span>
          </div>

          <p class="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
            {{ act.description }}
          </p>

          <div class="mt-2 flex items-center justify-between border-t border-slate-200/60 pt-1.5 text-[10px] text-slate-500">
            <span class="font-medium text-slate-600">{{ getConfig(act.type).label }}</span>
            <span class="flex items-center gap-1 text-emerald-600 font-medium">
              <CheckCircle class="h-3 w-3" /> {{ locale === 'en' ? 'Recorded' : 'Enregistré' }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- BOUTON CHARGER PLUS -->
    <div v-if="!isLoading && !loadError && hasMore" class="mt-4 pt-2 border-t border-slate-100 text-center">
      <Button
        variant="ghost"
        size="sm"
        :disabled="isLoadingMore"
        @click="loadMore"
        class="w-full text-xs text-slate-600 hover:text-slate-900"
      >
        <Loader2 v-if="isLoadingMore" class="h-3.5 w-3.5 animate-spin mr-1.5" />
        {{ isLoadingMore ? (locale === 'en' ? 'Loading...' : 'Chargement...') : (locale === 'en' ? 'Show more activities' : 'Afficher plus d’activités') }}
      </Button>
    </div>
  </div>
</template>