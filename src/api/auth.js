import axios from 'axios'

// Base URL — bisa kamu ubah ke proxy "/api" nanti
const BASE_URL = 'http://localhost:8080/api'

// Buat instance axios
const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: false, // ❌ Jangan true kalau backend pakai JWT (bukan cookie)
  headers: {
    'Content-Type': 'application/json',
  },
})

// 🔹 Tambahkan token JWT di setiap request
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

// 🔹 Tangani error global
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Kalau token expired atau tidak valid
    if (error.response?.status === 401) {
      console.warn('⚠️ Token invalid atau expired, logout otomatis.')
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    // Kalau user tidak punya izin
    if (error.response?.status === 403) {
      console.warn('🚫 Akses ditolak (403 Forbidden)')
      alert('Kamu tidak memiliki izin untuk mengakses data ini.')
    }
    return Promise.reject(error)
  }
)

// 🔹 Endpoint Auth
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
}

export default api
