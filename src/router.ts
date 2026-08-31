import { createWebHistory, createRouter } from 'vue-router'

import HomeView from './views/HomeView.vue'
import AdminView from './views/AdminView.vue'
import ManageBikesView from './views/ManageBikesView.vue'
import NotFound from './views/NotFound.vue'

const routes = [
  { path: '/', component: HomeView },
  { path: '/admin/', component: AdminView },
  { path: '/admin/manage', name: 'manage', component: ManageBikesView },
  { path: '/:pathMatch(.*)*', name: 'notFound', component: NotFound },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
