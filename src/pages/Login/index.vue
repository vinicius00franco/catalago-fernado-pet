<template>
  <div class="container py-5">
    <h1>Login</h1>
    <form @submit.prevent="submit" class="w-50 mx-auto">
      <div class="mb-3">
        <input v-model="name" type="text" class="form-control" placeholder="Nome" required />
      </div>
      <div class="mb-3">
        <input v-model="password" type="password" class="form-control" placeholder="Senha" required />
      </div>
      <button class="btn btn-primary" type="submit">Entrar</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
const auth = useAuthStore()
const router = useRouter()
const name = ref('')
const password = ref('')
async function submit() {
  await auth.login(name.value, password.value)
  router.push('/')
}
</script>
