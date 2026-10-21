<template>
    <div class="flex flex-col w-full min-h-screen bg-slate-50/50">
        <!-- HEADER -->
        <Header
            title="sidebar.help center"
            :thumbnails="[
                { label: 'thumbnails.home', name: 'DASHBOARD' },
                { label: 'sidebar.help center', name: 'HELP_CENTER' }
            ]"
        />

        <!-- ========================================================= -->
        <!-- BANNIÈRE HERO AVEC RECHERCHE RAPIDE                       -->
        <!-- ========================================================= -->
        <div class="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-primary/90 text-white px-6 py-10 sm:py-14 shadow-md">
            <!-- Cercles décoratifs d'arrière-plan -->
            <div class="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-primary/20 blur-3xl pointer-events-none"></div>
            <div class="absolute left-1/3 -bottom-24 w-72 h-72 rounded-full bg-amber-500/10 blur-2xl pointer-events-none"></div>

            <div class="relative max-w-4xl mx-auto text-center space-y-4">
                <div class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-emerald-300 shadow-2xs">
                    <LifeBuoy :size="14" class="animate-spin-slow text-emerald-400" />
                    <span>{{ locale === 'en' ? 'Galana HSSE Knowledge Base & Comprehensive Operations Manual' : 'Base de connaissances & Manuel Opérationnel Complet Galana HSSE' }}</span>
                </div>

                <h1 class="text-2xl sm:text-4xl font-black tracking-tight text-white leading-tight">
                    {{ locale === 'en' ? 'Comprehensive Documentation & Help Center' : 'Centre d’Aide & Documentation Intégrale' }}
                </h1>
                <p class="text-xs sm:text-sm text-slate-300 max-w-3xl mx-auto font-medium leading-relaxed">
                    {{ locale === 'en'
                        ? 'Detailed operational guides, step-by-step procedures, business rules, regulatory standards and Web-Mobile workflows for all 15 modules.'
                        : 'Manuel complet de la plateforme : guides détaillés pas à pas, règles de gestion, normes réglementaires et processus Web & Mobile pour l’ensemble des 15 modules.' }}
                </p>

                <!-- Champ de recherche Hero -->
                <div class="pt-3 max-w-2xl mx-auto">
                    <div class="relative flex items-center shadow-2xl rounded-2xl overflow-hidden ring-2 ring-white/20 focus-within:ring-primary transition-all">
                        <Search :size="18" class="absolute left-4 text-slate-400 pointer-events-none" />
                        <input
                            v-model="searchQuery"
                            type="text"
                            :placeholder="locale === 'en' ? 'Search anything: inspections, VMC, extinguishers, site types, POI, roles, mobile sync...' : 'Rechercher un sujet : inspections, VMC, extincteurs, types de sites, POI, rôles, mobile...'"
                            class="w-full h-12 sm:h-14 bg-white/95 text-slate-900 placeholder:text-slate-400 pl-11 pr-24 text-xs sm:text-sm outline-none transition"
                        />
                        <button
                            v-if="searchQuery"
                            type="button"
                            @click="searchQuery = ''"
                            class="absolute right-3 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 transition cursor-pointer"
                        >
                            <XIcon :size="16" />
                        </button>
                    </div>

                    <!-- Puces de recherche rapide -->
                    <div class="flex items-center justify-center gap-1.5 flex-wrap mt-3 text-[11px] text-slate-300">
                        <span class="text-slate-400 font-medium">{{ locale === 'en' ? 'Quick Jump:' : 'Accès rapide :' }}</span>
                        <button
                            v-for="chip in quickChips"
                            :key="chip.id"
                            type="button"
                            @click="selectChapterById(chip.id)"
                            class="px-2.5 py-0.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 transition cursor-pointer font-medium hover:text-white"
                        >
                            {{ chip.label }}
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- ========================================================= -->
        <!-- CONTENU DU CENTRE D'AIDE                                  -->
        <!-- ========================================================= -->
        <div class="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-8 w-full">

            <!-- 1. NAVIGATION PAR ONGLETS THÉMATIQUES -->
            <div class="flex items-center justify-between gap-2 overflow-x-auto pb-1 scrollbar-hide border-b border-slate-200">
                <div class="flex items-center gap-2">
                    <button
                        v-for="tab in tabs"
                        :key="tab.id"
                        type="button"
                        @click="activeTab = tab.id"
                        class="pb-3 px-3 text-xs sm:text-sm font-bold transition flex items-center gap-2 border-b-2 cursor-pointer whitespace-nowrap"
                        :class="activeTab === tab.id
                            ? 'border-primary text-primary font-black'
                            : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'"
                    >
                        <component :is="tab.icon" :size="16" />
                        <span>{{ tab.label }}</span>
                        <span v-if="tab.badge" class="text-[10px] px-1.5 py-0.2 rounded-full font-semibold"
                            :class="activeTab === tab.id ? 'bg-primary/10 text-primary' : 'bg-slate-100 text-slate-600'">
                            {{ tab.badge }}
                        </span>
                    </button>
                </div>

                <button
                    type="button"
                    @click="printDocumentation"
                    class="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold shadow-2xs transition cursor-pointer shrink-0 mb-2"
                >
                    <Printer :size="14" />
                    <span>{{ locale === 'en' ? 'Print / Export Manual' : 'Imprimer / Exporter le manuel' }}</span>
                </button>
            </div>

            <!-- ========================================================= -->
            <!-- ONGLET 1 : DOCUMENTATION COMPLÈTE (MANUEL 15 CHAPITRES)  -->
            <!-- ========================================================= -->
            <div v-if="activeTab === 'docs'" class="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-200 items-start">
                
                <!-- SOMMAIRE LATÉRAL (4 COLS) -->
                <div class="lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-4 shadow-sm sticky top-20 max-h-[85vh] flex flex-col">
                    <div class="flex items-center justify-between pb-3 border-b border-slate-100 mb-3 shrink-0">
                        <div class="flex items-center gap-2">
                            <BookOpen :size="16" class="text-primary" />
                            <h3 class="text-xs font-bold text-slate-900 uppercase tracking-wider">
                                {{ locale === 'en' ? 'Table of Contents' : 'Sommaire Général' }}
                            </h3>
                        </div>
                        <span class="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                            {{ filteredDocChapters.length }} / 15 {{ locale === 'en' ? 'Chapters' : 'Chapitres' }}
                        </span>
                    </div>

                    <!-- Champ filtre dans sommaire -->
                    <div class="relative mb-3 shrink-0">
                        <Search :size="13" class="absolute left-2.5 top-2.5 text-slate-400" />
                        <input
                            v-model="chapterFilterQuery"
                            type="text"
                            :placeholder="locale === 'en' ? 'Filter chapters...' : 'Filtrer les chapitres...'"
                            class="w-full pl-8 pr-3 py-1.5 text-[11px] rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:border-primary outline-none transition"
                        />
                    </div>

                    <!-- Liste des chapitres cliquables -->
                    <div class="space-y-1 overflow-y-auto flex-1 pr-1 scrollbar-thin">
                        <button
                            v-for="(chapter, idx) in filteredDocChapters"
                            :key="chapter.id"
                            type="button"
                            @click="selectedChapterId = chapter.id"
                            class="w-full text-left p-2.5 rounded-xl text-xs transition flex items-center justify-between gap-2.5 cursor-pointer group"
                            :class="selectedChapterId === chapter.id
                                ? 'bg-primary/10 text-primary font-bold shadow-2xs border border-primary/20'
                                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-transparent'"
                        >
                            <div class="flex items-center gap-2.5 min-w-0">
                                <span class="text-sm shrink-0">{{ chapter.emoji }}</span>
                                <div class="min-w-0">
                                    <p class="truncate leading-tight">{{ chapter.title }}</p>
                                    <span class="text-[10px] text-slate-400 font-normal">{{ chapter.category }}</span>
                                </div>
                            </div>
                            <span class="text-[10px] font-mono shrink-0" :class="selectedChapterId === chapter.id ? 'text-primary font-bold' : 'text-slate-300'">
                                #{{ String(idx + 1).padStart(2, '0') }}
                            </span>
                        </button>
                    </div>

                    <div class="pt-3 mt-3 border-t border-slate-100 shrink-0 flex items-center justify-between text-[10px] text-slate-400">
                        <span>Galana HSSE v2.6</span>
                        <span class="font-semibold text-emerald-600">● {{ locale === 'en' ? '100% Documented' : '100% Documenté' }}</span>
                    </div>
                </div>

                <!-- CONTENU DÉTAILLÉ DU CHAPITRE SÉLECTIONNÉ (8 COLS) -->
                <div class="lg:col-span-8 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
                    <div v-if="currentChapter" class="space-y-6">
                        <!-- En-tête du Chapitre -->
                        <div class="flex items-start justify-between gap-4 pb-5 border-b border-slate-100">
                            <div class="space-y-1.5 min-w-0">
                                <div class="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider" :class="currentChapter.badgeClass">
                                    <span>{{ currentChapter.category }}</span>
                                    <span>•</span>
                                    <span>{{ currentChapter.readingTime }}</span>
                                </div>
                                <h2 class="text-lg sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
                                    <span>{{ currentChapter.emoji }}</span>
                                    <span>{{ currentChapter.title }}</span>
                                </h2>
                                <p class="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                                    {{ currentChapter.summary }}
                                </p>
                            </div>

                            <button
                                v-if="currentChapter.routeLink"
                                type="button"
                                @click="router.push({ name: currentChapter.routeLink.name })"
                                class="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary text-white text-xs font-bold shadow-xs hover:bg-primary/90 transition cursor-pointer shrink-0"
                            >
                                <span>{{ currentChapter.routeLink.label }}</span>
                                <ExternalLink :size="13" />
                            </button>
                        </div>

                        <!-- Boîte d'Alerte / Règle d'or si définie -->
                        <div v-if="currentChapter.goldenRule" class="p-4 rounded-xl bg-amber-500/10 border border-amber-300 text-amber-950 text-xs leading-relaxed space-y-1">
                            <div class="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[11px] text-amber-800">
                                <Sparkles :size="14" class="text-amber-600" />
                                <span>{{ locale === 'en' ? 'Core Operational Standard' : 'Standard Incontournable Galana' }}</span>
                            </div>
                            <p class="font-medium">{{ currentChapter.goldenRule }}</p>
                        </div>

                        <!-- Sections détaillées du Chapitre -->
                        <div class="space-y-7 text-xs text-slate-700 leading-relaxed">
                            <div
                                v-for="(sec, sIdx) in currentChapter.sections"
                                :key="sIdx"
                                class="space-y-3 pb-6 border-b border-slate-100 last:border-b-0"
                            >
                                <h3 class="text-sm font-bold text-slate-900 flex items-center gap-2">
                                    <span class="w-5 h-5 rounded-md bg-slate-100 text-slate-700 font-bold text-[10px] flex items-center justify-center font-mono">
                                        {{ sIdx + 1 }}
                                    </span>
                                    <span>{{ sec.heading }}</span>
                                </h3>
                                <p class="text-slate-600 leading-relaxed whitespace-pre-line">{{ sec.body }}</p>

                                <!-- Points à puces / Étapes -->
                                <ul v-if="sec.bullets?.length" class="space-y-1.5 pl-2 pt-1">
                                    <li v-for="(b, bIdx) in sec.bullets" :key="bIdx" class="flex items-start gap-2">
                                        <CheckCircle2 :size="14" class="text-emerald-600 shrink-0 mt-0.5" />
                                        <span class="text-slate-700 font-medium">{{ b }}</span>
                                    </li>
                                </ul>

                                <!-- Tableau / Données comparatives si présentes -->
                                <div v-if="sec.table" class="mt-3 overflow-x-auto rounded-xl border border-slate-200">
                                    <table class="w-full text-left text-[11px]">
                                        <thead class="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
                                            <tr>
                                                <th v-for="th in sec.table.headers" :key="th" class="p-2.5">{{ th }}</th>
                                            </tr>
                                        </thead>
                                        <tbody class="divide-y divide-slate-100">
                                            <tr v-for="(row, rIdx) in sec.table.rows" :key="rIdx" class="hover:bg-slate-50/50">
                                                <td v-for="(col, cIdx) in row" :key="cIdx" class="p-2.5 text-slate-600 font-medium">
                                                    {{ col }}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        <!-- Navigation bas de chapitre (Précédent / Suivant) -->
                        <div class="pt-4 border-t border-slate-100 flex items-center justify-between gap-4 flex-wrap">
                            <button
                                v-if="prevChapter"
                                type="button"
                                @click="selectedChapterId = prevChapter.id"
                                class="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition"
                            >
                                <ChevronRight :size="14" class="rotate-180" />
                                <span>{{ locale === 'en' ? 'Previous chapter:' : 'Chapitre précédent :' }} {{ prevChapter.title }}</span>
                            </button>
                            <span v-else></span>

                            <button
                                v-if="nextChapter"
                                type="button"
                                @click="selectedChapterId = nextChapter.id"
                                class="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline transition ml-auto"
                            >
                                <span>{{ locale === 'en' ? 'Next chapter:' : 'Chapitre suivant :' }} {{ nextChapter.title }}</span>
                                <ChevronRight :size="14" />
                            </button>
                        </div>
                    </div>

                    <div v-else class="p-12 text-center text-slate-400">
                        <BookOpen :size="32" class="mx-auto mb-2 opacity-50" />
                        <p class="text-xs">{{ locale === 'en' ? 'No chapter matches your search query' : 'Aucun chapitre ne correspond à votre recherche' }} « {{ searchQuery }} ».</p>
                    </div>
                </div>
            </div>

            <!-- ========================================================= -->
            <!-- ONGLET 2 : VUE SYNTHÉTIQUE DES PROCESSUS                  -->
            <!-- ========================================================= -->
            <div v-if="activeTab === 'guides'" class="space-y-8 animate-in fade-in duration-200">
                <!-- PROCESSUS D'INSPECTION CLEF EN MAIN (HIGHLIGHT) -->
                <div class="rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-50/50 to-emerald-500/10 border border-amber-200/80 p-5 sm:p-6 shadow-sm">
                    <div class="flex items-center justify-between gap-4 flex-wrap mb-4">
                        <div class="flex items-center gap-2.5">
                            <div class="h-9 w-9 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold shadow-xs">
                                <ClipboardCheck :size="18" />
                            </div>
                            <div>
                                <h3 class="text-sm sm:text-base font-bold text-slate-900">
                                    {{ locale === 'en' ? 'Complete Inspection Process (Web & Mobile)' : 'Processus Intégral d’Inspection (Web & Mobile)' }}
                                </h3>
                                <p class="text-xs text-slate-600">
                                    {{ locale === 'en'
                                        ? 'Seamless synergy between Web scheduling and Mobile on-site execution.'
                                        : 'Synergie opérationnelle entre la planification sur Web et l’exécution terrain sur Mobile.' }}
                                </p>
                            </div>
                        </div>
                        <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
                            <span class="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                            <span>{{ locale === 'en' ? 'HSSE Operational Standard' : 'Standard Opérationnel HSSE' }}</span>
                        </span>
                    </div>

                    <!-- 4 ÉTAPES CLÉS DU PROCESSUS D'INSPECTION -->
                    <div class="grid grid-cols-1 md:grid-cols-4 gap-3.5 pt-2">
                        <div class="p-3.5 rounded-xl bg-white border border-amber-100 shadow-2xs flex flex-col justify-between">
                            <div>
                                <div class="flex items-center justify-between mb-2">
                                    <span class="text-[11px] font-bold text-amber-800 px-2 py-0.5 rounded-md bg-amber-50 border border-amber-200">{{ locale === 'en' ? 'Step 1 (Web)' : 'Étape 1 (Web)' }}</span>
                                    <span class="text-xs font-mono font-bold text-slate-400">01</span>
                                </div>
                                <h4 class="text-xs font-bold text-slate-900 mb-1">{{ locale === 'en' ? 'Schedule Inspection' : 'Planifier l’inspection' }}</h4>
                                <p class="text-[11px] text-slate-500 leading-snug">
                                    {{ locale === 'en' ? 'Selection of audit template, facility/station and target date from the Web portal.' : 'Sélection du type d’audit, de la station/site et de la date prévue depuis l’application Web.' }}
                                </p>
                            </div>
                        </div>

                        <div class="p-3.5 rounded-xl bg-white border border-amber-100 shadow-2xs flex flex-col justify-between">
                            <div>
                                <div class="flex items-center justify-between mb-2">
                                    <span class="text-[11px] font-bold text-amber-800 px-2 py-0.5 rounded-md bg-amber-50 border border-amber-200">{{ locale === 'en' ? 'Step 2 (Web)' : 'Étape 2 (Web)' }}</span>
                                    <span class="text-xs font-mono font-bold text-slate-400">02</span>
                                </div>
                                <h4 class="text-xs font-bold text-slate-900 mb-1">{{ locale === 'en' ? 'Assign Inspector' : 'Choisir l’inspecteur' }}</h4>
                                <p class="text-[11px] text-slate-500 leading-snug">
                                    {{ locale === 'en' ? 'Direct nominal nomination of the responsible auditor among certified personnel.' : 'Attribution nominative de l’inspecteur responsable parmi le personnel et les auditeurs habilités.' }}
                                </p>
                            </div>
                        </div>

                        <div class="p-3.5 rounded-xl bg-white border border-emerald-100 shadow-2xs flex flex-col justify-between">
                            <div>
                                <div class="flex items-center justify-between mb-2">
                                    <span class="text-[11px] font-bold text-emerald-800 px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-200">{{ locale === 'en' ? 'Step 3 (Mobile)' : 'Étape 3 (Mobile)' }}</span>
                                    <span class="text-xs font-mono font-bold text-slate-400">03</span>
                                </div>
                                <h4 class="text-xs font-bold text-slate-900 mb-1">{{ locale === 'en' ? 'View & Execute' : 'Consulter & Effectuer' }}</h4>
                                <p class="text-[11px] text-slate-500 leading-snug">
                                    {{ locale === 'en' ? 'On smartphone, the inspector filters "Assigned to me", starts the audit and checks items.' : 'Sur smartphone, l’inspecteur filtre « Attribuées à moi », démarre le contrôle et note les conformités.' }}
                                </p>
                            </div>
                        </div>

                        <div class="p-3.5 rounded-xl bg-white border border-emerald-100 shadow-2xs flex flex-col justify-between">
                            <div>
                                <div class="flex items-center justify-between mb-2">
                                    <span class="text-[11px] font-bold text-emerald-800 px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-200">{{ locale === 'en' ? 'Step 4 (Mobile)' : 'Étape 4 (Mobile)' }}</span>
                                    <span class="text-xs font-mono font-bold text-slate-400">04</span>
                                </div>
                                <h4 class="text-xs font-bold text-slate-900 mb-1">{{ locale === 'en' ? 'Close & Synchronize' : 'Clôturer l’inspection' }}</h4>
                                <p class="text-[11px] text-slate-500 leading-snug">
                                    {{ locale === 'en' ? 'Final electronic sign-off, real-time sync and automated creation of corrective action plan.' : 'Validation finale, synchronisation instantanée et génération des actions correctives à suivre.' }}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- CARTES DES MODULES APPLICATIFS -->
                <div class="space-y-4">
                    <h3 class="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                        <BookOpen :size="16" class="text-primary" />
                        <span>{{ locale === 'en' ? 'Modules & Usage Guides' : 'Guides d’utilisation par Module' }}</span>
                    </h3>

                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div
                            v-for="module in filteredModules"
                            :key="module.id"
                            class="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group"
                        >
                            <div>
                                <div class="flex items-center justify-between gap-3 mb-3">
                                    <div class="w-10 h-10 rounded-xl flex items-center justify-center font-bold shadow-xs text-lg" :class="module.iconBg">
                                        {{ module.emoji }}
                                    </div>
                                    <span class="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border" :class="module.badgeClass">
                                        {{ module.tag }}
                                    </span>
                                </div>

                                <h4 class="text-sm font-bold text-slate-900 group-hover:text-primary transition-colors">
                                    {{ module.title }}
                                </h4>
                                <p class="text-xs text-slate-500 mt-1.5 leading-relaxed">
                                    {{ module.description }}
                                </p>

                                <ul class="mt-3.5 space-y-1.5 border-t border-slate-100 pt-3 text-[11px] text-slate-600">
                                    <li v-for="(point, idx) in module.keyPoints" :key="idx" class="flex items-start gap-1.5">
                                        <CheckCircle2 :size="13" class="text-emerald-600 shrink-0 mt-0.5" />
                                        <span>{{ point }}</span>
                                    </li>
                                </ul>
                            </div>

                            <button
                                type="button"
                                @click="router.push({ name: module.routeName })"
                                class="mt-4 w-full py-2 px-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 font-semibold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                            >
                                <span>{{ locale === 'en' ? 'Open Module' : 'Accéder au module' }}</span>
                                <ChevronRight :size="14" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- ========================================================= -->
            <!-- ONGLET 3 : FOIRE AUX QUESTIONS (FAQ INTERACTIVE)          -->
            <!-- ========================================================= -->
            <div v-if="activeTab === 'faq'" class="space-y-4 animate-in fade-in duration-200">
                <div class="flex items-center justify-between pb-2 border-b border-slate-200">
                    <div>
                        <h3 class="text-base font-bold text-slate-900">
                            {{ locale === 'en' ? 'Frequently Asked Questions' : 'Questions Fréquentes (FAQ)' }}
                        </h3>
                        <p class="text-xs text-slate-500">
                            {{ locale === 'en' ? 'Find immediate answers to common operational questions.' : 'Trouvez des réponses immédiates aux questions opérationnelles courantes.' }}
                        </p>
                    </div>
                    <button
                        type="button"
                        @click="toggleAllFaqs"
                        class="text-xs font-semibold text-primary hover:underline cursor-pointer"
                    >
                        {{ allFaqsOpen ? (locale === 'en' ? 'Collapse all' : 'Tout replier') : (locale === 'en' ? 'Expand all' : 'Tout déplier') }}
                    </button>
                </div>

                <div class="space-y-3">
                    <div
                        v-for="(faq, index) in filteredFaqs"
                        :key="index"
                        class="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs transition-all"
                    >
                        <button
                            type="button"
                            @click="faq.isOpen = !faq.isOpen"
                            class="w-full text-left p-4 sm:p-4.5 flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-50 transition"
                        >
                            <div class="flex items-center gap-3 min-w-0">
                                <span class="text-base shrink-0">{{ faq.icon || '❓' }}</span>
                                <span class="text-xs sm:text-sm font-bold text-slate-900 truncate">
                                    {{ faq.question }}
                                </span>
                            </div>
                            <ChevronDown
                                :size="16"
                                class="text-slate-400 shrink-0 transition-transform duration-200"
                                :class="{ 'rotate-180': faq.isOpen }"
                            />
                        </button>

                        <div
                            v-if="faq.isOpen"
                            class="px-4 pb-4 sm:px-5 sm:pb-5 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/40"
                        >
                            <p class="whitespace-pre-line">{{ faq.answer }}</p>
                            <div v-if="faq.link" class="mt-2.5">
                                <button
                                    type="button"
                                    @click="router.push({ name: faq.link.name })"
                                    class="inline-flex items-center gap-1 text-[11px] font-bold text-primary hover:underline"
                                >
                                    <span>{{ faq.link.label }}</span>
                                    <ExternalLink :size="11" />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div v-if="filteredFaqs.length === 0" class="p-12 text-center text-slate-400 bg-white rounded-2xl border border-slate-200">
                        <HelpCircleIcon :size="32" class="mx-auto mb-2 opacity-50" />
                        <p class="text-xs font-medium">{{ locale === 'en' ? 'No question matches your search query' : 'Aucune question ne correspond à votre recherche' }} « {{ searchQuery }} ».</p>
                    </div>
                </div>
            </div>

            <!-- ========================================================= -->
            <!-- ONGLET 4 : CONTACT & SUPPORT DIRECT HSSE                  -->
            <!-- ========================================================= -->
            <div v-if="activeTab === 'contact'" class="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-200 items-start">
                <!-- FORMULAIRE DE TICKET / DEMANDE D'ASSISTANCE (GAUCHE - 7 COLS) -->
                <div class="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-4">
                    <div class="flex items-center gap-2.5 pb-2 border-b border-slate-100">
                        <div class="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                            <MessageSquare :size="18" />
                        </div>
                        <div>
                            <h3 class="text-sm font-bold text-slate-900">
                                {{ locale === 'en' ? 'Submit a Support Request' : 'Envoyer une demande d’assistance' }}
                            </h3>
                            <p class="text-[11px] text-slate-500">
                                {{ locale === 'en' ? 'Our HSSE & Technical team typically responds within 24 hours.' : 'Notre équipe HSSE et support technique vous répond sous 24h ouvrées.' }}
                            </p>
                        </div>
                    </div>

                    <form @submit.prevent="submitSupportTicket" class="space-y-3.5">
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <!-- Catégorie de demande -->
                            <div>
                                <label class="block text-xs font-semibold text-slate-700 mb-1">
                                    {{ locale === 'en' ? 'Category' : 'Catégorie' }} <span class="text-red-500">*</span>
                                </label>
                                <select
                                    v-model="ticketForm.category"
                                    required
                                    class="w-full h-9 px-3 rounded-xl border border-slate-300 text-xs focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none bg-white transition cursor-pointer"
                                >
                                    <option value="PROCEDURE_HSSE">{{ locale === 'en' ? 'HSSE Procedures & Compliance' : 'Procédures & Réglementation HSSE' }}</option>
                                    <option value="MOBILE_SYNC">{{ locale === 'en' ? 'Mobile App Synchronization' : 'Synchronisation application Mobile' }}</option>
                                    <option value="ACCESS_ROLE">{{ locale === 'en' ? 'Access, Permissions & Users' : 'Accès, Permissions & Utilisateurs' }}</option>
                                    <option value="BUG_SIGNAL">{{ locale === 'en' ? 'Anomaly / Bug Report' : 'Signalement d’anomalie / Bug' }}</option>
                                    <option value="TRAINING">{{ locale === 'en' ? 'Training Plan & Certifications' : 'Plan de formation & Certifications' }}</option>
                                    <option value="OTHER">{{ locale === 'en' ? 'Other Request' : 'Autre demande' }}</option>
                                </select>
                            </div>

                            <!-- Priorité -->
                            <div>
                                <label class="block text-xs font-semibold text-slate-700 mb-1">
                                    {{ locale === 'en' ? 'Urgency level' : 'Degré d’urgence' }}
                                </label>
                                <select
                                    v-model="ticketForm.priority"
                                    class="w-full h-9 px-3 rounded-xl border border-slate-300 text-xs focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none bg-white transition cursor-pointer font-medium"
                                >
                                    <option value="LOW">{{ locale === 'en' ? 'Low (General question)' : 'Faible (Question générale)' }}</option>
                                    <option value="MEDIUM">{{ locale === 'en' ? 'Medium (Operational hindrance)' : 'Moyen (Gêne opérationnelle)' }}</option>
                                    <option value="HIGH">{{ locale === 'en' ? 'High (Field blocking issue)' : 'Élevé (Blocage sur le terrain)' }}</option>
                                </select>
                            </div>
                        </div>

                        <!-- Sujet -->
                        <div>
                            <label class="block text-xs font-semibold text-slate-700 mb-1">
                                {{ locale === 'en' ? 'Subject' : 'Objet de la demande' }} <span class="text-red-500">*</span>
                            </label>
                            <input
                                v-model="ticketForm.subject"
                                type="text"
                                required
                                :placeholder="locale === 'en' ? 'e.g. Sync difficulty on checklist Station Ankorondrano' : 'ex: Difficulté de synchronisation de la checklist Station Ankorondrano'"
                                class="w-full h-9 px-3 rounded-xl border border-slate-300 text-xs focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition"
                            />
                        </div>

                        <!-- Description -->
                        <div>
                            <label class="block text-xs font-semibold text-slate-700 mb-1">
                                {{ locale === 'en' ? 'Detailed Description' : 'Description détaillée' }} <span class="text-red-500">*</span>
                            </label>
                            <textarea
                                v-model="ticketForm.description"
                                rows="4"
                                required
                                :placeholder="locale === 'en' ? 'Specify context, facility/station, possible error message...' : 'Précisez le contexte, la station/site concerné, le message d’erreur éventuel...'"
                                class="w-full p-3 rounded-xl border border-slate-300 text-xs focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition"
                            ></textarea>
                        </div>

                        <!-- Photo / Preuves / Pièces jointes (Optionnel pour toutes les catégories - Multiples autorisées) -->
                        <div class="space-y-2 animate-in fade-in duration-200">
                            <div class="flex items-center justify-between">
                                <label class="block text-xs font-semibold text-slate-700">
                                    {{ locale === 'en' ? 'Photos / Screenshots / Proofs' : 'Photos / Captures d’écran / Preuves' }}
                                    <span class="text-slate-400 font-normal">({{ locale === 'en' ? 'Optional - Multiple allowed' : 'Optionnel - Plusieurs photos possibles' }})</span>
                                </label>
                                <span class="text-[10px] text-slate-400 font-medium">PNG, JPG, WEBP (max 6, 5 Mo/photo)</span>
                            </div>

                            <!-- Input fichier masqué (multiple) -->
                            <input
                                ref="photoInputRef"
                                type="file"
                                multiple
                                accept="image/png,image/jpeg,image/webp"
                                class="hidden"
                                @change="handlePhotoChange"
                            />

                            <!-- Zone de téléversement (si pas encore de photo) -->
                            <div
                                v-if="ticketForm.photos.length === 0"
                                @click="photoInputRef?.click()"
                                @dragover.prevent="isDragging = true"
                                @dragleave.prevent="isDragging = false"
                                @drop.prevent="handlePhotoDrop"
                                class="border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-1.5 group"
                                :class="isDragging ? 'border-primary bg-primary/5' : 'border-slate-300 hover:border-primary/60 bg-slate-50/50 hover:bg-slate-50'"
                            >
                                <div class="w-9 h-9 rounded-full bg-slate-100 group-hover:bg-primary/10 flex items-center justify-center transition-colors">
                                    <Camera :size="18" class="text-slate-500 group-hover:text-primary transition-colors" />
                                </div>
                                <div class="space-y-0.5">
                                    <p class="text-xs font-semibold text-slate-700 group-hover:text-primary transition-colors">
                                        {{ locale === 'en' ? 'Click or drag one or several photos / screenshots here' : 'Cliquez ou glissez une ou plusieurs photos / captures d’écran ici' }}
                                    </p>
                                    <p class="text-[11px] text-slate-400">
                                        {{ locale === 'en' ? 'Attach visual proofs or screenshots to support your request (up to 6 photos)' : 'Joignez des preuves visuelles ou captures d’écran pour appuyer votre demande (jusqu’à 6 photos)' }}
                                    </p>
                                </div>
                            </div>

                            <!-- Grille des photos sélectionnées (si au moins 1 photo) -->
                            <div v-else class="space-y-2">
                                <div class="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                                    <!-- Carte photo individuelle -->
                                    <div
                                        v-for="(photoItem, idx) in ticketForm.photos"
                                        :key="photoItem.id"
                                        class="group relative rounded-xl border border-slate-200 bg-white p-2 flex flex-col gap-1.5 shadow-2xs hover:shadow-xs hover:border-slate-300 transition"
                                    >
                                        <div class="relative h-20 w-full rounded-lg overflow-hidden bg-slate-100 border border-slate-200/80">
                                            <img
                                                :src="photoItem.preview"
                                                :alt="photoItem.name"
                                                class="w-full h-full object-cover transition-transform group-hover:scale-105 duration-200"
                                            />
                                            <!-- Bouton supprimer photo -->
                                            <button
                                                type="button"
                                                @click.stop="removePhoto(idx)"
                                                class="absolute top-1.5 right-1.5 w-6 h-6 rounded-md bg-white/95 hover:bg-red-50 text-slate-500 hover:text-red-600 flex items-center justify-center shadow-xs transition cursor-pointer"
                                                :title="locale === 'en' ? 'Remove this photo' : 'Supprimer cette photo'"
                                            >
                                                <Trash2 :size="12" />
                                            </button>
                                        </div>
                                        <div class="min-w-0">
                                            <p class="text-[11px] font-bold text-slate-800 truncate" :title="photoItem.name">
                                                {{ photoItem.name }}
                                            </p>
                                            <div class="flex items-center justify-between text-[10px] text-slate-400 mt-0.5">
                                                <span>{{ photoItem.size }}</span>
                                                <span class="text-emerald-600 font-semibold text-[9px] bg-emerald-50 px-1 py-0.2 rounded">
                                                    {{ locale === 'en' ? 'Attached' : 'Jointe' }}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Carte "Ajouter une autre photo" si < 6 photos -->
                                    <button
                                        v-if="ticketForm.photos.length < 6"
                                        type="button"
                                        @click="photoInputRef?.click()"
                                        @dragover.prevent="isDragging = true"
                                        @dragleave.prevent="isDragging = false"
                                        @drop.prevent="handlePhotoDrop"
                                        class="min-h-[110px] rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-1.5 text-center transition cursor-pointer p-2 group"
                                        :class="isDragging ? 'border-primary bg-primary/5' : 'border-slate-300 hover:border-primary/60 bg-slate-50/60 hover:bg-slate-50'"
                                    >
                                        <div class="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-primary/10 flex items-center justify-center text-slate-500 group-hover:text-primary transition-colors">
                                            <Plus :size="16" />
                                        </div>
                                        <div class="space-y-0.5">
                                            <p class="text-xs font-semibold text-slate-700 group-hover:text-primary transition-colors">
                                                {{ locale === 'en' ? 'Add photo' : 'Ajouter photo' }}
                                            </p>
                                            <p class="text-[10px] text-slate-400">
                                                {{ ticketForm.photos.length }} / 6
                                            </p>
                                        </div>
                                    </button>
                                </div>

                                <!-- Barre de récapitulatif & bouton tout vider -->
                                <div class="flex items-center justify-between text-[11px] text-slate-500 px-1">
                                    <span class="inline-flex items-center gap-1 font-medium">
                                        <span class="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                        {{ ticketForm.photos.length }} / 6 {{ locale === 'en' ? (ticketForm.photos.length > 1 ? 'photos attached' : 'photo attached') : (ticketForm.photos.length > 1 ? 'photos jointes' : 'photo jointe') }}
                                    </span>
                                    <button
                                        type="button"
                                        @click="clearAllPhotos"
                                        class="text-slate-400 hover:text-red-600 transition text-[11px] cursor-pointer underline decoration-dotted"
                                    >
                                        {{ locale === 'en' ? 'Remove all photos' : 'Supprimer toutes les photos' }}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div class="flex items-center justify-end pt-2">
                            <button
                                type="submit"
                                :disabled="isSubmittingTicket || !ticketForm.subject || !ticketForm.description"
                                class="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-xs shadow-xs transition flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                            >
                                <Loader2 v-if="isSubmittingTicket" :size="14" class="animate-spin" />
                                <Send v-else :size="14" />
                                <span>{{ isSubmittingTicket ? (locale === 'en' ? 'Submitting...' : 'Envoi en cours...') : (locale === 'en' ? 'Submit Support Request' : 'Envoyer la demande d’assistance') }}</span>
                            </button>
                        </div>
                    </form>
                </div>

                <!-- COORDONNÉES D'URGENCE & SUPPORT GALANA (DROITE - 5 COLS) -->
                <div class="lg:col-span-5 space-y-4">
                    <!-- Urgence Direction HSSE -->
                    <div class="rounded-2xl border border-red-200 bg-red-50/60 p-5 shadow-2xs space-y-3">
                        <div class="flex items-center gap-2.5">
                            <div class="h-8 w-8 rounded-xl bg-red-600 text-white flex items-center justify-center font-bold shadow-xs">
                                🚨
                            </div>
                            <div>
                                <h4 class="text-xs font-bold text-red-950 uppercase tracking-wider">{{ locale === 'en' ? 'Galana HSSE 24/7 Emergency Hotline' : 'Astreinte HSSE Galana 24/7' }}</h4>
                                <p class="text-[11px] text-red-700">{{ locale === 'en' ? 'In case of severe accident, hydrocarbon spill or fire' : 'En cas d’accident grave, déversement ou incendie' }}</p>
                            </div>
                        </div>

                        <div class="bg-white rounded-xl p-3 border border-red-100 flex items-center justify-between">
                            <div>
                                <span class="text-[10px] text-slate-400 block font-medium">{{ locale === 'en' ? 'Direct emergency line' : 'Ligne directe d’urgence' }}</span>
                                <span class="font-mono text-sm font-extrabold text-red-700">+261 20 22 555 55</span>
                            </div>
                            <a
                                href="tel:+261202255555"
                                class="px-3 py-1.5 rounded-lg bg-red-600 text-white font-bold text-[11px] hover:bg-red-700 transition shadow-2xs"
                            >
                                {{ locale === 'en' ? 'Call Now' : 'Appeler' }}
                            </a>
                        </div>
                    </div>

                    <!-- Support Technique & Informatique -->
                    <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs space-y-3">
                        <div class="flex items-center gap-2.5">
                            <div class="h-8 w-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                                💻
                            </div>
                            <div>
                                <h4 class="text-xs font-bold text-slate-900">{{ locale === 'en' ? 'Technical & Application Support' : 'Support Technique & Applicatif' }}</h4>
                                <p class="text-[11px] text-slate-500">{{ locale === 'en' ? 'Monday to Friday from 08:00 AM to 05:00 PM' : 'Du Lundi au Vendredi de 08h à 17h' }}</p>
                            </div>
                        </div>

                        <div class="space-y-2 text-xs text-slate-600">
                            <div class="flex items-center gap-2.5 p-2 rounded-lg bg-slate-50 border border-slate-100">
                                <Mail :size="14" class="text-slate-400 shrink-0" />
                                <span class="font-mono text-slate-700 truncate">support.hsse@galana.mg</span>
                            </div>
                            <div class="flex items-center gap-2.5 p-2 rounded-lg bg-slate-50 border border-slate-100">
                                <Phone :size="14" class="text-slate-400 shrink-0" />
                                <span class="font-mono text-slate-700">{{ locale === 'en' ? '+261 34 00 200 00 (Ext. 142)' : '+261 34 00 200 00 (Poste 142)' }}</span>
                            </div>
                        </div>
                    </div>

                    <!-- Guide PDF & Procédures Documentaires -->
                    <div class="rounded-2xl border border-blue-200 bg-blue-50/50 p-4 shadow-2xs flex items-center justify-between gap-3">
                        <div class="flex items-center gap-2.5 min-w-0">
                            <div class="h-8 w-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shrink-0">
                                📄
                            </div>
                            <div class="min-w-0">
                                <h5 class="text-xs font-bold text-blue-950 truncate">{{ locale === 'en' ? 'HSSE User Manual PDF' : 'Manuel Utilisateur HSSE PDF' }}</h5>
                                <p class="text-[10px] text-blue-700 truncate">{{ locale === 'en' ? 'Comprehensive downloadable manual' : 'Guide complet téléchargeable' }}</p>
                            </div>
                        </div>
                        <button
                            type="button"
                            @click="router.push({ name: 'DOCUMENT_LIBRARY' })"
                            class="px-2.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-[10px] transition shrink-0 cursor-pointer shadow-2xs"
                        >
                            {{ locale === 'en' ? 'Open' : 'Consulter' }}
                        </button>
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { toast } from 'vue3-toastify';
import Header from '../../../components/shared/Header.vue';
import {
    BookOpen,
    Camera,
    CheckCircle2,
    ChevronDown,
    ChevronRight,
    ClipboardCheck,
    ExternalLink,
    HelpCircleIcon,
    LifeBuoy,
    Loader2,
    Mail,
    MessageSquare,
    Phone,
    Plus,
    Printer,
    Search,
    Send,
    Sparkles,
    Trash2,
    XIcon
} from '@lucide/vue';
import {
    getDocChapters,
    getHelpModules,
    getInitialFaqs,
    type DocChapter,
    type DocSection,
    type HelpModule,
    type FaqItem
} from './helpDocsData';

