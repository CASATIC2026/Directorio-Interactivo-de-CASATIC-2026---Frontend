import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // 👈 CLAVE
    port: 5175,
    proxy: {
      '/api': {
          target: 'http://localhost:5000',// 👈 TU IP AQUÍ
        changeOrigin: true,
      },
    },
  },
});