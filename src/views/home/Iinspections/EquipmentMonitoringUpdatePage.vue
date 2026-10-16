<template>
    <div class="w-full">
        <!-- HEADER -->
        <Header title="Modifier le suivi des équipements" :thumbnails="[
            { label: 'Accueil', name: 'DASHBOARD' },
            { label: 'Inspections', name: 'INSPECTION' },
            { label: 'Suivi du matériel', name: 'EQUIPMENT_MONITORING' },
            { label: 'Modifier', name: 'EQUIPMENT_MONITORING_UPDATE' }
        ]" />

        <!-- CONTENT CONTAINER -->
        <div class="max-w-7xl mt-5 mx-auto px-4 sm:px-6 pb-12">
            <!-- CHARGEMENT INITIAL -->
            <div v-if="loadingInitial" class="p-16 flex flex-col items-center justify-center text-center text-gray-400 gap-2">
                <Loader :size="28" class="animate-spin text-primary" />
                <span class="text-xs font-medium">Chargement des données du contrôle...</span>
            </div>

            <div v-else class="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
                
                <!-- ==================================================== -->
                <!-- FORMULAIRE PRINCIPAL (COLONNE GAUCHE) -->
                <!-- ==================================================== -->
                <div class="xl:col-span-8 space-y-6">
                    <div class="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                        
                        <!-- CARD HEADER -->
                        <div class="px-6 py-5 border-b border-gray-100 bg-slate-50/60 flex items-center justify-between gap-4">
                            <div class="flex items-center gap-3">
                                <div class="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-white shadow-xs">
                                    <Edit :size="20" />
                                </div>
                                <div>
                                    <h2 class="text-base font-bold text-gray-900">
                                        Modification du suivi n° {{ monitoringId }}
                                    </h2>
                                    <p class="text-xs text-gray-500">
                                        Mettez à jour les informations du contrôle et les équipements relevés.
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
                                        list="sites-update-datalist"
                                        type="text"
                                        placeholder="Sélectionner ou saisir un site..."
                                        class="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                                        :class="errors?.site_name ? 'border-red-500' : ''"
                                    />
                                    <datalist id="sites-update-datalist">
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
                                        <p class="text-[11px] text-gray-500">Modifiez, ajoutez ou supprimez des équipements.</p>
                                    </div>
                                </div>

                                <div class="flex items-center gap-2">
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
                                <h4 class="text-xs font-bold text-gray-700">Aucun équipement renseigné</h4>
                                <p class="text-[11px] text-gray-400 max-w-sm mx-auto mt-1">
                                    Cliquez sur « Ajouter un matériel » pour enregistrer un équipement sur cette fiche.
                                </p>
                            </div>

                            <!-- LISTE DES ÉQUIPEMENTS -->
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
                                                placeholder="Nom du matériel..."
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
                            <span class="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center">
                                <ClipboardList :size="16" />
                            </span>
                        </div>

                        <!-- INFOS CLEFS -->
                        <div class="space-y-2 text-xs">
                            <div class="flex justify-between items-center py-1">
                                <span class="text-gray-500">Site sélectionné :</span>
                                <span class="font-bold text-gray-900 text-right truncate max-w-[170px]">
                                    {{ form.site_name || 'Aucun site' }}
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
                                <span>{{ loading ? 'Mise à jour en cours...' : 'Enregistrer les modifications' }}</span>
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
import { useRoute, useRouter } from "vue-router"
import {
    ClipboardList,
    Plus,
    Trash2,
    Save,
    Edit,
    Package,
    Loader,
} from "@lucide/vue"
import Header from "../../../components/shared/Header.vue"
import type { SiteNameType } from "../../../@types/SiteName..type.ts"
import { useEquipmentMonitoringService } from "../../../core/services/equipmentMonitoring.service.ts"
import { toast } from "vue3-toastify"

const route = useRoute()
const router = useRouter()
const equipments = useEquipmentMonitoringService()
const monitoringId = computed(() => route.params.id as string)

const loadingInitial = ref(true)
const loading = ref(false)
const sites = ref<SiteNameType[]>([])
const errors = ref<{ site_name?: string[]; date?: string[] } | null>(null)

interface DynamicItem {
    id?: number
    name: string
    type: string
    value: string | number
    conformity: boolean
    location?: string
    comment?: string
}

const form = reactive({
    site_name: "",
    date: "",
    observations: "",
})

const items = ref<DynamicItem[]>([])

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

async function fetchDetails() {
    loadingInitial.value = true
    try {
        const res = await equipments.show(monitoringId.value)
        const d = res?.data as any
        if (d) {
            form.site_name = typeof d.site_name === "object" ? d.site_name?.name : d.site_name
            form.date = d.date || ""
            form.observations = d.observations || ""

            if (d.items && Array.isArray(d.items)) {
                items.value = d.items.map((it: any) => ({
                    id: it.id,
                    name: it.name,
                    type: it.type || "divers",
                    value: it.value,
                    conformity: Boolean(it.conformity),
                    location: it.location || "",
                    comment: it.comment || "",
                }))
            }
        }
    } catch (err) {
        console.error("Erreur chargement suivi:", err)
        toast.error("Impossible de charger les données du suivi.")
    } finally {
        loadingInitial.value = false
    }
}

async function submit() {
    errors.value = null
    if (!form.site_name) {
        errors.value = { site_name: ["Le site est requis"] }
        toast.error("Veuillez renseigner un site.")
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
                id: it.id,
                name: it.name || "Matériel non spécifié",
                type: it.type || "divers",
                conformity: it.conformity,
                value_type: typeof it.value === "number" ? "number" : "text",
                value: String(it.value ?? ""),
                location: it.location || null,
                comment: it.comment || null,
            })),
        }

        await equipments.update(monitoringId.value, payload)
        toast.success("Suivi du matériel mis à jour avec succès !")
        router.push({ name: "EQUIPMENT_MONITORING_DETAILS", params: { id: monitoringId.value } })
    } catch (err: any) {
        console.error("Erreur mise à jour suivi:", err)
        if (err?.response?.status === 422 && err.response.data.errors) {
            errors.value = err.response.data.errors
            toast.error("Veuillez vérifier les informations saisies.")
        } else {
            toast.error("Une erreur est survenue lors de la mise à jour.")
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
    fetchDetails()
})
</script>
