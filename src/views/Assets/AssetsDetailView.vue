<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow">
    <!-- Header dengan tombol kembali -->
    <div class="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
      <div class="flex items-center gap-3">
        <button @click="goBack" class="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
          <ArrowLeftIcon class="h-5 w-5 text-gray-600 dark:text-gray-400" />
        </button>
        <div>
          <h2 class="text-xl font-bold text-gray-800 dark:text-white">Detail Aset</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            {{ asset ? asset.asset_name : 'Memuat...' }}
          </p>
        </div>
      </div>
      <div v-if="grandted" class="flex items-center gap-2">
        <button @click="openEditModal" class="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600">Edit</button>
        <button @click="confirmDelete" class="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600">Hapus</button>
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="p-8 flex justify-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-gray-100"></div>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="p-8 text-center">
      <p class="text-red-500 dark:text-red-400">{{ error }}</p>
      <button @click="fetchAssetDetail" class="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
        Coba Lagi
      </button>
    </div>

    <!-- Content -->
    <div v-else-if="asset" class="p-6">
      <!-- Informasi Utama -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <h3 class="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Informasi Aset</h3>
          <dl class="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
            <div class="sm:col-span-2">
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Nama Aset</dt>
              <dd class="mt-1 text-sm text-gray-900 dark:text-white">{{ asset.asset_name }}</dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Stock Code</dt>
              <dd class="mt-1 text-sm text-gray-900 dark:text-white">{{ asset.stockcode }}</dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Serial Number</dt>
              <dd class="mt-1 text-sm text-gray-900 dark:text-white">{{ asset.serialnumber }}</dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Asset Code</dt>
              <dd class="mt-1 text-sm text-gray-900 dark:text-white">{{ asset.asset_code }}</dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Brand</dt>
              <dd class="mt-1 text-sm text-gray-900 dark:text-white">{{ asset.brand }}</dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Model</dt>
              <dd class="mt-1 text-sm text-gray-900 dark:text-white">{{ asset.model }}</dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Lokasi Penempatan</dt>
              <dd class="mt-1 text-sm text-gray-900 dark:text-white">{{ asset.location }}</dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Kategori</dt>
              <dd class="mt-1 text-sm text-gray-900 dark:text-white">
                <template v-if="Array.isArray(asset.category)">
                  <span
                    v-for="(cat, index) in asset.category"
                    :key="index"
                    class="inline-block bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-blue-200"
                  >
                    {{ cat }}
                  </span>
                </template>
                <template v-else>
                  {{ asset.category }}
                </template>
              </dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Status</dt>
              <dd class="mt-1 text-sm">
                <span
                  :class="getStatusClass(asset.status)"
                  class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                >
                  {{ asset.status }}
                </span>
              </dd>
            </div>
          </dl>
        </div>

        <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <h3 class="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Foto Aset</h3>

          <div class="mt-2">
            <img
              v-if="asset.image"
              :src="asset.image"
              :alt="asset.asset_name"
              class="w-full h-auto rounded-md object-cover shadow-sm"
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

      <!-- Spesifikasi & Keterangan -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <h3 class="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Spesifikasi</h3>
          <div class="prose prose-sm max-w-none dark:prose-invert">
            <p v-if="asset.specifications" class="text-gray-900 dark:text-white">{{ asset.specifications }}</p>
            <p v-else class="text-gray-500 dark:text-gray-400">Tidak ada spesifikasi</p>
          </div>
        </div>
        <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <h3 class="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Keterangan</h3>
          <div class="prose prose-sm max-w-none dark:prose-invert">
            <p v-if="asset.description" class="text-gray-900 dark:text-white">{{ asset.description }}</p>
            <p v-else class="text-gray-500 dark:text-gray-400">Tidak ada keterangan</p>
          </div>
        </div>
      </div>

      <!-- History & Maintenance -->
      <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-8">
        <h3 class="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Riwayat Pemeliharaan</h3>
        <div v-if="asset.maintenance && asset.maintenance.length > 0">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead class="bg-gray-100 dark:bg-gray-800">
                <tr>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    Tanggal
                  </th>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    Jenis
                  </th>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    Deskripsi
                  </th>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    Teknisi
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                <tr v-for="(record, index) in asset.maintenance" :key="index">
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {{ formatDate(record.date) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ record.type }}</td>
                  <td class="px-6 py-4 text-sm text-gray-900 dark:text-white">{{ record.description }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ record.technician }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <p v-else class="text-gray-500 dark:text-gray-400">Tidak ada riwayat pemeliharaan</p>
      </div>
    </div>

    <!-- Edit Asset Modal -->
    <updateAssetmodal
      v-if="grandted"
      :show="showEditModal"
      :asset-id="route.params.id"
      @close="closeEditModal"
      @update="handleAssetUpdate"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import assetService from '@/services/assetService'
import { ArrowLeftIcon } from '@heroicons/vue/24/outline'
import updateAssetmodal from '@/views/Assets/Components/updateAssetModal.vue'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const toast = useToast()

const asset = ref(null)
const loading = ref(true)
const error = ref(null)
const showEditModal = ref(false)

const grandted = computed(() => ['Admin', 'SuperAdmin'].includes(auth.user?.role))

const fetchAssetDetail = async () => {
  loading.value = true
  error.value = null

  try {
    const id = route.params.id
    const response = await assetService.get(id)
    asset.value = response.data
    // console.log('Detail Aset:', asset.value.location)
  } catch (error) {
    error.value = 'Gagal memuat detail aset. Silakan coba lagi.'
    toast.error('Gagal memuat detail aset', error)
  } finally {
    loading.value = false
  }
}

const goBack = () => {
  router.push({ name: 'Assets' })
}

const openEditModal = () => {
  showEditModal.value = true
}

const closeEditModal = () => {
  showEditModal.value = false
}

const handleAssetUpdate = () => {
  fetchAssetDetail()
}

const confirmDelete = () => {
  if (window.confirm('Yakin ingin menghapus aset ini?')) {
    deleteAsset()
  }
}

const deleteAsset = async () => {
  try {
    await assetService.delete(asset.value.id)
    toast.success('Aset berhasil dihapus')
    router.push({ name: 'Assets' })
  } catch (e) {
    toast.error('Gagal menghapus aset:', e)
  }
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

// Fungsi untuk memberikan warna berdasarkan status
const getStatusClass = (status) => {
  if (!status) return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'

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

onMounted(() => {
  fetchAssetDetail()
})
</script>
