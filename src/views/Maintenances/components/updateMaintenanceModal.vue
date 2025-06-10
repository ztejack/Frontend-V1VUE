<template>
  <transition name="fade">
    <div v-if="show" class="fixed inset-0 z-50 overflow-y-auto">
      <transition name="scale-fade">
        <div v-if="show" class="fixed inset-0 z-50 bg-black/80 flex items-center justify-center" @click.self="closeModal">
          <div class="fixed inset-0 bg-gray-800/75" @click="closeModal"></div>

          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl p-6 z-10">
            <!-- Header -->
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Update Maintenance</h2>
              <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
                <span class="sr-only">Tutup</span>
                ✕
              </button>
            </div>

            <!-- Loading State -->
            <div v-if="loading" class="py-4 flex justify-center">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100"></div>
            </div>

            <!-- Error Message -->
            <div v-if="error" class="mb-4 p-3 bg-red-100 text-red-700 rounded-md dark:bg-red-400/50 dark:text-red-200">
              {{ error }}
            </div>

            <!-- Form -->
            <form v-if="!loading" @submit.prevent="submitForm" class="space-y-4">
              <div class="grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-2">
                <!-- Input Pencarian Aset -->
                <div class="relative col-span-2">
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Cari Aset</label>
                  <input
                    v-model="form.asset_name_search"
                    type="text"
                    placeholder="Ketik nama atau kode aset"
                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-zinc-500 focus:border-zinc-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                  <ul
                    v-if="filteredAssets.length && !selectedAsset"
                    class="absolute z-10 w-full text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border dark:border-gray-600 rounded-md mt-1 max-h-60 overflow-auto shadow-lg"
                  >
                    <li
                      v-for="asset in filteredAssets"
                      :key="asset.id"
                      @click="selectAsset(asset)"
                      class="px-4 py-2 hover:bg-teal-100 dark:hover:bg-teal-600 cursor-pointer"
                    >
                      {{ asset.asset_name }} - {{ asset.asset_code }}
                    </li>
                  </ul>
                </div>

                <!-- Detail Aset Terpilih -->
                <div v-if="selectedAsset">
                  <label class="text-sm text-gray-700 dark:text-gray-300">Kode Aset</label>
                  <input
                    type="text"
                    :value="selectedAsset.asset_code"
                    disabled
                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                  />
                </div>
                <div v-if="selectedAsset">
                  <label class="text-sm text-gray-700 dark:text-gray-300">Lokasi</label>
                  <input
                    type="text"
                    :value="selectedAsset.location"
                    disabled
                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                  />
                </div>

                <!-- Tingkat Urgensi -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Tingkat Urgensi</label>
                  <select
                    v-model="form.urgency_id"
                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="" disabled>Pilih</option>
                    <option v-for="urgency in urgencies" :key="urgency.id" :value="urgency.id">
                      {{ urgency.status_name }}
                    </option>
                  </select>
                  <p v-if="errors.urgency_id" class="text-red-500 text-sm">{{ errors.urgency_id[0] }}</p>
                </div>

                <!-- Upload Gambar -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Gambar</label>
                  <input
                    type="file"
                    @change="handleFileChange"
                    class="mt-1 block w-full border file:mr-4 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-teal-100 file:text-teal-700 hover:file:bg-gray-500 border-gray-300 rounded-md shadow-sm py-2 px-3 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    accept="image/*"
                  />
                  <p v-if="errors.imagebefore" class="text-red-500 text-sm">{{ errors.imagebefore[0] }}</p>
                </div>

                <!-- Deskripsi -->
                <div class="col-span-2">
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Deskripsi (Opsional)</label>
                  <textarea
                    v-model="form.description"
                    rows="3"
                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  ></textarea>
                  <p v-if="errors.description" class="text-red-500 text-sm">{{ errors.description[0] }}</p>
                </div>
              </div>

              <!-- Submit -->
              <div class="flex justify-end">
                <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script setup>
import { ref, reactive, onMounted, computed, watch } from 'vue'
import assetService from '@/services/assetService'
import urgencyService from '@/services/urgencyService'
import maintencneService from '@/services/maintenanceService'
import { useToast } from 'vue-toastification'

// Props dan Emit
const emit = defineEmits(['close', 'store'])
const props = defineProps({
  show: Boolean,
  modelValue: Object,
})

const toast = useToast()

// State
const loading = ref(false)
const error = ref(null)
const errors = reactive({})
const assets = ref([])
const urgencies = ref([])

// Form
const form = ref({
  asset_id: '',
  asset_name_search: '',
  type_id: 2,
  urgency_id: '',
  description: '',
  imagebefore: null,
})

// Selected Asset (computed)
const selectedAsset = computed(() => assets.value.find((a) => a.id === form.value.asset_id) || null)

// Fetch asset & urgency data
const fetchData = async () => {
  loading.value = true
  try {
    const [assetRes, urgencyRes] = await Promise.all([assetService.getAll(), urgencyService.getAll()])
    assets.value = assetRes.data
    urgencies.value = urgencyRes.data

    // Prefill selected asset label jika modelValue sudah tersedia
    if (form.value.asset_id && !form.value.asset_name_search) {
      const asset = assets.value.find((a) => a.id === form.value.asset_id)
      if (asset) {
        form.value.asset_name_search = `${asset.asset_name} - ${asset.asset_code}`
      }
    }

    // Prefill urgency_id berdasarkan urgency_level dari modelValue
    if (props.modelValue?.urgency_level && !form.value.urgency_id) {
      const matched = urgencies.value.find(
        (u) => u.status_name.toLowerCase() === props.modelValue.urgency_level.toLowerCase(),
      )
      form.value.urgency_id = matched?.id || ''
    }
  } catch {
    error.value = 'Gagal memuat data.'
  } finally {
    loading.value = false
  }
}
onMounted(fetchData)

// Prefill form when modelValue changes
watch(
  () => props.modelValue,
  (data) => {
    if (data) {
      form.value.asset_id = data.asset_id || ''
      form.value.urgency_id = data.urgency_id || ''
      form.value.description = data.description || ''
    }
  },
  { immediate: true },
)

// Set selectedAsset saat modal dibuka dan asset_id ada
watch(
  () => props.modelValue,
  (data) => {
    if (data) {
      form.value.asset_id = data.asset_id || ''
      form.value.description = data.description || ''

      // Prefill urgency berdasarkan LEVEL (bukan ID)
      if (data.urgency_level) {
        const matched = urgencies.value.find(
          (u) => u.status_name.trim().toLowerCase() === data.urgency_level.trim().toLowerCase(),
        )
        form.value.urgency_id = matched?.id || ''
      } else {
        form.value.urgency_id = data.urgency_id || ''
      }

      if (data.asset) {
        form.value.asset_name_search = `${data.asset.asset_name} - ${data.asset.asset_code}`
      } else {
        const fallbackAsset = assets.value.find((a) => a.id === data.asset_id)
        if (fallbackAsset) {
          form.value.asset_name_search = `${fallbackAsset.asset_name} - ${fallbackAsset.asset_code}`
        }
      }
    }
  },
  { immediate: true },
)

// Handle pencarian asset input
let debounceTimeout = null
watch(
  () => form.value.asset_name_search,
  (val) => {
    clearTimeout(debounceTimeout)
    debounceTimeout = setTimeout(() => {
      const isSelected =
        selectedAsset.value && `${selectedAsset.value.asset_name} - ${selectedAsset.value.asset_code}` === val
      if (!isSelected) {
        form.value.asset_id = ''
      }
    }, 300)
  },
)

// Filtered assets by search
const filteredAssets = computed(() => {
  const keyword = form.value.asset_name_search.trim().toLowerCase()
  if (!keyword) return []
  return assets.value.filter(
    (a) => a.asset_name.toLowerCase().includes(keyword) || (a.asset_code && a.asset_code.toLowerCase().includes(keyword)),
  )
})

// Select asset from suggestion list
function selectAsset(asset) {
  form.value.asset_id = asset.id
  form.value.asset_name_search = `${asset.asset_name} - ${asset.asset_code}`
}

// Handle file input
function handleFileChange(e) {
  form.value.imagebefore = e.target.files[0]
}

// Submit form
async function submitForm() {
  error.value = null
  Object.keys(errors).forEach((key) => (errors[key] = null))

  if (!form.value.asset_id) {
    errors.asset_id = ['Pilih aset terlebih dahulu.']
    return
  }

  const maintenanceId = props.modelValue?.id
  if (!maintenanceId) {
    toast.error('ID maintenance tidak tersedia.')
    return
  }

  console.log('SUBMIT: Maintenance ID =', maintenanceId, 'Form =', form)

  loading.value = true
  try {
    const res = await maintencneService.update(maintenanceId, form.value)
    Object.keys(form.value).forEach((key) => (form.value[key] = ''))
    emit('store')
    toast.success(res.message)
    closeModal()
  } catch (e) {
    if (e.response?.status === 422) {
      Object.assign(errors, e.response.data.errors)
    } else {
      error.value = 'Terjadi kesalahan saat menyimpan.'
    }
  } finally {
    loading.value = false
  }
}

// Close modal
function closeModal() {
  emit('close')
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.scale-fade-enter-active {
  transition:
    transform 0.3s ease,
    opacity 0.3s ease;
}
.scale-fade-enter-from {
  transform: scale(0.95);
  opacity: 0;
}
.scale-fade-leave-active {
  transition:
    transform 0.2s ease,
    opacity 0.2s ease;
}
.scale-fade-leave-to {
  transform: scale(0.95);
  opacity: 0;
}
input[disabled],
select[disabled],
textarea[disabled] {
  pointer-events: none;
  cursor: not-allowed;
  user-select: none; /* Optional: supaya teks juga tidak bisa disorot */
}
</style>
