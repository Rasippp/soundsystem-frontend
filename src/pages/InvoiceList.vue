<template>
  <div class="container py-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h2 class="mb-0">
          <i class="bi bi-file-earmark-invoice text-primary me-2"></i>
          Daftar Invoice
        </h2>
        <small class="text-muted">Management invoice & tracking pembayaran</small>
      </div>
      <button 
        @click="$router.push('/kontrak')" 
        class="btn btn-primary"
      >
        <i class="bi bi-arrow-left me-2"></i>Lihat Kontrak
      </button>
    </div>

    <!-- Filter -->
    <div class="card mb-4">
      <div class="card-body">
        <div class="row g-3">
          <div class="col-md-4">
            <input 
              type="text" 
              class="form-control" 
              v-model="searchQuery"
              placeholder="🔍 Cari nomor invoice..."
            />
          </div>
          <div class="col-md-3">
            <select class="form-select" v-model="filterStatus">
              <option value="">Semua Status</option>
              <option value="belum">Belum Bayar</option>
              <option value="parsial">Parsial</option>
              <option value="lunas">Lunas</option>
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

    <!-- Loading -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary mb-3"></div>
      <p class="text-muted">Memuat invoice...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="filteredInvoice.length === 0" class="text-center py-5">
      <i class="bi bi-inbox display-1 text-muted"></i>
      <p class="text-muted mt-3">Belum ada invoice</p>
    </div>

    <!-- Table -->
    <div v-else class="card shadow-sm">
      <div class="card-body p-0">
        <div class="table-responsive">
          <table class="table table-hover align-middle mb-0">
            <thead class="table-primary">
              <tr>
                <th class="px-3">No Invoice</th>
                <th>Tanggal</th>
                <th>Venue / Acara</th>
                <th>Total Tagihan</th>
                <th>Status</th>
                <th>Tgl Bayar</th>
                <th class="text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="inv in filteredInvoice" :key="inv.id">
                <td class="px-3">
                  <strong>{{ generateInvoiceNumber(inv) }}</strong>
                </td>
                <td class="text-nowrap">
                  {{ formatDate(inv.tanggalInvoice) }}
                </td>
                <td>
                  <strong>{{ inv.kontrakVenue }}</strong><br>
                  <small class="text-muted">{{ inv.kontrakAcara }}</small>
                </td>
                <td class="text-end">
                  <strong>Rp {{ Number(inv.totalTagihan).toLocaleString('id-ID') }}</strong>
                </td>
                <td>
                  <span 
                    class="badge" 
                    :class="{
                      'bg-danger': inv.status === 'belum',
                      'bg-warning text-dark': inv.status === 'parsial',
                      'bg-success': inv.status === 'lunas'
                    }"
                  >
                    {{ inv.status.toUpperCase() }}
                  </span>
                </td>
                <td class="text-nowrap">
                  {{ inv.tanggalPembayaran ? formatDate(inv.tanggalPembayaran) : '-' }}
                </td>
                <td class="text-center">
                  <div class="btn-group btn-group-sm">
                    <button 
                      @click="viewInvoice(inv.id)"
                      class="btn btn-outline-info"
                      title="Lihat Invoice"
                    >
                      <i class="bi bi-eye"></i>
                    </button>
                    <button 
                      @click="printInvoice(inv.id)"
                      class="btn btn-outline-secondary"
                      title="Print"
                    >
                      <i class="bi bi-printer"></i>
                    </button>
                    <button 
                      v-if="inv.status !== 'lunas'"
                      @click="markAsPaid(inv)"
                      class="btn btn-outline-success"
                      title="Tandai Lunas"
                    >
                      <i class="bi bi-check-circle"></i>
                    </button>
                    <button 
                      @click="deleteInvoice(inv.id)"
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

    <!-- Summary Stats -->
    <div class="row mt-4">
      <div class="col-md-3">
        <div class="card bg-primary text-white">
          <div class="card-body">
            <h6>Total Invoice</h6>
            <h3>{{ invoiceList.length }}</h3>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card bg-danger text-white">
          <div class="card-body">
            <h6>Belum Bayar</h6>
            <h3>{{ statusCount.belum }}</h3>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card bg-success text-white">
          <div class="card-body">
            <h6>Lunas</h6>
            <h3>{{ statusCount.lunas }}</h3>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card bg-warning text-dark">
          <div class="card-body">
            <h6>Total Tagihan</h6>
            <h3>Rp {{ totalTagihan.toLocaleString('id-ID', {maximumFractionDigits: 0}) }}</h3>
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
const invoiceList = ref([])
const searchQuery = ref('')
const filterStatus = ref('')

