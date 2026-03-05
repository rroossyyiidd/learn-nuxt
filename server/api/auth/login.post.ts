const ADMIN_USER = {
  username: 'admin',
  password: 'admin123',
  name: 'Administrator',
  email: 'admin@cdrental.com',
  role: 'admin',
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const result = loginSchema.safeParse(body)

  if (!result.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Validation Error',
      data: result.error.flatten(),
    })
  }

  const { username, password } = result.data

  if (username !== ADMIN_USER.username || password !== ADMIN_USER.password) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid username or password',
    })
  }

  // Set auth cookie
  const token = Buffer.from(`${username}:${Date.now()}`).toString('base64')
  setCookie(event, 'auth_token', token, {
    httpOnly: true,
    maxAge: 60 * 60 * 24, // 1 day
    path: '/',
    sameSite: 'lax',
  })

  return {
    user: {
      name: ADMIN_USER.name,
      email: ADMIN_USER.email,
      role: ADMIN_USER.role,
    },
    token,
  }
})
