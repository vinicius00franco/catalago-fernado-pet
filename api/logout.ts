import type { VercelRequest, VercelResponse } from '@vercel/node'
import cookie from 'cookie'

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed')
    return
  }
  res.setHeader(
    'Set-Cookie',
    cookie.serialize('token', '', {
      httpOnly: true,
      path: '/',
      maxAge: 0,
    })
  )
  res.status(204).end()
}
