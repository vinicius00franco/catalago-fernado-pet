<template>
  <div class="container py-5" v-if="order">
    <h1>Pedido #{{ order.id }}</h1>
    <p class="text-muted">{{ formatDate(order.date) }}</p>
    <ul class="list-group">
      <li v-for="i in order.items" :key="i.product.id" class="list-group-item">
        {{ i.product.name }} (x{{ i.quantity }})
      </li>
    </ul>
  </div>
  <div v-else class="container py-5">
    <h1>Pedido não encontrado</h1>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useOrderStore } from '@/stores/order'

const orders = useOrderStore()
const route = useRoute()
const order = ref(orders.getOrder(Number(route.params.id)))

onMounted(() => {
  orders.load()
  order.value = orders.getOrder(Number(route.params.id))
})

function formatDate(date: string) {
  return new Date(date).toLocaleString()
}
</script>

<style scoped src="./styles.scss"></style>
