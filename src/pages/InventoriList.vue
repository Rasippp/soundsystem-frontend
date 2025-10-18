<template>
  <div class="container py-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="mb-0">📦 Daftar Inventori</h2>
    </div>

    <div class="card shadow-sm">
      <div class="card-body p-0">
        <div class="table-responsive">
          <table class="table table-striped table-hover align-middle mb-0">
            <thead class="table-dark text-center">
              <tr>
                <th class="px-3">No</th>
                <th>No Inventaris</th>
                <th>Nama Barang</th>
                <th>Merek</th>
                <th>Ukuran</th>
                <th>Kelengkapan</th>
                <th>Fungsi Equipment</th>
                <th>Stok</th>
                <th>Harga Sewa</th>
                <th>Foto</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="(b, i) in barang" :key="b.id">
                <td class="text-center">{{ i + 1 }}</td>
                <td>{{ b.noInventaris }}</td>
                <td>{{ b.namaBarang }}</td>
                <td>{{ b.merek }}</td>
                <td>{{ b.ukuran }}</td>
                <td>{{ b.kelengkapan }}</td>
                <td>{{ b.fungsi_equipment }}</td>
                <td class="text-center">{{ b.stok ?? '-' }}</td>
                <td class="text-end px-3">
                  {{ b.hargaSewa ? 'Rp ' + Number(b.hargaSewa).toLocaleString() : '-' }}
                </td>
                <td class="text-center">
                  <img
                    v-if="b.foto"
                    :src="getFotoUrl(b.foto)"
                    alt="Foto Barang"
                    width="70"
                    class="rounded shadow-sm"
                    @click="previewFoto(b.foto)"
                    style="cursor: zoom-in"
                  />
                  <span v-else class="text-muted">Tidak ada</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modal preview foto -->
    <div
      v-if="previewImage"
      class="modal-backdrop"
      @click="previewImage = null"
      style="
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1050;
      "
    >
      <img
        :src="getFotoUrl(previewImage)"
        alt="Preview"
        style="max-width: 90%; max-height: 90%; border-radius: 10px;"
      />
    </div>
  </div>
</template>

<script>
import { getAllInventori } from '../api/InventoriService'

export default {
  name: 'InventoriList',
  data() {
    return {
      barang: [],
      previewImage: null,
    }
  },
  async mounted() {
    try {
      const res = await getAllInventori()
      this.barang = res.data
    } catch (err) {
      console.error('❌ Gagal memuat data inventori:', err)
      alert('Gagal mengambil data inventori. Coba login ulang atau cek token JWT.')
    }
  },
  methods: {
    getFotoUrl(foto) {
      return `http://localhost:8080/uploads/${foto}`
    },
    previewFoto(foto) {
      this.previewImage = foto
    },
  },
}
</script>

<style scoped>
.table thead th {
  white-space: nowrap;
}
.modal-backdrop {
  cursor: zoom-out;
}
</style>
