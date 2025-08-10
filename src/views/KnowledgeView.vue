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
  background: linear-gradient(135deg, #14111c, #1d1530);
  border-radius: 16px;
  padding: 1rem 1.5rem;
  animation: fadeIn 0.5s ease forwards;
}

/* Neonowy nagłówek */
.section-title {
  font-weight: 700;
  border-left: 5px solid #b983ff;
  padding-left: 12px;
  background: linear-gradient(90deg, #b983ff, #7f5af0);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
}

/* Input szukajki */
.search-input {
  max-width: 300px;
  background: rgba(255, 255, 255, 0.07);
  border: 1px solid #b983ff;
  color: #eee;
  border-radius: 0.5rem;
  padding: 0.375rem 0.75rem;
  transition: border-color 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #7f5af0;
  box-shadow: 0 0 8px #b983ffaa;
}

/* Przycisk z efektem glow */
.btn-glow {
  background: linear-gradient(90deg, #9f6eff, #b983ff);
  border: none;
  color: #fff;
  font-weight: 600;
  box-shadow: 0 0 10px #b983ffaa;
  transition: box-shadow 0.3s ease, transform 0.2s ease;
  border-radius: 0.75rem;
  padding: 0.5rem 1.2rem;
  user-select: none;
}

.btn-glow:hover {
  box-shadow: 0 0 15px #b983ffdd;
  transform: scale(1.05);
}

/* Kontener przycisku i inputa */
.mb-3.d-flex.gap-3.align-items-center {
  flex-wrap: wrap;
}

/* Animacja fade-in */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Jeśli wiesz, że KnowledgeCard jest kartą, można dodać styl na karty */
.knowledge-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(185, 131, 255, 0.3);
  box-shadow: 0 0 10px rgba(185, 131, 255, 0.2);
  border-radius: 1rem;
  backdrop-filter: blur(5px);
  padding: 1rem;
  color: #eee;
  transition: box-shadow 0.3s ease;
}

.knowledge-card:hover {
  box-shadow: 0 0 18px #b983ffcc;
}
</style>

