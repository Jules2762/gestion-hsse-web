<template>
   <aside class="lg:col-span-1 lg:sticky lg:top-4">
        <div class="bg-white rounded border border-gray-200 overflow-hidden shadow-sm">
            <div class="p-5 bg-green-600">
                <p class="text-xs uppercase tracking-wide text-white/80 font-medium">Aperçu de la formation</p>
                <h3 class="text-lg font-semibold text-white mt-1 wrap-break-word">
                    {{ title || 'Titre de la formation' }}
                </h3>
                <div class="flex flex-wrap gap-2 mt-3">
                    <span v-for="tag in tags" class="px-2.5 py-1 rounded-full text-xs font-medium bg-white/20 text-white">
                        {{ tag }}
                    </span>
                   
                </div>
            </div>

            <div class="p-5 flex flex-col gap-4">
              <slot></slot>
            </div>
        </div>

        <p class="text-xs text-gray-400 mt-3 px-1">
            Cet aperçu se met à jour automatiquement pendant la saisie.
        </p>
    </aside>
</template>
<script setup lang="ts">
    type propsType={
        title?:string,
        tags?:string[]
    }
    const props=defineProps<propsType>()
</script>