<!-- src/views/home/profile/ProfilePage.vue -->
<script setup lang="ts">
    import { EditIcon, MailIcon, Loader2, Phone, CalendarDays, X } from '@lucide/vue';
    import Header from '../../../components/shared/Header.vue';
    import Button from '../../../components/ui/Button.vue';
    import { computed, onMounted, reactive, ref } from 'vue';
    import RolePermissionSection from '../../../components/features/profile/RolePermissionSection.vue';
    import OverviewSection from '../../../components/features/profile/OverviewSection.vue';
    import InformationSection from '../../../components/features/profile/InformationSection.vue';
    import RecentActivitySection from '../../../components/features/profile/RecentActivitySection.vue';
    import { UserStatusJsonData } from '../../../@data/User.data.ts';
    import { useUserService } from '../../../core/services/user.service.ts';
    import { useRoute } from 'vue-router';
    import ButtonFilter from '../../../components/ui/ButtonFilter.vue';
import Input from '../../../components/ui/Input.vue';

    export interface ProfileUser {
        id?: string | number
        first_name: string
        last_name: string
        email: string
        phone_number?: string
        department?: string
        job?: string
        role: string
        status: string
        permissions: string[]
        avatar?: string | null
        bio?: string
        created_at?: string
    }

    const tab_profile = [
        "Vue d'ensemble",
        "Information",
        "Rôle et permission"
    ]
    const selected_tab = ref(0)

    /*
    |--------------------------------------------------------------------------
    | CHARGEMENT DU PROFIL
    |--------------------------------------------------------------------------
    */

    const service = useUserService()
    const isLoading = ref(false)
    const loadError = ref("")

    const user = ref<ProfileUser>({
        first_name: "",
        last_name: "",
        email: "",
        role: "USER",
        status: "DISABLED",
        permissions: [],
    })
    const route = useRoute()
    function getProfile() {

        isLoading.value = true
        loadError.value = "" as string

        // NOTE : hypothèse sur le nom de la méthode exposée par le service
        // pour récupérer le compte connecté (ex: getProfile, me, getCurrentUser...).
        service.getProfile(route.params.id as string | undefined ?? '')
            .then((res: any) => {
                console.log(res.data)
                user.value = {
                    ...user.value,
                    ...res.data,
                    permissions: res.data.permissions ?? [],
                }
                getPermission(user.value.id as string)
            })
            .catch(() => {
                loadError.value = "Impossible de charger les informations du profil."
            })
            .finally(() => {
                isLoading.value = false
            })

    }

    const fullName = computed(() => {
        const full = `${user.value.first_name} ${user.value.last_name}`.trim()
        return full.length > 0 ? full : "Utilisateur"
    })

    const statusInfo = computed(() => {
        const match = (UserStatusJsonData as { value: string, label: string }[])
            ?.find(item => item.value === user.value.status)
        return {
            label: match?.label ?? user.value.status,
            active: user.value.status === 'ACTIVE' || user.value.status === 'ENABLED'
        }
    })

    const memberSince = computed(() => {
        if (!user.value.created_at) return null
        try {
            return new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
                .format(new Date(user.value.created_at))
        } catch {
            return null
        }
    })
    function getPermission(id: string | number) {
        service.getPermissions(id)
            .then(res => {
                user.value.permissions = res.data
            })
            .catch(err => {
                console.error(err)
            })
    }

    onMounted(() => {
        getProfile()
    })

    /*
    |--------------------------------------------------------------------------
    | MODAL DE MISE A JOUR DU PROFIL
    |--------------------------------------------------------------------------
    */

    const showEditModal = ref(false)
    const isSubmitting = ref(false)
    const submitError = ref("")

    const editForm = reactive({
        first_name: "",
        last_name: "",
       
        phone_number: "",
      
        bio: "",
    })

    function openEditModal() {
        editForm.first_name = user.value.first_name ?? ""
        editForm.last_name = user.value.last_name ?? ""
       
        editForm.phone_number = user.value.phone_number ?? ""
      
        editForm.bio = user.value.bio ?? ""
        submitError.value = ""
        showEditModal.value = true
    }

    function closeEditModal() {
        if (isSubmitting.value) return
        showEditModal.value = false
    }

    function submitEditModal() {
        isSubmitting.value = true
        submitError.value = ""

        // NOTE : hypothèse sur le nom de la méthode exposée par le service
        // pour mettre à jour le profil (ex: updateProfile, update...).
        service.updateProfile(user.value.id as string, { ...editForm })
            .then((res: any) => {
                user.value = {
                    ...user.value,
                    ...editForm,
                    ...(res?.data ?? {}),
                }
                showEditModal.value = false
            })
            .catch(() => {
                submitError.value = "Impossible de mettre à jour le profil."
            })
            .finally(() => {
                isSubmitting.value = false
            })
    }
</script>

