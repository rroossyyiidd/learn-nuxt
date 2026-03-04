export default defineEventHandler((event) => {
  const body = getQuery(event) as { name?: string; email?: string }

  const name = body.name || 'OAuth User'
  const email = body.email || ''

  // Set the same auth_token cookie used by the manual login flow
  const token = Buffer.from(`oauth:${email}:${Date.now()}`).toString('base64')
  setCookie(event, 'auth_token', token, {
    httpOnly: true,
    maxAge: 60 * 60 * 24, // 1 day
    path: '/',
    sameSite: 'lax',
  })

  // Also store OAuth user info in a separate cookie for /api/auth/me
  setCookie(event, 'oauth_user', JSON.stringify({ name, email, role: 'admin' }), {
    httpOnly: true,
    maxAge: 60 * 60 * 24,
    path: '/',
    sameSite: 'lax',
  })

  return { ok: true }
})
