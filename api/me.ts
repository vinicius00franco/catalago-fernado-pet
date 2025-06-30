import type { VercelRequest, VercelResponse } from '@vercel/node'
import jwt from 'jsonwebtoken'
import cookie from 'cookie'

const JWT_SECRET = process.env.JWT_SECRET || 'secret'

export default function handler(req: VercelRequest, res: VercelResponse) {
  const { token } = cookie.parse(req.headers.cookie || '')
  if (!token) {
    res.status(401).end()
    return
  }
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { id: number; name: string; role: string }
    res.status(200).json({ user: { id: payload.id, name: payload.name, role: payload.role } })
  } catch {
    res.status(401).end()
  }
}
