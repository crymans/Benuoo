<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Заголовок -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Панель администратора</h1>
        <p class="text-gray-600 mt-2">Управление заявками на бронирование</p>
      </div>

      <!-- Статистика -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Всего заявок"
          :value="bookings.bookings.length"
          icon="file-text"
          color="blue"
        />
        <StatCard
          title="Ожидают рассмотрения"
          :value="bookings.pendingBookings.length"
          icon="clock"
          color="yellow"
        />
        <StatCard
          title="Подтверждено"
          :value="bookings.approvedBookings.length"
          icon="check-circle"
          color="green"
        />
        <StatCard
          title="Отклонено"
          :value="bookings.rejectedBookings.length"
          icon="x-circle"
          color="red"
        />
      </div>

      <!-- Таблица заявок -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200">
        <div class="px-6 py-4 border-b border-gray-200">
          <h2 class="text-lg font-semibold text-gray-900">Заявки на бронирование</h2>
        </div>
        
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b border-gray-200">
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Мероприятие
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Кабинет
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Дата/Время
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Люди
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Статус
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr
                v-for="booking in bookings.bookings"
                :key="booking.id"
                class="hover:bg-gray-50 transition-colors"
              >
                <td class="px-6 py-4 whitespace-nowrap">
                  <div>
                    <p class="text-sm font-medium text-gray-900">{{ booking.title }}</p>
                    <p class="text-sm text-gray-500 line-clamp-2">{{ booking.description }}</p>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="text-sm text-gray-900">
                    {{ bookings.getRoomById(booking.roomId)?.name }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">
                    <p>{{ formatDate(booking.date) }}</p>
                    <p class="text-gray-500">{{ booking.startTime }} - {{ booking.endTime }}</p>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="text-sm text-gray-900">{{ booking.peopleCount }} чел.</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <StatusBadge :status="booking.status" />
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="flex space-x-2" v-if="booking.status === 'pending'">
                    <BaseButton
                      size="sm"
                      @click="approveBooking(booking.id)"
                    >
                      Одобрить
                    </BaseButton>
                    <BaseButton
                      variant="danger"
                      size="sm"
                      @click="rejectBooking(booking.id)"
                    >
                      Отклонить
                    </BaseButton>
                  </div>
                  <span v-else class="text-gray-400 text-sm">
                    Обработано
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Пустое состояние -->
        <div
          v-if="bookings.bookings.length === 0"
          class="text-center py-12"
        >
          <FileText class="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p class="text-gray-500">Нет заявок на бронирование</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import { FileText } from 'lucide-vue-next'
import { useBookingStore } from '@/stores/booking.store'
import BaseButton from '@/shared/ui/BaseButton.vue'
import StatCard from '@/modules/admin/components/StatCard.vue'
import StatusBadge from '@/modules/admin/components/StatusBadge.vue'

const bookings = useBookingStore()

const formatDate = (dateString: string) => {
  return format(new Date(dateString), 'd MMMM yyyy', { locale: ru })
}

const approveBooking = (bookingId: string) => {
  bookings.updateBookingStatus(bookingId, 'approved')
  // В реальном приложении здесь будет вызов API
}

const rejectBooking = (bookingId: string) => {
  bookings.updateBookingStatus(bookingId, 'rejected')
  // В реальном приложении здесь будет вызов API
}
</script>