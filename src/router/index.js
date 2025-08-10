import { createRouter, createWebHistory } from 'vue-router'
import { getAuth, onAuthStateChanged } from 'firebase/auth'

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
import RankingView from '@/views/RankingView.vue'
//import AdminView from '@/views/AdminView.vue'

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
      {
        path: 'dashboard',
        component: DashboardView
      },
      {
        path: 'tasks',
        component: TaskView
      },
      {
        path: 'knowledge',
        component: KnowledgeView
      },
      {
        path: 'team',
        component: TeamView
      },
      {
        path: 'ranking',
        component: RankingView
      },
      {
        path: 'profile',
        component: UserProfileView
      },
      //{
      //  path: 'admin',
      //  component: AdminView,
      //  meta: { requiresAdmin: true }
      //},
      {
        path: '',
        redirect: '/dashboard'
      }
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
    const unsubscribe = onAuthStateChanged(auth, user => {
      unsubscribe()
      if (!user) {
        next('/login')
      } else if (requiresAdmin && user.role !== 'admin') {
        // brak dostępu dla nie-admina
        next('/dashboard')
      } else {
        next()
      }
    })
  } else {
    next()
  }
})

export default router
