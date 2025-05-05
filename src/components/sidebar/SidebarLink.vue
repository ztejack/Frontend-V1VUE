<script setup>
import { defineProps } from 'vue'
import { useRoute } from 'vue-router'

const { to, icon, active } = defineProps({
  to: Object,
  icon: Object,
  active: Boolean,
})

const route = useRoute()
</script>

<template>
  <router-link
    :to="to"
    class="flex items-center gap-3 px-4 py-3 rounded-md transition-all text-gray-400 hover:bg-gray-800 hover:text-white"
    :class="{ 'bg-teal-600 text-white': active || route.name === to.name }"
  >
    <component :is="icon" class="w-5 h-5" />
    <slot />
  </router-link>
</template>