const { t, locale } = useI18n();
const router = useRouter();

const activeTab = ref<'docs' | 'guides' | 'faq' | 'contact'>('docs');
const searchQuery = ref('');
const chapterFilterQuery = ref('');
const selectedChapterId = ref('intro');
const isSubmittingTicket = ref(false);

const quickChips = computed(() => [
    { label: locale.value === 'en' ? '4-Step Inspection Workflow' : 'Cycle Inspection 4 Étapes', id: 'workflow' },
    { label: locale.value === 'en' ? 'Compliance Checklists' : 'Checklists Réglementaires', id: 'checklists' },
    { label: locale.value === 'en' ? 'Managerial Visits (VMC)' : 'Visites VMC (6 Types)', id: 'vmc' },
    { label: locale.value === 'en' ? 'Fire Safety & Extinguishers' : 'Extincteurs & Incendie', id: 'equipment' },
    { label: locale.value === 'en' ? 'Corrective Action Plans' : 'Actions Correctives', id: 'actions' },
    { label: locale.value === 'en' ? '4 Site Types (SS, MAG, AG, SIEGE)' : '4 Types de Sites (SS, MAG, AG, SIEGE)', id: 'sites' },
    { label: locale.value === 'en' ? 'Emergency Rescue (15 km)' : 'Secours & Urgences (15 km)', id: 'emergency' },
    { label: locale.value === 'en' ? 'Mobile Field App' : 'Application Mobile Terrain', id: 'mobile' },
]);

