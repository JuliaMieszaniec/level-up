<template>
    <div class="container mt-4">
      <div class="mb-4">
        <h2>Witaj, {{ user?.name || '...' }} 👋</h2>
        <p>Poziom: {{ user?.level }} | XP: {{ user?.xp }}/{{ nextLevelXP }}</p>
        <div class="progress" style="height: 20px;">
          <div class="progress-bar bg-success" :style="{ width: progressBar + '%' }">
            {{ progressBar.toFixed(1) }}%
          </div>
        </div>
      </div>
  
      <div class="row g-3">
        <div class="col-6 col-md-4" v-for="tile in tiles" :key="tile.title">
          <router-link :to="tile.route" class="text-decoration-none">
            <div class="card text-center bg-dark text-white h-100">
              <div class="card-body">
                <i :class="tile.icon" style="font-size: 2rem;"></i>
                <p class="mt-2">{{ tile.title }}</p>
              </div>
            </div>
          </router-link>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue'
  import { useAuth } from '../composables/useAuth'
  
  const { user } = useAuth()
  
  const tiles = [
    { title: 'Zadania', route: '/tasks', icon: 'bi bi-check2-circle' },
    { title: 'Zespół', route: '/team', icon: 'bi bi-people' },
    { title: 'Ranking', route: '/ranking', icon: 'bi bi-bar-chart' },
    { title: 'Baza wiedzy', route: '/knowledge', icon: 'bi bi-journal-bookmark' },
    { title: 'Profil', route: '/profile', icon: 'bi bi-person-circle' }
  ]
  
  const nextLevelXP = computed(() => (Math.floor((user?.value?.xp || 0) / 1000) + 1) * 1000)
  const progressBar = computed(() => {
    const xp = user.value?.xp || 0
    const levelBase = nextLevelXP.value - 1000
    return ((xp - levelBase) / 1000) * 100
  })
  </script>
  
  <style scoped>
  .card {
    cursor: pointer;
    transition: transform 0.2s;
  }
  .card:hover {
    transform: scale(1.05);
  }
  </style>
  