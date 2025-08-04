<template>
  <div class="news-card p-4 rounded-4 shadow text-light" :style="{ background: gradient }">
    <h5 class="mb-3">{{ icon }} {{ title }}</h5>
    <ul class="list-unstyled">
      <li v-for="item in items" :key="item.id" class="mb-2">• {{ item.title }}</li>
    </ul>
    <button class="btn btn-sm btn-outline-light mt-2" @click="$emit('showMore')">Pokaż więcej</button>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  items: Array,
  icon: String,
  gradient: String
})
defineEmits(['showMore'])
</script>

<style scoped>
.news-card {
  min-height: 230px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.news-card:hover {
  transform: scale(1.02);
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.2);
}
</style>
