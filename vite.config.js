<<<<<<< HEAD
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
   
    port: 5175,
    proxy: {
      '/api': {
          target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
});
=======
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5175,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
});
>>>>>>> 0708ec2 ( estoy actualizando el frontend y las paginas publicas del proyecto asi que eh modificado bastantes cosas espero no aiga errores)
