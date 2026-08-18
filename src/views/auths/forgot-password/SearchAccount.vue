<script setup lang="ts">
import { ref } from 'vue'
import Input from '../../../components/ui/Input.vue';
import { ArrowLeft, ArrowRight, ArrowRightIcon, MailIcon } from '@lucide/vue';
import Button from '../../../components/ui/Button.vue';
import { router } from '../../../router/index.ts';




const email = ref('')
const password = ref('')
</script>

<template>

  <div class="w-full  h-full flex flex-row items-center justify-center">
    <form class="p-6  rounded-md w-8/12 flex flex-col gap-y-6">
      <div>
        <h2>
          Trouver votre compte
        </h2>
        <p class="mt-2 text-slate-500">
          Recherchez par adresse e-mail professionnelle
        </p>
      </div>
      <div class="flex flex-col gap-y-3">
        <Input :icon="MailIcon" label="Adresse e-mail" placeholder="ex: nom@exemple.com" />
       
        <Button :right-icon="ArrowRightIcon">Continuer</Button>

      </div>
      <div>
        <button class="flex flex-row items-center justify-center w-full gap-x-2" @click="router.replace({
            name:'LOGIN'
        })">
            <ArrowLeft/>
            <span>Retour à la connexion</span>
        </button>
      </div>
     
    </form>


  </div>

</template>
``