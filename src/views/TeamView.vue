<template>
  <div class="team-view container py-4">
    <h1 class="neon-text mb-4">👥 Zarządzanie Zespołami</h1>

    <!-- Tworzenie zespołu -->
    <form @submit.prevent="createTeam" class="mb-4 d-flex flex-column flex-md-row gap-2 align-items-center">
      <input
        v-model="newTeamName"
        placeholder="Nazwa nowego zespołu"
        class="form-control"
        :disabled="creatingTeam"
        required
      />
      <button type="submit" class="btn btn-glow" :disabled="creatingTeam">
        {{ creatingTeam ? 'Tworzę...' : 'Utwórz zespół' }}
      </button>
    </form>
    <div v-if="error" class="text-danger mb-3">{{ error }}</div>

    <!-- Lista zespołów -->
    <div v-if="loading" class="text-center my-5 text-muted">Ładowanie zespołów...</div>
    <div v-else>
      <TeamList
        v-if="teams.length"
        :teams="teams"
        :currentUserEmail="currentUserEmail"
        @updateTeams="fetchTeams"
      />
      <div v-else class="text-muted fst-italic">Nie należysz do żadnego zespołu.</div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { collection, getDocs, query, where, addDoc } from 'firebase/firestore'
import { db } from '@/firebase'
import { useAuth } from '@/composables/useAuth'
import TeamList from '@/components/team/TeamList.vue'

const { user } = useAuth()
const currentUserEmail = ref('')

const teams = ref([])
const newTeamName = ref('')
const creatingTeam = ref(false)
const loading = ref(false)
const error = ref('')

const fetchTeams = async () => {
  if (!currentUserEmail.value) {
    error.value = 'Brak zalogowanego użytkownika'
    return
  }
  loading.value = true
  error.value = ''
  try {
    const q = query(
      collection(db, 'teams'),
      where('members', 'array-contains', currentUserEmail.value)
    )
    const snapshot = await getDocs(q)
    teams.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  } catch (e) {
    console.error('Błąd pobierania zespołów:', e)
    error.value = 'Nie udało się pobrać zespołów.'
  } finally {
    loading.value = false
  }
}

const createTeam = async () => {
  if (!newTeamName.value.trim()) {
    error.value = 'Nazwa zespołu nie może być pusta.'
    return
  }
  if (!currentUserEmail.value) {
    error.value = 'Brak zalogowanego użytkownika'
    return
  }
  creatingTeam.value = true
  error.value = ''
  try {
    await addDoc(collection(db, 'teams'), {
      name: newTeamName.value.trim(),
      ownerEmail: currentUserEmail.value,
      members: [currentUserEmail.value],
      goals: [],
      skills: [],
      entries: []
    })

    newTeamName.value = ''
    await fetchTeams()
  } catch (e) {
    console.error('Błąd tworzenia zespołu:', e)
    error.value = 'Nie udało się utworzyć zespołu.'
  } finally {
    creatingTeam.value = false
  }
}

watch(user, (newUser) => {
  if (newUser?.email) {
    currentUserEmail.value = newUser.email
    fetchTeams()
  }
})
</script>

<style scoped>
.team-view {
  
  background: linear-gradient(135deg, #14111c, #1d1530);
  border-radius: 16px;
  padding: 1.5rem 2rem;
  min-height: 80vh;
  
  animation: fadeIn 0.5s ease forwards;
}

.neon-text {
  background: linear-gradient(90deg, #b983ff, #7f5af0);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 700;
}

.btn-glow {
  background: linear-gradient(90deg, #9f6eff, #b983ff);
  border: none;
  color: #fff;
  font-weight: 600;
  box-shadow: 0 0 10px #b983ffaa;
  transition: 0.3s ease;
  min-width: 140px;
}
.btn-glow:hover:not(:disabled) {
  box-shadow: 0 0 15px #b983ffdd;
}

input.form-control {
  max-width: 400px;
}
</style>
