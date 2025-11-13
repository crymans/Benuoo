<template>
  <div class="booking-confirmation">
    <div class="mb-6">
      <h2 class="text-2xl font-bold text-gray-900 mb-2">Подтверждение бронирования</h2>
      <p class="text-gray-600">Проверьте информацию перед отправкой заявки</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Детали брони -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Карточка информации -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">
            Информация о бронировании
          </h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoItem label="Кабинет" :value="room?.name" />
            <InfoItem label="Дата" :value="formatDate(form.date)" />
            <InfoItem label="Время" :value="`${form.startTime} - ${form.endTime}`" />
            <InfoItem label="Продолжительность" :value="`${durationHours} часов`" />
            <InfoItem label="Количество человек" :value="form.peopleCount.toString()" />
            <InfoItem label="Статус" value="Ожидает подтверждения" type="pending" />
          </div>
        </div>

        <!-- Детали мероприятия -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Детали мероприятия</h3>
          <div class="space-y-3">
            <InfoItem label="Название" :value="form.title" />
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Описание
              </label>
              <p class="text-gray-900 whitespace-pre-wrap">{{ form.description }}</p>
            </div>
          </div>
        </div>

        <!-- Условия бронирования -->
        <div class="bg-orange-50 rounded-xl border border-orange-200 p-6">
          <h3 class="text-lg font-semibold text-orange-900 mb-3 flex items-center">
            <span class="mr-2">⚠️</span>
            Важная информация
          </h3>
          <ul class="space-y-2 text-orange-800 text-sm">
            <li class="flex items-start">
              <span class="mr-2 mt-0.5 flex-shrink-0">✓</span>
              Бронирование подтверждается администратором в течение 24 часов
            </li>
            <li class="flex items-start">
              <span class="mr-2 mt-0.5 flex-shrink-0">✓</span>
              Стоимость списывается только после подтверждения брони
            </li>
            <li class="flex items-start">
              <span class="mr-2 mt-0.5 flex-shrink-0">✓</span>
              Отмена брони возможна не менее чем за 2 часа до начала
            </li>
          </ul>
        </div>
      </div>

      <!-- Стоимость и действия -->
      <div class="lg:col-span-1">
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Стоимость</h3>
          
          <div class="space-y-3 mb-6">
            <div class="flex justify-between text-sm">
              <span class="text-gray-600">Базовая стоимость</span>
              <span>{{ room?.baseTokensCost }} × {{ durationHours }}ч</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-600">Коэффициент заполняемости</span>
              <span>{{ occupancyMultiplier }}×</span>
            </div>
            <div class="border-t pt-3 flex justify-between font-semibold">
              <span class="text-gray-900">Итого</span>
              <span class="text-blue-600">{{ tokensCost }} токенов</span>
            </div>
          </div>

          <!-- Баланс пользователя -->
          <div class="mb-6 p-3 bg-green-50 rounded-lg border border-green-200">
            <div class="flex justify-between items-center text-sm">
              <span class="text-green-700">Ваш баланс:</span>
              <span class="font-semibold text-green-700">{{ userTokensBalance }} токенов</span>
            </div>
            <div 
              v-if="userTokensBalance < tokensCost"
              class="mt-2 text-red-600 text-xs"
            >
              Недостаточно токенов для бронирования
            </div>
          </div>

          <div class="space-y-3">
            <button
              @click="handleConfirm"
              :disabled="isSubmitting || userTokensBalance < tokensCost"
              class="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              <span v-if="isSubmitting" class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
              {{ isSubmitting ? 'Отправка...' : 'Подтвердить бронирование' }}
            </button>
            
            <button
              @click="$emit('back')"
              :disabled="isSubmitting"
              class="w-full bg-gray-200 text-gray-900 py-3 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              ← Назад
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import { useAuthStore } from '@/stores/auth.store'
import InfoItem from './InfoItem.vue'
import type { Room, BookingCreateDto } from '@/core/types/booking' // Заменили BookingCreateForm на BookingCreateDto

interface Props {
  form: BookingCreateDto // Заменили BookingCreateForm на BookingCreateDto
  room?: Room
  tokensCost: number
}

interface Emits {
  (e: 'back'): void
  (e: 'confirm'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const authStore = useAuthStore()
const isSubmitting = ref(false)

const durationHours = computed(() => {
  if (!props.form.startTime || !props.form.endTime) return 0
  const start = new Date(`2000-01-01T${props.form.startTime}`)
  const end = new Date(`2000-01-01T${props.form.endTime}`)
  return (end.getTime() - start.getTime()) / (1000 * 60 * 60)
})

const occupancyMultiplier = computed(() => {
  if (!props.room) return 1
  const ratio = props.form.peopleCount / props.room.capacity
  return ratio > 0.8 ? 1.5 : 1
})

const userTokensBalance = computed(() => {
  return authStore.user?.tokensBalance || 0
})

const formatDate = (dateString: string) => {
  if (!dateString) return ''
  return format(new Date(dateString), 'd MMMM yyyy', { locale: ru })
}

const handleConfirm = async () => {
  if (userTokensBalance.value < props.tokensCost) {
    alert('Недостаточно токенов для бронирования')
    return
  }

  isSubmitting.value = true
  try {
    await emit('confirm')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<!-- Template остается без изменений -->