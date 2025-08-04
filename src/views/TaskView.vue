<template>
  <div class="row">
    <!-- Zadania przypisane do użytkownika -->
    <div class="col-md-6 mb-4">
      <div class="p-4 glassy rounded-4 shadow-lg">
        <h4 class="mb-3">📝 Moje zadania</h4>
        <div v-if="assignedToMe.length">
          <TaskCard
            v-for="task in assignedToMe"
            :key="task.id"
            :task="task"
            :current-user-email="currentUser?.email"
            :can-toggle="true"
            :can-delete="false"
            @toggle-complete="handleTaskCompletion"
          />
        </div>
        <div v-else class="text-muted">Brak przypisanych zadań.</div>
      </div>
    </div>

    <!-- Zadania przypisane przez użytkownika -->
    <div class="col-md-6 mb-4">
      <div class="p-4 glassy rounded-4 shadow-lg">
        <h4 class="mb-3">📤 Zadania przypisane innym</h4>
        <div v-if="assignedByMe.length">
          <TaskCard
            v-for="task in assignedByMe"
            :key="task.id"
            :task="task"
            :current-user-email="currentUser?.email"
            :can-toggle="false"
            :can-delete="true"
            @delete-task="deleteTask"
          />
        </div>
        <div v-else class="text-muted">Nie przypisałeś żadnych zadań.</div>
      </div>
    </div>

    <!-- Formularz dodawania -->
    <div class="col-md-12">
      <div class="p-4 glassy rounded-4 shadow-lg mt-4">
        <h4 class="mb-3">⚡ Dodaj nowe zadanie</h4>
        <form @submit.prevent="addTask">
          <div class="row g-3">
            <div class="col-md-3">
              <input v-model="newTask.title" class="form-control" placeholder="Nazwa zadania" required />
            </div>
            <div class="col-md-3">
              <input v-model="newTask.category" class="form-control" placeholder="Kategoria" />
            </div>
            <div class="col-md-2">
              <input type="date" v-model="newTask.dueDate" class="form-control" required />
            </div>
            <div class="col-md-2">
              <input type="number" v-model.number="newTask.points" class="form-control" placeholder="XP" />
            </div>
            <div class="col-md-6">
              <textarea v-model="newTask.description" class="form-control" placeholder="Opis zadania" required></textarea>
            </div>
            <div class="col-md-6">
              <input
                v-model="newTask.assignedTo"
                class="form-control"
                placeholder="Adresy e-mail (oddzielone przecinkiem)"
              />
              <small class="text-muted">Jeśli puste – przypisane do Ciebie</small>
            </div>
            <div class="col-md-12">
              <button class="btn btn-glow w-100">Dodaj zadanie</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref, onMounted } from 'vue'
import { collection, addDoc, query, getDocs, updateDoc, doc, getDoc, deleteDoc } from 'firebase/firestore'
import { auth, db } from '@/firebase'
import TaskCard from '@/components/TaskCard.vue'
import confetti from 'canvas-confetti'

const currentUser = ref(null)
const assignedToMe = ref([])
const assignedByMe = ref([])

const newTask = ref({
  title: '',
  description: '',
  dueDate: '',
  category: '',
  points: 0,
  assignedTo: ''
})

onMounted(() => {
  auth.onAuthStateChanged(user => {
    if (user) {
      currentUser.value = user
      fetchTasks()
    }
  })
})

const fetchTasks = async () => {
  if (!currentUser.value?.email) return

  const q = query(collection(db, 'tasks'))
  const snapshot = await getDocs(q)

  const allTasks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))

  assignedToMe.value = allTasks.filter(
    t => t.status === 'open' &&
    Array.isArray(t.assignedTo) &&
    t.assignedTo.includes(currentUser.value.email)
  )

  assignedByMe.value = allTasks.filter(
    t => t.status === 'open' && t.createdBy === currentUser.value.email
  )
}

const addTask = async () => {
  if (!currentUser.value?.email) return alert('Musisz być zalogowany')

  const assignedEmails = newTask.value.assignedTo
    ? newTask.value.assignedTo.split(',').map(email => email.trim()).filter(Boolean)
    : [currentUser.value.email]

  const task = {
    title: newTask.value.title,
    description: newTask.value.description,
    dueDate: newTask.value.dueDate,
    category: newTask.value.category,
    points: newTask.value.points,
    assignedTo: assignedEmails,
    createdBy: currentUser.value.email,
    status: 'open',
    createdAt: new Date()
  }

  await addDoc(collection(db, 'tasks'), task)
  await fetchTasks()

  newTask.value = {
    title: '', description: '', dueDate: '', category: '', points: 0, assignedTo: ''
  }
}

const handleTaskCompletion = async (taskId) => {
  const taskRef = doc(db, 'tasks', taskId)
  const taskSnap = await getDoc(taskRef)
  if (!taskSnap.exists()) return alert('Zadanie nie istnieje.')

  const task = taskSnap.data()
  await updateDoc(taskRef, { status: 'done' })

  const userRef = doc(db, 'users', currentUser.value.uid)
  const userSnap = await getDoc(userRef)

  if (userSnap.exists()) {
    const userData = userSnap.data()
    const newXp = (userData.xp || 0) + (task.points || 0)
    await updateDoc(userRef, { xp: newXp })
  }

  await fetchTasks()

  confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } })
  alert(`Gratulacje! Ukończyłeś zadanie i zdobyłeś ${task.points} XP!`)
}

const deleteTask = async (taskId) => {
  if (!confirm('Czy na pewno chcesz usunąć to zadanie?')) return
  await deleteDoc(doc(db, 'tasks', taskId))
  await fetchTasks()
}
</script>

<style scoped>
.glassy {
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 0 12px rgba(185, 131, 255, 0.2);
}
.btn-glow {
  background: linear-gradient(90deg, #fbcf33, #f5b400);
  color: #000;
  font-weight: bold;
  border: none;
  box-shadow: 0 0 10px rgba(255, 215, 0, 0.6);
}
</style>
