

<template>

  <div class="w-full  h-full flex flex-row items-center justify-center">
    <form @submit.prevent="onSubmit" class="p-6  rounded-md w-8/12 flex flex-col gap-y-6">
      <div>
        <h2>
          Connexion
        </h2>
        <p class="mt-2 text-slate-500">
          Connectez-vous à votre compte.
        </p>
      </div>
      <div class="flex flex-col gap-y-3">
        <Input :icon="MailIcon" label="E-mail" placeholder="ex: nom@exemple.com" />
        <Input :icon="LockIcon" label="Mot de passe" placeholder="******************" />
        <div class="w-full flex flex-row items-center justify-between">
          <div class="flex flex-row items-center">
            <Checkbox label="checkbox" />
          </div>
          <button type="button" class="text-blue-700" @click="router.push({
            name:'SEARCH_ACCOUNT'
          })">Mot de passe oublier?</button>
        </div>
        <Button type="submit">Se connecter</Button>

      </div>
      <div class="flex flex-row items-center w-full gap-x-2">
        <div class="bg-gray-300 h-0.5 w-full"></div>
        <span>ou</span>
        <div class="bg-gray-300 h-0.5 w-full"></div>
      </div>
      <button type="button"
        class="flex flex-row items-center rounded-md border border-gray-300 h-12 justify-center gap-x-2 ">
        <img src="/logo/google.webp" class="w-8" />
        <h5>GOOGLE</h5>
      </button>
    </form>


  </div>

</template>
<script setup lang="ts">
import { ref } from 'vue'
import Input from '../../components/ui/Input.vue';
import { LockIcon, MailIcon } from '@lucide/vue';
import Button from '../../components/ui/Button.vue';
import Checkbox from '../../components/ui/Checkbox.vue';
import { router } from '../../router/index.ts';



const email = ref('')
const password = ref('')


function onSubmit(){
  router.push({
    name:"HOME"
  })
}
</script>