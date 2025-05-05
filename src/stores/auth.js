// src/stores/auth.js
import { defineStore } from 'pinia'
import api from '@/services/api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null,
    loading: false,
    error: null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
  },

  actions: {
    async login(credentials) {
      this.loading = true
      this.error = null

      try {
        const response = await api.post('/auth/login', credentials)
        const { status, user, authorisation } = response.data

        if (status === 'success' && authorisation) {
          const { token, type } = authorisation
          const tokenType = type || 'Bearer'

          this.token = token
          this.user = user

          api.defaults.headers.common['Authorization'] = `${tokenType} ${token}`

          localStorage.setItem('auth_token', token)
          localStorage.setItem('auth_token_type', tokenType)
          localStorage.setItem('auth_user', JSON.stringify(user))

          // console.log('User dari API:', user)
          // this.user = user
          // console.log('User yang disimpan ke store:', this.user)

          return response.data
        }

        throw new Error('Invalid response format')
      } catch (error) {
        const message =
          error.response?.data?.message ||
          (error.response?.status === 401 ? 'Invalid credentials' : error.message || 'Login failed')

        this.error = message
        throw new Error(message)
      } finally {
        this.loading = false
      }
    },

    async logout() {
      this.loading = true
      this.error = null
      let response = null

      try {
        response = await api.post('/auth/logout')
        const status = response.data.status
        if (status === 'success' && response.data) {
          // Bersihkan data auth di semua kasus
          this.token = null
          this.user = null
          delete api.defaults.headers.common['Authorization']
          localStorage.removeItem('auth_token')
          localStorage.removeItem('auth_token_type')
          localStorage.removeItem('auth_user')
          return response.data.message
        }
      } catch (error) {
        // Jika token expired / unauthorized, tetap hapus data lokal
        const status = error.response?.status
        if (status === 401 || status === 419 || status === 403) {
          console.warn('Token expired or unauthorized during logout. Forcing cleanup.')
        } else {
          this.error = error.response?.data?.message || 'Logout failed'
          throw error.response?.data || error
        }
      } finally {
        this.loading = false

        this.token = null
        this.user = null
        delete api.defaults.headers.common['Authorization']
        localStorage.removeItem('auth_token')
        localStorage.removeItem('auth_token_type')
        localStorage.removeItem('auth_user')
      }
    },

    initAuth() {
      const token = localStorage.getItem('auth_token')
      const tokenType = localStorage.getItem('auth_token_type') || 'Bearer'
      const user = localStorage.getItem('auth_user')

      if (token && user) {
        this.token = token
        this.user = JSON.parse(user)

        api.defaults.headers.common['Authorization'] = `${tokenType} ${token}`
      } else {
        this.token = null
        this.user = null
      }
    },
  },
})
