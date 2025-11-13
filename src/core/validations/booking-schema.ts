import { z } from 'zod'

export const bookingCreateSchema = z.object({
  roomId: z.string().min(1, 'Выберите кабинет'),
  title: z.string()
    .min(5, 'Название должно содержать минимум 5 символов')
    .max(100, 'Название слишком длинное'),
  description: z.string()
    .min(10, 'Описание должно содержать минимум 10 символов')
    .max(500, 'Описание слишком длинное'),
  peopleCount: z.number()
    .min(1, 'Минимум 1 человек')
    .max(100, 'Слишком много людей'),
  date: z.string().min(1, 'Выберите дату'),
  startTime: z.string().min(1, 'Выберите время начала'),
  endTime: z.string().min(1, 'Выберите время окончания'),
}).refine((data) => {
  const start = new Date(`2000-01-01T${data.startTime}`)
  const end = new Date(`2000-01-01T${data.endTime}`)
  return start < end
}, {
  message: 'Время окончания должно быть после времени начала',
  path: ['endTime'],
})

// Используем BookingCreateDto вместо BookingCreateForm
export type BookingCreateForm = z.infer<typeof bookingCreateSchema>