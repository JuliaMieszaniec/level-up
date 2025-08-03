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
      <p class="stat-description mb-0">{{ description }}</p>
    </div>

    <!-- Pasek postępu -->
    <div class="xp-bar-container mt-2">
      <div
        class="xp-fill"
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
.icon {
  filter: drop-shadow(0 0 4px rgba(185, 131, 255, 0.5));
}
.stat-description {
  color: #ccc;
  font-size: 0.9rem;
  margin-top: 0.2rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Pasek XP */
.xp-bar-container {
  height: 10px;
  width: 100%;
  border-radius: 999px;
  background-color: #2c2c3e;
  overflow: hidden;
}

.xp-fill {
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, #b983ff, #d77eff, #ffc700);
  transition: width 0.8s ease-in-out;
  box-shadow: inset 0 0 8px rgba(255, 255, 255, 0.2),
              0 0 8px rgba(255, 215, 0, 0.3);
}
</style>
