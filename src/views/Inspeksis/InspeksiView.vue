<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow">
    <div
      class="p-4 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
    >
      <div>
        <h2 class="text-xl font-bold text-gray-800 dark:text-white">Data Inspeksi</h2>
        <p class="text-sm text-gray-500 dark:text-gray-400">Manajemen dan monitoring Inspeksi</p>
      </div>
      <button
        v-if="grandted"
        @click="openAddModal"
        class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md flex items-center text-sm"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Tambah Inspeksi
      </button>
      <InspeksiFormModal
        v-if="grandted"
        :show="showAddModal"
        @close="closeAddModal"
        @store="handleInspeksiStore"
        ref="showModal"
        @submitted="fetchInspeksi"
      />
    </div>

    <div
      class="p-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row gap-4"
    >
      <div class="relative flex-grow">
        <input
          type="text"
          v-model="searchTerm"
          placeholder="Cari inspeksi..."
          class="pl-10 pr-4 py-2 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
        <button
          @click="resetFilter"
          class="px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-400 dark:hover:bg-zinc-500"
        >
          <ArrowPathIcon class="h-5 w-5" />
        </button>
      </div>
    </div>

    <div class="overflow-auto overscroll-contain">
      <template v-if="!inspeksis.data.length">
        <div class="text-center text-gray-500 py-4 flex items-center justify-center">
          <ArrowPathIcon class="animate-spin h-6 w-6 inline-block mr-2" />
          <span class="text-gray-700 dark:text-gray-300">Memuat data inspeksi...</span>
        </div>
      </template>
      <template v-else-if="inspeksis.data.length === 0">
        <div class="text-center text-gray-500 py-4">Tidak ada data inspeksi</div>
      </template>
      <appTabel :columns="columns" :data="inspeksis.data">
        <!-- Cek apakah data kosong -->

        <template #cell-asset="{ item }">
          {{ item.asset?.asset_name || '-' }}
        </template>
        <template #cell-id_status="{ item }">
          <span
            :class="getStatusClassById(item.maintenance.id_status)"
            class="px-2 inline-flex text-xs leading-5 font-semibold rounded"
          >
            {{ getStatusNameById(item.maintenance.id_status) }}
          </span>
        </template>
        <template #cell-id_urgency="{ item }">
          <span
            :class="getUrgencyClassById(item.maintenance.id_urgency)"
            class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
          >
            {{ getUrgencyNameById(item.maintenance.id_urgency) }}
          </span>
        </template>
        <template #cell-created_at="{ item }">
          {{ dayjs(item.created_at).format('dddd, D MMMM YYYY HH:mm') }}
        </template>
        <template #actions="{ item }">
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
        Showing <span class="font-medium">{{ inspeksis.pagination.from }}</span> to
        <span class="font-medium">{{ inspeksis.pagination.to }}</span> of
        <span class="font-medium">{{ inspeksis.pagination.total }}</span> Inspeksi
      </div>
      <Pagination
        :currentPage="inspeksis.pagination.current_page"
        :totalItems="inspeksis.pagination.last_page"
        :itemsPerPage="inspeksis.pagination.per_page"
        :total-pages="inspeksis.pagination.last_page"
        :limit="perPage"
        @page-changed="fetchInspeksi"
        @limit-changed="changeLimit"
        active-classes="bg-teal-600 text-white"
        class="mt-4"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useToast } from 'vue-toastification'
import { ArrowPathIcon } from '@heroicons/vue/24/outline'
import appTabel from '@/components/tabel/appTabel.vue'
import Pagination from '@/components/AppsPagination.vue'
import inspeksiService from '@/services/inspeksiService'
import dayjs from 'dayjs'
import router from '@/router'
import { useStatusHelper } from '@/helpers/useStatusHelper'
import { useUrgencyHelper } from '@/helpers/useUrgencyHelper'
import { useAuthStore } from '@/stores/auth'
import InspeksiFormModal from '@/views/Inspeksis/components/addInspeksiModal.vue'

const { getStatusNameById, getStatusClassById } = useStatusHelper()
const { getUrgencyNameById, getUrgencyClassById } = useUrgencyHelper()

const toast = useToast()
const perPage = ref(5)
const searchTerm = ref('')
const auth = useAuthStore()
const grandted = computed(() => ['Admin', 'SuperAdmin', 'Inspeksi'].includes(auth.user?.role))

const debounceTimeout = ref(null)
const showAddModal = ref(false)

const inspeksis = ref({
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
  { key: 'inspektor', label: 'Inspektor' },
  { key: 'asset', label: 'Asset' },
  { key: 'id_status', label: 'Status' },
  { key: 'id_urgency', label: 'Urgency Level' },
  { key: 'created_at', label: 'Creted' },
]

const fetchInspeksi = async (page = 1) => {
  try {
    const excludedStatus = [5, 6, 7]
    const res = await inspeksiService.getAll(page, perPage.value, {
      exclude_status: excludedStatus.join(','),
    })
    inspeksis.value = res
  } catch (e) {
    toast.error('Gagal memuat data inspeksi:', e)
  }
}
const handleInspeksiStore = () => {
  fetchInspeksi()
}
const openAddModal = () => {
  showAddModal.value = true
}

const closeAddModal = () => {
  showAddModal.value = false
}

onMounted(() => {
  fetchInspeksi()
})

const filterData = () => {
  if (searchTerm.value.trim() === '') {
    // Jika searchTerm kosong, reset ke data awal
    fetchInspeksi() // Muat ulang data untuk mengembalikan data asli
  } else {
    inspeksis.value.data = inspeksis.value.data.filter((item) =>
      item.asset?.asset_name.toLowerCase().includes(searchTerm.value.toLowerCase()),
    )
  }
}
const resetFilter = () => {
  searchTerm.value = ''
  fetchInspeksi() // Muat ulang data untuk mengembalikan data asli
}
// Menonton perubahan pada searchTerm dan melakukan filter dengan debounce
watch(searchTerm, () => {
  // Clear timeout sebelumnya
  clearTimeout(debounceTimeout.value)

  // Set timeout untuk melakukan filter setelah 2 detik
  debounceTimeout.value = setTimeout(() => {
    filterData()
  }, 500)
})

function changeLimit(newLimit) {
  perPage.value = newLimit
  fetchInspeksi(1) // Reset ke page 1 saat limit berubah
}

const goToDetail = (item) => {
  router.push({ name: 'InspeksiDetail', params: { id: item.id } })
}
</script>
