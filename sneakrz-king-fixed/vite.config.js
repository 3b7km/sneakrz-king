import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss()],
  // base: '/sneakrz-king/', // Correct for GitHub Pages
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: '0.0.0.0',
    hmr: {
      protocol: 'ws',
      host: '5178-iwc2nvq4hrabqz32wj1pk-ed19f196.manusvm.computer',
      clientPort: 443
    },
    watch: {
      usePolling: true
    }
  },
})


