<template>
  <button
    :class="[
      'base-button',
      `base-button--${variant}`,
      `base-button--${size}`,
      { 
        'base-button--disabled': disabled, 
        'base-button--loading': loading,
        'base-button--full-width': fullWidth
      }
    ]"
    :disabled="disabled || loading"
    @click="$emit('click', $event)"
  >
    <span v-if="loading" class="base-button__spinner" />
    <component 
      :is="icon" 
      v-if="icon && !loading" 
      class="base-button__icon" 
    />
    <span class="base-button__content">
      <slot />
    </span>
  </button>
</template>

<script setup lang="ts">
import type { Component } from 'vue'

defineProps<{
  variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  disabled?: boolean
  loading?: boolean
  fullWidth?: boolean
  icon?: Component
}>()

defineEmits<{
  click: [event: MouseEvent]
}>()
</script>

<style scoped>
.base-button {
  @apply inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed;
}

.base-button--primary {
  @apply bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 shadow-sm;
}

.base-button--secondary {
  @apply bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500 shadow-sm;
}

.base-button--danger {
  @apply bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-sm;
}

.base-button--outline {
  @apply border border-gray-300 bg-transparent text-gray-700 hover:bg-gray-50 focus:ring-gray-500;
}

.base-button--ghost {
  @apply bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500;
}

.base-button--sm {
  @apply px-3 py-1.5 text-sm gap-1.5;
}

.base-button--md {
  @apply px-4 py-2 text-base gap-2;
}

.base-button--lg {
  @apply px-6 py-3 text-lg gap-2;
}

.base-button--xl {
  @apply px-8 py-4 text-xl gap-3;
}

.base-button--full-width {
  @apply w-full;
}

.base-button--disabled {
  @apply opacity-50 cursor-not-allowed;
}

.base-button__spinner {
  @apply animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent;
}

.base-button__icon {
  @apply w-4 h-4;
}

.base-button__content {
  @apply flex items-center gap-2;
}
</style>