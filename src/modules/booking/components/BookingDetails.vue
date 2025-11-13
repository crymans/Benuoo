<template>
  <div class="booking-details">
    <div class="mb-6">
      <h2 class="text-2xl font-bold text-gray-900 mb-2">Детали бронирования</h2>
      <p class="text-gray-600">Заполните информацию о вашем мероприятии</p>
    </div>

    <form @submit.prevent="onSubmit" class="space-y-6">
      <!-- Основная информация -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Название -->
        <div class="lg:col-span-2">
          <div class="form-group">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Название мероприятия *
            </label>
            <input
              v-model="form.title"
              type="text"
              placeholder="Например: Совещание по разработке проекта"
              class="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        <!-- Описание -->
        <div class="lg:col-span-2">
          <div class="form-group">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Описание задач *
            </label>
            <textarea
              v-model="form.description"
              rows="4"
              placeholder="Опишите цели и задачи вашего мероприятия..."
              class="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500 resize-none"
              required
            ></textarea>
            <div class="flex justify-between text-sm text-gray-500 mt-1">
              <span>Минимум 10 символов</span>
              <span>{{ form.description.length }}/500</span>
            </div>
          </div>
        </div>

        <!-- Количество людей -->
        <div>
          <div class="form-group">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Количество человек *
            </label>
            <div class="relative">
              <input
                v-model.number="form.peopleCount"
                type="number"
                :min="1"
                :max="room?.capacity"
                class="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500 pr-20"
                required
              />
              <div class="absolute inset-y-0 right-0 flex items-center pr-3">
                <span class="text-gray-500 text-sm">
                  из {{ room?.capacity }} макс.
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Дата -->
        <div>
          <div class="form-group">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Дата мероприятия *
            </label>
            <input
              v-model="form.date"
              type="date"
              :min="minDate"
              class="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        <!-- Время начала -->
        <div>
          <div class="form-group">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Время начала *
            </label>
            <select
              v-model="form.startTime"
              class="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              required
            >
              <option value="">Выберите время</option>
              <option
                v-for="time in timeSlots"
                :key="time"
                :value="time"
                :disabled="isTimeDisabled(time, 'start')"
              >
                {{ time }}
              </option>
            </select>
          </div>
        </div>

        <!-- Время окончания -->
        <div>
          <div class="form-group">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Время окончания *
            </label>
            <select
              v-model="form.endTime"
              class="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              required
            >
              <option value="">Выберите время</option>
              <option
                v-for="time in timeSlots"
                :key="time"
                :value="time"
                :disabled="isTimeDisabled(time, 'end')"
              >
                {{ time }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <!-- Информация о стоимости -->
      <div
        v-if="durationHours > 0"
        class="p-4 bg-blue-50 rounded-lg border border-blue-200"
      >
        <div class="flex items-center justify-between">
          <div>
            <h3 class="font-semibold text-blue-900">Стоимость бронирования</h3>
            <p class="text-blue-700 text-sm">
              {{ durationHours }} час · {{ form.peopleCount }} человек
            </p>
          </div>
          <div class="text-right">
            <p class="text-2xl font-bold text-blue-600">
              {{ tokensCost }} токенов
            </p>
            <p class="text-blue-700 text-sm">
              {{ room?.baseTokensCost }} токенов/час
            </p>
          </div>
        </div>
      </div>

      <!-- Кнопки навигации -->
      <div class="flex justify-between pt-6">
        <button
          type="button"
          @click="$emit('back')"
          class="bg-gray-200 text-gray-900 px-6 py-3 rounded-lg text-base font-medium hover:bg-gray-300 transition-colors flex items-center"
        >
          ← Назад
        </button>

        <button
          type="submit"
          :disabled="!isValid"
          class="bg-blue-600 text-white px-6 py-3 rounded-lg text-base font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          Продолжить →
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, watch } from 'vue'

interface Props {
  title?: string
  description?: string
  peopleCount?: number
  date?: string
  startTime?: string
  endTime?: string
  room?: any
}

interface Emits {
  (e: 'update:title', value: string): void
  (e: 'update:description', value: string): void
  (e: 'update:peopleCount', value: number): void
  (e: 'update:date', value: string): void
  (e: 'update:startTime', value: string): void
  (e: 'update:endTime', value: string): void
  (e: 'back'): void
  (e: 'next'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const minDate = new Date().toISOString().split('T')[0]
const timeSlots = [
  '08:00', '09:00', '10:00', '11:00', '12:00', 
  '13:00', '14:00', '15:00', '16:00', '17:00', 
  '18:00', '19:00', '20:00'
]

const form = reactive({
  title: props.title || '',
  description: props.description || '',
  peopleCount: props.peopleCount || 1,
  date: props.date || '',
  startTime: props.startTime || '',
  endTime: props.endTime || '',
})

const durationHours = computed(() => {
  if (!form.startTime || !form.endTime) return 0
  const start = new Date(`2000-01-01T${form.startTime}`)
  const end = new Date(`2000-01-01T${form.endTime}`)
  return (end.getTime() - start.getTime()) / (1000 * 60 * 60)
})

const tokensCost = computed(() => {
  if (!props.room) return 0
  const baseCost = props.room.baseTokensCost
  const capacityRatio = form.peopleCount / props.room.capacity
  const multiplier = capacityRatio > 0.8 ? 1.5 : 1
  return Math.ceil(baseCost * durationHours.value * multiplier)
})

const isValid = computed(() => {
  return form.title.length >= 5 && 
         form.description.length >= 10 && 
         form.peopleCount >= 1 && 
         form.date && 
         form.startTime && 
         form.endTime &&
         form.startTime < form.endTime
})

const isTimeDisabled = (time: string, type: 'start' | 'end') => {
  if (type === 'end' && form.startTime) {
    return time <= form.startTime
  }
  return false
}

const onSubmit = () => {
  if (isValid.value) {
    // Emit updates
    emit('update:title', form.title)
    emit('update:description', form.description)
    emit('update:peopleCount', form.peopleCount)
    emit('update:date', form.date)
    emit('update:startTime', form.startTime)
    emit('update:endTime', form.endTime)
    
    emit('next')
  }
}

// Watch for changes and emit updates
watch(
  () => form,
  (newValue) => {
    emit('update:title', newValue.title)
    emit('update:description', newValue.description)
    emit('update:peopleCount', newValue.peopleCount)
    emit('update:date', newValue.date)
    emit('update:startTime', newValue.startTime)
    emit('update:endTime', newValue.endTime)
  },
  { deep: true }
)
</script>

<style scoped>
.form-group {
  @apply space-y-2;
}
</style>