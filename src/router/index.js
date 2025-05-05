import { createRouter, createWebHistory } from 'vue-router'
import { authService } from '../services/authService'
import HomeView from '@/views/HomeView.vue'
import UsersView from '@/views/Users/UsersView.vue'
import LoginView from '@/views/LoginView.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import AuthLayout from '@/layouts/AuthLayout.vue'
import InspeksiView from '@/views/Inspeksis/InspeksiView.vue'
import MaintenancesView from '@/views/Maintenances/MaintenancesView.vue'
import MaintenanceDetailView from '@/views/Maintenances/MaintenanceDetail.vue'
import AssetsView from '@/views/Assets/AssetsView.vue'
import AssetsDetailView from '@/views/Assets/AssetsDetailView.vue'
import InspeksiDetailView from '@/views/Inspeksis/InspeksiDetail.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: DefaultLayout,
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'Home',
          component: HomeView,
        },
        {
          path: 'users',
          name: 'Users',
          component: UsersView,
        },
        {
          path: 'maintenances',
          name: 'Maintenances',
          component: MaintenancesView,
        },
        {
          path: '/maintenances/:id',
          name: 'MaintenanceDetail',
          component: MaintenanceDetailView,
          props: true,
        },
        {
          path: 'inspeksis',
          name: 'Inspeksis',
          component: InspeksiView,
        },
        {
          path: '/inspeksis/:id',
          name: 'InspeksiDetail',
          component: InspeksiDetailView,
          props: true,
        },
        // Asset routes
        {
          path: 'assets',
          name: 'Assets',
          component: AssetsView,
        },
        {
          path: '/assets/:id',
          name: 'AssetsDetail',
          component: AssetsDetailView,
          props: true,
        },
      ],
    },
    {
      path: '/auth',
      component: AuthLayout,
      meta: { guest: true },
      children: [
        {
          path: 'base_login',
          name: 'Login',
          component: LoginView,
          meta: { guest: true }, // Tandai rute ini sebagai hanya untuk tamu
        },
        {
          path: 'base_logout',
          name: 'Logout',
          meta: { guest: true }, // Tandai rute ini sebagai hanya untuk tamu
        },
      ],
    },
  ],
})

// Navigation Guard
router.beforeEach((to, from, next) => {
  // Menggunakan authService.isAuthenticated() sebagai fungsi
  const isAuthenticated = authService.isAuthenticated()

  // Jika route memerlukan autentikasi dan user belum login
  if (to.matched.some((record) => record.meta.requiresAuth) && !isAuthenticated) {
    next({ name: 'Login' })
  }
  // Jika route hanya untuk guest dan user sudah login
  else if (to.matched.some((record) => record.meta.guest) && isAuthenticated) {
    next({ name: 'Home' })
  } else {
    next()
  }
})

export default router
