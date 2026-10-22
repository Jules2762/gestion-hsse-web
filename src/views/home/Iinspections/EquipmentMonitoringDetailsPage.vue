<template>
    <div class="min-h-screen bg-slate-100/80 print:bg-white print:p-0 print:min-h-0 print:m-0">
        <!-- HEADER PRINCIPAL (FULL WIDTH COMME DASHBOARD) -->
        <div class="w-full print:hidden">
            <Header title="inspections.equipment-monitoring.details" :thumbnails="[
                { label: 'thumbnails.home', name: 'DASHBOARD' },
                { label: 'thumbnails.inspections', name: 'INSPECTION' },
                { label: 'thumbnails.equipment-monitoring', name: 'EQUIPMENT_MONITORING' },
                { label: 'thumbnails.details', name: 'EQUIPMENT_MONITORING_DETAILS' }
            ]" />
        </div>

        <div class="py-4 px-4 sm:px-6 print:p-0 print:m-0">
            <!-- BARRE D'ACTIONS RETOUR & IMPRESSION (MASQUÉ À L'IMPRESSION) -->
            <div class="max-w-5xl mx-auto mb-4 print:hidden">
                <div class="bg-white border border-gray-200 rounded-xl p-3 px-4 flex flex-wrap items-center justify-between gap-3 shadow-xs">
                    <div class="flex items-center gap-3">
                        <button
                            @click="router.push({ name: 'EQUIPMENT_MONITORING' })"
                            class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition cursor-pointer"
                        >
                            <ArrowLeft :size="15" />
                            {{ locale === 'en' ? 'Back to list' : 'Retour à la liste' }}
                        </button>
                        <span class="text-sm font-bold text-gray-800 truncate" v-if="equipment">
                            {{ locale === 'en' ? 'Sheet #' : 'Fiche n°' }} {{ equipment.id }} — {{ getSiteNameText(equipment.site_name) }}
                        </span>
                        <ChecklistStatus v-if="equipment" :name="(equipment.status as any) || 'COMPLETED'" />
                        <span
                            v-if="equipment"
                            class="px-2.5 py-0.5 rounded-full text-[11px] font-bold inline-block"
                            :class="badgeColor(equipment.status, equipment.conformity_rate)"
                        >
                            {{ formatStatus(equipment.status, equipment.conformity_rate) }}
                        </span>
                    </div>

                    <div class="flex items-center gap-2">
                        <button
                            v-if="equipment?.id"
                            @click="router.push({ name: 'EQUIPMENT_MONITORING_UPDATE', params: { id: equipment.id } })"
                            class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition cursor-pointer"
                        >
                            <Edit :size="14" />
                            {{ locale === 'en' ? 'Edit sheet' : 'Modifier la fiche' }}
                        </button>

                        <button
                            @click="handlePrint"
                            class="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-white bg-primary hover:bg-primary/90 rounded-lg shadow-sm transition cursor-pointer"
                            :title="locale === 'en' ? 'Print or export official PDF report' : 'Imprimer ou exporter le rapport PDF officiel'"
                        >
                            <FileText :size="15" />
                            <span>{{ locale === 'en' ? 'Export / Print PDF' : 'Rapport PDF officiel' }}</span>
                        </button>
                    </div>
                </div>
            </div>

            <!-- ÉTAT DE CHARGEMENT -->
            <div v-if="loading" class="p-20 flex flex-col items-center justify-center gap-3 text-gray-500 print:hidden">
                <Loader :size="32" class="animate-spin text-primary" />
                <span class="text-sm font-medium">{{ locale === 'en' ? 'Loading equipment inspection...' : 'Chargement du contrôle de matériel...' }}</span>
            </div>

            <!-- ÉTAT D'ERREUR -->
            <div v-else-if="errorMessage" class="p-10 max-w-xl mx-auto my-10 bg-red-50 border border-red-200 rounded-xl text-center text-red-600 print:hidden">
                <p class="font-semibold">{{ errorMessage }}</p>
                <button
                    @click="router.push({ name: 'EQUIPMENT_MONITORING' })"
                    class="mt-4 px-4 py-2 text-xs bg-red-600 text-white rounded-lg hover:bg-red-700 cursor-pointer"
                >
                    {{ locale === 'en' ? 'Back to equipment monitoring' : 'Retour au suivi des matériels' }}
                </button>
            </div>

            <!-- ======================= FICHE DE SUIVI / RAPPORT PDF OFFICIEL ======================= -->
            <div v-else-if="equipment" class="sheet-container max-w-5xl mx-auto bg-white p-6 sm:p-10 shadow-lg border border-gray-200 rounded-2xl print:shadow-none print:border-none print:p-0 print:m-0 print:w-full print:max-w-none text-gray-900 font-sans space-y-6">

                <!-- EN-TÊTE OFFICIEL GALANA -->
                <div class="border border-gray-300 rounded-xl overflow-hidden print:border-gray-800 print:rounded-none print-avoid-break">
                    <div class="flex flex-col sm:flex-row print:flex-row">
                        <div class="sm:w-[28%] print:w-[28%] p-4 flex items-center justify-center bg-gray-50 border-b sm:border-b-0 sm:border-r border-gray-300 print:bg-white print:border-gray-800">
                            <img src="/logo/galana-rubis.png" alt="Galana Groupe Rubis" class="max-h-14 w-auto object-contain" />
                        </div>
                        <div class="sm:w-[72%] print:w-[72%] flex flex-col justify-between">
                            <div class="p-4 text-center">
                                <h1 class="text-base sm:text-lg font-black tracking-wide uppercase text-gray-900 font-sans print:text-sm">
                                    {{ locale === 'en' ? 'HSSE EQUIPMENT AUDIT & INSPECTION REPORT' : 'RAPPORT DE CONTRÔLE ET D\'INSPECTION DU MATÉRIEL HSSE' }}
                                </h1>
                                <p class="text-xs text-gray-500 mt-0.5 print:text-[10px]">{{ locale === 'en' ? 'Galana Service Stations & Petroleum Sites Network' : 'Réseau des Stations-Service & Sites Pétroliers Galana Madagascar' }}</p>
                            </div>
                            <div class="border-t border-gray-300 bg-gray-50/70 grid grid-cols-2 sm:grid-cols-5 print:grid-cols-5 text-xs divide-x divide-gray-300 print:border-gray-800 print:divide-gray-800 print:bg-gray-100">
                                <div class="p-2 text-center">
                                    <span class="text-gray-400 block text-[10px] uppercase font-bold">{{ locale === 'en' ? 'Reference' : 'Référence' }}</span>
                                    <span class="font-mono font-bold text-gray-800">EQ-{{ equipment.id }}</span>
                                </div>
                                <div class="p-2 text-center">
                                    <span class="text-gray-400 block text-[10px] uppercase font-bold">{{ locale === 'en' ? 'Station / Site' : 'Station / Site' }}</span>
                                    <span class="font-bold text-gray-800">{{ getSiteNameText(equipment.site_name) }}</span>
                                </div>
                                <div class="p-2 text-center">
                                    <span class="text-gray-400 block text-[10px] uppercase font-bold">{{ locale === 'en' ? 'Inspection date' : 'Date contrôle' }}</span>
                                    <span class="font-medium text-gray-800">{{ equipment.date || 'N/A' }}</span>
                                </div>
                                <div class="p-2 text-center">
                                    <span class="text-gray-400 block text-[10px] uppercase font-bold">{{ locale === 'en' ? 'Inspector' : 'Inspecteur' }}</span>
                                    <span class="font-medium text-gray-800 truncate block">{{ inspectorName }}</span>
                                </div>
                                <div class="p-2 text-center flex flex-col items-center justify-center">
                                    <span class="text-gray-400 block text-[10px] uppercase font-bold mb-0.5">{{ locale === 'en' ? 'Status' : 'Statut' }}</span>
                                    <span
                                        class="px-2 py-0.5 rounded-full text-[10px] font-bold inline-block"
                                        :class="badgeColor(equipment.status, equipment.conformity_rate)"
                                    >
                                        {{ formatStatus(equipment.status, equipment.conformity_rate) }}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- BANDEAU KPI DE CONFORMITÉ (SYNTHÈSE D'AUDIT) -->
                <div class="grid grid-cols-2 sm:grid-cols-4 print:grid-cols-4 gap-3 print-avoid-break">
                    <div class="p-3 rounded-xl bg-slate-50 border border-slate-200 print:border-gray-300 flex flex-col items-center justify-center text-center">
                        <span class="text-[11px] font-semibold text-gray-500 uppercase tracking-wider text-[10px]">{{ locale === 'en' ? 'Compliance rate' : 'Taux de conformité' }}</span>
                        <span class="text-2xl font-black mt-0.5" :class="(equipment.conformity_rate ?? 100) >= 100 ? 'text-emerald-700' : ((equipment.conformity_rate ?? 100) >= 80 ? 'text-amber-700' : 'text-red-700')">
                            {{ equipment.conformity_rate ?? 100 }}%
                        </span>
                        <span
                            v-if="equipment.initial_conformity_rate !== undefined && equipment.initial_conformity_rate !== equipment.conformity_rate"
                            class="text-[9px] font-bold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-full mt-1 border border-emerald-200"
                        >
                            {{ locale === 'en' ? 'Resolved (initial:' : 'Régularisé (initial :' }} {{ equipment.initial_conformity_rate }}%)
                        </span>
                    </div>
                    <div class="p-3 rounded-xl bg-slate-50 border border-slate-200 print:border-gray-300 flex flex-col items-center justify-center text-center">
                        <span class="text-[11px] font-semibold text-gray-500 uppercase tracking-wider text-[10px]">{{ locale === 'en' ? 'Audited equipment' : 'Matériels contrôlés' }}</span>
                        <span class="text-2xl font-black text-gray-800 mt-0.5">{{ items.length }}</span>
                    </div>
                    <div class="p-3 rounded-xl bg-slate-50 border border-slate-200 print:border-gray-300 flex flex-col items-center justify-center text-center">
                        <span class="text-[11px] font-semibold text-gray-500 uppercase tracking-wider text-[10px]">{{ locale === 'en' ? 'Compliant' : 'Conformes' }}</span>
                        <span class="text-2xl font-black text-emerald-600 mt-0.5">{{ compliantItemsCount }}</span>
                    </div>
                    <div class="p-3 rounded-xl bg-slate-50 border border-slate-200 print:border-gray-300 flex flex-col items-center justify-center text-center">
                        <span class="text-[11px] font-semibold text-gray-500 uppercase tracking-wider text-[10px]">{{ locale === 'en' ? 'Anomalies detected' : 'Anomalies détectées' }}</span>
                        <span class="text-2xl font-black mt-0.5" :class="nonCompliantItemsCount > 0 ? 'text-red-600' : 'text-gray-400'">
                            {{ nonCompliantItemsCount }}
                        </span>
                    </div>
                </div>

                <!-- SECTION 1A (WEB INTERACTIF) : CARTES DES ÉQUIPEMENTS (print:hidden) -->
                <div class="border border-gray-200 rounded-xl p-5 bg-white shadow-2xs print:hidden">
                    <div class="flex items-center justify-between pb-3 border-b border-gray-200 mb-4">
                        <div>
                            <h3 class="font-bold text-gray-900 text-sm flex items-center gap-2">
                                <span>📦 {{ locale === 'en' ? 'Registered Equipment & Materials' : 'Équipements & Matériels enregistrés' }}</span>
                                <span class="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-bold">{{ items.length }} items</span>
                            </h3>
                            <p class="text-xs text-gray-500 mt-0.5">{{ locale === 'en' ? 'Details of recorded equipment, compliance states and photo evidence' : 'Détail des matériels saisis, états de conformité et preuves photos' }}</p>
                        </div>
                    </div>

                    <div v-if="!items.length" class="text-center py-8 text-gray-400 text-xs bg-gray-50 rounded-lg border border-dashed border-gray-200">
                        <p class="font-medium text-gray-600">{{ locale === 'en' ? 'No specific individual equipment has been entered for this inspection.' : 'Aucun équipement unitaire spécifique n\'a été inséré pour ce contrôle.' }}</p>
                        <p class="text-[11px] text-gray-400 mt-1">{{ locale === 'en' ? 'You can add equipment by clicking "Edit sheet".' : 'Vous pouvez ajouter des équipements en cliquant sur « Modifier la fiche ».' }}</p>
                    </div>

                    <div v-else class="space-y-3">
                        <div
                            v-for="item in items"
                            :key="item.id"
                            class="p-4 rounded-xl border border-gray-200 bg-slate-50/50 hover:bg-slate-50 transition flex flex-col gap-3"
                        >
                            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                <div>
                                    <div class="flex items-center gap-2">
                                        <h4 class="font-bold text-gray-900 text-sm">{{ item.name }}</h4>
                                        <span class="px-2 py-0.5 rounded-md bg-gray-200/70 text-gray-700 text-[10px] font-semibold">
                                            {{ getCategoryLabel(item.type) }}
                                        </span>
                                    </div>
                                    <p class="text-xs text-gray-500 mt-0.5">
                                        <span v-if="item.location">📍 {{ locale === 'en' ? 'Location:' : 'Emplacement :' }} <b>{{ item.location }}</b></span>
                                        <span v-if="item.comment" class="italic text-gray-600 ml-2">« {{ item.comment }} »</span>
                                    </p>
                                </div>

                                <!-- Bascule conformité -->
                                <div class="flex items-center gap-2">
                                    <button
                                        type="button"
                                        @click="toggleItemConformity(item)"
                                        class="px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer select-none"
                                        :class="item.conformity ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' : 'bg-red-100 text-red-800 hover:bg-red-200'"
                                        :title="locale === 'en' ? 'Click to toggle compliance state' : 'Cliquer pour modifier l\'état de conformité'"
                                    >
                                        {{ item.conformity ? (locale === 'en' ? '🟢 Compliant' : '🟢 Conforme') : (locale === 'en' ? '🔴 Non-compliant' : '🔴 Non conforme') }}
                                    </button>
                                    <span
                                        v-if="item.initial_conformity === false && item.conformity === true"
                                        class="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full"
                                        :title="locale === 'en' ? 'This equipment was initially non-compliant and was resolved' : 'Cet équipement était initialement non conforme et a été régularisé'"
                                    >
                                        {{ locale === 'en' ? 'Resolved' : 'Régularisé' }}
                                    </span>
                                </div>
                            </div>

                            <!-- Galerie des photos de l'item (web) -->
                            <div class="border-t border-gray-200/80 pt-2.5">
                                <div class="flex items-center justify-between mb-2">
                                    <span class="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                                        <ImageIcon :size="14" class="text-gray-400" />
                                        {{ locale === 'en' ? 'Photo evidence' : 'Preuves photos' }} ({{ (item.attachments || []).length }})
                                    </span>

                                    <label class="text-xs font-bold text-primary hover:underline cursor-pointer flex items-center gap-1">
                                        <Plus :size="13" />
                                        <span>{{ locale === 'en' ? 'Add photo' : 'Ajouter une photo' }}</span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            class="hidden"
                                            @change="onUploadPhoto($event, item)"
                                        />
                                    </label>
                                </div>

                                <div v-if="item.attachments && item.attachments.length" class="flex flex-wrap gap-2.5">
                                    <div
                                        v-for="att in item.attachments"
                                        :key="att.id"
                                        @click="previewImage(att.file_path)"
                                        class="w-20 h-20 rounded-xl border border-gray-200 shadow-2xs cursor-pointer hover:opacity-90 relative group transition"
                                        :title="locale === 'en' ? 'Enlarge photo' : 'Agrandir la photo'"
                                    >
                                        <img :src="resolvePhotoUrl(att.file_path)" class="w-full h-full object-cover rounded-xl" />
                                    </div>
                                </div>
                                <p v-else class="text-xs text-gray-400 italic">{{ locale === 'en' ? 'No photo evidence recorded for this equipment.' : 'Aucune preuve photo enregistrée pour cet équipement.' }}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- SECTION 1B (FORMAT IMPRESSION / PDF OFFICIEL) : TABLEAU D'INVENTAIRE OFFICIEL -->
                <div class="hidden print:block print:w-full space-y-2">
                    <div class="border-b border-gray-800 pb-1 mb-2">
                        <h3 class="font-black text-gray-900 text-xs uppercase tracking-wide">
                            {{ locale === 'en' ? '1. DETAILED INVENTORY & COMPLIANCE OF AUDITED EQUIPMENT' : '1. INVENTAIRE DÉTAILLÉ & ÉTAT DE CONFORMITÉ DES ÉQUIPEMENTS AUDITÉS' }}
                        </h3>
                    </div>

                    <table class="w-full border-collapse border border-gray-400 text-[10px]">
                        <thead>
                            <tr class="bg-gray-100 text-gray-800 font-bold border-b border-gray-400">
                                <th class="border border-gray-400 p-1.5 text-center w-8">#</th>
                                <th class="border border-gray-400 p-1.5 text-left w-32">{{ locale === 'en' ? 'Category' : 'Catégorie' }}</th>
                                <th class="border border-gray-400 p-1.5 text-left">{{ locale === 'en' ? 'Equipment / Designation' : 'Équipement / Désignation' }}</th>
                                <th class="border border-gray-400 p-1.5 text-left w-28">{{ locale === 'en' ? 'Location' : 'Emplacement' }}</th>
                                <th class="border border-gray-400 p-1.5 text-center w-24">{{ locale === 'en' ? 'Compliance' : 'Conformité' }}</th>
                                <th class="border border-gray-400 p-1.5 text-left">{{ locale === 'en' ? 'Observations & Defects' : 'Observations & Anomalies constatées' }}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-if="!items.length">
                                <td colspan="6" class="border border-gray-400 p-4 text-center text-gray-500 italic">
                                    {{ locale === 'en' ? 'No individual equipment items recorded.' : 'Aucun équipement unitaire renseigné.' }}
                                </td>
                            </tr>
                            <tr
                                v-for="(item, idx) in items"
                                :key="item.id || idx"
                                class="border-b border-gray-300"
                                :class="!item.conformity ? 'bg-red-50/60 font-semibold' : (idx % 2 === 1 ? 'bg-gray-50/50' : 'bg-white')"
                            >
                                <td class="border border-gray-300 p-1.5 text-center font-bold text-gray-600">{{ idx + 1 }}</td>
                                <td class="border border-gray-300 p-1.5 font-medium">{{ getCategoryLabel(item.type) }}</td>
                                <td class="border border-gray-300 p-1.5 font-bold text-gray-900">{{ item.name }}</td>
                                <td class="border border-gray-300 p-1.5">{{ item.location || '-' }}</td>
                                <td class="border border-gray-300 p-1.5 text-center">
                                    <span
                                        class="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase inline-block"
                                        :class="item.conformity ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'"
                                    >
                                        {{ item.conformity ? (locale === 'en' ? 'CONFORME' : 'CONFORME') : (locale === 'en' ? 'ANOMALIE' : 'NON CONFORME') }}
                                    </span>
                                </td>
                                <td class="border border-gray-300 p-1.5">
                                    <span v-if="item.comment" :class="!item.conformity ? 'text-red-700 font-bold' : 'text-gray-700'">
                                        {{ item.comment }}
                                    </span>
                                    <span v-else class="text-gray-400 italic">{{ item.conformity ? (locale === 'en' ? 'Operational & compliant' : 'Opérationnel et conforme') : (locale === 'en' ? 'Defect observed' : 'Défaut constaté') }}</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- SECTION 2 (PRINT & WEB) : PREUVES PHOTOGRAPHIQUES DES ANOMALIES -->
                <div v-if="defectiveItemsWithPhotos.length" class="border border-red-200 rounded-xl p-4 bg-red-50/30 print:border-gray-800 print:rounded-none print:p-2 print:bg-white print-avoid-break">
                    <div class="border-b border-red-200 print:border-gray-800 pb-1.5 mb-3 flex items-center justify-between">
                        <h3 class="font-black text-red-800 print:text-gray-900 text-xs uppercase tracking-wide flex items-center gap-1.5">
                            <span class="print:hidden">📷</span>
                            <span>{{ locale === 'en' ? '2. PHOTOGRAPHIC EVIDENCE OF DETECTED ANOMALIES' : '2. PREUVES PHOTOGRAPHIQUES DES ANOMALIES DÉTECTÉES' }}</span>
                        </h3>
                        <span class="text-[10px] font-bold text-red-700 print:text-gray-600">
                            {{ defectiveItemsWithPhotos.length }} {{ locale === 'en' ? 'item(s) with photos' : 'équipement(s) documenté(s)' }}
                        </span>
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 print:grid-cols-2 gap-3">
                        <div
                            v-for="item in defectiveItemsWithPhotos"
                            :key="item.id"
                            class="p-2.5 rounded-lg border border-red-200 print:border-gray-400 bg-white flex flex-col gap-2"
                        >
                            <div class="flex items-start justify-between text-xs">
                                <div>
                                    <span class="font-bold text-gray-900 block">{{ item.name }} ({{ getCategoryLabel(item.type) }})</span>
                                    <span class="text-[10px] text-gray-500">📍 {{ item.location || 'Emplacement non précisé' }}</span>
                                </div>
                                <span class="px-1.5 py-0.5 rounded text-[9px] font-bold bg-red-100 text-red-800 uppercase">
                                    {{ locale === 'en' ? 'NON-COMPLIANT' : 'NON CONFORME' }}
                                </span>
                            </div>

                            <p v-if="item.comment" class="text-[11px] text-red-700 bg-red-50 p-1.5 rounded border border-red-100 italic">
                                ⚠ {{ item.comment }}
                            </p>

                            <div class="flex flex-wrap gap-2">
                                <div
                                    v-for="att in item.attachments"
                                    :key="att.id"
                                    class="w-24 h-24 sm:w-28 sm:h-28 print:w-28 print:h-28 rounded-lg border border-gray-300 overflow-hidden cursor-pointer"
                                    @click="previewImage(att.file_path)"
                                >
                                    <img :src="resolvePhotoUrl(att.file_path)" class="w-full h-full object-cover" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- SECTION 3 : CARTOGRAPHIE DU SITE & SERVICES DE SECOURS (MASQUÉE À L'IMPRESSION) -->
                <div class="space-y-2.5 print:hidden">
                    <div class="flex items-center justify-between pb-1">
                        <div class="flex items-center gap-2">
                            <MapPin :size="16" class="text-primary" />
                            <h3 class="font-bold text-gray-900 text-sm">
                                {{ locale === 'en' ? 'Site Location & Emergency Map' : 'Cartographie & Localisation du Site' }}
                            </h3>
                        </div>
                        <span class="text-xs font-semibold text-gray-600">
                            {{ getSiteNameText(equipment.site_name) }}
                        </span>
                    </div>

                    <SidebarLocationMap
                        :site-name="getSiteNameText(equipment.site_name)"
                        :location-name="getSiteNameText(equipment.site_name)"
                        :latitude="siteLat"
                        :longitude="siteLng"
                        :locality="siteLocality"
                        :province="siteProvince"
                        :status="equipment.status"
                        :conformity-rate="equipment.conformity_rate"
                    />
                </div>

                <!-- SECTION 4 : REMARQUES & OBSERVATIONS DU CONTRÔLE -->
                <div v-if="equipment.observations" class="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900 print:bg-white print:border-gray-400 print:text-gray-900 print-avoid-break">
                    <span class="font-bold block mb-1 uppercase tracking-wide text-[10px] text-gray-700">
                        {{ locale === 'en' ? '3. INSPECTOR REMARKS & PRESCRIBED RECOMMENDATIONS' : '3. REMARQUES & PRÉCONISATIONS DE L\'INSPECTEUR HSSE' }} :
                    </span>
                    <p class="whitespace-pre-line text-xs font-medium">{{ equipment.observations }}</p>
                </div>

                <!-- SECTION 5 : VISAS OFFICIELS & SIGNATURES (CADRE JURIDIQUE AUDIT) -->
                <div class="pt-4 border-t-2 border-gray-800 space-y-4 print-avoid-break">
                    <div class="text-[10px] font-bold uppercase tracking-wider text-gray-600 print:text-gray-900">
                        {{ locale === 'en' ? '4. OFFICIAL SIGNATURES & VALIDATION' : '4. ÉMARGEMENT & VISAS OFFICIELS DU CONTRÔLE' }}
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <!-- VISA INSPECTEUR HSSE -->
                        <div class="border border-gray-400 rounded-lg p-3 bg-gray-50/50 print:bg-white flex flex-col justify-between h-36">
                            <div>
                                <span class="text-[9px] uppercase font-bold text-gray-500 block">{{ locale === 'en' ? 'Inspected by:' : 'Contrôlé et certifié par :' }}</span>
                                <span class="text-xs font-bold text-gray-900 block mt-0.5">{{ inspectorName }}</span>
                                <span class="text-[10px] text-gray-500 block">{{ locale === 'en' ? 'HSSE Inspector Madagascar' : 'Inspecteur HSSE Galana Madagascar' }}</span>
                            </div>
                            <div class="border-t border-dashed border-gray-300 pt-1 mt-auto">
                                <span class="text-[9px] text-gray-400 block">{{ locale === 'en' ? 'Date & Inspector Signature:' : 'Date & Visa / Signature Inspecteur :' }}</span>
                                <span class="text-[10px] font-semibold text-gray-700 mt-1 block">{{ equipment.date || '...' }}</span>
                            </div>
                        </div>

                        <!-- VISA GÉRANT DE STATION -->
                        <div class="border border-gray-400 rounded-lg p-3 bg-gray-50/50 print:bg-white flex flex-col justify-between h-36">
                            <div>
                                <span class="text-[9px] uppercase font-bold text-gray-500 block">{{ locale === 'en' ? 'Acknowledged by Site Manager:' : 'Pris connaissance par le Gérant / Chef de Station :' }}</span>
                                <span class="text-xs font-bold text-gray-900 block mt-0.5">{{ getSiteNameText(equipment.site_name) }}</span>
                                <span class="text-[10px] text-gray-500 block">{{ locale === 'en' ? 'Station Manager' : 'Responsable du site' }}</span>
                            </div>
                            <div class="border-t border-dashed border-gray-300 pt-1 mt-auto">
                                <span class="text-[9px] text-gray-400 block">{{ locale === 'en' ? 'Signature & Official Station Stamp:' : 'Signature & Cachet commercial du site :' }}</span>
                                <div class="h-6"></div>
                            </div>
                        </div>
                    </div>

                    <!-- MENTION LÉGALE BAS DE PAGE -->
                    <div class="flex flex-col sm:flex-row items-center justify-between text-[9px] text-gray-400 border-t border-gray-200 pt-2 gap-1">
                        <span>{{ locale === 'en' ? 'Official HSSE Report • Galana Petroleum Distribution Madagascar' : 'Rapport officiel HSSE • Galana Distribution Pétrolière Madagascar' }}</span>
                        <span>{{ locale === 'en' ? 'Generated on:' : 'Édité le :' }} {{ generationDate }}</span>
                        <span class="font-mono">REF-GALANA-EQ-{{ equipment.id }}</span>
                    </div>
                </div>

            </div>
        </div>

        <!-- LIGHTBOX MODAL IMAGE FULLSCREEN (print:hidden) -->
        <div
            v-if="lightboxUrl"
            class="fixed inset-0 z-[10000] bg-black/85 backdrop-blur-xs flex items-center justify-center p-4 cursor-pointer print:hidden"
            @click="lightboxUrl = null"
        >
            <div class="relative max-w-4xl max-h-[90vh]" @click.stop>
                <button
                    type="button"
                    @click="lightboxUrl = null"
                    class="absolute top-2 right-2 bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg cursor-pointer"
                    :title="locale === 'en' ? 'Close' : 'Fermer'"
                >
                    <X :size="20" />
                </button>
                <img :src="lightboxUrl" class="max-w-full max-h-[85vh] rounded-xl object-contain shadow-2xl" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import Header from '../../../components/shared/Header.vue';
import ChecklistStatus from '../../../components/features/checklist/ChecklistStatus.vue';
import SidebarLocationMap from '../../../components/shared/SidebarLocationMap.vue';
import type { EquipmentItemType, EquipmentMonitoringType } from '../../../@types/EquipmentMonitoring.type';
import { useEquipmentMonitoringService } from '../../../core/services/equipmentMonitoring.service';
import {
    ArrowLeft,
    CheckCircle2,
    Edit,
    FileText,
    ImageIcon,
    Loader,
    MapPin,
    Plus,
    Printer,
    Trash2,
    X
} from '@lucide/vue';

const { t, locale } = useI18n();
const route = useRoute();
const router = useRouter();
const equipmentsService = useEquipmentMonitoringService();

const loading = ref(true);
const errorMessage = ref<string | null>(null);
const equipment = ref<EquipmentMonitoringType | null>(null);
const items = ref<EquipmentItemType[]>([]);
const lightboxUrl = ref<string | null>(null);

const generationDate = computed(() => {
    return new Date().toLocaleDateString(locale.value === 'en' ? 'en-US' : 'fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
});

const inspectorName = computed(() => {
    const user = (equipment.value as any)?.user;
    if (user?.first_name || user?.last_name) {
        return `${user.first_name || ''} ${user.last_name || ''}`.trim();
    }
    return locale.value === 'en' ? 'HSSE Inspector' : 'Inspecteur HSSE';
});

const compliantItemsCount = computed(() => {
    return items.value.filter(it => it.conformity).length;
});

const nonCompliantItemsCount = computed(() => {
    return items.value.filter(it => !it.conformity).length;
});

const defectiveItemsWithPhotos = computed(() => {
    return items.value.filter(it => !it.conformity && it.attachments && it.attachments.length > 0);
});

function getSiteNameText(site: any): string {
    if (!site) return '';
    if (typeof site === 'string') return site;
    if (typeof site === 'object' && site.name) return String(site.name);
    return String(site);
}

const siteLat = computed(() => {
    return equipment.value?.site_location?.latitude 
        ?? equipment.value?.latitude 
        ?? (equipment.value as any)?.site?.latitude 
        ?? (equipment.value as any)?.siteName?.location?.latitude 
        ?? null;
});

const siteLng = computed(() => {
    return equipment.value?.site_location?.longitude 
        ?? equipment.value?.longitude 
        ?? (equipment.value as any)?.site?.longitude 
        ?? (equipment.value as any)?.siteName?.location?.longitude 
        ?? null;
});

const siteLocality = computed(() => {
    return equipment.value?.site_location?.locality 
        ?? equipment.value?.locality 
        ?? (equipment.value as any)?.site?.locality 
        ?? (equipment.value as any)?.siteName?.location?.locality 
        ?? null;
});

const siteProvince = computed(() => {
    return equipment.value?.site_location?.province 
        ?? equipment.value?.province 
        ?? (equipment.value as any)?.site?.province 
        ?? (equipment.value as any)?.siteName?.location?.province 
        ?? null;
});

function badgeColor(status?: string, conformityRate?: number) {
    const rate = conformityRate ?? 100;
    if (rate >= 100 && (!status || status === 'COMPLETED' || status === 'Conforme')) {
        return 'bg-emerald-100 text-emerald-800 border border-emerald-200';
    }
    if (rate >= 80) {
        return 'bg-amber-100 text-amber-800 border border-amber-200';
    }
    return 'bg-red-100 text-red-800 border border-red-200';
}

function formatStatus(status?: string, conformityRate?: number) {
    const rate = conformityRate ?? 100;
    if (rate >= 100) return locale.value === 'en' ? '🟢 Compliant' : '🟢 Conforme';
    if (rate >= 80) return locale.value === 'en' ? '🟡 Deviation / Warning' : '🟡 Anomalie mineure';
    return locale.value === 'en' ? '🔴 Non-compliant' : '🔴 Non conforme';
}

function resolvePhotoUrl(path: string) {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    const backendUrl = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://127.0.0.1:8000';
    return `${backendUrl}${path}`;
}

function previewImage(path: string) {
    lightboxUrl.value = resolvePhotoUrl(path);
}

async function toggleItemConformity(item: any) {
    const newConformity = !item.conformity;
    item.conformity = newConformity;
    try {
        await equipmentsService.updateItem(item.id, { conformity: newConformity });
        if (equipment.value?.id) {
            const r = await equipmentsService.getItems(equipment.value.id);
            if (r?.data?.items) {
                items.value = r.data.items;
                if (r.data.conformity_rate !== undefined) {
                    equipment.value.conformity_rate = r.data.conformity_rate;
                }
                if (r.data.status !== undefined) {
                    equipment.value.status = r.data.status;
                }
            }
        }
    } catch (err) {
        console.error('Erreur mise à jour conformité item:', err);
    }
}

async function onUploadPhoto(event: Event, item: any) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    const file = input.files[0];
    try {
        const res = await equipmentsService.uploadItemPhoto(item.id, file);
        if (res?.data?.attachment) {
            if (!item.attachments) item.attachments = [];
            item.attachments.push(res.data.attachment);
        }
    } catch (err) {
        console.error('Erreur upload photo item:', err);
    } finally {
        input.value = '';
    }
}

function handlePrint() {
    window.print();
}

async function loadDetails() {
    const id = (route.params.id || route.query.monitoring_id) as string;
    if (!id) {
        errorMessage.value = "Identifiant de contrôle d'équipement non spécifié.";
        loading.value = false;
        return;
    }

    loading.value = true;
    errorMessage.value = null;

    try {
        const [showRes, itemsRes] = await Promise.allSettled([
            equipmentsService.show(id),
            equipmentsService.getItems(id)
        ]);

        if (showRes.status === 'fulfilled' && showRes.value?.data) {
            equipment.value = showRes.value.data as EquipmentMonitoringType;
        } else {
            throw new Error("Impossible de récupérer la fiche de contrôle.");
        }

        if (itemsRes.status === 'fulfilled' && itemsRes.value?.data?.items) {
            items.value = itemsRes.value.data.items;
            if (itemsRes.value.data.conformity_rate !== undefined && equipment.value) {
                equipment.value.conformity_rate = itemsRes.value.data.conformity_rate;
            }
            if (itemsRes.value.data.status !== undefined && equipment.value) {
                equipment.value.status = itemsRes.value.data.status;
            }
        }

        // Auto print si déclenché depuis la liste ou aperçu
        if (route.query.print === 'true') {
            setTimeout(() => {
                window.print();
            }, 600);
        }
    } catch (err: any) {
        console.error('Erreur chargement détails équipement:', err);
        errorMessage.value = err?.response?.data?.message || err?.message || 'Erreur lors du chargement des détails du suivi.';
    } finally {
        loading.value = false;
    }
}

function getCategoryLabel(type?: string) {
    const isEn = locale.value === 'en';
    const labels: Record<string, string> = {
        extincteur: isEn ? 'Extincteur' : 'Extincteur',
        bac: isEn ? 'Bac de rétention' : 'Bac de rétention',
        materiel: isEn ? 'Matériel et outils' : 'Matériel et outils',
        poubelle: isEn ? 'Poubelles' : 'Poubelles',
        signalisation: isEn ? 'Signalétique et pictogramme' : 'Signalétique et pictogramme',
        securite: isEn ? 'Sécurité incendie' : 'Sécurité incendie',
        conformite: isEn ? 'Document & affichage' : 'Document & affichage',
        divers: isEn ? 'Autre / Divers' : 'Autre / Divers',
    };
    return labels[type || 'divers'] || (type || (isEn ? 'Other / Misc' : 'Autre / Divers'));
}

onMounted(() => {
    loadDetails();
});
</script>

<style scoped>
@media print {
    @page {
        size: A4 portrait;
        margin: 10mm 12mm 12mm 12mm;
    }
    .print-avoid-break {
        break-inside: avoid !important;
        page-break-inside: avoid !important;
    }
}
</style>
