<template>
  <Transition name="fade">
    <div
      v-if="isLoading"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-xl p-6 flex flex-col items-center space-y-4">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p class="text-gray-700 font-medium">{{ loadingText }}</p>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const isLoading = ref(false)
const loadingText = ref('Загрузка...')

// В реальном приложении эти методы будут вызываться из stores или composables
const showLoading = (text: string = 'Загрузка...') => {
  isLoading.value = true
  loadingText.value = text
}

const hideLoading = () => {
  isLoading.value = false
}

// Экспортируем методы для использования в других компонентах
defineExpose({
  showLoading,
  hideLoading
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>