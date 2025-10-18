<template>
  <div class="container py-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="mb-0">Daftar Pelanggan</h2>
      <button @click="loadData" class="btn btn-primary">
        <i class="bi bi-arrow-clockwise"></i> Refresh
      </button>
    </div>

    <div class="card">
      <div class="card-body p-0">
        <div class="table-responsive">
          <table class="table table-striped table-hover mb-0">
            <thead class="table-dark">
              <tr>
                <th class="px-3">ID</th>
                <th>Nama</th>
                <th>No Telp</th>
                <th>Email</th>
                <th>Alamat</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="p in pelanggan" :key="p.id_pelanggan">
                <td class="px-3">{{ p.id_pelanggan }}</td>
                <td>{{ p.nama }}</td>
                <td>{{ p.no_telp }}</td>
                <td>{{ p.email }}</td>
                <td>{{ p.alamat }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
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
