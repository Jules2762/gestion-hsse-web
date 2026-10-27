<!-- src/components/features/profile/InformationSection.vue -->
<script setup lang="ts">
    import type { ProfileUser } from '../../../views/home/profile/ProfilePage.vue'

    defineProps<{ user: ProfileUser }>()

    const fields: { label: string, key: keyof ProfileUser }[] = [
        { label: 'Prénom', key: 'first_name' },
        { label: 'Nom', key: 'last_name' },
        { label: 'E-mail', key: 'email' },
        { label: 'Téléphone', key: 'phone_number' },
        { label: 'Département', key: 'department' },
        { label: 'Fonction', key: 'job' },
    ]
</script>

<template>
    <div class="flex flex-col gap-y-1 p-4">
        <dl class="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
            <div v-for="field in fields" :key="field.key"
                class="flex flex-col gap-1 rounded-xl border border-border p-3">
                <dt class="text-xs font-medium text-text-muted">{{ field.label }}</dt>
                <dd class="text-sm font-medium text-text-primary">
                    {{ (user[field.key] as string) || 'Non renseigné' }}
                </dd>
            </div>
        </dl>
    </div>
</template>