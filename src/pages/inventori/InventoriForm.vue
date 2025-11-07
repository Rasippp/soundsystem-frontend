<template>
  <div class="container py-4">
    <div class="row justify-content-center">
      <div class="col-lg-8">
        <div class="card shadow">
          <div class="card-header bg-primary text-white">
            <h4 class="mb-0">
              <i class="bi bi-box-seam me-2"></i>
              {{ isEditMode ? 'Edit Inventori' : 'Tambah Inventori Baru' }}
            </h4>
          </div>

          <div class="card-body p-4">
            <!-- Loading State -->
            <div v-if="loading" class="text-center py-5">
              <div class="spinner-border text-primary"></div>
              <p class="mt-3 text-muted">Memuat data...</p>
            </div>

            <!-- Form -->
            <form v-else @submit.prevent="handleSubmit">
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label for="namaBarang" class="form-label fw-bold">Nama Barang <span class="text-danger">*</span></label>
                  <input type="text" id="namaBarang" class="form-control" v-model="form.namaBarang" required>
                </div>

                <div class="col-md-6 mb-3">
                  <label for="noInventaris" class="form-label fw-bold">No. Inventaris <span class="text-danger">*</span></label>
                  <input type="text" id="noInventaris" class="form-control" v-model="form.noInventaris" required>
                </div>

                <div class="col-md-6 mb-3">
                  <label for="merek" class="form-label fw-bold">Merek</label>
                  <input type="text" id="merek" class="form-control" v-model="form.merek">
                </div>

                <div class="col-md-6 mb-3">
                  <label for="ukuran" class="form-label fw-bold">Ukuran</label>
                  <input type="text" id="ukuran" class="form-control" v-model="form.ukuran">
                </div>

                <div class="col-md-6 mb-3">
                  <label for="fungsiEquipment" class="form-label fw-bold">Fungsi Equipment</label>
                  <input type="text" id="fungsiEquipment" class="form-control" v-model="form.fungsiEquipment">
                </div>

                <div class="col-12 mb-3">
                  <label for="kelengkapan" class="form-label fw-bold">Kelengkapan</label>
                  <textarea id="kelengkapan" class="form-control" v-model="form.kelengkapan" rows="3"></textarea>
                </div>

                <div class="col-12 mb-3">
                  <label for="foto" class="form-label fw-bold">Foto Barang</label>
                  <input type="file" id="foto" class="form-control" @change="handleFileUpload" accept="image/*">
                  <small class="text-muted">Kosongkan jika tidak ingin mengubah foto.</small>
                </div>

                <!-- Image Preview -->
                <div v-if="imagePreview" class="col-12 mb-3">
                  <label class="form-label">Pratinjau:</label>
                  <div>
                    <img :src="imagePreview" alt="Pratinjau Foto" class="img-thumbnail" style="max-width: 200px; max-height: 200px;">
                  </div>
                </div>
              </div>

              <!-- Buttons -->
              <div class="d-flex gap-2 mt-4">
                <button type="submit" class="btn btn-primary btn-lg" :disabled="submitting">
                  <span v-if="submitting" class="spinner-border spinner-border-sm me-2"></span>
                  <i v-else class="bi bi-check-circle me-2"></i>
                  {{ submitting ? 'Menyimpan...' : 'Simpan Data' }}
                </button>
                <button type="button" class="btn btn-outline-secondary btn-lg" @click="$router.push('/inventori')" :disabled="submitting">
                  <i class="bi bi-x-circle me-2"></i>
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getInventoriById, addInventori, updateInventori } from '../../api/InventoriService'

const route = useRoute()
const router = useRouter()

const loading = ref(false)
const submitting = ref(false)
const imagePreview = ref(null)

const form = ref({
  noInventaris: '',
  namaBarang: '',
  merek: '',
  ukuran: '',
  kelengkapan: '',
  fungsiEquipment: '',
  hargaSewa: 0,
  foto: null // Akan diisi dengan Base64 string
})

const isEditMode = computed(() => !!route.params.id)

onMounted(async () => {
  if (isEditMode.value) {
    loading.value = true
    try {
      const res = await getInventoriById(route.params.id)
      // Map response to form, pastikan semua field ada
      const data = res.data
      form.value = {
        noInventaris: data.noInventaris || '',
        namaBarang: data.namaBarang || '',
        merek: data.merek || '',
        ukuran: data.ukuran || '',
        kelengkapan: data.kelengkapan || '',
        fungsiEquipment: data.fungsi_equipment || data.fungsiEquipment || '', // Handle snake_case & camelCase
        hargaSewa: data.hargaSewa || 0,
        foto: data.foto || null // foto sudah dalam base64
      }
      if (data.foto) {
        imagePreview.value = `data:image/jpeg;base64,${data.foto}`
      }
    } catch (err) {
      console.error('Gagal memuat data inventori:', err)
      alert('❌ Gagal memuat data untuk diedit.')
      router.push('/inventori')
    } finally {
      loading.value = false
    }
  }
})

const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (!file) return

  // Create preview
  const reader = new FileReader()
  reader.onload = (e) => {
    imagePreview.value = e.target.result
  }
  reader.readAsDataURL(file)

  // Convert to Base64 for backend
  const base64Reader = new FileReader()
  base64Reader.onload = (e) => {
    // Hapus prefix "data:image/jpeg;base64,"
    form.value.foto = e.target.result.split(',')[1]
  }
  base64Reader.readAsDataURL(file)
}

const handleSubmit = async () => {
  if (!form.value.namaBarang || !form.value.noInventaris) {
    alert('Nama Barang dan No. Inventaris wajib diisi!')
    return
  }

  submitting.value = true
  try {
    if (isEditMode.value) {
      // Pastikan field fungsiEquipment dikirim dengan nama yang benar
      const payload = { ...form.value }
      if (payload.fungsiEquipment) {
        payload.fungsi_equipment = payload.fungsiEquipment
        delete payload.fungsiEquipment
      }
      await updateInventori(route.params.id, payload)
      alert('✅ Data inventori berhasil diperbarui!')
    } else {
      await addInventori(form.value)
      alert('✅ Inventori baru berhasil ditambahkan!')
    }
    router.push('/inventori')
  } catch (err) {
    console.error('Error submitting form:', err)
    alert('❌ Gagal menyimpan data. ' + (err.response?.data?.message || err.message))
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.form-label {
  margin-bottom: 0.5rem;
}
.img-thumbnail {
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
}
</style>