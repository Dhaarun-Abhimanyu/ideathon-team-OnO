import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/gemini': {
        target: 'https://ideathon-team-ono.onrender.com', // Replace with your API server
        changeOrigin: true,
      },
    },
  },
})
