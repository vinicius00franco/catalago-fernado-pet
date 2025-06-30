import type { VercelRequest, VercelResponse } from '@vercel/node'
import parquet from 'parquetjs-lite'
import path from 'path'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const file = req.query.file as string | undefined
  if (!file) {
    res.status(400).json({ error: 'missing file' })
    return
  }
  const filePath = path.join(process.cwd(), 'public', file)
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
