<script setup lang="ts">
    import { h, ref } from 'vue';
    import Header from '../../../components/shared/Header.vue';
    import type { EquipmentMonitoringType } from '../../../@types/EquipmentMonitoring.type.ts';
    import { EquipmentMonitoringData } from '../../../@data/EquipementMonitoring.data.ts';
    import type { contextMenuType } from '../../../@types/ContextMenu.type.ts';
    import ContextMenuUI from '../../../components/ui/ContextMenuUI.vue';
    import { Calendar, Download, Eye, FileUp, PlusCircle, XIcon } from '@lucide/vue';
    import Button from '../../../components/ui/Button.vue';
    import Input from '../../../components/ui/Input.vue';
    import Select from '../../../components/ui/Select.vue';
import { router } from '../../../router/index.ts';


    const right_sidebar = ref<{
        isOpen?: boolean,
        equipment?: EquipmentMonitoringType
    }>(
        {
            isOpen: false,
            equipment: undefined
        }
    )
    const context_menu = ref<{
        isOpen?: boolean,
        equipment?: EquipmentMonitoringType,
        context_menu?: contextMenuType

    }>({
        context_menu: undefined,
        isOpen: false, equipment: undefined
    })
    const headers = [
        "#",
        "Site",
        "P50",
        "P9",
        "P6",
        "CO₂",
        "Bac Métal",
        "Bac Plastique",
        "Pelles",
        "Poubelles 120L",
        "Poubelles 240L",
        "CAF",
        "Picto Extincteur",
        "Picto CAF",
        "Picto Défense de Fumer",
        "Point de Rassemblement",
        "Contact d'Urgence",
        "Canne d'Enfutage",
        "Panneau Dépotage",
        "Picto Danger TGBT",
        "Panneau Event",
        "Livret / Fiche Réflexe",
        "Créé le",

    ]
    const data = ref<EquipmentMonitoringType[]>(EquipmentMonitoringData)
</script>

