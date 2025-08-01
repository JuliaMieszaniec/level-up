<template>
  <nav class="navbar navbar-expand bg-dark text-white px-3 py-2 shadow-sm">
    <div class="d-flex align-items-center">
      <img
        :src="user.avatarUrl || '/default-avatar.png'"
        alt="Avatar"
        class="rounded-circle border border-secondary me-3"
        style="width: 48px; height: 48px;"
      />
      <div>
        <div class="fw-semibold">{{ user.name }}</div>
        <small class="text-muted">
          Level {{ level }} • {{ currentXp }}/{{ xpToNextLevel }} XP
        </small>
        <div class="progress mt-1" style="height: 6px; width: 150px;">
          <div
            class="progress-bar bg-purple"
            role="progressbar"
            :style="{ width: xpPercent + '%' }"
            :aria-valuenow="currentXp"
            :aria-valuemin="0"
            :aria-valuemax="xpToNextLevel"
          ></div>
        </div>
      </div>
    </div>

    <div class="ms-auto d-flex align-items-center">
      <div class="d-none d-md-flex me-3">
        <img
          v-for="badge in user.badges"
          :key="badge.id"
          :src="badge.icon"
          :alt="badge.name"
          class="me-1"
          style="width: 20px; height: 20px;"
          :title="'Odznaka: ' + badge.name"
        />
      </div>

      <button class="btn btn-outline-light btn-sm me-2" @click="goToProfile">
        Mój profil
      </button>
      <button class="btn btn-purple btn-sm" @click="logout">
        Wyloguj
      </button>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'TopBar',
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  computed: {
    level() {
      return Math.floor(this.user.xp / 1000)
    },
    currentXp() {
      return this.user.xp % 1000
    },
    xpToNextLevel() {
      return 1000
    },
    xpPercent() {
      return Math.floor((this.currentXp / this.xpToNextLevel) * 100)
    }
  },
  methods: {
    goToProfile() {
      this.$router.push('/profil')
    },
    logout() {
      console.log('Wylogowano')
    }
  }
}
</script>

<style scoped>
.btn-purple {
  background-color: #7c3aed;
  color: white;
  border: none;
}
.btn-purple:hover {
  background-color: #6d28d9;
}
.navbar {
  background-color: #121212 !important;
}
.bg-purple {
  background-color: #a855f7 !important;
}
</style>
