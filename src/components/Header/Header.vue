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
  .header {
    background-color: white; /* Fondo blanco */
    padding: 10px 20px;
    color: #333;
    border-bottom: 1px solid #ddd; /* Línea sutil debajo del header */
  }
  
  .menu {
    list-style: none;
    display: flex;
    justify-content: center; /* Centra los elementos del menú */
    gap: 200px; /* Aumenta el espacio entre los elementos del menú */
    margin: 0;
    padding: 0;
  }
  
  .menu li {
    display: inline;
  }
  
  .menu a {
    display: flex;
    flex-direction: column; /* Apila el icono y el texto verticalmente */
    align-items: center;
    gap: 5px; /* Espacio entre el icono y el texto */
    color: #888; /* Color más claro para los enlaces inactivos */
    text-decoration: none;
    font-weight: bold;
    font-size: 0.9rem;
    transition: color 0.3s ease; /* Transición suave para el color */
  }
  
  .menu a:hover {
    color: #555; /* Color más oscuro al pasar el mouse */
  }
  
  .menu a.active {
    color: #000000; /* Color más oscuro para el enlace activo */
  }
  
  .menu i {
    font-size: 1.5rem; /* Tamaño de los iconos */
  }
  </style>