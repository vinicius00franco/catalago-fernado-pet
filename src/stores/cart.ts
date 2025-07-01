import { defineStore } from 'pinia'
import type { Product } from '../types'

export interface CartItem {
  product: Product
  quantity: number
}

const STORAGE_KEY = 'cart_items'
const STORAGE_FIXED_KEY = 'cart_fixed'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] as CartItem[],
    fixed: false,
    visible: false,
  }),

  getters: {
    totalItems: (state) => {
      return state.items.reduce((total, item) => total + item.quantity, 0)
    },

    totalPrice: (state) => {
      return state.items.reduce((total, item) => {
        return total + (item.product.price * item.quantity)
      }, 0)
    },

    isEmpty: (state) => {
      return state.items.length === 0
    },

    itemCount: (state) => {
      return state.items.length
    },

    getItemQuantity: (state) => (productId: number) => {
      const item = state.items.find(item => item.product.id === productId)
      return item ? item.quantity : 0
    }
  },

  actions: {
    add(product: Product, quantity: number = 1) {
      const existingItem = this.items.find(item => item.product.id === product.id)
      
      if (existingItem) {
        existingItem.quantity += quantity
      } else {
        this.items.push({ product, quantity })
      }
      
      this.persist()
    },

    updateQuantity(productId: number, quantity: number) {
      const item = this.items.find(item => item.product.id === productId)
      
      if (item) {
        if (quantity <= 0) {
          this.remove(productId)
        } else {
          item.quantity = quantity
          this.persist()
        }
      }
    },

    remove(productId: number) {
      this.items = this.items.filter(item => item.product.id !== productId)
      this.persist()
    },

    clear() {
      this.items = []
      this.persist()
    },

    load() {
      const items = localStorage.getItem(STORAGE_KEY)
      if (items) {
        try {
          this.items = JSON.parse(items)
        } catch (error) {
          console.warn('Erro ao carregar carrinho do localStorage:', error)
          localStorage.removeItem(STORAGE_KEY)
          this.items = []
        }
      }
      
      const fixed = localStorage.getItem(STORAGE_FIXED_KEY)
      if (fixed !== null) {
        try {
          this.fixed = JSON.parse(fixed)
        } catch (error) {
          console.warn('Erro ao carregar configuração do carrinho:', error)
          this.fixed = false
        }
      }
    },

    persist() {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.items))
      localStorage.setItem(STORAGE_FIXED_KEY, JSON.stringify(this.fixed))
    },

    toggleFixed() {
      this.fixed = !this.fixed
      this.persist()
    },

    toggleVisibility() {
      this.visible = !this.visible
    },

    show() {
      this.visible = true
    },

    hide() {
      this.visible = false
    }
  },
})
