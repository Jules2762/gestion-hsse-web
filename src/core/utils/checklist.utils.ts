/* src/utils/checklist.utils.ts
 * Fonctions pures, réutilisables par la fiche, la liste et l'export.
 * Aucune dépendance à Vue : testable unitairement.
 */

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

export type ItemStatus = 'CONFORME' | 'NON_CONFORME' | 'NON_APPLICABLE'
export type ActionPriority = 'HAUTE' | 'MOYENNE' | 'BASSE'

export type ActionVM = {
    id?: number | string
    title: string
    priority: ActionPriority
    responsible: string
    /** Date ISO (YYYY-MM-DD) */
    dueDate: string
    status: string
}

export type ChecklistItemVM = {
    id: number | string
    number?: number | string
    displayCode?: string
    question: string
    answer: string
    status: ItemStatus
    commentCount: number
    photoCount: number
    action?: ActionVM
}

export type ChecklistSectionVM<Icon = unknown> = {
    id: number | string
    number?: number | string
    title: string
    description: string
    icon: Icon
    items: ChecklistItemVM[]
}

export type ChecklistStats = {
    total: number
    conforme: number
    nonConforme: number
    nonApplicable: number
    /** Questions réellement évaluées (hors non applicable) */
    evaluated: number
    /** Pourcentage entier, 0 si rien d'évaluable */
    conformityRate: number
    actions: number
    overdueActions: number
}

/* -------------------------------------------------------------------------- */
/* Configuration d'affichage                                                  */
/* -------------------------------------------------------------------------- */

export const STATUS_CONFIG: Record<
    ItemStatus,
    { label: string; badge: string; card: string; dot: string }
> = {
    CONFORME: {
        label: 'Conforme',
        badge: 'bg-green-100 text-green-700',
        card: 'border-gray-200',
        dot: 'bg-green-500',
    },
    NON_CONFORME: {
        label: 'Non conforme',
        badge: 'bg-red-100 text-red-700',
        card: 'border-red-200 bg-red-50/40',
        dot: 'bg-red-500',
    },
    NON_APPLICABLE: {
        label: 'Non applicable',
        badge: 'bg-gray-100 text-gray-600',
        card: 'border-gray-200 bg-gray-50/60',
        dot: 'bg-gray-400',
    },
}

export const PRIORITY_CONFIG: Record<
    ActionPriority,
    { label: string; badge: string; weight: number }
> = {
    HAUTE: { label: 'Haute priorité', badge: 'bg-red-100 text-red-700', weight: 0 },
    MOYENNE: {
        label: 'Priorité moyenne',
        badge: 'bg-amber-100 text-amber-700',
        weight: 1,
    },
    BASSE: { label: 'Priorité basse', badge: 'bg-gray-100 text-gray-600', weight: 2 },
}

export const STATUS_ORDER: ItemStatus[] = [
    'NON_CONFORME',
    'CONFORME',
    'NON_APPLICABLE',
]

/* -------------------------------------------------------------------------- */
/* Dates                                                                      */
/* -------------------------------------------------------------------------- */

const dateFormatter = new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
})

export function formatDate(iso?: string): string {
    if (!iso) return '—'
    const date = new Date(iso)
    return Number.isNaN(date.getTime()) ? iso : dateFormatter.format(date)
}

function startOfDay(date: Date): number {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime()
}

/** Jours restants avant l'échéance. Négatif si dépassée. */
export function daysUntil(iso: string, now = new Date()): number {
    const target = new Date(iso)
    if (Number.isNaN(target.getTime())) return 0
    return Math.round((startOfDay(target) - startOfDay(now)) / 86_400_000)
}

export function dueDateLabel(
    iso: string,
    now = new Date(),
): { text: string; tone: 'overdue' | 'soon' | 'normal' } {
    const days = daysUntil(iso, now)

    if (days < 0) {
        const late = Math.abs(days)
        return {
            text: `En retard de ${late} jour${late > 1 ? 's' : ''}`,
            tone: 'overdue',
        }
    }
    if (days === 0) return { text: "Échéance aujourd'hui", tone: 'soon' }
    if (days <= 7) {
        return { text: `Dans ${days} jour${days > 1 ? 's' : ''}`, tone: 'soon' }
    }
    return { text: formatDate(iso), tone: 'normal' }
}

