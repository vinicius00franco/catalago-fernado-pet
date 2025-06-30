import type { VercelRequest, VercelResponse } from '@vercel/node'
import jwt from 'jsonwebtoken'
import cookie from 'cookie'

interface User {
  id: number
  name: string
  password: string
  role: 'consumer' | 'shop' | 'distributor' | 'admin'
}

const users: User[] = [
  { id: 1, name: 'admin', password: 'admin', role: 'admin' },
  { id: 2, name: 'user', password: 'user', role: 'consumer' },
]

const JWT_SECRET = process.env.JWT_SECRET || 'secret'

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed')
    return
  }
  const { name, password } = req.body || {}
  const user = users.find((u) => u.name === name && u.password === password)
  if (!user) {
    res.status(401).json({ error: 'Invalid credentials' })
    return
  }
  const token = jwt.sign({ id: user.id, name: user.name, role: user.role }, JWT_SECRET, { expiresIn: '1d' })
  res.setHeader(
    'Set-Cookie',
    cookie.serialize('token', token, {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    })
  )
  res.status(200).json({ user: { id: user.id, name: user.name, role: user.role } })
}
