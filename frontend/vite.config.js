import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  preview: {
    allowedHosts: ["marvelflix.onrender.com", "0.0.0.0"], // Permitir acesso pelo domínio no Render
  },
  server: {
    host: true, // Permite acesso a partir de qualquer IP externo
    port: 4173, // Garanta que está usando a porta correta
  },
})
