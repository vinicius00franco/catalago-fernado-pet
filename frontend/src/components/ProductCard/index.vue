<template>
  <div class="card h-100 product-card">
    <div class="position-relative">
      <img
        :src="product.image"
        class="card-img-top"
        :alt="product.name"
        @error="handleImageError"
      />
      <div v-if="discountInfo.discountPercentage > 0" class="discount-badge">
        -{{ discountInfo.discountPercentage }}%
      </div>
    </div>
    <div class="card-body d-flex flex-column">
      <div class="mb-2">
        <span v-if="product.category" class="badge bg-secondary mb-1">
          {{ product.category }}
        </span>
        <span v-if="product.brand" class="badge bg-info ms-1">
          {{ product.brand }}
        </span>
      </div>
      <h5 class="card-title">{{ product.name }}</h5>
      <p v-if="product.description" class="card-text text-muted small">
        {{ truncateText(product.description, 80) }}
      </p>
      <div class="mt-auto">
        <div class="price-section mb-2">
          <div v-if="discountInfo.discount > 0" class="original-price">
            {{ formatPrice(discountInfo.originalPrice) }}
          </div>
          <div class="current-price">
            {{ formatPrice(discountInfo.finalPrice) }}
          </div>
        </div>
        <div class="d-flex gap-2">
          <button
            class="btn btn-primary flex-fill"
            @click="add"
            :disabled="quantity >= 10"
          >
            <i class="bi bi-cart-plus"></i>
            Adicionar
          </button>
          <div v-if="quantity > 0" class="quantity-badge">
            {{ quantity }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useCartStore } from '@/stores/cart'
import { useAuthStore } from '@/stores/auth'
import { getPriceWithDiscount, formatPrice } from '@/utils/priceByRole'
import type { Product } from '@/types'

const props = defineProps<{ product: Product }>()

const cartStore = useCartStore()
const authStore = useAuthStore()

const quantity = computed(() => cartStore.getItemQuantity(props.product.id))

const discountInfo = computed(() =>
  getPriceWithDiscount(props.product.price, authStore.user?.role ?? 'consumer')
)

function add() {
  cartStore.add(props.product)
  cartStore.show()
}

function truncateText(text: string, maxLength: number): string {
  return text.length <= maxLength ? text : text.substring(0, maxLength) + '...'
}

function handleImageError(event: Event) {
  const img = event.target as HTMLImageElement
  img.src = '/placeholder-product.svg'
}
</script>

<style scoped src="./styles.scss"></style>
