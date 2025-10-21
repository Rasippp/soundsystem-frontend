<template>
  <div class="container py-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h2 class="mb-0">📦 Daftar Inventori</h2>
        <small class="text-muted">Total {{ totalItems }} barang</small>
      </div>
      <div class="d-flex align-items-center">
        <label for="itemsPerPage" class="form-label me-2 mb-0 text-nowrap">Item per halaman:</label>
        <select id="itemsPerPage" class="form-select form-select-sm" v-model.number="itemsPerPage" style="width: 70px;">
          <option>10</option>
          <option>25</option>
          <option>50</option>
        </select>
      </div>
    </div>

    <div class="card shadow-sm">
      <div class="card-body p-0">
        <!-- Loading State -->
        <div v-if="loading" class="text-center py-5">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <p class="mt-2 text-muted">Memuat data...</p>
        </div>

        <!-- Table -->
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
              <tr v-for="(b, i) in paginatedBarang" :key="b.id">
                <td class="text-center">{{ (currentPage - 1) * itemsPerPage + i + 1 }}</td>
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

    
    <!-- Pagination -->
    <nav v-if="!loading && totalPages > 1" aria-label="Page navigation" class="mt-4 d-flex justify-content-center">
      <ul class="pagination flex-wrap">
        <li class="page-item" :class="{ disabled: currentPage === 1 }">
          <a class="page-link" href="#" @click.prevent="changePage(1)" title="Halaman Pertama">
            &laquo;<span class="d-none d-sm-inline"> Pertama</span>
          </a>
        </li>
        <li class="page-item" :class="{ disabled: currentPage === 1 }">
          <a class="page-link" href="#" @click.prevent="changePage(currentPage - 1)" title="Halaman Sebelumnya">
            &laquo;
          </a>
        </li>

        <li
          v-for="page in visiblePages"
          :key="page"
          class="page-item"
          :class="{ active: currentPage === page, disabled: page === '...' }"
        >
          <a class="page-link" href="#" @click.prevent="changePage(page)">
            {{ page }}
          </a>
        </li>

        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
          <a class="page-link" href="#" @click.prevent="changePage(currentPage + 1)" title="Halaman Selanjutnya">
            &raquo;
          </a>
        </li>
        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
          <a class="page-link" href="#" @click.prevent="changePage(totalPages)" title="Halaman Terakhir">
            <span class="d-none d-sm-inline">Terakhir </span>&raquo;
          </a>
        </li>
      </ul>

    </nav>

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
      loading: false,
      previewImage: null,
      currentPage: 1,
      itemsPerPage: 10,
      backendUrl: __BACKEND_URL__.replace('/api', '')
    }
  },
  computed: {
    totalItems() {
      return this.barang.length
    },
    totalPages() {
      return Math.ceil(this.totalItems / this.itemsPerPage)
    },
    paginatedBarang() {
      // Reset to page 1 if current page is out of bounds after filtering or changing itemsPerPage
      if (this.currentPage > this.totalPages && this.totalPages > 0) {
        this.currentPage = 1;
      }
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.barang.slice(start, end);
    },
    visiblePages() {
      const total = this.totalPages;
      const current = this.currentPage;
      const maxVisibleButtons = 5; // Jumlah maksimal tombol halaman yg terlihat (selain prev/next)

      if (total <= maxVisibleButtons) {
        return Array.from({ length: total }, (_, i) => i + 1);
      }

      const pages = [];
      const half = Math.floor((maxVisibleButtons - 2) / 2);

      // Selalu tampilkan halaman pertama
      pages.push(1);

      // Tampilkan '...' jika halaman saat ini jauh dari awal
      if (current > half + 2) {
        pages.push('...');
      }

      // Tentukan rentang halaman tengah
      let start = Math.max(2, current - half);
      let end = Math.min(total - 1, current + half);

      if (current <= half + 1) {
        end = maxVisibleButtons - 1;
      } else if (current >= total - half) {
        start = total - maxVisibleButtons + 2;
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      // Tampilkan '...' jika halaman saat ini jauh dari akhir
      if (current < total - half - 1) {
        pages.push('...');
      }

      // Selalu tampilkan halaman terakhir
      pages.push(total);

      return pages;
    }
  },
  async mounted() {
    this.loading = true
    try {
      const res = await getAllInventori()
      this.barang = res.data
    } catch (err) {
      console.error('❌ Gagal memuat data inventori:', err)
      alert('Gagal mengambil data inventori. Coba login ulang atau cek token JWT.')
    } finally {
      this.loading = false
    }
    },
  methods: {
    getFotoUrl(foto) {
      // Perubahan: Backend mengirimkan string Base64, bukan nama file.
      // Kita perlu membuat "Data URI" untuk menampilkannya.
      // Formatnya: data:[<tipe_media>];base64,<data_base64>
      // Kita asumsikan formatnya jpeg, yang umum untuk foto.
      return `data:image/jpeg;base64,${foto}`
    },
    previewFoto(foto) {
      this.previewImage = foto
    },
    changePage(page) {
      if (page !== '...' && page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
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
