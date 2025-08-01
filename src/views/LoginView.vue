<template>
    <div class="container mt-5" style="max-width: 400px;">
      <h2 class="mb-4 text-center">Zaloguj się</h2>
      <form @submit.prevent="login">
        <div class="mb-3">
          <label class="form-label">Email</label>
          <input v-model="email" type="email" class="form-control" required />
        </div>
        <div class="mb-3">
          <label class="form-label">Hasło</label>
          <input v-model="password" type="password" class="form-control" required />
        </div>
        <button type="submit" class="btn btn-primary w-100 mb-3">Zaloguj</button>
      </form>
  
      <button @click="loginWithGoogle" class="btn btn-danger w-100 mb-3">
        Zaloguj przez Google
      </button>
  
      <p class="text-center mt-3">
        Nie masz konta?
        <router-link to="/register">Zarejestruj się</router-link>
      </p>
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
  