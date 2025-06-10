<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow">
    <div
      class="p-4 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
    >
      <div>
        <h2 class="text-xl font-bold text-gray-800 dark:text-white">Data Maintenance</h2>
        <p class="text-sm text-gray-500 dark:text-gray-400">Manajemen dan monitoring Maintenance</p>
      </div>
      <button
        v-if="grandted"
        @click="openAddModal"
        class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md flex items-center text-sm"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Tambah Maintenance
      </button>
      <MaintenanceFormModal
        v-if="grandted"
        :show="showAddModal"
        @close="closeAddModal"
        @store="handleMaintenanceStore"
        ref="showModal"
        @submitted="fetchMaintenance"
      />
    </div>

    <div
      class="p-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row gap-4"
    >
      <div class="relative flex-grow">
        <input
          type="text"
          v-model="searchTerm"
          placeholder="Cari maintenance..."
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
      <template v-if="!maintenances.data.length">
        <div class="text-center text-gray-500 py-4 flex items-center justify-center">
          <ArrowPathIcon class="animate-spin h-6 w-6 inline-block mr-2" />
          <span class="text-gray-700 dark:text-gray-300">Memuat data maintenance...</span>
        </div>
      </template>
      <template v-else-if="maintenances.data.length === 0">
        <div class="text-center text-gray-500 py-4">Tidak ada data maintenance</div>
      </template>
      <appTabel :columns="columns" :data="maintenances.data">
        <!-- Cek apakah data kosong -->
        <template #cell-asset="{ item }">
          {{ item.asset?.asset_name || '-' }}
        </template>
        <template #cell-status="{ item }">
          <span :class="getStatusClass(item.status)" class="px-2 inline-flex text-xs leading-5 font-semibold rounded">
            {{ item.status }}
          </span>
        </template>
        <template #cell-type="{ item }">
          <span :class="getTypeClass(item.type)" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
            {{ item.type }}
          </span>
        </template>
        <template #cell-urgency_level="{ item }">
          <span
            :class="getUrgencyClass(item.urgency_level)"
            class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
          >
            {{ item.urgency_level }}
          </span>
        </template>
        <template #cell-created_at="{ item }">
          {{ dayjs(item.created_at).format('dddd, D MMMM YYYY HH:mm') }}
        </template>
        <template #actions="{ item }">
          <div class="flex items-center space-x-2">
            <!-- goto detail page -->
            <button
              @click="goToDetail(item)"
              class="text-sm dark:bg-blue-300 text-blue-800 font-semibold mr-2 px-4 py-1 rounded hover:bg-blue-500 hover:text-blue-200 focus:bg-blue-800 focus:text-blue-200 fle"
            >
              <span class="flex items-center gap-1">
                <DocumentMagnifyingGlassIcon class="h-4 w-4" />
                Detail
              </span>
            </button>
            <button
              @click="openMaintenanceModal(item.id)"
              class="text-sm dark:bg-emerald-300 text-emerald-800 font-semibold mr-2 px-4 py-1 rounded hover:bg-green-600 hover:text-emerald-300 focus:bg-green-700 focus:text-emerald-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <span class="flex items-center gap-1">
                <PencilSquareIcon class="h-4 w-4" />
                Update
              </span>
            </button>
            <button
              :disabled="!canDelete(item)"
              @click="deleteMaintenance(item)"
              class="text-sm dark:bg-red-300 text-red-800 font-semibold mr-2 px-4 py-1 rounded hover:bg-red-600 hover:text-red-300 focus:bg-red-700 focus:text-red-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <span class="flex items-center gap-1">
                <ExclamationTriangleIcon class="h-4 w-4" />
                Delete
              </span>
            </button>
          </div>
        </template>
        <!-- <button class="text-sm text-blue-500 hover:underline">Detail</button> -->
      </appTabel>
    </div>

    <div
      class="px-4 py-3 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center"
    >
      <div class="text-sm text-gray-700 dark:text-gray-300">
        Showing <span class="font-medium">{{ maintenances.pagination.from }}</span> to
        <span class="font-medium">{{ maintenances.pagination.to }}</span> of
        <span class="font-medium">{{ maintenances.pagination.total }}</span> maintenance
      </div>
      <Pagination
        :currentPage="maintenances.pagination.current_page"
        :totalItems="maintenances.pagination.last_page"
        :itemsPerPage="maintenances.pagination.per_page"
        :total-pages="maintenances.pagination.last_page"
        :limit="perPage"
        @page-changed="fetchMaintenance"
        @limit-changed="changeLimit"
        active-classes="bg-teal-600 text-white"
        class="mt-4"
      />
    </div>
  </div>
  <maintenanceUpdateModal
    v-model:show="showUpdateModal"
    :model-value="selectedMaintenanceData"
    @close="showUpdateModal = false"
    @store="fetchMaintenance"
  />

  <!-- pROCESS -->
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow mt-4">
    <div
      class="p-4 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
    >
      <div>
        <h2 class="text-xl font-bold text-gray-800 dark:text-white">Data Proses</h2>
        <p class="text-sm text-gray-500 dark:text-gray-400">Data Maintenance Dalam Pengerjaan</p>
      </div>
    </div>

    <div
      class="p-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row gap-4"
    >
      <div class="relative flex-grow">
        <input
          v-model="searchTermOn"
          type="text"
          placeholder="Cari maintenance..."
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
          @click="resetFilterOn"
          class="px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-400 dark:hover:bg-zinc-500"
        >
          <ArrowPathIcon class="h-5 w-5" />
        </button>
      </div>
    </div>

    <div class="overflow-auto overscroll-contain">
      <template v-if="!maintenancesOn.data.length">
        <div class="text-center text-gray-500 py-4 flex items-center justify-center">
          <ArrowPathIcon class="animate-spin h-6 w-6 inline-block mr-2" />
          <span class="text-gray-700 dark:text-gray-300">Memuat data maintenance...</span>
        </div>
      </template>
      <template v-else-if="maintenancesOn.data.length === 0">
        <div class="text-center text-gray-500 py-4">Tidak ada data maintenance</div>
      </template>
      <appTabel :columns="columns" :data="maintenancesOn.data">
        <template #cell-asset="{ item }">
          {{ item.asset?.asset_name || '-' }}
        </template>
        <template #cell-status="{ item }">
          <span :class="getStatusClass(item.status)" class="px-2 inline-flex text-xs leading-5 font-semibold rounded">
            {{ item.status }}
          </span>
        </template>
        <template #cell-type="{ item }">
          <span :class="getTypeClass(item.type)" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
            {{ item.type }}
          </span>
        </template>
        <template #cell-urgency_level="{ item }">
          <span
            :class="getUrgencyClass(item.urgency_level)"
            class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
          >
            {{ item.urgency_level }}
          </span>
        </template>
        <template #cell-created_at="{ item }">
          {{ dayjs(item.created_at).format('dddd, D MMMM YYYY HH:mm') }}
        </template>
        <template #actions="{ item }">
          <div class="flex items-center space-x-2">
            <!-- goto detail page -->
            <button
              @click="goToDetail(item)"
              class="text-sm dark:bg-blue-300 text-blue-800 font-semibold mr-2 px-4 py-1 rounded hover:bg-blue-500 hover:text-blue-200 focus:bg-blue-800 focus:text-blue-200 fle"
            >
              <span class="flex items-center gap-1">
                <DocumentMagnifyingGlassIcon class="h-4 w-4" />
                Detail
              </span>
            </button>
            <button
              class="text-sm dark:bg-emerald-300 text-emerald-800 font-semibold mr-2 px-4 py-1 rounded hover:bg-green-600 hover:text-emerald-300 focus:bg-green-700 focus:text-emerald-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <span class="flex items-center gap-1">
                <PencilSquareIcon class="h-4 w-4" />
                Update
              </span>
            </button>
          </div>
        </template>
        <!-- <button class="text-sm text-blue-500 hover:underline">Detail</button> -->
      </appTabel>
    </div>

    <div
      class="px-4 py-3 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center"
    >
      <div class="text-sm text-gray-700 dark:text-gray-300">
        Showing <span class="font-medium">{{ maintenancesOn.pagination.from }}</span> to
        <span class="font-medium">{{ maintenancesOn.pagination.to }}</span> of
        <span class="font-medium">{{ maintenancesOn.pagination.total }}</span> maintenance
      </div>
      <Pagination
        :currentPage="maintenancesOn.pagination.current_page"
        :totalItems="maintenancesOn.pagination.last_page"
        :itemsPerPage="maintenancesOn.pagination.per_page"
        :total-pages="maintenancesOn.pagination.last_page"
        :limit="perPageCls"
        @page-changed="fetchMaintenanceOn"
        @limit-changed="changeLimitOn"
        active-classes="bg-teal-600 text-white"
        class="mt-4"
      />
    </div>
  </div>

  <!-- selesai -->
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow mt-4">
    <div
      class="p-4 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
    >
      <div>
        <h2 class="text-xl font-bold text-gray-800 dark:text-white">Data Selesai</h2>
        <p class="text-sm text-gray-500 dark:text-gray-400">Data Maintenance Selesai</p>
      </div>
    </div>

    <div
      class="p-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row gap-4"
    >
      <div class="relative flex-grow">
        <input
          type="text"
          v-model="searchTermCls"
          placeholder="Cari maintenance..."
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
          @click="resetFilterCls"
          class="px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-400 dark:hover:bg-zinc-500"
        >
          <ArrowPathIcon class="h-5 w-5" />
        </button>
      </div>
    </div>

    <div class="overflow-auto overscroll-contain">
      <template v-if="!maintenancesClose.data.length">
        <div class="text-center text-gray-500 py-4 flex items-center justify-center">
          <ArrowPathIcon class="animate-spin h-6 w-6 inline-block mr-2" />
          <span class="text-gray-700 dark:text-gray-300">Memuat data maintenance...</span>
        </div>
      </template>
      <template v-else-if="maintenancesClose.data.length === 0">
        <div class="text-center text-gray-500 py-4">Tidak ada data maintenance</div>
      </template>
      <appTabel :columns="columns" :data="maintenancesClose.data">
        <template #cell-asset="{ item }">
          {{ item.asset?.asset_name || '-' }}
        </template>
        <template #cell-status="{ item }">
          <span :class="getStatusClass(item.status)" class="px-2 inline-flex text-xs leading-5 font-semibold rounded">
            {{ item.status }}
          </span>
        </template>
        <template #cell-type="{ item }">
          <span :class="getTypeClass(item.type)" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
            {{ item.type }}
          </span>
        </template>
        <template #cell-urgency_level="{ item }">
          <span
            :class="getUrgencyClass(item.urgency_level)"
            class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
          >
            {{ item.urgency_level }}
          </span>
        </template>
        <template #cell-created_at="{ item }">
          {{ dayjs(item.created_at).format('dddd, D MMMM YYYY HH:mm') }}
        </template>
        <template #actions="{ item }">
          <div class="flex items-center space-x-2">
            <!-- goto detail page -->
            <button
              @click="goToDetail(item)"
              class="text-sm dark:bg-blue-300 text-blue-800 font-semibold mr-2 px-4 py-1 rounded hover:bg-blue-500 hover:text-blue-200 focus:bg-blue-800 focus:text-blue-200"
            >
              <span class="flex items-center gap-1">
                <DocumentMagnifyingGlassIcon class="h-4 w-4" />
                Detail
              </span>
            </button>
          </div>
        </template>
        <!-- <button class="text-sm text-blue-500 hover:underline">Detail</button> -->
      </appTabel>
    </div>

    <div
      class="px-4 py-3 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center"
    >
      <div class="text-sm text-gray-700 dark:text-gray-300">
        Showing <span class="font-medium">{{ maintenancesClose.pagination.from }}</span> to
        <span class="font-medium">{{ maintenancesClose.pagination.to }}</span> of
        <span class="font-medium">{{ maintenancesClose.pagination.total }}</span> maintenance
      </div>
      <Pagination
        :currentPage="maintenancesClose.pagination.current_page"
        :totalItems="maintenancesClose.pagination.last_page"
        :itemsPerPage="maintenancesClose.pagination.per_page"
        :total-pages="maintenancesClose.pagination.last_page"
        :limit="perPageCls"
        @page-changed="fetchMaintenanceClose"
        @limit-changed="changeLimitcls"
        active-classes="bg-teal-600 text-white"
        class="mt-4"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useToast } from 'vue-toastification'
