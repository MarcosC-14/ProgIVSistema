import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    }
  },
  
  build: {
    rolldownOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        inscripciones: resolve(import.meta.dirname, 'inscripciones.html'),
        cursos: resolve(import.meta.dirname, 'cursos.html'),
        estudiantes: resolve(import.meta.dirname, 'estudiantes.html'),
        login: resolve(import.meta.dirname, 'login.html')
      }
    }
  }
});