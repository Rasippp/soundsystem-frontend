import api from './auth'

export const getAllInventori = () => api.get('/inventori')
export const getInventoriById = (id) => api.get(`/inventori/${id}`)
export const addInventori = (data) => api.post('/inventori', data)
export const updateInventori = (id, data) => api.put(`/inventori/${id}`, data)
export const deleteInventori = (id) => api.delete(`/inventori/${id}`)
