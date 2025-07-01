import { defineStore } from 'pinia'

const STORAGE_KEY = 'theme_preference'

export const useThemeStore = defineStore('theme', {
  state: () => ({
    current: 'light' as 'light' | 'dark',
  }),

  getters: {
    isDark: (state) => state.current === 'dark',
    isLight: (state) => state.current === 'light',
  },

  actions: {
    toggle() {
      this.current = this.current === 'light' ? 'dark' : 'light'
      this.persist()
    },

    setTheme(theme: 'light' | 'dark') {
      this.current = theme
      this.persist()
    },

    loadFromStorage() {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored && (stored === 'light' || stored === 'dark')) {
        this.current = stored
      } else {
        // Detectar preferência do sistema
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        this.current = prefersDark ? 'dark' : 'light'
        this.persist()
      }
    },

    persist() {
      localStorage.setItem(STORAGE_KEY, this.current)
    },

    initializeTheme() {
      this.loadFromStorage()
      
      // Escutar mudanças na preferência do sistema
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        // Só atualizar se não houver preferência salva
        const stored = localStorage.getItem(STORAGE_KEY)
        if (!stored) {
          this.current = e.matches ? 'dark' : 'light'
        }
      })
    }
  },
})
