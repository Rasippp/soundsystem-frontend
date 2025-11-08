<template>
  <div class="container py-4">
    <div class="row justify-content-center">
      <div class="col-lg-10">
        <div class="card shadow">
          <div class="card-header bg-primary text-white">
            <h4 class="mb-0">
              <i class="bi bi-box-seam me-2"></i>
              Form Booking Studio dengan Paket Layanan
            </h4>
            <small>Pilih paket sesuai kebutuhan Anda (Database Paket Layanan A & B)</small>
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
              <!-- Data Pelanggan -->
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

              <!-- Paket Layanan -->
              <div class="row mb-4">
                <div class="col-12">
                  <h5 class="border-bottom pb-2 mb-3">
                    <i class="bi bi-box text-success me-2"></i>Pilih Paket Layanan Studio
                  </h5>
                </div>

                <div class="col-md-12 mb-3">
                  <label class="form-label fw-bold">Paket <span class="text-danger">*</span></label>
                  <select 
                    class="form-select" 
                    v-model="form.paketLayanan"
                    @change="handlePaketChange"
                    required
                    :disabled="submitting"
                  >
                    <option value="">-- Pilih Paket Layanan --</option>
                    <option 
                      v-for="p in paketList" 
                      :key="p.id" 
                      :value="p.namaPaket"
                    >
                      {{ p.namaPaket }} - Rp {{ Number(p.hargaPerJam).toLocaleString('id-ID') }}/jam 
                      ({{ p.deskripsi }})
                    </option>
                  </select>
                </div>

                <!-- Info Paket yang Dipilih -->
                <div v-if="selectedPaket" class="col-12 mb-3">
                  <div class="alert alert-info">
                    <h6 class="alert-heading">
                      <i class="bi bi-info-circle me-2"></i>
                      Detail {{ selectedPaket.namaPaket }}
                    </h6>
                    <hr>
                    <p class="mb-1"><strong>Deskripsi:</strong> {{ selectedPaket.deskripsi }}</p>
                    <p class="mb-1"><strong>Harga:</strong> Rp {{ Number(selectedPaket.hargaPerJam).toLocaleString('id-ID') }}/jam</p>
                    <p class="mb-1"><strong>Minimum Booking:</strong> {{ selectedPaket.minimumJam }} jam</p>
                    <p class="mb-0">
                      <strong>Layanan:</strong>
                      <span v-if="selectedPaket.includesRecording" class="badge bg-success ms-1">Recording</span>
                      <span v-if="selectedPaket.includesLiveAudio" class="badge bg-primary ms-1">Live Audio</span>
                      <span v-if="selectedPaket.includesVideoRecording" class="badge bg-warning ms-1">Video Recording</span>
                    </p>
                  </div>
                </div>

                <!-- Jenis Studio -->
                <div v-if="form.paketLayanan" class="col-md-6 mb-3">
                  <label class="form-label fw-bold">Jenis Studio <span class="text-danger">*</span></label>
                  <select 
                    class="form-select" 
                    v-model="form.jenisStudio"
                    required
                    :disabled="submitting"
                  >
                    <option value="">-- Pilih Jenis Studio --</option>
                    <option value="live_room">Live Room</option>
                    <option value="recording">Recording Room</option>
                    <option v-if="selectedPaket?.jenisStudio === 'both'" value="both">
                      Live Room & Recording
                    </option>
                  </select>
                </div>
              </div>

              <!-- Waktu Booking -->
              <div v-if="selectedPaket" class="row mb-4">
                <div class="col-12">
                  <h5 class="border-bottom pb-2 mb-3">
                    <i class="bi bi-clock text-warning me-2"></i>Waktu Booking
                  </h5>
                </div>

                <div class="col-md-6 mb-3">
                  <label class="form-label fw-bold">Jam Mulai <span class="text-danger">*</span></label>
                  <select 
                    class="form-select" 
                    v-model.number="form.jamBooking"
                    @change="validateJamBooking"
                    required
                    :disabled="submitting"
                  >
                    <option v-for="jam in 24" :key="jam-1" :value="jam-1">
                      {{ String(jam-1).padStart(2, '0') }}:00 WIB
                    </option>
                  </select>
                </div>

                <div class="col-md-6 mb-3">
                  <label class="form-label fw-bold">Durasi (Shift) <span class="text-danger">*</span></label>
                  <select 
                    class="form-select" 
                    v-model.number="form.shiftBooking"
                    @change="validateJamBooking"
                    required
                    :disabled="submitting"
                  >
                    <option 
                      v-for="shift in 12" 
                      :key="shift" 
                      :value="shift"
                      :disabled="selectedPaket.minimumJam && shift < selectedPaket.minimumJam"
                    >
                      {{ shift }} Jam
                    </option>
                  </select>
                </div>

                <!-- Validasi Jam -->
                <div v-if="!validasiJam.valid" class="col-12 mb-3">
                  <div class="alert alert-danger">
                    <i class="bi bi-exclamation-triangle me-2"></i>
                    {{ validasiJam.message }}
                  </div>
                </div>

                <!-- Info Waktu Booking -->
                <div v-else-if="form.jamBooking !== null && form.shiftBooking" class="col-12 mb-3">
                  <div class="alert alert-success">
                    <i class="bi bi-check-circle me-2"></i>
                    <strong>Booking:</strong> 
                    {{ String(form.jamBooking).padStart(2, '0') }}:00 - 
                    {{ String(form.jamBooking + form.shiftBooking).padStart(2, '0') }}:00 WIB
                    ({{ form.shiftBooking }} jam)
                  </div>
                </div>
              </div>

              <!-- Detail Acara -->
              <div class="row mb-4">
                <div class="col-12">
                  <h5 class="border-bottom pb-2 mb-3">
                    <i class="bi bi-calendar-event text-info me-2"></i>Detail Acara
                  </h5>
                </div>

                <div class="col-md-6 mb-3">
                  <label class="form-label fw-bold">Venue <span class="text-danger">*</span></label>
                  <input 
                    type="text" 
                    class="form-control" 
                    v-model="form.venue"
                    placeholder="Contoh: Studio A - Room 1"
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
                    placeholder="Contoh: Recording Album Band"
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

              <!-- Pembayaran -->
              <div class="row mb-4">
                <div class="col-12">
                  <h5 class="border-bottom pb-2 mb-3">
                    <i class="bi bi-cash-coin text-success me-2"></i>Detail Pembayaran
                  </h5>
                </div>

                <!-- Harga Sewa (Calculated) -->
                <div class="col-12 mb-3">
                  <div class="alert alert-primary">
                    <div class="row">
                      <div class="col-md-6">
                        <strong>Harga Sewa Total:</strong>
                      </div>
                      <div class="col-md-6 text-end">
                        <h4 class="mb-0">Rp {{ Number(form.hargaSewa).toLocaleString('id-ID') }}</h4>
                        <small class="text-muted">
                          {{ selectedPaket ? `Rp ${Number(selectedPaket.hargaPerJam).toLocaleString('id-ID')}/jam × ${form.shiftBooking} jam` : '' }}
                        </small>
                      </div>
                    </div>
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

                <div class="col-md-6 mb-3">
                  <label class="form-label fw-bold">Sisa Pelunasan</label>
                  <div class="alert alert-warning mb-0">
                    <h5 class="mb-0">Rp {{ Number(sisaPelunasan).toLocaleString('id-ID') }}</h5>
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

              <!-- Keterangan -->
              <div class="row mb-4">
                <div class="col-12 mb-3">
                  <label class="form-label fw-bold">Keterangan</label>
                  <textarea 
                    class="form-control" 
                    v-model="form.keterangan"
                    rows="3"
                    placeholder="Catatan tambahan untuk booking..."
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
                      :disabled="submitting || !validasiJam.valid"
                    >
                      <span v-if="submitting" class="spinner-border spinner-border-sm me-2"></span>
                      <i v-else class="bi bi-check-circle me-2"></i>
                      Simpan Booking
                    </button>
                    
                    <button 
                      type="button" 
                      class="btn btn-outline-secondary btn-lg"
                      @click="$router.back()"
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
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import api from '../../api/auth'

