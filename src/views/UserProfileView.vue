<template>
  <div class="container py-4 text-light">
    <div class="row g-4">

      <!-- Informacje o użytkowniku -->
      <div class="col-12 col-md-4">
        <div class="card glassy p-4 text-center h-100">
          <img :src="user.avatar || defaultAvatar" alt="Avatar" class="avatar mb-3" />
          <input
            type="file"
            @change="updateAvatar"
            class="form-control mb-3"
            aria-label="Wybierz avatar"
          />
          <h5 class="fw-bold text-light">{{ user.name }}</h5>
          <input
            v-model="user.nickname"
            class="form-control mb-2 text-light bg-dark"
            placeholder="Nick"
            @blur="saveProfile"
            style="border: 1px solid #b983ff;"
          />
          <textarea
            v-model="user.bio"
            class="form-control mb-2 text-light bg-dark"
            placeholder="Bio"
            @blur="saveProfile"
            rows="3"
            style="border: 1px solid #b983ff;"
          />
          <span class="badge bg-secondary mt-2">{{ user.role || 'Użytkownik' }}</span>
        </div>
      </div>

      <!-- Statystyki -->
      <div class="col-12 col-md-8">
        <div class="stat-card p-4 rounded shadow-sm h-100 d-flex flex-column justify-content-between">
          <div class="d-flex justify-content-between align-items-center mb-2">
            <h5 class="text-uppercase fw-semibold text-secondary">Poziom</h5>
            <span class="fs-3">🎮</span>
          </div>
          <div>
            <h3 class="fw-bold text-light">Poziom {{ level }}</h3>
            <p class="text-light">{{ user.xp }} / {{ xpToNextLevel }} XP</p>
          </div>
          <div class="xp-bar-container mt-2">
            <div class="xp-fill" :style="{ width: progressPercent + '%' }"></div>
          </div>
        </div>
      </div>

      <!-- Odznaki -->
      <div class="col-12">
        <div class="card glassy p-4">
          <h5 class="text-light">Odznaki</h5>
          <div class="d-flex flex-wrap gap-3 justify-content-start">
            <div class="badge-tile-glow" title="Za ukończenie 5 zadań">
              <div class="emoji">🔥</div>
              <div class="title">Aktywny Gracz</div>
              <p class="desc">Za ukończenie 5 zadań</p>
            </div>
            <div class="badge-tile-glow" title="Za prowadzenie zespołu">
              <div class="emoji">🌟</div>
              <div class="title">Lider Drużyny</div>
              <p class="desc">Za prowadzenie zespołu</p>
            </div>
            <div class="badge-tile-glow" title="Za 100% ukończonych zadań">
              <div class="emoji">🏅</div>
              <div class="title">Perfekcjonista</div>
              <p class="desc">Za 100% ukończonych zadań</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Aktywność -->
      <div class="col-12">
        <div class="card glassy p-4">
          <h5 class="text-light">Aktywność</h5>
          <ul class="list-group list-group-flush">
            <li
              v-for="(item, index) in activity"
              :key="index"
              class="list-group-item bg-transparent text-light border-secondary"
              style="display: flex; justify-content: space-between; font-weight: 600;"
            >
              ✅ <em>[{{ item.category }}]</em>
              <span class="text-success fw-bold">+{{ item.points }} XP</span>
            </li>
            <p v-if="activity.length === 0" class="text-muted">Brak aktywności</p>
          </ul>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { auth, db } from '@/firebase'
import { doc, getDoc, setDoc, collection, query, where, getDocs } from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'

const user = ref({
  name: '',
  nickname: '',
  bio: '',
  xp: 0,
  avatar: '',
  role: '',
})

const activity = ref([])
const defaultAvatar = '/avatar-placeholder.png'

const level = computed(() => Math.floor(user.value.xp / 1000) + 1)
const xpToNextLevel = computed(() => level.value * 1000)
const progressPercent = computed(() => {
  const current = user.value.xp - (level.value - 1) * 1000
  return (current / 1000) * 100
})

const saveProfile = async () => {
  const currentUser = auth.currentUser
  if (!currentUser) return
  const userRef = doc(db, 'users', currentUser.uid)
  await setDoc(userRef, {
    nickname: user.value.nickname,
    bio: user.value.bio,
  }, { merge: true })
}

const updateAvatar = (e) => {
  const file = e.target.files[0]
  if (file) {
    user.value.avatar = URL.createObjectURL(file)
  }
}

const fetchUserData = async (uid) => {
  const docRef = doc(db, 'users', uid)
  const docSnap = await getDoc(docRef)
  if (docSnap.exists()) {
    user.value = { ...user.value, ...docSnap.data() }
  }
}

const fetchActivity = async (email) => {
  const q = query(
    collection(db, 'tasks'),
    where('assignedTo', 'array-contains', email),
    where('status', '==', 'done')
  )
  const querySnapshot = await getDocs(q)
  const result = []
  querySnapshot.forEach(doc => {
    const data = doc.data()
    result.push({
      category: data.category || 'Brak kategorii',
      points: data.points || 0
    })
  })
  activity.value = result
}

onMounted(() => {
  onAuthStateChanged(auth, async (currentUser) => {
    if (currentUser) {
      await fetchUserData(currentUser.uid)
      await fetchActivity(currentUser.email)
    }
  })
})
</script>

<style scoped>
.glassy {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(185, 131, 255, 0.3);
  box-shadow: 0 0 10px rgba(185, 131, 255, 0.2);
  border-radius: 1rem;
  backdrop-filter: blur(5px);
}

.avatar {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 50%;
  border: 3px solid #b983ff;
}

.stat-card {
  background: linear-gradient(135deg, #2b2b3d, #1f1f2e);
  border: 1px solid #3c3c5a;
  color: #ddd;
}

.xp-bar-container {
  height: 10px;
  width: 100%;
  border-radius: 999px;
  background-color: #2c2c3e;
  overflow: hidden;
}

.xp-fill {
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, #b983ff, #d77eff, #ffc700);
  transition: width 0.8s ease-in-out;
  box-shadow: inset 0 0 8px rgba(255, 255, 255, 0.2),
              0 0 8px rgba(255, 215, 0, 0.3);
}

/* Odznaki */
.badge-tile-glow {
  background: linear-gradient(145deg, #3c3c5a, #2c2c3e);
  border: 2px solid #b983ff;
  border-radius: 1rem;
  padding: 1rem;
  color: #fff;
  width: 180px;
  text-align: center;
  box-shadow: 0 0 12px rgba(185, 131, 255, 0.4), inset 0 0 4px rgba(255, 255, 255, 0.1);
  transition: transform 0.3s ease;
}
.badge-tile-glow:hover {
  transform: scale(1.05);
  box-shadow: 0 0 16px rgba(255, 215, 0, 0.6), inset 0 0 6px rgba(255, 255, 255, 0.2);
}
.badge-tile-glow .emoji {
  font-size: 2rem;
}
.badge-tile-glow .title {
  font-weight: bold;
  font-size: 1.1rem;
  margin-top: 0.5rem;
}
.badge-tile-glow .desc {
  font-size: 0.85rem;
  color: #ccc;
  margin-top: 0.3rem;
}

/* Poprawiony kontrast inputów */
input.form-control,
textarea.form-control {
  background-color: #2c2c3e;
  color: #ddd;
  border: 1px solid #b983ff;
}

input.form-control::placeholder,
textarea.form-control::placeholder {
  color: #a69dfd;
}
</style>
