// src/services/api.js
import axios from 'axios'
import { getAuthToken } from '@/helpers/getAuthToken'
import { useAuthStore } from '@/stores/auth'
import router from '@/router'
// const httpsAgent = new httpsAgent.Agent({
//   rejectUnauthorized: false, // BYPASS sertifikat SSL
// })
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api/v1/',
  // baseURL: import.meta.env.VITE_API_URL || 'https://119.252.161.220/api/v1/',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'MYP-API-KEY': import.meta.env.VITE_API_KEY,
  },
  // httpsAgent,
})

// Tambahkan Authorization header otomatis
api.interceptors.request.use((config) => {
  const token = getAuthToken()
  if (token) {
    config.headers.Authorization = token
  }
  return config
})

// Handle token expired
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const auth = useAuthStore()

    // Tangani error koneksi ke server
    const isConnectionError =
      !error.response &&
      (error.message?.includes('Network Error') ||
        error.message?.includes('net::ERR_FAILED') ||
        error.code === 'ERR_NETWORK')

    if (isConnectionError) {
      router.push({ name: 'CONNECTION_FAILED' })
      return Promise.reject(error)
    }

    // Tangani Unauthorized
    if (error.response?.status === 401) {
      auth.token = null
      auth.user = null
      auth.error = 'Session expired'

      localStorage.removeItem('auth_token')
      localStorage.removeItem('auth_token_type')
      localStorage.removeItem('auth_user')
      delete api.defaults.headers.common['Authorization']

      router.push({ name: 'Login' })
    }

    // Tangani Forbidden
    if (error.response?.status === 403) {
      auth.error = 'Access denied'
      router.push({ name: 'home' })
      return
    }

    return Promise.reject(error)
  },
)

export default api
