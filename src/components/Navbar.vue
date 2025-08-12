<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-transparent shadow-sm px-4 py-2 border-bottom border-secondary">
    <div class="container-fluid d-flex justify-content-between align-items-center">
      
      <!-- Nazwa aplikacji -->
      <RouterLink to="/dashboard" class="navbar-brand text-gradient fs-4 fw-bold">
        LevelUp
      </RouterLink>

      <!-- Przycisk hamburger (toggler) -->
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <!-- Linki nawigacyjne -->
      <div class="collapse navbar-collapse" id="navbarNav">
        <div class="navbar-nav ms-auto d-flex gap-3 align-items-center">
          <RouterLink to="/dashboard" class="nav-link">Panel główny</RouterLink>
          <RouterLink to="/team" class="nav-link">Zespół</RouterLink>
          <RouterLink to="/knowledge" class="nav-link">Baza wiedzy</RouterLink>
          <RouterLink to="/ranking" class="nav-link">Ranking</RouterLink>
          <RouterLink to="/profile" class="nav-link">Profil</RouterLink>
          
          <!-- Link do panelu admina widoczny tylko dla admina lub konkretnego e-maila -->
          <RouterLink
            v-if="canAccessAdmin"
            to="/admin"
            class="nav-link"
          >
            Panel administratora
          </RouterLink>

          <button @click="logout" class="btn btn-sm btn-outline-light">Wyloguj się</button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { computed } from 'vue'

const router = useRouter()
const { logoutUser, user } = useAuth()

// Sprawdzenie czy użytkownik może wejść do panelu admina
const canAccessAdmin = computed(() => {
  if (!user.value) return false
  return user.value.role === 'admin' || user.value.email === 'abcd@gmail.com'
})

const logout = async () => {
  try {
    await logoutUser()
    router.push('/login')
  } catch (error) {
    console.error('Błąd podczas wylogowywania:', error)
  }
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

.nav-link,
.navbar-brand {
  text-shadow: 0 0 5px rgba(255,255,255,0.3);
}
</style>
