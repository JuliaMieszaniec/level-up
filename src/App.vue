<template>
  <div id="app">
    <TopBar :user="user" />
    <router-view />
  </div>
</template>

<script>
import TopBar from './components/TopBar.vue'

export default {
  components: {
    TopBar
  },
  data() {
    return {
      user: {
        name: 'Wiktoria',
        avatarUrl: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fpl-pl.facebook.com%2FGrajmywgry.1%2F&psig=AOvVaw0UfwzTuMnig0NGA3aWZvFD&ust=1754051689868000&source=images&cd=vfe&opi=89978449&ved=0CBUQjRxqFwoTCNil9fCN544DFQAAAAAdAAAAABAE',
        level: 4,
        xp: 950,
        badges: [
          { id: 'early-bird', name: 'Wcześniak', icon: '/badges/early.png' },
          { id: 'leader', name: 'Liderka', icon: '/badges/leader.png' }
        ]
      }
    }
  }
}
</script>
