<template>
  <div class="bg-white dark:bg-gray-600 p-6 rounded-lg shadow-md mb-4">
    <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">Dashboard</h2>
    <p class="text-gray-600 dark:text-gray-400">Welcome to our Dashboard Maintenance System</p>
  </div>

  <div class="grid grid-cols-4 gap-4">
    <div
      class="flex items-center p-4 bg-white dark:bg-gray-900 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 transition hover:shadow-xl">
      <!-- Ikon bulat -->
      <div class="w-12 h-12 flex items-center justify-center bg-teal-500 text-white rounded-md mr-4">
        <userIcon class="h-6 w-6 text-white" />
      </div>

      <!-- Informasi -->
      <div class="flex-1">
        <div class="text-sm text-gray-900 dark:text-gray-300">Total Users</div>
        <div class="text-2xl font-bold text-gray-900 dark:text-zinc-200 flex items-center gap-2">
          <ArrowPathIcon v-if="loading" class="animate-spin h-6 w-7 "></ArrowPathIcon>
          <span v-else>{{ users ? users.length : 0 }} </span><span class="text-teal-500"> User</span>

        </div>
        <div class="text-sm mt-1 text-gray-900 dark:text-zinc-200 flex items-center gap-2">
          <span v-if="loading">
            <ArrowPathIcon class="animate-spin h-5 w-5"></ArrowPathIcon>
          </span>
          <span v-else class="text-green-600 dark:text-green-400 font-semibold">{{ users ? users.length : 0 }}</span>
          <span class="text-gray-500 dark:text-gray-400"> Active User</span>
        </div>
      </div>
    </div>
    <div
      class="flex items-center p-4 bg-white dark:bg-gray-900 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 transition hover:shadow-xl">
      <!-- Ikon bulat -->
      <div class="w-12 h-12 flex items-center justify-center bg-teal-500 text-white rounded-md mr-4">
        <CubeTransparentIcon class="h-6 w-6 text-white" />
      </div>

      <!-- Informasi -->
      <div class="flex-1">
        <div class="text-sm text-gray-900 dark:text-gray-300">Total Asset</div>
        <div class="text-2xl font-bold text-gray-900 dark:text-zinc-200 flex items-center gap-2">
          <span v-if="!asset">
            <ArrowPathIcon class="animate-spin h-6 w-7"></ArrowPathIcon>
          </span>
          <span v-else>{{ asset ? asset.length : 0 }}</span>
          <span class="text-teal-500">Asset</span>
        </div>
        <div class="text-sm mt-1 text-gray-900 dark:text-zinc-200 flex items-center gap-2">
          <span v-if="!asset">
            <ArrowPathIcon class="animate-spin h-5 w-5 flex items-center gap-2" />
          </span>
          <span v-else class="text-red-600 dark:text-red-400 font-semibold">{{ asset ? asset.filter((asset) =>
            asset.status !==
            'Baik').length : 0 }}
          </span>
          <span class="text-gray-500 dark:text-gray-400"> Problem Asset</span>
        </div>
      </div>
    </div>
    <div
      class="flex items-center p-4 bg-white dark:bg-gray-900 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 transition hover:shadow-xl">
      <!-- Ikon bulat -->
      <div class="w-12 h-12 flex items-center justify-center bg-teal-500 text-white rounded-md mr-4">
        <Cog6ToothIcon class="h-6 w-6 text-white" />
      </div>

      <!-- Informasi -->
      <div class="flex-1">
        <div class="text-sm text-gray-900 dark:text-gray-300">Total Maintenance</div>
        <div class="text-2xl font-bold text-gray-900 dark:text-zinc-200 flex items-center gap-2">
          <span v-if="!maintenances">
            <ArrowPathIcon class="animate-spin h-6 w-7 "/>
          </span>
          <span v-else>{{ maintenances ? maintenances.length : 0 }}</span>
          <span class="text-teal-500">Maintenance</span>
        </div>
        <div class="text-sm mt-1 flex items-center gap-2 text-gray-900 dark:text-zinc-200">
          <span v-if="!maintenances">
            <ArrowPathIcon class="animate-spin h-5 w-5" />
          </span>
          <span v-else class="text-green-600 dark:text-green-400 font-semibold">{{ maintenances ?
            maintenances.filter((maintenances) => maintenances.status == 'Selesai').length : 0 }}
          </span>
          <span class="text-gray-500 dark:text-gray-400"> Maintenance Done</span>
        </div>
      </div>
    </div>
    <div
      class="flex items-center p-4 bg-white dark:bg-gray-900 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 transition hover:shadow-xl">
      <!-- Ikon bulat -->
      <div class="w-12 h-12 flex items-center justify-center bg-teal-500 text-white rounded-md mr-4">
        <ClipboardDocumentIcon class="h-6 w-6 text-white" />
      </div>

      <!-- Informasi -->
      <div class="flex-1">
        <div class="text-sm text-gray-900 dark:text-gray-300">Total Inspeksi</div>
        <div class="text-2xl font-bold text-gray-900 dark:text-zinc-200 flex items-center gap-2">
          <span v-if="!inspeksis">
            <ArrowPathIcon class="animate-spin h-6 w-7 "/>
          </span>
          <span v-else>{{ inspeksis ? inspeksis.length : 0 }}</span>
          <span class="text-teal-500">Inspeksi</span>
        </div>
        <div class="text-sm mt-1 flex items-center gap-2 text-gray-900 dark:text-zinc-200">
          <span v-if="!inspeksis">
            <ArrowPathIcon class="animate-spin h-5 w-5" />
          </span>
          <span v-else class="text-green-600 dark:text-green-400 font-semibold">
            {{
            inspeksis
            ? inspeksis.filter((i) => {
            const createdAt = new Date(i.created_at)
            const now = new Date()
            return createdAt.getMonth() === now.getMonth() && createdAt.getFullYear() === now.getFullYear()
            }).length
            : 0
            }}
          </span>
          <span class="text-gray-500 dark:text-gray-400"> Inspeksi in Month</span>
        </div>
      </div>
    </div>
  </div>

