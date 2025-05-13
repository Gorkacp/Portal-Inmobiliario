<template>
  <div class="page-container">
    <!-- GIF de carga -->
    <div v-if="loading" class="loader-overlay">
      <img src="/loading.gif" alt="Cargando..." class="loader-gif" />
    </div>

    <main v-else class="main-content">
      <h1>Casas en Alquiler</h1>

      <!-- Listado de casas en alquiler -->
      <div v-if="casasEnAlquiler.length > 0" class="lista-ofertas">
        <router-link
          v-for="casa in casasEnAlquiler"
          :key="casa.id"
          :to="`/vista-casa/${casa.id}`"
          class="tarjeta-casa"
        >
          <div class="imagen-casa">
            <img :src="casa.imagenes[0]" alt="Imagen de la casa" class="imagen-principal" />
          </div>

          <div class="detalles-casa">
            <p class="nombre-casa">{{ casa.nombre }}</p>
            <p class="ubicacion"><i class="fas fa-map-marker-alt"></i> {{ casa.direccion }}</p>
            <p class="habitaciones"><i class="fas fa-bed"></i> {{ casa.habitaciones }} Habitaciones</p>
            <p class="banos"><i class="fas fa-bath"></i> {{ casa.banos }} Baños</p>
            <p class="precio">{{ casa.precio }} €</p>
          </div>
        </router-link>
      </div>

      <!-- Mensaje si no hay propiedades en alquiler -->
      <div v-else class="no-ofertas">
        <p>No hay casas en alquiler por el momento.</p>
      </div>
    </main>

    <Header class="fixed-header" />
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore'
import Header from '../Header/Header.vue'

const loading = ref(true)
const casasEnAlquiler = ref([])

const db = getFirestore()

onMounted(() => {
  setTimeout(() => {
    loading.value = false
    cargarCasasEnAlquiler()
  }, 1500)
})

async function cargarCasasEnAlquiler() {
  const casasRef = collection(db, 'casas')
  const q = query(casasRef, where('tipo', '==', 'Alquiler')) // Filtrado por alquiler

  try {
    const querySnapshot = await getDocs(q)
    casasEnAlquiler.value = []
    querySnapshot.forEach((doc) => {
      const casa = doc.data()
      casa.id = doc.id
      casasEnAlquiler.value.push(casa)
    })
  } catch (error) {
    console.error('Error al cargar las casas en alquiler:', error)
  }
}
</script>

<style scoped>
.page-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  padding: 30px 20px 100px;
  font-family: 'Poppins', sans-serif;
  max-width: 1200px;
  margin: 0 auto;
}

h1 {
  font-size: 2.2rem;
  color: #0c0c0c;
  text-align: center;
  margin-bottom: 30px;
}

.lista-ofertas {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.tarjeta-casa {
  display: flex;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.2s ease;
  text-decoration: none;
  color: inherit;
}

.tarjeta-casa:hover {
  transform: scale(1.01);
}

.imagen-casa {
  flex: 0 0 200px;
  height: 150px;
  overflow: hidden;
}

.imagen-casa img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.detalles-casa {
  flex: 1;
  padding: 15px 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.nombre-casa {
  font-weight: 600;
  font-size: 1.4rem;
  margin-bottom: 8px;
}

.ubicacion,
.habitaciones,
.banos,
.precio {
  margin: 4px 0;
  font-size: 1rem;
  color: #444;
}

.precio {
  font-weight: bold;
  font-size: 1.2rem;
  color: #00c278;
}

.ubicacion i,
.habitaciones i,
.banos i {
  margin-right: 6px;
  color: #888;
}

/* Si no hay ofertas */
.no-ofertas {
  text-align: center;
  font-size: 1.2rem;
  margin-top: 40px;
  color: #666;
}

/* Header fijo */
.fixed-header {
  position: fixed;
  bottom: 0;
  width: 100%;
  background-color: white;
  border-top: 1px solid #ddd;
  text-align: center;
  padding: 10px 0;
  z-index: 1000;
}

/* Loader */
.loader-overlay {
  position: fixed;
  inset: 0;
  background-color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}

.loader-gif {
  width: 80px;
  height: 80px;
}
</style>
