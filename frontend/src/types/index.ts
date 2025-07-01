export interface Product {
  id: number
  name: string
  price: number
  image?: string
  description?: string
  category?: string
  stock?: number
  brand?: string
  weight?: number
  dimensions?: string
}

export interface User {
  id: number
  name: string
  email?: string
  role: 'consumer' | 'shop' | 'distributor' | 'admin'
  createdAt?: string
  lastLogin?: string
}

export interface ApiResponse<T> {
  data: T
  message?: string
  error?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
}

// Tipos para filtros de produtos
export interface ProductFilters {
  category?: string
  minPrice?: number
  maxPrice?: number
  brand?: string
  search?: string
}

// Tipos para ordenação
export type SortOrder = 'asc' | 'desc'
export type SortField = 'name' | 'price' | 'category' | 'brand'

export interface SortOptions {
  field: SortField
  order: SortOrder
}
