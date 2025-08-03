<template>
  <div class="login-wrapper d-flex align-items-center justify-content-center min-vh-100">
    <div class="login-box p-4 rounded-4 shadow glassy" style="max-width: 400px; width: 100%;">
      <h2 class="text-center text-gradient mb-4 fw-bold">Zaloguj się</h2>
      <form @submit.prevent="login">
        <div class="mb-3">
          <label class="form-label text-light">Email</label>
          <input v-model="email" type="email" class="form-control" required />
        </div>
        <div class="mb-3">
          <label class="form-label text-light">Hasło</label>
          <input v-model="password" type="password" class="form-control" required />
        </div>
        <button type="submit" class="btn btn-glow w-100">🚀 Zaloguj się</button>
      </form>

      <button @click="loginWithGoogle" class="btn btn-outline-glow w-100 mt-3">
        🔒 Zaloguj przez Google
      </button>

      <p class="text-center mt-4 text-light">
        Nie masz konta?
        <router-link to="/register" class="link-glow">Zarejestruj się</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { auth } from '../firebase'
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const router = useRouter()

const login = async () => {
  try {
    await signInWithEmailAndPassword(auth, email.value, password.value)
    router.push('/dashboard')
  } catch (err) {
    alert('Błąd logowania: ' + err.message)
  }
}

const loginWithGoogle = async () => {
  const provider = new GoogleAuthProvider()
  try {
    await signInWithPopup(auth, provider)
    router.push('/dashboard')
  } catch (err) {
    alert('Błąd logowania Google: ' + err.message)
  }
}
</script>

<style scoped>
.login-wrapper {
  background: linear-gradient(135deg, #14111c, #1d1530);
}

.login-box {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.text-gradient {
  background: linear-gradient(to right, #9f6eff, #b983ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.btn-glow {
  background: linear-gradient(90deg, #9f6eff, #b983ff);
  color: #fff;
  border: none;
  box-shadow: 0 0 10px rgba(185, 131, 255, 0.6);
  transition: 0.2s;
}
.btn-glow:hover {
  transform: scale(1.03);
}

.btn-outline-glow {
  background: transparent;
  color: #b983ff;
  border: 2px solid #9f6eff;
}
.btn-outline-glow:hover {
  background: #9f6eff33;
}

.link-glow {
  color: #b983ff;
  text-decoration: none;
}
.link-glow:hover {
  text-decoration: underline;
}
</style>