export const DUE_TONE_CLASS: Record<'overdue' | 'soon' | 'normal', string> = {
    overdue: 'text-red-700 font-semibold',
    soon: 'text-amber-700 font-semibold',
    normal: 'text-gray-600',
}

/* -------------------------------------------------------------------------- */
/* Statistiques                                                               */
/* -------------------------------------------------------------------------- */

export function computeStats(
    sections: ChecklistSectionVM<unknown>[],
    now = new Date(),
): ChecklistStats {
    const items = sections.flatMap(section => section.items)
    const count = (status: ItemStatus) =>
        items.filter(item => item.status === status).length

    const conforme = count('CONFORME')
    const nonConforme = count('NON_CONFORME')
    const nonApplicable = count('NON_APPLICABLE')
    const evaluated = conforme + nonConforme
    const actions = items.filter(item => item.action)

    return {
        total: items.length,
        conforme,
        nonConforme,
        nonApplicable,
        evaluated,
        conformityRate:
            evaluated === 0 ? 0 : Math.round((conforme / evaluated) * 100),
        actions: actions.length,
        overdueActions: actions.filter(
            item => daysUntil(item.action!.dueDate, now) < 0,
        ).length,
    }
}

/** Actions correctives à plat, triées par échéance puis priorité. */
export function collectActions(sections: ChecklistSectionVM<unknown>[]) {
    return sections
        .flatMap(section =>
            section.items
                .filter(item => item.action)
                .map(item => ({
                    action: item.action!,
                    sectionId: section.id,
                    sectionTitle: section.title,
                    itemId: item.id,
                    anchor: anchorId(section.id, item.id),
                })),
        )
        .sort((a, b) => {
            const byDate = a.action.dueDate.localeCompare(b.action.dueDate)
            if (byDate !== 0) return byDate
            return (
                PRIORITY_CONFIG[a.action.priority].weight -
                PRIORITY_CONFIG[b.action.priority].weight
            )
        })
}

export function anchorId(
    sectionId: number | string,
    itemId: number | string,
): string {
    return `q-${sectionId}-${itemId}`
}

/* -------------------------------------------------------------------------- */
/* Recherche et filtres                                                       */
/* -------------------------------------------------------------------------- */

/** Minuscules sans accents : « réVISION » trouve « revision ». */
export function normalize(value: string): string {
    return value
        .normalize('NFD')
        .replace(/\p{Diacritic}/gu, '')
        .toLowerCase()
        .trim()
}

function itemMatches(item: ChecklistItemVM, needle: string): boolean {
    const haystack = normalize(
        [
            item.question,
            item.answer,
            item.action?.title ?? '',
            item.action?.responsible ?? '',
        ].join(' '),
    )
    return haystack.includes(needle)
}

export type ChecklistFilters = {
    search: string
    statuses: ItemStatus[]
    withActionOnly: boolean
    nonConformeFirst: boolean
}

export const EMPTY_FILTERS: ChecklistFilters = {
    search: '',
    statuses: [],
    withActionOnly: false,
    nonConformeFirst: false,
}

export function hasActiveFilters(filters: ChecklistFilters): boolean {
    return (
        filters.search.trim() !== '' ||
        filters.statuses.length > 0 ||
        filters.withActionOnly ||
        filters.nonConformeFirst
    )
}

export function filterSections<Icon>(
    sections: ChecklistSectionVM<Icon>[],
    filters: ChecklistFilters,
): ChecklistSectionVM<Icon>[] {
    const needle = normalize(filters.search)

    return sections
        .map(section => {
            let items = section.items

            if (filters.statuses.length > 0) {
                items = items.filter(item =>
                    filters.statuses.includes(item.status),
                )
            }
            if (filters.withActionOnly) {
                items = items.filter(item => item.action)
            }
            if (needle) {
                const sectionMatches = normalize(
                    `${section.title} ${section.description}`,
                ).includes(needle)
                if (!sectionMatches) {
                    items = items.filter(item => itemMatches(item, needle))
                }
            }
            if (filters.nonConformeFirst) {
                items = [...items].sort(
                    (a, b) =>
                        STATUS_ORDER.indexOf(a.status) -
                        STATUS_ORDER.indexOf(b.status),
                )
            }

            return { ...section, items }
        })
        .filter(section => section.items.length > 0)
}

/* -------------------------------------------------------------------------- */
/* Surlignage des résultats                                                   */
/* -------------------------------------------------------------------------- */

const HTML_ESCAPES: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
}

