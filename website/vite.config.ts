import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // Served from https://nabilelnour15.github.io/overtop-website/
  base: '/overtop-website/',
  plugins: [react(), tailwindcss()],
})
