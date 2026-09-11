<script setup lang="ts">

    import { computed, onMounted, reactive, ref, watch } from "vue"
    import { useRouter } from "vue-router"

    import {
        BookOpen,
        CheckCircle,
        ClipboardList,
        Info,
        Package,
        PanelsTopLeft,
        ShieldAlert,
        ShieldCheck,
        Signpost,
        Trash2,
        TriangleAlert,
    } from "@lucide/vue"

    import Header from "../../../components/shared/Header.vue"
    import Input from "../../../components/ui/Input.vue"
    import Button from "../../../components/ui/Button.vue"

    import type { SiteNameType } from "../../../@types/SiteName..type.ts"
    import type { EquipmentMonitoringFormType } from "../../../@types/EquipmentMonitoring.type"
    import { useEquipmentMonitoringService } from "../../../core/services/equipmentMonitoring.service.ts"
    import { useI18n } from "vue-i18n"
import { toast } from "vue3-toastify"


    const router = useRouter()

    /*
    |--------------------------------------------------------------------------
    | STATE
    |--------------------------------------------------------------------------
    */
    const { t } = useI18n()
    const loading = ref(false)
    const disabled=ref(true)
    const sites = ref<SiteNameType[]>([])
    const equipments = useEquipmentMonitoringService()
    const form = reactive<EquipmentMonitoringFormType>({

        site_name: null,



        date: new Date()
            .toISOString()
            .split("T")[0],

        // Extincteurs
        p50: 0,
        p9: 0,
        p6: 0,
        co2: 0,

        // Matériel
        bas_met: 0,
        bas_plast: 0,
        pelles: 0,
        poubelles_120l: 0,
        poubelles_240l: 0,
        caf: 0,
        detecteur_de_fumee: 0,
        plots: 0,
        chainettes: 0,

        // Signalisation
        picto_ext: 0,
        picto_caf: 0,
        picto_defense_de_fumer: 0,
        point_de_rasso: 0,
        contact_d_urgence: 0,
        canne_d_enfutage: 0,
        panneau_depotage_en_cours: 0,

        // Contrôles
        picto_danger_tgbt: false,
        panneau_event: false,
        livret_fiche_reflexe: false,
        politique: false

    })
    const errors = ref<Record<keyof EquipmentMonitoringFormType, string[] | undefined> | undefined>()

    /*
    |--------------------------------------------------------------------------
    | TOTAL DES ÉQUIPEMENTS
    |--------------------------------------------------------------------------
    */
    const totalEquipment = computed(() => {
        return Object.values(form).filter(item => typeof item == 'number').reduce((sum, value) => sum + value, 0)
    })

    /*
    |--------------------------------------------------------------------------
    | CONTRÔLES
    |--------------------------------------------------------------------------
    */

    const totalControls = 4

    const validatedControls = computed(() => {

        return [
            form.picto_danger_tgbt,
            form.panneau_event,
            form.livret_fiche_reflexe,
            form.politique
        ].filter(Boolean).length

    })


    const controlProgress = computed(() => {

        return Math.round(
            (validatedControls.value / totalControls) * 100
        )

    })
    function formValidation(){
        disabled.value=Object.values(form).some(item=> item==null)
    }



    /*
    |--------------------------------------------------------------------------
    | DATE FORMAT
    |--------------------------------------------------------------------------
    */

    const formattedDate = computed(() => {

        if (!form.date) {
            return "-"
        }

        const date = new Date(form.date)

        return date.toLocaleDateString("fr-FR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        })

    })


    /*
    |--------------------------------------------------------------------------
    | SUBMIT
    |--------------------------------------------------------------------------
    */

    const submit = async () => {
        errors.value = undefined
        loading.value = true
        disabled.value = true
        console.table(form)
        equipments.store(form)
            .then(res => {
                toast.success(t('inspections.equipment-monitoring.add.notifications.success'))
                setTimeout(() => {
                    router.push({
                        name: "EQUIPMENT_MONITORING"
                    })
                }, 1000)
            })
            .catch(err => {
                // console.error(err)
                if (err?.response.status == "422") {
                    console.error(err?.response.data.errors)
                    errors.value = Object.fromEntries(Object.entries(err?.response.data.errors as Record<keyof EquipmentMonitoringFormType, string[]>).map(
                        ([key, value]) => [
                            key,
                            value.map(item => t('inspections.equipment-monitoring.add.notifications.errors.' + item)
                            )
                        ])
                    ) as Record<keyof EquipmentMonitoringFormType, string[]>
                }
            })
            .finally(() => {
                loading.value = false
                disabled.value = false
            })

    }


    /*
    |--------------------------------------------------------------------------
    | CANCEL
    |--------------------------------------------------------------------------
    */

    const cancel = () => {
        router.back()
    }


    /*
    |--------------------------------------------------------------------------
    | FETCHDATA
    |--------------------------------------------------------------------------
    */

    function fetchSiteNames() {
        equipments.getSiteNames()
            .then(res => {
                console.log(res.data)
                sites.value = res.data
            })
            .catch(err => {
                console.error(err)
            })
    }
    /*
    |--------------------------------------------------------------------------
    | INIT
    |--------------------------------------------------------------------------
    */
   watch(form,()=>{
    formValidation()
   })

    onMounted(() => {
        disabled.value=true
        fetchSiteNames()
    })


</script>


<template>

    <div class="w-full">

        <!-- ============================================================ -->
        <!-- HEADER -->
        <!-- ============================================================ -->

        <Header title="inspections.equipment-monitoring.add.title" :thumbnails="[
            {
                label: 'thumbnails.home',
                name: 'DASHBOARD'
            },
            {
                label: 'thumbnails.inspection',
                name: 'INSPECTION'
            },
            {
                label: 'thumbnails.equipment-monitoring',
                name: 'EQUIPMENT_MONITORING'
            },
            {
                label: 'thumbnails.new',
                name: 'EQUIPMENT_MONITORING_NEW'
            }
        ]" />


        <!-- ============================================================ -->
        <!-- CONTENT -->
        <!-- ============================================================ -->

        <div class="
                max-w-350
                mt-5
                mx-auto
                px-4
                sm:px-6
                pb-10
            ">

            <div class="
                    grid
                    grid-cols-1
                    xl:grid-cols-12
                    gap-6
                    items-start
                ">


                <!-- ==================================================== -->
                <!-- FORMULAIRE -->
                <!-- ==================================================== -->

                <div class="
                        xl:col-span-8
                    ">

                    <div class="
                            bg-white
                            border
                            border-slate-200
                            rounded-2xl
                            shadow-sm
                            overflow-hidden
                        ">

                        <!-- CARD HEADER -->

                        <div class="
                                px-6
                                py-5
                                border-b
                                border-border
                                bg-surface-alt
                            ">

                            <div class="flex items-center gap-3">

                                <div class="
                                        w-10
                                        h-10
                                        rounded-xl
                                        bg-accent-dark
                                        flex
                                        items-center
                                        justify-center
                                        text-white
                                    ">

                                    <ClipboardList :size="20" />

                                </div>


                                <div>

                                    <h2 class="
                                            text-lg
                                            font-semibold
                                            text-accent-dark
                                        ">
                                        Suivi des matériels
                                    </h2>

                                    <p class="
                                            text-sm
                                            text-text-muted
                                        ">
                                        Renseignez les équipements présents
                                        sur le site.
                                    </p>

                                </div>

                            </div>

                        </div>


                        <!-- FORM CONTENT -->

                        <div class="p-6 space-y-8">


                            <!-- ================================================= -->
                            <!-- INFORMATIONS GENERALES -->
                            <!-- ================================================= -->

                            <section>

                                <div class="
                                        flex
                                        items-center
                                        gap-3
                                        mb-5
                                    ">

                                    <div class="
                                            w-8
                                            h-8
                                            rounded-lg
                                            bg-accent-dark/10
                                            text-accent-dark
                                            flex
                                            items-center
                                            justify-center
                                        ">

                                        <Info :size="17" />

                                    </div>


                                    <div>

                                        <h3 class="
                                                font-semibold
                                                text-accent-dark
                                            ">
                                            Informations générales
                                        </h3>

                                        <p class="
                                                text-xs
                                                text-slate-500
                                            ">
                                            Informations du relevé
                                        </p>

                                    </div>

                                </div>


                                <div class="
                                        grid
                                        grid-cols-1
                                        md:grid-cols-2
                                        gap-5
                                    ">

                                    <Input v-model="form.site_name as string | undefined" label="Site"
                                        placeholder="Sélectionner une site" list_id="site_id"
                                        :lists="sites.map(item => item.name)" :error="errors?.site_name?.[0]" />


                                    <Input v-model="form.date" label="Date de relevé" type="date"
                                        :error="errors?.date?.[0]" />

                                </div>

                            </section>


                            <!-- ================================================= -->
                            <!-- EXTINCTEURS -->
                            <!-- ================================================= -->

                            <section class="
                                    border-t
                                    border-border
                                    pt-7
                                ">

                                <div class="
                                        flex
                                        items-center
                                        gap-3
                                        mb-5
                                    ">

                                    <div class="
                                            w-8
                                            h-8
                                            rounded-lg
                                            bg-red-50
                                            text-red-600
                                            flex
                                            items-center
                                            justify-center
                                        ">

                                        <ShieldAlert :size="17" />

                                    </div>


                                    <div>

                                        <h3 class="
                                                font-semibold
                                                text-accent-dark
                                            ">
                                            Extincteurs
                                        </h3>

                                        <p class="
                                                text-xs
                                                text-text-muted
                                            ">
                                            Quantité disponible
                                        </p>

                                    </div>

                                </div>


                                <div class="
                                        grid
                                        grid-cols-2
                                        md:grid-cols-4
                                        gap-4
                                    ">

                                    <Input v-model.number="form.p50" label="P50" type="number" :min="0"
                                        :error="errors?.p50?.[0]" />

                                    <Input v-model.number="form.p9" label="P9" type="number" :min="0"
                                        :error="errors?.p9?.[0]" />

                                    <Input v-model.number="form.p6" label="P6" type="number" :min="0"
                                        :error="errors?.p6?.[0]" />

                                    <Input v-model.number="form.co2" label="CO₂" type="number" :min="0"
                                        :error="errors?.co2?.[0]" />

                                </div>

                            </section>


                            <!-- ================================================= -->
                            <!-- MATERIEL -->
                            <!-- ================================================= -->

                            <section class="
                                    border-t
                                    border-border
                                    pt-7
                                ">

                                <div class="
                                        flex
                                        items-center
                                        gap-3
                                        mb-5
                                    ">

                                    <div class="
                                            w-8
                                            h-8
                                            rounded-lg
                                            bg-accent-medium/10
                                            text-accent-medium
                                            flex
                                            items-center
                                            justify-center
                                        ">

                                        <Package :size="17" />

                                    </div>


                                    <div>

                                        <h3 class="
                                                font-semibold
                                                text-accent-dark
                                            ">
                                            Matériel
                                        </h3>

                                        <p class="
                                                text-xs
                                                text-text-muted
                                            ">
                                            Quantité des équipements
                                        </p>

                                    </div>

                                </div>


                                <div class="
                                        grid
                                        grid-cols-2
                                        md:grid-cols-4
                                        gap-4
                                    ">

                                    <Input v-model.number="form.bas_met" label="Bac métal" type="number" :min="0"
                                        :error="errors?.bas_met?.[0]" />

                                    <Input v-model.number="form.bas_plast" label="Bac plastique" type="number" :min="0"
                                        :error="errors?.bas_plast?.[0]" />

                                    <Input v-model.number="form.pelles" label="Pelles" type="number" :min="0"
                                        :error="errors?.pelles?.[0]" />

                                    <Input v-model.number="form.caf" label="CAF" type="number" :min="0"
                                        :error="errors?.caf?.[0]" />

                                    <Input v-model.number="form.poubelles_120l" label="Poubelles 120L" type="number"
                                        :min="0" :error="errors?.poubelles_120l?.[0]" />

                                    <Input v-model.number="form.poubelles_240l" label="Poubelle 240L" type="number"
                                        :min="0" :error="errors?.poubelles_240l?.[0]" />

                                    <Input v-model.number="form.plots" label="Plots" type="number" :min="0"
                                        :error="errors?.plots?.[0]" />

                                    <Input v-model.number="form.chainettes" label="Chaînettes" type="number" :min="0"
                                        :error="errors?.chainettes?.[0]" />

                                    <Input v-model.number="form.detecteur_de_fumee" label="Détecteurs de fumée"
                                        type="number" :min="0" :error="errors?.detecteur_de_fumee?.[0]" />

                                </div>

                            </section>


                            <!-- ================================================= -->
                            <!-- SIGNALISATION -->
                            <!-- ================================================= -->

                            <section class="
                                    border-t
                                    border-border
                                    pt-7
                                ">

                                <div class="
                                        flex
                                        items-center
                                        gap-3
                                        mb-5
                                    ">

                                    <div class="
                                            w-8
                                            h-8
                                            rounded-lg
                                            bg-accent-light/20
                                            text-accent-dark
                                            flex
                                            items-center
                                            justify-center
                                        ">

                                        <Signpost :size="17" />

                                    </div>


                                    <div>

                                        <h3 class="
                                                font-semibold
                                                text-accent-dark
                                            ">
                                            Signalisation
                                        </h3>

                                        <p class="
                                                text-xs
                                                text-text-muted
                                            ">
                                            Équipements de signalisation
                                        </p>

                                    </div>

                                </div>


                                <div class="
                                        grid
                                        grid-cols-1
                                        sm:grid-cols-2
                                        lg:grid-cols-3
                                        gap-4
                                    ">

                                    <Input v-model.number="form.picto_ext" label="Picto extincteur" type="number"
                                        :min="0" :error="errors?.picto_ext?.[0]" />

                                    <Input v-model.number="form.picto_caf" label="Picto CAF" type="number" :min="0"
                                        :error="errors?.picto_caf?.[0]" />

                                    <Input v-model.number="form.picto_defense_de_fumer" label="Défense de fumer"
                                        type="number" :min="0" :error="errors?.picto_defense_de_fumer?.[0]" />

                                    <Input v-model.number="form.point_de_rasso" label="Point de rassemblement"
                                        type="number" :min="0" :error="errors?.point_de_rasso?.[0]" />

                                    <Input v-model.number="form.contact_d_urgence" label="Contact d'urgence"
                                        type="number" :min="0" :error="errors?.contact_d_urgence?.[0]" />

                                    <Input v-model.number="form.canne_d_enfutage" label="Canne d'enfûtage" type="number"
                                        :min="0" :error="errors?.canne_d_enfutage?.[0]" />

                                    <Input v-model.number="form.panneau_depotage_en_cours" label="Panneau dépotage"
                                        type="number" :min="0" :error="errors?.panneau_depotage_en_cours?.[0]" />

                                </div>

                            </section>


                            <!-- ================================================= -->
                            <!-- CONTROLES -->
                            <!-- ================================================= -->

                            <section class="
                                    border-t
                                    border-border
                                    pt-7
                                ">

                                <div class="
                                        flex
                                        items-center
                                        justify-between
                                        mb-5
                                    ">

                                    <div class="
                                            flex
                                            items-center
                                            gap-3
                                        ">

                                        <div class="
                                                w-8
                                                h-8
                                                rounded-lg
                                                bg-status-success/10
                                                text-status-success
                                                flex
                                                items-center
                                                justify-center
                                            ">

                                            <ShieldCheck :size="17" />

                                        </div>


                                        <div>

                                            <h3 class="
                                                    font-semibold
                                                    text-accent-dark
                                                ">
                                                Contrôles
                                            </h3>

                                            <p class="
                                                    text-xs
                                                    text-text-muted
                                                ">
                                                Vérifiez les éléments requis
                                            </p>

                                        </div>

                                    </div>


                                    <span class="
                                            text-sm
                                            font-semibold
                                            text-status-success
                                        ">
                                        {{ validatedControls }}/{{ totalControls }}
                                    </span>

                                </div>


                                <!-- CONTROLS -->

                                <div class="
                                        grid
                                        grid-cols-1
                                        md:grid-cols-2
                                        gap-3
                                    ">

                                    <label class="
                                            flex
                                            items-center
                                            justify-between
                                            gap-4
                                            p-4
                                            rounded-xl
                                            border
                                            border-border
                                            cursor-pointer
                                            transition
                                            hover:border-accent-medium
                                            hover:bg-accent-medium/5
                                        ">

                                        <div class="
                                                flex
                                                items-center
                                                gap-3
                                            ">

                                            <TriangleAlert :size="18" class="text-text-muted" />

                                            <span class="
                                                    text-sm
                                                    font-medium
                                                    text-text-primary
                                                ">
                                                Picto danger TGBT
                                            </span>

                                        </div>


                                        <input v-model="form.picto_danger_tgbt" type="checkbox" class="
                                                w-5
                                                h-5
                                                accent-status-success
                                                cursor-pointer
                                            " />

                                    </label>


                                    <label class="
                                            flex
                                            items-center
                                            justify-between
                                            gap-4
                                            p-4
                                            rounded-xl
                                            border
                                            border-border
                                            cursor-pointer
                                            transition
                                            hover:border-accent-medium
                                            hover:bg-accent-medium/5
                                        ">

                                        <div class="
                                                flex
                                                items-center
                                                gap-3
                                            ">

                                            <PanelsTopLeft :size="18" class="text-text-muted" />

                                            <span class="
                                                    text-sm
                                                    font-medium
                                                    text-text-primary
                                                ">
                                                Panneau EVENT
                                            </span>

                                        </div>


                                        <input v-model="form.panneau_event" type="checkbox" class="
                                                w-5
                                                h-5
                                                accent-status-success
                                                cursor-pointer
                                            " />

                                    </label>


                                    <label class="
                                            flex
                                            items-center
                                            justify-between
                                            gap-4
                                            p-4
                                            rounded-xl
                                            border
                                            border-border
                                            cursor-pointer
                                            transition
                                            hover:border-accent-medium
                                            hover:bg-accent-medium/5
                                        ">

                                        <div class="
                                                flex
                                                items-center
                                                gap-3
                                            ">

                                            <BookOpen :size="18" class="text-text-muted" />

                                            <span class="
                                                    text-sm
                                                    font-medium
                                                    text-text-primary
                                                ">
                                                Livret / fiche réflexe
                                            </span>

                                        </div>


                                        <input v-model="form.livret_fiche_reflexe" type="checkbox" class="
                                                w-5
                                                h-5
                                                accent-status-success
                                                cursor-pointer
                                            " />

                                    </label>


                                    <label class="
                                            flex
                                            items-center
                                            justify-between
                                            gap-4
                                            p-4
                                            rounded-xl
                                            border
                                            border-border
                                            cursor-pointer
                                            transition
                                            hover:border-accent-medium
                                            hover:bg-accent-medium/5
                                        ">

                                        <div class="
                                                flex
                                                items-center
                                                gap-3
                                            ">

                                            <ShieldAlert :size="18" class="text-text-muted" />

                                            <span class="
                                                    text-sm
                                                    font-medium
                                                    text-text-primary
                                                ">
                                                Politique HSSE
                                            </span>

                                        </div>


                                        <input v-model="form.politique" type="checkbox" class="
                                                w-5
                                                h-5
                                                accent-status-success
                                                cursor-pointer
                                            " />

                                    </label>

                                </div>

                            </section>

                        </div>


                        <!-- ================================================= -->
                        <!-- ACTIONS -->
                        <!-- ================================================= -->

                        <div class="
                                flex
                                flex-col-reverse
                                sm:flex-row
                                sm:justify-end
                                gap-3
                                px-6
                                py-5
                                border-t
                                border-border
                                bg-surface-alt
                            ">

                            <Button variant="outline" :left-icon="Trash2" :disabled="loading" @click="cancel">
                                Annuler
                            </Button>


                            <Button :left-icon="CheckCircle" :disabled="disabled" :loading="loading" @click="submit">
                                Enregistrer
                            </Button>

                        </div>

                    </div>

                </div>


                <!-- ==================================================== -->
                <!-- PREVIEW -->
                <!-- ==================================================== -->

                <aside class="
                        col-span-4
                        sticky
                        top-6
                    ">

                    <div class="
                            bg-white
                            border
                            border-slate-200
                            rounded-2xl
                            shadow-sm
                            overflow-hidden
                        ">

                        <!-- PREVIEW HEADER -->

                        <div class="
                                px-5
                                py-4
                                bg-accent-dark
                                text-white
                            ">

                            <div class="
                                    flex
                                    items-center
                                    gap-3
                                ">

                                <div class="
                                        w-9
                                        h-9
                                        rounded-lg
                                        bg-white/10
                                        flex
                                        items-center
                                        justify-center
                                    ">

                                    <ClipboardList :size="18" />

                                </div>


                                <div>

                                    <h3 class="
                                            font-semibold
                                            text-sm
                                            text-white
                                        ">
                                        Aperçu du relevé
                                    </h3>

                                    <p class="
                                            text-xs
                                            text-white/70
                                            mt-0.5
                                        ">
                                        Résumé en temps réel
                                    </p>

                                </div>

                            </div>

                        </div>


                        <!-- PREVIEW BODY -->

                        <div class="p-5 space-y-5">


                            <!-- SITE -->

                            <div>

                                <p class="
                                        text-[11px]
                                        uppercase
                                        tracking-wide
                                        text-text-muted
                                        font-medium
                                    ">
                                    Site
                                </p>

                                <div class="
                                        mt-2
                                        flex
                                        items-center
                                        gap-3
                                    ">

                                    <div class="
                                            w-9
                                            h-9
                                            rounded-lg
                                            bg-accent-dark/10
                                            flex
                                            items-center
                                            justify-center
                                            text-accent-dark
                                        ">

                                        <Signpost :size="17" />

                                    </div>


                                    <div>

                                        <p class="
                                                text-sm
                                                font-semibold
                                                text-text-primary
                                            ">
                                            {{ form.site_name || "Aucun site sélectionné" }}
                                        </p>

                                        <p class="
                                                text-xs
                                                text-text-muted
                                            ">
                                            {{ formattedDate }}
                                        </p>

                                    </div>

                                </div>

                            </div>


                            <!-- SEPARATOR -->

                            <div class="border-t border-border"></div>


                            <!-- STATISTICS -->

                            <div class="
                                    grid
                                    grid-cols-2
                                    gap-3
                                ">

                                <!-- TOTAL -->

                                <div class="
                                        rounded-xl
                                        bg-status-success/5
                                        border
                                        border-status-success/15
                                        p-4
                                    ">

                                    <div class="
                                            flex
                                            items-center
                                            justify-between
                                        ">

                                        <span class="
                                                text-xs
                                                text-text-muted
                                            ">
                                            Équipements
                                        </span>

                                        <Package :size="16" class="text-status-success" />

                                    </div>


                                    <p class="
                                            mt-2
                                            text-2xl
                                            font-bold
                                            text-status-success
                                        ">
                                        {{ totalEquipment }}
                                    </p>

                                </div>


                                <!-- CONTROLES -->

                                <div class="
                                        rounded-xl
                                        bg-accent-dark/5
                                        border
                                        border-accent-dark/10
                                        p-4
                                    ">

                                    <div class="
                                            flex
                                            items-center
                                            justify-between
                                        ">

                                        <span class="
                                                text-xs
                                                text-text-muted
                                            ">
                                            Contrôles
                                        </span>

                                        <ShieldCheck :size="16" class="text-accent-dark" />

                                    </div>


                                    <p class="
                                            mt-2
                                            text-2xl
                                            font-bold
                                            text-accent-dark
                                        ">
                                        {{ validatedControls }}/{{ totalControls }}
                                    </p>

                                </div>

                            </div>


                            <!-- PROGRESS -->

                            <div>

                                <div class="
                                        flex
                                        items-center
                                        justify-between
                                        mb-2
                                    ">

                                    <span class="
                                            text-xs
                                            font-medium
                                            text-text-secondary
                                        ">
                                        Contrôles validés
                                    </span>

                                    <span class="
                                            text-xs
                                            font-semibold
                                            text-status-success
                                        ">
                                        {{ controlProgress }}%
                                    </span>

                                </div>


                                <div class="
                                        h-2
                                        bg-border
                                        rounded-full
                                        overflow-hidden
                                    ">

                                    <div class="
                                            h-full
                                            bg-status-success
                                            rounded-full
                                            transition-all
                                            duration-300
                                        " :style="{
                                            width: `${controlProgress}%`
                                        }"></div>

                                </div>

                            </div>


                            <!-- SEPARATOR -->

                            <div class="border-t border-border"></div>


                            <!-- RESUME -->

                            <div>

                                <p class="
                                        text-xs
                                        font-semibold
                                        text-accent-dark
                                        mb-3
                                    ">
                                    État des contrôles
                                </p>


                                <div class="space-y-2">


                                    <!-- TGBT -->

                                    <div class="
                                            flex
                                            items-center
                                            justify-between
                                            text-xs
                                        ">

                                        <span class="text-text-secondary">
                                            Picto danger TGBT
                                        </span>

                                        <span v-if="form.picto_danger_tgbt" class="text-status-success font-semibold">
                                            ✓ Validé
                                        </span>

                                        <span v-else class="text-text-muted">
                                            Non vérifié
                                        </span>

                                    </div>


                                    <!-- EVENT -->

                                    <div class="
                                            flex
                                            items-center
                                            justify-between
                                            text-xs
                                        ">

                                        <span class="text-text-secondary">
                                            Panneau EVENT
                                        </span>

                                        <span v-if="form.panneau_event" class="text-status-success font-semibold">
                                            ✓ Validé
                                        </span>

                                        <span v-else class="text-text-muted">
                                            Non vérifié
                                        </span>

                                    </div>


                                    <!-- LIVRET -->

                                    <div class="
                                            flex
                                            items-center
                                            justify-between
                                            text-xs
                                        ">

                                        <span class="text-text-secondary">
                                            Livret / fiche réflexe
                                        </span>

                                        <span v-if="form.livret_fiche_reflexe"
                                            class="text-status-success font-semibold">
                                            ✓ Validé
                                        </span>

                                        <span v-else class="text-text-muted">
                                            Non vérifié
                                        </span>

                                    </div>


                                    <!-- POLITIQUE -->

                                    <div class="
                                            flex
                                            items-center
                                            justify-between
                                            text-xs
                                        ">

                                        <span class="text-text-secondary">
                                            Politique HSSE
                                        </span>

                                        <span v-if="form.politique" class="text-status-success font-semibold">
                                            ✓ Validé
                                        </span>

                                        <span v-else class="text-text-muted">
                                            Non vérifié
                                        </span>

                                    </div>

                                </div>

                            </div>


                            <!-- INFORMATION -->

                            <div class="
                                    flex
                                    gap-3
                                    p-3
                                    rounded-xl
                                    bg-accent-light/10
                                    border
                                    border-accent-light/20
                                ">

                                <Info :size="16" class="
                                        shrink-0
                                        text-accent-dark
                                        mt-0.5
                                    " />

                                <p class="
                                        text-[11px]
                                        leading-relaxed
                                        text-text-secondary
                                    ">
                                    Les informations affichées ici sont
                                    mises à jour automatiquement pendant
                                    la saisie du relevé.
                                </p>

                            </div>

                        </div>

                    </div>

                </aside>

            </div>

        </div>

    </div>

</template>