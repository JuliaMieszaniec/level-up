<template>
  <div class="knowledge-view container py-4">
    <h3 class="section-title mb-4">📚 Baza Wiedzy</h3>

    <div class="mb-3 d-flex gap-3 align-items-center">
      <button class="btn btn-glow" @click="showAddCategory = true">+ Dodaj kategorię</button>
      <input v-model="searchTerm" type="text" placeholder="Szukaj..." class="form-control search-input" />
    </div>

    <div class="row g-4">
      <div 
        v-for="category in filteredCategories" 
        :key="category.id" 
        class="col-md-4"
      >
        <KnowledgeCard 
          :category="category" 
          @add-resource="openAddResourceForm"
        />
      </div>
    </div>

    <KnowledgeForm 
      v-if="showAddCategory" 
      mode="category" 
      @close="showAddCategory = false" 
      @added="fetchCategories"
    />

    <KnowledgeForm
      v-if="showAddResourceForCategory"
      :mode="'resource'"
      :categoryId="showAddResourceForCategory"
      @close="showAddResourceForCategory = null"
      @added="fetchCategories"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { db } from '@/firebase'
import { collection, getDocs, doc, updateDoc, arrayUnion } from 'firebase/firestore'
import KnowledgeCard from '@/components/KnowledgeCard.vue'
import KnowledgeForm from '@/components/KnowledgeForm.vue'

const categories = ref([])
const showAddCategory = ref(false)
const showAddResourceForCategory = ref(null)
const searchTerm = ref('')

const fetchCategories = async () => {
  const snapshot = await getDocs(collection(db, 'knowledgeCategories'))
  categories.value = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }))
}

const filteredCategories = computed(() => {
  if (!searchTerm.value.trim()) return categories.value
  const term = searchTerm.value.toLowerCase()
  return categories.value.filter(cat => 
    cat.title.toLowerCase().includes(term) ||
    (cat.resources?.some(r => r.name.toLowerCase().includes(term)) ?? false)
  )
})

const openAddResourceForm = (categoryId) => {
  showAddResourceForCategory.value = categoryId
}

onMounted(fetchCategories)
</script>

<style scoped>
.knowledge-view {
  color: #eee;
}

.section-title {
  font-weight: 700;
  border-left: 5px solid #b983ff;
  padding-left: 12px;
}

.search-input {
  max-width: 300px;
  background: rgba(255, 255, 255, 0.07);
  border: 1px solid #b983ff;
  color: #eee;
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
</style>
