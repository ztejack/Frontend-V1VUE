<!-- AssetView.vue -->
<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow">
    <div
      class="p-4 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
    >
      <div>
        <h2 class="text-xl font-bold text-gray-800 dark:text-white">Data User</h2>
        <p class="text-sm text-gray-500 dark:text-gray-400">Manajemen dan monitoring data User</p>
      </div>
    </div>

    <div class="overflow-auto overscroll-contain">
      <template v-if="loading">
        <div class="text-center text-gray-500 py-4 flex items-center justify-center">
          <ArrowPathIcon class="animate-spin h-6 w-6 inline-block mr-2" />
          <span class="text-gray-700 dark:text-gray-300">Memuat data user...</span>
        </div>
      </template>
      <template v-else-if="!users.length">
        <div class="text-center text-gray-500 py-4">Tidak ada data user</div>
      </template>
      <appTabel :columns="columns" :data="users">
        <template #actions="{ item }">
          <button
            @click="goToDetail(item)"
            class="text-sm dark:bg-blue-300 text-blue-800 font-semibold mr-2 px-4 py-1 rounded hover:bg-blue-500 hover:text-blue-200 focus:bg-blue-800 focus:text-blue-200"
          >
            Detail
          </button>
        </template>
      </appTabel>
    </div>

    <div
      class="px-4 py-3 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center"
    ></div>
    <!-- <div class="text-sm text-gray-700 dark:text-gray-300">
        Showing <span class="font-medium">{{ users.pagination.from }}</span> to
        <span class="font-medium">{{ users.pagination.to }}</span> of
        <span class="font-medium">{{ users.pagination.total }}</span> users
      </div> -->
    <!-- <Pagination
        :currentPage="users.pagination.current_page"
        :totalItems="users.pagination.last_page"
        :itemsPerPage="users.pagination.per_page"
        :total-pages="users.pagination.last_page"
        :limit="perPage"
        @page-changed="fetchAssets"
        @limit-changed="changeLimit"
        active-classes="bg-teal-600 text-white"
        class="mt-4"
      /> -->
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useToast } from 'vue-toastification'
import { ArrowPathIcon } from '@heroicons/vue/24/outline'
import { useAuthStore } from '@/stores/auth'
import appTabel from '@/components/tabel/appTabel.vue'
import Pagination from '@/components/AppsPagination.vue'
import router from '@/router'
import userService from '@/services/userService'
const toast = useToast()
const perPage = ref(20)
const loading = ref(true)

const users = ref({
  data: [],
  pagination: {
    current_page: 1,
    last_page: 1,
    per_page: 1,
    total: 1,
    from: 1,
    to: 1,
  },
})
const columns = [
  { key: 'uuid', label: 'UUID' },
  { key: 'slug', label: 'slug' },
  { key: 'name', label: 'name' },
  { key: 'username', label: 'username' },
  { key: 'email', label: 'email' },
  { key: 'satker', label: 'satker' },
  { key: 'role', label: 'role' },
]

const auth = useAuthStore()

const grandted = computed(() => ['Admin', 'SuperAdmin'].includes(auth.user?.role))

const fetchUsers = async (page = 1) => {
  loading.value = true
  try {
    const res = await userService.getAll(page, perPage.value)
    users.value = res.users
    loading.value = false
  } catch (e) {
    toast.error('Gagal memuat data user:', e)
  }
}

onMounted(() => {
  fetchUsers()
})
// function changeLimit(newLimit) {
//   perPage.value = newLimit
//   fetchUsers(1) // Reset ke page 1 saat limit berubah
// }

const goToDetail = (item) => {
  router.push({ name: 'AssetsDetail', params: { id: item.id } })
}
// Fungsi untuk memberikan warna berdasarkan status
// const getStatusClass = (status) => {
//   switch (status.toLowerCase()) {
//     case 'baik':
//       return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
//     case 'rusak':
//       return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
//     case 'dalam perbaikan':
//       return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
//     default:
//       return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
//   }
// }
</script>
