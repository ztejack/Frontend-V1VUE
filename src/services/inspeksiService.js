import api from '@/services/api'
const endpoint = 'inspeksi'
// const stusendpoint = 'status'
export default {
  getAll: async (page = 1, limit = 20, extraParams = {}) => {
    const res = await api.get(endpoint, { params: { page, limit, ...extraParams } })
    return res.data
  },
  getclose: async (page = 1, limit = 20, id_status = 6) => {
    const res = await api.get(endpoint, { params: { page, limit, id_status } })
    return res.data
  },
  getproces: async (page = 1, limit = 20, id_status = 5) => {
    const res = await api.get(endpoint, { params: { page, limit, id_status } })
    return res.data
  },
  get: async (id) => {
    try {
      const response = await api.get(`${endpoint}/${id}`)
      return response.data
    } catch (error) {
      console.error('Gagal mendapatkan Inspeksi:', error)
      throw error
    }
  },
  stores: async (data) => {
    try {
      const formData = new FormData()
      for (const key in data.value) {
        formData.append(key, data.value[key])
      }

      const response = await api.post(endpoint, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      return response.data
    } catch (error) {
      console.error('Gagal menyimpan Inspeksi:', error)
      throw error
    }
  },
  delete: async (id) => {
    try {
      const response = await api.delete(`${endpoint}/${id}`)
      return response.data
    } catch (error) {
      console.error('Gagal menghapus Inspeksi:', error)
      throw error
    }
  },
  // status: async () => {
  //   const res = await api.get(stusendpoint, { params: { statustype: 'MTNC' } })
  //   return res.data
  // },
  // urgency: async () => {
  //   const res = await api.get(urgencyendpoint, { params: { statustype: 'MTNC' } })
  //   return res.data
  // },
}
