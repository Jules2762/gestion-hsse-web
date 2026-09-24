<!-- src/components/features/profile/RolePermissionSection.vue -->
<script setup lang="ts">
    import { ShieldCheck, UserRound, ClipboardList, LayoutGrid } from '@lucide/vue'
    import { computed } from 'vue'
    import type { ProfileUser } from '../../../views/home/profile/ProfilePage.vue'
    import { UserRoleDataJson } from '../../../@data/User.data.ts'

    const props = defineProps<{ user: ProfileUser }>()

    const roleLabel = computed(() => {
        const match = (UserRoleDataJson as { value: string, label: string }[])
            ?.find(item => item.value === props.user.role)
        return match?.label ?? props.user.role
    })

    const ACTION_LABELS: Record<string, string> = {
        VIEW: 'Consulter',
        CREATE: 'Créer',
        UPDATE: 'Modifier',
        DELETE: 'Supprimer',
    }

    const CATEGORY_ICONS: Record<string, any> = {
        USER: UserRound,
        CHECKLIST_TEMPLATE: ClipboardList,
    }

    // Regroupe des permissions du type "CHECKLIST_TEMPLATE_CREATE" en
    // { category: "CHECKLIST_TEMPLATE", actions: ["Créer", ...] }
    const groupedPermissions = computed(() => {

        const groups: Record<string, string[]> = {}

        for (const permission of props.user.permissions ?? []) {
            const parts = permission.split('_')
            const action = parts[parts.length - 1]
            const category = parts.slice(0, -1).join('_') || 'AUTRE'

            if (!groups[category]) groups[category] = []
            groups[category].push(ACTION_LABELS[action] ?? action)
        }

        return Object.entries(groups).map(([category, actions]) => ({
            category,
            label: category.replace(/_/g, ' ').toLowerCase(),
            icon: CATEGORY_ICONS[category] ?? LayoutGrid,
            actions,
        }))

    })
</script>

<template>
    <div class="flex flex-col gap-y-6 p-4">

        <div class="flex items-center gap-3 rounded-xl border border-border bg-surface p-4">
            <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-light text-primary">
                <ShieldCheck class="h-5 w-5" />
            </div>
            <div>
                <p class="text-xs text-text-muted">Rôle attribué</p>
                <p class="text-base font-semibold text-text-primary">{{ roleLabel }}</p>
            </div>
        </div>

        <div v-if="groupedPermissions.length === 0" class="text-sm text-text-muted italic">
            Aucune permission accordée pour le moment.
        </div>

        <div v-else class="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div v-for="group in groupedPermissions" :key="group.category"
                class="flex flex-col gap-3 rounded-xl border border-border p-4">
                <div class="flex items-center gap-2">
                    <component :is="group.icon" class="h-4 w-4 text-primary" />
                    <p class="text-sm font-medium capitalize text-text-primary">{{ group.label }}</p>
                </div>
                <div class="flex flex-wrap gap-1.5">
                    <span v-for="(action, i) in group.actions" :key="i"
                        class="rounded-full bg-primary-light px-2.5 py-1 text-xs font-medium text-primary">
                        {{ action }}
                    </span>
                </div>
            </div>
        </div>

    </div>
</template>