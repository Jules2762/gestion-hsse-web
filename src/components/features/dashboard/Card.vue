<script setup lang="ts">
import { computed, type Component } from 'vue'
import { useI18n } from 'vue-i18n'
import { Minus, TrendingDown, TrendingUp } from '@lucide/vue'
import type { ColorType } from '../../../@types/Dashboard.type'

type ThemeStyle = {
  card: string
  iconWrap: string
  icon: string
  ring: string
}

type Props = {
  title: string
  icon: Component
  value?: string | number
  /** Ligne secondaire sous la valeur (ex. « sur 24 questions ») */
  subtitle?: string
  /** Unité ou suffixe collé à la valeur (ex. « % », « h ») */
  unit?: string
  theme?: ColorType
  /** Variation par rapport à la période précédente */
  delta?: number
  /** Sens favorable de la variation. Une baisse des non-conformités est une bonne nouvelle. */
  deltaGoodWhen?: 'up' | 'down'
  deltaLabel?: string
  /** Rend la carte actionnable : elle devient un <button> et émet `click`. */
  clickable?: boolean
  /** État sélectionné, utile quand la carte sert de filtre. */
  selected?: boolean
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  deltaGoodWhen: 'up',
  deltaLabel: 'vs période précédente',
})

defineEmits<{ click: [] }>()

/* Classes en chaînes littérales : Tailwind scanne le source,
 * une classe construite dynamiquement ne serait jamais générée. */
const THEMES: Record<ColorType | 'default', ThemeStyle> = {
  default: { card: 'border-slate-300 bg-white border-l-4 border-l-slate-700 shadow-xs', iconWrap: 'bg-slate-700 text-white shadow-xs', icon: 'text-white', ring: 'ring-slate-500' },
  red: { card: 'border-red-300 bg-red-100/60 border-l-4 border-l-red-600 shadow-xs', iconWrap: 'bg-red-600 text-white shadow-xs', icon: 'text-white', ring: 'ring-red-600' },
  green: { card: 'border-emerald-300 bg-emerald-100/60 border-l-4 border-l-[#0F9D58] shadow-xs', iconWrap: 'bg-[#0F9D58] text-white shadow-xs', icon: 'text-white', ring: 'ring-[#0F9D58]' },
  orange: { card: 'border-orange-300 bg-orange-100/60 border-l-4 border-l-orange-600 shadow-xs', iconWrap: 'bg-orange-600 text-white shadow-xs', icon: 'text-white', ring: 'ring-orange-600' },
  blue: { card: 'border-blue-300 bg-blue-100/60 border-l-4 border-l-blue-600 shadow-xs', iconWrap: 'bg-blue-600 text-white shadow-xs', icon: 'text-white', ring: 'ring-blue-600' },
  purple: { card: 'border-purple-300 bg-purple-100/60 border-l-4 border-l-purple-600 shadow-xs', iconWrap: 'bg-purple-600 text-white shadow-xs', icon: 'text-white', ring: 'ring-purple-600' },
  pink: { card: 'border-pink-300 bg-pink-100/60 border-l-4 border-l-pink-600 shadow-xs', iconWrap: 'bg-pink-600 text-white shadow-xs', icon: 'text-white', ring: 'ring-pink-600' },
  yellow: { card: 'border-amber-300 bg-amber-100/60 border-l-4 border-l-amber-600 shadow-xs', iconWrap: 'bg-amber-600 text-white shadow-xs', icon: 'text-white', ring: 'ring-amber-600' },
  indigo: { card: 'border-indigo-300 bg-indigo-100/60 border-l-4 border-l-indigo-600 shadow-xs', iconWrap: 'bg-indigo-600 text-white shadow-xs', icon: 'text-white', ring: 'ring-indigo-600' },
  teal: { card: 'border-teal-300 bg-teal-100/60 border-l-4 border-l-teal-700 shadow-xs', iconWrap: 'bg-teal-700 text-white shadow-xs', icon: 'text-white', ring: 'ring-teal-700' },
  cyan: { card: 'border-cyan-300 bg-cyan-100/60 border-l-4 border-l-cyan-700 shadow-xs', iconWrap: 'bg-cyan-700 text-white shadow-xs', icon: 'text-white', ring: 'ring-cyan-700' },
  gray: { card: 'border-gray-300 bg-gray-100/60 border-l-4 border-l-gray-700 shadow-xs', iconWrap: 'bg-gray-700 text-white shadow-xs', icon: 'text-white', ring: 'ring-gray-700' },
  slate: { card: 'border-slate-300 bg-slate-100/60 border-l-4 border-l-slate-700 shadow-xs', iconWrap: 'bg-slate-700 text-white shadow-xs', icon: 'text-white', ring: 'ring-slate-700' },
}

