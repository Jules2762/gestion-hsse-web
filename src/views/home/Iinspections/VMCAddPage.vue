<template>
    <div>
        <Header title="inspections.vmc.new" :thumbnails="[
            {
                'label': 'thumbnails.home',
                'name': 'DASHBOARD'
            },
            {
                'label': 'thumbnails.inspections',
                'name': 'INSPECTION'
            }, {
                'label': 'thumbnails.vmc',
                'name': 'VMC'
            }, {
                'label': 'thumbnails.new',
                'name': 'VMC_NEW'
            }
        ]" />

        <div class="p-4 grid grid-cols-12 gap-4">
            <form @submit.prevent="onSubmit()"
                class="col-span-8 grid grid-cols-2 p-6 bg-white rounded border border-gray-200 gap-4">
                <div class="col-span-2 flex flex-col gap-y-1">
                    <h4 class="font-semibold text-gray-800 text-lg">{{ locale === 'en' ? 'VMC Information' : 'Informations de la VMC' }}</h4>
                    <p class="text-sm text-gray-500">{{ locale === 'en' ? 'Select visit type then enter date, site and inspector.' : 'Sélectionnez le type de visite puis renseignez la date, le site et l\'inspecteur.' }}</p>
                </div>

                <div v-if="errorMessage" class="col-span-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                    {{ errorMessage }}
                </div>

                <Select required :options="VMCTypeData" v-model="data.type" :label="locale === 'en' ? 'VMC Type' : 'Type de VMC'" class="col-span-2" />
                
                <Input :label="locale === 'en' ? 'VMC Title (Optional)' : 'Titre de la VMC (Optionnel)'" v-model="data.title" :placeholder="locale === 'en' ? 'Ex: VMC Service-Station Ankorondrano' : 'Ex: VMC Station-Service Ankorondrano'" class="col-span-2" />

                <Input :label="locale === 'en' ? 'Date' : 'Date'" type="date" v-model="data.date" required />

                <!-- Site avec liste de suggestions -->
                <div class="col-span-2">
                    <Input
                        :label="locale === 'en' ? 'Site / Station Galana' : 'Site / Station Galana'"
                        v-model="data.site"
                        :placeholder="locale === 'en' ? 'Ex: Ankorondrano Station, Depot, ...' : 'Ex: Station Ankorondrano, Dépôt, ...'"
                        :lists="siteList"
                        list_id="sites_datalist"
                    />

                    <!-- Badge info cartographie du site -->
                    <div
                        v-if="selectedSiteInfo"
                        class="mt-2 p-2.5 rounded-xl bg-emerald-50/80 border border-emerald-200 text-xs text-emerald-900 flex items-center justify-between gap-2"
                    >
                        <div class="flex items-center gap-2 min-w-0">
                            <div class="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                                <MapPin :size="13" />
                            </div>
                            <div class="min-w-0">
                                <span class="font-bold text-xs truncate block">{{ selectedSiteInfo.name }}</span>
                                <span class="text-[11px] text-emerald-700">
                                    {{ selectedSiteInfo.locality || selectedSiteInfo.location?.locality || 'Madagascar' }}
                                    <template v-if="selectedSiteInfo.province || selectedSiteInfo.location?.province">
                                        • {{ selectedSiteInfo.province || selectedSiteInfo.location?.province }}
                                    </template>
                                </span>
                            </div>
                        </div>
                        <div class="text-[10px] font-mono text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded-md shrink-0 flex items-center gap-1">
                            <CheckCircle2 :size="11" class="text-emerald-600" />
                            <span v-if="selectedSiteInfo.latitude || selectedSiteInfo.location?.latitude">
                                GPS : {{ Number(selectedSiteInfo.latitude || selectedSiteInfo.location?.latitude).toFixed(4) }}, {{ Number(selectedSiteInfo.longitude || selectedSiteInfo.location?.longitude).toFixed(4) }}
                            </span>
                            <span v-else>{{ locale === 'en' ? 'Registered cartography' : 'Cartographie enregistrée' }}</span>
                        </div>
                    </div>
                </div>

                <!-- Inspecteur : sélection parmi les Utilisateurs du système (Users) -->
                <div class="col-span-2">
                    <label class="block text-xs font-semibold text-gray-700 mb-1.5 flex items-center justify-between">
                        <span>{{ locale === 'en' ? 'Inspector / Person in charge (User)' : 'Inspecteur / Responsable (Utilisateur)' }}</span>
                        <span class="text-[10px] text-gray-400 font-normal">{{ locale === 'en' ? 'Selected from system users' : 'Choisi parmi les utilisateurs' }}</span>
                    </label>
                    <select
                        v-model="data.inspector_id"
                        class="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition cursor-pointer"
                    >
                        <option :value="undefined">{{ locale === 'en' ? 'Select an inspector (default yourself)...' : 'Sélectionner un inspecteur (par défaut vous-même)...' }}</option>
                        <option v-for="usr in users" :key="usr.id" :value="usr.id">
                            {{ `${usr.first_name || ''} ${usr.last_name || ''}`.trim() || usr.name || usr.email }}
                            {{ usr.job ? ` — ${usr.job}` : (usr.department ? ` (${usr.department})` : '') }}
                        </option>
                    </select>
                </div>

                <Input :label="locale === 'en' ? 'Accompanying person' : 'Personne accompagnante'" v-model="data.accompanying_person" :placeholder="locale === 'en' ? 'Name of accompanying person...' : 'Nom de l\'accompagnant...'" />

                <div class="flex flex-row items-center col-span-2 justify-end gap-x-3 mt-2">
                    <Button variant="outline" @click="router.back()" type="button"
                        :disabled="loading_submit">{{ locale === 'en' ? 'Cancel' : 'Annuler' }}</Button>
                    <Button :left-icon="Save" :loading="loading_submit" :disabled="disabled_submit || loading_submit"
                        type="submit">{{ locale === 'en' ? 'Create VMC' : 'Créer la VMC' }}</Button>
                </div>
            </form>

            <!-- PREVIEW -->
            <div class="col-span-4 flex flex-col gap-4">
                <!-- CARTOGRAPHIE DU SITE SÉLECTIONNÉ (COMME DANS CHECKLIST) -->
                <div v-if="selectedSiteInfo" class="sticky top-4 z-10">
                    <SidebarLocationMap
                        :site-name="data.site || selectedSiteInfo.name"
                        :location-name="selectedSiteInfo.locality || selectedSiteInfo.location?.locality || data.site"
                        :site-type="data.type"
                        :latitude="selectedSiteInfo.latitude || selectedSiteInfo.location?.latitude"
                        :longitude="selectedSiteInfo.longitude || selectedSiteInfo.location?.longitude"
                        :locality="selectedSiteInfo.locality || selectedSiteInfo.location?.locality"
                        :province="selectedSiteInfo.province || selectedSiteInfo.location?.province"
                    />
                </div>

                <div class="bg-white rounded border border-gray-200 overflow-hidden shadow-sm" :class="!selectedSiteInfo ? 'sticky top-4' : ''">

                    <!-- HEADER -->
                    <div class="p-5 border-b border-gray-200">
                        <div class="flex items-start justify-between gap-3">

                            <div class="min-w-0">
                                <p class="text-xs uppercase tracking-widest text-gray-400">
                                    {{ locale === 'en' ? 'Preview' : 'Aperçu' }}
                                </p>

                                <h4 class="mt-1 font-semibold text-gray-800 truncate">
                                    {{ data.title || (locale === 'en' ? 'New VMC' : 'Nouvelle VMC') }}
                                </h4>

                                <p class="mt-1 text-sm text-gray-500">
                                    {{ locale === 'en' ? 'Check details before creating VMC.' : 'Vérifiez les informations avant de créer la VMC.' }}
                                </p>
                            </div>

                            <div
                                class="shrink-0 w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                <ClipboardCheck :size="20" />
                            </div>

                        </div>
                    </div>

                    <!-- TYPE -->
                    <div class="p-5 border-b border-gray-200">

                        <p class="text-xs uppercase tracking-wider text-gray-400 mb-3 font-semibold">
                            {{ locale === 'en' ? 'VMC Type' : 'Type de VMC' }}
                        </p>

                        <div v-if="data.type" class="flex items-center gap-3">
                            <div class="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                                <ClipboardCheck :size="17" class="text-primary" />
                            </div>

                            <div class="min-w-0">
                                <p class="font-medium truncate text-gray-800">
                                    {{ data.type }}
                                </p>

                                <p class="text-xs text-gray-500">
                                    {{ locale === 'en' ? 'Selected type' : 'Type sélectionné' }}
                                </p>
                            </div>
                        </div>

                        <div v-else class="text-sm text-gray-400">
                            {{ locale === 'en' ? 'No type selected' : 'Aucun type sélectionné' }}
                        </div>

                    </div>

                    <!-- PLANIFICATION -->
                    <div class="p-5 border-b border-gray-200">

                        <p class="text-xs uppercase tracking-wider text-gray-400 mb-4 font-semibold">
                            {{ locale === 'en' ? 'Visit details' : 'Détails de visite' }}
                        </p>

                        <div class="grid grid-cols-2 gap-4">

                            <!-- SITE -->
                            <div class="col-span-2">
                                <p class="text-xs text-gray-500">
                                    {{ locale === 'en' ? 'Site' : 'Site' }}
                                </p>

                                <p v-if="data.site" class="mt-1 font-medium text-gray-800">
                                    {{ data.site }}
                                </p>

                                <p v-else class="mt-1 text-sm text-gray-400">
                                    {{ locale === 'en' ? 'Not provided' : 'Non renseigné' }}
                                </p>
                            </div>

                            <!-- DATE -->
                            <div>
                                <p class="text-xs text-gray-500">
                                    {{ locale === 'en' ? 'Date' : 'Date' }}
                                </p>

                                <p v-if="data.date" class="mt-1 font-medium text-gray-800">
                                    {{ formattedDate }}
                                </p>

                                <p v-else class="mt-1 text-sm text-gray-400">
                                    {{ locale === 'en' ? 'Not provided' : 'Non renseignée' }}
                                </p>
                            </div>

                            <!-- INSPECTEUR -->
                            <div>
                                <p class="text-xs text-gray-500">
                                    {{ locale === 'en' ? 'Inspector' : 'Inspecteur' }}
                                </p>

                                <p v-if="cleanInspectorName" class="mt-1 font-medium truncate text-gray-800">
                                    {{ cleanInspectorName }}
                                </p>

                                <p v-if="selectedInspectorUser?.job || selectedInspectorUser?.department" class="text-xs text-gray-400 truncate">
                                    {{ selectedInspectorUser.job || selectedInspectorUser.department }}
                                </p>

                                <p v-else-if="!cleanInspectorName" class="mt-1 text-sm text-gray-400">{{ locale === 'en' ? 'Unassigned' : 'Non assigné' }}
                                </p>
                            </div>

                            <!-- ACCOMPAGNANT -->
                            <div class="col-span-2">
                                <p class="text-xs text-gray-500">
                                    {{ locale === 'en' ? 'Accompanying person' : 'Personne accompagnante' }}
                                </p>

                                <p v-if="data.accompanying_person" class="mt-1 font-medium text-gray-800">
                                    {{ data.accompanying_person }}
                                </p>

                                <p v-else class="mt-1 text-sm text-gray-400">
                                    {{ locale === 'en' ? 'Not provided' : 'Non renseignée' }}
                                </p>
                            </div>

                        </div>
                    </div>

                    <!-- RÉSUMÉ -->
                    <div class="p-5">

                        <p class="text-xs uppercase tracking-wider text-gray-400 mb-4 font-semibold">
                            {{ locale === 'en' ? 'Summary' : 'Résumé' }}
                        </p>

                        <div class="rounded-xl bg-slate-50 border border-slate-100 p-4">

                            <template v-for="(row, index) in summaryRows" :key="row.label">

                                <div v-if="index > 0" class="h-px bg-gray-200 my-3" />

                                <div class="flex items-center justify-between gap-4">
                                    <span class="text-sm text-gray-500">
                                        {{ row.label }}
                                    </span>

                                    <span class="text-sm font-medium text-right max-w-44 truncate"
                                        :class="row.value ? 'text-gray-800' : 'text-gray-400'">
                                        {{ row.value || '—' }}
                                    </span>
                                </div>

                            </template>

                        </div>

                        <!-- STATUS -->
                        <div class="mt-4 flex items-center gap-2 text-xs"
                            :class="disabled_submit ? 'text-gray-400' : 'text-green-600'">
                            <span class="w-2 h-2 rounded-full"
                                :class="disabled_submit ? 'bg-gray-300' : 'bg-green-500'" />

                            <span>
                                {{
                                    disabled_submit
                                        ? (locale === 'en' ? 'Incomplete information (type and date required)' : 'Informations incomplètes (type et date requis)')
                                        : (locale === 'en' ? 'VMC ready to be created' : 'VMC prête à être créée')
                                }}
                            </span>
                        </div>

                    </div>

                </div>
            </div>

        </div>
    </div>
