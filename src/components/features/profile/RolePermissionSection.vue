<!-- src/components/features/profile/RolePermissionSection.vue -->
<script setup lang="ts">
import {
  ShieldCheck,
  UserRound,
  ClipboardList,
  LayoutGrid,
  Search,
  FileText,
  FolderArchive,
  CheckSquare,
  AlertCircle,
  ScrollText,
  KeyRound,
  Lock,
  Sparkles,
  Filter
} from '@lucide/vue'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import type { ProfileUser } from '../../../views/home/profile/ProfilePage.vue'
import { UserRoleDataJson } from '../../../@data/User.data.ts'

const props = defineProps<{ user: ProfileUser }>()

const { t, locale } = useI18n()
const searchQuery = ref('')
const selectedModuleFilter = ref('ALL')

const roleLabel = computed(() => {
  const isEn = locale.value === 'en'
  const r = (props.user.role || '').toUpperCase()
  if (r === 'ADMIN') return isEn ? 'Administrator' : 'Administrateur'
  if (r === 'USER') return isEn ? 'User' : 'Utilisateur'
  const match = (UserRoleDataJson as { value: string; label: string }[])?.find(
    (item) => item.value === props.user.role
  )
  return match?.label ?? props.user.role ?? (isEn ? 'User' : 'Utilisateur')
})

type ActionBadge = {
  raw: string
  label: string
  variant: 'green' | 'blue' | 'amber' | 'rose' | 'indigo' | 'gray'
}

function parseAction(actionRaw: string): ActionBadge {
  const isEn = locale.value === 'en'
  const upper = actionRaw.toUpperCase()
  if (['CREATE', 'UPLOAD'].includes(upper)) {
    return {
      raw: upper,
      label: upper === 'UPLOAD' ? (isEn ? 'Upload' : 'Téléverser') : (isEn ? 'Create' : 'Créer'),
      variant: 'green'
    }
  }
  if (['READ', 'VIEW', 'SHOW'].includes(upper)) {
    return {
      raw: upper,
      label: isEn ? 'View' : 'Consulter',
      variant: 'blue'
    }
  }
  if (['UPDATE', 'RENAME', 'ANSWER', 'ASSIGN', 'CHANGE_STATUS'].includes(upper)) {
    let label = isEn ? 'Edit' : 'Modifier'
    if (upper === 'RENAME') label = isEn ? 'Rename' : 'Renommer'
    if (upper === 'ANSWER') label = isEn ? 'Fill / Answer' : 'Remplir / Répondre'
    if (upper === 'ASSIGN') label = isEn ? 'Assign' : 'Assigner'
    if (upper === 'CHANGE_STATUS') label = isEn ? 'Change status' : 'Changer statut'
    return { raw: upper, label, variant: 'amber' }
  }
  if (['DELETE', 'DISABLE'].includes(upper)) {
    return {
      raw: upper,
      label: upper === 'DISABLE' ? (isEn ? 'Disable' : 'Désactiver') : (isEn ? 'Delete' : 'Supprimer'),
      variant: 'rose'
    }
  }
  if (['ENABLE'].includes(upper)) {
    return { raw: upper, label: isEn ? 'Enable' : 'Activer', variant: 'green' }
  }
  if (['DOWNLOAD'].includes(upper)) {
    return { raw: upper, label: isEn ? 'Download' : 'Télécharger', variant: 'indigo' }
  }
  return { raw: upper, label: actionRaw.toLowerCase(), variant: 'gray' }
}

function resolveModuleCategory(permission: string) {
  const isEn = locale.value === 'en'
  if (permission.startsWith('USER_ROLE') || permission.startsWith('USER_PERMISSION') || permission.startsWith('PERMISSION')) {
    return {
      key: 'SECURITY',
      title: isEn ? 'Permissions & Security' : 'Habilitations & Sécurité',
      desc: isEn ? 'User roles, permissions and access rights management' : 'Gestion des rôles, permissions et droits d’accès utilisateurs',
      icon: KeyRound
    }
  }
  if (permission.startsWith('USER')) {
    return {
      key: 'USER',
      title: isEn ? 'User Management' : 'Gestion des Utilisateurs',
      desc: isEn ? 'Staff accounts, profile cards and directory' : 'Comptes collaborateurs, fiches de profil et annuaire',
      icon: UserRound
    }
  }
  if (permission.startsWith('DOCUMENT')) {
    return {
      key: 'DOCUMENT',
      title: isEn ? 'Document Management (EDMS)' : 'Gestion Documentaire (GED)',
      desc: isEn ? 'Folders, HSSE procedures, technical sheets and uploads' : 'Dossiers, procédures HSSE, fiches techniques et uploads',
      icon: FolderArchive
    }
  }
  if (permission.startsWith('CHECKLIST_TEMPLATE')) {
    return {
      key: 'CHECKLIST_TEMPLATE',
      title: isEn ? 'Inspection & VMC Templates' : 'Modèles d’Inspections & VMC',
      desc: isEn ? 'Check sheet templates and configuration' : 'Création et configuration des grilles de contrôle',
      icon: ClipboardList
    }
  }
  if (permission.startsWith('CHECKLIST')) {
    return {
      key: 'CHECKLIST',
      title: isEn ? 'Checklist Execution' : 'Réalisation des Checklists',
      desc: isEn ? 'Field inspections execution, checks and reports' : 'Passage des inspections terrain, contrôles et rapports',
      icon: CheckSquare
    }
  }
  if (permission.startsWith('ACTION')) {
    return {
      key: 'ACTION',
      title: isEn ? 'Corrective Action Plans' : 'Plans d’Actions Correctives',
      desc: isEn ? 'Tracking deviations, resolutions and action assignments' : 'Suivi des écarts, résolutions et assignations d’actions',
      icon: AlertCircle
    }
  }
  if (permission.startsWith('LOG')) {
    return {
      key: 'LOG',
      title: isEn ? 'Audit Trails & Logs' : 'Journaux d’Audit & Logs',
      desc: isEn ? 'Operation traceability and compliance audit history' : 'Traçabilité des opérations et historique de conformité',
      icon: ScrollText
    }
  }
  return {
    key: 'OTHER',
    title: isEn ? 'Other Permissions' : 'Autres Habilitations',
    desc: isEn ? 'Miscellaneous HSSE system rights' : 'Droits divers du système HSSE',
    icon: LayoutGrid
  }
}

