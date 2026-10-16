<template>
    <div class="w-full">
        <!-- HEADER -->
        <Header title="Planifier un suivi des équipements" :thumbnails="[
            { label: 'Accueil', name: 'DASHBOARD' },
            { label: 'Inspections', name: 'INSPECTION' },
            { label: 'Suivi du matériel', name: 'EQUIPMENT_MONITORING' },
            { label: 'Nouveau', name: 'EQUIPMENT_MONITORING_NEW' }
        ]" />

        <!-- CONTENT CONTAINER -->
        <div class="max-w-6xl mt-5 mx-auto px-4 sm:px-6 pb-12">
            <div class="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
                
                <!-- ==================================================== -->
                <!-- FORMULAIRE PRINCIPAL (COLONNE GAUCHE) -->
                <!-- ==================================================== -->
                <div class="xl:col-span-8 space-y-6">
                    <div class="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                        
                        <!-- CARD HEADER -->
                        <div class="px-6 py-5 border-b border-gray-100 bg-slate-50/60 flex items-center justify-between gap-4">
                            <div class="flex items-center gap-3">
                                <div class="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-xs">
                                    <ClipboardList :size="20" />
                                </div>
                                <div>
                                    <h2 class="text-base font-bold text-gray-900">
                                        Planifier un suivi du parc matériel
                                    </h2>
                                    <p class="text-xs text-gray-500">
                                        Sélectionnez la station, la date d'intervention et l'inspecteur responsable.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <!-- SECTION 1 : INFORMATIONS NÉCESSAIRES AU SUIVI & PLANIFICATION -->
                        <div class="p-6 border-b border-gray-100 space-y-4">
                            <div class="flex items-center gap-2 mb-2">
                                <span class="w-6 h-6 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">1</span>
                                <h3 class="font-bold text-gray-800 text-sm">Informations générales de l'inspection</h3>
                            </div>

                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-xs font-semibold text-gray-700 mb-1.5">
                                        Site / Station Galana <span class="text-red-500">*</span>
                                    </label>
                                    <input
                                        v-model="form.site_name"
                                        list="sites-datalist"
                                        type="text"
                                        placeholder="Sélectionner ou saisir une station..."
                                        class="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                                        :class="errors?.site_name ? 'border-red-500' : ''"
                                    />
                                    <datalist id="sites-datalist">
                                        <option v-for="site in sites" :key="site.id" :value="site.name">{{ site.name }}</option>
                                    </datalist>
                                    <p v-if="errors?.site_name" class="text-[11px] text-red-600 mt-1">Le site est requis.</p>
                                </div>

                                <div>
                                    <label class="block text-xs font-semibold text-gray-700 mb-1.5">
                                        Date prévue du contrôle <span class="text-red-500">*</span>
                                    </label>
                                    <input
                                        v-model="form.date"
                                        type="date"
                                        class="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                                    />
                                </div>

                                <div>
                                    <label class="block text-xs font-semibold text-gray-700 mb-1.5 flex items-center justify-between">
                                        <span>Inspecteur assigné</span>
                                        <span class="text-[10px] text-gray-400 font-normal">Choisi à l'avance</span>
                                    </label>
                                    <select
                                        v-model="form.user_id"
                                        class="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition cursor-pointer"
                                    >
                                        <option value="">Sélectionner un inspecteur (par défaut vous-même)...</option>
                                        <option v-for="user in users" :key="user.id" :value="user.id">
                                            {{ user.first_name || '' }} {{ user.last_name || '' }} {{ user.email ? `(${user.email})` : '' }} {{ user.job ? `— ${user.job}` : '' }}
                                        </option>
                                    </select>
                                </div>

                                <div>
                                    <label class="block text-xs font-semibold text-gray-700 mb-1.5 flex items-center justify-between">
                                        <span>Statut initial</span>
                                        <span class="text-[10px] text-gray-400 font-normal">Cycle d'inspection</span>
                                    </label>
                                    <select
                                        v-model="form.status"
                                        class="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition cursor-pointer font-medium"
                                    >
                                        <option v-for="st in ChecklistStatusJsonData" :key="st.value" :value="st.value">
                                            {{ st.label }}
                                        </option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label class="block text-xs font-semibold text-gray-700 mb-1.5">
                                    Notes de planification ou consignes pour l'inspecteur (optionnel)
                                </label>
                                <textarea
                                    v-model="form.observations"
                                    rows="3"
                                    placeholder="Préciser les consignes d'accès, points d'attention particuliers, contexte de la tournée..."
                                    class="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition resize-y"
                                ></textarea>
                            </div>
                        </div>

                        <!-- SECTION 2 : EXPLICATION DU PROCESSUS D'INSPECTION TERRAIN -->
                        <div class="p-6 bg-slate-50/50 space-y-3">
                            <div class="flex items-start gap-3 p-4 rounded-xl bg-blue-50/80 border border-blue-100 text-blue-900">
                                <div class="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                                    <CheckCircle2 :size="18" />
                                </div>
                                <div class="space-y-1 text-xs">
                                    <h4 class="font-bold text-blue-900 text-sm">Relevé des équipements sur le terrain</h4>
                                    <p class="text-blue-700 leading-relaxed">
                                        Aucun équipement n'est requis à la création. C'est l'inspecteur qui ajoutera chaque matériel unitaire contrôlé sur site lors de sa visite.
                                    </p>
                                    <p class="text-blue-600/90 leading-relaxed">
                                        Chaque équipement aura son propre contrôle de conformité (Conforme / Non conforme), son emplacement précis et ses photos de preuve. La quantité totale et par catégorie sera automatiquement déterminée par le comptage (count) des unités contrôlées.
                                    </p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                <!-- ==================================================== -->
                <!-- APERÇU ET ACTIONS (COLONNE DROITE) -->
                <!-- ==================================================== -->
                <aside class="xl:col-span-4 sticky top-6 space-y-4">
                    <div class="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 space-y-4">
                        <div class="flex items-center justify-between border-b border-gray-100 pb-3">
                            <div>
                                <p class="text-[10px] font-bold uppercase tracking-wider text-gray-400">Planification</p>
                                <h3 class="font-bold text-gray-900 text-sm">Fiche de suivi</h3>
                            </div>
                            <span class="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                                <ClipboardList :size="16" />
                            </span>
                        </div>

                        <!-- INFOS CLEFS -->
                        <div class="space-y-2.5 text-xs">
                            <div class="flex justify-between items-center py-1">
                                <span class="text-gray-500">Station :</span>
                                <span class="font-bold text-gray-900 text-right truncate max-w-[170px]">
                                    {{ form.site_name || 'Non sélectionnée' }}
                                </span>
                            </div>
                            <div class="flex justify-between items-center py-1">
                                <span class="text-gray-500">Date prévue :</span>
                                <span class="font-mono text-gray-800">{{ form.date || '-' }}</span>
                            </div>
                            <div class="flex justify-between items-center py-1">
                                <span class="text-gray-500">Inspecteur assigné :</span>
                                <span class="font-semibold text-gray-800 text-right truncate max-w-[170px]" :title="selectedInspectorName">
                                    {{ selectedInspectorName }}
                                </span>
                            </div>
                            <div class="flex justify-between items-center py-1">
                                <span class="text-gray-500">Statut initial :</span>
                                <ChecklistStatus :name="(form.status as any)" />
                            </div>
                        </div>

                        <!-- WORKFLOW RAPPEL -->
                        <div class="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-2 text-xs">
                            <p class="font-bold text-gray-700 text-[11px] uppercase tracking-wider">Déroulement du suivi</p>
                            <div class="space-y-1.5 text-[11px] text-gray-600">
                                <div class="flex items-center gap-2 text-primary font-bold">
                                    <span class="w-4 h-4 rounded-full bg-primary text-white text-[10px] flex items-center justify-center">1</span>
                                    <span>Planification de la visite (Cette étape)</span>
                                </div>
                                <div class="flex items-center gap-2 text-gray-400">
                                    <span class="w-4 h-4 rounded-full bg-gray-200 text-gray-600 text-[10px] flex items-center justify-center">2</span>
                                    <span>Relevé terrain (Ajout des équipements)</span>
                                </div>
                                <div class="flex items-center gap-2 text-gray-400">
                                    <span class="w-4 h-4 rounded-full bg-gray-200 text-gray-600 text-[10px] flex items-center justify-center">3</span>
                                    <span>Contrôle de conformité & Clôture</span>
                                </div>
                            </div>
                        </div>

                        <!-- ACTIONS -->
                        <div class="space-y-2 pt-2 border-t border-gray-100">
                            <button
                                type="button"
                                @click="submit(true)"
                                :disabled="loading || !form.site_name"
                                class="w-full py-2.5 px-4 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary/90 transition shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                <Play v-if="!loading" :size="14" />
                                <Loader v-else :size="14" class="animate-spin" />
                                <span>{{ loading ? 'Enregistrement...' : 'Planifier & Débuter l\'inspection' }}</span>
                            </button>

                            <button
                                type="button"
                                @click="submit(false)"
                                :disabled="loading || !form.site_name"
                                class="w-full py-2.5 px-4 bg-slate-100 text-slate-800 text-xs font-bold rounded-xl hover:bg-slate-200 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                <Save :size="14" />
                                <span>Enregistrer la planification</span>
                            </button>

                            <button
                                type="button"
                                @click="router.push({ name: 'EQUIPMENT_MONITORING' })"
                                class="w-full py-2 px-4 bg-transparent text-gray-500 text-xs font-medium rounded-xl hover:bg-gray-100 transition cursor-pointer text-center"
                            >
                                Retour à la liste
                            </button>
                        </div>
                    </div>
                </aside>

            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue"
