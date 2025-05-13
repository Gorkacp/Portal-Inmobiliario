<template>
  <div class="contenedor-vista">
    <h1>{{ casa.nombre }}</h1>

    <div class="contenido">
      <img :src="casa.imagenes[0]" alt="Imagen principal" class="imagen-casa" />

      <div class="info">
        <p><strong>Tipo:</strong> {{ casa.tipo }}</p>
        <p><strong>Habitaciones:</strong> {{ casa.habitaciones }}</p>
        <p><strong>Baños:</strong> {{ casa.baños }}</p>
        <p><strong>Estacionamiento:</strong> {{ casa.estacionamiento }}</p>
        <p><strong>Amueblado:</strong> {{ casa.amueblado }}</p>
        <p><strong>Dirección:</strong> {{ casa.direccion }}</p>
        <p><strong>Precio:</strong> {{ casa.precio }} €</p>
        <p v-if="casa.enOferta === true"><strong>Descuento:</strong> {{ casa.descuento }} €</p>
      </div>
    </div>

    <div id="mapa" class="mapa"></div>
  </div>
  <Header class="fixed-header" />
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase/firebase.js' 
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import Header from '../components/Header/Header.vue'

const route = useRoute()
const casa = ref({ imagenes: [] })

onMounted(async () => {
  const id = route.params.id
  const docRef = doc(db, 'casas', id)
  const docSnap = await getDoc(docRef)

  if (docSnap.exists()) {
    casa.value = docSnap.data()

    setTimeout(() => {
      mostrarMapa()
    }, 200)
  }
})

function mostrarMapa() {
  if (!casa.value.direccion) return

  const mapa = L.map('mapa').setView([37.1773, -3.5986], 13) // Granada por defecto
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(mapa)

  fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${casa.value.direccion}`)
    .then(res => res.json())
    .then(data => {
      if (data.length > 0) {
        const { lat, lon } = data[0]
        mapa.setView([lat, lon], 15)
        L.marker([lat, lon]).addTo(mapa)
      }
    })
}
</script>

<style scoped>
.contenedor-vista {
  max-width: 1000px;
  margin: auto;
  padding: 20px;
  font-family: 'Segoe UI', sans-serif;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Sombra suave */
}

h1 {
  text-align: center;
  margin-bottom: 20px;
  color: #333;
  font-size: 2rem; /* Título más grande */
}

.contenido {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  justify-content: space-between; /* Para asegurar separación adecuada */
}

.imagen-casa {
  width: 60%;
  height: auto;
  border-radius: 10px;
  object-fit: cover;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Sombra suave */
}

.info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
  font-size: 16px;
  padding-left: 20px; /* Separación de la imagen */
}

.info p {
  line-height: 1.5; /* Para una mejor legibilidad */
}

.mapa {
  width: 100%;
  height: 400px;
  border-radius: 10px;
  margin-top: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Sombra suave */
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
</style>
