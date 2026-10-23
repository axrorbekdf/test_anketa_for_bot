import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    proxy: {
      '/api': {
        target: 'http://10.100.104.104:7777',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
