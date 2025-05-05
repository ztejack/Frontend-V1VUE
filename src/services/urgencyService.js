import api from '@/services/api'
const endpoint = 'urgencylevel'
const urgencyService = {
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
}

export default urgencyService
