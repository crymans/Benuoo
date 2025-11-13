<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    <div class="flex items-center">
      <div class="flex-shrink-0">
        <div
          :class="[
            'rounded-md p-3',
            colorClasses[color].bg
          ]"
        >
          <component
            :is="getIcon(icon)"
            :class="[
              'w-6 h-6',
              colorClasses[color].icon
            ]"
          />
        </div>
      </div>
      <div class="ml-4">
        <p class="text-sm font-medium text-gray-500">{{ title }}</p>
        <p class="text-2xl font-bold text-gray-900">{{ value }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { FileText, Clock, CheckCircle, XCircle } from 'lucide-vue-next'

interface Props {
  title: string
  value: number
  icon: string
  color: 'blue' | 'green' | 'yellow' | 'red'
}

defineProps<Props>()

const colorClasses = {
  blue: {
    bg: 'bg-blue-50',
    icon: 'text-blue-600'
  },
  green: {
    bg: 'bg-green-50',
    icon: 'text-green-600'
  },
  yellow: {
    bg: 'bg-yellow-50',
    icon: 'text-yellow-600'
  },
  red: {
    bg: 'bg-red-50',
    icon: 'text-red-600'
  }
}

const getIcon = (iconName: string) => {
  const icons: Record<string, any> = {
    'file-text': FileText,
    'clock': Clock,
    'check-circle': CheckCircle,
    'x-circle': XCircle
  }
  return icons[iconName] || FileText
}
</script>