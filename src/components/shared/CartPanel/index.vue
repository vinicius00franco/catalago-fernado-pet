<template>
  <div :class="panelClasses" v-show="cart.visible || cart.fixed">
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

const panelClasses = computed(() => [
  'cart-panel',
  'shadow-lg',
  cart.fixed ? 'position-fixed cart-fixed' : 'position-absolute',
])

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

<style scoped>
.cart-panel {
  top: 100%;
  right: 0;
  width: 380px;
  max-width: 90vw;
  background: white;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  z-index: 1050;
  max-height: 80vh;
  overflow-y: auto;
}

.cart-fixed {
  top: 20px;
  right: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1) !important;
}

.cart-header {
  padding: 1rem;
  border-bottom: 1px solid #eee;
  background: #f8f9fa;
  border-radius: 8px 8px 0 0;
  position: sticky;
  top: 0;
  z-index: 1;
}

.empty-cart {
  padding: 2rem 1rem;
}

.cart-content {
  padding: 1rem;
}

.cart-items {
  max-height: 300px;
  overflow-y: auto;
  margin-bottom: 1rem;
}

.cart-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid #f0f0f0;
}

.cart-item:last-child {
  border-bottom: none;
}

.item-info {
  display: flex;
  align-items: center;
  flex: 1;
  gap: 0.75rem;
}

.item-image {
  width: 48px;
  height: 48px;
  object-fit: cover;
  border-radius: 4px;
  border: 1px solid #eee;
}

.item-details {
  flex: 1;
  min-width: 0;
}

.item-name {
  font-size: 0.875rem;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-controls {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #f8f9fa;
  border-radius: 20px;
  padding: 0.25rem;
}

.quantity-controls .btn {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  font-size: 0.75rem;
}

.quantity {
  min-width: 20px;
  text-align: center;
  font-size: 0.875rem;
  font-weight: 500;
}

.cart-summary {
  border-top: 1px solid #eee;
  padding-top: 1rem;
  margin-bottom: 1rem;
}

.summary-line {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.summary-line.total {
  font-size: 1.1rem;
  border-top: 1px solid #eee;
  padding-top: 0.5rem;
  margin-top: 0.5rem;
}

.cart-actions {
  margin-bottom: 1rem;
}

.cart-settings {
  padding: 0.5rem 0;
  border-top: 1px solid #eee;
  margin-bottom: 1rem;
}

.recent-orders {
  border-top: 1px solid #eee;
  padding-top: 1rem;
}

.orders-title {
  font-size: 0.875rem;
  color: #6c757d;
  margin-bottom: 0.75rem;
}

.order-item {
  margin-bottom: 0.5rem;
}

.order-link {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  background: #f8f9fa;
  border-radius: 4px;
  text-decoration: none;
  color: inherit;
  transition: background-color 0.2s;
}

.order-link:hover {
  background: #e9ecef;
  color: inherit;
}

.order-number {
  font-weight: 500;
  font-size: 0.875rem;
}

.order-items-count {
  color: #6c757d;
}

/* Dark theme */
[data-theme='dark'] .cart-panel {
  background: #343a40;
  border-color: #495057;
  color: #f8f9fa;
}

[data-theme='dark'] .cart-header {
  background: #495057;
  border-color: #6c757d;
}

[data-theme='dark'] .cart-item {
  border-color: #495057;
}

[data-theme='dark'] .quantity-controls {
  background: #495057;
}

[data-theme='dark'] .cart-summary,
[data-theme='dark'] .cart-settings,
[data-theme='dark'] .recent-orders {
  border-color: #495057;
}

[data-theme='dark'] .order-link {
  background: #495057;
  color: #f8f9fa;
}

[data-theme='dark'] .order-link:hover {
  background: #6c757d;
  color: #f8f9fa;
}

/* Responsive */
@media (max-width: 767.98px) {
  .cart-panel {
    width: 100vw;
    left: 0;
    right: 0;
    border-radius: 0;
    max-height: 70vh;
  }
  
  .cart-fixed {
    top: 10px;
    left: 10px;
    right: 10px;
    width: auto;
    border-radius: 8px;
  }
}
</style>
