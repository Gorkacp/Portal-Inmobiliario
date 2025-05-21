<template>
  <div v-if="estaLogueado" class="pagina-perfil">
    <button @click="cerrarSesion" class="boton-logout">Cerrar sesión</button>

    <h1>Mi Perfil</h1>

    <section class="seccion-detalles">
      <h2>
        Datos personales
        <span class="cambiar" @click="modoEdicion = !modoEdicion">
          {{ modoEdicion ? 'Cancelar' : 'Editar' }}
        </span>
      </h2>

      <div class="tarjeta-usuario">
        <template v-if="modoEdicion">
          <input v-model="nuevoNombre" placeholder="Nombre" />
          <input v-model="nuevoEmail" placeholder="Email" />
          <button @click="guardarCambios" class="boton-guardar">Guardar</button>
        </template>
        <template v-else>
          <p><strong>{{ usuario.displayName || 'Nombre no disponible' }}</strong></p>
          <p>{{ usuario.email }}</p>
        </template>
      </div>

      <div class="tarjeta-opcion" @click="irAPublicar">
        <i class="fas fa-home icono-casa"></i>
        <span>Publicar casa en venta o alquiler</span>
        <i class="fas fa-arrow-right icono-flecha"></i>
      </div>

      <div class="seccion-publicaciones" v-if="misPublicaciones.length > 0">
        <h2>Mis publicaciones</h2>
        <div
          v-for="publicacion in misPublicaciones"
          :key="publicacion.id"
          class="tarjeta-publicacion"
          @click="irAVistaCasa(publicacion.id)"
          style="cursor: pointer;"
        >
          <div class="contenido-publicacion">
            <div class="info-publicacion">
              <p>{{ publicacion.nombre }}</p>
              <p>{{ publicacion.direccion }}</p>
              <p>{{ publicacion.precio }} €</p>
            </div>

            <div class="imagenes-publicacion">
              <img
                v-for="img in publicacion.imagenes"
                :src="img"
                :key="img"
                class="imagen-publicacion"
              />
            </div>
          </div>

          <div class="botones-publicacion" @click.stop>
            <button @click="irAEditar(publicacion.id)">Editar</button>
            <button @click="eliminarPublicacion(publicacion.id)">Eliminar</button>
          </div>
        </div>
      </div>

      <div v-else class="sin-publicaciones">
        <h2>Mis publicaciones</h2>
        <p>No has publicado ninguna vivienda aún.</p>
      </div>
    </section>
  </div>

  <Header class="fixed-header" />
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { auth } from '../../firebase/firebase';
import {
  onAuthStateChanged,
  signOut,
  updateProfile,
  updateEmail,
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  doc,
  deleteDoc,
} from 'firebase/firestore';
import Header from '../Header/Header.vue';

const usuario = ref(null);
const estaLogueado = ref(false);
const modoEdicion = ref(false);
const nuevoNombre = ref('');
const nuevoEmail = ref('');
const misPublicaciones = ref([]);

const router = useRouter();
const db = getFirestore();

function cerrarSesion() {
  signOut(auth)
    .then(() => {
      router.push('/login');
    })
    .catch((error) => {
      console.error('Error al cerrar sesión:', error);
    });
}

function irAPublicar() {
  router.push('/publicar');
}

function guardarCambios() {
  // Verificamos si hay un usuario autenticado actualmente
  if (auth.currentUser) {
    // Actualizamos el nombredel usuario actual
    updateProfile(auth.currentUser, { displayName: nuevoNombre.value })
      .then(() => { // Si la conexion con la bd es exitosa se procede
        // Si el nuevo email es diferente al que tiene el usuario actual, actualizamos el email
        if (nuevoEmail.value !== auth.currentUser.email) {
          // Retornamos la promesa de updateEmail para que se encadene en la siguiente then()
          return updateEmail(auth.currentUser, nuevoEmail.value);
        }
      })
      .then(() => { // Si la conexion con la bd es exitosa se procede
        // Cuando las actualizaciones hayan terminado, desactivamos el modo edición
        modoEdicion.value = false;
        // Volvemos a verificar la sesión para refrescar los datos del usuario
        verificarSesion();
      })
      .catch((error) => {
        console.error('Error al guardar cambios:', error);
      });
  }
}


