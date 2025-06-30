import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'
import { useAuthStore } from './stores/auth'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import './design-system/index.scss'

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)
useAuthStore(pinia).load()
app.use(router)
app.mount('#app')
