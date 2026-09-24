<!-- src/components/features/profile/RecentActivitySection.vue -->
<script setup lang="ts">
    import { ClipboardCheck, ClipboardList, UserPlus, PencilLine, ShieldCheck, Loader2, Inbox } from '@lucide/vue'
    import { computed, onMounted, ref } from 'vue'
    import Button from '../../ui/Button.vue'
    import { useUserService } from '../../../core/services/user.service.ts'

    interface Activity {
        id: string | number
        type: string
        title: string
        description: string
        created_at: string
    }

    const PAGE_SIZE = 3

    // NOTE : icône affichée selon le type d'activité renvoyé par l'API.
    // À adapter/compléter selon les vraies valeurs de "type" (ex: ceux
    // utilisés côté backend pour journaliser les actions).
    const TYPE_ICONS: Record<string, any> = {
        CHECKLIST_CREATED: ClipboardList,
        CHECKLIST_COMPLETED: ClipboardCheck,
        USER_CREATED: UserPlus,
        PROFILE_UPDATED: PencilLine,
        ROLE_UPDATED: ShieldCheck,
    }

    function iconFor(type: string) {
        return TYPE_ICONS[type] ?? ClipboardList
    }

    function timeAgo(dateString: string): string {

        const date = new Date(dateString)
        if (isNaN(date.getTime())) return ""

        const seconds = Math.floor((Date.now() - date.getTime()) / 1000)

        const ranges: [number, string][] = [
            [60, 'seconde'],
            [60, 'minute'],
            [24, 'heure'],
            [7, 'jour'],
            [4.345, 'semaine'],
            [12, 'mois'],
            [Number.POSITIVE_INFINITY, 'an'],
        ]

        let value = seconds
        let unit = 'seconde'

        for (const [limit, label] of ranges) {
            if (value < limit) {
                unit = label
                break
            }
            value = Math.floor(value / limit)
            unit = label
        }

        const rounded = Math.max(1, Math.floor(value))
        const plural = rounded > 1 && unit !== 'mois' ? 's' : ''

        return `il y a ${rounded} ${unit}${plural}`

    }

    /*
    |--------------------------------------------------------------------------
    | CHARGEMENT DES ACTIVITES
    |--------------------------------------------------------------------------
    */

    const service = useUserService()

    const activities = ref<Activity[]>([])
    const page = ref(1)
    const isLoading = ref(false)
    const isLoadingMore = ref(false)
    const loadError = ref("")
    const hasMore = ref(true)

    function getActivities(isLoadMore = false) {

        if (isLoadMore) {
            isLoadingMore.value = true
        } else {
            isLoading.value = true
        }
        loadError.value = ""

        // NOTE : hypothèse sur le nom/la signature de la méthode du service
        // (ex: getRecentActivities, getActivities...). À adapter selon l'API.
        // service.getRecentActivities({ page: page.value, limit: PAGE_SIZE })
        //     .then(res => {

        //         const items: Activity[] = res.data.items ?? res.data ?? []

        //         activities.value = isLoadMore
        //             ? [...activities.value, ...items]
        //             : items

        //         hasMore.value = items.length === PAGE_SIZE

        //     })
        //     .catch(() => {
        //         loadError.value = "Impossible de charger les activités récentes."
        //     })
        //     .finally(() => {
        //         isLoading.value = false
        //         isLoadingMore.value = false
        //     })

    }

    function loadMore() {
        page.value += 1
        getActivities(true)
    }

    const isEmpty = computed(() =>
        !isLoading.value && !loadError.value && activities.value.length === 0
    )

    onMounted(() => {
        getActivities()
    })
</script>

<template>
    <div class="bg-white flex flex-col gap-y-4 p-4 w-full rounded border border-gray-200">
        <div class="w-full flex flex-col gap-y-3">

            <h5>Activités récentes</h5>

            <!-- CHARGEMENT INITIAL -->
            <div v-if="isLoading" class="flex items-center justify-center py-10 text-text-muted">
                <Loader2 class="h-5 w-5 animate-spin mr-2" />
                Chargement...
            </div>

            <!-- ERREUR -->
            <div v-else-if="loadError" class="rounded-lg border border-danger/30 bg-danger/5 p-4 text-sm text-danger">
                {{ loadError }}
            </div>

            <!-- VIDE -->
            <div v-else-if="isEmpty" class="flex flex-col items-center gap-2 py-10 text-center text-text-muted">
                <Inbox class="h-6 w-6" />
                <p class="text-sm">Aucune activité récente pour le moment.</p>
            </div>

            <!-- LISTE -->
            <div v-else class="flex flex-col gap-y-2">
                <div v-for="activity in activities" :key="activity.id"
                    class="flex items-start gap-3 border border-gray-200/80 rounded p-4">
                    <div
                        class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-light text-primary">
                        <component :is="iconFor(activity.type)" class="h-4 w-4" />
                    </div>
                    <div class="flex-1">
                        <div class="flex items-center justify-between gap-2">
                            <h6>{{ activity.title }}</h6>
                            <span class="shrink-0 text-xs text-text-muted">{{ timeAgo(activity.created_at) }}</span>
                        </div>
                        <p class="text-sm text-text-muted line-clamp-2">{{ activity.description }}</p>
                    </div>
                </div>
            </div>

            <Button v-if="!isLoading && !loadError && hasMore" variant="ghost" :disabled="isLoadingMore"
                :left-icon="isLoadingMore ? Loader2 : undefined" @click="loadMore">
                {{ isLoadingMore ? 'Chargement...' : 'Voir plus' }}
            </Button>

        </div>
    </div>
</template>