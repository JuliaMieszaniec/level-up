<template>
  <section class="tile members-tile">
    <h3>Członkowie ({{ members.length }})</h3>
    <ul class="list-group mb-3">
      <li
        v-for="member in members"
        :key="member"
        class="list-group-item d-flex justify-content-between align-items-center"
      >
        {{ member }}
        <button
          v-if="isOwner && member !== currentUserEmail"
          class="btn btn-sm btn-outline-danger"
          @click="$emit('remove-member', member)"
        >
          Usuń
        </button>
        <span v-else-if="member === ownerEmail" class="badge bg-warning text-dark">Właściciel</span>
      </li>
    </ul>

    <form @submit.prevent="$emit('add-member', newMemberEmail)" class="d-flex gap-2" v-if="isOwner">
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
        :disabled="addingMember"
      >
        {{ addingMember ? 'Dodaję...' : 'Dodaj członka' }}
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
  background: rgba(25, 19, 46, 0.85);
  padding: 1rem 1.5rem;
  border-radius: 1rem;
  box-shadow: 0 0 10px #b983ff55;
  margin-bottom: 1.5rem;
}
</style>
