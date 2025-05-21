<template>
  <header class="header">
    <nav>
      <ul class="menu">
        <li>
          <router-link to="/" class="menu-item" :class="{ active: $route.path === '/' }"> <!-- para la ruta de inicio -->
            <i class="fas fa-home"></i>
            <span>Inicio</span>
          </router-link>
        </li>
        <li>
          <router-link to="/ofertas" class="menu-item" :class="{ active: $route.path === '/ofertas' }"> <!-- para la ruta de ofertas -->
            <i class="fas fa-briefcase"></i>
            <span>Ofertas</span>
          </router-link>
        </li>
        <li>
          <router-link to="/perfil" class="menu-item" :class="{ active: $route.path === '/perfil' }"> <!-- para la ruta de perfil -->
            <i class="fas fa-user"></i>
            <span>Perfil</span>
          </router-link>
        </li>
      </ul>
    </nav>
  </header>
</template>

<script setup>
</script>






<style scoped>
.header {
  background-color: white;
  padding: 10px 20px;
  color: #333;
  border-bottom: 1px solid #ddd;
  display: flex;
  justify-content: center;
  width: 100%;
  max-width: 100vw;
  overflow-x: hidden;
}

.menu {
  list-style: none;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 30px; /* Cambiado a un valor fijo más pequeño */
  margin: 0;
  padding: 0;
}

.menu li {
  /* Quitamos display inline para no interferir con flex */
}

.menu a {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  color: #888;
  text-decoration: none;
  font-weight: bold;
  font-size: 0.9rem;
  transition: color 0.3s ease;
}

.menu a:hover {
  color: #555;
}

.menu a.active {
  color: #000000;
}

.menu i {
  font-size: 1.5rem;
}

@media (min-width: 1400px) {
  .menu {
    gap: 280px;
  }
}


/* Tablet */
@media (max-width: 1024px) {
  .menu {
    gap: 120px;
  }
}

/* Móvil grande */
@media (max-width: 768px) {
  .menu {
    gap: 100px;
  }

  .menu i {
    font-size: 1.2rem;
  }

  .menu a {
    font-size: 0.8rem;
  }
}

/* Móvil pequeño */
@media (max-width: 480px) {
  .menu {
    gap: 80px;
  }

  .menu i {
    font-size: 1.1rem;
  }

  .menu a {
    font-size: 0.75rem;
  }
}
</style>
