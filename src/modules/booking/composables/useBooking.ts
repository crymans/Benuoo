import { computed } from 'vue'
import { useBookingStore } from '@/stores/booking.store'
import type { Room, BookingRequest } from '@/core/types/booking'

export function useBooking() {
  const store = useBookingStore()
  
  const calculateTokensCost = (
    room: Room, 
    peopleCount: number, 
    durationHours: number
  ): number => {
    const baseCost = room.baseTokensCost
    const capacityRatio = peopleCount / room.capacity
    const multiplier = capacityRatio > 0.8 ? 1.5 : 1
    return Math.ceil(baseCost * durationHours * multiplier)
  }

  const getRoomById = (roomId: string) => {
    return store.rooms.find(room => room.id === roomId)
  }

  const isRoomAvailable = (
    roomId: string, 
    date: string, 
    startTime: string, 
    endTime: string,
    excludeBookingId?: string
  ): boolean => {
    const conflictingBooking = store.bookings.find(booking => {
      if (booking.roomId !== roomId || booking.status !== 'approved') return false
      if (excludeBookingId && booking.id === excludeBookingId) return false
      
      const targetStart = new Date(`${date}T${startTime}`)
      const targetEnd = new Date(`${date}T${endTime}`)
      const bookingStart = new Date(`${booking.date}T${booking.startTime}`)
      const bookingEnd = new Date(`${booking.date}T${booking.endTime}`)
      
      return targetStart < bookingEnd && targetEnd > bookingStart
    })
    
    return !conflictingBooking
  }

  return {
    calculateTokensCost,
    getRoomById,
    isRoomAvailable,
  }
}