function selectChapterById(id: string) {
    activeTab.value = 'docs';
    selectedChapterId.value = id;
}

function printDocumentation() {
    window.print();
}

const tabs = computed<{ id: 'docs' | 'guides' | 'faq' | 'contact'; label: string; icon: any; badge?: string }[]>(() => [
    { id: 'docs', label: locale.value === 'en' ? 'Full Manual (15 Chapters)' : 'Manuel Complet (15 Chapitres)', icon: BookOpen, badge: '15' },
    { id: 'guides', label: locale.value === 'en' ? 'Workflows & Modules' : 'Processus & Modules', icon: ClipboardCheck, badge: '6' },
    { id: 'faq', label: locale.value === 'en' ? 'FAQ' : 'Questions Fréquentes (FAQ)', icon: HelpCircleIcon, badge: '8' },
    { id: 'contact', label: locale.value === 'en' ? 'Support & Hotline' : 'Assistance & Urgences 24/7', icon: MessageSquare },
]);

// =========================================================================
// DONNÉES BILINGUES RÉACTIVES (FR & EN)
// =========================================================================
const docChapters = computed<DocChapter[]>(() => getDocChapters(locale.value));
const modules = computed<HelpModule[]>(() => getHelpModules(locale.value));

const filteredDocChapters = computed(() => {
    let list = docChapters.value;
    if (chapterFilterQuery.value.trim()) {
        const cq = chapterFilterQuery.value.toLowerCase().trim();
        list = list.filter(c => c.title.toLowerCase().includes(cq) || c.category.toLowerCase().includes(cq));
    }
    if (searchQuery.value.trim()) {
        const q = searchQuery.value.toLowerCase().trim();
        list = list.filter(c =>
            c.title.toLowerCase().includes(q) ||
            c.summary.toLowerCase().includes(q) ||
            c.category.toLowerCase().includes(q) ||
            c.sections.some(s =>
                s.heading.toLowerCase().includes(q) ||
                s.body.toLowerCase().includes(q) ||
                (s.bullets && s.bullets.some(b => b.toLowerCase().includes(q)))
            )
        );
    }
    return list;
});