const filteredInvoice = computed(() => {
  let result = invoiceList.value

  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(inv => 
      generateInvoiceNumber(inv).toLowerCase().includes(q) ||
      inv.kontrakVenue?.toLowerCase().includes(q)
    )
  }

  if (filterStatus.value) {
    result = result.filter(inv => inv.status === filterStatus.value)
  }

  return result
})

const statusCount = computed(() => {
  return {
    belum: invoiceList.value.filter(i => i.status === 'belum').length,
    lunas: invoiceList.value.filter(i => i.status === 'lunas').length
  }
})

const totalTagihan = computed(() => {
  return invoiceList.value
    .filter(i => i.status !== 'lunas')
    .reduce((sum, i) => sum + (i.totalTagihan || 0), 0)
})

onMounted(() => {
  loadData()
})

const loadData = async () => {
  loading.value = true
  try {
    const resInvoice = await api.get('/invoice')
    const invoiceData = resInvoice.data

    // Enrich with kontrak data
    const enrichedData = await Promise.all(invoiceData.map(async (inv) => {
      try {
        const resKontrak = await api.get(`/kontrak/${inv.idKontrak}`)
        return {
          ...inv,
          kontrakVenue: resKontrak.data.venue,
          kontrakAcara: resKontrak.data.acara
        }
      } catch (err) {
        return {
          ...inv,
          kontrakVenue: '-',
          kontrakAcara: '-'
        }
      }
    }))

    invoiceList.value = enrichedData
  } catch (err) {
    console.error('Error loading invoice:', err)
    alert('❌ Gagal memuat data invoice')
  } finally {
    loading.value = false
  }
}

const generateInvoiceNumber = (inv) => {
  const date = new Date(inv.tanggalInvoice || new Date())
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `INV/${year}${month}${day}/${String(inv.id).padStart(3, '0')}`
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

const viewInvoice = (id) => {
  // Find invoice to get kontrak ID
  const invoice = invoiceList.value.find(i => i.id === id)
  if (invoice) {
    router.push(`/invoice/generate/${invoice.idKontrak}`)
  }
}

const printInvoice = (id) => {
  const invoice = invoiceList.value.find(i => i.id === id)
  if (invoice) {
    router.push(`/invoice/generate/${invoice.idKontrak}`)
    setTimeout(() => {
      window.print()
    }, 1000)
  }
}

const markAsPaid = async (invoice) => {
  if (!confirm('⚠️ Tandai invoice ini sebagai LUNAS?')) return

  try {
    const payload = {
      ...invoice,
      status: 'lunas',
      tanggalPembayaran: new Date().toISOString().split('T')[0]
    }
    
    await api.put(`/invoice/${invoice.id}`, payload)
    
    // Create jurnal for payment
    const jurnalPayload = {
      tanggal: new Date().toISOString().split('T')[0],
      jenis: 'penjualan',
      keterangan: `Pelunasan ${invoice.kontrakAcara} - ${invoice.kontrakVenue}`,
      total: invoice.totalTagihan
    }
    await api.post('/jurnal', jurnalPayload)
    
    alert('✅ Invoice berhasil ditandai lunas!')
    loadData()
  } catch (err) {
    console.error('Error mark as paid:', err)
    alert('❌ Gagal update status invoice')
  }
}

const deleteInvoice = async (id) => {
  if (!confirm('⚠️ Yakin ingin menghapus invoice ini?')) return

  try {
    await api.delete(`/invoice/${id}`)
    alert('✅ Invoice berhasil dihapus')
    loadData()
  } catch (err) {
    console.error('Error delete invoice:', err)
    alert('❌ Gagal menghapus invoice')
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