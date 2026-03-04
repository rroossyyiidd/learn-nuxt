export default defineEventHandler((event) => {
  deleteCookie(event, 'auth_token', {
    path: '/',
  })
  deleteCookie(event, 'oauth_user', {
    path: '/',
  })

  return { success: true }
})
