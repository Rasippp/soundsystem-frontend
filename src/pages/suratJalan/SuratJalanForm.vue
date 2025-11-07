<template>
  <div class="container py-4">
    <div class="row justify-content-center">
      <div class="col-lg-10">
        <div class="card shadow">
          <div class="card-header bg-success text-white">
            <h4 class="mb-0">
              <i class="bi bi-truck me-2"></i>Form Surat Jalan
            </h4>
            <small>Barang Keluar dari Gudang (3 Rangkap)</small>
          </div>

          <div class="card-body p-4">
            <div v-if="loading" class="text-center py-5">
              <div class="spinner-border text-success"></div>
              <p class="mt-3 text-muted">Memuat data...</p>
            </div>

            <form v-else @submit.prevent="handleSubmit">
              <!-- Section: Info Kontrak -->
              <div class="row mb-4">
                <div class="col-12">
                  <h5 class="border-bottom pb-2 mb-3">
                    <i class="bi bi-file-earmark-text text-primary me-2"></i>Informasi Kontrak
                  </h5>
                </div>

                <div class="col-md-12 mb-3">
                  <label class="form-label fw-bold">Pilih Kontrak <span class="text-danger">*</span></label>
                  <select 
                    class="form-select" 
                    v-model="form.idKontrak"
                    @change="loadKontrakDetail"
                    required
                    :disabled="submitting"
                  >
                    <option value="">-- Pilih Kontrak --</option>
                    <option 
                      v-for="k in kontrakList" 
                      :key="k.id" 
                      :value="k.id"
                    >
                      {{ k.venue }} - {{ k.acara }} ({{ formatDate(k.tanggalMulai) }})
                    </option>
                  </select>
                </div>

                <!-- Detail Kontrak yang dipilih -->
                <div v-if="selectedKontrak" class="col-12">
                  <div class="alert alert-info">
                    <div class="row">
                      <div class="col-md-6">
                        <strong>Venue:</strong> {{ selectedKontrak.venue }}<br>
                        <strong>Acara:</strong> {{ selectedKontrak.acara }}
                      </div>
                      <div class="col-md-6">
                        <strong>Tanggal:</strong> {{ formatDate(selectedKontrak.tanggalMulai) }}<br>
                        <strong>Pelanggan:</strong> {{ pelangganInfo.nama }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Section: Detail Surat Jalan -->
              <div class="row mb-4">
                <div class="col-12">
                  <h5 class="border-bottom pb-2 mb-3">
                    <i class="bi bi-calendar-check text-success me-2"></i>Detail Surat Jalan
                  </h5>
                </div>

                <div class="col-md-6 mb-3">
                  <label class="form-label fw-bold">Tanggal Keluar <span class="text-danger">*</span></label>
                  <input 
                    type="date" 
                    class="form-control" 
                    v-model="form.tanggalKeluar"
                    required
                    :disabled="submitting"
                  />
                </div>

                <div class="col-md-6 mb-3">
                  <label class="form-label fw-bold">Ditandatangani Oleh</label>
                  <input 
                    type="text" 
                    class="form-control" 
                    v-model="form.ditandatanganiOleh"
                    placeholder="Nama penerima"
                    :disabled="submitting"
                  />
                </div>

                <div class="col-md-6 mb-3">
                  <label class="form-label fw-bold">Sound Engineer <span class="text-danger">*</span></label>
                  <select 
                    class="form-select" 
                    v-model="form.soundEngineer"
                    required
                    :disabled="submitting"
                  >
                    <option value="">-- Pilih Sound Engineer --</option>
                    <option 
                      v-for="t in teamList.filter(t => t.jabatan === 'Sound Engineer')" 
                      :key="t.id" 
                      :value="t.nama"
                    >
                      {{ t.nama }}
                    </option>
                  </select>
                </div>
              </div>

              <!-- Section: Barang yang Dibawa -->
              <div class="row mb-4">
                <div class="col-12">
                  <h5 class="border-bottom pb-2 mb-3">
                    <i class="bi bi-box-seam text-warning me-2"></i>Daftar Barang yang Dibawa
                  </h5>
                </div>

                <div class="col-12">
                  <!-- Tabel Barang -->
                  <div class="table-responsive mb-3">
                    <table class="table table-bordered">
                      <thead class="table-light">
                        <tr>
                          <th width="40%">Nama Barang</th>
                          <th width="15%">Jumlah</th>
                          <th width="30%">Penanggung Jawab</th>
                          <th width="15%" class="text-center">Aksi</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(item, index) in barangList" :key="index">
                          <td>
                            <select 
                              class="form-select form-select-sm" 
                              v-model="item.kodeInventori"
                              required
                            >
                              <option value="">-- Pilih Barang --</option>
                              <option 
                                v-for="inv in inventoriList" 
                                :key="inv.id" 
                                :value="inv.id"
                              >
                                {{ inv.namaBarang }} ({{ inv.noInventaris }})
                              </option>
                            </select>
                          </td>
                          <td>
                            <input 
                              type="number" 
                              class="form-control form-control-sm" 
                              v-model.number="item.jumlah"
                              min="1"
                              required
                            />
                          </td>
                          <td>
                            <input 
                              type="text" 
                              class="form-control form-control-sm" 
                              v-model="item.penanggungJawabGudang"
                              placeholder="Nama PJ"
                            />
                          </td>
                          <td class="text-center">
                            <button 
                              type="button" 
                              class="btn btn-sm btn-danger"
                              @click="hapusBarang(index)"
                            >
                              <i class="bi bi-trash"></i>
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <button 
                    type="button" 
                    class="btn btn-sm btn-outline-primary"
                    @click="tambahBarang"
                  >
                    <i class="bi bi-plus-circle me-2"></i>Tambah Barang
                  </button>
                </div>
              </div>

              <!-- Section: Team Handling -->
              <div class="row mb-4">
                <div class="col-12">
                  <h5 class="border-bottom pb-2 mb-3">
                    <i class="bi bi-people text-info me-2"></i>Team Handling
                  </h5>
                </div>

                <div class="col-md-4 mb-3">
                  <label class="form-label fw-bold">Crew</label>
                  <select 
                    class="form-select" 
                    v-model="teamHandling.crew"
                    multiple
                    size="3"
                  >
                    <option 
                      v-for="t in teamList.filter(t => t.jabatan === 'Crew')" 
                      :key="t.id" 
                      :value="t.nama"
                    >
                      {{ t.nama }} ({{ formatRupiah(t.fee) }})
                    </option>
                  </select>
                  <small class="text-muted">Hold Ctrl untuk pilih multiple</small>
                </div>

                <div class="col-md-4 mb-3">
                  <label class="form-label fw-bold">Driver</label>
                  <select 
                    class="form-select" 
                    v-model="teamHandling.driver"
                  >
                    <option value="">-- Pilih Driver --</option>
                    <option 
                      v-for="t in teamList.filter(t => t.jabatan === 'Driver')" 
                      :key="t.id" 
                      :value="t.nama"
                    >
                      {{ t.nama }} ({{ formatRupiah(t.fee) }})
                    </option>
                  </select>
                </div>

                <div class="col-md-4 mb-3">
                  <label class="form-label fw-bold">Jenis Kendaraan</label>
                  <select class="form-select" v-model="teamHandling.jenisKendaraan">
                    <option value="Truking">Truking</option>
                    <option value="Inhouse">Inhouse</option>
                  </select>
                </div>

                <!-- Biaya Operasional -->
                <div class="col-md-4 mb-3">
                  <label class="form-label fw-bold">BBM</label>
                  <div class="input-group">
                    <span class="input-group-text">Rp</span>
                    <input 
                      type="number" 
                      class="form-control" 
                      v-model.number="biayaOperasional.bbm"
                      placeholder="0"
                    />
                  </div>
                </div>

                <div class="col-md-4 mb-3">
                  <label class="form-label fw-bold">Parkir</label>
                  <div class="input-group">
                    <span class="input-group-text">Rp</span>
                    <input 
                      type="number" 
                      class="form-control" 
                      v-model.number="biayaOperasional.parkir"
                      placeholder="0"
                    />
                  </div>
                </div>

                <div class="col-md-4 mb-3">
                  <label class="form-label fw-bold">Tol</label>
                  <div class="input-group">
                    <span class="input-group-text">Rp</span>
                    <input 
                      type="number" 
                      class="form-control" 
                      v-model.number="biayaOperasional.tol"
                      placeholder="0"
                    />
                  </div>
                </div>

                <!-- Total Biaya Operasional -->
                <div class="col-12">
                  <div class="alert alert-warning">
                    <strong>Total Biaya Operasional: </strong>
                    <span class="fs-5">{{ formatRupiah(totalBiayaOperasional) }}</span>
                  </div>
                </div>
              </div>

              <!-- Buttons -->
              <div class="row">
                <div class="col-12">
                  <div class="d-flex gap-2">
                    <button 
                      type="submit" 
                      class="btn btn-success btn-lg"
                      :disabled="submitting || barangList.length === 0"
                    >
                      <span v-if="submitting" class="spinner-border spinner-border-sm me-2"></span>
                      <i v-else class="bi bi-check-circle me-2"></i>
                      Simpan Surat Jalan
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
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import api from '../../api/auth'

const router = useRouter()
const route = useRoute()
const loading = ref(false)
const submitting = ref(false)

const kontrakList = ref([])
const inventoriList = ref([])
const teamList = ref([])
const selectedKontrak = ref(null)
const pelangganInfo = ref({})

const form = ref({
  idKontrak: '',
  tanggalKeluar: new Date().toISOString().split('T')[0],
  ditandatanganiOleh: '',
  soundEngineer: ''
})

const barangList = ref([
  { kodeInventori: '', jumlah: 1, penanggungJawabGudang: '', status: 'Dipinjam' }
])

const teamHandling = ref({
  crew: [],
  driver: '',
  jenisKendaraan: 'Truking'
})

const biayaOperasional = ref({
  bbm: 0,
  parkir: 0,
  tol: 0
})

const totalBiayaOperasional = computed(() => {
  return biayaOperasional.value.bbm + 
         biayaOperasional.value.parkir + 
         biayaOperasional.value.tol
})

onMounted(async () => {
  await Promise.all([
    loadKontrak(),
    loadInventori(),
    loadTeam()
  ])

  // Pre-fill kontrak dari query params
  if (route.query.kontrak) {
    form.value.idKontrak = parseInt(route.query.kontrak)
    await loadKontrakDetail()
  }
})

const loadKontrak = async () => {
  try {
    const res = await api.get('/kontrak')
    kontrakList.value = res.data.filter(k => k.status === 'aktif')
  } catch (err) {
    console.error('Error loading kontrak:', err)
  }
}

const loadInventori = async () => {
  try {
    const res = await api.get('/inventori')
    inventoriList.value = res.data
  } catch (err) {
    console.error('Error loading inventori:', err)
  }
}

const loadTeam = async () => {
  try {
    const res = await api.get('/team')
    teamList.value = res.data.filter(t => t.status === 'Aktif')
  } catch (err) {
    console.error('Error loading team:', err)
  }
}

const loadKontrakDetail = async () => {
  if (!form.value.idKontrak) return

  try {
    const res = await api.get(`/kontrak/${form.value.idKontrak}`)
    selectedKontrak.value = res.data

    // Load pelanggan info
    const resPelanggan = await api.get(`/pelanggan/${res.data.idPelanggan}`)
    pelangganInfo.value = resPelanggan.data
  } catch (err) {
    console.error('Error loading kontrak detail:', err)
  }
}

const tambahBarang = () => {
  barangList.value.push({
    kodeInventori: '',
    jumlah: 1,
    penanggungJawabGudang: '',
    status: 'Dipinjam'
  })
}

const hapusBarang = (index) => {
  barangList.value.splice(index, 1)
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('id-ID')
}

const formatRupiah = (amount) => {
  return `Rp ${Number(amount).toLocaleString('id-ID')}`
}

const handleSubmit = async () => {
  if (!form.value.idKontrak) {
    alert('Pilih kontrak terlebih dahulu!')
    return
  }

  if (barangList.value.length === 0) {
    alert('Tambahkan minimal 1 barang!')
    return
  }

  submitting.value = true

  try {
    // 1. Simpan Surat Jalan
    const suratJalanPayload = {
      idKontrak: form.value.idKontrak,
      tanggalKeluar: form.value.tanggalKeluar,
      ditandatanganiOleh: form.value.ditandatanganiOleh,
      soundEngineer: form.value.soundEngineer
    }

    const resSuratJalan = await api.post('/suratjalan', suratJalanPayload)
    const idSuratJalan = resSuratJalan.data.id || 1 // Adjust based on your API response

    // 2. Simpan Barang Keluar untuk setiap item
    for (const item of barangList.value) {
      const barangKeluarPayload = {
        idSuratJalan: idSuratJalan,
        kodeInventori: item.kodeInventori,
        jumlah: item.jumlah,
        penanggungJawabGudang: item.penanggungJawabGudang,
        soundEngineer: form.value.soundEngineer,
        status: 'Dipinjam'
      }
      await api.post('/barangkeluar', barangKeluarPayload)
    }

    // 3. Buat Jurnal Biaya Operasional (COA Biaya HPP)
    if (totalBiayaOperasional.value > 0) {
      const jurnalPayload = {
        tanggal: form.value.tanggalKeluar,
        jenis: 'biaya_operasional',
        keterangan: `Biaya operasional ${selectedKontrak.value.acara} - ${teamHandling.value.jenisKendaraan}`,
        total: totalBiayaOperasional.value
      }
      await api.post('/jurnal', jurnalPayload)
    }

    alert('✅ Surat Jalan berhasil dibuat!')
    router.push('/surat-jalan')
  } catch (err) {
    console.error('Error submit surat jalan:', err)
    alert('❌ Gagal membuat surat jalan: ' + (err.response?.data || err.message))
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.form-label {
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
}

.table-bordered td,
.table-bordered th {
  vertical-align: middle;
}
</style>