<template>
  <div class="fixed top-4 right-4 z-50 space-y-3 w-80">
    <TransitionGroup name="notification">
      <div
        v-for="notification in notifications"
        :key="notification.id"
        :class="[
          'p-4 rounded-lg shadow-lg border transform transition-all duration-300',
          notification.type === 'success' && 'bg-green-50 border-green-200',
          notification.type === 'error' && 'bg-red-50 border-red-200',
          notification.type === 'warning' && 'bg-yellow-50 border-yellow-200',
          notification.type === 'info' && 'bg-blue-50 border-blue-200'
        ]"
      >
        <div class="flex items-start">
          <div class="flex-shrink-0">
            <CheckCircle
              v-if="notification.type === 'success'"
              class="w-5 h-5 text-green-400"
            />
            <XCircle
              v-else-if="notification.type === 'error'"
              class="w-5 h-5 text-red-400"
            />
            <AlertTriangle
              v-else-if="notification.type === 'warning'"
              class="w-5 h-5 text-yellow-400"
            />
            <Info
              v-else
              class="w-5 h-5 text-blue-400"
            />
          </div>
          <div class="ml-3 flex-1">
            <p 
              :class="[
                'text-sm font-medium',
                notification.type === 'success' && 'text-green-800',
                notification.type === 'error' && 'text-red-800',
                notification.type === 'warning' && 'text-yellow-800',
                notification.type === 'info' && 'text-blue-800'
              ]"
            >
              {{ notification.title }}
            </p>
            <p 
              v-if="notification.message"
              :class="[
                'mt-1 text-sm',
                notification.type === 'success' && 'text-green-600',
                notification.type === 'error' && 'text-red-600',
                notification.type === 'warning' && 'text-yellow-600',
                notification.type === 'info' && 'text-blue-600'
              ]"
            >
              {{ notification.message }}
            </p>
          </div>
          <button
            @click="removeNotification(notification.id)"
            class="ml-4 flex-shrink-0 rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <X class="w-4 h-4" />
          </button>
        </div>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-vue-next'

interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
}

const notifications = ref<Notification[]>([])

let nextId = 1

const addNotification = (notification: Omit<Notification, 'id'>) => {
  const id = `notification-${nextId++}`
  const newNotification = { ...notification, id }
  
  notifications.value.push(newNotification)
  
  // Автоматическое удаление
  if (notification.duration !== 0) {
    const duration = notification.duration || 5000
    setTimeout(() => {
      removeNotification(id)
    }, duration)
  }
}

const removeNotification = (id: string) => {
  const index = notifications.value.findIndex(n => n.id === id)
  if (index > -1) {
    notifications.value.splice(index, 1)
  }
}

// Экспортируем методы для использования в других компонентах
defineExpose({
  addNotification,
  removeNotification
})
</script>

<style scoped>
.notification-enter-active,
.notification-leave-active {
  transition: all 0.5s ease;
}

.notification-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.notification-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.notification-move {
  transition: transform 0.5s ease;
}
</style>