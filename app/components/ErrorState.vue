<template>
  <v-alert type="error" variant="tonal" class="mb-6">
    {{ message }} <NuxtLink :to="linkTo">
      {{ linkText }}
    </NuxtLink>
  </v-alert>
</template>

<script setup lang="ts">
defineProps<{
  message: string
  linkText: string
  linkTo: string
}>()
</script>
