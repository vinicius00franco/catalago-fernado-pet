<template>
  <div class="container py-5">
    <h1>Carrinho</h1>
    <div v-if="items.length === 0">Vazio</div>
    <ul class="list-group" v-else>
      <li v-for="i in items" :key="i.product.id" class="list-group-item d-flex justify-content-between">
        <span>{{ i.product.name }} (x{{ i.quantity }})</span>
        <button class="btn btn-danger btn-sm" @click="remove(i.product.id)">Remover</button>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useCartStore } from '@/stores/cart'
const cart = useCartStore()
cart.load()
const items = computed(() => cart.items)
function remove(id: number) {
  cart.remove(id)
}
</script>