<template>
    <div class="">
        <Header title="Profil" :thumbnails="[
            {
                label: 'Accueil',
                name: 'DASHBOARD'
            }, {
                label: 'Profil',
                name: 'PROFILE'
            }
        ]" />
    </div>

    <!-- ETAT DE CHARGEMENT / ERREUR -->
    <div v-if="isLoading" class="flex items-center justify-center py-20 text-text-muted">
        <Loader2 class="h-5 w-5 animate-spin mr-2" />
        Chargement du profil...
    </div>
    <div v-else-if="loadError" class="m-4 rounded-xl border border-danger/30 bg-danger/5 p-6 text-sm text-danger">
        {{ loadError }}
    </div>

    <div v-else class="p-4 grid grid-cols-6 gap-2">
        <div class="col-span-4 flex flex-col gap-2">
            <div class="bg-white p-4 w-full rounded border border-gray-200">
                <div class="w-full flex flex-row justify-between items-center">
                    <div class="flex flex-row gap-x-3 items-center">
                        <img :src="user.avatar || '/images/profile.webp'"
                            class="w-20 h-20 object-cover rounded-full border-4 border-primary/50" />
                        <div class="">
                            <div class="flex items-center gap-x-2">
                                <h4>{{ fullName }}</h4>
                                <span
                                    class="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium"
                                    :class="statusInfo.active ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'">
                                    <span class="h-1.5 w-1.5 rounded-full"
                                        :class="statusInfo.active ? 'bg-success' : 'bg-danger'" />
                                    {{ statusInfo.label }}
                                </span>
                            </div>
                            <div class="flex flex-row items-center gap-x-3 text-text-muted">
                                <MailIcon :size="18" />
                                <p>{{ user.email || 'Adresse e-mail non renseignée' }}</p>
                            </div>
                            <div v-if="user.phone_number" class="flex flex-row items-center gap-x-3 text-text-muted">
                                <Phone :size="18" />
                                <p>{{ user.phone_number }}</p>
                            </div>
                            <div v-if="memberSince" class="flex flex-row items-center gap-x-3 text-text-muted">
                                <CalendarDays :size="18" />
                                <p>Membre depuis le {{ memberSince }}</p>
                            </div>
                        </div>
                    </div>
                    <ButtonFilter :icon="EditIcon" @click="openEditModal" text="Mettre à jour le profil"></ButtonFilter>
                </div>
                <div class="p-6">
                    <h5>Bio</h5>
                    <p v-if="user.bio">{{ user.bio }}</p>
                    <p v-else class="text-text-muted italic">Aucune biographie renseignée.</p>
                </div>
            </div>
            <div class="bg-white p-4 flex flex-col gap-y-4 w-full rounded border border-gray-200">
                <div class="w-full border-b border-gray-200 px-3 pt-3 gap-x-3 flex flex-row ">
                    <button v-for="(item, index) in tab_profile" :key="index" @click="selected_tab = index" class="pb-2"
                        :class="index == selected_tab ? 'border-b-2 border-primary text-primary' : ''">{{ item
                        }}</button>
                </div>
                <template v-if="selected_tab == 0">
                    <OverviewSection :user="user" @go-to-tab="selected_tab = $event" />
                </template>
                <template v-if="selected_tab == 1">
                    <InformationSection :user="user" />
                </template>
                <template v-if="selected_tab == 2">
                    <RolePermissionSection :user="user" />
                </template>
            </div>
        </div>
        <div class="col-span-2 flex flex-col gap-2  top-0 ">
            <RecentActivitySection />
        </div>
    </div>

    <!-- MODAL : MISE A JOUR DU PROFIL -->
    <Teleport to="body">
        <div v-if="showEditModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div class="absolute inset-0 bg-black/40" @click="closeEditModal"></div>

            <div
                class="relative bg-white w-full max-w-lg rounded border border-gray-200 shadow-lg max-h-[90vh] overflow-y-auto">
                <div class="flex items-center justify-between p-4 border-b border-gray-200">
                    <h5>Mettre à jour le profil</h5>
                    <button @click="closeEditModal" class="text-text-muted hover:text-black">
                        <X :size="20" />
                    </button>
                </div>

                <form @submit.prevent="submitEditModal" class="p-4 flex flex-col gap-y-4">
                    <div v-if="submitError" class="rounded border border-danger/30 bg-danger/5 p-3 text-sm text-danger">
                        {{ submitError }}
                    </div>

                    <div class="grid grid-cols-2 gap-3">
                        
                        <Input v-model="editForm.first_name" required type="text" label="Prénom" />
                        <Input v-model="editForm.last_name" type="text" label="Nom" />
                    </div>

                  
                   <Input v-model="editForm.phone_number" type="tel"  label="Téléphone"/>
                 

                    <div class="flex flex-col gap-y-1">
                        <label class="text-xs text-text-muted">Bio</label>
                        <textarea v-model="editForm.bio" rows="3"
                            class="rounded border border-gray-200 px-3 py-2"></textarea>
                    </div>

                    <div class="flex justify-end gap-x-2 pt-2">
                        <Button type="button" variant="outline" @click="closeEditModal" :disabled="isSubmitting">
                            Annuler
                        </Button>
                        <Button type="submit" :disabled="isSubmitting">
                            <Loader2 v-if="isSubmitting" class="h-4 w-4 animate-spin mr-2" />
                            Enregistrer
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    </Teleport>
</template>