<script setup>
import { useDark, useToggle } from '@vueuse/core'
import { SunIcon, MoonIcon } from '@heroicons/vue/24/outline'

const isDark = useDark({
  valueDark: 'dark',
  valueLight: 'light',
})
const toggleDark = useToggle(isDark)
document.documentElement.classList.toggle('light', !isDark.value)
</script>

<template>
  <!-- Theme Switch -->
  <button @click="toggleDark()" class="flex items-center justify-center py-2 w-12 h-full rounded-lg hover:bg-zinc-700">
    <span v-if="isDark" class="text-xl">
      <MoonIcon class="text-gray-200 h-5 w-5" />
    </span>
    <span v-else>
      <SunIcon class="text-gray-700 hover:text-gray-200 h-5 w-5" />
    </span>
  </button>
</template>
