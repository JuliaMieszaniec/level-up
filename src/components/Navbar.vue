<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-transparent shadow-sm px-4 py-2 border-bottom border-secondary">
    <div class="container-fluid d-flex justify-content-between align-items-center">
      <!-- Nazwa aplikacji -->
      <div class="navbar-brand text-gradient fs-4 fw-bold">LevelUp</div>

      <!-- Przyciski nawigacyjne -->
      <div class="d-flex gap-3 align-items-center">
        <RouterLink to="/dashboard" class="nav-link">Panel główny</RouterLink>
        <RouterLink to="/team" class="nav-link">Zespół</RouterLink>
        <RouterLink to="/knowledge" class="nav-link">Baza wiedzy</RouterLink>
        <RouterLink to="/profile" class="nav-link">Profil</RouterLink>
        <RouterLink
          v-if="user?.role === 'admin'"
          to="/admin"
          class="nav-link"
        >
          Zarządzanie
        </RouterLink>
        <button @click="logout" class="btn btn-sm btn-outline-light">Wyloguj się</button>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
const router = useRouter()
const { logoutUser, user } = useAuth()

const logout = async () => {
  await logoutUser()
  router.push('/login')
}
</script>

<style scoped>
.navbar-brand.text-gradient {
  background: linear-gradient(to right, #9f6eff, #b983ff);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.nav-link {
  color: #ddd;
  transition: 0.2s;
}
.nav-link:hover {
  color: #fff;
  text-decoration: underline;
}
</style>
