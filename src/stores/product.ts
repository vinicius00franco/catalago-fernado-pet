import { defineStore } from 'pinia'
import type { Product } from '@/types'

const STORAGE_KEY = 'products'

export const useProductStore = defineStore('product', {
  state: () => ({
    products: [] as Product[],
  }),
  actions: {
    set(products: Product[]) {
      this.products = products
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ products, timestamp: Date.now() })
      )
    },
    load() {
      const data = localStorage.getItem(STORAGE_KEY)
      if (data) {
        try {
          const { products } = JSON.parse(data) as {
            products: Product[]
            timestamp: number
          }
          this.products = products
        } catch {
          // ignore parse errors
        }
      }
    },
  },
})
