<script setup lang="ts">
    import {
        ArrowLeft,
        Calendar,
        Check,
        CheckCircle2,
        ChevronDown,
        CircleSlash2,
        ClipboardCheck,
        Clock,
        Edit,
        Eye,
        FileDown,
        FileText as FileTextIcon,
        Flame,
        Fuel,
        ImageIcon,
        Link2,
        ListTodo,
        Loader2,
        MapPin,
        MessageSquare,
        Plus,
        Printer,
        Search,
        ShieldCheck,
        Tag,
        TimerReset,
        TriangleAlert,
        User,
        UserCheck2,
        X,
    } from '@lucide/vue'
    import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
    import { useRoute, useRouter } from 'vue-router'
    import { useI18n } from 'vue-i18n'
    import Header from '../../../components/shared/Header.vue'
    import SidebarLocationMap from '../../../components/shared/SidebarLocationMap.vue'

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
        type ActionPriority,
    } from '../../../core/utils/checklist.utils.ts'
    import ButtonFilter from '../../../components/ui/ButtonFilter.vue'
    import LocationPickerMap from '../../../components/shared/LocationPickerMap.vue'
    import siteService from '../../../core/services/site.service.ts'
    import { ChecklistStatusJsonData } from '../../../@data/Checklist.data.ts'
    import { useChecklistService } from '../../../core/services/checklist.service.ts'
    import { useActionService } from '../../../core/services/action.service.ts'
    import { useUserService } from '../../../core/services/user.service.ts'
    import personnelService from '../../../core/services/personnel.service.ts'
    import type { ActionStatusType } from '../../../@types/Action.type.ts'
    import { toast } from 'vue3-toastify'

    const router = useRouter()
    const { t, locale } = useI18n()

    function getStatusLabel(status: ItemStatus) {
        if (locale.value === 'en') {
            if (status === 'CONFORME') return 'Compliant'
            if (status === 'NON_CONFORME') return 'Non-compliant'
            if (status === 'NON_APPLICABLE') return 'Not applicable'
        }
        return STATUS_CONFIG[status]?.label || status
    }

    function getPriorityLabel(priority: ActionPriority) {
        if (locale.value === 'en') {
            if (priority === 'HAUTE') return 'High priority'
            if (priority === 'MOYENNE') return 'Medium priority'
            if (priority === 'BASSE') return 'Low priority'
        }
        return PRIORITY_CONFIG[priority]?.label || priority
    }

    function formatDueDate(isoDate: string) {
        const orig = dueDateLabel(isoDate)
        if (locale.value === 'en') {
            let txt = orig.text
            txt = txt.replace('En retard de', 'Overdue by')
                     .replace('jours', 'days')
                     .replace('jour', 'day')
                     .replace('Aujourd’hui', 'Today')
                     .replace('Dans', 'In')
                     .replace('Demain', 'Tomorrow')
                     .replace('Pas d’échéance', 'No due date')
            return { ...orig, text: txt }
        }
        return orig
    }

    function formatLocalizedDate(iso?: string) {
        if (!iso) return '—'
        const date = new Date(iso)
        return Number.isNaN(date.getTime()) ? iso : new Intl.DateTimeFormat(locale.value === 'en' ? 'en-US' : 'fr-FR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        }).format(date)
    }

    /* -------------------------------------------------------------------------- */
    /* Données                                                                    */
    /* -------------------------------------------------------------------------- */

    const checklist = ref<{
        id?: string | number
        title: string
        description: string
        createdBy: string
        createdAt: string
        updatedAt: string
        inspector: string
        site?: string | null
        location?: string | null
        site_location?: {
            site_name?: string
            locality?: string
            province?: string
            latitude?: number | null
            longitude?: number | null
        } | null
        status?: string | null
        type?: string | null
        comment?: string | null
        date?: string | null
        time?: string | null
        latitude?: number | null
        longitude?: number | null
        rawInspectorId?: string | number | null
    }>({
        title: 'Inspection Station-Service',
        description:
            "Formulaire standard d'inspection sécurité et environnementale pour les stations-service du réseau. À réaliser trimestriellement.",
        createdBy: 'Jules ARIMANANA',
        createdAt: '2023-09-12',
        updatedAt: '2023-09-28',
        inspector: 'Jules ARIMANANA',
        site: null,
        location: null,
        site_location: null,
        status: null,
        type: null,
        comment: null,
        date: null,
        time: null,
        latitude: null,
        longitude: null,
        rawInspectorId: null,
    })

    const sections = ref<ChecklistSectionVM[]>([
        {
            id: 1,
            number: 1,
            title: 'Équipements incendie',
            description:
                'Vérification des extincteurs, alarmes et accès aux sorties de secours.',
            icon: Flame,
            items: [
                {
                    id: 1,
                    number: 1,
                    displayCode: '1.1',
                    question:
                        'Les extincteurs sont-ils tous en place et facilement accessibles ?',
                    answer: 'Oui',
                    status: 'CONFORME',
                    commentCount: 0,
                    photoCount: 2,
                },
                {
                    id: 2,
                    number: 2,
                    displayCode: '1.2',
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
            number: 2,
            title: 'Sorties de secours',
            description:
                'Dégagement, signalisation et éclairage de sécurité des issues.',
            icon: ShieldCheck,
            items: [
                {
                    id: 1,
                    number: 1,
                    displayCode: '2.1',
                    question: 'Les issues de secours sont-elles dégagées ?',
                    answer: 'Oui',
                    status: 'CONFORME',
                    commentCount: 0,
                    photoCount: 0,
                },
                {
                    id: 2,
                    number: 2,
                    displayCode: '2.2',
                    question: "L'éclairage de sécurité est-il fonctionnel ?",
                    answer: 'Non applicable — site sans éclairage autonome',
                    status: 'NON_APPLICABLE',
                    commentCount: 2,
                    photoCount: 0,
                },
                {
                    id: 3,
                    number: 3,
                    displayCode: '2.3',
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

    const route = useRoute()
    const checklistService = useChecklistService()
    const actionService = useActionService()
    const userService = useUserService()
    const usersList = ref<any[]>([])

    const personnelsList = ref<any[]>([])
    const actionPersonnelSearchQuery = ref('')

    const filteredActionPersonnels = computed(() => {
        const q = actionPersonnelSearchQuery.value.toLowerCase().trim()
        if (!q) return personnelsList.value
        return personnelsList.value.filter((p: any) => {
            const full = `${p.first_name || ''} ${p.last_name || ''} ${p.fonction || ''} ${p.direction || ''} ${p.email || ''}`.toLowerCase()
            return full.includes(q)
        })
    })

    function fetchPersonnels() {
        personnelService.indexAll()
            .then((res: any) => {
                personnelsList.value = res.data?.data || res.data || []
            })
            .catch((err: any) => {
                console.error('Erreur chargement personnels:', err)
            })
    }

    const loading = ref<boolean>(false)

    function mapApiResponse(data: any) {
        if (!data) return
        checklist.value = {
            id: data.id,
            title: data.title || checklist.value.title,
            description: data.description || 'Fiche de contrôle et inspection sécurité du réseau.',
            createdBy: data.added_by?.first_name ? `${data.added_by.first_name} ${data.added_by.last_name || ''}` : checklist.value.createdBy,
            createdAt: data.date || checklist.value.createdAt,
            updatedAt: data.completed_at || data.date || checklist.value.updatedAt,
            inspector: data.inspector?.first_name ? `${data.inspector.first_name} ${data.inspector.last_name || ''}` : (typeof data.inspector === 'string' ? data.inspector : checklist.value.inspector),
            site: data.site || null,
            location: data.location || null,
            site_location: data.site_location || null,
            status: data.status || null,
            type: data.type || null,
            comment: data.comment || null,
            date: data.date || null,
            time: data.time || null,
            latitude: data.latitude ?? data.site_location?.latitude ?? null,
            longitude: data.longitude ?? data.site_location?.longitude ?? null,
            rawInspectorId: data.inspector?.id ?? null,
        }

        if (data.sections && data.sections.length > 0) {
            sections.value = data.sections.map((sec: any, sIdx: number) => {
                const secOrder = (sec.order !== undefined && typeof sec.order === 'number' && !isNaN(sec.order))
                    ? sec.order
                    : sIdx + 1

                return {
                    id: sec.id || sIdx + 1,
                    number: secOrder,
                    title: sec.title || `Section ${secOrder}`,
                    description: sec.description || `Éléments de contrôle de la section ${sec.title || secOrder}`,
                    icon: sIdx % 2 === 0 ? Flame : ShieldCheck,
                    items: (sec.items || []).map((it: any, iIdx: number) => {
                        const itemOrder = (it.order !== undefined && typeof it.order === 'number' && !isNaN(it.order))
                            ? it.order
                            : iIdx + 1
                        const displayCode = `${secOrder}.${itemOrder}`

                        const ans = it.answer ? String(it.answer).trim() : ''
                        let status: ItemStatus = 'CONFORME'
                        if (ans.toUpperCase() === 'NON' || ans.toUpperCase() === 'NO') {
                            status = 'NON_CONFORME'
                        } else if (ans.toUpperCase().includes('APPLICABLE') || ans.toUpperCase() === 'N/A') {
                            status = 'NON_APPLICABLE'
                        } else if (ans.toUpperCase() === 'OUI' || ans.toUpperCase() === 'YES') {
                            status = 'CONFORME'
                        } else if (!ans) {
                            status = 'NON_CONFORME'
                        }

                        let actionObj = undefined
                        if (it.action) {
                            actionObj = {
                                id: it.action.id,
                                title: it.action.description,
                                priority: 'HAUTE' as const,
                                responsible: it.action.assignedUser ? `${it.action.assignedUser.first_name} ${it.action.assignedUser.last_name || ''}` : 'Non assigné',
                                assigned_to_id: it.action.assignedUser?.id,
                                dueDate: '',
                                status: it.action.status || 'PENDING',
                                email_status: it.action.email_status || 'NOT_SENT',
                                rawAction: it.action,
                            }
                        }

                        return {
                            id: it.id || iIdx + 1,
                            number: itemOrder,
                            displayCode: displayCode,
                            question: it.question,
                            answer: it.answer || 'Non évalué',
                            status: status,
                            commentCount: 0,
                            photoCount: 0,
                            action: actionObj,
                            rawItem: it,
                        }
                    })
                }
            })
        }
    }

    async function fetchChecklist() {
        const id = route.params.id as string
        if (!id) return
        loading.value = true
        try {
            const res = await checklistService.show(id)
            if (res.data?.data) {
                mapApiResponse(res.data.data)
            } else if (res.data) {
                mapApiResponse(res.data)
            }
        } catch (err) {
            console.error('Erreur chargement checklist:', err)
        } finally {
            loading.value = false
        }
    }

    async function fetchUsers() {
        try {
            const res = await userService.index()
            usersList.value = res.data?.data || res.data || []
        } catch (err) {
            console.error('Erreur chargement utilisateurs:', err)
        }
    }

    const checklistActionModal = ref({
        isOpen: false,
        isEdit: false,
        itemId: null as any,
        itemQuestion: '',
        description: '',
        assignedTo: null as any,
        status: 'PENDING' as ActionStatusType,
        saving: false,
    })

    function openAddChecklistAction(item: any) {
        checklistActionModal.value = {
            isOpen: true,
            isEdit: false,
            itemId: item.id,
            itemQuestion: item.question,
            description: '',
            assignedTo: null,
            status: 'PENDING',
            saving: false,
        }
    }

    function openEditChecklistAction(item: any) {
        checklistActionModal.value = {
            isOpen: true,
            isEdit: true,
            itemId: item.id,
            itemQuestion: item.question,
            description: item.action?.title || '',
            assignedTo: item.action?.assigned_to_id || item.action?.rawAction?.assigned_to || null,
            status: (item.action?.status as ActionStatusType) || 'PENDING',
            saving: false,
        }
    }

    async function saveChecklistAction() {
        if (!checklistActionModal.value.itemId || !checklistActionModal.value.description) return
        checklistActionModal.value.saving = true
        try {
            await actionService.storeChecklistAction({
                checklist_item_id: checklistActionModal.value.itemId,
                description: checklistActionModal.value.description,
                assigned_to: checklistActionModal.value.assignedTo || undefined,
                status: checklistActionModal.value.status,
            })
            checklistActionModal.value.isOpen = false
            fetchChecklist()
        } catch (err) {
            console.error('Erreur enregistrement action checklist:', err)
        } finally {
            checklistActionModal.value.saving = false
        }
    }

    async function updateChecklistActionStatus(actionId: any, newStatus: ActionStatusType) {
        if (!actionId) return
        try {
            await actionService.updateStatus('CHECKLIST', actionId, newStatus)
            fetchChecklist()
        } catch (err) {
            console.error('Erreur mise à jour statut checklist action:', err)
        }
    }

    // =========================================================
    // MODIFIER L'INSPECTION (EDIT INSPECTION MODAL)
    // =========================================================
    const modal_edit = ref(false)
    const loading_edit = ref(false)
    const editStationSearchQuery = ref('')

    const siteCategories = [
        { label: 'Station Service', value: 'STATION SERVICE' },
        { label: 'Magasin', value: 'MAGASIN' },
        { label: 'Agence', value: 'AGENCE' },
        { label: 'Véhicule', value: 'VEHICULE' },
        { label: 'Camion Citerne (CC)', value: 'CAMION CITERNE' },
        { label: 'Client B2B', value: 'B2B' },
    ]

    const registeredSites = ref<{
        id: number | string;
        name: string;
        locality?: string;
        province?: string;
        latitude?: number | null;
        longitude?: number | null;
    }[]>([])

    const zonePresets = [
        'Piste de distribution',
        'Boutique / Shop',
        'Local technique TGBT',
        'Zone Dépotage',
        'Baie de lavage / Vidange',
        'Bureaux administratifs',
        'Stockage & Cuves',
        'Parking & Dépôt',
        'Zone compresseur / Air',
        'Sanitaires / Vestiaires',
    ]

    function applyZonePreset(form: any, preset: string) {
        if (form.location === preset) {
            form.location = ''
        } else {
            form.location = preset
        }
    }

    const editForm = ref<{
        title: string;
        description: string;
        status: string;
        site_type: string;
        site: string;
        location: string;
        latitude?: number;
        longitude?: number;
        inspector_id?: string | number;
        date: string;
        time: string;
        comment: string;
    }>({
        title: '',
        description: '',
        status: 'IN_PROGRESS',
        site_type: 'STATION SERVICE',
        site: '',
        location: '',
        latitude: undefined,
        longitude: undefined,
        inspector_id: undefined,
        date: '',
        time: '',
        comment: '',
    })

    const isEditCartographyRequired = computed(() => {
        const st = (editForm.value.site_type || '').toUpperCase()
        return st === 'VEHICULE' || st === 'CAMION CITERNE' || st === 'B2B'
    })

    const filteredEditRegisteredSites = computed(() => {
        const q = editStationSearchQuery.value.trim().toLowerCase()
        if (!q) return registeredSites.value
        return registeredSites.value.filter(s =>
            s.name.toLowerCase().includes(q) ||
            (s.locality && s.locality.toLowerCase().includes(q)) ||
            (s.province && s.province.toLowerCase().includes(q))
        )
    })

    const selectedEditRegisteredSiteInfo = computed(() => {
        return registeredSites.value.find(s => s.name === editForm.value.site)
    })

    function loadRegisteredSites() {
        if (registeredSites.value.length === 0) {
            siteService.all()
                .then(res => {
                    const sList = res.data?.data || res.data || []
                    registeredSites.value = sList.map((s: any) => ({
                        id: s.id,
                        name: s.name,
                        locality: s.location?.locality || s.locality || '',
                        province: s.location?.province || s.province || '',
                        latitude: s.location?.latitude ?? s.latitude ?? null,
                        longitude: s.location?.longitude ?? s.longitude ?? null,
                    })).filter((s: any) => Boolean(s.name))
                })
                .catch(() => {})
        }
    }

    function openEditModal() {
        fetchUsers()
        loadRegisteredSites()

        let inferredSiteType = 'STATION SERVICE'
        const chkSiteUpper = (checklist.value.site || '').toUpperCase()
        const chkTypeUpper = (checklist.value.type || '').toUpperCase()
        if (chkSiteUpper === 'VEHICULE' || chkTypeUpper.includes('VEHICULE')) {
            inferredSiteType = 'VEHICULE'
        } else if (chkSiteUpper.includes('CITERNE') || chkTypeUpper.includes('CITERNE') || chkTypeUpper.includes('CAMION')) {
            inferredSiteType = 'CAMION CITERNE'
        } else if (chkSiteUpper === 'B2B' || chkTypeUpper.includes('B2B') || chkTypeUpper.includes('CONSO')) {
            inferredSiteType = 'B2B'
        } else if (chkSiteUpper === 'MAGASIN' || chkTypeUpper.includes('MAGASIN')) {
            inferredSiteType = 'MAGASIN'
        } else if (chkSiteUpper === 'AGENCE' || chkTypeUpper.includes('AGENCE')) {
            inferredSiteType = 'AGENCE'
        }

        editForm.value = {
            title: checklist.value.title || '',
            description: checklist.value.description || '',
            status: checklist.value.status || 'IN_PROGRESS',
            site_type: inferredSiteType,
            site: checklist.value.site || '',
            location: checklist.value.location || '',
            latitude: checklist.value.latitude ?? checklist.value.site_location?.latitude ?? undefined,
            longitude: checklist.value.longitude ?? checklist.value.site_location?.longitude ?? undefined,
            inspector_id: checklist.value.rawInspectorId ?? undefined,
            date: checklist.value.date || (checklist.value.createdAt ? checklist.value.createdAt.split('T')[0] : new Date().toISOString().split('T')[0]),
            time: checklist.value.time || '08:00',
            comment: checklist.value.comment || '',
        }

        editStationSearchQuery.value = ''
        modal_edit.value = true
    }

    function onEditSiteTypeChange() {
        if (!isEditCartographyRequired.value) {
            const existing = registeredSites.value.find(s => s.name === editForm.value.site)
            if (existing) {
                editForm.value.latitude = existing.latitude ?? undefined
                editForm.value.longitude = existing.longitude ?? undefined
            } else if (registeredSites.value.length > 0 && !editForm.value.site) {
                const first = registeredSites.value[0]
                editForm.value.site = first.name
                editForm.value.latitude = first.latitude ?? undefined
                editForm.value.longitude = first.longitude ?? undefined
            }
        }
    }

    function onEditRegisteredSiteChange(e: Event) {
        const target = e.target as HTMLSelectElement
        const siteName = target.value
        editForm.value.site = siteName
        const found = registeredSites.value.find(s => s.name === siteName)
        if (found) {
            editForm.value.latitude = found.latitude ?? undefined
            editForm.value.longitude = found.longitude ?? undefined
            if (!editForm.value.location) {
                editForm.value.location = found.name
            }
        }
    }

    function onEditLocationPickerDetected(data: { locality: string; province: string; dms: string; displayName: string; lat: number; lng: number }) {
        editForm.value.latitude = data.lat
        editForm.value.longitude = data.lng
        if (!editForm.value.location && (data.locality || data.displayName)) {
            editForm.value.location = data.locality || data.displayName
        }
    }

    async function submitEdit() {
        const id = route.params.id as string
        if (!id || !editForm.value.title || !editForm.value.date || !editForm.value.time) return
        loading_edit.value = true
        try {
            const payload: any = {
                title: editForm.value.title,
                description: editForm.value.description,
                status: editForm.value.status,
                site_type: editForm.value.site_type,
                site: editForm.value.site || editForm.value.site_type,
                location: editForm.value.location,
                latitude: editForm.value.latitude,
                longitude: editForm.value.longitude,
                inspector_id: editForm.value.inspector_id,
                date: editForm.value.date,
                time: editForm.value.time,
                comment: editForm.value.comment,
            }

            await checklistService.update(id, payload)
            toast.success(locale.value === 'en' ? 'Inspection updated successfully!' : 'Inspection modifiée avec succès !')
            modal_edit.value = false
            fetchChecklist()
        } catch (err: any) {
            const errorMsg = err.response?.data?.message || (locale.value === 'en' ? 'Failed to update inspection.' : 'Erreur lors de la modification de l\'inspection.')
            toast.error(errorMsg)
        } finally {
            loading_edit.value = false
        }
    }

    onMounted(() => {
        window.addEventListener('keydown', onKeydown)

        const hash = window.location.hash.slice(1)
        const match = sections.value.find((section:any) =>
            section.items.some((item:any) => anchorId(section.id, item.id) === hash),
        )
        if (match) goToAnchor(hash, match.id)

        fetchChecklist()
        fetchUsers()
    })

    onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
    <div class="flex flex-col bg-gray-50 min-h-screen">
        <!-- HEADER PRINCIPAL -->
        <div class="no-print">
            <Header title="inspections.checklists.details" :thumbnails="[
                { label: 'thumbnails.home', name: 'DASHBOARD' },
                { label: 'thumbnails.inspections', name: 'INSPECTION' },
                { label: 'thumbnails.checklists', name: 'CHECKLIST' },
                { label: 'thumbnails.details', name: 'CHECKLIST_DETAILS' },
            ]" />
        </div>

        <!-- BANDEAU DE NAVIGATION RAPIDE & ACTIONS -->
        <div class="no-print bg-white border-b border-gray-200 px-4 py-3 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
            <div class="flex items-center gap-3">
                <button
                    type="button"
                    @click="router.push({ name: 'CHECKLIST' })"
                    class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors cursor-pointer"
                >
                    <ArrowLeft :size="15" />
                    <span>{{ locale === 'en' ? 'Back to list' : 'Retour à la liste' }}</span>
                </button>
                <div class="h-4 w-px bg-gray-200 hidden sm:block"></div>
                <div class="flex items-center gap-2 flex-wrap">
                    <span v-if="checklist.type" class="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200 uppercase tracking-wide">
                        {{ checklist.type }}
                    </span>
                    <span
                        v-if="checklist.status"
                        class="px-2.5 py-0.5 rounded-full text-[11px] font-bold"
                        :class="checklist.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-blue-100 text-blue-800 border border-blue-200'"
                    >
                        {{ checklist.status === 'COMPLETED' ? (locale === 'en' ? 'Closed' : 'Clôturée') : (checklist.status === 'IN_PROGRESS' ? (locale === 'en' ? 'In progress' : 'En cours') : checklist.status) }}
                    </span>
                    <span v-if="checklist.site || checklist.location" class="hidden sm:inline-flex items-center gap-1 text-xs font-semibold text-gray-600 bg-gray-50 border border-gray-200 px-2.5 py-0.5 rounded-full">
                        <MapPin :size="12" class="text-primary" />
                        <span>{{ checklist.site || checklist.location }}</span>
                    </span>
                </div>
            </div>

            <div class="flex flex-wrap items-center gap-2">
                <ButtonFilter :text="locale === 'en' ? 'Edit info' : 'Modifier les infos'" :icon="Edit" @click="openEditModal" />
                <ButtonFilter :text="copied === 'summary' ? (locale === 'en' ? 'Summary copied!' : 'Résumé copié !') : (locale === 'en' ? 'Copy summary' : 'Copier le résumé')" :icon="copied === 'summary' ? Check : MessageSquare" @click="copySummary" />
                <ButtonFilter :text="locale === 'en' ? 'Export CSV' : 'Exporter en CSV'" :icon="FileDown" @click="exportCsv" />
                <ButtonFilter :text="locale === 'en' ? 'Export PDF' : 'Exporter en PDF'" :icon="Printer" is-primary @click="exportPdf" />
            </div>
        </div>

        <!-- DISPOSITION PRINCIPALE : TOUT LE CONTENU À GAUCHE, CARTOGRAPHIE & DÉTAILS À DROITE -->
        <div class="grid grid-cols-1 gap-4 p-4 lg:grid-cols-6 items-start">
            <!-- COLONNE GAUCHE (4 COLONNES) : SYNTHÈSE, PLAN D'ACTIONS, SECTIONS & QUESTIONS -->
            <div class="flex flex-col gap-4 lg:col-span-4 min-w-0">
                <!-- 1. SYNTHÈSE & PERFORMANCES -->
                <section class="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-2xs ">
                <div class="flex flex-row items-start justify-between gap-4">
                    <div>
                        <div class="flex items-center gap-2 mb-1.5 flex-wrap">
                            <span v-if="checklist.type" class="text-[11px] font-bold text-amber-800 bg-amber-100/70 border border-amber-200 px-2 py-0.5 rounded-full uppercase">
                                {{ checklist.type }}
                            </span>
                            <span class="text-xs text-gray-400 font-medium">
                                N° {{ route.params.id }}
                            </span>
                        </div>
                        <h4 class="text-lg sm:text-xl font-bold text-gray-900 leading-snug">{{ checklist.title }}</h4>
                        <p class="text-xs text-gray-500 mt-1 flex items-center gap-1.5 flex-wrap">
                            <MapPin :size="13" class="text-primary shrink-0" />
                            <span class="font-semibold text-gray-700">{{ checklist.site || checklist.location || (locale === 'en' ? 'Site not specified' : 'Site non spécifié') }}</span>
                            <span v-if="checklist.site_location?.locality" class="text-gray-400">
                                • {{ checklist.site_location.locality }} ({{ checklist.site_location.province }})
                            </span>
                        </p>
                    </div>
                    <div class="rounded-2xl border-2 border-primary/20 bg-primary/10 p-3.5 text-primary shrink-0">
                        <FileTextIcon :size="24" />
                    </div>
                </div>

                <p class="text-xs sm:text-sm text-gray-600 leading-relaxed">{{ checklist.description }}</p>

                <!-- BARRE DU TAUX DE CONFORMITÉ -->
                <div class="flex flex-col gap-2 pt-2 border-t border-gray-100">
                    <div class="flex items-baseline justify-between">
                        <span class="text-xs font-bold uppercase tracking-wider text-gray-500">
                            {{ locale === 'en' ? 'Overall compliance rate' : 'Taux de conformité global' }}
                        </span>
                        <span class="text-lg font-black" :class="stats.conformityRate >= 80 ? 'text-emerald-700' : (stats.conformityRate >= 50 ? 'text-amber-700' : 'text-red-700')">
                            {{ stats.conformityRate }}%
                        </span>
                    </div>

                    <div class="h-2.5 w-full overflow-hidden rounded-full bg-gray-100" role="progressbar"
                        :aria-valuenow="stats.conformityRate" aria-valuemin="0" aria-valuemax="100">
                        <div class="h-full rounded-full transition-all duration-500"
                            :class="stats.conformityRate >= 80 ? 'bg-emerald-500' : (stats.conformityRate >= 50 ? 'bg-amber-500' : 'bg-red-500')"
                            :style="{ width: `${stats.conformityRate}%` }" />
                    </div>

                    <div class="text-xs text-gray-500 flex items-center justify-between flex-wrap gap-2 mt-1">
                        <span>
                            <b>{{ stats.evaluated }}</b> {{ locale === 'en' ? `question${stats.evaluated > 1 ? 's' : ''} evaluated out of` : `question${stats.evaluated > 1 ? 's' : ''} évaluée${stats.evaluated > 1 ? 's' : ''} sur` }} <b>{{ stats.total }}</b>
                        </span>
                        <span>
                            <b>{{ stats.actions }}</b> {{ locale === 'en' ? `corrective action${stats.actions > 1 ? 's' : ''}` : `action${stats.actions > 1 ? 's' : ''} corrective${stats.actions > 1 ? 's' : ''}` }}
                            <span v-if="stats.overdueActions" class="text-red-700 font-bold ml-1">
                                ({{ locale === 'en' ? `including ${stats.overdueActions} overdue` : `dont ${stats.overdueActions} en retard` }})
                            </span>
                        </span>
                    </div>
                </div>

                <!-- CARTES DE STATISTIQUES CONFORME / NON CONFORME / N/A -->
                <div class="grid grid-cols-1 gap-3 sm:grid-cols-3 pt-2">
                    <Card :title="locale === 'en' ? 'Compliance' : 'Conformité'" :value="stats.conforme" :icon="ShieldCheck" theme="green"
                        :subtitle="locale === 'en' ? `out of ${stats.evaluated} evaluated` : `sur ${stats.evaluated} évaluées`" clickable
                        :selected="filters.statuses.includes('CONFORME')" @click="toggleStatus('CONFORME')" />
                    <Card :title="locale === 'en' ? 'Non-compliance' : 'Non-conformité'" :value="stats.nonConforme" :icon="TriangleAlert" theme="red"
                        :subtitle="locale === 'en' ? `out of ${stats.evaluated} evaluated` : `sur ${stats.evaluated} évaluées`" clickable
                        :selected="filters.statuses.includes('NON_CONFORME')" @click="toggleStatus('NON_CONFORME')" />
                    <Card :title="locale === 'en' ? 'Not applicable' : 'Non applicable'" :value="stats.nonApplicable" :icon="CircleSlash2" theme="gray"
                        :subtitle="locale === 'en' ? `out of ${stats.total} questions` : `sur ${stats.total} questions`" clickable
                        :selected="filters.statuses.includes('NON_APPLICABLE')" @click="toggleStatus('NON_APPLICABLE')" />
                </div>
            </section>

                <!-- 2. PLAN D'ACTIONS CORRECTIVES -->
                <!-- PLAN D'ACTIONS SI ACTIONS EXISTANTES -->
        <section v-if="actions.length" class="rounded-2xl border border-gray-200 bg-white p-5 shadow-2xs">
                <div class="mb-3 flex items-center justify-between">
                    <div class="flex items-center gap-2.5">
                        <div class="h-7 w-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold">
                            <ListTodo :size="16" />
                        </div>
                        <h4 class="font-bold text-gray-900 text-sm sm:text-base">{{ locale === 'en' ? 'Corrective action plan' : "Plan d'actions correctives" }}</h4>
                        <span class="rounded-full bg-primary/10 text-primary px-2 py-0.5 text-xs font-bold">
                            {{ actions.length }}
                        </span>
                    </div>

                    <span v-if="stats.overdueActions" class="rounded-full bg-red-100 px-3 py-1 text-xs text-red-700 font-bold">
                        {{ stats.overdueActions }} {{ locale === 'en' ? 'overdue' : 'en retard' }}
                    </span>
                </div>

                <ul class="divide-y divide-gray-100">
                    <li v-for="entry in actions" :key="entry.anchor" class="flex flex-wrap items-center justify-between gap-3 py-2.5 text-xs">
                        <div class="flex items-center gap-2 min-w-0">
                            <button type="button" class="text-left font-bold text-gray-900 hover:text-primary hover:underline truncate"
                                @click="goToAnchor(entry.anchor, entry.sectionId)">
                                {{ entry.action.title }}
                            </button>
                            <span class="rounded-full px-2 py-0.5 text-[10px] font-bold shrink-0"
                                :class="PRIORITY_CONFIG[entry.action.priority].badge">
                                {{ getPriorityLabel(entry.action.priority) }}
                            </span>
                        </div>

                        <div class="flex items-center gap-3 shrink-0 ml-auto text-[11px]">
                            <span class="text-gray-500 bg-gray-50 px-2 py-0.5 rounded border border-gray-200">
                                {{ entry.sectionTitle }}
                            </span>
                            <span class="text-gray-700 font-semibold flex items-center gap-1">
                                <User :size="12" class="text-gray-400" />
                                <span>{{ entry.action.responsible }}</span>
                            </span>
                            <span :class="DUE_TONE_CLASS[formatDueDate(entry.action.dueDate).tone]">
                                {{ formatDueDate(entry.action.dueDate).text }}
                            </span>
                        </div>
                    </li>
                </ul>
            </section>

                <!-- 3. SECTIONS & QUESTIONS -->
                <!-- SECTIONS & QUESTIONS -->
        <div class="flex flex-col gap-y-3">
            <div class="flex flex-wrap items-center justify-between gap-3 pb-1">
                <div>
                    <h4 class="text-base font-bold text-gray-900">{{ locale === 'en' ? 'Section and question details' : 'Détails des sections et questions' }}</h4>
                    <p class="text-xs text-gray-500">{{ locale === 'en' ? 'Point-by-point compliance protocol evaluation' : 'Évaluation point par point du protocole de conformité' }}</p>
                </div>

                <button type="button" class="no-print text-xs font-bold text-primary hover:underline cursor-pointer"
                    :disabled="filtersActive" :class="filtersActive && 'cursor-not-allowed opacity-40'"
                    @click="toggleAll">
                    {{ allOpen ? (locale === 'en' ? 'Collapse all' : 'Tout replier') : (locale === 'en' ? 'Expand all' : 'Tout déplier') }}
                </button>
            </div>

            <!-- BARRE DE FILTRES -->
            <div class="no-print flex flex-wrap items-center gap-3 rounded-2xl border border-gray-200 bg-white p-3 shadow-2xs">
                <div class="relative min-w-60 flex-1">
                    <Search :size="16" class="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
                    <input ref="searchInput" v-model="filters.search" type="search"
                        :placeholder="locale === 'en' ? 'Search question, control point, person in charge... ( / )' : 'Rechercher une question, un point de contrôle, un responsable…  ( / )'"
                        class="w-full rounded-xl border border-gray-200 py-2 pr-9 pl-9 text-xs focus:border-primary focus:outline-none" />
                    <button v-if="filters.search" type="button"
                        class="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-black cursor-pointer"
                        :aria-label="locale === 'en' ? 'Clear search' : 'Effacer la recherche'" @click="filters.search = ''">
                        <X :size="16" />
                    </button>
                </div>

                <div class="flex flex-wrap items-center gap-2">
                    <button v-for="status in STATUS_FILTERS" :key="status" type="button"
                        class="flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer"
                        :class="filters.statuses.includes(status)
                                ? 'border-primary bg-primary/10 text-primary'
                                : 'border-gray-200 text-gray-600 hover:border-gray-300 bg-white'
                            " :aria-pressed="filters.statuses.includes(status)" @click="toggleStatus(status)">
                        <span class="size-2 rounded-full" :class="STATUS_CONFIG[status].dot" />
                        {{ getStatusLabel(status) }}
                    </button>

                    <button type="button" class="rounded-xl border px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer" :class="filters.withActionOnly
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-gray-200 text-gray-600 hover:border-gray-300 bg-white'
                        " :aria-pressed="filters.withActionOnly"
                        @click="filters.withActionOnly = !filters.withActionOnly">
                        {{ locale === 'en' ? 'With action' : 'Avec action' }}
                    </button>

                    <button type="button" class="rounded-xl border px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer" :class="filters.nonConformeFirst
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-gray-200 text-gray-600 hover:border-gray-300 bg-white'
                        " :aria-pressed="filters.nonConformeFirst"
                        @click="filters.nonConformeFirst = !filters.nonConformeFirst">
                        {{ locale === 'en' ? 'Deviations first' : 'Écarts en premier' }}
                    </button>
                </div>

                <div v-if="filtersActive" class="flex items-center gap-3 text-xs text-gray-500">
                    <span class="font-semibold text-gray-700">
                        {{ visibleCount }} {{ locale === 'en' ? `result${visibleCount > 1 ? 's' : ''}` : `résultat${visibleCount > 1 ? 's' : ''}` }}
                    </span>
                    <button type="button" class="font-bold text-primary hover:underline cursor-pointer" @click="resetFilters">
                        {{ locale === 'en' ? 'Reset' : 'Réinitialiser' }}
                    </button>
                </div>
            </div>

            <p v-if="visibleSections.length === 0"
                class="rounded-2xl border border-dashed border-gray-200 bg-white p-10 text-center text-gray-500 text-xs">
                {{ locale === 'en' ? 'No question matches these criteria.' : 'Aucune question ne correspond à ces critères.' }}
                <button type="button" class="font-bold text-primary hover:underline ml-1 cursor-pointer" @click="resetFilters">
                    {{ locale === 'en' ? 'Reset filters' : 'Réinitialiser les filtres' }}
                </button>
            </p>

            <!-- ACCORDÉON DES SECTIONS -->
            <div class="space-y-4">
                <div v-for="(section, sIdx) in visibleSections" :key="section.id"
                    class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xs">
                    <!-- EN-TÊTE DE LA SECTION (AVEC NUMÉRO PROPRE [1], [2], ETC.) -->
                    <button type="button"
                        class="flex w-full items-center justify-between gap-4 p-4 text-left transition-colors hover:bg-slate-50/60 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-primary cursor-pointer"
                        :aria-expanded="isOpen(section.id)" :aria-controls="`section-panel-${section.id}`"
                        @click="toggleSection(section.id)">
                        <div class="flex items-start gap-3 min-w-0">
                            <!-- BADGE NUMÉRO DE SECTION ÉLÉGANT -->
                            <span class="h-7 w-7 rounded-xl bg-primary/10 text-primary font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 shadow-2xs border border-primary/20">
                                {{ section.number || (sIdx + 1) }}
                            </span>

                            <div class="min-w-0">
                                <h5 class="text-sm sm:text-base font-bold text-gray-900 truncate">
                                    {{ section.title }}
                                </h5>
                                <p class="text-xs text-gray-500 mt-0.5 truncate">
                                    {{ section.description }}
                                </p>
                            </div>
                        </div>

                        <div class="flex shrink-0 items-center gap-2.5">
                            <span v-if="sectionStats(section).nonConforme"
                                class="rounded-full bg-red-100 border border-red-200 px-2.5 py-0.5 text-[11px] font-bold text-red-700">
                                {{ sectionStats(section).nonConforme }} {{ locale === 'en' ? `deviation${sectionStats(section).nonConforme > 1 ? 's' : ''}` : `écart${sectionStats(section).nonConforme > 1 ? 's' : ''}` }}
                            </span>

                            <span class="rounded-full bg-gray-100 px-2.5 py-0.5 text-[11px] font-semibold text-gray-700">
                                {{ sectionStats(section).conformityRate }}% ·
                                {{ section.items.length }} {{ locale === 'en' ? `question${section.items.length > 1 ? 's' : ''}` : `question${section.items.length > 1 ? 's' : ''}` }}
                            </span>

                            <ChevronDown :size="16" class="no-print transition-transform duration-300 text-gray-400"
                                :class="isOpen(section.id) && 'rotate-180'" />
                        </div>
                    </button>

                    <!-- QUESTIONS DANS CETTE SECTION -->
                    <transition name="accordion" @enter="onEnter" @after-enter="onAfterEnter" @leave="onLeave">
                        <div v-show="isOpen(section.id)" :id="`section-panel-${section.id}`" class="accordion-panel">
                            <div class="space-y-3 border-t border-gray-100 bg-slate-50/50 p-4">
                                <article v-for="(item, iIdx) in section.items" :id="anchorId(section.id, item.id)"
                                    :key="item.id" class="group rounded-2xl border bg-white p-4 shadow-2xs transition-all hover:border-gray-300" :class="[
                                        STATUS_CONFIG[item.status].card,
                                        flashedAnchor === anchorId(section.id, item.id) &&
                                        'ring-2 ring-primary',
                                    ]">
                                    <div class="flex items-start justify-between gap-3">
                                        <!-- QUESTION AVEC BADGE NUMÉROTÉ PROPRE [ 1.1 ], [ 1.2 ] AU LIEU DE HASH -->
                                        <div class="flex items-start gap-2.5 min-w-0">
                                            <span class="inline-flex items-center px-2 py-0.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 font-mono text-xs font-bold shrink-0 mt-0.5 shadow-2xs">
                                                {{ item.displayCode || `${section.number || (sIdx + 1)}.${item.number || (iIdx + 1)}` }}
                                            </span>
                                            <h5 class="text-sm font-semibold text-gray-900 leading-snug" v-html="highlight(
                                                item.question,
                                                filters.search,
                                            )" />
                                        </div>

                                        <div class="flex shrink-0 items-center gap-2">
                                            <button type="button"
                                                class="no-print rounded p-1 text-gray-400 opacity-0 transition-opacity group-hover:opacity-100 hover:text-primary focus:opacity-100 cursor-pointer"
                                                :aria-label="`Copier le lien vers la question ${item.displayCode || `${section.number || (sIdx + 1)}.${item.number || (iIdx + 1)}`}`"
                                                @click="
                                                    copyItemLink(
                                                        anchorId(section.id, item.id),
                                                    )
                                                    ">
                                                <Check v-if="
                                                    copied ===
                                                    anchorId(section.id, item.id)
                                                " :size="14" class="text-emerald-600" />
                                                <Link2 v-else :size="14" />
                                            </button>

                                            <span class="rounded-full px-3 py-1 text-xs font-bold"
                                                :class="STATUS_CONFIG[item.status].badge">
                                                {{ getStatusLabel(item.status) }}
                                            </span>
                                        </div>
                                    </div>

                                    <!-- RÉPONSE -->
                                    <div class="mt-3 bg-slate-50/80 p-2.5 rounded-xl border border-slate-100">
                                        <div class="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-500">
                                            <span>{{ locale === 'en' ? 'Recorded response:' : 'Réponse enregistrée :' }}</span>
                                        </div>
                                        <div class="mt-1 flex items-center gap-2">
                                            <span class="size-2 rounded-full shrink-0" :class="STATUS_CONFIG[item.status].dot" />
                                            <p class="text-xs sm:text-sm font-semibold text-gray-800" v-html="highlight(item.answer, filters.search)" />
                                        </div>
                                    </div>

                                    <!-- PIÈCES JOINTES & PHOTOS -->
                                    <div v-if="item.commentCount || item.photoCount"
                                        class="mt-3 flex flex-wrap items-center gap-4 text-xs text-gray-500">
                                        <span v-if="item.commentCount" class="flex items-center gap-1.5">
                                            <MessageSquare :size="14" />
                                            {{ item.commentCount }} {{ locale === 'en' ? `comment${item.commentCount > 1 ? 's' : ''}` : `commentaire${item.commentCount > 1 ? 's' : ''}` }}
                                        </span>

                                        <span v-if="item.photoCount" class="flex items-center gap-1.5">
                                            <ImageIcon :size="14" />
                                            {{ item.photoCount }} photo{{
                                                item.photoCount > 1 ? 's' : ''
                                            }}
                                        </span>
                                    </div>

                                    <!-- ACTION CORRECTIVE EXISTANTE -->
                                    <div v-if="item.action" class="mt-3 rounded-xl border border-gray-200 bg-white p-3.5 shadow-2xs">
                                        <div class="mb-2 flex items-center justify-between text-xs text-gray-500">
                                            <div class="flex items-center gap-1.5 font-bold text-gray-700">
                                                <ClipboardCheck :size="15" class="text-primary" />
                                                <span>{{ locale === 'en' ? 'Corrective action' : 'Action corrective' }}</span>
                                            </div>
                                            <div class="flex items-center gap-2">
                                                <button
                                                    type="button"
                                                    @click="openEditChecklistAction(item)"
                                                    class="p-1 text-gray-400 hover:text-gray-700 rounded hover:bg-gray-100 cursor-pointer"
                                                    :title="locale === 'en' ? 'Edit action' : 'Modifier l\'action'">
                                                    <Edit :size="13" />
                                                </button>
                                            </div>
                                        </div>

                                        <h5 class="text-xs font-semibold text-gray-800" v-html="highlight(
                                            item.action.title,
                                            filters.search,
                                        )" />

                                        <div class="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs">
                                            <div class="flex items-center gap-3">
                                                <span class="flex items-center gap-1.5 text-gray-600 font-medium">
                                                    <User :size="13" class="text-gray-400" />
                                                    <span>{{ item.action.responsible }}</span>
                                                </span>
                                                <span
                                                    class="px-2 py-0.5 rounded-full text-[10px] font-bold"
                                                    :class="item.action.status === 'FINISHED' ? 'bg-emerald-100 text-emerald-700' : (item.action.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700')">
                                                    {{ item.action.status === 'FINISHED' ? (locale === 'en' ? 'Completed' : 'Terminée') : (item.action.status === 'IN_PROGRESS' ? (locale === 'en' ? 'In progress' : 'En cours') : (locale === 'en' ? 'Pending' : 'En attente')) }}
                                                </span>
                                            </div>

                                            <!-- BOUTONS WORKFLOW RAPIDE -->
                                            <div class="flex items-center gap-1.5">
                                                <button
                                                    v-if="item.action.status === 'PENDING'"
                                                    type="button"
                                                    @click="updateChecklistActionStatus(item.action.id, 'IN_PROGRESS')"
                                                    class="px-2.5 py-1 text-[11px] font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg cursor-pointer transition">
                                                    {{ locale === 'en' ? 'Take charge' : 'Prendre en charge' }}
                                                </button>
                                                <button
                                                    v-if="item.action.status === 'IN_PROGRESS'"
                                                    type="button"
                                                    @click="updateChecklistActionStatus(item.action.id, 'FINISHED')"
                                                    class="px-2.5 py-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg cursor-pointer transition">
                                                    {{ locale === 'en' ? 'Close' : 'Clôturer' }}
                                                </button>
                                                <button
                                                    v-if="item.action.status === 'FINISHED'"
                                                    type="button"
                                                    @click="updateChecklistActionStatus(item.action.id, 'PENDING')"
                                                    class="px-2.5 py-1 text-[11px] font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg cursor-pointer transition">
                                                    {{ locale === 'en' ? 'Reopen' : 'Réouvrir' }}
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- SI NON CONFORME MAIS SANS ACTION : PROPOSER D'EN CRÉER UNE -->
                                    <div v-else-if="item.status === 'NON_CONFORME'" class="mt-3 pt-2.5 border-t border-red-100 flex items-center justify-between text-xs">
                                        <span class="text-red-600 text-[11px] italic font-medium">{{ locale === 'en' ? 'Deviation observed: no corrective action defined yet.' : 'Écart constaté : aucune action corrective n\'a encore été définie.' }}</span>
                                        <button
                                            type="button"
                                            @click="openAddChecklistAction(item)"
                                            class="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg cursor-pointer transition shadow-2xs">
                                            <Plus :size="12" />
                                            {{ locale === 'en' ? 'Define action' : 'Définir une action' }}
                                        </button>
                                    </div>
                                </article>
                            </div>
                        </div>
                    </transition>
                </div>
            </div>
        </div>
            </div>

            <!-- COLONNE DROITE (2 COLONNES) : CARTOGRAPHIE & DÉTAILS UNIQUEMENT -->
            <div class="flex flex-col gap-4 lg:col-span-2 lg:sticky lg:top-4 lg:max-h-[calc(100vh-2rem)] lg:overflow-y-auto">
                <!-- 1. CARTOGRAPHIE D'EMPLACEMENT ET SECOURS D'URGENCE -->
                <SidebarLocationMap
                    :site-name="checklist.site || checklist.location"
                    :location-name="checklist.location || checklist.site"
                    :site-type="checklist.type || checklist.site"
                    :latitude="checklist.site_location?.latitude"
                    :longitude="checklist.site_location?.longitude"
                    :locality="checklist.site_location?.locality"
                    :province="checklist.site_location?.province"
                    :status="checklist.status"
                    :conformity-rate="stats.conformityRate"
                />

                <!-- 2. FICHE DÉTAILS DE L'INSPECTION -->
                <section class="rounded-2xl border border-gray-200 bg-white p-5 shadow-2xs flex flex-col gap-3">
                    <div class="flex items-center justify-between border-b border-gray-100 pb-2">
                        <div class="flex items-center gap-2">
                            <h5 class="text-xs font-bold uppercase tracking-wider text-gray-500">{{ locale === 'en' ? 'Inspection details' : "Détails de l'inspection" }}</h5>
                            <button
                                type="button"
                                @click="openEditModal"
                                class="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-600 hover:text-amber-700 bg-amber-50 hover:bg-amber-100 px-2 py-0.5 rounded-md transition cursor-pointer"
                            >
                                <Edit :size="12" />
                                <span>{{ locale === 'en' ? 'Edit' : 'Modifier' }}</span>
                            </button>
                        </div>
                        <span class="text-[10px] text-gray-400">Réf. #{{ route.params.id }}</span>
                    </div>

                    <dl class="flex flex-col gap-3 text-xs">
                        <div class="flex items-center justify-between gap-2">
                            <dt class="flex items-center gap-2 text-gray-500">
                                <MapPin :size="14" class="text-gray-400 shrink-0" />
                                <span>{{ locale === 'en' ? 'Site / Station' : 'Site / Station' }}</span>
                            </dt>
                            <dd class="font-bold text-gray-900 truncate max-w-[150px] text-right">
                                {{ checklist.site || checklist.location || (locale === 'en' ? 'Not specified' : 'Non spécifié') }}
                            </dd>
                        </div>

                        <div class="flex items-center justify-between gap-2">
                            <dt class="flex items-center gap-2 text-gray-500">
                                <UserCheck2 :size="14" class="text-gray-400 shrink-0" />
                                <span>{{ locale === 'en' ? 'Inspector' : 'Inspecteur' }}</span>
                            </dt>
                            <dd class="font-bold text-gray-900 truncate">
                                {{ checklist.inspector || (locale === 'en' ? 'Not assigned' : 'Non assigné') }}
                            </dd>
                        </div>

                        <div class="flex items-center justify-between gap-2">
                            <dt class="flex items-center gap-2 text-gray-500">
                                <Calendar :size="14" class="text-gray-400 shrink-0" />
                                <span>{{ locale === 'en' ? 'Inspection date' : "Date d'inspection" }}</span>
                            </dt>
                            <dd class="font-semibold text-gray-800">
                                {{ formatLocalizedDate(checklist.createdAt) }}
                            </dd>
                        </div>

                        <div class="flex items-center justify-between gap-2">
                            <dt class="flex items-center gap-2 text-gray-500">
                                <User :size="14" class="text-gray-400 shrink-0" />
                                <span>{{ locale === 'en' ? 'Creator' : 'Créateur' }}</span>
                            </dt>
                            <dd class="font-semibold text-gray-800 truncate">
                                {{ checklist.createdBy }}
                            </dd>
                        </div>

                        <div class="flex items-center justify-between gap-2">
                            <dt class="flex items-center gap-2 text-gray-500">
                                <TimerReset :size="14" class="text-gray-400 shrink-0" />
                                <span>{{ locale === 'en' ? 'Last update' : 'Dernière mise à jour' }}</span>
                            </dt>
                            <dd class="font-semibold text-gray-800">
                                {{ formatLocalizedDate(checklist.updatedAt) }}
                            </dd>
                        </div>
                    </dl>
                </section>
            </div>
        </div>

        <!-- MODAL ACTION CORRECTIVE CHECKLIST -->
        <div v-if="checklistActionModal.isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
            <div class="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-gray-200">
                <div class="flex items-center justify-between pb-3 border-b border-gray-200">
                    <h4 class="text-sm font-bold text-gray-900">
                        {{ checklistActionModal.isEdit ? (locale === 'en' ? 'Edit corrective action' : 'Modifier l\'action corrective') : (locale === 'en' ? 'New corrective action' : 'Nouvelle action corrective') }}
                    </h4>
                    <button @click="checklistActionModal.isOpen = false" class="text-gray-400 hover:text-gray-600 p-1">
                        <X :size="18" />
                    </button>
                </div>

                <div class="mt-4 space-y-4 text-xs">
                    <!-- Point de contrôle -->
                    <div>
                        <label class="block font-semibold text-gray-700 mb-1">{{ locale === 'en' ? 'Control point / Question' : 'Point de contrôle / Question' }}</label>
                        <p class="p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 font-medium">
                            {{ checklistActionModal.itemQuestion }}
                        </p>
                    </div>

                    <!-- Description de l'action corrective -->
                    <div>
                        <label class="block font-semibold text-gray-700 mb-1">{{ locale === 'en' ? 'Corrective action description *' : 'Description de l\'action corrective *' }}</label>
                        <textarea
                            v-model="checklistActionModal.description"
                            rows="3"
                            :placeholder="locale === 'en' ? 'Describe precisely the corrective action to take...' : 'Décrivez précisément l\'action corrective à mener...'"
                            class="w-full p-2.5 border border-gray-300 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-1 focus:ring-primary resize-none"></textarea>
                    </div>

                    <!-- Responsable assigné (Personnel) -->
                    <div>
                        <div class="flex items-center justify-between mb-1">
                            <label class="block font-semibold text-gray-700">{{ locale === 'en' ? 'Person in charge (Personnel) *' : 'Responsable assigné (Personnel) *' }}</label>
                            <span v-if="personnelsList.length > 0" class="text-[10px] text-gray-400 font-medium">({{ filteredActionPersonnels.length }} / {{ personnelsList.length }})</span>
                        </div>
                        <input
                            v-model="actionPersonnelSearchQuery"
                            type="text"
                            :placeholder="locale === 'en' ? 'Search personnel by name, role...' : '🔍 Rechercher un personnel par nom, fonction...'"
                            class="w-full mb-1.5 p-2 text-xs border border-gray-300 rounded-lg bg-gray-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary transition"
                        />
                        <select
                            v-model="checklistActionModal.assignedTo"
                            class="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-1 focus:ring-primary">
                            <option :value="null">{{ locale === 'en' ? '-- Select a personnel --' : '-- Choisir parmi le personnel Galana --' }}</option>
                            <option v-for="p in filteredActionPersonnels" :key="p.id" :value="p.id">
                                {{ p.first_name }} {{ p.last_name || '' }} — {{ p.fonction || p.direction || 'Personnel' }}
                            </option>
                        </select>
                    </div>

                    <!-- Statut -->
                    <div>
                        <label class="block font-semibold text-gray-700 mb-1">{{ locale === 'en' ? 'Initial status' : 'Statut initial' }}</label>
                        <select
                            v-model="checklistActionModal.status"
                            class="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-1 focus:ring-primary">
                            <option value="PENDING">{{ locale === 'en' ? 'Pending' : 'En attente' }}</option>
                            <option value="IN_PROGRESS">{{ locale === 'en' ? 'In progress' : 'En cours' }}</option>
                            <option value="FINISHED">{{ locale === 'en' ? 'Completed' : 'Terminée' }}</option>
                        </select>
                    </div>
                </div>

                <div class="mt-6 pt-3 border-t border-gray-200 flex items-center justify-end gap-2 text-xs">
                    <button
                        type="button"
                        @click="checklistActionModal.isOpen = false"
                        class="px-4 py-2 font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">
                        {{ locale === 'en' ? 'Cancel' : 'Annuler' }}
                    </button>
                    <button
                        type="button"
                        @click="saveChecklistAction"
                        :disabled="!checklistActionModal.description || !checklistActionModal.itemId || checklistActionModal.saving"
                        class="px-4 py-2 font-bold text-white bg-primary hover:bg-primary/90 disabled:opacity-50 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5">
                        <Loader2 v-if="checklistActionModal.saving" :size="14" class="animate-spin" />
                        <span>{{ checklistActionModal.saving ? (locale === 'en' ? 'Saving...' : 'Enregistrement...') : (locale === 'en' ? 'Save action' : 'Enregistrer l\'action') }}</span>
                    </button>
                </div>
            </div>
        </div>

        <!-- ========================================================= -->
        <!-- MODAL MODIFIER L'INSPECTION (EDIT CHECKLIST INFO MODAL)     -->
        <!-- ========================================================= -->
        <Teleport to="body">
            <transition name="modal-fade">
                <div
                    v-if="modal_edit"
                    class="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto"
                    @click.self="modal_edit = false"
                >
                    <div
                        class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl sm:max-w-3xl max-h-[92vh] flex flex-col overflow-hidden border border-gray-200 animate-in fade-in zoom-in-95 duration-200"
                    >
                        <!-- En-tête Modal Edit -->
                        <div class="px-5 py-3.5 bg-gradient-to-r from-amber-50 to-orange-50/50 border-b border-gray-200 flex items-center justify-between shrink-0">
                            <div class="flex items-center gap-2.5">
                                <div class="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold">
                                    <Edit :size="18" />
                                </div>
                                <div>
                                    <h4 class="text-sm font-bold text-gray-900">
                                        {{ locale === 'en' ? 'Edit Inspection Information' : 'Modifier les informations de l\'inspection' }}
                                    </h4>
                                    <p class="text-[11px] text-gray-500">
                                        Réf. #{{ route.params.id }} • {{ locale === 'en' ? 'Update inspection metadata, site, GPS location, and status.' : 'Mettez à jour les métadonnées, le site, la cartographie GPS et le statut.' }}
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                @click="modal_edit = false"
                                class="p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-white transition cursor-pointer"
                            >
                                <X :size="18" />
                            </button>
                        </div>

                        <!-- Formulaire Modal Edit -->
                        <form @submit.prevent="submitEdit" class="flex flex-col flex-1 overflow-y-auto">
                            <div class="p-5 space-y-4">
                                <!-- Titre de l'inspection -->
                                <div>
                                    <label class="block text-xs font-semibold text-gray-700 mb-1">
                                        {{ locale === 'en' ? 'Inspection Title' : 'Titre de l\'inspection' }} <span class="text-red-500">*</span>
                                    </label>
                                    <input
                                        v-model="editForm.title"
                                        type="text"
                                        required
                                        class="w-full h-9 px-3 rounded-lg border border-gray-300 text-xs focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition font-medium"
                                    />
                                </div>

                                <!-- Statut & Inspecteur -->
                                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                    <!-- Statut de l'inspection -->
                                    <div>
                                        <label class="block text-xs font-semibold text-gray-700 mb-1">
                                            {{ locale === 'en' ? 'Inspection Status' : 'Statut de l\'inspection' }} <span class="text-red-500">*</span>
                                        </label>
                                        <select
                                            v-model="editForm.status"
                                            required
                                            class="w-full h-9 px-3 rounded-lg border border-gray-300 text-xs focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none bg-white transition cursor-pointer font-semibold"
                                        >
                                            <option v-for="st in ChecklistStatusJsonData" :key="st.value" :value="st.value">
                                                {{ st.label }} ({{ st.value }})
                                            </option>
                                        </select>
                                    </div>

                                    <!-- Inspecteur assigné -->
                                    <div>
                                        <label class="block text-xs font-semibold text-gray-700 mb-1">
                                            {{ locale === 'en' ? 'Assigned inspector' : 'Inspecteur assigné' }}
                                        </label>
                                        <select
                                            v-model="editForm.inspector_id"
                                            class="w-full h-9 px-3 rounded-lg border border-gray-300 text-xs focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none bg-white transition cursor-pointer"
                                        >
                                            <option :value="undefined">{{ locale === 'en' ? 'Default (Unassigned / Yourself)' : 'Par défaut (Non assigné / Vous-même)' }}</option>
                                            <option v-for="usr in usersList" :key="usr.id" :value="usr.id">
                                                {{ usr.first_name ? (usr.first_name + ' ' + (usr.last_name || '')).trim() : (usr.name || usr.email) }} {{ usr.job ? '(' + usr.job + ')' : '' }}
                                            </option>
                                        </select>
                                    </div>
                                </div>

                                <!-- Type de site / Cible -->
                                <div>
                                    <label class="block text-xs font-semibold text-gray-700 mb-1">
                                        {{ locale === 'en' ? 'Target / Site Category' : 'Type de site / Cible' }} <span class="text-red-500">*</span>
                                    </label>
                                    <select
                                        v-model="editForm.site_type"
                                        required
                                        @change="onEditSiteTypeChange"
                                        class="w-full h-9 px-3 rounded-lg border border-gray-300 text-xs focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none bg-white transition cursor-pointer font-medium"
                                    >
                                        <option v-for="st in siteCategories" :key="st.value" :value="st.value">
                                            {{ st.label }}
                                        </option>
                                    </select>
                                </div>

                                <!-- CAS 1 EDIT: SITE FIXE / STATION SERVICE -->
                                <div v-if="!isEditCartographyRequired" class="space-y-2">
                                    <div>
                                        <div class="flex items-center justify-between mb-1">
                                            <label class="block text-xs font-semibold text-gray-700">
                                                {{ locale === 'en' ? 'Galana Station / Site (registered list)' : 'Station / Site Galana enregistré' }}
                                            </label>
                                            <span v-if="registeredSites.length" class="text-[10px] text-gray-400">
                                                {{ filteredEditRegisteredSites.length }} / {{ registeredSites.length }} {{ locale === 'en' ? 'stations' : 'stations' }}
                                            </span>
                                        </div>

                                        <!-- Champ de recherche de station en mode édition -->
                                        <div class="relative mb-1.5">
                                            <Search class="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" :size="13" />
                                            <input
                                                v-model="editStationSearchQuery"
                                                type="text"
                                                :placeholder="locale === 'en' ? 'Filter station by name, locality, province...' : 'Filtrer par nom de station, localité, province...'"
                                                class="w-full h-8 pl-8 pr-7 text-xs rounded-lg border border-gray-200 bg-slate-50/80 focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition"
                                            />
                                            <button
                                                v-if="editStationSearchQuery"
                                                type="button"
                                                @click="editStationSearchQuery = ''"
                                                class="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5 rounded cursor-pointer"
                                            >
                                                <X :size="12" />
                                            </button>
                                        </div>

                                        <select
                                            :value="editForm.site"
                                            @change="onEditRegisteredSiteChange"
                                            class="w-full h-9 px-3 rounded-lg border border-gray-300 text-xs focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none bg-white transition cursor-pointer font-medium"
                                        >
                                            <option value="">{{ locale === 'en' ? '-- Select a registered site --' : '-- Sélectionner une station enregistrée --' }}</option>
                                            <option v-for="s in filteredEditRegisteredSites" :key="s.name" :value="s.name">
                                                {{ s.name }} {{ s.locality ? '— ' + s.locality : '' }} {{ s.province ? '(' + s.province + ')' : '' }}
                                            </option>
                                        </select>
                                    </div>

                                    <div
                                        v-if="selectedEditRegisteredSiteInfo"
                                        class="p-2.5 rounded-xl bg-emerald-50/80 border border-emerald-200 text-xs text-emerald-900 flex items-center justify-between gap-2"
                                    >
                                        <div class="flex items-center gap-2 min-w-0">
                                            <div class="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                                                <MapPin :size="13" />
                                            </div>
                                            <div class="min-w-0">
                                                <span class="font-bold text-xs truncate block">{{ selectedEditRegisteredSiteInfo.name }}</span>
                                                <span class="text-[11px] text-emerald-700">
                                                    {{ selectedEditRegisteredSiteInfo.locality || 'Madagascar' }}
                                                    <template v-if="selectedEditRegisteredSiteInfo.province"> • {{ selectedEditRegisteredSiteInfo.province }}</template>
                                                </span>
                                            </div>
                                        </div>
                                        <div class="text-[10px] font-mono text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded-md shrink-0">
                                            <span v-if="selectedEditRegisteredSiteInfo.latitude && selectedEditRegisteredSiteInfo.longitude">
                                                GPS : {{ Number(selectedEditRegisteredSiteInfo.latitude).toFixed(4) }}, {{ Number(selectedEditRegisteredSiteInfo.longitude).toFixed(4) }}
                                            </span>
                                            <span v-else>{{ locale === 'en' ? 'Registered site' : 'Cartographie enregistrée' }}</span>
                                        </div>
                                    </div>
                                </div>

                                <!-- CAS 2 EDIT: VEHICULE, CC, B2B -->
                                <div v-else class="space-y-3">
                                    <div>
                                        <label class="block text-xs font-semibold text-gray-700 mb-1">
                                            <template v-if="editForm.site_type === 'VEHICULE'">
                                                {{ locale === 'en' ? 'Vehicle License Plate / Identifier' : 'Immatriculation / Réf. du véhicule' }} <span class="text-gray-400 font-normal">({{ locale === 'en' ? 'Optional' : 'Optionnel' }})</span>
                                            </template>
                                            <template v-else-if="editForm.site_type === 'CAMION CITERNE'">
                                                {{ locale === 'en' ? 'Tanker Truck Number / License Plate' : 'Numéro / Immatriculation Camion Citerne (CC)' }} <span class="text-gray-400 font-normal">({{ locale === 'en' ? 'Optional' : 'Optionnel' }})</span>
                                            </template>
                                            <template v-else-if="editForm.site_type === 'B2B'">
                                                {{ locale === 'en' ? 'Client Name / B2B Installation' : 'Nom du client / Site client B2B' }} <span class="text-red-500">*</span>
                                            </template>
                                            <template v-else>
                                                {{ locale === 'en' ? 'Site / Identifier' : 'Désignation du site / Cible' }}
                                            </template>
                                        </label>
                                        <input
                                            v-model="editForm.site"
                                            type="text"
                                            :placeholder="
                                                editForm.site_type === 'VEHICULE'
                                                    ? 'Ex: Toyota Hilux - 1234 TAB (optionnel)'
                                                    : editForm.site_type === 'CAMION CITERNE'
                                                    ? 'Ex: Camion Citerne CC-04 / 5678 WWT (optionnel)'
                                                    : 'Ex: Client B2B - Usine Star Antsirabe'
                                            "
                                            class="w-full h-9 px-3 rounded-lg border border-gray-300 text-xs focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition"
                                        />
                                    </div>
                                </div>

                                <!-- Localisation précise / Zone / Adresse (avec presets 1-clic) -->
                                <div>
                                    <div class="flex items-center justify-between mb-1">
                                        <label class="block text-xs font-semibold text-gray-700">
                                            {{ locale === 'en' ? 'Precise location / Zone / Address' : 'Localisation précise / Zone / Adresse' }}
                                        </label>
                                        <button
                                            v-if="editForm.location"
                                            type="button"
                                            @click="editForm.location = ''"
                                            class="text-[10px] text-gray-400 hover:text-red-500 cursor-pointer transition"
                                        >
                                            {{ locale === 'en' ? 'Clear' : 'Effacer' }}
                                        </button>
                                    </div>
                                    <input
                                        v-model="editForm.location"
                                        type="text"
                                        :placeholder="locale === 'en' ? 'Ex: Distribution lanes, Shop, Technical room TGBT...' : 'Ex: Piste de distribution, Boutique, Local technique TGBT...'"
                                        class="w-full h-9 px-3 rounded-lg border border-gray-300 text-xs focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition"
                                    />
                                    <div class="mt-2 flex flex-wrap items-center gap-1.5">
                                        <span class="text-[10px] text-gray-400 font-medium mr-1">{{ locale === 'en' ? 'Quick zones:' : 'Zones types :' }}</span>
                                        <button
                                            v-for="zp in zonePresets"
                                            :key="zp"
                                            type="button"
                                            @click="applyZonePreset(editForm, zp)"
                                            :class="editForm.location === zp ? 'bg-primary text-white border-primary' : 'bg-slate-100 hover:bg-slate-200 text-gray-700 border-gray-200'"
                                            class="px-2 py-0.5 rounded-full text-[10px] border transition cursor-pointer"
                                        >
                                            {{ zp }}
                                        </button>
                                    </div>
                                </div>

                                <!-- Choix cartographique interactif GPS (disponible pour tous en édition) -->
                                <div class="rounded-xl border border-gray-200 bg-slate-50/70 p-3 flex flex-col gap-2">
                                    <div class="flex items-center justify-between gap-2">
                                        <div class="flex items-center gap-1.5 text-xs font-bold text-gray-800">
                                            <MapPin :size="15" class="text-primary" />
                                            <span>{{ locale === 'en' ? 'Inspection GPS Location' : 'Coordonnées GPS / Emplacement cartographique' }}</span>
                                        </div>
                                        <div v-if="editForm.latitude && editForm.longitude" class="text-[11px] font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                                            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                            <span>{{ Number(editForm.latitude).toFixed(4) }}, {{ Number(editForm.longitude).toFixed(4) }}</span>
                                        </div>
                                        <span v-else class="text-[10px] text-gray-400">
                                            {{ locale === 'en' ? 'No GPS set' : 'Non géolocalisé' }}
                                        </span>
                                    </div>
                                    <LocationPickerMap
                                        :latitude="editForm.latitude ?? null"
                                        :longitude="editForm.longitude ?? null"
                                        height="h-[200px]"
                                        @update:latitude="editForm.latitude = $event ?? undefined"
                                        @update:longitude="editForm.longitude = $event ?? undefined"
                                        @location-detected="onEditLocationPickerDetected"
                                    />
                                </div>

                                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                    <!-- Date -->
                                    <div>
                                        <label class="block text-xs font-semibold text-gray-700 mb-1">
                                            {{ locale === 'en' ? 'Date' : 'Date de contrôle' }} <span class="text-red-500">*</span>
                                        </label>
                                        <input
                                            v-model="editForm.date"
                                            type="date"
                                            required
                                            class="w-full h-9 px-3 rounded-lg border border-gray-300 text-xs focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition"
                                        />
                                    </div>

                                    <!-- Heure -->
                                    <div>
                                        <label class="block text-xs font-semibold text-gray-700 mb-1">
                                            {{ locale === 'en' ? 'Time' : 'Heure de contrôle' }} <span class="text-red-500">*</span>
                                        </label>
                                        <input
                                            v-model="editForm.time"
                                            type="time"
                                            required
                                            class="w-full h-9 px-3 rounded-lg border border-gray-300 text-xs focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition"
                                        />
                                    </div>
                                </div>

                                <!-- Commentaire / Observations -->
                                <div>
                                    <label class="block text-xs font-semibold text-gray-700 mb-1">
                                        {{ locale === 'en' ? 'General Comment / Observations' : 'Commentaire général / Observations' }}
                                    </label>
                                    <textarea
                                        v-model="editForm.comment"
                                        rows="2"
                                        :placeholder="locale === 'en' ? 'Add any context, general observation or inspection notes...' : 'Ajouter des notes générales, contexte ou observations sur l\'inspection...'"
                                        class="w-full p-2.5 rounded-lg border border-gray-300 text-xs focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition resize-none"
                                    ></textarea>
                                </div>

                                <!-- Description -->
                                <div>
                                    <label class="block text-xs font-semibold text-gray-700 mb-1">
                                        {{ locale === 'en' ? 'Description' : 'Description du contexte' }}
                                    </label>
                                    <input
                                        v-model="editForm.description"
                                        type="text"
                                        :placeholder="locale === 'en' ? 'Brief description of the inspection context...' : 'Brève description du contexte de contrôle...'"
                                        class="w-full h-9 px-3 rounded-lg border border-gray-300 text-xs focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition"
                                    />
                                </div>
                            </div>

                            <!-- Footer d'actions Edit -->
                            <div class="px-5 py-3 bg-slate-50/80 border-t border-gray-200 flex items-center justify-end gap-2.5 shrink-0">
                                <button
                                    type="button"
                                    @click="modal_edit = false"
                                    class="px-4 py-2 text-xs font-medium text-gray-600 hover:bg-gray-200 rounded-lg transition cursor-pointer"
                                >
                                    {{ locale === 'en' ? 'Cancel' : 'Annuler' }}
                                </button>
                                <button
                                    type="submit"
                                    :disabled="loading_edit || !editForm.title || !editForm.date || !editForm.time"
                                    class="px-5 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-xs transition flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                                >
                                    <Loader2 v-if="loading_edit" :size="13" class="animate-spin" />
                                    <span>{{ locale === 'en' ? 'Save Changes' : 'Enregistrer les modifications' }}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </transition>
        </Teleport>
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