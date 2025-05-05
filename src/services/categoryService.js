import api from '@/services/api'
const endpoint = 'category'
const categoryService = {
  getAll: async () => {
    const res = await api.get(endpoint)
    return res.data
  },

  // get(id) {
  //   return axios.get(`${endpoint}/${id}`)
  // },

  // create(data) {
  //   return axios.post(endpoint, data)
  // },

  // update(id, data) {
  //   return axios.put(`${endpoint}/${id}`, data)
  // },

  // destroy(id) {
  //   return axios.delete(`${endpoint}/${id}`)
  // },

  // restore(id) {
  //   return axios.post(`${endpoint}/restore/${id}`)
  // },

  // getDeleted() {
  //   return axios.get(`${endpoint}/deleted`)
  // },

  search: async (page = 1, limit = 20) => {
    const res = await api.get(endpoint, { params: { page, limit } })
    return res.data
  },
}

export default categoryService
