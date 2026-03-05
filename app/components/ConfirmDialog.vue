<template>
  <v-dialog :model-value="modelValue" max-width="400" @update:model-value="$emit('update:modelValue', $event)">
    <v-card>
      <v-card-title class="text-h6 pa-5">
        <v-icon icon="mdi-alert-circle" color="error" class="mr-2" />
        {{ title }}
      </v-card-title>
      <v-card-text class="px-5">
        <slot />
      </v-card-text>
      <v-card-actions class="pa-5 pt-0">
        <v-spacer />
        <v-btn variant="text" class="text-none" @click="$emit('update:modelValue', false)">
          {{ cancelText }}
        </v-btn>
        <v-btn
          :color="confirmColor"
          variant="flat"
          class="text-none"
          :loading="loading"
          @click="$emit('confirm')"
        >
          {{ confirmText }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  modelValue: boolean
  title: string
  loading?: boolean
  confirmText?: string
  cancelText?: string
  confirmColor?: string
}>(), {
  loading: false,
  confirmText: 'Delete',
  cancelText: 'Cancel',
  confirmColor: 'error',
})

defineEmits<{
  'update:modelValue': [value: boolean]
  'confirm': []
}>()
</script>
