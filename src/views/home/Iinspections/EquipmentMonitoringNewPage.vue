<template>
    <div class="w-full">
        <!-- HEADER -->
        <Header title="Ajouter un suivi des équipements" :thumbnails="[
            { label: 'Accueil', name: 'DASHBOARD' },
            { label: 'Inspections', name: 'INSPECTION' },
            { label: 'Suivi du matériel', name: 'EQUIPMENT_MONITORING' },
            { label: 'Nouveau', name: 'EQUIPMENT_MONITORING_NEW' }
        ]" />

        <!-- CONTENT CONTAINER -->
        <div class="max-w-7xl mt-5 mx-auto px-4 sm:px-6 pb-12">
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
                                        Nouveau contrôle de matériel
                                    </h2>
                                    <p class="text-xs text-gray-500">
                                        Renseignez le site, la date et les équipements contrôlés.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <!-- SECTION 1 : INFORMATIONS NÉCESSAIRES AU SUIVI -->
                        <div class="p-6 border-b border-gray-100 space-y-4">
                            <div class="flex items-center gap-2 mb-2">
                                <span class="w-6 h-6 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">1</span>
                                <h3 class="font-bold text-gray-800 text-sm">Informations générales de la visite</h3>
                            </div>

                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-xs font-semibold text-gray-700 mb-1.5">
                                        Site / Station <span class="text-red-500">*</span>
                                    </label>
                                    <input
                                        v-model="form.site_name"
                                        list="sites-datalist"
                                        type="text"
                                        placeholder="Sélectionner ou saisir un site..."
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
                                        Date de relevé <span class="text-red-500">*</span>
                                    </label>
                                    <input
                                        v-model="form.date"
                                        type="date"
                                        class="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                                    />
                                </div>
                            </div>

                            <div>
                                <label class="block text-xs font-semibold text-gray-700 mb-1.5">
                                    Observations générales (optionnel)
                                </label>
                                <textarea
                                    v-model="form.observations"
                                    rows="2"
                                    placeholder="Notes de visite, remarques sur la conformité globale du site..."
                                    class="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition resize-y"
                                ></textarea>
                            </div>
                        </div>

                        <!-- SECTION 2 : ÉQUIPEMENTS DYNAMIQUES (EquipmentItem) -->
                        <div class="p-6 space-y-4">
                            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <div class="flex items-center gap-2">
                                    <span class="w-6 h-6 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">2</span>
                                    <div>
                                        <h3 class="font-bold text-gray-800 text-sm flex items-center gap-2">
                                            <span>Matériels et équipements contrôlés</span>
                                            <span class="px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 text-xs font-bold">{{ items.length }}</span>
                                        </h3>
                                        <p class="text-[11px] text-gray-500">Ajoutez les équipements relevés lors du contrôle.</p>
                                    </div>
                                </div>

                                <div class="flex items-center gap-2">
                                    <button
                                        type="button"
                                        @click="loadStandardGalanaTemplates"
                                        class="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition cursor-pointer flex items-center gap-1.5"
                                        title="Insérer automatiquement la liste des matériels types Galana"
                                    >
                                        <Sparkles :size="13" class="text-amber-500" />
                                        <span>Modèle standard Galana</span>
                                    </button>

                                    <button
                                        type="button"
                                        @click="addNewItem"
                                        class="px-3.5 py-1.5 text-xs font-bold text-white bg-primary hover:bg-primary/90 rounded-lg shadow-2xs transition cursor-pointer flex items-center gap-1.5"
                                    >
                                        <Plus :size="14" />
                                        <span>Ajouter un matériel</span>
                                    </button>
                                </div>
                            </div>

                            <!-- ÉTAT VIDE -->
                            <div v-if="items.length === 0" class="py-12 px-4 text-center border-2 border-dashed border-gray-200 rounded-xl bg-slate-50/50">
                                <Package :size="32" class="mx-auto text-gray-300 mb-2" />
                                <h4 class="text-xs font-bold text-gray-700">Aucun équipement ajouté pour l'instant</h4>
                                <p class="text-[11px] text-gray-400 max-w-sm mx-auto mt-1">
                                    Cliquez sur « Modèle standard Galana » pour charger les 21 équipements types ou « Ajouter un matériel » pour une saisie personnalisée.
                                </p>
                                <div class="mt-4 flex items-center justify-center gap-2">
                                    <button
                                        type="button"
                                        @click="loadStandardGalanaTemplates"
                                        class="px-3 py-1.5 text-xs font-semibold text-primary bg-primary/10 hover:bg-primary hover:text-white rounded-lg transition cursor-pointer"
                                    >
                                        Charger le standard Galana
                                    </button>
                                    <button
                                        type="button"
                                        @click="addNewItem"
                                        class="px-3 py-1.5 text-xs font-semibold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg transition cursor-pointer"
                                    >
                                        + Ajouter manuellement
                                    </button>
                                </div>
                            </div>

                            <!-- LISTE DES ÉQUIPEMENTS AJOUTÉS -->
                            <div v-else class="space-y-3">
                                <div
                                    v-for="(item, index) in items"
                                    :key="index"
                                    class="p-3.5 rounded-xl border border-gray-200 bg-white hover:border-gray-300 transition-all shadow-2xs space-y-3"
                                >
                                    <div class="flex items-start justify-between gap-2">
                                        <div class="flex items-center gap-2 flex-1">
                                            <span class="w-5 h-5 rounded-md bg-gray-100 text-gray-500 flex items-center justify-center text-[10px] font-bold">
                                                {{ index + 1 }}
                                            </span>
                                            <input
                                                v-model="item.name"
                                                type="text"
                                                placeholder="Nom du matériel (ex: Extincteur P50, Bac Métal...)"
                                                class="font-bold text-xs text-gray-900 border-b border-gray-200 hover:border-primary focus:border-primary focus:outline-none flex-1 py-0.5"
                                            />
                                        </div>

                                        <div class="flex items-center gap-2">
                                            <!-- Bouton bascule conformité -->
                                            <button
                                                type="button"
                                                @click="item.conformity = !item.conformity"
                                                class="px-2.5 py-1 rounded-full text-xs font-bold cursor-pointer transition select-none flex items-center gap-1 shadow-2xs"
                                                :class="item.conformity ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'"
                                                :title="'Cliquer pour modifier l\'état de conformité'"
                                            >
                                                <span class="w-1.5 h-1.5 rounded-full inline-block" :class="item.conformity ? 'bg-emerald-500' : 'bg-red-500'"></span>
                                                <span>{{ item.conformity ? 'Conforme' : 'Non conforme' }}</span>
                                            </button>

                                            <!-- Bouton supprimer -->
                                            <button
                                                type="button"
                                                @click="removeItem(index)"
                                                class="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition cursor-pointer"
                                                title="Supprimer cet équipement"
                                            >
                                                <Trash2 :size="14" />
                                            </button>
                                        </div>
                                    </div>

                                    <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-xs">
                                        <div>
                                            <label class="block text-[10px] text-gray-500 font-semibold mb-1">Catégorie</label>
                                            <select
                                                v-model="item.type"
                                                class="w-full px-2.5 py-1.5 text-xs rounded-lg border border-gray-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-primary"
                                            >
                                                <option value="extincteur">Extincteur</option>
                                                <option value="bac">Bac & Rétention</option>
                                                <option value="materiel">Matériel & Outils</option>
                                                <option value="poubelle">Déchets & Poubelles</option>
                                                <option value="signalisation">Signalétique & Pictogrammes</option>
                                                <option value="securite">Sécurité Incendie</option>
                                                <option value="conformite">Document & Affichage</option>
                                                <option value="divers">Autre / Divers</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label class="block text-[10px] text-gray-500 font-semibold mb-1">Relevé / Quantité</label>
                                            <input
                                                v-model="item.value"
                                                type="text"
                                                placeholder="Quantité ou Présent/Absent"
                                                class="w-full px-2.5 py-1.5 text-xs rounded-lg border border-gray-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-primary"
                                            />
                                        </div>

                                        <div>
                                            <label class="block text-[10px] text-gray-500 font-semibold mb-1">Emplacement</label>
                                            <input
                                                v-model="item.location"
                                                type="text"
                                                placeholder="Piste, TGBT, Boutique..."
                                                class="w-full px-2.5 py-1.5 text-xs rounded-lg border border-gray-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-primary"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <input
                                            v-model="item.comment"
                                            type="text"
                                            placeholder="Commentaire ou observation spécifique (optionnel)..."
                                            class="w-full px-2.5 py-1 text-[11px] rounded-lg border border-dashed border-gray-200 text-gray-600 placeholder-gray-400 focus:bg-white focus:outline-none focus:border-primary"
                                        />
                                    </div>
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
                                <p class="text-[10px] font-bold uppercase tracking-wider text-gray-400">Synthèse en direct</p>
                                <h3 class="font-bold text-gray-900 text-sm">Aperçu du contrôle</h3>
                            </div>
                            <span class="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                                <ClipboardList :size="16" />
                            </span>
                        </div>

                        <!-- INFOS CLEFS -->
                        <div class="space-y-2 text-xs">
                            <div class="flex justify-between items-center py-1">
                                <span class="text-gray-500">Site sélectionné :</span>
                                <span class="font-bold text-gray-900 text-right truncate max-w-[170px]">
                                    {{ form.site_name || 'Aucun site sélectionné' }}
                                </span>
                            </div>
                            <div class="flex justify-between items-center py-1">
                                <span class="text-gray-500">Date du relevé :</span>
                                <span class="font-mono text-gray-800">{{ form.date || '-' }}</span>
                            </div>
                            <div class="flex justify-between items-center py-1">
                                <span class="text-gray-500">Total équipements :</span>
                                <span class="font-bold text-gray-900">{{ items.length }}</span>
                            </div>
                        </div>

                        <!-- INDICATEURS DE CONFORMITÉ -->
                        <div class="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
                            <div class="flex items-center justify-between">
                                <span class="text-xs font-semibold text-gray-600">Taux de conformité</span>
                                <span class="text-base font-black" :class="conformityRate >= 90 ? 'text-emerald-700' : 'text-red-700'">
                                    {{ conformityRate }}%
                                </span>
                            </div>

                            <div class="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                                <div
                                    class="h-full rounded-full transition-all duration-300"
                                    :class="conformityRate >= 90 ? 'bg-emerald-500' : (conformityRate >= 70 ? 'bg-amber-500' : 'bg-red-500')"
                                    :style="{ width: `${conformityRate}%` }"
                                ></div>
                            </div>

                            <div class="grid grid-cols-2 gap-2 text-center text-xs pt-1">
                                <div class="bg-white p-2 rounded-lg border border-gray-100">
                                    <span class="text-[10px] text-gray-400 block">Conformes</span>
                                    <span class="font-bold text-emerald-600">{{ compliantCount }}</span>
                                </div>
                                <div class="bg-white p-2 rounded-lg border border-gray-100">
                                    <span class="text-[10px] text-gray-400 block">Anomalies</span>
                                    <span class="font-bold text-red-600">{{ nonCompliantCount }}</span>
                                </div>
                            </div>
                        </div>

                        <!-- STATUT ESTIMÉ -->
                        <div class="flex items-center justify-between text-xs py-1">
                            <span class="text-gray-500">Statut estimé :</span>
                            <span class="px-2.5 py-0.5 rounded-full text-[11px] font-bold" :class="statusBadgeClass">
                                {{ statusText }}
                            </span>
                        </div>

                        <!-- ACTIONS -->
                        <div class="space-y-2 pt-2 border-t border-gray-100">
                            <button
                                type="button"
                                @click="submit"
                                :disabled="loading || !form.site_name"
                                class="w-full py-2.5 px-4 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary/90 transition shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                <Loader v-if="loading" :size="15" class="animate-spin" />
                                <Save v-else :size="15" />
                                <span>{{ loading ? 'Enregistrement en cours...' : 'Enregistrer le relevé' }}</span>
                            </button>

                            <button
                                type="button"
                                @click="router.push({ name: 'EQUIPMENT_MONITORING' })"
                                class="w-full py-2 px-4 bg-gray-100 text-gray-700 text-xs font-semibold rounded-xl hover:bg-gray-200 transition cursor-pointer"
                            >
                                Annuler
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
import {
    ClipboardList,
    Plus,
    Trash2,
    Save,
    Sparkles,
    Package,
    Loader,
} from "@lucide/vue"
import Header from "../../../components/shared/Header.vue"
import type { SiteNameType } from "../../../@types/SiteName..type.ts"
import { useEquipmentMonitoringService } from "../../../core/services/equipmentMonitoring.service.ts"
import { toast } from "vue3-toastify"

