// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/dashboard' // Redirect root (/) ke /dashboard
  },
  {
    path: '/dashboard', // Diubah dari '/' jadi '/dashboard'
    name: 'Dashboard',
    component: () => import('../pages/Dashboard.vue'),
    meta: { requiresAuth: true }
  },

  // KONTRAK ROUTES (Job Order)
  {
    path: '/kontrak',
    name: 'KontrakList',
    component: () => import('../pages/KontrakList.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/kontrak/create',
    name: 'KontrakCreate',
    component: () => import('../pages/KontrakForm.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/kontrak/:id/edit',
    name: 'KontrakEdit',
    component: () => import('../pages/KontrakForm.vue'),
    meta: { requiresAuth: true }
  },
 
  {
  path: '/kontrak/:id',
  name: 'KontrakDetail',
  component: () => import('../pages/KontrakDetail.vue'),
  meta: { requiresAuth: true }
},


  // PELANGGAN ROUTES (Ditambahkan kembali)
  {
    path: '/pelanggan',
    name: 'PelangganList',
    component: () => import('../pages/PelangganList.vue'),
    meta: { requiresAuth: true }
  },

  // INVENTORY ROUTES
  {
    path: '/inventori', // Diubah dari '/inventory' (pake y)
    name: 'InventoryList',
    component: () => import('../pages/InventoriList.vue'),
    meta: { requiresAuth: true }
  },
  // {
  //   path: '/inventori/create', // Dibuka komen & disesuaikan path
  //   name: 'InventoryCreate',
  //   component: () => import('../pages/InventoriForm.vue'),
  //   meta: { requiresAuth: true }
  // },
  // {
  //   path: '/inventori/:id/edit', // Dibuka komen & disesuaikan path
  //   name: 'InventoryEdit',
  //   component: () => import('../pages/InventoriForm.vue'),
  //   meta: { requiresAuth: true }
  // },

  // SURAT JALAN ROUTES
  {
    path: '/surat-jalan',
    name: 'SuratJalanList',
    component: () => import('../pages/SuratJalanList.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/surat-jalan/create',
    name: 'SuratJalanCreate',
    component: () => import('../pages/SuratJalanForm.vue'),
    meta: { requiresAuth: true }
  },
  // {
  //   path: '/surat-jalan/:id', // Dibuka komen
  //   name: 'SuratJalanDetail',
  //   component: () => import('../pages/SuratJalanDetail.vue'),
  //   meta: { requiresAuth: true }
  // },

  // INVOICE ROUTES
  {
    path: '/invoice', // Dibuka komen & diubah dari '/invoices' (jamak)
    name: 'InvoiceList',
    component: () => import('../pages/InvoiceList.vue'), // Path import disamakan
    meta: { requiresAuth: true }
  },
  // {
  //   path: '/invoice/:id', // Dibuka komen & diubah dari '/invoices' (jamak)
  //   name: 'InvoiceDetail',
  //   component: () => import('../pages/InvoiceDetail.vue'), // Path import disamakan
  //   meta: { requiresAuth: true }
  // },

  // TEAM MANAGEMENT ROUTES
  // {
  //   path: '/teams', // Dibuka komen
  //   name: 'TeamList',
  //   component: () => import('../pages/TeamList.vue'), // Path import disamakan
  //   meta: { requiresAuth: true }
  // },
  // {
  //   path: '/teams/create', // Dibuka komen
  //   name: 'TeamCreate',
  //   component: () => import('../pages/TeamForm.vue'), // Path import disamakan
  //   meta: { requiresAuth: true }
  // },

  // ACCOUNTING/REPORTS ROUTES
  // {
  //   path: '/accounting/sales', // Dibuka komen
  //   name: 'SalesJournal',
  //   component: () => import('../pages/SalesJournal.vue'), // Path import disamakan
  //   meta: { requiresAuth: true }
  // },
  // {
  //   path: '/accounting/expenses', // Dibuka komen
  //   name: 'ExpenseJournal',
  //   component: () => import('../pages/ExpenseJournal.vue'), // Path import disamakan
  //   meta: { requiresAuth: true }
  // },
  // {
  //   path: '/reports', // Dibuka komen
  //   name: 'Reports',
  //   component: () => import('../pages/ReportsDashboard.vue'), // Path import disamakan
  //   meta: { requiresAuth: true }
  // },

  // AUTH ROUTES
  {
    path: '/login',
    name: 'Login',
    component: () => import('../pages/LoginPage.vue'),
    meta: { guest: true }
  },
  {
    path: '/logout',
    name: 'Logout',
    beforeEnter: (to, from, next) => {
      // Clear auth token
      localStorage.removeItem('token')
      next('/login')
    }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// Navigation Guard
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const isGuest = to.matched.some(record => record.meta.guest)

  if (requiresAuth && !token) {
    next('/login')
  } else if (isGuest && token) {
    next('/') // Ini sudah benar, karena '/' akan me-redirect ke '/dashboard'
  } else {
    next()
  }
})

export default router