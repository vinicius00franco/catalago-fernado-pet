<template>
  <div>
    <h1>Catálogo</h1>
    <div class="row g-3">
      <div v-for="p in displayed" :key="p.id" class="col-sm-6 col-md-4 col-lg-3">
        <div class="card h-100">
          <img :src="p.image" class="card-img-top" />
          <div class="card-body">
            <h5 class="card-title">{{ p.name }}</h5>
            <p class="card-text">{{ price(p.price) }}</p>
            <button class="btn btn-primary" @click="add(p)">Adicionar</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useProductStore } from '@/stores/product'
import { useCartStore } from '@/stores/cart'
import { priceByRole } from '@/utils/priceByRole'
import { useAuthStore } from '@/stores/auth'
import type { Product } from '@/types'

const productStore = useProductStore()
const cartStore = useCartStore()
const authStore = useAuthStore()
const displayed = computed(() => {
  if (!authStore.user || authStore.user.role === 'consumer') return productStore.products
  return productStore.products.slice(0, 10)
})

function add(p: Product) {
  cartStore.add(p)
}

function price(base: number) {
  return priceByRole(authStore.user?.role ?? 'consumer', base)
}
</script>

<style scoped>
.card-img-top {
  height: 150px;
  object-fit: cover;
}
</style>
