<template>
  <div class="posts-view container-fluid py-4">
    <div class="row g-4">
      <!-- Lista wpisów -->
      <div class="col-md-7">
        <div v-if="posts.length === 0" class="text-light text-center py-3">
          Brak wpisów do wyświetlenia
        </div>
        <div
          v-for="post in posts"
          :key="post.id"
          class="post-card p-4 rounded-4 shadow d-flex flex-column gap-2"
        >
          <div class="d-flex align-items-center gap-2">
            <div class="avatar bg-purple text-white rounded-circle d-flex justify-content-center align-items-center">
              👤
            </div>
            <strong class="text-light">{{ post.author }}</strong>
          </div>
          <h6 class="text-glow">{{ post.title }}</h6>
          <p class="text-light mb-1">{{ post.content }}</p>
          <img v-if="post.imageUrl" :src="post.imageUrl" class="img-fluid rounded-3 mt-2" />
          <a v-if="post.link" :href="post.link" target="_blank" class="text-info small">🔗 Zobacz więcej</a>

          <div class="d-flex justify-content-end gap-2 mt-2" v-if="post.userId === currentUserId">
            <button class="btn btn-glow btn-sm" @click="startEditing(post)">Edytuj</button>
            <button class="btn btn-sm btn-outline-danger" @click="deletePost(post.id)">Usuń</button>
          </div>
        </div>
      </div>

      <!-- Formularz -->
      <div class="col-md-5">
        <div class="glassy p-4 rounded-4 shadow">
          <h5 class="text-light mb-3">📝 Dodaj wpis</h5>
          <form @submit.prevent="editingPostId ? updatePost() : addPost()">
            <div class="mb-3">
              <label class="form-label text-light">Tytuł</label>
              <input v-model="newPost.title" type="text" class="form-control" required />
            </div>
            <div class="mb-3">
              <label class="form-label text-light">Treść wpisu</label>
              <textarea v-model="newPost.content" class="form-control" rows="3" required></textarea>
            </div>
            <div class="mb-3">
              <label class="form-label text-light">Zdjęcie (URL)</label>
              <input v-model="newPost.imageUrl" type="url" class="form-control" />
            </div>
            <div class="mb-3">
              <label class="form-label text-light">Link (opcjonalnie)</label>
              <input v-model="newPost.link" type="url" class="form-control" />
            </div>
            <button type="submit" class="btn btn-glow w-100">{{ editingPostId ? 'Zapisz zmiany' : 'Dodaj wpis' }}</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { db } from '@/firebase'
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  doc,
  serverTimestamp,
} from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

const posts = ref([])
const newPost = ref({
  title: '',
  content: '',
  imageUrl: '',
  link: ''
})
const editingPostId = ref(null)

const auth = getAuth()
const currentUserId = ref(null)
const currentUserName = ref('')

onMounted(async () => {
  const user = auth.currentUser
  if (user) {
    currentUserId.value = user.uid
    currentUserName.value = user.displayName || 'Anonim'
  }
  await fetchPosts()
})

const fetchPosts = async () => {
  const querySnapshot = await getDocs(collection(db, 'posts'))
  posts.value = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
}

const addPost = async () => {
  await addDoc(collection(db, 'posts'), {
    ...newPost.value,
    userId: currentUserId.value,
    author: currentUserName.value,
    createdAt: serverTimestamp(),
  })
  resetForm()
  await fetchPosts()
}

const deletePost = async (id) => {
  await deleteDoc(doc(db, 'posts', id))
  await fetchPosts()
}

const startEditing = (post) => {
  editingPostId.value = post.id
  newPost.value = { ...post }
}

const updatePost = async () => {
  await updateDoc(doc(db, 'posts', editingPostId.value), { ...newPost.value })
  editingPostId.value = null
  resetForm()
  await fetchPosts()
}

const resetForm = () => {
  newPost.value = { title: '', content: '', imageUrl: '', link: '' }
}
</script>

<style scoped>
.posts-view {
  color: #f5f5f5;
}

.post-card {
  background: linear-gradient(135deg, #1f1d2e, #2e264d, #1a1d33);
  border: 1px solid rgba(255, 255, 255, 0.07);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.post-card:hover {
  transform: scale(1.01);
  box-shadow: 0 0 18px rgba(185, 131, 255, 0.35);
}

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
  transition: transform 0.2s ease;
}
.btn-glow:hover {
  transform: scale(1.05);
  box-shadow: 0 0 12px rgba(255, 230, 100, 0.8);
}

.avatar {
  width: 32px;
  height: 32px;
  font-size: 1rem;
}
.text-glow {
  color: #fbcf33;
  text-shadow: 0 0 4px rgba(255, 230, 120, 0.6);
}
</style>
