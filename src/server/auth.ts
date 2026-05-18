import { createAuth } from '#/lib/auth'
import { parseCookies, verifyCookieValue } from '#/lib/cookie'
import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'

export const getSession = createServerFn({ method: 'GET' }).handler(async () => {
  const request = getRequest()
  const session = await createAuth().api.getSession({ headers: request.headers })
  return session
})

export const getIsDemo = createServerFn({ method: 'GET' }).handler(async () => {
  const request = getRequest()
  const cookies = parseCookies(request.headers.get('Cookie') ?? '')
  const secret = process.env.BETA_SECRET ?? ''
  if (!secret || !cookies['demo_access']) return false
  return verifyCookieValue(cookies['demo_access'], 'demo', secret)
})
