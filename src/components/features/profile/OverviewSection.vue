<!-- src/components/features/profile/OverviewSection.vue -->
<script setup lang="ts">
    import { Building2, Briefcase, MailIcon, Phone, ShieldCheck, ArrowRight } from '@lucide/vue'
    import { computed } from 'vue'
    import type { ProfileUser } from '../../../views/home/profile/ProfilePage.vue'
    import { UserRoleDataJson } from '../../../@data/User.data.ts'

    const props = defineProps<{ user: ProfileUser }>()
    const emit = defineEmits<{ (e: 'go-to-tab', index: number): void }>()

    const roleLabel = computed(() => {
        const match = (UserRoleDataJson as { value: string, label: string }[])
            ?.find(item => item.value === props.user.role)
        return match?.label ?? props.user.role
    })

    const permissionCount = computed(() => props.user.permissions?.length ?? 0)
</script>

<template>
    <div class="flex flex-col gap-y-6 p-4">

        <!-- INFOS CLES -->
        <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div class="flex items-center gap-3 rounded-xl border border-border p-4">
                <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-light text-primary">
                    <Building2 class="h-4 w-4" />
                </div>
                <div>
                    <p class="text-xs text-text-muted">Département</p>
                    <p class="text-sm font-medium">{{ user.department || 'Non renseigné' }}</p>
                </div>
            </div>
            <div class="flex items-center gap-3 rounded-xl border border-border p-4">
                <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-light text-primary">
                    <Briefcase class="h-4 w-4" />
                </div>
                <div>
                    <p class="text-xs text-text-muted">Fonction</p>
                    <p class="text-sm font-medium">{{ user.job || 'Non renseignée' }}</p>
                </div>
            </div>
            <div class="flex items-center gap-3 rounded-xl border border-border p-4">
                <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-light text-primary">
                    <MailIcon class="h-4 w-4" />
                </div>
                <div>
                    <p class="text-xs text-text-muted">E-mail</p>
                    <p class="text-sm font-medium">{{ user.email || 'Non renseigné' }}</p>
                </div>
            </div>
            <div class="flex items-center gap-3 rounded-xl border border-border p-4">
                <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-light text-primary">
                    <Phone class="h-4 w-4" />
                </div>
                <div>
                    <p class="text-xs text-text-muted">Téléphone</p>
                    <p class="text-sm font-medium">{{ user.phone_number || 'Non renseigné' }}</p>
                </div>
            </div>
        </div>

        <!-- RESUME ROLE / PERMISSIONS -->
        <div class="flex items-center justify-between rounded-xl border border-border bg-surface p-4">
            <div class="flex items-center gap-3">
                <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-light text-primary">
                    <ShieldCheck class="h-4 w-4" />
                </div>
                <div>
                    <p class="text-sm font-medium text-text-primary">Rôle : {{ roleLabel }}</p>
                    <p class="text-xs text-text-muted">{{ permissionCount }} permission(s) accordée(s)</p>
                </div>
            </div>
            <button type="button" @click="emit('go-to-tab', 2)"
                class="flex items-center gap-1 text-xs font-medium text-primary hover:underline">
                Voir le détail
                <ArrowRight class="h-3.5 w-3.5" />
            </button>
        </div>

    </div>
</template>