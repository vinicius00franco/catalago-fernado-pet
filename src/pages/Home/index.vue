<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1>Catálogo</h1>
      <div class="d-flex gap-2">
        <button 
          class="btn btn-outline-secondary"
          @click="refreshProducts"
          :disabled="productStore.loading"
        >
          <i class="bi bi-arrow-clockwise"></i>
          {{ productStore.loading ? 'Carregando...' : 'Atualizar' }}
        </button>
      </div>
    </div>

    <ProductFilters />

    <!-- Loading state -->
    <div v-if="productStore.loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Carregando...</span>
      </div>
      <p class="mt-2">Carregando produtos...</p>
    </div>

    <!-- Error state -->
    <div v-else-if="productStore.error" class="alert alert-danger">
      <h5>Erro ao carregar produtos</h5>
      <p>{{ productStore.error }}</p>
      <button class="btn btn-outline-danger" @click="refreshProducts">
        Tentar novamente
      </button>
    </div>

    <!-- Empty state -->
    <div v-else-if="displayed.length === 0" class="text-center py-5">
      <i class="bi bi-search display-4 text-muted"></i>
      <h3 class="mt-3">Nenhum produto encontrado</h3>
      <p class="text-muted">
        {{ productStore.products.length === 0 
          ? 'Nenhum produto disponível' 
          : 'Tente ajustar os filtros de busca'
        }}
      </p>
    </div>

    <!-- Products grid -->
    <div v-else class="row g-3">
      <div class="col-12 mb-3 d-flex justify-content-between align-items-center">
        <small class="text-muted">
          Mostrando {{ paginatedProducts.length }} de {{ displayed.length }} produtos
          <span v-if="authStore.user && authStore.user.role !== 'consumer'">
            ({{ authStore.user.role === 'admin' ? 'todos os produtos' : 'primeiros 10' }})
          </span>
        </small>
        
        <!-- Items per page selector -->
        <div class="d-flex align-items-center gap-2">
          <small class="text-muted">Itens por página:</small>
          <select 
            v-model="itemsPerPage" 
            class="form-select form-select-sm" 
            style="width: auto;"
            @change="currentPage = 1"
          >
            <option :value="10">10</option>
            <option :value="20">20</option>
            <option :value="30">30</option>
          </select>
        </div>
      </div>
      
      <ProductCard
        v-for="product in paginatedProducts"
        :key="product.id"
        :product="product"
        class="col-sm-6 col-md-4 col-lg-3" />

      <!-- Pagination -->
    </div>
    </div>
  </div>
<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useProductStore } from '../../stores/product'
import { useCartStore } from '../../stores/cart'
import ProductCard from "@/components/ProductCard"
import ProductFilters from "@/components/ProductFilters"
import PaginationControls from "@/components/PaginationControls"
import { useAuthStore } from '../../stores/auth'
import { getPriceWithDiscount, formatPrice } from '../../utils/priceByRole'
import { loadProducts } from '../../services/api'
import type { Product } from '../../types'

const productStore = useProductStore()
const cartStore = useCartStore()
const authStore = useAuthStore()

// Pagination state
const currentPage = ref(1)
const itemsPerPage = ref(20)

const displayed = computed(() => {
  const filtered = productStore.filteredProducts
  
  // Limitar produtos para não-consumidores e não-admin
  if (authStore.user && authStore.user.role !== 'consumer' && authStore.user.role !== 'admin') {
    return filtered.slice(0, 10)
  }
  
  return filtered
})

// Pagination computed properties
const totalPages = computed(() => {
  return Math.ceil(displayed.value.length / itemsPerPage.value)
})

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return displayed.value.slice(start, end)
})

const visiblePages = computed(() => {
  const pages = []
  const maxVisible = 5
  const total = totalPages.value
  const current = currentPage.value
  
  if (total <= maxVisible) {
    // Show all pages if total is small
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    // Show pages around current page
    let start = Math.max(1, current - 2)
    let end = Math.min(total, current + 2)
    
    // Adjust if we're near the beginning or end
    if (current <= 3) {
      end = Math.min(total, 5)
    } else if (current >= total - 2) {
      start = Math.max(1, total - 4)
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
  }
  
  return pages
})


onMounted(() => {
  loadProducts('/data/produtos.csv')
})

// Watch for filter changes to reset pagination
watch(() => productStore.filters, () => {
  currentPage.value = 1
}, { deep: true })

// Watch for sort changes to reset pagination
watch(() => productStore.sortOptions, () => {
  currentPage.value = 1
}, { deep: true })

onMounted(async () => {
  await loadProductsData()
})

async function loadProductsData() {
  try {
    await loadProducts('/data/produtos.json')
  } catch (error) {
    console.error('Erro ao carregar produtos:', error)
  }
}

async function refreshProducts() {
  try {
    await loadProducts('/data/produtos.json', { forceRefresh: true })
  } catch (error) {
    console.error('Erro ao atualizar produtos:', error)
  }
}

function goToPage(page: number) {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    document.querySelector('.row.g-3')?.scrollIntoView({ behavior: 'smooth' })
  }
}
</script>

<style scoped src="./styles.scss"></style>

