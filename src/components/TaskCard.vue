<template>
  <div
    class="task-card shadow rounded-4 p-3 mb-3 d-flex flex-column justify-content-between bg-dark text-light"
    :class="{ done: task.status === 'done' }"
  >
    <div class="d-flex justify-content-between align-items-start">
      <div>
        <h5 class="mb-1 fw-bold task-title">{{ task.title }}</h5>
        <p class="mb-1 small text-muted task-desc">{{ task.description }}</p>
        <div class="small">
          <span class="badge bg-purple me-2">{{ task.category }}</span>
          <span class="text-warning fw-semibold">💰 {{ task.points }} pkt</span>
        </div>
      </div>
      <div>
        <input
          class="form-check-input mt-1"
          type="checkbox"
          :checked="task.status === 'done'"
          @change="$emit('toggle-complete', task.id)"
        />
      </div>
    </div>
    <div class="text-end mt-2 small text-secondary">
      Termin: {{ formattedDate }}
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
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  cursor: default;
}

.task-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 0 15px rgba(255, 230, 120, 0.3);
}

.bg-purple {
  background-color: #9f6eff;
}

/* Wykreślenie tekstu dla ukończonych zadań */
.done .task-title,
.done .task-desc {
  text-decoration: line-through;
  opacity: 0.6;
  transition: opacity 0.3s ease;
}
</style>
