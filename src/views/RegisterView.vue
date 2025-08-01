<template>
    <div class="container mt-5" style="max-width: 400px;">
      <h2 class="mb-4 text-center">Rejestracja</h2>
      <form @submit.prevent="register">
        <div class="mb-3">
          <label class="form-label">Imię</label>
          <input v-model="name" class="form-control" required />
        </div>
        <div class="mb-3">
          <label class="form-label">Email</label>
          <input v-model="email" type="email" class="form-control" required />
        </div>
        <div class="mb-3">
          <label class="form-label">Hasło</label>
          <input v-model="password" type="password" class="form-control" required />
        </div>
        <button class="btn btn-success w-100">Zarejestruj się</button>
      </form>
      <p class="text-center mt-3">
        Masz już konto?
        <router-link to="/login">Zaloguj się</router-link>
      </p>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { auth, db } from '../firebase'
  import { createUserWithEmailAndPassword } from 'firebase/auth'
  import { doc, setDoc } from 'firebase/firestore'
  import { useRouter } from 'vue-router'
  
  const name = ref('')
  const email = ref('')
  const password = ref('')
  const router = useRouter()
  
  const register = async () => {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email.value, password.value)
      await setDoc(doc(db, 'users', cred.user.uid), {
        uid: cred.user.uid,
        name: name.value,
        email: email.value,
        role: 'członek',
        xp: 0,
        level: 1,
        badges: [],
        teamId: null
      })
      router.push('/dashboard')
    } catch (err) {
      alert('Błąd rejestracji: ' + err.message)
    }
  }
  </script>
  