<template>
    <div class="flex flex-col ">
        <Header title="Suivi du matériel" show-search />
        <div class="bg-white h-16 border-b border-gray-200 px-4 flex flex-row justify-between items-center"
            @click.self="right_sidebar.isOpen = false">

            <div class="flex flex-row items-center gap-x-1 ">
                <Button :left-icon="PlusCircle" @click="router.push({
                    name:'EQUIPMENT_MONITORING_NEW'
                })">Nouveau</Button>
                <Button :left-icon="FileUp" :variant="'icon'" :size="'sm'"></Button>
                <Button :left-icon="Download" :variant="'icon'" :size="'sm'"></Button>
            </div>
            <div class="flex flex-row items-centern gap-x-3">
                <Input :icon="h('span', 'SS')" class="min-w-60" placeholder="Sélectionner un site"/>
                <Input :icon="Calendar" class="min-w-60" placeholder="Sélectionner une date" />
            </div>
        </div>
        <div class="flex flex-row transition-all overflow-x-auto " @click.self="right_sidebar.isOpen = false">
            <div class="min-h-[calc(100vh-160px)]" @click.self="right_sidebar.isOpen = false"
                :class="right_sidebar ? 'w-9/12 max-w-9/12' : 'w-full max-w-full'">
                <table class="min-w-max ">
                    <thead>
                        <tr class="">
                            <th v-for="header in headers" :key="header">
                                {{ header }}
                            </th>
                        </tr>
                    </thead>
                    <tbody class="h-fit">
                        <tr @contextmenu.prevent="context_menu.context_menu = $event; context_menu.equipment = item; context_menu.isOpen = true"
                            v-for="(item, index) in data" :key="item.id" class="cursor-pointer" @click="
                                right_sidebar = {
                                    isOpen: true,
                                    equipment: item,
                                }
                                " :class="right_sidebar.equipment?.id == item.id ? 'bg-primary/10' : ''">
                            <td>
                                {{ index + 1 }}
                            </td>

                            <td>
                                {{ item.site_name.name }}
                            </td>

                            <td>
                                {{ item.p50 }}
                            </td>

                            <td>
                                {{ item.p9 }}
                            </td>

                            <td>
                                {{ item.p6 }}
                            </td>

                            <td>
                                {{ item.co2 }}
                            </td>

                            <td>
                                {{ item.bas_met }}
                            </td>

                            <td>
                                {{ item.bas_plast }}
                            </td>

                            <td>
                                {{ item.pelles }}
                            </td>

                            <td>
                                {{ item.poubelles_120l }}
                            </td>

                            <td>
                                {{ item.poubelle_240l }}
                            </td>

                            <td>
                                {{ item.caf }}
                            </td>

                            <td>
                                {{ item.picto_ext }}
                            </td>

                            <td>
                                {{ item.picto_caf }}
                            </td>

                            <td>
                                {{ item.picto_defense_de_fumer }}
                            </td>

                            <td>
                                {{ item.point_de_rasso }}
                            </td>

                            <td>
                                {{ item.contact_d_urgence }}
                            </td>

                            <td>
                                {{ item.canne_d_enfutage }}
                            </td>

                            <td>
                                {{ item.panneau_depotage_en_cours }}
                            </td>

                            <td>
                                <span :class="item.picto_danger_tgbt
                                    ? 'text-green-600'
                                    : 'text-red-600'
                                    ">
                                    {{
                                        item.picto_danger_tgbt
                                            ? 'Oui'
                                            : 'Non'
                                    }}
                                </span>
                            </td>

                            <td>
                                <span :class="item.panneau_event
                                    ? 'text-green-600'
                                    : 'text-red-600'
                                    ">
                                    {{
                                        item.panneau_event
                                            ? 'Oui'
                                            : 'Non'
                                    }}
                                </span>
                            </td>

                            <td>
                                <span :class="item.livret_fiche_reflexe
                                    ? 'text-green-600'
                                    : 'text-red-600'
                                    ">
                                    {{
                                        item.livret_fiche_reflexe
                                            ? 'Oui'
                                            : 'Non'
                                    }}
                                </span>
                            </td>

                            <td>
                                {{ item.created_at }}
                            </td>


                        </tr>
                    </tbody>
                </table>
                <ContextMenuUI v-model="context_menu.isOpen" :context-menu="context_menu.context_menu" :actions="[
                    {
                        label: 'Details',
                        icon: Eye,
                        onClick: () => { right_sidebar.isOpen = true; right_sidebar.equipment = context_menu.equipment }
                    }
                ]" />
            </div>
            <div class="
        
        shrink-0
        border-l
        border-gray-200
        scrollbar-hide
        bg-white
        p-5
        sticky
        top-0
        bottom-0
        left-9/12
        right-0
        h-screen
        overflow-y-auto
    " :class="right_sidebar.isOpen ? 'w-3/12' : 'w-0'" v-if="right_sidebar.isOpen">
                <!-- HEADER -->

                <div class="
            flex
            items-center
            justify-between
            border-b
            border-gray-200
            pb-4
        ">
                    <div>
                        <h5>
                            Détails du matériel
                        </h5>

                        <p class="
                    text-sm
                    text-gray-500
                ">
                            {{
                                right_sidebar.equipment?.site_name.name
                            }}
                        </p>
                    </div>

                    <button class="
                rounded-lg
                p-2
                hover:bg-slate-100
            " @click="
                right_sidebar.isOpen = false
                ">
                        <XIcon />
                    </button>
                </div>

                <!-- KPI -->

                <div class="
            mt-5
            grid
            grid-cols-2
            gap-3
        ">
                    <div class="
                rounded-xl
                bg-slate-50
                p-4
            ">
                        <p class="
                    text-xs
                    text-gray-500
                ">
                            P50
                        </p>

                        <h4>
                            {{
                                right_sidebar.equipment?.p50
                            }}
                        </h4>
                    </div>

                    <div class="
                rounded-xl
                bg-slate-50
                p-4
            ">
                        <p class="
                    text-xs
                    text-gray-500
                ">
                            CO₂
                        </p>

                        <h4>
                            {{
                                right_sidebar.equipment?.co2
                            }}
                        </h4>
                    </div>
                </div>

                <!-- EXTINCTEURS -->

                <div class="
            mt-6
            border-t
            border-gray-200
            pt-5
        ">
                    <h6 class="mb-4">
                        Extincteurs
                    </h6>

                    <div class="
                grid
                grid-cols-2
                gap-3
            ">
                        <div>
                            <span class="
                        text-xs
                        text-gray-500
                    ">
                                P50
                            </span>

                            <p>
                                {{
                                    right_sidebar.equipment?.p50
                                }}
                            </p>
                        </div>

                        <div>
                            <span class="
                        text-xs
                        text-gray-500
                    ">
                                P9
                            </span>

                            <p>
                                {{
                                    right_sidebar.equipment?.p9
                                }}
                            </p>
                        </div>

                        <div>
                            <span class="
                        text-xs
                        text-gray-500
                    ">
                                P6
                            </span>

                            <p>
                                {{
                                    right_sidebar.equipment?.p6
                                }}
                            </p>
                        </div>

                        <div>
                            <span class="
                        text-xs
                        text-gray-500
                    ">
                                CO₂
                            </span>

                            <p>
                                {{
                                    right_sidebar.equipment?.co2
                                }}
                            </p>
                        </div>
                    </div>
                </div>

                <!-- MATERIEL -->

                <div class="
            mt-6
            border-t
            border-gray-200
            pt-5
        ">
                    <h6 class="mb-4">
                        Matériel
                    </h6>

                    <div class="
                flex
                flex-col
                gap-4
            ">
                        <div class="
                    flex
                    justify-between
                ">
                            <span>Pelles</span>

                            <strong>
                                {{
                                    right_sidebar.equipment?.pelles
                                }}
                            </strong>
                        </div>

                        <div class="
                    flex
                    justify-between
                ">
                            <span>
                                Bac métal
                            </span>

                            <strong>
                                {{
                                    right_sidebar.equipment?.bas_met
                                }}
                            </strong>
                        </div>

                        <div class="
                    flex
                    justify-between
                ">
                            <span>
                                Bac plastique
                            </span>

                            <strong>
                                {{
                                    right_sidebar.equipment?.bas_plast
                                }}
                            </strong>
                        </div>

                        <div class="
                    flex
                    justify-between
                ">
                            <span>
                                Poubelle 120L
                            </span>

                            <strong>
                                {{
                                    right_sidebar.equipment
                                        ?.poubelles_120l
                                }}
                            </strong>
                        </div>

                        <div class="
                    flex
                    justify-between
                ">
                            <span>
                                Poubelle 240L
                            </span>

                            <strong>
                                {{
                                    right_sidebar.equipment
                                        ?.poubelle_240l
                                }}
                            </strong>
                        </div>
                    </div>
                </div>

                <!-- SIGNALISATION -->

                <div class="
            mt-6
            border-t
            border-gray-200
            pt-5
        ">
                    <h6 class="mb-4">
                        Signalisation
                    </h6>

                    <div class="
                flex
                flex-wrap
                gap-2
            ">
                        <span class="
                    rounded-full
                    bg-primary/10
                    px-3
                    py-1
                    text-xs
                ">
                            Ext :
                            {{
                                right_sidebar.equipment?.picto_ext
                            }}
                        </span>

                        <span class="
                    rounded-full
                    bg-primary/10
                    px-3
                    py-1
                    text-xs
                ">
                            CAF :
                            {{
                                right_sidebar.equipment?.picto_caf
                            }}
                        </span>

                        <span class="
                    rounded-full
                    bg-primary/10
                    px-3
                    py-1
                    text-xs
                ">
                            Défense fumer :
                            {{
                                right_sidebar.equipment
                                    ?.picto_defense_de_fumer
                            }}
                        </span>
                    </div>
                </div>

                <!-- CONTROLES -->

                <div class="
            mt-6
            border-t
            border-gray-200
            pt-5
        ">
                    <h6 class="mb-4">
                        Contrôles
                    </h6>

                    <div class="
                flex
                flex-col
                gap-4
            ">
                        <div class="
                    flex
                    justify-between
                ">
                            <span>
                                Danger TGBT
                            </span>

                            <span :class="right_sidebar.equipment?.picto_danger_tgbt
                                ? 'text-green-600'
                                : 'text-red-600'
                                ">
                                {{
                                    right_sidebar.equipment?.picto_danger_tgbt
                                        ? "Oui"
                                        : "Non"
                                }}
                            </span>
                        </div>

                        <div class="
                    flex
                    justify-between
                ">
                            <span>
                                Panneau Event
                            </span>

                            <span :class="right_sidebar.equipment?.panneau_event
                                ? 'text-green-600'
                                : 'text-red-600'
                                ">
                                {{
                                    right_sidebar.equipment?.panneau_event
                                        ? "Oui"
                                        : "Non"
                                }}
                            </span>
                        </div>

                        <div class="
                    flex
                    justify-between
                ">
                            <span>
                                Livret réflexe
                            </span>

                            <span :class="right_sidebar.equipment?.livret_fiche_reflexe
                                ? 'text-green-600'
                                : 'text-red-600'
                                ">
                                {{
                                    right_sidebar.equipment?.livret_fiche_reflexe
                                        ? "Oui"
                                        : "Non"
                                }}
                            </span>
                        </div>

                        <div class="
                    flex
                    justify-between
                ">
                            <span>
                                Politique HSSE
                            </span>

                            <span :class="right_sidebar.equipment?.politique
                                ? 'text-green-600'
                                : 'text-red-600'
                                ">
                                {{
                                    right_sidebar.equipment?.politique
                                        ? "Oui"
                                        : "Non"
                                }}
                            </span>
                        </div>
                    </div>
                </div>

                <!-- DATE -->

                <div class="
            mt-6
            border-t
            border-gray-200
            pt-5
        ">
                    <span class="
                text-xs
                text-gray-500
            ">
                        Dernier relevé
                    </span>

                    <p class="mt-1">
                        {{
                            right_sidebar.equipment?.created_at
                        }}
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>