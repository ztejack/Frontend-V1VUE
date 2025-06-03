<!-- AssetView.vue -->
<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow">
    <div
      class="p-4 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
    >
      <div>
        <h2 class="text-xl font-bold text-gray-800 dark:text-white">Data Aset</h2>
        <p class="text-sm text-gray-500 dark:text-gray-400">Manajemen dan monitoring seluruh aset perusahaan</p>
      </div>
      <!-- Modal form -->
      <AssetFormModal v-if="grandted" ref="showModal" @submitted="fetchAssets" />
    </div>

    <div
      class="p-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row gap-4"
    >
      <div class="relative flex-grow">
        <input
          type="text"
          placeholder="Cari aset..."
          class="pl-10 pr-4 py-2 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          v-model="searchQuery"
          @input="onSearch"
        />
        <div class="absolute left-3 top-2.5 text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      <div class="flex gap-2">
        <select
          class="px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200"
          v-model="selectedCategory"
          @change="onFilterChange"
        >
          <option value="">Semua Kategori</option>
          <template v-for="category in categorys" :key="category.id">
            <option :value="category.category">{{ category.category }}</option>
          </template>
        </select>

        <select
          class="px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200"
          v-model="selectedStatus"
          @change="onFilterChange"
        >
          <option value="">Semua Status</option>
          <option value="baik">Baik</option>
          <option value="rusak">Rusak</option>
          <option value="dalam perbaikan">Dalam Perbaikan</option>
        </select>
        <button
          @click="resetFilters"
          class="px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-400 dark:hover:bg-zinc-500"
        >
          <ArrowPathIcon class="h-5 w-5" />
        </button>
      </div>
    </div>

    <div class="overflow-auto overscroll-contain">
      <template v-if="!assets.data.length">
        <div class="text-center text-gray-500 py-4 flex items-center justify-center">
          <ArrowPathIcon class="animate-spin h-6 w-6 inline-block mr-2" />
          <span class="text-gray-700 dark:text-gray-300">Memuat data asset...</span>
        </div>
      </template>
      <appTabel :columns="columns" :data="assets.data">
        <template #cell-category="{ item }">
          <template v-if="Array.isArray(item.category)">
            <span
              v-for="(cat, index) in item.category"
              :key="index"
              class="inline-block bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-blue-200"
            >
              {{ cat }}
            </span>
          </template>
          <template v-else>
            {{ item.category }}
          </template>
        </template>
        <template #cell-status="{ item }">
          <span :class="getStatusClass(item.status)" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
            {{ item.status }}
          </span>
        </template>

        <template #actions="{ item }">
          <button
            @click="handleDelete(item)"
            class="text-sm dark:bg-red-300 text-red-800 font-semibold mr-2 px-4 py-1 rounded hover:bg-red-500 hover:text-red-200 focus:bg-red-800 focus:text-red-200"
          >
            Delete
          </button>
          <!-- goto detail page -->
          <button
            @click="goToDetail(item)"
            class="text-sm dark:bg-blue-300 text-blue-800 font-semibold mr-2 px-4 py-1 rounded hover:bg-blue-500 hover:text-blue-200 focus:bg-blue-800 focus:text-blue-200"
          >
            Detail
          </button>
        </template>
        <!-- <button class="text-sm text-blue-500 hover:underline">Detail</button> -->
      </appTabel>
    </div>

    <div
      class="px-4 py-3 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center"
    >
      <div class="text-sm text-gray-700 dark:text-gray-300">
        Showing <span class="font-medium">{{ assets.pagination.from }}</span> to
        <span class="font-medium">{{ assets.pagination.to }}</span> of
        <span class="font-medium">{{ assets.pagination.total }}</span> assets
      </div>
      <Pagination
        :currentPage="assets.pagination.current_page"
        :totalItems="assets.pagination.last_page"
        :itemsPerPage="assets.pagination.per_page"
        :total-pages="assets.pagination.last_page"
        :limit="perPage"
        @page-changed="fetchAssets"
        @limit-changed="changeLimit"
        active-classes="bg-teal-600 text-white"
        class="mt-4"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import { useToast } from 'vue-toastification'