</template>
<script setup lang="ts">
    import { CheckCircle2, ClipboardCheck, MapPin, Save } from '@lucide/vue';
    import { useI18n } from 'vue-i18n';
    import Header from '../../../components/shared/Header.vue';
    import Button from '../../../components/ui/Button.vue';
    import Input from '../../../components/ui/Input.vue';
    import Select from '../../../components/ui/Select.vue';
    import SidebarLocationMap from '../../../components/shared/SidebarLocationMap.vue';
    import { router } from '../../../router/index.ts';
    import { computed, onMounted, ref } from 'vue';
    import type { VMCFormType } from '../../../@types/VMC.type.ts';
    import vmcService from '../../../core/services/vmc.service.ts';
    import { useUserService } from '../../../core/services/user.service.ts';
    import siteService from '../../../core/services/site.service.ts';

    const { t, locale } = useI18n();

    const VMCTypeData: { label: string, value: string }[] = [
        { label: 'Station-Service', value: 'Station-Service' },
        { label: 'Inspection camion', value: 'Inspection camion' },
        { label: 'Visite Magasins & Agences', value: 'Visite Magasins & Agences' },
        { label: 'Safety Report', value: 'SAFETY REPORT' },
        { label: 'Safety Moment', value: 'SAFETY MOMENT' },
        { label: 'Safety Awareness', value: 'SAFETY AWARENESS' },
    ]

    const data = ref<VMCFormType>({
        type: 'Station-Service',
        title: '',
        date: new Date().toISOString().slice(0, 10),
        site: '',
        inspector: '',
        inspector_id: undefined,
        accompanying_person: '',
    })

    const loading_submit = ref<boolean>(false)
    const errorMessage = ref<string>('')

    /* Users list for inspector selection */
    const userService = useUserService()
    const users = ref<any[]>([])

    const selectedInspectorUser = computed(() => {
        if (!data.value.inspector_id) return null
        return users.value.find((u: any) => String(u.id) === String(data.value.inspector_id)) ?? null
    })

    const cleanInspectorName = computed(() => {
        if (!selectedInspectorUser.value) return ''
        const u = selectedInspectorUser.value
        return `${u.first_name || ''} ${u.last_name || ''}`.trim() || u.name || u.email || ''
    })

    /* Sites list with coordinates */
    const siteList = ref<string[]>([])
    const registeredSites = ref<any[]>([])

    const selectedSiteInfo = computed(() => {
        if (!data.value.site) return null
        const sName = data.value.site.trim().toLowerCase()
        return registeredSites.value.find((s: any) => s.name?.toLowerCase() === sName) || null
    })

    function fetchUsers() {
        userService.index()
            .then((res: any) => {
                users.value = res.data?.data || res.data || []
            })
            .catch((err: any) => console.error('Erreur chargement utilisateurs:', err))
    }

    function fetchSites() {
        siteService.all()
            .then(res => {
                const sites = res.data?.data || res.data || []
                if (Array.isArray(sites) && sites.length > 0) {
                    registeredSites.value = sites
                    siteList.value = sites.map((s: any) => s.name).filter(Boolean)
                } else {
                    throw new Error('Fallback')
                }
            })
            .catch(() => {
                vmcService.getFilters()
                    .then(res => {
                        siteList.value = res.data.site || []
                    })
                    .catch(err => console.error(err))
            })
    }

    // Type et date obligatoires
    const disabled_submit = computed(() => !data.value.type || !data.value.date)

    const formattedDate = computed(() => {
        if (!data.value.date) return ''
        const date = new Date(data.value.date)
        if (Number.isNaN(date.getTime())) return data.value.date
        return new Intl.DateTimeFormat(locale.value === 'en' ? 'en-US' : 'fr-FR', { dateStyle: 'long', timeZone: 'UTC' }).format(date)
    })

    const summaryRows = computed(() => [
        { label: locale.value === 'en' ? 'Type' : 'Type', value: data.value.type },
        { label: locale.value === 'en' ? 'Site' : 'Site', value: data.value.site },
        { label: locale.value === 'en' ? 'Date' : 'Date', value: formattedDate.value },
        { label: locale.value === 'en' ? 'Inspector' : 'Inspecteur', value: cleanInspectorName.value || (locale.value === 'en' ? '(Default: yourself)' : '(Par défaut : vous-même)') },
        { label: locale.value === 'en' ? 'Accompanying' : 'Accompagnant', value: data.value.accompanying_person },
    ])

    function onSubmit() {
        if (loading_submit.value || disabled_submit.value) return

        loading_submit.value = true
        errorMessage.value = ''

        const payload: VMCFormType = {
            type: data.value.type,
            date: data.value.date,
            title: data.value.title?.trim() || undefined,
            site: data.value.site?.trim() || undefined,
            inspector: cleanInspectorName.value || undefined,
            inspector_id: data.value.inspector_id || undefined,
            assigned_to: data.value.inspector_id || undefined,
            accompanying_person: data.value.accompanying_person?.trim() || undefined,
        }

        vmcService.store(payload)
            .then(() => {
                router.push({
                    name: 'VMC'
                })
            })
            .catch(err => {
                console.error(err)
                errorMessage.value = err?.response?.data?.message || 'Erreur lors de la création de la VMC'
            })
            .finally(() => {
                loading_submit.value = false
            })
    }

    onMounted(() => {
        fetchUsers()
        fetchSites()
    })
</script>
