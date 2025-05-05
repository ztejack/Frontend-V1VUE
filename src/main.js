import './assets/main.css'
import 'vue-toastification/dist/index.css'
// import 'tailwindcss'

// Components
import App from './App.vue'
import { createApp } from 'vue'
import router from './router'
import { createPinia } from 'pinia'
import { useAuthStore } from './stores/auth'
import Toast from 'vue-toastification'

// import LaravelPagination from 'laravel-vue-pagination'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.mount('#app')
// app.component('TailwindPagination ', LaravelPagination)

app.use(Toast, {
  position: 'top-right',
  timeout: 3000,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: false,
  closeButton: 'button',
  icon: true,
})
// 🔁 Panggil setelah Pinia aktif
useAuthStore().initAuth()
