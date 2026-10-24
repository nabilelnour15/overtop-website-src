import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // The public address lives in .env; the base path follows from it
  // (/overtop-website/ on GitHub Pages, / on a custom domain).
  const { VITE_SITE_URL } = loadEnv(mode, process.cwd(), 'VITE_')
  if (!VITE_SITE_URL?.endsWith('/')) throw new Error('VITE_SITE_URL in .env must be set and end with "/"')

  return {
    base: new URL(VITE_SITE_URL).pathname,
    plugins: [react(), tailwindcss()],
  }
})
