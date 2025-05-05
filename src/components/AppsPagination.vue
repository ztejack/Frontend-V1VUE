<template>
  <div class="flex flex-col sm:flex-row items-center justify-between mt-4 space-y-2 sm:space-y-0 sm:space-x-4">
    <!-- Limit dropdown -->
    <div class="flex items-center space-x-2">
      <label for="limit" class="text-sm text-gray-700 dark:text-gray-300">Tampilkan:</label>
      <select
        id="limit"
        class="px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 border dark:border-gray-700"
        :value="limit"
        @change="$emit('limit-changed', +$event.target.value)"
      >
        <option v-for="option in [5, 10, 20, 50, 100]" :key="option" :value="option">
          {{ option }}
        </option>
      </select>
      <span class="text-sm text-gray-700 dark:text-gray-300">Data / Halaman</span>
    </div>

    <!-- Info Pagination -->
    <div class="text-sm text-gray-700 dark:text-gray-300">
      Menampilkan {{ startItem }} - {{ endItem }} dari {{ totalItems }} Halaman
    </div>

    <!-- Pagination buttons -->
    <nav class="flex items-center space-x-2">
      <button
        class="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-zinc-600"
        :disabled="currentPage === 1"
        @click="$emit('page-changed', currentPage - 1)"
      >
        Prev
      </button>

      <button
        v-for="page in pages"
        :key="page"
        @click="$emit('page-changed', page)"
        :class="[
          'px-3 py-1 rounded',
          page === currentPage
            ? 'bg-teal-500 text-white'
            : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600',
        ]"
      >
        {{ page }}
      </button>

      <button
        class="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-zinc-600"
        :disabled="currentPage === totalPages"
        @click="$emit('page-changed', currentPage + 1)"
      >
        Next
      </button>
    </nav>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  currentPage: Number,
  totalPages: Number,
  limit: Number,
  totalItems: Number,
})

const pages = computed(() => {
  const range = []
  for (let i = 1; i <= props.totalPages; i++) {
    range.push(i)
  }
  return range
})

const startItem = computed(() => {
  return props.totalItems === 0 ? 0 : (props.currentPage - 1) * props.limit + 1
})

const endItem = computed(() => {
  const end = props.currentPage * props.limit
  return end > props.totalItems ? props.totalItems : end
})
</script>
