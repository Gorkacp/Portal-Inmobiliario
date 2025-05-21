<script setup>
// Importa la función `ref` de Vue para crear variables reactivas
import { ref } from 'vue'

// Importa `RouterView` que representa el componente donde se mostrará la vista actual según la ruta
// e `useRouter` para acceder al enrutador desde el componente
import { RouterView, useRouter } from 'vue-router'

// Importa los estilos de Font Awesome para poder usar iconos (como `<i class="fas fa-user"></i>`)
import '@fortawesome/fontawesome-free/css/all.css'

// Inicializa el enrutador para poder navegar entre rutas si lo necesitas más adelante
const router = useRouter()
</script>


<template>
  <div id="app">
    <main>
      <!-- `RouterView` es el contenedor dinámico de las vistas según la ruta actual. -->
      <RouterView />
    </main>
  </div>
</template>

<style>
  /* Estilo principal para el div con id="app" */
  #app {
    /* Define una fuente predeterminada para toda la app */
    font-family: 'Arial', sans-serif;

    /* Elimina márgenes por defecto */
    margin: 0;

    /* Elimina el padding por defecto */
    padding: 0;

    /* Ajusta el modelo de caja para incluir los bordes y el padding dentro del ancho total */
    box-sizing: border-box;
  }
</style>
