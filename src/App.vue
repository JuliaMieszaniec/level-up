<template>
  <div class="app bg-dark text-light min-vh-100">
    <!-- Pasek nawigacyjny tylko dla zalogowanych -->
    <Navbar v-if="isLoggedIn" />
    
    <!-- Główna treść strony -->
    <router-view />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './firebase'
import Navbar from './components/Navbar.vue' // Twój pasek nawigacyjny

const isLoggedIn = ref(false)

// Nasłuchuj zmian w logowaniu
onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    isLoggedIn.value = !!user
  })
})
</script>

<style>
body {
  margin: 0;
  font-family: 'Segoe UI', sans-serif;
  background-color: #121212;
}

.app {
  min-height: 100vh;
}
</style>
