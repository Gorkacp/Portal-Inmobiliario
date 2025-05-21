<template>
  <div class="page-container">
    <!-- GIF de carga -->
    <div v-if="cargando" class="loader-overlay">
      <img src="/loading.gif" alt="Cargando..." class="loader-gif" />
    </div>

    <main v-else class="main-content">
      <h1>Casas en Venta</h1>

      <!-- Listado de casas en venta -->
      <div v-if="casasEnVenta.length > 0" class="lista-ofertas">
        <router-link
          v-for="casa in casasEnVenta"
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
            <p class="banos"><i class="fas fa-bath"></i> {{ casa.baños }} Baños</p>
            <p class="precio">{{ casa.precio }} €</p>
          </div>
        </router-link>
      </div>

      <!-- Mensaje si no hay propiedades en venta -->
      <div v-else class="no-ofertas">
        <p>No hay casas en venta por el momento.</p>
      </div>
    </main>
  </div>
  <Header class="fixed-header" />
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore'
import Header from '../Header/Header.vue'

// Variable reactiva para mostrar el loader
const cargando = ref(true)

// Variable reactiva para almacenar las casas en venta
const casasEnVenta = ref([])

// Obtener la instancia de Firestore
const baseDatos = getFirestore()

// El hook onMounted se ejecuta justo después de que el componente se monte en la página
onMounted(() => {
  // Llamamos a la función que carga las casas en venta
  cargarCasasEnVenta()
})

// Función para cargar las casas 
function cargarCasasEnVenta() {
  // Referencia a la colección 'casas'
  const referenciaCasas = collection(baseDatos, 'casas')

  // Consulta para filtrar solo casas de tipo venta
  const consulta = query(referenciaCasas, where('tipo', '==', 'Venta'))

  // Ejecutar la consulta y obtener los documentos
  getDocs(consulta)
    .then(resultadoConsulta => { // Si la conexion con la bd es exitosa se procede
      // Vaciar el array antes de llenarlo
      casasEnVenta.value = []

      // Recorrer cada documento del resultado
      resultadoConsulta.forEach(doc => {
        const casa = doc.data() // Obtener los datos del documento
        casa.id = doc.id        // Agregar el id del documento
        casasEnVenta.value.push(casa) // Añadir al array reactivo
      })

      // Se indica que la carga ha terminado (se oculta el loader)
      cargando.value = false
    })
    .catch(error => {
      console.error('Error al cargar las casas en venta:', error)
      // También ocultamos el loader para que no quede bloqueado en carga
      cargando.value = false
    })
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

/* RESPONSIVE DESIGN */
@media (max-width: 1024px) {
  .main-content {
    padding: 20px 15px 80px;
  }

  .tarjeta-casa {
    flex-direction: column;
  }

  .imagen-casa {
    width: 100%;
    height: 200px;
  }

  .detalles-casa {
    padding: 15px;
    align-items: flex-start;
  }
}

@media (max-width: 768px) {
  h1 {
    font-size: 1.8rem;
  }

  .nombre-casa {
    font-size: 1.2rem;
  }

  .ubicacion,
  .habitaciones,
  .banos,
  .precio {
    font-size: 0.95rem;
  }

  .imagen-casa {
    height: 180px;
  }
}

@media (max-width: 480px) {
  h1 {
    font-size: 1.5rem;
  }

  .main-content {
    padding: 20px 10px 70px;
  }

  .tarjeta-casa {
    box-shadow: none;
    border: 1px solid #eee;
  }

  .imagen-casa {
    height: 160px;
  }

  .nombre-casa {
    font-size: 1.1rem;
  }

  .ubicacion,
  .habitaciones,
  .banos,
  .precio {
    font-size: 0.9rem;
  }

  .precio {
    font-size: 1rem;
  }

  .fixed-header {
    padding: 8px 0;
    font-size: 0.9rem;
  }

  .loader-gif {
    width: 60px;
    height: 60px;
  }
}
</style>