<script setup lang="ts">
import Header from '../../../components/shared/Header.vue';

</script>

<template>
    <div>
        <Header title="Rôle et permissions" :thumbnails="[
            {
                'label':'Tableau de bord',
                'name':'DASHBOARD'
            },
            {
                'label':'Utilisateurs',
                'name':'USERS'
            },
            {
                'label':'Rôle et permissions',
                'name':'ROLE_PERMISSION'
            },
        ]"/>
        <div class="bg-white p-4"></div>
    </div>
</template>