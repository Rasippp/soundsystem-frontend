import axios from 'axios'
const BASE_URL = 'http://localhost:8080/api/penyewaan'

export const getAllPenyewaan = () => axios.get(BASE_URL)
export const getPenyewaanById = (id) => axios.get(`${BASE_URL}/${id}`)
export const addPenyewaan = (data) => axios.post(BASE_URL, data)
export const deletePenyewaan = (id) => axios.delete(`${BASE_URL}/${id}`)
