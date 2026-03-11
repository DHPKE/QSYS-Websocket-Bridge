import { defineStore } from 'pinia'
import api from '../api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token') || null
  }),
  
  getters: {
    isAuthenticated: (state) => !!state.token,
    isAdmin: (state) => state.user?.role === 'admin',
    isOperator: (state) => ['admin', 'operator'].includes(state.user?.role)
  },
  
  actions: {
    async login(username, password) {
      try {
        const response = await api.post('/api/auth/login', { username, password })
        this.token = response.data.token
        this.user = response.data.user
        localStorage.setItem('token', this.token)
        return { success: true }
      } catch (error) {
        return {
          success: false,
          error: error.response?.data?.error || 'Login failed'
        }
      }
    },
    
    async register(username, password, role = 'viewer') {
      try {
        const response = await api.post('/api/auth/register', {
          username,
          password,
          role
        })
        return { success: true, data: response.data }
      } catch (error) {
        return {
          success: false,
          error: error.response?.data?.error || 'Registration failed'
        }
      }
    },
    
    logout() {
      this.user = null
      this.token = null
      localStorage.removeItem('token')
    },
    
    async checkAuth() {
      if (!this.token) return false
      
      try {
        const response = await api.get('/health')
        return response.status === 200
      } catch (error) {
        this.logout()
        return false
      }
    }
  }
})