const currentChapter = computed(() => {
    return filteredDocChapters.value.find(c => c.id === selectedChapterId.value) || filteredDocChapters.value[0];
});

const prevChapter = computed(() => {
    const list = filteredDocChapters.value;
    const idx = list.findIndex(c => c.id === currentChapter.value?.id);
    return idx > 0 ? list[idx - 1] : null;
});

const nextChapter = computed(() => {
    const list = filteredDocChapters.value;
    const idx = list.findIndex(c => c.id === currentChapter.value?.id);
    return idx >= 0 && idx < list.length - 1 ? list[idx + 1] : null;
});

// =========================================================================
// 2. MODULES ET GUIDES OPÉRATIONNELS (VUE SYNTHÉTIQUE)
// =========================================================================
const filteredModules = computed(() => {
    if (!searchQuery.value.trim()) return modules.value;
    const q = searchQuery.value.toLowerCase().trim();
    return modules.value.filter(m =>
        m.title.toLowerCase().includes(q) ||
        m.description.toLowerCase().includes(q) ||
        m.tag.toLowerCase().includes(q) ||
        m.keyPoints.some(p => p.toLowerCase().includes(q))
    );
});

// =========================================================================
// 3. FOIRE AUX QUESTIONS (FAQ) BILINGUE RÉACTIVE
// =========================================================================
const faqs = ref<FaqItem[]>(getInitialFaqs(locale.value));

