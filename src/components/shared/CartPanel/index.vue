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
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useCartStore } from '@/stores/cart'

const cart = useCartStore()
cart.load()

const panelClasses = computed(() => [
  'cart-panel',
  cart.fixed ? 'position-fixed' : 'position-absolute',
])
</script>

<style scoped src="./styles.scss"></style>
