export interface Product {
  id: number
  name: string
  slug: string
  price: number
  originalPrice?: number
  cost?: number
  margin?: number
  image?: string
  images?: string[]
  description?: string
  shortDescription?: string
  category?: string
  brand?: string
  stock?: number
  inStock?: boolean
  featured?: boolean
  active?: boolean
  weight?: number
  dimensions?: {
    width: number
    height: number
    depth: number
  }
  tags?: string[]
  seo?: {
    title: string
    description: string
    keywords: string[]
  }
  createdAt?: string
  updatedAt?: string
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
