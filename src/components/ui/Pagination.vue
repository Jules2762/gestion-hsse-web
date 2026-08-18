<template>
  <vue-awesome-paginate
    :total-items="50"
    :items-per-page="5"
    :max-pages-shown="5"
    :current-page="1"
    :on-click="onClickHandler"
  />
</template>

<script setup lang="ts">
  const onClickHandler = (page: number) => {
    console.log(page);
  };
</script>

