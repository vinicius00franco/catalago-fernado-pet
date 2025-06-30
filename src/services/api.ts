import Papa from 'papaparse'
import type { Product } from '@/types'
import { useProductStore } from '@/stores/product'

async function parseCSV(file: File | string): Promise<Product[]> {
  return new Promise((resolve) => {
    Papa.parse<Product>(file as any, {
      header: true,
      complete: (results) => resolve(results.data as Product[]),
    })
  })
}

async function parseJSON(path: string): Promise<Product[]> {
  const res = await fetch(path)
  return res.json()
}

async function parseParquet(path: string): Promise<Product[]> {
  const res = await fetch(`/api/loadParquet?file=${encodeURIComponent(path.replace(/^\/+/, ''))}`)
  if (!res.ok) throw new Error('Failed to load parquet')
  return res.json()
}

export async function loadProducts(file: File | string): Promise<void> {
  const store = useProductStore()
  store.load()
  if (store.products.length > 0) return

  const name = typeof file === 'string' ? file : file.name
  const ext = name.split('.').pop()
  let data: Product[] = []
  if (ext === 'csv') data = await parseCSV(file)
  else if (ext === 'parquet') data = await parseParquet(name)
  else data = await parseJSON(name)
  store.set(data)
}
