<template>
  <footer class="bg-white border-t border-gray-200 mt-16">
    <div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <!-- Информация -->
        <div class="col-span-1 md:col-span-2">
          <div class="flex items-center mb-4">
            <BuildingIcon class="w-6 h-6 text-blue-600 mr-2" />
            <span class="text-lg font-bold text-gray-900">МГТУ им. Н.Э. Баумана</span>
          </div>
          <p class="text-gray-600 text-sm mb-4">
            Система бронирования кабинетов конгресс-холла. 
            Бронируйте помещения за токены для учебных и научных мероприятий.
          </p>
          <div class="flex space-x-4">
            <span class="text-xs text-gray-500">© 2024 МГТУ Баумана</span>
          </div>
        </div>

        <!-- Контакты -->
        <div>
          <h3 class="text-sm font-semibold text-gray-900 mb-4">Контакты</h3>
          <ul class="space-y-2 text-sm text-gray-600">
            <li>+7 (495) 123-45-67</li>
            <li>booking@bmstu.ru</li>
            <li>Москва, 2-я Бауманская ул., 5</li>
          </ul>
        </div>

        <!-- Поддержка -->
        <div>
          <h3 class="text-sm font-semibold text-gray-900 mb-4">Поддержка</h3>
          <ul class="space-y-2 text-sm text-gray-600">
            <li><button class="hover:text-blue-600 transition-colors">Правила бронирования</button></li>
            <li><button class="hover:text-blue-600 transition-colors">FAQ</button></li>
            <li><button class="hover:text-blue-600 transition-colors">Техническая поддержка</button></li>
          </ul>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { BuildingIcon } from 'lucide-vue-next'
</script>