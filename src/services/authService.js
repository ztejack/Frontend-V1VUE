// src/services/authService.js
import { useAuthStore } from '../stores/auth'
// import router from '@/router'

export const authService = {
  login: (credentials) => {
    const auth = useAuthStore()
    return auth.login(credentials)
  },
  logout: async () => {
    const auth = useAuthStore()
    try {
      const response = await auth.logout()
      return response
    } catch (e) {
      console.error('Logout error:', e)
      throw e
    }
  },
  isAuthenticated: () => {
    const auth = useAuthStore()
    return auth.isAuthenticated
  },
  getUser: () => {
    const auth = useAuthStore()
    return auth.user
  },
  getToken: () => {
    const auth = useAuthStore()
    return auth.token
  },
  initAuth: () => {
    const auth = useAuthStore()
    auth.initAuth()
  },
}
