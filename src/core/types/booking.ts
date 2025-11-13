export interface BookingCreateDto {
  roomId: string
  title: string
  description: string
  peopleCount: number
  date: string
  startTime: string
  endTime: string
}

// Убедитесь, что все остальные интерфейсы на месте
export interface BookingRequest {
  id: string
  roomId: string
  userId: string
  title: string
  description: string
  peopleCount: number
  date: string
  startTime: string
  endTime: string
  tokensCost: number
  status: BookingStatus
  createdAt: string
  updatedAt: string
  user?: User
  room?: Room
}

export interface Room {
  id: string
  name: string
  description: string
  capacity: number
  baseTokensCost: number
  features: RoomFeature[]
  imageUrl?: string
  isActive: boolean
  location: string
  floor: number
}

export type BookingStatus = 
  | 'pending' 
  | 'approved' 
  | 'rejected' 
  | 'cancelled'
  | 'completed'

export type RoomFeature = 
  | 'projector' 
  | 'whiteboard' 
  | 'video_conference' 
  | 'sound_system' 
  | 'computers'
  | 'air_conditioning'
  | 'wifi'

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  avatar?: string
  tokensBalance: number
  role: UserRole
  department?: string
}

export type UserRole = 'user' | 'admin' | 'super_admin'

export interface BookingUpdateDto {
  status?: BookingStatus
  adminNotes?: string
}

export interface ApiResponse<T = unknown> {
  success: boolean
  data: T
  message?: string
  meta?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}