import { defineStore } from 'pinia'
import type { Product } from '@/types'

export interface CartItem {
  product: Product
  quantity: number
}

const STORAGE_KEY = 'cart'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] as CartItem[],
  }),
  actions: {
    add(product: Product) {
      const item = this.items.find((i) => i.product.id === product.id)
      if (item) item.quantity += 1
      else this.items.push({ product, quantity: 1 })
      this.persist()
    },
    remove(id: number) {
      this.items = this.items.filter((i) => i.product.id !== id)
      this.persist()
    },
    load() {
      const data = localStorage.getItem(STORAGE_KEY)
      if (!data) return
      try {
        this.items = JSON.parse(data)
      } catch {
        localStorage.removeItem(STORAGE_KEY)
        this.items = []
      }
    },
    persist() {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.items))
    },
  },
})
