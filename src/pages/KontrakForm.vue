<template>
  <div class="container py-4">
    <div class="row justify-content-center">
      <div class="col-lg-10">
        <div class="card shadow">
          <div class="card-header bg-primary text-white">
            <h4 class="mb-0">
              <i class="bi bi-file-earmark-text me-2"></i>
              {{ isEdit ? 'Edit Kontrak' : 'Form Kontrak Job Order' }}
            </h4>
            <small>Form Penyewaan Sound System (3 Rangkap)</small>
          </div>

          <div class="card-body p-4">
            <!-- Alert Error -->
            <div v-if="error" class="alert alert-danger alert-dismissible fade show">
              <i class="bi bi-exclamation-triangle me-2"></i>{{ error }}
              <button type="button" class="btn-close" @click="error = null"></button>
            </div>

            <!-- Loading State -->
            <div v-if="loading" class="text-center py-5">
              <div class="spinner-border text-primary mb-3"></div>
              <p class="text-muted">Memuat data...</p>
            </div>

            <!-- Form -->
            <form v-else @submit.prevent="handleSubmit">
              <!-- Section: Data Pelanggan -->
              <div class="row mb-4">
                <div class="col-12">
                  <h5 class="border-bottom pb-2 mb-3">
                    <i class="bi bi-person-circle text-primary me-2"></i>Data Penyewa
                  </h5>
                </div>
                
                <div class="col-md-12 mb-3">
                  <label class="form-label fw-bold">Nama Penyewa <span class="text-danger">*</span></label>
                  <select 
                    class="form-select" 
                    v-model="form.idPelanggan" 
                    required
                    :disabled="submitting"
                  >
                    <option value="">-- Pilih Pelanggan --</option>
                    <option 
                      v-for="p in pelangganList" 
                      :key="p.id" 
                      :value="p.id"
                    >
                      {{ p.nama }} - {{ p.noTelp }}
                    </option>
                  </select>
                </div>
              </div>

              <!-- Section: Detail Acara -->
              <div class="row mb-4">
                <div class="col-12">
                  <h5 class="border-bottom pb-2 mb-3">
                    <i class="bi bi-calendar-event text-success me-2"></i>Detail Acara
                  </h5>
                </div>

                <div class="col-md-6 mb-3">
                  <label class="form-label fw-bold">Venue <span class="text-danger">*</span></label>
                  <input 
                    type="text" 
                    class="form-control" 
                    v-model="form.venue"
                    placeholder="Contoh: Grand Ballroom Hotel Mulia"
                    required
                    :disabled="submitting"
                  />
                </div>

                <div class="col-md-6 mb-3">
                  <label class="form-label fw-bold">Acara <span class="text-danger">*</span></label>
                  <input 
                    type="text" 
                    class="form-control" 
                    v-model="form.acara"
                    placeholder="Contoh: Wedding Party"
                    required
                    :disabled="submitting"
                  />
                </div>

                <div class="col-md-6 mb-3">
                  <label class="form-label fw-bold">Tanggal Mulai <span class="text-danger">*</span></label>
                  <input 
                    type="datetime-local" 
                    class="form-control" 
                    v-model="form.tanggalMulai"
                    required
                    :disabled="submitting"
                  />
                </div>

                <div class="col-md-6 mb-3">
                  <label class="form-label fw-bold">Tanggal Selesai <span class="text-danger">*</span></label>
                  <input 
                    type="datetime-local" 
                    class="form-control" 
                    v-model="form.tanggalSelesai"
                    required
                    :disabled="submitting"
                  />
                </div>
              </div>

              <!-- Section: Pembayaran -->
              <div class="row mb-4">
                <div class="col-12">
                  <h5 class="border-bottom pb-2 mb-3">
                    <i class="bi bi-cash-coin text-warning me-2"></i>Detail Pembayaran
                  </h5>
                </div>

                <div class="col-md-6 mb-3">
                  <label class="form-label fw-bold">Harga Sewa <span class="text-danger">*</span></label>
                  <div class="input-group">
                    <span class="input-group-text">Rp</span>
                    <input 
                      type="number" 
                      class="form-control" 
                      v-model.number="form.hargaSewa"
                      @input="hitungSisa"
                      placeholder="0"
                      required
                      min="0"
                      :disabled="submitting"
                    />
                  </div>
                </div>

                <div class="col-md-6 mb-3">
                  <label class="form-label fw-bold">Uang Muka (DP)</label>
                  <div class="input-group">
                    <span class="input-group-text">Rp</span>
                    <input 
                      type="number" 
                      class="form-control" 
                      v-model.number="form.uangMuka"
                      @input="hitungSisa"
                      placeholder="0"
                      min="0"
                      :disabled="submitting"
                    />
                  </div>
                </div>

                <div class="col-md-12 mb-3">
                  <div class="alert alert-info">
                    <strong>Sisa Pelunasan: </strong>
                    <span class="fs-5 fw-bold">
                      Rp {{ sisaPelunasan.toLocaleString('id-ID') }}
                    </span>
                  </div>
                </div>

                <div class="col-md-6 mb-3">
                  <label class="form-label fw-bold">Metode Pembayaran <span class="text-danger">*</span></label>
                  <select 
                    class="form-select" 
                    v-model="form.metodeBayar"
                    required
                    :disabled="submitting"
                  >
                    <option value="">-- Pilih Metode --</option>
                    <option value="tunai">Tunai</option>
                    <option value="transfer">Transfer Bank</option>
                  </select>
                </div>

                <div class="col-md-6 mb-3" v-if="form.metodeBayar === 'transfer'">
                  <label class="form-label fw-bold">No Rekening</label>
                  <input 
                    type="text" 
                    class="form-control" 
                    v-model="form.noRekening"
                    placeholder="Contoh: BCA 1234567890"
                    :disabled="submitting"
                  />
                </div>
              </div>

              <!-- Section: Keterangan -->
              <div class="row mb-4">
                <div class="col-12 mb-3">
                  <label class="form-label fw-bold">Keterangan</label>
                  <textarea 
                    class="form-control" 
                    v-model="form.keterangan"
                    rows="3"
                    placeholder="Catatan tambahan..."
                    :disabled="submitting"
                  ></textarea>
                </div>
              </div>

              <!-- Buttons -->
              <div class="row">
                <div class="col-12">
                  <div class="d-flex gap-2">
                    <button 
                      type="submit" 
                      class="btn btn-primary btn-lg"
                      :disabled="submitting"
                    >
                      <span v-if="submitting" class="spinner-border spinner-border-sm me-2"></span>
                      <i v-else class="bi bi-check-circle me-2"></i>
                      {{ isEdit ? 'Update Kontrak' : 'Simpan Kontrak' }}
                    </button>
                    
                    <button 
                      type="button" 
                      class="btn btn-outline-secondary btn-lg"
                      @click="$router.push('/kontrak')"
                      :disabled="submitting"
                    >
                      <i class="bi bi-x-circle me-2"></i>Batal
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import api from '../api/auth'

