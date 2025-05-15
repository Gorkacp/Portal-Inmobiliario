<template>
    <div class="login-page">
      <div class="login-card">
        <h1 class="title">¡Regístrate!</h1>
  
        <!-- Mostrar mensaje de error si existe -->
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
  
        <form @submit.prevent="registrarUsuario" class="form">
          <!-- Nombre -->
          <div class="input-pill">
            <span class="icon"><i class="fa fa-id-badge"></i></span>
            <input
              v-model="nombre"
              type="text"
              placeholder="Nombre completo"
              required
            />
          </div>
  
          <!-- Correo -->
          <div class="input-pill">
            <span class="icon"><i class="fa fa-envelope"></i></span>
            <input
              v-model="correo"
              type="email"
              placeholder="Correo electrónico"
              required
            />
          </div>
  
          <!-- Contraseña -->
          <div class="input-pill">
            <span class="icon"><i class="fa fa-lock"></i></span>
            <input
              :type="mostrarContrasena ? 'text' : 'password'"
              v-model="contrasena"
              placeholder="Contraseña"
              required
            />
            <span class="icon eye" @click="mostrarContrasena = !mostrarContrasena">
              <i :class="mostrarContrasena ? 'fa fa-eye-slash' : 'fa fa-eye'" />
            </span>
          </div>
  
          <button type="submit" class="btn-submit">
            <i class="fa fa-user-plus"></i>
          </button>
        </form>
  
        <div class="divider">O registra con</div>
  
        <button @click="registrarConGoogle" class="btn-google">
          <img src="https://developers.google.com/identity/images/g-logo.png" alt="Logo de Google" width="24" height="24" />
        </button>
  
        <router-link to="/login" class="signup-link">
          ¿Ya tienes cuenta? Inicia sesión
        </router-link>
      </div>
  
      <!-- Footer fijo -->
      <Header class="fixed-footer" />
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  
  import { auth, db } from '../../firebase/firebase';
  import {
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
    updateProfile
  } from 'firebase/auth';
  import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
  
  import Header from '../Header/Header.vue';
  
  const nombre = ref('');
  const correo = ref('');
  const contrasena = ref('');
  const mostrarContrasena = ref(false);
  const errorMessage = ref('');
  const router = useRouter();
  
  async function registrarUsuario() {
    errorMessage.value = '';
    try {
      const { user } = await createUserWithEmailAndPassword(auth, correo.value, contrasena.value);
      await updateProfile(user, { displayName: nombre.value });
      await addDoc(collection(db, 'users'), {
        uid: user.uid,
        nombre: nombre.value,
        email: correo.value,
        createdAt: serverTimestamp()
      });
      router.push('/perfil');
    } catch (error) {
      console.error('Error al registrar:', error.message);
      errorMessage.value = formatearError(error.code);
    }
  }
  
  async function registrarConGoogle() {
    errorMessage.value = '';
    try {
      const provider = new GoogleAuthProvider();
      const { user } = await signInWithPopup(auth, provider);
      await addDoc(collection(db, 'users'), {
        uid: user.uid,
        nombre: user.displayName || '',
        email: user.email,
        createdAt: serverTimestamp()
      });
      router.push('/perfil');
    } catch (error) {
      console.error('Error Google signup:', error.message);
      errorMessage.value = 'No se pudo registrar con Google.';
    }
  }
  
  function formatearError(code) {
    switch (code) {
      case 'auth/email-already-in-use':
        return 'El correo ya está en uso.';
      case 'auth/invalid-email':
        return 'El correo no es válido.';
      case 'auth/weak-password':
        return 'La contraseña debe tener al menos 6 caracteres.';
      default:
        return 'Error al registrar. Intenta nuevamente.';
    }
  }
  </script>
  
  <style scoped>
  /* Estilo base para la página de login */
.login-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f0f1f6;
  justify-content: center;
  align-items: center;
}

.login-card {
  width: 100%;
  max-width: 400px;
  background: white;
  border-radius: 12px;
  padding: 2rem 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  text-align: left;
}

.title {
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
}

.input-pill {
  position: relative;
  display: flex;
  align-items: center;
  background: #fff;
  border-radius: 999px;
  padding: 0.5rem 1rem;
  margin-bottom: 1rem;
  border: 1px solid #e0e0e0;
}

.input-pill .icon {
  margin-right: 0.75rem;
  color: #9e9e9e;
  font-size: 1rem;
}

.input-pill input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 1rem;
}

.input-pill .eye {
  margin-left: 0.75rem;
  cursor: pointer;
  color: #9e9e9e;
}

.btn-submit {
  background: #1abc9c;
  border: none;
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: white;
  font-size: 1.2rem;
  box-shadow: 0 4px 12px rgba(26, 188, 156, 0.3);
  margin-top: 0.5rem;
}

.btn-submit:hover {
  background: #17a589;
}

.divider {
  text-align: center;
  font-size: 0.875rem;
  color: #888;
  margin: 2rem 0 1rem;
  position: relative;
}

.divider::before,
.divider::after {
  content: '';
  position: absolute;
  top: 50%;
  width: 35%;
  height: 1px;
  background: #ddd;
}

.divider::before {
  left: 0;
}

.divider::after {
  right: 0;
}

.btn-google {
  display: block;
  margin: 0 auto 1.5rem;
  background: white;
  border: 1px solid #e0e0e0;
  padding: 0.75rem;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.btn-google img {
  width: 24px;
  height: 24px;
}

.signup-link {
  display: block;
  text-align: center;
  font-size: 0.875rem;
  color: #1abc9c;
  text-decoration: none;
  margin-top: 0.5rem;
}

.signup-link:hover {
  text-decoration: underline;
}

.fixed-footer {
  position: fixed;
  bottom: 0;
  width: 100%;
}

.error-message {
  color: #e74c3c;
  font-size: 0.9rem;
  margin-bottom: 1rem;
  text-align: center;
}

/* Media Queries para Responsividad */
@media (max-width: 768px) {
  .login-card {
    padding: 1.5rem 1rem;
  }

  .title {
    font-size: 1.5rem;
    text-align: center;
  }

  .input-pill {
    padding: 0.5rem;
    margin-bottom: 0.75rem;
  }

  .input-pill input {
    font-size: 0.95rem;
  }

  .btn-submit {
    width: 2.5rem;
    height: 2.5rem;
    font-size: 1rem;
  }

  .btn-google {
    padding: 0.5rem;
  }

  .signup-link {
    font-size: 0.75rem;
  }
}

@media (max-width: 480px) {
  .login-card {
    padding: 1rem;
  }

  .title {
    font-size: 1.25rem;
  }

  .input-pill input {
    font-size: 0.9rem;
  }

  .btn-submit {
    width: 2.2rem;
    height: 2.2rem;
    font-size: 0.9rem;
  }

  .btn-google {
    padding: 0.5rem;
  }

  .signup-link {
    font-size: 0.75rem;
  }
}

  </style>