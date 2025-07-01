import { defineStore } from 'pinia'
import type { CartItem } from './cart'

export interface Order {
  id: number
  items: CartItem[]
  date: string
}

const STORAGE_KEY = 'orders'

export const useOrderStore = defineStore('order', {
  state: () => ({
    orders: [] as Order[],
  }),
  actions: {
    load() {
      const data = localStorage.getItem(STORAGE_KEY)
      if (data) {
        try {
          this.orders = JSON.parse(data)
        } catch {
          this.orders = []
        }
      }
    },
    persist() {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.orders))
    },
    addOrder(items: CartItem[]) {
      const id = this.orders.length > 0 ? this.orders[this.orders.length - 1].id + 1 : 1
      const order: Order = {
        id,
        items: JSON.parse(JSON.stringify(items)),
        date: new Date().toISOString(),
      }
      this.orders.push(order)
      this.persist()
    },
    getOrder(id: number) {
      return this.orders.find((o) => o.id === id)
    },
  },
})