const style = computed(() => THEMES[props.theme ?? 'default'])

const numberFormatter = new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 2 })

const displayValue = computed(() => {
  if (props.value === undefined || props.value === null) return '—'
  return typeof props.value === 'number' ? numberFormatter.format(props.value) : props.value
})

const trend = computed(() => {
  if (props.delta === undefined || props.delta === 0) {
    return { icon: Minus, tone: 'text-gray-600 bg-gray-100', sign: '' }
  }
  const isUp = props.delta > 0
  const isGood = isUp === (props.deltaGoodWhen === 'up')
  return {
    icon: isUp ? TrendingUp : TrendingDown,
    tone: isGood ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100',
    sign: isUp ? '+' : '−',
  }
})

const deltaText = computed(() =>
  props.delta === undefined ? '' : `${trend.value.sign}${numberFormatter.format(Math.abs(props.delta))}`,
)

const tag = computed(() => (props.clickable ? 'button' : 'div'))

const { t, te, locale } = useI18n()

const kpiTitleMap: Record<string, { fr: string; en: string }> = {
  "Taux de réalisation du plan": { fr: "Taux de réalisation du plan", en: "Plan Completion Rate" },
  "Inspections réalisées": { fr: "Inspections réalisées", en: "Completed Inspections" },
  "Inspections en retard": { fr: "Inspections en retard", en: "Delayed Inspections" },
  "Taux de conformité moyen": { fr: "Taux de conformité moyen", en: "Average Conformity Rate" },
  "Non-conformités détectées": { fr: "Non-conformités détectées", en: "Detected Non-Conformities" },
  "Taux de conformité global": { fr: "Taux de conformité global", en: "Global Conformity Rate" },
  "Actions ouvertes": { fr: "Actions ouvertes", en: "Open Actions" },
  "Formations réalisées": { fr: "Formations réalisées", en: "Completed Trainings" },
  "Heures de formation dispensées": { fr: "Heures de formation dispensées", en: "Training Hours Delivered" },
  "Nombre total de participants": { fr: "Nombre total de participants", en: "Total Participants" },
  "Taux de présence moyen": { fr: "Taux de présence moyen", en: "Average Attendance Rate" },
  "Total VMC réalisées": { fr: "Total VMC réalisées", en: "Total Completed VMCs" },
  "Taux de couverture": { fr: "Taux de couverture", en: "Coverage Rate" },
  "Écarts identifiés": { fr: "Écarts identifiés", en: "Identified Gaps" },
  "Taux de résolution VMC": { fr: "Taux de résolution VMC", en: "VMC Resolution Rate" },
  "VMC Réalisées": { fr: "VMC Réalisées", en: "Completed VMCs" },
  "Taux de réalisation global": { fr: "Taux de réalisation global", en: "Overall Completion Rate" },
  "Autres visites (En cours & Planifiées)": { fr: "Autres visites (En cours & Planifiées)", en: "Other Visits (In Progress & Planned)" },
  "Visites Station-Service (SS)": { fr: "Visites Station-Service (SS)", en: "Service Station Visits (SS)" },
  "Visites Magasins & Agences": { fr: "Visites Magasins & Agences", en: "Store & Branch Visits" },
  "Inspections Camions": { fr: "Inspections Camions", en: "Truck Inspections" },
  "Nombre de remontées": { fr: "Nombre de remontées", en: "Total Safety Reports" },
  "Taux de conformité des visites": { fr: "Taux de conformité des visites", en: "Visit Conformity Rate" },
  "Total matériels suivis": { fr: "Total matériels suivis", en: "Total Monitored Equipment" },
  "Matériels conformes": { fr: "Matériels conformes", en: "Compliant Equipment" },
  "Matériels non conformes": { fr: "Matériels non conformes", en: "Non-Compliant Equipment" },
  "Taux de conformité matériel": { fr: "Taux de conformité matériel", en: "Equipment Conformity Rate" },
  "Fiches d'inspection": { fr: "Fiches d'inspection", en: "Inspection Records" },
  "Taux moyen de conformité": { fr: "Taux moyen de conformité", en: "Average Conformity Rate" },
  "Extincteurs en parc": { fr: "Extincteurs en parc", en: "Fire Extinguishers in Stock" },
  "Bacs & Rétention": { fr: "Bacs & Rétention", en: "Spill Trays & Retention" },
  "Anomalies actives": { fr: "Anomalies actives", en: "Active Anomalies" },
  "Checklists réalisées": { fr: "Checklists réalisées", en: "Checklists Completed" },
  "Taux de conformité checklists": { fr: "Taux de conformité checklists", en: "Checklist Conformity Rate" },
  "Total utilisateurs": { fr: "Total utilisateurs", en: "Total Users" },
  "Utilisateurs actifs": { fr: "Utilisateurs actifs", en: "Active Users" },
  "Connexions ce mois": { fr: "Connexions ce mois", en: "Logins this month" },
  "Rôles configurés": { fr: "Rôles configurés", en: "Configured Roles" },
  "Utilisateurs Inscrits": { fr: "Utilisateurs Inscrits", en: "Registered Users" },
  "Administrateurs Système": { fr: "Administrateurs Système", en: "System Administrators" },
  "Personnel Référencé": { fr: "Personnel Référencé", en: "Referenced Personnel" },
  "Traçabilité & Audit (30j)": { fr: "Traçabilité & Audit (30j)", en: "Traceability & Audit (30d)" },
  "Nombre de sessions réalisées": { fr: "Nombre de sessions réalisées", en: "Completed Training Sessions" },
  "Nombre total des heures de formation": { fr: "Nombre total des heures de formation", en: "Total Training Hours" },
  "Taux de réalisation du plan de formation": { fr: "Taux de réalisation du plan de formation", en: "Training Plan Completion Rate" },
  "Nombre de personnes ayant participé": { fr: "Nombre de personnes ayant participé", en: "Number of Attendees" },
  "Taux de participation global": { fr: "Taux de participation global", en: "Overall Attendance Rate" },
  "Personnes ayant suivi au moins une formation": { fr: "Personnes ayant suivi au moins une formation", en: "People Trained (At Least One)" },
  "Taux de personnes ayant participé à au moins une formation": { fr: "Taux de personnes ayant participé à au moins une formation", en: "Trained Personnel Ratio" },
  "État du Compte": { fr: "État du Compte", en: "Account Status" },
  "Accréditation Système": { fr: "Accréditation Système", en: "System Accreditation" },
  "Habilitations Actives": { fr: "Habilitations Actives", en: "Active Permissions" },
  "Rattachement Pôle": { fr: "Rattachement Pôle", en: "Department Affiliation" },
}

