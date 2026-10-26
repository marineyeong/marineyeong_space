import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { articleContent } from './scripts/article-content.ts'

export default defineConfig({
  base: '/marineyeong_space/',
  plugins: [react(), articleContent()],
})
