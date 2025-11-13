<template>
  <div 
    v-if="!iconComponent"
    class="inline-flex items-center justify-center bg-gray-200 rounded"
    :style="{
      width: size + 'px',
      height: size + 'px'
    }"
  >
    <span class="text-xs text-gray-600">{{ name.charAt(0) }}</span>
  </div>
  <component 
    v-else
    :is="iconComponent"
    :size="size"
    class="inline-block"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  name: string
  size?: number
}

const props = withDefaults(defineProps<Props>(), {
  size: 24
})

// Простой fallback для иконок
const iconComponent = computed(() => {
  try {
    // Динамический импорт иконок
    const iconMap: Record<string, any> = {
      'Building': Building,
      'Calendar': Calendar,
      'Coins': Coins,
      'CheckCircle': CheckCircle,
      'Users': Users,
      'Clock': Clock,
      'MapPin': MapPin,
      'ArrowLeft': ArrowLeft,
      'ArrowRight': ArrowRight,
      'FileText': FileText,
      'LogOut': LogOut,
      // Добавьте другие иконки по мере необходимости
    }
    
    return iconMap[props.name]
  } catch (error) {
    console.warn(`Icon "${props.name}" not found`)
    return null
  }
})

// Импортируем все необходимые иконки
import { 
  Building, 
  Calendar, 
  Coins,
  CheckCircle, 
  
  Users,
  Clock,
  MapPin,
  ArrowLeft,
  ArrowRight,
  FileText,
  LogOut
} from 'lucide-vue-next'
</script>