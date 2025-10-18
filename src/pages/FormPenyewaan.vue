<template>
  <div class="container py-4">
    <div class="row justify-content-center">
      <div class="col-md-8">
        <div class="card shadow">
          <div class="card-header bg-primary text-white">
            <h2 class="h4 mb-0">Form Penyewaan Baru</h2>
          </div>
          
          <!-- Loading State -->
          <div v-if="isLoading" class="card-body text-center py-5">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
            <p class="mt-2 text-muted">Memuat data...</p>
          </div>

          <!-- Error State -->
          <div v-else-if="error" class="card-body p-4">
            <div class="alert alert-danger">
              <i class="bi bi-exclamation-triangle me-2"></i>
              {{ error }}
            </div>
            <button @click="mounted" class="btn btn-outline-primary">
              <i class="bi bi-arrow-clockwise me-2"></i>Coba Lagi
            </button>
          </div>

          <!-- Form Content -->
          <div v-else class="card-body p-4">
            <form @submit.prevent="sewa">
              <div class="mb-3">
                <label class="form-label">Pelanggan:</label>
                <select class="form-select" v-model="form.id_pelanggan" required>
                  <option value="">Pilih Pelanggan</option>
                  <option v-for="p in pelanggan" :key="p.id_pelanggan" :value="p.id_pelanggan">
                    {{ p.nama }}
                  </option>
                </select>
              </div>

              <div class="mb-3">
                <label class="form-label">Barang:</label>
                <select 
                  class="form-select border" 
                  v-model="form.nama_barang" 
                  required>
                  <option value="">Pilih Barang</option>
                  <option 
                    v-for="b in barang" 
                    :key="b.id_barang" 
                    :value="b.nama_barang">
                    {{ b.nama_barang }}
                  </option>
                </select>
              </div>

              <div class="mb-4">
                <label class="form-label">Tanggal Sewa:</label>
                <input type="date" class="form-control" v-model="form.tanggal_sewa" required />
              </div>

              <div class="d-grid">
                <button type="submit" class="btn btn-primary btn-lg" :disabled="isLoading">
                  <span v-if="isLoading" class="spinner-border spinner-border-sm me-2" role="status"></span>
                  <i v-else class="bi bi-check-circle me-2"></i>
                  {{ isLoading ? 'Memproses...' : 'Proses Penyewaan' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../api/auth'
import { getAllInventori } from '../api/InventoriService'
import { getAllPelanggan } from '../api/PelangganService'
export default {
  data() {
    return {
      pelanggan: [],
      barang: [],
      form: { 
        id_pelanggan: '', 
        nama_barang: '', // Field yang benar sesuai backend
        tanggal_sewa: new Date().toISOString().split('T')[0] // Set default ke hari ini
      },
      isLoading: false,
      error: null
    };
  },

  async mounted() {
    this.isLoading = true;
    try {
      // Load data pelanggan dan inventori secara parallel
      const [pelangganRes, inventoriRes] = await Promise.all([
        getAllPelanggan(),
        getAllInventori()
      ]);

      // Log response mentah untuk cek struktur data
      console.log('Raw Inventori Response:', inventoriRes);
      
      this.pelanggan = pelangganRes.data;
      this.barang = inventoriRes.data;
      
      // Log data barang setelah disimpan ke state
      console.log('Data Barang:', this.barang);

      console.log('Data loaded:', {
        pelanggan: this.pelanggan,
        inventori: this.barang
      });

    } catch (error) {
      this.error = error.response?.data?.message || error.message;
      console.error('Error loading data:', error);
    } finally {
      this.isLoading = false;
    }
  },

  methods: {
    async sewa() {
      if (!this.form.id_pelanggan || !this.form.nama_barang || !this.form.tanggal_sewa) {
        alert('Mohon lengkapi semua data');
        return;
      }

      this.isLoading = true;
      try {
        const response = await api.post('/penyewaan', this.form);
        console.log('Penyewaan berhasil:', response.data);
        
        alert('Penyewaan berhasil!');
        this.form = { 
          id_pelanggan: '', 
          nama_barang: '', 
          tanggal_sewa: new Date().toISOString().split('T')[0]
        };
      } catch (error) {
        console.error('Error penyewaan:', error);
        alert('Gagal melakukan penyewaan: ' + (error.response?.data?.message || error.message));
      } finally {
        this.isLoading = false;
      }
    }
  }
};
</script>

<style scoped>
/* Hanya menambahkan style yang tidak ada di Bootstrap */
.form-select, .form-control {
  background-color: var(--bs-body-bg);
}
</style>
