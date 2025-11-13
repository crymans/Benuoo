<template>
  <div id="app" class="min-h-screen bg-gray-50 flex flex-col">
    <AppHeader v-if="auth.isAuthenticated" />
    
    <main class="flex-1">
      <RouterView />
    </main>

    <AppFooter v-if="auth.isAuthenticated" />
    
    <!-- Global Components -->
    <GlobalLoading ref="globalLoading" />
    <NotificationContainer ref="notificationContainer" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, provide } from 'vue'
import { RouterView } from 'vue-router'
import AppHeader from '@/shared/components/AppHeader.vue'
import AppFooter from '@/shared/components/AppFooter.vue'
import GlobalLoading from '@/shared/components/GlobalLoading.vue'
import NotificationContainer from '@/shared/components/NotificationContainer.vue'
import { useAuthStore } from '@/stores/auth.store'

const globalLoading = ref()
const notificationContainer = ref()
const auth = useAuthStore()

// Provide global components to all child components
provide('globalLoading', globalLoading)
provide('notificationContainer', notificationContainer)

onMounted(() => {
  // Initialize test data only if user is authenticated
  if (!auth.isAuthenticated) {
    // For demo purposes, auto-login as user
    auth.setUser({
      id: '1',
      email: 'student@bmstu.ru',
      firstName: 'Иван',
      lastName: 'Петров',
      tokensBalance: 150,
      role: 'user',
      department: 'Факультет ИУ'
    })
  }
})
</script>