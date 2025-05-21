<template>
  <div class="formulario-contacto">
    <h2>Formulario de Contacto</h2>
    <form @submit.prevent="enviarEmail">
      <label for="nombre">Nombre:</label>
      <input type="text" v-model="nombre" required />

      <label for="email">Correo electrónico:</label>
      <input type="email" v-model="email" required />

      <label for="mensaje">Mensaje:</label>
      <textarea v-model="mensaje" rows="5" required></textarea><!-- v-model Para actualizar el formulario -->

      <button type="submit">Enviar</button>
    </form>
  </div>
  <Header class="fixed-header" />
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Header from '../Header/Header.vue';


const router = useRouter()

const nombre = ref('') // Son variables reactivas para que pueda enlazar el input de v-model con una variable reactiva
const email = ref('')
const mensaje = ref('')

function enviarEmail() {
  // Redireccionar al inicio
  router.push('/')
}
</script>

<style scoped>
.formulario-contacto {
  max-width: 600px;
  margin: 40px auto;
  padding: 30px;
  font-family: 'Segoe UI', sans-serif;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
  color: #333;
}

.formulario-contacto h2 {
  text-align: center;
  margin-bottom: 20px;
  color: #333;
  font-size: 24px;
}

form {
  display: flex;
  flex-direction: column;
}

label {
  margin-bottom: 5px;
  font-weight: bold;
  color: #555;
}

input[type="text"],
input[type="email"],
textarea {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 16px;
  background-color: #f9f9f9;
  margin-bottom: 15px;
  resize: none;
}

button {
  background-color: #00c278;
  color: white;
  padding: 12px;
  border: none;
  cursor: pointer;
  width: 100%;
  font-size: 16px;
  margin-top: 10px;
  border-radius: 10px;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #00a86b;
}

.mensaje-confirmacion {
  margin-top: 20px;
  color: #065f46;
  font-weight: bold;
  text-align: center;
}

/* Footer fijo */
.fixed-header {
  position: fixed;
  bottom: 0;
  width: 100%;
  background-color: white;
  border-top: 1px solid #ddd;
  text-align: center;
  padding: 10px 0;
  z-index: 1000;
  box-sizing: border-box;
}
</style>
