<template>
  <section class="tile goals-tile">
    <h3>
      Cele zespołu
      <small class="text-muted ms-2">
        {{ completedCount }} / {{ totalGoals }} wykonanych
      </small>
    </h3>

    <ul class="list-group mb-3">
      <li
        v-for="(goal, index) in localGoals"
        :key="index"
        class="list-group-item d-flex align-items-center gap-3"
      >
        <input
          type="checkbox"
          v-model="localGoals[index].completed"
          @change="onToggle(index)"
        />
        <span :class="{ 'text-decoration-line-through': goal.completed }">
          {{ goal.text }}
        </span>
        <button
          class="btn btn-sm btn-outline-danger ms-auto"
          @click="removeGoal(index)"
        >
          Usuń
        </button>
      </li>
    </ul>

    <!-- Formularz tylko dla właściciela -->
    <form @submit.prevent="addGoal" class="d-flex gap-2">
      <input
        type="text"
        placeholder="Dodaj nowy cel"
        class="form-control"
        :disabled="addingGoal"
        :value="newGoalText"
        @input="$emit('update:newGoalText', $event.target.value)"
        required
      />
      <button
        type="submit"
        class="btn btn-glow"
        :disabled="addingGoal"
      >
        {{ addingGoal ? 'Dodaję...' : 'Dodaj cel' }}
      </button>
    </form>
  </section>
</template>

<script setup>
import { ref, watch, computed } from 'vue'

const props = defineProps({
  goals: {
    type: Array,
    default: () => [],
  },
  addingGoal: Boolean,
  newGoalText: String
})

const emit = defineEmits([
  'add-goal',
  'remove-goal',
  'toggle-goal',
  'update:newGoalText'
])

const localGoals = ref([])

watch(
  () => props.goals,
  (newGoals) => {
    localGoals.value = newGoals.map(g => ({ ...g }))
  },
  { immediate: true }
)

const totalGoals = computed(() => localGoals.value.length)
const completedCount = computed(() =>
  localGoals.value.filter(g => g.completed).length
)

const addGoal = () => {
  if (props.newGoalText.trim()) {
    emit('add-goal', props.newGoalText.trim())
    emit('update:newGoalText', '') // wyczyść input po dodaniu
  }
}

const removeGoal = (index) => {
  emit('remove-goal', index)
}

const onToggle = (index) => {
  emit('toggle-goal', { index, completed: localGoals.value[index].completed })
}
</script>

<style scoped>
.tile {
  background: linear-gradient(145deg, rgba(25, 19, 46, 0.95), rgba(35, 28, 60, 0.95));
  padding: 1.5rem;
  border-radius: 1rem;
  box-shadow: 0 8px 20px rgba(185, 131, 255, 0.15);
  margin-bottom: 1.5rem;
  backdrop-filter: blur(6px);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.tile:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 25px rgba(185, 131, 255, 0.25);
}

h3 {
  color: #fff;
  font-size: 1.2rem;
  margin-bottom: 1rem;
}

.text-muted {
  color: #aaa !important;
  font-weight: normal;
}

.list-group {
  border-radius: 0.75rem;
  overflow: hidden;
}

.list-group-item {
  background: rgba(255, 255, 255, 0.05);
  border: none;
  color: #fff;
  transition: background 0.2s ease;
}

.list-group-item:hover {
  background: rgba(255, 255, 255, 0.1);
}

input[type="checkbox"] {
  transform: scale(1.2);
  accent-color: #b983ff;
}

.text-decoration-line-through {
  text-decoration: line-through;
  opacity: 0.6;
}

.btn-glow {
  background: #b983ff;
  color: #fff;
  border: none;
  border-radius: 0.5rem;
  padding: 0.4rem 1rem;
  font-weight: 500;
  box-shadow: 0 0 8px rgba(185, 131, 255, 0.5);
  transition: background 0.2s ease, box-shadow 0.2s ease;
}

.btn-glow:hover {
  background: #a86eff;
  box-shadow: 0 0 12px rgba(185, 131, 255, 0.7);
}

.btn-outline-danger {
  border-color: rgba(255, 85, 85, 0.6);
  color: #ff6b6b;
}

.btn-outline-danger:hover {
  background: rgba(255, 85, 85, 0.15);
}

</style>
