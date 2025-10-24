<template>
  <div class="container py-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h2 class="mb-0">
          <i class="bi bi-box-seam text-primary me-2"></i>
          Daftar Inventori
        </h2>
        <small class="text-muted">Management barang dan equipment sound system</small>
      </div>
      <button 
        @click="$router.push('/inventori/create')" 
        class="btn btn-primary"
      >
        <i class="bi bi-plus-circle me-2"></i>Tambah Inventori
      </button>
    </div>

    <!-- Filter & Search -->
    <div class="card mb-4">
      <div class="card-body">
        <div class="row g-3 align-items-center">
          <div class="col-md-5">
            <input 
              type="text" 
              class="form-control" 
              v-model="searchQuery"
              placeholder="🔍 Cari nama barang, merek, atau no. inventaris..."
            />
          </div>
          <div class="col-md-2">
            <button @click="loadInventori" class="btn btn-outline-primary w-100">
              <i class="bi bi-arrow-clockwise me-1"></i>Refresh
            </button>
          </div>
          <div class="col-md-5 d-flex justify-content-end align-items-center">
            <label for="itemsPerPage" class="form-label me-2 mb-0 text-nowrap">Item per halaman:</label>
            <select id="itemsPerPage" class="form-select form-select-sm" v-model.number="itemsPerPage" style="width: 70px;">
              <option>10</option>
              <option>25</option>
              <option>50</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary mb-3"></div>
      <p class="text-muted">Memuat data inventori...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="paginatedBarang.length === 0" class="text-center py-5">
      <i class="bi bi-inbox display-1 text-muted"></i>
      <p class="text-muted mt-3">
        {{ searchQuery ? 'Inventori tidak ditemukan.' : 'Belum ada data inventori.' }}
      </p>
      <button v-if="!searchQuery" @click="$router.push('/inventori/create')" class="btn btn-primary">
        <i class="bi bi-plus-circle me-2"></i>Tambah Inventori Pertama
      </button>
    </div>

    <!-- Table -->
    <div v-else class="card shadow-sm">
      <div class="card-body p-0">
        <div class="table-responsive">
          <table class="table table-hover align-middle mb-0">
            <thead class="table-dark">
              <tr>
                <th class="px-3">No</th>
                <th>No Inventaris</th>
                <th>Nama Barang</th>
                <th>Merek</th>
                <th>Fungsi Equipment</th>
                <th>Harga Sewa</th>
                <th class="text-center">Foto</th>
                <th class="text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(b, i) in paginatedBarang" :key="b.id">
                <td class="px-3">{{ (currentPage - 1) * itemsPerPage + i + 1 }}</td>
                <td>{{ b.noInventaris }}</td>
                <td><strong>{{ b.namaBarang }}</strong></td>
                <td>{{ b.merek }}</td>
                <td>{{ b.fungsi_equipment }}</td>
                <td class="text-end px-3">
                  <strong>{{ b.hargaSewa ? 'Rp ' + Number(b.hargaSewa).toLocaleString('id-ID') : '-' }}</strong>
                </td>
                <td class="text-center">
                  <img
                    v-if="b.foto"
                    :src="getFotoUrl(b.foto)"
                    alt="Foto Barang"
                    height="40"
                    width="40"
                    class="rounded shadow-sm"
                    @click="previewFoto(b.foto)"
                    style="cursor: zoom-in; object-fit: cover;"
                  />
                  <span v-else class="text-muted">Tidak ada</span>
                </td>
                <td class="text-center">
                  <div class="btn-group btn-group-sm">
                    <button 
                      @click="$router.push(`/inventori/${b.id}/edit`)"
                      class="btn btn-outline-primary"
                      title="Edit"
                    >
                      <i class="bi bi-pencil"></i>
                    </button>
                    <button 
                      @click="hapusInventori(b.id)"
                      class="btn btn-outline-danger"
                      title="Hapus"
                    >
                      <i class="bi bi-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    
    <!-- Pagination -->
    <nav v-if="!loading && totalPages > 1" aria-label="Page navigation" class="mt-3 d-flex justify-content-center">
      <ul class="pagination flex-wrap">
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
          <a v-if="page !== '...'" class="page-link" href="#" @click.prevent="changePage(page)">
            {{ page }}
          </a>
          <span v-else class="page-link">...</span>
        </li>
        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
          <a class="page-link" href="#" @click.prevent="changePage(currentPage + 1)" title="Halaman Selanjutnya">
            &raquo;
          </a>
        </li>
      </ul>
    </nav>

    <!-- Summary Cards -->
    <div class="row mt-4">
      <div class="col-md-4">
        <div class="card bg-primary text-white">
          <div class="card-body">
            <h6>Total Item</h6>
            <h3>{{ totalItems }}</h3>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal preview foto -->
    <div
      v-if="previewImage"
      class="modal-backdrop"
      @click="previewImage = null"
    >
      <img
        :src="getFotoUrl(previewImage)"
        alt="Preview"
        class="modal-image"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getAllInventori, deleteInventori } from '../api/InventoriService'

