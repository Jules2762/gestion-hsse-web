<template>
    <header class="sticky top-0 z-30 flex h-16 w-full flex-col border-b border-slate-200/80 bg-white/95 backdrop-blur-md shadow-[0_1px_3px_0_rgba(15,23,42,0.03)] transition-all">
        <div class="flex h-16 flex-row items-center justify-between gap-x-4 px-4 sm:px-6">
            <!-- ============================================================ -->
            <!-- SECTION GAUCHE : IDENTITÉ DE PAGE & FIL D'ARIANE -->
            <!-- ============================================================ -->
            <div class="flex min-w-0 flex-col justify-center">
                <!-- Cas 1 : Avec fil d'Ariane (Breadcrumbs) -->
                <template v-if="thumbnails?.length">
                    <nav :aria-label="t('header.breadcrumb')" class="mb-0.5">
                        <ol class="flex flex-row items-center gap-x-1.5 text-[11px] font-medium text-slate-400">
                            <li v-for="(item, index) in thumbnails" :key="item.name" class="flex items-center gap-x-1.5">
                                <button type="button"
                                    class="transition-colors hover:text-slate-700 cursor-pointer"
                                    :class="isActive(item.name) ? 'text-primary font-bold' : 'text-slate-400 hover:text-slate-600'"
                                    :aria-current="isActive(item.name) ? 'page' : undefined"
                                    @click="router.push({ name: item.name })">
                                    {{ translate(item.label) }}
                                </button>
                                <ChevronRight v-if="index < thumbnails.length - 1" :size="12" class="text-slate-300 shrink-0" aria-hidden="true" />
                            </li>
                        </ol>
                    </nav>

                    <div class="flex items-center gap-2">
                        <div v-if="pageIcon" class="w-6 h-6 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                            <component :is="pageIcon" :size="14" />
                        </div>
                        <h1 v-if="title" class="truncate font-bold text-base sm:text-lg text-slate-900 tracking-tight leading-snug">
                            {{ translate(title) }}
                        </h1>
                    </div>
                </template>

                <!-- Cas 2 : Titre principal sans fil d'Ariane (Ex: Dashboard, Settings) -->
                <template v-else>
                    <div class="flex items-center gap-3">
                        <div v-if="pageIcon" class="w-9 h-9 rounded-xl bg-gradient-to-br from-primary/15 via-primary/8 to-primary/5 text-primary flex items-center justify-center shrink-0 ring-1 ring-primary/20 shadow-2xs">
                            <component :is="pageIcon" :size="18" />
                        </div>
                        <div class="flex flex-col min-w-0">
                            <h1 v-if="title" class="truncate font-bold text-base sm:text-lg text-slate-900 tracking-tight leading-tight">
                                {{ translate(title) }}
                            </h1>
                            <p class="text-[11px] text-slate-400 font-medium truncate hidden sm:block">
                                {{ headerSubtitle }}
                            </p>
                        </div>
                    </div>
                </template>
            </div>

            <!-- ============================================================ -->
            <!-- SECTION CENTRALE : STATUT SYSTÈME & DATE (DESKTOP) -->
            <!-- ============================================================ -->
            <div class="hidden xl:flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-slate-50/80 border border-slate-200/60 shadow-2xs">
                <span class="flex h-2 w-2 relative">
                    <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span class="text-xs font-bold text-slate-700 tracking-tight">Galana HSSE</span>
                <span class="text-slate-300">•</span>
                <span class="text-xs text-slate-500 font-medium capitalize">{{ formattedDate }}</span>
            </div>

            <!-- ============================================================ -->
            <!-- SECTION DROITE : RECHERCHE + LANGUE + NOTIFICATIONS + PROFIL -->
            <!-- ============================================================ -->
            <div class="flex flex-row items-center gap-x-2 sm:gap-x-3 shrink-0">
                <!-- Champ de recherche optionnel -->
                <form v-if="showSearch" role="search" class="w-48 sm:w-64 lg:w-72" @submit.prevent>
                    <Input :icon="SearchIcon" v-model="search" :placeholder="t('header.search')"
                        :aria-label="t('header.search')" />
                </form>

                <!-- Sélecteur de langue -->
                <div class="relative" ref="langDropdownRef">
                    <button
                        type="button"
                        @click="langDropdownOpen = !langDropdownOpen"
                        class="h-9 flex items-center gap-1.5 px-2.5 sm:px-3 rounded-xl border border-slate-200/80 bg-slate-50/70 hover:bg-slate-100 hover:border-slate-300 text-xs font-semibold text-slate-700 shadow-2xs transition-all cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
                        :title="locale === 'fr' ? 'Changer de langue' : 'Switch language'"
                    >
                        <span class="text-sm select-none leading-none">{{ locale === 'fr' ? '🇫🇷' : '🇬🇧' }}</span>
                        <span class="uppercase font-bold tracking-wider text-[11px] text-slate-700">{{ locale }}</span>
                        <ChevronDown :size="12" class="text-slate-400 transition-transform duration-200 shrink-0" :class="langDropdownOpen ? 'rotate-180' : ''" />
                    </button>

                    <div
                        v-if="langDropdownOpen"
                        class="absolute right-0 mt-2 w-40 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-slate-100 p-1.5 z-50 animate-in fade-in zoom-in-95 duration-100 ring-1 ring-black/5"
                    >
                        <button
                            type="button"
                            @click="switchLocale('fr')"
                            class="w-full text-left px-3 py-2 text-xs font-medium rounded-xl hover:bg-slate-100 flex items-center justify-between cursor-pointer transition-colors"
                            :class="locale === 'fr' ? 'text-primary font-bold bg-primary/8' : 'text-slate-700'"
                        >
                            <div class="flex items-center gap-2.5">
                                <span class="text-base">🇫🇷</span>
                                <span>Français</span>
                            </div>
                            <Check v-if="locale === 'fr'" :size="14" class="text-primary font-bold" />
                        </button>

                        <button
                            type="button"
                            @click="switchLocale('en')"
                            class="w-full text-left px-3 py-2 text-xs font-medium rounded-xl hover:bg-slate-100 flex items-center justify-between cursor-pointer transition-colors"
                            :class="locale === 'en' ? 'text-primary font-bold bg-primary/8' : 'text-slate-700'"
                        >
                            <div class="flex items-center gap-2.5">
                                <span class="text-base">🇬🇧</span>
                                <span>English</span>
                            </div>
                            <Check v-if="locale === 'en'" :size="14" class="text-primary font-bold" />
                        </button>
                    </div>
                </div>

                <!-- Bouton Notifications -->
                <button
                    type="button"
                    @click="modalRight = true"
                    class="relative h-9 w-9 rounded-xl border border-slate-200/80 bg-slate-50/70 hover:bg-slate-100 hover:border-slate-300 transition-all flex items-center justify-center text-slate-600 hover:text-slate-900 shadow-2xs cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
                    :title="t('header.notifications.open', { count: unreadCount })"
                    :aria-label="t('header.notifications.open', { count: unreadCount })"
                >
                    <BellIcon :size="16" class="transition-transform duration-150" />
                    <span
                        v-if="unreadCount > 0"
                        class="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-600 px-1 text-[9px] font-bold leading-none text-white shadow-xs ring-2 ring-white animate-pulse"
                    >
                        {{ unreadCount > 9 ? '9+' : unreadCount }}
                    </span>
                </button>

                <!-- Séparateur vertical -->
                <div class="h-5 w-px bg-slate-200/80 mx-0.5 sm:mx-1 hidden sm:block"></div>

                <!-- Menu Profil Utilisateur -->
                <div class="relative" ref="userDropdownRef">
                    <button
                        type="button"
                        @click="userDropdownOpen = !userDropdownOpen"
                        class="h-10 flex items-center gap-2.5 pl-1.5 pr-2.5 sm:pr-3 rounded-2xl border border-slate-200/80 bg-slate-50/70 hover:bg-slate-100/80 hover:border-slate-300 shadow-2xs transition-all cursor-pointer group focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
                        :aria-label="t('header.profile')"
                    >
                        <!-- Avatar avec indicateur en ligne -->
                        <div class="relative shrink-0">
                            <img
                                v-if="currentUser?.image_path || currentUser?.avatar"
                                :src="currentUser.image_path || currentUser.avatar"
                                alt="Avatar"
                                class="h-7 w-7 rounded-xl object-cover ring-2 ring-white shadow-xs"
                            />
                            <div
                                v-else
                                class="h-7 w-7 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-primary text-white font-bold text-xs flex items-center justify-center shadow-xs ring-2 ring-white select-none"
                            >
                                {{ userInitials }}
                            </div>
                            <span class="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 ring-1.5 ring-white"></span>
                        </div>

                        <!-- Nom & Rôle en 2 lignes -->
                        <div class="hidden sm:flex flex-col text-left max-w-[170px] min-w-0">
                            <span class="text-xs font-bold text-slate-800 truncate leading-tight group-hover:text-primary transition-colors">
                                {{ userDisplayName }}
                            </span>
                            <span class="text-[10px] font-medium text-slate-400 truncate leading-tight mt-0.5">
                                {{ userRoleLabel }}
                            </span>
                        </div>

                        <ChevronDown
                            :size="13"
                            class="text-slate-400 group-hover:text-slate-600 transition-transform duration-200 shrink-0 ml-0.5"
                            :class="userDropdownOpen ? 'rotate-180' : ''"
                        />
                    </button>

                    <!-- Menu Déroulant Profil -->
                    <div
                        v-if="userDropdownOpen"
                        class="absolute right-0 mt-2 w-64 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-100 p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150 ring-1 ring-black/5 overflow-hidden"
                    >
                        <!-- Carte d'en-tête utilisateur -->
                        <div class="p-3 rounded-xl bg-slate-50/80 border border-slate-100 mb-1">
                            <div class="flex items-center gap-2.5">
                                <div class="relative shrink-0">
                                    <img
                                        v-if="currentUser?.image_path || currentUser?.avatar"
                                        :src="currentUser?.image_path || currentUser?.avatar"
                                        alt="Avatar"
                                        class="h-9 w-9 rounded-xl object-cover ring-2 ring-white shadow-xs"
                                    />
                                    <div
                                        v-else
                                        class="h-9 w-9 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-primary text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs"
                                    >
                                        {{ userInitials }}
                                    </div>
                                </div>
                                <div class="min-w-0 flex-1">
                                    <p class="text-xs font-bold text-slate-800 truncate leading-tight" :title="userFullName">
                                        {{ userFullName }}
                                    </p>
                                    <p class="text-[11px] text-slate-500 truncate mt-0.5" :title="userEmail">
                                        {{ userEmail }}
                                    </p>
                                </div>
                            </div>
                            <div class="mt-2.5 pt-2 border-t border-slate-200/60 flex items-center justify-between">
                                <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary">
                                    <span class="w-1.5 h-1.5 rounded-full bg-primary"></span>
                                    {{ userRoleLabel }}
                                </span>
                                <span class="text-[10px] text-slate-400 font-medium">Galana Madagascar</span>
                            </div>
                        </div>

                        <!-- Actions de menu -->
                        <div class="py-1 space-y-0.5">
                            <button
                                type="button"
                                @click="userDropdownOpen = false; router.push({ name: 'PROFILE' })"
                                class="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900 rounded-xl flex items-center gap-2.5 cursor-pointer transition-colors"
                            >
                                <User2Icon :size="15" class="text-slate-400" />
                                <span>{{ t('thumbnails.profile', 'Mon profil') }}</span>
                            </button>

                            <button
                                type="button"
                                @click="userDropdownOpen = false; router.push({ name: 'SETTING' })"
                                class="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900 rounded-xl flex items-center gap-2.5 cursor-pointer transition-colors"
                            >
                                <Settings :size="15" class="text-slate-400" />
                                <span>{{ t('thumbnails.settings', 'Paramètres') }}</span>
                            </button>

                            <button
                                type="button"
                                @click="userDropdownOpen = false; router.push({ name: 'HELP_CENTER' })"
                                class="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900 rounded-xl flex items-center gap-2.5 cursor-pointer transition-colors"
                            >
                                <HelpCircleIcon :size="15" class="text-slate-400" />
                                <span>{{ t('sidebar.help center', 'Centre d\'aide') }}</span>
                            </button>
                        </div>

                        <!-- Déconnexion -->
                        <div class="border-t border-slate-100 pt-1 mt-1">
                            <button
                                type="button"
                                @click="logoutModal = true; userDropdownOpen = false"
                                class="w-full text-left px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50/80 rounded-xl flex items-center gap-2.5 cursor-pointer transition-colors"
                            >
                                <LogOut :size="15" class="text-rose-500" />
                                <span>{{ t('sidebar.logout', 'Se déconnecter') }}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Panneau de notifications -->
        <Teleport to="body">
            <RightModal :is-open="modalRight" @on-close="closeNotifications">
                <div class="flex h-full flex-col" @keydown.esc="closeNotifications">
                    <div class="flex items-start justify-between gap-x-3 border-b border-slate-200 p-4 shrink-0 bg-white">
                        <div class="min-w-0 flex-1">
                            <h3 class="font-bold text-slate-800 text-sm">{{ t('header.notifications.title') }}</h3>
                            <p class="mt-0.5 text-xs text-slate-500 truncate">{{ t('header.notifications.subtitle') }}</p>
                        </div>
                        <div class="flex items-center gap-1.5 shrink-0">
                            <button v-if="unreadCount > 0" type="button"
                                class="shrink-0 text-xs font-semibold text-primary hover:underline cursor-pointer"
                                @click="notifications.markAllRead()">
                                {{ t('header.notifications.markAllRead') }}
                            </button>
                            <button v-if="items.length > 0" type="button"
                                class="shrink-0 text-slate-400 hover:text-red-600 transition-colors p-1.5 rounded-md hover:bg-slate-100 cursor-pointer"
                                :title="t('header.notifications.delete')"
                                @click="notifications.clearAll()">
                                <Trash2Icon :size="15" />
                            </button>
                            <button
                                type="button"
                                @click="closeNotifications"
                                class="shrink-0 text-slate-400 hover:text-slate-700 transition-colors p-1.5 rounded-md hover:bg-slate-100 cursor-pointer"
                                title="Fermer (Échap)"
                            >
                                <XIcon :size="18" />
                            </button>
                        </div>
                    </div>

                    <ul v-if="items.length" class="flex-1 overflow-y-auto divide-y divide-slate-100">
                        <li v-for="(value, index) in items" :key="value.id || index"
                            class="group relative p-4 transition-colors hover:bg-slate-50 cursor-pointer"
                            :class="value.viewed ? 'bg-white' : 'bg-primary/5'"
                            @click="handleNotificationClick(value)">
                            <div class="flex items-start justify-between gap-x-3">
                                <div class="min-w-0 flex-1">
                                    <div class="flex items-center gap-2 mb-1">
                                        <span v-if="value.type"
                                            class="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold tracking-wide"
                                            :class="getTypeBadgeClass(value.type)">
                                            {{ value.type }}
                                        </span>
                                        <span v-if="!value.viewed"
                                            class="inline-block h-2 w-2 rounded-full bg-red-600"
                                            role="img" :aria-label="t('header.notifications.unread')"></span>
                                    </div>
                                    <h5 class="text-xs font-semibold text-slate-800 leading-snug">
                                        {{ value.title }}
                                    </h5>
                                    <p v-if="value.description" class="mt-1 text-xs text-slate-600 line-clamp-2">
                                        {{ value.description }}
                                    </p>
                                    <div class="mt-2 flex items-center justify-between text-[11px] text-slate-400">
                                        <span>{{ value.ago }}</span>
                                        <span v-if="value.link" class="text-primary font-medium group-hover:underline">
                                            Consulter &rarr;
                                        </span>
                                    </div>
                                </div>

                                <button type="button"
                                    class="shrink-0 rounded p-1 text-slate-400 transition-opacity hover:text-red-600 focus-visible:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary md:opacity-0 md:group-hover:opacity-100"
                                    :aria-label="t('header.notifications.delete')"
                                    @click.stop="notifications.deleteOne(value.id || index)">
                                    <Trash2Icon :size="14" />
                                </button>
                            </div>
                        </li>
                    </ul>

                    <div v-else class="flex flex-1 flex-col items-center justify-center gap-3 p-6">
                        <div class="p-3 bg-slate-50 rounded-full text-slate-400">
                            <BellIcon :size="36" aria-hidden="true" />
                        </div>
                        <div class="text-center">
                            <h4 class="text-sm font-semibold text-slate-700">{{ t('header.notifications.emptyTitle') }}</h4>
                            <p class="mt-1 text-xs text-slate-500">{{ t('header.notifications.emptyText') }}</p>
                        </div>
                    </div>
                </div>
            </RightModal>
        </Teleport>

        <!-- Modale de confirmation déconnexion -->
        <CenterModal
            :is-open="logoutModal"
            :title="t('confirm logout')"
            :confirm-title="t('sidebar.logout')"
            :cancel-title="t('common.cancel')"
            title-variant="danger"
            confirm-variant="danger"
            :confirm-loading="isLoggingOut"
            @confirm="handleHeaderLogout"
            @close="logoutModal = false"
        >
            <div class="space-y-3 py-2 text-slate-700">
                <p class="text-sm font-medium">
                    {{ t('logout message') }}
                </p>
                <p class="text-xs text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                    {{ t('logout warning') }}
                </p>
            </div>
        </CenterModal>
    </header>
