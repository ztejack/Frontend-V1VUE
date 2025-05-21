// services/userService.js
import api from '@/services/api'
const endpoint = 'user'
const stusendpoint = 'status'

const userService = {
  getAll: async (page = 1, limit = 20) => {
    const res = await api.get(endpoint, { params: { page, limit } })
    console.log(res.data)
    return res.data
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
      console.error('Gagal menyimpan user:', error)
      throw error
    }
  },

  get: async (id) => {
    try {
      const response = await api.get(`${endpoint}/${id}`)
      return response.data
    } catch (error) {
      console.error('Gagal mendapatkan user:', error)
      throw error
    }
  },
  // create(data) {
  //   return axios.post(endpoint, data)
  // },

  // update: async (id, data) => {
  //   try {
  //     const response = await api.post(`${endpoint}/${id}`, data, {
  //       headers: {
  //         'Content-Type': 'multipart/form-data',
  //       },
  //     })
  //     return response.data
  //   } catch (error) {
  //     console.error('Gagal mengupdate asset:', error)
  //     throw error
  //   }
  // },

  // delete: async (id) => {
  //   try {
  //     const response = await api.delete(`${endpoint}/${id}`)
  //     return response.data
  //   } catch (error) {
  //     console.error('Gagal menghapus asset:', error)
  //     throw error
  //   }
  // },

  // restore(id) {
  //   return axios.post(`${endpoint}/restore/${id}`)
  // },

  // getDeleted() {
  //   return axios.get(`${endpoint}/deleted`)
  // },

  search: async (params = {}) => {
    const res = await api.get(endpoint + '/search', { params })
    return res.data
  },
  statusasset: async () => {
    const res = await api.get(stusendpoint, { params: { statustype: 'ASST' } })
    return res.data
  },
}

export default userService
