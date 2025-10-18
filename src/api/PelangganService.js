import api from './auth'  // 👈 bukan dari axios lagi!

export const getAllPelanggan = () => api.get('/pelanggan')
export const getPelangganById = (id) => api.get(`/pelanggan/${id}`)
export const addPelanggan = (data) => api.post('/pelanggan', data)
export const updatePelanggan = (id, data) => api.put(`/pelanggan/${id}`, data)
export const deletePelanggan = (id) => api.delete(`/pelanggan/${id}`)
