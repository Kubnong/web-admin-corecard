import { createWebHistory, createRouter } from 'vue-router'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: () => import('../views/Login.vue') },
  { path: '/forgot-password', component: () => import('../views/ForgotPassword.vue')},
  { path: '/setup2fa', component: () => import('../views/Setup2fa.vue')},
  { path: '/debit-manage', component: () => import('../views/DebitManage.vue')},
  { path: '/debit-type-manage', component: () => import('../views/DebitTypeManage.vue')},
  { path: '/debit-detail', component: () => import('../views/DebitDetail.vue')},
  { path: '/add-debit-type', component: () => import('../views/AddDebitType.vue')},
  { path: '/edit-debit-type', component: () => import('../views/EditDebitType.vue')},
  { path: '/setting', component: () => import('../views/Setting.vue')}
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router