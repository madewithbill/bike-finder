import { createWebHistory, createRouter } from 'vue-router'
import { supabase } from './utils/supabaseClient.ts'

import HomeView from './views/HomeView.vue'
import LoginView from './views/LoginView.vue'
import ManageBikesView from './views/ManageBikesView.vue'
import NotFound from './views/NotFound.vue'

const routes = [
  { path: '/', component: HomeView },
  { path: '/admin/', redirect: { name: 'manage' } },
  { path: '/admin/login', name: 'login', component: LoginView },
  { path: '/admin/manage', name: 'manage', component: ManageBikesView },
  { path: '/:pathMatch(.*)*', name: 'notFound', component: NotFound },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(async (to, from) => {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  const isAuthenticated = user?.role === 'authenticated'

  if (
    // make sure the user is authenticated
    !isAuthenticated &&
    // Avoid an infinite redirect
    to.name !== 'login' &&
    // Allow nav to home
    to.path !== '/'
  ) {
    // redirect the user to the login page
    return { name: 'login' }
  }
})

export default router
