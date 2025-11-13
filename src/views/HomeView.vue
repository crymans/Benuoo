<template>
  <div class="home-view min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <!-- Hero Section -->
    <div class="relative overflow-hidden">
      <div class="max-w-7xl mx-auto">
        <div class="relative z-10 pb-8 bg-transparent sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
          <main class="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
            <div class="sm:text-center lg:text-left">
              <h1 class="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                <span class="block">Бронирование кабинетов</span>
                <span class="block text-blue-600">МГТУ им. Н.Э. Баумана</span>
              </h1>
              <p class="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                Современная система бронирования помещений конгресс-холла. 
                Используйте токены для организации учебных, научных и деловых мероприятий.
              </p>
              <div class="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                <div class="rounded-md shadow">
                  <button 
                    @click="navigateToBooking"
                    class="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10 transition-colors"
                  >
                    Начать бронирование
                  </button>
                </div>
                <div class="mt-3 sm:mt-0 sm:ml-3">
                  <button 
                    @click="showInfo = true"
                    class="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 md:py-4 md:text-lg md:px-10 transition-colors"
                  >
                    Узнать больше
                  </button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      <div class="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
        <div class="h-56 w-full bg-gradient-to-r from-blue-400 to-indigo-600 sm:h-72 md:h-96 lg:w-full lg:h-full flex items-center justify-center">
          <div class="text-white text-center p-8">
            <Building class="w-24 h-24 mx-auto mb-4 opacity-80" />
            <h3 class="text-2xl font-bold">Конгресс-холл</h3>
            <p class="mt-2">Современные помещения для ваших мероприятий</p>
          </div>
        </div>
      </div>
    </div>


  <!-- Features Section без иконок -->
  <div class="py-12 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="lg:text-center">
        <h2 class="text-base text-blue-600 font-semibold tracking-wide uppercase">Возможности</h2>
        <p class="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
          Все что нужно для организации мероприятий
        </p>
      </div>

      <div class="mt-10">
        <div class="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
          <div v-for="feature in features" :key="feature.name" class="relative">
            <div class="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white font-bold">
              {{ feature.emoji }}
            </div>
            <p class="ml-16 text-lg leading-6 font-medium text-gray-900">{{ feature.name }}</p>
            <p class="mt-2 ml-16 text-base text-gray-500">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
  </div>

  <!-- ... остальной template ... -->
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const showInfo = ref(false)

const features = [
  {
    name: 'Простое бронирование',
    description: 'Интуитивно понятный процесс бронирования помещений в несколько кликов',
    emoji: '📅'
  },
  {
    name: 'Токеновая система',
    description: 'Оплачивайте бронирования внутренней валютой университета',
    emoji: '🪙'
  },
  {
    name: 'Мгновенное подтверждение',
    description: 'Быстрая модерация заявок администраторами системы',
    emoji: '✅'
  },
  {
    name: 'Гибкие настройки',
    description: 'Выбирайте подходящее время, количество людей и тип помещения',
    emoji: '👥'
  },
  {
    name: 'Реальное время',
    description: 'Актуальная информация о доступности помещений',
    emoji: '⏰'
  },
  {
    name: 'Лучшие помещения',
    description: 'Доступ к современным оборудованным кабинетам конгресс-холла',
    emoji: '📍'
  }
]

const stats = [
  { id: 1, name: 'Доступных кабинетов', value: '15+' },
  { id: 2, name: 'Бронирований в день', value: '50+' },
  { id: 3, name: 'Довольных пользователей', value: '1000+' }
]

const navigateToBooking = () => {
  router.push('/booking')
}
</script>