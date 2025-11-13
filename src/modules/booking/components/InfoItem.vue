<template>
  <div class="info-item">
    <dt class="text-sm font-medium text-gray-500">
      {{ label }}
    </dt>
    <dd 
      :class="[
        'text-sm font-semibold',
        type === 'pending' ? 'text-orange-600' : 'text-gray-900'
      ]"
    >
      {{ value }}
    </dd>
  </div>
</template>

<script setup lang="ts">
interface Props {
  label: string
  value: string
  type?: 'normal' | 'pending'
}

defineProps<Props>()
</script>

<style scoped>
.info-item {
  @apply flex flex-col space-y-1;
}
</style>