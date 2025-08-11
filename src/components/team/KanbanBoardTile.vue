<template>
  <div class="kanban-board-tile glassy p-3 rounded shadow">
    <h3 class="neon-text mb-3">Tablica Kanban</h3>

    <div class="boards-wrapper d-flex gap-3 overflow-auto">
      <div
        v-for="(board, boardIndex) in boards"
        :key="board.id"
        class="kanban-board p-2 rounded"
        :class="board.bgClass"
      >
        <div class="board-header mb-2">
          <h5>{{ board.title }}</h5>
        </div>

        <draggable
          v-model="board.tasks"
          group="tasks"
          item-key="id"
          class="task-list"
          @end="handleDragEnd"
        >
          <template #item="{ element }">
            <div
              class="task-card p-2 mb-2 rounded d-flex align-items-center justify-content-between"
              :class="getTaskClass(board.title)"
            >
              <span :class="{ 'text-decoration-line-through': board.title === 'Zrobione' }">
                {{ element.text }}
              </span>
              <button class="btn btn-sm btn-outline-light ms-3" @click="removeTask(boardIndex, element.id)">×</button>
            </div>
          </template>
        </draggable>

        <form @submit.prevent="addTask(boardIndex)" class="mt-2 d-flex gap-2">
          <input
            v-model="newTaskText[boards[boardIndex].id]"
            placeholder="Nowe zadanie"
            class="form-control form-control-sm"
            autocomplete="off"
          />
          <button type="submit" class="btn btn-sm btn-glow" :disabled="!newTaskText[boards[boardIndex].id]?.trim()">+</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import draggable from 'vuedraggable'
import { db } from '@/firebase'
import { doc, getDoc, setDoc } from 'firebase/firestore'

const route = useRoute()
const teamId = route.params.id

const boards = ref([])
const newTaskText = reactive({})

const defaultBoards = () => [
  { id: 1, title: 'Do zrobienia', bgClass: 'board-grey', tasks: [] },
  { id: 2, title: 'W trakcie', bgClass: 'board-orange', tasks: [] },
  { id: 3, title: 'Do sprawdzenia', bgClass: 'board-blue', tasks: [] },
  { id: 4, title: 'Zrobione', bgClass: 'board-green', tasks: [] },
]

onMounted(async () => {
  const docRef = doc(db, 'teams', teamId)
  const snap = await getDoc(docRef)
  if (snap.exists()) {
    boards.value = snap.data().kanban || defaultBoards()
  } else {
    boards.value = defaultBoards()
    await saveBoards()
  }
})

const saveBoards = async () => {
  const docRef = doc(db, 'teams', teamId)
  await setDoc(docRef, { kanban: boards.value }, { merge: true })
}

const addTask = async (boardIndex) => {
  const boardId = boards.value[boardIndex].id
  const text = newTaskText[boardId]?.trim()
  if (!text) return

  boards.value[boardIndex].tasks.push({
    id: Date.now(),
    text,
  })
  newTaskText[boardId] = ''
  await saveBoards()
}

const removeTask = async (boardIndex, taskId) => {
  const tasks = boards.value[boardIndex].tasks
  const idx = tasks.findIndex(t => t.id === taskId)
  if (idx !== -1) tasks.splice(idx, 1)
  await saveBoards()
}

const handleDragEnd = async () => {
  await saveBoards()
}

const getTaskClass = (boardTitle) => {
  switch (boardTitle) {
    case 'W trakcie':
      return 'task-orange'
    case 'Do sprawdzenia':
      return 'task-blue'
    case 'Zrobione':
      return 'task-green'
    default:
      return 'task-grey'
  }
}
</script>

<style scoped>
.kanban-board-tile {
  background: rgba(25, 19, 46, 0.85);
  color: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 0 15px #b9835555;
  transition: all 0.3s ease;
  transform: translateY(0);
}

/* Efekt hover jak w innych kafelkach */
.kanban-board-tile:hover {
  box-shadow: 0 0 25px #b983ffaa, 0 0 40px #b983ff66;
  transform: translateY(-5px) scale(1.02);
}

/* Reszta bez zmian */
.boards-wrapper {
  min-height: 250px;
}

.kanban-board {
  width: 280px;
  min-width: 280px;
  max-height: 600px;
  overflow-y: auto;
  padding: 1rem;
  border-radius: 1rem;
  backdrop-filter: blur(8px);
  color: white;
}
.kanban-board-tile:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 25px rgba(185, 131, 255, 0.25);
}


.board-grey { background: rgba(100, 100, 100, 0.2); }
.board-orange { background: rgba(255, 165, 0, 0.2); }
.board-blue { background: rgba(0, 123, 255, 0.2); }
.board-green { background: rgba(40, 167, 69, 0.2); }

.task-list {
  min-height: 100px;
  max-height: 400px;
  overflow-y: auto;
}

.task-card {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  border-radius: 0.5rem;
}

.task-grey { background: rgba(100, 100, 100, 0.6); }
.task-orange { background: rgba(255, 165, 0, 0.7); }
.task-blue { background: rgba(0, 123, 255, 0.7); }
.task-green { background: rgba(40, 167, 69, 0.7); }

.text-decoration-line-through {
  text-decoration: line-through;
  opacity: 0.8;
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

