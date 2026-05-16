export async function signCookieValue(value: string, secret: string): Promise<string> {
  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(value))
  return `${value}.${btoa(String.fromCharCode(...new Uint8Array(sig)))}`
}

export async function verifyCookieValue(
  value: string,
  expected: string,
  secret: string
): Promise<boolean> {
  const [payload] = value.split('.')
  if (payload !== expected) return false
  const valid = await signCookieValue(expected, secret)
  return value === valid
}

export function parseCookies(cookieHeader: string): Record<string, string> {
  const cookies: Record<string, string> = {}
  for (const part of cookieHeader.split(';')) {
    const [k, ...rest] = part.trim().split('=')
    if (k) cookies[k.trim()] = rest.join('=').trim()
  }
  return cookies
}
