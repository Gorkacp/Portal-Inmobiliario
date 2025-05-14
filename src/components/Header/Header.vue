<template>
  <header class="header">
    <nav>
      <ul class="menu">
        <li>
          <router-link to="/" class="menu-item" :class="{ active: $route.path === '/' }">
            <i class="fas fa-home"></i>
            <span>Inicio</span>
          </router-link>
        </li>
        <li>
          <router-link to="/ofertas" class="menu-item" :class="{ active: $route.path === '/ofertas' }">
            <i class="fas fa-briefcase"></i>
            <span>Ofertas</span>
          </router-link>
        </li>
        <li>
          <router-link to="/perfil" class="menu-item" :class="{ active: $route.path === '/perfil' }">
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
/* Asegura que el contenedor principal ocupa todo el ancho y se alinea correctamente */
.header {
  background-color: white;
  padding: 10px 20px;
  color: #333;
  border-bottom: 1px solid #ddd;
  display: flex; /* Flexbox para el contenedor */
  justify-content: center; /* Centra el contenido */
}

.menu {
  list-style: none;
  display: flex;
  justify-content: center; /* Centra los elementos dentro de la lista */
  gap: 200px; /* Espacio entre los botones */
  margin: 0;
  padding: 0;
}

.menu li {
  display: inline;
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

/* Tablet */
@media (max-width: 1024px) {
  .menu {
    gap: 150px; /* Ajusta el espacio entre los botones en tabletas */
  }

  .menu i {
    font-size: 1.3rem;
  }

  .menu a {
    font-size: 0.85rem;
  }
}

/* Móvil grande */
@media (max-width: 768px) {
  .menu {
    gap: 125px; /* Ajusta el espacio entre los botones en móviles grandes */
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
    gap: 100px; /* Ajusta el espacio entre los botones en móviles pequeños */
    justify-content: center; /* Asegura que el menú esté centrado */
  }

  .menu i {
    font-size: 1.1rem;
  }

  .menu a {
    font-size: 0.75rem;
  }
}
</style>
