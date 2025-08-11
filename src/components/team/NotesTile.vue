<template>
  <section class="tile notes-tile">
    <h3>
      Notatki zespołu
      <small class="text-muted ms-2">
        {{ notes.length }} notatek
      </small>
    </h3>

    <ul class="list-group mb-3">
      <li
        v-for="(note, index) in notes"
        :key="note.id"
        class="list-group-item d-flex flex-column gap-3"
      >
        <textarea
          v-model="note.text"
          class="form-control"
          rows="3"
          @input="markAsDirty(index)"
        ></textarea>
        <div class="d-flex justify-content-end gap-2">
          <button
            class="btn btn-sm btn-outline-success"
            :disabled="!dirtyFlags[index]"
            @click="saveNote(index)"
          >
            Zapisz
          </button>
          <button
            class="btn btn-sm btn-outline-danger"
            @click="removeNote(index)"
          >
            Usuń
          </button>
        </div>
      </li>
    </ul>

    <form @submit.prevent="addNote" class="d-flex gap-2">
      <input
        v-model="newNoteText"
        type="text"
        placeholder="Dodaj nową notatkę"
        class="form-control"
        required
      />
      <button
        type="submit"
        class="btn btn-glow"
        :disabled="!newNoteText.trim()"
      >
        Dodaj
      </button>
    </form>

    <div v-if="errorMessage" class="text-danger mt-2 small">{{ errorMessage }}</div>
  </section>
</template>

<script setup>
import { ref, reactive } from 'vue'

const props = defineProps({
  initialNotes: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['updateNotes'])

const notes = ref(props.initialNotes.map(note => ({ ...note })))
const dirtyFlags = reactive({})
const newNoteText = ref('')
const errorMessage = ref('')

const markAsDirty = (index) => {
  dirtyFlags[index] = true
}

const addNote = () => {
  if (!newNoteText.value.trim()) return
  notes.value.push({
    id: Date.now(),
    text: newNoteText.value.trim(),
  })
  newNoteText.value = ''
  emit('updateNotes', notes.value)
}

const saveNote = (index) => {
  if (!notes.value[index].text.trim()) {
    errorMessage.value = 'Notatka nie może być pusta'
    return
  }
  dirtyFlags[index] = false
  errorMessage.value = ''
  emit('updateNotes', notes.value)
}

const removeNote = (index) => {
  if (!confirm('Usunąć tę notatkę?')) return
  notes.value.splice(index, 1)
  delete dirtyFlags[index]
  emit('updateNotes', notes.value)
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
  padding: 1rem;
}

.list-group-item:hover {
  background: rgba(255, 255, 255, 0.1);
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

textarea.form-control {
  min-height: 100px;
  resize: vertical;
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

.btn-glow:hover:not(:disabled) {
  background: #a86eff;
  box-shadow: 0 0 12px rgba(185, 131, 255, 0.7);
}

.btn-outline-success {
  border-color: rgba(40, 167, 69, 0.6);
  color: #28a745;
}

.btn-outline-success:hover {
  background: rgba(40, 167, 69, 0.15);
}

.btn-outline-danger {
  border-color: rgba(220, 53, 69, 0.6);
  color: #dc3545;
}

.btn-outline-danger:hover {
  background: rgba(220, 53, 69, 0.15);
}

.text-danger {
  color: #ff6b6b;
  font-size: 0.85rem;
}
</style>