const displayTitle = computed(() => {
  if (te(props.title)) return t(props.title)
  const mapped = kpiTitleMap[props.title]
  if (mapped) {
    return locale.value === 'en' ? mapped.en : mapped.fr
  }
  return props.title
})

const displaySubtitle = computed(() => {
  if (!props.subtitle) return undefined
  if (locale.value === 'en') {
    return props.subtitle
      .replace(/sur (\d+) VMC au total/g, 'out of $1 total VMCs')
      .replace(/(\d+) VMC clôturées sur (\d+)/g, '$1 VMCs closed out of $2')
      .replace(/(\d+) en cours • (\d+) planifiée\(s\)/g, '$1 in progress • $2 planned')
      .replace(/Pistes & boutiques/g, 'Forecourts & convenience stores')
      .replace(/(\d+) Magasin • (\d+) Agence/g, '$1 Store • $2 Branch')
      .replace(/Camions-citernes transport/g, 'Fuel transport tanker trucks')
      .replace(/Safety Reports & écarts/g, 'Safety Reports & findings')
      .replace(/Points évalués conformes/g, 'Compliant audited items')
      .replace(/(\d+) actif\(s\) • (\d+) inactif\(s\)/g, '$1 active • $2 inactive')
      .replace(/(\d+) utilisateur\(s\) standard/g, '$1 standard user(s)')
      .replace(/Collaborateurs & Équipes Galana/g, 'Galana staff & teams')
      .replace(/(\d+) action\(s\) tracée\(s\) aujourd'hui/g, '$1 action(s) logged today')
      .replace(/Accès certifié & conforme HSSE/g, 'Certified access & HSSE compliant')
      .replace(/Niveau de privilèges actif/g, 'Active privilege level')
      .replace(/Répartis sur l’ensemble des modules/g, 'Distributed across all modules')
      .replace(/Fonction opérationnelle/g, 'Operational function')
  }
  return props.subtitle
})


const displayDeltaLabel = computed(() => {
  if (props.deltaLabel && props.deltaLabel !== 'vs période précédente') return props.deltaLabel
  return locale.value === 'en' ? 'vs previous period' : 'vs période précédente'
})
</script>

<template>
  <component
    :is="tag"
    :type="clickable ? 'button' : undefined"
    :aria-pressed="clickable ? selected : undefined"
    class="flex h-full min-w-0 flex-col justify-between gap-5 rounded-lg border p-4 text-left transition-shadow"
    :class="[
      style.card,
      clickable && `cursor-pointer hover:shadow-md focus-visible:outline-none focus-visible:ring-2 ${style.ring}`,
      selected && `ring-2 ${style.ring}`,
    ]"
    @click="clickable && $emit('click')"
  >
    <!-- En-tête : titre sur 2 lignes max, icône toujours visible -->
    <div class="flex w-full items-start justify-between gap-x-3">
      <h5 class="line-clamp-2 min-w-0 text-sm font-semibold leading-snug text-slate-800">{{ displayTitle }}</h5>

      <div class="shrink-0 rounded-xl p-2.5 shadow-xs" :class="style.iconWrap">
        <component :is="icon" :size="20" :class="style.icon" aria-hidden="true" />
      </div>
    </div>

    <!-- Squelette : même hauteur que le contenu réel, pas de saut de mise en page -->
    <div v-if="loading" class="flex flex-col gap-2" aria-busy="true">
      <div class="h-9 w-20 animate-pulse rounded bg-gray-200" />
      <div class="h-3 w-28 animate-pulse rounded bg-gray-100" />
    </div>

    <!-- Valeur toujours collée en bas : alignée d'une carte à l'autre -->
    <div v-else class="flex flex-col gap-1.5">
      <p class="flex items-baseline gap-1">
        <span class="text-3xl font-bold leading-none tabular-nums text-slate-900">{{ displayValue }}</span>
        <span v-if="unit" class="text-lg font-medium leading-none text-slate-600">{{ unit }}</span>
      </p>

      <p v-if="displaySubtitle" class="text-xs font-medium text-slate-600">{{ displaySubtitle }}</p>

      <p v-if="delta !== undefined" class="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
        <span class="inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-medium" :class="trend.tone">
          <component :is="trend.icon" :size="12" aria-hidden="true" />
          {{ deltaText }}
        </span>
        <span class="text-slate-600">{{ displayDeltaLabel }}</span>
      </p>
    </div>
  </component>
</template>