import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/sneakrz-king/', // ← this is important for GitHub Pages
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: '0.0.0.0',
    hmr: {
      protocol: 'ws',
      host: '5173-iwc2nvq4hrabqz32wj1pk-ed19f196.manusvm.computer',
      clientPort: 443
    },
    watch: {
      usePolling: true
    }
  },
})
