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
        >
          <img :src="product.imagenes[0]" :alt="product.nombre" />
          <div class="carousel-info">
            <h3>{{ product.nombre }}</h3>
            <p>Precio: {{ product.precio }} €</p>
          </div>
        </div>
      </div>
      <!-- Flechas de navegación -->
      <button class="carousel-prev" @click="moveCarousel('prev')">◀</button>
      <button class="carousel-next" @click="moveCarousel('next')">▶</button>
    </div>

    <!-- Categorías -->
    <div class="categories">
      <!-- Categoría de Alquiler -->
      <div class="category" @click="goToCategory('renta')">
        <h2>Casas en Alquiler</h2>
        <img src="/2.webp" alt="Casas en Renta" />
      </div>

      <!-- Categoría de Venta -->
      <div class="category" @click="goToCategory('venta')">
        <h2>Casas en Venta</h2>
        <img src="/1.webp" alt="Casas en Venta" />
      </div>
    </div>

    <Header class="fixed-header" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
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

// Llamar a la función al montar el componente
onMounted(() => {
  fetchProducts();
});

// Método para hacer el desplazamiento del carrusel
const moveCarousel = (direction) => {
  if (direction === 'next') {
    if (currentIndex.value < products.value.length - 1) {
      currentIndex.value++;
    } else {
      currentIndex.value = 0;
    }
  } else {
    if (currentIndex.value > 0) {
      currentIndex.value--;
    } else {
      currentIndex.value = products.value.length - 1;
    }
  }
};

// Función para redirigir a las categorías
const goToCategory = (category) => {
  if (category === 'renta') {
    router.push({ name: 'Alquiler' });  // Cambié 'Renta' por 'Alquiler'
  } else if (category === 'venta') {
    router.push({ name: 'Venta' });  // Cambié 'Venta' por 'Venta'
  }
};

</script>

<style scoped>
.page-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding-bottom: 60px; /* Espacio para el header fijo */
}

.main-content {
  text-align: left;
  padding: 20px;
  font-family: 'Poppins', sans-serif;
}

h1 {
  color: #000000;
  margin-bottom: 10px;
  font-family: 'Poppins', sans-serif;
  font-weight: 700;
}

p {
  margin-bottom: 20px;
  font-size: 1.2rem;
  color: #ffffff;
  font-family: 'Poppins', sans-serif;
}

/* Carrusel */
.carousel-container {
  margin-top: 0px;
  display: flex;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.carousel {
  display: flex;
  gap: 0px;
  transition: all 0.3s ease;
  scroll-snap-type: x mandatory;
  overflow-x: hidden;
}

.carousel-item {
  min-width: 100%;
  flex-shrink: 0;
  border-radius: 8px;
  position: relative;
}

.carousel-item img {
  width: 100%;
  height: 400px;
  object-fit: cover;
  border-radius: 8px;
}

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
  margin: 0;
  font-size: 1.2rem;
  font-weight: bold;
}

.carousel-info p {
  margin: 5px 0;
  font-size: 1rem;
}

/* Botones de navegación del carrusel */
.carousel-prev, .carousel-next {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  padding: 10px;
  font-size: 1.5rem;
  cursor: pointer;
  z-index: 10;
}

.carousel-prev {
  left: 10px;
}

.carousel-next {
  right: 10px;
}

/* Categorías */
.categories {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  margin-top: 10px;
}

.category {
  flex: 1;
  text-align: center;
  cursor: pointer;
  position: relative;
}

.category h2 {
  font-size: 1.5rem;
  margin-bottom: 10px;
}

.category img {
  width: 100%;
  height: 300px; /* Cambié la altura de la imagen para hacerla más visible */
  object-fit: cover;
  border-radius: 8px;
  transition: transform 0.3s ease;
}

.category img:hover {
  transform: scale(1.05);
}

/* Header fijo como Footer */
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
