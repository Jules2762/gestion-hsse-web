<template>
    <label class="text-xs text-gray-500">
        {{ label }}
        <input type="date" v-model="data" class="popover-input mt-1" />
    </label>
</template>
<script setup lang="ts">
    import { computed, type InputTypeHTMLAttribute } from "vue"
    
    type typeProps = {
        modelValue?: string | number,
        type: InputTypeHTMLAttribute,
        label?:string,
       
    }

    const props = withDefaults(defineProps<typeProps>(), {
        type: "text"
    })
    const emit = defineEmits(["update:modelValue"])
    const data = computed({
        get: () => {
            return props.modelValue
        },
        set: (val) => {
            emit("update:modelValue", val)
        }
    })
</script>
<style scoped>
.popover-input {
    width: 100%;
    height: 2rem;
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    padding: 0 0.6rem;
    font-size: 0.8rem;
    outline: none;
}

.popover-input:focus {
    border-color: theme('colors.primary', #4f46e5);
    box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.15);
}
</style>