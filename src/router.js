import { createRouter, createWebHistory } from 'vue-router';
import Inicio from './components/Inicio/Inicio.vue';
import Login from './components/Login/Login.vue';
import Offers from './components/Ofertas/Ofertas.vue';
import Profile from './components/Perfil/Perfil.vue';
import Register from './components/Login/Register.vue';
import Publicar from './components/Publicar/Publicar.vue'; 
import VistaCasa from './Views/VistaCasa.vue'; 
import Ventas from './components/Venta/Venta.vue';
import Alquiler from './components/Alquiler/Alquiler.vue';
import Contacto from './components/Contacto/Contacto.vue';


const routes = [
  { path: '/', name: 'Inicio', component: Inicio },
  { path: '/ofertas', name: 'Ofertas', component: Offers },
  { path: '/perfil', name: 'Perfil', component: Profile },
  { path: '/login', name: 'Login', component: Login },
  { path: '/register', name: 'Register', component: Register },
  { path: '/publicar', name: 'Publicar', component: Publicar },
  { path: '/publicar/:id', name: 'EditarPublicacion', component: Publicar, props: true },
  { path: '/vista-casa/:id', name: 'VistaCasa', component: VistaCasa, props: true }, 
  { path: '/venta', name: 'Venta', component: Ventas },  
  { path: '/alquiler', name: 'Alquiler', component: Alquiler },
  { path: '/contacto', name: 'Contacto', component: Contacto},
];


const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
