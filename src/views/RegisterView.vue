<template>
  <div class="register-wrapper d-flex align-items-center justify-content-center min-vh-100">
    <div class="register-box p-4 rounded-4 shadow glassy" style="max-width: 400px; width: 100%;">
      <h2 class="text-center text-gradient mb-4 fw-bold">Rejestracja</h2>
      <form @submit.prevent="register">
        <div class="mb-3">
          <label class="form-label text-light">Imię</label>
          <input v-model="name" type="text" class="form-control" required />
        </div>
        <div class="mb-3">
          <label class="form-label text-light">Nazwisko</label>
          <input v-model="surname" type="text" class="form-control" required />
        </div>
        <div class="mb-3">
          <label class="form-label text-light">Email</label>
          <input v-model="email" type="email" class="form-control" required />
        </div>
        <div class="mb-3">
          <label class="form-label text-light">Hasło</label>
          <input v-model="password" type="password" class="form-control" required />
        </div>
        <button type="submit" class="btn btn-glow w-100">🚀 Zarejestruj się</button>
      </form>

      <p class="text-center mt-4 text-light">
        Masz już konto?
        <router-link to="/login" class="link-glow">Zaloguj się</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { auth, db } from '../firebase'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { useRouter } from 'vue-router'

const name = ref('')
const surname = ref('')
const email = ref('')
const password = ref('')
const router = useRouter()

const register = async () => {
  try {
    const cred = await createUserWithEmailAndPassword(auth, email.value, password.value)
    await setDoc(doc(db, 'users', cred.user.uid), {
      uid: cred.user.uid,
      name: name.value,
      surname: surname.value,
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

<style scoped>
.register-wrapper {
  background: linear-gradient(135deg, #14111c, #1d1530);
}

.register-box {
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

.link-glow {
  color: #b983ff;
  text-decoration: none;
}
.link-glow:hover {
  text-decoration: underline;
}
</style>
