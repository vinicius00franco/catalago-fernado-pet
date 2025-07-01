<template>
  <div class="container py-5">
    <h1>Pedidos</h1>
    <button
      class="btn btn-primary mb-3"
      :disabled="cart.items.length === 0"
      @click="createOrder"
    >
      Criar pedido
    </button>
    <div v-if="ordersStore.orders.length === 0">Nenhum pedido</div>
    <ul class="list-group" v-else>
      <li v-for="o in ordersStore.orders" :key="o.id" class="list-group-item">
        <details>
          <summary>
            <router-link :to="`/orders/${o.id}`"
              >Pedido #{{ o.id }}</router-link
            >
            - {{ formatDate(o.date) }}
          </summary>
          <ul class="list-unstyled mt-2 ms-3">
            <li v-for="i in o.items" :key="i.product.id">
              {{ i.product.name }} (x{{ i.quantity }})
            </li>
          </ul>
        </details>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useCartStore } from '@/stores/cart'
import { useOrderStore } from '@/stores/order'

const cart = useCartStore()
const ordersStore = useOrderStore()

onMounted(() => {
  ordersStore.load()
  cart.load()
})

function createOrder() {
  if (cart.items.length === 0) return
  ordersStore.addOrder(cart.items)
  cart.items = []
  cart.persist()
}

function formatDate(date: string) {
  return new Date(date).toLocaleString()
}
</script>

<style scoped src="./styles.scss"></style>