const router = useRouter()
const route = useRoute()

const isEdit = computed(() => !!route.params.id)
const loading = ref(false)
const submitting = ref(false)
const error = ref(null)

const pelangganList = ref([])
const paketList = ref([])
const selectedPaket = ref(null)

const form = ref({
  idPelanggan: '',
  venue: '',
  acara: '',
  tanggalMulai: '',
  tanggalSelesai: '',
  paketLayanan: '',
  jenisStudio: '',
  jamBooking: 9,
  shiftBooking: 3,
  hargaSewa: 0,
  uangMuka: 0,
  pelunasan: 0,
  metodeBayar: '',
  noRekening: '',
  status: 'aktif',
  keterangan: ''
})

const validasiJam = ref({ valid: true, message: '' })

const sisaPelunasan = computed(() => {
  const sisa = (form.value.hargaSewa || 0) - (form.value.uangMuka || 0)
  form.value.pelunasan = sisa > 0 ? sisa : 0
  return form.value.pelunasan
})

// Hitung harga otomatis
watch([() => form.value.shiftBooking, () => form.value.uangMuka], () => {
  if (selectedPaket.value && form.value.shiftBooking) {
    const totalHarga = selectedPaket.value.hargaPerJam * form.value.shiftBooking
    form.value.hargaSewa = totalHarga
    hitungSisa()
  }
})

