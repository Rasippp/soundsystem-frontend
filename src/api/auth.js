import axios from 'axios'

// 🌐 Base URL ke backend Spring Boot
const BASE_URL = 'http://localhost:8080/api'

// 🔹 Buat instance axios utama
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 🔹 Interceptor: Tambahkan token JWT di setiap request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// 🔹 Interceptor: Tangani error global (401, 403, dll)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn('⚠️ Token invalid atau expired, logout otomatis.')
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    if (error.response?.status === 403) {
      console.warn('🚫 Akses ditolak (403 Forbidden)')
      alert('Kamu tidak memiliki izin untuk mengakses data ini.')
    }
    return Promise.reject(error)
  }
)

// 🔹 Auth API (login)
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
}

// 🔹 Export default supaya bisa dipakai semua service
export default api
