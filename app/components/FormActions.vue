<template>
  <v-divider class="my-6" />
  <div class="d-flex justify-end ga-3 mt-4">
    <v-btn
      variant="text"
      size="large"
      class="text-none px-8"
      :to="cancelTo"
    >
      {{ cancelText }}
    </v-btn>
    <v-btn
      type="submit"
      color="primary"
      size="large"
      class="text-none gradient-btn px-8"
      :loading="loading"
    >
      <v-icon :icon="submitIcon" class="mr-2" />
      {{ submitText }}
    </v-btn>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  cancelTo: string
  cancelText?: string
  submitText: string
  submitIcon?: string
  loading?: boolean
}>(), {
  cancelText: 'Cancel',
  submitIcon: 'mdi-content-save',
  loading: false,
})
</script>

<style scoped>
.gradient-btn {
  background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%) !important;
}
</style>