export function escapeHtml(value: string): string {
    return value.replace(/[&<>"']/g, char => HTML_ESCAPES[char])
}

/**
 * Renvoie du HTML échappé où les occurrences de `query` sont entourées de <mark>.
 * Comparaison sans accents, donc on parcourt la chaîne normalisée en gardant
 * les index d'origine (normalize NFD ne change pas le nombre de caractères ici
 * car on retire uniquement les diacritiques combinants après décomposition).
 */
export function highlight(text: string, query: string): string {
    const needle = normalize(query)
    if (!needle) return escapeHtml(text)

    const chars = [...text]
    const folded = chars.map(char => normalize(char) || ' ').join('')

    let result = ''
    let cursor = 0

    while (cursor < chars.length) {
        const found = folded.indexOf(needle, cursor)
        if (found === -1) {
            result += escapeHtml(chars.slice(cursor).join(''))
            break
        }
        result += escapeHtml(chars.slice(cursor, found).join(''))
        result += `<mark class="rounded bg-yellow-200 px-0.5">${escapeHtml(
            chars.slice(found, found + needle.length).join(''),
        )}</mark>`
        cursor = found + needle.length
    }

    return result
}

/* -------------------------------------------------------------------------- */
/* Export                                                                     */
/* -------------------------------------------------------------------------- */

function csvCell(value: unknown): string {
    return `"${String(value ?? '').replace(/"/g, '""')}"`
}

/** CSV séparé par point-virgule + BOM : s'ouvre directement dans Excel FR. */
export function sectionsToCsv(sections: ChecklistSectionVM<unknown>[]): string {
    const header = [
        'Section',
        'N°',
        'Question',
        'Réponse',
        'Statut',
        'Commentaires',
        'Photos',
        'Action corrective',
        'Priorité',
        'Responsable',
        'Échéance',
        'Statut action',
    ]

    const rows = sections.flatMap((section, sIdx) =>
        section.items.map((item, iIdx) => [
            section.title,
            item.displayCode || `${section.number ?? sIdx + 1}.${item.number ?? iIdx + 1}`,
            item.question,
            item.answer,
            STATUS_CONFIG[item.status].label,
            item.commentCount,
            item.photoCount,
            item.action?.title ?? '',
            item.action ? PRIORITY_CONFIG[item.action.priority].label : '',
            item.action?.responsible ?? '',
            item.action ? formatDate(item.action.dueDate) : '',
            item.action?.status ?? '',
        ]),
    )

    return (
        '\uFEFF' +
        [header, ...rows].map(row => row.map(csvCell).join(';')).join('\r\n')
    )
}

export function downloadFile(
    content: string,
    filename: string,
    mime = 'text/csv;charset=utf-8',
): void {
    const url = URL.createObjectURL(new Blob([content], { type: mime }))
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    link.click()
    URL.revokeObjectURL(url)
}

export function slugify(value: string): string {
    return normalize(value).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

/** Résumé texte copiable dans un mail ou un compte rendu. */
export function buildTextSummary(
    title: string,
    sections: ChecklistSectionVM<unknown>[],
): string {
    const stats = computeStats(sections)
    const lines = [
        title,
        `Conformité : ${stats.conformityRate}% (${stats.conforme}/${stats.evaluated} évaluées)`,
        `Non-conformités : ${stats.nonConforme} · Non applicable : ${stats.nonApplicable}`,
        `Actions correctives : ${stats.actions}${stats.overdueActions ? ` dont ${stats.overdueActions} en retard` : ''
        }`,
        '',
    ]

    for (let sIdx = 0; sIdx < sections.length; sIdx++) {
        const section = sections[sIdx]
        const issues = section.items.filter(
            item => item.status === 'NON_CONFORME',
        )
        if (issues.length === 0) continue

        lines.push(`${section.number ?? sIdx + 1}. ${section.title}`)
        for (const item of issues) {
            lines.push(`  - ${item.displayCode ? `[${item.displayCode}] ` : ''}${item.question}`)
            if (item.action) {
                lines.push(
                    `    → ${item.action.title} (${item.action.responsible}, ${formatDate(
                        item.action.dueDate,
                    )})`,
                )
            }
        }
        lines.push('')
    }

    return lines.join('\n').trimEnd()
}

export async function copyToClipboard(text: string): Promise<boolean> {
    try {
        await navigator.clipboard.writeText(text)
        return true
    } catch {
        return false
    }
}