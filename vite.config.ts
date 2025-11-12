import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  base: '/DM_NewWeb_React/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})
