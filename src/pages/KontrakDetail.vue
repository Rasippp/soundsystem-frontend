<template>
  <div class="container py-4">
    <div class="row justify-content-center">
      <div class="col-lg-10">
        <div class="card shadow">
          <div class="card-header bg-primary text-white d-flex justify-content-between align-items-center">
            <div>
              <h4 class="mb-0">
                <i class="bi bi-file-earmark-text me-2"></i> Detail Kontrak
              </h4>
              <small>Informasi lengkap penyewaan sound system</small>
            </div>
            <button class="btn btn-light btn-sm" @click="$router.push('/kontrak')">
              <i class="bi bi-arrow-left"></i> Kembali
            </button>
          </div>

          <div class="card-body p-4">
            <!-- Error -->
            <div v-if="error" class="alert alert-danger alert-dismissible fade show">
              <i class="bi bi-exclamation-triangle me-2"></i>{{ error }}
              <button type="button" class="btn-close" @click="error = null"></button>
            </div>

            <!-- Loading -->
            <div v-if="loading" class="text-center py-5">
              <div class="spinner-border text-primary mb-3"></div>
              <p class="text-muted">Memuat detail kontrak...</p>
            </div>

            <!-- Detail Kontrak -->
            <div v-else>
              <div class="row mb-4">
                <div class="col-12 mb-3">
                  <h5 class="border-bottom pb-2">
                    <i class="bi bi-person-circle text-primary me-2"></i>Data Penyewa
                  </h5>
                </div>
                <div class="col-md-6">
                  <p><strong>Nama:</strong> {{ kontrak.pelanggan?.nama || '-' }}</p>
                </div>
                <div class="col-md-6">
                  <p><strong>No. Telepon:</strong> {{ kontrak.pelanggan?.noTelp || '-' }}</p>
                </div>
              </div>

              <div class="row mb-4">
                <div class="col-12 mb-3">
                  <h5 class="border-bottom pb-2">
                    <i class="bi bi-calendar-event text-success me-2"></i>Detail Acara
                  </h5>
                </div>
                <div class="col-md-6">
                  <p><strong>Venue:</strong> {{ kontrak.venue }}</p>
                </div>
                <div class="col-md-6">
                  <p><strong>Acara:</strong> {{ kontrak.acara }}</p>
                </div>
                <div class="col-md-6">
                  <p>
                    <strong>Tanggal Mulai:</strong><br />
                    {{ formatDate(kontrak.tanggalMulai) }}
                  </p>
                </div>
                <div class="col-md-6">
                  <p>
                    <strong>Tanggal Selesai:</strong><br />
                    {{ formatDate(kontrak.tanggalSelesai) }}
                  </p>
                </div>
              </div>

              <div class="row mb-4">
                <div class="col-12 mb-3">
                  <h5 class="border-bottom pb-2">
                    <i class="bi bi-cash-coin text-warning me-2"></i>Detail Pembayaran
                  </h5>
                </div>
                <div class="col-md-4">
                  <p>
                    <strong>Harga Sewa:</strong><br />
                    Rp {{ Number(kontrak.hargaSewa).toLocaleString('id-ID') }}
                  </p>
                </div>
                <div class="col-md-4">
                  <p>
                    <strong>Uang Muka (DP):</strong><br />
                    Rp {{ Number(kontrak.uangMuka).toLocaleString('id-ID') }}
                  </p>
                </div>
                <div class="col-md-4">
                  <p>
                    <strong>Sisa Pelunasan:</strong><br />
                    Rp {{ Number(kontrak.pelunasan).toLocaleString('id-ID') }}
                  </p>
                </div>

                <div class="col-md-6">
                  <p><strong>Metode Pembayaran:</strong> {{ kontrak.metodeBayar || '-' }}</p>
                </div>
                <div class="col-md-6" v-if="kontrak.noRekening">
                  <p><strong>No. Rekening:</strong> {{ kontrak.noRekening }}</p>
                </div>
              </div>

              <div class="row mb-4">
                <div class="col-12 mb-3">
                  <h5 class="border-bottom pb-2">
                    <i class="bi bi-info-circle text-secondary me-2"></i>Status & Keterangan
                  </h5>
                </div>
                <div class="col-md-6">
                  <p>
                    <strong>Status:</strong>
                    <span 
                      class="badge"
                      :class="{
                        'bg-success': kontrak.status === 'aktif',
                        'bg-secondary': kontrak.status === 'selesai',
                        'bg-danger': kontrak.status === 'batal'
                      }"
                    >
                      {{ kontrak.status?.toUpperCase() }}
                    </span>
                  </p>
                </div>
                <div class="col-md-12">
                  <p><strong>Keterangan:</strong><br />{{ kontrak.keterangan || '-' }}</p>
                </div>
              </div>

              <!-- Tombol Aksi -->
              <div class="d-flex gap-2">
                <button 
                  class="btn btn-outline-primary btn-lg"
                  @click="$router.push(`/kontrak/${route.params.id}/edit`)"
                >
                  <i class="bi bi-pencil me-2"></i>Edit Kontrak
                </button>

                <button 
                  class="btn btn-outline-success btn-lg"
                  @click="generateInvoice(kontrak.id)"
                >
                  <i class="bi bi-file-earmark-invoice me-2"></i>Generate Invoice
                </button>

                <button 
                  class="btn btn-outline-warning btn-lg"
                  @click="buatSuratJalan(kontrak.id)"
                >
                  <i class="bi bi-truck me-2"></i>Buat Surat Jalan
                </button>

                <button 
                  class="btn btn-outline-danger btn-lg"
                  @click="hapusKontrak(kontrak.id)"
                >
                  <i class="bi bi-trash me-2"></i>Hapus
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
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '../api/auth'

const route = useRoute()
const router = useRouter()

const loading = ref(false)
const error = ref(null)
const kontrak = ref({})

onMounted(async () => {
  await loadKontrak(route.params.id)
})

const loadKontrak = async (id) => {
  loading.value = true
  try {
    const res = await api.get(`/kontrak/${id}`)
    kontrak.value = res.data
  } catch (err) {
    console.error('Gagal load kontrak:', err)
    error.value = 'Gagal memuat detail kontrak'
  } finally {
    loading.value = false
  }
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleString('id-ID', {
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
    router.push('/kontrak')
  } catch (err) {
    console.error('Error delete kontrak:', err)
    alert('❌ Gagal menghapus kontrak')
  }
}
</script>

<style scoped>
.card {
  transition: transform 0.2s;
}

.card:hover {
  transform: translateY(-2px);
}

p {
  margin-bottom: 0.5rem;
}

.badge {
  font-size: 0.9rem;
}
</style>
