<template>
  <div class="max-w-7xl mx-auto p-6">
    <!-- Header -->
    <div class="mb-8 text-center">
      <h1 class="text-4xl font-bold text-gray-900 mb-3">
        Бронирование кабинетов
      </h1>
      <p class="text-xl text-gray-600">
        Конгресс-холл МГТУ им. Н.Э. Баумана
      </p>
    </div>

    <!-- Progress Steps -->
    <div class="mb-12">
      <div class="flex items-center justify-center">
        <div 
          v-for="(step, index) in steps"
          :key="step.id"
          class="flex items-center"
        >
          <!-- Step Circle -->
          <div
            :class="[
              'flex items-center justify-center w-12 h-12 rounded-full border-2 font-semibold transition-all',
              currentStep >= step.id
                ? 'bg-blue-600 border-blue-600 text-white'
                : 'border-gray-300 text-gray-500',
            ]"
          >
            {{ currentStep > step.id ? '✓' : step.id }}
          </div>
          
          <!-- Connector Line -->
          <div
            v-if="index < steps.length - 1"
            :class="[
              'w-24 h-1 transition-all',
              currentStep > step.id ? 'bg-blue-600' : 'bg-gray-300',
            ]"
          />
        </div>
      </div>
      
      <!-- Step Labels -->
      <div class="flex justify-center mt-4 space-x-24">
        <div
          v-for="step in steps"
          :key="step.id"
          class="text-center"
        >
          <p
            :class="[
              'text-sm font-medium transition-all',
              currentStep >= step.id ? 'text-blue-600' : 'text-gray-500',
            ]"
          >
            {{ step.title }}
          </p>
        </div>
      </div>
    </div>

    <!-- Step Content -->
    <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
      <!-- Sidebar -->
      <div class="lg:col-span-1">
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-6">
          <h3 class="font-semibold text-gray-900 mb-4">Информация</h3>
          <div class="space-y-3 text-sm">
            <div v-if="selectedRoom" class="flex justify-between">
              <span class="text-gray-600">Кабинет:</span>
              <span class="font-medium">{{ selectedRoom.name }}</span>
            </div>
            <div v-if="form.date" class="flex justify-between">
              <span class="text-gray-600">Дата:</span>
              <span class="font-medium">{{ formatDate(form.date) }}</span>
            </div>
            <div v-if="form.startTime && form.endTime" class="flex justify-between">
              <span class="text-gray-600">Время:</span>
              <span class="font-medium">{{ form.startTime }} - {{ form.endTime }}</span>
            </div>
            <div v-if="tokensCost > 0" class="flex justify-between pt-3 border-t">
              <span class="text-gray-600">Стоимость:</span>
              <span class="font-semibold text-blue-600">{{ tokensCost }} токенов</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="lg:col-span-3">
        <div v-if="currentStep === 1">
          <RoomSelection
            v-model:selected-room-id="form.roomId"
            @next="handleRoomSelectionNext"
          />
        </div>

        <div v-else-if="currentStep === 2">
          <BookingDetails
            v-model:title="form.title"
            v-model:description="form.description"
            v-model:people-count="form.peopleCount"
            v-model:date="form.date"
            v-model:start-time="form.startTime"
            v-model:end-time="form.endTime"
            :room="selectedRoom"
            @back="currentStep--"
            @next="currentStep++"
          />
        </div>

        <div v-else-if="currentStep === 3">
          <BookingConfirmation
            :form="form"
            :room="selectedRoom"
            :tokens-cost="tokensCost"
            @back="currentStep--"
            @confirm="submitBooking"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useAuthStore } from '@/stores/auth.store'
import RoomSelection from './RoomSelection.vue'
import BookingDetails from './BookingDetails.vue'
import BookingConfirmation from './BookingConfirmation.vue'
import type { Room, BookingCreateDto } from '@/core/types/booking' // Добавили импорт BookingCreateDto

const authStore = useAuthStore()
const currentStep = ref(1)
const isSubmitting = ref(false)

const steps = [
  { id: 1, title: 'Выбор кабинета' },
  { id: 2, title: 'Детали брони' },
  { id: 3, title: 'Подтверждение' },
]

// Используем тип BookingCreateDto для формы
const form = reactive<BookingCreateDto & { roomId: string }>({
  roomId: '',
  title: '',
  description: '',
  peopleCount: 1,
  date: '',
  startTime: '',
  endTime: '',
})

// Mock rooms data
const mockRooms: Room[] = [
  {
    id: '1',
    name: 'Конференц-зал А',
    description: 'Просторный зал для проведения конференций и семинаров',
    capacity: 50,
    baseTokensCost: 20,
    features: ['projector', 'video_conference', 'sound_system', 'air_conditioning'],
    location: 'Главный корпус',
    floor: 3,
    isActive: true,
  },
  {
    id: '2',
    name: 'Переговорная 101',
    description: 'Уютная комната для командных встреч и обсуждений',
    capacity: 8,
    baseTokensCost: 8,
    features: ['whiteboard', 'wifi'],
    location: 'Корпус УЛК',
    floor: 1,
    isActive: true,
  },
]

const selectedRoom = computed(() => 
  form.roomId ? mockRooms.find(room => room.id === form.roomId) : null
)

const durationHours = computed(() => {
  if (!form.startTime || !form.endTime) return 0
  const start = new Date(`2000-01-01T${form.startTime}`)
  const end = new Date(`2000-01-01T${form.endTime}`)
  return (end.getTime() - start.getTime()) / (1000 * 60 * 60)
})

const tokensCost = computed(() => {
  if (!selectedRoom.value) return 0
  const baseCost = selectedRoom.value.baseTokensCost
  const capacityRatio = form.peopleCount / selectedRoom.value.capacity
  const multiplier = capacityRatio > 0.8 ? 1.5 : 1
  return Math.ceil(baseCost * durationHours.value * multiplier)
})

const formatDate = (dateString: string) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

const handleRoomSelectionNext = () => {
  if (form.roomId) {
    currentStep.value++
  } else {
    alert('Пожалуйста, выберите кабинет')
  }
}

const submitBooking = async () => {
  isSubmitting.value = true
  try {
    console.log('Submitting booking:', form)
    
    // Здесь будет вызов API
    await new Promise(resolve => setTimeout(resolve, 1000)) // Имитация задержки
    
    // Обновляем баланс пользователя
    if (authStore.user) {
      authStore.user.tokensBalance -= tokensCost.value
    }
    
    // Reset form
    Object.assign(form, {
      roomId: '',
      title: '',
      description: '',
      peopleCount: 1,
      date: '',
      startTime: '',
      endTime: '',
    })
    currentStep.value = 1
    
    alert('Бронирование успешно отправлено на рассмотрение!')
  } catch (error) {
    console.error('Booking submission failed:', error)
    alert('Ошибка при отправке бронирования')
  } finally {
    isSubmitting.value = false
  }
}
</script>