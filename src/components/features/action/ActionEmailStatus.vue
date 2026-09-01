<script setup lang="ts">
import { ActionEmailStatusDataJson, themeEmailStatus } from '../../../@data/Action.data';
import type { ActionEmailStatusType } from '../../../@types/Action.type';
type propsType={
    status:ActionEmailStatusType
}
const props=defineProps<propsType>()
</script>

<template>
    <div :class="themeEmailStatus(status)" class=" inline-flex
      items-center
      rounded-full
      px-3
      py-1
      text-xs
      font-semibold
      text-nowrap"> 
        {{ ActionEmailStatusDataJson.find(item=>item.value==status)?.label }}
    </div>
</template>