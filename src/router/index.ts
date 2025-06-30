import { createRouter, createWebHistory } from 'vue-router'
const HomePage = () => import('@/pages/Home/index.vue')
const LoginPage = () => import('@/pages/Login/index.vue')
const RegisterPage = () => import('@/pages/Register/index.vue')
const AboutPage = () => import('@/pages/About/index.vue')
const FreightPage = () => import('@/pages/Freight/index.vue')
const CartPage = () => import('@/pages/Cart/index.vue')
const AdminPage = () => import('@/pages/Admin/index.vue')
import { useAuthStore } from '@/stores/auth'

const routes = [
  { path: '/', name: 'home', component: HomePage },
  { path: '/login', name: 'login', component: LoginPage, meta: { guestOnly: true } },
  { path: '/register', name: 'register', component: RegisterPage, meta: { guestOnly: true } },
  { path: '/about', name: 'about', component: AboutPage },
  { path: '/freight', name: 'freight', component: FreightPage },
  { path: '/cart', name: 'cart', component: CartPage, meta: { requiresAuth: true } },
  { path: '/admin', name: 'admin', component: AdminPage, meta: { requiresAuth: true, roles: ['admin'] } },
  { path: '/:catchAll(.*)*', redirect: '/' },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.user) return { name: 'login' }
  if (to.meta.roles && !to.meta.roles.includes(auth.user?.role ?? '')) return { name: 'home' }
  if (to.meta.guestOnly && auth.user) return { name: 'home' }
  return true
})

export default router
