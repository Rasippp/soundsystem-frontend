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
              <router-link class="nav-link" to="/kontrak">
                <i class="bi bi-file-earmark-text"></i> Kontrak
              </router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/invoice">
                <i class="bi bi-file-earmark-invoice"></i> Invoice
              </router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/surat-jalan">
                <i class="bi bi-truck"></i> Surat Jalan
              </router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/inventori">
                <i class="bi bi-box-seam"></i> Inventori
              </router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/pelanggan">
                <i class="bi bi-people"></i> Pelanggan
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
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
// PERBAIKI IMPORT DI BAWAH INI:
import { useAuthStore } from './stores/auth.js'; // Gunakan relative path

const authStore = useAuthStore();
const router = useRouter();

onMounted(() => {
  authStore.initializeAuth();
});

const handleLogout = () => {
  authStore.logout();
  router.push('/login');
};
</script>

<style>
.router-link-active {
  --bs-nav-link-hover-color: rgba(255, 255, 255, 0.75) !important;
}
</style>