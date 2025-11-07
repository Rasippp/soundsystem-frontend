<template>
  <div class="container py-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h2 class="mb-0">
          <i class="bi bi-journal-text text-success me-2"></i>
          Jurnal Umum
        </h2>
        <small class="text-muted">Jurnal Penjualan & Biaya Operasional (COA)</small>
      </div>
      <button 
        @click="openModal(null)" 
        class="btn btn-success"
      >
        <i class="bi bi-plus-circle me-2"></i>Tambah Jurnal
      </button>
    </div>

    <!-- Summary Cards -->
    <div class="row mb-4">
      <div class="col-md-3">
        <div class="card bg-success text-white">
          <div class="card-body">
            <h6><i class="bi bi-cash-coin me-2"></i>Total Penjualan</h6>
            <h3>Rp {{ totalPenjualan.toLocaleString('id-ID') }}</h3>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card bg-danger text-white">
          <div class="card-body">
            <h6><i class="bi bi-wallet2 me-2"></i>Total Biaya</h6>
            <h3>Rp {{ totalBiaya.toLocaleString('id-ID') }}</h3>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card bg-primary text-white">
          <div class="card-body">
            <h6><i class="bi bi-graph-up me-2"></i>Laba Kotor</h6>
            <h3>Rp {{ labaKotor.toLocaleString('id-ID') }}</h3>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card bg-warning text-dark">
          <div class="card-body">
            <h6><i class="bi bi-calendar3 me-2"></i>Periode</h6>
            <h3>{{ currentMonth }}</h3>
          </div>
        </div>
      </div>
    </div>

    <!-- Filter -->
    <div class="card mb-4">
      <div class="card-body">
        <div class="row g-3">
          <div class="col-md-3">
            <label class="form-label">Tanggal Mulai</label>
            <input 
              type="date" 
              class="form-control" 
              v-model="filterTanggalMulai"
            />
          </div>
          <div class="col-md-3">
            <label class="form-label">Tanggal Akhir</label>
            <input 
              type="date" 
              class="form-control" 
              v-model="filterTanggalAkhir"
            />
          </div>
          <div class="col-md-3">
            <label class="form-label">Jenis</label>
            <select class="form-select" v-model="filterJenis">
              <option value="">Semua Jenis</option>
              <option value="penjualan">Penjualan</option>
              <option value="biaya_operasional">Biaya Operasional</option>
              <option value="lainnya">Lainnya</option>
            </select>
          </div>
          <div class="col-md-3">
            <label class="form-label">&nbsp;</label>
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
      <p class="text-muted">Memuat jurnal...</p>
    </div>

    <!-- Table -->
    <div v-else class="card shadow-sm">
      <div class="card-body p-0">
        <div class="table-responsive">
          <table class="table table-hover align-middle mb-0">
            <thead class="table-success">
              <tr>
                <th class="px-3">No</th>
                <th>Tanggal</th>
                <th>Jenis</th>
                <th>Keterangan</th>
                <th class="text-end">Debit</th>
                <th class="text-end">Kredit</th>
                <th class="text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(j, i) in filteredJurnal" :key="j.id">
                <td class="px-3">{{ i + 1 }}</td>
                <td class="text-nowrap">
                  {{ formatDate(j.tanggal) }}
                </td>
                <td>
                  <span 
                    class="badge"
                    :class="{
                      'bg-success': j.jenis === 'penjualan',
                      'bg-danger': j.jenis === 'biaya_operasional',
                      'bg-secondary': j.jenis === 'lainnya'
                    }"
                  >
                    {{ formatJenis(j.jenis) }}
                  </span>
                </td>
                <td>{{ j.keterangan }}</td>
                <td class="text-end">
                  <span v-if="j.jenis === 'penjualan'" class="text-success fw-bold">
                    Rp {{ Number(j.total).toLocaleString('id-ID') }}
                  </span>
                  <span v-else class="text-muted">-</span>
                </td>
                <td class="text-end">
                  <span v-if="j.jenis === 'biaya_operasional'" class="text-danger fw-bold">
                    Rp {{ Number(j.total).toLocaleString('id-ID') }}
                  </span>
                  <span v-else class="text-muted">-</span>
                </td>
                <td class="text-center">
                  <div class="btn-group btn-group-sm">
                    <button 
                      @click="openModal(j)"
                      class="btn btn-outline-primary"
                      title="Edit"
                    >
                      <i class="bi bi-pencil"></i>
                    </button>
                    <button 
                      @click="deleteJurnal(j.id)"
                      class="btn btn-outline-danger"
                      title="Hapus"
                    >
                      <i class="bi bi-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
            <tfoot class="table-light">
              <tr>
                <th colspan="4" class="text-end px-3">TOTAL</th>
                <th class="text-end text-success">
                  Rp {{ totalPenjualan.toLocaleString('id-ID') }}
                </th>
                <th class="text-end text-danger">
                  Rp {{ totalBiaya.toLocaleString('id-ID') }}
                </th>
                <th></th>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>

    <!-- Modal Form -->
    <div 
      class="modal fade" 
      id="jurnalModal" 
      tabindex="-1"
      ref="modalElement"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header bg-success text-white">
            <h5 class="modal-title">
              {{ editMode ? 'Edit Jurnal' : 'Tambah Jurnal' }}
            </h5>
            <button 
              type="button" 
              class="btn-close btn-close-white" 
              data-bs-dismiss="modal"
            ></button>
          </div>
          <form @submit.prevent="handleSubmit">
            <div class="modal-body">
              <div class="mb-3">
                <label class="form-label fw-bold">Tanggal <span class="text-danger">*</span></label>
                <input 
                  type="date" 
                  class="form-control" 
                  v-model="form.tanggal"
                  required
                />
              </div>

              <div class="mb-3">
                <label class="form-label fw-bold">Jenis <span class="text-danger">*</span></label>
                <select 
                  class="form-select" 
                  v-model="form.jenis"
                  required
                >
                  <option value="">-- Pilih Jenis --</option>
                  <option value="penjualan">Penjualan (Debit)</option>
                  <option value="biaya_operasional">Biaya Operasional (Kredit)</option>
                  <option value="lainnya">Lainnya</option>
                </select>
              </div>

              <div class="mb-3">
                <label class="form-label fw-bold">Keterangan <span class="text-danger">*</span></label>
                <textarea 
                  class="form-control" 
                  v-model="form.keterangan"
                  rows="3"
                  placeholder="Deskripsi transaksi..."
                  required
                ></textarea>
              </div>

              <div class="mb-3">
                <label class="form-label fw-bold">Total <span class="text-danger">*</span></label>
                <div class="input-group">
                  <span class="input-group-text">Rp</span>
                  <input 
                    type="number" 
                    class="form-control" 
                    v-model.number="form.total"
                    placeholder="0"
                    required
                    min="0"
                  />
                </div>
              </div>
            </div>

            <div class="modal-footer">
              <button 
                type="button" 
                class="btn btn-secondary" 
                data-bs-dismiss="modal"
              >
                Batal
              </button>
              <button 
                type="submit" 
                class="btn btn-success"
                :disabled="submitting"
              >
                <span v-if="submitting" class="spinner-border spinner-border-sm me-2"></span>
                <i v-else class="bi bi-check-circle me-2"></i>
                {{ editMode ? 'Update' : 'Simpan' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '../../api/auth'
import { Modal } from 'bootstrap'

const loading = ref(false)
const submitting = ref(false)
const jurnalList = ref([])
const filterTanggalMulai = ref('')
const filterTanggalAkhir = ref('')
const filterJenis = ref('')
const editMode = ref(false)
const modalElement = ref(null)
let modalInstance = null

const form = ref({
  id: null,
  tanggal: new Date().toISOString().split('T')[0],
  jenis: '',
  keterangan: '',
  total: 0
})

const filteredJurnal = computed(() => {
  let result = jurnalList.value

  if (filterTanggalMulai.value) {
    result = result.filter(j => j.tanggal >= filterTanggalMulai.value)
  }

  if (filterTanggalAkhir.value) {
    result = result.filter(j => j.tanggal <= filterTanggalAkhir.value)
  }

  if (filterJenis.value) {
    result = result.filter(j => j.jenis === filterJenis.value)
  }

  return result.sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal))
})

