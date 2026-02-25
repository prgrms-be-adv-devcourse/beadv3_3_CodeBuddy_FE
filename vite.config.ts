import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      // Proxy API requests to the Gateway
      '/api/v1': {
        target: 'http://localhost:8090',
        changeOrigin: true,
        secure: false,
      },
      // Proxy OAuth2 requests to the Gateway
      '/oauth2': {
        target: 'http://localhost:8090',
        changeOrigin: true,
        secure: false,
      },
      '/login/oauth2': {
        target: 'http://localhost:8090',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})

