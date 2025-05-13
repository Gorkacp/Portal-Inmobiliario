// Importa las funciones necesarias de Firebase
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBbT_kupYZxlUd8I_07xR3ry8Uki8UaBMo", // Clave de API
  authDomain: "portal-inmobiliario-a76c4.firebaseapp.com",
  projectId: "portal-inmobiliario-a76c4",
  storageBucket: "portal-inmobiliario-a76c4.appspot.com",
  messagingSenderId: "709838614898",
  appId: "1:709838614898:web:f6883e6f64b9ef352e6deb",};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Exporta los servicios que usarás
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);