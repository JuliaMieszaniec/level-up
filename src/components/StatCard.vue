<template>
    <div class="stat-card p-3 rounded shadow-sm h-100 d-flex flex-column justify-content-between">
      <!-- Ikona i tytuł -->
      <div class="d-flex justify-content-between align-items-center mb-2">
        <h6 class="text-uppercase fw-semibold text-secondary">{{ title }}</h6>
        <span class="icon fs-3">{{ icon }}</span>
      </div>
  
      <!-- Wartość i opis -->
      <div class="mb-2">
        <h3 class="fw-bold text-light">{{ value }}</h3>
        <p class="text-muted mb-0">{{ description }}</p>
      </div>
  
      <!-- Pasek postępu -->
      <div class="progress rounded-pill bg-secondary-subtle mt-2" style="height: 8px;">
        <div
          class="progress-bar bg-gradient"
          role="progressbar"
          :style="{ width: progress + '%' }"
          :aria-valuenow="progress"
          aria-valuemin="0"
          aria-valuemax="100"
        ></div>
      </div>
    </div>
  </template>
  
  <script setup>
  defineProps({
    title: String,
    value: [String, Number],
    description: String,
    icon: String,
    progress: Number
  })
  </script>
  
  <style scoped>
  .stat-card {
    background: linear-gradient(135deg, #2b2b3d, #1f1f2e);
    border: 1px solid #3c3c5a;
    color: #ddd;
    transition: all 0.3s ease;
  }
  .stat-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 0 15px rgba(160, 120, 255, 0.3);
  }
  .bg-gradient {
    background: linear-gradient(to right, #b983ff, #9f6eff);
  }
  .icon {
    filter: drop-shadow(0 0 4px rgba(185, 131, 255, 0.5));
  }
  </style>
  