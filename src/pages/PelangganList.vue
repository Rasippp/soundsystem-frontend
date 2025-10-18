<template>
  <div>
    <h2>Daftar Pelanggan</h2>
    <button @click="loadData">Refresh</button>
    <table border="1">
      <thead>
        <tr>
          <th>ID</th><th>Nama</th><th>No Telp</th><th>Email</th><th>Alamat</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="p in pelanggan" :key="p.id_pelanggan">
          <td>{{ p.id_pelanggan }}</td>
          <td>{{ p.nama }}</td>
          <td>{{ p.no_telp }}</td>
          <td>{{ p.email }}</td>
          <td>{{ p.alamat }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { getAllPelanggan } from '../api/pelangganService';

export default {
  name: 'PelangganList',
  data() {
    return { pelanggan: [] };
  },
  mounted() {
    this.loadData();
  },
  methods: {
    async loadData() {
      const res = await getAllPelanggan();
      this.pelanggan = res.data;
    }
  }
}
</script>
