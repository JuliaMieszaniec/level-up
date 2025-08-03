<template>
    <div class="app-layout d-flex flex-column min-vh-100 bg-dark text-light">
      <!-- Navbar -->
      <Navbar />
  
      <!-- Główna zawartość -->
      <main class="flex-grow-1 container py-4">
        <RouterView />
      </main>
    </div>
  </template>
  
  <script setup>
  import Navbar from '@/components/Navbar.vue'
  </script>
  
  <style scoped>
  .app-layout {
    font-family: 'Poppins', sans-serif;
    background: linear-gradient(145deg, #1f1f2e, #2a2a3d);
  }
  </style>
  