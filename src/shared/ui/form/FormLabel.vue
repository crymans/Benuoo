<template>
  <label class="form-label">
    <slot />
  </label>
</template>

<script setup lang="ts">
</script>

<style scoped>
.form-label {
  @apply block text-sm font-medium text-gray-700;
}
</style>