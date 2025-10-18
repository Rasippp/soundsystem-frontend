<template>
  <div class="container">
    <div class="row justify-content-center align-items-center min-vh-100">
      <div class="col-md-6 col-lg-4">
        <div class="card shadow">
          <div class="card-body p-4">
            <h2 class="text-center mb-4">Login Sound System</h2>
            
            <form @submit.prevent="handleLogin">
              <div class="mb-3">
                <label for="username" class="form-label">Username</label>
                <input
                  type="text"
                  class="form-control"
                  id="username"
                  v-model="credentials.username"
                  required
                  :disabled="authStore.isLoading"
                >
              </div>

              <div class="mb-3">
                <label for="password" class="form-label">Password</label>
                <input
                  type="password"
                  class="form-control"
                  id="password"
                  v-model="credentials.password"
                  required
                  :disabled="authStore.isLoading"
                >
              </div>

              <div v-if="authStore.error" class="alert alert-danger">
                {{ typeof authStore.error === 'string' ? authStore.error : 'Login failed' }}
              </div>

              <button 
                type="submit" 
                class="btn btn-primary w-100"
                :disabled="authStore.isLoading"
              >
                <span v-if="authStore.isLoading" class="spinner-border spinner-border-sm me-2" role="status"></span>
                <span v-if="authStore.isLoading">Loading...</span>
                <span v-else>Login</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()

const credentials = ref({
  username: '',
  password: ''
})

const handleLogin = async () => {
  try {
    await authStore.login(credentials.value)
  } catch (error) {
    console.error('Login error:', error)
  }
}

// Redirect jika sudah login
onMounted(() => {
  if (authStore.isAuthenticated) {
    router.push('/dashboard')
  }
})
</script>

<style scoped>
/* Using Bootstrap classes - no custom CSS needed */
</style>