<script setup lang="ts">
    import {
        Calendar,
        Check,
        ChevronDown,
        CircleSlash2,
        ClipboardCheck,
        Copy,
        Eye,
        EyeIcon,
        FileDown,
        FileTextIcon,
        Flame,
        ImageIcon,
        Link2,
        ListTodo,
        MessageSquare,
        Printer,
        Search,
        ShieldCheck,
        TimerReset,
        TriangleAlert,
        User,
        UserCheck2,
        X,
    } from '@lucide/vue'
    import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
    import Header from '../../../components/shared/Header.vue'

    import Card from '../../../components/features/dashboard/Card.vue'
    import {
        anchorId,
        buildTextSummary,
        collectActions,
        computeStats,
        copyToClipboard,
        downloadFile,
        dueDateLabel,
        DUE_TONE_CLASS,
        EMPTY_FILTERS,
        filterSections,
        formatDate,
        hasActiveFilters,
        highlight,
        PRIORITY_CONFIG,
        sectionsToCsv,
        slugify,
        STATUS_CONFIG,
        type ChecklistFilters,
        type ChecklistSectionVM,
        type ItemStatus,
    } from '../../../core/utils/checklist.utils.ts'
import ButtonFilter from '../../../components/ui/ButtonFilter.vue'

    /* -------------------------------------------------------------------------- */
    /* Données                                                                    */
    /* -------------------------------------------------------------------------- */

    const checklist = ref({
        title: 'Inspection Station-Service',
        description:
            "Formulaire standard d'inspection sécurité et environnementale pour les stations-service du réseau. À réaliser trimestriellement.",
        createdBy: 'Jules ARIMANANA',
        createdAt: '2023-09-12',
        updatedAt: '2023-09-28',
        inspector: 'Jules ARIMANANA',
    })

    const sections = ref<ChecklistSectionVM[]>([
        {
            id: 1,
            title: 'Équipements incendie',
            description:
                'Vérification des extincteurs, alarmes et accès aux sorties de secours.',
            icon: Flame,
            items: [
                {
                    id: 1,
                    question:
                        'Les extincteurs sont-ils tous en place et facilement accessibles ?',
                    answer: 'Oui',
                    status: 'CONFORME',
                    commentCount: 0,
                    photoCount: 2,
                },
                {
                    id: 2,
                    question:
                        'La date de dernière révision des extincteurs est-elle valide (< 1 an) ?',
                    answer: 'Non',
                    status: 'NON_CONFORME',
                    commentCount: 1,
                    photoCount: 1,
                    action: {
                        title: 'Planifier la maintenance annuelle des extincteurs zone A',
                        priority: 'HAUTE',
                        responsible: 'J. Dupont',
                        dueDate: '2023-10-30',
                        status: 'En cours',
                    },
                },
            ],
        },
        {
            id: 2,
            title: 'Sorties de secours',
            description:
                'Dégagement, signalisation et éclairage de sécurité des issues.',
            icon: ShieldCheck,
            items: [
                {
                    id: 1,
                    question: 'Les issues de secours sont-elles dégagées ?',
                    answer: 'Oui',
                    status: 'CONFORME',
                    commentCount: 0,
                    photoCount: 0,
                },
                {
                    id: 2,
                    question: "L'éclairage de sécurité est-il fonctionnel ?",
                    answer: 'Non applicable — site sans éclairage autonome',
                    status: 'NON_APPLICABLE',
                    commentCount: 2,
                    photoCount: 0,
                },
                {
                    id: 3,
                    question: 'La signalisation des issues est-elle visible de nuit ?',
                    answer: 'Non',
                    status: 'NON_CONFORME',
                    commentCount: 0,
                    photoCount: 3,
                    action: {
                        title: 'Remplacer les blocs de signalisation défectueux',
                        priority: 'MOYENNE',
                        responsible: 'M. Rakoto',
                        dueDate: '2023-11-15',
                        status: 'À faire',
                    },
                },
            ],
        },
    ])

    /* -------------------------------------------------------------------------- */
    /* Statistiques et actions                                                    */
    /* -------------------------------------------------------------------------- */

    const stats = computed(() => computeStats(sections.value))
    const actions = computed(() => collectActions(sections.value))

    function sectionStats(section: ChecklistSectionVM) {
        return computeStats([section])
    }

    /* -------------------------------------------------------------------------- */
    /* Filtres                                                                    */
    /* -------------------------------------------------------------------------- */

    const filters = reactive<ChecklistFilters>({ ...EMPTY_FILTERS, statuses: [] })
    const searchInput = ref<HTMLInputElement | null>(null)

    const visibleSections = computed(() => filterSections(sections.value, filters))

    const visibleCount = computed(() =>
        visibleSections.value.reduce(
            (total:number, section:any) => total + section.items.length,
            0,
        ),
    )

    const filtersActive = computed(() => hasActiveFilters(filters))

    function toggleStatus(status: ItemStatus) {
        const index = filters.statuses.indexOf(status)
        index === -1
            ? filters.statuses.push(status)
            : filters.statuses.splice(index, 1)
    }

    function resetFilters() {
        Object.assign(filters, { ...EMPTY_FILTERS, statuses: [] })
    }

    const STATUS_FILTERS: ItemStatus[] = [
        'NON_CONFORME',
        'CONFORME',
        'NON_APPLICABLE',
    ]

    /* -------------------------------------------------------------------------- */
    /* Accordéon                                                                  */
    /* -------------------------------------------------------------------------- */

    const openSections = ref<Set<number | string>>(new Set([sections.value[0]?.id]))

    /** Une recherche active déplie tout : sinon les résultats resteraient cachés. */
    function isOpen(sectionId: number | string) {
        return filtersActive.value || openSections.value.has(sectionId)
    }

    function toggleSection(sectionId: number | string) {
        if (filtersActive.value) return
        const next = new Set(openSections.value)
        next.has(sectionId) ? next.delete(sectionId) : next.add(sectionId)
        openSections.value = next
    }

    const allOpen = computed(() => openSections.value.size === sections.value.length)

    function toggleAll() {
        openSections.value = allOpen.value
            ? new Set()
            : new Set(sections.value.map((section:any) => section.id))
    }

    function openAll() {
        openSections.value = new Set(sections.value.map((section:any) => section.id))
    }

    function onEnter(el: Element) {
        const element = el as HTMLElement
        element.style.height = '0px'
        void element.offsetHeight
        element.style.height = `${element.scrollHeight}px`
    }

    function onAfterEnter(el: Element) {
        ; (el as HTMLElement).style.height = 'auto'
    }

    function onLeave(el: Element) {
        const element = el as HTMLElement
        element.style.height = `${element.scrollHeight}px`
        void element.offsetHeight
        element.style.height = '0px'
    }

    /* -------------------------------------------------------------------------- */
    /* Navigation par ancre                                                       */
    /* -------------------------------------------------------------------------- */

    const flashedAnchor = ref<string | null>(null)

    async function goToAnchor(anchor: string, sectionId: number | string) {
        resetFilters()
        openSections.value = new Set([...openSections.value, sectionId])
        await nextTick()

        document
            .getElementById(anchor)
            ?.scrollIntoView({ behavior: 'smooth', block: 'center' })

        flashedAnchor.value = anchor
        setTimeout(() => (flashedAnchor.value = null), 1600)
    }

    /* -------------------------------------------------------------------------- */
    /* Export, impression, copie                                                  */
    /* -------------------------------------------------------------------------- */

    const copied = ref<string | null>(null)

    function flagCopied(key: string) {
        copied.value = key
        setTimeout(() => (copied.value = null), 2000)
    }

    function exportCsv() {
        downloadFile(
            sectionsToCsv(sections.value),
            `${slugify(checklist.value.title)}-${new Date()
                .toISOString()
                .slice(0, 10)}.csv`,
        )
    }

    async function exportPdf() {
        resetFilters()
        openAll()
        await nextTick()
        window.print()
    }

    async function copySummary() {
        const ok = await copyToClipboard(
            buildTextSummary(checklist.value.title, sections.value),
        )
        if (ok) flagCopied('summary')
    }

    async function copyItemLink(anchor: string) {
        const { origin, pathname, search } = window.location
        const ok = await copyToClipboard(`${origin}${pathname}${search}#${anchor}`)
        if (ok) flagCopied(anchor)
    }

    /* -------------------------------------------------------------------------- */
    /* Raccourcis clavier                                                         */
    /* -------------------------------------------------------------------------- */

    function onKeydown(event: KeyboardEvent) {
        const target = event.target as HTMLElement | null
        const typing = target?.tagName === 'INPUT' || target?.tagName === 'TEXTAREA'

        if (event.key === '/' && !typing) {
            event.preventDefault()
            searchInput.value?.focus()
        }
        if (event.key === 'Escape' && filtersActive.value) {
            resetFilters()
            searchInput.value?.blur()
        }
    }

    onMounted(() => {
        window.addEventListener('keydown', onKeydown)

        const hash = window.location.hash.slice(1)
        const match = sections.value.find((section:any) =>
            section.items.some((item:any) => anchorId(section.id, item.id) === hash),
        )
        if (match) goToAnchor(hash, match.id)
    })

    onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
    <div class="flex flex-col bg-gray-50">
        <div class="no-print">
            <Header title="Fiche checklist" :thumbnails="[
                { label: 'Tableau de bord', name: 'DASHBOARD' },
                { label: 'Inspections', name: 'INSPECTION' },
                { label: 'Checklist', name: 'CHECKLIST' },
                { label: 'Fiche', name: 'CHECKLIST_DETAILS' },
            ]" />
        </div>

        <div class="no-print flex flex-col gap-3 p-4 sm:flex-row sm:items-start sm:justify-between">
            <p class="max-w-80 text-sm">
                Consultez les informations, la structure et les performances
                associées à cette checklist.
            </p>

            <div class="flex flex-wrap gap-3">
                <ButtonFilter text="Prévisualiser" :icon="Eye"/>
                <ButtonFilter :text="copied === 'summary' ? 'Copié' : 'Copier le résumé' " :icon="Eye" @click="copySummary"/>
                <ButtonFilter text="Exporter en CSV" :icon="FileDown" @click="exportCsv"/>
                <ButtonFilter text="Exporter en PDF" :icon="Printer" is-primary @click="exportPdf"/>
              
                
            </div>
        </div>

        <!-- RÉSUMÉ -->
        <div class="grid grid-cols-1 gap-3 p-4 lg:grid-cols-6">
            <section class="flex flex-col gap-4 rounded border border-gray-200 bg-white p-6 lg:col-span-4">
                <div class="flex flex-row items-start justify-between gap-4">
                    <h5>{{ checklist.title }}</h5>
                    <div class="rounded-full border-2 border-primary/20 bg-primary/10 p-4 text-primary">
                        <FileTextIcon />
                    </div>
                </div>

                <p class="max-w-prose text-sm">{{ checklist.description }}</p>

                <div class="flex flex-col gap-2">
                    <div class="flex items-baseline justify-between">
                        <span class="text-sm text-gray-500">
                            Taux de conformité
                        </span>
                        <span class="font-semibold text-black/80">
                            {{ stats.conformityRate }}%
                        </span>
                    </div>

                    <div class="h-2 w-full overflow-hidden rounded-full bg-gray-100" role="progressbar"
                        :aria-valuenow="stats.conformityRate" aria-valuemin="0" aria-valuemax="100">
                        <div class="h-full rounded-full bg-primary transition-[width] duration-500"
                            :style="{ width: `${stats.conformityRate}%` }" />
                    </div>

                    <p class="text-sm text-gray-500">
                        {{ stats.evaluated }} question{{
                            stats.evaluated > 1 ? 's' : ''
                        }}
                        évaluée{{ stats.evaluated > 1 ? 's' : '' }} sur
                        {{ stats.total }} · {{ stats.actions }} action{{
                            stats.actions > 1 ? 's' : ''
                        }}
                        corrective{{ stats.actions > 1 ? 's' : '' }}
                        <span v-if="stats.overdueActions" class="text-red-700">
                            dont {{ stats.overdueActions }} en retard
                        </span>
                    </p>
                </div>

                <hr class="text-gray-200" />

                <div class="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  
                   <Card title="Conformité" :value="stats.conforme" :icon="ShieldCheck" theme="green"
                        :subtitle="`sur ${stats.evaluated} évaluées`" clickable
                        :selected="filters.statuses.includes('CONFORME')" @click="toggleStatus('CONFORME')" />
                   <Card title="Non-conformité" :value="stats.nonConforme" :icon="TriangleAlert" theme="red"
                        :subtitle="`sur ${stats.evaluated} évaluées`" clickable
                        :selected="filters.statuses.includes('NON_CONFORME')" @click="toggleStatus('NON_CONFORME')" />
                   <Card title="Non applicable" :value="stats.nonApplicable" :icon="CircleSlash2" theme="gray"
                        :subtitle="`sur ${stats.evaluated} évaluées`" clickable
                        :selected="filters.statuses.includes('NON_APPLICABLE')" @click="toggleStatus('NON_APPLICABLE')" />
                    
                </div>
            </section>

            <!-- DÉTAILS -->
            <section class="flex flex-col gap-y-5 rounded border border-gray-200 bg-white p-6 lg:col-span-2">
                <h5>Détails checklist</h5>
                <hr class="text-gray-200" />

                <dl class="flex flex-col gap-y-5">
                    <div class="flex items-center justify-between gap-3">
                        <dt class="flex items-center gap-x-3">
                            <User :size="20" />
                            <span>Créateur</span>
                        </dt>
                        <dd class="font-semibold text-black/80">
                            {{ checklist.createdBy }}
                        </dd>
                    </div>

                    <div class="flex items-center justify-between gap-3">
                        <dt class="flex items-center gap-x-3">
                            <Calendar :size="20" />
                            <span>Création</span>
                        </dt>
                        <dd class="font-semibold text-black/80">
                            {{ formatDate(checklist.createdAt) }}
                        </dd>
                    </div>

                    <div class="flex items-center justify-between gap-3">
                        <dt class="flex items-center gap-x-3">
                            <TimerReset :size="20" />
                            <span>Dernière modif.</span>
                        </dt>
                        <dd class="font-semibold text-black/80">
                            {{ formatDate(checklist.updatedAt) }}
                        </dd>
                    </div>

                    <div class="flex items-center justify-between gap-3">
                        <dt class="flex items-center gap-x-3">
                            <UserCheck2 :size="20" />
                            <span>Inspecteur</span>
                        </dt>
                        <dd class="font-semibold text-black/80">
                            {{ checklist.inspector }}
                        </dd>
                    </div>
                </dl>
            </section>
        </div>

        <!-- PLAN D'ACTIONS -->
        <section v-if="actions.length" class="p-4">
            <div class="rounded border border-gray-200 bg-white p-6">
                <div class="mb-4 flex items-center gap-3">
                    <ListTodo :size="18" class="text-primary" />
                    <h5>Plan d'actions</h5>
                    <span v-if="stats.overdueActions" class="rounded-full bg-red-100 px-3 py-1 text-xs text-red-700">
                        {{ stats.overdueActions }} en retard
                    </span>
                </div>

                <ul class="divide-y divide-gray-200">
                    <li v-for="entry in actions" :key="entry.anchor" class="flex flex-wrap items-center gap-3 py-3">
                        <button type="button" class="text-left font-medium hover:text-primary hover:underline"
                            @click="goToAnchor(entry.anchor, entry.sectionId)">
                            {{ entry.action.title }}
                        </button>

                        <span class="rounded-full px-2 py-1 text-xs"
                            :class="PRIORITY_CONFIG[entry.action.priority].badge">
                            {{ PRIORITY_CONFIG[entry.action.priority].label }}
                        </span>

                        <span class="text-xs text-gray-500">
                            {{ entry.sectionTitle }}
                        </span>

                        <span class="ml-auto flex items-center gap-3 text-xs">
                            <span class="text-gray-600">
                                {{ entry.action.responsible }}
                            </span>
                            <span :class="DUE_TONE_CLASS[
                                dueDateLabel(entry.action.dueDate).tone
                                ]
                                ">
                                {{ dueDateLabel(entry.action.dueDate).text }}
                            </span>
                        </span>
                    </li>
                </ul>
            </div>
        </section>

        <!-- SECTIONS -->
        <div class="flex flex-col gap-y-3 p-4">
            <div class="flex flex-wrap items-center justify-between gap-3">
                <h5>Détails des sections</h5>

                <button type="button" class="no-print text-sm font-semibold text-primary hover:underline"
                    :disabled="filtersActive" :class="filtersActive && 'cursor-not-allowed opacity-40'"
                    @click="toggleAll">
                    {{ allOpen ? 'Tout replier' : 'Tout déplier' }}
                </button>
            </div>

            <!-- BARRE DE FILTRES -->
            <div class="no-print flex flex-wrap items-center gap-3 rounded-2xl border border-gray-200 bg-white p-3">
                <div class="relative min-w-60 flex-1">
                    <Search :size="16" class="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
                    <input ref="searchInput" v-model="filters.search" type="search"
                        placeholder="Rechercher une question, un responsable…  ( / )"
                        class="w-full rounded-full border border-gray-200 py-2 pr-9 pl-9 text-sm focus:border-primary focus:outline-none" />
                    <button v-if="filters.search" type="button"
                        class="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-black"
                        aria-label="Effacer la recherche" @click="filters.search = ''">
                        <X :size="16" />
                    </button>
                </div>

                <div class="flex flex-wrap items-center gap-2">
                    <button v-for="status in STATUS_FILTERS" :key="status" type="button"
                        class="flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs transition-colors"
                        :class="filters.statuses.includes(status)
                                ? 'border-primary bg-primary/10 text-primary'
                                : 'border-gray-200 text-gray-600 hover:border-gray-300'
                            " :aria-pressed="filters.statuses.includes(status)" @click="toggleStatus(status)">
                        <span class="size-2 rounded-full" :class="STATUS_CONFIG[status].dot" />
                        {{ STATUS_CONFIG[status].label }}
                    </button>

                    <button type="button" class="rounded-full border px-3 py-1.5 text-xs transition-colors" :class="filters.withActionOnly
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-gray-200 text-gray-600 hover:border-gray-300'
                        " :aria-pressed="filters.withActionOnly"
                        @click="filters.withActionOnly = !filters.withActionOnly">
                        Avec action
                    </button>

                    <button type="button" class="rounded-full border px-3 py-1.5 text-xs transition-colors" :class="filters.nonConformeFirst
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-gray-200 text-gray-600 hover:border-gray-300'
                        " :aria-pressed="filters.nonConformeFirst"
                        @click="filters.nonConformeFirst = !filters.nonConformeFirst">
                        Écarts en premier
                    </button>
                </div>

                <div v-if="filtersActive" class="flex items-center gap-3 text-xs text-gray-500">
                    <span>
                        {{ visibleCount }} résultat{{
                            visibleCount > 1 ? 's' : ''
                        }}
                    </span>
                    <button type="button" class="font-semibold text-primary hover:underline" @click="resetFilters">
                        Réinitialiser
                    </button>
                </div>
            </div>

            <p v-if="visibleSections.length === 0"
                class="rounded-3xl border border-dashed border-gray-200 p-10 text-center text-gray-500">
                Aucune question ne correspond à ces critères.
                <button type="button" class="font-semibold text-primary hover:underline" @click="resetFilters">
                    Réinitialiser les filtres
                </button>
            </p>

            <div class="space-y-4">
                <div v-for="section in visibleSections" :key="section.id"
                    class="overflow-hidden rounded-3xl border border-gray-200 bg-white">
                    <!-- EN-TÊTE -->
                    <button type="button"
                        class="flex w-full items-center justify-between gap-4 p-5 text-left focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-primary"
                        :aria-expanded="isOpen(section.id)" :aria-controls="`section-panel-${section.id}`"
                        @click="toggleSection(section.id)">
                        <div class="flex items-start gap-3">
                            <component :is="section.icon" :size="18" class="mt-1 shrink-0 text-primary" />

                            <div>
                                <h5>{{ section.id }}. {{ section.title }}</h5>
                                <p class="text-sm text-gray-500">
                                    {{ section.description }}
                                </p>
                            </div>
                        </div>

                        <div class="flex shrink-0 items-center gap-3">
                            <span v-if="sectionStats(section).nonConforme"
                                class="rounded-full bg-red-100 px-3 py-1 text-xs text-red-700">
                                {{ sectionStats(section).nonConforme }} écart{{
                                    sectionStats(section).nonConforme > 1 ? 's' : ''
                                }}
                            </span>

                            <span class="rounded-full bg-gray-100 px-3 py-1 text-xs">
                                {{ sectionStats(section).conformityRate }}% ·
                                {{ section.items.length }} question{{
                                    section.items.length > 1 ? 's' : ''
                                }}
                            </span>

                            <ChevronDown :size="18" class="no-print transition-transform duration-300"
                                :class="isOpen(section.id) && 'rotate-180'" />
                        </div>
                    </button>

                    <!-- QUESTIONS -->
                    <transition name="accordion" @enter="onEnter" @after-enter="onAfterEnter" @leave="onLeave">
                        <div v-show="isOpen(section.id)" :id="`section-panel-${section.id}`" class="accordion-panel">
                            <div class="space-y-3 border-t border-gray-200 bg-gray-50/60 p-4">
                                <article v-for="item in section.items" :id="anchorId(section.id, item.id)"
                                    :key="item.id" class="group rounded-2xl border bg-white p-4" :class="[
                                        STATUS_CONFIG[item.status].card,
                                        flashedAnchor === anchorId(section.id, item.id) &&
                                        'ring-2 ring-primary',
                                    ]">
                                    <div class="flex items-start justify-between gap-3">
                                        <h5>
                                            {{ section.id }}.{{ item.id }}
                                            <span v-html="highlight(
                                                item.question,
                                                filters.search,
                                            )
                                                " />
                                        </h5>

                                        <div class="flex shrink-0 items-center gap-2">
                                            <button type="button"
                                                class="no-print rounded p-1 text-gray-400 opacity-0 transition-opacity group-hover:opacity-100 hover:text-primary focus:opacity-100"
                                                :aria-label="`Copier le lien vers la question ${section.id}.${item.id}`"
                                                @click="
                                                    copyItemLink(
                                                        anchorId(section.id, item.id),
                                                    )
                                                    ">
                                                <Check v-if="
                                                    copied ===
                                                    anchorId(section.id, item.id)
                                                " :size="14" />
                                                <Link2 v-else :size="14" />
                                            </button>

                                            <span class="rounded-full px-3 py-1 text-xs"
                                                :class="STATUS_CONFIG[item.status].badge">
                                                {{ STATUS_CONFIG[item.status].label }}
                                            </span>
                                        </div>
                                    </div>

                                    <!-- RÉPONSE -->
                                    <div class="mt-4">
                                        <span class="text-xs font-semibold text-gray-500">
                                            Réponse
                                        </span>
                                        <p class="mt-1" v-html="highlight(item.answer, filters.search)
                                            " />
                                    </div>

                                    <!-- PIÈCES JOINTES -->
                                    <div v-if="item.commentCount || item.photoCount"
                                        class="mt-3 flex flex-wrap items-center gap-4 text-xs text-gray-500">
                                        <span v-if="item.commentCount" class="flex items-center gap-1.5">
                                            <MessageSquare :size="14" />
                                            {{ item.commentCount }} commentaire{{
                                                item.commentCount > 1 ? 's' : ''
                                            }}
                                        </span>

                                        <span v-if="item.photoCount" class="flex items-center gap-1.5">
                                            <ImageIcon :size="14" />
                                            {{ item.photoCount }} photo{{
                                                item.photoCount > 1 ? 's' : ''
                                            }}
                                        </span>
                                    </div>

                                    <!-- ACTION CORRECTIVE -->
                                    <div v-if="item.action" class="mt-4 rounded-xl border border-gray-200 bg-white p-4">
                                        <div class="mb-3 flex items-center gap-2 text-xs text-gray-500">
                                            <ClipboardCheck :size="14" />
                                            Action corrective
                                        </div>

                                        <h5 v-html="highlight(
                                            item.action.title,
                                            filters.search,
                                        )
                                            " />

                                        <div class="mt-3 flex flex-wrap items-center gap-3 text-xs">
                                            <span class="rounded-full px-2 py-1" :class="PRIORITY_CONFIG[item.action.priority]
                                                    .badge
                                                ">
                                                {{
                                                    PRIORITY_CONFIG[
                                                        item.action.priority
                                                    ].label
                                                }}
                                            </span>

                                            <span class="flex items-center gap-1.5 text-gray-600">
                                                <User :size="14" />
                                                {{ item.action.responsible }}
                                            </span>

                                            <span class="flex items-center gap-1.5" :class="DUE_TONE_CLASS[
                                                dueDateLabel(item.action.dueDate)
                                                    .tone
                                                ]
                                                ">
                                                <Calendar :size="14" />
                                                {{
                                                    dueDateLabel(item.action.dueDate)
                                                        .text
                                                }}
                                            </span>

                                            <span class="ml-auto rounded-full bg-blue-100 px-2 py-1 text-blue-700">
                                                {{ item.action.status }}
                                            </span>
                                        </div>
                                    </div>
                                </article>
                            </div>
                        </div>
                    </transition>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.accordion-enter-active,
.accordion-leave-active {
    overflow: hidden;
    transition: height 0.28s ease;
}

@media (prefers-reduced-motion: reduce) {

    .accordion-enter-active,
    .accordion-leave-active {
        transition: none;
    }
}

@media print {
    .no-print {
        display: none !important;
    }

    /* v-show pose display:none en style inline : !important le neutralise */
    .accordion-panel {
        display: block !important;
        height: auto !important;
    }

    .group {
        break-inside: avoid;
    }
}
</style>