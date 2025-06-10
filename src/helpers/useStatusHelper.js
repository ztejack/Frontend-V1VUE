import { ref, onMounted } from 'vue'
import statusService from '@/services/statusService'

// Reactive list yang akan diisi dari server
const statusList = ref([])

const fetchStatusList = async () => {
  try {
    const res = await statusService.getAll()
    statusList.value = res.data
  } catch (error) {
    console.error('Gagal mengambil status:', error)
  }
}

// Ambil nama status berdasarkan ID
const getStatusNameById = (id) => {
  const status = statusList.value.find((s) => s.id === id)
  return status ? status.status : 'tidak diketahui'
}

// Ambil class warna status dari nama
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

// Ambil class status berdasarkan ID
const getStatusClassById = (id) => {
  const name = getStatusNameById(id)
  return getStatusClass(name)
}

export function useStatusHelper() {
  onMounted(fetchStatusList)
  return {
    statusList,
    fetchStatusList,
    getStatusNameById,
    getStatusClassById,
  }
}
