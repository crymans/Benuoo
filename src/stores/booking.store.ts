import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { BookingRequest, Room, BookingStatus } from '@/core/types/booking'

// Тестовые данные
const mockRooms: Room[] = [
  {
    id: '1',
    name: 'Конференц-зал А',
    description: 'Просторный зал для проведения конференций, семинаров и защит дипломов. Оснащен современным мультимедийным оборудованием.',
    capacity: 50,
    baseTokensCost: 20,
    features: ['projector', 'video_conference', 'sound_system', 'air_conditioning', 'wifi'],
    location: 'Главный корпус',
    floor: 3,
    isActive: true,
  },
  {
    id: '2',
    name: 'Переговорная 101',
    description: 'Уютная комната для командных встреч, обсуждений проектов и мозговых штурмов.',
    capacity: 8,
    baseTokensCost: 8,
    features: ['whiteboard', 'wifi', 'air_conditioning'],
    location: 'Корпус УЛК',
    floor: 1,
    isActive: true,
  },
  {
    id: '3',
    name: 'Компьютерный класс 205',
    description: 'Оборудован современными компьютерами для практических занятий, программирования и работы с CAD-системами.',
    capacity: 25,
    baseTokensCost: 15,
    features: ['computers', 'projector', 'wifi', 'air_conditioning'],
    location: 'Главный корпус',
    floor: 2,
    isActive: true,
  },
  {
    id: '4',
    name: 'Аудитория 310',
    description: 'Стандартная учебная аудитория с проектором и маркерной доской. Идеально для лекций и семинаров.',
    capacity: 35,
    baseTokensCost: 12,
    features: ['projector', 'whiteboard', 'wifi'],
    location: 'Главный корпус',
    floor: 3,
    isActive: true,
  },
]

const mockBookings: BookingRequest[] = [
  {
    id: '1',
    roomId: '1',
    userId: '1',
    title: 'Защита дипломных проектов',
    description: 'Ежегодная защита дипломных проектов студентов факультета ИУ. Присутствуют члены комиссии и приглашенные гости.',
    peopleCount: 45,
    date: '2024-01-20',
    startTime: '10:00',
    endTime: '14:00',
    tokensCost: 80,
    status: 'approved',
    createdAt: '2024-01-10T09:00:00',
    updatedAt: '2024-01-11T14:30:00',
  },
  {
    id: '2',
    roomId: '2',
    userId: '2',
    title: 'Совещание по разработке',
    description: 'Еженедельное совещание команды разработки ПО. Обсуждение текущих задач и планирование спринта.',
    peopleCount: 6,
    date: '2024-01-15',
    startTime: '15:00',
    endTime: '16:30',
    tokensCost: 12,
    status: 'pending',
    createdAt: '2024-01-14T11:20:00',
    updatedAt: '2024-01-14T11:20:00',
  },
  {
    id: '3',
    roomId: '3',
    userId: '3',
    title: 'Практикум по программированию',
    description: 'Практическое занятие по курсу "Алгоритмы и структуры данных". Работа с алгоритмами сортировки.',
    peopleCount: 20,
    date: '2024-01-18',
    startTime: '09:00',
    endTime: '11:00',
    tokensCost: 30,
    status: 'approved',
    createdAt: '2024-01-12T16:45:00',
    updatedAt: '2024-01-13T10:15:00',
  },
]

export const useBookingStore = defineStore('booking', () => {
  const bookings = ref<BookingRequest[]>(mockBookings)
  const rooms = ref<Room[]>(mockRooms)
  const isLoading = ref(false)

  const pendingBookings = computed(() => 
    bookings.value.filter(b => b.status === 'pending')
  )

  const approvedBookings = computed(() =>
    bookings.value.filter(b => b.status === 'approved')
  )

  const rejectedBookings = computed(() =>
    bookings.value.filter(b => b.status === 'rejected')
  )

  const setBookings = (newBookings: BookingRequest[]) => {
    bookings.value = newBookings
  }

  const setRooms = (newRooms: Room[]) => {
    rooms.value = newRooms
  }

  const updateBookingStatus = (bookingId: string, status: BookingStatus, adminNotes?: string) => {
    const booking = bookings.value.find(b => b.id === bookingId)
    if (booking) {
      booking.status = status
      booking.updatedAt = new Date().toISOString()
    }
  }

  const addBooking = (booking: Omit<BookingRequest, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newBooking: BookingRequest = {
      ...booking,
      id: `booking-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    bookings.value.push(newBooking)
    return newBooking
  }

  const getRoomById = (roomId: string) => {
    return rooms.value.find(room => room.id === roomId)
  }

  const getBookingsByRoom = (roomId: string) => {
    return bookings.value.filter(booking => booking.roomId === roomId)
  }

  const calculateTokensCost = (room: Room, peopleCount: number, durationHours: number): number => {
    const baseCost = room.baseTokensCost
    const capacityRatio = peopleCount / room.capacity
    const multiplier = capacityRatio > 0.8 ? 1.5 : 1
    return Math.ceil(baseCost * durationHours * multiplier)
  }

  return {
    bookings,
    rooms,
    isLoading,
    pendingBookings,
    approvedBookings,
    rejectedBookings,
    setBookings,
    setRooms,
    updateBookingStatus,
    addBooking,
    getRoomById,
    getBookingsByRoom,
    calculateTokensCost,
  }
})