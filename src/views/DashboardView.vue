<template>
  <div class="dashboard container-fluid py-4">
    <!-- Górne kafelki statystyk -->
    <div class="row g-4 mb-4">
      <div class="col-md-4">
        <StatCard
          title="Twój poziom"
          :value="`Poziom ${level}`"
          :description="user ? `${user.xp} / ${xpToNextLevel} XP` : 'Ładowanie...'"
          icon="🧫"
          :progress="progressPercent"
        />
      </div>
      <div class="col-md-4">
        <StatCard
          title="Umiejętności zdobyte"
          :value="user?.skills?.length || 0"
          description="W tym roku"
          icon="🧠"
          :progress="user?.skills ? (user.skills.length / 10) * 100 : 0"
        />
      </div>
      <div class="col-md-4">
        <StatCard
          title="Cele zrealizowane"
          :value="user?.skills?.length || 0"
          description="W tym roku"
          icon="🎯"
          :progress="user?.skills ? (user.skills.length / 10) * 100 : 0"
        />
      </div>
    </div>

    <!-- Kafelki nawigacyjne -->
    <div class="row g-4 mb-4">
      <div class="col-md-3">
        <DashboardTile title="Aktualności" @click="currentTab = 'Aktualności'" />
      </div>
      <div class="col-md-3">
        <DashboardTile title="Zadania" @click="currentTab = 'Zadania'" />
      </div>
      <div class="col-md-3">
        <DashboardTile title="Wydarzenia" @click="currentTab = 'Wydarzenia'" />
      </div>
      <div class="col-md-3">
        <DashboardTile title="Wpisy" @click="currentTab = 'Wpisy'" />
      </div>
    </div>

    <!-- Dynamiczna zawartość zakładki -->
    <div class="tab-section p-4 rounded-4 glassy">
      <template v-if="currentTab === 'Aktualności'">
        <h5 class="section-title">📌 Najbliższe zadania</h5>
        <ul class="neon-list">
          <li v-for="task in tasks" :key="task.id">{{ task.title }}</li>
        </ul>

        <h5 class="section-title mt-4">🗕️ Nadchodzące wydarzenia</h5>
        <ul class="neon-list">
          <li v-for="event in events" :key="event.id">{{ event.title }}</li>
        </ul>

        <h5 class="section-title mt-4">📜 Najnowsze wpisy</h5>
        <ul class="neon-list">
          <li v-for="post in posts" :key="post.id">{{ post.title }}</li>
        </ul>
      </template>

      <TaskListView v-else-if="currentTab === 'Zadania'" />
      <EventView v-else-if="currentTab === 'Wydarzenia'" />
      <PostsView v-else-if="currentTab === 'Wpisy'" />



      <p v-else class="text-light">Sekcja „{{ currentTab }}” jeszcze się ładuje lub będzie dostępna wkrótce.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { auth, db } from '@/firebase'
import { doc, onSnapshot, getDoc } from 'firebase/firestore'
import StatCard from '@/components/StatCard.vue'
import DashboardTile from '@/components/DashboardTile.vue'
import TaskListView from '@/views/TaskView.vue'
import EventView from '@/views/EventView.vue'
import PostsView from '@/views/PostsView.vue'


const currentTab = ref('Aktualności')

const user = ref(null) // najpierw null, bo dane z Firestore

const xpPerLevel = 1000

const level = computed(() => {
  if (!user.value) return 1
  return Math.floor(user.value.xp / xpPerLevel) + 1
})

const xpToNextLevel = computed(() => {
  if (!user.value) return xpPerLevel
  return level.value * xpPerLevel
})

const progressPercent = computed(() => {
  if (!user.value) return 0
  const currentXpInLevel = user.value.xp - (level.value - 1) * xpPerLevel
  return (currentXpInLevel / xpPerLevel) * 100
})



const tasks = [
  { id: '1', title: 'Stwórz grafikę do posta' },
  { id: '2', title: 'Poprowadź szkolenie' },
  { id: '3', title: 'Przygotuj prezentację' }
]
const events = [
  { id: 'e1', title: 'Hackathon organizacyjny' },
  { id: 'e2', title: 'Spotkanie liderów' },
  { id: 'e3', title: 'Wyjazd integracyjny' }
]
const posts = [
  { id: 'p1', title: 'Top 5 narzędzi do pracy w zespole' },
  { id: 'p2', title: 'Wprowadzenie do XP' },
  { id: 'p3', title: 'Levelowanie – jak zdobywać punkty' }
]

const fetchUserDataLive = () => {
  const unsubscribe = auth.onAuthStateChanged((currentUser) => {
    if (!currentUser) return

    const userRef = doc(db, 'users', currentUser.uid)
    onSnapshot(userRef, (docSnap) => {
      if (docSnap.exists()) {
        user.value = docSnap.data()
      }
    })
  })
}


onMounted(() => {
  fetchUserDataLive()
})


</script>

<style scoped>
.dashboard {
  color: #f5f5f5;
  background: linear-gradient(135deg, #14111c, #1d1530);
  border-radius: 16px;
  animation: fadeIn 0.4s ease;
}

.tab-section {
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 0 12px rgba(185, 131, 255, 0.2);
}

.section-title {
  font-weight: 600;
  font-size: 1.1rem;
  color: #b983ff;
  margin-bottom: 0.5rem;
}

.neon-list {
  list-style: none;
  padding-left: 0;
}
.neon-list li {
  padding: 0.4rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  color: #eee;
  transition: color 0.2s ease;
}
.neon-list li:hover {
  color: #b983ff;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
