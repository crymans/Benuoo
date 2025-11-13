import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/HomeView.vue')
  },
  {
    path: '/booking',
    name: 'Booking',
    component: () => import('@/views/BookingView.vue')
  },
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('@/views/AdminView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Optional: Add navigation guards if needed
router.beforeEach((to, from, next) => {
  const auth = useAuthStore()
  
  // Example: Protect admin routes
  if (to.path === '/admin' && !auth.isAdmin) {
    next('/')
  } else {
    next()
  }
})

export default router