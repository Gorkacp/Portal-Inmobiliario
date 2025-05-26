<template>
  <div class="contenedor">
    <!-- Botón de volver -->
    <button class="btn-volver" @click="volverPerfil">
      <i class="fas fa-arrow-left icono-flecha"></i> Volver
    </button>

    <h1>Crear publicación</h1>

    <form @submit.prevent="crearPublicacion">
      <div class="campo">
        <label>Tipo</label>
        <select v-model="form.tipo">
          <option>Venta</option>
          <option>Alquiler</option>
        </select>
      </div>

      <div class="campo">
        <label>Nombre</label>
        <input type="text" v-model="form.nombre" />
      </div>

      <div class="campo">
        <label>Habitaciones</label>
        <input type="number" v-model="form.habitaciones" min="1" />
      </div>

      <div class="campo">
        <label>Baños</label>
        <input type="number" v-model="form.baños" min="1" />
      </div>

      <div class="campo">
        <label>Estacionamiento</label>
        <div class="toggle-group">
          <button type="button" :class="{ activo: form.estacionamiento === 'Sí' }" @click="form.estacionamiento = 'Sí'">Sí</button>
          <button type="button" :class="{ activo: form.estacionamiento === 'No' }" @click="form.estacionamiento = 'No'">No</button>
        </div>
      </div>

      <div class="campo">
        <label>Amueblado</label>
        <div class="toggle-group">
          <button type="button" :class="{ activo: form.amueblado === 'Sí' }" @click="form.amueblado = 'Sí'">Sí</button>
          <button type="button" :class="{ activo: form.amueblado === 'No' }" @click="form.amueblado = 'No'">No</button>
        </div>
      </div>

      <div class="campo">
        <label>Dirección</label>
        <input type="text" v-model="form.direccion" />
      </div>

      <div class="campo">
        <label>En oferta</label>
        <div class="toggle-group">
          <button type="button" :class="{ activo: form.enOferta === 'true' }" @click="form.enOferta = 'true'">Sí</button>
          <button type="button" :class="{ activo: form.enOferta === 'false' }" @click="form.enOferta = 'false'">No</button>
        </div>
      </div>

      <div class="campo">
        <label>Precio</label>
        <input type="number" v-model="form.precio" />
      </div>

      <div class="campo">
        <label>Descuento</label>
        <input type="number" v-model="form.descuento" />
      </div>

      <div class="campo">
        <label>Imágenes (máx. 6)</label>
        <input type="file" multiple @change="seleccionarImagenes" />
      </div>

      <button type="submit">Publicar</button>
    </form>

    <hr />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { auth, db } from '../../firebase/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { collection, addDoc } from 'firebase/firestore'

// Router para redireccionar
const router = useRouter()

// Usuario actual
const usuario = ref(null)

// Formulario
const form = ref({
  tipo: 'Venta',
  nombre: '',
  habitaciones: 1,
  baños: 1,
  estacionamiento: 'Sí',
  amueblado: 'Sí',
  direccion: '',
  enOferta: 'false',
  precio: 0,
  descuento: 0
})

// Imágenes en base64
const imagenes = ref([])


// Hook que se ejecuta automáticamente cuando el componente se ha montado en pantalla.
onMounted(() => {
  // Se establece un observador que detecta cambios en el estado de autenticación del usuario.
  onAuthStateChanged(auth, (user) => {
    // Si el usuario ha iniciado sesión, se guarda en la variable reactiva 'usuario'.
    if (user) {
      usuario.value = user
    }
  })
})


function seleccionarImagenes(evento) {
  // Convierte la lista de archivos seleccionados en un array y limita la cantidad a un máximo de 6 archivos
  const archivos = Array.from(evento.target.files).slice(0, 6)
  
  // Limpia el array reactivo donde se almacenan las imágenes en base64 para evitar acumular imágenes previas
  imagenes.value = []

  // Recorre cada archivo seleccionado
  archivos.forEach((archivo) => {
    // Crea un nuevo objeto FileReader para leer el contenido del archivo
    const lector = new FileReader()

    // Cuando se complete la lectura del archivo, el resultado estará en formato base64
    lector.onload = (e) => {
      // Añade el resultado (la imagen codificada en base64) al array reactivo de imágenes
      imagenes.value.push(e.target.result)
    }

    // Inicia la lectura del archivo como una URL de datos base64
    lector.readAsDataURL(archivo)
  })
}


function crearPublicacion() {
  if (!usuario.value) return

  const nuevaCasa = {
    tipo: form.value.tipo,
    nombre: form.value.nombre,
    habitaciones: form.value.habitaciones,
    baños: form.value.baños,
    estacionamiento: form.value.estacionamiento,
    amueblado: form.value.amueblado,
    direccion: form.value.direccion,
    enOferta: form.value.enOferta === 'true',
    precio: form.value.precio,
    descuento: form.value.descuento,
    imagenes: imagenes.value,
    usuarioID: usuario.value.uid
  }

  addDoc(collection(db, 'casas'), nuevaCasa).then((docRef) => {
    router.push({ name: 'VistaCasa', params: { id: docRef.id } })
  })
}

// Función para volver al perfil
function volverPerfil() {
  router.push({ name: 'Perfil' }) // Ruta de Perfil
}
</script>

<style scoped>
.contenedor {
  max-width: 600px;
  margin: auto;
  padding: 30px;
  font-family: 'Segoe UI', sans-serif;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 0 15px rgba(0,0,0,0.1);
}

h1 {
  text-align: center;
  margin-bottom: 20px;
  color: #333;
}

.campo {
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;
}

label {
  margin-bottom: 5px;
  font-weight: bold;
  color: #555;
}

input[type="text"],
input[type="number"],
select,
input[type="file"] {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 16px;
  background-color: #f9f9f9;
}

button {
  background-color: #00c278;
  color: white;
  padding: 12px;
  border: none;
  cursor: pointer;
  width: 100%;
  font-size: 16px;
  margin-top: 20px;
  border-radius: 10px;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #00c278;
}

.toggle-group {
  display: flex;
  gap: 10px;
}

.toggle-group button {
  flex: 1;
  padding: 10px;
  font-size: 14px;
  border-radius: 8px;
  border: 1px solid #ccc;
  background-color: #f0f0f0;
  color: #333;
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.toggle-group button.activo {
  background-color: #00c278;
  color: white;
  border-color: #00c278;
}

/* Estilos del botón de volver */
.btn-volver {
  background: none;
  color: #00c278;
  font-size: 16px;
  border: none;
  cursor: pointer;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  font-weight: bold;
  transition: transform 0.2s ease, color 0.2s ease;
}

.btn-volver:hover {
  color: #007f50;
  transform: translateX(-5px);
}
</style>
