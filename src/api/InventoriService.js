import api from './auth'

// Diubah untuk mendukung paginasi dan pencarian
export const getAllInventori = (page, size, search = '') => {
  return api.get('/inventori', {
    params: { page, size, search }
  })
}
export const getInventoriById = (id) => api.get(`/inventori/${id}`)
export const addInventori = (data) => api.post('/inventori', data)
export const updateInventori = (id, data) => api.put(`/inventori/${id}`, data)
export const deleteInventori = (id) => api.delete(`/inventori/${id}`)
