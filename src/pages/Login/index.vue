<template>
  <div class="container py-5">
    <h1>Login</h1>
    <form @submit.prevent="submit" class="w-50 mx-auto">
      <div class="mb-3">
        <input v-model="name" type="text" class="form-control" placeholder="Nome" required />
      </div>
      <div class="mb-3">
        <select v-model="role" class="form-select">
          <option value="consumer">Consumidor</option>
          <option value="shop">Lojista</option>
          <option value="distributor">Distribuidora</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      <button class="btn btn-primary" type="submit">Entrar</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore, type User } from '@/stores/auth'
import { useRouter } from 'vue-router'
const auth = useAuthStore()
const router = useRouter()
const name = ref('')
const role = ref<User['role']>('consumer')
function submit() {
  auth.login({ id: 1, name: name.value, role: role.value }, 'token')
  router.push('/')
}
</script>
