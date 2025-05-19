import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  base: './',  // <- Esto es clave para que los estilos y assets se carguen bien en producción
  plugins: [vue()],
})
