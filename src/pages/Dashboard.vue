<template>
  <div class="container py-4">
    <!-- Welcome Card -->
    <div class="row mb-4">
      <div class="col-12">
        <div class="card bg-gradient-primary text-white shadow-lg">
          <div class="card-body p-4">
            <div class="row align-items-center">
              <div class="col-md-8">
                <h3 class="mb-2">Selamat datang, {{ authStore.user?.nama }}!</h3>
                <p class="mb-0 opacity-75">
                  <i class="bi bi-calendar-check me-2"></i>{{ currentDate }}
                </p>
              </div>
              <div class="col-md-4 text-end">
                <span class="badge bg-white text-primary fs-6 px-4 py-2">
                  {{ authStore.user?.role }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Stats -->
    <div class="row g-4 mb-4">
      <div class="col-md-3">
        <div class="card border-0 shadow-sm h-100 hover-lift">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <div class="icon-box bg-primary bg-opacity-10 text-primary">
                <i class="bi bi-file-earmark-text fs-4"></i>
              </div>
              <router-link to="/kontrak" class="btn btn-sm btn-outline-primary">
                Lihat <i class="bi bi-arrow-right"></i>
              </router-link>
            </div>
            <h6 class="text-muted mb-2">Total Kontrak</h6>
            <h2 class="mb-0">
              {{ loading ? '...' : stats.totalKontrak }}
            </h2>
          </div>
        </div>
      </div>

      <div class="col-md-3">
        <div class="card border-0 shadow-sm h-100 hover-lift">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <div class="icon-box bg-success bg-opacity-10 text-success">
                <i class="bi bi-cash-stack fs-4"></i>
              </div>
              <router-link to="/invoice" class="btn btn-sm btn-outline-success">
                Lihat <i class="bi bi-arrow-right"></i>
              </router-link>
            </div>
            <h6 class="text-muted mb-2">Pendapatan Bulan Ini</h6>
            <h2 class="mb-0">
              {{ loading ? '...' : formatRupiah(stats.pendapatan) }}
            </h2>
          </div>
        </div>
      </div>

      <div class="col-md-3">
        <div class="card border-0 shadow-sm h-100 hover-lift">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <div class="icon-box bg-warning bg-opacity-10 text-warning">
                <i class="bi bi-truck fs-4"></i>
              </div>
              <router-link to="/surat-jalan" class="btn btn-sm btn-outline-warning">
                Lihat <i class="bi bi-arrow-right"></i>
              </router-link>
            </div>
            <h6 class="text-muted mb-2">Barang Dipinjam</h6>
            <h2 class="mb-0">
              {{ loading ? '...' : stats.barangDipinjam }}
            </h2>
          </div>
        </div>
      </div>

      <div class="col-md-3">
        <div class="card border-0 shadow-sm h-100 hover-lift">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <div class="icon-box bg-info bg-opacity-10 text-info">
                <i class="bi bi-box-seam fs-4"></i>
              </div>
              <router-link to="/inventori" class="btn btn-sm btn-outline-info">
                Lihat <i class="bi bi-arrow-right"></i>
              </router-link>
            </div>
            <h6 class="text-muted mb-2">Total Equipment</h6>
            <h2 class="mb-0">
              {{ loading ? '...' : stats.totalEquipment }}
            </h2>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="row g-4">
      <!-- Recent Contracts -->
      <div class="col-md-8">
        <div class="card border-0 shadow-sm">
          <div class="card-header bg-white border-0 py-3">
            <div class="d-flex justify-content-between align-items-center">
              <h5 class="mb-0">
                <i class="bi bi-clock-history text-primary me-2"></i>
                Kontrak Terbaru
              </h5>
              <router-link to="/kontrak" class="btn btn-sm btn-outline-primary">
                Lihat Semua
              </router-link>
            </div>
          </div>
          <div class="card-body p-0">
            <div v-if="loading" class="text-center py-5">
              <div class="spinner-border text-primary"></div>
            </div>
            <div v-else-if="recentKontrak.length === 0" class="text-center py-5 text-muted">
              <i class="bi bi-inbox display-6"></i>
              <p class="mt-2">Belum ada kontrak</p>
            </div>
            <div v-else class="table-responsive">
              <table class="table table-hover mb-0">
                <thead class="table-light">
                  <tr>
                    <th>Venue</th>
                    <th>Acara</th>
                    <th>Tanggal</th>
                    <th>Status</th>
                    <th class="text-end">Harga</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="k in recentKontrak" :key="k.id">
                    <td><strong>{{ k.venue }}</strong></td>
                    <td>{{ k.acara }}</td>
                    <td class="text-nowrap">
                      <small>{{ formatDate(k.tanggalMulai) }}</small>
                    </td>
                    <td>
                      <span 
                        class="badge"
                        :class="{
                          'bg-success': k.status === 'aktif',
                          'bg-secondary': k.status === 'selesai',
                          'bg-danger': k.status === 'batal'
                        }"
                      >
                        {{ k.status }}
                      </span>
                    </td>
                    <td class="text-end">
                      <strong>{{ formatRupiah(k.hargaSewa) }}</strong>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions & Stats -->
      <div class="col-md-4">
        <!-- Quick Actions -->
        <div class="card border-0 shadow-sm mb-4">
          <div class="card-header bg-white border-0 py-3">
            <h5 class="mb-0">
              <i class="bi bi-lightning-charge text-warning me-2"></i>
              Quick Actions
            </h5>
          </div>
          <div class="card-body">
            <div class="d-grid gap-2">
              <router-link to="/kontrak/create" class="btn btn-primary">
                <i class="bi bi-plus-circle me-2"></i>Buat Kontrak Baru
              </router-link>
              <router-link to="/surat-jalan/create" class="btn btn-outline-success">
                <i class="bi bi-truck me-2"></i>Buat Surat Jalan
              </router-link>
              <router-link to="/jurnal" class="btn btn-outline-info">
                <i class="bi bi-journal-text me-2"></i>Lihat Jurnal
              </router-link>
            </div>
          </div>
        </div>

        <!-- Invoice Status -->
        <div class="card border-0 shadow-sm">
          <div class="card-header bg-white border-0 py-3">
            <h5 class="mb-0">
              <i class="bi bi-file-earmark-invoice text-danger me-2"></i>
              Status Invoice
            </h5>
          </div>
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <div>
                <p class="text-muted mb-1">Belum Bayar</p>
                <h4 class="mb-0">{{ stats.invoiceBelumBayar }}</h4>
              </div>
              <div class="icon-box bg-danger bg-opacity-10 text-danger">
                <i class="bi bi-exclamation-triangle fs-4"></i>
              </div>
            </div>
            <div class="progress mb-3" style="height: 10px;">
              <div 
                class="progress-bar bg-danger" 
                :style="{ width: invoiceProgressBelum + '%' }"
              ></div>
            </div>

            <div class="d-flex justify-content-between align-items-center mb-3">
              <div>
                <p class="text-muted mb-1">Lunas</p>
                <h4 class="mb-0">{{ stats.invoiceLunas }}</h4>
              </div>
              <div class="icon-box bg-success bg-opacity-10 text-success">
                <i class="bi bi-check-circle fs-4"></i>
              </div>
            </div>
            <div class="progress" style="height: 10px;">
              <div 
                class="progress-bar bg-success" 
                :style="{ width: invoiceProgressLunas + '%' }"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="row mt-4">
      <div class="col-12">
        <div class="card border-0 shadow-sm">
          <div class="card-header bg-white border-0 py-3">
            <h5 class="mb-0">
              <i class="bi bi-activity text-info me-2"></i>
              Aktivitas Terbaru
            </h5>
          </div>
          <div class="card-body">
            <div v-if="loading" class="text-center py-3">
              <div class="spinner-border text-info spinner-border-sm"></div>
            </div>
            <div v-else-if="recentActivity.length === 0" class="text-center py-3 text-muted">
              Belum ada aktivitas
            </div>
            <div v-else class="activity-timeline">
              <div 
                v-for="activity in recentActivity" 
                :key="activity.id"
                class="activity-item"
              >
                <div 
                  class="activity-icon"
                  :class="{
                    'bg-success': activity.type === 'kontrak',
                    'bg-primary': activity.type === 'invoice',
                    'bg-warning': activity.type === 'surat-jalan'
                  }"
                >
                  <i 
                    class="bi"
                    :class="{
                      'bi-file-earmark-text': activity.type === 'kontrak',
                      'bi-file-earmark-invoice': activity.type === 'invoice',
                      'bi-truck': activity.type === 'surat-jalan'
                    }"
                  ></i>
                </div>
                <div class="activity-content">
                  <p class="mb-1">{{ activity.message }}</p>
                  <small class="text-muted">{{ activity.time }}</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import api from '../api/auth'