onMounted(async () => {
  await Promise.all([
    loadPelanggan(),
    loadPaketLayanan()
  ])
  
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

const loadPaketLayanan = async () => {
  try {
    const res = await api.get('/paket-layanan')
    paketList.value = res.data
  } catch (err) {
    console.error('Gagal load paket layanan:', err)
    error.value = 'Gagal memuat data paket layanan'
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
      paketLayanan: data.paketLayanan || '',
      jenisStudio: data.jenisStudio || '',
      jamBooking: data.jamBooking || 9,
      shiftBooking: data.shiftBooking || 3,
      hargaSewa: data.hargaSewa,
      uangMuka: data.uangMuka,
      pelunasan: data.pelunasan,
      metodeBayar: data.metodeBayar,
      noRekening: data.noRekening,
      status: data.status,
      keterangan: data.keterangan
    }

    // Load paket yang dipilih
    if (data.paketLayanan) {
      handlePaketChange()
    }
  } catch (err) {
    console.error('Gagal load kontrak:', err)
    error.value = 'Gagal memuat data kontrak'
  } finally {
    loading.value = false
  }
}

const handlePaketChange = () => {
  const paket = paketList.value.find(p => p.namaPaket === form.value.paketLayanan)
  selectedPaket.value = paket
  
  if (paket) {
    form.value.shiftBooking = paket.minimumJam
    form.value.jenisStudio = paket.jenisStudio === 'both' ? 'live_room' : paket.jenisStudio
    
    // Hitung harga
    form.value.hargaSewa = paket.hargaPerJam * form.value.shiftBooking
  }
  
  validateJamBooking()
}

const validateJamBooking = () => {
  const jam = parseInt(form.value.jamBooking)
  const shift = parseInt(form.value.shiftBooking)
  
  if (selectedPaket.value && selectedPaket.value.namaPaket !== 'Custom') {
    // Paket A & B hanya JAM 09-21
    if (jam < 9 || jam > 21) {
      validasiJam.value = {
        valid: false,
        message: `${selectedPaket.value.namaPaket} hanya tersedia JAM 09:00 - 21:00 WIB`
      }
      return false
    }
    
    // Validasi akhir booking tidak melebihi jam 21
    const jamAkhir = jam + shift
    if (jamAkhir > 21) {
      validasiJam.value = {
        valid: false,
        message: `Booking akan berakhir pada ${jamAkhir}:00, melebihi batas jam 21:00`
      }
      return false
    }
  }
  
  validasiJam.value = { valid: true, message: '' }
  return true
}

const hitungSisa = () => {
  // Trigger computed property
  sisaPelunasan.value
}

const handleSubmit = async () => {
  if (!validateJamBooking()) {
    alert('⚠️ Validasi waktu booking gagal!')
    return
  }

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