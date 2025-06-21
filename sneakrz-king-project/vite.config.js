import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss()],
  base: './',
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5180,
    host: '0.0.0.0',
    hmr: {
      protocol: 'ws',
      host: '5180-iwc2nvq4hrabqz32wj1pk-ed19f196.manusvm.computer',
      clientPort: 5180
    },
    watch: {
      usePolling: true
    }
  },
})