const authStore = useAuthStore()
const loading = ref(false)

const stats = ref({
  totalKontrak: 0,
  pendapatan: 0,
  barangDipinjam: 0,
  totalEquipment: 0,
  invoiceBelumBayar: 0,
  invoiceLunas: 0
})

const recentKontrak = ref([])
const recentActivity = ref([])

const currentDate = computed(() => {
  return new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
})

const invoiceProgressBelum = computed(() => {
  const total = stats.value.invoiceBelumBayar + stats.value.invoiceLunas
  return total > 0 ? (stats.value.invoiceBelumBayar / total * 100) : 0
})

const invoiceProgressLunas = computed(() => {
  const total = stats.value.invoiceBelumBayar + stats.value.invoiceLunas
  return total > 0 ? (stats.value.invoiceLunas / total * 100) : 0
})

onMounted(async () => {
  await loadDashboardData()
})

const loadDashboardData = async () => {
  loading.value = true
  try {
    // Load kontrak
    const resKontrak = await api.get('/kontrak')
    const kontrakData = resKontrak.data
    
    stats.value.totalKontrak = kontrakData.length
    stats.value.pendapatan = kontrakData
      .filter(k => k.status !== 'batal')
      .reduce((sum, k) => sum + (k.hargaSewa || 0), 0)
    
    recentKontrak.value = kontrakData
      .sort((a, b) => new Date(b.tanggalMulai) - new Date(a.tanggalMulai))
      .slice(0, 5)

    // Load invoice
    const resInvoice = await api.get('/invoice')
    const invoiceData = resInvoice.data
    
    stats.value.invoiceBelumBayar = invoiceData.filter(i => i.status === 'belum').length
    stats.value.invoiceLunas = invoiceData.filter(i => i.status === 'lunas').length

    // Load barang keluar
    const resBarang = await api.get('/barangkeluar')
    const barangData = resBarang.data
    
    stats.value.barangDipinjam = barangData.filter(b => b.status === 'Dipinjam').length

    // Load inventori
    const resInventori = await api.get('/inventori')
    stats.value.totalEquipment = resInventori.data.length

    // Generate recent activity
    recentActivity.value = [
      ...kontrakData.slice(0, 3).map(k => ({
        id: `kontrak-${k.id}`,
        type: 'kontrak',
        message: `Kontrak baru dibuat: ${k.venue} - ${k.acara}`,
        time: formatDate(k.tanggalMulai)
      })),
      ...invoiceData.slice(0, 2).map(i => ({
        id: `invoice-${i.id}`,
        type: 'invoice',
        message: `Invoice dibuat untuk kontrak ID ${i.idKontrak}`,
        time: formatDate(i.tanggalInvoice)
      }))
    ].slice(0, 5)

  } catch (err) {
    console.error('Error loading dashboard:', err)
  } finally {
    loading.value = false
  }
}

const formatRupiah = (amount) => {
  if (!amount) return 'Rp 0'
  return `Rp ${Number(amount).toLocaleString('id-ID')}`
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}
</script>

<style scoped>
.bg-gradient-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.hover-lift {
  transition: transform 0.2s, box-shadow 0.2s;
}

.hover-lift:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1) !important;
}

.icon-box {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.activity-timeline {
  position: relative;
  padding-left: 0;
}

.activity-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 1.5rem;
  position: relative;
}

.activity-item:not(:last-child)::before {
  content: '';
  position: absolute;
  left: 19px;
  top: 40px;
  width: 2px;
  height: calc(100% + 10px);
  background: #e9ecef;
}

.activity-icon {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
  margin-right: 1rem;
  z-index: 1;
}

.activity-content {
  flex: 1;
  padding-top: 5px;
}
</style>