import { ArrowPathIcon } from '@heroicons/vue/24/outline'
import { useAuthStore } from '@/stores/auth'
import appTabel from '@/components/tabel/appTabel.vue'
import assetService from '@/services/assetService'
import Pagination from '@/components/AppsPagination.vue'
import categoryService from '@/services/categoryService'
import AssetFormModal from '@/views/Assets/Components/addAssetModal.vue'
import router from '@/router'
const toast = useToast()
const perPage = ref(20)
const categorys = ref([])
const assets = ref({
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
  { key: 'id', label: 'ID' },
  // { key: 'stockcode', label: 'Stock Code' },
  { key: 'asset_code', label: 'Asset Code' },
  { key: 'serialnumber', label: 'Serialnumber' },
  { key: 'asset_name', label: 'Asset name' },
  { key: 'brand', label: 'brand' },
  { key: 'model', label: 'model' },
  { key: 'category', label: 'Category' },
  { key: 'location', label: 'Location' },
  { key: 'status', label: 'Status' },
]
const searchQuery = ref('')
const isSearching = ref(false)
const selectedCategory = ref('')
const selectedStatus = ref('')
const selectedLocation = ref('')
const auth = useAuthStore()

const grandted = computed(() => ['Admin', 'SuperAdmin'].includes(auth.user?.role))

const fetchAssets = async (page = 1) => {
  try {
    const res = await assetService.getAll(page, perPage.value)
    assets.value = res
  } catch (e) {
    toast.error('Gagal memuat data asset:', e)
  }
}
const fetchCategory = async () => {
  try {
    const res = await categoryService.getAll()
    categorys.value = res.data
  } catch (e) {
    toast.error('Gagal memuat data kategori:', e)
  }
}
function handleDelete(item) {
  if (window.confirm('Yakin ingin menghapus asset ini?')) {
    deleteAsset(item.id)
  }
}
const deleteAsset = async (id) => {
  try {
    await assetService.delete(id)
    toast.success('Asset berhasil dihapus')
    fetchAssets()
  } catch (e) {
    toast.error('Gagal menghapus asset:', e)
  }
}

onMounted(() => {
  fetchAssets(), fetchCategory()
})

const showModal = ref(false)
// const openModal = () => {
//   showModal.value = true
// }

const onSearch = async () => {
  isSearching.value = true
  try {
    const res = await assetService.search({
      search: searchQuery.value,
    })
    assets.value.data = res.data
    // Jika pagination juga disertakan dalam response:
    assets.value.pagination = res.pagination || {
      current_page: 1,
      last_page: 1,
      per_page: 10,
      total: res.data.length,
      from: 1,
      to: res.data.length,
    }
  } catch (e) {
    // toast.error('Data Asset tidak ditemukan', e)
  } finally {
    isSearching.value = false
  }
}
watch(
  searchQuery,
  useDebounceFn(() => {
    onSearch()
  }, 900),
)
function changeLimit(newLimit) {
  perPage.value = newLimit
  fetchAssets(1) // Reset ke page 1 saat limit berubah
}

const onFilterChange = async () => {
  try {
    const res = await assetService.search({
      category: selectedCategory.value,
      location: selectedLocation.value,
      status: selectedStatus.value,
    })
    assets.value.data = res.data
    // Jika pagination juga disertakan dalam response:
    assets.value.pagination = res.pagination || {
      current_page: 1,
      last_page: 1,
      per_page: 10,
      total: res.data.length,
      from: 1,
      to: res.data.length,
    }
  } catch (e) {
    console.error('Error fetching filtered assets:', e)
    if (e.response && e.response.status === 404) {
      assets.value.data = []
      assets.value.pagination = {
        current_page: 1,
        last_page: 1,
        per_page: 10,
        total: 0,
        from: 0,
        to: 0,
      }
      toast.error('Data Asset tidak ditemukan', e)
    } else {
      toast.error('Gagal mencari data asset', e)
    }
  }
}

const resetFilters = () => {
  selectedCategory.value = ''
  selectedStatus.value = ''
  searchQuery.value = ''
  fetchAssets(1)
}

const goToDetail = (item) => {
  router.push({ name: 'AssetsDetail', params: { id: item.id } })
}
// Fungsi untuk memberikan warna berdasarkan status
const getStatusClass = (status) => {
  switch (status.toLowerCase()) {
    case 'baik':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    case 'rusak':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    case 'dalam perbaikan':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }
}
</script>
