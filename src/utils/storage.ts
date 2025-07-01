interface StorageItem<T> {
  data: T
  timestamp: number
  expiry?: number
}

export class LocalStorageManager {
  private static instance: LocalStorageManager
  
  private constructor() {}
  
  static getInstance(): LocalStorageManager {
    if (!LocalStorageManager.instance) {
      LocalStorageManager.instance = new LocalStorageManager()
    }
    return LocalStorageManager.instance
  }
  
  setItem<T>(key: string, data: T, expiryMinutes?: number): boolean {
    try {
      const item: StorageItem<T> = {
        data,
        timestamp: Date.now(),
        expiry: expiryMinutes ? Date.now() + (expiryMinutes * 60 * 1000) : undefined
      }
      
      localStorage.setItem(key, JSON.stringify(item))
      return true
    } catch (error) {
      console.warn(`Erro ao salvar no localStorage (${key}):`, error)
      return false
    }
  }
  
  getItem<T>(key: string): T | null {
    try {
      const itemStr = localStorage.getItem(key)
      if (!itemStr) return null
      
      const item: StorageItem<T> = JSON.parse(itemStr)
      
      // Verificar se expirou
      if (item.expiry && Date.now() > item.expiry) {
        this.removeItem(key)
        return null
      }
      
      return item.data
    } catch (error) {
      console.warn(`Erro ao ler do localStorage (${key}):`, error)
      this.removeItem(key) // Remove dados corrompidos
      return null
    }
  }
  
  removeItem(key: string): void {
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.warn(`Erro ao remover do localStorage (${key}):`, error)
    }
  }
  
  clear(): void {
    try {
      localStorage.clear()
    } catch (error) {
      console.warn('Erro ao limpar localStorage:', error)
    }
  }
  
  isExpired(key: string): boolean {
    try {
      const itemStr = localStorage.getItem(key)
      if (!itemStr) return true
      
      const item: StorageItem<any> = JSON.parse(itemStr)
      return item.expiry ? Date.now() > item.expiry : false
    } catch {
      return true
    }
  }
  
  getStorageSize(): number {
    let total = 0
    for (const key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        total += localStorage[key].length + key.length
      }
    }
    return total
  }
  
  cleanExpired(): void {
    const keys = Object.keys(localStorage)
    keys.forEach(key => {
      if (this.isExpired(key)) {
        this.removeItem(key)
      }
    })
  }
}

// Instância singleton
export const storage = LocalStorageManager.getInstance()

// Funções de conveniência
export function setStorageItem<T>(key: string, data: T, expiryMinutes?: number): boolean {
  return storage.setItem(key, data, expiryMinutes)
}

export function getStorageItem<T>(key: string): T | null {
  return storage.getItem<T>(key)
}

export function removeStorageItem(key: string): void {
  storage.removeItem(key)
}

export function clearStorage(): void {
  storage.clear()
}

// Executar limpeza de dados expirados na inicialização
if (typeof window !== 'undefined') {
  // Limpar dados expirados ao carregar a página
  storage.cleanExpired()
  
  // Limpar dados expirados periodicamente (a cada hora)
  setInterval(() => {
    storage.cleanExpired()
  }, 60 * 60 * 1000)
}
