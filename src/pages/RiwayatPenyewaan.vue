<template>
  <div class="container py-4">
    <div class="row justify-content-center">
      <div class="col-md-8">
        <div class="card">
          <div class="card-header bg-primary text-white">
            <h2 class="h4 mb-0">Form Penyewaan</h2>
          </div>
          <div class="card-body">
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
                <select class="form-select" v-model="form.id_inventori" required>
                  <option value="">Pilih Barang</option>
                  <option v-for="b in barang" :key="b.id_inventori" :value="b.id_inventori">
                    {{ b.nama }}
                  </option>
                </select>
              </div>

              <div class="mb-4">
                <label class="form-label">Tanggal Sewa:</label>
                <input type="date" class="form-control" v-model="form.tanggalSewa" required />
              </div>

              <div class="d-grid">
                <button type="submit" class="btn btn-primary">
                  <i class="bi bi-check-circle me-2"></i>Sewa Sekarang
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
import axios from 'axios';
export default {
  data() {
    return {
      pelanggan: [],
      barang: [],
      form: { id_pelanggan: '', id_inventori: '', tanggalSewa: '' }
    };
  },
  async mounted() {
    this.pelanggan = (await axios.get('http://localhost:8080/api/pelanggan')).data;
    this.barang = (await axios.get('http://localhost:8080/api/inventori')).data;
  },
  methods: {
    async sewa() {
      await axios.post('http://localhost:8080/api/penyewaan', this.form);
      alert('Penyewaan berhasil!');
      this.form = { id_pelanggan: '', id_inventori: '', tanggalSewa: '' };
    }
  }
};
</script>
