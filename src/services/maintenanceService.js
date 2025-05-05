import api from '@/services/api'
const endpoint = 'maintenance'
const stusendpoint = 'status'
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
      console.error('Gagal mendapatkan Maintenance:', error)
      throw error
    }
  },
  // getSelfMaintenance(page = 1) {
  //   return api.get(`/maintenance/self?page=${page}`)
  // },
  // getMaintenanceById(id) {
  //   return api.get(`/maintenance/${id}`)
  // },
  // createMaintenance(data) {
  //   return api.post('/maintenance', data)
  // },
  // updateMaintenance(id, data) {
  //   return api.put(`/maintenance/${id}`, data)
  // },
  // applyMaintenance(id) {
  //   return api.post(`/maintenance/${id}/apply`)
  // },
  // cancelMaintenance(id) {
  //   return api.post(`/maintenance/${id}/cancel`)
  // },
  // deleteMaintenance(id) {
  //   return api.delete(`/maintenance/${id}`)
  // },
  statusasset: async () => {
    const res = await api.get(stusendpoint, { params: { statustype: 'MTNC' } })
    return res.data
  },
}