const categorizedPermissions = computed(() => {
  const perms = props.user.permissions ?? []
  const map = new Map<
    string,
    {
      key: string
      title: string
      desc: string
      icon: any
      actions: ActionBadge[]
    }
  >()

  for (const perm of perms) {
    const mod = resolveModuleCategory(perm)
    if (!map.has(mod.key)) {
      map.set(mod.key, {
        key: mod.key,
        title: mod.title,
        desc: mod.desc,
        icon: mod.icon,
        actions: []
      })
    }

    const parts = perm.split('_')
    const actionPart = parts[parts.length - 1]
    const badge = parseAction(actionPart)

    // avoid duplicate action badges in the same category display
    const exists = map.get(mod.key)!.actions.some((a) => a.label === badge.label)
    if (!exists) {
      map.get(mod.key)!.actions.push(badge)
    }
  }

  return Array.from(map.values())
})

const availableModuleFilters = computed(() => {
  const list = [
    { key: 'ALL', label: locale.value === 'en' ? 'All modules' : 'Tous les modules', count: props.user.permissions?.length ?? 0 }
  ]
  for (const group of categorizedPermissions.value) {
    list.push({
      key: group.key,
      label: group.title,
      count: group.actions.length
    })
  }
  return list
})

const filteredGroups = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  return categorizedPermissions.value
    .filter((group) => {
      if (selectedModuleFilter.value !== 'ALL' && group.key !== selectedModuleFilter.value) {
        return false
      }
      if (!query) return true
      const matchesTitle = group.title.toLowerCase().includes(query)
      const matchesActions = group.actions.some((a) => a.label.toLowerCase().includes(query) || a.raw.toLowerCase().includes(query))
      return matchesTitle || matchesActions
    })
})

const badgeClasses: Record<ActionBadge['variant'], string> = {
  green: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
  blue: 'bg-blue-50 text-blue-700 border-blue-200/80',
  amber: 'bg-amber-50 text-amber-700 border-amber-200/80',
  rose: 'bg-rose-50 text-rose-700 border-rose-200/80',
  indigo: 'bg-indigo-50 text-indigo-700 border-indigo-200/80',
  gray: 'bg-slate-100 text-slate-700 border-slate-200'
}
</script>