const totalPenjualan = computed(() => {
  return filteredJurnal.value
    .filter(j => j.jenis === 'penjualan')
    .reduce((sum, j) => sum + (j.total || 0), 0)
})

const totalBiaya = computed(() => {
  return filteredJurnal.value
    .filter(j => j.jenis === 'biaya_operasional')
    .reduce((sum, j) => sum + (j.total || 0), 0)
})

const labaKotor = computed(() => {
  return totalPenjualan.value - totalBiaya.value
})

const currentMonth = computed(() => {
  const date = new Date()
  return date.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })
})

onMounted(() => {
  loadData()
  modalInstance = new Modal(modalElement.value)
})

const loadData = async () => {
  loading.value = true
  try {
    const res = await api.get('/jurnal')
    jurnalList.value = res.data
  } catch (err) {
    console.error('Error loading jurnal:', err)
    alert('❌ Gagal memuat data jurnal')
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

const formatJenis = (jenis) => {
  const map = {
    'penjualan': 'Penjualan',
    'biaya_operasional': 'Biaya Operasional',
    'lainnya': 'Lainnya'
  }
  return map[jenis] || jenis
}

const openModal = (jurnal) => {
  if (jurnal) {
    editMode.value = true
    form.value = { ...jurnal }
  } else {
    editMode.value = false
    form.value = {
      id: null,
      tanggal: new Date().toISOString().split('T')[0],
      jenis: '',
      keterangan: '',
      total: 0
    }
  }
  modalInstance.show()
}

const handleSubmit = async () => {
  submitting.value = true
  try {
    if (editMode.value) {
      await api.put(`/jurnal/${form.value.id}`, form.value)
      alert('✅ Jurnal berhasil diupdate!')
    } else {
      await api.post('/jurnal', form.value)
      alert('✅ Jurnal berhasil ditambahkan!')
    }
    
    modalInstance.hide()
    loadData()
  } catch (err) {
    console.error('Error submit jurnal:', err)
    alert('❌ Gagal menyimpan jurnal')
  } finally {
    submitting.value = false
  }
}

const deleteJurnal = async (id) => {
  if (!confirm('⚠️ Yakin ingin menghapus jurnal ini?')) return

  try {
    await api.delete(`/jurnal/${id}`)
    alert('✅ Jurnal berhasil dihapus')
    loadData()
  } catch (err) {
    console.error('Error delete jurnal:', err)
    alert('❌ Gagal menghapus jurnal')
  }
}
</script>

<style scoped>
.table th {
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.85rem;
}
</style>