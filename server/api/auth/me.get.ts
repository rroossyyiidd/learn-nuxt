export default defineEventHandler((event) => {
  const token = getCookie(event, 'auth_token')

  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    })
  }

  // Check if this is an OAuth session
  const oauthUserCookie = getCookie(event, 'oauth_user')
  if (oauthUserCookie) {
    try {
      const oauthUser = JSON.parse(oauthUserCookie)
      return {
        user: {
          name: oauthUser.name || 'OAuth User',
          email: oauthUser.email || '',
          role: oauthUser.role || 'admin',
        },
      }
    }
    catch {
      // Fall through to default admin user
    }
  }

  return {
    user: {
      name: 'Administrator',
      email: 'admin@cdrental.com',
      role: 'admin',
    },
  }
})
