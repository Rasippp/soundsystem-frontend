<template>
  <div class="container py-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h2 class="mb-0">
          <i class="bi bi-truck text-success me-2"></i>
          Daftar Surat Jalan
        </h2>
        <small class="text-muted">Tracking barang keluar/masuk gudang</small>
      </div>
      <button 
        @click="$router.push('/surat-jalan/create')" 
        class="btn btn-success"
      >
        <i class="bi bi-plus-circle me-2"></i>Buat Surat Jalan
      </button>
    </div>

    <!-- Filter -->
    <div class="card mb-4">
      <div class="card-body">
        <div class="row g-3">
          <div class="col-md-5">
            <input 
              type="text" 
              class="form-control" 
              v-model="searchQuery"
              placeholder="🔍 Cari berdasarkan venue atau sound engineer..."
            />
          </div>
          <div class="col-md-3">
            <select class="form-select" v-model="filterStatus">
              <option value="">Semua Status</option>
              <option value="Dipinjam">Barang Dipinjam</option>
              <option value="Kembali">Barang Kembali</option>
            </select>
          </div>
          <div class="col-md-2">
            <button @click="loadData" class="btn btn-outline-success w-100">
              <i class="bi bi-arrow-clockwise me-1"></i>Refresh
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-success mb-3"></div>
      <p class="text-muted">Memuat surat jalan...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="filteredSuratJalan.length === 0" class="text-center py-5">
      <i class="bi bi-inbox display-1 text-muted"></i>
      <p class="text-muted mt-3">Belum ada surat jalan</p>
    </div>

    <!-- Table -->
    <div v-else class="card shadow-sm">
      <div class="card-body p-0">
        <div class="table-responsive">
          <table class="table table-hover align-middle mb-0">
            <thead class="table-success">
              <tr>
                <th class="px-3">No</th>
                <th>Tanggal Keluar</th>
                <th>Venue / Acara</th>
                <th>Sound Engineer</th>
                <th>Jumlah Barang</th>
                <th>Status Barang</th>
                <th class="text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(sj, i) in filteredSuratJalan" :key="sj.id">
                <td class="px-3">{{ i + 1 }}</td>
                <td class="text-nowrap">
                  <i class="bi bi-calendar-check text-success me-1"></i>
                  {{ formatDate(sj.tanggalKeluar) }}
                </td>
                <td>
                  <strong>{{ sj.kontrakVenue }}</strong><br>
                  <small class="text-muted">{{ sj.kontrakAcara }}</small>
                </td>
                <td>
                  <i class="bi bi-person-badge text-info me-1"></i>
                  {{ sj.soundEngineer }}
                </td>
                <td class="text-center">
                  <span class="badge bg-primary">
                    {{ sj.jumlahBarang }} Item
                  </span>
                </td>
                <td>
                  <span 
                    class="badge" 
                    :class="{
                      'bg-warning': sj.statusBarang === 'Dipinjam',
                      'bg-success': sj.statusBarang === 'Kembali'
                    }"
                  >
                    {{ sj.statusBarang }}
                  </span>
                </td>
                <td class="text-center">
                  <div class="btn-group btn-group-sm">
                    <button 
                      @click="viewDetail(sj.id)"
                      class="btn btn-outline-info"
                      title="Detail"
                    >
                      <i class="bi bi-eye"></i>
                    </button>
                    <button 
                      v-if="sj.statusBarang === 'Dipinjam'"
                      @click="kembalikanBarang(sj.id)"
                      class="btn btn-outline-success"
                      title="Kembalikan Barang"
                    >
                      <i class="bi bi-box-arrow-in-down"></i>
                    </button>
                    <button 
                      @click="printSuratJalan(sj.id)"
                      class="btn btn-outline-secondary"
                      title="Print"
                    >
                      <i class="bi bi-printer"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Summary Stats -->
    <div class="row mt-4">
      <div class="col-md-3">
        <div class="card bg-success text-white">
          <div class="card-body">
            <h6>Total Surat Jalan</h6>
            <h3>{{ suratJalanList.length }}</h3>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card bg-warning text-dark">
          <div class="card-body">
            <h6>Barang Dipinjam</h6>
            <h3>{{ statusCount.dipinjam }}</h3>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card bg-info text-white">
          <div class="card-body">
            <h6>Barang Kembali</h6>
            <h3>{{ statusCount.kembali }}</h3>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card bg-primary text-white">
          <div class="card-body">
            <h6>Total Equipment</h6>
            <h3>{{ totalEquipment }}</h3>
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
const suratJalanList = ref([])
const searchQuery = ref('')
const filterStatus = ref('')

