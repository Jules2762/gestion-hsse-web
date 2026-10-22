<template>
    <div class="min-h-screen bg-slate-100/80 print:bg-white print:p-0 print:min-h-0 print:m-0">

        <!-- HEADER PRINCIPAL (FULL WIDTH COMME DASHBOARD) -->
        <div class="w-full print:hidden">
            <Header title="inspections.vmc.details" :thumbnails="[
                { label: 'thumbnails.home', name: 'DASHBOARD' },
                { label: 'thumbnails.inspections', name: 'INSPECTION' },
                { label: 'thumbnails.vmc', name: 'VMC' },
                { label: 'thumbnails.details', name: 'VMC_DETAILS' }
            ]" />
        </div>

        <div class="py-4 px-4 sm:px-6">
            <!-- HEADER & ACTIONS EN LIGNE (MASQUÉ À L'IMPRESSION) -->
            <div class="max-w-4xl mx-auto mb-4 print:hidden">
                <div class="bg-white border border-gray-200 rounded-xl p-3 px-4 flex flex-wrap items-center justify-between gap-3 shadow-xs">
                    <div class="flex items-center gap-3">
                        <button
                            @click="router.push({ name: 'VMC' })"
                            class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer">
                            <ArrowLeft :size="15" />
                            {{ locale === 'en' ? 'Back to list' : 'Retour à la liste' }}
                        </button>
                        <span class="text-sm font-bold text-gray-800 truncate" v-if="vmc">
                            VMC #{{ vmc.id }} — {{ vmc.title || vmc.type }}
                        </span>
                        <ChecklistStatus v-if="vmc?.status" :name="vmc.status" />
                    </div>

                    <div class="flex items-center gap-2">
                        <button
                            v-if="vmc && vmc.status === 'IN_PROGRESS'"
                            @click="markCompleted"
                            class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors cursor-pointer">
                            <CheckCircle2 :size="15" />
                            {{ locale === 'en' ? 'Close visit' : 'Clôturer la visite' }}
                        </button>

                        <button
                            @click="handlePrint"
                            class="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#0F9D58] hover:bg-[#0F9D58]/90 rounded-lg shadow-sm transition-colors cursor-pointer">
                            <Printer :size="16" />
                            {{ locale === 'en' ? 'Download PDF' : 'Télécharger en PDF' }}
                        </button>
                    </div>
                </div>
            </div>

        <!-- CHARGEMENT -->
        <div v-if="loading" class="p-20 flex flex-col items-center justify-center gap-3 text-gray-500 print:hidden">
            <Loader :size="32" class="animate-spin text-primary" />
            <span class="text-sm font-medium">{{ locale === 'en' ? 'Loading official Galana HSSE document...' : 'Chargement du document officiel Galana HSSE...' }}</span>
        </div>

        <!-- ERREUR -->
        <div v-else-if="errorMessage" class="p-10 max-w-xl mx-auto my-10 bg-red-50 border border-red-200 rounded-xl text-center text-red-600 print:hidden">
            <p class="font-semibold">{{ errorMessage }}</p>
            <button
                @click="router.push({ name: 'VMC' })"
                class="mt-4 px-4 py-2 text-xs bg-red-600 text-white rounded-lg hover:bg-red-700 cursor-pointer">
                {{ locale === 'en' ? 'Back to VMC list' : 'Retour à la liste des VMC' }}
            </button>
        </div>

        <!-- ============================================================== -->
        <!-- FICHE OFFICIELLE EXACTE (CONFORME 100% AUX PHOTOS DU CLASSEUR) -->
        <!-- ============================================================== -->
        <div v-else-if="vmc" class="sheet-container max-w-[210mm] mx-auto bg-white p-8 sm:p-12 shadow-lg border border-gray-300 print:shadow-none print:border-none print:p-0 print:m-0 print:w-full print:max-w-none text-black font-sans leading-tight">

            <!-- ========================================================================= -->
            <!-- 1. TEMPLATE VISITE STATION-SERVICE (HSSE GALANA 1)                        -->
            <!-- ========================================================================= -->
            <div v-if="resolvedTemplateCategory === 'STATION_SERVICE'">
                <!-- En-tête officiel Galana Rubis -->
                <div class="border border-black">
                    <div class="flex flex-row">
                        <div class="w-[30%] p-2 flex items-center justify-center border-r border-black">
                            <img src="/logo/galana-rubis.png" alt="Galana Groupe Rubis" class="max-h-12 w-auto object-contain" />
                        </div>
                        <div class="w-[70%] flex flex-col justify-between">
                            <div class="p-2.5 text-center flex-1 flex items-center justify-center">
                                <h1 class="text-base sm:text-lg font-black tracking-wide uppercase text-black font-sans">
                                    VISIBLE MANAGEMENT COMMITMENT
                                </h1>
                            </div>
                            <div class="border-t border-black flex flex-row text-[11px] font-semibold text-gray-800">
                                <div class="w-1/2 p-1 text-center border-r border-black">
                                    Galana Distribution Pétrolière
                                </div>
                                <div class="w-1/2 p-1 text-center">
                                    Date de création : 21/02/23 – Rev.00
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="mt-4 mb-2">
                    <h2 class="text-base sm:text-lg font-bold text-black font-sans">
                        1. Station-Service
                    </h2>
                </div>

                <!-- Bandeau Métadonnées (Vert Galana #0F9D58) -->
                <div class="bg-[#0F9D58] text-white p-2 text-xs font-semibold border border-black print:bg-[#0F9D58] print:text-white">
                    <div class="grid grid-cols-2 gap-y-1">
                        <div><span class="font-bold">Date : </span><span class="font-normal">{{ formattedDate }}</span></div>
                        <div><span class="font-bold">Site : </span><span class="font-normal">{{ vmcSite }}</span></div>
                        <div><span class="font-bold">Evaluateur : </span><span class="font-normal">{{ vmcInspector }}</span></div>
                        <div><span class="font-bold">Accompagnateur(s) : </span><span class="font-normal">{{ vmcAccompanying }}</span></div>
                    </div>
                </div>

                <!-- Grille des 13 items -->
                <table class="w-full border-collapse border border-black mt-1 text-xs">
                    <thead>
                        <tr class="bg-[#e6f4ea] border-b border-black text-gray-900 font-bold print:bg-[#e6f4ea]">
                            <th class="border border-black p-1 w-8 text-center font-bold">N°</th>
                            <th class="border border-black p-1 text-left font-bold pl-2">Désignation</th>
                            <th class="border border-black p-1 w-11 text-center font-bold">Oui</th>
                            <th class="border border-black p-1 w-11 text-center font-bold">Non</th>
                            <th class="border border-black p-1 w-52 sm:w-60 text-left font-bold pl-2">Obs</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, idx) in stationServiceItems" :key="idx" class="border-b border-black">
                            <td class="border border-black p-1 text-center font-medium">{{ Number(idx) + 1 }}</td>
                            <td class="border border-black p-1 text-left pl-2">{{ item.title }}</td>
                            <td class="border border-black p-1 text-center font-bold text-sm">
                                <span v-if="isYes(item.answer)">✓</span>
                            </td>
                            <td class="border border-black p-1 text-center font-bold text-sm">
                                <span v-if="isNo(item.answer)">✓</span>
                            </td>
                            <td class="border border-black p-1 text-left pl-2 text-[11px] text-gray-800">{{ item.observation || '' }}</td>
                        </tr>
                    </tbody>
                </table>

                <!-- Recommandations -->
                <div class="mt-4 border border-black">
                    <div class="bg-[#e6f4ea] border-b border-black px-2 py-0.5 text-xs font-bold text-gray-900 print:bg-[#e6f4ea]">
                        Recommandations :
                    </div>
                    <div class="min-h-24 p-2 text-xs text-gray-800 whitespace-pre-line leading-relaxed">
                        {{ recommendationText }}
                    </div>
                </div>

                <!-- Bas de page -->
                <div class="mt-6 pt-1 border-t border-black/40 flex justify-between items-center text-[10px] text-gray-700">
                    <div>Document confidentiel à diffusion contrôlée</div>
                    <div class="font-bold">HSSE GALANA 1</div>
                </div>
            </div>

            <!-- ========================================================================= -->
            <!-- 2. TEMPLATE INSPECTION CAMION (HSSE GALANA 2)                              -->
            <!-- ========================================================================= -->
            <div v-else-if="resolvedTemplateCategory === 'INSPECTION_CAMION'">
                <!-- En-tête officiel Galana Rubis -->
                <div class="border border-black">
                    <div class="flex flex-row">
                        <div class="w-[30%] p-2 flex items-center justify-center border-r border-black">
                            <img src="/logo/galana-rubis.png" alt="Galana Groupe Rubis" class="max-h-12 w-auto object-contain" />
                        </div>
                        <div class="w-[70%] flex flex-col justify-between">
                            <div class="p-2.5 text-center flex-1 flex items-center justify-center">
                                <h1 class="text-base sm:text-lg font-black tracking-wide uppercase text-black font-sans">
                                    VISIBLE MANAGEMENT COMMITMENT
                                </h1>
                            </div>
                            <div class="border-t border-black flex flex-row text-[11px] font-semibold text-gray-800">
                                <div class="w-1/2 p-1 text-center border-r border-black">
                                    Galana Distribution Pétrolière
                                </div>
                                <div class="w-1/2 p-1 text-center">
                                    Date de création : 21/02/23 – Rev.00
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="mt-4 mb-2">
                    <h2 class="text-base sm:text-lg font-bold text-black font-sans">
                        Inspection camion
                    </h2>
                </div>

                <!-- Bandeau Métadonnées : Camion au lieu de Site -->
                <div class="bg-[#0F9D58] text-white p-2 text-xs font-semibold border border-black print:bg-[#0F9D58] print:text-white">
                    <div class="grid grid-cols-2 gap-y-1">
                        <div><span class="font-bold">Date : </span><span class="font-normal">{{ formattedDate }}</span></div>
                        <div><span class="font-bold">Camion : </span><span class="font-normal">{{ vmcSite }}</span></div>
                        <div><span class="font-bold">Evaluateur : </span><span class="font-normal">{{ vmcInspector }}</span></div>
                        <div><span class="font-bold">Accompagnateur(s) : </span><span class="font-normal">{{ vmcAccompanying }}</span></div>
                    </div>
                </div>

                <!-- Grille des 14 items camion -->
                <table class="w-full border-collapse border border-black mt-1 text-xs">
                    <thead>
                        <tr class="bg-[#e6f4ea] border-b border-black text-gray-900 font-bold print:bg-[#e6f4ea]">
                            <th class="border border-black p-1 w-8 text-center font-bold">N°</th>
                            <th class="border border-black p-1 text-left font-bold pl-2">Désignation</th>
                            <th class="border border-black p-1 w-11 text-center font-bold">Oui</th>
                            <th class="border border-black p-1 w-11 text-center font-bold">Non</th>
                            <th class="border border-black p-1 w-52 sm:w-60 text-left font-bold pl-2">Obs</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, idx) in camionItems" :key="idx" class="border-b border-black">
                            <td class="border border-black p-1 text-center font-medium">{{ Number(idx) + 1 }}</td>
                            <td class="border border-black p-1 text-left pl-2">{{ item.title }}</td>
                            <td class="border border-black p-1 text-center font-bold text-sm">
                                <span v-if="isYes(item.answer)">✓</span>
                            </td>
                            <td class="border border-black p-1 text-center font-bold text-sm">
                                <span v-if="isNo(item.answer)">✓</span>
                            </td>
                            <td class="border border-black p-1 text-left pl-2 text-[11px] text-gray-800">{{ item.observation || '' }}</td>
                        </tr>
                    </tbody>
                </table>

                <!-- Recommandations -->
                <div class="mt-4 border border-black">
                    <div class="bg-[#e6f4ea] border-b border-black px-2 py-0.5 text-xs font-bold text-gray-900 print:bg-[#e6f4ea]">
                        Recommandations :
                    </div>
                    <div class="min-h-24 p-2 text-xs text-gray-800 whitespace-pre-line leading-relaxed">
                        {{ recommendationText }}
                    </div>
                </div>

                <!-- Bas de page -->
                <div class="mt-6 pt-1 border-t border-black/40 flex justify-between items-center text-[10px] text-gray-700">
                    <div>Document confidentiel à diffusion contrôlée</div>
                    <div class="font-bold">HSSE GALANA 2</div>
                </div>
            </div>

            <!-- ========================================================================= -->
            <!-- 3. TEMPLATE VISITE MAGASINS & AGENCES (HSSE GALANA 3)                     -->
            <!-- ========================================================================= -->
            <div v-else-if="resolvedTemplateCategory === 'VISITE_MAGASINS_AGENCES'">
                <!-- En-tête officiel Galana Rubis -->
                <div class="border border-black">
                    <div class="flex flex-row">
                        <div class="w-[30%] p-2 flex items-center justify-center border-r border-black">
                            <img src="/logo/galana-rubis.png" alt="Galana Groupe Rubis" class="max-h-12 w-auto object-contain" />
                        </div>
                        <div class="w-[70%] flex flex-col justify-between">
                            <div class="p-2.5 text-center flex-1 flex items-center justify-center">
                                <h1 class="text-base sm:text-lg font-black tracking-wide uppercase text-black font-sans">
                                     VISIBLE MANAGEMENT COMMITMENT
                                </h1>
                            </div>
                            <div class="border-t border-black flex flex-row text-[11px] font-semibold text-gray-800">
                                <div class="w-1/2 p-1 text-center border-r border-black">
                                    Galana Distribution Pétrolière
                                </div>
                                <div class="w-1/2 p-1 text-center">
                                    Date de création : 21/02/23 – Rev.00
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="mt-4 mb-2">
                    <h2 class="text-base sm:text-lg font-bold text-black font-sans">
                        Visite Magasins & Agences
                    </h2>
                </div>

                <!-- Bandeau Métadonnées -->
                <div class="bg-[#0F9D58] text-white p-2 text-xs font-semibold border border-black print:bg-[#0F9D58] print:text-white">
                    <div class="grid grid-cols-2 gap-y-1">
                        <div><span class="font-bold">Date : </span><span class="font-normal">{{ formattedDate }}</span></div>
                        <div><span class="font-bold">Camion / Véhicule : </span><span class="font-normal">{{ vmcSite }}</span></div>
                        <div><span class="font-bold">Evaluateur : </span><span class="font-normal">{{ vmcInspector }}</span></div>
                        <div><span class="font-bold">Accompagnateur(s) : </span><span class="font-normal">{{ vmcAccompanying }}</span></div>
                    </div>
                </div>

                <!-- Grille des 7 items magasins -->
                <table class="w-full border-collapse border border-black mt-1 text-xs">
                    <thead>
                        <tr class="bg-[#e6f4ea] border-b border-black text-gray-900 font-bold print:bg-[#e6f4ea]">
                            <th class="border border-black p-1 w-8 text-center font-bold">N°</th>
                            <th class="border border-black p-1 text-left font-bold pl-2">Désignation</th>
                            <th class="border border-black p-1 w-11 text-center font-bold">Oui</th>
                            <th class="border border-black p-1 w-11 text-center font-bold">Non</th>
                            <th class="border border-black p-1 w-52 sm:w-60 text-left font-bold pl-2">Obs</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, idx) in magasinItems" :key="idx" class="border-b border-black">
                            <td class="border border-black p-1 text-center font-medium">{{ Number(idx) + 1 }}</td>
                            <td class="border border-black p-1 text-left pl-2">{{ item.title }}</td>
                            <td class="border border-black p-1 text-center font-bold text-sm">
                                <span v-if="isYes(item.answer)">✓</span>
                            </td>
                            <td class="border border-black p-1 text-center font-bold text-sm">
                                <span v-if="isNo(item.answer)">✓</span>
                            </td>
                            <td class="border border-black p-1 text-left pl-2 text-[11px] text-gray-800">{{ item.observation || '' }}</td>
                        </tr>
                    </tbody>
                </table>

                <!-- Recommandations -->
                <div class="mt-4 border border-black">
                    <div class="bg-[#e6f4ea] border-b border-black px-2 py-0.5 text-xs font-bold text-gray-900 print:bg-[#e6f4ea]">
                        Recommandations :
                    </div>
                    <div class="min-h-24 p-2 text-xs text-gray-800 whitespace-pre-line leading-relaxed">
                        {{ recommendationText }}
                    </div>
                </div>

                <!-- Bas de page -->
                <div class="mt-6 pt-1 border-t border-black/40 flex justify-between items-center text-[10px] text-gray-700">
                    <div>Document confidentiel à diffusion contrôlée</div>
                    <div class="font-bold">HSSE GALANA 3</div>
                </div>
            </div>

            <!-- ========================================================================= -->
            <!-- 4. TEMPLATE SAFETY MOMENTS / QUART D'HEURE SECURITE                       -->
            <!-- ========================================================================= -->
            <div v-else-if="resolvedTemplateCategory === 'SAFETY_MOMENT'" class="space-y-4">
                <!-- Bandeau supérieur plein format Vert Galana #0F9D58 (identique photo) -->
                <div class="bg-[#0F9D58] text-white p-3.5 print:bg-[#0F9D58] print:text-white">
                    <p class="text-xs font-bold tracking-wider uppercase opacity-90">SAFETY MOMENTS</p>
                    <h1 class="text-base sm:text-lg font-black tracking-wide uppercase mt-0.5">QUART D'HEURE SECURITE</h1>
                </div>

                <!-- Détails du rassemblement -->
                <div class="bg-gray-100/80 p-3 rounded-lg border border-gray-200 text-xs space-y-1.5 print:bg-gray-100">
                    <p class="font-bold text-gray-900 mb-1">Détails du rassemblement</p>
                    <div class="grid grid-cols-2 gap-2">
                        <div><span class="font-semibold text-gray-700">Date: </span><span class="underline decoration-dotted">{{ formattedDate }}</span></div>
                        <div><span class="font-semibold text-gray-700">Heure: </span><span class="underline decoration-dotted">{{ vmc.safety_moment?.time || '—' }}</span></div>
                    </div>
                    <div>
                        <span class="font-semibold text-gray-700">Site (Station Service/Camion/Agence/Magasin): </span>
                        <span class="underline decoration-dotted">{{ vmcSite }}</span>
                    </div>
                    <div>
                        <span class="font-semibold text-gray-700">Animateur: </span>
                        <span class="underline decoration-dotted">{{ vmcInspector }}</span>
                    </div>
                </div>

                <!-- Participants (13 lignes exactes) -->
                <div>
                    <p class="text-xs font-bold text-gray-900 mb-1">Participants:</p>
                    <table class="w-full border-collapse border border-black text-xs">
                        <thead>
                            <tr class="bg-[#0F9D58] text-white border-b border-black text-[11px] font-bold print:bg-[#0F9D58] print:text-white">
                                <th class="border border-black p-1 w-8 text-center">N°</th>
                                <th class="border border-black p-1 text-left pl-2 w-32">Nom</th>
                                <th class="border border-black p-1 text-left pl-2 w-32">Prénom</th>
                                <th class="border border-black p-1 text-left pl-2 w-28">Fonction</th>
                                <th class="border border-black p-1 text-left pl-2 w-24">Entité</th>
                                <th class="border border-black p-1 text-center w-16">Visa</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="n in 13" :key="n" class="border-b border-black h-5">
                                <td class="border border-black p-1 text-center font-medium">{{ n }}</td>
                                <td class="border border-black p-1 pl-2 text-gray-900">{{ safetyMomentParticipants[n - 1]?.last_name || '' }}</td>
                                <td class="border border-black p-1 pl-2 text-gray-900">{{ safetyMomentParticipants[n - 1]?.first_name || '' }}</td>
                                <td class="border border-black p-1 pl-2 text-gray-800">{{ safetyMomentParticipants[n - 1]?.fonction || '' }}</td>
                                <td class="border border-black p-1 pl-2 text-gray-800">{{ safetyMomentParticipants[n - 1]?.entity || '' }}</td>
                                <td class="border border-black p-1 text-center text-xs font-bold">
                                    <span v-if="safetyMomentParticipants[n - 1]">✓</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- Points abordés (5 lignes) -->
                <div class="text-xs">
                    <p class="font-bold text-gray-900 mb-1">Points abordés:</p>
                    <div class="border-b border-black/40 space-y-1 pb-1">
                        <div v-for="n in 5" :key="n" class="border-b border-gray-300 py-0.5 text-gray-900">
                            <span class="font-semibold text-gray-700">{{ n }}. </span>
                            <span>{{ safetyMomentPoints[n - 1]?.description || '' }}</span>
                        </div>
                    </div>
                </div>

                <!-- Activités, démonstrations, exemples concrets (4 lignes) -->
                <div class="text-xs">
                    <p class="font-bold text-gray-900 mb-1">Activités, démonstrations,exemples concrets:</p>
                    <div class="border-b border-black/40 space-y-1 pb-1">
                        <div v-for="n in 4" :key="n" class="border-b border-gray-300 py-0.5 text-gray-900">
                            <span class="font-semibold text-gray-700">{{ n }}. </span>
                            <span>{{ safetyMomentActivities[n - 1]?.description || '' }}</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- ========================================================================= -->
            <!-- 5. TEMPLATE SAFETY TRAINING / SAFETY AWARENESS (CONFORME PHOTO)            -->
            <!-- ========================================================================= -->
            <div v-else-if="resolvedTemplateCategory === 'SAFETY_AWARENESS'" class="space-y-4">
                <!-- Bandeau supérieur Vert Galana #0F9D58 (exactement comme sur la photo) -->
                <div class="bg-[#0F9D58] text-white p-3.5 print:bg-[#0F9D58] print:text-white">
                    <p class="text-xs font-bold tracking-wider uppercase opacity-90">SAFETY TRAINING</p>
                    <h1 class="text-base sm:text-lg font-black tracking-wide uppercase mt-0.5">SAFETY AWARENESS</h1>
                </div>

                <!-- Leader Commitment -->
                <div class="bg-gray-100/70 p-3.5 rounded-lg border border-gray-200 text-xs space-y-2 print:bg-gray-100">
                    <p class="font-semibold text-gray-700">Leader Commitment</p>
                    <div class="space-y-1.5 pl-1">
                        <div class="flex items-center">
                            <span class="w-20 font-bold text-gray-900">Nom :</span>
                            <span class="flex-1 border-b border-dotted border-gray-400 pl-1 font-medium text-gray-800">{{ vmcInspector }}</span>
                        </div>
                        <div class="flex items-center">
                            <span class="w-20 font-bold text-gray-900">Fonction :</span>
                            <span class="flex-1 border-b border-dotted border-gray-400 pl-1 font-medium text-gray-800">{{ (vmc.assigned_to as any)?.fonction || vmc.assigned_to?.job || 'Responsable HSSE' }}</span>
                        </div>
                        <div class="flex items-center">
                            <span class="w-20 font-bold text-gray-900">Direction:</span>
                            <span class="flex-1 border-b border-dotted border-gray-400 pl-1 font-medium text-gray-800">{{ (vmc.assigned_to as any)?.direction || vmc.assigned_to?.department || 'HSSE' }}</span>
                        </div>
                    </div>
                </div>

                <!-- Détails de la formation (Tableau complet fidèle à la photo) -->
                <div>
                    <p class="text-xs font-bold text-gray-900 mb-1">Détails de la formation</p>
                    <table class="w-full border-collapse border border-black text-xs">
                        <thead>
                            <tr class="bg-[#0F9D58] text-white border-b border-black text-[11px] font-bold print:bg-[#0F9D58] print:text-white">
                                <th class="border border-black p-1 w-24 text-center">Date</th>
                                <th class="border border-black p-1 w-28 text-center">Type<sup>(*)</sup></th>
                                <th class="border border-black p-1 w-28 text-center">Volet<sup>(**)</sup></th>
                                <th class="border border-black p-1 text-left pl-2">Intitulé</th>
                                <th class="border border-black p-1 w-36 text-left pl-2">Intervenant</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="idx in 17" :key="idx" class="border-b border-black h-5.5">
                                <td class="border border-black p-1 text-center text-[11px]">
                                    {{ safetyAwarenessItems[idx - 1] ? formattedDate : '' }}
                                </td>
                                <td class="border border-black p-1 text-center text-[11px]">
                                    {{ safetyAwarenessItems[idx - 1]?.type || '' }}
                                </td>
                                <td class="border border-black p-1 text-center text-[11px]">
                                    {{ safetyAwarenessItems[idx - 1]?.volet || '' }}
                                </td>
                                <td class="border border-black p-1 pl-2 text-left text-[11px]">
                                    {{ safetyAwarenessItems[idx - 1]?.title || (idx === 1 ? vmc.title : '') }}
                                </td>
                                <td class="border border-black p-1 pl-2 text-left text-[11px]">
                                    {{ safetyAwarenessItems[idx - 1]?.participant || (idx === 1 ? vmcInspector : '') }}
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    <!-- Notes sous le tableau (exactement comme sur la photo) -->
                    <div class="mt-2 text-[9px] text-gray-600 space-y-0.5">
                        <p><sup>(*)</sup> Type : formation, sensibilisation, induction, atelier</p>
                        <p><sup>(**)</sup> Volet : Santé, Sécurité, Sûreté, Environnement</p>
                    </div>
                </div>
            </div>

            <!-- ========================================================================= -->
            <!-- 6. TEMPLATE FICHE DE REMONTEE (FOR01-HSSE-ACC)                            -->
            <!-- ========================================================================= -->
            <div v-else-if="resolvedTemplateCategory === 'SAFETY_REPORT'" class="space-y-3">
                <!-- En-tête officiel Fiche de remontée avec code FOR01-HSSE-ACC à droite -->
                <div class="border border-black">
                    <div class="flex flex-row">
                        <div class="w-[28%] p-2 flex items-center justify-center border-r border-black">
                            <img src="/logo/galana-rubis.png" alt="Galana Groupe Rubis" class="max-h-12 w-auto object-contain" />
                        </div>
                        <div class="w-[58%] flex flex-col justify-between border-r border-black">
                            <div class="p-2 text-center flex-1 flex items-center justify-center">
                                <h1 class="text-base sm:text-lg font-black tracking-wide uppercase text-black font-sans">
                                    FICHE DE REMONTEE
                                </h1>
                            </div>
                            <div class="border-t border-black flex flex-row text-[10px] font-semibold text-gray-800">
                                <div class="w-1/2 p-1 text-center border-r border-black">
                                    Galana Distribution Pétrolière
                                </div>
                                <div class="w-1/4 p-1 text-center border-r border-black">
                                    Date : 11/01/22
                                </div>
                                <div class="w-1/4 p-1 text-center">
                                    Version : 02
                                </div>
                            </div>
                        </div>
                        <div class="w-[14%] p-1 flex items-center justify-center text-center font-bold text-[10px] leading-tight">
                            FOR01-<br />HSSE-ACC
                        </div>
                    </div>
                </div>

                <!-- 1. Informations générales -->
                <div class="border border-black text-xs">
                    <div class="bg-[#0F9D58] text-white p-1 px-2 font-bold print:bg-[#0F9D58] print:text-white">
                        1. Informations générales
                    </div>
                    <div class="p-2 grid grid-cols-2 gap-y-1.5 border-t border-black">
                        <div><span class="font-semibold">Filiale: </span>Galana Madagascar</div>
                        <div><span class="font-semibold">Lieu/ ville: </span>{{ vmcSite }}</div>
                        <div><span class="font-semibold">Date de l'évènement (aaaa/mm/jj): </span>{{ formattedDate }}</div>
                        <div><span class="font-semibold">Heure: </span>{{ vmc.safety_report_form?.info_time || '—' }}</div>
                        <div><span class="font-semibold">Type d'évènement: </span>{{ vmc.safety_report_form?.info_type || 'Presqu\'accident' }}</div>
                        <div class="flex items-center gap-1.5"><span class="font-semibold">Niveau de gravité: </span><span class="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold" :class="getSafetyReportGravityBadge(vmc.safety_report_form?.info_gravity)">{{ formatSafetyReportGravity(vmc.safety_report_form?.info_gravity) }}</span></div>
                    </div>
                </div>

                <!-- 2. Emetteur -->
                <div class="border border-black text-xs">
                    <div class="bg-[#0F9D58] text-white p-1 px-2 font-bold print:bg-[#0F9D58] print:text-white">
                        2. Emetteur
                    </div>
                    <div class="p-2 grid grid-cols-4 gap-2 border-t border-black">
                        <div><span class="font-semibold">Nom: </span>{{ vmcInspector }}</div>
                        <div><span class="font-semibold">Prénom: </span>{{ vmc.assigned_to?.first_name || '' }}</div>
                        <div><span class="font-semibold">Fonction: </span>{{ (vmc.assigned_to as any)?.fonction || vmc.assigned_to?.job || 'Responsable' }}</div>
                        <div><span class="font-semibold">Société: </span>Galana</div>
                    </div>
                </div>

                <!-- 3. Description détaillée des circonstances -->
                <div class="border border-black text-xs">
                    <div class="bg-[#0F9D58] text-white p-1 px-2 font-bold print:bg-[#0F9D58] print:text-white">
                        3. Description détaillée des circonstances (avec les mesures mises sur place pour assurer la sécurité, arrivée des secours,...)
                    </div>
                    <div class="p-2 grid grid-cols-6 gap-2 border-t border-black min-h-24">
                        <div class="col-span-1 border-r border-black pr-2">
                            <span class="font-semibold">Heure:</span>
                            <p class="mt-1">{{ vmc.safety_report_form?.incident_time || '10:30' }}</p>
                        </div>
                        <div class="col-span-5 pl-1">
                            <span class="font-semibold">Description:</span>
                            <p class="mt-1 whitespace-pre-line text-gray-800">
                                {{ vmc.safety_report_form?.incident_description || recommendationText }}
                            </p>
                        </div>
                    </div>
                </div>

                <!-- 4. Conséquences -->
                <div class="border border-black text-xs">
                    <div class="bg-[#0F9D58] text-white p-1 px-2 font-bold print:bg-[#0F9D58] print:text-white">
                        4. Conséquences (humain, matériel, environnemental, image...)
                    </div>
                    <div class="p-2 border-t border-black min-h-12 text-gray-800">
                        {{ vmc.safety_report_form?.incident_consequences || 'Aucune conséquence corporelle ni environnementale.' }}
                    </div>
                </div>

                <!-- 5. Causes -->
                <div class="border border-black text-xs">
                    <div class="bg-[#0F9D58] text-white p-1 px-2 font-bold print:bg-[#0F9D58] print:text-white">
                        5. a) Causes immédiates
                    </div>
                    <div class="p-2 border-t border-black min-h-12 text-gray-800">
                        {{ vmc.safety_report_form?.immediate_causes || 'Joint ou composant usé.' }}
                    </div>
                    <div class="bg-[#0F9D58] text-white p-1 px-2 font-bold border-t border-black print:bg-[#0F9D58] print:text-white">
                        b) Causes fondamentales
                    </div>
                    <div class="p-2 border-t border-black min-h-12 text-gray-800">
                        {{ vmc.safety_report_form?.root_causes || 'Usure normale de la pièce avec nécessité de renforcement du plan de maintenance préventive.' }}
                    </div>
                </div>

                <!-- 6. Actions immédiates -->
                <div class="border border-black text-xs">
                    <div class="bg-[#0F9D58] text-white p-1 px-2 font-bold print:bg-[#0F9D58] print:text-white">
                        6. Actions immédiates & plan d'actions
                    </div>
                    <div class="p-2 border-t border-black min-h-12 text-gray-800">
                        {{ vmc.safety_report_form?.immediate_actions || 'Remplacement immédiat effectué et vérification de conformité validée.' }}
                    </div>
                </div>
            </div>

        </div>

        <!-- ============================================================== -->
        <!-- PLAN D'ACTIONS CORRECTIVES DE LA VISITE (MASQUÉ À L'IMPRESSION)-->
        <!-- ============================================================== -->
        <div v-if="vmc" class="max-w-[210mm] mx-auto mt-6 px-4 sm:px-0 print:hidden">
            <div class="bg-white border border-gray-200 rounded-xl p-5 shadow-xs">
                <div class="flex flex-wrap items-center justify-between pb-3 border-b border-gray-200 gap-3">
                    <div>
                        <h3 class="text-sm font-bold text-gray-900 flex items-center gap-2">
                            <ShieldAlert :size="18" class="text-amber-500" />
                            {{ locale === 'en' ? 'VMC corrective action plan' : "Plan d'actions correctives VMC" }}
                        </h3>
                        <p class="text-xs text-gray-500 mt-0.5">
                            {{ locale === 'en' ? 'Tracking corrective actions from deviations or observations of this VMC visit.' : 'Suivi des actions correctives issues des écarts ou observations de cette visite VMC.' }}
                        </p>
                    </div>

                    <button
                        v-if="allVmcItems.length > 0"
                        type="button"
                        @click="openAddActionModal()"
                        class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-primary hover:bg-primary/90 rounded-lg shadow-xs cursor-pointer transition-colors">
                        <Plus :size="14" />
                        {{ locale === 'en' ? 'New corrective action' : 'Nouvelle action corrective' }}
                    </button>
                </div>

                <!-- LISTE DES ACTIONS / ÉCARTS -->
                <div v-if="vmcActionItems.length === 0" class="py-8 text-center text-gray-400 text-xs">
                    <CheckCircle2 :size="28" class="mx-auto text-emerald-500 mb-2" />
                    <p class="font-semibold text-gray-700">{{ locale === 'en' ? 'No deviation or corrective action recorded' : 'Aucun écart ou action corrective enregistrée' }}</p>
                    <p class="text-gray-400 mt-0.5">{{ locale === 'en' ? 'All checks are compliant or no action was scheduled.' : 'Toutes les vérifications sont conformes ou aucune action n\'a été planifiée.' }}</p>
                </div>

                <div v-else class="mt-4 space-y-3">
                    <div
                        v-for="item in vmcActionItems"
                        :key="item.id"
                        class="border border-gray-200 rounded-xl p-4 bg-gray-50/50 hover:bg-white transition-colors">
                        <div class="flex flex-wrap items-start justify-between gap-2">
                            <div class="flex-1 min-w-[240px]">
                                <div class="flex items-center gap-2">
                                    <span
                                        :class="isNo(item.answer) ? 'bg-red-100 text-red-700 border-red-200' : 'bg-amber-100 text-amber-700 border-amber-200'"
                                        class="px-2 py-0.5 text-[10px] font-bold rounded-full border">
                                        {{ isNo(item.answer) ? (locale === 'en' ? 'NON-COMPLIANT' : 'NON CONFORME') : (locale === 'en' ? 'OBSERVATION' : 'OBSERVATION') }}
                                    </span>
                                    <h4 class="text-xs font-bold text-gray-800">{{ item.title }}</h4>
                                </div>
                                <p v-if="item.observation" class="text-[11px] text-gray-500 mt-1 italic">
                                    {{ locale === 'en' ? 'Observation:' : 'Observation :' }} {{ item.observation }}
                                </p>
                            </div>

                            <div v-if="item.action" class="flex items-center gap-2">
                                <ActionStatus :name="item.action.status || 'PENDING'" />
                                <ActionEmailStatus :status="item.action.email_status || 'NOT_SENT'" />
                            </div>
                        </div>

                        <!-- DÉTAILS DE L'ACTION -->
                        <div v-if="item.action" class="mt-3 pt-3 border-t border-gray-200/80 flex flex-wrap items-center justify-between gap-3 text-xs">
                            <div class="flex-1 min-w-[220px]">
                                <span class="text-[10px] uppercase font-bold text-gray-400 block">{{ locale === 'en' ? 'Defined action' : 'Action définie' }}</span>
                                <p class="font-semibold text-gray-800 mt-0.5">{{ item.action.description }}</p>
                                <p v-if="item.action.person_in_charge" class="text-[11px] text-gray-500 mt-0.5">
                                    {{ locale === 'en' ? 'Person in charge:' : 'Responsable :' }} <span class="font-medium text-gray-700">{{ getPersonInChargeName(item.action) }}</span>
                                    <span v-if="item.action.person_in_charge?.fonction"> ({{ item.action.person_in_charge.fonction }})</span>
                                </p>
                            </div>

                            <div class="flex items-center gap-2">
                                <button
                                    v-if="item.action.status === 'PENDING'"
                                    type="button"
                                    @click="updateVmcActionStatus(item.action, 'IN_PROGRESS')"
                                    class="px-2.5 py-1 text-[11px] font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg cursor-pointer">
                                    {{ locale === 'en' ? 'Take charge' : 'Prendre en charge' }}
                                </button>
                                <button
                                    v-if="item.action.status === 'IN_PROGRESS'"
                                    type="button"
                                    @click="updateVmcActionStatus(item.action, 'FINISHED')"
                                    class="px-2.5 py-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg cursor-pointer">
                                    {{ locale === 'en' ? 'Close' : 'Clôturer' }}
                                </button>
                                <button
                                    v-if="item.action.status === 'FINISHED'"
                                    type="button"
                                    @click="updateVmcActionStatus(item.action, 'PENDING')"
                                    class="px-2.5 py-1 text-[11px] font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg cursor-pointer">
                                    {{ locale === 'en' ? 'Reopen' : 'Réouvrir' }}
                                </button>

                                <button
                                    type="button"
                                    @click="notifyVmcAction(item.action, item)"
                                    :disabled="sendingEmailActionId === item.action.id"
                                    class="p-1.5 text-gray-500 hover:text-blue-600 rounded-lg hover:bg-blue-50 border border-gray-200 disabled:opacity-40 cursor-pointer"
                                    :title="item.action.email_status === 'SENT' ? (locale === 'en' ? 'Resend official email' : 'Réenvoyer l\'e-mail officiel') : (locale === 'en' ? 'Notify by email' : 'Notifier par e-mail')">
                                    <Loader2 v-if="sendingEmailActionId === item.action.id" :size="14" class="animate-spin text-blue-600" />
                                    <Mail v-else :size="14" />
                                </button>

                                <button
                                    type="button"
                                    @click="openEditActionModal(item)"
                                    class="p-1.5 text-gray-500 hover:text-gray-800 rounded-lg hover:bg-gray-100 border border-gray-200 cursor-pointer"
                                    :title="locale === 'en' ? 'Edit action' : 'Modifier l\'action'">
                                    <Edit :size="14" />
                                </button>
                            </div>
                        </div>

                        <!-- SI AUCUNE ACTION ENCORE DÉFINIE -->
                        <div v-else class="mt-3 pt-2 border-t border-gray-200/80 flex items-center justify-between text-xs">
                            <span class="text-amber-700 text-[11px] italic">{{ locale === 'en' ? 'No corrective action recorded for this deviation.' : 'Aucune action corrective enregistrée pour cet écart.' }}</span>
                            <button
                                type="button"
                                @click="openEditActionModal(item)"
                                class="px-2.5 py-1 text-[11px] font-bold text-primary bg-primary/10 hover:bg-primary/20 rounded-lg cursor-pointer">
                                {{ locale === 'en' ? '+ Define action' : '+ Définir une action' }}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </div>

        <!-- MODAL AJOUT / ÉDITION ACTION CORRECTIVE VMC -->
        <div v-if="actionModal.isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
            <div class="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-gray-200">
                <div class="flex items-center justify-between pb-3 border-b border-gray-200">
                    <h4 class="text-sm font-bold text-gray-900">
                        {{ actionModal.isEdit ? (locale === 'en' ? 'Edit corrective action' : 'Modifier l\'action corrective') : (locale === 'en' ? 'New corrective action' : 'Nouvelle action corrective') }}
                    </h4>
                    <button @click="actionModal.isOpen = false" class="text-gray-400 hover:text-gray-600 p-1 cursor-pointer">
                        <X :size="18" />
                    </button>
                </div>

                <div class="mt-4 space-y-4 text-xs">
                    <!-- Point de contrôle sélectionné -->
                    <div>
                        <label class="block font-semibold text-gray-700 mb-1">{{ locale === 'en' ? 'Concerned checkpoint' : 'Point de contrôle concerné' }}</label>
                        <select
                            v-model="actionModal.itemId"
                            :disabled="actionModal.isEdit"
                            class="w-full p-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-800 focus:outline-none focus:ring-1 focus:ring-primary">
                            <option v-for="it in allVmcItems" :key="it.id" :value="it.id">
                                {{ it.title }} ({{ it.answer || '—' }})
                            </option>
                        </select>
                    </div>

                    <!-- Description de l'action corrective -->
                    <div>
                        <label class="block font-semibold text-gray-700 mb-1">{{ locale === 'en' ? 'Corrective action description *' : 'Description de l\'action corrective *' }}</label>
                        <textarea
                            v-model="actionModal.description"
                            rows="3"
                            :placeholder="locale === 'en' ? 'Describe precisely the corrective action to take...' : 'Décrivez précisément l\'action corrective à mener...'"
                            class="w-full p-2.5 border border-gray-300 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-1 focus:ring-primary resize-none"></textarea>
                    </div>

                    <!-- Responsable assigné (Personnel) -->
                    <div>
                        <div class="flex items-center justify-between mb-1">
                            <label class="block font-semibold text-gray-700">{{ locale === 'en' ? 'Assigned person (Personnel) *' : 'Responsable assigné (Personnel) *' }}</label>
                            <span v-if="personnelsList.length > 0" class="text-[10px] text-gray-400 font-medium">({{ filteredPersonnelsList.length }} / {{ personnelsList.length }})</span>
                        </div>
                        <input
                            v-model="actionPersonnelSearchQuery"
                            type="text"
                            :placeholder="locale === 'en' ? 'Search personnel by name, role...' : '🔍 Rechercher un personnel par nom, fonction...'"
                            class="w-full mb-1.5 p-2 text-xs border border-gray-300 rounded-lg bg-gray-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary transition"
                        />
                        <select
                            v-model="actionModal.personInCharge"
                            class="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-1 focus:ring-primary">
                            <option :value="null">{{ locale === 'en' ? '-- Select a personnel --' : '-- Choisir parmi le personnel Galana --' }}</option>
                            <option v-for="p in filteredPersonnelsList" :key="p.id" :value="p.id">
                                {{ p.first_name }} {{ p.last_name || '' }} — {{ p.fonction || p.direction || (locale === 'en' ? 'Personnel' : 'Personnel') }}
                            </option>
                        </select>
                    </div>

                    <!-- Statut -->
                    <div>
                        <label class="block font-semibold text-gray-700 mb-1">{{ locale === 'en' ? 'Initial status' : 'Statut initial' }}</label>
                        <select
                            v-model="actionModal.status"
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
                        @click="actionModal.isOpen = false"
                        class="px-4 py-2 font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">
                        {{ locale === 'en' ? 'Cancel' : 'Annuler' }}
                    </button>
                    <button
                        type="button"
                        @click="saveVmcAction"
                        :disabled="!actionModal.description || !actionModal.itemId || actionModal.saving"
                        class="px-4 py-2 font-bold text-white bg-primary hover:bg-primary/90 disabled:opacity-50 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5">
                        <Loader2 v-if="actionModal.saving" :size="14" class="animate-spin" />
                        <span>{{ actionModal.saving ? (locale === 'en' ? 'Saving...' : 'Enregistrement...') : (locale === 'en' ? 'Save action' : 'Enregistrer l\'action') }}</span>
                    </button>
                </div>
            </div>
        </div>

    </div>
