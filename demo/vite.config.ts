import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(() =>  {
  return {
    base: '/react-for-quill/',
    plugins: [react()],
    server: {
      host: process.env.HOST,
      port: +(process.env.PORT || 3000),
      open: true
    },
    preview: {
      host: process.env.HOST,
      port: 30001
    },
  }
})