const router = useRouter()
const equipments = useEquipmentMonitoringService()
const loading = ref(false)
const sites = ref<SiteNameType[]>([])
const errors = ref<{ site_name?: string[]; date?: string[] } | null>(null)

interface DynamicItem {
    name: string
    type: string
    value: string | number
    conformity: boolean
    location?: string
    comment?: string
}

const form = reactive({
    site_name: "",
    date: new Date().toISOString().split("T")[0],
    observations: "",
})

const items = ref<DynamicItem[]>([])

const standardGalanaTemplates: DynamicItem[] = [
    { name: "Extincteur P50", type: "extincteur", value: 1, conformity: true, location: "Piste" },
    { name: "Extincteur P9", type: "extincteur", value: 2, conformity: true, location: "Piste" },
    { name: "Extincteur P6", type: "extincteur", value: 2, conformity: true, location: "Boutique / Bureau" },
    { name: "Extincteur CO₂", type: "extincteur", value: 1, conformity: true, location: "TGBT" },
    { name: "Bac Métallique", type: "bac", value: 1, conformity: true, location: "Piste" },
    { name: "Bac Plastique", type: "bac", value: 1, conformity: true, location: "Piste" },
    { name: "Bac de Rétention", type: "bac", value: 1, conformity: true, location: "Stockage" },
    { name: "Pelles", type: "materiel", value: 2, conformity: true, location: "Zone sable" },
    { name: "Poubelles 120L", type: "poubelle", value: 2, conformity: true, location: "Piste" },
    { name: "Poubelle 240L", type: "poubelle", value: 1, conformity: true, location: "Extérieur" },
    { name: "Boîte CAF (Anti-Feu)", type: "materiel", value: 1, conformity: true, location: "Piste" },
    { name: "Plots de sécurité", type: "securite", value: 4, conformity: true, location: "Piste" },
    { name: "Chaînettes", type: "securite", value: 2, conformity: true, location: "Piste" },
    { name: "Détecteurs de fumée", type: "securite", value: 2, conformity: true, location: "Boutique / TGBT" },
    { name: "Picto Danger TGBT", type: "signalisation", value: "Présent", conformity: true, location: "TGBT" },
    { name: "Panneau Dépotage en cours", type: "signalisation", value: "Présent", conformity: true, location: "Aire dépotage" },
    { name: "Panneau Évent", type: "signalisation", value: "Présent", conformity: true, location: "Évents" },
    { name: "Point de rassemblement", type: "signalisation", value: "Présent", conformity: true, location: "Parking" },
    { name: "Contact d'urgence", type: "signalisation", value: "Présent", conformity: true, location: "Bureau gérance" },
    { name: "Livret / Fiche réflexe", type: "conformite", value: "Présent", conformity: true, location: "Bureau" },
    { name: "Politique HSSE affichée", type: "conformite", value: "Présent", conformity: true, location: "Bureau" },
]

