<script setup>
import { UserCircleIcon } from '@heroicons/vue/24/outline'
import { ChevronDoubleLeftIcon } from '@heroicons/vue/24/outline'
import { BoltIcon } from '@heroicons/vue/24/solid'
import { ref, computed, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRoute } from 'vue-router'
import ThemeToggle from '@/components/sidebar/ThemeModeToggle.vue'
const auth = useAuthStore()
const route = useRoute()

const { menuItems } = defineProps({
  menuItems: {
    type: Array,
    required: true,
  },
})

const user = computed(() => auth.user)
const emit = defineEmits(['setActive', 'logout'])

// State untuk sidebar collapse
const collapsed = ref(false)
const isHovered = ref(false)

// Computed untuk kontrol lebar sidebar berdasarkan collapsed dan hover state
const sidebarWidth = computed(() => {
  if (!collapsed.value) return '240px'
  if (isHovered.value) return '240px'
  return '72px'
})

// Computed untuk kontrol konten teks berdasarkan collapsed dan hover state
const showText = computed(() => {
  return !collapsed.value || isHovered.value
})

// Computed untuk kontrol justifikasi ikon
const iconJustify = computed(() => {
  return collapsed.value && !isHovered.value
})

const toggleSidebar = () => {
  collapsed.value = !collapsed.value
}

const setActiveMenuItem = (index) => {
  localStorage.setItem('activeSidebarIndex', index)
  emit('setActive', index)
}

const handleMouseEnter = () => {
  if (collapsed.value) {
    isHovered.value = true
  }
}

const handleMouseLeave = () => {
  isHovered.value = false
}

// Perbarui menuItems berdasarkan route aktif
watch(
  () => route.path,
  () => {
    menuItems.forEach((item) => {
      item.active = item.path === '/' ? route.path === '/' : route.path.startsWith(item.path)
    })
  },
  { immediate: true },
)
</script>

