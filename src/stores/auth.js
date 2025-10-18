import { defineStore } from 'pinia'
import { authAPI } from '../api/auth.js'  // Relative path

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || null,
    user: JSON.parse(localStorage.getItem('user')) || null,
    isLoading: false,
    error: null
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    isLoggedIn: (state) => !!state.token,
    getUser: (state) => state.user,
    getToken: (state) => state.token
  },

  actions: {
    async login(credentials) {
      this.isLoading = true
      this.error = null
      
      try {
        const response = await authAPI.login(credentials)
        
        if (response.data.token) {
          this.token = response.data.token
          this.user = this.decodeToken(response.data.token)
          
          localStorage.setItem('token', this.token)
          localStorage.setItem('user', JSON.stringify(this.user))
          
          // Return success - redirect di component
          return true
        }
      } catch (error) {
        this.error = error.response?.data || 'Login failed'
        throw error
      } finally {
        this.isLoading = false
      }
    },

    logout() {
      this.token = null
      this.user = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      // Redirect akan dilakukan di component
    },

    decodeToken(token) {
      try {
        const payload = token.split('.')[1]
        const decoded = JSON.parse(atob(payload))
        return {
          username: decoded.sub,
          nama: decoded.nama,
          role: decoded.role
        }
      } catch (error) {
        console.error('Error decoding token:', error)
        return null
      }
    },

    initializeAuth() {
      const token = localStorage.getItem('token')
      if (token) {
        this.token = token
        this.user = this.decodeToken(token)
      }
    }
  }
})