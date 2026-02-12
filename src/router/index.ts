import { createWebHistory, createRouter } from 'vue-router'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: () => import('../views/Login.vue') },
  { path: '/setup2fa', component: () => import('../views/Setup2fa.vue')},
  { path: '/debit-manage', component: () => import('../views/DebitManage.vue')}
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router