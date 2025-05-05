<template>
  <div class="w-screen h-screen flex items-center justify-center bg-gray-700 dark:bg-gray-700 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8 bg-gray-200 p-8 rounded-lg shadow-md">
      <div>
        <h2 class="mt-6 text-center text-3xl font-bold text-gray-900">Sign in to your account</h2>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <div class="-space-y-px">
          <div class="rounded-md shadow-sm mb-1">
            <div>
              <label for="login" class="sr-only">Email/Username</label>
              <input
                id="login"
                name="login"
                type="text"
                autocomplete="login"
                required
                v-model="credentials.login"
                class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-gray-500 focus:border-gray-500 focus:z-10 sm:text-sm"
                placeholder="Email address/Username"
              />
            </div>
            <div>
              <label for="password" class="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autocomplete="current-password"
                required
                v-model="credentials.password"
                class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-gray-500 focus:border-gray-500 focus:z-10 sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>
          <span v-if="error" class="block text-sm sm:inline text-red-700 px-2">{{ error }}</span>
        </div>
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              v-model="credentials.remember"
              class="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-100 rounded"
            />
            <label for="remember-me" class="ml-2 block text-sm text-zinc-600"> Remember me </label>
          </div>
        </div>

        <div>
          <button
            type="submit"
            :disabled="loading"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-teal-400 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-700"
          >
            <span v-if="loading" class="absolute left-0 inset-y-0 flex items-center pl-3">
              <!-- Spinner icon -->
              <svg
                class="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </span>
            {{ loading ? 'Signing in...' : 'Sign in' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '../services/authService'

const router = useRouter()
const loading = ref(false)
const error = ref('')

const credentials = reactive({
  login: '',
  password: '',
  remember: false,
})

onMounted(() => {
  // Redirect jika sudah login
  if (authService.isAuthenticated()) {
    router.push({ name: 'Home' })
  }
})

const handleLogin = async () => {
  loading.value = true
  error.value = ''

  try {
    await authService.login(credentials)
    router.push({ name: 'Home' })
  } catch (err) {
    error.value = err.message || 'Login failed. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>
