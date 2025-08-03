<template>
  <div class="app bg-dark text-light min-vh-100">
    <router-view />
  </div>
</template>

<script setup>
// nic nie trzeba importować tutaj – Navbar i auth są w AppLayout.vue
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
