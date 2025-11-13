import { apiClient } from './client'
import type { 
  BookingRequest, 
  Room, 
  BookingCreateDto, 
  BookingUpdateDto,
  PaginatedResponse 
} from '@/core/types/booking'

export const bookingApi = {
  // Rooms
  getRooms: () => 
    apiClient.get<Room[]>('/rooms'),
  
  getRoom: (id: string) => 
    apiClient.get<Room>(`/rooms/${id}`),
  
  // Bookings
  getBookings: (params?: { page?: number; limit?: number; status?: string }) =>
    apiClient.get<PaginatedResponse<BookingRequest>>('/bookings', { params }),
  
  getUserBookings: (params?: { page?: number; limit?: number }) =>
    apiClient.get<PaginatedResponse<BookingRequest>>('/bookings/my', { params }),
  
  getPendingBookings: () =>
    apiClient.get<BookingRequest[]>('/bookings/pending'),
  
  createBooking: (data: BookingCreateDto) =>
    apiClient.post<BookingRequest>('/bookings', data),
  
  updateBookingStatus: (id: string, data: BookingUpdateDto) =>
    apiClient.patch<BookingRequest>(`/bookings/${id}/status`, data),
  
  cancelBooking: (id: string) =>
    apiClient.post<BookingRequest>(`/bookings/${id}/cancel`),
}