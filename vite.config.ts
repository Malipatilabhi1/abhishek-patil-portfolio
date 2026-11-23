import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { profile } from './src/content.ts'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'portfolio-metadata',
      transformIndexHtml: (html) => html.replaceAll('%PORTFOLIO_ROLE%', profile.role),
    },
  ],
})
