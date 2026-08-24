<script setup lang="ts">
import Header from '../../../components/shared/Header.vue';

</script>

<template>
    <div>
        <Header title="Mettre à jour le profil" :thumbnails="[
            {
                label: 'Accueil',
                name: 'DASHBOARD'
            }, {
                label: 'Profil',
                name: 'PROFILE'
            },{
                label: 'Modifier',
                name: 'UPDATE_PROFILE'
            },
        ]"/>
    </div>
</template>