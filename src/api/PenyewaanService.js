import api from './auth'

export const getAllPenyewaan = () => api.get('/penyewaan')
export const getPenyewaanById = (id) => api.get(`/penyewaan/${id}`)
export const addPenyewaan = (data) => api.post('/penyewaan', data)
export const deletePenyewaan = (id) => api.delete(`/penyewaan/${id}`)
