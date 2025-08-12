import { createRouter, createWebHistory } from 'vue-router'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { getFirestore, doc, getDoc } from 'firebase/firestore'

// Widoki logowania/rejestracji
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'

// Layout główny
import AppLayout from '../layouts/AppLayout.vue'

// Główne widoki
import DashboardView from '../views/DashboardView.vue'
import TaskView from '../views/TaskView.vue'
import KnowledgeView from '../views/KnowledgeView.vue'
import UserProfileView from '@/views/UserProfileView.vue'

// Nowe widoki
import TeamView from '@/views/TeamView.vue'
import TeamDetailsView from '@/views/TeamDetailsView.vue'
import RankingView from '@/views/RankingView.vue'
import AdminView from '@/views/AdminView.vue' // odkomentowane

const routes = [
  {
    path: '/login',
    component: LoginView
  },
  {
    path: '/register',
    component: RegisterView
  },
  {
    path: '/',
    component: AppLayout,
    meta: { requiresAuth: true },
    children: [
      { path: 'dashboard', component: DashboardView },
      { path: 'tasks', component: TaskView },
      { path: 'knowledge', component: KnowledgeView },
      { path: 'team', component: TeamView },
      { path: 'team/:id', component: TeamDetailsView, props: true },
      { path: 'ranking', component: RankingView },
      { path: 'profile', component: UserProfileView },
      {
        path: 'admin',
        component: AdminView,
        meta: { requiresAdmin: true }
      },
      { path: '', redirect: '/dashboard' }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Guard logowania + admin
router.beforeEach((to, from, next) => {
  const auth = getAuth()
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const requiresAdmin = to.matched.some(record => record.meta.requiresAdmin)

  if (requiresAuth || requiresAdmin) {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      unsubscribe()
      if (!user) {
        return next('/login')
      }

      if (requiresAdmin) {
        try {
          // Sprawdzenie roli w Firestore
          const db = getFirestore()
          const userDoc = await getDoc(doc(db, 'users', user.uid))
          const role = userDoc.exists() ? userDoc.data().role : null

          // Admin jeśli ma rolę admin lub jest na e-mailu specjalnym
          if (role === 'admin' || user.email === 'abcd@gmail.com') {
            return next()
          } else {
            return next('/dashboard')
          }
        } catch (error) {
          console.error('Błąd sprawdzania roli admina:', error)
          return next('/dashboard')
        }
      }

      next()
    })
  } else {
    next()
  }
})

export default router
