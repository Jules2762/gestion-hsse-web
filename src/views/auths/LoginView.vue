<template>

  <div class="w-full  h-full flex flex-row items-center justify-center">
    <form @submit.prevent="onSubmit" class="p-6  rounded-md w-8/12 flex flex-col gap-y-6">
      <div>
        <h2>
          {{ t('login.title') }}
        </h2>
        <p class="mt-2 text-slate-500">
          {{ t('login.subtitle') }}
        </p>
      </div>
      <div class="flex flex-col gap-y-3">
        <Input :icon="MailIcon" type="email" v-model="data.forms.email" :label="t('login.email.label')" :placeholder="t('login.email.placeholder')" :error="data.errors.email[0]"/>
        <Input :icon="LockIcon" type="password" v-model="data.forms.password" :label="t('login.password.label')" :placeholder="t('login.password.placeholder')" :error="data.errors.password[0]"/>
        <div class="w-full flex flex-row items-center justify-between">
          <div class="flex flex-row items-center">
            <Checkbox :label="t('login.remember_me')" />
          </div>
          <button type="button" class="text-blue-700" @click="router.push({
            name:'SEARCH_ACCOUNT'
          })">{{ t('login.forgot_password') }}</button>
        </div>
        <Button type="submit" full-width :loading="data.forms.loading">{{t('login.login')}}</Button>

      </div>
      <div class="flex flex-row items-center w-full gap-x-2">
        <div class="bg-gray-300 h-0.5 w-full"></div>
        <span>{{ t('login.or') }}</span>
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
import { useAuthService } from '../../core/services/auth.service.ts';
import { toast } from 'vue3-toastify';
import { useI18n } from 'vue-i18n';

type dataType={
  forms:{
    email:string,
    password:string,
    loading:boolean
  },errors:{
    email:string[],
    password:string[]
  }
}
const data=ref<dataType>({
  forms:{
    email:'',
    password:'',
    loading:false
  },
  errors:{
    email:[],
    password:[]
  }
})
const auth=useAuthService()
const {t}=useI18n()
function onSubmit(){
  data.value.forms.loading=true
  data.value.errors.email=[]
  data.value.errors.password=[]
  auth.login({
    email:data.value.forms.email,
    password:data.value.forms.password,
    confirmation_password:data.value.forms.password

  }).then((res)=>{
    console.log(res)
    toast.success(
      t('login.notification.success')
    );
    data.value.forms.loading = false
      setTimeout(()=>{
        router.push({
          name: "HOME"
        })
      },1000)
  }).catch((err)=>{
    
    data.value.forms.loading = false
    const status = err?.response?.status || err?.status
    const msg = err?.response?.data?.message
    if (status == 403) {
      if (msg === '403.disabled') {
        toast.error(t('errors.403.disabled'))
      } else {
        toast.error(t('errors.403.forbidden'))
      }
    } else if (status == 422) {
      toast.error(
        t('login.notification.error')
      );
    } else {
      toast.error(
        t('login.notification.error')
      );
    }
   
  })

}
</script>
