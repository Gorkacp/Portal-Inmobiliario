// Importa las funciones necesarias desde el paquete de Firebase

// Esto te permite iniciar la app de Firebase con tus datos de configuración
import { initializeApp } from "firebase/app";

// Esto sirve para usar la autenticación (login, registro de usuarios)
import { getAuth } from "firebase/auth";

// Esto te permite usar Firestore (una base de datos en la nube)
import { getFirestore } from "firebase/firestore";

// Esto te permite usar Firebase Storage (almacenamiento de imágenes o archivos)
import { getStorage } from "firebase/storage";


// Configuracion de firebase
const firebaseConfig = {
  apiKey: "AIzaSyBbT_kupYZxlUd8I_07xR3ry8Uki8UaBMo", // Clave única para conectarte con Firebase
  authDomain: "portal-inmobiliario-a76c4.firebaseapp.com", // Dominio para autenticar usuarios
  projectId: "portal-inmobiliario-a76c4", // ID del proyecto en Firebase
  storageBucket: "portal-inmobiliario-a76c4.appspot.com", // URL del almacenamiento de archivos
  messagingSenderId: "709838614898", // ID del emisor de mensajes 
  appId: "1:709838614898:web:f6883e6f64b9ef352e6deb", // ID de la app 
};


// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Ahora exportamos los servicios que vamos a utilizar en otras partes del proyecto.
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);