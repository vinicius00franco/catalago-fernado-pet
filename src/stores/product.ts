import { defineStore } from 'pinia'
import type { Product } from '@/types'

export const useProductStore = defineStore('product', {
  state: () => ({
    products: [] as Product[],
  }),
  actions: {
    set(products: Product[]) {
      this.products = products
    },
  },
})
