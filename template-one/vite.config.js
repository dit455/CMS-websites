import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// DJANGO target is read from .env (VITE_DJANGO_URL) instead of being hardcoded,
// so this file works unchanged on any machine — just edit .env to point elsewhere.
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const DJANGO = env.VITE_DJANGO_URL || 'http://localhost:8000'

  return {
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
  }
})