watch(locale, (newLoc) => {
    const openStates = faqs.value.map(f => f.isOpen);
    const updated = getInitialFaqs(newLoc);
    updated.forEach((item, idx) => {
        if (openStates[idx] !== undefined) {
            item.isOpen = openStates[idx];
        }
    });
    faqs.value = updated;
});

const allFaqsOpen = computed(() => faqs.value.every(f => f.isOpen));

function toggleAllFaqs() {
    const target = !allFaqsOpen.value;
    faqs.value.forEach(f => { f.isOpen = target; });
}

const filteredFaqs = computed(() => {
    if (!searchQuery.value.trim()) return faqs.value;
    const q = searchQuery.value.toLowerCase().trim();
    return faqs.value.filter(f =>
        f.question.toLowerCase().includes(q) ||
        f.answer.toLowerCase().includes(q)
    );
});

// =========================================================================
// 4. FORMULAIRE DE TICKET SUPPORT AVEC MULTI-PHOTOS OPTIONNELLES
// =========================================================================
interface TicketPhoto {
    id: string;
    file: File;
    name: string;
    size: string;
    preview: string;
}

const photoInputRef = ref<HTMLInputElement | null>(null);
const isDragging = ref(false);

const ticketForm = ref({
    category: 'PROCEDURE_HSSE',
    priority: 'MEDIUM',
    subject: '',
    description: '',
    photos: [] as TicketPhoto[]
});

