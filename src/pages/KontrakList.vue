<template>
  <div class="container py-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h2 class="mb-0">
          <i class="bi bi-file-earmark-text text-primary me-2"></i>
          Daftar Kontrak Job Order
        </h2>
        <small class="text-muted">Management kontrak penyewaan sound system</small>
      </div>
      <button 
        @click="$router.push('/kontrak/create')" 
        class="btn btn-primary"
      >
        <i class="bi bi-plus-circle me-2"></i>Buat Kontrak Baru
      </button>
    </div>

    <!-- Filter & Search -->
    <div class="card mb-4">
      <div class="card-body">
        <div class="row g-3">
          <div class="col-md-4">
            <input 
              type="text" 
              class="form-control" 
              v-model="searchQuery"
              placeholder="🔍 Cari venue, acara, atau pelanggan..."
            />
          </div>
          <div class="col-md-3">
            <select class="form-select" v-model="filterStatus">
              <option value="">Semua Status</option>
              <option value="aktif">Aktif</option>
              <option value="selesai">Selesai</option>
              <option value="batal">Batal</option>
            </select>
          </div>
          <div class="col-md-2">
            <button @click="loadData" class="btn btn-outline-primary w-100">
              <i class="bi bi-arrow-clockwise me-1"></i>Refresh
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary mb-3"></div>
      <p class="text-muted">Memuat data kontrak...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="filteredKontrak.length === 0" class="text-center py-5">
      <i class="bi bi-inbox display-1 text-muted"></i>
      <p class="text-muted mt-3">Belum ada kontrak</p>
      <button @click="$router.push('/kontrak/create')" class="btn btn-primary">
        <i class="bi bi-plus-circle me-2"></i>Buat Kontrak Pertama
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
                <th>Venue</th>
                <th>Acara</th>
                <th>Tanggal</th>
                <th>Harga Sewa</th>
                <th>DP</th>
                <th>Sisa</th>
                <th>Status</th>
                <th class="text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(k, i) in filteredKontrak" :key="k.id">
                <td class="px-3">{{ i + 1 }}</td>
                <td>
                  <strong>{{ k.venue }}</strong>
                </td>
                <td>{{ k.acara }}</td>
                <td class="text-nowrap">
                  <small>
                    <i class="bi bi-calendar-check text-success me-1"></i>
                    {{ formatDate(k.tanggalMulai) }}
                    <br>
                    <i class="bi bi-calendar-x text-danger me-1"></i>
                    {{ formatDate(k.tanggalSelesai) }}
                  </small>
                </td>
                <td class="text-end">
                  <strong>Rp {{ Number(k.hargaSewa).toLocaleString('id-ID') }}</strong>
                </td>
                <td class="text-end">
                  Rp {{ Number(k.uangMuka).toLocaleString('id-ID') }}
                </td>
                <td class="text-end">
                  <span class="badge bg-warning text-dark">
                    Rp {{ Number(k.pelunasan).toLocaleString('id-ID') }}
                  </span>
                </td>
                <td>
                  <span 
                    class="badge" 
                    :class="{
                      'bg-success': k.status === 'aktif',
                      'bg-secondary': k.status === 'selesai',
                      'bg-danger': k.status === 'batal'
                    }"
                  >
                    {{ k.status.toUpperCase() }}
                  </span>
                </td>
                <td class="text-center">
                  <div class="btn-group btn-group-sm">
                    <button 
                      @click="$router.push(`/kontrak/${k.id}`)"
                      class="btn btn-outline-info"
                      title="Detail"
                    >
                      <i class="bi bi-eye"></i>
                    </button>
                    <button 
                      @click="$router.push(`/kontrak/${k.id}/edit`)"
                      class="btn btn-outline-primary"
                      title="Edit"
                    >
                      <i class="bi bi-pencil"></i>
                    </button>
                    <button 
                      @click="generateInvoice(k.id)"
                      class="btn btn-outline-success"
                      title="Generate Invoice"
                    >
                      <i class="bi bi-receipt-cutoff"></i>
                    </button>
                    <button 
                      @click="buatSuratJalan(k.id)"
                      class="btn btn-outline-warning"
                      title="Buat Surat Jalan"
                    >
                      <i class="bi bi-truck"></i>
                    </button>
                    <button 
                      @click="hapusKontrak(k.id)"
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

    <!-- Summary Card -->
    <div class="row mt-4">
      <div class="col-md-3">
        <div class="card bg-primary text-white">
          <div class="card-body">
            <h6>Total Kontrak</h6>
            <h3>{{ kontrakList.length }}</h3>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card bg-success text-white">
          <div class="card-body">
            <h6>Kontrak Aktif</h6>
            <h3>{{ kontrakList.filter(k => k.status === 'aktif').length }}</h3>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card bg-warning text-dark">
          <div class="card-body">
            <h6>Total Pendapatan</h6>
            <h3>Rp {{ totalPendapatan.toLocaleString('id-ID') }}</h3>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card bg-danger text-white">
          <div class="card-body">
            <h6>Sisa Tagihan</h6>
            <h3>Rp {{ totalSisaTagihan.toLocaleString('id-ID') }}</h3>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '../api/auth'

const router = useRouter()
const loading = ref(false)
const kontrakList = ref([])
const searchQuery = ref('')
const filterStatus = ref('')

const filteredKontrak = computed(() => {
  let result = kontrakList.value

  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(k => 
      k.venue.toLowerCase().includes(q) ||
      k.acara.toLowerCase().includes(q)
    )
  }

  if (filterStatus.value) {
    result = result.filter(k => k.status === filterStatus.value)
  }

  return result
})

const totalPendapatan = computed(() => {
  return kontrakList.value.reduce((sum, k) => sum + (k.hargaSewa || 0), 0)
})

const totalSisaTagihan = computed(() => {
  return kontrakList.value.reduce((sum, k) => sum + (k.pelunasan || 0), 0)
})

onMounted(() => {
  loadData()
})

const loadData = async () => {
  loading.value = true
  try {
    const res = await api.get('/kontrak')
    kontrakList.value = res.data
  } catch (err) {
    console.error('Error loading kontrak:', err)
    alert('❌ Gagal memuat data kontrak')
  } finally {
    loading.value = false
  }
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const generateInvoice = (id) => {
  router.push(`/invoice/generate/${id}`)
}

const buatSuratJalan = (id) => {
  router.push(`/surat-jalan/create?kontrak=${id}`)
}

const hapusKontrak = async (id) => {
  if (!confirm('⚠️ Yakin ingin menghapus kontrak ini?')) return

  try {
    await api.delete(`/kontrak/${id}`)
    alert('✅ Kontrak berhasil dihapus')
    loadData()
  } catch (err) {
    console.error('Error delete kontrak:', err)
    alert('❌ Gagal menghapus kontrak')
  }
}
</script>

<style scoped>
.table th {
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.85rem;
  letter-spacing: 0.5px;
}

.btn-group-sm > .btn {
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
}

.card {
  transition: transform 0.2s;
}

.card:hover {
  transform: translateY(-2px);
}
</style>