import { defineStore } from 'pinia'

export interface User {
  id: number
  name: string
  role: 'consumer' | 'shop' | 'distributor' | 'admin'
}

const STORAGE_KEY = 'auth'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    token: '',
    expires: 0,
  }),
  actions: {
    login(user: User, token: string) {
      this.user = user
      this.token = token
      this.expires = Date.now() + 24 * 60 * 60 * 1000
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ user: this.user, token: this.token, expires: this.expires })
      )
    },
    load() {
      const data = localStorage.getItem(STORAGE_KEY)
      if (!data) return
      const { user, token, expires } = JSON.parse(data) as {
        user: User
        token: string
        expires: number
      }
      if (expires > Date.now()) {
        this.user = user
        this.token = token
        this.expires = expires
      } else {
        localStorage.removeItem(STORAGE_KEY)
      }
    },
    logout() {
      this.user = null
      this.token = ''
      this.expires = 0
      localStorage.removeItem(STORAGE_KEY)
    },
  },
})
