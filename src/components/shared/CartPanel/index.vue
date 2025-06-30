<template>
  <div :class="panelClasses">
    <h5 class="mb-2">Carrinho</h5>
    <div v-if="cart.items.length === 0">Vazio</div>
    <ul v-else class="list-group mb-2">
      <li
        v-for="i in cart.items"
        :key="i.product.id"
        class="list-group-item d-flex justify-content-between align-items-center"
      >
        <span>{{ i.product.name }} (x{{ i.quantity }})</span>
        <button class="btn btn-sm btn-danger" @click="cart.remove(i.product.id)">
          Remover
        </button>
      </li>
    </ul>
    <div class="form-check">
      <input
        class="form-check-input"
        type="checkbox"
        id="cartFixedCheck"
        v-model="cart.fixed"
        @change="cart.persist()"
      />
      <label class="form-check-label" for="cartFixedCheck">
        Fixo
      </label>
    </div>
    <div class="dropdown mt-2" v-if="orders.orders.length">
      <button class="btn btn-secondary dropdown-toggle w-100" type="button" @click="showOrders = !showOrders">
        Pedidos
      </button>
      <div class="dropdown-menu w-100 p-2" :class="{ show: showOrders }">
        <div v-for="o in orders.orders" :key="o.id" class="mb-2">
          <details>
            <summary>
              <router-link :to="`/orders/${o.id}`">Pedido #{{ o.id }}</router-link>
            </summary>
            <ul class="list-unstyled ms-3">
              <li v-for="i in o.items" :key="i.product.id">
                {{ i.product.name }} (x{{ i.quantity }})
              </li>
            </ul>
          </details>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useCartStore } from '@/stores/cart'
import { useOrderStore } from '@/stores/order'

const cart = useCartStore()
cart.load()
const orders = useOrderStore()
orders.load()
const showOrders = ref(false)

const panelClasses = computed(() => [
  'cart-panel',
  cart.fixed ? 'position-fixed' : 'position-absolute',
])
</script>

<style scoped src="./styles.scss"></style>