function loadStandardGalanaTemplates() {
    items.value = standardGalanaTemplates.map(it => ({ ...it }))
    toast.info("Modèle standard Galana appliqué.")
}

function addNewItem() {
    items.value.push({
        name: "",
        type: "materiel",
        value: 1,
        conformity: true,
        location: "",
        comment: "",
    })
}

function removeItem(index: number) {
    items.value.splice(index, 1)
}

const compliantCount = computed(() => items.value.filter(it => it.conformity).length)
const nonCompliantCount = computed(() => items.value.filter(it => !it.conformity).length)

const conformityRate = computed(() => {
    if (items.value.length === 0) return 100
    const rate = (compliantCount.value / items.value.length) * 100
    return Math.round(rate * 10) / 10
})

const estimatedStatus = computed(() => {
    if (conformityRate.value >= 90) return "COMPLETED"
    if (conformityRate.value >= 70) return "WARNING"
    return "NON_CONFORME"
})

const statusText = computed(() => {
    if (conformityRate.value >= 90) return "🟢 Conforme"
    if (conformityRate.value >= 70) return "🟡 Contrôle requis"
    return "🔴 Anomalie"
})

const statusBadgeClass = computed(() => {
    if (conformityRate.value >= 90) return "bg-emerald-50 text-emerald-800 border border-emerald-200"
    if (conformityRate.value >= 70) return "bg-amber-50 text-amber-800 border border-amber-200"
    return "bg-red-50 text-red-800 border border-red-200"
})

async function submit() {
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
            observations: form.observations || null,
            status: estimatedStatus.value,
            conformity_rate: conformityRate.value,
            items: items.value.map(it => ({
                name: it.name || "Matériel non spécifié",
                type: it.type || "divers",
                conformity: it.conformity,
                value_type: typeof it.value === "number" ? "number" : "text",
                value: String(it.value ?? ""),
                location: it.location || null,
                comment: it.comment || null,
            })),
        }

        const res = await equipments.store(payload)
        toast.success("Suivi du matériel enregistré avec succès !")
        const newId = res?.data?.id
        if (newId) {
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
        .then(res => {
            sites.value = res.data
        })
        .catch(err => {
            console.error("Erreur chargement sites:", err)
        })
}

onMounted(() => {
    fetchSiteNames()
    loadStandardGalanaTemplates()
})
</script>