<template>
  <div class="login-page">
    <div class="login-card">
      <h1 class="title">¡Bienvenido!</h1>

      <!-- Mensaje de error -->
      <p v-if="error" class="error-message">{{ error }}</p>

      <form @submit.prevent="iniciarSesionConCorreo" class="form">
        <!-- Input Correo -->
        <div class="input-pill">
          <span class="icon">
            <i class="fa fa-user"></i>
          </span>
          <input
            v-model="correo"
            type="email"
            placeholder="Correo electrónico"
            @input="error = ''"
            required
          />
        </div>

        <!-- Input Contraseña -->
        <div class="input-pill">
          <span class="icon">
            <i class="fa fa-lock"></i>
          </span>
          <input
            :type="mostrarContrasena ? 'text' : 'password'"
            v-model="contrasena"
            placeholder="Contraseña"
            @input="error = ''"
            required
          />
          <span class="icon eye" @click="mostrarContrasena = !mostrarContrasena">
            <i :class="mostrarContrasena ? 'fa fa-eye-slash' : 'fa fa-eye'"></i>
          </span>
        </div>

        <div class="form-footer">
          <router-link to="/forgot-password" class="forgot">
            ¿Olvidaste tu contraseña?
          </router-link>
          <button type="submit" class="btn-submit">
            <i class="fa fa-arrow-right"></i>
          </button>
        </div>
      </form>

      <div class="divider">O iniciar sesión con</div>

      <button @click="iniciarSesionConGoogle" class="btn-google">
        <img src="https://developers.google.com/identity/images/g-logo.png" alt="Logo de Google" width="24" height="24" />
      </button>

      <router-link to="/register" class="signup-link">
        Regístrate
      </router-link>
    </div>

    <!-- Footer fijo -->
    <Header class="fixed-footer" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { auth } from '../../firebase/firebase';
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { useRouter } from 'vue-router';
import Header from '../Header/Header.vue';

const correo = ref('');
const contrasena = ref('');
const mostrarContrasena = ref(false);
const error = ref('');
const router = useRouter();

async function iniciarSesionConCorreo() {
  error.value = '';
  try {
    await signInWithEmailAndPassword(auth, correo.value, contrasena.value);
    router.push('/perfil');
  } catch (e) {
    console.error(e);
    error.value = 'Correo o contraseña incorrectos.';
  }
}

async function iniciarSesionConGoogle() {
  error.value = '';
  const provider = new GoogleAuthProvider();
  try {
    await signInWithPopup(auth, provider);
    router.push('/perfil');
  } catch (e) {
    console.error(e);
    error.value = 'No se pudo iniciar sesión con Google.';
  }
}
</script>

<style scoped>
/* Diseño general */
.login-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f0f1f6;
  justify-content: center;
  align-items: center;
  padding: 20px;
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

/* Título */
.title {
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
}

/* Mensaje de error */
.error-message {
  color: #e74c3c;
  background-color: #fdecea;
  border: 1px solid #e0b4b4;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  font-size: 0.95rem;
  text-align: center;
}

/* Inputs “píldora” */
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

/* Pie del formulario: Olvidaste + botón */
.form-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: -0.5rem;
}
.forgot {
  font-size: 0.875rem;
  color: #1abc9c;
  text-decoration: none;
}
.forgot:hover {
  text-decoration: underline;
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
}
.btn-submit:hover {
  background: #17a589;
}

/* Divisor */
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

/* Botón Google */
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

/* Link de registro */
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

/* Footer fijo */
.fixed-footer {
  position: fixed;
  bottom: 0;
  width: 100%;
}

/* Estilos responsivos */
@media (max-width: 1024px) {
  .login-card {
    width: 90%;
  }

  .title {
    font-size: 1.5rem;
  }

  .input-pill input {
    font-size: 0.95rem;
  }

  .btn-submit {
    width: 2.5rem;
    height: 2.5rem;
    font-size: 1rem;
  }

  .divider {
    font-size: 0.8rem;
  }
}

@media (max-width: 768px) {
  .login-card {
    width: 80%;
  }

  .title {
    font-size: 1.4rem;
  }

  .input-pill input {
    font-size: 1rem;
  }

  .btn-submit {
    width: 2.2rem;
    height: 2.2rem;
    font-size: 1rem;
  }

  .divider {
    font-size: 0.8rem;
  }
}

@media (max-width: 480px) {
  .login-card {
    width: 95%;
  }

  .title {
    font-size: 1.3rem;
  }

  .input-pill input {
    font-size: 1rem;
  }

  .btn-submit {
    width: 2rem;
    height: 2rem;
    font-size: 1rem;
  }

  .divider {
    font-size: 0.7rem;
  }

  .btn-google {
    padding: 0.5rem;
  }

  .signup-link {
    font-size: 0.75rem;
  }
}
</style>
