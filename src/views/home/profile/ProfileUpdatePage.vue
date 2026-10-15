<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { router } from '../../../router/index.ts';
import Header from '../../../components/shared/Header.vue';
import Input from '../../../components/ui/Input.vue';
import Button from '../../../components/ui/Button.vue';
import {
    UserRound,
    MailIcon,
    Phone,
    Building2,
    Briefcase,
    Shield,
    FileText,
    ArrowLeft,
    CheckCircle2,
    Loader2
} from '@lucide/vue';
import { useUserService } from '../../../core/services/user.service.ts';
import { toast } from 'vue3-toastify';
import type { UserProfileUpdateFormType } from '../../../@types/User.type.ts';
import { UserRoleDataJson } from '../../../@data/User.data.ts';

const route = useRoute();
const userService = useUserService();

const isLoading = ref(true);
const isSubmitting = ref(false);
const loadError = ref('');

const currentUserId = ref<string | number>('');
const userReadOnly = reactive({
    email: '',
    department: '',
    job: '',
    role: '',
    status: '',
});

const form = reactive<UserProfileUpdateFormType>({
    first_name: '',
    last_name: '',
    phone_number: '',
    bio: '',
});

const errors = ref<Record<string, string[]>>({});

const fullName = computed(() => {
    const name = `${form.first_name || ''} ${form.last_name || ''}`.trim();
    return name.length > 0 ? name : 'Utilisateur Galana';
});

const userInitials = computed(() => {
    const f = form.first_name ? form.first_name[0] : 'U';
    const l = form.last_name ? form.last_name[0] : '';
    return `${f}${l}`.toUpperCase();
});

const roleLabel = computed(() => {
    const found = UserRoleDataJson.find(r => r.value === userReadOnly.role);
    return found ? found.label : (userReadOnly.role || 'Utilisateur');
});

async function loadProfile() {
    isLoading.value = true;
    loadError.value = '';
    try {
        const id = route.params.id as string | undefined;
        const res = await userService.getProfile(id);
        const data = res.data;

        currentUserId.value = data.id;
        form.first_name = data.first_name || '';
        form.last_name = data.last_name || '';
        form.phone_number = data.phone_number || '';
        form.bio = data.bio || '';

        userReadOnly.email = data.email || '';
        userReadOnly.department = data.department || '';
        userReadOnly.job = data.job || '';
        userReadOnly.role = Array.isArray(data.role) ? data.role[0] : (data.role || '');
        userReadOnly.status = data.status || 'ENABLED';
    } catch (err: any) {
        loadError.value = "Impossible de charger les informations du profil utilisateur.";
    } finally {
        isLoading.value = false;
    }
}

async function handleSubmit() {
    if (!form.first_name.trim()) {
        toast.warning('Le prénom est obligatoire.');
        return;
    }

    isSubmitting.value = true;
    errors.value = {};

    try {
        await userService.updateProfile(currentUserId.value, {
            first_name: form.first_name.trim(),
            last_name: (form.last_name || '').trim(),
            phone_number: (form.phone_number || '').trim(),
            bio: (form.bio || '').trim(),
        });
        toast.success('Profil mis à jour avec succès');
        setTimeout(() => {
            router.push({ name: 'PROFILE' });
        }, 800);
    } catch (err: any) {
        if (err?.response?.status === 422 && err?.response?.data?.errors) {
            errors.value = err.response.data.errors;
            toast.error('Veuillez corriger les champs invalides.');
        } else {
            toast.error(err?.response?.data?.message || 'Erreur lors de la mise à jour du profil.');
        }
    } finally {
        isSubmitting.value = false;
    }
}

onMounted(() => {
    loadProfile();
});
</script>

