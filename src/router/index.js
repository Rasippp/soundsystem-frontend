import { createRouter, createWebHistory } from 'vue-router'

// Import komponen pages
import LoginPage from '../pages/LoginPage.vue'
import Dashboard from '../pages/Dashboard.vue'
import PelangganList from '../pages/PelangganList.vue'
import InventoriList from '../pages/InventoriList.vue'
import FormPenyewaan from '../pages/FormPenyewaan.vue'
import RiwayatPenyewaan from '../pages/RiwayatPenyewaan.vue'

const routes = [
  { 
    path: '/', 
    redirect: '/dashboard' 
  },
  { 
    path: '/login', 
    component: LoginPage,
    meta: { requiresGuest: true }
  },
  { 
    path: '/dashboard', 
    component: Dashboard,
    meta: { requiresAuth: true }
  },
  { 
    path: '/pelanggan', 
    component: PelangganList,
    meta: { requiresAuth: true }
  },
  { 
    path: '/inventori', 
    component: InventoriList,
    meta: { requiresAuth: true }
  },
  { 
    path: '/penyewaan', 
    component: FormPenyewaan,
    meta: { requiresAuth: true }
  },
  { 
    path: '/riwayat', 
    component: RiwayatPenyewaan,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guard
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  const isAuthenticated = !!token
  
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
  } else if (to.meta.requiresGuest && isAuthenticated) {
    next('/dashboard')
  } else {
    next()
  }
})

export default router