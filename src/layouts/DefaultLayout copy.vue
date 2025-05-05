<template>
  <div class="flex h-screen">
    <!-- Sidebar -->
    <nav class="bg-neutral-900 text-white w-60 flex-shrink-0 flex flex-col">
      <!-- Sidebar Header -->
      <div class="px-6 py-4 dark:bg-gray-900 flex items-center">
        <div class="rounded-full bg-teal-400 w-10 h-10 flex items-center justify-center mr-3">
          <BoltIcon class="h-6 w-6 text-gray-500" />
        </div>
        <div>
          <h2 class="font-bold text-lg">Dashboard</h2>
          <p class="text-gray-400 text-sm">Admin Panel</p>
        </div>
      </div>

      <!-- Sidebar Menu -->
      <div class="py-4 flex-grow">
        <ul>
          <li
            v-for="(menuItem, index) in menuItems"
            :key="index"
            :class="[
              'px-6 py-3 hover:bg-gray-700 rounded-lg mx-2 cursor-pointer text-gray-400 ',
              menuItem.active ? 'bg-gray-700 text-teal-400 hover:text-teal-400' : 'hover:text-white',
            ]"
          >
            <router-link :to="{ name: menuItem.route }" :class="['flex items-center  ']" @click="setActiveMenuItem(index)">
              <component :is="menuItem.icon" :class="['w-5 mr-3']" />
              <span>{{ menuItem.title }}</span>
            </router-link>
          </li>
        </ul>
      </div>

      <!-- User Profile -->
      <div class="px-6 py-4 bg-gray-800 mt-auto">
        <div class="flex items-center">
          <div class="w-10 h-10 rounded-full bg-gray-600 mr-3 flex items-center justify-center">
            <UserCircleIcon class="h-6 w-6" />
          </div>
          <div>
            <p class="font-medium">{{ user.name }}</p>
            <p class="text-gray-400 text-sm">{{ user.role }}</p>
          </div>
          <div class="ml-auto">
            <ArrowRightStartOnRectangleIcon class="h-6 w-6 text-gray-400 hover:text-white cursor-pointer" @click="logout" />
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <!-- <div class="flex-grow p-6">
      <h1 class="text-2xl font-bold text-gray-800">Welcome to Dashboard</h1>
      <p class="text-gray-600 mt-2">This is the main content area. Your dashboard content will appear here.</p>
    </div> -->
    <main class="flex-grow overflow-auto">
      <div class="container mx-auto p-6">
        <slot />
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { HomeIcon } from '@heroicons/vue/24/outline'
import { BoltIcon } from '@heroicons/vue/24/solid'
import { UsersIcon } from '@heroicons/vue/24/outline'
import { CogIcon } from '@heroicons/vue/24/outline'
import { ArrowRightStartOnRectangleIcon } from '@heroicons/vue/24/outline'
import { UserCircleIcon } from '@heroicons/vue/24/outline'

const menuItems = ref([
  { title: 'Dashboard', icon: HomeIcon, active: true, route: 'Home' },
  { title: 'Users', icon: UsersIcon, active: false, route: 'Users' },
  { title: 'Maintenance', icon: CogIcon, active: false, route: 'Home' },
  { title: 'Inspeksi', icon: CogIcon, active: false, route: 'Home' },
  { title: 'Login', icon: BoltIcon, active: false, route: 'Login' },
])

const user = ref({
  name: 'John Doe',
  role: 'Administrator',
})

const setActiveMenuItem = (index) => {
  menuItems.value.forEach((item, i) => {
    item.active = i === index
  })
}

const logout = () => {
  console.log('Logging out...')
  // Tambahkan logika logout di sini
}
</script>
