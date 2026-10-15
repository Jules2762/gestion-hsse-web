<script setup lang="ts">
import { ref } from 'vue';
import Input from '../../../components/ui/Input.vue';
import { ArrowLeft, ArrowRightIcon, MailIcon, CheckCircle2 } from '@lucide/vue';
import Button from '../../../components/ui/Button.vue';
import { router } from '../../../router/index.ts';
import { toast } from 'vue3-toastify';
import authApi from '../../../core/api/auth.api.ts';

const email = ref('');
const loading = ref(false);
const submitted = ref(false);

async function handleSubmit() {
    if (!email.value.trim()) {
        toast.error('Veuillez saisir votre adresse e-mail professionnelle');
        return;
    }
    loading.value = true;
    try {
        await authApi.forgotPassword(email.value.trim());
        submitted.value = true;
        toast.success('Instructions de réinitialisation envoyées');
    } catch (err: any) {
        toast.error(err?.response?.data?.message || 'Une erreur est survenue lors de la demande');
    } finally {
        loading.value = false;
    }
}
</script>

<template>
  <div class="w-full h-full flex flex-row items-center justify-center p-4">
    <div v-if="submitted" class="p-8 bg-white border border-gray-200 rounded-2xl w-full max-w-md flex flex-col items-center text-center gap-4 shadow-sm">
        <div class="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 :size="32" />
        </div>
        <div>
            <h3 class="font-bold text-gray-900 text-lg">E-mail envoyé</h3>
            <p class="mt-1 text-xs text-gray-500">
                Si un compte correspond à <strong>{{ email }}</strong>, vous recevrez un lien de réinitialisation sous peu.
            </p>
        </div>
        <button
            class="mt-3 flex flex-row items-center justify-center gap-x-2 text-xs font-semibold text-primary hover:underline cursor-pointer"
            @click="router.replace({ name: 'LOGIN' })"
        >
            <ArrowLeft :size="16" />
            <span>Retour à la connexion</span>
        </button>
    </div>

    <form v-else class="p-8 bg-white border border-gray-200 rounded-2xl w-full max-w-md flex flex-col gap-y-5 shadow-sm" @submit.prevent="handleSubmit">
      <div>
        <h2 class="font-bold text-gray-900 text-xl">
          Trouver votre compte
        </h2>
        <p class="mt-1.5 text-xs text-gray-500">
          Saisissez votre adresse e-mail professionnelle pour réinitialiser votre mot de passe.
        </p>
      </div>
      <div class="flex flex-col gap-y-3">
        <Input v-model="email" :icon="MailIcon" type="email" label="Adresse e-mail" placeholder="ex: nom@galana.mg" required />
        <Button :right-icon="ArrowRightIcon" :loading="loading" type="submit">Continuer</Button>
      </div>
      <div class="pt-2 border-t border-gray-100">
        <button
            type="button"
            class="flex flex-row items-center justify-center w-full gap-x-2 text-xs text-gray-500 hover:text-gray-800 transition cursor-pointer"
            @click="router.replace({ name: 'LOGIN' })"
        >
            <ArrowLeft :size="15" />
            <span>Retour à la connexion</span>
        </button>
      </div>
    </form>
  </div>
</template>