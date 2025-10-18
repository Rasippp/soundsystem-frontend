import axios from 'axios';
const BASE_URL = 'http://localhost:8080/api/pelanggan';

export const getAllPelanggan = () => axios.get(BASE_URL);
export const getPelangganById = (id) => axios.get(`${BASE_URL}/${id}`);
export const addPelanggan = (data) => axios.post(BASE_URL, data);
export const updatePelanggan = (id, data) => axios.put(`${BASE_URL}/${id}`, data);
export const deletePelanggan = (id) => axios.delete(`${BASE_URL}/${id}`);
