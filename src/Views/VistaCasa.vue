<!-- VistaCasa.vue -->
<template>
  <div>
    <!-- GALERÍA DE IMÁGENES -->
    <div class="galeria-imagenes">
      <!-- Recorremos el array de imágenes que hay en el objeto casa -->
      <div v-for="(imagen, indice) in casa.imagenes" :key="indice" class="imagen-container">
        <!-- Mostramos cada imagen en pantalla -->
        <img :src="imagen" :alt="`Imagen ${indice + 1}`" class="imagen-casa" />
      </div>
    </div>

    <!-- INFORMACIÓN DETALLADA DE LA CASA -->
    <section class="info-casa">
      <h2 class="titulo-info">{{ casa.nombre }} - {{ casa.precio }} €</h2>
      <p><i class="fas fa-map-marker-alt"></i> {{ casa.direccion }}</p>

      <p>
        <i class="fas fa-tag"></i> <strong>Estado:</strong> En venta
        <!-- Si está en oferta, mostramos el descuento -->
        <span v-if="casa.enOferta === true"> - <strong>Descuento:</strong> {{ casa.descuento }} €</span>
      </p>

      <!-- Más características -->
      <p><i class="fas fa-bed"></i> <strong>Habitaciones:</strong> {{ casa.habitaciones }}</p>
      <p><i class="fas fa-bath"></i> <strong>Baños:</strong> {{ casa.baños }}</p>
      <p><i class="fas fa-car"></i> <strong>Estacionamiento:</strong> {{ casa.estacionamiento }}</p>
      <p><i class="fas fa-couch"></i> <strong>Amueblado:</strong> {{ casa.amueblado }}</p>
      <p><i class="fas fa-home"></i> <strong>Tipo de propiedad:</strong> {{ casa.tipo }}</p>
    </section>

    <!-- MAPA -->
    <div id="mapa" class="mapa"></div>

    <!-- BOTÓN DE CONTACTO -->
    <div class="contacto-boton-container">
      <!-- Navega a la página de contacto -->
      <router-link to="/contacto" class="boton-contacto">Contactar con el anunciante</router-link>
    </div>
  </div>

  <!-- COMPONENTE HEADER FIJO -->
  <Header class="fixed-header" />
</template>

<script setup>
// Importaciones de Vue
import { onMounted, ref } from 'vue'               // ref: para crear variables reactivas; onMounted: se ejecuta al montar el componente
import { useRoute } from 'vue-router'              // useRoute: para leer parámetros de la URL

// Importaciones de Firebase
import { doc, getDoc } from 'firebase/firestore'   // doc: referencia a documento; getDoc: obtiene el documento
import { db } from '../firebase/firebase.js'       // configuración  Firebase

// Importación de Leaflet
import L from 'leaflet'                            // L: objeto principal de Leaflet
import 'leaflet/dist/leaflet.css'                  // estilos necesarios de Leaflet

// Importación de tu Header (no afecta al mapa)
import Header from '../components/Header/Header.vue'

// Leemos la ruta actual para obtener el parámetro "id"
const rutaActual = useRoute()

// Creamos una variable reactiva para guardar los datos de la casa
const casa = ref({ imagenes: [], direccion: '' })

// Al montar el componente, leemos los datos de Firebase
onMounted(() => {
  const idDeLaCasa = rutaActual.params.id
  const referenciaALaCasa = doc(db, 'casas', idDeLaCasa)

  getDoc(referenciaALaCasa)
    .then((resultado) => {
      if (resultado.exists()) {
        casa.value = resultado.data()
        // Damos un pequeño retraso para que el DIV del mapa exista en el DOM(cargar el mapa)
        setTimeout(mostrarMapa, 200)
      }
    })
    .catch((error) => {
      console.error('Error al cargar los datos de la casa:', error)
    })
})

// Función para crear el mapa y centrarlo en la dirección de la casa
function mostrarMapa() {
  // Si no hay dirección, no hacemos nada
  if (!casa.value.direccion) {
    return
  }

  // Creamos el mapa sin centrarlo en coordenadas por defecto
  const mapa = L.map('mapa')

  // Cargamos las baldosas de OpenStreetMap para crear eñ mapa
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(mapa)

  // Llamada a la API de Nominatim para convertir dirección en coordenadas
  const direccionCodificada = encodeURIComponent(casa.value.direccion)
  fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${direccionCodificada}`)
    .then((respuesta) => respuesta.json())
    .then((listaDeResultados) => {
      if (listaDeResultados.length === 0) {
        console.warn('No se encontraron coordenadas para esta dirección.')
        return
      }
      // Tomamos la primera coincidencia
      const resultado = listaDeResultados[0]
      const latitud = parseFloat(resultado.lat)
      const longitud = parseFloat(resultado.lon)

      // Centramos el mapa en la dirección y ponemos un marcador
      mapa.setView([latitud, longitud], 15) //lvl de zoom en el mapa
      L.marker([latitud, longitud]).addTo(mapa)
    })
    .catch((error) => {
      console.error('Error al convertir dirección en coordenadas:', error)
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
  overflow-x: hidden;
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
