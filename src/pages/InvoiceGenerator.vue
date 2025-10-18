<template>
  <div class="container py-4">
    <div class="row justify-content-center">
      <div class="col-lg-8">
        <!-- Preview Invoice -->
        <div class="card shadow-lg mb-4" id="invoice-area">
          <div class="card-body p-5">
            <!-- Header -->
            <div class="row mb-4">
              <div class="col-6">
                <h2 class="text-primary fw-bold">INVOICE</h2>
                <p class="text-muted mb-0">Sound System Rental</p>
              </div>
              <div class="col-6 text-end">
                <h4 class="text-danger">{{ invoiceNumber }}</h4>
                <p class="mb-0">{{ formatDate(new Date()) }}</p>
              </div>
            </div>

            <hr>

            <!-- Data Pelanggan & Kontrak -->
            <div class="row mb-4">
              <div class="col-6">
                <h6 class="text-uppercase fw-bold mb-3">Tagihan Kepada:</h6>
                <p class="mb-1"><strong>{{ kontrak.namaPelanggan }}</strong></p>
                <p class="mb-1">{{ kontrak.alamatPelanggan }}</p>
                <p class="mb-1">{{ kontrak.telpPelanggan }}</p>
              </div>
              <div class="col-6">
                <h6 class="text-uppercase fw-bold mb-3">Detail Acara:</h6>
                <table class="table table-sm table-borderless">
                  <tr>
                    <td width="100">Venue</td>
                    <td>: {{ kontrak.venue }}</td>
                  </tr>
                  <tr>
                    <td>Acara</td>
                    <td>: {{ kontrak.acara }}</td>
                  </tr>
                  <tr>
                    <td>Tanggal</td>
                    <td>: {{ formatDate(kontrak.tanggalMulai) }}</td>
                  </tr>
                </table>
              </div>
            </div>

            <!-- Rincian Tagihan -->
            <div class="table-responsive mb-4">
              <table class="table table-bordered">
                <thead class="table-light">
                  <tr>
                    <th>Deskripsi</th>
                    <th class="text-end">Jumlah</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Sewa Sound System</td>
                    <td class="text-end">Rp {{ Number(kontrak.hargaSewa).toLocaleString('id-ID') }}</td>
                  </tr>
                  <tr v-if="kontrak.uangMuka > 0">
                    <td>Uang Muka (DP)</td>
                    <td class="text-end text-success">(Rp {{ Number(kontrak.uangMuka).toLocaleString('id-ID') }})</td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr class="table-warning">
                    <th>TOTAL TAGIHAN</th>
                    <th class="text-end">Rp {{ Number(kontrak.pelunasan).toLocaleString('id-ID') }}</th>
                  </tr>
                </tfoot>
              </table>
            </div>

            <!-- Metode Pembayaran -->
            <div class="alert alert-info mb-4">
              <h6 class="fw-bold mb-2">💳 Metode Pembayaran:</h6>
              <p class="mb-0">
                <strong>{{ kontrak.metodeBayar === 'transfer' ? 'Transfer Bank' : 'Tunai' }}</strong>
                <span v-if="kontrak.metodeBayar === 'transfer'"> - {{ kontrak.noRekening }}</span>
              </p>
            </div>

            <!-- Footer -->
            <div class="row mt-5">
              <div class="col-6">
                <p class="mb-1"><small class="text-muted">Terima kasih atas kepercayaan Anda!</small></p>
              </div>
              <div class="col-6 text-end">
                <p class="mb-1">Hormat kami,</p>
                <p class="mt-4 fw-bold">_____________________</p>
                <p class="mb-0"><small>Management</small></p>
              </div>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="card shadow-sm">
          <div class="card-body">
            <div class="row g-3">
              <div class="col-md-4">
                <button 
                  @click="printInvoice" 
                  class="btn btn-primary w-100"
                  :disabled="loading"
                >
                  <i class="bi bi-printer me-2"></i>Print Invoice
                </button>
              </div>
              <div class="col-md-4">
                <button 
                  @click="saveInvoice" 
                  class="btn btn-success w-100"
                  :disabled="loading || saved"
                >
                  <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                  <i v-else class="bi bi-check-circle me-2"></i>
                  {{ saved ? 'Invoice Tersimpan' : 'Simpan Invoice' }}
                </button>
              </div>
              <div class="col-md-4">
                <button 
                  @click="$router.back()" 
                  class="btn btn-outline-secondary w-100"
                >
                  <i class="bi bi-arrow-left me-2"></i>Kembali
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '../api/auth'

const route = useRoute()
const router = useRouter()
const loading = ref(false)
const saved = ref(false)

const kontrak = ref({
  id: null,
  namaPelanggan: '',
  alamatPelanggan: '',
  telpPelanggan: '',
  venue: '',
  acara: '',
  tanggalMulai: '',
  tanggalSelesai: '',
  hargaSewa: 0,
  uangMuka: 0,
  pelunasan: 0,
  metodeBayar: '',
  noRekening: ''
})

const invoiceNumber = computed(() => {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `INV/${year}${month}${day}/${kontrak.value.id || '000'}`
})

onMounted(async () => {
  const kontrakId = route.params.kontrakId
  if (kontrakId) {
    await loadKontrak(kontrakId)
  }
})

const loadKontrak = async (id) => {
  loading.value = true
  try {
    // Load kontrak
    const resKontrak = await api.get(`/kontrak/${id}`)
    const k = resKontrak.data

    // Load pelanggan
    const resPelanggan = await api.get(`/pelanggan/${k.idPelanggan}`)
    const p = resPelanggan.data

    kontrak.value = {
      id: k.id,
      namaPelanggan: p.nama,
      alamatPelanggan: p.alamat,
      telpPelanggan: p.noTelp,
      venue: k.venue,
      acara: k.acara,
      tanggalMulai: k.tanggalMulai,
      tanggalSelesai: k.tanggalSelesai,
      hargaSewa: k.hargaSewa,
      uangMuka: k.uangMuka,
      pelunasan: k.pelunasan,
      metodeBayar: k.metodeBayar,
      noRekening: k.noRekening
    }
  } catch (err) {
    console.error('Error loading data:', err)
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
    month: 'long',
    year: 'numeric'
  })
}

const printInvoice = () => {
  window.print()
}

const saveInvoice = async () => {
  loading.value = true
  try {
    const payload = {
      idKontrak: kontrak.value.id,
      tanggalInvoice: new Date().toISOString().split('T')[0],
      totalTagihan: kontrak.value.pelunasan,
      status: 'belum',
      tanggalPembayaran: null
    }

    await api.post('/invoice', payload)
    saved.value = true
    alert('✅ Invoice berhasil disimpan!')
    
    setTimeout(() => {
      router.push('/invoice')
    }, 1500)
  } catch (err) {
    console.error('Error save invoice:', err)
    alert('❌ Gagal menyimpan invoice')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
@media print {
  .btn, .card:last-child {
    display: none !important;
  }
  
  #invoice-area {
    box-shadow: none !important;
    border: none !important;
  }
}

.table-borderless td {
  padding: 0.25rem 0;
}
</style>