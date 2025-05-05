<template>
  <div v-if="show" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-10 text-center md:block md:p-0">
      <!-- Background overlay -->
      <div class="fixed inset-0 transition-opacity bg-gray-800/75" aria-hidden="true" @click="closeModal"></div>

      <!-- Modal panel -->
      <div
        class="inline-block px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl dark:bg-gray-800 sm:my-8 sm:p-6"
      >
        <div class="flex justify-between items-start mb-4">
          <h3 class="text-lg font-medium leading-6 text-gray-900 dark:text-white">Edit Aset</h3>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-500 focus:outline-none">
            <span class="sr-only">Close</span>
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="py-4 flex justify-center">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100"></div>
        </div>

        <!-- Error message -->
        <div v-if="error" class="mb-4 p-3 bg-red-100 text-red-700 rounded-md dark:bg-red-400/50 dark:text-red-200">
          {{ error }}
        </div>

        <!-- Form -->
        <form v-if="!loading" @submit.prevent="saveAsset" class="space-y-4">
          <div class="grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-2">
            <!-- Nama Aset -->
            <div class="sm:col-span-2">
              <label for="asset_name" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Nama Aset</label>
              <input
                type="text"
                id="asset_name"
                v-model="formData.asset_name"
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-zinc-500 focus:border-zinc-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
              <p v-if="fieldErrors.asset_name" class="text-sm text-red-500 mt-1">{{ fieldErrors.asset_name[0] }}</p>
            </div>

            <!-- Stock Code -->
            <div>
              <label for="stockcode" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Stock Code</label>
              <input
                type="text"
                id="stockcode"
                v-model="formData.stockcode"
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-zinc-500 focus:border-zinc-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              <p v-if="fieldErrors.stockcode" class="text-sm text-red-500 mt-1">{{ fieldErrors.stockcode[0] }}</p>
            </div>

            <!-- Serial Number -->
            <div>
              <label for="serialnumber" class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >Serial Number</label
              >
              <input
                type="text"
                id="serialnumber"
                v-model="formData.serialnumber"
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-zinc-500 focus:border-zinc-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              <p v-if="fieldErrors.serialnumber" class="text-sm text-red-500 mt-1">{{ fieldErrors.serialnumber[0] }}</p>
            </div>

            <!-- Brand -->
            <div>
              <label for="brand" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Brand</label>
              <input
                type="text"
                id="brand"
                v-model="formData.brand"
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-zinc-500 focus:border-zinc-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              <p v-if="fieldErrors.brand" class="text-sm text-red-500 mt-1">{{ fieldErrors.brand[0] }}</p>
            </div>

            <!-- Model -->
            <div>
              <label for="model" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Model</label>
              <input
                type="text"
                id="model"
                v-model="formData.model"
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-zinc-500 focus:border-zinc-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              <p v-if="fieldErrors.model" class="text-sm text-red-500 mt-1">{{ fieldErrors.model[0] }}</p>
            </div>

            <!-- Lokasi Penempatan -->
            <div>
              <label for="id_location" class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >Lokasi Penempatan</label
              >
              <select
                id="id_location"
                v-model="formData.id_location"
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-zinc-500 focus:border-zinc-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option v-for="location in locations" :key="location.id" :value="location.id">
                  {{ location.label }}
                </option>
              </select>
              <p v-if="fieldErrors.id_location" class="text-sm text-red-500 mt-1">{{ fieldErrors.id_location[0] }}</p>
            </div>

            <!-- Status -->
            <div>
              <label for="id_status" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
              <select
                id="id_status"
                v-model="formData.id_status"
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-zinc-500 focus:border-zinc-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option v-for="status in statuses" :key="status.id" :value="status.id">
                  {{ status.label }}
                </option>
              </select>
              <p v-if="fieldErrors.id_status" class="text-sm text-red-500 mt-1">{{ fieldErrors.id_status[0] }}</p>
            </div>

            <!-- Kategori -->
            <div>
              <label for="id_category" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Kategori</label>
              <select
                id="id_category"
                v-model="formData.id_category"
                multiple
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-zinc-500 focus:border-zinc-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option v-for="category in categories" :key="category.id" :value="category.id">
                  {{ category.label }}
                </option>
              </select>
              <p v-if="fieldErrors.id_category" class="text-sm text-red-500 mt-1">{{ fieldErrors.id_category[0] }}</p>
            </div>

            <!-- Gambar -->
            <div class="sm:col-span-2">
              <label for="image" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Image URL</label>
              <input
                type="file"
                :id="formData.id"
                @change="handleFileUpload"
                class="mt-1 block w-full border file:mr-4 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-teal-100 file:text-teal-700 hover:file:bg-gray-500 border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-zinc-500 focus:border-zinc-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              <p v-if="fieldErrors.image" class="text-sm text-red-500 mt-1">{{ fieldErrors.image[0] }}</p>
            </div>

            <!-- Spesifikasi -->
            <div class="sm:col-span-2">
              <label for="specifications" class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >Spesifikasi</label
              >
              <textarea
                id="specifications"
                v-model="formData.specifications"
                rows="3"
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-zinc-500 focus:border-zinc-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              ></textarea>
            </div>

            <!-- Deskripsi -->
            <div class="sm:col-span-2">
              <label for="description" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Deskripsi</label>
              <textarea
                id="description"
                v-model="formData.description"
                rows="3"
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-zinc-500 focus:border-zinc-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              ></textarea>
            </div>
          </div>

          <!-- Submit buttons -->
          <div class="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
            <button
              type="submit"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-zinc-500 sm:col-start-2 sm:text-sm"
            >
              Simpan
            </button>
            <button
              type="button"
              @click="closeModal"
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-zinc-500 sm:mt-0 sm:col-start-1 sm:text-sm dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600"
            >
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import assetService from '@/services/assetService'
import categoryService from '@/services/categoryService'
import locationService from '@/services/locationService'
import statusService from '@/services/statusService'

