<template>
  <div>
    <!-- Galería de imágenes a ancho completo -->
    <div class="galeria-imagenes">
      <!-- Recorremos el array de imágenes de la casa -->
      <div v-for="(imagen, indice) in casa.imagenes" :key="indice" class="imagen-container">
        <!-- Mostramos cada imagen con su ruta y un texto alternativo -->
        <img :src="imagen" :alt="`Imagen ${indice + 1}`" class="imagen-casa" />
      </div>
    </div>

    <!-- Información de la casa con texto alineado a la izquierda -->
    <section class="info-casa">
      <h2 class="titulo-info">{{ casa.nombre }} - {{ casa.precio }} €</h2>
      <p><i class="fas fa-map-marker-alt"></i> {{ casa.direccion }}</p>
      <p>
        <i class="fas fa-tag"></i> <strong>Estado:</strong> En venta
        <span v-if="casa.enOferta === true"> - <strong>Descuento:</strong> {{ casa.descuento }} €</span>
      </p>
      <p><i class="fas fa-bed"></i> <strong>Habitaciones:</strong> {{ casa.habitaciones }}</p>
      <p><i class="fas fa-bath"></i> <strong>Baños:</strong> {{ casa.baños }}</p>
      <p><i class="fas fa-car"></i> <strong>Estacionamiento:</strong> {{ casa.estacionamiento }}</p>
      <p><i class="fas fa-couch"></i> <strong>Amueblado:</strong> {{ casa.amueblado }}</p>
      <p><i class="fas fa-home"></i> <strong>Tipo de propiedad:</strong> {{ casa.tipo }}</p>
    </section>

    <!-- Contenedor del mapa a ancho completo -->
    <div id="mapa" class="mapa"></div>

    <!-- Botón para contactar al anunciante -->
    <div class="contacto-boton-container">
      <router-link to="/contacto" class="boton-contacto">Contactar con el anunciante</router-link>
    </div>

    <!-- Componente Header fijo en la parte inferior -->
    <Header class="fixed-header" />
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase/firebase.js'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import Header from '../components/Header/Header.vue'

// Usamos la ruta actual para obtener el parámetro 'id' de la casa
const route = useRoute()

// Definimos una variable reactiva para almacenar los datos de la casa
const casa = ref({ imagenes: [] })

// Cuando el componente se monta, hacemos la consulta a Firestore para obtener los datos de la casa
onMounted(async () => {
  const idCasa = route.params.id // Obtenemos el ID de la casa desde la URL
  const referenciaDocumento = doc(db, 'casas', idCasa) // Referencia al documento Firestore
  const documento = await getDoc(referenciaDocumento) // Obtenemos el documento

  if (documento.exists()) {
    casa.value = documento.data() // Guardamos los datos de la casa en la variable reactiva

    // Esperamos un poco para asegurar que el DOM esté actualizado y luego mostramos el mapa
    setTimeout(() => {
      mostrarMapa()
    }, 200)
  }
})

