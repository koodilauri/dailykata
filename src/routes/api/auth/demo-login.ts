import { createFileRoute } from '@tanstack/react-router'
import { signCookieValue } from '#/lib/cookie'

export const Route = createFileRoute('/api/auth/demo-login')({
  server: {
    handlers: {
      POST: async () => {
        const secret = process.env.BETA_SECRET!
        const signed = await signCookieValue('demo', secret)
        return new Response(null, {
          status: 303,
          headers: {
            Location: '/demo',
            'Set-Cookie': `demo_access=${signed}; Path=/; HttpOnly; SameSite=Lax; Max-Age=86400`
          }
        })
      }
    }
  }
})