const props = defineProps({
  show: Boolean,
  assetId: String,
})

const emit = defineEmits(['close', 'update'])
const toast = useToast()

const loading = ref(false)
const error = ref(null)
const fieldErrors = ref({})

const locations = ref([])
const categories = ref([])
const statuses = ref([])

const formData = reactive({
  asset_name: '',
  stockcode: '',
  serialnumber: '',
  brand: '',
  model: '',
  description: '',
  specifications: '',
  id_location: '',
  id_category: [],
  id_status: '',
  image: null,
})

const fetchReferenceData = async () => {
  try {
    const [categoryRes, locationRes, statusRes, assetdataRes] = await Promise.all([
      categoryService.getAll(),
      locationService.getAll(),
      statusService.getAll(),
      assetService.get(props.assetId),
    ])

    categories.value = categoryRes.data.map((item) => ({ label: item.category, id: item.id }))
    locations.value = locationRes.data.map((item) => ({ label: item.unit, id: item.id }))
    statuses.value = statusRes.data
      .filter((item) => item.statustype === 'ASST')
      .map((item) => ({ label: item.status, id: item.id }))

    const asset = assetdataRes.data
    formData.asset_name = asset.asset_name || ''
    formData.stockcode = asset.stockcode || ''
    formData.serialnumber = asset.serialnumber || ''
    formData.brand = asset.brand || ''
    formData.model = asset.model || ''
    formData.description = asset.description || ''
    formData.specifications = asset.specifications || ''

    const locationMatch = locations.value.find((loc) => loc.label === asset.location)
    const categoryMatch = categories.value.find(
      (cat) => cat.label === (Array.isArray(asset.category) ? asset.category[0] : asset.category),
    )
    const statusMatch = statuses.value.find((st) => st.label === asset.status)

    formData.id_location = locationMatch?.id || ''
    formData.id_category = categoryMatch ? [categoryMatch.id] : []
    formData.id_status = statusMatch?.id || ''

    error.value = null
    fieldErrors.value = {}
  } catch (err) {
    console.error('Gagal memuat data referensi:', err)
    error.value = 'Gagal memuat data referensi.'
  }
}

const handleFileUpload = (e) => {
  const file = e.target.files[0]
  if (file) {
    formData.image = file
  }
}

const saveAsset = async () => {
  loading.value = true

  const payload = new FormData()
  for (const [key, value] of Object.entries(formData)) {
    if (value !== null) {
      if (key === 'id_category') {
        // Pastikan selalu mengirim sebagai array
        value.forEach((val) => {
          payload.append('id_category[]', val)
        })
      } else {
        payload.append(key, value)
      }
    }
  }
  payload.append('_method', 'PUT')

  try {
    await assetService.update(props.assetId, payload)
    emit('update')
    emit('close')
    toast.success('Aset berhasil diperbarui')
  } catch (err) {
    if (err.response?.status === 422) {
      fieldErrors.value = err.response.data.errors
      error.value = 'Mohon periksa kembali isian Anda.'
    } else {
      toast.error('Terjadi kesalahan saat menyimpan data')
    }
  } finally {
    loading.value = false
  }
}

const closeModal = () => emit('close')

onMounted(() => {
  fetchReferenceData()
})
</script>
