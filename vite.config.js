import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
const backendURL = 'http://localhost:8080/api'
export default defineConfig({
  plugins: [vue()],
   define: {
    __BACKEND_URL__: JSON.stringify(backendURL)
  },
  server: {
    port: 3000, // FE jalan di localhost:3000
    proxy: {
      '/api': {
        target: 'http://localhost:8080', // alamat backend Spring Boot
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '/api'),
      },
    },
  },
})