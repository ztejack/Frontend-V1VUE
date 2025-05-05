// src/utils/getAuthToken.js
import { useAuthStore } from '@/stores/auth'

export function getAuthToken() {
  try {
    const auth = useAuthStore()
    if (auth?.token) {
      const tokenType = localStorage.getItem('auth_token_type') || 'Bearer'
      return `${tokenType} ${auth.token}`
    }
  } catch (e) {
    // Kalau dipanggil di luar context Vue
    console.warn('[getAuthToken] Pinia store belum aktif:', e)
  }

  // Fallback: pakai dari localStorage
  const token = localStorage.getItem('auth_token')
  const tokenType = localStorage.getItem('auth_token_type') || 'Bearer'
  return token ? `${tokenType} ${token}` : null
}