<template>
  <nav
    class="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-200 flex-shrink-0 flex flex-col transition-all duration-300 ease-in-out overflow-hidden shadow-md shadow-gray-400 dark:shadow-gray-600"
    :style="{ width: sidebarWidth }"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <!--Sidebar Header-->
    <div class="px-4 py-4 flex items-center justify-between dark:bg-gray-800">
      <div class="flex items-center">
        <div
          class="rounded-full bg-teal-400 w-10 h-10 flex items-center justify-center transform transition-all duration-300 hover:scale-105 smooth-transition"
        >
          <BoltIcon
            class="h-6 w-6 transition-all duration-300 ease-in-out"
            :class="{ 'rotate-90': !collapsed && !isHovered }"
          />
        </div>
        <div
          class="ml-3 overflow-hidden transition-all duration-500 ease-in-out"
          :class="{ 'w-0': !showText, 'w-32': showText }"
        >
          <h2
            class="font-bold text-lg whitespace-nowrap transform transition-all duration-500 ease-in-out"
            :class="{ 'opacity-0 translate-x-4': !showText, 'opacity-100 translate-x-0': showText }"
          >
            Dashboard
          </h2>
        </div>
      </div>
      <div class="flex items-center">
        <ChevronDoubleLeftIcon
          v-if="showText"
          class="w-6 h-6 cursor-pointer hover:text-teal-400 transition-all duration-300 ease-in-out"
          :class="{ 'rotate-180': collapsed }"
          @click="toggleSidebar"
        />
      </div>
    </div>

    <!-- Sidebar Menu -->
    <div class="py-4 flex-grow overflow-hidden border-y border-gray-400">
      <ul>
        <li
          v-for="(menuItem, index) in menuItems"
          :key="index"
          :class="[
            'hover:dark:bg-zinc-700 hover:bg-gray-600 rounded-lg mx-2 cursor-pointer transition-all duration-200 ease-in-out',
            menuItem.active
              ? 'bg-gray-600 dark:bg-zinc-700 text-teal-400 hover:text-teal-400'
              : 'text-gray-500 hover:text-gray-200',
          ]"
        >
          <router-link
            :to="{ name: menuItem.route }"
            :class="[
              'flex items-center px-4 py-3 transition-all duration-300 ease-in-out',
              { 'justify-center': iconJustify },
            ]"
            @click="setActiveMenuItem(index)"
          >
            <div
              class="flex items-center justify-center transition-all duration-300 ease-in-out"
              :class="{ 'w-5 h-5': !iconJustify, 'w-8 h-8': iconJustify }"
            >
              <component
                :is="menuItem.icon"
                class="transition-all duration-300 ease-in-out"
                :class="{
                  'w-5 h-5': !iconJustify,
                  'w-6 h-6': iconJustify,
                  'text-teal-400 scale-110': menuItem.active,
                  iconJustify,
                }"
              />
            </div>
            <div
              class="overflow-hidden transition-all duration-500 ease-in-out"
              :class="{ 'w-0 ml-0': !showText, 'w-40 ml-3': showText }"
            >
              <span
                class="whitespace-nowrap transform transition-all duration-500 ease-in-out"
                :class="{ 'opacity-0 translate-x-4': !showText, 'opacity-100 translate-x-0': showText }"
              >
                {{ menuItem.title }}
              </span>
            </div>
          </router-link>
        </li>
      </ul>
    </div>
    <div class="px-4 py-4 flex">
      <!-- Logout -->
      <button
        v-if="showText"
        @click="emit('logout')"
        :disabled="auth.loading"
        class="flex items-center w-full px-3 py-2 rounded-lg transition hover:bg-gray-700 dark:hover:bg-zinc-700 hover:text-gray-200"
        :class="{ 'justify-center': iconJustify, 'opacity-70 cursor-not-allowed': auth.loading }"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          :class="auth.loading ? 'animate-spin text-red-300' : 'text-red-400'"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            v-if="!auth.loading"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1m0-10V5"
          />
          <path
            v-else
            fill="currentColor"
            d="M12 4v4M12 16v4M4 12H8M16 12h4M5.636 5.636l2.828 2.828M15.536 15.536l2.828 2.828M5.636 18.364l2.828-2.828M15.536 8.464l2.828-2.828"
          />
        </svg>
        <span class="ml-3 text-sm font-medium">
          {{ auth.loading ? 'Logging out...' : 'Logout' }}
        </span>
      </button>
      <!-- Theme Switch -->
      <ThemeToggle />
    </div>

    <!-- User Profile -->
    <div v-if="user" class="px-4 py-4 flex items-center transition-all duration-300">
      <div class="flex items-center">
        <div
          class="rounded-full dark:bg-zinc-700 bg-gray-700 flex items-center justify-center transition-all duration-300 ease-in-out hover:scale-105 w-10 h-10"
        >
          <UserCircleIcon class="text-gray-200 transition-all duration-300 ease-in-out h-6 w-6" />
        </div>

        <div
          class="overflow-hidden transition-all duration-500 ease-in-out"
          :class="{ 'w-0 ml-0': !showText, 'w-40 ml-3': showText }"
        >
          <div
            class="transform transition-all duration-500 ease-in-out"
            :class="{ 'opacity-0 translate-x-4': !showText, 'opacity-100 translate-x-0': showText }"
          >
            <p class="text-gray-600 dark:text-gray-200 font-medium whitespace-nowrap">{{ user.name }}</p>
            <p class="text-gray-600 dark:text-gray-200 text-sm whitespace-nowrap">{{ user.role }}</p>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.rotate-180 {
  transform: rotate(1deg);
}

.rotate-90 {
  transform: rotate(90deg);
}

/* Perbaikan animasi untuk transisi yang lebih halus */
@keyframes slideIn {
  from {
    transform: translateX(-20px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideOut {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(-20px);
    opacity: 0;
  }
}

/* Gunakan cubic-bezier untuk ease-in-out yang lebih halus */
.smooth-transition {
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Animasi pulse untuk ikon aktif */
@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}
</style>
