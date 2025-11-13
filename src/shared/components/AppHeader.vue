<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import Icon from '@/shared/ui/Icon.vue' // Импортируем наш компонент иконок
import { useAuthStore } from '@/stores/auth.store'

const auth = useAuthStore()
const isUserMenuOpen = ref(false)

// ... остальной код без изменений
</script>

<template>
  <header class="bg-white shadow-sm border-b border-gray-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Логотип и название -->
        <div class="flex items-center">
          <div class="flex-shrink-0 flex items-center">
            <Icon name="Building" class="w-8 h-8 text-blue-600" />
            <span class="ml-2 text-xl font-bold text-gray-900">
              МГТУ Баумана
            </span>
          </div>
          <!-- ... остальной код -->
        </div>

        <!-- Правая часть -->
        <div class="flex items-center space-x-4">
          <!-- Баланс токенов -->
          <div
            v-if="auth.isAuthenticated"
            class="hidden sm:flex items-center space-x-2 bg-blue-50 px-3 py-2 rounded-lg"
          >
            <Icon name="Coins" class="w-4 h-4 text-blue-600" />
            <span class="text-sm font-medium text-blue-700">
              {{ auth.user?.tokensBalance }} токенов
            </span>
          </div>

          <!-- ... остальной код -->

          <!-- Выпадающее меню -->
          <div
            v-if="isUserMenuOpen"
            class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50"
          >
            <button
              @click="logout"
              class="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <Icon name="LogOut" class="w-4 h-4 mr-2" />
              Выйти
            </button>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>