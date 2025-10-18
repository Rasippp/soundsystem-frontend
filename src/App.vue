<template>
  <div id="app">
    <!-- Navigation Bar - Only show when user is authenticated -->
    <nav 
      v-if="authStore.isAuthenticated" 
      class="navbar navbar-expand-lg navbar-dark bg-dark px-3 mb-4"
    >
      <div class="container-fluid">
        <router-link class="navbar-brand" to="/dashboard">
          <i class="bi bi-speaker"></i> Sound System
        </router-link>
        
        <button 
          class="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto">
            <li class="nav-item">
              <router-link class="nav-link" to="/dashboard">
                <i class="bi bi-speedometer2"></i> Dashboard
              </router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/pelanggan">
                <i class="bi bi-people"></i> Pelanggan
              </router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/inventori">
                <i class="bi bi-box-seam"></i> Inventori
              </router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/penyewaan">
                <i class="bi bi-clipboard-check"></i> Penyewaan
              </router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/riwayat">
                <i class="bi bi-clock-history"></i> Riwayat
              </router-link>
            </li>
          </ul>
          
          <div class="navbar-nav ms-auto">
            <span class="navbar-text me-3">
              <i class="bi bi-person-circle"></i> 
              {{ authStore.user?.nama }} ({{ authStore.user?.role }})
            </span>
            <button 
              @click="handleLogout" 
              class="btn btn-outline-light btn-sm"
            >
              <i class="bi bi-box-arrow-right"></i> Logout
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <router-view />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
// PERBAIKI IMPORT DI BAWAH INI:
import { useAuthStore } from './stores/auth.js'  // Gunakan relative path

const authStore = useAuthStore()

onMounted(() => {
  authStore.initializeAuth()
})

const handleLogout = () => {
  authStore.logout()
}
</script>

<style>
/* Custom global styles yang melengkapi Bootstrap */
.router-link-active {
  font-weight: bold !important;
  color: #fff !important;
}

.nav-link {
  transition: color 0.3s ease;
}

.nav-link:hover {
  color: #ccc !important;
}

/* Improve overall spacing */
.container-custom {
  max-width: 1200px;
}
</style>