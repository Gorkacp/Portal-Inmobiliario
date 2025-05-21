// Esta función se usa para crear una nueva aplicación Vue.
import { createApp } from 'vue';

// Importa el componente raíz de la aplicación (`App.vue`), 
import App from './App.vue';

// Importa los estilos de Font Awesome para que puedas usar sus iconos
import '@fortawesome/fontawesome-free/css/all.css';

// Importa el enrutador 
import router from './router';

// Crea una instancia de la aplicación Vue usando el componente raíz `App`
const app = createApp(App);

// Conecta el enrutador a la instancia de la aplicación.
// Esto hace que puedas usar <router-view />, <router-link /> y navegación entre páginas.
app.use(router);

// Monta (inicializa) la aplicación y la inyecta en el elemento del DOM con id `#app`
// (que normalmente está en tu archivo `index.html`)
app.mount('#app');