import { useRouter } from "vue-router"
import Header from "../../../components/shared/Header.vue"
import ChecklistStatus from "../../../components/features/checklist/ChecklistStatus.vue"
import { ChecklistStatusJsonData } from "../../../@data/Checklist.data.ts"
import type { SiteNameType } from "../../../@types/SiteName..type.ts"
import { useEquipmentMonitoringService } from "../../../core/services/equipmentMonitoring.service.ts"
import { useUserService } from "../../../core/services/user.service.ts"
import { toast } from "vue3-toastify"
import {
    ClipboardList,
    CheckCircle2,
    Save,
    Play,
    Loader,
} from "@lucide/vue"

const router = useRouter()
const equipments = useEquipmentMonitoringService()
const userService = useUserService()

const loading = ref(false)
const errors = ref<Record<string, string[]> | null>(null)

const sites = ref<SiteNameType[]>([])
const users = ref<any[]>([])

const form = reactive({
    site_name: "",
    date: new Date().toISOString().split("T")[0],
    user_id: "",
    status: "DRAFT",
    observations: "",
})

const selectedInspectorName = computed(() => {
    if (!form.user_id) return "Non assigné (par défaut vous-même)"
    const u = users.value.find(user => String(user.id) === String(form.user_id))
    if (!u) return form.user_id
    const fullName = `${u.first_name || ''} ${u.last_name || ''}`.trim()
    return fullName || u.name || u.email || "Inspecteur"
})

