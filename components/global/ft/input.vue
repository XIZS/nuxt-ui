<template>
    <UInput v-model="props.form[props.k]" placeholder="" :ui="{ base: 'peer' }" >
        <label class="pointer-events-none absolute left-0 -top-2.5 text-(--ui-text-highlighted) text-xs font-medium px-1.5 transition-all peer-focus:-top-2.5 peer-focus:text-(--ui-text-highlighted) peer-focus:text-xs peer-focus:font-medium peer-placeholder-shown:text-sm peer-placeholder-shown:text-(--ui-text-dimmed) peer-placeholder-shown:top-1.5 peer-placeholder-shown:font-normal">
            <span class="inline-flex bg-(--ui-bg) px-1">{{ props.label }}</span>
        </label>
    </UInput>
</template>

<script setup lang="ts">

const props = defineProps<{
    form: string,
    label:string,
    k: string,
}>()
</script>

<style scoped></style>