function handleFilesProcess(files: FileList | File[]) {
    const fileList = Array.from(files);
    const MAX_PHOTOS = 6;
    const MAX_SIZE = 5 * 1024 * 1024; // 5 Mo

    for (const file of fileList) {
        if (ticketForm.value.photos.length >= MAX_PHOTOS) {
            toast.warning(
                locale.value === 'en'
                    ? `Maximum of ${MAX_PHOTOS} photos allowed`
                    : `Limite maximale de ${MAX_PHOTOS} photos atteinte`
            );
            break;
        }

        if (!file.type.startsWith('image/')) {
            toast.error(
                locale.value === 'en'
                    ? `"${file.name}" is not an image file (PNG, JPG, WEBP only)`
                    : `"${file.name}" n’est pas un fichier image valide (PNG, JPG, WEBP uniquement)`
            );
            continue;
        }

        if (file.size > MAX_SIZE) {
            toast.error(
                locale.value === 'en'
                    ? `"${file.name}" exceeds the 5 MB limit`
                    : `"${file.name}" dépasse la taille maximale autorisée de 5 Mo`
            );
            continue;
        }

        // Éviter les doublons exacts
        const isDuplicate = ticketForm.value.photos.some(
            p => p.name === file.name && p.file.size === file.size
        );
        if (isDuplicate) {
            continue;
        }

        const sizeFormatted = file.size > 1024 * 1024
            ? (file.size / (1024 * 1024)).toFixed(1) + ' MB'
            : Math.round(file.size / 1024) + ' KB';

        const photoId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

        const reader = new FileReader();
        reader.onload = (e) => {
            ticketForm.value.photos.push({
                id: photoId,
                file,
                name: file.name,
                size: sizeFormatted,
                preview: e.target?.result as string
            });
        };
        reader.readAsDataURL(file);
    }
}

