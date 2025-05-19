<template>
  <div class="page-container">
    <main class="main-content">
      <h1>Explorar</h1>
    </main>

    <!-- Carrusel de imágenes con información -->
    <div class="carousel-container">
      <div class="carousel" ref="carousel">
        <div
          class="carousel-item"
          v-for="(product, index) in products"
          :key="product.id"
          v-show="currentIndex === index"
          @click="goToProduct(product.id)"
          style="cursor: pointer;"
        >
          <img :src="product.imagenes[0]" :alt="product.nombre" />
          <div class="carousel-info">
            <h3>{{ product.nombre }}</h3>
            <p>Precio: {{ product.precio }} €</p>
          </div>
        </div>
      </div>

      <!-- Puntos indicadores -->
      <div class="carousel-dots">
        <span
          v-for="(product, index) in products"
          :key="index"
          class="dot"
          :class="{ active: currentIndex === index }"
          @click="currentIndex = index"
        ></span>
      </div>
    </div>

    <!-- Categorías -->
    <div class="categories">
      <div class="category" @click="goToCategory('renta')">
        <h2>Casas en Alquiler</h2>
        <img src="/2.webp" alt="Casas en Renta" />
      </div>
      <div class="category" @click="goToCategory('venta')">
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

const products = ref([]);
const rentProducts = ref([]);
const saleProducts = ref([]);
const loading = ref(true);
const currentIndex = ref(0);

// Cargar productos desde Firestore
const fetchProducts = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'casas'));
    const fetchedProducts = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    rentProducts.value = fetchedProducts.filter((product) => product.tipo === 'Renta');
    saleProducts.value = fetchedProducts.filter((product) => product.tipo === 'Venta');
    products.value = fetchedProducts;
  } catch (error) {
    console.error('Error al cargar los productos:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchProducts();

  // Auto avance del carrusel cada 4 segundos
  const interval = setInterval(() => {
    if (products.value.length > 0) {
      currentIndex.value = (currentIndex.value + 1) % products.value.length;
    }
  }, 4000);

  onUnmounted(() => {
    clearInterval(interval);
  });
});

const goToCategory = (category) => {
  if (category === 'renta') {
    router.push({ name: 'Alquiler' });
  } else if (category === 'venta') {
    router.push({ name: 'Venta' });
  }
};

// Nueva función para ir a la vista de la casa cuando se pulsa en la imagen del carrusel
const goToProduct = (id) => {
  router.push({ name: 'VistaCasa', params: { id } });
};
</script>

<style scoped>
/* Reset básico para evitar márgenes y paddings extra */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  overflow-x: hidden; /* Evita scroll horizontal global */
  width: 100vw;
}

.page-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding-bottom: 60px; /* Igual que altura del header fijo */
  animation: fadeIn 0.6s ease;
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
  color: #000000;
  margin-bottom: 10px;
  font-weight: 700;
}

/* Carrusel */
.carousel-container {
  margin-top: 0;
  display: flex;
  justify-content: center;
  position: relative;
  overflow: hidden;
  max-width: 100vw;
}

.carousel {
  display: flex;
  transition: all 0.3s ease;
  overflow-x: hidden;
  width: 100%;
}

.carousel-item {
  min-width: 100%;
  flex-shrink: 0;
  border-radius: 8px;
  position: relative;
  animation: fadeIn 0.5s ease;
}

.carousel-item img {
  width: 100%;
  height: 400px;
  object-fit: cover;
  border-radius: 8px;
}

/* Info del carrusel (nombre y precio) */
.carousel-info {
  position: absolute;
  bottom: 10px;
  left: 10px;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  padding: 10px;
  border-radius: 5px;
}

.carousel-info h3 {
  font-size: 1.5rem;
  margin-bottom: 5px;
}

.carousel-info p {
  font-size: 1.2rem;
  margin: 0;
}

/* Eliminar botones prev/next */
.carousel-prev,
.carousel-next {
  display: none;
}

/* Puntos indicadores del carrusel */
.carousel-dots {
  position: absolute;
  bottom: 15px;
  width: 100%;
  display: flex;
  justify-content: center;
  gap: 10px;
  z-index: 20;
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.dot.active {
  background-color: rgba(255, 255, 255, 0.9);
}

/* Categorías */
.categories {
  display: flex;
  justify-content: center;
  align-items: stretch;
  gap: 20px;
  margin: 20px;
  flex-wrap: wrap;
  overflow-x: hidden;
  max-width: 100vw;
  box-sizing: border-box;
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
  box-sizing: border-box;
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

/* Responsive para pantallas más pequeñas */
@media (max-width: 768px) {
  .categories {
    gap: 10px;
  }

  .category {
    flex: 1 1 45%;
    padding: 5px;
  }

  .category h2 {
    font-size: 1.1rem;
  }

  .category img {
    height: 180px;
  }

  .carousel-item img {
    height: 250px;
  }

  .carousel-info h3 {
    font-size: 1.2rem;
  }

  .carousel-info p {
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .category {
    flex: 1 1 48%;
  }

  .category h2 {
    font-size: 1rem;
  }

  .category img {
    height: 150px;
  }

  .carousel-item img {
    height: 200px;
  }

  .carousel-info h3 {
    font-size: 1rem;
  }

  .carousel-info p {
    font-size: 0.9rem;
  }
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
