<template>
    <div class="min-h-screen bg-background">

        <Header title="administration.personnels.update" :thumbnails="[
            { label: 'thumbnails.home', name: 'DASHBOARD' },
            { label: 'thumbnails.administration', name: 'ADMINISTRATION' },
            { label: 'thumbnails.personnels', name: 'PERSONNEL' },
            { label: 'thumbnails.update', name: 'PERSONNEL_UPDATE' }
        ]" />

        <div class="p-6 pb-0 lg:p-8 lg:pb-0">

            <!-- CHARGEMENT INITIAL -->
            <div v-if="loadingInitial" class="p-20 flex flex-col items-center justify-center gap-3 text-gray-500">
                <Loader2 :size="32" class="animate-spin text-primary" />
                <span class="text-sm">{{ locale === 'en' ? 'Loading personnel data...' : 'Chargement des données du personnel...' }}</span>
            </div>

            <!-- FORMULAIRE -->
            <form v-else class="flex flex-col gap-y-6" novalidate @submit.prevent="handleSubmit">

                <div class="grid grid-cols-1 items-start gap-6 lg:grid-cols-6">

                    <!-- CORPS DU FORMULAIRE -->
                    <div class="flex flex-col divide-y divide-border rounded-2xl border border-border bg-surface shadow-sm lg:col-span-4">

                        <!-- Identité -->
                        <section class="flex flex-col gap-4 p-6">
                            <div class="flex items-center gap-3">
                                <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-light text-primary">
                                    <IdCard class="h-4.5 w-4.5" />
                                </div>
                                <div>
                                    <h5 class="font-bold text-gray-900 text-sm">{{ locale === 'en' ? 'Identity' : 'Identité' }}</h5>
                                    <p class="text-xs text-text-muted">{{ locale === 'en' ? 'Personal information of the member.' : 'Informations personnelles du membre.' }}</p>
                                </div>
                            </div>

                            <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                <Input v-model="form.first_name" :label="locale === 'en' ? 'First name *' : 'Prénom *'" :icon="UserRound" :error="errors.first_name?.[0]" />
                                <Input v-model="form.last_name" :label="locale === 'en' ? 'Last name' : 'Nom'" :icon="UserRound" :error="errors.last_name?.[0]" />
                                <Input v-model="form.email" type="email" :label="locale === 'en' ? 'Email *' : 'E-mail *'" :icon="MailIcon" :error="errors.email?.[0]" class="sm:col-span-2" />
                            </div>
                        </section>

                        <!-- Affectation -->
                        <section class="flex flex-col gap-4 p-6">
                            <div class="flex items-center gap-3">
                                <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-light text-primary">
                                    <Building2Icon class="h-4.5 w-4.5" />
                                </div>
                                <div>
                                    <h5 class="font-bold text-gray-900 text-sm">{{ locale === 'en' ? 'Assignment' : 'Affectation' }}</h5>
                                    <p class="text-xs text-text-muted">{{ locale === 'en' ? 'Position held and organizational unit.' : 'Poste occupé et rattachement organisationnel.' }}</p>
                                </div>
                            </div>

                            <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                <Input
                                    v-model="form.fonction"
                                    :label="locale === 'en' ? 'Position *' : 'Fonction *'"
                                    :icon="Briefcase"
                                    list_id="fonction-lists"
                                    :lists="fonctions"
                                    :error="errors.fonction?.[0]"
                                    class="sm:col-span-2"
                                />
                                <Input v-model="form.direction" :label="locale === 'en' ? 'Department *' : 'Direction *'" :icon="Network" :error="errors.direction?.[0]" />
                                <Input v-model="form.entity" :label="locale === 'en' ? 'Entity *' : 'Entité *'" :icon="Building2Icon" :error="errors.entity?.[0]" />
                            </div>
                        </section>

                    </div>

                    <!-- APERÇU DE LA FICHE -->
                    <aside class="flex flex-col gap-5 rounded-2xl border border-border bg-surface p-6 shadow-sm lg:sticky lg:top-6 lg:col-span-2">

                        <div class="flex flex-col items-center gap-3 text-center">
                            <div class="flex h-16 w-16 items-center justify-center rounded-full bg-primary-light text-xl font-semibold text-primary ring-4 ring-primary/5">
                                <span v-if="initials">{{ initials }}</span>
                                <UserRound v-else class="h-7 w-7" />
                            </div>

                            <div class="min-w-0">
                                <p class="truncate text-base font-semibold text-text-primary">
                                    {{ fullName || "Personnel" }}
                                </p>
                                <p class="truncate text-sm text-text-muted">
                                    {{ form.fonction.trim() || (locale === 'en' ? 'Position not specified' : 'Fonction non renseignée') }}
                                </p>
                            </div>
                        </div>

                        <dl class="flex flex-col gap-2.5 rounded-xl bg-slate-50 p-4 text-xs">
                            <div class="flex items-center gap-2.5">
                                <dt class="text-text-muted shrink-0"><MailIcon class="h-3.5 w-3.5" /></dt>
                                <dd class="truncate text-gray-800 font-mono">{{ form.email.trim() || "—" }}</dd>
                            </div>
                            <div class="flex items-center gap-2.5">
                                <dt class="text-text-muted shrink-0"><Network class="h-3.5 w-3.5" /></dt>
                                <dd class="truncate text-gray-800">{{ form.direction.trim() || "—" }}</dd>
                            </div>
                            <div class="flex items-center gap-2.5">
                                <dt class="text-text-muted shrink-0"><Building2Icon class="h-3.5 w-3.5" /></dt>
                                <dd class="truncate text-gray-800">{{ form.entity.trim() || "—" }}</dd>
                            </div>
                        </dl>

                        <!-- BOUTONS D'ACTION -->
                        <div class="flex flex-col gap-2 pt-2 border-t border-border">
                            <Button :loading="isSubmitting" :disabled="isSubmitting" :left-icon="Save" type="submit" class="w-full">
                                {{ locale === 'en' ? 'Save changes' : 'Enregistrer les modifications' }}
                            </Button>
                            <Button variant="outline" type="button" @click="router.push({ name: 'PERSONNEL' })" class="w-full">
                                {{ locale === 'en' ? 'Cancel' : 'Annuler' }}
                            </Button>
                        </div>

                    </aside>

                </div>

            </form>

        </div>

    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import Header from '../../../components/shared/Header.vue';
