export interface AppConfig {
  api: {
    baseUrl: string
    timeout: number
  }
  cache: {
    defaultTTL: number
    maxAge: number
  }
  features: {
    enableAnalytics: boolean
    enablePWA: boolean
    enableOfflineMode: boolean
  }
}

const development: AppConfig = {
  api: {
    baseUrl: 'http://localhost:3000',
    timeout: 10000
  },
  cache: {
    defaultTTL: 5 * 60 * 1000, // 5 minutos
    maxAge: 24 * 60 * 60 * 1000 // 24 horas
  },
  features: {
    enableAnalytics: false,
    enablePWA: false,
    enableOfflineMode: true
  }
}

const production: AppConfig = {
  api: {
    baseUrl: '',
    timeout: 15000
  },
  cache: {
    defaultTTL: 30 * 60 * 1000, // 30 minutos
    maxAge: 24 * 60 * 60 * 1000 // 24 horas
  },
  features: {
    enableAnalytics: true,
    enablePWA: true,
    enableOfflineMode: true
  }
}

export const config: AppConfig = process.env.NODE_ENV === 'production' ? production : development

export const isDevelopment = process.env.NODE_ENV === 'development'
export const isProduction = process.env.NODE_ENV === 'production'

// Constantes da aplicação
export const APP_NAME = 'Catálogo Pet'
export const APP_VERSION = '1.0.0'
export const APP_DESCRIPTION = 'Catálogo de produtos para pet shop'

// Limites e configurações
export const LIMITS = {
  MAX_CART_ITEMS: 100,
  MAX_ITEM_QUANTITY: 10,
  MIN_PASSWORD_LENGTH: 6,
  MAX_PRODUCT_NAME_LENGTH: 100,
  MAX_DESCRIPTION_LENGTH: 500
}

// Chaves do localStorage
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  CART_ITEMS: 'cart_items',
  CART_FIXED: 'cart_fixed',
  THEME_PREFERENCE: 'theme_preference',
  PRODUCTS_CACHE: 'products_cache',
  ORDERS_CACHE: 'orders_cache'
}

// URLs da API
export const API_ENDPOINTS = {
  LOGIN: '/api/login',
  LOGOUT: '/api/logout',
  ME: '/api/me',
  LOAD_PARQUET: '/api/loadParquet'
}
