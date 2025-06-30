import { defineStore } from 'pinia'

export interface User {
  id: number
  name: string
  role: 'consumer' | 'shop' | 'distributor' | 'admin'
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    expires: 0,
  }),
  actions: {
    async login(name: string, password: string) {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, password }),
      })
      if (!res.ok) throw new Error('Invalid credentials')
      const data = await res.json()
      this.user = data.user
      this.expires = Date.now() + 24 * 60 * 60 * 1000
    },
    async load() {
      try {
        const res = await fetch('/api/me')
        if (!res.ok) return
        const data = await res.json()
        this.user = data.user
      } catch {
        // ignore network errors
      }
    },
    async logout() {
      await fetch('/api/logout', { method: 'POST' })
      this.user = null
      this.expires = 0
    },
  },
})