const router = useRouter()
const route = useRoute()

const isEdit = computed(() => !!route.params.id)
const loading = ref(false)
const submitting = ref(false)
const error = ref(null)

const pelangganList = ref([])

const form = ref({
  idPelanggan: '',
  venue: '',
  acara: '',
  tanggalMulai: '',
  tanggalSelesai: '',
  hargaSewa: 0,
  uangMuka: 0,
  pelunasan: 0,
  metodeBayar: '',
  noRekening: '',
  status: 'aktif',
  keterangan: ''
})

const sisaPelunasan = computed(() => {
  const sisa = (form.value.hargaSewa || 0) - (form.value.uangMuka || 0)
  form.value.pelunasan = sisa > 0 ? sisa : 0
  return form.value.pelunasan
})

const hitungSisa = () => {
  // Trigger computed property
  sisaPelunasan.value
}

onMounted(async () => {
  await loadPelanggan()
  
  if (isEdit.value) {
    await loadKontrak(route.params.id)
  }
})

const loadPelanggan = async () => {
  try {
    const res = await api.get('/pelanggan')
    pelangganList.value = res.data
  } catch (err) {
    console.error('Gagal load pelanggan:', err)
    error.value = 'Gagal memuat data pelanggan'
  }
}

const loadKontrak = async (id) => {
  loading.value = true
  try {
    const res = await api.get(`/kontrak/${id}`)
    const data = res.data
    
    form.value = {
      idPelanggan: data.idPelanggan,
      venue: data.venue,
      acara: data.acara,
      tanggalMulai: data.tanggalMulai ? data.tanggalMulai.slice(0, 16) : '',
      tanggalSelesai: data.tanggalSelesai ? data.tanggalSelesai.slice(0, 16) : '',
      hargaSewa: data.hargaSewa,
      uangMuka: data.uangMuka,
      pelunasan: data.pelunasan,
      metodeBayar: data.metodeBayar,
      noRekening: data.noRekening,
      status: data.status,
      keterangan: data.keterangan
    }
  } catch (err) {
    console.error('Gagal load kontrak:', err)
    error.value = 'Gagal memuat data kontrak'
  } finally {
    loading.value = false
  }
}

const handleSubmit = async () => {
  submitting.value = true
  error.value = null

  try {
    const payload = {
      ...form.value,
      // Convert datetime-local to ISO string
      tanggalMulai: form.value.tanggalMulai ? new Date(form.value.tanggalMulai).toISOString() : null,
      tanggalSelesai: form.value.tanggalSelesai ? new Date(form.value.tanggalSelesai).toISOString() : null
    }

    if (isEdit.value) {
      await api.put(`/kontrak/${route.params.id}`, payload)
      alert('✅ Kontrak berhasil diupdate!')
    } else {
      await api.post('/kontrak', payload)
      alert('✅ Kontrak berhasil dibuat!')
    }

    router.push('/kontrak')
  } catch (err) {
    console.error('Error submit kontrak:', err)
    error.value = err.response?.data || 'Gagal menyimpan kontrak'
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.form-label {
  color: #495057;
}

.form-control:focus,
.form-select:focus {
  border-color: #0d6efd;
  box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25);
}

.alert-info {
  background-color: #e7f3ff;
  border-color: #b6d4fe;
  color: #004085;
}
</style>