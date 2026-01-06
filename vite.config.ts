import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['firebase/app', 'firebase/auth', 'firebase/firestore', 'firebase/storage'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate vendor chunks
          'react-vendor': ['react', 'react-dom', 'react-i18next'],
          'three-vendor': ['three', '@react-three/fiber', '@react-three/drei'],
          'ui-vendor': ['lucide-react', 'react-rnd'],
          'state-vendor': ['zustand'],
        },
      },
    },
    commonjsOptions: {
      include: [/firebase/, /node_modules/],
    },
  },
  resolve: {
    dedupe: ['firebase'],
  },
})

