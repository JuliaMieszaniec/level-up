<template>
  <div class="team-members p-3 glassy rounded shadow-sm">
    <h4 class="mb-3 neon-text">Członkowie zespołu</h4>

    <ul class="list-group mb-3" v-if="members.length">
      <li 
        v-for="member in members" 
        :key="member.email" 
        class="list-group-item d-flex justify-content-between align-items-center"
      >
        <div class="d-flex align-items-center gap-2">
          <img 
            :src="member.avatarUrl || defaultAvatar" 
            alt="avatar" 
            class="avatar rounded-circle"
          />
          <div>
            <div class="fw-bold">{{ member.nickname || member.email }}</div>
            <small class="text-muted">{{ member.email }}</small>
          </div>
        </div>

        <button 
          v-if="canManage && member.email !== currentUserEmail" 
          @click="remove(member.email)" 
          class="btn btn-sm btn-outline-danger"
          title="Usuń członka"
        >
          ✖
        </button>
      </li>
    </ul>

    <div v-else class="text-muted mb-3">Brak członków w zespole.</div>

    <form @submit.prevent="onAddMember" class="d-flex gap-2">
      <input
        v-model="newMemberEmail"
        type="email"
        class="form-control"
        placeholder="Dodaj członka (email)"
        :disabled="adding"
        required
      />
      <button type="submit" class="btn btn-glow" :disabled="adding">
        {{ adding ? 'Dodaję...' : 'Dodaj' }}
      </button>
    </form>

    <div v-if="error" class="text-danger mt-2">{{ error }}</div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  members: { type: Array, default: () => [] },
  currentUserEmail: { type: String, required: true },
  canManage: { type: Boolean, default: false }
})

const emit = defineEmits(['addMember', 'removeMember'])

const defaultAvatar = 'https://via.placeholder.com/40x40.png?text=U'
const newMemberEmail = ref('')
const adding = ref(false)
const error = ref('')

const validateEmail = (email) => {
  const re = /\S+@\S+\.\S+/
  return re.test(email)
}

const onAddMember = async () => {
  error.value = ''
  if (!validateEmail(newMemberEmail.value.trim())) {
    error.value = 'Podaj poprawny adres email.'
    return
  }
  adding.value = true
  try {
    await emit('addMember', newMemberEmail.value.trim())
    newMemberEmail.value = ''
  } catch (e) {
    error.value = e.message || 'Błąd podczas dodawania członka.'
  } finally {
    adding.value = false
  }
}

const remove = (email) => {
  if (confirm(`Czy na pewno chcesz usunąć członka: ${email}?`)) {
    emit('removeMember', email)
  }
}
</script>

<style scoped>
.team-members {
  background: rgba(25, 19, 46, 0.9);
  backdrop-filter: blur(8px);
  border: 1px solid #b983ff55;
}

.neon-text {
  background: linear-gradient(90deg, #b983ff, #7f5af0);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 700;
}

.avatar {
  width: 40px;
  height: 40px;
  object-fit: cover;
  border: 2px solid #b983ff;
  box-shadow: 0 0 8px #b983ff;
  transition: transform 0.3s ease;
}

.avatar:hover {
  transform: scale(1.1);
  box-shadow: 0 0 14px #d77eff;
}

.btn-glow {
  background: linear-gradient(90deg, #9f6eff, #b983ff);
  border: none;
  color: #fff;
  font-weight: 600;
  box-shadow: 0 0 10px #b983ffaa;
  transition: 0.3s ease;
  min-width: 80px;
}

.btn-glow:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-glow:hover:not(:disabled) {
  box-shadow: 0 0 15px #b983ffdd;
}
</style>
