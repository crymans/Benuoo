import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User, UserRole } from '@/core/types/booking'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const isAuthenticated = computed(() => !!user.value)
  const isAdmin = computed(() => 
    user.value?.role === 'admin' || user.value?.role === 'super_admin'
  )

  const setUser = (userData: User) => {
    user.value = userData
  }

  const logout = () => {
    user.value = null
    localStorage.removeItem('auth_token')
  }

  const updateTokens = (newBalance: number) => {
    if (user.value) {
      user.value.tokensBalance = newBalance
    }
  }

  return {
    user,
    isAuthenticated,
    isAdmin,
    setUser,
    logout,
    updateTokens,
  }
})