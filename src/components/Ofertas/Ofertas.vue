<template>
  <div class="page-container">
    <!-- GIF de carga -->
    <div v-if="cargando" class="loader-overlay">
      <img src="/loading.gif" alt="Cargando..." class="loader-gif" />
    </div>

    <main v-else class="main-content">
      <h1>Casas en Oferta</h1>

      <!-- Listado de casas en oferta -->
      <div v-if="listaCasasOferta.length > 0" class="lista-ofertas">
        <router-link
          v-for="casa in listaCasasOferta"
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

      <!-- Mensaje si no hay propiedades en oferta -->
      <div v-else class="no-ofertas">
        <p>No hay casas en oferta por el momento.</p>
      </div>
    </main>
  </div>
  <Header class="fixed-header" />
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore'
import Header from '../Header/Header.vue'

// Variables en español
const cargando = ref(true)
const listaCasasOferta = ref([])

const baseDatos = getFirestore()

// El hook onMounted se ejecuta justo después de que el componente se monte en la página
onMounted(() => {
  obtenerCasasEnOferta() // Llamamos directamente a la función sin simular tiempos
})

// Función para obtener casas que están en oferta
function obtenerCasasEnOferta() {
  // Creamos una referencia a la colección 'casas' en la base de datos
  const referenciaCasas = collection(baseDatos, 'casas')

  // Creamos una consulta para filtrar las casas que tienen el campo 'enOferta' igual a true
  const consulta = query(referenciaCasas, where('enOferta', '==', true)) //, limit(10)); Si quiero mostrar esa cantidad en vez de infinito

  // Ejecutamos la consulta para obtener los documentos que cumplen la condición
  getDocs(consulta)
    .then((resultadoConsulta) => { // Si la conexion con la bd es exitosa se procede
      // Limpiamos la lista de casas en oferta antes de llenarla con los nuevos resultados
      listaCasasOferta.value = []
      // Recorremos cada documento obtenido en la consulta
      resultadoConsulta.forEach((documento) => { //Recorremos el array
        // Obtenemos los datos de la casa del documento
        const casa = documento.data()

        // Agregamos el id del documento a los datos de la casa para identificarla
        casa.id = documento.id

        // Añadimos la casa a la lista de casas en oferta
        listaCasasOferta.value.push(casa)
      })
    })
    // Capturamos cualquier error que ocurra al obtener las casas y lo mostramos en consola
    .catch((error) => {
      console.error('Error al obtener casas en oferta:', error)
    })
    .finally(() => {
      cargando.value = false // Se indica que la carga ha terminado (se oculta el loader) solo cuando termina la consulta real
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
