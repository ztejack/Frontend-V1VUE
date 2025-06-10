<template>
  <div>
    <!-- Trigger Button -->
    <button @click="open" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md flex items-center text-sm">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
      </svg>
      Tambah Aset
    </button>

    <!-- Popup Form -->
    <transition name="fade">
      <div v-if="visible" class="fixed inset-0 z-50 bg-black/80 flex items-center justify-center" @click.self="close">
        <transition name="scale-fade">
          <div v-if="visible" class="bg-white dark:bg-gray-700 rounded-md p-6 w-full m-10 shadow-xl">
            <h2 class="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Tambah Asset</h2>
            <form @submit.prevent="submitForm">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-x-4">
                <div v-for="item in formItems" :key="item.id" class="mb-4">
                  <label :for="item.id" class="block text-gray-700 dark:text-gray-200">{{ item.name }}</label>
                  <textarea
                    v-if="item.type === 'textarea'"
                    :id="item.id"
                    v-model="form[item.id]"
                    class="block w-full rounded-md bg-white dark:bg-gray-200 px-3 py-1.5 text-base text-gray-900 dark:text-gray-700 shadow-sm outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-gray-500 sm:text-sm/6"
                  ></textarea>

                  <select
                    v-else-if="item.type === 'select'"
                    :id="item.id"
                    v-model="form[item.id]"
                    class="w-full rounded-md bg-white dark:bg-gray-200 px-3 py-1.5 text-base text-gray-900 dark:text-gray-700 shadow-sm outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-gray-500 sm:text-sm/6"
                  >
                    <option v-for="option in item.options" :key="option" :value="option.value">{{ option.label }}</option>
                  </select>

                  <input
                    v-else-if="item.id === 'image'"
                    type="file"
                    :id="item.id"
                    @change="handleFileUpload"
                    class="w-full rounded-md bg-white dark:bg-gray-200 px-3 py-1.5 text-gray-90 shadow-sm outline-1 -outline-offset-1 outline-gray-300 file:mr-4 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
                  />

                  <input
                    v-else
                    type="text"
                    :id="item.id"
                    v-model="form[item.id]"
                    class="block w-full rounded-md bg-white dark:bg-gray-200 px-3 py-1.5 text-base text-gray-900 dark:text-gray-700 shadow-sm outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-gray-500 sm:text-sm/6"
                  />
                  <div v-if="formErrors[item.id]" class="text-red-500 text-sm mt-1 space-y-1">
                    <div v-for="(error, idx) in formErrors[item.id]" :key="idx">{{ error }}</div>
                  </div>
                </div>
              </div>

              <div class="flex justify-end">
                <button
                  type="submit"
                  :disabled="loading"
                  class="bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-center transition-all duration-300 disabled:opacity-50"
                >
                  <svg
                    v-if="loading"
                    class="animate-spin h-5 w-5 mr-2 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                  </svg>
                  <span>{{ loading ? 'Menyimpan...' : 'Simpan' }}</span>
                </button>
              </div>
            </form>
          </div>
        </transition>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import categoryService from '@/services/categoryService'
import locationService from '@/services/locationService'
import statusService from '@/services/statusService'
import assetService from '@/services/assetService'
const toast = useToast()

const categorys = ref([])
const locations = ref([])
const statuses = ref([])

const form = ref({
  serialnumber: '',
  asset_name: '',
  model: '',
  brand: '',
  type: '',
  description: '',
  spesifications: '',
  id_location: '',
  id_category: '',
  id_status: '',
  image: '',
})

const formItems = ref([
  { name: 'Serial Number', id: 'serialnumber', type: 'text' },
  { name: 'Nama Asset', id: 'asset_name', type: 'text' },
  { name: 'Model', id: 'model', type: 'text' },
  { name: 'Brand', id: 'brand', type: 'text' },
  { name: 'Lokasi', id: 'id_location', type: 'select', options: locations },
  { name: 'Kategori', id: 'id_category', type: 'select', options: categorys },
  { name: 'Status', id: 'id_status', type: 'select', options: statuses },
  { name: 'Deskripsi', id: 'description', type: 'textarea' },
  { name: 'Spesifikasi', id: 'specifications', type: 'textarea' },
  { name: 'Image', id: 'image', type: 'file' },
])

const loading = ref(false)
const visible = ref(false)
const formErrors = ref({})
const emit = defineEmits(['submitted'])

const submitForm = async () => {
  loading.value = true
  formErrors.value = {}

  try {
    const res = await assetService.stores(form) // sesuaikan dengan pemanggilan API-mu
    visible.value = false
    Object.keys(form.value).forEach((key) => (form.value[key] = ''))
    emit('submitted') // <--- emit event ke parent
    toast.success(res.message)
  } catch (e) {
    if (e.response?.status === 422) {
      formErrors.value = e.response.data.errors
    } else {
      toast.error('Gagal menyimpan asset', e)
    }
  } finally {
    loading.value = false
  }
}
// console.error('Gagal menyimpan asset', e.response.data)
// console.error('Gagal menyimpan asset', e.request)
// console.error('Gagal menyimpan asset', e.message)
const fetchReferenceData = async () => {
  try {
    const [categoryRes, locationRes, statusRes] = await Promise.all([
      categoryService.getAll(),
      locationService.getAll(),
      statusService.getAll(),
    ])
    categorys.value = categoryRes.data.map((item) => ({ label: item.category, value: item.id }))
    locations.value = locationRes.data.map((item) => ({ label: item.unit, value: item.id }))
    statuses.value = statusRes.data
      .filter((item) => item.statustype === 'ASST')
      .map((item) => ({ label: item.status, value: item.id }))
  } catch (e) {
    toast.error('Gagal memuat data referensi', e)
  }
}

onMounted(() => {
  fetchReferenceData()
})

const handleFileUpload = (e) => {
  const file = e.target.files[0]
  if (file) {
    form.value.image = file
  }
}
const open = () => {
  visible.value = true
}

const close = () => {
  visible.value = false
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
</style>
