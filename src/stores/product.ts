import { defineStore } from 'pinia'
import type { Product, ProductFilters, SortOptions } from '../types'

const STORAGE_KEY = 'products'
const CACHE_DURATION = 24 * 60 * 60 * 1000 // 24 horas

export const useProductStore = defineStore('product', {
  state: () => ({
    products: [] as Product[],
    loading: false,
    error: null as string | null,
    lastUpdated: 0,
    filters: {
      search: '',
      category: '',
      minPrice: 0,
      maxPrice: 0,
      brand: ''
    } as ProductFilters,
    sortOptions: {
      field: 'name',
      order: 'asc'
    } as SortOptions,
  }),

  getters: {
    filteredProducts: (state) => {
      let filtered = [...state.products]
      
      // Aplicar filtro de busca
      if (state.filters.search) {
        const search = state.filters.search.toLowerCase()
        filtered = filtered.filter(p => 
          p.name.toLowerCase().includes(search) ||
          p.description?.toLowerCase().includes(search) ||
          p.brand?.toLowerCase().includes(search)
        )
      }
      
      // Aplicar filtro de categoria
      if (state.filters.category) {
        filtered = filtered.filter(p => p.category === state.filters.category)
      }
      
      // Aplicar filtro de marca
      if (state.filters.brand) {
        filtered = filtered.filter(p => p.brand === state.filters.brand)
      }
      
      // Aplicar filtro de preço
      if (state.filters.minPrice && state.filters.minPrice > 0) {
        filtered = filtered.filter(p => p.price >= state.filters.minPrice!)
      }
      if (state.filters.maxPrice && state.filters.maxPrice > 0) {
        filtered = filtered.filter(p => p.price <= state.filters.maxPrice!)
      }
      
      // Aplicar ordenação
      filtered.sort((a, b) => {
        const field = state.sortOptions.field
        let aValue: any = a[field]
        let bValue: any = b[field]
        
        // Tratamento para valores undefined/null
        if (aValue == null) aValue = ''
        if (bValue == null) bValue = ''
        
        if (typeof aValue === 'string') {
          aValue = aValue.toLowerCase()
          bValue = bValue.toString().toLowerCase()
        }
        
        if (state.sortOptions.order === 'asc') {
          return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
        } else {
          return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
        }
      })
      
      return filtered
    },

    categories: (state) => {
      const categories = new Set(state.products.map(p => p.category).filter(Boolean))
      return Array.from(categories)
    },

    brands: (state) => {
      const brands = new Set(state.products.map(p => p.brand).filter(Boolean))
      return Array.from(brands)
    },

    priceRange: (state) => {
      if (state.products.length === 0) return { min: 0, max: 0 }
      const prices = state.products.map(p => p.price)
      return {
        min: Math.min(...prices),
        max: Math.max(...prices)
      }
    },

    isDataStale: (state) => {
      return Date.now() - state.lastUpdated > CACHE_DURATION
    }
  },

  actions: {
    set(products: Product[]) {
      this.products = products
      this.lastUpdated = Date.now()
      this.error = null
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ 
          products, 
          timestamp: this.lastUpdated 
        })
      )
    },

    load() {
      const data = localStorage.getItem(STORAGE_KEY)
      if (data) {
        try {
          const { products, timestamp } = JSON.parse(data) as {
            products: Product[]
            timestamp: number
          }
          this.products = products
          this.lastUpdated = timestamp
        } catch (error) {
          console.warn('Erro ao carregar produtos do localStorage:', error)
          localStorage.removeItem(STORAGE_KEY)
        }
      }
    },

    setLoading(loading: boolean) {
      this.loading = loading
    },

    setError(error: string | null) {
      this.error = error
    },

    updateFilters(filters: Partial<ProductFilters>) {
      this.filters = { ...this.filters, ...filters }
    },

    resetFilters() {
      this.filters = {
        search: '',
        category: '',
        minPrice: 0,
        maxPrice: 0,
        brand: ''
      }
    },

    updateSort(options: Partial<SortOptions>) {
      this.sortOptions = { ...this.sortOptions, ...options }
    },

    getProductById(id: number) {
      return this.products.find(p => p.id === id)
    },

    clearCache() {
      localStorage.removeItem(STORAGE_KEY)
      this.products = []
      this.lastUpdated = 0
    }
  },
})
