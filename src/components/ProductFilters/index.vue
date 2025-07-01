<template>
  <div class="card mb-4">
    <div class="card-body">
      <div class="row g-3">
        <div class="col-md-4">
          <label class="form-label">Buscar</label>
          <input v-model="productStore.filters.search" type="text" class="form-control" placeholder="Nome, descrição, marca..." />
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
          <select v-model="productStore.sortOptions.field" class="form-select" @change="updateSort">
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
            <input v-model.number="productStore.filters.minPrice" type="number" class="form-control" placeholder="Min" :max="productStore.priceRange.max" min="0" step="0.01" />
            <span>até</span>
            <input v-model.number="productStore.filters.maxPrice" type="number" class="form-control" placeholder="Max" :min="productStore.filters.minPrice || 0" :max="productStore.priceRange.max" step="0.01" />
          </div>
        </div>
        <div class="col-md-6 d-flex align-items-end gap-2">
          <button class="btn btn-outline-secondary" @click="productStore.resetFilters()">
            Limpar Filtros
          </button>
          <button class="btn btn-outline-secondary" @click="toggleSortOrder">
            <i :class="sortIcon"></i>
            {{ productStore.sortOptions.order === 'asc' ? 'Crescente' : 'Decrescente' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useProductStore } from '@/stores/product'

const productStore = useProductStore()

function updateSort() {
  // placeholder for future actions
}

const sortIcon = computed(() =>
  productStore.sortOptions.order === 'asc' ? 'bi bi-sort-alpha-down' : 'bi bi-sort-alpha-up'
)

function toggleSortOrder() {
  const newOrder = productStore.sortOptions.order === 'asc' ? 'desc' : 'asc'
  productStore.updateSort({ order: newOrder })
}
</script>

<style scoped src="./styles.scss"></style>
