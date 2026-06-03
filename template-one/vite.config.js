import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const DJANGO = 'http://10.65.51.44:8000'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    proxy: {
      // All /api calls → Django backend (no CORS issues)
      '/api': {
        target: DJANGO,
        changeOrigin: true,
      },
      // Media files (uploaded images, docs) → Django
      '/media': {
        target: DJANGO,
        changeOrigin: true,
      },
    },
  },
})
