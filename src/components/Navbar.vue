<template>
    <nav class="navbar navbar-expand-lg navbar-dark bg-black px-3 shadow-sm">
      <div class="container-fluid">
        <router-link class="navbar-brand fw-bold text-success" to="/dashboard">LevelUp</router-link>
  
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
  
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto">
            <li class="nav-item">
              <router-link class="nav-link" to="/tasks">Zadania</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/team">Zespół</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/ranking">Ranking</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/knowledge">Baza wiedzy</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/profile">Profil</router-link>
            </li>
          </ul>
  
          <button class="btn btn-outline-danger btn-sm" @click="logout">
            Wyloguj się
          </button>
        </div>
      </div>
    </nav>
  </template>
  
  <script setup>
  import { useRouter } from 'vue-router'
  import { signOut } from 'firebase/auth'
  import { auth } from '../firebase'
  
  const router = useRouter()
  
  const logout = async () => {
    await signOut(auth)
    router.push('/login')
  }
  </script>
  
  <style scoped>
  .navbar {
    font-size: 1rem;
    border-bottom: 1px solid #222;
  }
  
  .nav-link {
    transition: 0.2s;
  }
  .nav-link:hover {
    color: #00ffae !important;
  }
  
  .navbar-brand {
    font-family: 'Orbitron', sans-serif;
    font-size: 1.4rem;
    letter-spacing: 1px;
  }
  </style>
  