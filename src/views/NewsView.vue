<template>
  <div class="news-view container-fluid">
    <div class="row g-4">
      <div class="col-md-4">
        <NewsCard
          title="Twoje najbliższe zadania"
          :items="tasks"
          icon="🎯"
          gradient="linear-gradient(135deg, #6a11cb, #2575fc)"
          @showMore="$emit('navigate', 'Zadania')"
        />
      </div>
      <div class="col-md-4">
        <NewsCard
          title="Nadchodzące wydarzenia"
          :items="events"
          icon="📅"
          gradient="linear-gradient(135deg, #ff6a00, #ee0979)"
          @showMore="$emit('navigate', 'Wydarzenia')"
        />
      </div>
      <div class="col-md-4">
        <NewsCard
          title="Ostatnie wpisy"
          :items="posts"
          icon="✍️"
          gradient="linear-gradient(135deg, #00c6ff, #0072ff)"
          @showMore="$emit('navigate', 'Wpisy')"
        />
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
import NewsCard from '@/components/NewsCard.vue'

const tasks = ref([])
const events = ref([])
const posts = ref([])

const fetchTasks = async (uid) => {
  const q = query(
    collection(db, 'tasks'),
    where('assignedTo', '==', uid),
    where('status', '==', 'open'),
    orderBy('deadline'),
    limit(3)
  )
  const snapshot = await getDocs(q)
  tasks.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
}

const fetchEvents = async () => {
  const q = query(
    collection(db, 'events'),
    orderBy('date'),
    limit(3)
  )
  const snapshot = await getDocs(q)
  events.value = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    date: doc.data().date?.toDate?.().toISOString().split('T')[0] || doc.data().date
  }))
}

const fetchPosts = async () => {
  const q = query(
    collection(db, 'posts'),
    orderBy('createdAt', 'desc'),
    limit(3)
  )
  const snapshot = await getDocs(q)
  posts.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
}

onMounted(() => {
  auth.onAuthStateChanged(async (user) => {
    if (user) {
      await Promise.all([
        fetchTasks(user.uid),
        fetchEvents(),
        fetchPosts()
      ])
    }
  })
})
</script>
