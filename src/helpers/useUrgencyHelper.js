import { ref, onMounted } from 'vue'
import urgencyService from '@/services/urgencyService'

// Reactive list yang akan diisi dari server
const urgencyList = ref([])

const fetchUrgencyList = async () => {
  try {
    const res = await urgencyService.getAll()
    urgencyList.value = res.data // ← Perubahan di sini
  } catch (error) {
    console.error('Gagal mengambil urgency:', error)
  }
}

// Ambil nama urgency berdasarkan ID
const getUrgencyNameById = (id) => {
  const urgency = urgencyList.value.find((s) => s.id === id)
  return urgency ? urgency.status_name : 'tidak diketahui'
}

// Ambil class warna urgency dari nama
const getUrgencyClass = (urgency) => {
  switch (urgency.toLowerCase()) {
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

// Ambil class urgency berdasarkan ID
const getUrgencyClassById = (id) => {
  const name = getUrgencyNameById(id)
  return getUrgencyClass(name)
}

export function useUrgencyHelper() {
  onMounted(fetchUrgencyList)
  return {
    urgencyList,
    fetchUrgencyList,
    getUrgencyNameById,
    getUrgencyClassById,
  }
}
