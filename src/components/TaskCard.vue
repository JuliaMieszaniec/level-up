<template>
  <div
    class="task-card rounded-4 p-4 mb-4 text-light position-relative"
    :class="{ done: task.status === 'done' }"
  >
    <!-- Punkty XP -->
    <div class="points-glow position-absolute top-0 end-0 me-3 mt-3 px-3 py-1 rounded-pill text-glow fw-bold">
      💎 {{ task.points }} XP
    </div>

    <!-- Treść zadania -->
    <div class="d-flex justify-content-between align-items-start">
      <div class="flex-grow-1 pe-3">
        <h5 class="fw-bold task-title mb-1">{{ task.title }}</h5>
        <p class="task-desc mb-2">{{ task.description }}</p>
        <span class="badge bg-purple me-2">{{ task.category }}</span>
      </div>
    </div>

    <!-- Termin i checkbox -->
    <div class="d-flex justify-content-between align-items-center mt-3">
      <div class="small text-date">📅 Termin: {{ formattedDate }}</div>
      <input
        class="form-check-input"
        type="checkbox"
        :checked="task.status === 'done'"
        @change="$emit('toggle-complete', task.id)"
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  task: {
    type: Object,
    required: true,
  },
})

const formattedDate = computed(() => {
  if (!props.task.dueDate) return ''
  const date = new Date(props.task.dueDate)
  return date.toLocaleDateString()
})
</script>

<style scoped>
.task-card {
  background: linear-gradient(135deg, #1c1b29, #322c53, #1a1f36);
  border: 1px solid rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(8px);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 0 16px rgba(185, 131, 255, 0.1);
}

.task-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 0 20px rgba(185, 131, 255, 0.25);
}

.task-title {
  color: #ffffff;
  font-size: 1.1rem;
}

.task-desc {
  color: #dddddd;
  font-size: 0.9rem;
  line-height: 1.4;
}

.text-date {
  color: #a6afff;
  font-size: 0.85rem;
}

.bg-purple {
  background-color: #a579ff;
  color: #fff;
}

.done .task-title,
.done .task-desc {
  text-decoration: line-through;
  opacity: 0.6;
}

/* Glowing XP badge */
.points-glow {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid #ffc800;
  font-size: 1rem;
  color: #ffd700;
  box-shadow: 0 0 10px rgba(255, 204, 0, 0.6), 0 0 5px rgba(255, 204, 0, 0.4);
  text-shadow: 0 0 6px #ffc800;
}
</style>
