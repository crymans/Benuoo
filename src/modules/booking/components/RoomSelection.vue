<template>
  <div class="room-selection">
    <div class="mb-6">
      <h2 class="text-2xl font-bold text-gray-900 mb-2">Выберите кабинет</h2>
      <p class="text-gray-600">Доступные для бронирования помещения</p>
    </div>

    <!-- Фильтры -->
    <div class="mb-6 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
      <div class="flex flex-wrap gap-4">
        <div class="flex-1 min-w-[200px]">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Вместимость
          </label>
          <select 
            v-model="filters.capacity"
            class="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          >
            <option :value="null">Любая</option>
            <option value="5">До 5 человек</option>
            <option value="10">До 10 человек</option>
            <option value="20">До 20 человек</option>
            <option value="50">До 50 человек</option>
          </select>
        </div>
        
        <div class="flex-1 min-w-[200px]">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Этаж
          </label>
          <select 
            v-model="filters.floor"
            class="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          >
            <option :value="null">Любой</option>
            <option v-for="floor in floors" :key="floor" :value="floor">
              {{ floor }} этаж
            </option>
          </select>
        </div>

        <div class="flex-1 min-w-[200px]">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Оснащение
          </label>
          <select 
            v-model="filters.feature"
            class="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          >
            <option :value="null">Любое</option>
            <option value="projector">Проектор</option>
            <option value="video_conference">Видеоконференция</option>
            <option value="whiteboard">Маркерная доска</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Список комнат -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="room in filteredRooms"
        :key="room.id"
        :class="[
          'room-card group cursor-pointer transition-all duration-300',
          'bg-white rounded-xl shadow-sm border-2 hover:shadow-md',
          selectedRoomId === room.id 
            ? 'border-blue-500 ring-2 ring-blue-100' 
            : 'border-gray-200 hover:border-gray-300'
        ]"
        @click="selectRoom(room)"
      >
        <div class="p-6">
          <!-- Заголовок и статус -->
          <div class="flex items-start justify-between mb-3">
            <h3 class="text-lg font-semibold text-gray-900 group-hover:text-blue-600">
              {{ room.name }}
            </h3>
            <span 
              v-if="room.isActive"
              class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
            >
              Доступно
            </span>
          </div>

          <!-- Описание -->
          <p class="text-gray-600 text-sm mb-4 line-clamp-2">
            {{ room.description }}
          </p>

          <!-- Характеристики -->
          <div class="space-y-2 mb-4">
            <div class="flex items-center text-sm text-gray-500">
              <Users class="w-4 h-4 mr-2" />
              {{ room.capacity }} человек
            </div>
            <div class="flex items-center text-sm text-gray-500">
              <MapPin class="w-4 h-4 mr-2" />
              {{ room.location }}, {{ room.floor }} этаж
            </div>
            <div class="flex items-center text-sm text-gray-500">
              <Coins class="w-4 h-4 mr-2" />
              {{ room.baseTokensCost }} токенов/час
            </div>
          </div>

          <!-- Оснащение -->
          <div class="flex flex-wrap gap-1 mb-4">
            <span
              v-for="feature in room.features.slice(0, 3)"
              :key="feature"
              class="inline-flex items-center px-2 py-1 rounded-md text-xs bg-gray-100 text-gray-700"
            >
              {{ getFeatureName(feature) }}
            </span>
            <span 
              v-if="room.features.length > 3"
              class="inline-flex items-center px-2 py-1 rounded-md text-xs bg-gray-100 text-gray-700"
            >
              +{{ room.features.length - 3 }}
            </span>
          </div>

          <!-- Кнопка выбора -->
          <BaseButton
            :variant="selectedRoomId === room.id ? 'primary' : 'outline'"
            size="sm"
            class="w-full"
            @click.stop="selectRoom(room)"
          >
            {{ selectedRoomId === room.id ? 'Выбрано' : 'Выбрать' }}
          </BaseButton>
        </div>
      </div>
    </div>

    <!-- Пагинация -->
    <div class="mt-8 flex justify-center">
      <nav class="flex items-center space-x-2">
        <button
          v-for="page in totalPages"
          :key="page"
          :class="[
            'px-3 py-1 rounded-md text-sm font-medium transition-colors',
            currentPage === page
              ? 'bg-blue-600 text-white'
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
          ]"
          @click="currentPage = page"
        >
          {{ page }}
        </button>
      </nav>
    </div>

    <!-- Кнопка продолжения -->
    <div class="mt-8 flex justify-end">
      <BaseButton
        :disabled="!selectedRoomId"
        size="lg"
        @click="$emit('next')"
      >
        Продолжить
        <ArrowRight class="w-4 h-4" />
      </BaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Users, MapPin, Coins, ArrowRight } from 'lucide-vue-next'
import BaseButton from '@/shared/ui/BaseButton.vue'
import type { Room } from '@/core/types/booking'

interface Props {
  selectedRoomId?: string
}

interface Emits {
  (e: 'update:selectedRoomId', value: string): void
  (e: 'next'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Mock данные - в реальном приложении будут приходить с API
const rooms = ref<Room[]>([
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
  {
    id: '3',
    name: 'Компьютерный класс',
    description: 'Оборудован современными компьютерами для практических занятий',
    capacity: 25,
    baseTokensCost: 15,
    features: ['computers', 'projector', 'wifi'],
    location: 'Главный корпус',
    floor: 2,
    isActive: true,
  },
])

const filters = ref({
  capacity: null as number | null,
  floor: null as number | null,
  feature: null as string | null,
})

const currentPage = ref(1)
const itemsPerPage = 6

const floors = [1, 2, 3, 4, 5]

const filteredRooms = computed(() => {
  let filtered = rooms.value.filter(room => room.isActive)

  if (filters.value.capacity) {
    filtered = filtered.filter(room => room.capacity <= Number(filters.value.capacity))
  }

  if (filters.value.floor) {
    filtered = filtered.filter(room => room.floor === filters.value.floor)
  }

  if (filters.value.feature) {
    filtered = filtered.filter(room => 
      room.features.includes(filters.value.feature!)
    )
  }

  // Пагинация
  const startIndex = (currentPage.value - 1) * itemsPerPage
  return filtered.slice(startIndex, startIndex + itemsPerPage)
})

const totalPages = computed(() => {
  return Math.ceil(rooms.value.length / itemsPerPage)
})

const getFeatureName = (feature: string): string => {
  const featureNames: Record<string, string> = {
    projector: 'Проектор',
    whiteboard: 'Доска',
    video_conference: 'Видеоконференция',
    sound_system: 'Аудиосистема',
    computers: 'Компьютеры',
    air_conditioning: 'Кондиционер',
    wifi: 'Wi-Fi',
  }
  return featureNames[feature] || feature
}

const selectRoom = (room: Room) => {
  emit('update:selectedRoomId', room.id)
}

onMounted(() => {
  // В реальном приложении здесь был бы запрос к API
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.room-card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.room-card:hover {
  transform: translateY(-2px);
}
</style>