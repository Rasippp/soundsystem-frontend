<template>
  <div class="container py-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h2 class="mb-0">
          <i class="bi bi-people-fill text-info me-2"></i>
          Team Handling
        </h2>
        <small class="text-muted">Management team sound engineer, crew & driver</small>
      </div>
      <button 
        @click="openModal(null)" 
        class="btn btn-info"
      >
        <i class="bi bi-plus-circle me-2"></i>Tambah Team Member
      </button>
    </div>

    <!-- Filter & Stats -->
    <div class="row mb-4">
      <div class="col-md-3">
        <div class="card bg-primary text-white">
          <div class="card-body">
            <h6>Total Team</h6>
            <h3>{{ teamList.length }}</h3>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card bg-success text-white">
          <div class="card-body">
            <h6>Sound Engineer</h6>
            <h3>{{ teamByRole.engineer }}</h3>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card bg-warning text-dark">
          <div class="card-body">
            <h6>Crew</h6>
            <h3>{{ teamByRole.crew }}</h3>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card bg-info text-white">
          <div class="card-body">
            <h6>Driver</h6>
            <h3>{{ teamByRole.driver }}</h3>
          </div>
        </div>
      </div>
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
              placeholder="🔍 Cari nama team member..."
            />
          </div>
          <div class="col-md-3">
            <select class="form-select" v-model="filterJabatan">
              <option value="">Semua Jabatan</option>
              <option value="Sound Engineer">Sound Engineer</option>
              <option value="Crew">Crew</option>
              <option value="Driver">Driver</option>
            </select>
          </div>
          <div class="col-md-3">
            <select class="form-select" v-model="filterStatus">
              <option value="">Semua Status</option>
              <option value="Aktif">Aktif</option>
              <option value="Tidak Aktif">Tidak Aktif</option>
            </select>
          </div>
          <div class="col-md-2">
            <button @click="loadData" class="btn btn-outline-info w-100">
              <i class="bi bi-arrow-clockwise me-1"></i>Refresh
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-info mb-3"></div>
      <p class="text-muted">Memuat data team...</p>
    </div>

    <!-- Table -->
    <div v-else class="card shadow-sm">
      <div class="card-body p-0">
        <div class="table-responsive">
          <table class="table table-hover align-middle mb-0">
            <thead class="table-info">
              <tr>
                <th class="px-3">No</th>
                <th>Nama</th>
                <th>Jabatan</th>
                <th>Fee</th>
                <th>Status</th>
                <th class="text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(team, i) in filteredTeam" :key="team.id">
                <td class="px-3">{{ i + 1 }}</td>
                <td>
                  <i 
                    class="bi me-2"
                    :class="{
                      'bi-headset text-success': team.jabatan === 'Sound Engineer',
                      'bi-tools text-warning': team.jabatan === 'Crew',
                      'bi-truck text-info': team.jabatan === 'Driver'
                    }"
                  ></i>
                  <strong>{{ team.nama }}</strong>
                </td>
                <td>
                  <span 
                    class="badge"
                    :class="{
                      'bg-success': team.jabatan === 'Sound Engineer',
                      'bg-warning text-dark': team.jabatan === 'Crew',
                      'bg-info': team.jabatan === 'Driver'
                    }"
                  >
                    {{ team.jabatan }}
                  </span>
                </td>
                <td class="text-end">
                  <strong>Rp {{ Number(team.fee).toLocaleString('id-ID') }}</strong>
                </td>
                <td>
                  <span 
                    class="badge"
                    :class="{
                      'bg-success': team.status === 'Aktif',
                      'bg-secondary': team.status === 'Tidak Aktif'
                    }"
                  >
                    {{ team.status }}
                  </span>
                </td>
                <td class="text-center">
                  <div class="btn-group btn-group-sm">
                    <button 
                      @click="openModal(team)"
                      class="btn btn-outline-primary"
                      title="Edit"
                    >
                      <i class="bi bi-pencil"></i>
                    </button>
                    <button 
                      @click="toggleStatus(team)"
                      class="btn btn-outline-warning"
                      :title="team.status === 'Aktif' ? 'Non-aktifkan' : 'Aktifkan'"
                    >
                      <i class="bi" :class="team.status === 'Aktif' ? 'bi-toggle-on' : 'bi-toggle-off'"></i>
                    </button>
                    <button 
                      @click="deleteTeam(team.id)"
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

    <!-- Modal Form -->
    <div 
      class="modal fade" 
      id="teamModal" 
      tabindex="-1"
      ref="modalElement"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header bg-info text-white">
            <h5 class="modal-title">
              {{ editMode ? 'Edit Team Member' : 'Tambah Team Member' }}
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
                <label class="form-label fw-bold">Nama <span class="text-danger">*</span></label>
                <input 
                  type="text" 
                  class="form-control" 
                  v-model="form.nama"
                  placeholder="Nama lengkap"
                  required
                />
              </div>

              <div class="mb-3">
                <label class="form-label fw-bold">Jabatan <span class="text-danger">*</span></label>
                <select 
                  class="form-select" 
                  v-model="form.jabatan"
                  required
                >
                  <option value="">-- Pilih Jabatan --</option>
                  <option value="Sound Engineer">Sound Engineer</option>
                  <option value="Crew">Crew</option>
                  <option value="Driver">Driver</option>
                </select>
              </div>

              <div class="mb-3">
                <label class="form-label fw-bold">Fee <span class="text-danger">*</span></label>
                <div class="input-group">
                  <span class="input-group-text">Rp</span>
                  <input 
                    type="number" 
                    class="form-control" 
                    v-model.number="form.fee"
                    placeholder="0"
                    required
                    min="0"
                  />
                </div>
              </div>

              <div class="mb-3">
                <label class="form-label fw-bold">Status</label>
                <select 
                  class="form-select" 
                  v-model="form.status"
                >
                  <option value="Aktif">Aktif</option>
                  <option value="Tidak Aktif">Tidak Aktif</option>
                </select>
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
                class="btn btn-info"
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
const teamList = ref([])
const searchQuery = ref('')
const filterJabatan = ref('')
const filterStatus = ref('')
const editMode = ref(false)
const modalElement = ref(null)
let modalInstance = null

