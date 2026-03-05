<template>
  <div class="text-center py-12">
    <v-progress-circular indeterminate color="primary" size="48" />
    <p class="text-body-1 mt-4 text-medium-emphasis">
      {{ text }}
    </p>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  text?: string
}>(), {
  text: 'Loading...',
})
</script>