const filteredSuratJalan = computed(() => {
  let result = suratJalanList.value

  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(sj => 
      sj.kontrakVenue?.toLowerCase().includes(q) ||
      sj.soundEngineer?.toLowerCase().includes(q)
    )
  }

  if (filterStatus.value) {
    result = result.filter(sj => sj.statusBarang === filterStatus.value)
  }

  return result
})

const statusCount = computed(() => {
  return {
    dipinjam: suratJalanList.value.filter(sj => sj.statusBarang === 'Dipinjam').length,
    kembali: suratJalanList.value.filter(sj => sj.statusBarang === 'Kembali').length
  }
})

const totalEquipment = computed(() => {
  return suratJalanList.value.reduce((sum, sj) => sum + (sj.jumlahBarang || 0), 0)
})

onMounted(() => {
  loadData()
})

const loadData = async () => {
  loading.value = true
  try {
    // Load surat jalan
    const resSJ = await api.get('/suratjalan')
    const sjData = resSJ.data

    // Load barang keluar untuk setiap surat jalan
    const enrichedData = await Promise.all(sjData.map(async (sj) => {
      try {
        // Get kontrak detail
        const resKontrak = await api.get(`/kontrak/${sj.idKontrak}`)
        
        // Get barang keluar for this surat jalan
        const resBarang = await api.get('/barangkeluar')
        const barangBySJ = resBarang.data.filter(b => b.idSuratJalan === sj.id)
        
        // Determine status (Dipinjam jika masih ada yang belum kembali)
        const statusBarang = barangBySJ.some(b => b.status === 'Dipinjam') ? 'Dipinjam' : 'Kembali'
        
        return {
          ...sj,
          kontrakVenue: resKontrak.data.venue,
          kontrakAcara: resKontrak.data.acara,
          jumlahBarang: barangBySJ.length,
          statusBarang: statusBarang
        }
      } catch (err) {
        console.error('Error enriching surat jalan:', err)
        return {
          ...sj,
          kontrakVenue: '-',
          kontrakAcara: '-',
          jumlahBarang: 0,
          statusBarang: 'Dipinjam'
        }
      }
    }))

    suratJalanList.value = enrichedData
  } catch (err) {
    console.error('Error loading surat jalan:', err)
    alert('❌ Gagal memuat data surat jalan')
  } finally {
    loading.value = false
  }
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

const viewDetail = (id) => {
  router.push(`/surat-jalan/${id}`)
}

const kembalikanBarang = async (id) => {
  if (!confirm('⚠️ Tandai barang sudah dikembalikan?')) return

  try {
    // Get barang keluar by surat jalan
    const resBarang = await api.get('/barangkeluar')
    const barangList = resBarang.data.filter(b => b.idSuratJalan === id)

    // Update status semua barang jadi "Kembali"
    for (const barang of barangList) {
      await api.put(`/barangkeluar/${barang.id}`, {
        ...barang,
        status: 'Kembali'
      })
    }

    // Create barang kembali record
    const barangKembaliPayload = {
      idSuratJalan: id,
      tanggalKembali: new Date().toISOString().split('T')[0],
      kondisiBarang: 'baik',
      penanggungJawaban: 'Warehouse',
      soundEngineer: barangList[0]?.soundEngineer || '',
      keterangan: 'Barang dikembalikan dalam kondisi baik'
    }
    await api.post('/barangkembali', barangKembaliPayload)

    alert('✅ Barang berhasil dikembalikan!')
    loadData()
  } catch (err) {
    console.error('Error kembalikan barang:', err)
    alert('❌ Gagal mengembalikan barang')
  }
}

const printSuratJalan = (id) => {
  // TODO: Implement print functionality
  alert('🚧 Fitur print dalam pengembangan')
}
</script>

<style scoped>
.table th {
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.85rem;
}
</style>