// Función para mostrar el mapa con la ubicación de la casa
function mostrarMapa() {
  // Si no hay dirección definida, no hacemos nada
  if (!casa.value.direccion) return

  // Inicializamos el mapa Leaflet en el div con id "mapa"
  // Centramos inicialmente el mapa en unas coordenadas por defecto (Granada, España) y con zoom 13
  const mapaLeaflet = L.map('mapa').setView([37.1773, -3.5986], 13)

  // Añadimos las baldosas (tiles) del mapa usando OpenStreetMap
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(mapaLeaflet)

  // Usamos la API de Nominatim de OpenStreetMap para geocodificar la dirección (convertir texto a coordenadas)
  fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(casa.value.direccion)}`)
    .then(respuesta => respuesta.json()) // Convertimos la respuesta a JSON
    .then(datos => {
      // Si recibimos resultados de la búsqueda
      if (datos.length > 0) {
        const latitud = datos[0].lat // Latitud del primer resultado
        const longitud = datos[0].lon // Longitud del primer resultado

        // Cambiamos la vista del mapa a la ubicación encontrada con zoom 15
        mapaLeaflet.setView([latitud, longitud], 15)

        // Añadimos un marcador en la posición encontrada
        L.marker([latitud, longitud]).addTo(mapaLeaflet)
      }
    })
    .catch(error => {
      console.error('Error al obtener la ubicación:', error)
    })
}
</script>

<style>
/* Estilos globales */
body {
  margin: 0;
  background-color: #e5e7eb;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Galería imágenes a ancho completo */
.galeria-imagenes {
  width: 100vw;
  max-width: 100%;
  margin: 0;
  padding: 0;
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
}

.imagen-container {
  flex: 0 0 100vw;
  scroll-snap-align: start;
  position: relative;
  overflow: hidden;
  margin: 0;
  box-shadow: none;
}

.imagen-casa {
  width: 100%;
  height: 300px;
  object-fit: cover;
  display: block;
  transition: transform 0.3s ease;
}

.imagen-container:hover .imagen-casa {
  transform: scale(1.05);
}

/* Información de la casa */
.info-casa {
  width: 100vw;
  max-width: 100%;
  background-color: white;
  padding: 20px 24px;
  box-sizing: border-box;
  color: #1f2937;
  font-size: 1.1rem;
  font-weight: 500;
  border-top: 1px solid #ddd;
  border-bottom: 1px solid #ddd;
  box-shadow: 0 4px 12px rgb(0 0 0 / 0.05);
  text-align: left;
}

.info-casa p {
  margin: 10px 0;
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.info-casa i {
  color: #10b981;
  min-width: 20px;
}

.titulo-info {
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 16px;
  color: #1f2937;
  text-align: left;
}

/* Contenedor del mapa */
.mapa {
  width: 100vw;
  height: 300px;
  margin: 0;
  padding: 0;
  border-radius: 0;
  box-shadow: none;
}

/* Header fijo al pie */
.fixed-header {
  position: fixed;
  bottom: 0;
  width: 100%;
  background-color: white;
  border-top: 1px solid #ddd;
  text-align: center;
  padding: 12px 0;
  z-index: 1000;
  font-weight: 600;
  font-size: 1.1rem;
}

/* Contenedor del botón de contacto */
.contacto-boton-container {
  width: 100%;
  text-align: center;
  margin: 30px 0 100px 0; /* Margen inferior para espacio */
}

/* Estilo del botón */
.boton-contacto {
  background-color: #10b981;
  color: white;
  padding: 12px 24px;
  font-size: 1.1rem;
  border-radius: 8px;
  text-decoration: none;
  transition: background-color 0.3s ease;
  font-weight: bold;
}

.boton-contacto:hover {
  background-color: #0e9f6e;
}

/* Estilos responsivos */

/* Pantallas pequeñas móviles */
@media (max-width: 480px) {
  .imagen-casa {
    height: 200px;
  }

  .info-casa {
    font-size: 1rem;
    padding: 16px 16px;
  }

  .titulo-info {
    font-size: 1.4rem;
  }

  .mapa {
    height: 250px;
  }
}

/* Tablets y pantallas medianas */
@media (min-width: 481px) and (max-width: 768px) {
  .imagen-casa {
    height: 280px;
  }

  .info-casa {
    font-size: 1.05rem;
    padding: 20px 32px;
  }

  .titulo-info {
    font-size: 1.6rem;
  }

  .mapa {
    height: 300px;
  }
}

/* Escritorio pequeño en adelante */
@media (min-width: 769px) {
  .imagen-casa {
    height: 400px;
  }

  .info-casa {
    font-size: 1.1rem;
    padding: 24px 40px;
  }

  .titulo-info {
    font-size: 1.8rem;
  }

  .mapa {
    height: 400px;
  }
}
</style>