function handlePhotoChange(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
        handleFilesProcess(target.files);
    }
    target.value = '';
}

function handlePhotoDrop(event: DragEvent) {
    isDragging.value = false;
    if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
        handleFilesProcess(event.dataTransfer.files);
    }
}

function removePhoto(index: number) {
    if (index >= 0 && index < ticketForm.value.photos.length) {
        ticketForm.value.photos.splice(index, 1);
    }
}

function clearAllPhotos() {
    ticketForm.value.photos = [];
    if (photoInputRef.value) {
        photoInputRef.value.value = '';
    }
}

function submitSupportTicket() {
    if (!ticketForm.value.subject || !ticketForm.value.description) return;
    isSubmittingTicket.value = true;

    setTimeout(() => {
        isSubmittingTicket.value = false;
        const count = ticketForm.value.photos.length;
        if (count > 0) {
            toast.success(
                locale.value === 'en'
                    ? `Your support request with ${count} ${count > 1 ? 'attachments' : 'attachment'} has been submitted to the HSSE team!`
                    : `Votre demande d’assistance avec ${count} ${count > 1 ? 'pièces jointes' : 'pièce jointe'} a bien été transmise à l’équipe support HSSE Galana !`
            );
        } else {
            toast.success(
                locale.value === 'en'
                    ? 'Your support request has been submitted to the HSSE team!'
                    : 'Votre demande d’assistance a été transmise à l’équipe support HSSE Galana !'
            );
        }
        clearAllPhotos();
        ticketForm.value = {
            category: 'PROCEDURE_HSSE',
            priority: 'MEDIUM',
            subject: '',
            description: '',
            photos: []
        };
    }, 800);
}
</script>

<style scoped>
@keyframes spin-slow {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
}
.animate-spin-slow {
    animation: spin-slow 12s linear infinite;
}

@media print {
    body {
        background: white !important;
    }
    header, button, input {
        display: none !important;
    }
}
</style>