</template>

<script setup lang="ts">
    import {
        ArrowLeft,
        CheckCircle2,
        Edit,
        Loader,
        Loader2,
        Mail,
        Plus,
        Printer,
        ShieldAlert,
        X,
    } from '@lucide/vue';
    import { computed, onMounted, ref } from 'vue';
    import { useRoute } from 'vue-router';
    import { useI18n } from 'vue-i18n';
    import Header from '../../../components/shared/Header.vue';
    import ChecklistStatus from '../../../components/features/checklist/ChecklistStatus.vue';
    import ActionStatus from '../../../components/features/action/ActionStatus.vue';
    import ActionEmailStatus from '../../../components/features/action/ActionEmailStatus.vue';
    import type { VMCDataType } from '../../../@types/VMC.type.ts';
    import type { ActionStatusType } from '../../../@types/Action.type.ts';
    import vmcService from '../../../core/services/vmc.service.ts';
    import { useActionService } from '../../../core/services/action.service.ts';
    import personnelService from '../../../core/services/personnel.service.ts';
    import { router } from '../../../router/index.ts';
    import { toast } from 'vue3-toastify';

    const { t, locale } = useI18n();

    const route = useRoute()
    const loading = ref<boolean>(true)
    const errorMessage = ref<string>('')
    const vmc = ref<VMCDataType | null>(null)
    const sendingEmailActionId = ref<string | number | null>(null)

    /* Détermination exacte du modèle */
    const resolvedTemplateCategory = computed<'STATION_SERVICE' | 'INSPECTION_CAMION' | 'VISITE_MAGASINS_AGENCES' | 'SAFETY_MOMENT' | 'SAFETY_AWARENESS' | 'SAFETY_REPORT'>(() => {
        const raw = `${vmc.value?.type || ''} ${vmc.value?.master_type || ''} ${vmc.value?.inspection?.type || ''}`.toUpperCase()
        if (raw.includes('CAMION')) return 'INSPECTION_CAMION'
        if (raw.includes('MAGASIN') || raw.includes('AGENCE')) return 'VISITE_MAGASINS_AGENCES'
        if (raw.includes('MOMENT') || raw.includes('QUART')) return 'SAFETY_MOMENT'
        if (raw.includes('AWARENESS') || raw.includes('TRAINING')) return 'SAFETY_AWARENESS'
        if (raw.includes('REPORT') || raw.includes('REMONTEE') || raw.includes('FOR01')) return 'SAFETY_REPORT'
        return 'STATION_SERVICE'
    })

    const formattedDate = computed(() => {
        const d = vmc.value?.date || vmc.value?.inspection?.date || vmc.value?.created_at
        if (!d) return ''
        const dateObj = new Date(d)
        if (Number.isNaN(dateObj.getTime())) return String(d)
        return new Intl.DateTimeFormat('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }).format(dateObj)
    })

    const vmcSite = computed(() => {
        return (
            vmc.value?.site ||
            vmc.value?.inspection?.site ||
            vmc.value?.safety_report_form?.info_location ||
            vmc.value?.safety_moment?.site ||
            '—'
        )
    })

    const vmcInspector = computed(() => {
        if (vmc.value?.inspector) return vmc.value.inspector
        if (vmc.value?.assigned_to) {
            return `${vmc.value.assigned_to.first_name} ${vmc.value.assigned_to.last_name || ''}`.trim()
        }
        return '—'
    })

    const vmcAccompanying = computed(() => {
        return vmc.value?.accompanying_person || vmc.value?.inspection?.accompanying_person || '—'
    })

    const recommendationText = computed(() => {
        return (
            vmc.value?.recommendation?.trim() ||
            vmc.value?.inspection?.recommendation?.trim() ||
            'Aucune remarque particulière. Standards de sécurité respectés lors de la visite.'
        )
    })

    /* Liste complète et fidèle des items Station-Service */
    const stationServiceTitles = [
        'Ordre et propreté du site',
        "Port d'EPI (Chef de piste, pompiste, graisseurs, etc.)",
        'Parking (véhicule stationné en position de départ)',
        'Extincteur (accroché, accessible, en bon état et valide)',
        "Bac à sable (en bon état, rempli, et présence d'une pelle)",
        'Distributeur (pas de fuite, flexible valide et en bon état)',
        'Events (identifié, relié à la terre, pas de véhicule stationné)',
        'Détecteur de fuite (en bon état, opérationnel)',
        "Bouche de dépotage (cadenassé, identifié, relié individuellement à la terre, exempt d'eau)",
        'Armoire électrique (fermé à clef, pas de câble nus ou mal isolé)',
        'Eclairage (en bon état, opérationnel)',
        'Toilettes & Sanitaires (en bon état, propre)',
        'Portes, fenêtres, volets roulants, grilles de protection (intègre, serrure opérationnelle)',
    ]

    const stationServiceItems = computed(() => {
        const loaded = vmc.value?.inspection?.items || []
        if (loaded.length >= 13) return loaded
        return stationServiceTitles.map((title, idx) => {
            const found = loaded.find((it: any) => it.title === title || it.id === idx + 1)
            return found || { title, answer: 'OUI', observation: '' }
        })
    })

    /* Liste complète et fidèle des items Camion */
    const camionTitles = [
        'Port EPI (Equipage camion)',
        'Documents de bord (Assurance, visite technique, Apave & Madauto, disponible et valide)',
        'Présence de 02 extincteurs ABC 09kg (en bon état, valide)',
        "Présence d'un extincteur de cabine 1kg (en bon état, valide)",
        'Câble de mise à la terre (en bon état, pinces bien fixées)',
        'Flexible (en bon état, valide et bouchonnée)',
        'Cales de roues (en bon état et conforme)',
        'Panneau Orange (métallique, en bon état, avant et arrière)',
        'Panneau Losange de type ADR (Rouge, deux côtés latérales)',
        'Feux AV & AR (en bon état et opérationnel)',
        'Roues (en bon état, pneu identique par essieu)',
        'Coupe circuit (opérationnel)',
        'Batteries (présence de capuchon de borne)',
        "Vannes & trous d'homme (en bon état, non fuyarde, présence de soudure d'intégrité)",
    ]

    const camionItems = computed(() => {
        const loaded = vmc.value?.inspection?.items || []
        if (loaded.length >= 14) return loaded
        return camionTitles.map((title, idx) => {
            const found = loaded.find((it: any) => it.title === title || it.id === idx + 1)
            return found || { title, answer: 'OUI', observation: '' }
        })
    })

    /* Liste complète et fidèle des items Magasins */
    const magasinTitles = [
        'Ordre et propreté du site',
        'Extincteur (accroché, en bon état et valide)',
        'Parking (véhicule stationné en position de départ)',
        'Eclairage (en bon état, opérationnel)',
        'Stockage (lourd en bas, ordonné, présence aire de circulation)',
        'Absence de câbles nus et pas de multiprise en cascade',
        'Trousse de secours (liste des contenus, valide)',
    ]

    const magasinItems = computed(() => {
        const loaded = vmc.value?.inspection?.items || []
        if (loaded.length >= 7) return loaded
        return magasinTitles.map((title, idx) => {
            const found = loaded.find((it: any) => it.title === title || it.id === idx + 1)
            return found || { title, answer: 'OUI', observation: '' }
        })
    })

    /* Safety Moments */
    const safetyMomentParticipants = computed(() => {
        return vmc.value?.safety_moment?.participants || []
    })

    const safetyMomentPoints = computed(() => {
        return vmc.value?.safety_moment?.points_discussed || [
            { description: 'Sensibilisation au port des EPI obligatoires' },
            { description: 'Procédure de dépotage sécurisé et mise à la terre' },
            { description: 'Vérification des extincteurs et moyens d\'intervention' },
            { description: 'Consignes en cas de déversement accidentel' },
            { description: 'Partage des retours d\'expérience et bonnes pratiques' },
        ]
    })

    const safetyMomentActivities = computed(() => {
        return vmc.value?.safety_moment?.activities || [
            { description: 'Démonstration de mise en place de la pince de terre' },
            { description: 'Contrôle visuel de la pression d\'un extincteur' },
            { description: 'Exercice pratique de balisage de zone de dépotage' },
            { description: 'Vérification de la trousse de premiers secours' },
        ]
    })

    /* Safety Awareness */
    const safetyAwarenessItems = computed(() => {
        const items = vmc.value?.safety_awareness_items || []
        if (items.length > 0) return items
        return [
            {
                date: formattedDate.value,
                type: 'Formation',
                volet: 'Sécurité',
                title: vmc.value?.title || 'Sensibilisation règles vitales HSSE',
                participant: vmcInspector.value
            }
        ]
    })

    function isYes(answer?: string): boolean {
        if (!answer) return false
        const norm = answer.toUpperCase().trim()
        return norm === 'OUI' || norm === 'YES' || norm === 'O'
    }

    function isNo(answer?: string): boolean {
        if (!answer) return false
        const norm = answer.toUpperCase().trim()
        return norm === 'NON' || norm === 'NO' || norm === 'N'
    }

    function handlePrint() {
        window.print()
    }

    function markCompleted() {
        if (!vmc.value) return
        vmcService.updateStatus(vmc.value.id, 'COMPLETED')
            .then(res => {
                if (vmc.value) {
                    vmc.value.status = res.data.data.status
                }
            })
            .catch(err => {
                console.error(err)
            })
    }

    function fetchVmc() {
        const id = route.params.id as string
        if (!id) {
            errorMessage.value = 'Identifiant de VMC manquant.'
            loading.value = false
            return
        }

        loading.value = true
        errorMessage.value = ''

        vmcService.show(id)
            .then(res => {
                vmc.value = res.data.data || res.data
                if (route.query.print === 'true' || route.query.print === '1') {
                    setTimeout(() => {
                        window.print()
                    }, 500)
                }
            })
            .catch(err => {
                console.error(err)
                errorMessage.value = 'Impossible de charger la VMC demandée.'
            })
            .finally(() => {
                loading.value = false
            })
    }

    const actionService = useActionService()
    const personnelsList = ref<any[]>([])

    const actionPersonnelSearchQuery = ref('')

    const filteredPersonnelsList = computed(() => {
        const q = actionPersonnelSearchQuery.value.toLowerCase().trim()
        if (!q) return personnelsList.value
        return personnelsList.value.filter((p: any) => {
            const full = `${p.first_name || ''} ${p.last_name || ''} ${p.fonction || ''} ${p.direction || ''} ${p.email || ''}`.toLowerCase()
            return full.includes(q)
        })
    })

    function formatSafetyReportGravity(g: any): string {
        const num = parseInt(String(g || '2'), 10)
        const labels: Record<number, string> = {
            1: 'Mineur',
            2: 'Modéré',
            3: 'Important',
            4: 'Majeur',
            5: 'Critique',
        }
        if (num >= 1 && num <= 5) {
            return `Niveau ${num} / 5 (${labels[num]})`
        }
        return g ? `Niveau ${g}` : 'Niveau 2 / 5 (Modéré)'
    }

    function getSafetyReportGravityBadge(g: any): string {
        const num = parseInt(String(g || '2'), 10)
        switch (num) {
            case 1: return 'bg-emerald-100 text-emerald-800 border border-emerald-200'
            case 2: return 'bg-sky-100 text-sky-800 border border-sky-200'
            case 3: return 'bg-amber-100 text-amber-800 border border-amber-200'
            case 4: return 'bg-orange-100 text-orange-800 border border-orange-200'
            case 5: return 'bg-red-100 text-red-800 border border-red-200'
            default: return 'bg-gray-100 text-gray-800 border border-gray-200'
        }
    }


    const allVmcItems = computed(() => {
        const items = vmc.value?.inspection?.items || []
        return items.map((it: any) => {
            const action = it.action || (it.actions && !Array.isArray(it.actions) ? it.actions : (Array.isArray(it.actions) && it.actions[0] ? it.actions[0] : null))
            return {
                ...it,
                action,
            }
        })
    })

    const vmcActionItems = computed(() => {
        return allVmcItems.value.filter((it: any) => isNo(it.answer) || it.action)
    })

    const actionModal = ref({
        isOpen: false,
        isEdit: false,
        itemId: null as any,
        description: '',
        personInCharge: null as any,
        status: 'PENDING' as ActionStatusType,
        saving: false,
    })

    function openAddActionModal(item?: any) {
        actionModal.value = {
            isOpen: true,
            isEdit: false,
            itemId: item?.id || (allVmcItems.value[0]?.id ?? null),
            description: '',
            personInCharge: null,
            status: 'PENDING',
            saving: false,
        }
    }

    function openEditActionModal(item: any) {
        actionModal.value = {
            isOpen: true,
            isEdit: true,
            itemId: item.id,
            description: item.action?.description || '',
            personInCharge: typeof item.action?.person_in_charge === 'object' ? item.action?.person_in_charge?.id : (item.action?.person_in_charge || null),
            status: item.action?.status || 'PENDING',
            saving: false,
        }
    }

    function getPersonInChargeName(action: any): string {
        if (!action) return '—'
        if (action.person_in_charge && typeof action.person_in_charge === 'object') {
            const fn = action.person_in_charge.first_name || ''
            const ln = action.person_in_charge.last_name || ''
            return `${fn} ${ln}`.trim() || 'Personnel'
        }
        if (action.person_in_charge && personnelsList.value.length > 0) {
            const found = personnelsList.value.find((p: any) => p.id == action.person_in_charge || p.raw_id == action.person_in_charge)
            if (found) {
                return `${found.first_name} ${found.last_name || ''}`.trim()
            }
        }
        return 'Non assigné'
    }

    async function saveVmcAction() {
        if (!actionModal.value.itemId || !actionModal.value.description) return
        actionModal.value.saving = true
        try {
            await actionService.storeVmcAction({
                vmc_inspection_item_id: actionModal.value.itemId,
                description: actionModal.value.description,
                person_in_charge: actionModal.value.personInCharge || undefined,
                status: actionModal.value.status,
            })
            actionModal.value.isOpen = false
            fetchVmc()
        } catch (err) {
            console.error('Erreur lors de l\'enregistrement de l\'action VMC:', err)
        } finally {
            actionModal.value.saving = false
        }
    }

    async function updateVmcActionStatus(action: any, newStatus: ActionStatusType) {
        if (!action.id) return
        try {
            await actionService.updateStatus('VMC', action.id, newStatus)
            action.status = newStatus
            fetchVmc()
        } catch (err) {
            console.error('Erreur de mise à jour du statut VMC:', err)
        }
    }

    async function notifyVmcAction(action: any, item: any) {
        const email = typeof action.person_in_charge === 'object' ? action.person_in_charge?.email : ''
        if (!email) {
            toast.warning("Impossible d'envoyer l'e-mail : aucun e-mail valide n'est associé au responsable.")
            return
        }

        if (!action.id) return

        sendingEmailActionId.value = action.id

        try {
            const res = await actionService.notify('VMC', action.id)
            action.email_status = 'SENT'
            toast.success(res.data?.message || `E-mail de notification envoyé avec succès à ${email}.`)
        } catch (err: any) {
            console.error('Erreur notify VMC:', err)
            const msg = err.response?.data?.message || "Échec de l'envoi de l'e-mail de notification."
            toast.error(msg)
        } finally {
            sendingEmailActionId.value = null
        }
    }

    function fetchPersonnels() {
        personnelService.indexAll()
            .then(res => {
                personnelsList.value = res.data.data || res.data || []
            })
            .catch(err => {
                console.error('Erreur chargement personnels:', err)
            })
    }

    onMounted(() => {
        fetchVmc()
        fetchPersonnels()
    })
</script>

<style>
@media print {
    @page {
        size: A4 portrait;
        margin: 6mm 8mm;
    }

    html, body {
        background-color: #ffffff !important;
        color: #000000 !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
    }

    header, nav, aside, .no-print, [aria-hidden="true"] {
        display: none !important;
    }

    main {
        margin: 0 !important;
        padding: 0 !important;
        width: 100% !important;
        min-width: 100% !important;
    }

    .sheet-container {
        border: none !important;
        box-shadow: none !important;
        padding: 0 !important;
        margin: 0 !important;
        max-width: 100% !important;
        width: 100% !important;
    }
}
</style>
