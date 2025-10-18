import axios from 'axios'
const BASE_URL = 'http://localhost:8080/api/inventori'

export const getAllInventori = () => axios.get(BASE_URL)
export const getInventoriById = (id) => axios.get(`${BASE_URL}/${id}`)
export const addInventori = (data) => axios.post(BASE_URL, data)
export const updateInventori = (id, data) => axios.put(`${BASE_URL}/${id}`, data)
export const deleteInventori = (id) => axios.delete(`${BASE_URL}/${id}`)
