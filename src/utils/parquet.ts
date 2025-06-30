export async function parquetToJson<T>(path: string): Promise<T[]> {
  const res = await fetch(`/api/loadParquet?file=${encodeURIComponent(path.replace(/^\/+/, ''))}`)
  if (!res.ok) throw new Error('Failed to load parquet')
  return res.json()
}
