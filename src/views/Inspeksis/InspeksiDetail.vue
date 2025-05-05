<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow">
    <!-- Header -->
    <div class="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center gap-3">
      <button @click="goBack" class="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
        <ArrowLeftIcon class="h-5 w-5 text-gray-600 dark:text-gray-400" />
      </button>
      <div>
        <h2 class="text-xl font-bold text-gray-800 dark:text-white">Detail Inpeksi</h2>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          {{ maintenance?.asset?.asset_name || 'Memuat...' }}
        </p>
      </div>
    </div>

    <div v-if="loading" class="p-8 flex justify-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-gray-100"></div>
    </div>

    <div v-else-if="error" class="p-8 text-center">
      <p class="text-red-500 dark:text-red-400">{{ error }}</p>
    </div>

    <div v-else-if="maintenance" class="p-6 space-y-6">
      <div class="grid grid-row-1 md:grid-row-2 gap-6">
        <div class="col-span-2 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Tanggal Maintenance</dt>
            <dd class="mt-1 text-sm text-gray-900 dark:text-white">{{ dayjs(maintenance.create_at) }}</dd>
          </div>
          <div>
            <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Jenis</dt>
            <dd class="mt-1 text-sm text-gray-900 dark:text-white">{{ maintenance.type }}</dd>
          </div>
          <div>
            <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Inspektor</dt>
            <dd class="mt-1 text-sm text-gray-900 dark:text-white">{{ maintenance.user_inspektor }}</dd>
          </div>
          <div>
            <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Status</dt>
            <dd class="mt-1 text-sm text-gray-900 dark:text-white">
              <span :class="getStatusClass(maintenance.status)" class="px-2 py-1 rounded-full text-xs font-semibold">
                {{ maintenance.status }}
              </span>
            </dd>
          </div>
          <div>
            <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Urgency</dt>
            <dd class="mt-1 text-sm text-gray-900 dark:text-white">
              <span :class="getUrgencyClass(maintenance.urgency_level)" class="px-2 py-1 rounded-full text-xs font-semibold">
                {{ maintenance.urgency_level }}
              </span>
            </dd>
          </div>
        </div>
        <div class="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h3 class="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Informasi Aset</h3>
            <dl class="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
              <div class="sm:col-span-2">
                <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Nama Aset</dt>
                <dd class="mt-1 text-sm text-gray-900 dark:text-white">{{ maintenance.asset.asset_name }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Stock Code</dt>
                <dd class="mt-1 text-sm text-gray-900 dark:text-white">{{ maintenance.asset.stockcode }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Serial Number</dt>
                <dd class="mt-1 text-sm text-gray-900 dark:text-white">{{ maintenance.asset.serialnumber }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Asset Code</dt>
                <dd class="mt-1 text-sm text-gray-900 dark:text-white">{{ maintenance.asset.asset_code }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Brand</dt>
                <dd class="mt-1 text-sm text-gray-900 dark:text-white">{{ maintenance.asset.brand }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Model</dt>
                <dd class="mt-1 text-sm text-gray-900 dark:text-white">{{ maintenance.asset.model }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Lokasi Penempatan</dt>
                <dd class="mt-1 text-sm text-gray-900 dark:text-white">{{ maintenance.asset.location }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Kategori</dt>
                <dd class="mt-1 text-sm text-gray-900 dark:text-white">
                  <template v-if="Array.isArray(maintenance.asset.category)">
                    <span
                      v-for="(cat, index) in maintenance.asset.category"
                      :key="index"
                      class="inline-block bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-blue-200"
                    >
                      {{ cat }}
                    </span>
                  </template>
                  <template v-else>
                    {{ maintenance.asset.category }}
                  </template>
                </dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Status</dt>
                <dd class="mt-1 text-sm">
                  <span
                    :class="getStatusAssetClass(maintenance.asset.status)"
                    class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                  >
                    {{ maintenance.asset.status }}
                  </span>
                </dd>
              </div>
            </dl>
          </div>
          <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h3 class="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Foto Asset</h3>

            <div class="mt-2">
              <img
                v-if="maintenance.asset.image"
                :src="maintenance.asset.image"
                :alt="maintenance.asset.asset_name"
                class="w-full h-auto max-h-100 rounded-md object-cover shadow-sm"
              />
              <div
                v-else
                class="w-full h-48 bg-gray-200 dark:bg-gray-600 rounded-md flex items-center justify-center text-gray-500 dark:text-gray-400"
              >
                <span>Tidak ada gambar</span>
              </div>
            </div>
          </div>
        </div>
        <div class="col-span-2 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-2">Deskripsi</h3>
          <p class="text-sm text-gray-900 dark:text-white" v-if="maintenance.description">{{ maintenance.description }}</p>
          <p class="text-sm text-gray-500 dark:text-gray-400" v-else>Tidak ada deskripsi</p>
        </div>
        <div class="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h3 class="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Foto Sebelum Maintenance</h3>

            <div class="mt-2">
              <img
                v-if="maintenance.imagebefore"
                :src="maintenance.imagebefore"
                :alt="maintenance.asset_name"
                class="w-full h-auto rounded-md object-cover shadow-sm"
              />
              <div
                v-else
                class="w-full h-100 bg-gray-200 dark:bg-gray-600 rounded-md flex items-center justify-center text-gray-500 dark:text-gray-400"
              >
                <span>Tidak ada gambar</span>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h3 class="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Foto Setelah Maintenance</h3>

            <div class="mt-2">
              <img
                v-if="maintenance.imagebafter"
                :src="maintenance.imagebafter"
                :alt="maintenance.asset_name"
                class="w-full h-auto rounded-md object-cover shadow-sm"
              />
              <div
                v-else
                class="w-full h-50 bg-gray-200 dark:bg-gray-600 rounded-md flex items-center justify-center text-gray-500 dark:text-gray-400"
              >
                <span>Tidak ada gambar</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow mt-2">
    <div class="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center gap-3">
      <h2 class="text-xl font-bold text-gray-800 dark:text-white">Riwayat Maintenance</h2>
    </div>
    <div v-if="!maintenance || !maintenance.history || !maintenance.history.length" class="p-8 flex justify-center">
      <p class="text-sm text-gray-500 dark:text-gray-400">Tidak ada data</p>
    </div>
    <div v-if="loading" class="p-8 flex justify-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-gray-100"></div>
    </div>

    <div v-else-if="error" class="p-8 text-center">
      <p class="text-red-500 dark:text-red-400">{{ error }}</p>
    </div>

    <div v-else-if="maintenance.history && maintenance.history.length" class="p-6 space-y-4">
      <div
        v-for="(item, index) in maintenance.history"
        :key="index"
        class="bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-700 rounded-lg p-4 shadow-md"
      >
        <div class="flex justify-between items-center">
          <h3 class="text-lg font-semibold text-gray-800 dark:text-white">
            {{ item.title || 'Maintenance #' + (index + 1) }}
          </h3>
          <span :class="getStatusClass(item.status)" class="px-3 py-1 rounded-full text-xs font-medium">
            {{ item.status }}
          </span>
        </div>

        <p class="text-sm text-gray-600 dark:text-gray-300 mt-2">
          {{ item.description || 'Tidak ada deskripsi' }}
        </p>

        <div class="flex justify-between items-center mt-4 text-sm text-gray-500 dark:text-gray-400">
          <span>Oleh: {{ item?.user || '-' }}</span>
          <span>{{ dayjs(item.created_at).format('D MMM YYYY HH:mm') }}</span>
        </div>

        <div class="flex justify-end mt-4">
          <button
            @click="popup(item)"
            class="px-4 py-2 rounded-md bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-800 transition"
          >
            Lihat Detail
          </button>
        </div>
      </div>

      <!-- Modal -->
      <div v-if="selectedItem" class="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-xl w-full p-6 relative">
          <button
            @click="selectedItem = null"
            class="absolute top-2 right-2 text-gray-500 dark:text-gray-300 hover:text-red-500"
          >
            ✕
          </button>

          <h3 class="text-lg font-bold mb-4 text-gray-900 dark:text-white">Detail Gambar Maintenance</h3>

          <div v-if="selectedItem.image" class="space-y-4">
            <div v-if="selectedItem.image">
              <p class="text-sm font-medium text-gray-700 dark:text-gray-300">image:</p>
              <img :src="selectedItem.image" alt="Before" class="w-full rounded border dark:border-gray-600" />
            </div>
          </div>
          <div v-else class="text-center text-gray-500 dark:text-gray-400">Tidak ada gambar tersedia.</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import maintenanceService from '@/services/maintenanceService'
import { ArrowLeftIcon } from '@heroicons/vue/24/outline'
import dayjs from 'dayjs'

const route = useRoute()
const router = useRouter()
const toast = useToast()

const maintenance = ref(null)
const loading = ref(true)
const error = ref(null)
const selectedItem = ref(null)

const popup = (item) => {
  selectedItem.value = item
}
const fetchMaintenanceDetail = async () => {
  loading.value = true
  error.value = null

  try {
    const id = route.params.id
    const response = await maintenanceService.get(id)
    maintenance.value = response.data
  } catch (err) {
    error.value = 'Gagal memuat detail maintenance'
    toast.error('Gagal memuat data', err)
  } finally {
    loading.value = false
  }
}

const goBack = () => {
  router.back()
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
const getStatusAssetClass = (status) => {
  if (!status) return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'

  switch (status.toLowerCase()) {
    case 'baik':
      return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200'
    case 'rusak':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    case 'dalam perbaikan':
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
watch(
  () => route.params.id,
  (newId) => {
    fetchMaintenanceDetail(newId)
  },
)
onMounted(() => {
  fetchMaintenanceDetail()
})
</script>
