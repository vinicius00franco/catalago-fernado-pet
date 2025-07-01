import type { VercelRequest, VercelResponse } from '@vercel/node'
import parquet from 'parquetjs-lite'
import fs from 'fs/promises'
import path from 'path'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const file = Array.isArray(req.query.file) ? req.query.file[0] : req.query.file
  if (!file) {
    res.status(400).json({ error: 'missing file' })
    return
  }
  const base = path.join(process.cwd(), 'public')
  const filePath = path.join(base, file)
  if (!filePath.startsWith(base + path.sep)) {
    res.status(400).json({ error: 'invalid path' })
    return
  }
  try {
    await fs.access(filePath)
  } catch {
    res.status(404).json({ error: 'file not found' })
    return
  }
  try {
    const reader = await parquet.ParquetReader.openFile(filePath)
    const cursor = reader.getCursor()
    const rows: any[] = []
    let row = await cursor.next()
    while (row) {
      rows.push(row)
      row = await cursor.next()
    }
    await reader.close()
    res.status(200).json(rows)
  } catch (err) {
    res.status(500).json({ error: 'failed to read parquet' })
  }
}
