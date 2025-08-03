<template>
    <div class="row">
      <!-- Lista zadań -->
      <div class="col-md-8 mb-4">
        <div class="p-4 glassy rounded-4 shadow-lg">
          <h4 class="mb-3">📝 Moje zadania</h4>
          <div v-if="tasks.length">
            <TaskCard
              v-for="task in tasks"
              :key="task.id"
              :task="task"
              @completed="handleTaskCompletion"
            />
          </div>
          <div v-else class="text-muted">Brak przypisanych zadań.</div>
        </div>
      </div>
  
      <!-- Szybkie akcje -->
      <div class="col-md-4">
        <div class="p-4 glassy rounded-4 shadow-lg">
          <h4 class="mb-3">⚡ Szybkie akcje</h4>
          <form @submit.prevent="addTask">
            <div class="mb-3">
              <input v-model="newTask.title" class="form-control" placeholder="Nazwa zadania" required />
            </div>
            <div class="mb-3">
              <textarea v-model="newTask.description" class="form-control" placeholder="Opis zadania" required></textarea>
            </div>
            <div class="mb-3">
              <input type="date" v-model="newTask.dueDate" class="form-control" required />
            </div>
            <div class="mb-3">
              <input v-model="newTask.category" class="form-control" placeholder="Kategoria" />
            </div>
            <div class="mb-3">
              <input type="number" v-model.number="newTask.points" class="form-control" placeholder="Punkty" />
            </div>
            <button class="btn btn-glow w-100">Dodaj zadanie</button>
          </form>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { collection, addDoc, query, where, getDocs, updateDoc, doc } from 'firebase/firestore'
  import { auth, db } from '@/firebase'
  import TaskCard from '@/components/TaskCard.vue'
  
  const tasks = ref([])
  const userId = auth.currentUser?.uid
  
  const newTask = ref({
    title: '',
    description: '',
    dueDate: '',
    category: '',
    points: 0
  })
  
  const fetchTasks = async () => {
    if (!userId) return
    const q = query(collection(db, 'tasks'), where('userId', '==', userId), where('status', '==', 'open'))
    const querySnapshot = await getDocs(q)
    tasks.value = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  }
  
  const addTask = async () => {
    const task = {
      ...newTask.value,
      status: 'open',
      userId,
      createdAt: new Date()
    }
    await addDoc(collection(db, 'tasks'), task)
    await fetchTasks()
    newTask.value = { title: '', description: '', dueDate: '', category: '', points: 0 }
  }
  
  const handleTaskCompletion = async (task) => {
    const taskRef = doc(db, 'tasks', task.id)
    await updateDoc(taskRef, { status: 'done' })
  
    // Dodaj XP
    const userRef = doc(db, 'users', userId)
    await updateDoc(userRef, {
      xp: task.points  // zakładamy, że XP = punkty; można rozbudować
    })
    await fetchTasks()
  }
  
  onMounted(fetchTasks)
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