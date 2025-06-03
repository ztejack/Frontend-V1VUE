<template>
  <transition name="fade">
    <div v-if="show" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen px-4 py-10 text-center">
        <div class="fixed inset-0 bg-gray-800/75" @click="closeModal"></div>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-xl p-6 z-10">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Tambah Inspeksi</h2>
            <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
              <span class="sr-only">Tutup</span>
              ✕
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

          <form v-if="!loading" @submit.prevent="submitForm" class="space-y-4">
            <div class="grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-2">
              <!-- Maintenance Needed -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Butuh Maintenance?</label>
                <select
                  v-model="form.maintenance_needed"
                  class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-zinc-500 focus:border-zinc-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="">Pilih</option>
                  <option value="1">Ya</option>
                  <option value="0">Tidak</option>
                </select>
                <p v-if="errors.maintenance_needed" class="text-red-500 text-sm">{{ errors.maintenance_needed[0] }}</p>
              </div>

              <!-- Asset -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Pilih Aset</label>
                <select
                  v-model="form.asset_id"
                  class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-zinc-500 focus:border-zinc-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option v-for="asset in assets" :key="asset.id" :value="asset.id">
                    {{ asset.asset_name }}
                  </option>
                </select>
                <p v-if="errors.asset_id" class="text-red-500 text-sm">{{ errors.asset_id[0] }}</p>
              </div>

              <!-- Jenis Maintenance -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Jenis Inspeksi</label>
                <select
                  v-model="form.type_id"
                  class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-zinc-500 focus:border-zinc-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option v-for="type in types" :key="type.id" :value="type.id">
                    {{ type.name }}
                  </option>
                </select>
                <p v-if="errors.type_id" class="text-red-500 text-sm">{{ errors.type_id[0] }}</p>
              </div>

              <!-- Tingkat Urgensi -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Tingkat Urgensi</label>
                <select
                  v-model="form.urgency_id"
                  class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-zinc-500 focus:border-zinc-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option v-for="urgency in urgencies" :key="urgency.id" :value="urgency.id">
                    {{ urgency.status_name }}
                  </option>
                </select>
                <p v-if="errors.urgency_id" class="text-red-500 text-sm">{{ errors.urgency_id[0] }}</p>
              </div>

              <!-- Deskripsi -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Deskripsi (Opsional)</label>
                <textarea
                  v-model="form.description"
                  class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-zinc-500 focus:border-zinc-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  rows="3"
                ></textarea>
                <p v-if="errors.description" class="text-red-500 text-sm">{{ errors.description[0] }}</p>
              </div>

              <!-- Upload Gambar -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Gambar (Opsional)</label>
                <input
                  type="file"
                  @change="handleFileChange"
                  class="mt-1 block w-full border file:mr-4 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-teal-100 file:text-teal-700 hover:file:bg-gray-500 border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-zinc-500 focus:border-zinc-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  accept="image/*"
                />
                <p v-if="errors.image" class="text-red-500 text-sm">{{ errors.image[0] }}</p>
              </div>

              <!-- Submit -->
              <div class="flex justify-end">
                <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">Simpan</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import assetService from '@/services/assetService'
import urgencyService from '@/services/urgencyService'
import inspeksiService from '@/services/inspeksiService'
import { useToast } from 'vue-toastification'

const props = defineProps({ show: Boolean })
const emit = defineEmits(['close', 'store'])

const form = reactive({
  maintenance_needed: '',
  asset_id: '',
  type_id: '',
  urgency_id: '',
  description: '',
  image: null,
})
const toast = useToast()

const loading = ref(false)
const error = ref(null)
const errors = ref({})
const assets = ref([])
const types = ref([
  { id: 1, name: 'Inspeksi' },
  { id: 2, name: 'Breakdown' },
])
const urgencies = ref([])

onMounted(async () => {
  const [assetRes, urgencyRes] = await Promise.all([assetService.getAll(), urgencyService.getAll()])

  assets.value = assetRes.data
  urgencies.value = urgencyRes.data
  console.log(assets.value)
  console.log(urgencies.value)
})

const handleFileChange = (e) => {
  form.image = e.target.files[0]
}

const submitForm = async () => {
  const payload = new FormData()
  for (const key in form) {
    if (form[key] !== null) {
      payload.append(key, form[key])
    }
  }

  try {
    await inspeksiService.stores(payload)
    emit('store')
    emit('close')
  } catch (err) {
    if (err.response?.status === 422) {
      errors.value = err.response.data.errors
    }
  }
}

const closeModal = () => emit('close')
</script>

<style scoped></style>
