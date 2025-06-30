import parquet from 'parquetjs-lite'

export async function parquetToJson<T>(path: string): Promise<T[]> {
  const reader = await parquet.ParquetReader.openFile(path)
  const cursor = reader.getCursor()
  const rows: T[] = []
  let row = await cursor.next()
  while (row) {
    rows.push(row as T)
    row = await cursor.next()
  }
  await reader.close()
  return rows
}
