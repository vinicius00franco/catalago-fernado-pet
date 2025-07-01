import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'
import { useAuthStore } from './stores/auth'
import { useThemeStore } from './stores/theme'
import { useCartStore } from './stores/cart'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import './design-system/index.scss'

async function bootstrap() {
  const app = createApp(App)
  const pinia = createPinia()
  
  app.use(pinia)
  
  // Inicializar stores
  const authStore = useAuthStore(pinia)
  const themeStore = useThemeStore(pinia)
  const cartStore = useCartStore(pinia)
  
  // Carregar dados persistidos
  await authStore.load()
  themeStore.initializeTheme()
  cartStore.load()
  
  app.use(router)
  await router.isReady()
  
  app.mount('#app')
}

bootstrap().catch(error => {
  console.error('Erro ao inicializar aplicação:', error)
})