const form = ref({
  id: null,
  nama: '',
  jabatan: '',
  fee: 0,
  status: 'Aktif'
})

const filteredTeam = computed(() => {
  let result = teamList.value

  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(t => t.nama.toLowerCase().includes(q))
  }

  if (filterJabatan.value) {
    result = result.filter(t => t.jabatan === filterJabatan.value)
  }

  if (filterStatus.value) {
    result = result.filter(t => t.status === filterStatus.value)
  }

  return result
})

const teamByRole = computed(() => {
  return {
    engineer: teamList.value.filter(t => t.jabatan === 'Sound Engineer').length,
    crew: teamList.value.filter(t => t.jabatan === 'Crew').length,
    driver: teamList.value.filter(t => t.jabatan === 'Driver').length
  }
})

onMounted(() => {
  loadData()
  modalInstance = new Modal(modalElement.value)
})

const loadData = async () => {
  loading.value = true
  try {
    const res = await api.get('/team')
    teamList.value = res.data
  } catch (err) {
    console.error('Error loading team:', err)
    alert('❌ Gagal memuat data team')
  } finally {
    loading.value = false
  }
}

const openModal = (team) => {
  if (team) {
    editMode.value = true
    form.value = { ...team }
  } else {
    editMode.value = false
    form.value = {
      id: null,
      nama: '',
      jabatan: '',
      fee: 0,
      status: 'Aktif'
    }
  }
  modalInstance.show()
}

const handleSubmit = async () => {
  submitting.value = true
  try {
    if (editMode.value) {
      await api.put(`/team/${form.value.id}`, form.value)
      alert('✅ Team member berhasil diupdate!')
    } else {
      await api.post('/team', form.value)
      alert('✅ Team member berhasil ditambahkan!')
    }
    
    modalInstance.hide()
    loadData()
  } catch (err) {
    console.error('Error submit team:', err)
    alert('❌ Gagal menyimpan data team')
  } finally {
    submitting.value = false
  }
}

const toggleStatus = async (team) => {
  const newStatus = team.status === 'Aktif' ? 'Tidak Aktif' : 'Aktif'
  
  try {
    await api.put(`/team/${team.id}`, {
      ...team,
      status: newStatus
    })
    alert(`✅ Status berhasil diubah menjadi ${newStatus}`)
    loadData()
  } catch (err) {
    console.error('Error toggle status:', err)
    alert('❌ Gagal mengubah status')
  }
}

const deleteTeam = async (id) => {
  if (!confirm('⚠️ Yakin ingin menghapus team member ini?')) return

  try {
    await api.delete(`/team/${id}`)
    alert('✅ Team member berhasil dihapus')
    loadData()
  } catch (err) {
    console.error('Error delete team:', err)
    alert('❌ Gagal menghapus team member')
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