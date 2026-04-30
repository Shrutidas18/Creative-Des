import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    host: true,
    allowedHosts: ['unfair-unfrozen-lumping.ngrok-free.dev']
  }
})