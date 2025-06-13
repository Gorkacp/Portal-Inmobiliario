<template>
  <div class="page-container">
    <!-- GIF de carga -->
    <div v-if="cargando" class="loader-overlay">
      <img src="/loading.gif" alt="Cargando..." class="loader-gif" />
    </div>

    <main class="main-content">
      <h1>Explorar</h1>
    </main>

    <!-- Carrusel de imágenes con información -->
    <div class="carousel-container">
      <div class="carousel" ref="carousel">
        <div
          class="carousel-item"
          v-for="(producto, indice) in productos"
          :key="producto.id"
          v-show="indiceActual === indice"
          @click="irAProducto(producto.id)"
          style="cursor: pointer;"
        >
          <img :src="producto.imagenes[0]" :alt="producto.nombre" />
          <div class="carousel-info">
            <h3>{{ producto.nombre }}</h3>
            <p>Precio: {{ producto.precio }} €</p>
          </div>
        </div>
      </div>

      <!-- Puntos indicadores -->
      <div class="carousel-dots">
        <span
          v-for="(producto, indice) in productos"
          :key="indice"
          class="dot"
          :class="{ active: indiceActual === indice }"
          @click="indiceActual = indice"
        ></span>
      </div>
    </div>

    <!-- Categorías -->
    <div class="categories">
      <div class="category" @click="irACategoria('renta')">
        <h2>Casas en Alquiler</h2>
        <img src="/2.webp" alt="Casas en Renta" />
      </div>
      <div class="category" @click="irACategoria('venta')">
        <h2>Casas en Venta</h2>
        <img src="/1.webp" alt="Casas en Venta" />
      </div>
    </div>
  </div>
  <Header class="fixed-header" />
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { db } from '../../firebase/firebase';
import { collection, getDocs } from 'firebase/firestore';
import Header from '../Header/Header.vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const productos = ref([]);
const productosRenta = ref([]);
const productosVenta = ref([]);
const cargando = ref(true);
const indiceActual = ref(0);

function obtenerProductos() {
  getDocs(collection(db, 'casas'))
    .then((querySnapshot) => {
      const productosObtenidos = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      productosRenta.value = productosObtenidos.filter(producto => producto.tipo === 'Renta');
      productosVenta.value = productosObtenidos.filter(producto => producto.tipo === 'Venta');
      const productosAleatorios = productosObtenidos
        .sort(() => Math.random() - 0.5)
        .slice(0, 4);
      productos.value = productosAleatorios;
    })
    .catch(error => {
      console.error('Error al cargar los productos:', error);
    })
    .finally(() => {
      cargando.value = false;
    });
}

onMounted(() => {
  obtenerProductos();

  const intervalo = setInterval(() => {
    if (productos.value.length > 0) {
      indiceActual.value = (indiceActual.value + 1) % productos.value.length;
    }
  }, 4000);

  onUnmounted(() => {
    clearInterval(intervalo);
  });
});

const irACategoria = (categoria) => {
  router.push({ name: categoria === 'renta' ? 'Alquiler' : 'Venta' });
};

const irAProducto = (id) => {
  router.push({ name: 'VistaCasa', params: { id } });
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  overflow-x: hidden;
  width: 100vw;
}

.page-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding-bottom: 60px;
  animation: fadeIn 0.6s ease;
  max-width: 100vw; /* Evita overflow horizontal */
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.main-content {
  text-align: left;
  padding: 20px;
  font-family: 'Poppins', sans-serif;
}

h1 {
  color: #000;
  margin-bottom: 10px;
  font-weight: 700;
}

/* Carrusel */
.carousel-container {
  margin-top: 0;
  position: relative;
  overflow: hidden;
  width: 100%;
  max-width: 100vw;
  padding: 0 16px;
  box-sizing: border-box;
}

.carousel {
  display: flex;
  transition: all 0.3s ease;
  overflow: hidden;
  width: 100%;
  border-radius: 12px;
}

.carousel-item {
  min-width: 100%;
  flex-shrink: 0;
  position: relative;
}

.carousel-item img {
  width: 100%;
  height: 400px;
  object-fit: cover;
  border-radius: 12px;
}

.carousel-info {
  position: absolute;
  bottom: 10px;
  left: 10px;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  padding: 10px;
  border-radius: 5px;
  max-width: 90%;
}

.carousel-info h3 {
  font-size: 1.5rem;
  margin-bottom: 5px;
}

.carousel-info p {
  font-size: 1.2rem;
  margin: 0;
}

/* Puntos indicadores */
.carousel-dots {
  position: absolute;
  bottom: 10px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  gap: 10px;
  z-index: 2;
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.dot.active {
  background-color: #fff;
}

/* Categorías */
.categories {
  display: flex;
  justify-content: center;
  align-items: stretch;
  gap: 20px;
  margin: 20px;
  flex-wrap: wrap;
  max-width: 100vw;
  overflow-x: hidden; /* <--- Evita barra horizontal al hacer hover */
}

.category {
  flex: 1 1 300px;
  min-width: 280px;
  text-align: center;
  cursor: pointer;
  transition: transform 0.3s ease;
  background-color: #f9f9f9;
  border-radius: 10px;
  padding: 10px;
  will-change: transform;
  /* Añadir esto para que no provoque overflow por transform */
  transform-origin: center center;
}

.category:hover {
  transform: scale(1.03);
}

.category h2 {
  font-size: 1.5rem;
  margin-bottom: 10px;
}

.category img {
  width: 100%;
  height: 250px;
  object-fit: cover;
  border-radius: 8px;
  transition: transform 0.3s ease-in-out;
}

.category img:hover {
  transform: scale(1.05);
}

/* Responsive */
@media (max-width: 768px) {
  .carousel-item img {
    height: 250px;
  }

  .carousel-info h3 {
    font-size: 1.2rem;
  }

  .carousel-info p {
    font-size: 1rem;
  }

  .category {
    flex: 1 1 45%;
  }

  .category img {
    height: 180px;
  }
}

@media (max-width: 480px) {
  .carousel-item img {
    height: 200px;
  }

  .carousel-info h3 {
    font-size: 1rem;
  }

  .carousel-info p {
    font-size: 0.9rem;
  }

  .category {
    flex: 1 1 100%;
  }

  .category img {
    height: 150px;
  }
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
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(255, 255, 255, 0.8);
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
