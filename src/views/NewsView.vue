<template>
  <div class="news-view container-fluid py-4">
    <div class="row g-4">
      <!-- Sekcja z zadaniami -->
      <div class="col-md-4">
        <h4 class="text-light mb-3">🎯 Twoje najbliższe zadania</h4>
        <div v-if="tasks.length">
          <div
            v-for="task in tasks"
            :key="task.id"
            class="task-card card p-3 mb-3 glassy text-light"
          >
            <h5>📝 {{ task.title }}</h5>
            <p class="small">{{ task.description }}</p>
            <p class="small">📅 Termin: <strong>{{ task.dueDateFormatted }}</strong></p>
            <p class="small">📂 Kategoria: <strong>{{ task.category || '-' }}</strong></p>
            <p class="small">💎 Punkty: <strong>{{ task.points || 0 }}</strong></p>
            <p class="small text-muted">✍️ Przypisane przez: {{ task.createdBy || 'nieznany' }}</p>
          </div>
        </div>
        <div v-else class="text-muted">Brak przypisanych zadań.</div>
        <button class="btn btn-sm btn-outline-light w-100 mt-2" @click="$emit('navigate', 'Zadania')">
          Pokaż więcej
        </button>
      </div>

      <!-- Sekcja z wydarzeniami -->
      <div class="col-md-4">
        <h4 class="text-light mb-3">📅 Nadchodzące wydarzenia</h4>
        <div v-if="events.length">
          <div
            v-for="event in events"
            :key="event.id"
            class="event-card card p-3 mb-3 glassy text-light"
          >
            <h5>🎉 {{ event.title }}</h5>
            <p class="small">{{ event.description }}</p>
            <p class="small">📅 Data: <strong>{{ event.dateFormatted }}</strong></p>
            <p class="small">📍 Miejsce: <strong>{{ event.location || '-' }}</strong></p>
            <p v-if="event.link" class="small">
              🔗 <a :href="event.link" target="_blank" class="text-info">Link do wydarzenia</a>
            </p>
          </div>
        </div>
        <div v-else class="text-muted">Brak nadchodzących wydarzeń.</div>
        <button class="btn btn-sm btn-outline-light w-100 mt-2" @click="$emit('navigate', 'Wydarzenia')">
          Pokaż więcej
        </button>
      </div>

      <!-- Sekcja z wpisami -->
      <div class="col-md-4">
        <h4 class="text-light mb-3">✍️ Ostatnie wpisy</h4>
        <div v-if="posts.length">
          <div
            v-for="post in posts"
            :key="post.id"
            class="post-card card p-3 mb-3 glassy text-light"
          >
            <h5>📌 {{ post.title }}</h5>
            <p class="small">{{ post.content || post.description || '-' }}</p>
            <p class="small text-muted">📅 {{ formatTimestamp(post.createdAt) }}</p>
          </div>
        </div>
        <div v-else class="text-muted">Brak wpisów.</div>
        <button class="btn btn-sm btn-outline-light w-100 mt-2" @click="$emit('navigate', 'Wpisy')">
          Pokaż więcej
        </button>
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref, onMounted } from 'vue'
import { db, auth } from '@/firebase'
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs
} from 'firebase/firestore'

const tasks = ref([])
const events = ref([])
const posts = ref([])

const fetchTasks = async (userEmail) => {
  if (!userEmail) return
  const q = query(
    collection(db, 'tasks'),
    where('assignedTo', 'array-contains', userEmail),
    where('status', '==', 'open'),
    orderBy('dueDate', 'asc'),
    limit(3)
  )
  const snapshot = await getDocs(q)
  tasks.value = snapshot.docs.map(doc => {
    const data = doc.data()
    return {
      id: doc.id,
      ...data,
      dueDateFormatted: data.dueDate?.toDate?.().toLocaleDateString('pl-PL') || data.dueDate || '',
      createdBy: data.createdBy || 'nieznany',
    }
  })
}

const fetchEvents = async () => {
  const q = query(
    collection(db, 'events'),
    orderBy('date', 'asc'),
    limit(3)
  )
  const snapshot = await getDocs(q)
  events.value = snapshot.docs.map(doc => {
    const data = doc.data()
    return {
      id: doc.id,
      ...data,
      dateFormatted: data.date?.toDate?.().toLocaleDateString('pl-PL') || data.date || '',
      location: data.location || ''
    }
  })
}

const fetchPosts = async () => {
  const q = query(
    collection(db, 'posts'),
    orderBy('createdAt', 'desc'),
    limit(3)
  )
  const snapshot = await getDocs(q)
  posts.value = snapshot.docs.map(doc => {
    const data = doc.data()
    return {
      id: doc.id,
      ...data
    }
  })
}

const formatTimestamp = (ts) => {
  if (!ts) return '-'
  if (ts.toDate) {
    return ts.toDate().toLocaleDateString('pl-PL')
  }
  try {
    return new Date(ts).toLocaleDateString('pl-PL')
  } catch {
    return '-'
  }
}

onMounted(() => {
  auth.onAuthStateChanged(async (user) => {
    if (user && user.email) {
      await Promise.all([
        fetchTasks(user.email),
        fetchEvents(),
        fetchPosts()
      ])
    }
  })
})
</script>

<style scoped>
.glassy {
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 0 12px rgba(185, 131, 255, 0.2);
}

.task-card {
  border-left: 5px solid gold;
}

.event-card {
  border-left: 5px solid #00c6ff;
}

.post-card {
  border-left: 5px solid #ff6a00;
}

.text-light {
  color: #eee;
}

.text-muted {
  color: #aaa;
}

a.text-info {
  text-decoration: underline;
  color: #5bc0de;
}
</style>