async function submit(startInspectionNow = false) {
    errors.value = null
    if (!form.site_name) {
        errors.value = { site_name: ["Le site est requis"] }
        toast.error("Veuillez sélectionner un site.")
        return
    }

    loading.value = true
    try {
        const payload: any = {
            site_name: form.site_name,
            date: form.date,
            user_id: form.user_id || undefined,
            status: form.status,
            observations: form.observations || null,
            conformity_rate: 100,
            initial_conformity_rate: 100,
            items: [],
        }

        const res = await equipments.store(payload)

        toast.success("Contrôle de matériel planifié avec succès !")
        const newId = res?.data?.id
        if (startInspectionNow && newId) {
            router.push({ name: "EQUIPMENT_MONITORING_UPDATE", params: { id: newId } })
        } else if (newId) {
            router.push({ name: "EQUIPMENT_MONITORING_DETAILS", params: { id: newId } })
        } else {
            router.push({ name: "EQUIPMENT_MONITORING" })
        }
    } catch (err: any) {
        console.error("Erreur enregistrement suivi:", err)
        if (err?.response?.status === 422 && err.response.data.errors) {
            errors.value = err.response.data.errors
            toast.error("Veuillez vérifier les informations saisies.")
        } else {
            toast.error("Une erreur est survenue lors de l'enregistrement.")
        }
    } finally {
        loading.value = false
    }
}

function fetchSiteNames() {
    equipments.getSiteNames()
        .then((res: any) => {
            sites.value = res.data
        })
        .catch((err: any) => {
            console.error("Erreur chargement sites:", err)
        })
}

function fetchUsers() {
    userService.index()
        .then((res: any) => {
            users.value = res.data?.data || res.data || []
        })
        .catch((err: any) => {
            console.error("Erreur chargement utilisateurs:", err)
        })
}

onMounted(() => {
    fetchSiteNames()
    fetchUsers()
})
</script>