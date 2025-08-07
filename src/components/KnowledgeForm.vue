<template>
  <div class="knowledge-form-overlay">
    <div class="knowledge-form glassy p-4 rounded-4 shadow">
      <h5 class="text-light mb-3">
        {{ mode === 'category' ? 'Dodaj nową kategorię' : 'Dodaj nowy zasób' }}
      </h5>
      <form @submit.prevent="handleSubmit">
        <div v-if="mode === 'category'" class="mb-3">
          <label class="form-label text-light">Nazwa kategorii</label>
          <input
            v-model="categoryName"
            type="text"
            class="form-control styled-input"
            ref="firstInput"
            required
          />
        </div>

        <div v-if="mode === 'resource'">
          <p class="text-light mb-2">Kategoria: <strong>{{ categoryTitle }}</strong></p>
          <div class="mb-3">
            <label class="form-label text-light">Nazwa zasobu</label>
            <input
              v-model="resourceName"
              type="text"
              class="form-control styled-input"
              ref="firstInput"
              required
            />
          </div>
          <div class="mb-3">
            <label class="form-label text-light">Typ zasobu</label>
            <select v-model="resourceType" class="form-select styled-input" required>
              <option value="link">Link</option>
              <option value="file">Plik (URL)</option>
            </select>
          </div>
          <div class="mb-3">
            <label class="form-label text-light">URL</label>
            <input v-model="resourceUrl" type="url" class="form-control styled-input" required />
          </div>
        </div>

        <div class="d-flex gap-2">
          <button type="submit" class="btn btn-glow flex-grow-1">Zapisz</button>
          <button type="button" class="btn btn-outline-light flex-grow-1" @click="$emit('close')">Anuluj</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, nextTick } from 'vue'
import { db } from '@/firebase'
import { collection, addDoc, doc, updateDoc, getDoc, arrayUnion } from 'firebase/firestore'

const props = defineProps({
  mode: { type: String, required: true }, // 'category' or 'resource'
  categoryId: String,
})
const emits = defineEmits(['close', 'added'])

const categoryName = ref('')
const resourceName = ref('')
const resourceType = ref('link')
const resourceUrl = ref('')
const categoryTitle = ref('')
const firstInput = ref(null)

const fetchCategoryTitle = async () => {
  if (!props.categoryId) return
  const docRef = doc(db, 'knowledgeCategories', props.categoryId)
  const docSnap = await getDoc(docRef)
  if (docSnap.exists()) {
    categoryTitle.value = docSnap.data().title
  }
}

watch(() => props.categoryId, fetchCategoryTitle)

onMounted(() => {
  if (props.mode === 'resource') fetchCategoryTitle()
  nextTick(() => {
    firstInput.value?.focus()
  })
})

const handleSubmit = async () => {
  if (props.mode === 'category') {
    await addDoc(collection(db, 'knowledgeCategories'), {
      title: categoryName.value,
      resources: []
    })
  } else if (props.mode === 'resource' && props.categoryId) {
    const categoryRef = doc(db, 'knowledgeCategories', props.categoryId)
    await updateDoc(categoryRef, {
      resources: arrayUnion({
        name: resourceName.value,
        type: resourceType.value,
        url: resourceUrl.value
      })
    })
  }

  emits('added')
  emits('close')

  categoryName.value = ''
  resourceName.value = ''
  resourceType.value = 'link'
  resourceUrl.value = ''
}
</script>

<style scoped>
.knowledge-form-overlay {
  position: fixed;
  inset: 0;
  background: rgba(30, 20, 50, 0.75);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1500;
}

.knowledge-form {
  max-width: 420px;
  width: 90vw;
  background: rgba(40, 30, 70, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.btn-glow {
  background: linear-gradient(90deg, #9f6eff, #b983ff);
  border: none;
  color: #fff;
  font-weight: 600;
  box-shadow: 0 0 10px #b983ffaa;
  transition: 0.3s ease;
}

.btn-glow:hover {
  box-shadow: 0 0 15px #b983ffdd;
}

.form-label {
  font-weight: 600;
}

/* Nowe: lepsza widoczność inputów */
.styled-input {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #fff;
  transition: 0.3s ease;
}

.styled-input:focus {
  background: rgba(255, 255, 255, 0.12);
  border-color: #b983ff;
  box-shadow: 0 0 6px #b983ff88;
}
</style>
