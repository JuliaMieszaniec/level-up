<template>
  <div
    class="task-card rounded-4 p-4 mb-4 text-light position-relative"
    :class="{ done: task.status === 'done' }"
  >
    <!-- XP -->
    <div class="points-glow position-absolute top-0 end-0 me-3 mt-3 px-3 py-1 rounded-pill text-glow fw-bold">
      💎 {{ task.points }} XP
    </div>

    <!-- Treść -->
    <div class="d-flex justify-content-between align-items-start">
      <div class="flex-grow-1 pe-3">
        <h5 class="fw-bold task-title mb-1">{{ task.title }}</h5>
        <p class="task-desc mb-2">{{ task.description }}</p>

        <div class="badges mb-2">
          <span class="badge bg-purple me-2">📂 {{ task.category }}</span>
          <span
            v-if="task.assignedTo?.length"
            class="badge bg-dark-glow"
          >
            👥 {{ task.assignedTo.join(', ') }}
          </span>
        </div>

        <!-- Autor przypisania -->
        <div v-if="task.createdBy && task.createdBy !== currentUserEmail" class="text-light small mt-1">
          ✍️ Przypisał: {{ task.createdBy }}
        </div>
      </div>
    </div>

    <!-- Termin i akcje -->
    <div class="d-flex justify-content-between align-items-center mt-3">
      <div class="text-date small">📅 Termin: {{ formattedDate }}</div>

      <div v-if="canToggle">
        <label class="form-check-label me-2">✅</label>
        <input
          class="form-check-input"
          type="checkbox"
          :checked="task.status === 'done'"
          @change="$emit('toggle-complete', task.id)"
        />
      </div>

      <div v-if="canDelete">
        <button class="btn btn-sm btn-outline-danger" @click="$emit('delete-task', task.id)">
          🗑 Usuń
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  task: Object,
  currentUserEmail: String,
  canToggle: { type: Boolean, default: false },
  canDelete: { type: Boolean, default: false }
})

const formattedDate = computed(() => {
  if (!props.task.dueDate) return ''
  return new Date(props.task.dueDate).toLocaleDateString()
})
</script>

<style scoped>
.task-card {
  background: linear-gradient(135deg, #1e1b32, #2a2346);
  border: 1px solid rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(10px);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 0 16px rgba(185, 131, 255, 0.15);
}

.task-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 0 22px rgba(185, 131, 255, 0.3);
}

.task-title {
  color: #ffffff;
  font-size: 1.15rem;
}

.task-desc {
  color: #d0cfff;
  font-size: 0.95rem;
  line-height: 1.5;
}

.text-date {
  color: #a6afff;
  font-size: 0.85rem;
}

.bg-purple {
  background-color: #a579ff;
  color: #fff;
}

.bg-dark-glow {
  background-color: rgba(255, 255, 255, 0.06);
  color: #ddd;
  border: 1px solid rgba(255, 255, 255, 0.1);
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
