<template>
  <div class="container py-4">
    <div class="row mb-4">
      <div class="col-md-6">
        <div class="card bg-primary text-white h-100">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <h6 class="card-subtitle mb-2">Selamat datang,</h6>
                <h4 class="card-title mb-0">{{ authStore.user?.nama }}</h4>
              </div>
              <i class="bi bi-person-circle fs-1"></i>
            </div>
            <p class="card-text mt-3 mb-0">
              <span class="badge bg-light text-primary">{{ authStore.user?.role }}</span>
            </p>
          </div>
        </div>
      </div>

      <div class="col-md-6">
        <div class="card h-100">
          <div class="card-body">
            <h5 class="card-title text-muted mb-4">
              <i class="bi bi-clock-history me-2"></i>Aktivitas Terakhir
            </h5>
            <div class="text-center py-4">
              <i class="bi bi-activity display-1 text-muted"></i>
              <p class="text-muted mt-3">Tidak ada aktivitas terbaru</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="row g-4">
      <div class="col-md-3">
        <div class="card text-center h-100">
          <div class="card-body">
            <i class="bi bi-people display-5 text-primary mb-3"></i>
            <h5 class="card-title">Pelanggan</h5>
            <p class="text-muted">Total pelanggan aktif</p>
          </div>
        </div>
      </div>

      <div class="col-md-3">
        <div class="card text-center h-100">
          <div class="card-body">
            <i class="bi bi-box-seam display-5 text-success mb-3"></i>
            <h5 class="card-title">Inventori</h5>
            <p class="text-muted">Total barang tersedia</p>
          </div>
        </div>
      </div>

      <div class="col-md-3">
        <div class="card text-center h-100">
          <div class="card-body">
            <i class="bi bi-calendar-check display-5 text-info mb-3"></i>
            <h5 class="card-title">Penyewaan</h5>
            <p class="text-muted">Penyewaan bulan ini</p>
          </div>
        </div>
      </div>

      <div class="col-md-3">
        <div class="card text-center h-100">
          <div class="card-body">
            <i class="bi bi-cash-stack display-5 text-warning mb-3"></i>
            <h5 class="card-title">Pendapatan</h5>
            <p class="text-muted">Total pendapatan bulan ini</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()
</script>