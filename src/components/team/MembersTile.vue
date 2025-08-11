<template>
  <section class="tile members-tile">
    <h3>
      Członkowie zespołu
      <small class="text-muted ms-2">
        ( {{ members.length }} )
      </small>
    </h3>

    <ul class="list-group mb-3">
      <li
        v-for="member in members"
        :key="member"
        class="list-group-item d-flex align-items-center gap-3"
      >
        <div class="member-email" :class="{ 'owner-email': member === ownerEmail }">
          {{ member }}
          <span v-if="member === ownerEmail" class="badge owner-badge">Właściciel</span>
        </div>
        
        <button
          v-if="isOwner && member !== currentUserEmail"
          class="btn btn-sm btn-outline-danger ms-auto"
          @click="$emit('remove-member', member)"
        >
          Usuń
        </button>
      </li>
    </ul>

    <form 
      @submit.prevent="$emit('add-member', newMemberEmail)" 
      class="d-flex gap-2" 
      v-if="isOwner"
    >
      <input
        v-model="newMemberEmail"
        type="email"
        placeholder="Dodaj członka (email)"
        class="form-control"
        :disabled="addingMember"
        required
      />
      <button
        type="submit"
        class="btn btn-glow"
        :disabled="addingMember || !newMemberEmail.trim()"
      >
        {{ addingMember ? 'Dodaję...' : 'Dodaj' }}
      </button>
    </form>
  </section>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  members: Array,
  isOwner: Boolean,
  ownerEmail: String,
  currentUserEmail: String,
  addingMember: Boolean,
})

const newMemberEmail = ref('')
</script>

<style scoped>
.tile {
  background: linear-gradient(145deg, rgba(25, 19, 46, 0.95), rgba(35, 28, 60, 0.95));
  padding: 1.5rem;
  border-radius: 1rem;
  box-shadow: 0 8px 20px rgba(185, 131, 255, 0.15);
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
  background: linear-gradient(90deg, #b983ff, #7f5af0);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 700;
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
  padding: 0.75rem 1rem;
}

.list-group-item:hover {
  background: rgba(255, 255, 255, 0.1);
}

.member-email {
  flex-grow: 1;
  font-size: 0.95rem;
}

.owner-email {
  font-weight: 500;
  color: #ffd700;
}

.owner-badge {
  background: rgba(255, 215, 0, 0.15);
  color: #ffd700;
  font-weight: 500;
  font-size: 0.7rem;
  margin-left: 0.5rem;
  border: 1px solid rgba(255, 215, 0, 0.3);
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
  min-width: 80px;
}

.btn-glow:hover:not(:disabled) {
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

.form-control {
  background: rgba(50, 41, 81, 0.8);
  color: #eee;
  border: 1px solid rgba(185, 131, 255, 0.3);
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
}

.form-control:focus {
  background: rgba(50, 41, 81, 0.9);
  color: #fff;
  border-color: rgba(185, 131, 255, 0.5);
  box-shadow: 0 0 0 0.25rem rgba(185, 131, 255, 0.25);
}
</style>