</template>

<script setup>
import { ref, onMounted } from 'vue'
import userService from '@/services/userService'
import { useToast } from 'vue-toastification'
import { UserIcon, CubeTransparentIcon, ClipboardDocumentIcon, Cog6ToothIcon, ArrowPathIcon } from '@heroicons/vue/24/outline'
import assetService from '@/services/assetService'
import maintenanceService from '@/services/maintenanceService'
import inspeksiService from '@/services/inspeksiService'

const loading = ref(true)
const error = ref(null)
const users = ref(null)
const asset = ref(null)
const maintenances = ref(null)
const inspeksis = ref(null)
const toast = useToast()

const fetchUser = async () => {
  loading.value = true
  error.value = null

  try {
    const response = await userService.getAll()
    users.value = response.users
  } catch (err) {
    error.value = 'Gagal memuat data users'
    toast.error('Gagal memuat data', err)
  } finally {
    loading.value = false
  }
}
const fetchAsset = async () => {
  loading.value = true
  error.value = null
  try {
    const response = await assetService.getAll()
    asset.value = response.data
  } catch (err) {
    error.value = 'Gagal memuat data asset'
    toast.error('Gagal memuat data', err)
  } finally {
    loading.value = false
  }
}
const fetchMaintenance = async () => {
  loading.value = true
  error.value = null
  try {
    const response = await maintenanceService.getAll()
    maintenances.value = response.data
  } catch (err) {
    error.value = 'Gagal memuat data maintenance'
    toast.error('Gagal memuat data', err)
  } finally {
    loading.value = false
  }
}
const fetchInspeksi = async () => {
  loading.value = true
  error.value = null
  try {
    const response = await inspeksiService.getAll()
    inspeksis.value = response.data
  } catch (err) {
    error.value = 'Gagal memuat data inspeksi'
    toast.error('Gagal memuat data', err)
  } finally {
    loading.value = false
  }
}
onMounted(() => {
  fetchUser(), fetchAsset(), fetchMaintenance(), fetchInspeksi()
})
</script>
