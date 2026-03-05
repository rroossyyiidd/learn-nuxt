<template>
  <div class="d-flex align-center mb-6">
    <v-btn
      icon="mdi-arrow-left"
      variant="text"
      class="mr-3"
      :to="backTo"
    />
    <div>
      <h1 class="text-h5 font-weight-bold">
        {{ title }}
      </h1>
      <p class="text-body-2 text-medium-emphasis">
        {{ subtitle }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  subtitle: string
  backTo: string
}>()
</script>
