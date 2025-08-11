<template>
  <div class="kanban-board-tile glassy p-3 rounded shadow">
    <h3 class="neon-text mb-3">Tablica Kanban</h3>

    <div class="boards-wrapper d-flex gap-3 overflow-auto">
      <div
        v-for="(board, boardIndex) in boards"
        :key="board.id"
        class="kanban-board p-2 rounded bg-dark"
      >
        <div class="board-header d-flex justify-content-between align-items-center mb-2">
          <h5>{{ board.title }}</h5>
          <button class="btn btn-sm btn-outline-danger" @click="removeBoard(boardIndex)">×</button>
        </div>

        <draggable
          v-model="board.tasks"
          group="tasks"
          item-key="id"
          class="task-list"
          @end="saveBoards"
        >
          <template #item="{ element }">
            <div class="task-card p-2 mb-2 rounded bg-secondary text-white d-flex justify-content-between align-items-center">
              <span>{{ element.text }}</span>
              <button class="btn btn-sm btn-outline-light" @click="removeTask(boardIndex, element.id)">×</button>
            </div>
          </template>
        </draggable>

        <form @submit.prevent="addTask(boardIndex)" class="mt-2 d-flex gap-2">
          <input
            v-model="newTaskText[board.id]"
            placeholder="Nowe zadanie"
            class="form-control form-control-sm"
            required
          />
          <button type="submit" class="btn btn-sm btn-glow">Dodaj</button>
        </form>
      </div>

      <div class="add-board p-2 rounded bg-dark d-flex flex-column justify-content-center align-items-center" style="min-width: 150px;">
        <form @submit.prevent="addBoard" class="w-100">
          <input
            v-model="newBoardTitle"
            placeholder="Nowa kolumna"
            class="form-control form-control-sm mb-2"
            required
          />
          <button type="submit" class="btn btn-sm btn-glow w-100">Dodaj kolumnę</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import draggable from 'vuedraggable'

const boards = ref([
  {
    id: 1,
    title: 'Do zrobienia',
    tasks: [
      { id: 1, text: 'Przykładowe zadanie 1' },
      { id: 2, text: 'Przykładowe zadanie 2' },
    ],
  },
  {
    id: 2,
    title: 'W trakcie',
    tasks: [{ id: 3, text: 'Zadanie w trakcie' }],
  },
])

const newBoardTitle = ref('')
const newTaskText = reactive({})

// Dodanie kolumny
const addBoard = () => {
  const title = newBoardTitle.value.trim()
  if (!title) return
  boards.value.push({
    id: Date.now(),
    title,
    tasks: [],
  })
  newBoardTitle.value = ''
}

// Usuwanie kolumny
const removeBoard = (boardIndex) => {
  if (confirm('Usunąć tę kolumnę?')) {
    boards.value.splice(boardIndex, 1)
  }
}

// Dodanie zadania
const addTask = (boardIndex) => {
  const board = boards.value[boardIndex]
  const text = newTaskText[board.id]?.trim()
  if (!text) return

  board.tasks.push({
    id: Date.now(),
    text,
  })
  newTaskText[board.id] = ''
}

// Usuwanie zadania
const removeTask = (boardIndex, taskId) => {
  const board = boards.value[boardIndex]
  const idx = board.tasks.findIndex(t => t.id === taskId)
  if (idx !== -1) board.tasks.splice(idx, 1)
}

// Możesz dodać watch, żeby zapisywać do bazy, np. emitować event albo aktualizować Firestore
const saveBoards = () => {
  // np. emit('updateBoards', boards.value)
  console.log('Zapisz boards', boards.value)
}
</script>

<style scoped>
.kanban-board-tile {
  background: rgba(25, 19, 46, 0.85);
  color: white;
}

.boards-wrapper {
  min-height: 250px;
}

.kanban-board {
  width: 300px;
  min-width: 300px;
  max-height: 600px;
  overflow-y: auto;
}

.task-list {
  min-height: 100px;
  max-height: 400px;
  overflow-y: auto;
}

.task-card {
  cursor: grab;
}

.btn-glow {
  background: linear-gradient(90deg, #9f6eff, #b983ff);
  border: none;
  color: #fff;
  font-weight: 600;
  box-shadow: 0 0 10px #b983ffaa;
  transition: 0.3s ease;
}
.btn-glow:hover:not(:disabled) {
  box-shadow: 0 0 15px #b983ffdd;
}
</style>
