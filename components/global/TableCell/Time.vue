<template>
  <div class="">
    {{ value }}
  </div>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'
const props = defineProps<{
  time: string
}>()

let value = dayjs(props.time).format('YYYY-MM-DD HH:mm:ss')
</script>

<style scoped></style>