</template>

<script setup lang="ts">
    import {
        Activity,
        BellIcon,
        Check,
        CheckSquare,
        ChevronDown,
        ChevronRight,
        ClipboardCheck,
        FileText,
        Globe,
        HelpCircleIcon,
        GraduationCap,
        KeyRound,
        LayoutDashboard,
        LogOut,
        PhoneCall,
        SearchIcon,
        Settings,
        ShieldCheck,
        Trash2Icon,
        User2Icon,
        Users,
        Wrench,
        XIcon
    } from '@lucide/vue';
    import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
    import { useRoute, useRouter } from 'vue-router';
    import { useI18n } from 'vue-i18n';
    import Input from '../ui/Input.vue';
    import RightModal from '../ui/rightModal.vue';
    import CenterModal from '../ui/centerModal.vue';
    import { useNotificationStore } from '../../services/useNotificationStore.ts';
    import { useAuthService } from '../../core/services/auth.service';
    import { useUserService } from '../../core/services/user.service';

    type Thumbnail = { label: string; name: string };

    const props = defineProps<{
        title?: string;
        showSearch?: boolean;
        thumbnails?: Thumbnail[];
        modelValue?: string;
    }>();
    const emit = defineEmits<{ (e: 'update:modelValue', value: string | undefined): void }>();

    const { t, te, locale } = useI18n();
    const router = useRouter();
    const route = useRoute();
    const notifications = useNotificationStore();
    const authService = useAuthService();
    const userService = useUserService();

    const modalRight = ref(false);
    const langDropdownOpen = ref(false);
    const langDropdownRef = ref<HTMLElement | null>(null);

    const userDropdownOpen = ref(false);
    const userDropdownRef = ref<HTMLElement | null>(null);
    const logoutModal = ref(false);
    const isLoggingOut = ref(false);

    const currentUser = computed<any>(() => authService.getUser || {});

    // Détection automatique de l'icône de la page selon la route ou le titre
    const pageIcon = computed(() => {
        const rName = (route.name as string || '').toUpperCase();
        const tKey = (props.title || '').toLowerCase();

        if (rName.includes('DASHBOARD') || tKey.includes('dashboard')) return LayoutDashboard;
        if (rName.includes('CHECKLIST') || tKey.includes('checklist')) return ClipboardCheck;
        if (rName.includes('VMC') || tKey.includes('vmc')) return ShieldCheck;
        if (rName.includes('EQUIPMENT') || tKey.includes('equipment') || tKey.includes('matériel')) return Wrench;
        if (rName.includes('FORMATION') || tKey.includes('formation')) return GraduationCap;
        if (rName.includes('ACTION') || tKey.includes('action')) return CheckSquare;
        if (rName.includes('USER') || rName.includes('PERSONNEL') || tKey.includes('user') || tKey.includes('personnel')) return Users;
        if (rName.includes('ACTIVITY') || tKey.includes('activity')) return Activity;
        if (rName.includes('ROLE') || tKey.includes('role')) return KeyRound;
        if (rName.includes('EMERGENCY') || tKey.includes('emergency')) return PhoneCall;
        if (rName.includes('DOCUMENT') || tKey.includes('document')) return FileText;
        if (rName.includes('SETTING') || tKey.includes('setting')) return Settings;
        if (rName.includes('PROFILE') || tKey.includes('profile')) return User2Icon;
        if (rName.includes('HELP') || tKey.includes('help') || tKey.includes('aide')) return HelpCircleIcon;
        return null;
    });

    // Sous-titre contextuel lorsque sur une vue racine sans fil d'Ariane
    const headerSubtitle = computed(() => {
        const rName = (route.name as string || '').toUpperCase();
        if (rName.includes('DASHBOARD')) {
            return locale.value === 'en'
                ? 'Galana HSSE Supervision & Real-time KPIs'
                : 'Supervision & indicateurs de performance HSSE Galana';
        }
        if (rName.includes('CHECKLIST')) {
            return locale.value === 'en' ? 'Field compliance inspections' : 'Contrôles périodiques et audits terrain';
        }
        if (rName.includes('VMC')) {
            return locale.value === 'en' ? 'Visible Management Commitment' : 'Visites Managériales de Conformité';
        }
        if (rName.includes('EQUIPMENT')) {
            return locale.value === 'en' ? 'Fire safety & equipment registry' : 'Suivi du parc matériel & sécurité incendie';
        }
        if (rName.includes('HELP')) {
            return locale.value === 'en' ? 'Knowledge base, guides & HSSE support' : 'Base de connaissances, guides & assistance HSSE';
        }
        if (rName.includes('FORMATION')) {
            return locale.value === 'en' ? 'HSSE Training plans & certifications' : 'Plan de formations & habilitations HSSE';
        }
        return locale.value === 'en' ? 'Galana Madagascar • HSSE Platform' : 'Galana Madagascar • Plateforme HSSE';
    });

    // Date actuelle formattée
    const formattedDate = computed(() => {
        const d = new Date();
        if (locale.value === 'en') {
            return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
        }
        return d.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
    });

    const userFullName = computed(() => {
        const u = currentUser.value;
        const first = u?.first_name?.trim() || '';
        const last = u?.last_name?.trim() || '';
        const full = `${first} ${last}`.trim();
        if (full) return full;
        if (u?.email) return u.email;
        return 'Utilisateur';
    });

    const userDisplayName = computed(() => {
        const u = currentUser.value;
        const first = u?.first_name?.trim() || '';
        const last = u?.last_name?.trim() || '';
        const full = `${first} ${last}`.trim();
        if (full) return full;
        if (u?.email) {
            return u.email.split('@')[0];
        }
        return 'Utilisateur';
    });

    const userEmail = computed(() => {
        const u = currentUser.value;
        return u?.email || 'utilisateur@galana.mg';
    });

    const userInitials = computed(() => {
        const u = currentUser.value;
        const f = u?.first_name?.trim() ? u.first_name.trim()[0] : (u?.email ? u.email[0] : 'U');
        const l = u?.last_name?.trim() ? u.last_name.trim()[0] : '';
        return `${f}${l}`.toUpperCase();
    });

    const userRoleLabel = computed(() => {
        const u = currentUser.value;
        if (u?.job) return u.job;
        const r = (u?.role || '').toUpperCase();
        if (r === 'ADMIN') return locale.value === 'en' ? 'Administrator' : 'Administrateur';
        if (r === 'RESPONSABLE_HSSE' || r === 'HSSE') return locale.value === 'en' ? 'HSSE Officer' : 'Responsable HSSE';
        return locale.value === 'en' ? 'Collaborator' : 'Collaborateur';
    });

    async function handleHeaderLogout() {
        isLoggingOut.value = true;
        try {
            await authService.logout();
        } catch (err) {
            console.error('Erreur lors de la déconnexion :', err);
        } finally {
            isLoggingOut.value = false;
            logoutModal.value = false;
            userDropdownOpen.value = false;
            sessionStorage.removeItem('gestion-hsse-token');
            localStorage.removeItem('gestion-hsse-token');
            router.push({ name: 'LOGIN' });
        }
    }

    const switchLocale = (newLocale: string) => {
        locale.value = newLocale;
        localStorage.setItem('language', newLocale);
        langDropdownOpen.value = false;
    };

    const onDocumentClick = (e: MouseEvent) => {
        if (langDropdownRef.value && !langDropdownRef.value.contains(e.target as Node)) {
            langDropdownOpen.value = false;
        }
        if (userDropdownRef.value && !userDropdownRef.value.contains(e.target as Node)) {
            userDropdownOpen.value = false;
        }
    };

    const translate = (key?: string) => {
        if (!key) return '';
        if ((te as any)(key)) return (t as any)(key);
        // Translation mapping fallback for common legacy labels
        const fallbackMap: Record<string, string> = {
            'Accueil': t('thumbnails.home'),
            'Home': t('thumbnails.home'),
            'Inspection': t('thumbnails.inspection'),
            'Inspections': t('thumbnails.inspections'),
            'Actions correctives': t('thumbnails.actions'),
            'Checklist': t('thumbnails.checklists'),
            'Checklists': t('thumbnails.checklists'),
            'Suivi du matériel': t('thumbnails.equipment-monitoring'),
            'VMC': t('thumbnails.vmc'),
            'Visible Management Commitment': t('inspections.vmc.title'),
            'Templates': t('thumbnails.templates'),
            'Personnel': t('thumbnails.personnels'),
            'Personnels': t('thumbnails.personnels'),
            'Administration': t('thumbnails.administration'),
            'Users': t('thumbnails.users'),
            'Utilisateurs': t('thumbnails.users'),
            'Activités': t('thumbnails.activity'),
            'Rôle et permissions': t('thumbnails.roles'),
            'Bibliothèque de documents': t('thumbnails.document library'),
            'Bibliothèque documentaire': t('thumbnails.document library'),
            'Contacts d\'urgence & Secours': t('emergency.title'),
            'Profil': t('thumbnails.profile'),
            'Paramètres': t('thumbnails.settings'),
            'Nouveau': t('thumbnails.new'),
            'Modification': t('thumbnails.update'),
            'Détails': t('thumbnails.details'),
            'Gestion des actions correctives': t('inspections.actions.title'),
            'Fiche checklist': t('inspections.checklists.details'),
            'Nouveau inspection': t('inspections.checklists.new'),
            'Détails du suivi matériel': t('inspections.equipment-monitoring.details'),
            'Planifier un suivi des équipements': t('inspections.equipment-monitoring.new'),
            'Modifier le suivi des équipements': t('inspections.equipment-monitoring.update'),
            'Fiche VMC Officielle': t('inspections.vmc.details'),
            'Nouvelle VMC': t('inspections.vmc.new'),
            'Nouvelle formation': t('formation.new'),
            'Import Formation': t('formation.import_title'),
            'Participants': t('formation.participants'),
            'Nouveau membre du personnel': t('administration.personnels.new'),
            'Modifier un membre du personnel': t('administration.personnels.update'),
            'Nouveau compte utilisateur': t('administration.users.new'),
            'Mise à jour du compte utilisateur': t('administration.users.update'),
            'Mettre à jour le profil': t('profile.update'),
        };
        return fallbackMap[key] || key;
    };

    const search = computed({
        get: () => props.modelValue,
        set: (value) => emit('update:modelValue', value),
    });

    const items = computed(() => notifications.getData);
    const unreadCount = computed(() => notifications.getUnreadCount);

    const isActive = (name: string) => route.name === name;

    const closeNotifications = () => {
        modalRight.value = false;
    };

    const handleNotificationClick = async (notif: any) => {
        if (!notif.viewed && notif.id) {
            await notifications.markOneRead(notif.id);
        }
        modalRight.value = false;
        if (notif.link) {
            try {
                router.push({ name: notif.link });
            } catch (err) {
                // Ignore navigation error
            }
        }
    };

    const getTypeBadgeClass = (type: string) => {
        switch (type) {
            case 'ACTION':
                return 'bg-amber-100 text-amber-800 border border-amber-200';
            case 'CHECKLIST':
                return 'bg-blue-100 text-blue-800 border border-blue-200';
            case 'VMC':
                return 'bg-emerald-100 text-emerald-800 border border-emerald-200';
            case 'EQUIPMENT':
                return 'bg-purple-100 text-purple-800 border border-purple-200';
            case 'FORMATION':
                return 'bg-teal-100 text-teal-800 border border-teal-200';
            default:
                return 'bg-slate-100 text-slate-700 border border-slate-200';
        }
    };

    const syncCurrentUser = async () => {
        try {
            const meRes = await userService.me();
            const userData = meRes?.data?.data || meRes?.data;
            if (userData && (userData.first_name || userData.email || userData.id)) {
                authService.setUser(userData);
                return;
            }
        } catch {
            // me() error fallback
        }

        try {
            const profRes = await userService.getProfile();
            const userData = profRes?.data?.data || profRes?.data;
            if (userData && (userData.first_name || userData.email || userData.id)) {
                authService.setUser(userData);
            }
        } catch {
            // profile() error fallback
        }
    };

    onMounted(async () => {
        notifications.startRealtime();
        document.addEventListener('click', onDocumentClick);

        await syncCurrentUser();
    });

    onBeforeUnmount(() => {
        notifications.stopRealtime();
        document.removeEventListener('click', onDocumentClick);
    });
</script>
