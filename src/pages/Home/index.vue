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

    <!-- Filtros -->
    <div class="card mb-4">
      <div class="card-body">
        <div class="row g-3">
          <div class="col-md-4">
            <label class="form-label">Buscar</label>
            <input
              v-model="productStore.filters.search"
              type="text"
              class="form-control"
              placeholder="Nome, descrição, marca..."
            />
          </div>
          <div class="col-md-3">
            <label class="form-label">Categoria</label>
            <select v-model="productStore.filters.category" class="form-select">
              <option value="">Todas as categorias</option>
              <option v-for="category in productStore.categories" :key="category" :value="category">
                {{ category }}
              </option>
            </select>
          </div>
          <div class="col-md-3">
            <label class="form-label">Marca</label>
            <select v-model="productStore.filters.brand" class="form-select">
              <option value="">Todas as marcas</option>
              <option v-for="brand in productStore.brands" :key="brand" :value="brand">
                {{ brand }}
              </option>
            </select>
          </div>
          <div class="col-md-2">
            <label class="form-label">Ordenar por</label>
            <select 
              v-model="productStore.sortOptions.field" 
              class="form-select"
              @change="updateSort"
            >
              <option value="name">Nome</option>
              <option value="price">Preço</option>
              <option value="category">Categoria</option>
              <option value="brand">Marca</option>
            </select>
          </div>
        </div>
        <div class="row mt-3">
          <div class="col-md-6">
            <label class="form-label">Faixa de Preço</label>
            <div class="d-flex gap-2 align-items-center">
              <input
                v-model.number="productStore.filters.minPrice"
                type="number"
                class="form-control"
                placeholder="Min"
                :max="productStore.priceRange.max"
                min="0"
                step="0.01"
              />
              <span>até</span>
              <input
                v-model.number="productStore.filters.maxPrice"
                type="number"
                class="form-control"
                placeholder="Max"
                :min="productStore.filters.minPrice || 0"
                :max="productStore.priceRange.max"
                step="0.01"
              />
            </div>
          </div>
          <div class="col-md-6 d-flex align-items-end gap-2">
            <button 
              class="btn btn-outline-secondary"
              @click="productStore.resetFilters()"
            >
              Limpar Filtros
            </button>
            <button 
              class="btn btn-outline-secondary"
              @click="toggleSortOrder"
            >
              <i :class="sortIcon"></i>
              {{ productStore.sortOptions.order === 'asc' ? 'Crescente' : 'Decrescente' }}
            </button>
          </div>
        </div>
      </div>
    </div>

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
            <option :value="50">50</option>
          </select>
        </div>
      </div>
      
      <div
        v-for="product in paginatedProducts"
        :key="product.id"
        class="col-sm-6 col-md-4 col-lg-3"
      >
        <div class="card h-100 product-card">
          <div class="position-relative">
            <img 
              :src="product.image" 
              class="card-img-top" 
              :alt="product.name"
              @error="handleImageError"
            />
            <div v-if="discountInfo(product).discountPercentage > 0" class="discount-badge">
              -{{ discountInfo(product).discountPercentage }}%
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
                <div v-if="discountInfo(product).discount > 0" class="original-price">
                  {{ formatPrice(discountInfo(product).originalPrice) }}
                </div>
                <div class="current-price">
                  {{ formatPrice(discountInfo(product).finalPrice) }}
                </div>
              </div>
              
              <div class="d-flex gap-2">
                <button 
                  class="btn btn-primary flex-fill"
                  @click="add(product)"
                  :disabled="cartStore.getItemQuantity(product.id) >= 10"
                >
                  <i class="bi bi-cart-plus"></i>
                  Adicionar
                </button>
                
                <div v-if="cartStore.getItemQuantity(product.id) > 0" class="quantity-badge">
                  {{ cartStore.getItemQuantity(product.id) }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Pagination -->
      <div v-if="totalPages > 1" class="col-12">
        <nav aria-label="Navegação de páginas" class="d-flex justify-content-center">
          <ul class="pagination">
            <li class="page-item" :class="{ disabled: currentPage === 1 }">
              <button 
                class="page-link" 
                @click="goToPage(currentPage - 1)"
                :disabled="currentPage === 1"
              >
                <i class="bi bi-chevron-left"></i>
              </button>
            </li>
            
            <li 
              v-for="page in visiblePages" 
              :key="page"
              class="page-item" 
              :class="{ active: page === currentPage }"
            >
              <button class="page-link" @click="goToPage(page)">
                {{ page }}
              </button>
            </li>
            
            <li class="page-item" :class="{ disabled: currentPage === totalPages }">
              <button 
                class="page-link" 
                @click="goToPage(currentPage + 1)"
                :disabled="currentPage === totalPages"
              >
                <i class="bi bi-chevron-right"></i>
              </button>
            </li>
          </ul>
        </nav>
        
        <div class="text-center mt-2">
          <small class="text-muted">
            Página {{ currentPage }} de {{ totalPages }}
          </small>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useProductStore } from '../../stores/product'
import { useCartStore } from '../../stores/cart'
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

const sortIcon = computed(() => {
  return productStore.sortOptions.order === 'asc' 
    ? 'bi bi-sort-alpha-down' 
    : 'bi bi-sort-alpha-up'
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

function add(product: Product) {
  cartStore.add(product)
  cartStore.show()
}

function discountInfo(product: Product) {
  return getPriceWithDiscount(product.price, authStore.user?.role ?? 'consumer')
}

function updateSort() {
  // Método será chamado quando o campo de ordenação mudar
}

function toggleSortOrder() {
  const newOrder = productStore.sortOptions.order === 'asc' ? 'desc' : 'asc'
  productStore.updateSort({ order: newOrder })
}

function goToPage(page: number) {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    // Scroll to top of products section
    document.querySelector('.row.g-3')?.scrollIntoView({ behavior: 'smooth' })
  }
}

function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

function handleImageError(event: Event) {
  const img = event.target as HTMLImageElement
  img.src = '/placeholder-product.svg'
}
</script>

<style scoped src="./styles.scss"></style>

<style scoped>
.product-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.product-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.card-img-top {
  height: 200px;
  object-fit: cover;
}

.discount-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  background: #dc3545;
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: bold;
}

.price-section {
  text-align: center;
}

.original-price {
  font-size: 0.9rem;
  color: #6c757d;
  text-decoration: line-through;
}

.current-price {
  font-size: 1.1rem;
  font-weight: bold;
  color: #198754;
}

.quantity-badge {
  background: #0d6efd;
  color: white;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: bold;
  flex-shrink: 0;
}

.form-control:focus,
.form-select:focus {
  border-color: #2e8b57;
  box-shadow: 0 0 0 0.2rem rgba(46, 139, 87, 0.25);
}

/* Pagination styles */
.pagination {
  margin-bottom: 0;
}

.page-link {
  color: #2e8b57;
  border-color: #dee2e6;
  transition: all 0.2s ease;
}

.page-link:hover {
  color: #1e5e3a;
  background-color: rgba(46, 139, 87, 0.1);
  border-color: #2e8b57;
}

.page-item.active .page-link {
  background-color: #2e8b57;
  border-color: #2e8b57;
  color: white;
}

.page-item.disabled .page-link {
  color: #6c757d;
  pointer-events: none;
  background-color: #fff;
  border-color: #dee2e6;
}

/* Items per page selector */
.form-select-sm {
  border-color: #2e8b57;
  color: #2e8b57;
}

.form-select-sm:focus {
  border-color: #2e8b57;
  box-shadow: 0 0 0 0.2rem rgba(46, 139, 87, 0.25);
}
</style>
