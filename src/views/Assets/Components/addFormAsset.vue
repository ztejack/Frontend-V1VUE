<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const loading = ref(false)
const form = ref({
  name: '',
  description: '',
  location: '',
})

const submit = async () => {
  loading.value = true
  try {
    await axios.post('/api/v1/asset', form.value)
    router.push({ name: 'asset.index' })
  } catch (error) {
    console.error('Failed to save asset:', error)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="max-w-xl mx-auto mt-10 bg-white dark:bg-zinc-800 p-6 rounded-xl shadow-md">
    <h1 class="text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-4">Add Asset</h1>

    <form @submit.prevent="submit">
      <div class="mb-4">
        <label class="block text-gray-700 dark:text-gray-300 mb-1">Name</label>
        <input
          v-model="form.name"
          type="text"
          class="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-zinc-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
      </div>

      <div class="mb-4">
        <label class="block text-gray-700 dark:text-gray-300 mb-1">Description</label>
        <textarea
          v-model="form.description"
          class="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-zinc-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
        ></textarea>
      </div>

      <div class="mb-6">
        <label class="block text-gray-700 dark:text-gray-300 mb-1">Location</label>
        <input
          v-model="form.location"
          type="text"
          class="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-zinc-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
      </div>

      <button
        type="submit"
        :disabled="loading"
        class="w-full bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 disabled:opacity-70"
      >
        <span v-if="loading" class="flex items-center justify-center">
          <svg
            class="animate-spin h-5 w-5 mr-2 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
          Saving...
        </span>
        <span v-else>Save Asset</span>
      </button>
    </form>
  </div>
</template>

<style scoped></style>
