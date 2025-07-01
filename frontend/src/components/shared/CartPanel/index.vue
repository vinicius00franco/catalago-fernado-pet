<template>
  <div v-if="cart.visible && !cart.fixed" class="cart-overlay" @click="cart.hide()" />
  <div :class="panelClasses">
    <div class="cart-header d-flex justify-content-between align-items-center">
      <h5 class="mb-0">
        <i class="bi bi-cart3 me-2"></i>
        Carrinho
        <span v-if="cart.totalItems > 0" class="badge bg-primary ms-2">
          {{ cart.totalItems }}
        </span>
      </h5>
      <button 
        v-if="!cart.fixed"
        class="btn-close"
        aria-label="Fechar"
        @click="cart.hide()"
      ></button>
    </div>

    <!-- Empty State -->
    <div v-if="cart.isEmpty" class="empty-cart text-center py-4">
      <i class="bi bi-cart-x display-4 text-muted"></i>
      <p class="text-muted mt-2">Seu carrinho está vazio</p>
      <small class="text-muted">Adicione produtos para começar suas compras</small>
    </div>

    <!-- Cart Items -->
    <div v-else class="cart-content">
      <div class="cart-items">
        <div
          v-for="item in cart.items"
          :key="item.product.id"
          class="cart-item"
        >
          <div class="item-info">
            <img 
              :src="item.product.image" 
              :alt="item.product.name"
              class="item-image"
              @error="handleImageError"
            />
            <div class="item-details">
              <h6 class="item-name">{{ item.product.name }}</h6>
              <small class="text-muted">{{ formatPrice(item.product.price) }}</small>
            </div>
          </div>
          
          <div class="item-controls">
            <div class="quantity-controls">
              <button 
                class="btn btn-sm btn-outline-secondary"
                @click="decreaseQuantity(item.product.id)"
                :disabled="item.quantity <= 1"
              >
                <i class="bi bi-dash"></i>
              </button>
              <span class="quantity">{{ item.quantity }}</span>
              <button 
                class="btn btn-sm btn-outline-secondary"
                @click="increaseQuantity(item.product.id)"
                :disabled="item.quantity >= 10"
              >
                <i class="bi bi-plus"></i>
              </button>
            </div>
            <button 
              class="btn btn-sm btn-outline-danger mt-1"
              @click="cart.remove(item.product.id)"
              title="Remover item"
            >
              <i class="bi bi-trash"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Cart Summary -->
      <div class="cart-summary">
        <div class="summary-line">
          <span>Subtotal:</span>
          <strong>{{ formatPrice(cart.totalPrice) }}</strong>
        </div>
        <div class="summary-line total">
          <span>Total:</span>
          <strong class="text-success">{{ formatPrice(cart.totalPrice) }}</strong>
        </div>
      </div>

      <!-- Cart Actions -->
      <div class="cart-actions">
        <router-link 
          to="/cart" 
          class="btn btn-primary w-100 mb-2"
          @click="cart.hide()"
        >
          <i class="bi bi-cart-check me-2"></i>
          Ver Carrinho
        </router-link>
        <button 
          class="btn btn-outline-danger w-100 btn-sm"
          @click="confirmClearCart"
        >
          <i class="bi bi-trash me-2"></i>
          Limpar Carrinho
        </button>
      </div>
    </div>

    <!-- Cart Settings -->
    <div class="cart-settings">
      <div class="form-check form-switch">
        <input
          class="form-check-input"
          type="checkbox"
          id="cartFixedCheck"
          v-model="cart.fixed"
          @change="cart.persist()"
        />
        <label class="form-check-label" for="cartFixedCheck">
          <small>Manter carrinho fixo</small>
        </label>
      </div>
    </div>

    <!-- Recent Orders -->
    <div v-if="orders.orders.length > 0" class="recent-orders">
      <h6 class="orders-title">
        <i class="bi bi-clock-history me-2"></i>
        Pedidos Recentes
      </h6>
      <div class="orders-list">
        <div 
          v-for="order in recentOrders" 
          :key="order.id"
          class="order-item"
        >
          <router-link 
            :to="`/orders/${order.id}`"
            class="order-link"
            @click="cart.hide()"
          >
            <div class="order-info">
              <span class="order-number">Pedido #{{ order.id }}</span>
              <small class="text-muted">{{ formatDate(order.date) }}</small>
            </div>
            <div class="order-items-count">
              <small>{{ order.items.length }} item(s)</small>
            </div>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useCartStore } from '../../../stores/cart'
import { useOrderStore } from '../../../stores/order'
import { formatPrice } from '../../../utils/priceByRole'

const cart = useCartStore()
const orders = useOrderStore()

// Load data
cart.load()
orders.load()

const panelClasses = computed(() => ({
  'cart-panel': true,
  'shadow-lg': true,
  show: cart.visible || cart.fixed,
  'cart-fixed': cart.fixed,
}))

const recentOrders = computed(() => {
  return orders.orders.slice(-3).reverse() // Últimos 3 pedidos
})

function increaseQuantity(productId: number) {
  const item = cart.items.find(item => item.product.id === productId)
  if (item && item.quantity < 10) {
    cart.updateQuantity(productId, item.quantity + 1)
  }
}

function decreaseQuantity(productId: number) {
  const item = cart.items.find(item => item.product.id === productId)
  if (item && item.quantity > 1) {
    cart.updateQuantity(productId, item.quantity - 1)
  }
}

function confirmClearCart() {
  if (confirm('Tem certeza que deseja limpar o carrinho?')) {
    cart.clear()
  }
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit'
  })
}

function handleImageError(event: Event) {
  const img = event.target as HTMLImageElement
  img.src = '/placeholder-product.svg'
}
</script>


<style scoped src="./styles.scss"></style>