function cargarPublicacionesUsuario(uid) {
  // Creamos una referencia a la colección "casas" en la base de datos Firestore
  const publicacionesRef = collection(db, 'casas');
  
  // Creamos una consulta para filtrar solo las publicaciones donde
  // el campo 'usuarioID' sea igual al 'uid' que recibe la función
  const consulta = query(publicacionesRef, where('usuarioID', '==', uid));

  // Ejecutamos la consulta para obtener los documentos que coincidan
  getDocs(consulta)
    .then((resultado) => { // Si la conexion con la bd es exitosa se procede
      // Cuando tenemos el resultado, limpiamos el array 'misPublicaciones'
      misPublicaciones.value = [];
      
      // Recorremos cada documento que nos devolvió la consulta
      resultado.forEach((docu) => {
        // Obtenemos los datos del documento (la información de la publicación)
        const publicacion = docu.data();
        
        // Añadimos al objeto 'publicacion' una propiedad 'id' con el id del documento
        publicacion.id = docu.id;
        
        // Añadimos la publicación al array reactivo 'misPublicaciones'
        misPublicaciones.value.push(publicacion);
      });
    })
    .catch((error) => {
      console.error('Error al obtener publicaciones:', error);
    });
}


function irAEditar(idPublicacion) {
  router.push({ name: 'Publicar', params: { id: idPublicacion } });
}

function eliminarPublicacion(idPublicacion) {
  const publicacionRef = doc(db, 'casas', idPublicacion);

  // Usamos la función deleteDoc para eliminar ese documento de Firestore
  deleteDoc(publicacionRef)
    .then(() => { // Si la conexion con la bd es exitosa se procede
      // Si la eliminación fue exitosa, recargamos las publicaciones del usuario
      // para actualizar la vista y mostrar que se ha eliminado la publicación
      cargarPublicacionesUsuario(usuario.value.uid);
    })
    .catch((error) => {
      // Si hubo un error al intentar eliminar el documento, lo mostramos por consola
      console.error('Error al eliminar publicación:', error);
    });
}


function irAVistaCasa(id) {
  router.push({ name: 'VistaCasa', params: { id } });
}

function verificarSesion() {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      usuario.value = user;
      estaLogueado.value = true;
      nuevoNombre.value = user.displayName || '';
      nuevoEmail.value = user.email || '';
      cargarPublicacionesUsuario(user.uid);
    } else {
      estaLogueado.value = false;
      router.push('/login');
    }
  });
}

onMounted(() => {
  verificarSesion();
});
</script>

<style scoped>
.pagina-perfil {
  background-color: #f3f5f9;
  min-height: 100vh;
  padding: 40px 20px;
  font-family: sans-serif;
  position: relative;
}

.boton-logout {
  position: absolute;
  top: 20px;
  right: 30px;
  background-color: #00c278;
  color: white;
  border: none;
  padding: 10px 18px;
  border-radius: 20px;
  font-weight: bold;
  cursor: pointer;
}

h1 {
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 30px;
}

.seccion-detalles h2 {
  font-size: 18px;
  margin-bottom: 10px;
  font-weight: bold;
}

.cambiar {
  float: right;
  color: #00c278;
  font-weight: 600;
  cursor: pointer;
}

.tarjeta-usuario {
  background: white;
  padding: 20px;
  border-radius: 10px;
  text-align: left;
  margin-bottom: 20px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.tarjeta-usuario input {
  display: block;
  width: 100%;
  margin-bottom: 10px;
  padding: 10px;
  font-size: 16px;
  border-radius: 6px;
  border: 1px solid #ccc;
}

.boton-guardar {
  background-color: #00c278;
  color: white;
  padding: 10px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
}

.boton-guardar:hover {
  background-color: #00a964;
}

.tarjeta-opcion {
  background: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 20px;
  border-radius: 10px;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  margin-top: 20px;
}

.icono-casa {
  font-size: 20px;
  margin-right: 10px;
}

.icono-flecha {
  font-size: 20px;
  color: #00c278;
}

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

.seccion-publicaciones {
  margin-top: 30px;
}

.tarjeta-publicacion {
  background: white;
  padding: 15px;
  margin-bottom: 15px;
  border-radius: 10px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.sin-publicaciones {
  margin-top: 30px;
  background: #fff3f3;
  padding: 15px;
  border-radius: 10px;
  text-align: center;
  color: #000000;
}

.imagenes-publicacion {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 10px;
}

.imagen-publicacion {
  width: 120px;
  height: 90px;
  object-fit: cover;
  border-radius: 8px;
}

.botones-publicacion {
  margin-top: 10px;
  display: flex;
  gap: 10px;
}

.botones-publicacion button {
  background-color: #00c278;
  color: white;
  padding: 10px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.botones-publicacion button:hover {
  background-color: #00a964;
}
</style>
