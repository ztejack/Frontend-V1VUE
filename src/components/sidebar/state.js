import { ref, computed } from 'vue'

export const collapsed = ref(false)

export const toggleSidebar = () => {
  collapsed.value = !collapsed.value
}

export const sidebarWidth = computed(() => (collapsed.value ? 'w-16' : 'w-64'))
