import { defineStore } from 'pinia'
import type { User } from '../types'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    expires: 0,
    loading: false,
    error: null as string | null,
  }),

  getters: {
    isAuthenticated: (state) => {
      return !!state.user && Date.now() < state.expires
    },

    isAdmin: (state) => {
      return state.user?.role === 'admin'
    },

    isShop: (state) => {
      return state.user?.role === 'shop'
    },

    isDistributor: (state) => {
      return state.user?.role === 'distributor'
    },

    isConsumer: (state) => {
      return state.user?.role === 'consumer'
    },

    hasRole: (state) => (role: string) => {
      return state.user?.role === role
    }
  },

  actions: {
    async login(name: string, password: string) {
      this.loading = true
      this.error = null
      
      try {
        const res = await fetch('/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, password }),
        })
        
        if (!res.ok) {
          const errorData = await res.json()
          throw new Error(errorData.error || 'Invalid credentials')
        }
        
        const data = await res.json()
        this.user = data.user
        this.expires = Date.now() + 24 * 60 * 60 * 1000 // 24 horas
        
        return data.user
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Login failed'
        throw error
      } finally {
        this.loading = false
      }
    },

    async load() {
      this.loading = true
      
      try {
        const res = await fetch('/api/me')
        if (!res.ok) {
          if (res.status === 401) {
            // Token expirado ou inválido
            this.user = null
            this.expires = 0
          }
          return
        }
        
        const data = await res.json()
        this.user = data.user
        this.expires = Date.now() + 24 * 60 * 60 * 1000
      } catch (error) {
        console.warn('Erro ao carregar dados do usuário:', error)
        // Não definir erro aqui para não mostrar para o usuário
      } finally {
        this.loading = false
      }
    },

    async logout() {
      this.loading = true
      
      try {
        await fetch('/api/logout', { method: 'POST' })
      } catch (error) {
        console.warn('Erro ao fazer logout:', error)
      } finally {
        this.user = null
        this.expires = 0
        this.error = null
        this.loading = false
      }
    },

    clearError() {
      this.error = null
    },

    checkTokenExpiration() {
      if (this.user && Date.now() >= this.expires) {
        this.user = null
        this.expires = 0
        return false
      }
      return true
    }
  },
})
