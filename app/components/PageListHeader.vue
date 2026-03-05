<template>
  <div class="d-flex flex-wrap align-center justify-space-between mb-6 ga-3">
    <div>
      <h1 class="text-h5 font-weight-bold">
        {{ title }}
      </h1>
      <p class="text-body-2 text-medium-emphasis">
        {{ subtitle }}
      </p>
    </div>
    <slot />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  subtitle: string
}>()
</script>
