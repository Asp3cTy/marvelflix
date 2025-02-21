import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0", // Permite acesso externo no Render
    port: process.env.PORT || 10000, // Usa a porta do Render ou 10000 como fallback
  },
});
