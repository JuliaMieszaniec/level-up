<template>
    <div
      class="dashboard-tile text-center p-4 rounded-4 h-100 shadow-sm tile-hover"
      @click="$emit('click')"
    >
      <h5 class="mb-1 fw-bold text-light">{{ title }}</h5>
      <slot />
    </div>
  </template>
  
  <script setup>
  defineProps({
    title: String
  })
  </script>
  
  <style scoped>
  .dashboard-tile {
    background: linear-gradient(135deg, #1d1530, #291c50);
    border: 2px solid #9f6eff55;
    transition: transform 0.2s, box-shadow 0.3s;
    cursor: pointer;
  }
  .tile-hover:hover {
    transform: translateY(-4px);
    box-shadow: 0 0 18px rgba(185, 131, 255, 0.4);
  }
  </style>
  