const router = useRouter()

const allBarang = ref([])
const loading = ref(false)
const previewImage = ref(null)
const currentPage = ref(1)
const itemsPerPage = ref(10)
const searchQuery = ref('')

const filteredBarang = computed(() => {
  if (!searchQuery.value) {
    return allBarang.value
  }
  const q = searchQuery.value.toLowerCase()
  return allBarang.value.filter(b => 
    (b.namaBarang && b.namaBarang.toLowerCase().includes(q)) ||
    (b.merek && b.merek.toLowerCase().includes(q)) ||
    (b.noInventaris && b.noInventaris.toLowerCase().includes(q))
  )
})

const totalItems = computed(() => filteredBarang.value.length)
const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage.value))

const paginatedBarang = computed(() => {
  if (currentPage.value > totalPages.value && totalPages.value > 0) {
    currentPage.value = 1
  }
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredBarang.value.slice(start, end)
})

const visiblePages = computed(() => {
  const total = totalPages.value
  const current = currentPage.value
  const maxVisible = 5

  if (total <= maxVisible) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }

  let start = Math.max(1, current - Math.floor(maxVisible / 2))
  let end = Math.min(total, start + maxVisible - 1)

  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1)
  }

  const pages = Array.from({ length: (end - start + 1) }, (_, i) => start + i)

  if (start > 1) {
    pages.unshift('...')
    pages.unshift(1)
  }
  if (end < total) {
    pages.push('...')
    pages.push(total)
  }
  return pages
})

const loadInventori = async () => {
  loading.value = true
  try {
    const res = await getAllInventori()
    allBarang.value = res.data
  } catch (err) {
    console.error('❌ Gagal memuat data inventori:', err)
    alert('Gagal mengambil data inventori. Coba login ulang atau cek koneksi.')
  } finally {
    loading.value = false
  }
}

onMounted(loadInventori)

const getFotoUrl = (foto) => `data:image/jpeg;base64,${foto}`
const previewFoto = (foto) => { previewImage.value = foto }

const changePage = (page) => {
  if (page !== '...' && page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

const hapusInventori = async (id) => {
  if (!confirm('⚠️ Yakin ingin menghapus inventori ini?')) return

  try {
    await deleteInventori(id)
    alert('✅ Inventori berhasil dihapus')
    allBarang.value = allBarang.value.filter(item => item.id !== id)
  } catch (err) {
    console.error('Error delete inventori:', err)
    alert('❌ Gagal menghapus inventori. ' + (err.response?.data?.message || err.message))
  }
}
</script>

<style scoped>
.table thead th {
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.85rem;
  letter-spacing: 0.5px;
}
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1050;
  cursor: zoom-out;
}
.modal-image {
  max-width: 90%;
  max-height: 90%;
  border-radius: 10px;
}
.btn-group-sm > .btn {
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
}
</style>
