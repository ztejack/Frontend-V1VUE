<template>
  <div class="flex h-screen bg-zinc-100 dark:bg-zinc-500">
    <!-- Sidebar Component -->
    <Sidebar v-if="grandted" :menuItems="menuItems" @setActive="handleSetActive" @logout="handleLogout" />
    <Sidebar v-else :menuItems="menuItemsx" @setActive="handleSetActive" @logout="handleLogout" />
    <!-- Main Content -->
    <main class="flex-grow overflow-auto">
      <div class="mx-auto p-4">
        <router-view />
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import Sidebar from '@/components/sidebar/AppSidebar.vue'
import {
  HomeIcon,
  UsersIcon,
  BoltIcon,
  CubeTransparentIcon,
  Cog6ToothIcon,
  ClipboardDocumentIcon,
} from '@heroicons/vue/24/outline'

import { authService } from '@/services/authService'
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'vue-toastification'
import { useRouter } from 'vue-router'

const toast = useToast()
const router = useRouter()
const menuItems = ref([
  { title: 'Dashboard', icon: HomeIcon, active: true, route: 'Home', path: '/' },
  { title: 'Users', icon: UsersIcon, active: false, route: 'Users', path: '/users' },
  { title: 'Asset', icon: CubeTransparentIcon, active: false, route: 'Assets', path: '/assets' },
  { title: 'Maintenance', icon: Cog6ToothIcon, active: false, route: 'Maintenances', path: '/maintenances' },
  { title: 'Inspeksi', icon: ClipboardDocumentIcon, active: false, route: 'Inspeksis', path: '/inspeksis' },
  // { title: 'Login', icon: BoltIcon, active: false, route: 'Login' },
])
const menuItemsx = ref([
  { title: 'Dashboard', icon: HomeIcon, active: true, route: 'Home', path: '/' },
  { title: 'Asset', icon: CubeTransparentIcon, active: false, route: 'Assets', path: '/assets' },
  { title: 'Maintenance', icon: Cog6ToothIcon, active: false, route: 'Maintenances', path: '/maintenances' },
  { title: 'Inspeksi', icon: ClipboardDocumentIcon, active: false, route: 'Inspeksis', path: '/inspeksis' },
])

const auth = useAuthStore()
const grandted = computed(() => ['Admin', 'SuperAdmin'].includes(auth.user?.role))

const handleSetActive = (index) => {
  menuItems.value.forEach((item, i) => {
    item.active = i === index
  })
}

// const router = useRouter()
// const loading = ref(false)
// const error = ref('')

const handleLogout = async () => {
  const auth = useAuthStore()
  try {
    const response = await authService.logout()
    console.log('Logout success:', response)
    if (response && response.message) {
      toast.success(response.message)
    } else {
      toast.success(response.message || 'Logout successful')
    }
    await new Promise((resolve) => setTimeout(resolve, 3000))
    router.push({ name: 'Login' })
  } catch (err) {
    console.error('Logout error:', err)
    toast.error(auth.error || 'Logout failed')
  }
}
</script>
