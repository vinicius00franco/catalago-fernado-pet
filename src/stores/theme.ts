import { defineStore } from 'pinia'

export const useThemeStore = defineStore('theme', {
  state: () => ({
    current: 'light',
  }),
  actions: {
    toggle() {
      this.current = this.current === 'light' ? 'dark' : 'light'
    },
  },
})