<template>
  <div class="flex flex-col gap-5 p-1">
    <!-- BANNIERE RESUME ROLE -->
    <div class="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
      <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div class="flex items-center gap-3">
          <div
            class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-xs"
          >
            <ShieldCheck class="h-6 w-6" />
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h4 class="text-base font-bold text-slate-900">{{ roleLabel }}</h4>
              <span
                class="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800"
              >
                {{ locale === 'en' ? 'HSSE Authorized' : 'Habilité HSSE' }}
              </span>
            </div>
            <p class="text-xs text-slate-500 mt-0.5">
              {{
                props.user.role === 'ADMIN'
                  ? (locale === 'en' ? 'Extended administrator access: global supervision, permission management and portal configuration.' : 'Accès administrateur étendu : supervision globale, gestion des habilitations et paramétrage du portail.')
                  : (locale === 'en' ? 'Standard user access: executing field inspections, viewing documents and tracking actions.' : 'Accès utilisateur standard : exécution des inspections terrain, consultation documentaire et suivi d’actions.')
              }}
            </p>
          </div>
        </div>

        <div class="flex items-center gap-2 rounded-lg bg-slate-50 border border-slate-200 px-3.5 py-2">
          <KeyRound class="h-4 w-4 text-[#0F9D58]" />
          <div class="text-left">
            <span class="block text-xs font-bold text-slate-800 tabular-nums">
              {{ props.user.permissions?.length ?? 0 }} {{ locale === 'en' ? 'permissions' : 'permissions' }}
            </span>
            <span class="block text-[11px] text-slate-500">{{ locale === 'en' ? 'active in profile' : 'actives dans le profil' }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- RECHERCHE & FILTRES -->
    <div class="rounded-xl border border-slate-200 bg-white p-4 shadow-xs flex flex-col gap-3">
      <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <!-- Champ recherche -->
        <div class="relative flex-1">
          <Search class="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            v-model="searchQuery"
            type="text"
            :placeholder="locale === 'en' ? 'Filter permissions (e.g. view, create, document, checklist...)' : 'Filtrer les permissions (ex: consulter, créer, document, checklist...)'"
            class="w-full rounded-lg border border-slate-200 bg-slate-50/50 py-2 pl-9 pr-3 text-xs text-slate-800 placeholder-slate-400 transition focus:border-[#0F9D58] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0F9D58]"
          />
        </div>

        <!-- Legende couleurs -->
        <div class="flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
          <span class="flex items-center gap-1 font-medium text-slate-600">
            <span class="h-2 w-2 rounded-full bg-blue-500"></span> {{ locale === 'en' ? 'View' : 'Consultation' }}
          </span>
          <span class="flex items-center gap-1 font-medium text-slate-600">
            <span class="h-2 w-2 rounded-full bg-emerald-500"></span> {{ locale === 'en' ? 'Create' : 'Création' }}
          </span>
          <span class="flex items-center gap-1 font-medium text-slate-600">
            <span class="h-2 w-2 rounded-full bg-amber-500"></span> {{ locale === 'en' ? 'Edit' : 'Modification' }}
          </span>
          <span class="flex items-center gap-1 font-medium text-slate-600">
            <span class="h-2 w-2 rounded-full bg-rose-500"></span> {{ locale === 'en' ? 'Delete' : 'Suppression' }}
          </span>
        </div>
      </div>

      <!-- Filtres chips modules -->
      <div class="flex flex-wrap items-center gap-1.5 pt-1 border-t border-slate-100">
        <button
          v-for="flt in availableModuleFilters"
          :key="flt.key"
          type="button"
          @click="selectedModuleFilter = flt.key"
          class="rounded-md px-2.5 py-1 text-xs font-medium transition cursor-pointer"
          :class="
            selectedModuleFilter === flt.key
              ? 'bg-[#0F9D58] text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70 hover:text-slate-900'
          "
        >
          {{ flt.label }}
        </button>
      </div>
    </div>

    <!-- LISTE DES GROUPES / MODULES -->
    <div v-if="filteredGroups.length === 0" class="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-xs">
      <div class="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-400">
        <Lock class="h-5 w-5" />
      </div>
      <p class="mt-2 text-sm font-semibold text-slate-700">{{ locale === 'en' ? 'No matching permissions' : 'Aucune habilitation correspondante' }}</p>
      <p class="text-xs text-slate-500">
        {{
          searchQuery
            ? (locale === 'en' ? 'No permissions match your search.' : 'Aucune permission ne correspond à votre recherche.')
            : (locale === 'en' ? 'No specific permissions are assigned to this user.' : 'Aucune permission spécifique n’est assignée à cet utilisateur.')
        }}
      </p>
    </div>

    <div v-else class="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div
        v-for="group in filteredGroups"
        :key="group.key"
        class="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-xs transition hover:border-slate-300 hover:shadow-sm"
      >
        <div>
          <!-- Header du module -->
          <div class="flex items-start gap-3 mb-2.5">
            <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-[#0F9D58] border border-emerald-100">
              <component :is="group.icon" class="h-4.5 w-4.5" />
            </div>
            <div class="min-w-0 flex-1">
              <div class="flex items-center justify-between">
                <h5 class="text-sm font-bold text-slate-800">{{ group.title }}</h5>
                <span class="rounded bg-slate-100 px-1.5 py-0.5 text-[11px] font-semibold text-slate-600">
                  {{ group.actions.length }}
                </span>
              </div>
              <p class="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{{ group.desc }}</p>
            </div>
          </div>

          <!-- Badges d'actions -->
          <div class="flex flex-wrap gap-1.5 pt-2 border-t border-slate-100">
            <span
              v-for="action in group.actions"
              :key="action.raw"
              class="inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium"
              :class="badgeClasses[action.variant]"
            >
              {{ action.label }}
            </span>
          </div>
        </div>

        <div class="mt-3 pt-2 text-[11px] text-slate-400 border-t border-slate-50 flex items-center justify-between">
          <span>{{ locale === 'en' ? 'Module enabled' : 'Module activé' }}</span>
          <span class="text-emerald-700 font-medium flex items-center gap-1">
            <span class="h-1.5 w-1.5 rounded-full bg-emerald-500"></span> {{ locale === 'en' ? 'Compliant' : 'Conforme' }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>