<template>
    <div class="min-h-screen bg-gray-50/50">
        <Header title="Mettre à jour le profil" :thumbnails="[
            { label: 'Accueil', name: 'DASHBOARD' },
            { label: 'Profil', name: 'PROFILE' },
            { label: 'Modifier', name: 'UPDATE_PROFILE' },
        ]" />

        <div class="p-6 max-w-6xl mx-auto">
            <!-- CHARGEMENT -->
            <div v-if="isLoading" class="p-16 flex flex-col items-center justify-center gap-3 text-gray-500">
                <Loader2 :size="36" class="animate-spin text-primary" />
                <span class="text-sm font-medium">Chargement des informations du profil...</span>
            </div>

            <!-- ERREUR -->
            <div v-else-if="loadError" class="p-6 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-sm flex items-center justify-between">
                <span>{{ loadError }}</span>
                <Button variant="outline" size="sm" @click="loadProfile">Réessayer</Button>
            </div>

            <!-- FORMULAIRE -->
            <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <!-- FORMULAIRE PRINCIPAL -->
                <form class="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-6 flex flex-col gap-6 shadow-sm" @submit.prevent="handleSubmit">
                    <div class="border-b border-gray-100 pb-4 flex items-center justify-between">
                        <div>
                            <h3 class="text-lg font-bold text-gray-900">Coordonnées personnelles</h3>
                            <p class="text-xs text-gray-500 mt-0.5">Modifiez vos informations d'identité et de contact</p>
                        </div>
                        <button type="button" @click="router.back()" class="text-xs text-gray-500 hover:text-gray-800 flex items-center gap-1 cursor-pointer">
                            <ArrowLeft :size="14" />
                            <span>Retour</span>
                        </button>
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <Input
                                v-model="form.first_name"
                                label="Prénom"
                                placeholder="ex: Jean"
                                :icon="UserRound"
                                required
                            />
                            <p v-if="errors.first_name" class="text-xs text-red-500 mt-1">{{ errors.first_name[0] }}</p>
                        </div>
                        <div>
                            <Input
                                v-model="form.last_name"
                                label="Nom"
                                placeholder="ex: RAKOTO"
                                :icon="UserRound"
                            />
                            <p v-if="errors.last_name" class="text-xs text-red-500 mt-1">{{ errors.last_name[0] }}</p>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <Input
                                v-model="form.phone_number"
                                label="Numéro de téléphone"
                                placeholder="ex: +261 34 00 000 00"
                                :icon="Phone"
                            />
                            <p v-if="errors.phone_number" class="text-xs text-red-500 mt-1">{{ errors.phone_number[0] }}</p>
                        </div>
                        <div>
                            <Input
                                :model-value="userReadOnly.email"
                                label="Adresse e-mail (non modifiable)"
                                :icon="MailIcon"
                                disabled
                            />
                            <p class="text-[11px] text-gray-400 mt-1">L'adresse e-mail est gérée par l'administrateur système.</p>
                        </div>
                    </div>

                    <div>
                        <label class="block text-xs font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
                            <FileText :size="14" class="text-gray-400" />
                            <span>Biographie / Note HSSE</span>
                        </label>
                        <textarea
                            v-model="form.bio"
                            rows="4"
                            class="w-full text-xs rounded-xl border border-gray-200 p-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition resize-none"
                            placeholder="Décrivez brièvement vos responsabilités ou attributions HSSE..."
                        ></textarea>
                    </div>

                    <div class="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                        <Button variant="outline" type="button" @click="router.back()">
                            Annuler
                        </Button>
                        <Button type="submit" :loading="isSubmitting" is-primary>
                            Enregistrer les modifications
                        </Button>
                    </div>
                </form>

                <!-- APERÇU EN DIRECT DU PROFIL -->
                <div class="flex flex-col gap-6">
                    <div class="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col items-center text-center shadow-sm">
                        <div class="w-20 h-20 rounded-full bg-primary/10 text-primary font-bold text-2xl flex items-center justify-center ring-4 ring-primary/5 mb-3">
                            {{ userInitials }}
                        </div>
                        <h4 class="font-bold text-gray-900 text-base">{{ fullName }}</h4>
                        <div class="mt-1 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                            <Shield :size="12" />
                            <span>{{ roleLabel }}</span>
                        </div>

                        <div class="w-full mt-6 pt-5 border-t border-gray-100 flex flex-col gap-3 text-left text-xs">
                            <div class="flex items-center gap-2 text-gray-600">
                                <MailIcon :size="14" class="text-gray-400 shrink-0" />
                                <span class="truncate">{{ userReadOnly.email || '-' }}</span>
                            </div>
                            <div class="flex items-center gap-2 text-gray-600">
                                <Phone :size="14" class="text-gray-400 shrink-0" />
                                <span>{{ form.phone_number || '-' }}</span>
                            </div>
                            <div class="flex items-center gap-2 text-gray-600">
                                <Building2 :size="14" class="text-gray-400 shrink-0" />
                                <span>{{ userReadOnly.department || '-' }}</span>
                            </div>
                            <div class="flex items-center gap-2 text-gray-600">
                                <Briefcase :size="14" class="text-gray-400 shrink-0" />
                                <span>{{ userReadOnly.job || '-' }}</span>
                            </div>
                        </div>

                        <div v-if="form.bio" class="w-full mt-4 p-3 bg-gray-50 rounded-xl text-left border border-gray-100">
                            <span class="text-[10px] uppercase font-semibold text-gray-400 block mb-1">Bio</span>
                            <p class="text-xs text-gray-600 leading-relaxed italic">{{ form.bio }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>