<template>
  <section class="tile skills-tile">
    <h3>
      Umiejętności zespołu
      <small class="text-muted ms-2">
        {{ completedCount }} / {{ totalSkills }} opanowanych
      </small>
    </h3>

    <ul class="list-group mb-3">
      <li
        v-for="(skill, index) in skills"
        :key="index"
        class="list-group-item d-flex align-items-center gap-3"
      >
        <input
          type="checkbox"
          v-model="skill.completed"
          @change="() => onToggle(index)"
        />
        <span :class="{ 'text-decoration-line-through': skill.completed }">
          {{ skill.text }}
        </span>
        <button
          class="btn btn-sm btn-outline-danger ms-auto"
          @click="() => removeSkill(index)"
        >
          Usuń
        </button>
      </li>
    </ul>

    <form @submit.prevent="handleAddSkill" class="d-flex gap-2">
      <input
        v-model="newSkillText"
        type="text"
        placeholder="Dodaj nową umiejętność"
        class="form-control"
        :disabled="adding"
        required
      />
      <button
        type="submit"
        class="btn btn-glow"
        :disabled="adding || !newSkillText.trim()"
      >
        {{ adding ? 'Dodaję...' : 'Dodaj umiejętność' }}
      </button>
    </form>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  skills: {
    type: Array,
    default: () => [],
  },
  adding: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['add-skill', 'remove-skill', 'toggle-skill'])

const newSkillText = ref('')

const totalSkills = computed(() => props.skills.length)
const completedCount = computed(() =>
  props.skills.filter(s => s.completed).length
)

const handleAddSkill = () => {
  if (!newSkillText.value.trim()) return
  emit('add-skill', newSkillText.value.trim())
  newSkillText.value = ''
}

const removeSkill = (index) => {
  emit('remove-skill', index)
}

const onToggle = (index) => {
  emit('toggle-skill', { 
    index, 
    completed: props.skills[index].completed 
  })
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