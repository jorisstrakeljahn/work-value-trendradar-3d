import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate vendor chunks
          'react-vendor': ['react', 'react-dom', 'react-i18next'],
          'three-vendor': ['three', '@react-three/fiber', '@react-three/drei'],
          'firebase-vendor': ['firebase'],
          'ui-vendor': ['lucide-react', 'react-rnd'],
          'state-vendor': ['zustand'],
        },
      },
    },
  },
})

