import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Viktigt: repo heter Travinfo -> Pages-url /Travinfo/
export default defineConfig({
  base: '/Travinfo/',
  plugins: [react()],
})