import {
  ArrowPathIcon,
  ExclamationTriangleIcon,
  PencilSquareIcon,
  DocumentMagnifyingGlassIcon,
} from '@heroicons/vue/24/outline'
import appTabel from '@/components/tabel/appTabel.vue'
import Pagination from '@/components/AppsPagination.vue'
import maintenanceService from '@/services/maintenanceService'
import dayjs from 'dayjs'
import router from '@/router'
import { useAuthStore } from '@/stores/auth'
import MaintenanceFormModal from './components/addMaintenanceModal.vue'
import maintenanceUpdateModal from './components/updateMaintenanceModal.vue'

const toast = useToast()
const perPage = ref(5)
const perPageCls = ref(5)
const perPageOn = ref(5)
const searchTerm = ref('')
const searchTermOn = ref('')
const searchTermCls = ref('')
const auth = useAuthStore()
const showAddModal = ref(false)

const grandted = computed(() => ['Admin', 'SuperAdmin', 'Inspeksi'].includes(auth.user?.role))

const debounceTimeout = ref(null)

const maintenances = ref({
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
const maintenancesClose = ref({
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
const maintenancesOn = ref({
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
  { key: 'user_inspektor', label: 'Inspektor' },
  { key: 'asset', label: 'Asset' },
  { key: 'type', label: 'Type' },
  { key: 'status', label: 'Status' },
  { key: 'urgency_level', label: 'Urgency Level' },
  { key: 'created_at', label: 'Created' },
]

const fetchMaintenance = async (page = 1) => {
  try {
    const excludedStatus = [5, 6, 7]
    const res = await maintenanceService.getAll(page, perPage.value, {
      exclude_status: excludedStatus.join(','),
    })
    maintenances.value = res
  } catch (e) {
    toast.error('Gagal memuat data maintenance:', e)
  }
}
const fetchMaintenanceClose = async (page = 1) => {
  try {
    const res = await maintenanceService.getclose(page, perPage.value)
    maintenancesClose.value = res
  } catch (e) {
    toast.error('Gagal memuat data maintenance:', e)
  }
}
const fetchMaintenanceOn = async (page = 1) => {
  try {
    const excludedStatus = [6, 4]
    const res = await maintenanceService.getAll(page, perPage.value, {
      exclude_status: excludedStatus.join(','),
    })
    maintenancesOn.value = res
  } catch (e) {
    toast.error('Gagal memuat data maintenance:', e)
  }
}

onMounted(() => {
  fetchMaintenance()
  fetchMaintenanceClose()
  fetchMaintenanceOn()
})

const filterData = () => {
  if (searchTerm.value.trim() === '') {
    // Jika searchTerm kosong, reset ke data awal
    fetchMaintenance() // Muat ulang data untuk mengembalikan data asli
  } else {
    maintenances.value.data = maintenances.value.data.filter((item) =>
      item.asset?.asset_name.toLowerCase().includes(searchTerm.value.toLowerCase()),
    )
  }
}
const resetFilter = () => {
  searchTerm.value = ''
  fetchMaintenance() // Muat ulang data untuk mengembalikan data asli
}
const filterDataOn = () => {
  if (searchTermOn.value.trim() === '') {
    // Jika searchTerm kosong, reset ke data awal
    fetchMaintenanceOn() // Muat ulang data untuk mengembalikan data asli
  } else {
    maintenancesOn.value.data = maintenancesOn.value.data.filter((item) =>
      item.asset?.asset_name.toLowerCase().includes(searchTermOn.value.toLowerCase()),
    )
  }
}
const resetFilterOn = () => {
  searchTermOn.value = ''
  fetchMaintenanceOn() // Muat ulang data untuk mengembalikan data asli
}
const filterDataCls = () => {
  if (searchTermCls.value.trim() === '') {
    // Jika searchTermCls kosong, reset ke data awal
    fetchMaintenanceClose() // Muat ulang data untuk mengembalikan data asli
  } else {
    maintenancesClose.value.data = maintenancesClose.value.data.filter((item) =>
      item.asset?.asset_name.toLowerCase().includes(searchTermCls.value.toLowerCase()),
    )
  }
}
const resetFilterCls = () => {
  searchTermCls.value = ''
  fetchMaintenanceClose() // Muat ulang data untuk mengembalikan data asli
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
watch(searchTermOn, () => {
  // Clear timeout sebelumnya
  clearTimeout(debounceTimeout.value)

  // Set timeout untuk melakukan filter setelah 2 detik
  debounceTimeout.value = setTimeout(() => {
    filterDataOn()
  }, 500)
})
watch(searchTermCls, () => {
  // Clear timeout sebelumnya
  clearTimeout(debounceTimeout.value)

  // Set timeout untuk melakukan filter setelah 2 detik
  debounceTimeout.value = setTimeout(() => {
    filterDataCls()
  }, 500)
})

function changeLimit(newLimit) {
  perPage.value = newLimit
  fetchMaintenance(1) // Reset ke page 1 saat limit berubah
}
function changeLimitcls(newLimit) {
  perPageCls.value = newLimit
  fetchMaintenanceClose(1) // Reset ke page 1 saat limit berubah
}
function changeLimitOn(newLimit) {
  perPageOn.value = newLimit
  fetchMaintenanceOn(1) // Reset ke page 1 saat limit berubah
}

const goToDetail = (item) => {
  router.push({ name: 'MaintenanceDetail', params: { id: item.id } })
}

const handleMaintenanceStore = () => {
  fetchMaintenance()
}
const openAddModal = () => {
  showAddModal.value = true
}

const closeAddModal = () => {
  showAddModal.value = false
}

const canDelete = (item) => {
  const created = dayjs(item.created_at)
  const now = dayjs()
  return now.diff(created, 'minute') <= 60
}
function deleteMaintenance(item) {
  if (confirm(`Apakah Anda yakin ingin menghapus maintenance dengan ID ${item.id}?`)) {
    maintenanceService
      .delete(item.id)
      .then(() => {
        toast.success('Maintenance berhasil dihapus')
        fetchMaintenance()
      })
      .catch((error) => {
        toast.error(`Gagal menghapus maintenance: ${error.message}`)
      })
  }
}

const selectedMaintenanceData = ref(null) // untuk menyimpan data maintenance yang dipilih

const showUpdateModal = ref(false)
const isLoadingMaintenance = ref(false)
const maintenanceError = ref(null)
const maintenanceForm = ref({})
const selectedAsset = ref(null)

const openMaintenanceModal = async (id) => {
  showUpdateModal.value = true
  isLoadingMaintenance.value = true
  maintenanceError.value = null
  maintenanceForm.value = {}
  selectedAsset.value = null
  selectedMaintenanceData.value = null

  try {
    const { data } = await maintenanceService.get(id)
    const maintenance = data

    console.log('Selected Maintenance:', data)
    selectedMaintenanceData.value = maintenance

    maintenanceForm.value = {
      asset_name_search: maintenance.asset.asset_name,
      urgency_id: maintenance.urgency_id,
      description: maintenance.description,
      imagebefore: null,
    }

    selectedAsset.value = {
      asset_code: maintenance.asset.asset_code,
      location: maintenance.asset.location,
    }
  } catch (error) {
    maintenanceError.value = 'Gagal memuat data maintenance.'
    console.error(error)
  } finally {
    isLoadingMaintenance.value = false
  }
}

const getStatusClass = (status) => {
  switch (status.toLowerCase()) {
    case 'selesai':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    case 'pending':
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
    case 'dalam perbaikan':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    case 'dalam pergantian shift':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }
}
const getUrgencyClass = (status) => {
  switch (status.toLowerCase()) {
    case 'hight':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    case 'medium':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    case 'low':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    default:
      return 'bg-gray-200 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }
}
const getTypeClass = (status) => {
  switch (status.toLowerCase()) {
    case 'breakdown':
      return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200'
    case 'inspeksi':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    default:
      return 'bg-gray-200 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }
}
</script>
