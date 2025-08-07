<template>
  <div class="knowledge-card card glassy p-3 h-100 d-flex flex-column">
    <div class="d-flex justify-content-between align-items-center mb-2">
      <h5 class="mb-0">{{ category.title }}</h5>
      <button class="btn btn-sm btn-outline-light" @click="toggleExpand">
        {{ expanded ? '−' : '+' }}
      </button>
    </div>

    <ul v-if="expanded && category.resources?.length" class="resource-list">
      <li v-for="(res, index) in category.resources" :key="index" class="resource-item">
        <a 
          v-if="res.type === 'link'" 
          :href="res.url" target="_blank" 
          class="text-info"
        >
          {{ res.name }}
        </a>
        <a 
          v-else-if="res.type === 'file'" 
          :href="res.url" target="_blank"
          class="text-info"
          download
        >
          {{ res.name }}
        </a>
        <span v-else>{{ res.name }}</span>
      </li>
    </ul>
    <p v-else-if="expanded" class="text-muted fst-italic">Brak zasobów w tej kategorii.</p>

    <button class="btn btn-sm btn-glow mt-auto" @click="$emit('add-resource', category.id)">
      + Dodaj zasób
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  category: Object
})

const expanded = ref(false)

const toggleExpand = () => {
  expanded.value = !expanded.value
}
</script>

<style scoped>
.knowledge-card {
  display: flex;
  flex-direction: column;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(185, 131, 255, 0.3);
  box-shadow: 0 0 10px rgba(185, 131, 255, 0.2);
  color: #eee;
}

.resource-list {
  list-style: none;
  padding-left: 0;
  margin-bottom: 0.75rem;
  max-height: 200px;
  overflow-y: auto;
}

.resource-item {
  margin-bottom: 0.3rem;
  font-size: 0.9rem;
}

.resource-item a {
  color: #b983ff;
  text-decoration: underline;
}

.resource-item a:hover {
  color: #9f6eff;
}
</style>
