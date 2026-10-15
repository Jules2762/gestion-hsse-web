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
import type { ProfileUser } from '../../../views/home/profile/ProfilePage.vue'
import { UserRoleDataJson } from '../../../@data/User.data.ts'

const props = defineProps<{ user: ProfileUser }>()

const searchQuery = ref('')
const selectedModuleFilter = ref('ALL')

const roleLabel = computed(() => {
  const match = (UserRoleDataJson as { value: string; label: string }[])?.find(
    (item) => item.value === props.user.role
  )
  return match?.label ?? props.user.role ?? 'Utilisateur'
})

type ActionBadge = {
  raw: string
  label: string
  variant: 'green' | 'blue' | 'amber' | 'rose' | 'indigo' | 'gray'
}

function parseAction(actionRaw: string): ActionBadge {
  const upper = actionRaw.toUpperCase()
  if (['CREATE', 'UPLOAD'].includes(upper)) {
    return {
      raw: upper,
      label: upper === 'UPLOAD' ? 'Téléverser' : 'Créer',
      variant: 'green'
    }
  }
  if (['READ', 'VIEW', 'SHOW'].includes(upper)) {
    return {
      raw: upper,
      label: 'Consulter',
      variant: 'blue'
    }
  }
  if (['UPDATE', 'RENAME', 'ANSWER', 'ASSIGN', 'CHANGE_STATUS'].includes(upper)) {
    let label = 'Modifier'
    if (upper === 'RENAME') label = 'Renommer'
    if (upper === 'ANSWER') label = 'Remplir / Répondre'
    if (upper === 'ASSIGN') label = 'Assigner'
    if (upper === 'CHANGE_STATUS') label = 'Changer statut'
    return { raw: upper, label, variant: 'amber' }
  }
  if (['DELETE', 'DISABLE'].includes(upper)) {
    return {
      raw: upper,
      label: upper === 'DISABLE' ? 'Désactiver' : 'Supprimer',
      variant: 'rose'
    }
  }
  if (['ENABLE'].includes(upper)) {
    return { raw: upper, label: 'Activer', variant: 'green' }
  }
  if (['DOWNLOAD'].includes(upper)) {
    return { raw: upper, label: 'Télécharger', variant: 'indigo' }
  }
  return { raw: upper, label: actionRaw.toLowerCase(), variant: 'gray' }
}

function resolveModuleCategory(permission: string) {
  if (permission.startsWith('USER_ROLE') || permission.startsWith('USER_PERMISSION') || permission.startsWith('PERMISSION')) {
    return {
      key: 'SECURITY',
      title: 'Habilitations & Sécurité',
      desc: 'Gestion des rôles, permissions et droits d’accès utilisateurs',
      icon: KeyRound
    }
  }
  if (permission.startsWith('USER')) {
    return {
      key: 'USER',
      title: 'Gestion des Utilisateurs',
      desc: 'Comptes collaborateurs, fiches de profil et annuaire',
      icon: UserRound
    }
  }
  if (permission.startsWith('DOCUMENT')) {
    return {
      key: 'DOCUMENT',
      title: 'Gestion Documentaire (GED)',
      desc: 'Dossiers, procédures HSSE, fiches techniques et uploads',
      icon: FolderArchive
    }
  }
  if (permission.startsWith('CHECKLIST_TEMPLATE')) {
    return {
      key: 'CHECKLIST_TEMPLATE',
      title: 'Modèles d’Inspections & VMC',
      desc: 'Création et configuration des grilles de contrôle',
      icon: ClipboardList
    }
  }
  if (permission.startsWith('CHECKLIST')) {
    return {
      key: 'CHECKLIST',
      title: 'Réalisation des Checklists',
      desc: 'Passage des inspections terrain, contrôles et rapports',
      icon: CheckSquare
    }
  }
  if (permission.startsWith('ACTION')) {
    return {
      key: 'ACTION',
      title: 'Plans d’Actions Correctives',
      desc: 'Suivi des écarts, résolutions et assignations d’actions',
      icon: AlertCircle
    }
  }
  if (permission.startsWith('LOG')) {
    return {
      key: 'LOG',
      title: 'Journaux d’Audit & Logs',
      desc: 'Traçabilité des opérations et historique de conformité',
      icon: ScrollText
    }
  }
  return {
    key: 'OTHER',
    title: 'Autres Habilitations',
    desc: 'Droits divers du système HSSE',
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
    { key: 'ALL', label: 'Tous les modules', count: props.user.permissions?.length ?? 0 }
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
                Habilité HSSE
              </span>
            </div>
            <p class="text-xs text-slate-500 mt-0.5">
              {{
                props.user.role === 'ADMIN'
                  ? 'Accès administrateur étendu : supervision globale, gestion des habilitations et paramétrage du portail.'
                  : 'Accès utilisateur standard : exécution des inspections terrain, consultation documentaire et suivi d’actions.'
              }}
            </p>
          </div>
        </div>

        <div class="flex items-center gap-2 rounded-lg bg-slate-50 border border-slate-200 px-3.5 py-2">
          <KeyRound class="h-4 w-4 text-[#0F9D58]" />
          <div class="text-left">
            <span class="block text-xs font-bold text-slate-800 tabular-nums">
              {{ props.user.permissions?.length ?? 0 }} permissions
            </span>
            <span class="block text-[11px] text-slate-500">actives dans le profil</span>
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
            placeholder="Filtrer les permissions (ex: consulter, créer, document, checklist...)"
            class="w-full rounded-lg border border-slate-200 bg-slate-50/50 py-2 pl-9 pr-3 text-xs text-slate-800 placeholder-slate-400 transition focus:border-[#0F9D58] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0F9D58]"
          />
        </div>

        <!-- Legende couleurs -->
        <div class="flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
          <span class="flex items-center gap-1 font-medium text-slate-600">
            <span class="h-2 w-2 rounded-full bg-blue-500"></span> Consultation
          </span>
          <span class="flex items-center gap-1 font-medium text-slate-600">
            <span class="h-2 w-2 rounded-full bg-emerald-500"></span> Création
          </span>
          <span class="flex items-center gap-1 font-medium text-slate-600">
            <span class="h-2 w-2 rounded-full bg-amber-500"></span> Modification
          </span>
          <span class="flex items-center gap-1 font-medium text-slate-600">
            <span class="h-2 w-2 rounded-full bg-rose-500"></span> Suppression
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
      <p class="mt-2 text-sm font-semibold text-slate-700">Aucune habilitation correspondante</p>
      <p class="text-xs text-slate-500">
        {{
          searchQuery
            ? 'Aucune permission ne correspond à votre recherche.'
            : 'Aucune permission spécifique n’est assignée à cet utilisateur.'
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
          <span>Module activé</span>
          <span class="text-emerald-700 font-medium flex items-center gap-1">
            <span class="h-1.5 w-1.5 rounded-full bg-emerald-500"></span> Conforme
          </span>
        </div>
      </div>
    </div>
  </div>
</template>