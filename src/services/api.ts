import Papa from 'papaparse'
import type { Product } from '../types'
import { useProductStore } from '../stores/product'

interface LoadProductsOptions {
  forceRefresh?: boolean
  onProgress?: (progress: number) => void
}

async function parseCSV(file: File | string): Promise<Product[]> {
  return new Promise((resolve, reject) => {
    Papa.parse<any>(file as any, {
      header: true,

      download: typeof file === 'string',
      skipEmptyLines: true,
      complete: (results) => resolve(results.data as Product[]),
    })
  })
}

async function parseJSON(path: string): Promise<Product[]> {
  const res = await fetch(path)
  
  if (!res.ok) {
    throw new Error(`Erro ao carregar ${path}: ${res.status} ${res.statusText}`)
  }
  
  const data = await res.json()
  
  // Validar se é um array de produtos
  if (!Array.isArray(data)) {
    throw new Error('Formato de dados inválido: esperado array de produtos')
  }
  
  return data.map((item: any, index: number) => ({
    id: item.id || index + 1,
    name: item.name || `Produto ${index + 1}`,
    price: typeof item.price === 'number' ? item.price : 0,
    image: item.image || '/placeholder-product.jpg',
    description: item.description || '',
    category: item.category || 'Geral',
    brand: item.brand || '',
    stock: typeof item.stock === 'number' ? item.stock : 0,
    weight: typeof item.weight === 'number' ? item.weight : 0,
    dimensions: item.dimensions || ''
  })) as Product[]
}

async function parseParquet(path: string): Promise<Product[]> {
  const res = await fetch(`/api/loadParquet?file=${encodeURIComponent(path.replace(/^\/+/, ''))}`)
  
  if (!res.ok) {
    throw new Error(`Erro ao carregar arquivo Parquet: ${res.status} ${res.statusText}`)
  }
  
  const data = await res.json()
  
  if (!Array.isArray(data)) {
    throw new Error('Formato de dados Parquet inválido')
  }
  
  return data as Product[]
}

export async function loadProducts(
  file: File | string, 
  options: LoadProductsOptions = {}
): Promise<void> {
  const store = useProductStore()
  const { forceRefresh = false, onProgress } = options
  
  // Verificar se já temos dados e se não é refresh forçado
  if (!forceRefresh) {
    store.load()
    if (store.products.length > 0 && !store.isDataStale) {
      return
    }
  }

  store.setLoading(true)
  store.setError(null)
  
  try {
    onProgress?.(0)
    
    const name = typeof file === 'string' ? file : file.name
    const ext = name.split('.').pop()?.toLowerCase()
    
    let data: Product[] = []
    
    onProgress?.(30)
    
    switch (ext) {
      case 'csv':
        data = await parseCSV(file)
        break
      case 'parquet':
        data = await parseParquet(name)
        break
      case 'json':
      default:
        data = await parseJSON(name)
        break
    }
    
    onProgress?.(80)
    
    if (data.length === 0) {
      throw new Error('Nenhum produto encontrado no arquivo')
    }
    
    store.set(data)
    onProgress?.(100)
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido ao carregar produtos'
    store.setError(errorMessage)
    throw error
  } finally {
    store.setLoading(false)
  }
}

export async function searchProducts(query: string): Promise<Product[]> {
  const store = useProductStore()
  
  if (!query.trim()) {
    return store.products
  }
  
  const searchTerms = query.toLowerCase().split(' ')
  
  return store.products.filter(product => {
    const searchText = `${product.name} ${product.description} ${product.category} ${product.brand}`.toLowerCase()
    return searchTerms.every(term => searchText.includes(term))
  })
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(price)
}

export function formatWeight(weight: number): string {
  if (weight < 1) {
    return `${Math.round(weight * 1000)}g`
  }
  return `${weight.toFixed(1)}kg`
}

// API integration with Flask backend
import axios from 'axios'

const backend = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  withCredentials: true,
})

export async function apiListProducts(params: Record<string, string> = {}) {
  const res = await backend.get('/products', { params })
  return res.data as Product[]
}

export async function apiCreateProduct(data: Partial<Product>) {
  const res = await backend.post('/products', data)
  return res.data as Product
}