import Input from '../../../components/ui/Input.vue';
import Button from '../../../components/ui/Button.vue';
import {
    Building2Icon,
    Briefcase,
    IdCard,
    MailIcon,
    Network,
    UserRound,
    Loader2,
    Save
} from '@lucide/vue';
import personnelService from '../../../core/services/personnel.service';
import { toast } from 'vue3-toastify';

const route = useRoute();
const router = useRouter();
const { t, locale } = useI18n();

const loadingInitial = ref(true);
const isSubmitting = ref(false);

const form = ref({
    first_name: '',
    last_name: '',
    email: '',
    fonction: '',
    direction: '',
    entity: '',
});

const errors = ref<Record<string, string[]>>({});
const fonctions = ref<string[]>([]);

const fullName = computed(() => {
    const f = form.value.first_name.trim();
    const l = form.value.last_name.trim();
    return [f, l].filter(Boolean).join(' ');
});

const initials = computed(() => {
    const f = form.value.first_name.trim();
    const l = form.value.last_name.trim();
    return ((f[0] || '') + (l[0] || '')).toUpperCase();
});

async function loadData() {
    loadingInitial.value = true;
    try {
        const id = route.params.id as string;
        const [resP, resF] = await Promise.allSettled([
            personnelService.show(id),
            personnelService.getFilters(),
        ]);

        if (resP.status === 'fulfilled' && resP.value?.data) {
            const d = resP.value.data.data ?? resP.value.data;
            form.value = {
                first_name: d.first_name || '',
                last_name: d.last_name || '',
                email: d.email || '',
                fonction: d.fonction || '',
                direction: d.direction || '',
                entity: d.entity || '',
            };
        }

        if (resF.status === 'fulfilled' && resF.value?.data?.fonction) {
            fonctions.value = resF.value.data.fonction;
        }
    } catch (e) {
        console.error('Erreur chargement personnel:', e);
        toast.error(locale.value === 'en' ? 'Unable to load personnel data' : 'Impossible de charger ce personnel');
    } finally {
        loadingInitial.value = false;
    }
}

async function handleSubmit() {
    isSubmitting.value = true;
    errors.value = {};
    try {
        const id = route.params.id as string;
        await personnelService.update(id, form.value);
        toast.success(locale.value === 'en' ? 'Personnel successfully updated' : 'Personnel mis à jour avec succès');
        router.push({ name: 'PERSONNEL' });
    } catch (e: any) {
        if (e.response?.status === 422) {
            errors.value = e.response.data.errors || {};
            toast.error(locale.value === 'en' ? 'Please fix the errors in the form' : 'Veuillez corriger les erreurs dans le formulaire');
        } else {
            console.error('Erreur mise à jour personnel:', e);
            toast.error(locale.value === 'en' ? 'Unable to update personnel' : 'Impossible de mettre à jour le personnel');
        }
    } finally {
        isSubmitting.value = false;
    }
}

onMounted(() => {
    loadData();
});
</script>
